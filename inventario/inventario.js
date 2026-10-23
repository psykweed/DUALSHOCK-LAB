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

// inventario muestra los productos que se guardan en "Ingresar producto"
// (clave "productos", cada uno es { nombre, sku, categoria, cantidad, precio })

const buscador = document.getElementById("buscador");
const botonIngresar = document.getElementById("botonIngresar");
const contadorProductos = document.getElementById("contadorProductos");
const mensajeVacio = document.getElementById("mensajeVacio");
const contenedorTabla = document.getElementById("contenedorTabla");
const tablaInventario = document.getElementById("tablaInventario");
const mensajeInventario = document.getElementById("mensajeInventario");

const formularioEdicion = document.getElementById("formularioEdicion");
const mensajeEdicion = document.getElementById("mensajeEdicion");
const botonCancelarEdicion = document.getElementById("botonCancelarEdicion");

// sku del producto que se esta editando (null = ninguno)
let skuEditando = null;

// boton para ir a ingresar un producto
botonIngresar.addEventListener("click", function () {
    window.location = "../productos/ingresoProducto.html"
});


// saca los productos guardados, si no hay devuelve un arreglo vacio
function obtenerProductos() {
    const lista = JSON.parse(localStorage.getItem("productos"))

    if (lista === null) {
        return [];
    }

    return lista;
}

// 45000 -> "$45.000"
function formatearPrecio(numero) {
    return "$" + numero.toLocaleString("es-CL");
}

// true si el texto buscado esta en el nombre o en el sku (sin importar mayusculas)
function coincide(producto, texto) {
    const nombre = producto.nombre.toLowerCase();
    const sku = producto.sku.toLowerCase();

    return nombre.includes(texto) || sku.includes(texto);
}

// crea una celda de tabla con texto
function crearCelda(texto) {
    const celda = document.createElement("td");
    celda.innerText = texto;

    return celda;
}

// dibuja la tabla con los productos que coinciden con lo que hay en el buscador
function mostrarInventario() {
    const productos = obtenerProductos();
    const texto = buscador.value.trim().toLowerCase();
    const encontrados = [];

    for (let i = 0; i < productos.length; i++) {
        if (coincide(productos[i], texto)) {
            encontrados.push(productos[i]);
        }
    }

    tablaInventario.innerHTML = "";

    // caso 1: todavia no hay productos guardados
    if (productos.length === 0) {
        contadorProductos.innerText = ""
        mensajeVacio.innerText = "Aún no hay productos en el inventario. Ingresa el primero con el botón \"Ingresar producto\""
        mensajeVacio.style.display = "block"
        contenedorTabla.style.display = "none"
        return;
    }

    contadorProductos.innerText = "Mostrando " + encontrados.length + " de " + productos.length + " productos"

    // caso 2: hay productos pero ninguno coincide con la busqueda
    if (encontrados.length === 0) {
        mensajeVacio.innerText = "No se encontraron productos para \"" + buscador.value.trim() + "\""
        mensajeVacio.style.display = "block"
        contenedorTabla.style.display = "none"
        return;
    }

    // caso 3: mostramos las filas
    mensajeVacio.style.display = "none"
    contenedorTabla.style.display = "block"

    for (let i = 0; i < encontrados.length; i++) {
        const producto = encontrados[i];
        const fila = document.createElement("tr");

        fila.appendChild(crearCelda(producto.sku));
        fila.appendChild(crearCelda(producto.nombre));
        fila.appendChild(crearCelda(producto.categoria));
        fila.appendChild(crearCelda(producto.cantidad));
        fila.appendChild(crearCelda(formatearPrecio(producto.precio)));
        fila.appendChild(crearCelda(formatearPrecio(producto.cantidad * producto.precio)));

        // botones de la fila: el sku identifica al producto porque no se puede repetir
        const celdaAcciones = document.createElement("td");

        const botonEditar = document.createElement("button");
        botonEditar.innerText = "Editar";
        botonEditar.className = "botonTabla";
        botonEditar.addEventListener("click", function () {
            abrirEdicion(producto.sku)
        });

        const botonEliminar = document.createElement("button");
        botonEliminar.innerText = "Eliminar";
        botonEliminar.className = "botonTabla botonEliminar";
        botonEliminar.addEventListener("click", function () {
            eliminarProducto(producto.sku)
        });

        celdaAcciones.appendChild(botonEditar);
        celdaAcciones.appendChild(botonEliminar);
        fila.appendChild(celdaAcciones);

        tablaInventario.appendChild(fila);
    }
}


// muestra un mensaje en la pagina, tipo es "exito" o "error"
function mostrarMensaje(elemento, texto, tipo) {
    elemento.innerText = texto

    if (tipo === "exito") {
        elemento.className = "mensajeExito"
    } else {
        elemento.className = "mensajeError"
    }
}


/* ---------- editar ---------- */

// llena el formulario con los datos del producto y lo muestra
function abrirEdicion(sku) {
    const productos = obtenerProductos();

    for (let i = 0; i < productos.length; i++) {
        if (productos[i].sku === sku) {
            document.getElementById("editNombre").value = productos[i].nombre;
            document.getElementById("editSku").value = productos[i].sku;
            document.getElementById("editCategoria").value = productos[i].categoria;
            document.getElementById("editCantidad").value = productos[i].cantidad;
            document.getElementById("editPrecio").value = productos[i].precio;
        }
    }

    skuEditando = sku;
    mensajeEdicion.innerText = ""
    mensajeEdicion.className = ""
    mensajeInventario.innerText = ""
    mensajeInventario.className = ""
    formularioEdicion.style.display = "block"
    formularioEdicion.scrollIntoView()
}

// oculta el formulario de edicion
function cerrarEdicion() {
    skuEditando = null;
    formularioEdicion.style.display = "none"
}

// true si el sku ya lo tiene OTRO producto (el que se esta editando puede quedarse con el suyo)
function skuRepetido(sku) {
    const productos = obtenerProductos();

    for (let i = 0; i < productos.length; i++) {
        if (productos[i].sku.toLowerCase() === sku.toLowerCase() && productos[i].sku !== skuEditando) {
            return true;
        }
    }

    return false;
}

// valida los datos editados, devuelve true si esta todo bien (los mismos criterios de ingresar producto)
function validarEdicion(nombre, sku, categoria, cantidad, precio) {
    // 1. nada puede quedar vacio
    if (nombre === "" || sku === "" || categoria === "" || cantidad === "" || precio === "") {
        mostrarMensaje(mensajeEdicion, "Ningún campo puede quedar vacío", "error");
        return false;
    }

    // 2. nombre de minimo 3 caracteres
    if (nombre.length < 3) {
        mostrarMensaje(mensajeEdicion, "El nombre debe tener mínimo 3 caracteres", "error");
        return false;
    }

    // 3. nombre y sku no pueden ser iguales
    if (nombre.toLowerCase() === sku.toLowerCase()) {
        mostrarMensaje(mensajeEdicion, "El nombre y el SKU no pueden ser iguales", "error");
        return false;
    }

    // 4. la cantidad debe ser un numero entero mayor a cero
    if (Number.isInteger(Number(cantidad)) === false || Number(cantidad) <= 0) {
        mostrarMensaje(mensajeEdicion, "La cantidad debe ser un número entero mayor a cero", "error");
        return false;
    }

    // 5. el precio debe ser mayor a cero
    if (Number(precio) <= 0) {
        mostrarMensaje(mensajeEdicion, "El precio debe ser mayor a cero", "error");
        return false;
    }

    // 6. el sku no puede estar en otro producto
    if (skuRepetido(sku)) {
        mostrarMensaje(mensajeEdicion, "Ese SKU ya existe en otro producto", "error");
        return false;
    }

    return true;
}

// al guardar los cambios: validamos y actualizamos el producto en localStorage
formularioEdicion.addEventListener("submit", function (event) {
    event.preventDefault()

    const nombre = document.getElementById("editNombre").value.trim();
    const sku = document.getElementById("editSku").value.trim();
    const categoria = document.getElementById("editCategoria").value;
    const cantidad = document.getElementById("editCantidad").value;
    const precio = document.getElementById("editPrecio").value;

    if (validarEdicion(nombre, sku, categoria, cantidad, precio) === false) {
        return;
    }

    const productos = obtenerProductos();

    for (let i = 0; i < productos.length; i++) {
        if (productos[i].sku === skuEditando) {
            productos[i].nombre = nombre;
            productos[i].sku = sku;
            productos[i].categoria = categoria;
            productos[i].cantidad = Number(cantidad);
            productos[i].precio = Number(precio);
        }
    }

    localStorage.setItem("productos", JSON.stringify(productos))

    cerrarEdicion();
    mostrarInventario();
    mostrarMensaje(mensajeInventario, "Producto actualizado", "exito");
})

botonCancelarEdicion.addEventListener("click", cerrarEdicion);


/* ---------- eliminar ---------- */

// pide confirmacion y saca el producto de la lista
function eliminarProducto(sku) {
    if (confirm("¿Seguro que quieres eliminar el producto " + sku + "?") === false) {
        return;
    }

    const productos = obtenerProductos();
    const restantes = [];

    for (let i = 0; i < productos.length; i++) {
        if (productos[i].sku !== sku) {
            restantes.push(productos[i]);
        }
    }

    localStorage.setItem("productos", JSON.stringify(restantes))

    // si justo se estaba editando ese producto, cerramos el formulario
    if (skuEditando === sku) {
        cerrarEdicion();
    }

    mostrarInventario();
    mostrarMensaje(mensajeInventario, "Producto eliminado", "exito");
}


// cada vez que se escribe en el buscador se actualiza la lista
buscador.addEventListener("input", mostrarInventario);

// al cargar la pagina
mostrarInventario();
