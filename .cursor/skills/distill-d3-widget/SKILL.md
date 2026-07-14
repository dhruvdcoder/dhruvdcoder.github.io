---
name: distill-d3-widget
description: Create D3 interactive widgets for Distill-layout Jekyll posts on this site. Use when the user asks for an interactive plot, stochastic simulation, slider widget, stochviz figure, or D3 visualization in a distill post under _posts/_drafts.
disable-model-invocation: true
---

# Distill D3 Interactive Widgets

Create client-rendered interactive figures for Distill posts using [D3 v7](https://d3js.org/), shared helpers in `assets/js/stochviz/`, and post-specific widgets in `assets/js/posts/<slug>/`.

## Inputs

- **Target post**: Distill markdown under `_posts/` or `_drafts/`.
- **Concept**: what the widget should teach (e.g. PMF convergence, sample path, parameter sweep).
- **Figure number** (optional): for caption (`Figure 1`, `Figure 2`, …).
- **Controls**: sliders, preset buttons, play/pause as needed.

## Workflow

1. **Read context** — surrounding section in the target post; note symbols ($\lambda$, $n$, $p$, …) already used in prose.
2. **Decide static vs interactive** — keep TikZJax for fixed snapshots; use D3 when the reader should sweep a parameter or watch a simulation evolve.
3. **Reuse or extend helpers** — check `assets/js/stochviz/` for shared math/plot code; put post-specific widgets in `assets/js/posts/<slug>/`.
4. **Embed in post** — `d3: true` in front matter + `<d-figure>` block with `.stochviz-panel`.
5. **Add caption prose** — 1–2 sentences tying the widget to the surrounding math.
6. **Verify** — `bundle exec jekyll serve --drafts`, open the post, test slider/presets in light and dark mode.
7. **Do not commit** unless the user asks.

## Site setup (already wired)

| Piece | Location |
|-------|----------|
| D3 loader | `_includes/scripts/d3.html` |
| Included from | `_includes/head.html` |
| Shared helpers | `assets/js/stochviz/` (distributions, future reusable plot utils) |
| Post-specific widgets | `assets/js/posts/<slug>/` (e.g. `ctmc/binomial-poisson-convergence.js`) |
| Widget styles | `_sass/_distill.scss` (`.stochviz-panel`, controls) |
| Theme colors | `_sass/_themes.scss` (`--stochviz-*` aliases) |
| Reference example | `_posts/2026-05-10-ctmc.md` (Figure 1: Binomial → Poisson) |

Enable per post:

```yaml
d3: true
```

Static figures in the same post can still use `tikzjax: true`; the two flags are independent.

## Embed template

```html
<d-figure>
<div class="stochviz-panel" id="my-widget">
  <div class="stochviz-controls">
    <div class="stochviz-control-group">
      <label for="my-slider">$n$</label>
      <input class="stochviz-n-slider" id="my-slider" type="range" min="5" max="500" step="5" value="10">
      <span class="stochviz-meta"><span class="stochviz-n-out">10</span> trials</span>
    </div>
    <div class="stochviz-presets" role="group" aria-label="Preset values">
      <button type="button" class="stochviz-preset active" data-stochviz-preset="10">$n=10$</button>
    </div>
  </div>
  <div class="stochviz-plot"></div>
</div>
  <figcaption>
    <b>Figure N.</b>
    Caption in plain language.
  </figcaption>
</d-figure>

<script src="{{ '/assets/js/stochviz/distributions.js' | relative_url }}"></script>
<script src="{{ '/assets/js/posts/ctmc/binomial-poisson-convergence.js' | relative_url }}"></script>
<script>
document.addEventListener('DOMContentLoaded', function () {
  var root = document.getElementById('my-widget');
  if (root && window.createBinomialPoissonConvergenceWidget) {
    createBinomialPoissonConvergenceWidget(root, { lambda: 3, n: 10 });
  }
});
</script>
```

### Embed rules

- Wrap widget markup in `<d-figure>` + `<div class="stochviz-panel">`; caption stays outside the panel.
- Use `relative_url` for script `src` paths so GitHub Pages subpaths work.
- **Always init on `DOMContentLoaded`** — D3 loads with `defer` from the head; inline scripts in the post body run before D3 if not deferred.
- Do not indent `<script>` tags as markdown list items — Kramdown may mangle them.
- Add one bridging sentence in markdown prose above or below the figure.

## Helper API

### Shared: `assets/js/stochviz/`

Exposed on `window.StochViz`:

| Function | Description |
|----------|-------------|
| `binomialPmf(n, p, k)` | $\Pr(X=k)$ for $X \sim \mathrm{Binomial}(n,p)$; log-space for large $n$ |
| `poissonPmf(lambda, k)` | $\Pr(X=k)$ for $X \sim \mathrm{Poisson}(\lambda)$ |
| `pmfSeries(pmfFn, maxK)` | values for $k = 0, \ldots, \texttt{maxK}$ |

Keep only **reusable** code here. When a widget is tied to one post, put it under `assets/js/posts/<slug>/`.

### Post-specific: `assets/js/posts/ctmc/binomial-poisson-convergence.js`

| Function | Description |
|----------|-------------|
| `createBinomialPoissonConvergenceWidget(container, opts)` | CTMC post Figure 1: Binomial$(n, \lambda/n)$ bars vs Poisson$(\lambda)$ dots |

**Options:** `lambda` (default 3), `n` (default 10), `nMin`, `nMax`, `nStep`, `presets`, `maxK`, `width`, `height`.

**Required DOM inside container:**

- `.stochviz-plot` — SVG mount point
- `.stochviz-n-slider` — range input
- `.stochviz-n-out`, `.stochviz-p-out` — readouts (optional)
- `[data-stochviz-preset]` buttons — preset values

## Styling and dark mode

- Panel card: `.stochviz-panel` in `_sass/_distill.scss` (uses theme background, not fixed white like `.tikz-panel`).
- Plot colors use `--stochviz-*` tokens in `_sass/_themes.scss` that **alias** existing theme vars (defined once for both light and dark):

| Token | Aliases to | Purpose |
|-------|------------|---------|
| `--stochviz-bar-stroke` | `--mathbox-definition-accent` | Binomial bar stroke |
| `--stochviz-bar-fill` | `color-mix(..., --mathbox-definition-accent, transparent)` | Binomial bar fill |
| `--stochviz-ref-fill` | `--global-danger-block` | Poisson reference dots |
| `--stochviz-axis` | `--mathbox-remark-accent` | Axis lines |
| `--stochviz-text` | `--global-distill-app-color` | Axis labels, legend |
| `--stochviz-grid` | `color-mix(..., --global-divider-color, transparent)` | Grid lines |

Because these are aliases, dark mode requires no duplicate hex values — the underlying theme vars flip automatically.

## When to use D3 vs TikZJax

| Use TikZJax | Use D3 |
|-------------|--------|
| Fixed multi-panel comparison | Parameter slider / continuous sweep |
| Process schematics, arrows | Sample-path animation |
| Print-friendly, no-JS fallback | Interactive exploration |
| Precomputed numeric literals | Dynamic recomputation |

Keep both in the same post when helpful: static TikZ figure for at-a-glance comparison, interactive D3 figure for exploration.

## Adding a new widget

1. **Shared math/plot utils** → add to `assets/js/stochviz/`, export on `window.StochViz`.
2. **Post-specific widget** → add to `assets/js/posts/<slug>/`, export a descriptively named factory on `window` (e.g. `createBinomialPoissonConvergenceWidget`).
3. Reuse existing `--stochviz-*` color aliases; only add new tokens if the widget needs a color role not covered above.
4. Embed via the template above; load shared scripts first, then the post widget.
5. Update this skill with the new file path and API.

- Widget listens for `data-theme` changes on `<html>` via `MutationObserver` and refreshes colors.
- In widgets, read colors via `getComputedStyle(document.documentElement).getPropertyValue('--stochviz-*')` — never hardcode hex values in JS.

## Gotchas learned from implementation

- **Script load order**: D3 is `defer` in head; post inline init must wait for `DOMContentLoaded`.
- **KaTeX in controls**: `$n=10$` in button labels is fine — Distill KaTeX runs on the page after load.
- **Grid column**: widgets inside `<d-figure>` inherit `grid-column: text` from Distill; no extra wrapper needed.
- **Log-space binomial**: use log factorials for $n > 100$ to avoid overflow; verified against precomputed TikZ values at $n=50$.
- **Y-axis domain**: fix domain to cover Poisson$(\lambda)$ peak (e.g. $[0, 0.28]$ for $\lambda=3$) so bars don't rescale distractingly.
- **Preset button state**: toggle `.active` class on click so the active preset is visible.
- **Accessibility**: add `aria-label` on slider; `role="group"` on presets; `role="img"` + `aria-label` on SVG.

## Checklist

```
- [ ] Post has d3: true in front matter
- [ ] Figure wrapped in <d-figure> + <div class="stochviz-panel">
- [ ] Controls + .stochviz-plot present with expected class names
- [ ] Script tags use relative_url; init on DOMContentLoaded
- [ ] Post-specific widget lives in `assets/js/posts/<slug>/`, not `stochviz/`
- [ ] Colors from --stochviz-* CSS vars (theme aliases), not hardcoded
- [ ] figcaption with Figure N and intuitive caption
- [ ] Bridging sentence in markdown prose
- [ ] Tested in light and dark mode
- [ ] Static TikZ fallback kept if the figure is pedagogically important without JS
```

## Additional resources

- Static counterpart: `.cursor/skills/distill-tikz/SKILL.md`
- Worked example: `_posts/2026-05-10-ctmc.md` (Figure 1)
