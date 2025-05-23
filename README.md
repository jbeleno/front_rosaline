# front_rosaline

Online store developed in React, connected to Supabase and designed for the management of products, users, orders, and administration.

## 🚀 Installation

1. **Clone the repository:**
   ```bash
   git clone <repo-url>
   cd front_gestion
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

## 🧑‍💻 Available Scripts

- `npm start` — Starts the app in development mode.
- `npm run build` — Builds the app for production.
- `npm test` — Runs the tests.
- `npm run eject` — Exposes the Create React App configuration.

## 🗂️ Main Structure

- `/src/components/` — Main components (Home, Products, Cart, Login, Admin, etc).
- `/src/styles/` — CSS files for each component.
- `/src/config/supabase.js` — Supabase configuration for backend connection.
- `/public/` — Static files and base HTML.

## 🛠️ Technologies and Dependencies

- **React 19**
- **React Router DOM 7** — Page routing.
- **Supabase JS** — Database connection and authentication.
- **Framer Motion** — Animations.
- **JWT Decode** — User token decoding.
- **Testing Library** — Unit and integration testing.

## 🌐 Main Routes

- `/` — Home page.
- `/productos` — Product listing.
- `/categoria/:id` — Products by category.
- `/producto/:id` — Product details.
- `/login` — User login and registration.
- `/micuenta` — User panel.
- `/admin` — Admin panel.
- `/carrito` — Shopping cart.
- `/pedido-confirmado/:id` — Order confirmation.

## 🔒 Authentication

Login and registration are managed with Supabase and JWT. The token is stored in localStorage and decoded to obtain user data.

## 🛒 Key Features

- Product and category management (admin).
- Shopping cart and order confirmation.
- User panel and admin panel.
- Category filters and product search.
- Animations and responsive design.

## ⚙️ Deployment on Vercel

1. Upload the project to a repository (GitHub, GitLab, etc).
2. Connect the repo to Vercel.
3. Vercel will automatically detect the use of React and run `npm run build`.

**Important:**  
Do not upload the `node_modules` folder to the repository. Make sure it is in your `.gitignore`. 
