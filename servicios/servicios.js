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

// servicios generales de DUALSHOCK-LAB (precio 0 = se cotiza al agendar)
const SERVICIOS_INICIALES = [
    {
        nombre: "Mantención y limpieza",
        descripcion: "Limpieza interna y mantención de consolas, PC y notebooks.",
        precio: 25000,
        duracion: "1 a 2 horas en consolas",
        modalidad: "A domicilio",
        incluye: [
            "Limpieza y cambio de pasta térmica en consola: $25.000",
            "Mantención de PS5 con metal líquido: $55.000",
            "Mantención de consola con diagnóstico del lector: $30.000",
            "Mantención básica de CPU/GPU en PC o notebook: $30.000",
            "Mantención completa de CPU/GPU en PC o notebook: $45.000"
        ]
    },
    {
        nombre: "Reparación de consola",
        descripcion: "Reparación de consolas PlayStation con maquinaria.",
        precio: 50000,
        duracion: "48 horas",
        modalidad: "Retiro o taller",
        incluye: [
            "Cambio de HDMI en PS4: $50.000",
            "Cambio de HDMI en PS5: $65.000",
            "Reparación con maquinaria",
            "Retiro y entrega en 48 horas"
        ]
    },
    {
        nombre: "Reparación de PC y notebook",
        descripcion: "Puesta a punto y cambio de componentes en computadores.",
        precio: 20000,
        duracion: "Se coordina al agendar",
        modalidad: "A domicilio",
        incluye: [
            "Formateo y puesta a punto del equipo: $20.000",
            "Cambio de disco duro de 1 TB, con instalación y configuración: $60.000"
        ]
    },
    {
        nombre: "Diagnóstico",
        descripcion: "Revisión del equipo para encontrar la falla antes de repararlo.",
        precio: 0,
        duracion: "Se coordina al agendar",
        modalidad: "Se coordina al agendar",
        incluye: [
            "Revisión de consolas, PC y notebooks",
            "El diagnóstico del lector está incluido en la mantención de consola con lector"
        ]
    }
];

const formularioJS = document.getElementById("formulario");
const listaServicios = document.getElementById("listaServicios");
const mensajeVacio = document.getElementById("mensajeVacio");
const detalleServicio = document.getElementById("detalleServicio");
const botonEliminar = document.getElementById("botonEliminar");
const botonRestaurar = document.getElementById("botonRestaurar");

// posicion del servicio que se esta viendo en el detalle
let servicioSeleccionado = 0;

// si todavia no hay servicios guardados, guardamos los iniciales
if (localStorage.getItem("servicios") === null) {
    guardarLista("servicios", SERVICIOS_INICIALES)
}

mostrarServicios()

formularioJS.addEventListener("submit", function (event) {
    event.preventDefault()

    const nombre = document.getElementById("nombreServicio").value.trim();
    const precio = document.getElementById("precioServicio").value;
    const plazo = document.getElementById("plazoServicio").value.trim();
    const modalidad = document.getElementById("modalidadSelect").value;
    const descripcion = document.getElementById("descripcionServicio").value.trim();
    const incluye = convertirEnLista(document.getElementById("incluyeServicio").value);

    if (validarVacios(nombre, precio, plazo, modalidad, descripcion) === false) {
        return;
    }

    if (validarNombre(nombre) === false) {
        return;
    }

    if (validarPrecio(precio) === false) {
        return;
    }

    if (validarIncluye(incluye) === false) {
        return;
    }

    const servicios = leerLista("servicios")

    if (nombreRepetido(nombre, servicios) === true) {
        return;
    }

    const nuevoServicio = {
        nombre: nombre,
        descripcion: descripcion,
        precio: Number(precio),
        duracion: plazo,
        modalidad: modalidad,
        incluye: incluye
    }

    servicios.push(nuevoServicio)
    guardarLista("servicios", servicios)

    alert("Servicio guardado")

    // dejamos el formulario vacio y mostramos el servicio nuevo
    document.getElementById("nombreServicio").value = "";
    document.getElementById("precioServicio").value = "";
    document.getElementById("plazoServicio").value = "";
    document.getElementById("modalidadSelect").value = "";
    document.getElementById("descripcionServicio").value = "";
    document.getElementById("incluyeServicio").value = "";

    servicioSeleccionado = servicios.length - 1
    mostrarServicios()
})

botonEliminar.addEventListener("click", function () {
    if (confirm("¿Eliminar este servicio?") === false) {
        return;
    }

    const servicios = leerLista("servicios")
    const restantes = []

    for (let i = 0; i < servicios.length; i++) {
        if (i !== servicioSeleccionado) {
            restantes.push(servicios[i])
        }
    }

    guardarLista("servicios", restantes)
    servicioSeleccionado = 0
    mostrarServicios()
});

botonRestaurar.addEventListener("click", function () {
    if (confirm("Se vuelven a los servicios iniciales y se pierden los cambios. ¿Seguir?") === false) {
        return;
    }

    guardarLista("servicios", SERVICIOS_INICIALES)
    servicioSeleccionado = 0
    mostrarServicios()
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


/* mostrar los servicios */

function textoPrecio(precio) {
    if (Number(precio) === 0) {
        return "A cotizar";
    }

    return "Desde $" + Number(precio).toLocaleString("es-CL");
}

function mostrarServicios() {
    const servicios = leerLista("servicios")

    listaServicios.innerHTML = ""

    if (servicios.length === 0) {
        mensajeVacio.style.display = "block"
        detalleServicio.style.display = "none"
        return;
    }

    mensajeVacio.style.display = "none"
    detalleServicio.style.display = "block"

    if (servicioSeleccionado >= servicios.length) {
        servicioSeleccionado = 0
    }

    for (let i = 0; i < servicios.length; i++) {
        let clase = "card servicioCard"

        if (i === servicioSeleccionado) {
            clase = "card servicioCard seleccionado"
        }

        listaServicios.innerHTML += `
            <div class="${clase}" onclick="verDetalle(${i})">
                <h3>${servicios[i].nombre}</h3>
                <p>${servicios[i].descripcion || ""}</p>
                <span class="precioDesde">${textoPrecio(servicios[i].precio)}</span>
            </div>
        `
    }

    mostrarDetalle(servicios[servicioSeleccionado])
}

// muestra abajo lo que incluye y las especificaciones del servicio elegido
function mostrarDetalle(servicio) {
    document.getElementById("detalleNombre").innerHTML = servicio.nombre;
    document.getElementById("detalleDescripcion").innerHTML = servicio.descripcion || "";
    document.getElementById("detallePrecio").innerHTML = textoPrecio(servicio.precio);
    document.getElementById("detallePlazo").innerHTML = servicio.duracion || "-";
    document.getElementById("detalleModalidad").innerHTML = servicio.modalidad || "-";

    const listaIncluye = document.getElementById("detalleIncluye");
    listaIncluye.innerHTML = ""

    if (servicio.incluye !== undefined) {
        for (let i = 0; i < servicio.incluye.length; i++) {
            listaIncluye.innerHTML += `<li>${servicio.incluye[i]}</li>`
        }
    }
}

function verDetalle(posicion) {
    servicioSeleccionado = posicion
    mostrarServicios()
}

// separa el texto del textarea en una lista, una cosa por linea
function convertirEnLista(texto) {
    const lineas = texto.split("\n")
    const resultado = []

    for (let i = 0; i < lineas.length; i++) {
        const linea = lineas[i].trim()

        if (linea !== "") {
            resultado.push(linea)
        }
    }

    return resultado;
}


/* funciones de validacion, devuelven true si esta todo bien */

function validarVacios(nombre, precio, plazo, modalidad, descripcion) {
    if (nombre === "" || precio === "" || plazo === "" || modalidad === "" || descripcion === "") {
        alert("campo no puede ser vacio");
        return false;
    }

    return true;
}

function validarNombre(nombre) {
    if (nombre.length < 3) {
        alert("el nombre debe tener minimo 3 caracteres");
        return false;
    }

    return true;
}

function validarPrecio(precio) {
    if (precio <= 0) {
        alert("el precio debe ser mayor a cero");
        return false;
    }

    return true;
}

function validarIncluye(incluye) {
    if (incluye.length === 0) {
        alert("escribe al menos una cosa que incluye el servicio");
        return false;
    }

    return true;
}

// devuelve true si ya hay un servicio con ese nombre
function nombreRepetido(nombre, servicios) {
    for (let i = 0; i < servicios.length; i++) {
        if (servicios[i].nombre.toLowerCase() === nombre.toLowerCase()) {
            alert("ese servicio ya existe");
            return true;
        }
    }

    return false;
}
