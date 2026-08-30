/*!
 * widgets.js — vanilla-JS replacements for the Claude Design canvas's
 * React-state-driven "Try it" widgets in Article.dc.html: a live masking-
 * schedule demo, and the citation box's copy-to-clipboard button. Both are
 * plain progressive enhancement — the markup they attach to is meaningful
 * (a labeled range input, real BibTeX in a <pre>) without JS.
 */
(function () {
  "use strict";

  // -- masking-schedule demo ------------------------------------------------------------
  function initMaskDemo(root) {
    var words = (root.dataset.words || "the model learns to predict masked tokens").split(" ");
    // Deterministic per-word "unmask threshold" (0-100), spread across the
    // range so the demo reveals words gradually as t increases.
    var thresholds = words.map(function (_, i) {
      return Math.round(((i * 53 + 15) % 90) + 5);
    });

    var tokensEl = root.querySelector(".widget-box__tokens");
    var slider = root.querySelector('input[type="range"]');
    var scaleT = root.querySelector("[data-scale-t]");
    var svg = root.querySelector("svg");
    var marker = svg && svg.querySelector("[data-marker]");
    var markerLine = svg && svg.querySelector("[data-marker-line]");
    var stepPath = svg && svg.querySelector("[data-step-path]");
    if (!tokensEl || !slider) return;

    words.forEach(function (w) {
      var span = document.createElement("span");
      span.className = "widget-box__token";
      span.textContent = w;
      tokensEl.appendChild(span);
    });
    var tokenEls = tokensEl.querySelectorAll(".widget-box__token");

    var W = 280, H = 120, padL = 30, padR = 10, padT = 10, padB = 22;
    function xOf(t) { return padL + (t / 100) * (W - padL - padR); }
    function yOf(frac) { return (H - padB) - frac * (H - padT - padB); }

    var sorted = thresholds.slice().sort(function (a, b) { return a - b; });
    if (stepPath) {
      var d = "M " + xOf(0) + " " + yOf(0);
      var frac = 0;
      sorted.forEach(function (th) {
        d += " L " + xOf(th) + " " + yOf(frac);
        frac += 1 / words.length;
        d += " L " + xOf(th) + " " + yOf(frac);
      });
      d += " L " + xOf(100) + " " + yOf(frac);
      stepPath.setAttribute("d", d);
    }

    function render() {
      var t = Number(slider.value);
      tokenEls.forEach(function (el, i) {
        el.classList.toggle("is-masked", thresholds[i] <= t);
        el.textContent = thresholds[i] <= t ? "[MASK]" : words[i];
      });
      if (scaleT) scaleT.textContent = "t = " + t + "%";
      var curFrac = sorted.filter(function (th) { return th <= t; }).length / words.length;
      if (marker) { marker.setAttribute("cx", xOf(t)); marker.setAttribute("cy", yOf(curFrac)); }
      if (markerLine) { markerLine.setAttribute("x1", xOf(t)); markerLine.setAttribute("x2", xOf(t)); }
    }

    slider.addEventListener("input", render);
    render();
  }

  // -- cite-box copy button ------------------------------------------------------------
  function initCiteCopy(root) {
    var btn = root.querySelector("[data-copy-bibtex]");
    var pre = root.querySelector("pre");
    if (!btn || !pre) return;
    var defaultLabel = btn.textContent;
    btn.addEventListener("click", function () {
      var text = pre.textContent;
      var done = function () {
        btn.textContent = "Copied!";
        setTimeout(function () { btn.textContent = defaultLabel; }, 1600);
      };
      if (navigator.clipboard) {
        navigator.clipboard.writeText(text).then(done, done);
      } else {
        done();
      }
    });
  }

  function init() {
    document.querySelectorAll(".widget-mask-demo").forEach(initMaskDemo);
    document.querySelectorAll(".cite-box").forEach(initCiteCopy);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
