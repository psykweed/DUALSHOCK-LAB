// Agarro los elementos del HTML por su ID y los guardo en variables
const formulario = document.getElementById("formServicio");
const selectNombre = document.getElementById("nombreSelect");
const inputPrecio = document.getElementById("precio");
const inputDuracion = document.getElementById("duracion");
const tablaBody = document.getElementById("tablaBody");

// Esto es para que cuando elija algo en la lista, se llene el precio y la duracion solos
selectNombre.addEventListener("change", function() {
    let elegida = selectNombre.value;

    if (elegida == "Mantención consola (Pasta térmica) - $25.000") {
        inputPrecio.value = 25000;
        inputDuracion.value = "En domicilio (1 a 2 horas)";
    } 
    if (elegida == "Mantención PS5 (Metal líquido) - $55.000") {
        inputPrecio.value = 55000;
        inputDuracion.value = "En domicilio (1 a 2 horas)";
    } 
    if (elegida == "Mantención PC/Notebook Básico - $30.000") {
        inputPrecio.value = 30000;
        inputDuracion.value = "En domicilio";
    } 
    if (elegida == "Mantención PC/Notebook Full - $45.000") {
        inputPrecio.value = 45000;
        inputDuracion.value = "En domicilio";
    } 
    if (elegida == "Cambio de Disco Duro 1TB - $60.000") {
        inputPrecio.value = 60000;
        inputDuracion.value = "En domicilio";
    } 
    if (elegida == "Cambio HDMI PS4 - $50.000") {
        inputPrecio.value = 50000;
        inputDuracion.value = "48 hrs (retiro o taller)";
    } 
    if (elegida == "Cambio HDMI PS5 - $65.000") {
        inputPrecio.value = 65000;
        inputDuracion.value = "48 hrs (retiro o taller)";
    } 
    if (elegida == "Mantención consola + Lector - $30.000") {
        inputPrecio.value = 30000;
        inputDuracion.value = "En domicilio";
    } 
    if (elegida == "Formateo Notebook/PC - $20.000") {
        inputPrecio.value = 20000;
        inputDuracion.value = "En domicilio";
    }
});

// Funcion para dibujar la tabla abajo
function cargarTabla() {
    // Saco los datos guardados en el navegador
    let datosString = localStorage.getItem("servicios");
    let listaServicios = [];
    
    // Si hay datos, los convierto en arreglo. Si no, queda vacio []
    if (datosString != null) {
        listaServicios = JSON.parse(datosString);
    }

    // Vacio la tabla para no duplicar las cosas cuando vuelva a cargar
    tablaBody.innerHTML = "";

    // Un for de los mas normales para recorrer la lista
    for (let i = 0; i < listaServicios.length; i++) {
        let servicio = listaServicios[i];

        // Voy sumando filas al HTML
        tablaBody.innerHTML += `
            <tr>
                <td style="padding: 10px;">${servicio.nombre}</td>
                <td style="padding: 10px;">$${servicio.precio}</td>
                <td style="padding: 10px;">${servicio.duracion}</td>
                <td style="padding: 10px;">
                    <button onclick="borrar(${i})" style="background-color: red; color: white; padding: 5px; cursor: pointer;">Borrar</button>
                </td>
            </tr>
        `;
    }
}

// Cuando apreto el boton de guardar en el formulario
formulario.addEventListener("submit", function(event) {
    event.preventDefault(); // esto es para que no recargue la pagina de golpe

    if (selectNombre.value == "") {
        alert("Oye, elige un servicio primero en la lista");
        return;
    }

    // armo mi objeto con lo que escribio el usuario
    let miServicio = {
        nombre: selectNombre.value,
        precio: inputPrecio.value,
        duracion: inputDuracion.value
    };

    // traigo lo que ya existe guardado
    let datosString = localStorage.getItem("servicios");
    let lista = [];
    if (datosString != null) {
        lista = JSON.parse(datosString);
    }

    // le meto el nuevo servicio al final de la lista
    lista.push(miServicio);

    // guardo de nuevo la lista completa
    localStorage.setItem("servicios", JSON.stringify(lista));

    // limpio el formulario
    formulario.reset();

    // actualizo la tabla para ver el cambio
    cargarTabla();
});

// Funcion para borrar un servicio
function borrar(posicion) {
    let datosString = localStorage.getItem("servicios");
    let lista = JSON.parse(datosString);
    
    // quito 1 elemento desde la posicion que apretaron
    lista.splice(posicion, 1);
    
    // vuelvo a guardar la lista
    localStorage.setItem("servicios", JSON.stringify(lista));
    
    // cargo la tabla otra vez para que desparezca visualmente
    cargarTabla();
}

// llamo a la funcion para que muestre los datos apenas abro la pagina
cargarTabla();