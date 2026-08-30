---
layout: paper
title: "A Continuous-Time Markov Chain Framework for Insertion Language Models"
permalink: /projects/ctmc-dilm/
teaser: /assets/img/publication_preview/ctmc_insertion.gif
authors:
  - name: "Dhruvesh Patel"
    url: "https://dhruveshp.com"
  - name: "Benjamin Rozonoyer"
    url: "https://brozonoyer.github.io/"
  - name: "Soumitra Das"
    url: "https://www.linkedin.com/in/soumitra-das-043bb8184/"
  - name: "Tahira Naseem"
    url: "https://scholar.google.com/citations?user=IoVlb40AAAAJ&hl=en"
  - name: "Tim G. J. Rudner"
    url: "https://timrudner.com/"
  - name: "Andrew McCallum"
    url: "https://people.cs.umass.edu/~mccallum/"
affiliations:
  - name: "UMass Amherst"
  - name: "IBM Research"
  - name: "University of Toronto"
  - name: "Vector Institute"
links:
  - name: "Paper"
    url: "https://openreview.net/forum?id=nCyV21FmUI"
  - name: "AISTATS 2026"
    url: "https://aistats.org/aistats2026/"
  - name: "Code"
    url: "https://github.com/dhruvdcoder/ctmc_dilm"
abstract: >
  Insertion Language Models (ILMs) offer several advantages over left-to-right generation and mask-based generation.
  However, existing formulations of insertion-based generation have largely been ad-hoc.
  In this paper, we derive a diffusion-style denoising objective for ILMs from first principles by formulating the noising process as a continuous-time Markov chain on the space of variable-length sequences.
  We show that previous formulations of ILMs can be viewed as special cases of this denoising framework.
  Through empirical evaluation on a synthetic planning task, we show that the proposed approach retains the benefits of insertion-based generation over left-to-right generation and masked diffusion models.
  In language modeling, our diffusion-based approach is competitive with left-to-right generation and masked diffusion models, while offering additional flexibility in sampling compared to existing insertion language models.
bibtex: |
  @inproceedings{patel2026continuous,
    title={{A Continuous-Time Markov Chain Framework for Insertion Language Models}},
    author={Patel, Dhruvesh and Rozonoyer, Benjamin and Das, Soumitra and Naseem, Tahira and Rudner, Tim G. J. and McCallum, Andrew},
    booktitle={Proceedings of the International Conference on Artificial Intelligence and Statistics (AISTATS)},
    year={2026},
    url={https://openreview.net/forum?id=nCyV21FmUI},
    note={(to appear)}
  }
---
