require 'fileutils'
require 'httparty'
require 'jekyll'
require 'json'

module GitHubRepos
  class Generator < Jekyll::Generator
    safe true
    priority :high

    API_ROOT = 'https://api.github.com/repos'.freeze
    CACHE_TTL = 6 * 60 * 60

    def generate(site)
      sections = site.data.dig('software', 'sections')
      return if sections.nil?

      cache_path = File.join(site.source, '.jekyll-cache', 'github-repos.json')
      cache = load_cache(cache_path)
      force_refresh = ENV['JEKYLL_ENV'] == 'production'
      token = ENV['GITHUB_TOKEN'] || ENV['JEKYLL_GITHUB_TOKEN']
      fetched = {}

      each_repo_id(sections) do |repo_id|
        cached = cache[repo_id]
        if !force_refresh && fresh?(cache_path) && cached
          fetched[repo_id] = cached
        else
          fetched[repo_id] = fetch_repo(repo_id, token) || cached || {}
        end
      end

      write_cache(cache_path, fetched)
      enrich_software_data(sections, fetched)
      site.data['github_repos'] = fetched
    end

    private

    def each_repo_id(sections)
      sections.each do |section|
        Array(section['repos']).each do |entry|
          repo_id = entry.is_a?(Hash) ? entry['repo'] : entry
          yield repo_id if repo_id && repo_id.include?('/')
        end
      end
    end

    def enrich_software_data(sections, fetched)
      sections.each do |section|
        section['repos'] = Array(section['repos']).map do |entry|
          repo_id = entry.is_a?(Hash) ? entry['repo'] : entry
          override = entry.is_a?(Hash) ? entry['description'] : nil
          meta = fetched[repo_id] || {}
          {
            'repo' => repo_id,
            'description' => override || meta['description'],
            'stars' => meta['stars']
          }
        end
      end
    end

    def fetch_repo(repo_id, token)
      headers = {
        'Accept' => 'application/vnd.github+json',
        'User-Agent' => 'dhruveshp-com-software-page'
      }
      headers['Authorization'] = "Bearer #{token}" if token && !token.empty?

      response = HTTParty.get("#{API_ROOT}/#{repo_id}", headers: headers, timeout: 10)
      unless response.code == 200
        Jekyll.logger.warn 'GitHubRepos:', "Could not fetch #{repo_id} (HTTP #{response.code})"
        return nil
      end

      {
        'description' => response['description'],
        'stars' => response['stargazers_count']
      }
    rescue StandardError => e
      Jekyll.logger.warn 'GitHubRepos:', "Could not fetch #{repo_id} (#{e.class}: #{e.message})"
      nil
    end

    def fresh?(path)
      File.exist?(path) && (Time.now - File.mtime(path)) < CACHE_TTL
    end

    def load_cache(path)
      return {} unless File.exist?(path)

      JSON.parse(File.read(path))
    rescue JSON::ParserError
      {}
    end

    def write_cache(path, data)
      FileUtils.mkdir_p(File.dirname(path))
      File.write(path, JSON.pretty_generate(data))
    end
  end
end
