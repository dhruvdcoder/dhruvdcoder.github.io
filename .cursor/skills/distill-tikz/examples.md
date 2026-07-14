# distill-tikz examples

## Binomial → Poisson limit (Figure 1 in CTMC post)

**Concept:** Fix $\lambda=3$. As $n$ grows and $p=\lambda/n$ shrinks, Binomial$(n,\lambda/n)$ bars approach Poisson$(\lambda)$ markers.

**Precomputed data** ($\lambda=3$):

| $k$ | Poisson | $n{=}10$ | $n{=}50$ | $n{=}200$ |
|-----|---------|----------|----------|-----------|
| 0 | 0.0498 | 0.0282 | 0.0453 | 0.0487 |
| 1 | 0.1494 | 0.1211 | 0.1447 | 0.1482 |
| 2 | 0.2240 | 0.2335 | 0.2262 | 0.2246 |
| 3 | 0.2240 | 0.2668 | 0.2311 | 0.2257 |
| 4 | 0.1680 | 0.2001 | 0.1733 | 0.1693 |
| 5 | 0.1008 | 0.1029 | 0.1018 | 0.1011 |
| 6 | 0.0504 | 0.0368 | 0.0487 | 0.0500 |
| 7 | 0.0216 | 0.0090 | 0.0195 | 0.0211 |

**Layout sketch**

```
[ 3 bar-chart panels for n=10, 50, 200; shared y-axis on left panel ]
[ Poisson value = red dot centered on each bar; per-panel n, p title ]
[ Shared k-axis label + legend row at bottom ]
```

**Minimal embed** (see `_posts/2026-05-10-ctmc.md` for full TikZ):

```html
<d-figure>
<div class="tikz-panel">
  <script type="text/tikz">
\begin{document}
\begin{tikzpicture}[font=\scriptsize,
    bar/.style={fill=blue!30, draw=blue!60, line width=0.3pt},
    axis/.style={gray!80, line width=0.4pt}]
  \def\ys{9}  % height scale: probability * \ys = y coordinate
  % ... per-panel scopes, \foreach bar draws, red Poisson dots, legend ...
\end{tikzpicture}
\end{document}
  </script>
</div>
  <figcaption>
    <b>Figure 1.</b>
    Fixing $\lambda &gt; 0$ and setting $p=\lambda/n$ keeps the expected number of successes at $\lambda$.
    As $n$ grows, the Binomial pmf approaches the Poisson pmf.
  </figcaption>
</d-figure>
```

## Minimal smoke-test figure

Use when verifying TikZJax loads on a post:

```html
<d-figure>
  <script type="text/tikz">
\begin{document}
\begin{tikzpicture}
  \draw[->] (0,0) -- (2,0) node[right] {$x$};
  \draw[->] (0,0) -- (0,2) node[above] {$y$};
  \draw[thick, blue] (0,0) -- (1.5,1.5);
\end{tikzpicture}
\end{document}
  </script>
  <figcaption><b>Figure N.</b> Smoke test.</figcaption>
</d-figure>
```
