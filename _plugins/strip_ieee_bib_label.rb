# IEEE CSL prefixes each bibliography entry with [n].
# When the list itself is an <ol>, strip that label so we don't get "1. [1]…".
module Jekyll
  module StripIeeeBibLabel
    def strip_ieee_bib_label(input)
      input.to_s.sub(/(<span\b[^>]*>)\[\d+\]\s*/, '\1')
    end
  end
end

Liquid::Template.register_filter(Jekyll::StripIeeeBibLabel)
