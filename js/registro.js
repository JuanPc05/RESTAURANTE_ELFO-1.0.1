const URL_API = "http://localhost:3005"; 

// 2. Referencias exactas a los IDs y clases de tu HTML de registro
const inputUser = document.getElementById("user");
const inputName = document.getElementById("name");
const selectRol = document.getElementById("rol");
const inputPassword = document.getElementById("password");
const btnGuardar = document.querySelector(".btn-guardar"); // Buscamos por la clase .btn-guardar

// 3. Escuchamos el evento click en el botón de guardar
btnGuardar.addEventListener("click", () => {
    guardarUsuario();
});

// 4. Función para procesar y enviar el registro
async function guardarUsuario() {
    let userVal = inputUser.value.trim();
    let nameVal = inputName.value.trim();
    let rolVal = selectRol.value; // Captura directamente "cajero", "chef" o "mesero" [3, 4]
    let passwordVal = inputPassword.value.trim();

    // Validación de campos vacíos en el Frontend
    if (userVal === "" || nameVal === "" || passwordVal === "") {
        alert("Por favor, completa todos los campos obligatorios.");
        return;
    }

    // Estructura JSON idéntica a la especificación de tu backend
    let datosUsuario = {
        user: userVal,
        name: nameVal,
        rol: rolVal,
        password: passwordVal
    };

    try {
        // Petición POST al endpoint de registro
        let respuesta = await fetch(`${URL_API}/register`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(datosUsuario)
        });

        if (respuesta.ok) {
            alert("¡Usuario registrado con éxito en el sistema!");
            window.location.href = "login.html"; // Redirección automática al Login
        } else {
            let error = await respuesta.json();
            alert(`Error en el registro: ${error.message || "No se pudo crear el usuario."}`);
        }

    } catch (error) {
        console.log("Error de conexión:", error);
        alert("No se pudo conectar con el servidor. Asegúrate de tener el backend encendido en el puerto 3005.");
    }
}
