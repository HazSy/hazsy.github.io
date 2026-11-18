# hazsy.github.io

Portfolio personal de **Óscar López Pellicer**, desarrollador full stack junior y
estudiante de 2º de DAW en Murcia.

Sitio estático publicado con GitHub Pages: **https://hazsy.github.io**

## Características

- HTML semántico, CSS propio y JavaScript sin dependencias.
- Tema oscuro por defecto y claro opcional, respetando `prefers-color-scheme` y
  guardando la preferencia en `localStorage`.
- Responsive, navegable con teclado y con soporte de `prefers-reduced-motion`.
- Metadatos SEO, Open Graph, JSON-LD (`Person`) y favicon SVG.
- Demo compilada del proyecto Nimbus en `/demos/nimbus/`.

## Estructura

```
index.html            página única con las secciones del portfolio
assets/css/styles.css estilos y tokens de diseño
assets/js/main.js     tema, menú, scrollspy, animaciones y copiar email
assets/img/og.png     imagen para redes sociales
demos/nimbus/         build de Nimbus (React + TypeScript) para la demo
```

## Desarrollo local

No requiere build ni dependencias:

```bash
python -m http.server 8000
# http://localhost:8000
```

## Despliegue

Cualquier push a `main` publica automáticamente el contenido de la rama con
GitHub Pages (Settings → Pages → Deploy from a branch → `main` / root).

---

MIT © 2026 Óscar López Pellicer
