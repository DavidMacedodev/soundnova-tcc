/* SoundNova Pro — versão otimizada (V2)
   Mesmas interações da versão controlada: menu, âncoras e CTA simulada.
   O estado do menu ativo é calculado no máximo uma vez por frame e
   as classes só são alteradas quando a seção correspondente muda. */

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
  var activeNavId = null;
  var scrollScheduled = false;

  /* Mapeia seções sem item de menu para o link de navegação correspondente */
  var navMap = {
    inicio: "inicio",
    recursos: "recursos",
    especificacoes: "especificacoes",
    experiencia: "especificacoes",
    avaliacoes: "avaliacoes",
    comprar: "avaliacoes"
  };

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

    var nextActive = navMap[currentId] || currentId;
    if (nextActive === activeNavId) return;
    activeNavId = nextActive;

    navLinks.forEach(function (link) {
      var href = link.getAttribute("href") || "";
      var id = href.charAt(0) === "#" ? href.slice(1) : "";
      link.classList.toggle("is-active", id === activeNavId);
    });
  }

  function onScroll() {
    if (scrollScheduled) return;
    scrollScheduled = true;
    window.requestAnimationFrame(function () {
      scrollScheduled = false;
      updateActiveLink();
    });
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", updateActiveLink);
  window.addEventListener("load", updateActiveLink);
  updateActiveLink();
})();
