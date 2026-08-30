/*!
 * lightbox.js — vanilla-JS image lightbox.
 *
 * Replacement for the Claude Design canvas's React-state-driven lightbox.
 * Any <img data-lightbox="path/to/full.jpg"> opens a full-size overlay on
 * click, with a fade/zoom-in transition (see .dialog-backdrop / .dialog in
 * _sass/_components.scss). Closes on Escape or backdrop click.
 */
(function () {
  "use strict";

  var backdrop, dialog, img, closeBtn;

  function buildDialog() {
    backdrop = document.createElement("div");
    backdrop.className = "dialog-backdrop";
    backdrop.setAttribute("role", "dialog");
    backdrop.setAttribute("aria-modal", "true");
    backdrop.setAttribute("aria-hidden", "true");

    dialog = document.createElement("div");
    dialog.className = "dialog";

    img = document.createElement("img");
    img.alt = "";

    closeBtn = document.createElement("button");
    closeBtn.type = "button";
    closeBtn.className = "visually-hidden";
    closeBtn.textContent = "Close";

    dialog.appendChild(img);
    backdrop.appendChild(dialog);
    backdrop.appendChild(closeBtn);
    document.body.appendChild(backdrop);

    backdrop.addEventListener("click", function (e) {
      if (e.target === backdrop) close();
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && backdrop.classList.contains("is-open")) close();
    });
  }

  function open(src, alt) {
    if (!backdrop) buildDialog();
    img.src = src;
    img.alt = alt || "";
    backdrop.setAttribute("aria-hidden", "false");
    requestAnimationFrame(function () {
      backdrop.classList.add("is-open");
    });
    document.documentElement.style.overflow = "hidden";
  }

  function close() {
    if (!backdrop) return;
    backdrop.classList.remove("is-open");
    backdrop.setAttribute("aria-hidden", "true");
    document.documentElement.style.overflow = "";
  }

  function init() {
    document.addEventListener("click", function (e) {
      var target = e.target.closest && e.target.closest("[data-lightbox]");
      if (!target) return;
      e.preventDefault();
      var src = target.getAttribute("data-lightbox") || target.src;
      open(src, target.alt);
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
