// si no hay sesion volvemos al login
const sesion = localStorage.getItem("sesion");

if (sesion === null) {
    window.location = "../login/login.html"
}

// saludo con el nombre del usuario
const saludo = document.getElementById("saludo");
saludo.innerText = "Bienvenido al panel de administración, " + sesion;

// cerrar sesion
const botonCerrarSesion = document.getElementById("cerrarSesion");

botonCerrarSesion.addEventListener("click", function () {
    localStorage.removeItem("sesion")
});

// cuenta cuantos registros hay guardados en una clave
function contarRegistros(clave) {
    const lista = JSON.parse(localStorage.getItem(clave))

    if (lista === null) {
        return 0;
    }

    return lista.length;
}

document.getElementById("totalProductos").innerText = contarRegistros("productos");
document.getElementById("totalServicios").innerText = contarRegistros("servicios");
document.getElementById("totalAgendamientos").innerText = contarRegistros("agendamientos");


// tabla con los ultimos productos ingresados
const productos = JSON.parse(localStorage.getItem("productos"))
const tablaProductos = document.getElementById("tablaProductos");
const mensajeVacio = document.getElementById("mensajeVacio");

if (productos === null || productos.length === 0) {
    mensajeVacio.style.display = "block"
} else {
    mensajeVacio.style.display = "none"

    // mostramos maximo 5, los mas nuevos primero
    let inicio = productos.length - 5

    if (inicio < 0) {
        inicio = 0
    }

    for (let i = productos.length - 1; i >= inicio; i--) {
        tablaProductos.innerHTML += `
            <tr>
                <td>${productos[i].sku}</td>
                <td>${productos[i].nombre}</td>
                <td>${productos[i].categoria}</td>
                <td>${productos[i].cantidad}</td>
                <td>$${productos[i].precio}</td>
            </tr>
        `
    }
}

// boton agregar producto
const botonAgregarProducto = document.getElementById("botonAgregarProducto");

botonAgregarProducto.addEventListener("click", function () {
    window.location = "../productos/ingresoProducto.html"
});
