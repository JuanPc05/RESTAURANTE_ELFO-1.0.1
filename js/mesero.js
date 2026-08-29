// ============================================================
// mesero.js - Entrega de pedidos a las mesas
// ============================================================
// Usa la misma "base de datos" en localStorage que cajero.js y pedidos.js
// (clave "pedidos", misma estructura de datos).
//
// Flujo de estados:
//   cajero crea -> "preparar"
//   chef empieza -> "preparando"
//   chef termina -> "entregar"   <-- estos son los que ve el mesero en "POR ENTREGAR"
//   mesero entrega -> "entregado"

const CLAVE_STORAGE = "pedidos";

document.addEventListener("DOMContentLoaded", () => {
  renderizarPorEntregar();
  renderizarEntregado();
});

// ------------------------------------------------------------
// Capa de almacenamiento (igual a cajero.js / pedidos.js)
// ------------------------------------------------------------

function obtenerPedidos() {
  const datos = localStorage.getItem(CLAVE_STORAGE);
  return datos ? JSON.parse(datos) : [];
}

function guardarPedidos(pedidos) {
  localStorage.setItem(CLAVE_STORAGE, JSON.stringify(pedidos));
}

// ------------------------------------------------------------
// Render "POR ENTREGAR"
// ------------------------------------------------------------

function renderizarPorEntregar() {
  const tbody = document.querySelector("#PorEntregar tbody");
  if (!tbody) return;

  // El chef marca los pedidos listos como "entregar"; esos son los que el mesero debe llevar
  const pedidos = obtenerPedidos().filter((p) => p.estado === "entregar");

  tbody.innerHTML = "";

  if (pedidos.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="3" class="text-center text-muted">No hay pedidos por entregar</td>
      </tr>
    `;
    return;
  }

  pedidos.forEach((pedido) => {
    const fila = document.createElement("tr");
    fila.innerHTML = `
      <td>${escaparTexto(pedido.platillo)}</td>
      <td>${pedido.mesa ?? 0}</td>
      <td>
        <button class="btn btn-sm btn-success btn-entregar" data-id="${pedido.id}">
          Marcar como entregado
        </button>
      </td>
    `;
    tbody.appendChild(fila);
  });

  tbody.querySelectorAll(".btn-entregar").forEach((boton) => {
    boton.addEventListener("click", () => marcarComoEntregado(boton.dataset.id));
  });
}

// ------------------------------------------------------------
// Render "ENTREGADO"
// ------------------------------------------------------------

function renderizarEntregado() {
  const tbody = document.querySelector("#Entregado tbody");
  if (!tbody) return;

  const pedidos = obtenerPedidos().filter((p) => p.estado === "entregado");

  tbody.innerHTML = "";

  if (pedidos.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="3" class="text-center text-muted">Todavía no hay pedidos entregados</td>
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
    `;
    tbody.appendChild(fila);
  });
}

// Cambia el estado del pedido a "entregado" y refresca ambas tablas
function marcarComoEntregado(id) {
  const pedidos = obtenerPedidos();
  const pedido = pedidos.find((p) => String(p.id) === String(id));
  if (!pedido) return;

  pedido.estado = "entregado";
  guardarPedidos(pedidos);

  renderizarPorEntregar();
  renderizarEntregado();
}

// Evita que texto del pedido rompa el HTML si trae < > & etc.
function escaparTexto(texto) {
  const div = document.createElement("div");
  div.textContent = texto ?? "";
  return div.innerHTML;
}