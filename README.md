# Proyecto de Turnos Medicos

**Materia:** Programación 2  
**Alumna:** Moya Valentina
**Institución:** ISSD
---

## Descripcion

Este proyecto implementa la logica backend de un sistema de turnos medicos.

Los pacientes pueden registrarse, iniciar sesion, consultar profesionales, reservar turnos y ver su historial. Los administradores pueden gestionar usuarios, profesionales y turnos.

La autenticacion se realiza mediante JWT almacenado en una cookie `httpOnly`, y el acceso a las rutas se controla mediante middlewares de autenticacion y autorizacion por rol.

---

## Stack tecnologico

| Tecnologia | Uso |
|---|---|
| Node.js | Entorno de ejecucion |
| Express | Framework para crear la API |
| MongoDB | Base de datos |
| Mongoose | Modelado y consultas a MongoDB |
| bcryptjs | Hash de contrasenas |
| jsonwebtoken | Creacion y verificacion de JWT |
| cookie-parser | Lectura de cookies |
| express-validator | Validacion de datos |
| helmet | Seguridad HTTP basica |
| cors | Configuracion de acceso desde otros clientes |
| morgan | Logs de peticiones HTTP |
| Jest | Framework de testing |
| Supertest | Tests de endpoints HTTP |

---

## Funcionalidades

- Registro y login de usuarios.
- Hash de contrasenas con bcrypt.
- Autenticacion con JWT mediante cookies `httpOnly`.
- Roles: `admin` y `paciente`.
- Middleware para proteger rutas privadas.
- Middleware para restringir acciones segun rol.
- CRUD de usuarios para administradores.
- CRUD de profesionales medicos.
- Gestion de turnos medicos.
- Historial de turnos del paciente.
- Cambio de estado de turnos por admin.
- Cancelacion de turnos propios por paciente.
- Control de agenda para evitar turnos duplicados.
- Filtros por especialidad, profesional y estado.
- Manejo centralizado de errores.
- Tests de integracion.

---

## Instalacion y puesta en marcha

### 1. Clonar el repositorio

```bash
git clone <url-del-repo>
cd proyecto_turnos
```

Si el proyecto ya esta descargado, abrir directamente la carpeta `proyecto_turnos` en VS Code.

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar variables de entorno

Crear un archivo `.env` en la raiz del proyecto. En Windows se puede copiar desde el ejemplo con:

```bash
copy .env.example .env
```

En Linux/Mac:

```bash
cp .env.example .env
```

Editar el archivo `.env` con los valores correspondientes:

```env
PORT=3000
MONGO_URI=mongodb://127.0.0.1:27017/proyecto_turnos
MONGO_URI_TEST=mongodb://127.0.0.1:27017/proyecto_turnos_test
JWT_SECRET=clave_super_secreta
JWT_EXPIRES_IN=7d
NODE_ENV=development
```

### 4. Ejecutar el servidor

```bash
npm run dev
```

La API queda disponible en:

```txt
http://localhost:3000
```

---

## Ejecucion

Modo desarrollo:

```bash
npm run dev
```

Modo normal:

```bash
npm start
```

La API queda disponible en:

```txt
http://localhost:3000
```

---

## Interfaz visual

El proyecto incluye una interfaz simple servida desde la carpeta `public/`.

Con el servidor corriendo, se puede abrir en el navegador:

```txt
http://localhost:3000
```

Desde la interfaz se puede probar:

- Registro y login.
- Consulta de sesion autenticada.
- Listado de profesionales.
- Creacion de turnos.
- Historial de turnos del paciente.
- Creacion de profesionales como admin.
- Consulta y cambio de estado de turnos como admin.

La interfaz consume los mismos endpoints de la API y usa la cookie `httpOnly` generada en el login.

## Tests

Ejecutar tests:

```bash
npm test
```

Los tests usan una base separada configurada con `MONGO_URI_TEST`.

Actualmente se prueban:

- Registro de usuarios.
- Login de usuarios.
- Cookie con token.
- Ruta de usuario autenticado.
- CRUD de usuarios por admin.
- Restriccion de rutas de usuarios para pacientes.
- Creacion de profesionales por admin.
- Restriccion de permisos para pacientes.
- Creacion de turnos.
- Rechazo de turnos duplicados.
- Historial de turnos del paciente.
- Restriccion de rutas segun rol.

---

## Roles y permisos

| Rol | Permisos |
|---|---|
| `admin` | Gestionar usuarios, profesionales y turnos. Puede consultar todos los turnos, cambiar estados y eliminar registros. |
| `paciente` | Consultar profesionales, crear turnos, ver su historial y cancelar sus propios turnos. |

---

## Estados del turno

| Estado | Descripcion |
|---|---|
| `pendiente` | Turno creado, pendiente de confirmacion. |
| `confirmado` | Turno confirmado por administracion. |
| `cancelado` | Turno cancelado por el paciente o administracion. |

---

## Endpoints

### Auth

| Metodo | Ruta | Acceso | Descripcion |
|---|---|---|---|
| POST | `/api/auth/register` | Publico | Registrar usuario |
| POST | `/api/auth/login` | Publico | Iniciar sesion |
| POST | `/api/auth/logout` | Publico | Cerrar sesion |
| GET | `/api/auth/me` | Autenticado | Obtener datos del usuario autenticado |

### Usuarios

| Metodo | Ruta | Acceso | Descripcion |
|---|---|---|---|
| GET | `/api/users` | Admin | Listar usuarios |
| GET | `/api/users/:id` | Admin | Obtener usuario por ID |
| PUT | `/api/users/:id` | Admin | Actualizar usuario |
| DELETE | `/api/users/:id` | Admin | Eliminar usuario |

### Profesionales

| Metodo | Ruta | Acceso | Descripcion |
|---|---|---|---|
| GET | `/api/professionals` | Autenticado | Listar profesionales. Permite filtrar con `?specialty=` |
| GET | `/api/professionals/:id` | Autenticado | Obtener profesional por ID |
| POST | `/api/professionals` | Admin | Crear profesional |
| PUT | `/api/professionals/:id` | Admin | Actualizar profesional |
| DELETE | `/api/professionals/:id` | Admin | Eliminar profesional |

### Turnos

| Metodo | Ruta | Acceso | Descripcion |
|---|---|---|---|
| POST | `/api/appointments` | Paciente / Admin | Crear turno |
| GET | `/api/appointments/me` | Paciente | Ver historial propio |
| GET | `/api/appointments` | Admin | Listar todos los turnos. Permite filtros |
| GET | `/api/appointments/:id` | Admin | Obtener turno por ID |
| PATCH | `/api/appointments/:id/status` | Admin | Cambiar estado del turno |
| PATCH | `/api/appointments/:id/cancel` | Paciente | Cancelar turno propio |
| DELETE | `/api/appointments/:id` | Admin | Eliminar turno |

Filtros disponibles para turnos:

```txt
?specialty=Cardiologia
?professional=<id-del-profesional>
?status=pendiente
```

---

## Autenticacion

El sistema usa JWT guardado en una cookie llamada `token`.

Cuando el usuario inicia sesion correctamente:

1. El servidor valida email y contrasena.
2. La contrasena se compara contra el hash guardado en MongoDB.
3. Se genera un JWT con el `id` y el `role` del usuario.
4. El JWT se guarda en una cookie `httpOnly`.
5. Las rutas protegidas leen esa cookie para validar la sesion.

---

## Seguridad

El proyecto aplica:

- Hash de contrasenas.
- JWT para autenticacion.
- Cookies `httpOnly`.
- Validacion de datos de entrada.
- Middleware de autenticacion.
- Middleware de autorizacion por roles.
- Manejo centralizado de errores.
- Uso de `helmet` para cabeceras HTTP basicas de seguridad.

---

## Control de agenda

Antes de crear un turno, el sistema verifica que no exista otro turno activo con:

- mismo profesional
- misma fecha
- misma hora

Si ya existe un turno en ese horario, la API responde con estado `409`.

Los turnos cancelados no bloquean nuevos turnos en el mismo horario.

---

## Estructura del proyecto

```txt
src/
|-- config/
|   `-- db.js
|
|-- middlewares/
|   |-- auth.middleware.js
|   |-- role.middleware.js
|   |-- validate.middleware.js
|   `-- error.middleware.js
|
|-- modules/
|   |-- auth/
|   |-- users/
|   |-- professionals/
|   `-- appointments/
|
|-- utils/
|   |-- hash.util.js
|   `-- jwt.util.js
|
|-- app.js
`-- server.js
```

---

## Organizacion por capas

Cada modulo separa responsabilidades:

| Capa | Responsabilidad |
|---|---|
| `routes` | Define endpoints, validaciones y middlewares |
| `controller` | Recibe la request y arma la response |
| `service` | Contiene la logica de negocio |
| `model` | Define el esquema de datos en MongoDB |

---

## Resumen

El proyecto cumple con una estructura modular y segura para la gestion de turnos medicos. Integra autenticacion, roles, validaciones, control de agenda, manejo de errores y tests de integracion para verificar los casos principales de uso.
