// theme toggle, persists via localstorage, respects prefers-color-scheme on first load

(function () {
  var root = document.documentElement;
  var btn = document.getElementById("theme-toggle");
  if (!btn) return;

  btn.addEventListener("click", function () {
    var current = root.getAttribute("data-theme");
    var next = current === "dark" ? "light" : "dark";
    root.setAttribute("data-theme", next);
    localStorage.setItem("jr-theme", next);
    if (next === "dark" && window.jrTypeLsOnActivate) window.jrTypeLsOnActivate();
  });
})();

// backup active-nav check in case front matter is missing navkey
(function () {
  var path = window.location.pathname.replace(/\/index\.html$/, "/");
  document.querySelectorAll(".nav a").forEach(function (link) {
    if (link.getAttribute("href") === path) {
      link.classList.add("is-active");
      link.setAttribute("aria-current", "page");
    }
  });
})();

// terminal-style typewriter, block cursor trailing the text as it builds
function jrSleep(ms) {
  return new Promise(function (resolve) { setTimeout(resolve, ms); });
}
async function jrTypeText(el, text, speed) {
  for (var i = 0; i <= text.length; i++) {
    el.textContent = text.slice(0, i) + (i < text.length ? "\u2588" : "");
    await jrSleep(speed || 100);
  }
}
async function jrTypeEntry(entry, speed) {
  if (!entry.dataset.origHtml) entry.dataset.origHtml = entry.innerHTML;
  var fullText = entry.textContent;
  await jrTypeText(entry, fullText, speed);
  entry.innerHTML = entry.dataset.origHtml; // restore real markup/styling
}
// clear entries (and mobile branch spans) to empty before they're ever
// shown, so nothing flashes full-text before the typing animation starts
function jrPrimeEntries(entries, branches) {
  entries.forEach(function (entry) {
    if (!entry.dataset.origHtml) entry.dataset.origHtml = entry.innerHTML;
    entry.textContent = "";
  });
  if (branches) {
    branches.forEach(function (branch) {
      branch.textContent = "";
      branch.closest("li").classList.remove("is-visible");
    });
  }
}
// staggered cascade: each row starts shortly after the previous one.
// desktop: just types each entry. mobile: reveals the row (which expands
// its collapsed height via CSS transition), types the tree branch, then
// the entry text, so the dropdown box grows as the tree writes itself out.
function jrTypeEntriesCascade(entries, branches, speed, stagger, isMobile) {
  var entrySpeed = isMobile ? Math.round(speed * 1.1) : speed;
  var branchSpeed = 30; // for mobile (branches only ever render on mobile)
  var promises = [];
  entries.forEach(function (entry, i) {
    var branch = branches ? branches[i] : null;
    promises.push(jrSleep(i * stagger).then(async function () {
      if (isMobile && branch) {
        branch.closest("li").classList.add("is-visible");
        await jrTypeText(branch, branch.dataset.full, branchSpeed);
      }
      return jrTypeEntry(entry, entrySpeed);
    }));
  });
  return Promise.all(promises);
}

// dark mode nav: ls / clear toggle, opens inline on desktop, dropdown on mobile
// state persists per-tab via sessionStorage on desktop only, matching the
// 640px CSS breakpoint. mobile always starts collapsed. label and listing
// entries type themselves out, terminal-style, on every state change.
(function () {
  var toggle = document.getElementById("dir-toggle");
  var listing = document.getElementById("dir-listing");
  if (!toggle || !listing) return;
  var label = toggle.querySelector(".dir-toggle-label");
  var entries = Array.prototype.slice.call(listing.querySelectorAll(".dir-entry"));
  var branches = Array.prototype.slice.call(listing.querySelectorAll(".dir-branch"));
  var STORAGE_KEY = "jr-dir-open";
  var isDesktop = window.matchMedia("(min-width: 641px)").matches;
  var busy = false;

  jrPrimeEntries(entries, branches); // start empty, always, so opening never flashes full text

  async function setOpen(open, persist, animate) {
    toggle.setAttribute("aria-expanded", String(open));

    if (animate === false) {
      listing.hidden = !open;
      if (label) label.textContent = open ? "clear" : "ls";
      if (open) {
        entries.forEach(function (e) { e.innerHTML = e.dataset.origHtml; });
        branches.forEach(function (b) {
          b.textContent = b.dataset.full;
          b.closest("li").classList.add("is-visible");
        });
      }
    } else if (open) {
      if (label) await jrTypeText(label, "clear", 110);
      listing.hidden = false;
      await jrTypeEntriesCascade(entries, branches, 18, 70, !isDesktop);
    } else {
      if (label) await jrTypeText(label, "ls", 110);
      listing.hidden = true;
      jrPrimeEntries(entries, branches); // reset for next open
    }

    if (persist !== false && isDesktop) {
      sessionStorage.setItem(STORAGE_KEY, open ? "1" : "0");
    }
  }

  toggle.addEventListener("click", async function () {
    if (busy) return;
    busy = true;
    await setOpen(toggle.getAttribute("aria-expanded") !== "true");
    busy = false;
  });

  // close if clicking outside, mobile dropdown case
  document.addEventListener("click", function (e) {
    if (!busy && !toggle.contains(e.target) && !listing.contains(e.target)) {
      setOpen(false);
    }
  });

  // restore state from the current session, desktop only, no animation
  if (isDesktop && sessionStorage.getItem(STORAGE_KEY) === "1") {
    setOpen(true, false, false);
  } else if (label && !document.hidden) {
    // type out "ls" once on initial load, when starting collapsed
    jrTypeText(label, "ls", 110);
  }

  // exposed so the theme toggle can trigger this when switching into dark mode
  window.jrTypeLsOnActivate = function () {
    if (label && listing.hidden) jrTypeText(label, "ls", 110);
  };
})();

// light mode nav: compass / pin toggle, same behavior as the dark mode
// listing, just a different visual language. needle points to current
// page's bearing when closed, centers to neutral when open.
(function () {
  var toggle = document.getElementById("compass-toggle");
  var listing = document.getElementById("compass-listing");
  var nav = document.querySelector(".nav-compass");
  var needle = document.getElementById("compass-needle");
  if (!toggle || !listing || !nav || !needle) return;
  var STORAGE_KEY = "jr-compass-open";
  var isDesktop = window.matchMedia("(min-width: 641px)").matches;

  function jiggle() {
    needle.classList.remove("jiggle");
    needle.getBoundingClientRect(); // force reflow so the animation can restart (offsetWidth doesn't reliably work on SVG elements)
    needle.classList.add("jiggle");
  }

  function setOpen(open, persist) {
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "close site map" : "open site map");
    listing.hidden = !open;
    nav.classList.toggle("is-open", open);
    if (persist !== false && isDesktop) {
      sessionStorage.setItem(STORAGE_KEY, open ? "1" : "0");
    }
  }

  toggle.addEventListener("click", function () {
    setOpen(toggle.getAttribute("aria-expanded") !== "true");
    jiggle();
  });

  document.addEventListener("click", function (e) {
    if (!toggle.contains(e.target) && !listing.contains(e.target)) {
      setOpen(false);
    }
  });

  if (isDesktop && sessionStorage.getItem(STORAGE_KEY) === "1") {
    setOpen(true, false);
  }

  jiggle(); // settle flourish on page load, always lands on this page's bearing
})();