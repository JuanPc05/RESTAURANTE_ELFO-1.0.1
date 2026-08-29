// ============================================================
// cajero.js - Lógica de creación de pedidos (rol Cajero)
// ============================================================
// Por ahora los pedidos se guardan en localStorage (en el navegador),
// respetando las mismas columnas de tu tabla `pedido`:
// platillo, precio, cantidad, observaciones, cliente, fecha, estado.
//
// Cuando tengas tu backend listo, solo hay que reemplazar el
// CONTENIDO de obtenerPedidos() y guardarPedidos() por llamadas
// fetch a tu API. El resto del archivo no necesita cambiar.

const CLAVE_STORAGE = "pedidos";

document.addEventListener("DOMContentLoaded", () => {
  const botonesPedido = document.querySelectorAll(".btn-pedido");
  botonesPedido.forEach((boton) => {
    boton.addEventListener("click", () => manejarPedido(boton));
  });
});

function manejarPedido(boton) {
  const form = boton.closest("form");
  const contenedorMenu = boton.closest(".menu"); // #Pizza, #Pasta o #Starter

  // El botón es type="button", así que el navegador NO valida los
  // campos "required" automáticamente. Lo forzamos manualmente.
  if (!form.reportValidity()) {
    return;
  }

  const pedido = construirPedido(contenedorMenu);

  if (!pedido) {
    alert("Hubo un problema leyendo los datos del pedido. Revisa el formulario.");
    return;
  }

  const pedidos = obtenerPedidos();
  pedido.id = generarId(pedidos);
  pedidos.push(pedido);
  guardarPedidos(pedidos);

  alert(`Pedido #${pedido.id} registrado correctamente para ${pedido.cliente}`);
  limpiarFormulario(form);
}

// Lee los campos del formulario de la sección activa (Pizza/Pasta/Starter)
function construirPedido(contenedorMenu) {
  const platillo = contenedorMenu.querySelector(".platillo")?.value;
  const cliente = contenedorMenu.querySelector(".cliente")?.value.trim();
  const cantidad = contenedorMenu.querySelector(".cantidad")?.value;
  const fecha = contenedorMenu.querySelector(".fecha")?.value;
  const observaciones = contenedorMenu.querySelector(".observaciones")?.value.trim();
  const precioTexto = contenedorMenu.querySelector(".precios")?.textContent;

  if (!platillo || !cliente || !cantidad || !fecha) {
    return null;
  }

  return {
    platillo: platillo,
    precio: parsearPrecio(precioTexto),
    cantidad: parseInt(cantidad, 10),
    observaciones: observaciones || "",
    cliente: cliente,
    fecha: fecha,
    estado: "preparar" // Mismo valor usado en tu tabla `pedido`
  };
}

// Convierte "$20.000" -> 20000 (el punto es separador de miles, no decimal)
function parsearPrecio(texto) {
  if (!texto) return 0;
  const soloNumeros = texto.replace(/[^\d]/g, "");
  return parseInt(soloNumeros, 10) || 0;
}

// ------------------------------------------------------------
// Capa de almacenamiento (localStorage por ahora)
// Reemplaza el interior de estas 2 funciones cuando tengas backend
// ------------------------------------------------------------

function obtenerPedidos() {
  const datos = localStorage.getItem(CLAVE_STORAGE);
  return datos ? JSON.parse(datos) : [];
}

function guardarPedidos(pedidos) {
  localStorage.setItem(CLAVE_STORAGE, JSON.stringify(pedidos));
}

function generarId(pedidos) {
  if (pedidos.length === 0) return 1;
  const idMax = Math.max(...pedidos.map((p) => p.id));
  return idMax + 1;
}

// ------------------------------------------------------------

function limpiarFormulario(form) {
  form.querySelector(".cliente").value = "";
  form.querySelector(".cantidad").value = "";
  form.querySelector(".observaciones").value = "";
  // El select del platillo y la fecha se dejan con su valor actual
}