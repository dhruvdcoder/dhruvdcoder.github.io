---
name: distill-tikz
description: Create TikZJax figures for TMA-layout Jekyll posts on this site. Use when the user asks for a TikZ diagram, intuitive figure, or TikZJax in a post under _posts/_drafts, or when converting Obsidian ```tikz fences.
disable-model-invocation: true
---

# TikZ Figures (TikZJax)

Create client-rendered TikZ diagrams for posts using [TikZJax](https://tikzjax.com/).

## Inputs

- **Target post**: markdown under `_posts/` or `_drafts/`.
- **Concept**: what the figure should teach.
- **Figure number** (optional): for caption (`Figure 1`, `Figure 2`, …).

## Workflow

1. **Read context** — surrounding section; note symbols already used in prose.
2. **Design for intuition** — one clear idea per figure; label axes and annotations.
3. **Precompute numeric data** (if plotting) — paste literals into `\foreach \k/\h in {...}`.
4. **Write TikZ** — keep TikZJax-compatible (see constraints below).
5. **Embed in post** — `tikzjax: true` in front matter + `<figure class="tikz-figure">` block.
6. **Add caption prose** — 1–2 sentences tying the figure to the surrounding math.
7. **Do not commit** unless the user asks.

## Site setup (already wired)

| Piece | Location |
|-------|----------|
| TikZJax loader | `_includes/scripts/tikzjax.html` |
| Included from | `_layouts/default.html` (only if `page.tikzjax`) |
| Figure CSS | `_sass/_article.scss` (`.tikz-figure`, `.tikz-panel`) |
| Reference example | [examples.md](examples.md) |

Enable per post:

```yaml
tikzjax: true
```

## Embed template

```html
<figure class="tikz-figure">
<div class="tikz-panel">
  <script type="text/tikz">
\begin{document}
\begin{tikzpicture}[font=\small]
  % drawing commands
\end{tikzpicture}
\end{document}
  </script>
</div>
<figcaption>
  <b>Figure N.</b>
  Caption in plain language; use HTML entities in captions when needed (e.g. `&gt;` for `>`).
</figcaption>
</figure>
```

- Always wrap in `\begin{document}...\end{document}`.
- Kramdown leaves `<script type="text/tikz">` untouched — do not indent the script tag with markdown list syntax.
- Place the figure **before or after** the equation it illustrates; add one bridging sentence in prose.
- `<div class="tikz-panel">` draws a light bordered card around the diagram.
  Style the **div**, not the `<svg>` — TikZJax sets explicit dimensions on the SVG, and padding/border directly on it makes it overflow the caption.

## Obsidian conversion

Obsidian ` ```tikz ` fences become the embed above.
Set `tikzjax: true` if the post has any such figure.
Raster vault images (`![[Pasted image …]]`) still copy to `assets/img/posts/` and use `<img>`.

## TikZJax constraints

**Supported well**

- Basic TikZ: `\draw`, `\fill`, `\node`, `\foreach`, `\begin{scope}`, circles, rectangles, arrows
- Inline math in nodes: `{$\lambda$}`, `{$n=\n$}`
- Simple bar charts via `\foreach \k/\h in {0/0.05, 1/0.12, ...}`

**Avoid or simplify**

- `pgfplots` — unreliable in TikZJax; hand-draw bars/lines instead
- `\usepackage{...}` — not available; use built-in TikZ only
- External image files (`\includegraphics`) — won't resolve
- Heavy packages (`tikz-cd`, custom macros from paper preambles)
- `align*` in node text — `*` can break if outside the script block

**Primes in TikZ math** — use `^{\prime}` not `'` inside `{$...$}`.

**Punctuation inside math mode renders as wrong glyphs.**
TikZJax's math-italic font maps `,`, `.`, and `/` to garbage symbols inside `$...$` in node text.
Keep punctuation and decimal numbers in **text mode**; wrap only the symbols in math:

```latex
% BAD: comma, period, slash inside $...$
\node at (1.7, 2.75) {$n=10,\; p=0.3$};

% GOOD: punctuation + decimals in text mode, symbols in math
\node at (1.7, 2.75) {$n = 10$, $p =$ 0.3};
```

## Design patterns

### Bar chart / PMF comparison

```latex
\def\ymax{0.27}
\foreach \k/\h in {0/0.0498, 1/0.1494, 2/0.2240} {
  \draw[fill=blue!35, draw=blue!70] (\k*0.42, 0) rectangle (\k*0.42+0.34, \h/\ymax);
}
```

### Multi-panel layout

Use `\begin{scope}[xshift=...cm]` for side-by-side panels; shared legend at bottom.

### Colors

- Data series: `blue!35` fill / `blue!70` draw
- Limit / reference: `red` markers or dashed lines
- Neutral: `gray!15` fill / `gray!50` draw
- Highlight: `orange!70`

## Checklist

```
- [ ] Post has tikzjax: true (add if missing)
- [ ] Figure wrapped in <figure class="tikz-figure"> + <div class="tikz-panel"> + <script type="text/tikz">
- [ ] \begin{document} wrapper present
- [ ] TikZJax-safe commands only (no pgfplots / custom packages)
- [ ] No `,` `.` `/` inside $...$ in node text
- [ ] figcaption with Figure N
- [ ] Bridging sentence in markdown prose above/below figure
```

## Additional resources

- Worked example (binomial → Poisson bars): [examples.md](examples.md)
