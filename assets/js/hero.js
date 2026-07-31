/**
 * Hero-Section: gepinnte Scroll-Rotation + Pointer-Parallaxe + Kreidelinie.
 * Reine CSS-Transforms (transform/opacity), rAF-gebündelt, pausiert außerhalb
 * des Viewports und deaktiviert bei prefers-reduced-motion.
 */
(function () {
  "use strict";

  var pin = document.querySelector(".hero-pin");
  if (!pin) return;

  var stage = pin.querySelector(".hero-visual-3d");
  var chalkPath = pin.querySelector(".hero-chalkline path");
  var sheen = pin.querySelector(".hero-sheen");
  var sticky = pin.querySelector(".hero-sticky");

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var canHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  if (reduceMotion) {
    // Statischer Zustand: keine Rotation, Kreidelinie sofort sichtbar (CSS übernimmt das).
    return;
  }

  var MAX_ROTATE_Y = 20; // Grad, dreht "nach links" (negative Y-Rotation)
  var MAX_TILT_X = 3;
  var CHALK_END = 0.45; // Kreidelinie ist bei 45% des Pin-Fortschritts fertig gezeichnet
  var CHALK_LEN = 460;

  var scrollProgress = 0;
  var pointerX = 0; // -1..1
  var pointerY = 0; // -1..1
  var ticking = false;
  var visible = false;

  function clamp(v, min, max) { return Math.max(min, Math.min(max, v)); }

  function readScrollProgress() {
    var rect = pin.getBoundingClientRect();
    var total = rect.height - window.innerHeight;
    if (total <= 0) return 1;
    var scrolled = -rect.top;
    return clamp(scrolled / total, 0, 1);
  }

  function apply() {
    ticking = false;
    scrollProgress = readScrollProgress();

    var rotateY = -MAX_ROTATE_Y * scrollProgress + pointerX * 2.2;
    var rotateX = MAX_TILT_X * (1 - scrollProgress * 0.4) * -pointerY;
    var translateZ = -40 * scrollProgress;

    stage.style.transform =
      "rotateY(" + rotateY.toFixed(2) + "deg) " +
      "rotateX(" + rotateX.toFixed(2) + "deg) " +
      "translateZ(" + translateZ.toFixed(1) + "px)";

    if (chalkPath) {
      var chalkProgress = clamp(scrollProgress / CHALK_END, 0, 1);
      chalkPath.style.strokeDashoffset = String(CHALK_LEN * (1 - chalkProgress));
    }

    pin.classList.toggle("is-done", scrollProgress > 0.96);
  }

  function requestTick() {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(apply);
    }
  }

  window.addEventListener("scroll", requestTick, { passive: true });
  window.addEventListener("resize", requestTick);

  if (canHover) {
    sticky.addEventListener("pointermove", function (e) {
      var rect = sticky.getBoundingClientRect();
      pointerX = clamp(((e.clientX - rect.left) / rect.width - 0.5) * 2, -1, 1);
      pointerY = clamp(((e.clientY - rect.top) / rect.height - 0.5) * 2, -1, 1);
      requestTick();
    }, { passive: true });

    sticky.addEventListener("pointerleave", function () {
      pointerX = 0;
      pointerY = 0;
      requestTick();
    });
  }

  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      visible = entry.isIntersecting;
      if (visible) requestTick();
    });
  }, { threshold: 0 });
  io.observe(pin);

  // Initiale Lichtkante einmalig nach dem Laden abspielen.
  window.requestAnimationFrame(function () {
    if (sheen) {
      requestAnimationFrame(function () { sheen.classList.add("run"); });
    }
    apply();
  });
})();
