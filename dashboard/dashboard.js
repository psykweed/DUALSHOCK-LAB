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
    console.log("[dashboard] sesion cerrada");
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

console.log("[dashboard] sesion de " + sesion + " | productos: " + contarRegistros("productos") + ", servicios: " + contarRegistros("servicios") + ", agendamientos: " + contarRegistros("agendamientos"));
