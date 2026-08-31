---
layout: default
title: CV
navkey: cv
---

<section class="hero">
  <p class="hero-eyebrow">[CV]</p>
  <h1 class="hero-name">CV</h1>
  <p class="hero-desc">See what I've been up to.</p>
</section>

<section class="section">
  <div class="clip-grid">
    {% for doc in site.data.cv.documents %}
    {% include clip-card.html entry=doc glass=true %}
    {% endfor %}
  </div>
</section>
