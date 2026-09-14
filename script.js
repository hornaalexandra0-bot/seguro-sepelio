(function () {
  "use strict";

  // Footer year
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Mobile nav toggle
  var navToggle = document.getElementById("nav-toggle");
  var mainNav = document.getElementById("main-nav");
  if (navToggle && mainNav) {
    navToggle.addEventListener("click", function () {
      var isOpen = mainNav.classList.toggle("open");
      navToggle.setAttribute("aria-expanded", String(isOpen));
    });
    mainNav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        mainNav.classList.remove("open");
        navToggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  // FAQ accordion
  document.querySelectorAll(".accordion-trigger").forEach(function (trigger) {
    trigger.addEventListener("click", function () {
      var item = trigger.closest(".accordion-item");
      var willOpen = !item.classList.contains("open");

      item.parentElement.querySelectorAll(".accordion-item.open").forEach(function (open) {
        if (open !== item) {
          open.classList.remove("open");
          open.querySelector(".accordion-trigger").setAttribute("aria-expanded", "false");
        }
      });

      item.classList.toggle("open", willOpen);
      trigger.setAttribute("aria-expanded", String(willOpen));
    });
  });

  // Scroll reveal for below-the-fold content only (hero is visible on load, no reveal needed).
  // Skipped entirely under prefers-reduced-motion, handled by the CSS gate.
  var revealTargets = document.querySelectorAll(
    ".feature-text, .feature-media, .step, .faq-inner, .cta-copy, .contact-form"
  );
  revealTargets.forEach(function (el) {
    el.setAttribute("data-reveal", "");
  });

  if ("IntersectionObserver" in window) {
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -60px 0px" }
    );
    revealTargets.forEach(function (el) { observer.observe(el); });
  } else {
    revealTargets.forEach(function (el) { el.classList.add("is-visible"); });
  }

  // Lead form -> prefilled WhatsApp message
  var leadForm = document.getElementById("lead-form");
  if (leadForm) {
    leadForm.addEventListener("submit", function (event) {
      event.preventDefault();
      var data = new FormData(leadForm);
      var nombre = (data.get("nombre") || "").toString().trim();
      var telefono = (data.get("telefono") || "").toString().trim();
      var servicio = (data.get("servicio") || "").toString().trim();
      var mensaje = (data.get("mensaje") || "").toString().trim();

      var lines = [
        "Hola, soy " + nombre + ".",
        "Mi teléfono es " + telefono + ".",
        "Prefiero: " + servicio + ".",
        mensaje ? "Quiero cotizar para: " + mensaje : "Quiero cotizar un seguro de sepelio."
      ];

      var whatsappUrl =
        "https://wa.me/51958524227?text=" + encodeURIComponent(lines.join(" "));

      window.open(whatsappUrl, "_blank", "noopener");
    });
  }

  // Emergency popup: shows once per browser tab session, dismissible
  var popup = document.getElementById("emergency-popup");
  var popupClose = document.getElementById("emergency-popup-close");
  if (popup && popupClose) {
    var dismissed = false;
    try {
      dismissed = sessionStorage.getItem("emergencyPopupDismissed") === "1";
    } catch (e) {}

    if (!dismissed) {
      setTimeout(function () {
        popup.classList.add("visible");
      }, 4000);
    }

    popupClose.addEventListener("click", function () {
      popup.classList.remove("visible");
      try {
        sessionStorage.setItem("emergencyPopupDismissed", "1");
      } catch (e) {}
    });
  }
})();
