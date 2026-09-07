# Mirror front-matter `updated` onto `last_modified_at` so jekyll-seo-tag
# and jekyll-feed can emit a modified time without a second field.
# Runs at :post_read so the copy exists before generators (the Atom feed).

Jekyll::Hooks.register :site, :post_read do |site|
  site.posts.docs.each do |post|
    updated = post.data["updated"]
    next unless updated
    post.data["last_modified_at"] ||= updated
  end
end
