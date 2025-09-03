---
layout: distill
title: "Dynamic decoding: An evidential approach to text generation"
description: Generating text using Belief Functions.
tags: [uncertainty, belief functions, LLMs]
giscus_comments: true
date: 2023-10-25
featured: true

authors:
  - name: Dhruvesh Patel
    url: "https://dhruveshp.com"
    affiliations:
      name: University of Massachusetts Amherst

bibliography: dynamic-decoding.bib
# Optionally, you can add a table of contents to your post.
# NOTES:
#   - make sure that TOC names match the actual section names
#     for hyperlinks within the post to work correctly.
#   - we may want to automate TOC generation in the future using
#     jekyll-toc plugin (https://github.com/toshimaru/jekyll-toc).
toc:
  - name: Introduction
  - name: What are Belief Functions?

---
# Introduction
A so called causal language model, is a parametric model of the conditional probability of the next token $t_i$ given the previous tokens $t_{<i}$, i.e., $p_\theta(t_i\mid t_{<i})$.
Once trained, the model is used to generate text using ancestral sampling or greedy decoding.
It is well known that greedy decoding perform well on open-ended text generation. Specifically, it produces repetitive and generic text. However, vanilla ancestral sampling is not a good alternative either. It produces text that is incoherent and often grammatically incorrect <d-cite key="holtzmanCuriousCaseNeural2019"></d-cite>.
To overcome this issue, various methods have been proposed <d-cite key="holtzmanCuriousCaseNeural2019,hewittTruncationSamplingLanguage2022,meister2023locally"></d-cite>, which rely on sampling from a modified, more reliable next token distribution.
The key assumption behind all these methods is that the model cannot represent the true next token distribution faithfully. 
Specifically, the softmax function, used in the final layer of the model to produce the probability distribution over the next token, performs excessive smoothing.

In this post we will investigate if an alternative method of modeling uncertainty, namely belief functions <d-cite key="shaferMathematicalTheoryEvidence1976"></d-cite>, can be used to model the process of generating text better.

# What are Belief Functions?

