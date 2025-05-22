# front_gestion

Tienda online desarrollada en React, conectada a Supabase y pensada para la gestión de productos, usuarios, pedidos y administración.

## 🚀 Instalación

1. **Clona el repositorio:**
   ```bash
   git clone <url-del-repo>
   cd front_gestion
   ```

2. **Instala las dependencias:**
   ```bash
   npm install
   ```

## 🧑‍💻 Scripts disponibles

- `npm start` — Inicia la app en modo desarrollo.
- `npm run build` — Genera la build de producción.
- `npm test` — Ejecuta los tests.
- `npm run eject` — Expone la configuración de Create React App.

## 🗂️ Estructura principal

- `/src/components/` — Componentes principales (Home, Productos, Carrito, Login, Admin, etc).
- `/src/styles/` — Archivos CSS para cada componente.
- `/src/config/supabase.js` — Configuración de Supabase para conexión con el backend.
- `/public/` — Archivos estáticos y HTML base.

## 🛠️ Tecnologías y dependencias

- **React 19**
- **React Router DOM 7** — Ruteo de páginas.
- **Supabase JS** — Conexión a base de datos y autenticación.
- **Framer Motion** — Animaciones.
- **JWT Decode** — Decodificación de tokens de usuario.
- **Testing Library** — Pruebas unitarias y de integración.

## 🌐 Rutas principales

- `/` — Página de inicio.
- `/productos` — Listado de productos.
- `/categoria/:id` — Productos por categoría.
- `/producto/:id` — Detalle de producto.
- `/login` — Login y registro de usuario.
- `/micuenta` — Panel de usuario.
- `/admin` — Panel de administración.
- `/carrito` — Carrito de compras.
- `/pedido-confirmado/:id` — Confirmación de pedido.

## 🔒 Autenticación

El login y registro se gestionan con Supabase y JWT. El token se almacena en localStorage y se decodifica para obtener los datos del usuario.

## 🛒 Funcionalidades destacadas

- Gestión de productos y categorías (admin).
- Carrito de compras y confirmación de pedidos.
- Panel de usuario y panel de administración.
- Filtros por categoría y búsqueda de productos.
- Animaciones y diseño responsive.

## ⚙️ Despliegue en Vercel

1. Sube el proyecto a un repositorio (GitHub, GitLab, etc).
2. Conecta el repo a Vercel.
3. Vercel detectará automáticamente el uso de React y ejecutará `npm run build`.

**Importante:**  
No subas la carpeta `node_modules` al repositorio. Asegúrate de que esté en tu `.gitignore`. 
