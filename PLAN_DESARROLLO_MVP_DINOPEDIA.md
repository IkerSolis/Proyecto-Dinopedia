# Plan de Desarrollo MVP — Dinopedia
> **Alcance:** Este documento cubre **exclusivamente** las tareas de programación necesarias para alcanzar el MVP (demo funcional del producto), equivalente a lo definido en el Sprint 2. No incluye tareas posteriores al MVP ni funcionalidades de prioridad Media o Baja que no sean requeridas para la demo.

---

## 1. Contexto del Proyecto

**Dinopedia** es una aplicación web que funciona como enciclopedia de dinosaurios. Permite a usuarios consultar información detallada de cada espécimen y a administradores gestionar el catálogo.

**Stack tecnológico definido:**
- **Backend:** Node.js con Express (puerto 3000)
- **Base de datos:** PostgreSQL (conexión por pool)
- **Frontend:** HTML + CSS + JavaScript vanilla (archivos estáticos servidos por Express)
- **Autenticación:** JWT o sesión de servidor (para el rol admin)
- **Control de versiones:** Git

---

## 2. Reglas Globales del Proyecto

> Estas reglas aplican a **todas** las tareas sin excepción. Ninguna tarea puede omitirlas.

### 2.1 Estructura de Archivos

```
/
├── app.js                  # Entry point del servidor Express
├── .env                    # Variables de entorno (nunca se commitea)
├── .env.example            # Plantilla de variables de entorno (sí se commitea)
├── package.json
├── /config
│   └── db.js               # Pool de conexión a PostgreSQL
├── /routes
│   ├── auth.js             # Rutas de autenticación
│   └── dinos.js            # Rutas del recurso dinosaurio
├── /middleware
│   └── authMiddleware.js   # Verificación de JWT / sesión
├── /public
│   ├── /css
│   │   └── styles.css
│   ├── /js
│   │   └── main.js
│   └── index.html
└── /sql
    ├── schema.sql           # Definición de tablas
    └── seed.sql             # Datos de muestra (mínimo 5 dinosaurios)
```

### 2.2 Variables de Entorno

Todas las credenciales y configuraciones sensibles **deben** leerse desde `.env`. Las siguientes variables son obligatorias:

```
PORT=3000
DB_HOST=
DB_PORT=
DB_NAME=
DB_USER=
DB_PASSWORD=
JWT_SECRET=
ADMIN_USER=
ADMIN_PASSWORD=
```

### 2.3 Convenciones de Código

- **Idioma del código:** Inglés (nombres de variables, funciones, rutas).
- **Idioma de la UI:** Español.
- **Manejo de errores:** Toda función asíncrona debe tener `try/catch`. Los errores deben retornar un JSON con la forma `{ "error": "descripción del error" }` y el código HTTP correspondiente.
- **Respuestas de la API:** Siempre en formato JSON.
- **No usar frameworks de frontend** (React, Vue, Angular). Solo HTML, CSS y JS vanilla.
- **No hardcodear** ningún valor que deba venir de `.env`.

### 2.4 Base de Datos

- Usar siempre **parámetros de consulta preparados** (`$1, $2, ...`) para prevenir SQL Injection.
- Nunca concatenar variables directamente dentro de una query SQL.
- El pool de conexión debe configurarse en `/config/db.js` y exportarse como módulo.

### 2.5 Autenticación

- Solo el rol **admin** puede crear dinosaurios.
- El admin se identifica con credenciales fijas definidas en `.env` (`ADMIN_USER`, `ADMIN_PASSWORD`). No se requiere tabla de usuarios para el MVP.
- Toda ruta protegida debe pasar por el middleware `authMiddleware.js` antes de ejecutar su lógica.
- El token JWT (o cookie de sesión) debe adjuntarse en cada petición del frontend a rutas protegidas.

---

## 3. Fase 1 — Infraestructura Base (Sprint 1, prerequisito)

> Esta fase es el punto de partida. Si no está completada, debe ejecutarse antes de cualquier tarea del Sprint 2.

### TAREA S1-01: Repositorio e Infraestructura
**Descripción:** Crear el repositorio Git y la estructura de carpetas del proyecto.

**Acciones:**
1. Inicializar repositorio Git. (Ya inicializado)
2. Crear la estructura de directorios descrita en §2.1.
3. Crear `.gitignore` que excluya: `node_modules/`, `.env`.
4. Crear `.env.example` con todas las claves de §2.2 sin valores.
5. Ejecutar `npm init` y registrar dependencias: `express`, `pg`, `dotenv`, `jsonwebtoken`.

**Criterio de aceptación:** El repositorio existe, la estructura de carpetas está creada y `npm install` no lanza errores.

---

### TAREA S1-02: Servidor Express Base
**Descripción:** Configurar el servidor Express mínimo.

**Acciones:**
1. En `app.js`: importar `express`, `dotenv`, configurar `express.json()`, `express.static('public')`.
2. Definir la ruta raíz `GET /` que sirva `public/index.html`.
3. El servidor debe escuchar en el puerto definido en `process.env.PORT`.

**Criterio de aceptación:** `npm start` levanta el servidor sin errores y `GET http://localhost:3000` responde con status 200.

---

### TAREA S1-03 y S1-04: Conexión a Base de Datos y Variables de Entorno
**Descripción:** Conectar Express con PostgreSQL usando variables de entorno.

**Acciones:**
1. En `.env`, rellenar las credenciales reales de PostgreSQL.
2. En `/config/db.js`, crear y exportar un `Pool` de `pg` usando las variables de entorno.
3. En `app.js`, importar el pool y hacer una consulta de prueba (`SELECT NOW()`) al iniciar. Si falla, mostrar el error en consola y terminar el proceso.

**Criterio de aceptación:** Al iniciar el servidor, la consola muestra la fecha/hora actual de PostgreSQL sin errores.

---

### TAREA S1-05 y S1-06: Base de Datos y Datos de Muestra
**Descripción:** Crear el esquema de la base de datos e insertar registros iniciales.

**Schema obligatorio** (`/sql/schema.sql`):

```sql
CREATE TABLE IF NOT EXISTS dinosaurios (
  id         SERIAL PRIMARY KEY,
  nombre     VARCHAR(100) NOT NULL,
  tamanio    VARCHAR(50),
  peso       VARCHAR(50),
  dieta      VARCHAR(50),
  ubicacion  VARCHAR(100),
  descripcion TEXT,
  imagen_url VARCHAR(255)
);
```

**Seed obligatorio** (`/sql/seed.sql`): Insertar mínimo **5 dinosaurios** con todos los campos rellenos. Los valores deben ser datos reales y coherentes (no texto de placeholder como "Lorem ipsum").

**Criterio de aceptación:** Las tablas existen en PostgreSQL y la consulta `SELECT COUNT(*) FROM dinosaurios` retorna al menos 5.

---

### TAREA S1-07 a S1-10: Frontend Base
**Descripción:** Crear la página HTML base y los archivos de estilos y scripts.

**Acciones:**
1. `public/index.html`: Estructura semántica con `<header>`, `<main>` y `<footer>`. Incluir enlace a `css/styles.css` y `js/main.js`.
2. `public/css/styles.css`: Reset CSS, paleta de colores del proyecto, tipografía base, diseño responsivo simple (mobile-first).
3. `public/js/main.js`: Archivo vacío con comentario de sección para cada módulo futuro.

**Criterio de aceptación:** `http://localhost:3000` carga una página visible, sin errores en consola, legible en escritorio y móvil.

---

## 4. Fase 2 — Backend API (Sprint 2 — MVP)

> Todas las rutas deben definirse en sus archivos correspondientes en `/routes/` e importarse en `app.js` con su prefijo `/api`.

---

### TAREA S2-01: Endpoint GET /api/dinos
**Archivo:** `/routes/dinos.js`
**Descripción:** Devolver la lista completa de dinosaurios.

**Especificación:**
- Método: `GET`
- Ruta: `/api/dinos`
- Protección: Ninguna (ruta pública).
- Query SQL: `SELECT id, nombre, dieta, imagen_url FROM dinosaurios ORDER BY nombre ASC`
- Respuesta exitosa (200):
  ```json
  [
    { "id": 1, "nombre": "T-Rex", "dieta": "Carnívoro", "imagen_url": "https://..." }
  ]
  ```
- Respuesta de error (500): `{ "error": "Error al obtener dinosaurios" }`

**Restricciones:**
- No devolver todos los campos en este endpoint; solo los necesarios para la tarjeta de lista.
- Usar `try/catch` con el pool importado de `/config/db.js`.

**Criterio de aceptación:** `GET /api/dinos` retorna un array JSON con al menos 5 elementos y status 200.

---

### TAREA S2-02: Endpoint GET /api/dinos/:id
**Archivo:** `/routes/dinos.js`
**Descripción:** Devolver la ficha completa de un dinosaurio por su ID.

**Especificación:**
- Método: `GET`
- Ruta: `/api/dinos/:id`
- Protección: Ninguna (ruta pública).
- Query SQL: `SELECT * FROM dinosaurios WHERE id = $1`
- El parámetro `:id` debe validarse como entero positivo antes de ejecutar la query.
- Respuesta exitosa (200): Objeto JSON con todos los campos del dinosaurio.
- Respuesta si no existe (404): `{ "error": "Dinosaurio no encontrado" }`
- Respuesta de error (500): `{ "error": "Error al obtener el dinosaurio" }`

**Restricciones:**
- Si `req.params.id` no es un número entero, responder con 400: `{ "error": "ID inválido" }`.

**Criterio de aceptación:** `GET /api/dinos/1` retorna el objeto completo del primer dinosaurio. `GET /api/dinos/9999` retorna 404.

---

### TAREA S2-03: Endpoint GET /api/search
**Archivo:** `/routes/dinos.js`
**Descripción:** Buscar dinosaurios por nombre con coincidencia parcial.

**Especificación:**
- Método: `GET`
- Ruta: `/api/search?q=<término>`
- Protección: Ninguna (ruta pública).
- Query SQL: `SELECT id, nombre, dieta, imagen_url FROM dinosaurios WHERE LOWER(nombre) LIKE LOWER($1)`
- El parámetro `$1` debe ser `'%' + q + '%'`.
- Si el query param `q` no existe o está vacío, devolver 400: `{ "error": "Parámetro de búsqueda requerido" }`.
- Respuesta exitosa (200): Array de coincidencias (puede ser vacío `[]`).
- Si no hay coincidencias, devolver array vacío con status 200 (no es un error).

**Restricciones:**
- Usar `LOWER()` en ambos lados de la comparación para insensibilidad a mayúsculas.
- Nunca concatenar `q` directamente en la cadena SQL; siempre usar `$1`.

**Criterio de aceptación:** `GET /api/search?q=rex` retorna todos los dinosaurios con "rex" en el nombre. `GET /api/search?q=zzz` retorna `[]`.

---

### TAREA S2-04: Endpoint POST /api/login
**Archivo:** `/routes/auth.js`
**Descripción:** Autenticar al administrador y emitir un token JWT.

**Especificación:**
- Método: `POST`
- Ruta: `/api/login`
- Protección: Ninguna.
- Body esperado: `{ "usuario": "...", "password": "..." }`
- Lógica:
  1. Leer `ADMIN_USER` y `ADMIN_PASSWORD` de `process.env`.
  2. Comparar con `req.body.usuario` y `req.body.password` usando `===`.
  3. Si coinciden, generar un JWT con payload `{ role: "admin" }`, firmado con `JWT_SECRET`, expiración `2h`.
  4. Devolver: `{ "token": "<jwt>" }` con status 200.
- Respuesta de credenciales inválidas (401): `{ "error": "Credenciales inválidas" }`
- Respuesta de error de servidor (500): `{ "error": "Error en el servidor" }`

**Restricciones:**
- **No** consultar ni almacenar usuarios en la base de datos para el MVP.
- El JWT debe incluir al menos: `{ role: "admin" }` en el payload.

**Criterio de aceptación:** `POST /api/login` con credenciales correctas devuelve un JWT válido con status 200. Con credenciales incorrectas devuelve 401.

---

### TAREA S2-06: Middleware de Autenticación
**Archivo:** `/middleware/authMiddleware.js`
**Descripción:** Verificar JWT en rutas protegidas antes de ejecutar su lógica.

**Especificación:**
- Leer el token del header: `Authorization: Bearer <token>`.
- Verificar con `jwt.verify(token, process.env.JWT_SECRET)`.
- Si el token es válido, adjuntar el payload decodificado a `req.user` y llamar a `next()`.
- Si el token está ausente: responder 401 `{ "error": "Token requerido" }`.
- Si el token es inválido o expirado: responder 403 `{ "error": "Token inválido o expirado" }`.

**Restricciones:**
- Este middleware **no** debe contener lógica de negocio; solo verificación del token.
- Debe exportarse como función middleware estándar de Express: `module.exports = (req, res, next) => {}`.

**Criterio de aceptación:** Una ruta protegida con este middleware rechaza peticiones sin token (401) y permite peticiones con token válido.

---

### TAREA S2-05: Endpoint POST /api/dinos
**Archivo:** `/routes/dinos.js`
**Descripción:** Agregar un nuevo dinosaurio (solo admin autenticado).

**Especificación:**
- Método: `POST`
- Ruta: `/api/dinos`
- Protección: **Requiere** el middleware `authMiddleware` (ver S2-06). Debe aplicarse antes del handler de la ruta.
- Body esperado:
  ```json
  {
    "nombre": "string (requerido)",
    "tamanio": "string",
    "peso": "string",
    "dieta": "string",
    "ubicacion": "string",
    "descripcion": "string",
    "imagen_url": "string"
  }
  ```
- Validación: Si `nombre` está ausente o vacío, responder 400: `{ "error": "El nombre es requerido" }`.
- Query SQL: `INSERT INTO dinosaurios (nombre, tamanio, peso, dieta, ubicacion, descripcion, imagen_url) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`
- Respuesta exitosa (201): El objeto del dinosaurio recién creado.
- Respuesta de error (500): `{ "error": "Error al agregar el dinosaurio" }`

**Restricciones:**
- Esta ruta **debe** tener `authMiddleware` aplicado. Sin él, cualquier usuario podría agregar registros.
- Usar `RETURNING *` para devolver el registro insertado sin hacer una segunda consulta.

**Criterio de aceptación:** `POST /api/dinos` sin token devuelve 401. Con token válido y body correcto, devuelve el nuevo dinosaurio con status 201 y el registro aparece al llamar `GET /api/dinos`.

---

## 5. Fase 3 — Frontend MVP (Sprint 2 — MVP)

> Todo el frontend es HTML + CSS + JavaScript vanilla. Sin frameworks. Todos los archivos van dentro de `/public/`.

---

### TAREA S2-07: Pantalla de Inicio — Lista de Dinosaurios
**Archivos:** `public/index.html`, `public/js/main.js`, `public/css/styles.css`
**Descripción:** Mostrar todos los dinosaurios como tarjetas al cargar la página.

**Especificación:**
- Al cargar `index.html`, ejecutar `fetch('/api/dinos')` dentro del evento `DOMContentLoaded`.
- Por cada dinosaurio recibido, crear dinámicamente una tarjeta `<div class="card">` que contenga:
  - Imagen: `<img src="imagen_url" alt="nombre">`.
  - Nombre: `<h3>`.
  - Dieta: `<p>`.
  - Área clickeable que navegue a `dino.html?id=<id>`.
- Las tarjetas deben insertarse dentro de `<div id="dinos-container">` en el HTML.
- Si la petición falla, mostrar un mensaje de error visible en la UI, no solo en consola.

**Restricciones:**
- No usar `innerHTML` con datos del servidor; usar `textContent` para texto y asignar `src` directamente para imágenes.
- El fetch debe hacerse en el evento `DOMContentLoaded`, no en el top-level del script.

**Criterio de aceptación:** Al abrir `http://localhost:3000`, se muestran al menos 5 tarjetas con imagen, nombre y dieta.

---

### TAREA S2-08: Barra de Búsqueda Funcional
**Archivos:** `public/js/main.js`, `public/index.html`
**Descripción:** Input que filtra dinosaurios por nombre en tiempo real consumiendo la API.

**Especificación:**
- Agregar `<input id="search-bar" type="text" placeholder="Buscar dinosaurio...">` en `index.html`.
- Escuchar el evento `input` en el buscador.
- Al escribir 2 o más caracteres, ejecutar `fetch('/api/search?q=<valor>')` y renderizar los resultados en `#dinos-container` (reemplazando el contenido anterior).
- Si el input se vacía o tiene menos de 2 caracteres, recargar la lista completa con `GET /api/dinos`.
- Si la búsqueda devuelve `[]`, mostrar el mensaje: **"No se encontraron dinosaurios con ese nombre."**

**Restricciones:**
- Implementar debounce de mínimo 300ms con `setTimeout` / `clearTimeout`. No usar librerías externas para esto.
- No recargar la página al buscar; toda la actualización es en el DOM.

**Criterio de aceptación:** Escribir "rex" en el buscador muestra solo dinosaurios con "rex" en su nombre. Borrar el texto restaura la lista completa.

---

### TAREA S2-09: Pantalla de Ficha de Dinosaurio
**Archivos:** `public/dino.html`, `public/js/dino.js`
**Descripción:** Página dedicada que muestra la información completa de un dinosaurio.

**Especificación:**
- Crear `public/dino.html` con contenedores identificados: `#dino-nombre`, `#dino-imagen`, `#dino-dieta`, `#dino-tamanio`, `#dino-peso`, `#dino-ubicacion`, `#dino-descripcion`.
- Crear `public/js/dino.js`. Al cargar la página:
  1. Leer el parámetro `id` de la URL con `new URLSearchParams(window.location.search).get('id')`.
  2. Si no hay `id` o no es un número, redirigir a `index.html`.
  3. Hacer `fetch('/api/dinos/<id>')` y poblar cada contenedor del DOM con los datos.
  4. Si el servidor devuelve 404, mostrar: **"Dinosaurio no encontrado."**
- Incluir un botón o enlace "← Volver" que lleve a `index.html`.

**Restricciones:**
- Validar que el `id` de la URL sea un número entero antes de hacer la petición.
- La imagen debe tener un `alt` con el nombre del dinosaurio.

**Criterio de aceptación:** Navegar a `dino.html?id=1` muestra todos los campos del dinosaurio con ID 1. El botón volver regresa a `index.html`.

---

### TAREA S2-10: Formulario de Login del Admin
**Archivos:** `public/login.html`, `public/js/login.js`
**Descripción:** Pantalla para que el administrador ingrese sus credenciales.

**Especificación:**
- Crear `public/login.html` con:
  - `<input id="usuario" type="text">` para el usuario.
  - `<input id="password" type="password">` para la contraseña.
  - `<button id="btn-login">Ingresar</button>`.
  - `<p id="error-msg" style="color:red; display:none;">Credenciales inválidas.</p>`
- Crear `public/js/login.js`. Al hacer click en `#btn-login`:
  1. Deshabilitar el botón durante la petición (`btn.disabled = true`).
  2. Hacer `fetch('POST /api/login')` con body `{ usuario, password }` y header `Content-Type: application/json`.
  3. Si la respuesta es 200, guardar el token en `sessionStorage` con clave `adminToken` y redirigir a `admin.html`.
  4. Si la respuesta es 401, mostrar `#error-msg` y re-habilitar el botón.
  5. En cualquier otro error, mostrar "Error de servidor. Intenta nuevamente."

**Restricciones:**
- Usar `sessionStorage`, no `localStorage`.
- No usar etiqueta `<form>` con `action` nativo; interceptar el evento con JavaScript.
- Deshabilitar el botón durante la petición para evitar múltiples envíos simultáneos.

**Criterio de aceptación:** Con credenciales correctas, el token se guarda en `sessionStorage` y el usuario llega a `admin.html`. Con credenciales incorrectas, aparece el mensaje de error.

---

### TAREA S2-11: Panel de Administrador
**Archivos:** `public/admin.html`, `public/js/admin.js`
**Descripción:** Dashboard simple para que el admin agregue nuevos dinosaurios.

**Especificación:**
- Crear `public/admin.html` con:
  - Título "Panel de Administrador".
  - Campos con sus IDs: `#adm-nombre`, `#adm-tamanio`, `#adm-peso`, `#adm-dieta`, `#adm-ubicacion`, `#adm-descripcion` (textarea), `#adm-imagen-url`.
  - `<button id="btn-agregar">Agregar Dinosaurio</button>`.
  - `<p id="adm-msg"></p>` para mensajes de éxito o error.
  - Enlace "Cerrar sesión" que ejecute `sessionStorage.clear()` y redirija a `login.html`.
- Crear `public/js/admin.js`. Al cargar la página:
  1. Verificar que `sessionStorage.getItem('adminToken')` exista. Si no, redirigir a `login.html` inmediatamente.
  2. Al hacer click en `#btn-agregar`:
     - Validar que `#adm-nombre` no esté vacío. Si está vacío, mostrar mensaje y detener.
     - Leer el token de `sessionStorage` justo en el momento del envío.
     - Enviar `POST /api/dinos` con header `Authorization: Bearer <token>` y `Content-Type: application/json`.
     - Si la respuesta es 201: mostrar "Dinosaurio agregado exitosamente." en `#adm-msg` y limpiar todos los campos.
     - Si la respuesta es 401 o 403: mostrar "Sesión expirada." y redirigir a `login.html`.
     - Cualquier otro error: mostrar "Error al agregar. Intenta nuevamente."

**Restricciones:**
- El campo `#adm-nombre` es el único obligatorio a nivel de frontend; todos los demás son opcionales.
- Leer el token de `sessionStorage` justo antes de cada petición, no guardarlo en una variable global de módulo.
- No hacer la petición si la validación del nombre falla.

**Criterio de aceptación:** Un admin autenticado puede agregar un dinosaurio desde el formulario y, al ir a `index.html`, el nuevo dinosaurio aparece en la lista. Acceder a `admin.html` sin sesión redirige a `login.html`.

---

### TAREA S2-12: Integración Frontend-Backend
**Descripción:** Verificar que todas las pantallas consuman correctamente la API.

**Checklist de integración:**

| Pantalla | Endpoint consumido | Método | Requiere token |
|---|---|---|---|
| `index.html` | `/api/dinos` | GET | No |
| `index.html` (búsqueda) | `/api/search?q=` | GET | No |
| `dino.html` | `/api/dinos/:id` | GET | No |
| `login.html` | `/api/login` | POST | No |
| `admin.html` | `/api/dinos` | POST | Sí (Bearer) |

**Acciones de verificación:**
- En cada fetch, manejar los tres casos: respuesta exitosa, error HTTP (4xx/5xx) y error de red (catch).
- En todos los fetch que envíen body, incluir `headers: { 'Content-Type': 'application/json' }`.
- Los mensajes de error al usuario deben estar en español y ser visibles en la UI, no solo en `console.error`.

**Criterio de aceptación:** Todas las pantallas muestran datos correctos o mensajes de error apropiados. Ninguna pantalla falla silenciosamente.

---

## 6. Flujo Completo del MVP — Verificación Final

> Ejecutar este flujo de principio a fin para confirmar que el MVP está listo para la demo.

### Flujo de Usuario Común
1. Abrir `http://localhost:3000` → Ver lista de dinosaurios con imagen, nombre y dieta.
2. Escribir "rex" en el buscador → Ver solo los dinosaurios con "rex" en el nombre.
3. Borrar el buscador → Ver la lista completa restaurada.
4. Hacer click en una tarjeta → Navegar a `dino.html?id=<id>` y ver todos los campos del dinosaurio.
5. Hacer click en "← Volver" → Regresar a `index.html`.

### Flujo de Administrador
1. Navegar a `http://localhost:3000/login.html`.
2. Ingresar credenciales incorrectas → Ver mensaje de error, no redirigir.
3. Ingresar credenciales correctas → Ser redirigido a `admin.html`.
4. Llenar el formulario y hacer click en "Agregar Dinosaurio" → Ver mensaje de éxito, formulario se limpia.
5. Navegar a `http://localhost:3000` → El nuevo dinosaurio aparece en la lista.
6. Hacer click en "Cerrar sesión" → Ser redirigido a `login.html`. Intentar acceder a `admin.html` directamente → Ser redirigido a `login.html`.

---

## 7. Tareas Fuera del Alcance del MVP

Las siguientes historias de usuario **no deben implementarse** en este plan. Corresponden al Sprint 3 o posteriores.

| ID | Historia | Razón de exclusión |
|---|---|---|
| HU-03 | Filtrado por Etiquetas | Prioridad Media; no requerida para la demo |
| HU-06 | Edición de Registros | Prioridad Media; no requerida para la demo |
| HU-07 | Gestión de Usuarios | Prioridad Baja; no requerida para la demo |

**No crear** rutas, archivos ni lógica relacionada con estas historias. No dejar código comentado que las anticipe.

---

## 8. Orden de Implementación Recomendado

```
1.  S1-01  → Repositorio y estructura de carpetas
2.  S1-02  → Servidor Express base
3.  S1-04  → Variables de entorno (.env y .env.example)
4.  S1-03  → Conexión a PostgreSQL (config/db.js)
5.  S1-05  → Esquema de base de datos (sql/schema.sql + ejecutar)
6.  S1-06  → Datos de muestra (sql/seed.sql + ejecutar)
7.  S2-01  → Endpoint GET /api/dinos
8.  S2-02  → Endpoint GET /api/dinos/:id
9.  S2-03  → Endpoint GET /api/search
10. S2-04  → Endpoint POST /api/login
11. S2-06  → Middleware authMiddleware.js
12. S2-05  → Endpoint POST /api/dinos (requiere S2-06)
13. S1-07/08/09/10 → Frontend base (HTML + CSS + JS vacíos)
14. S2-07  → Lista de dinosaurios en index.html
15. S2-08  → Barra de búsqueda funcional
16. S2-09  → Pantalla de ficha (dino.html + dino.js)
17. S2-10  → Login del admin (login.html + login.js)
18. S2-11  → Panel de admin (admin.html + admin.js)
19. S2-12  → Verificación de integración completa
20. S2-13/S2-14 → Pruebas del flujo MVP y correcciones
```

> **Nota para la IA que implemente este plan:** Seguir el orden numérico anterior estrictamente. No avanzar a una tarea si sus prerequisitos no están validados según sus criterios de aceptación. Ante cualquier ambigüedad en un criterio, optar por la implementación más simple que lo cumpla.
