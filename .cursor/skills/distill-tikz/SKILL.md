---
name: distill-tikz
description: Create TikZJax figures for Distill-layout Jekyll posts on this site. Use when the user asks for a TikZ diagram, intuitive figure, d-figure illustration, or TikZJax in a distill post under _posts/_drafts.
disable-model-invocation: true
---

# Distill TikZ Figures

Create client-rendered TikZ diagrams for Distill posts using [TikZJax](https://tikzjax.com/).

## Inputs

- **Target post**: Distill markdown under `_posts/` or `_drafts/`.
- **Concept**: what the figure should teach (e.g. limiting argument, process schematic, geometry).
- **Figure number** (optional): for caption (`Figure 1`, `Figure 2`, …).

## Workflow

1. **Read context** — surrounding section in the target post; note symbols ($\lambda$, $n$, $p$, …) already used in prose.
2. **Design for intuition** — prefer one clear idea per figure; label axes, legends, and in-panel annotations.
3. **Precompute numeric data** (if plotting) — use Python for PMF/CDF heights, coordinates, etc.; paste literals into `\foreach \k/\h in {...}`.
4. **Write TikZ** — keep TikZJax-compatible (see constraints below).
5. **Embed in post** — `tikzjax: true` in front matter + `<d-figure>` block.
6. **Add caption prose** — 1–2 sentences tying the figure to the surrounding math.
7. **Do not commit** unless the user asks.

## Site setup (already wired)

| Piece | Location |
|-------|----------|
| TikZJax loader | `_includes/scripts/tikzjax.html` |
| Included from | `_includes/head.html` |
| Distill figure CSS | `_sass/_distill.scss` (`d-figure`, `svg`) |
| Reference example | [examples.md](examples.md) (binomial → Poisson bar chart) |

Enable per post:

```yaml
tikzjax: true
```

## Embed template

```html
<d-figure>
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
</d-figure>
```

- Always wrap in `\begin{document}...\end{document}`.
- Kramdown leaves `<script type="text/tikz">` untouched — do not indent the script tag with markdown list syntax.
- Place the figure **before or after** the equation it illustrates; add one bridging sentence in prose.
- `<div class="tikz-panel">` draws a light bordered card around the diagram (styled in `_sass/_distill.scss`); the caption stays outside the panel. Style the **div**, not the `<svg>` — TikZJax sets explicit dimensions on the SVG, and padding/border directly on it makes it overflow the caption.

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

**Primes in TikZ math** — use `^{\prime}` not `'` inside `{$...$}` (same Kramdown issue does not apply inside script blocks, but stay consistent).

**Punctuation inside math mode renders as wrong glyphs.** TikZJax's math-italic font maps `,`, `.`, and `/` to garbage symbols inside `$...$` in node text (`,` → backtick-like mark, `.` → triangle: `$p=0.3$` renders as `p = 0⊳3`). Keep punctuation and decimal numbers in **text mode**; wrap only the symbols in math:

```latex
% BAD: comma, period, slash inside $...$
\node at (1.7, 2.75) {$n=10,\; p=0.3$};
\node at (3.5, -1.0) {Binomial$(n, \lambda/n)$};

% GOOD: punctuation + decimals in text mode, symbols in math
\node at (1.7, 2.75) {$n = 10$, $p =$ 0.3};
\node at (3.5, -1.0) {Binomial($n$, $p$)};
```

Word kerning in plain-text nodes can also come out slightly uneven (font-conversion quirk); prefer short labels and check the rendered output.

## Design patterns

### Bar chart / PMF comparison

```latex
\def\ymax{0.27}  % scale factor = max probability
\foreach \k/\h in {0/0.0498, 1/0.1494, 2/0.2240} {
  \draw[fill=blue!35, draw=blue!70] (\k*0.42, 0) rectangle (\k*0.42+0.34, \h/\ymax);
}
```

Precompute heights with Python, then paste the `\foreach` list.

### Multi-panel layout

Use `\begin{scope}[xshift=...cm]` for side-by-side panels; shared legend at bottom.

### Process / counting intuition

Use repeated shapes (`\foreach \i in {0,...,15}`) with a subset highlighted (e.g. orange = success). Annotate with `\node[anchor=west] at (...) {...}`.

### Colors (Distill-friendly)

- Data series: `blue!35` fill / `blue!70` draw
- Limit / reference: `red` markers or dashed lines
- Neutral: `gray!15` fill / `gray!50` draw
- Highlight: `orange!70`

## Precompute helper

When the figure needs exact probabilities:

```bash
python3 - <<'PY'
import math
lam = 3
def pois(k): return math.exp(-lam)*lam**k/math.factorial(k)
def binom(n,k,p):
    from math import comb
    return comb(n,k)*p**k*(1-p)**n
n, p = 50, lam/n
pairs = ", ".join(f"{k}/{binom(n,k,p):.4f}" for k in range(8))
print(rf"\foreach \k/\h in {{{pairs}}} {{ ... }}")
PY
```

## Checklist

```
- [ ] Post has tikzjax: true (add if missing)
- [ ] Figure wrapped in <d-figure> + <div class="tikz-panel"> + <script type="text/tikz">
- [ ] \begin{document} wrapper present
- [ ] TikZJax-safe commands only (no pgfplots / custom packages)
- [ ] Numeric data precomputed; bar heights use \h/\ymax scaling
- [ ] Legend + axis labels present
- [ ] No `,` `.` `/` inside $...$ in node text (punctuation/decimals in text mode)
- [ ] figcaption with Figure N and intuitive caption
- [ ] Bridging sentence in markdown prose above/below figure
```

## Additional resources

- Full worked example (binomial → Poisson bars): [examples.md](examples.md)
