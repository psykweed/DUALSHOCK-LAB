// inicio.js - Integrante 1: registro e inicio de sesión
// Es una SIMULACIÓN académica con localStorage: la contraseña se guarda en texto
// plano, algo que un sistema real nunca haría.
// Usa funciones de compartido.js: leerLista, guardarLista, mostrarMensaje, correoEsValido.

const CLAVE_USUARIOS = "dualshock_usuarios"; // lista de {nombre, correo, clave}
const CLAVE_SESION = "dualshock_sesion";     // usuario actual {nombre, correo}
const LARGO_MINIMO_CLAVE = 6;

const formRegistro = document.getElementById("formRegistro");
const formLogin = document.getElementById("formLogin");

// Busca un usuario por correo. Devuelve el usuario o null si no existe.
// Se usa en el registro (para evitar duplicados) y en el login.
function buscarUsuario(correo) {
  const usuarios = leerLista(CLAVE_USUARIOS);
  for (let i = 0; i < usuarios.length; i++) {
    if (usuarios[i].correo === correo) {
      return usuarios[i];
    }
  }
  return null;
}

// Se ejecuta al enviar el formulario de registro.
function registrarUsuario(evento) {
  evento.preventDefault(); // evita que la página se recargue
  const nombre = document.getElementById("regNombre").value.trim();
  const correo = document.getElementById("regCorreo").value.trim().toLowerCase();
  const clave = document.getElementById("regClave").value;
  const confirmar = document.getElementById("regConfirmar").value;

  // Validación 1: campos obligatorios
  if (nombre === "" || correo === "" || clave === "" || confirmar === "") {
    mostrarMensaje("mensajeRegistro", "Completa todos los campos.", "error");
    return;
  }
  // Validación 2: formato de correo
  if (!correoEsValido(correo)) {
    mostrarMensaje("mensajeRegistro", "El correo no tiene un formato válido (ej: nombre@correo.cl).", "error");
    return;
  }
  // Validación 3: largo mínimo de contraseña
  if (clave.length < LARGO_MINIMO_CLAVE) {
    mostrarMensaje("mensajeRegistro", "La contraseña debe tener al menos " + LARGO_MINIMO_CLAVE + " caracteres.", "error");
    return;
  }
  // Validación 4: las contraseñas coinciden
  if (clave !== confirmar) {
    mostrarMensaje("mensajeRegistro", "Las contraseñas no coinciden.", "error");
    return;
  }
  // Validación 5: el correo no puede estar registrado
  if (buscarUsuario(correo) !== null) {
    mostrarMensaje("mensajeRegistro", "Ese correo ya está registrado. Inicia sesión.", "error");
    return;
  }

  // Todo correcto: se agrega a la lista y se guarda
  const usuarios = leerLista(CLAVE_USUARIOS);
  usuarios.push({ nombre: nombre, correo: correo, clave: clave });
  guardarLista(CLAVE_USUARIOS, usuarios);

  formRegistro.reset();
  mostrarMensaje("mensajeRegistro", "¡Cuenta creada! Ahora puedes iniciar sesión.", "exito");
}

// Se ejecuta al enviar el formulario de login.
function iniciarSesion(evento) {
  evento.preventDefault();
  const correo = document.getElementById("loginCorreo").value.trim().toLowerCase();
  const clave = document.getElementById("loginClave").value;

  // Validación 1: campos obligatorios
  if (correo === "" || clave === "") {
    mostrarMensaje("mensajeLogin", "Ingresa tu correo y tu contraseña.", "error");
    return;
  }
  // Validación 2: las credenciales deben coincidir con un usuario registrado
  const usuario = buscarUsuario(correo);
  if (usuario === null || usuario.clave !== clave) {
    mostrarMensaje("mensajeLogin", "Correo o contraseña incorrectos.", "error");
    return;
  }

  // Guardamos la sesión (sin la contraseña) y vamos al dashboard
  localStorage.setItem(CLAVE_SESION, JSON.stringify({ nombre: usuario.nombre, correo: usuario.correo }));
  window.location.href = "dashboard.html";
}

formRegistro.addEventListener("submit", registrarUsuario);
formLogin.addEventListener("submit", iniciarSesion);
