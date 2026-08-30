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
    SECTION_KEYS = %w[research_code tools].freeze

    def generate(site)
      software = site.data['software']
      return if software.nil?

      cache_path = File.join(site.source, '.jekyll-cache', 'github-repos.json')
      cache = load_cache(cache_path)
      force_refresh = ENV['JEKYLL_ENV'] == 'production'
      token = ENV['GITHUB_TOKEN'] || ENV['JEKYLL_GITHUB_TOKEN']
      fetched = {}

      each_item(software) do |item|
        repo_id = repo_id_for(item)
        next unless repo_id

        cached = cache[repo_id]
        fetched[repo_id] = if !force_refresh && fresh?(cache_path) && cached
                             cached
                           else
                             fetch_repo(repo_id, token) || cached || {}
                           end
        enrich_item(item, fetched[repo_id])
      end

      write_cache(cache_path, fetched)
      site.data['github_repos'] = fetched
    end

    private

    def each_item(software)
      SECTION_KEYS.each do |key|
        Array(software[key]).each { |item| yield item if item.is_a?(Hash) }
      end
    end

    def repo_id_for(item)
      name = item['name'].to_s
      return name if name.include?('/')

      url = item['url'].to_s
      return unless url =~ %r{github\.com/([^/]+/[^/]+)}

      Regexp.last_match(1).sub(/\.git\z/, '')
    end

    def enrich_item(item, meta)
      return if meta.nil? || meta.empty?

      item['stars'] = meta['stars'] unless meta['stars'].nil?
      if item['description'].to_s.strip.empty? && meta['description']
        item['description'] = meta['description']
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
