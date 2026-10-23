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
const tituloFormulario = document.getElementById("tituloFormulario");
const botonGuardar = document.getElementById("botonGuardar");
const botonCancelar = document.getElementById("botonCancelar");
const botonVolver = document.getElementById("botonVolver");

// posicion del ingreso que se esta editando (-1 = ninguno, es un ingreso nuevo)
let posicionEdicion = -1;

mostrarIngresos()

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

    if (skuRepetido(sku, posicionEdicion) === true) {
        return;
    }

    const ingresos = leerLista("ingresos")

    if (posicionEdicion === -1) {
        // ingreso nuevo: queda pendiente hasta que se envie al inventario
        const nuevoIngreso = {
            nombre: nombre,
            sku: sku,
            categoria: categoria,
            cantidad: Number(cantidad),
            precio: Number(precio),
            fecha: new Date().toLocaleDateString("es-CL"),
            usuario: sesion,
            estado: "Pendiente"
        }

        ingresos.push(nuevoIngreso)
        alert("Ingreso guardado, queda pendiente de enviar al inventario")
    } else {
        // cambiamos los datos del ingreso que se estaba editando
        ingresos[posicionEdicion].nombre = nombre;
        ingresos[posicionEdicion].sku = sku;
        ingresos[posicionEdicion].categoria = categoria;
        ingresos[posicionEdicion].cantidad = Number(cantidad);
        ingresos[posicionEdicion].precio = Number(precio);
        alert("Ingreso actualizado")
    }

    guardarLista("ingresos", ingresos)
    cancelarEdicion()
    mostrarIngresos()
})

botonCancelar.addEventListener("click", function () {
    cancelarEdicion()
});

botonVolver.addEventListener("click", function () {
    window.location = "../dashboard/dashboard.html"
});


/* leer y guardar listas en localStorage */

function leerLista(clave) {
    const lista = JSON.parse(localStorage.getItem(clave))

    if (lista === null) {
        return [];
    }

    return lista;
}

function guardarLista(clave, lista) {
    localStorage.setItem(clave, JSON.stringify(lista))
}


/* tabla de ingresos */

function mostrarIngresos() {
    const ingresos = leerLista("ingresos")
    const tabla = document.getElementById("tablaIngresos");
    const mensajeVacio = document.getElementById("mensajeVacio");

    tabla.innerHTML = ""

    if (ingresos.length === 0) {
        mensajeVacio.style.display = "block"
        return;
    }

    mensajeVacio.style.display = "none"

    // mostramos los mas nuevos primero
    for (let i = ingresos.length - 1; i >= 0; i--) {
        const ingreso = ingresos[i]
        let clase = "enInventario"
        let acciones = `<a href="../inventario/inventario.html">Ver en inventario</a>`

        if (ingreso.estado === "Pendiente") {
            clase = "pendiente"
            acciones = `
                <div class="accionesTabla">
                    <button type="button" class="botonTabla" onclick="editarIngreso(${i})">Editar</button>
                    <button type="button" class="botonTabla botonEnviar" onclick="enviarAInventario(${i})">Enviar a inventario</button>
                    <button type="button" class="botonTabla botonEliminar" onclick="eliminarIngreso(${i})">Eliminar</button>
                </div>
            `
        }

        tabla.innerHTML += `
            <tr>
                <td>${ingreso.sku}</td>
                <td>${ingreso.nombre}</td>
                <td>${ingreso.categoria}</td>
                <td>${ingreso.cantidad}</td>
                <td>$${ingreso.precio}</td>
                <td>${ingreso.fecha}</td>
                <td><span class="estado ${clase}">${ingreso.estado}</span></td>
                <td>${acciones}</td>
            </tr>
        `
    }
}

// carga un ingreso pendiente en el formulario para cambiarlo
function editarIngreso(posicion) {
    const ingresos = leerLista("ingresos")
    const ingreso = ingresos[posicion]

    document.getElementById("nombreProducto").value = ingreso.nombre;
    document.getElementById("skuProducto").value = ingreso.sku;
    document.getElementById("categoriaSelect").value = ingreso.categoria;
    document.getElementById("cantidadProducto").value = ingreso.cantidad;
    document.getElementById("precioProducto").value = ingreso.precio;

    posicionEdicion = posicion
    tituloFormulario.innerHTML = "Editando ingreso"
    botonGuardar.innerHTML = "Guardar cambios"
    botonCancelar.style.display = "inline-block"

    window.scrollTo(0, 0)
}

// deja el formulario vacio y vuelve al modo ingreso nuevo
function cancelarEdicion() {
    document.getElementById("nombreProducto").value = "";
    document.getElementById("skuProducto").value = "";
    document.getElementById("categoriaSelect").value = "";
    document.getElementById("cantidadProducto").value = "";
    document.getElementById("precioProducto").value = "";

    posicionEdicion = -1
    tituloFormulario.innerHTML = "Nuevo ingreso"
    botonGuardar.innerHTML = "Guardar ingreso"
    botonCancelar.style.display = "none"
}

// pasa el ingreso al inventario (a la lista productos) y cambia su estado
function enviarAInventario(posicion) {
    const ingresos = leerLista("ingresos")
    const productos = leerLista("productos")
    const ingreso = ingresos[posicion]

    for (let i = 0; i < productos.length; i++) {
        if (productos[i].sku.toLowerCase() === ingreso.sku.toLowerCase()) {
            alert("el sku ya existe en el inventario, no se puede enviar");
            return;
        }
    }

    const producto = {
        nombre: ingreso.nombre,
        sku: ingreso.sku,
        categoria: ingreso.categoria,
        cantidad: ingreso.cantidad,
        precio: ingreso.precio
    }

    productos.push(producto)
    guardarLista("productos", productos)

    ingresos[posicion].estado = "En inventario"
    guardarLista("ingresos", ingresos)

    alert("Producto enviado al inventario")

    if (posicionEdicion === posicion) {
        cancelarEdicion()
    }

    mostrarIngresos()
}

// borra un ingreso pendiente de la lista
function eliminarIngreso(posicion) {
    if (confirm("¿Eliminar este ingreso?") === false) {
        return;
    }

    const ingresos = leerLista("ingresos")
    const restantes = []

    for (let i = 0; i < ingresos.length; i++) {
        if (i !== posicion) {
            restantes.push(ingresos[i])
        }
    }

    guardarLista("ingresos", restantes)
    cancelarEdicion()
    mostrarIngresos()
}


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

// devuelve true si el sku ya esta en el inventario o en otro ingreso pendiente
function skuRepetido(sku, posicionIgnorada) {
    const productos = leerLista("productos")
    const ingresos = leerLista("ingresos")

    for (let i = 0; i < productos.length; i++) {
        if (productos[i].sku.toLowerCase() === sku.toLowerCase()) {
            alert("el sku ya existe en el inventario");
            return true;
        }
    }

    for (let i = 0; i < ingresos.length; i++) {
        if (i !== posicionIgnorada && ingresos[i].estado === "Pendiente" && ingresos[i].sku.toLowerCase() === sku.toLowerCase()) {
            alert("el sku ya esta en un ingreso pendiente");
            return true;
        }
    }

    return false;
}
