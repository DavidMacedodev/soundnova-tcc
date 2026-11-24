/* SoundNova Pro — versão de controle (V1)
   Apenas interações necessárias: menu, âncoras e CTA simulada.
   Sem otimizações de desempenho destinadas à versão otimizada. */

(function () {
  "use strict";

  var header = document.querySelector(".site-header");
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.getElementById("menu-principal");
  var navLinks = document.querySelectorAll(".nav-list a");
  var buyButton = document.getElementById("btn-comprar");
  var feedback = document.getElementById("cta-feedback");
  var sections = document.querySelectorAll("main section[id]");
  var feedbackTimer = null;

  function setMenuOpen(isOpen) {
    if (!toggle || !nav) return;
    toggle.setAttribute("aria-expanded", String(isOpen));
    toggle.setAttribute("aria-label", isOpen ? "Fechar menu" : "Abrir menu");
    nav.classList.toggle("is-open", isOpen);
  }

  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var open = toggle.getAttribute("aria-expanded") === "true";
      setMenuOpen(!open);
    });

    navLinks.forEach(function (link) {
      link.addEventListener("click", function () {
        setMenuOpen(false);
      });
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape") {
        setMenuOpen(false);
      }
    });

    document.addEventListener("click", function (event) {
      if (!nav.classList.contains("is-open")) return;
      var target = event.target;
      if (nav.contains(target) || toggle.contains(target)) return;
      setMenuOpen(false);
    });
  }

  if (buyButton && feedback) {
    buyButton.addEventListener("click", function () {
      feedback.hidden = false;
      feedback.textContent =
        "Simulação: nenhuma compra foi realizada. SoundNova Pro é um produto fictício.";

      if (feedbackTimer) {
        window.clearTimeout(feedbackTimer);
      }

      feedbackTimer = window.setTimeout(function () {
        feedback.hidden = true;
        feedback.textContent = "";
        feedbackTimer = null;
      }, 4000);
    });
  }

  function updateActiveLink() {
    if (!sections.length) return;

    var offset = (header ? header.offsetHeight : 0) + 24;
    var currentId = "";

    sections.forEach(function (section) {
      var top = section.getBoundingClientRect().top;
      if (top - offset <= 0) {
        currentId = section.id;
      }
    });

    /* Mapeia seções sem item de menu para o link de navegação correspondente */
    var navMap = {
      inicio: "inicio",
      recursos: "recursos",
      especificacoes: "especificacoes",
      experiencia: "especificacoes",
      avaliacoes: "avaliacoes",
      comprar: "avaliacoes"
    };

    var activeNavId = navMap[currentId] || currentId;

    navLinks.forEach(function (link) {
      var href = link.getAttribute("href") || "";
      var id = href.charAt(0) === "#" ? href.slice(1) : "";
      link.classList.toggle("is-active", id === activeNavId);
    });
  }

  window.addEventListener("scroll", updateActiveLink, { passive: true });
  window.addEventListener("load", updateActiveLink);
})();
