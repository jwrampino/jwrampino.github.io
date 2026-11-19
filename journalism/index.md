---
layout: default
title: Journalism
navkey: journalism
---

<section class="hero">
  <p class="hero-eyebrow">[JOURNALISM]</p>
  <h1 class="hero-name">Journalism</h1>
  <p class="hero-desc">Selected bylines and photographs.</p>
</section>

<section class="section">
  <p class="section-label">[CLIPS]</p>
  <h2 class="section-title">Clips</h2>
  {% for group in site.data.journalism.clips %}
  <div class="org-group">
    <p class="org-title">{{ group.org }}</p>
    <div class="clip-grid">
      {% for entry in group.entries %}
      {% include clip-card.html entry=entry %}
      {% endfor %}
    </div>
  </div>
  {% endfor %}
</section>
