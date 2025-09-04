---
layout: paper_project
title: "Insertion Language Models: Sequence Generation with Arbitrary-Position Insertions"
importance: 1
permalink: /projects/ilm

# Authors
authors:
  - name: "Dhruvesh Patel"
    url: "https://dhruveshp.com"
    #equal_contrib: true
  - name: "Aishwarya Sahoo"
    url: "https://www.linkedin.com/in/aishwarya-sahoo-x/"
  - name: "Avinash Amballa"
    url: "https://www.linkedin.com/in/avinashamballa/"
  - name: "Tahira Naseem"
    url: "https://scholar.google.com/citations?user=IoVlb40AAAAJ&hl=en"
  - name: "Tim Rudner"
    url: "https://timrudner.com/"
  - name: "Andrew McCallum"
    url: "https://people.cs.umass.edu/~mccallum/"

# Affiliations
affiliations:
  - name: "UMass Amherst"
    #conference: "Conference Name 2024"
  - name: "IBM Research"
  - name: "New York University"

# Links section
links:
  - name: "Paper"
    url: "https://arxiv.org/pdf/2505.05755.pdf"
    icon: "fas fa-file-pdf"
  - name: "Code"
    url: "https://github.com/dhruvdcoder/ILM"
    icon: "fab fa-github"
  - name: "arXiv"
    url: "https://arxiv.org/abs/2505.05755"
    icon: "ai ai-arxiv"

# Teaser video
teaser_video:
  url: "/assets/video/teaser.mp4"
  poster: "/assets/img/ilm_teaser.png"
  autoplay: true
  controls: true
  muted: true
  loop: true
  caption: "ARMs (top) generate variable-length sequences in a fixed left-to-right order.
    MDMs (middle) can add tokens in arbitrary order but require a fixed number of tokens to be masked. ILMs (bottom) generate sequences of arbitrary lengths in arbitrary order by inserting tokens."

# Abstract
abstract: |
  Autoregressive models (ARMs), which predict subsequent tokens one-by-one ``from left to right,'' have achieved significant success across a wide range of sequence generation tasks. However, they struggle to accurately represent sequences that require satisfying sophisticated constraints or whose sequential dependencies are better addressed by out-of-order generation. Masked Diffusion Models (MDMs) address some of these limitations, but the process of unmasking multiple tokens simultaneously in MDMs can introduce incoherences, and MDMs cannot handle arbitrary infilling constraints when the number of tokens to be filled in is not known in advance. In this work, we introduce Insertion Language Models (ILMs), which learn to insert tokens at arbitrary positions in a sequence---that is, they select jointly both the position and the vocabulary element to be inserted. By inserting tokens one at a time, ILMs can represent strong dependencies between tokens, and their ability to generate  sequences in arbitrary order allows them to accurately model sequences where token dependencies do not follow a left-to-right sequential structure. To train ILMs, we propose a tailored network parameterization and use a simple denoising objective. Our empirical evaluation demonstrates that ILMs outperform both ARMs and MDMs on common planning tasks. Furthermore, we show that ILMs outperform MDMs and perform on par with ARMs in an unconditional text generation task while offering greater flexibility than MDMs in arbitrary-length text infilling.

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
  @misc{patel2025insertion,
    title={Insertion Language Models: Sequence Generation with Arbitrary-Position Insertions},
    author={Dhruvesh Patel and Aishwarya Sahoo and Avinash Amballa and Tahira Naseem and Tim G. J. Rudner and Andrew McCallum},
    year={2025},
    eprint={2505.05755},
    archivePrefix={arXiv},
    primaryClass={cs.CL}
  }

# Use al-folio's native styling instead of external frameworks
include_bulma_css: false
include_carousel_js: true
---

