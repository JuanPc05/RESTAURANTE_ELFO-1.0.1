
const ESTADOS = {
  PREPARAR:   'preparar',
  PREPARANDO: 'preparando',
  ENTREGAR:   'entregar',
  ENTREGADO:  'entregado',
};

document.addEventListener('DOMContentLoaded', () => {
  const usuario = obtenerUsuario();
  if (!usuario || usuario.rol?.toLowerCase() !== 'chef') {
    location.replace('index.html');
    return;
  }

  mostrarNombreUsuario(usuario);
  configurarLogout();
  cargarPedidos();
});

function obtenerUsuario() {
  try {
    const raw = localStorage.getItem('usuarioLogueado');
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function mostrarNombreUsuario(usuario) {
  const span = document.querySelector('#myNavbar .fw-bold');
  if (span) span.textContent = usuario.name;
}


function configurarLogout() {
  const btnSalir = document.querySelector('a.btn-danger');
  if (!btnSalir) return;
  btnSalir.addEventListener('click', () => {
    localStorage.removeItem('usuarioLogueado');

  });
}

async function cargarPedidos() {
  try {
    const respuesta = await fetch('/chef');

    if (!respuesta.ok) {
      throw new Error(`El servidor respondió ${respuesta.status}`);
    }

    const pedidos = await respuesta.json();
    renderizarPedidos(pedidos);
  } catch (error) {
    console.error('Error cargando pedidos:', error);
    renderizarPedidos([]);
  }
}

function renderizarPedidos(pedidos) {
  const porPreparar = pedidos.filter(p => p.estado === ESTADOS.PREPARAR);
  const preparando  = pedidos.filter(p => p.estado === ESTADOS.PREPARANDO);

  llenarTabla('#PorPreparar tbody', porPreparar, ESTADOS.PREPARAR);
  llenarTabla('#Preparando tbody',  preparando,  ESTADOS.PREPARANDO);
}

function llenarTabla(selectorTbody, pedidos, estadoActual) {
  const tbody = document.querySelector(selectorTbody);
  if (!tbody) return;

  tbody.innerHTML = '';

  if (pedidos.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="3" class="text-center text-muted">Sin pedidos</td>
      </tr>
    `;
    return;
  }

  pedidos.forEach(pedido => {
    const fila = document.createElement('tr');

    const tdPlatillo = document.createElement('td');
    tdPlatillo.textContent = pedido.platillo;

    const tdMesa = document.createElement('td');
    tdMesa.textContent = pedido.mesa;

    const tdAccion = document.createElement('td');
    const boton = document.createElement('button');
    boton.className = 'btn btn-warning';

    if (estadoActual === ESTADOS.PREPARAR) {
      boton.textContent = 'Empezar';

      boton.addEventListener('click', () => avanzarAPreparando(pedido.id));
    } else {
      boton.textContent = 'Listo para entregar';
      boton.addEventListener('click', () => avanzarAListo(pedido.id));
    }

    tdAccion.appendChild(boton);
    fila.append(tdPlatillo, tdMesa, tdAccion);
    tbody.appendChild(fila);
  });
}

async function avanzarAPreparando(id) {
  await cambiarEstado('/preparando', id);
}

async function avanzarAListo(id) {
  await cambiarEstado('/listo', id);
}

async function cambiarEstado(endpoint, id) {
  try {
    const respuesta = await fetch(endpoint, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });

    if (!respuesta.ok) {
      throw new Error(`El servidor respondió ${respuesta.status}`);
    }

    cargarPedidos();
  } catch (error) {
    console.error(`Error cambiando estado en ${endpoint}:`, error);
    alert('No se pudo actualizar el pedido. Revisa la consola.');
  }
}