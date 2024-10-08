// Simulador Boliche

// Precio de entrada por persona
const precioEntrada = 9000;

// Clase Bebida con constructor
class Bebida {
    constructor(nombre, precio) {
        this.nombre = nombre;
        this.precio = precio;
    }
}

// Crear bebidas usando el constructor de la clase Bebida
const bebidas = [
    new Bebida("Cerveza", 7000),
    new Bebida("Agua", 3500),
    new Bebida("Caipi Frutos Rojos", 10000),
    new Bebida("Caipi Maracuyá", 10000),
    new Bebida("Caipi Absolut", 10000),
    new Bebida("Caipi Smirnoff", 10000),
    new Bebida("Fernet con Coca", 8500),
    new Bebida("Vodka con Speed", 6790),
    new Bebida("Botella de Fernet", 90000),
    new Bebida("Caipiroska Absolut con Maracuyá", 14000),
    new Bebida("Caipiroska Absolut con Frutos Rojos", 14000),
    new Bebida("Caipiroska Absolut", 14000),
    new Bebida("Caipiroska Smirnoff", 14000)
];

// Función para encontrar una bebida específica usando find()
function encontrarBebida(nombre) {
    // Busca el nombre directamente sin modificarlo
    return bebidas.find(bebida => bebida.nombre.toLowerCase() === nombre.toLowerCase());
}

// Función para calcular el total de bebidas seleccionadas
function calcularTotalBebidas(bebidasSeleccionadas) {
    return bebidasSeleccionadas.reduce((total, bebidaSeleccionada) => {
        let bebida = encontrarBebida(bebidaSeleccionada.nombre);
        if (bebida) {
            return total + (bebida.precio * bebidaSeleccionada.cantidad);
        } else {
            console.warn(`Bebida no encontrada: ${bebidaSeleccionada.nombre}`);
            return total;
        }
    }, 0);
}

// Función para seleccionar bebidas
function seleccionarBebidas() {
    const bebidaSeleccionada = document.getElementById('bebida').value;
    const cantidadBebidas = parseInt(document.getElementById('cantidad-bebidas').value) || 0;

    if (bebidaSeleccionada && cantidadBebidas > 0) {
        const bebidaInfo = document.getElementById('resultado-bebidas');
        bebidaInfo.textContent = `Has seleccionado ${cantidadBebidas} ${bebidaSeleccionada}`;
        return [{ nombre: bebidaSeleccionada, cantidad: cantidadBebidas }];
    } else {
        document.getElementById('mensaje-error').textContent = "Por favor, selecciona una bebida y la cantidad.";
        return [];
    }
}

// Función para calcular el total de entradas
function totalEntrada(cantidadEntradas) {
    return cantidadEntradas * precioEntrada;
}

// Función para calcular el costo de las mesas VIP
function calcularMesasVIP() {
    const cantidadMesasVIPInput = document.getElementById('cantidad-mesas-vip');
    let totalMesasVIP = 0;

    if (cantidadMesasVIPInput) {
        const cantidadMesasVIP = parseInt(cantidadMesasVIPInput.value) || 0;

        // Validar que la cantidad de mesas VIP sea un número positivo
        if (cantidadMesasVIP > 0) {
            totalMesasVIP = cantidadMesasVIP * 156000; // Precio por mesa VIP
            document.getElementById('mensaje-error-vip').textContent = ""; // Limpiar mensaje de error
        } else {
            document.getElementById('mensaje-error-vip').textContent = "Por favor selecciona una cantidad válida de mesas VIP.";
        }
    } else {
        console.error("Elemento del DOM para mesa VIP no encontrado.");
    }

    return totalMesasVIP;
}


// Función principal para calcular y mostrar el total
function calcularTotal() {
    Swal.fire({
        title: "¿Deseas guardar los cambios?",
        showDenyButton: true,
        showCancelButton: true,
        confirmButtonText: "Guardar",
        denyButtonText: `No guardar`
    }).then((result) => {
        if (result.isConfirmed) {
            // Continuar con el cálculo solo si se confirma
            const cantidadEntradasInput = document.getElementById('cantidad-entradas');
            const cantidadEntradas = parseInt(cantidadEntradasInput.value) || 0;

            const totalEntradasHTML = totalEntrada(cantidadEntradas);
            const bebidasSeleccionadas = seleccionarBebidas();
            const totalBebidasHTML = calcularTotalBebidas(bebidasSeleccionadas);
            const totalMesasVIPHTML = calcularMesasVIP();
            const totalFinalHTML = totalEntradasHTML + totalBebidasHTML + totalMesasVIPHTML;

            const resultadoEntradas = document.getElementById('resultado-entradas');
            const resultadoBebidas = document.getElementById('resultado-bebidas');
            const resultadoMesaVIP = document.getElementById('resultado-mesa-vip');
            const resultadoTotal = document.getElementById('resultado-total');

            // Llenar tabla con los resultados
            llenarTablas(bebidasSeleccionadas, cantidadEntradas, totalEntradasHTML, totalMesasVIPHTML);

            resultadoEntradas.textContent = `Total Entradas: $${totalEntradasHTML}`;
            resultadoBebidas.textContent = `Total Bebidas: $${totalBebidasHTML}`;
            resultadoMesaVIP.textContent = `Total Mesas VIP: $${totalMesasVIPHTML}`;
            resultadoTotal.textContent = `Total Final: $${totalFinalHTML}`;

            // Agregar lógica para llenar la tabla con nombre y apellido
            llenarTablaNombreApellido();

            // Guardar en localStorage
            localStorage.setItem('datosBoliche', JSON.stringify({
                entradas: cantidadEntradas,
                bebidas: bebidasSeleccionadas,
                mesasVIP: document.getElementById('cantidad-mesas-vip').value,
                total: totalFinalHTML,
                nombre: document.getElementById('nombre').value,
                apellido: document.getElementById('apellido').value
            }));

            Swal.fire("Guardado!", "", "success");
        } else if (result.isDenied) {
            Swal.fire("Los cambios no han sido guardados", "", "info");
        }
    });
}

// Función para llenar tablas con los datos
function llenarTablas(bebidasSeleccionadas, cantidadEntradas, totalEntradasHTML, totalMesasVIPHTML) {
    const tablaDatos = document.getElementById('tabla-datos').getElementsByTagName('tbody')[0];
    tablaDatos.innerHTML = ''; // Limpiar tabla antes de llenar

    // Llenar fila de entradas
    const filaEntradas = tablaDatos.insertRow();
    filaEntradas.insertCell().textContent = "Entradas";
    filaEntradas.insertCell().textContent = cantidadEntradas;
    filaEntradas.insertCell().textContent = `$${precioEntrada}`;
    filaEntradas.insertCell().textContent = `$${totalEntradasHTML}`;

    // Llenar filas de bebidas
    for (const bebidaSeleccionada of bebidasSeleccionadas) {
        const bebida = encontrarBebida(bebidaSeleccionada.nombre);
        if (bebida) { // Verificar que la bebida existe
            const filaBebidas = tablaDatos.insertRow();
            filaBebidas.insertCell().textContent = bebida.nombre;
            filaBebidas.insertCell().textContent = bebidaSeleccionada.cantidad;
            filaBebidas.insertCell().textContent = `$${bebida.precio}`;
            filaBebidas.insertCell().textContent = `$${bebida.precio * bebidaSeleccionada.cantidad}`;
        } else {
            console.warn(`Bebida no encontrada: ${bebidaSeleccionada.nombre}`);
        }
    }

    // Llenar fila de mesas VIP
    const filaVIP = tablaDatos.insertRow();
    const cantidadMesasVIP = parseInt(document.getElementById('cantidad-mesas-vip').value) || 0;
    filaVIP.insertCell().textContent = "Mesas VIP";
    filaVIP.insertCell().textContent = cantidadMesasVIP > 0 ? cantidadMesasVIP : '0';
    filaVIP.insertCell().textContent = `$156000`;
    filaVIP.insertCell().textContent = `$${totalMesasVIPHTML}`;

    // Llenar fila total
    const filaTotal = tablaDatos.insertRow();
    filaTotal.insertCell().textContent = "Total";
    filaTotal.insertCell().textContent = '';
    filaTotal.insertCell().textContent = '';
    filaTotal.insertCell().textContent = `$${totalEntradasHTML + totalMesasVIPHTML + calcularTotalBebidas(bebidasSeleccionadas)}`;
}

// Nueva función para llenar tabla de nombre y apellido
function llenarTablaNombreApellido() {
    // Obtener valores de entrada
    const nombre = document.getElementById("nombre").value;
    const apellido = document.getElementById("apellido").value;

    // Obtener referencias a la tabla de nombre y apellido
    const tablaNombreApellido = document.getElementById("tabla-nombre-apellido").getElementsByTagName("tbody")[0];

    // Limpiar la tabla antes de añadir nuevos datos
    tablaNombreApellido.innerHTML = "";

    // Comprobar si los campos no están vacíos
    if (nombre) {
        // Crear una nueva fila para el nombre
        const filaNombre = tablaNombreApellido.insertRow();
        filaNombre.insertCell(0).textContent = "Nombre";
        filaNombre.insertCell(1).textContent = nombre;
    } else {
        console.error("El nombre no puede estar vacío.");
    }

    if (apellido) {
        // Crear una nueva fila para el apellido
        const filaApellido = tablaNombreApellido.insertRow();
        filaApellido.insertCell(0).textContent = "Apellido";
        filaApellido.insertCell(1).textContent = apellido;
    } else {
        console.error("El apellido no puede estar vacío.");
    }
}

// Nueva función para manejar la selección VIP
function manejarSeleccionVIP() {
    const vipSection = document.getElementById('vip-section');
    const mesaVIPSelect = document.getElementById('mesa-vip');

    // Mostrar u ocultar la sección VIP según la selección
    if (mesaVIPSelect.value === 'si') {
        vipSection.style.display = 'block'; // Mostrar sección VIP
    } else {
        vipSection.style.display = 'none'; // Ocultar sección VIP
    }
}


document.addEventListener('DOMContentLoaded', function () {
    // Event listener para el botón de calcular total
    document.getElementById('calcular').addEventListener('click', calcularTotal);
    
    // Asegúrate de que el elemento existe antes de agregar el event listener
    const cantidadMesasVip = document.getElementById('cantidad-mesas-vip');
    if (cantidadMesasVip) {
        cantidadMesasVip.addEventListener('input', manejarSeleccionVIP);
    }
});
