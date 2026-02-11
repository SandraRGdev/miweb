# PRD - Portfolio Web | Diseñadora & Desarrolladora Frontend

## 1. Resumen Ejecutivo

**Nombre del Proyecto:** Portfolio Personal
**Rol:** Diseñadora & Desarrolladora Frontend
**Objetivo:** Crear una página web portfolio moderna, interactiva y visualmente impactante que refleje las habilidades técnicas y creativas de la profesional, sirviendo como carta de presentación para potenciales clientes y empleadores.

---

## 2. Stack Tecnológico

| Capa | Tecnología |
|------|------------|
| Framework | Astro |
| Estilos | TailwindCSS |
| Componentes UI | shadcn/ui |
| Animaciones | GSAP |
| Base de Datos | Neon (PostgreSQL Serverless) |
| ORM | Prisma |
| Deployment | Dokploy |

---

## 3. Identidad Visual

### 3.1 Paleta de Colores

| Color | Hex | Uso Principal |
|-------|-----|---------------|
| Verde Bosque | `#14331F` | Acentos, fondos secundarios, CTAs |
| Negro Profundo | `#011314` | Fondo principal, textos |
| Lima Neón | `#DFFE02` | Highlights, hovers, elementos destacados |

### 3.2 Tipografía

| Uso | Fuente | Fallback |
|-----|--------|----------|
| Títulos (h1-h6) | `abovethebeyond` | sans-serif |
| Párrafos & UI | `Helvetica Neue` | Helvetica, Arial, sans-serif |

### 3.3 Jerarquía Tipográfica

| Elemento | Desktop | Mobile | Fuente |
|----------|---------|--------|--------|
| H1 | 72px / 4.5rem | 48px / 3rem | abovethebeyond |
| H2 | 48px / 3rem | 36px / 2.25rem | abovethebeyond |
| H3 | 32px / 2rem | 24px / 1.5rem | abovethebeyond |
| Body | 18px / 1.125rem | 16px / 1rem | Helvetica Neue |
| Small | 14px / 0.875rem | 14px / 0.875rem | Helvetica Neue |

---

## 4. Arquitectura de Páginas

### 4.1 Página de Inicio (Home)

**Secciones:**

| Sección | Descripción | Efectos |
|---------|-------------|---------|
| Hero | Presentación con nombre, título profesional y tagline | Animación de entrada con GSAP (fade + slide), texto con efecto typewriter |
| Sobre Mí | Breve descripción personal y profesional | Parallax suave en scroll, elementos que aparecen con zoom-out |
| Servicios/Skills | Grid de habilidades técnicas | Cards con hover elevación + cambio a color lima |
| Portfolio Preview | Muestra de 3-4 proyectos destacados | Zoom-out al entrar en viewport, cursor personalizado |
| CTA Contacto | Llamada a la acción hacia formulario | Botón con efecto ripple + glassmorphism |

---

### 4.2 Página de Portfolio

**Estructura:**
- Filtros por categorías (tabs)
- Grid Masonry / Bento Layout con proyectos
- Modal de detalle de proyecto

**Efectos Especiales:**
- **Cursor Personalizado:** Al entrar en la sección, el cursor se transforma en un círculo con texto "Ver proyecto" o icono de ojo
- **Hover en Cards:** Zoom-in sutil de imagen + overlay con información del proyecto
- **Transición entre proyectos:** Animación GSAP de página completa

---

### 4.3 Página de Planes

**Estructura de Pricing:**

| Plan | Características |
|------|-----------------|
| Básico | Landing page, diseño responsive, 1 revisión |
| Profesional | Hasta 5 páginas, animaciones básicas, 3 revisiones |
| Premium | Sitio completo, animaciones avanzadas, mantenimiento |

**Efectos:**
- Cards con glassmorphism
- Hover: elevación + borde lima brillante
- Animación de entrada escalonada con GSAP
- Toggle mensual/anual con transición suave

---

### 4.4 Página de Contacto

**Elementos:**

| Componente | Descripción |
|------------|-------------|
| Formulario | Nombre, email, tipo de proyecto, mensaje |
| Información | Email, redes sociales, ubicación |
| Elemento Visual | Mapa o ilustración decorativa |

**Efectos:**
- Inputs con animación de focus (borde lima expandible)
- Botón submit con loading state animado
- Validación con micro-interacciones

---

## 5. Navegación & Menú

### Diseño Glassmorphism

```css
.nav-glassmorphism {
  background: rgba(20, 51, 31, 0.25);
  backdrop-filter: blur(16px);
  border: 1px solid rgba(223, 254, 2, 0.18);
  border-radius: 16px;
}
```

**Características:**
- Menú flotante con efecto vidrio esmerilado
- Sticky en scroll con transición de opacidad
- Items con hover underline animado (color lima)
- Hamburger menu animado para mobile

---

## 6. Sistema de Animaciones (GSAP)

### 6.1 Animaciones Globales

| Animación | Trigger | Efecto |
|-----------|---------|--------|
| Fade In Up | Scroll into view | Elementos aparecen desde abajo con opacidad |
| Zoom Out | Scroll into view | Elementos comienzan grandes y se reducen a tamaño normal |
| Stagger | Page load | Elementos aparecen secuencialmente |
| Parallax | Scroll | Capas se mueven a diferentes velocidades |

### 6.2 Cursor Personalizado

```javascript
const cursor = {
  default: { size: 20, color: '#DFFE02', blend: 'difference' },
  portfolio: { size: 80, text: 'Ver', color: '#DFFE02' },
  links: { size: 40, color: '#14331F' }
}
```

---

## 7. Componentes UI (shadcn/ui)

| Componente | Uso |
|------------|-----|
| Button | CTAs, submit forms |
| Card | Portfolio items, pricing cards |
| Input | Formulario de contacto |
| Dialog | Modal de proyecto detallado |
| Tabs | Filtros de portfolio |
| Toast | Notificaciones de éxito/error |

---

## 8. Responsive Design

| Breakpoint | Ancho | Adaptaciones |
|------------|-------|--------------|
| Mobile | < 640px | Menú hamburger, stack vertical, cursor nativo |
| Tablet | 640px - 1024px | Grid 2 columnas |
| Desktop | > 1024px | Experiencia completa con todos los efectos |

---

## 9. Base de Datos (Neon PostgreSQL)

### Esquema

```sql
-- Tabla de proyectos del portfolio
CREATE TABLE projects (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  description TEXT,
  image_url VARCHAR(500),
  category VARCHAR(100),
  technologies TEXT[],
  live_url VARCHAR(500),
  repo_url VARCHAR(500),
  featured BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Tabla de mensajes de contacto
CREATE TABLE contact_messages (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  project_type VARCHAR(100),
  message TEXT NOT NULL,
  read BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Tabla de planes/servicios
CREATE TABLE plans (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  price DECIMAL(10,2),
  billing_period VARCHAR(20),
  features JSONB,
  highlighted BOOLEAN DEFAULT false,
  sort_order INT DEFAULT 0
);
```

---

## 10. API Endpoints

| Endpoint | Método | Descripción |
|----------|--------|-------------|
| `/api/contact` | POST | Guardar mensaje de contacto |
| `/api/projects` | GET | Obtener proyectos del portfolio |

---

## 11. Estructura de Archivos

```
src/
├── components/
│   ├── ui/                 # shadcn components
│   ├── Nav.astro
│   ├── Hero.astro
│   ├── CustomCursor.astro
│   ├── ProjectCard.astro
│   ├── PricingCard.astro
│   └── ContactForm.astro
├── layouts/
│   └── Layout.astro
├── pages/
│   ├── index.astro
│   ├── portfolio.astro
│   ├── planes.astro
│   ├── contacto.astro
│   └── api/
│       ├── contact.ts
│       └── projects.ts
├── db/
│   ├── index.ts
│   └── schema.ts
├── styles/
│   └── globals.css
└── lib/
    └── animations.ts
```

---

## 12. Configuración

### TailwindCSS

```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      fontFamily: {
        'heading': ['abovethebeyond', 'sans-serif'],
        'body': ['"Helvetica Neue"', 'Helvetica', 'Arial', 'sans-serif'],
      },
      colors: {
        'forest': '#14331F',
        'deep-black': '#011314',
        'lime': '#DFFE02',
      }
    }
  }
}
```

### Fuente Custom

```css
@font-face {
  font-family: 'abovethebeyond';
  src: url('/fonts/abovethebeyond.woff2') format('woff2'),
       url('/fonts/abovethebeyond.woff') format('woff');
  font-weight: normal;
  font-style: normal;
  font-display: swap;
}
```

### Dokploy

```yaml
name: portfolio-web
type: astro

build:
  command: npm run build
  output: dist

environment:
  - DATABASE_URL=${NEON_DATABASE_URL}
  - NODE_ENV=production
```

---

## 13. Variables de Entorno

| Variable | Descripción |
|----------|-------------|
| `DATABASE_URL` | Connection string de Neon |
| `NEON_DATABASE_URL` | URL de conexión pooled |
| `PUBLIC_SITE_URL` | URL del sitio en producción |

---

## 14. Performance & SEO

### Optimizaciones
- Lazy loading de imágenes
- Preload de fuentes críticas
- Compresión de assets
- View Transitions API de Astro

### SEO
- Meta tags dinámicos por página
- Open Graph para redes sociales
- Schema markup para portfolio
- Sitemap automático

---

## 15. Fases de Desarrollo

### Fase 1: Setup & Estructura
- Inicializar proyecto Astro con TailwindCSS
- Configurar shadcn/ui para Astro
- Definir variables de colores y tipografías
- Crear layout base y estructura de páginas
- Configurar conexión a Neon con Drizzle

### Fase 2: Componentes Core
- Desarrollar navegación con glassmorphism
- Crear componentes de cards reutilizables
- Implementar cursor personalizado
- Diseñar sistema de botones y CTAs

### Fase 3: Páginas & Contenido
- Maquetar página Home con todas las secciones
- Construir galería de Portfolio con filtros
- Implementar página de Planes con pricing cards
- Desarrollar formulario de Contacto funcional

### Fase 4: Animaciones GSAP
- Integrar GSAP y ScrollTrigger
- Implementar efectos zoom-out en scroll
- Añadir animaciones hover en portfolio
- Crear transiciones de página fluidas

### Fase 5: Backend & API
- Crear endpoints API para contacto y proyectos
- Implementar lógica de base de datos
- Testing de formularios y persistencia

### Fase 6: Deploy & Polish
- Optimizar rendimiento y lighthouse score
- Testing responsive en múltiples dispositivos
- Configurar Dokploy y deployment automático
- Implementar analytics y monitoreo

---

## 16. Criterios de Aceptación

- [ ] Navegación glassmorphism funcional en todos los dispositivos
- [ ] Cursor personalizado activo en sección portfolio (desktop)
- [ ] Animaciones GSAP ejecutándose sin afectar performance (60fps)
- [ ] Formulario de contacto guardando en Neon correctamente
- [ ] Proyectos cargando desde base de datos
- [ ] Lighthouse score > 90 en todas las categorías
- [ ] Tiempo de carga < 3 segundos
- [ ] Deploy exitoso en Dokploy

---

## 17. Dependencias Principales

```json
{
  "dependencies": {
    "astro": "^4.x",
    "@astrojs/tailwind": "^5.x",
    "tailwindcss": "^3.x",
    "gsap": "^3.x",
    "drizzle-orm": "^0.29.x",
    "@neondatabase/serverless": "^0.9.x"
  },
  "devDependencies": {
    "drizzle-kit": "^0.20.x"
  }
}
```

---

**Autor:** MiniMax Agent
**Fecha:** Febrero 2026
**Versión:** 1.0
