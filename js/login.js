const URL_API = "http://localhost:3005"; 

const inputUser = document.getElementById("user");
const inputPassword = document.getElementById("password");
const btnIniciar = document.querySelector(".btn-iniciar");

// 2. Escuchamos el clic en el botón de Iniciar Sesión
btnIniciar.addEventListener("click", () => {
    iniciarSesion();
});

// 3. Función principal para validar credenciales
async function iniciarSesion() {
    let userVal = inputUser.value.trim();
    let passwordVal = inputPassword.value.trim();

    if (userVal === "" || passwordVal === "") {
        alert("Por favor, ingresa tu usuario y contraseña.");
        return;
    }

    // JSON con los campos exactos documentados en tu routes.http: "user" y "password"
    let datosEnvio = {
        user: userVal,
        password: passwordVal
    };

    try {
        let respuesta = await fetch(`${URL_API}/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(datosEnvio)
        });

        if (!respuesta.ok) {
            throw new Error("Usuario o contraseña incorrectos");
        }

        let datos = await respuesta.json();
        console.log("Sesión iniciada con éxito:", datos);

        // Guardamos los datos de la sesión en el localStorage
        localStorage.setItem("usuarioLogueado", JSON.stringify(datos));

        // Extraemos el nombre utilizando 'name', 'nombre' o el 'user' por seguridad
        let nombreMostrar = datos.name || datos.nombre || datos.user || "Usuario";
        alert(`¡Bienvenido al sistema, ${nombreMostrar}!`);

        // Redirección según el rol de la base de datos (convertido a minúsculas)
        let rol = datos.rol ? datos.rol.toLowerCase() : "";

        if (rol === "cajero") {
            window.location.href = "listado-pedidos.html"; // Pantalla de Sabas
        } else if (rol === "chef") {
            window.location.href = "chef.html"; // Pantalla de Juan
        } else if (rol === "mesero") {
            window.location.href = "mesero.html"; // Pantalla del Mesero
        } else {
            window.location.href = "index.html"; // Vista general si no coincide
        }

    } catch (error) {
        console.log("Error en el login:", error);
        alert("Error al iniciar sesión: " + error.message);
    }
}