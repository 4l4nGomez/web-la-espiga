# DESIGN SYSTEM — WEB ESPIGA

---

## 📁 Estructura del proyecto

```
WEB ESPIGA/
│
├── index.html                  ← HTML principal
│
├── css/
│   ├── tokens.css              ← Design tokens (colores, tipografía, espaciado…)
│   ├── reset.css               ← Reset CSS moderno
│   ├── base.css                ← Estilos base del documento
│   ├── layout.css              ← Sistema de grid y layout responsivo
│   ├── components.css          ← Componentes UI
│   └── animations.css          ← Keyframes y clases de animación
│
├── js/
│   └── main.js                 ← Entry point JS (scroll reveal, navbar, utils)
│
├── assets/
│   ├── images/
│   │   └── conchas.png         ← Hero image principal
│   ├── icons/                  ← SVG icons
│   └── fonts/                  ← Fuentes locales (si aplica)
│
└── DESIGN.md                   ← Este archivo
```

---

## 🎨 Paleta de colores

```css
:root {
  --foreground:    #1F1D20;   /* Carbono/Charcoal oscuro  → Texto general          */
  --cream:         #A79986;   /* Neutral cálido / Taupe   → Contraste, bordes      */
  --marron:        #4A2427;   /* Borgoña oscuro / Vino    → Secciones oscuras      */
  --chocolate:     #3B322D;   /* Chocolate apagado        → Base de marca, navbar  */
  --dorado:        #B8381D;   /* Terracota vibrante       → Acento, CTAs, hover    */
  --gray-palette:  #3E3D38;   /* Gris oliva cálido        → Superficies de soporte */
}
```

### Referencia visual de tokens

| Token            | Valor     | Nombre semántico          | Rol en la UI                          |
|------------------|-----------|---------------------------|---------------------------------------|
| `--foreground`   | `#1F1D20` | Carbono / Charcoal oscuro | Texto principal, íconos               |
| `--cream`        | `#A79986` | Neutral cálido / Taupe    | Bordes, separadores, texto secundario |
| `--marron`       | `#4A2427` | Borgoña oscuro / Vino     | Fondos de sección, cards oscuras      |
| `--chocolate`    | `#3B322D` | Chocolate apagado         | Navbar, footer, bloques de marca      |
| `--dorado`       | `#B8381D` | Terracota vibrante (CTA)  | CTAs, hover states, acentos           |
| `--gray-palette` | `#3E3D38` | Gris oliva cálido         | Superficies de soporte, overlays      |

### Combinación triádica principal
```
Fondo      → --chocolate  #3B322D
Texto      → --cream      #A79986
Acento/CTA → --dorado     #B8381D
```

### Notas de uso
- **`--dorado`** es el único acento verdadero. Reservar para botones primarios, links activos y highlights.
- **`--cream`** actúa como el "blanco" de esta paleta oscura. Usar para texto sobre fondos oscuros y bordes sutiles.
- **`--foreground`** solo sobre fondos claros/cream. Nunca sobre `--marron` o `--chocolate`.
- La paleta es **warm-dark**: adecuada para modo oscuro de marca artesanal sin blancos fríos.

---

## 🔤 Tipografía

| Rol       | Familia              | Pesos         | Uso                          |
|-----------|----------------------|---------------|------------------------------|
| Display   | Playfair Display     | 400, 600, 700 | Títulos, nombre de marca     |
| Body / UI | Inter                | 300, 400, 500, 600 | Párrafos, botones, nav  |

### Escala de tamaños
| Token        | Valor  | px  |
|--------------|--------|-----|
| `--text-xs`  | 0.75rem | 12 |
| `--text-sm`  | 0.875rem| 14 |
| `--text-base`| 1rem    | 16 |
| `--text-lg`  | 1.125rem| 18 |
| `--text-xl`  | 1.25rem | 20 |
| `--text-2xl` | 1.5rem  | 24 |
| `--text-3xl` | 1.875rem| 30 |
| `--text-4xl` | 2.25rem | 36 |
| `--text-5xl` | 3rem    | 48 |
| `--text-6xl` | 3.75rem | 60 |
| `--text-7xl` | 4.5rem  | 72 |

---

## 📐 Espaciado (escala base 4px)

| Token        | Valor   | px  |
|--------------|---------|-----|
| `--space-1`  | 0.25rem |  4  |
| `--space-2`  | 0.5rem  |  8  |
| `--space-4`  | 1rem    | 16  |
| `--space-6`  | 1.5rem  | 24  |
| `--space-8`  | 2rem    | 32  |
| `--space-12` | 3rem    | 48  |
| `--space-16` | 4rem    | 64  |
| `--space-24` | 6rem    | 96  |
| `--space-32` | 8rem    | 128 |

---

## 🧩 Secciones de la página

| ID           | Descripción                      |
|--------------|----------------------------------|
| `#navbar`    | Navegación principal (sticky)    |
| `#hero`      | Banner principal con imagen      |
| `#productos` | Productos / pan dulce destacado  |
| `#nosotros`  | Historia de la panadería         |
| `#menu`      | Catálogo completo                |
| `#galeria`   | Galería de fotos                 |
| `#contacto`  | Ubicación, horarios y formulario |
| `#footer`    | Pie de página                    |

---

## 🎞️ Animaciones disponibles

| Clase                | Efecto                          |
|----------------------|---------------------------------|
| `.animate-fade-in`   | Aparición simple                |
| `.animate-fade-in-up`| Aparición desde abajo           |
| `.animate-scale-in`  | Aparición con escala            |
| `.animate-float`     | Flotación suave (loop)          |
| `.reveal`            | Scroll reveal (activado por JS) |
| `.reveal-left`       | Scroll reveal desde izquierda   |
| `.reveal-right`      | Scroll reveal desde derecha     |
| `.skeleton`          | Loading skeleton shimmer        |

---

## 🖼️ Assets

| Archivo                      | Uso                              |
|------------------------------|----------------------------------|
| `assets/images/conchas.png`  | Hero image principal (pan dulce) |
