# Clases y Características de Usuarios

Este documento define los roles de usuario disponibles en la plataforma Rosaline Bakery, sus privilegios, responsabilidades y funcionalidades asociadas.

## 1. Cliente

**Descripción del rol:**
Usuario externo que accede a la tienda online para consultar el catálogo de productos de Rosaline Bakery, gestionar su cuenta y realizar pedidos de productos de panadería y repostería.

**Privilegios y seguridad:**
- Puede registrarse e iniciar sesión en el sistema.
- Puede ver y modificar únicamente su propio perfil y sus propios pedidos.
- No tiene acceso al panel de administración ni a datos de otros clientes.

**Funcionalidades relevantes:**
- Catálogo público de productos.
- Registro, autenticación y gestión de cuenta de cliente.
- Carrito de compras y generación de pedidos.
- Gestión y consulta de historial de pedidos.

**Frecuencia de uso:**
Alta. Se espera que los clientes utilicen la plataforma de forma recurrente para realizar compras y consultar el estado de sus pedidos.

---

## 2. Administrador

**Descripción del rol:**
Usuario interno de Rosaline Bakery responsable de la operación diaria de la tienda online. Está encargado de gestionar el catálogo, los pedidos y consultar la información básica de clientes.

**Privilegios y seguridad:**
- Acceso al panel de administración con credenciales especiales.
- Puede crear, modificar, desactivar y organizar productos y categorías.
- Puede gestionar pedidos (cambio de estado, cancelaciones, consulta de detalles).
- Puede consultar información de clientes con fines operativos y de soporte.
- **Limitación importante:** No puede modificar, eliminar ni gestionar las cuentas de otros usuarios (ni clientes ni otros administradores), salvo su propia cuenta.
- No utiliza las funcionalidades de compra como cliente final.

**Funcionalidades relevantes:**
- Gestión de productos (CRUD).
- Gestión de categorías (CRUD).
- Gestión de pedidos (Actualización de estados, visualización).
- Panel de administración.
- Consulta de clientes e historial.

**Frecuencia de uso:**
Alta. Se espera que los administradores utilicen el sistema diariamente para gestionar la operación de la tienda.

---

## 3. Superadmin

**Descripción del rol:**
Usuario con el nivel más alto de privilegios en la plataforma. Posee todas las capacidades del Administrador, pero añade el control total sobre la gestión de usuarios y configuraciones sensibles del sistema. Es el responsable de la administración de cuentas y seguridad.

**Privilegios y seguridad:**
- Posee **todos** los privilegios del rol de Administrador.
- **Gestión de Usuarios:** Tiene la capacidad exclusiva de crear, modificar y eliminar cualquier cuenta de usuario en el sistema, incluyendo:
    - Otros administradores.
    - Clientes.
    - Otros superadministradores.
- **Verificación de cuentas:** Puede forzar la verificación de correo electrónico de los usuarios (campo `email_verificado`).
- Acceso total a todas las secciones del panel de administración.

**Funcionalidades relevantes:**
- Todas las funcionalidades del Administrador (Productos, Categorías, Pedidos).
- **Gestión de Usuarios (CRUD completo):**
    - Listar todos los usuarios con filtros por rol y estado.
    - Modificar roles de usuarios (ascender a admin, degradar a cliente, etc.).
    - Eliminar usuarios del sistema.
    - Actualizar información sensible de usuarios.

**Frecuencia de uso:**
Media/Baja. Se utiliza principalmente para tareas de gestión de personal, mantenimiento de cuentas, resolución de problemas de acceso y supervisión general del sistema.
