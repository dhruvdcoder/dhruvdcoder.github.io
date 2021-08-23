---
layout: page
title: timeline
permalink: /timeline/
description: Professional journey
nav: false
---

<div class="timeline">
<div class="container row">
    {% assign steps = site.timeline | sort: 'date' %}
    {% for step in steps reversed %}
    <div class="item">
        <i class="vertical-line"></i>
        <h2 class="item-date">{{ step.date | date: '%m/%Y' }} - {% if step.enddate %} {{ step.enddate | date: '%m/%Y' }} {% else %} present {% endif %}</h2>
        <div class="card-panel">
	    {% if step.title_url %}
	    <a href="{{ step.title_url }}">
            <h3 class="card-title">
                {{ step.title }}
            </h3>
	    </a>
	    {% else %}
            <h3 class="card-title">
                {{ step.title }}
            </h3>
	    {% endif %}
            {% include timeline_card.html %}
        </div>
    </div>
    {% endfor %}
    <div class="last-item">
        <i class="vertical-line"></i>
    </div>
</div>
</div>
