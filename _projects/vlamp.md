---
layout: paper
title: "Pretrained Language Models as Visual Planners for Human Assistance"
permalink: /projects/vlamp/
redirect_from:
  - /projects/vlamp_iccv_2023
  - /projects/vlamp_iccv_2023/
teaser: /assets/img/publication_preview/vlamp_teaser.png
authors:
  - name: "Dhruvesh Patel"
    url: "https://dhruveshp.com"
  - name: "Hamid Eghbalzadeh"
    url: "https://eghbalz.github.io/"
  - name: "Nitin Kamra"
    url: "https://nitinkamra1992.github.io/"
  - name: "Michael L. Iuzzolino"
    url: "https://michael-iuzzolino.github.io/"
  - name: "Unnat Jain"
    url: "https://unnat.github.io/"
  - name: "Ruta Desai"
    url: "https://rutadesai.github.io/"
affiliations:
  - name: "UMass Amherst"
  - name: "Meta Reality Labs"
  - name: "Meta AI Research"
links:
  - name: "Code"
    url: "https://github.com/facebookresearch/VLaMP"
  - name: "arXiv"
    url: "https://arxiv.org/abs/2304.09179"
  - name: "PDF"
    url: "https://openaccess.thecvf.com/content/ICCV2023/papers/Patel_Pretrained_Language_Models_as_Visual_Planners_for_Human_Assistance_ICCV_2023_paper.pdf"
abstract: >
  To make progress towards multi-modal AI assistants which can guide users to achieve complex multi-step goals, we propose the task of Visual Planning for Assistance (VPA).
  Given a goal briefly described in natural language, e.g., "make a shelf", and a video of the user's progress so far, the aim of VPA is to obtain a plan, i.e., a sequence of actions such as "sand shelf", "paint shelf", etc. to achieve the goal.
  This requires assessing the user's progress from the untrimmed video, and relating it to the requirements of the underlying goal, i.e., relevance of actions and ordering dependencies amongst them.
  Consequently, this requires handling long video history, and arbitrarily complex action dependencies.
  To address these challenges, we decompose VPA into video action segmentation and forecasting.
  We formulate the forecasting step as a multi-modal sequence modeling problem and present Visual Language Model based Planner (VLaMP), which leverages pre-trained LMs as the sequence model.
  We demonstrate that VLaMP performs significantly better than baselines with respect to all metrics that evaluate the generated plan.
  Moreover, through extensive ablations, we also isolate the value of language pre-training, visual observations, and goal information on the performance.
  We release our data, model, and code to enable future research on Visual Planning for Assistance.
bibtex: |
  @InProceedings{Patel_2023_ICCV,
      author    = {Patel, Dhruvesh and Eghbalzadeh, Hamid and Kamra, Nitin and Iuzzolino, Michael Louis and Jain, Unnat and Desai, Ruta},
      title     = {Pretrained Language Models as Visual Planners for Human Assistance},
      booktitle = {Proceedings of the IEEE/CVF International Conference on Computer Vision (ICCV)},
      month     = {October},
      year      = {2023},
      pages     = {15302-15314}
  }
---
