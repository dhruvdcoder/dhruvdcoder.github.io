/*!
 * reveal.js — progressive-enhancement "scramble reveal" heading effect.
 *
 * Replacement for the Claude Design canvas's React-driven scramble effect
 * (support.js's `sc-if` + IntersectionObserver state machine). Operates on
 * any element with a `data-reveal` attribute: scrambles its text to block
 * characters, then reveals the real characters left-to-right once the
 * element enters the viewport. Degrades to plain, already-correct text if
 * JS is disabled, and is a no-op under prefers-reduced-motion.
 */
(function () {
  "use strict";

  // Same mask character and cadence as the source design (About.dc.html's
  // Component.revealId): every non-space character is replaced with a
  // single solid block, then real characters are patched back in at
  // RANDOM positions (not left-to-right) — 1 or 2 per 45ms tick.
  var MASK_CHAR = "■"; // ■
  var STEP_MS = 45;

  var prefersReducedMotion =
    window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function shuffle(arr) {
    for (var i = arr.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = arr[i]; arr[i] = arr[j]; arr[j] = t;
    }
    return arr;
  }

  function scrambleReveal(el) {
    var finalText = el.textContent;
    if (!finalText || el.dataset.revealDone) return;
    el.dataset.revealDone = "true";

    if (prefersReducedMotion) return; // leave plain text as-is

    var chars = finalText.split("");
    var order = [];
    for (var i = 0; i < chars.length; i++) {
      if (chars[i] !== " ") order.push(i);
    }
    shuffle(order);

    var display = chars.map(function (ch) { return ch === " " ? ch : MASK_CHAR; });
    var done = 0;
    var perTick = order.length > 22 ? 2 : 1;

    function tick() {
      for (var k = 0; k < perTick && done < order.length; k++, done++) {
        display[order[done]] = chars[order[done]];
      }
      el.textContent = display.join("");

      if (done < order.length) {
        setTimeout(tick, STEP_MS);
      }
    }
    // Show the fully-masked state first, then start revealing.
    el.textContent = display.join("");
    setTimeout(tick, STEP_MS);
  }

  function init() {
    var targets = document.querySelectorAll("[data-reveal]");
    if (!targets.length) return;

    if (!("IntersectionObserver" in window)) {
      targets.forEach(scrambleReveal);
      return;
    }

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            scrambleReveal(entry.target);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.4 }
    );

    targets.forEach(function (el) {
      observer.observe(el);
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
