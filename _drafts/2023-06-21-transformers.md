---
title: "The Modern Transformer"
subtitle: "The transformer architecture explained end-to-end."
category: llms
role: "PhD Researcher, UMass Amherst"
date: 2023-06-21
updated: 2026-08-30
tags: [language-models]
excerpt: "A compact account of a transformer layer: attention as $\\tilde W_V X A$, the bilinear $W_{KQ}$ rewrite, the softmax-free fast-weight form, a typical fused-QKV implementation, layer norm, and absolute position embeddings."
tikzjax: true
bibtex: |
  @article{patel2023transformers,
    title   = {The Modern Transformer},
    author  = {Patel, Dhruvesh},
    journal = {The Middle Author},
    year    = {2023},
    month   = jun,
    url     = {https://dhruveshp.com/2023/06/21/transformers/}
  }
---

This article emerged from my notes that were aimed at documenting every little detail of the transformer architecture when I was implementing my first model from scratch in xLM {% cite xlm %}. With each section, I will also provide the corresponding implementation in PyTorch from xLM.

## Notation

- Throughout, the transpose of a matrix $M$ is written $\tilde M$ rather than $M^{T}$.

- Activations are in $\color{gray}\text{gray}$; weights are in black.

| Symbol | Meaning | Shape |
| :--- | :--- | :--- |
| $d$ | Hidden / embedding size |  |
| $H$ | Number of attention heads |  |
| $d_{\text{head}}$ | Head size |  |
| $L$ | Number of layers |  |
| $T$ or $T_{Q}$ | Output/Query Sequence length |  |
| $T_{K}$ | Input/Key/Value Sequence length |  |
| $\Gamma$ | A transformer layer | $\mathbb{R}^{T \times d}\to\mathbb{R}^{T \times d}$ |
| $\color{gray}X^{l}$ | Hidden state after layer $l$ | $T \times d$ |
| $\color{gray}A^{l}_{h}$ | Attention weights at layer $l$ and head $h$ | $T_{K} \times T_{Q}$ |
| $W_{h,V}$, $W_{h,Q}$, $W_{h,K}$ | Per-head projection matrices | $d\times d_{\text{head}}$ |


## Input

The input to a transformer layer is a sequence of tokens $w_1, w_2, \ldots, w_T$, which can be represented as a one-hot encoded vector. Each tokens is converted into a $d$-dimensional embedding vector $x_i \in \mathbb{R}^d$. The sequence of embedding vectors is denoted as $X \in \mathbb{R}^{T \times d}$.

```python
# init
self.embed_tokens = nn.Embedding(vocab_size, embedding_dim)
# forward
# input_ids: (B, T)
x = self.embed_tokens(input_ids)
```


Each layer has $H$ self-attention heads, one output projection per head, and a two-layer MLP.
All of these read and write a residual stream, with skip connections and normalization.



## Self-attention

### Normalization

The original transformer paper {% cite vaswaniAttentionAllYou2017 %} places layer normalization (LN) on the residual stream after the output of the self-attention and MLP layers have been applied. This is called the "Post-LN" placement. Denoting the self-attention as the mapping $S: \mathbb{R}^{T \times d}\to\mathbb{R}^{T \times d}$, the output of self-attention followed by post-LN is given by:

$$
X^{l+1} = \text{Norm}(\underbrace{X^{l} + S(X^{l})}_{Y^l})
$$

The gradient of this computation is given by:

$$
\begin{align}
\frac{\partial \mathcal L}{\partial X^{l}} &= \frac{\partial \mathcal L}{\partial X^{l+1}} \frac{\partial \text{Norm}(Y^l)}{\partial Y^l} (I + \frac{\partial S(X^{l})}{\partial X^{l}})\\
\implies \frac{\partial \mathcal L}{\partial X^{l-1}} &= \frac{\partial \mathcal L}{\partial X^{l}} \frac{\partial \text{Norm}(Y^{l-1})}{\partial Y^{l-1}} (I + \frac{\partial S(X^{l})}{\partial X^{l}})
\end{align}
$$

So all terms of the gradient of the lower layers have products of Jacobian of $\text{Norm}$, which is 

There are two placements: Post-LN and Pre-LN.
Xiong et al. {% cite xiongLayerNormalizationTransformer2020 %} show that the original Post-LN Transformer needs a low learning-rate warmup, while Pre-LN does not.

<figure>
  <img src="{{ '/assets/img/posts/transformers-pre-post-ln.png' | relative_url }}" alt="Post-LN versus Pre-LN transformer block" data-lightbox="{{ '/assets/img/posts/transformers-pre-post-ln.png' | relative_url }}">
  <figcaption>
    <b>Figure 2.</b>
    Post-LN (left) versus Pre-LN (right), from Xiong et al. {% cite xiongLayerNormalizationTransformer2020 %}.
  </figcaption>
</figure>

Unlike batch norm, layer norm has one learned scale and shift per dimension, not a single pair for the whole layer.
Given $X\in\mathbb{R}^{d\times T}$, each column is centered and rescaled, then affine-transformed:

$$
\begin{aligned}
LN(X)_{ij}
&= \gamma_{i}\, \frac{x_{ij}-\mu(x_{\cdot,j})}{\sqrt{\mathrm{Var}(x_{\cdot,j})}} + \beta_{i} \\
&= \gamma_{i}\, \hat{x}_{ij} + \beta_{i} \\
\implies LN(X)_{\cdot,j}
&= \underbrace{\mathrm{Diag}(\gamma)}_{d\times d}\,
   \underbrace{\frac{x_{\cdot,j}-\mu_{\cdot,j}}{\sigma_{\cdot,j}}}_{d\times 1} + \beta.
\end{aligned}
$$

Layer-norm parameters (and biases) are usually left out of $\ell_{2}$ regularization.
Setting some $\gamma_{i}=0$ would suppress a dimension; that is available in the parameterization, not something one typically observes.

Subtracting the mean is a projection.
Copying the mean into a constant vector is projection onto the line spanned by $(1,\dots,1)$:

$$
\begin{aligned}
\mu(x) &= \frac{1}{d}\sum_{i=1}^{d} x_{i} \\
\implies \mathbf{1}\, \mu(x) &= \hat{\mathbf{n}}\, \hat{\mathbf{n}}^{\top}\, x,
\end{aligned}
$$

where $\hat{\mathbf{n}}=(1/\sqrt{d},\dots,1/\sqrt{d})$.
Centering therefore projects onto the $(d-1)$-dimensional orthogonal complement of the all-ones vector.

Gradients for the layer-norm map are worked through carefully in [Sinai’s notes](https://liorsinai.github.io/mathematics/2022/05/18/layernorm.html).


Let $X^{l-1}\in\mathbb{R}^{T \times d}$ be the input to layer $\Gamma^{l}$.
The $h$-th head is the mapping $\mathcal{S}_{h}^{l}: \mathbb{R}^{T\times d}\to\mathbb{R}^{T\times d_{\text{head}}}$.

$$
S_{h}^{l}(X) = \tilde W_{V,h}^{l}\, X^{l-1}\, A_{h}^{l},
$$

where

$$
A_{h}^{l} = \sigma(\tilde X^{l-1}\, W_{K,h}^{l}\, \tilde W_{Q,h}^{l}\, X^{l-1})
$$

and $W_{V}, W_{K}, W_{Q}\in \mathbb{R}^{d\times e}$ are the value, key, and query projections.
The map $\sigma: \mathbb{R}^{T\times T}\to \mathbb{R}^{T\times T}$ is column-wise softmax,

$$
\sigma(Z)_{i,j}=\frac{\exp(Z_{i,j}/\lambda)}{\sum_{i=1}^{T}\exp(Z_{i,j}/\lambda)},
$$

with $\lambda$ typically $\sqrt{e}$.
Each column of $A$ sums to $1$, and $A_{i,j}$ is the weight of the $i$-th token (key) when forming the output at the $j$-th token (query).
Most expositions write the transpose of this layout: here columns of $X$ are tokens, and $A$ is keys $\times$ queries.

The product $\tilde W_{V}\, X\, A$ is the picture to keep:

<figure class="tikz-figure">
<div class="tikz-panel">
  <script type="text/tikz">
\begin{document}
\begin{tikzpicture}[x=0.55cm, y=0.55cm]
  \definecolor{WvD}{HTML}{0C8599}
  \definecolor{WvL}{HTML}{E6FCF5}
  \definecolor{XD}{HTML}{4C6EF5}
  \definecolor{XL}{HTML}{BBC7F7}
  \definecolor{Ar}{HTML}{E03131}
  \definecolor{Ao}{HTML}{FA5252}
  \definecolor{Am}{HTML}{FF8787}
  \definecolor{Ap}{HTML}{FFC9C9}
  \definecolor{Aw}{HTML}{FFF5F5}
  \tikzset{cell/.style={draw=black, line width=0.65pt}}
  \foreach \x in {0,...,5} {
    \filldraw[cell, fill=WvD] (\x,5) rectangle ++(1,1);
    \filldraw[cell, fill=WvL] (\x,4) rectangle ++(1,1);
    \filldraw[cell, fill=WvD] (\x,3) rectangle ++(1,1);
  }
  \node[below, text=WvD] at (3,3) {$\tilde W_V \in R^{e \times d}$};
  \node at (6.55,4.5) {$\times$};
  \foreach \y in {0,...,5} {
    \filldraw[cell, fill=XD] (7.3,\y) rectangle ++(1,1);
    \filldraw[cell, fill=XL] (8.3,\y) rectangle ++(1,1);
    \filldraw[cell, fill=XD] (9.3,\y) rectangle ++(1,1);
    \filldraw[cell, fill=XL] (10.3,\y) rectangle ++(1,1);
  }
  \node[below, text=XD] at (9.3,0) {$X \in R^{d \times T}$};
  \node at (11.85,4) {$\times$};
  \foreach \x/\c in {0/Ar, 1/Aw, 2/Am, 3/Aw} {
    \filldraw[cell, fill=\c] ({13.5+\x},5) rectangle ++(1,1);
  }
  \foreach \x/\c in {0/Ao, 1/Ap, 2/Ar, 3/Ar} {
    \filldraw[cell, fill=\c] ({13.5+\x},4) rectangle ++(1,1);
  }
  \foreach \x/\c in {0/Ap, 1/Am, 2/Ap, 3/Am} {
    \filldraw[cell, fill=\c] ({13.5+\x},3) rectangle ++(1,1);
  }
  \foreach \x/\c in {0/Aw, 1/Ar, 2/Aw, 3/Ap} {
    \filldraw[cell, fill=\c] ({13.5+\x},2) rectangle ++(1,1);
  }
  \node[below, text=Ar] at (15.5,2) {$A \in R^{T \times T}$};
  \foreach \i/\lab in {0/q_1, 1/q_2, 2/q_3, 3/q_4} {
    \node[above, inner sep=1pt] at ({14+\i},6) {$\lab$};
  }
  \foreach \i/\lab in {0/k_4, 1/k_3, 2/k_2, 3/k_1} {
    \node[left, inner sep=1pt] at (13.5,{2.5+\i}) {$\lab$};
  }
\end{tikzpicture}
\end{document}
  </script>
</div>
<figcaption>
  <b>Figure 1.</b>
  Value projection times residual times attention: $\tilde W_V$ mixes dimensions, $A$ mixes time.
  Darker cells in $A$ are larger attention weights.
  Columns of $A$ are queries; rows are keys.
</figcaption>
</figure>

The residualized multi-head output is

$$
\mathcal{S}^{l}(X)=X + \sum_{h=1}^{H} W_{O,h}^{l}\, S_{h}^{l}(X),
$$

with $W_{O,h}\in \mathbb{R}^{d\times e}$.

### What $A$ and the projections do

$A$ performs a convex combination across time — time mixing.
The projections mix across dimensions, and those weights do not sum to $1$.

Because $e<d$, $\tilde W_{V,h}\in \mathbb{R}^{e \times d}$ sends each column of $X$ into a lower-dimensional space.

If $A$ is treated as fixed (independent of $X$), then $S$ is linear:

$$
S(\alpha X + \beta Y)= \tilde W_{V} (\alpha X + \beta Y) A = \alpha S(X) + \beta S(Y).
$$

Even when $A$ is a nonlinear function of $X$, the dimension mixing stays linear, because the projection does not depend on $X$:

$$
S(\alpha X + \beta Y)= \alpha \tilde W_{V} X A(Z) + \beta \tilde W_{V} Y A(Z),
\qquad Z=\alpha X+\beta Y.
$$

A superposition $X+Y$ on the residual stream therefore changes the attention pattern nonlinearly and the projections linearly — the right picture if one reads the residual stream as associative memory.

### Attention logits are bilinear and low-rank

The pre-softmax scores are bilinear in the residual stream: linear in each argument separately.
The two projections can be folded into one matrix without changing the formula,

$$
\tilde X\, W_{K,h}^{l}\, \tilde W_{Q,h}^{l}\, X = \tilde X\, W_{KQ,h}^{l}\, X,
\qquad W_{KQ,h}^{l} := W_{K,h}^{l}\,\tilde W_{Q,h}^{l} \in \mathbb{R}^{d\times d},
$$

so $A_{h}^{l} = \sigma(\tilde X^{l-1}\, W_{KQ,h}^{l}\, X^{l-1})$.
This is the circuits $W_{QK}$, transposed to the column-as-token convention used here.

The collapse is only notational unless $\operatorname{rank}(W_{KQ})\le e$.
A free $d\times d$ matrix is a larger class; $W_{K}\tilde W_{Q}$ has rank at most $e<d$.
The factored form costs $O(Tde + T^{2} e)$; a dense $d\times d$ product is $O(Td^{2} + T^{2} d)$.

Do not collapse in the implementation, or in the mechanistic story, once the $e$-vectors matter.
RoPE (and most relative positions) act on $q$ and $k$ after the projections;
the KV cache stores keys, not $W_{KQ}$;
GQA/MQA, Q/K biases, and the fast-weight rewrite $S(X)_{\cdot,t}=\sum_{s}(v_{s}\otimes k_{s})\,q_{t}$ all need the split.
Cross-attention uses two streams, so $W_{K}\tilde W_{Q}$ is still a $d\times d$ kernel but is not a bilinear form in a single $X$.
$W_{V}$ and $W_{O}$ sit on a different path and cannot be folded into $W_{KQ}$.

## Fast weights

Start from

$$
\begin{aligned}
S(X) &= \tilde W_{V}\, X\, A \\
&= (\tilde W_{V}\, X)\, \sigma(\tilde X\, W_{K})(\tilde W_{Q}\, X) \\
&= X_{V}\, \sigma(\tilde X_{K}\, X_{Q}).
\end{aligned}
$$

Writing $(X_{*})_{ij}$ as $*_{ij}$,

$$
S(X)_{ij}=\sum_{s=1}^{T} v_{is}\,
\frac{\exp\bigl(\sum_{l=1}^{e} \tilde k_{sl}\, q_{lj}\bigr)}
{\sum_{s^{\prime}=1}^{T}\exp\bigl(\sum_{l=1}^{e} \tilde k_{s^{\prime}l}\, q_{lj}\bigr)}.
$$

Drop softmax and contract in Einstein notation:

$$
\begin{aligned}
S(X)_{ij} &= v_{is}\, \tilde k_{sl}\, q_{lj} \\
&= v_{is}\, k_{ls}\, q_{lj} \\
&= \sum_{s}\sum_{l} r_{il}^{s}\, q_{lj},
\qquad r_{il}^{s} = v_{is}k_{ls} \\
\implies S(X) &= \sum_{s} X_{R}^{s}\, X_{Q},
\qquad (X_{R}^{s})_{il} = v_{is}k_{ls} \\
\implies S(X) &= \sum_{s} (v_{\cdot,s} \otimes k_{\cdot,s})\, X_{Q} \\
\implies S(X)_{\cdot,t} &= \sum_{s=1}^{t} (\mathbf{v}_{s} \otimes \mathbf{k}_{s})\cdot \mathbf{q}_{t}.
\end{aligned}
$$

Here $\mathbf{v}_{s}$ and $\mathbf{k}_{s}$ are the value and key at position $s$.
The sum runs only to $t$ to encode a causal mask.

The same sum reassociates as a write-then-read on an $e\times e$ matrix:

$$
S(X)_{\cdot,t}
= \sum_{s=1}^{t} (k_{s}\cdot q_{t})\, v_{s}
= \Bigl(\sum_{s=1}^{t} v_{s}\otimes k_{s}\Bigr) q_{t}.
$$

$W_{Q},W_{K},W_{V}$ are slow weights.
$W_{t}=\sum_{s=1}^{t} v_{s}\otimes k_{s}$ is a fast weight: programmed on the fly, Hebbian update $W_{t}=W_{t-1}+v_{t}\otimes k_{t}$, then $S_{\cdot,t}=W_{t} q_{t}$.
That is a linear key–value store (correlation / Hopfield memory): write $(k_{s},v_{s})$ by outer product, read with $q$.
If keys are roughly orthogonal and $q\approx k_{s}$, then $Wq\approx v_{s}$; otherwise there is crosstalk.
Softmax changes the read, not the idea: it is a normalized exponential retrieval, and the history can no longer be folded into a query-independent $W_{t}$.
The rewrite therefore needs softmax dropped, or replaced by a kernel $\varphi(k)^{\top}\varphi(q)$.

### Is the rewrite useful? (2021–2026)

The derivation above is the 2021 starting point {% cite schlagLinearTransformersSecretly2021 %}.
The field treated it as a design primitive, not as a trick that makes softmax Transformers cheaper.
The useful move was not “attention is $\sum_{s} v_{s}\otimes k_{s}$.”
It was: that write rule is a bad memory, so change the write.

Vanilla additive outer products interfere.
Capacity scales like the key dimension; there is no overwrite and no forget.
Irie and Gershman survey the line by putting almost every recent linear model in one table: the same $e\times e$ state, different local losses / update rules {% cite irieFastWeightProgramming2025 %}.

- Linear Transformer / vanilla FWP {% cite katharopoulosTransformersRNNsFast2020 schlagLinearTransformersSecretly2021 %}: $W\leftarrow W+v\otimes k$. Weak recall; mostly historical.
- **DeltaNet** {% cite schlagLinearTransformersSecretly2021 yangParallelizingLinearTransformers2024 %}: delta / error-correcting write $W\leftarrow W+\eta(v-Wk)\otimes k$.
  The first rule that actually does associative recall.
  Parallel training (Householder / WY + chunkwise) is what made this real at 1.3B parameters / 100B tokens.
- GLA, RetNet, Mamba-2, xLSTM: forget / decay on $W$. Cheap long context; still weaker retrieval than softmax.
- **Gated DeltaNet** {% cite yangGatedDeltaNetworks2025 %}: delta plus data-dependent forget.
  The strongest linear layer in several bakeoffs.
- TTT, Titans, MesaNet, Atlas (2024–25): treat $W$ as test-time SGD / a small net, not one outer product.
- **Hybrids**: some softmax layers plus many fast-weight layers.
  What actually shipped.

Qwen3-Next (2025) is a 3:1 mix of Gated DeltaNet and gated softmax attention {% cite qwen3next2025 %}.
Gated DeltaNet beat sliding-window attention and Mamba-2 for in-context learning; the hybrid beat either pure stack.
That is this outer-product memory in a frontier model, used for linear-time long context, not as a rewrite of GPT attention.

Usefulness, by setting:

- **Softmax Transformer** (this note’s main object): almost no engineering payoff.
  Softmax couples every key to this query, so the past cannot be folded into a query-independent $W_{t}$.
  FlashAttention, KV cache, RoPE, and GQA stay in the dual (token-list) form.
  Collapsing $W_{K}\tilde W_{Q}$ does not change that.
  The Hopfield reading {% cite ramsauerHopfieldNetworksAll2021 %} is a good story for why softmax retrieves sharply; it does not change the implementation.
- **Long-context / efficient architectures**: yes.
  The write rule matters more than the kernel.
  Additive Hebbian $v\otimes k$ saturates; delta (overwrite) and gates (forget) are the upgrades that matter.
  A fixed-size matrix state is $O(1)$ per token at decode, versus a growing KV cache (why Qwen swapped roughly $75\%$ of layers).
  Softmax still wins precise retrieval.
  Complementarity: Transformer $=$ bounded context, high precision; FWP $=$ unbounded, lower precision, sometimes more expressivity (parity / state tracking).
  Hybrids are the engineering answer, not “replace attention.”
  Mamba-2, GLA, RetNet, DeltaNet, and Gated DeltaNet are the same object with different $\mathcal{L}_{t}(W)$.
- **Residual stream as memory**: moderately useful.
  Superposition of $(k,v)$ pairs and crosstalk is the right picture.
  Softmax attention is still better thought of as an explicit key–value list, not a compressed $W$.
- **In-context learning**: later papers treat the fast-weight update as mesa-optimization (one step of regression on $(k,v)$).
  Gated DeltaNet is stronger at ICL than Mamba-2 or sliding-window attention;
  it is still not a substitute for softmax on needle-style retrieval unless some full-attention layers remain.

Keep the derivation.
Treat vanilla $\sum v\otimes k$ as the diagnosis (interference, no edit, no forget), not a recipe.
The insight became useful when people changed the write — delta, gates, test-time SGD — and hybridized with softmax.

## Typical implementation

It is common to choose $d$ divisible by $H$ and set $e=d/H$.
All QKV projections for all heads are then one matrix multiply:

$$
R_{3He\times T} =
\begin{bmatrix}
\tilde W_{Q,1}\\
\vdots\\
\tilde W_{Q,H}\\
\tilde W_{K,1}\\
\vdots\\
\tilde W_{K,H}\\
\tilde W_{V,1}\\
\vdots\\
\tilde W_{V,H}
\end{bmatrix}_{3He\times d}
X_{d\times T}.
$$

The three projection stacks are stored as a single parameter of shape $3He\times d$:

```python
# assuming d = embed_dim
if embed_dim == num_heads * proj_dim:  # more common
    self.in_proj_weight = Parameter(torch.empty((3 * embed_dim, embed_dim)))
    self.out_proj_weight = Parameter(torch.empty(embed_dim, embed_dim))
else:
    self.in_proj_weight = Parameter(torch.empty((3 * num_heads * proj_dim, embed_dim)))  # (3He, d)
    self.out_proj_weight = Parameter(torch.empty(embed_dim, num_heads * proj_dim))
```

$R$ has everything needed for $S(X)$.
Let $\bar S\in \mathbb{R}^{H\times e\times T}$ stack the per-head outputs,
$\bar R\in \mathbb{R}^{T\times 3\times H\times e}$ be the reshaped $R$ (second axis: query, key, value),
and $\bar A\in \mathbb{R}^{H\times T\times T}$ the unnormalized scores.
In Einstein notation,

$$
\bar A_{h,i,j} = \frac{\bar R_{i,2,h,k}\, \bar R_{j,1,h,k}}{\sqrt{e}}.
$$

Two implementations, including a batch axis:

```python
# Implementation 1
# x shape (b, T, d)
R_bar = torch.nn.functional.linear(x, self.in_proj_weight, bias=None)  # (b, T, 3He)
R_bar = R_bar.view(b, T, 3, H, e)
A_bar = torch.einsum("bi2hk, bj1hk->bhij", R_bar, R_bar)  # (b, H, T, T)
A_bar = A_bar / math.sqrt(e)

# Implementation 2
qkv_tuple = torch.nn.functional.linear(x, self.in_proj_weight, bias=None).chunk(3, dim=-1)
q, k, v = map(lambda t: t.view(b, T, H, e).transpose(1, 2), qkv_tuple)  # (b, H, T, e)

attn_output = torch.nn.functional.scaled_dot_product_attention(
    q, k, v,
    attn_mask=attn_mask,
    dropout_p=self.dropout.p if self.training else 0.0,
)  # (b, H, T, e)
```

`scaled_dot_product_attention` uses FlashAttention when it can.[^sdpa]

Softmax over the key axis of $\tilde A$:

$$
A_{h,i,j} = \frac{\exp(\tilde A_{h,i,j})}{\sum_{i^{\prime}=1}^{T}\exp(\tilde A_{h,i^{\prime},j})}.
$$

```python
# Implementation 1
A = torch.nn.functional.softmax(A_bar, dim=2)
# Implementation 2: nothing extra
```

Values mix with those weights,

$$
\tilde S_{h,k,t} = \tilde R_{i,3,h,k}\, A_{h,i,t},
$$

```python
# Implementation 1
S_tilde = torch.einsum("bi3hk,bhit->bhkt", R_bar, A)  # (b, H, e, T)
# Implementation 2: nothing extra
```

and the output $S\in\mathbb{R}^{d\times T}$ is

$$
S_{i,t} = \tilde W_{O,h,i,j}\, \tilde S_{h,j,t},
$$

with $\tilde W_{O}\in\mathbb{R}^{H\times d\times e}$.

```python
# Implementation 1
out_proj_weight = self.out_proj_weight.view(H, d, e)
S = torch.einsum("hij, bhjt->bit", out_proj_weight, S_tilde)
x = residual + S

# Implementation 2
attn_out = attn_output.transpose(1, 2).contiguous().view(b, T, d)
S = torch.nn.functional.linear(attn_out, self.out_proj_weight, bias=False)
x = residual + S
```

`torch.nn.MultiheadAttention` does this with two extra optimizations:[^mha]
it calls `scaled_dot_product_attention` (FlashAttention when possible),
and it takes a fast path in eval mode with gradients off when $Q=K=V$ (self-attention).

[^sdpa]: [torch.nn.functional.scaled_dot_product_attention](https://pytorch.org/docs/stable/generated/torch.nn.functional.scaled_dot_product_attention.html)
[^mha]: [torch.nn.MultiheadAttention](https://pytorch.org/docs/stable/generated/torch.nn.MultiheadAttention.html#multiheadattention)


## Position embeddings

Position information is needed for time mixing; it is not, in general, helpful for dimension (channel) mixing.
There are three families.

1. **Absolute.** Introduced with BERT; rarely used in deployed models now.
2. **Relative.** Introduced with Transformer-XL.
   Attention depends on the offset between key and query, not on a vector added to the input embedding.
3. **Rotary (RoPE).**
   A block-diagonal rotation encodes the absolute position of each key and query, so relative offsets appear directly in the dot product.
   Su et al. give a compact account {% cite suRoFormerEnhancedTransformer2023 %};
   [this video](https://www.youtube.com/watch?v=GQPOtyITy54) is a clear walkthrough.

For the rest of this section, $q,k,v\in\mathbb{R}^{e}$ are a single head’s query, key, and value, and

$$
A_{n,m}=\sigma(s(q_{m}, k_{n})),
$$

with $s$ typically a dot product and $\sigma$ softmax on the key axis.
Let $m,n$ be the time indices of query and key, and let $f_{q}, f_{k}, f_{v}$ inject position while forming $q,k,v$.

### Absolute position embeddings

$$
\{q_{i}, k_{i}, v_{i}\}
\coloneqq
f_{\{q,k,v\}}(x, i)
= W_{\{Q,K,V\}}\, (x + p_{i}),
$$

where $p_{i}\in\mathbb{R}^{d}$ is a (usually fixed) position vector, applied only at the first layer.

The matrix $P\in\mathbb{R}^{T\times d}$ is typically built from sinusoids at exponentially decaying frequencies.
For example,

$$
P_{t,k}=
\begin{cases}
\sin(t\,\omega_{\gamma(k)}), & \text{if $k$ is even}, \\
\cos(t\,\omega_{\gamma(k)}), & \text{if $k$ is odd},
\end{cases}
$$

where $\gamma(k)=2\lfloor k/2\rfloor$ and $\omega_{\gamma(k)}=\exp\bigl(-(\gamma(k)/d)\log\alpha\bigr)$.
So $(\omega_{\gamma(k)})=(1, 1/\exp((2/d)\log\alpha),\dots,1/\alpha)$, with $\alpha$ a large constant such as $10000$, typically larger than $T$.
The idea is a bank of frequencies with few high-frequency dimensions.
Because $t$ is an integer, $P_{i,k}=P_{j,k}$ for $i\neq j$ is rare.
Any construction with that qualitative shape is expressively similar.
One implementation:

```python
class PositionalEncoding(nn.Module):
    def __init__(self, d_model: int, max_len: int = 1024):
        super().__init__()
        pe = torch.zeros(max_len, d_model)
        position = torch.arange(0, max_len, dtype=torch.float).unsqueeze(1)
        div_term = torch.exp(
            torch.arange(0, d_model, 2).float()
            * (-math.log(10000.0) / d_model)
        )
        pe[:, 0::2] = torch.sin(position * div_term)
        pe[:, 1::2] = torch.cos(position * div_term)
        pe = pe.unsqueeze(0).transpose(0, 1)  # (max_len, 1, d_model)
        self.register_buffer("pe", pe)

    def forward(self, x):
        return self.pe[: x.size(0), :]
```

Relative and rotary embeddings keep the same $s(q,k)$ skeleton but move position into the score, rather than adding $p_{i}$ to $x$.
The details of those families are left for a later note.

## References

{% bibliography --cited_in_order %}
