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

<section class="section">
  <p class="section-label">[PHOTOS]</p>
  <h2 class="section-title">Photos</h2>
  <div class="org-group">
    <p class="org-title">{{ site.data.journalism.photos.org }}</p>
    <div class="clip-grid">
      {% for entry in site.data.journalism.photos.entries %}
      {% include clip-card.html entry=entry meta=entry.credit %}
      {% endfor %}
    </div>
  </div>
</section>

<section class="section">
  <p class="section-label">[IN THE PRESS]</p>
  <h2 class="section-title">In the Press</h2>
  <div class="clip-grid">
    {% for entry in site.data.journalism.press %}
    {% assign press_meta = entry.outlet | append: " · " | append: entry.date %}
    {% include clip-card.html entry=entry meta=press_meta %}
    {% endfor %}
  </div>
</section>