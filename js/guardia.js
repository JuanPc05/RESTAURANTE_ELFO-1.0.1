// Guard de acceso por rol. Se incluye en las páginas de cajero, chef, mesero y pedidos.
// Lee la sesión guardada por login.js en localStorage ("usuarioLogueado").
(function () {
    // Páginas que puede ver cada rol. Ajusta las listas si quieres dar más acceso.
    const PERMISOS = {
        cajero: ["cajero.html", "pedidos.html"],
        chef:   ["chef.html"],
        mesero: ["mesero.html"]
    };

    const sesion = JSON.parse(localStorage.getItem("usuarioLogueado") || "null");
    const rol = sesion && sesion.rol ? sesion.rol.toLowerCase().trim() : "";

    // 1. Sin sesión o rol desconocido -> al login
    if (!rol || !PERMISOS[rol]) {
        window.location.href = "login.html";
        return;
    }

    const permitidas = PERMISOS[rol];
    const paginaActual = (location.pathname.split("/").pop() || "index.html").toLowerCase();

    // 2. Entró por URL a una página que no le corresponde -> a la suya
    if (!permitidas.includes(paginaActual)) {
        window.location.href = permitidas[0];
        return;
    }

    // 3. Ocultar del navbar los enlaces a páginas no permitidas
    document.addEventListener("DOMContentLoaded", function () {
        // Mostrar el nombre real del usuario donde el HTML pone "User"
        document.querySelectorAll("#myNavbar .fw-bold").forEach(function (el) {
            el.textContent = sesion.name || sesion.user || "Usuario";
        });

        document.querySelectorAll("#myNavbar a[href]").forEach(function (a) {
            const href = a.getAttribute("href");
            if (!href.toLowerCase().endsWith(".html")) return; // "#", javascript:void(0), etc.

            const destino = href.split("/").pop().toLowerCase();
            if (destino === "index.html") return;              // botón SALIR: siempre visible
            if (permitidas.includes(destino)) return;          // página permitida: visible

            a.style.display = "none";                          // no permitido: se bloquea
        });
    });
})();
