const formularioJS = document.getElementById("formulario");

formularioJS.addEventListener("submit", function (event) {
    event.preventDefault()
    console.log("Boton funcionando");

    const nombre = document.getElementById("nombreProducto").value.trim();
    const sku = document.getElementById("skuProducto").value.trim();
    const categoria = document.getElementById("categoriaSelect").value;
    const cantidad = document.getElementById("cantidadProducto").value;
    const precio = document.getElementById("precioProducto").value;

    console.log("Nombre: ", nombre);
    console.log("Sku: ", sku);
    console.log("Categoria: ", categoria);
    console.log("Cantidad: ", cantidad);
    console.log("Precio: ", precio);

    if (nombre === "" || sku === "" || categoria === "" || cantidad === "" || precio === "") {
        alert("campo no puede ser vacio");
        return;
    }
})
