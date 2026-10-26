// agendamientos: reserva de horas de atencion

// si no hay sesion volvemos al login
const sesion = localStorage.getItem("sesion");

if (sesion === null) {
    window.location = "../login/login.html"
}

// cerrar sesion
const botonCerrarSesion = document.getElementById("cerrarSesion");

botonCerrarSesion.addEventListener("click", function () {
    console.log("[agendamientos] sesion cerrada");
    localStorage.removeItem("sesion")
});

// las citas se guardan en localStorage con la clave "agendamientos"
// cada cita es un objeto: { cliente, correo, servicio, fecha, hora }

// HORARIO DE ATENCION DE EJEMPLO:
// lunes a viernes, de 10:00 a 18:00, en bloques de 1 hora.
// la ultima hora que se puede reservar es las 17:00 (termina a las 18:00)
const HORAS_ATENCION = ["10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00"];

// si el modulo servicios todavia no guardo nada, usamos estos
const SERVICIOS_POR_DEFECTO = ["Diagnóstico", "Reparación de consola", "Reparación de PC", "Mantenimiento y limpieza"];

const botonVolver = document.getElementById("botonVolver");
const formularioJS = document.getElementById("formulario");
const campoServicio = document.getElementById("servicioSelect");
const campoFecha = document.getElementById("fechaCita");
const campoHora = document.getElementById("horaSelect");
const mensaje = document.getElementById("mensajeAgendamiento");
const mensajeVacio = document.getElementById("mensajeVacio");
const contenedorTabla = document.getElementById("contenedorTabla");
const tablaAgendamientos = document.getElementById("tablaAgendamientos");

// boton volver
botonVolver.addEventListener("click", function () {
    window.location = "../dashboard/dashboard.html"
});


// saca las citas guardadas, si no hay devuelve un arreglo vacio
function obtenerCitas() {
    const lista = JSON.parse(localStorage.getItem("agendamientos"))

    if (lista === null) {
        return [];
    }

    return lista;
}

// muestra un mensaje en la pagina, tipo es "exito" o "error"
function mostrarMensaje(texto, tipo) {
    mensaje.innerText = texto

    if (tipo === "exito") {
        console.log("[agendamientos] " + texto);
    } else {
        console.warn("[agendamientos] Error: " + texto);
    }

    if (tipo === "exito") {
        mensaje.className = "mensajeExito"
    } else {
        mensaje.className = "mensajeError"
    }
}

// true si el texto tiene forma de correo: algo@dominio.cl
function correoValido(correo) {
    const patron = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    return patron.test(correo);
}

// fecha de hoy como texto AAAA-MM-DD (el mismo formato del input date)
function fechaDeHoy() {
    const hoy = new Date();
    const mes = String(hoy.getMonth() + 1).padStart(2, "0");
    const dia = String(hoy.getDate()).padStart(2, "0");

    return hoy.getFullYear() + "-" + mes + "-" + dia;
}

// true si la fecha cae sabado o domingo
function esFinDeSemana(fecha) {
    const dia = new Date(fecha + "T00:00:00").getDay(); // 0 domingo, 6 sabado

    return dia === 0 || dia === 6;
}

// true si ya hay una cita en esa fecha y hora
function horaOcupada(fecha, hora) {
    const citas = obtenerCitas();

    for (let i = 0; i < citas.length; i++) {
        if (citas[i].fecha === fecha && citas[i].hora === hora) {
            return true;
        }
    }

    return false;
}

// llena la lista de servicios con los del modulo servicios (o los de por defecto)
function cargarServicios() {
    let nombres = SERVICIOS_POR_DEFECTO;
    const guardados = JSON.parse(localStorage.getItem("servicios"))

    if (guardados !== null && guardados.length > 0) {
        nombres = [];
        for (let i = 0; i < guardados.length; i++) {
            nombres.push(guardados[i].nombre);
        }
    }

    campoServicio.innerHTML = '<option value="">Seleccione servicio</option>';

    for (let i = 0; i < nombres.length; i++) {
        const opcion = document.createElement("option");
        opcion.value = nombres[i];
        opcion.innerText = nombres[i];
        campoServicio.appendChild(opcion);
    }
}

// llena la lista de horas; las ocupadas en la fecha elegida quedan desactivadas
function cargarHoras() {
    campoHora.innerHTML = '<option value="">Seleccione hora</option>';

    for (let i = 0; i < HORAS_ATENCION.length; i++) {
        const hora = HORAS_ATENCION[i];
        const opcion = document.createElement("option");
        opcion.value = hora;
        opcion.innerText = hora;

        if (campoFecha.value !== "" && horaOcupada(campoFecha.value, hora)) {
            opcion.disabled = true;
            opcion.innerText = hora + " (ocupada)";
        }

        campoHora.appendChild(opcion);
    }
}

// crea una celda de tabla con texto
function crearCelda(texto) {
    const celda = document.createElement("td");
    celda.innerText = texto;

    return celda;
}

// dibuja la tabla con las citas ordenadas por fecha y hora
function mostrarCitas() {
    const citas = obtenerCitas();
    tablaAgendamientos.innerHTML = "";

    if (citas.length === 0) {
        mensajeVacio.style.display = "block"
        contenedorTabla.style.display = "none"
        return;
    }

    mensajeVacio.style.display = "none"
    contenedorTabla.style.display = "block"

    citas.sort(function (a, b) {
        if ((a.fecha + a.hora) < (b.fecha + b.hora)) {
            return -1;
        }
        return 1;
    });

    for (let i = 0; i < citas.length; i++) {
        const cita = citas[i];
        const fila = document.createElement("tr");

        fila.appendChild(crearCelda(cita.fecha));
        fila.appendChild(crearCelda(cita.hora));
        fila.appendChild(crearCelda(cita.cliente));
        fila.appendChild(crearCelda(cita.correo));
        fila.appendChild(crearCelda(cita.servicio));

        const celdaAccion = document.createElement("td");
        const botonCancelar = document.createElement("button");
        botonCancelar.innerText = "Cancelar";
        botonCancelar.className = "botonCancelar";
        botonCancelar.addEventListener("click", function () {
            cancelarCita(cita.fecha, cita.hora)
        });

        celdaAccion.appendChild(botonCancelar);
        fila.appendChild(celdaAccion);
        tablaAgendamientos.appendChild(fila);
    }
}

// saca una cita de la lista (fecha + hora no se repiten, asi que la identifican)
function cancelarCita(fecha, hora) {
    if (confirm("¿Seguro que quieres cancelar esta cita?") === false) {
        return;
    }

    const citas = obtenerCitas();
    const restantes = [];

    for (let i = 0; i < citas.length; i++) {
        if (citas[i].fecha !== fecha || citas[i].hora !== hora) {
            restantes.push(citas[i]);
        }
    }

    localStorage.setItem("agendamientos", JSON.stringify(restantes))
    console.log("[agendamientos] cita cancelada: " + fecha + " " + hora);

    cargarHoras();
    mostrarCitas();
    mostrarMensaje("La cita fue cancelada", "exito");
}


// al enviar el formulario validamos y guardamos
formularioJS.addEventListener("submit", function (event) {
    event.preventDefault()

    const cliente = document.getElementById("nombreCliente").value.trim();
    const correo = document.getElementById("correoCliente").value.trim();
    const servicio = campoServicio.value;
    const fecha = campoFecha.value;
    const hora = campoHora.value;

    // 1. nombre obligatorio
    if (cliente === "") {
        mostrarMensaje("Escribe el nombre del cliente", "error");
        return;
    }

    // 2. correo obligatorio y con formato valido
    if (correoValido(correo) === false) {
        mostrarMensaje("Escribe un correo válido (ej: nombre@correo.cl)", "error");
        return;
    }

    // 3. servicio seleccionado
    if (servicio === "") {
        mostrarMensaje("Selecciona un servicio", "error");
        return;
    }

    // 4. fecha valida (AAAA-MM-DD se puede comparar como texto)
    if (fecha === "") {
        mostrarMensaje("Selecciona una fecha válida", "error");
        return;
    }

    // 5. la fecha no puede ser anterior a hoy
    if (fecha < fechaDeHoy()) {
        mostrarMensaje("No puedes agendar en una fecha que ya pasó", "error");
        return;
    }

    // 6. solo se atiende de lunes a viernes
    if (esFinDeSemana(fecha)) {
        mostrarMensaje("Solo atendemos de lunes a viernes, elige otro día", "error");
        return;
    }

    // 7. hora seleccionada
    if (hora === "") {
        mostrarMensaje("Selecciona una hora", "error");
        return;
    }

    // 8. no puede haber dos citas en la misma fecha y hora
    if (horaOcupada(fecha, hora)) {
        mostrarMensaje("Esa fecha y hora ya está reservada, elige otra", "error");
        return;
    }

    const cita = {
        cliente: cliente,
        correo: correo,
        servicio: servicio,
        fecha: fecha,
        hora: hora
    }

    const citas = obtenerCitas();
    citas.push(cita)
    localStorage.setItem("agendamientos", JSON.stringify(citas))
    console.log("[agendamientos] cita guardada: ", cita);

    // dejamos el formulario vacio para agendar otra
    formularioJS.reset();
    cargarHoras();
    mostrarCitas();
    mostrarMensaje("Hora reservada para el " + fecha + " a las " + hora, "exito");
})


// al cargar la pagina
campoFecha.min = fechaDeHoy();   // el calendario no deja elegir dias pasados
campoFecha.addEventListener("change", cargarHoras);   // al cambiar la fecha se actualizan las horas ocupadas
cargarServicios();
cargarHoras();
mostrarCitas();

console.log("[agendamientos] pagina cargada, citas guardadas: " + obtenerCitas().length);
