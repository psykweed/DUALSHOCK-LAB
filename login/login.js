const usuarioBDD = {
    usuario: "admin",
    password: "123456"
}

const formularioJS = document.getElementById("formulario");

formularioJS.addEventListener("submit", function (event) {
    event.preventDefault()
    console.log("Boton funcionando");

    const usuarioLogin = document.getElementById("usuarioLogin").value.trim();
    const passwordLogin = document.getElementById("passwordLogin").value;

    console.log(usuarioLogin);
    console.log(passwordLogin);

    if (usuarioLogin === "" || passwordLogin === "") {
        alert("campo no puede ser vacio");
        return;
    }

    if (validarUsuario(usuarioLogin, passwordLogin)) {
        alert("Usuario correcto")
    }
})

function validarUsuario(usuario, password) {
    if (usuario === usuarioBDD.usuario && password === usuarioBDD.password) {
        return true;
    }

    alert("Credenciales incorrectas");
    return false;
}
