console.log("[registro] pagina cargada");

const formularioJS = document.getElementById("formulario");

formularioJS.addEventListener("submit", function (event) {
    event.preventDefault()
    console.log("[registro] formulario enviado");

    const usuario = document.getElementById("usuarioRegistro").value.trim();
    const correo = document.getElementById("correoRegistro").value.trim();
    const password = document.getElementById("passwordRegistro").value;
    const confirmar = document.getElementById("confirmarRegistro").value;

    if (validarVacios(usuario, correo, password, confirmar) === false) {
        return;
    }

    if (validarCorreo(correo) === false) {
        return;
    }

    if (validarPassword(password, confirmar) === false) {
        return;
    }

    // sacamos los usuarios que ya existen, si no hay creamos un arreglo vacio
    let usuarios = JSON.parse(localStorage.getItem("usuarios"))

    if (usuarios === null) {
        usuarios = []
    }

    if (usuarioRepetido(usuario, usuarios) === true) {
        return;
    }

    const nuevoUsuario = {
        usuario: usuario,
        correo: correo,
        password: password
    }

    usuarios.push(nuevoUsuario)
    localStorage.setItem("usuarios", JSON.stringify(usuarios))

    console.log("[registro] usuario registrado: " + usuario + " (" + correo + ")");
    alert("Usuario registrado, ahora puedes iniciar sesion")
    window.location = "../login/login.html"
})


/* funciones de validacion, devuelven true si esta todo bien */

function validarVacios(usuario, correo, password, confirmar) {
    if (usuario === "" || correo === "" || password === "" || confirmar === "") {
        console.warn("[registro] Error: campo no puede ser vacio");
        alert("campo no puede ser vacio");
        return false;
    }

    return true;
}

function validarCorreo(correo) {
    if (correo.indexOf("@") === -1 || correo.indexOf(".") === -1) {
        console.warn("[registro] Error: el correo no es valido");
        alert("el correo no es valido");
        return false;
    }

    return true;
}

function validarPassword(password, confirmar) {
    if (password.length < 6) {
        console.warn("[registro] Error: la contraseña debe tener minimo 6 caracteres");
        alert("la contraseña debe tener minimo 6 caracteres");
        return false;
    }

    if (password !== confirmar) {
        console.warn("[registro] Error: las contraseñas no coinciden");
        alert("las contraseñas no coinciden");
        return false;
    }

    return true;
}

// devuelve true si el usuario ya existe
function usuarioRepetido(usuario, usuarios) {
    for (let i = 0; i < usuarios.length; i++) {
        if (usuarios[i].usuario.toLowerCase() === usuario.toLowerCase()) {
            console.warn("[registro] Error: ese usuario ya existe");
            alert("ese usuario ya existe");
            return true;
        }
    }

    return false;
}
