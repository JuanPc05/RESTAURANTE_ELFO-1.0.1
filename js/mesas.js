// ============================================================
// mesas.js - Gestión de mesas del restaurante (rol Cajero)
// ============================================================
// Misma idea que cajero.js: por ahora las mesas viven en
// localStorage. Clave "mesas" -> array de objetos { id, numero }.
//
// Este archivo se carga ANTES que cajero.js, así que las funciones
// obtenerMesas() / guardarMesas() quedan disponibles para él.

const CLAVE_MESAS = "mesas";

document.addEventListener("DOMContentLoaded", () => {
  const btnAgregar = document.querySelector(".btn-agregar-mesa");
  if (btnAgregar) {
    btnAgregar.addEventListener("click", agregarMesa);
  }

  const inputMesa = document.querySelector("#nuevaMesa");
  if (inputMesa) {
    inputMesa.addEventListener("keydown", (evento) => {
      if (evento.key === "Enter") {
        evento.preventDefault();
        agregarMesa();
      }
    });
  }

  renderizarListaMesas();
  poblarSelectsDeMesa();
});

// ------------------------------------------------------------
// Capa de almacenamiento (localStorage por ahora)
// ------------------------------------------------------------

function obtenerMesas() {
  const datos = localStorage.getItem(CLAVE_MESAS);
  return datos ? JSON.parse(datos) : [];
}

function guardarMesas(mesas) {
  localStorage.setItem(CLAVE_MESAS, JSON.stringify(mesas));
}

function generarIdMesa(mesas) {
  if (mesas.length === 0) return 1;
  return Math.max(...mesas.map((m) => m.id)) + 1;
}

// ------------------------------------------------------------
// Alta / baja de mesas
// ------------------------------------------------------------

function agregarMesa() {
  const input = document.querySelector("#nuevaMesa");
  if (!input) return;

  const numero = parseInt(input.value, 10);
  if (!numero || numero <= 0) {
    alert("Escribe un número de mesa válido.");
    return;
  }

  const mesas = obtenerMesas();

  if (mesas.some((m) => m.numero === numero)) {
    alert(`La mesa ${numero} ya existe.`);
    return;
  }

  mesas.push({ id: generarIdMesa(mesas), numero: numero });
  mesas.sort((a, b) => a.numero - b.numero);
  guardarMesas(mesas);

  input.value = "";
  renderizarListaMesas();
  poblarSelectsDeMesa();
}

function eliminarMesa(id) {
  const mesas = obtenerMesas().filter((m) => String(m.id) !== String(id));
  guardarMesas(mesas);
  renderizarListaMesas();
  poblarSelectsDeMesa();
}

// ------------------------------------------------------------
// Render
// ------------------------------------------------------------

function renderizarListaMesas() {
  const lista = document.querySelector("#listaMesas");
  if (!lista) return;

  const mesas = obtenerMesas();
  lista.innerHTML = "";

  if (mesas.length === 0) {
    lista.innerHTML = `<li class="list-group-item text-muted">Aún no hay mesas registradas</li>`;
    return;
  }

  mesas.forEach((mesa) => {
    const li = document.createElement("li");
    li.className = "list-group-item d-flex justify-content-between align-items-center";
    li.textContent = `Mesa ${mesa.numero}`;

    const btn = document.createElement("button");
    btn.className = "btn btn-sm btn-danger";
    btn.type = "button";
    btn.textContent = "Eliminar";
    btn.addEventListener("click", () => eliminarMesa(mesa.id));

    li.appendChild(btn);
    lista.appendChild(li);
  });
}

// Rellena todos los <select class="mesa"> de los formularios de pedido
function poblarSelectsDeMesa() {
  const selects = document.querySelectorAll("select.mesa");
  const mesas = obtenerMesas();

  selects.forEach((select) => {
    const valorPrevio = select.value;
    select.innerHTML = `<option value="">-- Selecciona mesa --</option>`;

    mesas.forEach((mesa) => {
      const option = document.createElement("option");
      option.value = mesa.numero;
      option.textContent = `Mesa ${mesa.numero}`;
      select.appendChild(option);
    });

    if (valorPrevio) select.value = valorPrevio;
  });
}
