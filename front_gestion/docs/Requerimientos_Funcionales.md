# Requerimientos funcionales

En esta sección se describen los requerimientos funcionales organizados por cada funcionalidad principal del sistema “Tienda online para Rosaline Bakery”. Cada subsección corresponde a una funcionalidad del producto y contiene: una descripción breve, la prioridad, las acciones iniciadoras y el comportamiento esperado, y la lista de requerimientos funcionales identificados con códigos únicos del tipo REQ-XXX-NNN.

## 7.1 Gestión de productos
**Descripción:**
Funcionalidad que permite a los administradores crear, editar, desactivar y organizar los productos del catálogo (panes, pasteles, galletas, etc.), incluyendo precios, descripciones, imágenes, categorías e inventario disponible.

**Prioridad:** Alta.

**Acciones iniciadoras y comportamiento esperado:**
- El administrador accede al panel de administración y selecciona la opción de “Productos”.
- El administrador puede crear un nuevo producto, editar uno existente, cambiar su estado (activo/inactivo) o eliminarlo.
- El sistema valida los datos ingresados (precio, inventario, campos obligatorios) y guarda los cambios en la base de datos.
- El sistema solo muestra productos activos en el catálogo público.

**Requerimientos funcionales:**
- **REQ-PROD-001:** El sistema debe permitir a los administradores crear productos con los campos: nombre, descripción, precio, categoría, cantidad en inventario e imagen.
- **REQ-PROD-002:** El sistema debe permitir a los administradores modificar cualquier campo de un producto existente.
- **REQ-PROD-003:** El sistema debe implementar la eliminación de productos como “soft delete” (cambio de estado a inactivo) y/o permitir la eliminación permanente si es requerido.
- **REQ-PROD-004:** El sistema debe validar que el precio sea mayor que cero y que la cantidad en inventario no sea negativa, mostrando mensajes de error claros cuando la validación falle.
- **REQ-PROD-005:** El sistema debe permitir activar o desactivar productos para controlar su visibilidad.
- **REQ-PROD-006:** El sistema debe mostrar únicamente los productos activos en el catálogo público visible para clientes e invitados.

## 7.2 Catálogo público de productos
**Descripción:**
Funcionalidad que permite a clientes e invitados navegar por el catálogo de productos, buscar y filtrar productos, y ver la información detallada de cada uno.

**Prioridad:** Alta.

**Acciones iniciadoras y comportamiento esperado:**
- El usuario (cliente o invitado) accede a la página de catálogo.
- El sistema carga y muestra la lista de productos activos, organizados por categoría.
- El usuario puede aplicar filtros por categoría y realizar búsquedas por nombre o descripción.
- El usuario puede seleccionar un producto para ver sus detalles.

**Requerimientos funcionales:**
- **REQ-CAT-001:** El sistema debe mostrar todos los productos activos en el catálogo público.
- **REQ-CAT-002:** El sistema debe permitir filtrar productos por categoría.
- **REQ-CAT-003:** El sistema debe permitir buscar productos por nombre y/o descripción mediante un campo de búsqueda.
- **REQ-CAT-004:** El sistema debe mostrar la ficha detallada de un producto (nombre, descripción, precio, imagen, disponibilidad) al seleccionarlo.
- **REQ-CAT-005:** El sistema debe mostrar la disponibilidad de un producto en función de su inventario actual.

## 7.3 Registro, autenticación y recuperación de cuenta
**Descripción:**
Funcionalidad que permite a los usuarios crear una cuenta, confirmar su email, iniciar sesión de forma segura y recuperar el acceso en caso de olvido de contraseña.

**Prioridad:** Alta.

**Acciones iniciadoras y comportamiento esperado:**
- El usuario accede a las pantallas de registro o inicio de sesión desde el frontend.
- El sistema valida los datos de registro, envía un correo de confirmación y activa la cuenta cuando el usuario confirma.
- Para el inicio de sesión, el sistema valida credenciales y genera un token de autenticación.
- Para la recuperación, el sistema envía un PIN por correo y permite restablecer la contraseña tras validarlo.

**Requerimientos funcionales:**
- **REQ-AUTH-001:** El sistema debe permitir el registro de nuevos usuarios mediante email y contraseña.
- **REQ-AUTH-002:** El sistema debe validar que el email tenga formato correcto y no esté previamente registrado.
- **REQ-AUTH-003:** El sistema debe enviar un correo de confirmación de cuenta con un enlace o token al completar el registro.
- **REQ-AUTH-004:** El sistema debe permitir activar la cuenta del usuario al acceder al enlace o token de confirmación dentro del tiempo de validez.
- **REQ-AUTH-005:** El sistema debe permitir a los usuarios iniciar sesión usando su email y contraseña.
- **REQ-AUTH-006:** El sistema debe generar y devolver un token JWT válido al usuario tras un inicio de sesión exitoso.
- **REQ-AUTH-007:** El sistema debe permitir solicitar recuperación de contraseña mediante el email registrado.
- **REQ-AUTH-008:** El sistema debe enviar un PIN de recuperación de 6 dígitos al email del usuario.
- **REQ-AUTH-009:** El sistema debe validar el PIN ingresado por el usuario antes de permitir el cambio de contraseña.
- **REQ-AUTH-010:** El sistema debe permitir establecer una nueva contraseña cuando el PIN es válido y no ha expirado.

## 7.4 Gestión de perfil de cliente
**Descripción:**
Funcionalidad que permite a los clientes ver y actualizar la información de su perfil, incluyendo datos personales y dirección de envío.

**Prioridad:** Media.

**Acciones iniciadoras y comportamiento esperado:**
- El cliente autenticado accede a la sección “Mi perfil”.
- El sistema muestra la información actual del perfil.
- El cliente puede actualizar datos como nombre, apellido, teléfono y dirección.
- El sistema valida los campos obligatorios y guarda los cambios.

**Requerimientos funcionales:**
- **REQ-PERF-001:** El sistema debe permitir a los clientes registrar y actualizar los datos de su perfil: nombre, apellido, teléfono y dirección.
- **REQ-PERF-002:** El sistema debe validar que nombre y apellido sean campos obligatorios.
- **REQ-PERF-003:** El sistema debe permitir al cliente cambiar su contraseña, solicitando la contraseña actual para confirmar la operación.

## 7.5 Carrito de compras y creación de pedidos
**Descripción:**
Funcionalidad que permite a los clientes agregar productos a un carrito, modificarlo y generar un pedido final.

**Prioridad:** Alta.

**Acciones iniciadoras y comportamiento esperado:**
- El cliente selecciona productos desde el catálogo y los agrega al carrito.
- El sistema valida el inventario disponible antes de agregar o actualizar cantidades.
- El cliente revisa el carrito y confirma la creación del pedido indicando método de pago y opción de entrega/recogida.
- El sistema crea el pedido, descuenta inventario y muestra la confirmación.

**Requerimientos funcionales:**
- **REQ-CARR-001:** El sistema debe permitir agregar productos al carrito de compras desde el catálogo y la ficha de producto.
- **REQ-CARR-002:** El sistema debe validar que la cantidad solicitada no exceda el inventario disponible antes de agregar o actualizar un producto en el carrito.
- **REQ-CARR-003:** El sistema debe permitir modificar la cantidad de cada producto en el carrito.
- **REQ-CARR-004:** El sistema debe permitir eliminar productos individuales del carrito.
- **REQ-CARR-005:** El sistema debe calcular automáticamente subtotal, impuestos (si aplica) y total del carrito.
- **REQ-CARR-006:** El sistema debe mantener el carrito asociado al cliente autenticado durante su sesión.
- **REQ-PED-CLI-001:** El sistema debe permitir crear un pedido a partir del contenido del carrito.
- **REQ-PED-CLI-002:** El sistema debe requerir método de pago y opción de entrega/recogida antes de confirmar el pedido.
- **REQ-PED-CLI-003:** El sistema debe descontar automáticamente del inventario las cantidades correspondientes al crear el pedido.

## 7.6 Gestión de pedidos (cliente)
**Descripción:**
Funcionalidad que permite a los clientes consultar el historial de pedidos y ver el estado y detalle de cada uno.

**Prioridad:** Media.

**Acciones iniciadoras y comportamiento esperado:**
- El cliente autenticado accede a la sección “Mis pedidos”.
- El sistema muestra la lista de pedidos del cliente con su estado actual.
- El cliente puede seleccionar un pedido para ver los detalles completos.

**Requerimientos funcionales:**
- **REQ-PED-CLI-004:** El sistema debe mostrar al cliente el historial completo de sus pedidos.
- **REQ-PED-CLI-005:** El sistema debe mostrar el estado actual de cada pedido (pendiente, en preparación, enviado/listo para recoger, entregado, cancelado).
- **REQ-PED-CLI-006:** El sistema debe mostrar los productos, cantidades, precios y totales correspondientes a cada pedido.

## 7.7 Gestión de pedidos (administrador)
**Descripción:**
Funcionalidad que permite a los administradores controlar el ciclo de vida de los pedidos y revisar su información.

**Prioridad:** Alta.

**Acciones iniciadoras y comportamiento esperado:**
- El administrador accede al módulo de pedidos en el panel de administración.
- El sistema muestra la lista de todos los pedidos con filtros por estado.
- El administrador puede cambiar el estado de un pedido siguiendo reglas de negocio y, si es necesario, cancelarlo o eliminarlo.

**Requerimientos funcionales:**
- **REQ-PED-ADM-001:** El sistema debe permitir a los administradores ver todos los pedidos registrados.
- **REQ-PED-ADM-002:** El sistema debe permitir a los administradores cambiar el estado de un pedido siguiendo las transiciones permitidas.
- **REQ-PED-ADM-003:** El sistema debe permitir filtrar pedidos por estado, fecha y/o cliente.
- **REQ-PED-ADM-004:** El sistema debe mostrar los detalles completos de un pedido: productos, cantidades, totales, datos del cliente y dirección de entrega/recogida.
- **REQ-PED-ADM-005:** El sistema debe permitir cancelar un pedido y registrar el motivo de cancelación.
- **REQ-PED-ADM-006:** El sistema debe permitir eliminar pedidos permanentemente de la base de datos.

## 7.8 Gestión de categorías
**Descripción:**
Funcionalidad que permite a los administradores organizar los productos en categorías para facilitar la navegación del catálogo.

**Prioridad:** Media.

**Acciones iniciadoras y comportamiento esperado:**
- El administrador accede al módulo de categorías.
- El sistema muestra la lista de categorías existentes.
- El administrador puede crear, editar, activar/desactivar y eliminar categorías.

**Requerimientos funcionales:**
- **REQ-CAT-101:** El sistema debe permitir a los administradores crear nuevas categorías indicando nombre y descripción.
- **REQ-CAT-102:** El sistema debe permitir modificar el nombre y descripción de categorías existentes.
- **REQ-CAT-103:** El sistema debe permitir activar o desactivar categorías para controlar su visibilidad en el catálogo.
- **REQ-CAT-104:** El sistema debe permitir la eliminación de categorías (validando restricciones de integridad si aplica).

## 7.9 Gestión de usuarios (Administrador y Superadmin)
**Descripción:**
Funcionalidad que permite a los administradores y superadministradores gestionar las cuentas de usuario del sistema, incluyendo asignación de roles y verificación.

**Prioridad:** Alta.

**Acciones iniciadoras y comportamiento esperado:**
- El administrador accede a la pestaña "Usuarios" en el panel.
- El sistema lista los usuarios registrados con filtros por rol, correo y estado de verificación.
- El administrador puede buscar usuarios específicos.
- El Superadmin puede modificar roles y estados de verificación, y eliminar usuarios.

**Requerimientos funcionales:**
- **REQ-USR-001:** El sistema debe permitir listar todos los usuarios registrados con paginación.
- **REQ-USR-002:** El sistema debe permitir filtrar usuarios por rol (cliente, admin, super_admin), estado de verificación de email y búsqueda por correo.
- **REQ-USR-003:** El sistema debe permitir al Superadmin modificar el rol de un usuario (ascender o degradar).
- **REQ-USR-004:** El sistema debe permitir al Superadmin modificar el estado de verificación de email de un usuario.
- **REQ-USR-005:** El sistema debe permitir eliminar usuarios permanentemente.
- **REQ-USR-006:** El sistema debe restringir las acciones de modificación y eliminación de otros administradores/superadmins únicamente al rol de Superadmin.

## 7.10 Gestión de clientes (Administrador)
**Descripción:**
Funcionalidad que permite a los administradores consultar y gestionar la información detallada de los clientes registrados.

**Prioridad:** Media.

**Acciones iniciadoras y comportamiento esperado:**
- El administrador accede a la pestaña "Clientes".
- El sistema muestra una lista de clientes con su información básica.
- El administrador puede ver detalles completos o eliminar un cliente.

**Requerimientos funcionales:**
- **REQ-CLI-ADM-001:** El sistema debe permitir listar los clientes registrados con paginación.
- **REQ-CLI-ADM-002:** El sistema debe permitir buscar clientes por nombre, apellido o correo electrónico.
- **REQ-CLI-ADM-003:** El sistema debe permitir ver el detalle completo de un cliente (información de contacto, dirección, fecha de registro).
- **REQ-CLI-ADM-004:** El sistema debe permitir a los administradores eliminar la cuenta y perfil de un cliente.
