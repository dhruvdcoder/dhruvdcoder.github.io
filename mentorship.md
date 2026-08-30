---
layout: page
title: Mentorship
permalink: /mentorship/
redirect_from:
  - /teaching/
---

<p class="text-muted">Teaching and student mentorship.</p>

<section class="section">
  <div class="section-heading">
    {% include glyph-icon.html %}
    <h2 data-reveal>Teaching</h2>
  </div>
  <h3 class="kicker">UMass Amherst</h3>
  <ul>
    <li><strong>2024.</strong> Teaching Assistant, COMPSCI 696DS (Industry Mentorship Course) with Prof. Andrew McCallum. I manage 25 research projects with 75 MS students and 14 industry partners including Google DeepMind, Meta AI, IBM Research, Adobe Research, Microsoft, and others.</li>
    <li><strong>2020.</strong> Grader, COMPSCI 688: Probabilistic Graphical Models with Prof. Justin Domke.</li>
    <li><strong>2019.</strong> Grader, COMPSCI 691DD: Research Methods in Empirical Computer Science with Prof. David Jensen.</li>
  </ul>
  <h3 class="kicker">IIT Madras</h3>
  <p>During my final year (2015&ndash;2016), I was a graduate teaching assistant in the Dept. of Engineering Design:</p>
  <ul>
    <li>Advanced Product Development Lab (mentored 10 groups of sophomore students)</li>
    <li>Mechanics and Design of Mechanisms (grading; guest lecturer in two classes)</li>
  </ul>
</section>

<section class="section">
  <div class="section-heading">
    {% include glyph-icon.html %}
    <h2 data-reveal>Mentorship</h2>
  </div>
  <p>I have had the fortune of working with some great collaborators and mentees. I have provided mentorship to the following students through various projects and independent studies at UMass Amherst.</p>

  <h3 class="kicker">Ph.D. students</h3>
  <ul class="mentor-list">
    {% for item in site.data.mentees.phd %}
      {% include mentor-item.html item=item %}
    {% endfor %}
  </ul>

  <h3 class="kicker">M.S. students</h3>
  <ul class="mentor-list mentor-list--grid">
    {% for item in site.data.mentees.ms %}
      {% include mentor-item.html item=item %}
    {% endfor %}
  </ul>

  <h3 class="kicker">Undergraduate students</h3>
  <ul class="mentor-list mentor-list--grid">
    {% for item in site.data.mentees.undergrad %}
      {% include mentor-item.html item=item %}
    {% endfor %}
  </ul>
</section>

<section class="section">
  <div class="section-heading">
    {% include glyph-icon.html %}
    <h2 data-reveal>A note for student collaborators</h2>
  </div>
  <p>I'm in charge of collecting student information for independent study projects at IESL. If you are an undergraduate or master's student at UMass interested in doing research at IESL, please fill out this <a href="https://docs.google.com/forms/d/e/1FAIpQLSfYSV23m2_yhMhlPKR0p4wsTPFFJSImr7_JcXQDJeLaOc4n5A/viewform?usp=sf_link">profile form</a> and drop me an email. If you are interested in working with a specific person at IESL, please mention that in your email.</p>
  <p>Every semester we get a lot of requests for independent study projects. We use the profile form to match students with potential mentors from the lab. Following are some helpful tips for making your application stand out.</p>

  <h3>1. Coursework</h3>
  <p>It is good to have a minimum of two relevant graduate-level data science courses from UMass, or their equivalent from another institution:</p>
  <ol class="two-col">
    <li>Reinforcement Learning (COMPSCI 687)</li>
    <li>Advanced NLP (COMPSCI 685/690N/690D)</li>
    <li>Optimization (COMPSCI 690OP/651)</li>
    <li>Computer Vision (COMPSCI 670)</li>
    <li>Neural Networks (COMPSCI 682/691NR)</li>
    <li>Machine Learning (COMPSCI 689)</li>
    <li>Visual Analytics (COMPSCI 690V)</li>
    <li>Intelligent Visual Computing (COMPSCI 674/690IV)</li>
    <li>Algorithms for Data Science (COMPSCI 514)</li>
    <li>Information Retrieval (COMPSCI 646)</li>
  </ol>

  <h3>2. Projects and relevant experience</h3>
  <p>While filling the profile form, we encourage students to talk about their relevant experience, as specifically and technically as possible &mdash; vague descriptions meant for non-technical audiences may leave an unfavorable impression. We look for:</p>
  <ul>
    <li>Whether the student has demonstrated that they take initiative when required</li>
    <li>Whether they can step up to take complete ownership of a project if required</li>
    <li>How the experience relates to the research done at IESL</li>
  </ul>
  <p>A strong project experience will demonstrate contribution to several critical steps of a project's journey &mdash; identifying a problem, identifying suitable data and a modeling approach through a literature survey, and presenting the results to stakeholders through a paper, report, or presentation.</p>
  <p>Note that we don't necessarily care about the outcome of the projects in terms of impact &mdash; we care more about what relevant skills you may have learned through your previous projects.</p>
</section>
