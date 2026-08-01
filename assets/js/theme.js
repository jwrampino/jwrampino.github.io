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

// dark mode nav: ls / clear toggle, opens inline on desktop, dropdown on mobile
// state persists per-tab via sessionStorage so it survives page navigation
(function () {
  var toggle = document.getElementById("dir-toggle");
  var listing = document.getElementById("dir-listing");
  if (!toggle || !listing) return;
  var label = toggle.querySelector(".dir-toggle-label");
  var STORAGE_KEY = "jr-dir-open";

  function setOpen(open, persist) {
    toggle.setAttribute("aria-expanded", String(open));
    listing.hidden = !open;
    if (label) label.textContent = open ? "clear" : "ls";
    if (persist !== false) {
      sessionStorage.setItem(STORAGE_KEY, open ? "1" : "0");
    }
  }

  toggle.addEventListener("click", function () {
    setOpen(toggle.getAttribute("aria-expanded") !== "true");
  });

  // close if clicking outside, mobile dropdown case
  document.addEventListener("click", function (e) {
    if (!toggle.contains(e.target) && !listing.contains(e.target)) {
      setOpen(false);
    }
  });

  // restore state from the current session
  if (sessionStorage.getItem(STORAGE_KEY) === "1") {
    setOpen(true, false);
  }
})();