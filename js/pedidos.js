// ============================================================
// pedidos.js - Muestra los pedidos "por preparar"
// ============================================================
// Lee los pedidos guardados en localStorage por cajero.js
// (misma clave "pedidos" y misma estructura de datos).

const CLAVE_STORAGE = "pedidos";

document.addEventListener("DOMContentLoaded", () => {
  renderizarPedidos();
});

// ------------------------------------------------------------
// Capa de almacenamiento (igual a la de cajero.js)
// ------------------------------------------------------------

function obtenerPedidos() {
  const datos = localStorage.getItem(CLAVE_STORAGE);
  return datos ? JSON.parse(datos) : [];
}

function guardarPedidos(pedidos) {
  localStorage.setItem(CLAVE_STORAGE, JSON.stringify(pedidos));
}

// ------------------------------------------------------------
// Render de la tabla "POR PREPARAR"
// ------------------------------------------------------------

function renderizarPedidos() {
  const tbody = document.querySelector("#PorPreparar tbody");
  if (!tbody) return;

  // Solo mostramos los que todavía no se empezaron a preparar
  const pedidos = obtenerPedidos().filter((p) => p.estado === "preparar");

  tbody.innerHTML = "";

  if (pedidos.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="4" class="text-center text-muted">No hay pedidos por preparar</td>
      </tr>
    `;
    return;
  }

  pedidos.forEach((pedido) => {
    const fila = document.createElement("tr");
    fila.innerHTML = `
      <td>${escaparTexto(pedido.platillo)}</td>
      <td>${pedido.mesa ?? 0}</td>
      <td>${escaparTexto(pedido.estado)}</td>
      <td>
        <button class="btn btn-sm btn-success btn-preparando" data-id="${pedido.id}">
          Empezar a preparar
        </button>
      </td>
    `;
    tbody.appendChild(fila);
  });

  // Conectamos los botones recién creados
  tbody.querySelectorAll(".btn-preparando").forEach((boton) => {
    boton.addEventListener("click", () => marcarComoPreparando(boton.dataset.id));
  });
}

// Cambia el estado del pedido a "preparando" y refresca la tabla
function marcarComoPreparando(id) {
  const pedidos = obtenerPedidos();
  const pedido = pedidos.find((p) => String(p.id) === String(id));
  if (!pedido) return;

  pedido.estado = "preparando";
  guardarPedidos(pedidos);
  renderizarPedidos(); // este pedido desaparece de "por preparar"
}

// Evita que texto del pedido rompa el HTML si trae < > & etc.
function escaparTexto(texto) {
  const div = document.createElement("div");
  div.textContent = texto ?? "";
  return div.innerHTML;
}