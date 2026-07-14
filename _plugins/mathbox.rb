# Styled boxes for definitions, theorems, and related math environments in Distill posts.

module Jekyll
  module Tags
    class MathEnvironmentTag < Liquid::Block
      ENVIRONMENTS = {
        'definition' => 'Definition',
        'theorem' => 'Theorem',
        'proposition' => 'Proposition',
        'lemma' => 'Lemma',
        'corollary' => 'Corollary',
        'remark' => 'Remark',
        'example' => 'Example',
        'proof' => 'Proof'
      }.freeze

      def initialize(tag_name, markup, tokens)
        super
        @env = tag_name
        @title = markup.strip
      end

      def render(context)
        site = context.registers[:site]
        converter = site.find_converter_instance(::Jekyll::Converters::Markdown)
        title = if @title.empty?
                  ''
                else
                  converter.convert(@title).gsub(/<\/?p[^>]*>/, '').chomp
                end
        body = converter.convert(super(context))
        label = header_label(title)
        qed = @env == 'proof' ? '<span class="mathbox-qed" aria-hidden="true">&#8718;</span>' : ''
        <<~HTML
          <div class="mathbox mathbox-#{@env}">
            <div class="mathbox-header"><span class="mathbox-label">#{label}</span></div>
            <div class="mathbox-body">#{body}#{qed}</div>
          </div>
        HTML
      end

      private

      def header_label(title)
        base = ENVIRONMENTS[@env]
        if @env == 'proof'
          title.empty? ? 'Proof.' : "Proof (#{title})."
        elsif title.empty?
          base
        else
          "#{base} (#{title})"
        end
      end
    end
  end

  Tags::MathEnvironmentTag::ENVIRONMENTS.each_key do |tag|
    Liquid::Template.register_tag(tag, Jekyll::Tags::MathEnvironmentTag)
  end
end
