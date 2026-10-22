// compartido.js
// Funciones comunes que usan varios módulos. Cada HTML carga este archivo
// ANTES de su propio JS (por ejemplo: compartido.js y luego cotizaciones.js).

// ---------- localStorage ----------

// Lee una lista guardada. Si la clave todavía no existe, devuelve un arreglo vacío.
function leerLista(clave) {
  const texto = localStorage.getItem(clave);
  if (texto === null) {
    return [];
  }
  return JSON.parse(texto); // convierte el texto guardado en un arreglo
}

// Guarda una lista completa. localStorage solo guarda texto, por eso JSON.stringify.
function guardarLista(clave, lista) {
  localStorage.setItem(clave, JSON.stringify(lista));
}

// ---------- Mensajes en pantalla ----------

// Muestra un mensaje dentro del elemento con ese id.
// tipo puede ser "exito" (verde) o "error" (rojo).
// El HTML debe tener algo como: <p id="mensaje" class="mensaje"></p>
function mostrarMensaje(idMensaje, texto, tipo) {
  const caja = document.getElementById(idMensaje);
  caja.textContent = texto;
  caja.className = "mensaje " + tipo;
}

// ---------- Validaciones reutilizables ----------

// Devuelve true si el texto tiene forma de correo: algo@dominio.cl
function correoEsValido(correo) {
  const patron = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return patron.test(correo);
}

// Contacto válido = correo válido O teléfono de 9 a 11 dígitos (puede partir con +).
// Ejemplos válidos: 912345678, +56912345678, ana@correo.cl
function contactoEsValido(contacto) {
  const limpio = contacto.replace(/\s/g, ""); // quita los espacios
  if (limpio.indexOf("@") !== -1) {
    return correoEsValido(limpio);
  }
  return /^\+?[0-9]{9,11}$/.test(limpio);
}

// ---------- Sesión (simulación académica) ----------

// Se llama al cargar cada página interna: si no hay sesión, vuelve al inicio.
function verificarSesion() {
  if (localStorage.getItem("dualshock_sesion") === null) {
    window.location.href = "index.html";
  }
}

// Borra la sesión y vuelve al inicio.
function cerrarSesion() {
  localStorage.removeItem("dualshock_sesion");
  window.location.href = "index.html";
}

// Si la página tiene el botón "Cerrar sesión" (id="btnCerrarSesion"), lo conecta solo.
const botonSalir = document.getElementById("btnCerrarSesion");
if (botonSalir !== null) {
  botonSalir.addEventListener("click", cerrarSesion);
}
