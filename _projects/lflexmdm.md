---
layout: paper
title: "Insertion Based Sequence Generation with Learnable Order Dynamics"
permalink: /projects/lflexmdm/
teaser: /assets/img/publication_preview/lflexmdm_generation.gif
authors:
  - name: "Dhruvesh Patel"
    url: "https://dhruveshp.com"
  - name: "Benjamin Rozonoyer"
    url: "https://brozonoyer.github.io/"
  - name: "Gaurav Pandey"
    url: "https://scholar.google.com/citations?user=MjYpRw8AAAAJ&hl=en"
  - name: "Tahira Naseem"
    url: "https://scholar.google.com/citations?user=IoVlb40AAAAJ&hl=en"
  - name: "Ramón Fernandez Astudillo"
    url: "https://ramon-astudillo.github.io/"
  - name: "Andrew McCallum"
    url: "https://people.cs.umass.edu/~mccallum/"
affiliations:
  - name: "UMass Amherst"
  - name: "IBM Research"
links:
  - name: "arXiv"
    url: "https://arxiv.org/abs/2602.18695"
  - name: "PDF"
    url: "https://openreview.net/pdf?id=gPxxn38tAK"
  - name: "Code"
    url: "https://github.com/dhruvdcoder/LFlexMDM"
abstract: >
  In many domains generating variable length sequences through insertions provides greater flexibility over autoregressive models.
  However, the action space of insertion models is much larger than that of autoregressive models (ARMs) making the learning challenging.
  To address this, we incorporate trainable order dynamics into the target rates for discrete flow matching, and show that with suitable choices of parameterizations, joint training of the target order dynamics and the generator is tractable without the need for numerical simulation.
  As the generative insertion model, we use a variable length masked diffusion model, which generates by inserting and filling mask tokens.
  On graph traversal tasks for which a locally optimal insertion order is known, we explore the choices of parameterization empirically and demonstrate the trade-offs between flexibility, training stability and generation quality.
  On de novo small molecule generation, we find that the learned order dynamics leads to an increase in the number of valid molecules generated and improved quality, when compared to uniform order dynamics.
bibtex: |
  @misc{patel2026insertionbasedsequencegeneration,
      title={Insertion Based Sequence Generation with Learnable Order Dynamics},
      author={Dhruvesh Patel and Benjamin Rozonoyer and Gaurav Pandey and Tahira Naseem and Ramón Fernandez Astudillo and Andrew McCallum},
      year={2026},
      eprint={2602.18695},
      archivePrefix={arXiv},
      primaryClass={cs.LG},
      url={https://arxiv.org/abs/2602.18695},
  }
---
