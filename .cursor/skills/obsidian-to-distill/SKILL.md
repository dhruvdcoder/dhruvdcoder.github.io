---
name: obsidian-to-distill
description: Convert Obsidian Markdown notes into Distill-layout Jekyll blog posts for this site. Use when the user asks to move, import, or adapt Obsidian notes into a distill post, CTMC/blog draft under _posts/_drafts, or mentions Obsidian → Distill conversion.
disable-model-invocation: true
---

# Obsidian → Distill

Turn an Obsidian `.md` note into (or into a section of) a Distill post in this repo.

## Inputs

- **Source**: absolute path to an Obsidian note (often outside the repo, e.g. OneDrive vault).
- **Target**: existing Distill post/draft, or a new file under `_posts/` or `_drafts/`.

If the target is unclear, ask: merge into an existing post, or create a new one?

## Workflow

1. **Read both files** — source note + target Distill post (or an existing Distill example: `_posts/2026-05-10-ctmc.md`, `_drafts/2023-12-25-dynamic-decoding.md`).
2. **Extract content** — keep substantive prose, definitions, proofs, and equations. Drop Obsidian-only scaffolding (see conversions below).
3. **Adapt to Distill** — rewrite into the post’s voice and structure; do not dump the note verbatim.
4. **Update bibliography** — add cited works to `assets/bibliography/<post-bib>.bib`; cite with `<d-cite key="..."></d-cite>`.
5. **Update TOC** — every `##` / `###` section name used in the body should appear under `toc:` in the front matter (names must match for `#slugify` links).
6. **Polish** — fix clear typos; skip incomplete stubs (empty Anki cards, “TODO”, unfinished proofs unless the user wants them kept).

## Distill post shape

New posts use `layout: distill`. Prefer this front-matter pattern:

```yaml
---
layout: distill
title: "..."
description: ...
tags: [...]
giscus_comments: true
date: YYYY-MM-DD
featured: false

authors:
  - name: Dhruvesh Patel
    url: "https://dhruveshp.com"
    affiliations:
      name: University of Massachusetts Amherst

bibliography: <slug>.bib
toc:
  - name: Section Name
    subsections:
      - name: Subsection Name
---
```

- Bibliography file lives at `assets/bibliography/<slug>.bib` (filename matches `bibliography:`).
- Body headings: `##` for top-level TOC entries, `###` for subsections.
- Optional collapsible blocks: `{% details Title %} ... {% enddetails %}`.
- Prose line breaks: break only at punctuation (sentence/clause boundaries). Prefer one sentence per line.

## Obsidian → Distill conversions

| Obsidian | Distill |
|----------|---------|
| YAML frontmatter (`tags`, `aliases`, `anki_*`, `publish`, …) | Drop; use Distill front matter above |
| `# Title` matching the note title | Omit if the Distill `title:` already covers it; otherwise demote to `##` |
| `>[!anki] ...` / callout cards | Unfold into normal prose or definition lists; strip the callout chrome |
| `>[!important]` / `>[!note]` / etc. | Important asides → emphasized prose or `{% details %}`; do not keep Obsidian callout syntax |
| `[^ref]` footnotes + footnote defs | Prefer `<d-cite key="bibKey"></d-cite>` + `.bib` entry; use `<d-footnote>...</d-footnote>` only for non-bibliographic asides |
| `[[Wiki Links]]` | Plain text, markdown links, or omit |
| `#tag` / block ids (`^feff9e`) | Drop |
| `t'`, `\Lambda'(t)` in math | `t^{\prime}`, `\Lambda^{\prime}(t)` — see **Kramdown smart quotes** below |
| `\{...\}` literal braces in math | `\\{...\\}` or `\lbrace...\rbrace` — see **Kramdown escaped braces** below |
| Incomplete Anki prompts with no answer | Skip or leave a short TODO only if the user asks to keep drafts |

### Citations

```html
... as shown in Ross <d-cite key="rossStochasticProcesses2007"></d-cite>.
```

Add matching BibTeX keys to the post’s `.bib`. Prefer real bibliographic entries over placeholders.

### Math (KaTeX)

- Inline: `$...$` · Display: `$$...$$` or `\[...\]`
- Prefer `$$` for single-line display equations.
- Multi-line math: use `$$\begin{aligned} ... \end{aligned}$$`. **`aligned` inside `$$`** — not `align`. In KaTeX, `align` is a top-level display environment; nesting it inside `$$`/`\[...\]` (what Kramdown emits) fails silently. `aligned` is designed for use inside math delimiters.
- Site macros (already in `_layouts/distill.html`): `\R`, `\N`, `\E`, `\Prob` — prefer `\Prob` over `\mathbb{P}` / `P(...)` for probability.

#### Kramdown smart quotes (primes in math)

Jekyll uses Kramdown (`_config.yml`: `markdown: kramdown`). Kramdown **smart-quotes** convert ASCII `'` inside math to `&#8217;` (curly apostrophe). Distill/KaTeX then fails to render those expressions — the math may appear as raw `$...$` text or break mid-line.

**Broken** (from Obsidian; will not render):

```markdown
2. is non-decreasing: $C_t \geq C_{t'}$ for $t \geq t'$.
```

**Fixed**:

```markdown
2. is non-decreasing: $C_t \geq C_{t^{\prime}}$ for $t \geq t^{\prime}$.
```

**Rule**: inside any math (`$...$`, `$$...$$`, `\begin{align}`), replace every `'` used as a prime with `^{\prime}`:

| Obsidian / LaTeX shorthand | Distill-safe |
|--------------------------|--------------|
| `t'` | `t^{\prime}` |
| `C_{t'}` | `C_{t^{\prime}}` |
| `\Lambda'(t)` | `\Lambda^{\prime}(t)` |
| `w'(t)` | `w^{\prime}(t)` |

Applies to both inline and display math. When importing Obsidian notes, scan for `'` inside math delimiters and convert before writing the post.

**Quick check** (optional): `ruby -e 'require "kramdown"; puts Kramdown::Document.new("LINE").to_html'` — output must not contain `&#8217;` inside math spans.

#### Kramdown escaped braces (literal `{` / `}` in math)

Kramdown strips the backslash from LaTeX `\{` and `\}` before KaTeX sees the math. Bare `{` and `}` are **grouping delimiters** in KaTeX, not visible characters — so set/event braces silently disappear.

**Broken** (from Obsidian/LaTeX; braces invisible):

```markdown
where $o(t) = \{ f \in \mathbb{R}^{\mathbb{R}} \mid \lim_{t \to 0} f(t)/t = 0 \}$.
Then $\{T > t\} = \{N(t) = 0\}$.
```

**Fixed** (double the backslash so one survives Kramdown):

```markdown
where $o(t) = \\{ f \in \mathbb{R}^{\mathbb{R}} \mid \lim_{t \to 0} f(t)/t = 0 \\}$.
Then $\\{T > t\\} = \\{N(t) = 0\\}$.
```

**Alternative**: use `\lbrace` / `\rbrace` (Kramdown leaves these alone):

```markdown
where $o(t) = \lbrace f \in \mathbb{R}^{\mathbb{R}} \mid \lim_{t \to 0} f(t)/t = 0 \rbrace$.
```

| Obsidian / LaTeX | Distill-safe |
|------------------|--------------|
| `\{...\}` | `\\{...\\}` or `\lbrace...\rbrace` |
| `$\{N(t), t > 0\}$` | `$\\{N(t), t > 0\\}$` or `$\lbrace N(t), t > 0 \rbrace$` |

Applies to both inline (`$...$`) and display (`$$...$$`) math. Do **not** double-escape braces used only for TeX grouping (e.g. `\mathbb{R}`, `e^{-\lambda t}`, `C_{t^{\prime}}`).

**Quick check** (optional): after Kramdown conversion, literal braces must appear as `\{` / `\}` (or `\lbrace` / `\rbrace`) in the HTML — not bare `{` / `}`.

#### Kramdown + multiline math

Two rules for this Jekyll/Kramdown + Distill/KaTeX stack:

1. **Always wrap** multiline environments in `$$...$$` so Kramdown preserves `\\` (bare `\begin{...}` becomes a `<p>` with `<br />`).
2. **Use `aligned`, not `align`**, inside `$$`. Kramdown converts `$$` → `\[...\]`; nesting top-level `align` inside that fails. `aligned` is the inner environment KaTeX expects.

**Broken** (hidden / empty render):

```markdown
$$
\begin{align}
a &= b \\
c &= d
\end{align}
$$
```

**Fixed**:

```markdown
$$
\begin{aligned}
a &= b \\
c &= d
\end{aligned}
$$
```

Put `\implies` on the same line as `&=` (e.g. `&\implies ... &= ...`) so it aligns with the other rows.

Avoid `align*` in Markdown — the trailing `*` is parsed as emphasis (`align` + italic).

### TikZ figures

For creating diagrams, use the **distill-tikz** skill (`tikzjax: true` + `<d-figure>` + `<script type="text/tikz">`).

### Content judgment

- **Correct obvious note errors** when adapting (e.g. non-homogeneous PP has independent increments, not stationary).
- **Preserve technical meaning**; tighten wording for a public post.
- **Merge mode**: if the target already has an intro/section stub, extend that section rather than duplicating it.
- **Do not commit** unless the user asks.

## Checklist

```
- [ ] Source read; target Distill file chosen/created
- [ ] Obsidian chrome removed (callouts, Anki, wiki links, vault frontmatter)
- [ ] Headings + `toc:` names aligned
- [ ] Citations via `d-cite` + `assets/bibliography/<slug>.bib`
- [ ] Math delimiters valid for Distill/KaTeX (multiline uses `$$\begin{aligned}...\end{aligned}$$`)
- [ ] Primes in math use `^{\prime}` (no bare `'` inside math — Kramdown smart quotes)
- [ ] Literal braces in math use `\\{...\\}` or `\lbrace...\rbrace` (not bare `\{...\}`)
- [ ] Incomplete stubs skipped (or explicitly kept per user)
- [ ] Line breaks only at punctuation
```

## Example

**User:** Add content from `.../notes/sandbox/Probability/Poisson Processes.md` to `_posts/2026-05-10-ctmc.md`.

**Agent:** Read both files → convert callout definitions into subsections under `## Poisson Processes` → add Ross/Durrett to `ctmc.bib` → wire `<d-cite>` → update `toc` subsections → write polished Distill markdown into the post.
