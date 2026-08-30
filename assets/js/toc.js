/*!
 * toc.js — builds the article's table of contents from the post body's
 * own <h2 id="…"> headings (no front-matter list to keep in sync) in two
 * places: an inline list beside the title/byline (.post-toc), and a
 * floating "Contents" dropdown (.post-toc-float) that stays hidden while
 * the header is in view and appears once the reader scrolls past it —
 * so the reading column isn't permanently narrowed by a sidebar.
 * Progressive enhancement: both containers are empty (and CSS-hidden)
 * until this runs.
 */
(function () {
  "use strict";

  function init() {
    var headerToc = document.querySelector(".post-toc");
    var header = document.querySelector(".post-header");
    var floatWrap = document.querySelector(".post-toc-float");
    var floatToggle = document.querySelector(".post-toc-float__toggle");
    var floatPanel = document.querySelector(".post-toc-float__panel");
    var body = document.querySelector(".post-body");
    if (!headerToc || !body) return;

    var headings = body.querySelectorAll("h2[id]");
    if (!headings.length) return;

    var label = document.createElement("div");
    label.className = "post-toc__label";
    label.textContent = "Contents";
    headerToc.appendChild(label);

    function closeFloat() {
      if (!floatToggle || !floatPanel) return;
      floatToggle.setAttribute("aria-expanded", "false");
      floatPanel.classList.remove("is-open");
    }

    var entries = []; // { heading, links: [a, a] } — one link per container
    headings.forEach(function (h) {
      var linkEls = [];

      var a = document.createElement("a");
      a.href = "#" + h.id;
      a.textContent = h.textContent;
      headerToc.appendChild(a);
      linkEls.push(a);

      if (floatPanel) {
        var fa = document.createElement("a");
        fa.href = "#" + h.id;
        fa.textContent = h.textContent;
        fa.addEventListener("click", closeFloat);
        floatPanel.appendChild(fa);
        linkEls.push(fa);
      }

      entries.push({ heading: h, links: linkEls });
    });

    // -- active-section highlighting, applied to every link for a heading --
    if ("IntersectionObserver" in window) {
      function setActive(heading) {
        entries.forEach(function (entry) {
          var active = entry.heading === heading;
          entry.links.forEach(function (link) {
            link.classList.toggle("is-active", active);
          });
        });
      }

      var sectionObserver = new IntersectionObserver(
        function (observed) {
          observed.forEach(function (entry) {
            if (!entry.isIntersecting) return;
            var match = entries.find(function (e) { return e.heading === entry.target; });
            if (match) setActive(match.heading);
          });
        },
        { rootMargin: "-10% 0px -70% 0px" }
      );
      headings.forEach(function (h) { sectionObserver.observe(h); });
    }

    // -- reveal the floating Contents menu once the header scrolls away --
    if (floatWrap && header && "IntersectionObserver" in window) {
      var visibilityObserver = new IntersectionObserver(
        function (observed) {
          observed.forEach(function (entry) {
            floatWrap.classList.toggle("is-visible", !entry.isIntersecting);
            if (entry.isIntersecting) closeFloat();
          });
        },
        { threshold: 0 }
      );
      visibilityObserver.observe(header);
    }

    // -- dropdown open/close --
    if (floatToggle && floatPanel) {
      floatToggle.addEventListener("click", function () {
        var open = floatToggle.getAttribute("aria-expanded") === "true";
        floatToggle.setAttribute("aria-expanded", String(!open));
        floatPanel.classList.toggle("is-open", !open);
      });
      document.addEventListener("click", function (e) {
        if (floatWrap && !floatWrap.contains(e.target)) closeFloat();
      });
      document.addEventListener("keydown", function (e) {
        if (e.key === "Escape") closeFloat();
      });
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
