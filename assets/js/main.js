/* ==========================================================================
   Óscar López Pellicer · portfolio
   JavaScript mínimo: tema, menú móvil, scrollspy, animaciones y copiar email.
   ========================================================================== */
(function () {
  "use strict";

  const raiz = document.documentElement;
  const reducirMovimiento = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------------------------------------------------------------- Tema */
  const botonTema = document.getElementById("tema");

  function aplicarTema(tema, guardar) {
    raiz.dataset.theme = tema;
    if (botonTema) {
      const oscuro = tema === "dark";
      botonTema.setAttribute("aria-label", oscuro ? "Cambiar a tema claro" : "Cambiar a tema oscuro");
      botonTema.setAttribute("aria-pressed", String(!oscuro));
    }
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) {
      meta.setAttribute("content", tema === "dark" ? "#080b10" : "#f7f9fc");
    }
    if (guardar) {
      try { localStorage.setItem("tema", tema); } catch (e) { /* modo privado */ }
    }
  }

  aplicarTema(raiz.dataset.theme === "light" ? "light" : "dark", false);

  botonTema?.addEventListener("click", function () {
    aplicarTema(raiz.dataset.theme === "dark" ? "light" : "dark", true);
  });

  // Si el usuario no ha elegido tema, se sigue al sistema.
  window.matchMedia("(prefers-color-scheme: light)").addEventListener("change", function (evento) {
    let guardado = null;
    try { guardado = localStorage.getItem("tema"); } catch (e) { /* nada */ }
    if (!guardado) {
      aplicarTema(evento.matches ? "light" : "dark", false);
    }
  });

  /* ------------------------------------------------------- Menú móvil */
  const menu = document.getElementById("menu");
  const nav = document.getElementById("nav");

  function cerrarMenu() {
    if (!nav || !menu) return;
    nav.classList.remove("abierto");
    menu.setAttribute("aria-expanded", "false");
    menu.setAttribute("aria-label", "Abrir menú");
  }

  menu?.addEventListener("click", function () {
    const abierto = menu.getAttribute("aria-expanded") === "true";
    if (abierto) {
      cerrarMenu();
    } else {
      nav.classList.add("abierto");
      menu.setAttribute("aria-expanded", "true");
      menu.setAttribute("aria-label", "Cerrar menú");
    }
  });

  nav?.querySelectorAll("a").forEach(function (enlace) {
    enlace.addEventListener("click", cerrarMenu);
  });

  document.addEventListener("keydown", function (evento) {
    if (evento.key === "Escape") cerrarMenu();
  });

  /* ------------------------------------------------- Cabecera fija */
  const cabecera = document.getElementById("cabecera");

  function actualizarCabecera() {
    cabecera?.classList.toggle("esta-fija", window.scrollY > 12);
  }
  actualizarCabecera();
  window.addEventListener("scroll", actualizarCabecera, { passive: true });

  /* ------------------------------------------------------ Scrollspy */
  const enlacesNav = Array.from(document.querySelectorAll("#nav a[href^='#']"));
  const secciones = enlacesNav
    .map(function (enlace) { return document.querySelector(enlace.getAttribute("href")); })
    .filter(Boolean);

  let pendiente = false;

  function marcarActiva() {
    pendiente = false;
    const y = window.scrollY + 120;
    let actual = null;

    secciones.forEach(function (seccion) {
      if (seccion.offsetTop <= y) actual = seccion;
    });

    // Al llegar al final, se marca la última sección aunque sea corta.
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 8) {
      actual = secciones[secciones.length - 1];
    }

    enlacesNav.forEach(function (enlace, i) {
      const activo = actual !== null && secciones[i] === actual;
      enlace.classList.toggle("activo", activo);
      if (activo) {
        enlace.setAttribute("aria-current", "true");
      } else {
        enlace.removeAttribute("aria-current");
      }
    });
  }

  window.addEventListener("scroll", function () {
    if (!pendiente) {
      pendiente = true;
      window.requestAnimationFrame(marcarActiva);
    }
  }, { passive: true });

  marcarActiva();

  /* ------------------------------------------------ Animación entrada */
  const elementos = document.querySelectorAll(".aparecer");

  if (reducirMovimiento || !("IntersectionObserver" in window)) {
    elementos.forEach(function (el) { el.classList.add("visible"); });
  } else {
    const observador = new IntersectionObserver(function (entradas) {
      entradas.forEach(function (entrada) {
        if (!entrada.isIntersecting) return;
        entrada.target.classList.add("visible");
        observador.unobserve(entrada.target);
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });

    elementos.forEach(function (el, indice) {
      el.style.transitionDelay = Math.min(indice % 4, 3) * 70 + "ms";
      observador.observe(el);
    });

    // Red de seguridad: si el observador no dispara (pestaña en segundo plano,
    // impresión, navegador antiguo), todo el contenido acaba visible.
    window.setTimeout(function () {
      elementos.forEach(function (el) { el.classList.add("visible"); });
      observador.disconnect();
    }, 3000);
  }

  /* --------------------------------------------------- Copiar email */
  const botonCopiar = document.getElementById("copiar");
  const aviso = document.getElementById("aviso");

  function mostrarAviso(texto) {
    if (!aviso) return;
    aviso.textContent = texto;
    window.clearTimeout(mostrarAviso.temporizador);
    mostrarAviso.temporizador = window.setTimeout(function () {
      aviso.textContent = "";
    }, 3200);
  }

  botonCopiar?.addEventListener("click", function () {
    const email = botonCopiar.dataset.email;
    const etiqueta = botonCopiar.querySelector("span");
    const original = etiqueta.textContent;

    const listo = function () {
      etiqueta.textContent = "¡Copiado!";
      mostrarAviso("Email copiado al portapapeles.");
      window.setTimeout(function () { etiqueta.textContent = original; }, 2400);
    };

    const fallo = function () {
      mostrarAviso("No se pudo copiar. El email es " + email);
    };

    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(email).then(listo).catch(fallo);
    } else {
      const area = document.createElement("textarea");
      area.value = email;
      area.setAttribute("readonly", "");
      area.style.position = "fixed";
      area.style.opacity = "0";
      document.body.appendChild(area);
      area.select();
      try {
        document.execCommand("copy") ? listo() : fallo();
      } catch (e) {
        fallo();
      }
      document.body.removeChild(area);
    }
  });

  /* ------------------------------------------------------------ Año */
  const anio = document.getElementById("anio");
  if (anio) anio.textContent = String(new Date().getFullYear());
})();
