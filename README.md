# 🎂 Rosaline Bakery - E-Commerce Platform

Modern e-commerce platform developed for **Rosaline Bakery**, a bakery specializing in artisan cakes and desserts. This application provides a complete online shopping experience with product management, user authentication, shopping cart functionality, and comprehensive administration tools.

## ✨ Overview

Rosaline Bakery's platform is built with React and integrates with a FastAPI backend to deliver a seamless experience for both customers and administrators. The application features real-time cart synchronization, secure authentication, order management, and an intuitive admin panel for complete business control.

### Key Highlights

- **Customer Experience**: Browse products by category, view detailed product information, manage shopping cart, and track orders
- **Admin Panel**: Complete CRUD operations for products, categories, users, clients, and orders
- **State Management**: Zustand-powered stores for cart and authentication with automatic synchronization
- **Modern UI/UX**: Responsive design with smooth animations, toast notifications, and modal confirmations
- **SEO Optimized**: Schema markup, meta tags, and sitemap for better search engine visibility

## 🚀 Quick Start

### Prerequisites

- Node.js 16+ and npm
- Access to the backend API at `https://api.rosalinebakery.me`

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/jbeleno/front_rosaline.git
   cd front_rosaline/front_gestion
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment:**
   
   Create a `.env` file with your Supabase credentials (see `CONFIGURACION_LOCAL.md` for details).

4. **Start development server:**
   ```bash
   npm start
   ```

   The app will open at `http://localhost:3000`

## 🧑‍💻 Available Scripts

- `npm start` — Starts the development server with hot reload
- `npm run build` — Creates optimized production build
- `npm test` — Runs the test suite
- `npm run eject` — Ejects from Create React App (irreversible)

## 🗂️ Project Structure

```
front_gestion/
├── public/               # Static assets and SEO files
│   ├── img/             # Product images and logos
│   ├── sitemap.xml      # SEO sitemap
│   └── robots.txt       # Search engine directives
├── src/
│   ├── components/      # React components
│   │   ├── AdminCuenta.js          # Admin dashboard
│   │   ├── ClienteCuenta.js        # User profile
│   │   ├── Carrito.js              # Shopping cart
│   │   ├── ProductosList.js        # Product catalog
│   │   ├── LoginRegister.js        # Authentication
│   │   └── ...
│   ├── config/          # Configuration files
│   │   └── supabase.js  # Supabase client setup
│   ├── features/        # Feature-based modules
│   │   ├── auth/        # Authentication logic
│   │   ├── cart/        # Cart management
│   │   └── products/    # Product operations
│   ├── shared/          # Shared utilities
│   │   ├── components/  # Reusable components
│   │   ├── services/    # API client and services
│   │   └── hooks/       # Custom React hooks
│   └── styles/          # Component-specific CSS
└── package.json
```

## 🛠️ Technology Stack

### Core Technologies

- **React 19** — Modern UI library with hooks
- **React Router DOM 7** — Client-side routing
- **Zustand 4.4.7** — Lightweight state management
- **React Toastify 10.0.6** — Toast notifications

### Backend Integration

- **FastAPI** — RESTful API at `https://api.rosalinebakery.me`
- **Supabase** — Authentication and session management
- **API Services** — Modular service layer (carrito, cliente, producto, pedido, categoria)

### Development & Testing

- **Testing Library** — Component and integration testing
- **JWT Decode** — Token parsing and validation
- **Framer Motion** — Smooth animations

### Deployment

- **Vercel** — Production hosting with automatic deployments
- **SEO Tools** — Schema markup, meta tags, sitemap

## 🌐 Application Routes

### Public Routes

- `/` — Home page with featured products
- `/productos` — Complete product catalog
- `/categoria/:id` — Products filtered by category
- `/producto/:id` — Detailed product view
- `/login` — User authentication (login/register)
- `/sobre-nosotros` — About Rosaline Bakery
- `/recuperar-contraseña` — Password recovery
- `/confirmar-cuenta/:token` — Email confirmation

### Protected Routes

- `/micuenta` — User account dashboard (client/admin view)
- `/carrito` — Shopping cart management
- `/pedido-confirmado/:id` — Order confirmation page

## 🔐 Authentication & Authorization

The application uses a dual authentication system:

- **Supabase Auth** — Email verification and session management
- **JWT Tokens** — Backend API authentication with HTTPOnly cookies
- **Role-based Access** — Automatic routing based on user role (cliente/administrador)

### Security Features

- Secure token storage with HTTPOnly cookies
- Protected routes with authentication guards
- Automatic session validation
- CORS-enabled API requests with credentials

## 🛒 Core Features

### For Customers

- **Product Browsing**: Filter by categories, view detailed product information
- **Shopping Cart**: Add/remove items, real-time price calculations
- **Order Management**: Place orders, view order history, track status
- **Account Management**: Update profile, manage delivery addresses
- **Responsive Design**: Optimized for mobile, tablet, and desktop

### For Administrators

- **Product Management**: Create, edit, delete products with images
- **Category Management**: Organize product catalog
- **User Management**: View and manage customer accounts
- **Order Management**: Process orders, update status, view details
- **Client Management**: CRUD operations with modal confirmations
- **Dashboard Analytics**: Overview of store performance

### Advanced Features

- **Cart Synchronization**: Persists across sessions and account changes
- **Toast Notifications**: User-friendly feedback for all actions
- **Modal Confirmations**: Prevent accidental deletions
- **Loading States**: Clear indicators for async operations
- **Error Handling**: Graceful error messages and recovery

## 🎨 UI/UX Highlights

- **Modern Design**: Clean, professional interface with brand colors
- **Smooth Animations**: Framer Motion for engaging transitions
- **Responsive Grid**: Adapts to all screen sizes
- **Accessible Forms**: Clear labels, validation, and error messages
- **SEO Optimized**: Schema markup for rich search results

## 📦 State Management

### Zustand Stores

- **authStore**: User session, login/logout, role management
- **cartStore**: Cart items, quantities, synchronization with backend

### Custom Hooks

- **useAuth**: Authentication logic with auto-refresh
- **useCart**: Cart operations with cliente tracking
- **useProducts**: Product fetching and caching
- **useSEO**: Dynamic meta tags and schema markup

## 🚀 Deployment

### Vercel Deployment

1. Push code to GitHub repository
2. Connect repository to Vercel
3. Configure environment variables
4. Vercel automatically builds and deploys

### Build Configuration

The project includes `vercel.json` for routing configuration and production optimizations.

### Environment Variables

Required variables:
- `REACT_APP_SUPABASE_URL`
- `REACT_APP_SUPABASE_ANON_KEY`

## 📝 Documentation

- `CONFIGURACION_LOCAL.md` — Local development setup guide
- `BUG_ELIMINAR_CLIENTE.md` — Known backend issues and workarounds

## 🤝 Contributing

1. Clone the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is proprietary software for Rosaline Bakery.

---

**Built with ❤️ for Rosaline Bakery** 
