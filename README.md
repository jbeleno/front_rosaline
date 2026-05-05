# Rosaline Bakery — Frontend

[![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev/)
[![React Router](https://img.shields.io/badge/React_Router-7-CA4245?style=flat-square&logo=react-router&logoColor=white)](https://reactrouter.com/)
[![Zustand](https://img.shields.io/badge/Zustand-4-F5A623?style=flat-square)](https://zustand-demo.pmnd.rs/)
[![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=flat-square&logo=supabase&logoColor=white)](https://supabase.com/)
[![Playwright](https://img.shields.io/badge/Playwright-2EAD33?style=flat-square&logo=playwright&logoColor=white)](https://playwright.dev/)
[![Framer Motion](https://img.shields.io/badge/Framer_Motion-12-0055FF?style=flat-square&logo=framer&logoColor=white)](https://www.framer.com/motion/)
[![Vercel](https://img.shields.io/badge/Vercel-000000?style=flat-square&logo=vercel&logoColor=white)](https://vercel.com/)

Frontend de e-commerce para una panadería real (**Rosaline Bakery**), con catálogo, carrito, checkout, panel administrativo y autenticación dual (Supabase + JWT). Pareja con [`Back_rosaline`](https://github.com/jbeleno/Back_rosaline).

> Aplicación que vive en producción para un negocio real, no un demo. Foco en flujos de cliente y de administrador con sincronización de carrito, control de roles y SEO optimizado.

---

## Highlights

- 🛒 **Carrito sincronizado** entre sesión, login y backend (Zustand + persistencia en API).
- 🔐 **Auth dual**: Supabase para verificación de email + JWT con HTTP-only cookies para la API propia.
- 🧑‍💼 **Panel admin** con CRUD completo (productos, categorías, clientes, usuarios, pedidos) y modales de confirmación.
- 🎭 **E2E con Playwright** (`/e2e`) cubriendo el flujo real del cliente.
- 🔍 **SEO**: schema markup JSON-LD, sitemap, meta tags dinámicos, robots.txt.
- 🌀 **UX**: Framer Motion, react-toastify, slick carousel, react-icons.

## Stack

| Capa | Tecnología |
|---|---|
| UI | React 19 |
| Routing | React Router DOM 7 |
| State | Zustand 4 + @tanstack/react-query 5 |
| Auth | Supabase Auth + JWT (HTTP-only cookies) |
| HTTP | fetch (modular service layer) |
| Animaciones | Framer Motion 12 |
| Carrusel | react-slick |
| Notificaciones | react-toastify |
| E2E | Playwright |
| Build | Create React App 5 (react-scripts) |
| Hosting | Vercel |

---

## Quick start

### Requisitos

- Node.js 18+ y npm
- Backend corriendo (ver [Back_rosaline](https://github.com/jbeleno/Back_rosaline))

### 1. Instalar

```bash
cd front_gestion
npm install
```

### 2. Configurar variables de entorno

```bash
cp .env.example .env
# Editar .env con la URL del backend y credenciales de Supabase
```

> ⚠️ **Sobre Supabase Anon Key:** está pensada para vivir en el cliente (es pública por diseño). La seguridad real depende de las **políticas de Row Level Security (RLS)** configuradas en Supabase. Verificar que cada tabla accesible por `anon` tenga RLS estricto.

### 3. Levantar dev server

```bash
npm start
# http://localhost:3000
```

---

## Scripts

| Comando | Acción |
|---|---|
| `npm start` | Dev server con hot reload |
| `npm run build` | Build de producción a `/build` |
| `npm test` | Suite de tests con react-scripts (Jest + Testing Library) |
| `npm run test:e2e` | E2E con Playwright (headless) |
| `npm run test:e2e:ui` | Playwright en modo UI interactivo |
| `npm run test:e2e:headed` | Playwright con browser visible |
| `npm run test:e2e:report` | Abrir reporte HTML del último run |

---

## Estructura del proyecto

```
front_gestion/
├── public/
│   ├── img/                  # Imágenes de productos y logos
│   ├── sitemap.xml           # Sitemap para SEO
│   └── robots.txt
├── src/
│   ├── components/           # Componentes de página y dominio
│   │   ├── AdminCuenta.js    # Dashboard administrativo
│   │   ├── ClienteCuenta.js  # Perfil de cliente
│   │   ├── Carrito.js        # Carrito de compras
│   │   ├── ProductosList.js  # Catálogo
│   │   └── LoginRegister.js  # Auth
│   ├── config/
│   │   └── supabase.js       # Cliente Supabase
│   ├── features/             # Módulos por feature
│   │   ├── auth/
│   │   ├── cart/
│   │   └── products/
│   ├── shared/
│   │   ├── components/       # Componentes reutilizables
│   │   ├── services/         # Capa HTTP (carrito, cliente, producto, pedido, categoria)
│   │   └── hooks/            # useAuth, useCart, useProducts, useSEO
│   └── styles/
├── e2e/                      # Tests Playwright
├── docs/
├── playwright.config.js
└── package.json
```

## Rutas

### Públicas

| Ruta | Descripción |
|---|---|
| `/` | Home con productos destacados |
| `/productos` | Catálogo completo |
| `/categoria/:id` | Productos por categoría |
| `/producto/:id` | Detalle de producto |
| `/login` | Auth (login + registro) |
| `/sobre-nosotros` | About |
| `/recuperar-contraseña` | Password recovery |
| `/confirmar-cuenta/:token` | Confirmación de email |

### Protegidas

| Ruta | Descripción |
|---|---|
| `/micuenta` | Dashboard (vista cambia por rol cliente/admin) |
| `/carrito` | Carrito |
| `/pedido-confirmado/:id` | Confirmación de pedido |

---

## Autenticación

Sistema dual:

- **Supabase Auth** — verificación de email, magic links, recuperación de contraseña.
- **JWT del backend** — autorización de la API propia, transportado en cookies `HttpOnly`.
- **Routing por rol** — `cliente` vs `administrador`. El backend devuelve el rol en el JWT y el frontend renderiza la vista correspondiente.

Hooks personalizados:

| Hook | Responsabilidad |
|---|---|
| `useAuth` | Login, logout, refresh, rol actual |
| `useCart` | Operaciones de carrito sincronizadas con backend |
| `useProducts` | Catálogo con caching |
| `useSEO` | Meta tags y JSON-LD dinámicos por página |

---

## Estado (Zustand)

Dos stores principales:

- **`authStore`** — sesión, login/logout, rol del usuario.
- **`cartStore`** — items, cantidades, sincronización con backend al login y al checkout.

Decisión de Zustand sobre Redux: menos boilerplate, integración trivial con hooks, y para esta escala (carrito + auth) Redux era over-engineering.

---

## Despliegue

```bash
# Vercel auto-detecta CRA y usa vercel.json para routing
git push  # → trigger automático de deploy
```

Variables de entorno requeridas en Vercel:

- `REACT_APP_API_URL`
- `REACT_APP_SUPABASE_URL`
- `REACT_APP_SUPABASE_ANON_KEY`

---

## Mejoras pendientes (deuda técnica reconocida)

- **Migrar de CRA a Vite**: Create React App está [oficialmente deprecado desde 2025](https://github.com/facebook/create-react-app). Vite ofrece HMR ~10x más rápido y mejor DX.
- **TypeScript**: actualmente JS plano; migración a TS daría seguridad de tipos en una codebase con 20+ componentes.
- **Tests unitarios**: la cobertura actual depende de Playwright E2E. Sumar tests de componentes y hooks aislados con Vitest + Testing Library.
- **Error boundaries** por ruta para evitar que un error en una vista tire la app completa.
- **Code splitting** por ruta con `React.lazy` + `Suspense` para reducir el bundle inicial.
- **Lighthouse CI**: medir Performance/Accessibility/SEO automáticamente en cada PR.
- **Storybook** para componentes compartidos (`shared/components/`).

---

## Backend

API REST: [Back_rosaline](https://github.com/jbeleno/Back_rosaline) — FastAPI + PostgreSQL + Alembic + auth JWT con roles + auditoría automática.

---

## Licencia

Proyecto académico (USCO) usado para una panadería real. Software propietario para Rosaline Bakery.
