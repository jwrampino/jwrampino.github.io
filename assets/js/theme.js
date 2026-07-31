// Theme toggle — persists choice, respects prefers-color-scheme on first visit.
// No frameworks, no build step.

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

// Highlight current nav entry (belt-and-suspenders alongside the
// server-rendered aria-current, in case a page's front matter is missing).
(function () {
  var path = window.location.pathname.replace(/\/index\.html$/, "/");
  document.querySelectorAll(".nav a").forEach(function (link) {
    if (link.getAttribute("href") === path) {
      link.classList.add("is-active");
      link.setAttribute("aria-current", "page");
    }
  });
})();
