---
layout: about
title: about
permalink: /
#description: <a href="#current_affiliations">Current </a> and <a href="#past_affiliations">past</a> affiliations.


profile:
  align: right
  image: dp.jpg
  address: >
     <p>dhruveshpate@umass.edu</p>
  image_circular: false # crops the image to make it circular


news: true  # includes a list of news items
latest_posts: false  # includes a list of the newest posts
selected_papers: true # includes a list of papers marked as "selected={true}"
collaborators: true
timeline: true
reviewing: true
social: true  # includes social icons at the bottom of the page
---


I am a Computer Science PhD Researcher at [UMass Amherst](https://www.umass.edu/), advised by [Prof. Andrew McCallum](https://people.cs.umass.edu/~mccallum) at the [Information Extraction and Synthesis Laboratory](https://iesl.cs.umass.edu/), and a Visiting Researcher at [IBM Research](https://research.ibm.com/).
My research focuses on generative modeling for discrete sequences, especially alternatives to left-to-right language modeling.
Before UMass, I completed my undergraduate and first master's degree at [IIT Madras](https://www.iitm.ac.in), where I worked on robotics research with [Prof. Sandipan Bandyopadhyay](https://ed.iitm.ac.in/~sandipan).

I have also been fortunate to work with collaborators across industry research labs, including [Meta Reality Labs](https://ai.meta.com/) and [Abridge AI](https://www.abridge.com/ai/publications).
Before graduate school, I spent two years as a software engineer at [MathWorks](https://www.mathworks.com/) and a year collaborating with [Prof. Partha Talukdar](http://talukdar.net) on applied NLP problems.

CV available at the bottom of this page.

## research

Most language models generate text one token at a time, from left to right.
I am interested in models that can draft, revise, infill, and reason over text in more flexible ways.
My current work focuses on probabilistic models for non-autoregressive sequence generation, with an emphasis on making generation faster and more controllable.

I am especially interested in how to make these alternatives practical at scale: adapting pre-trained autoregressive LLMs, designing efficient non-autoregressive pre-training objectives, and improving sampling for discrete diffusion models.

Much of my earlier work studies the same question from a more fundamental angle: how should neural models represent, score, and search over structured discrete spaces?
This includes structured prediction with energy-based models, geometric representations such as box embeddings, and models for label spaces, hierarchies, and relational structure.

<div class="soft-callout-card" markdown="1">

Together with [Benjamin Rozonoyer](https://brozonoyer.github.io/), I run [dIESL](https://www.iesl.cs.umass.edu/diffusion), a reading and working group on non-autoregressive LLMs at IESL.

</div>
