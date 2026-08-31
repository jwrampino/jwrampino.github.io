---
layout: default
title: CV
navkey: cv
---

<section class="hero">
  <p class="hero-eyebrow">[CV]</p>
  <h1 class="hero-name">CV</h1>
  <p class="hero-desc">Current resume and full academic CV, both downloadable as PDF.</p>
</section>

<section class="section">
  <div class="clip-grid">
    {% for doc in site.data.cv.documents %}
    {% include clip-card.html entry=doc %}
    {% endfor %}
  </div>
</section>
