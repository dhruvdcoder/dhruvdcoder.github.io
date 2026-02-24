---
layout: paper_project
title: "Insertion Based Sequence Generation with Learnable Order Dynamics"
importance: 1
permalink: /projects/lflexmdm

# Authors
authors:
  - name: "Dhruvesh Patel"
    url: "https://dhruveshp.com"
  - name: "Benjamin Rozonoyer"
    url: "https://brozonoyer.github.io/"
  - name: "Gaurav Pandey"
    url: "https://scholar.google.com/citations?user=MjYpRw8AAAAJ&hl=en"
  - name: "Tahira Naseem"
    url: "https://scholar.google.com/citations?user=IoVlb40AAAAJ&hl=en"
  - name: "Ramon Fernandez Astudillo"
    url: "https://ramon-astudillo.github.io/"
  - name: "Andrew McCallum"
    url: "https://people.cs.umass.edu/~mccallum/"

# Affiliations
affiliations:
  - name: "UMass Amherst"
  - name: "IBM Research"

# Links section
links:
  - name: "ArXiv"
    url: "https://arxiv.org/abs/2602.18695"
    icon: "ai ai-arxiv"
  - name: "Code"
    url: "https://github.com/dhruvdcoder/LFlexMDM"
    icon: "fab fa-github"

# Teaser video
#teaser_video:
#  url: "/assets/video/teaser.mp4"
#  poster: "/assets/img/ilm_teaser.png"
#  autoplay: true
#  controls: true
#  muted: true
#  loop: true
#  caption: "ARMs (top) generate variable-length sequences in a fixed left-to-right order.
#    MDMs (middle) can add tokens in arbitrary order but require a fixed number of tokens to be masked. ILMs (bottom) generate sequences of arbitrary lengths in arbitrary order by inserting tokens."

# Abstract
abstract: |
  In many domains generating variable length sequences through insertions provides greater flexibility over autoregressive models. However, the action space of insertion models is much larger than that of autoregressive models (ARMs) making the learning challenging. To address this, we incorporate trainable order dynamics into the target rates for discrete flow matching, and show that with suitable choices of parameterizations, joint training of the target order dynamics and the generator is tractable without the need for numerical simulation. As the generative insertion model, we use a variable length masked diffusion model, which generates by inserting and filling mask tokens. On graph traversal tasks for which a locally optimal insertion order is known, we explore the choices of parameterization empirically and demonstrate the trade-offs between flexibility, training stability and generation quality. On de novo small molecule generation, we find that the learned order dynamics leads to an increase in the number of valid molecules generated and improved quality, when compared to uniform order dynamics.


## Image carousel
#image_carousel:
#  title: "Results Gallery"
#  images:
#    - url: "/assets/img/result1.jpg"
#      alt: "Alt text"
#      caption: "Image description"
#    - url: "/assets/img/result2.jpg"
#      caption: "Another description"
#
## YouTube video
#youtube_video:
#  title: "Video Presentation"
#  url: "https://www.youtube.com/embed/VIDEO_ID"
#
## Video carousel
#video_carousel:
#  title: "Demonstrations"
#  videos:
#    - url: "/assets/video/demo1.mp4"
#      autoplay: true
#      controls: true
#      muted: true
#      loop: true
#      caption: "Demo description"
#
## Poster
#poster:
#  title: "Poster"
#  url: "/assets/pdf/poster.pdf"
#  height: "600"

# BibTeX citation
bibtex: |
  @misc{patel2026insertionbasedsequencegeneration,
      title={Insertion Based Sequence Generation with Learnable Order Dynamics}, 
      author={Dhruvesh Patel and Benjamin Rozonoyer and Gaurav Pandey and Tahira Naseem and Ramón Fernandez Astudillo and Andrew McCallum},
      year={2026},
      eprint={2602.18695},
      archivePrefix={arXiv},
      primaryClass={cs.LG},
      url={https://arxiv.org/abs/2602.18695},}

# Use al-folio's native styling instead of external frameworks
include_bulma_css: false
include_carousel_js: true
---

