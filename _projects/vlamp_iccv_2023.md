---
layout: distill
title: Pretrained Language Models as Visual Planners for Human Assistance
permalink: /projects/vlamp
github_repo: https://github.com/iesl/box-mlc-iclr-2022
img: "/assets/img/vlamp_teaser.png"
importance:  1
category:  research 
giscus_comments: true
date: 2023-07-30
authors:
  - name: Dhruvesh Patel
    url: "https://dhruveshp.com"
    affiliations:
      name: UMass Amherst
  - name: Hamid Eghbalzadeh 
    url: "https://eghbalz.github.io/"
    affiliations:
      name: Meta Reality Labs
  - name: Nitin Kamra
    url: "https://nitinkamra1992.github.io/"
    affiliations: 
      name: Meta Reality Labs
  - name: Michael L. Iuzzolino
    url: "https://michael-iuzzolino.github.io/"
    affiliations:
      name: Meta Reality Labs
  - name: Unnat Jain
    url: "https://unnat.github.io/"
    affiliations:
      name: Meta AI Research
  - name: Ruta Desai
    url: "https://rutadesai.github.io/"
    affiliations:
      name: Meta Reality Labs

bibliography: vlamp.bib

---

<div style="display: flex; justify-content: center; align-items: center;">
  <a href="https://github.com/facebookresearch/VLaMP" style="margin: 0 15px;">[Code]</a>
  <a href="https://arxiv.org/abs/2304.09179" style="margin: 0 15px;">[ArXiv]</a>
  <a href="https://openaccess.thecvf.com/content/ICCV2023/papers/Patel_Pretrained_Language_Models_as_Visual_Planners_for_Human_Assistance_ICCV_2023_paper.pdf" style="margin: 0 15px;">[PDF]</a>
  <!-- Add more links as you like -->
</div>


<br><br><br>
{% include figure.html path="assets/img/vlamp_teaser.jpg" class="img-fluid rounded z-depth-1" zoomable=true %}
<br><br><br>
To make progress towards multi-modal AI assistants which can guide users to achieve complex multi-step goals, we propose the task of  *Visual Planning for Assistance (VPA)*.
Given a goal briefly described in natural language, e.g., "make a shelf", and a video of the user's progress so far, the aim of VPA is to obtain a plan, i.e., a sequence of actions such as "sand shelf", "paint shelf", etc. to achieve the goal.
This requires assessing the user's progress from the untrimmed video, and relating it to the requirements of underlying goal, i.e., relevance of actions and ordering dependencies amongst them.
Consequently, this requires handling long video history, and arbitrarily complex action dependencies.
To address these challenges, we decompose VPA into video action segmentation and forecasting.
We formulate the forecasting step as a multi-modal sequence modeling problem and present **V**isual **La**nguage **M**odel based **P**lanner (**VLaMP**), which leverages pre-trained LMs as the sequence model.
We demonstrate that \M performs significantly better than baselines w.r.t all metrics that evaluate the generated plan.
Moreover, through extensive ablations, we also isolate the value of language pre-training, visual observations, and goal information on the performance.
We release our data, model, and code to enable future research on Visual Planning for Assistance.
<hr> 

### Cite

```bibtex
@InProceedings{Patel_2023_ICCV,
    author    = {Patel, Dhruvesh and Eghbalzadeh, Hamid and Kamra, Nitin and Iuzzolino, Michael Louis and Jain, Unnat and Desai, Ruta},
    title     = {Pretrained Language Models as Visual Planners for Human Assistance},
    booktitle = {Proceedings of the IEEE/CVF International Conference on Computer Vision (ICCV)},
    month     = {October},
    year      = {2023},
    pages     = {15302-15314}
}
```