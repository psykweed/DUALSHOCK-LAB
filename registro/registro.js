const formularioJS = document.getElementById("formulario");

formularioJS.addEventListener("submit", function (event) {
    event.preventDefault()
    console.log("Boton funcionando");

    const usuario = document.getElementById("usuarioRegistro").value.trim();
    const correo = document.getElementById("correoRegistro").value.trim();
    const password = document.getElementById("passwordRegistro").value;
    const confirmar = document.getElementById("confirmarRegistro").value;

    console.log(usuario);
    console.log(correo);

    if (usuario === "" || correo === "" || password === "" || confirmar === "") {
        alert("campo no puede ser vacio");
        return;
    }
})
