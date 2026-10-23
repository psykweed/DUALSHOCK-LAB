# DUALSHOCK-LAB

Proyecto de Fullstack 2: sistema de inventario y gestion de agendamientos de servicios y componentes de consolas y computadores, hecho con HTML, CSS y JavaScript (sin frameworks).

## Estructura

```
DUALSHOCK-LAB/
├── index.html          -> redirige al login
├── css/estilo.css      -> estilos compartidos
├── login/              -> login
├── registro/           -> registro de usuario
├── dashboard/          -> dashboard
├── productos/          -> modulo ingreso de productos
├── inventario/         -> modulo inventario
├── servicios/          -> modulo servicios
└── agendamientos/      -> modulo agendamientos
```

Cada pagina tiene su carpeta con su HTML, su CSS y su JS.

## Ramas

| Rama | Contenido |
|------|-----------|
| `main` | rama principal, aca se juntan los modulos terminados |
| `login-dashboard` | login, registro y dashboard |
| `ingreso-productos` | modulo ingreso de productos |
| `inventario` | modulo inventario |
| `servicios` | modulo servicios |
| `agendamientos` | modulo agendamientos |

Cada integrante crea su rama desde `main`, sube sus commits y despues se une a `main` con un Pull Request.

## Datos en localStorage

| Clave | Contenido |
|-------|-----------|
| `usuarios` | arreglo de `{ usuario, correo, password }` |
| `sesion` | nombre del usuario que inicio sesion |
| `productos` | arreglo de `{ nombre, sku, categoria, cantidad, precio }` |
| `ingresos` | arreglo de `{ nombre, sku, categoria, cantidad, precio, fecha, usuario, estado }` |
| `servicios` | arreglo de `{ nombre, descripcion, precio, duracion, modalidad, incluye }` |
| `agendamientos` | arreglo de `{ cliente, servicio, fecha, hora }` |


## Como probar

Abrir `index.html` con Live Server. Usuario de prueba: `admin`, contraseña `123456` (se crea solo al abrir el login).
