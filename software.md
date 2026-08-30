---
layout: page
title: Software
permalink: /software/
---

<p class="text-muted">
  Selected open-source research code and utilities. See my
  <a href="https://github.com/dhruvdcoder">GitHub profile</a> for the full list.
</p>

<section class="section">
  <div class="section-heading">
    {% include glyph-icon.html %}
    <h2 data-reveal>Research code</h2>
  </div>
  {% for item in site.data.software.research_code %}
    {% include software-item.html item=item %}
  {% endfor %}
</section>

<section class="section">
  <div class="section-heading">
    {% include glyph-icon.html %}
    <h2 data-reveal>Tools</h2>
  </div>
  {% for item in site.data.software.tools %}
    {% include software-item.html item=item %}
  {% endfor %}
  <p class="text-muted">More at <a href="https://github.com/dhruvdcoder">github.com/dhruvdcoder</a>.</p>
</section>
