---
layout: page
permalink: /publications/
title: publications
description: Publications by categories in reversed chronological order. For the most up-to-date list check google scholar.
years: [2017, 2020, 2021, 2022]
nav: true
---
<!-- _pages/publications.md -->
<div class="publications">

{% assign sortedyears = page.years | sort | reverse %}
{% for y in sortedyears %}
  <h2 class="year">{{y}}</h2>
  {% bibliography -f mine -q @*[year={{y}}]* %}
{% endfor %}

</div>
