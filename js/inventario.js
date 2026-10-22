verificarSesion();

const CLAVE_REPUESTOS = "dualshock_repuestos"; 
const REPUESTOS_INICIALES = [
  { nombre: "Pantalla 15.6 pulgadas",       codigo: "NB-001", costo: 58990, stock: 6 },
  { nombre: "Teclado de notebook",          codigo: "NB-002", costo: 14990, stock: 10 },
  { nombre: "Batería de notebook",          codigo: "NB-003", costo: 39990, stock: 4 },
  { nombre: "Disco SSD 480 GB",             codigo: "NB-004", costo: 29990, stock: 8 },
  { nombre: "Palanca analógica DualShock",  codigo: "CS-001", costo: 4990,  stock: 30 },
  { nombre: "Lector Blu-ray PS4",           codigo: "CS-002", costo: 39990, stock: 3 },
  { nombre: "Ventilador PS4",               codigo: "CS-003", costo: 10990, stock: 7 },
  { nombre: "Puerto HDMI PS5",              codigo: "CS-004", costo: 15990, stock: 4 }
];

const formRepuesto = document.getElementById("formRepuesto");
const cuerpoTabla = document.getElementById("cuerpoTabla");

if (localStorage.getItem(CLAVE_REPUESTOS) === null) {
  guardarLista(CLAVE_REPUESTOS, REPUESTOS_INICIALES);
}

function mostrarTabla() {
  const lista = leerLista(CLAVE_REPUESTOS);
  cuerpoTabla.innerHTML = "";

  for (let i = 0; i < lista.length; i++) {
    const r = lista[i];
    cuerpoTabla.innerHTML +=
      "<tr>" +
        "<td>" + r.nombre + "</td>" +
        "<td>" + r.codigo + "</td>" +
        "<td>$" + r.costo.toLocaleString("es-CL") + "</td>" +
        "<td>" + r.stock + "</td>" +
        "<td><button class='boton-peligro' data-posicion='" + i + "'>Eliminar</button></td>" +
      "</tr>";
  }
}

function agregarRepuesto(evento) {
  evento.preventDefault(); 
  const nombre = document.getElementById("repNombre").value.trim();
  const codigo = document.getElementById("repCodigo").value.trim().toUpperCase();
  const costo = Number(document.getElementById("repCosto").value);
  const stock = Number(document.getElementById("repStock").value);
  const lista = leerLista(CLAVE_REPUESTOS);

  if (nombre === "" || codigo === "" || costo <= 0 || document.getElementById("repStock").value === "") {
    mostrarMensaje("mensajeRepuesto", "Completa todos los campos (el costo debe ser mayor a 0).", "error");
    return;
  }

  for (let i = 0; i < lista.length; i++) {
    if (lista[i].codigo === codigo) {
      mostrarMensaje("mensajeRepuesto", "Ya existe un repuesto con ese código.", "error");
      return;
    }
  }

  lista.push({ nombre: nombre, codigo: codigo, costo: costo, stock: stock });
  guardarLista(CLAVE_REPUESTOS, lista);
  formRepuesto.reset();
  mostrarMensaje("mensajeRepuesto", "Repuesto agregado.", "exito");
  mostrarTabla();
}

function eliminarRepuesto(evento) {
  const posicion = evento.target.dataset.posicion;
  if (posicion === undefined) {
    return; 
  }
  const lista = leerLista(CLAVE_REPUESTOS);
  lista.splice(posicion, 1);
  guardarLista(CLAVE_REPUESTOS, lista);
  mostrarTabla();
}

mostrarTabla();
formRepuesto.addEventListener("submit", agregarRepuesto);
cuerpoTabla.addEventListener("click", eliminarRepuesto);
