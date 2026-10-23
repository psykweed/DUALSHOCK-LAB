// si no hay sesion volvemos al login
const sesion = localStorage.getItem("sesion");

if (sesion === null) {
    window.location = "../login/login.html"
}

// cerrar sesion
const botonCerrarSesion = document.getElementById("cerrarSesion");

botonCerrarSesion.addEventListener("click", function () {
    localStorage.removeItem("sesion")
});

// boton para ir a ingresar un producto nuevo
const botonIngreso = document.getElementById("botonIngreso");

botonIngreso.addEventListener("click", function () {
    window.location = "../productos/ingresoProducto.html"
});

// con esta cantidad o menos el producto se marca como stock bajo
const STOCK_BAJO = 5;

const cuerpoTabla = document.getElementById("cuerpoTabla");
const buscador = document.getElementById("buscador");
const filtroCategoria = document.getElementById("filtroCategoria");

// los productos los guarda ingresoProducto como { nombre, sku, categoria, cantidad, precio }
function leerProductos() {
    const lista = JSON.parse(localStorage.getItem("productos"))

    if (lista === null) {
        return [];
    }

    return lista;
}

function guardarProductos(lista) {
    localStorage.setItem("productos", JSON.stringify(lista))
}

// actualiza las tarjetas de arriba
function mostrarResumen(lista) {
    let unidades = 0;
    let bajos = 0;

    for (let i = 0; i < lista.length; i++) {
        unidades = unidades + lista[i].cantidad;

        if (lista[i].cantidad <= STOCK_BAJO) {
            bajos = bajos + 1;
        }
    }

    document.getElementById("totalProductos").innerText = lista.length;
    document.getElementById("totalUnidades").innerText = unidades;
    document.getElementById("totalBajos").innerText = bajos;
}

// crea una celda de texto
function crearCelda(texto) {
    const celda = document.createElement("td");
    celda.innerText = texto;
    return celda;
}

// crea un boton que guarda su accion y el sku del producto
function crearBoton(texto, clase, accion, sku) {
    const boton = document.createElement("button");
    boton.innerText = texto;
    boton.className = clase;
    boton.dataset.accion = accion;
    boton.dataset.sku = sku;
    return boton;
}

function mostrarTabla() {
    const lista = leerProductos();
    const texto = buscador.value.trim().toLowerCase();
    const categoria = filtroCategoria.value;

    mostrarResumen(lista);
    cuerpoTabla.innerHTML = "";

    let mostrados = 0;

    for (let i = 0; i < lista.length; i++) {
        const p = lista[i];

        // filtros: texto en nombre o sku, y categoria
        const coincideTexto = p.nombre.toLowerCase().includes(texto) || p.sku.toLowerCase().includes(texto);
        const coincideCategoria = categoria === "" || p.categoria === categoria;

        if (!coincideTexto || !coincideCategoria) {
            continue;
        }

        mostrados = mostrados + 1;

        const fila = document.createElement("tr");

        fila.appendChild(crearCelda(p.nombre));
        fila.appendChild(crearCelda(p.sku));
        fila.appendChild(crearCelda(p.categoria));
        fila.appendChild(crearCelda("$" + p.precio.toLocaleString("es-CL")));

        // cantidad con botones - y +
        const celdaCantidad = document.createElement("td");
        const contenedor = document.createElement("div");
        contenedor.className = "celdaCantidad";

        const numero = document.createElement("span");
        numero.innerText = p.cantidad;

        if (p.cantidad <= STOCK_BAJO) {
            numero.className = "stockBajo";
        }

        contenedor.appendChild(crearBoton("-", "botonCantidad", "restar", p.sku));
        contenedor.appendChild(numero);
        contenedor.appendChild(crearBoton("+", "botonCantidad", "sumar", p.sku));
        celdaCantidad.appendChild(contenedor);
        fila.appendChild(celdaCantidad);

        // eliminar
        const celdaAcciones = document.createElement("td");
        celdaAcciones.appendChild(crearBoton("Eliminar", "botonEliminar", "eliminar", p.sku));
        fila.appendChild(celdaAcciones);

        cuerpoTabla.appendChild(fila);
    }

    if (mostrados === 0) {
        const fila = document.createElement("tr");
        const celda = crearCelda("No hay productos para mostrar");
        celda.colSpan = 6;
        celda.className = "sinResultados";
        fila.appendChild(celda);
        cuerpoTabla.appendChild(fila);
    }
}

// maneja los botones de la tabla (+, - y eliminar)
function accionTabla(evento) {
    const accion = evento.target.dataset.accion;
    const sku = evento.target.dataset.sku;

    if (accion === undefined) {
        return;
    }

    const lista = leerProductos();

    for (let i = 0; i < lista.length; i++) {
        if (lista[i].sku !== sku) {
            continue;
        }

        if (accion === "sumar") {
            lista[i].cantidad = lista[i].cantidad + 1;
        }

        if (accion === "restar" && lista[i].cantidad > 0) {
            lista[i].cantidad = lista[i].cantidad - 1;
        }

        if (accion === "eliminar") {
            if (confirm("¿Eliminar " + lista[i].nombre + "?") === false) {
                return;
            }

            lista.splice(i, 1);
        }

        break;
    }

    guardarProductos(lista);
    mostrarTabla();
}

mostrarTabla();
buscador.addEventListener("input", mostrarTabla);
filtroCategoria.addEventListener("change", mostrarTabla);
cuerpoTabla.addEventListener("click", accionTabla);
