---
layout: page
title: Dhruvesh Patel
permalink: /
hide_title: true
wide: true
---

<div class="hero">
  <div class="hero__body">
    <h1 data-reveal>{{ page.title }}</h1>
    <a href="mailto:dhruveshpate@umass.edu" class="hero__email">dhruveshpate@umass.edu</a>
    <p>
      I am a Computer Science PhD Researcher at <a href="https://www.umass.edu/">UMass Amherst</a>,
      advised by <a href="https://people.cs.umass.edu/~mccallum">Prof. Andrew McCallum</a> at the
      <a href="https://iesl.cs.umass.edu/">Information Extraction and Synthesis Laboratory</a>, and a
      Visiting Researcher at <a href="https://research.ibm.com/">IBM Research</a>. My research focuses
      on generative modeling for discrete sequences, especially alternatives to left-to-right language
      modeling. Before UMass, I completed my undergraduate and first master's degree at
      <a href="https://www.iitm.ac.in">IIT Madras</a>, where I worked on robotics research with
      <a href="https://ed.iitm.ac.in/~sandipan">Prof. Sandipan Bandyopadhyay</a>.
    </p>
    <p>
      I have also been fortunate to work with collaborators across industry research labs, including
      <a href="https://ai.meta.com/">Meta Reality Labs</a> and
      <a href="https://www.abridge.com/ai/publications">Abridge AI</a>. Before graduate school, I spent
      two years as a software engineer at <a href="https://www.mathworks.com/">MathWorks</a> and a year
      collaborating with <a href="http://talukdar.net">Prof. Partha Talukdar</a> on applied NLP problems.
    </p>
    <div class="hero__actions">
      <a href="https://drive.google.com/file/d/1Z8u4_wnQiLDkyiV361f-kGfxHpb6NQCE/view" class="btn">Download CV</a>
      <a href="https://scholar.google.com/citations?user=6F2CvwoAAAAJ" class="btn btn--ghost">Google Scholar</a>
      <a href="https://github.com/dhruvdcoder" class="btn btn--ghost">GitHub</a>
      <a href="https://twitter.com/_dhruveshp" class="btn btn--ghost">Twitter</a>
    </div>
  </div>
  {% include diffusion-photo.html src="/assets/img/headshot.jpg" %}
</div>

<section class="section">
  <div class="section-heading">
    {% include glyph-icon.html %}
    <h2 data-reveal>Research</h2>
  </div>
  <p>
    Most language models generate text one token at a time, from left to right. I am interested in
    models that can draft, revise, infill, and reason over text in more flexible ways. My current
    work focuses on probabilistic models for non-autoregressive sequence generation, with an emphasis
    on making generation faster and more controllable.
  </p>
  <p>
    I am especially interested in how to make these alternatives practical at scale: adapting
    pre-trained autoregressive LLMs, designing efficient non-autoregressive pre-training objectives,
    and improving sampling for discrete diffusion models.
  </p>
  <p>
    Much of my earlier work studies the same question from a more fundamental angle: how should
    neural models represent, score, and search over structured discrete spaces? This includes
    structured prediction with energy-based models, geometric representations such as box
    embeddings, and models for label spaces, hierarchies, and relational structure.
  </p>
  <p>
    Together with <a href="https://brozonoyer.github.io/">Benjamin Rozonoyer</a>, I host
    <a href="https://www.iesl.cs.umass.edu/diffusion">dIESL</a>, a reading and working group on
    non-autoregressive LLMs at IESL.
  </p>
</section>

<section class="section">
  <div class="section-heading">
    {% include glyph-icon.html %}
    <h2 data-reveal>Selected Publications</h2>
  </div>
  <ul style="list-style: none; padding: 0; margin: 0;">
    {% assign selected = site.publications | where: "selected", true | sort: "year" | reverse %}
    {% for pub in selected %}
      {% include publication-item.html pub=pub %}
    {% endfor %}
  </ul>
  <p><a href="{{ '/publications/' | relative_url }}">View all publications &rarr;</a></p>
</section>

<section class="section">
  <div class="section-heading">
    {% include glyph-icon.html %}
    <h2 data-reveal>Affiliations &amp; Internships</h2>
  </div>
  {% for item in site.data.affiliations %}
    {% include affiliation-item.html item=item %}
  {% endfor %}
</section>

<section class="section">
  <div class="section-heading">
    {% include glyph-icon.html %}
    <h2 data-reveal>News</h2>
  </div>
  {% for item in site.data.news %}
    {% include news-item.html item=item %}
  {% endfor %}
</section>

<section class="section">
  <div class="section-heading">
    {% include glyph-icon.html %}
    <h2 data-reveal>Talks</h2>
  </div>
  {% assign sorted_talks = site.data.talks | sort: "sort_date" | reverse %}
  {% for item in sorted_talks %}
    {% include talk-item.html item=item %}
  {% endfor %}
</section>

<section class="section">
  <div class="section-heading">
    {% include glyph-icon.html %}
    <h2 data-reveal>Mentors &amp; Collaborators</h2>
  </div>
  <h3>Current</h3>
  <ul class="mentor-list mentor-list--grid">
    {% for item in site.data.mentors.current %}
      {% include mentor-item.html item=item %}
    {% endfor %}
  </ul>
  <h3>Previous</h3>
  <ul class="mentor-list mentor-list--grid">
    {% for item in site.data.mentors.previous %}
      {% include mentor-item.html item=item %}
    {% endfor %}
  </ul>
</section>

<section class="section">
  <div class="section-heading">
    {% include glyph-icon.html %}
    <h2 data-reveal>Services</h2>
  </div>
  <table class="table">
    <thead>
      <tr><th>Venue</th><th>Role</th><th>Years</th></tr>
    </thead>
    <tbody>
      {% for item in site.data.services %}
        <tr><td>{{ item.venue }}</td><td>{{ item.role }}</td><td>{{ item.years }}</td></tr>
      {% endfor %}
    </tbody>
  </table>
</section>
