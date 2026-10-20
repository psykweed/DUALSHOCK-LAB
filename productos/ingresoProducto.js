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

const formularioJS = document.getElementById("formulario");
const mensajeExito = document.getElementById("mensajeExito");

formularioJS.addEventListener("submit", function (event) {
    event.preventDefault()
    limpiarErrores()

    const nombre = document.getElementById("nombreProducto").value.trim();
    const sku = document.getElementById("skuProducto").value.trim();
    const categoria = document.getElementById("categoriaSelect").value;
    const cantidad = document.getElementById("cantidadProducto").value;
    const precio = document.getElementById("precioProducto").value;

    // revisamos todo para mostrar todos los errores juntos
    let todoBien = true;

    if (validarNombre(nombre, sku) === false) {
        todoBien = false;
    }

    if (validarSku(sku) === false) {
        todoBien = false;
    }

    if (validarCategoria(categoria) === false) {
        todoBien = false;
    }

    if (validarCantidad(cantidad) === false) {
        todoBien = false;
    }

    if (validarPrecio(precio) === false) {
        todoBien = false;
    }

    if (todoBien === false) {
        return;
    }

    const producto = {
        nombre: nombre,
        sku: sku,
        categoria: categoria,
        cantidad: Number(cantidad),
        precio: Number(precio)
    }

    guardarProducto(producto)

    mensajeExito.innerText = "Producto guardado correctamente"
    formularioJS.reset()
})

// boton volver
const botonVolver = document.getElementById("botonVolver");

botonVolver.addEventListener("click", function () {
    window.location = "../dashboard/dashboard.html"
});


/* mostrar y limpiar errores */

function mostrarError(idError, idInput, texto) {
    document.getElementById(idError).innerText = texto
    document.getElementById(idInput).classList.add("inputError")
}

function limpiarErrores() {
    const errores = ["errorNombre", "errorSku", "errorCategoria", "errorCantidad", "errorPrecio"];
    const inputs = ["nombreProducto", "skuProducto", "categoriaSelect", "cantidadProducto", "precioProducto"];

    for (let i = 0; i < errores.length; i++) {
        document.getElementById(errores[i]).innerText = ""
        document.getElementById(inputs[i]).classList.remove("inputError")
    }

    mensajeExito.innerText = ""
}


/* funciones de validacion, devuelven true si esta todo bien */

function validarNombre(nombre, sku) {
    if (nombre === "") {
        mostrarError("errorNombre", "nombreProducto", "El nombre no puede ir vacio");
        return false;
    }

    if (nombre.length < 3) {
        mostrarError("errorNombre", "nombreProducto", "El nombre debe tener minimo 3 caracteres");
        return false;
    }

    if (nombre.toLowerCase() === sku.toLowerCase()) {
        mostrarError("errorSku", "skuProducto", "El nombre y el sku no pueden ser iguales");
        return false;
    }

    return true;
}

function validarSku(sku) {
    if (sku === "") {
        mostrarError("errorSku", "skuProducto", "El sku no puede ir vacio");
        return false;
    }

    if (skuRepetido(sku)) {
        mostrarError("errorSku", "skuProducto", "El sku ya existe");
        return false;
    }

    return true;
}

function validarCategoria(categoria) {
    if (categoria === "") {
        mostrarError("errorCategoria", "categoriaSelect", "Seleccione una categoria");
        return false;
    }

    return true;
}

function validarCantidad(cantidad) {
    if (cantidad === "") {
        mostrarError("errorCantidad", "cantidadProducto", "La cantidad no puede ir vacia");
        return false;
    }

    if (cantidad <= 0) {
        mostrarError("errorCantidad", "cantidadProducto", "La cantidad debe ser mayor a cero");
        return false;
    }

    return true;
}

function validarPrecio(precio) {
    if (precio === "") {
        mostrarError("errorPrecio", "precioProducto", "El precio no puede ir vacio");
        return false;
    }

    if (precio <= 0) {
        mostrarError("errorPrecio", "precioProducto", "El precio debe ser mayor a cero");
        return false;
    }

    return true;
}

// devuelve true si el sku ya esta guardado
function skuRepetido(sku) {
    const productos = JSON.parse(localStorage.getItem("productos"))

    if (productos === null) {
        return false;
    }

    for (let i = 0; i < productos.length; i++) {
        if (productos[i].sku.toLowerCase() === sku.toLowerCase()) {
            return true;
        }
    }

    return false;
}

function guardarProducto(producto) {
    let productos = JSON.parse(localStorage.getItem("productos"))

    if (productos === null) {
        productos = []
    }

    productos.push(producto)
    localStorage.setItem("productos", JSON.stringify(productos))
}
