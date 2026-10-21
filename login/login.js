// si no hay usuarios guardados creamos uno de prueba
let usuarios = JSON.parse(localStorage.getItem("usuarios"))

if (usuarios === null) {
    usuarios = [
        { usuario: "admin", correo: "admin@dualshock.cl", password: "123456" }
    ]
    localStorage.setItem("usuarios", JSON.stringify(usuarios))
}

const formularioJS = document.getElementById("formulario");

formularioJS.addEventListener("submit", function (event) {
    event.preventDefault()

    const usuarioLogin = document.getElementById("usuarioLogin").value.trim();
    const passwordLogin = document.getElementById("passwordLogin").value;

    if (validarVacios(usuarioLogin, passwordLogin) === false) {
        return;
    }

    if (validarUsuario(usuarioLogin, passwordLogin) === false) {
        return;
    }

    // guardamos la sesion y pasamos al dashboard
    localStorage.setItem("sesion", usuarioLogin)
    window.location = "../dashboard/dashboard.html"
})


/* funciones de validacion, devuelven true si esta todo bien */

function validarVacios(usuario, password) {
    if (usuario === "" || password === "") {
        alert("campo no puede ser vacio");
        return false;
    }

    return true;
}

// revisa que el usuario y la password esten en los usuarios registrados
function validarUsuario(usuario, password) {
    const listaUsuarios = JSON.parse(localStorage.getItem("usuarios"))

    for (let i = 0; i < listaUsuarios.length; i++) {
        if (listaUsuarios[i].usuario === usuario && listaUsuarios[i].password === password) {
            return true;
        }
    }

    alert("Usuario o contraseña incorrectos");
    return false;
}
