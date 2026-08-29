const URL_API = "http://localhost:3005";

// 1. Referencias a los campos del formulario
const inputUser = document.getElementById("user");
const inputName = document.getElementById("name");
const inputRol = document.getElementById("rol");
const inputPassword = document.getElementById("password");
const btnGuardar = document.querySelector(".btn-guardar");

// 2. Escuchamos el clic en el botón de Guardar Usuario
btnGuardar.addEventListener("click", () => {
    guardarUsuario();
});

// 3. Función principal para registrar un usuario
async function guardarUsuario() {
    let userVal = inputUser.value.trim();
    let nameVal = inputName.value.trim();
    let rolVal = inputRol.value.trim();
    let passwordVal = inputPassword.value.trim();

    if (userVal === "" || nameVal === "" || rolVal === "" || passwordVal === "") {
        alert("Por favor, completa todos los campos.");
        return;
    }

    // Campos exactos que espera el backend en POST /register: user, name, rol, password
    let datosEnvio = {
        user: userVal,
        name: nameVal,
        rol: rolVal,
        password: passwordVal
    };

    try {
        let respuesta = await fetch(`${URL_API}/register`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(datosEnvio)
        });

        let datos = await respuesta.json();

        if (!respuesta.ok) {
            // El backend manda { success:false, message:"..." } con 400/500
            throw new Error(datos.message || "No se pudo registrar el usuario");
        }

        console.log("Usuario registrado:", datos);
        alert(datos.message || "Usuario registrado con éxito");

        // Redirigimos al login para que inicie sesión
        window.location.href = "login.html";

    } catch (error) {
        console.log("Error en el registro:", error);
        alert("Error al registrar: " + error.message);
    }
}
