---
layout: paper_project
title: "A Continuous-Time Markov Chain Framework for Insertion Language Models"
importance: 1
category: research
permalink: /projects/ctmc-ilm

# Authors
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

# Affiliations
affiliations:
  - name: "UMass Amherst"
  - name: "IBM Research"
  - name: "University of Toronto"
  - name: "Vector Institute"

# Links section
links:
  - name: "Paper"
    url: "https://openreview.net/forum?id=nCyV21FmUI"
    icon: "fas fa-file-alt"
  - name: "AISTATS 2026"
    url: "https://aistats.org/aistats2026/"
    icon: "fas fa-calendar"
  - name: "Code"
    url: "https://github.com/dhruvdcoder/ctmc_dilm"
    icon: "fab fa-github"

# Teaser video (add under /assets when available)
#teaser_video:
#  url: "/assets/video/ctmc_ilm_teaser.mp4"
#  poster: "/assets/img/ctmc_ilm_teaser.png"
#  autoplay: true
#  controls: true
#  muted: true
#  loop: true
#  caption: "Overview of insertion language models and the diffusion-style CTMC derivation (AISTATS 2026 slides)."

# Abstract
abstract: |
  Insertion Language Models (ILMs) offer several advantages over left-to-right generation and mask-based generation. However, existing formulations of insertion-based generation have largely been ad-hoc. In this paper, we derive a diffusion-style denoising objective for ILMs from first principles by formulating the noising process as a continuous-time Markov chain on the space of variable-length sequences. We show that previous formulations of ILMs can be viewed as special cases of this denoising framework. Through empirical evaluation on a synthetic planning task, we show that the proposed approach retains the benefits of insertion-based generation over left-to-right generation and masked diffusion models. In language modeling, our diffusion-based approach is competitive with left-to-right generation and masked diffusion models, while offering additional flexibility in sampling compared to existing insertion language models.

## Image carousel
#image_carousel:
#  title: "Results Gallery"
#  images:
#    - url: "/assets/img/result1.jpg"
#      alt: "Alt text"
#      caption: "Image description"
#
## YouTube video (talk recording)
#youtube_video:
#  title: "AISTATS 2026 talk"
#  url: "https://www.youtube.com/embed/VIDEO_ID"
#
## Poster
#poster:
#  title: "Poster"
#  url: "/assets/pdf/ctmc_ilm_poster.pdf"
#  height: "600"

# BibTeX citation — update volume/pages when Proceedings of ML Research entry is official
bibtex: |
  @inproceedings{patel2026continuous,
    title={{A Continuous-Time Markov Chain Framework for Insertion Language Models}},
    author={Patel, Dhruvesh and Rozonoyer, Benjamin and Das, Soumitra and Naseem, Tahira and Rudner, Tim G. J. and McCallum, Andrew},
    booktitle={Proceedings of the International Conference on Artificial Intelligence and Statistics (AISTATS)},
    year={2026},
    url={https://openreview.net/forum?id=nCyV21FmUI},
    note={(to appear)}
  }

# Use al-folio's native styling instead of external frameworks
include_bulma_css: false
include_carousel_js: true
---
