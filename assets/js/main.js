(function () {
  "use strict";

  /* Header: Hintergrund verdichten nach dem Scrollen */
  var header = document.querySelector(".site-header");
  if (header) {
    var onScroll = function () {
      header.classList.toggle("is-scrolled", window.scrollY > 12);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  /* Mobile Navigation */
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.getElementById("main-nav");
  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var open = nav.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", String(open));
    });
    nav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        nav.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  /* Preis-Tabs */
  var tabs = document.querySelectorAll(".price-tab");
  var panels = document.querySelectorAll(".price-panel");
  tabs.forEach(function (tab) {
    tab.addEventListener("click", function () {
      tabs.forEach(function (t) { t.setAttribute("aria-selected", "false"); });
      panels.forEach(function (p) { p.classList.remove("is-active"); });
      tab.setAttribute("aria-selected", "true");
      var panel = document.getElementById(tab.getAttribute("aria-controls"));
      if (panel) panel.classList.add("is-active");
    });
  });

  /* Terminanfrage-Formular (statisch, ohne Backend) */
  var form = document.getElementById("appointment-form");
  var status = document.getElementById("form-status");
  if (form && status) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }
      status.dataset.state = "ok";
      status.textContent =
        "Danke für Ihre Anfrage! Dieses Formular ist als statischer Entwurf angelegt – " +
        "für den echten Betrieb muss es an ein Formular-Backend oder eine E-Mail-Weiterleitung " +
        "angebunden werden.";
      form.reset();
    });
  }

  /* Jahr im Footer */
  var yearEl = document.getElementById("current-year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());
})();
