// ============================================================
// chef.js - Pedidos para el chef (rol Chef)
// ============================================================
// Lee los pedidos guardados en localStorage por cajero.js
// (misma clave "pedidos" y misma estructura que pedidos.js / mesero.js).
//
// Antes este archivo consultaba el backend (fetch '/chef'); por eso
// el chef NO veía los pedidos que el cajero creaba en el navegador.

const CLAVE_STORAGE = "pedidos";

const ESTADOS = {
  PREPARAR:   "preparar",
  PREPARANDO: "preparando",
  ENTREGAR:   "entregar",
};

document.addEventListener("DOMContentLoaded", () => {
  const btnSalir = document.querySelector("a.btn-danger");
  if (btnSalir) {
    btnSalir.addEventListener("click", () => localStorage.removeItem("usuarioLogueado"));
  }

  renderizarPedidos();
});

// ------------------------------------------------------------
// Capa de almacenamiento (igual que cajero.js / pedidos.js / mesero.js)
// ------------------------------------------------------------

function obtenerPedidos() {
  const datos = localStorage.getItem(CLAVE_STORAGE);
  return datos ? JSON.parse(datos) : [];
}

function guardarPedidos(pedidos) {
  localStorage.setItem(CLAVE_STORAGE, JSON.stringify(pedidos));
}

// ------------------------------------------------------------
// Render de las tablas "POR PREPARAR" y "PREPARANDO"
// ------------------------------------------------------------

function renderizarPedidos() {
  const pedidos = obtenerPedidos();

  llenarTabla(
    "#PorPreparar tbody",
    pedidos.filter((p) => p.estado === ESTADOS.PREPARAR),
    ESTADOS.PREPARAR
  );
  llenarTabla(
    "#Preparando tbody",
    pedidos.filter((p) => p.estado === ESTADOS.PREPARANDO),
    ESTADOS.PREPARANDO
  );
}

function llenarTabla(selectorTbody, pedidos, estadoActual) {
  const tbody = document.querySelector(selectorTbody);
  if (!tbody) return;

  tbody.innerHTML = "";

  if (pedidos.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="3" class="text-center text-muted">Sin pedidos</td>
      </tr>
    `;
    return;
  }

  pedidos.forEach((pedido) => {
    const fila = document.createElement("tr");

    const tdPlatillo = document.createElement("td");
    tdPlatillo.textContent = pedido.platillo;

    const tdMesa = document.createElement("td");
    tdMesa.textContent = pedido.mesa ?? 0;

    const tdAccion = document.createElement("td");
    const boton = document.createElement("button");
    boton.className = "btn btn-warning";
    boton.type = "button";

    if (estadoActual === ESTADOS.PREPARAR) {
      boton.textContent = "Empezar";
      boton.addEventListener("click", () => cambiarEstado(pedido.id, ESTADOS.PREPARANDO));
    } else {
      boton.textContent = "Listo para entregar";
      boton.addEventListener("click", () => cambiarEstado(pedido.id, ESTADOS.ENTREGAR));
    }

    tdAccion.appendChild(boton);
    fila.append(tdPlatillo, tdMesa, tdAccion);
    tbody.appendChild(fila);
  });
}

// Cambia el estado del pedido y refresca ambas tablas
function cambiarEstado(id, nuevoEstado) {
  const pedidos = obtenerPedidos();
  const pedido = pedidos.find((p) => String(p.id) === String(id));
  if (!pedido) return;

  pedido.estado = nuevoEstado;
  guardarPedidos(pedidos);
  renderizarPedidos();
}
