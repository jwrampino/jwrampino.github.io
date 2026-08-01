# jwrampino.github.io

jekyll site

## structure

- `_layouts/default.html` - shared layout, nav, toggle, footer
- `_includes/nav-tabs.html` - light mode nav
- `_includes/nav-dir.html` - dark mode nav
- `_data/nav.yml` - nav entries, edit to add/remove pages
- `assets/css/style.css` - both palettes as css vars. `:root` = light, `[data-theme="dark"]` = dark
- `assets/js/theme.js` - toggle logic, localstorage persisted
- `index.md`, `cv/index.md`, `research/index.md`, `journalism/index.md`, `contact/index.md` - page content

## add a page

mkdir pagename, add pagename/index.md:
```
---
layout: default
title: Talks
navkey: talks
---
```
add matching entry to `_data/nav.yml`.

## deploy

push to main. settings > pages > source: main, root.  
live at jwrampino.github.io in a minute or two.  

## credits

some icons: lucide.dev (ISC license)  
analytics: goatcounter.com