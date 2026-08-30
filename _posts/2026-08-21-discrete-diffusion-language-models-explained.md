---
title: "Discrete Diffusion Language Models, Explained"
subtitle: "Most language models write one token at a time, left to right. A newer family writes the whole sequence at once, then refines it — borrowing an idea from image generation and applying it to text."
kicker: "Machine Learning"
role: "PhD Researcher, UMass Amherst"
read_time: 10
date: 2026-08-21
tags: [generative-models, language-models]
cite: "Patel, D. (2026). Discrete diffusion language models, explained. Working Notes."
bibtex: |
  @misc{patel2026diffusionlm,
    author = {Patel, Dhruvesh},
    title  = {Discrete Diffusion Language Models, Explained},
    year   = {2026},
    note   = {Working Notes}
  }
---

| Property | Autoregressive | Discrete diffusion |
| --- | --- | --- |
| Decoding order | Left-to-right, fixed | Parallel, no fixed order |
| Steps at inference | ≈ one per output token | T, set independently of length |
| Attention pattern | Causal | Bidirectional |
| Infilling a fixed template | Needs special training | Native to the objective |
| Exact likelihood | Exact, via the chain rule | A variational bound |

*Table 1 — Two decoding paradigms at a glance.*

## 1. Two ways to write a sentence

A standard language model writes left to right. At each step it looks at everything written so far and predicts the next token; string enough predictions together and you have a paragraph. This is autoregressive generation, and it is the basis of essentially every widely deployed chat model today.

It has a structural consequence: generation is sequential.[^1] Producing N tokens takes roughly N forward passes, and the model can only condition on what comes before a position, never after. Editing the middle of a passage, or filling a blank surrounded by fixed text on both sides, doesn't fit the left-to-right story naturally.

Diffusion models, dominant in image generation, offer a different shape. They start from pure noise and repeatedly denoise it, refining the whole canvas at once rather than piece by piece. Applying the same idea to text means defining what "noise" means for a sequence of discrete tokens — and that turns out to be the interesting part.

## 2. Adding noise to tokens

Images are continuous — a pixel value can be nudged by a small amount, so Gaussian noise makes sense. Tokens are discrete: there's no "slightly wrong" word, only the right one or a different one entirely. So discrete diffusion models define corruption differently. The formulation used by nearly every discrete diffusion language model in practice is absorbing-state, or masking, diffusion — as the corruption level *t* increases from 0 to 1, each token independently has a chance of being replaced by a special `[MASK]` token, and once masked it stays masked until the reverse process restores it.[^2] At *t* = 1, the entire sequence is `[MASK]`; at *t* = 0, it's the untouched original.

$$
q(x_t^i \mid x_0^i) = (1 - t) \cdot \mathbb{1}[x_t^i = x_0^i] + t \cdot \mathbb{1}[x_t^i = \texttt{MASK}]
$$

Each position independently keeps its original token with probability $1-t$, or becomes `MASK` with probability $t$.

This absorbing-state formulation is a special case of the general discrete diffusion framework [[1]](#references), and recent theoretical work shows it implicitly models many conditional distributions of the clean data at once [[4]](#references).

{% include widget-mask-demo.html %}

## 3. Learning to reverse it

Training a discrete diffusion model means teaching a network to undo this corruption: given a partially masked sequence at some level *t*, predict the original tokens underneath the masks. Unlike an autoregressive model, which can only attend to earlier positions, this network sees the entire corrupted sequence at once and predicts every masked position in parallel, conditioning freely on tokens before and after it.

That objective looks a lot like masked language modeling — the pretraining task behind BERT.[^a] The diffusion framing adds a principled loss derived from a variational bound on the data likelihood, which reweights the masked-token cross-entropy by how corrupted the input was [[2]](#references):

$$
\mathcal{L} = \mathbb{E}_t \left[ \frac{1}{t} \sum_{i \,\in\, \text{masked}} -\log p_\theta(x_0^i \mid x_t) \right]
$$

A cross-entropy loss over the masked positions only, upweighted at low corruption and downweighted near $t=1$.

## 4. Trading steps for quality

Generation starts from a sequence that's entirely `[MASK]` and runs the reverse process for T steps,[^3] each one filling in — or firming up — a subset of positions based on the model's predictions, until nothing is left masked. Fewer steps means faster generation but coarser output; more steps means slower generation that tracks the model's real distribution more closely.

This is a genuinely different failure mode than autoregressive decoding. An autoregressive model can't change its mind about a token once it's written; a diffusion model can revise a low-confidence guess in a later step, but it can also lock in a wrong token early and never revisit it if the sampler commits too aggressively.

```
x = [MASK] * length            # start fully masked
for t in linspace(1.0, 0.0, steps):
    p = model(x)                # predict a distribution for every position
    x = remask(x, p, t)         # commit confident predictions, leave
                                 # the rest masked for the next round
return x
```

`steps` is chosen at inference time — independent of sequence length.

## 5. Why bother

Three things fall out of this shape almost for free. Infilling — generating into a fixed template, or fixing the middle of a passage without rewriting everything after it — is native to a model that never assumed a left-to-right order, rather than a special case bolted on. Parallel decoding means wall-clock generation time can, in principle, decouple from sequence length, since many positions update per step instead of one token per forward pass. And reusing the same diffusion machinery already proven on images and audio moves language modeling closer to a shared framework across modalities, instead of a separate autoregressive special case.

## 6. What's still unsettled

None of this is a settled replacement for autoregressive modeling yet. Early discrete diffusion language models trailed well-tuned autoregressive baselines by a wide margin; that gap has narrowed substantially at scale — an 8-billion-parameter diffusion model trained from scratch has been shown to perform comparably to a same-sized autoregressive baseline on general, math, and code benchmarks [[3]](#references) — but it isn't fully closed. Inference now carries an extra knob, the number of sampling steps and the schedule for unmasking, that autoregressive decoding doesn't need. And tooling built around next-token prediction — constrained decoding, KV-caching, most serving infrastructure — doesn't transfer directly to a model that predicts every position at once.

[^1]: Speculative decoding drafts several tokens with a small model and verifies them with the large one — it speeds up autoregressive decoding, but doesn't remove the sequential dependency.
[^2]: An "absorbing" state, in Markov-chain terms, is one you can enter but never leave on your own — the chain exits it only when the reverse process intervenes.
[^3]: T is unrelated to sequence length — a 40-token passage and a 400-token one can both be generated in, say, 32 steps; more steps buys quality, not more tokens.
[^a]: BERT masks a fixed ~15% of tokens once; diffusion training samples t uniformly and can mask anywhere from none to all of them, so the model learns to denoise at every corruption level, not just one.

### References

1. Austin, J., Johnson, D. D., Ho, J., Tarlow, D., & van den Berg, R. (2021). Structured Denoising Diffusion Models in Discrete State-Spaces. *Advances in Neural Information Processing Systems*, 34, 17981–17993.
2. Sahoo, S. S., Arriola, M., Schiff, Y., Gokaslan, A., Marroquin, E., Chiu, J. T., Rush, A. M., & Kuleshov, V. (2024). Simple and Effective Masked Diffusion Language Models. *Advances in Neural Information Processing Systems*.
3. Nie, S., Zhu, F., You, Z., Zhang, X., Ou, J., Hu, J., Zhou, J., Lin, Y., Wen, J.-R., & Li, C. (2025). Large Language Diffusion Models. *International Conference on Machine Learning*. arXiv:2502.09992.
4. Ou, J., Nie, S., Xue, K., Zhu, F., Sun, J., Li, Z., & Li, C. (2025). Your Absorbing Discrete Diffusion Secretly Models the Conditional Distributions of Clean Data. *International Conference on Learning Representations*.
