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

// boton volver
const botonVolver = document.getElementById("botonVolver");

botonVolver.addEventListener("click", function () {
    window.location = "../dashboard/dashboard.html"
});


const formularioJS = document.getElementById("formulario");

formularioJS.addEventListener("submit", function (event) {
    event.preventDefault()

    const nombre = document.getElementById("nombreProducto").value.trim();
    const sku = document.getElementById("skuProducto").value.trim();
    const categoria = document.getElementById("categoriaSelect").value;
    const cantidad = document.getElementById("cantidadProducto").value;
    const precio = document.getElementById("precioProducto").value;

    if (validarVacios(nombre, sku, categoria, cantidad, precio) === false) {
        return;
    }

    if (validarNombre(nombre, sku) === false) {
        return;
    }

    if (validarNumeros(cantidad, precio) === false) {
        return;
    }

    if (skuRepetido(sku) === true) {
        return;
    }

    const producto = {
        nombre: nombre,
        sku: sku,
        categoria: categoria,
        cantidad: Number(cantidad),
        precio: Number(precio)
    }

    console.log("Este es mi producto: ", producto);

    // sacamos los productos que ya existen, si no hay creamos un arreglo vacio
    let productos = JSON.parse(localStorage.getItem("productos"))

    if (productos === null) {
        productos = []
    }

    productos.push(producto)
    localStorage.setItem("productos", JSON.stringify(productos))

    alert("Producto guardado")

    // dejamos el formulario vacio para ingresar otro producto
    document.getElementById("nombreProducto").value = "";
    document.getElementById("skuProducto").value = "";
    document.getElementById("categoriaSelect").value = "";
    document.getElementById("cantidadProducto").value = "";
    document.getElementById("precioProducto").value = "";
})


/* funciones de validacion, devuelven true si esta todo bien */

function validarVacios(nombre, sku, categoria, cantidad, precio) {
    if (nombre === "" || sku === "" || categoria === "" || cantidad === "" || precio === "") {
        alert("campo no puede ser vacio");
        return false;
    }

    return true;
}

function validarNombre(nombre, sku) {
    if (nombre.length < 3) {
        alert("el nombre debe tener minimo 3 caracteres");
        return false;
    }

    if (nombre.toLowerCase() === sku.toLowerCase()) {
        alert("nombre y sku no pueden ser iguales");
        return false;
    }

    return true;
}

function validarNumeros(cantidad, precio) {
    if (cantidad <= 0) {
        alert("la cantidad debe ser mayor a cero");
        return false;
    }

    if (precio <= 0) {
        alert("el precio debe ser mayor a cero");
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
            alert("el sku ya existe");
            return true;
        }
    }

    return false;
}
