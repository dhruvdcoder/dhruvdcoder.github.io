# Broadsheet Jekyll Theme

A print-inspired Jekyll theme ported from the "Broadsheet" Claude Design
system and the personal academic homepage design (About / Publications /
Mentorship / Software / Blog / Article / Tag Archive). Near-black serif
type on a paper-white ground, cyan/magenta process-print accents, no
boxes/dividers except `.card`, and a couple of small decorative effects
(pixel-flicker background, pulsing pixel-grid section icons, scramble-reveal
headings, a click-to-zoom image lightbox).

> **Provenance note:** every page was fetched from the live Claude Design
> project via `DesignSync` and transcribed — `About.dc.html`,
> `Article.dc.html`, `Blog Home.dc.html`, `Mentorship.dc.html`,
> `Publications.dc.html`, `Software.dc.html`, and `Tag Archive.dc.html`
> all supplied the real copy now in `_data/*.yml`, `_publications/*.md`,
> `index.md`, `mentorship.md`, `software.md`, `blog.md`, and the example
> post. Two things are still simplifications, not gaps: the proprietary
> `<x-dc>`/`support.js` runtime and `image-slot.js` don't run outside the
> Claude Design editor, so they're replaced with plain Liquid/data-driven
> markup and the vanilla-JS `reveal.js`/`lightbox.js`; and `Article.dc.html`'s
> live widgets (the masking-schedule slider, the loss-framing toggle, the
> table-of-contents sidebar) are flattened into static prose/code blocks in
> the example post, since a static site generator has no state to drive
> them. Drop a real photo in for `assets/img/headshot.jpg` — it's a
> placeholder path.

## Installation

As a theme gem in an existing Jekyll site's `Gemfile`:

```ruby
gem "broadsheet-jekyll-theme"
```

```
bundle install
bundle exec jekyll serve
```

Or use this repo directly as a site skeleton — it already has `_config.yml`,
content pages, and a `Gemfile` wired for local development:

```
bundle install
bundle exec jekyll serve
```

## Directory structure

```
_config.yml           site config, nav defaults, collections
_layouts/
  default.html         html shell: head, nav, footer, JS includes
  page.html             generic content page (About, Mentorship, Software)
  home.html              blog index (list of posts)
  post.html               single article
  publications.html        publications list page
  tag-archive.html          posts filtered by tag
_includes/
  head.html, nav.html, footer.html
  glyph-icon.html        pulsing 3x3 pixel-grid icon, before every <h2>
  pixel-bg.html            decorative flicker background (toggle via
                             site.pixel_bg: false, or prefers-reduced-motion)
  publication-item.html, news-item.html, talk-item.html,
  affiliation-item.html, mentor-item.html, software-item.html
_sass/
  _tokens.scss           CSS custom properties (color ramps, type, spacing)
  _base.scss               element defaults
  _components.scss           .btn/.tag/.card/.nav/.table/.dialog + structural
                               helpers (.hero, .section-heading, .pub-item, …)
  _print-plates.scss           .cmyk / .halftone / .cmyk-num / .cmyk-head
  _glyph.scss                    glyph-icon + pixel-bg animation keyframes
assets/
  css/main.scss            imports all _sass partials, compiled by Jekyll
  js/reveal.js               scramble-reveal heading effect
  js/lightbox.js               click-to-zoom image overlay
  img/                          put real images here (headshot.jpg, pub
                                  thumbnails under pub-thumbs/, etc.)
_data/
  nav.yml, affiliations.yml, news.yml, talks.yml, mentors.yml,
  services.yml, software.yml
_publications/           publications collection (title, authors, venue,
                           tag, year, url, thumbnail front matter)
_posts/                   blog posts
```

## Customizing content

Almost everything on the About page is data-driven — edit the YAML files
under `_data/` rather than the templates:

- `_data/affiliations.yml` — date range + org + role rows
- `_data/news.yml` — date + item text
- `_data/talks.yml` — date + tag + item text
- `_data/mentors.yml` — `current` / `previous` lists of `{name, url, affiliation}`
- `_data/services.yml` — reviewing/committee roles
- `_data/software.yml` — software project cards

Publications live as individual files in `_publications/`, one per paper,
with front matter matching the fields the `publication-item.html` include
expects (`title`, `authors`, `venue`, `tag`, `year`, `url`, `thumbnail`).

`index.md` (the About page) and `mentorship.md` / `software.md` wire these
data files into the shared includes with simple `{% for %}` loops — add a
new data entry and it shows up with zero template changes.

## Design system notes

- **`.cmyk` / `.halftone`** (in `_sass/_print-plates.scss`) are static CSS
  approximations of the Broadsheet photo treatments. The original design
  system's live "press register" hover animation is driven by an optional
  `print-plates.js` script that is editor tooling and was intentionally
  not ported — see the comment at the top of `_print-plates.scss` for how
  to layer that interaction back on if you want it.
- **`glyph-icon.html`** renders the pulsing 3x3 pixel-grid icon used before
  every `<h2>` as inline SVG; pass `color=` to override its accent color.
- **`reveal.js`** progressively enhances any `[data-reveal]` element with a
  scramble-then-reveal text animation on scroll into view (via
  `IntersectionObserver`). It's inert without JS (plain text shows) and
  skips the animation under `prefers-reduced-motion`.
- **`lightbox.js`** turns any `<img data-lightbox="/path/to/full.jpg">`
  into a click-to-zoom overlay, closable with Escape or a backdrop click.
- Both replace the original Claude Design canvas's proprietary `<x-dc>` /
  `support.js` runtime and the editor-only `<image-slot>` web component —
  those only work inside the Claude Design editor and are not present
  anywhere in this theme. Image slots became plain `<img>` tags pointing
  at `assets/img/...`.

## Build verification

`bundle exec jekyll build` was run against this theme during generation —
see the accompanying task report for the result and any fixes applied.
