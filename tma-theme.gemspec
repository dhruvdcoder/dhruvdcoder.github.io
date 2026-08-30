Gem::Specification.new do |spec|
  spec.name          = "tma-theme"
  spec.version       = "0.1.0"
  spec.authors       = ["Dhruvesh Patel"]
  spec.email         = ["dhruveshpate@umass.edu"]

  spec.summary       = "Jekyll theme for dhruveshp.com (The Middle Author)."
  spec.homepage      = "https://github.com/dhruvdcoder/dhruvdcoder.github.io"
  spec.license       = "MIT"

  spec.metadata["plugin_type"] = "theme"

  spec.files = Dir["assets/**/*", "_layouts/**/*", "_includes/**/*", "_sass/**/*",
                   "LICENSE*", "README*"].select { |f| File.file?(f) }

  spec.platform = Gem::Platform::RUBY

  spec.add_runtime_dependency "jekyll", ">= 3.9", "< 5.0"
  spec.add_runtime_dependency "jekyll-feed", "~> 0.12"
  spec.add_runtime_dependency "jekyll-seo-tag", "~> 2.8"
  spec.add_runtime_dependency "jekyll-sitemap", "~> 1.4"
  spec.add_runtime_dependency "jekyll-redirect-from", "~> 0.16"

  spec.add_development_dependency "bundler", ">= 2.0"
end
