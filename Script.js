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
        if (cantidadMesasVIP > 0) {
            totalMesasVIP = cantidadMesasVIP * 156000;
            document.getElementById('mensaje-error-vip').textContent = "";
        } else {
            document.getElementById('mensaje-error-vip').textContent = "Por favor selecciona una cantidad válida de mesas VIP.";
        }
    } else {
        console.error("Elemento del DOM para mesa VIP no encontrado.");
    }

    return totalMesasVIP;
}

// Función para manejar la selección de mesas VIP
function manejarSeleccionVIP() {
    const mesaVIP = document.getElementById("mesa-vip").value;
    const vipSection = document.getElementById("vip-section");

    if (mesaVIP === "si") {
        vipSection.style.display = "block";
    } else {
        vipSection.style.display = "none";
        document.getElementById("cantidad-mesas-vip").value = "";
    }
}

// Función para enviar datos con AJAX
async function enviarDatosAJAX(datos) {
    const url = 'https://jsonplaceholder.typicode.com/posts'; // URL alternativa para pruebas
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(datos)
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const resultado = await response.json();
        console.log('Datos enviados con éxito:', resultado);
    } catch (error) {
        console.error(`Error al enviar datos: ${error.message}`);
        alert('Hubo un error al enviar los datos. Por favor, inténtalo de nuevo más tarde.');
    }
}


// Función principal para calcular y mostrar el total
async function calcularTotal() {
    const result = await Swal.fire({
        title: "¿Deseas guardar los cambios?",
        showDenyButton: true,
        showCancelButton: true,
        confirmButtonText: "Guardar",
        denyButtonText: `No guardar`
    });
    
    if (result.isConfirmed) {
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

        llenarTablas(bebidasSeleccionadas, cantidadEntradas, totalEntradasHTML, totalMesasVIPHTML);

        resultadoEntradas.textContent = `Total Entradas: $${totalEntradasHTML}`;
        resultadoBebidas.textContent = `Total Bebidas: $${totalBebidasHTML}`;
        resultadoMesaVIP.textContent = `Total Mesas VIP: $${totalMesasVIPHTML}`;
        resultadoTotal.textContent = `Total Final: $${totalFinalHTML}`;

        const nombre = document.getElementById('nombre') ? document.getElementById('nombre').value : "";
        const apellido = document.getElementById('apellido') ? document.getElementById('apellido').value : "";
        
        llenarTablaNombreApellido(nombre, apellido);

        localStorage.setItem('datosBoliche', JSON.stringify({
            entradas: cantidadEntradas,
            bebidas: bebidasSeleccionadas,
            mesasVIP: document.getElementById('cantidad-mesas-vip') ? document.getElementById('cantidad-mesas-vip').value : 0,
            total: totalFinalHTML,
            nombre,
            apellido
        }));

        if (bebidasSeleccionadas.length > 0) {
            await enviarDatosAJAX({
                entradas: cantidadEntradas,
                bebidas: bebidasSeleccionadas,
                mesasVIP: document.getElementById('cantidad-mesas-vip') ? document.getElementById('cantidad-mesas-vip').value : 0,
                total: totalFinalHTML,
                nombre,
                apellido
            });
        } else {
            Swal.fire("No se seleccionaron bebidas", "Por favor selecciona al menos una bebida.", "warning");
            return;
        }

        Swal.fire("Guardado!", "", "success");
    } else if (result.isDenied) {
        Swal.fire("Los cambios no se guardaron", "", "info");
    }
}

// Función para llenar tablas con los datos
function llenarTablas(bebidasSeleccionadas, cantidadEntradas, totalEntradasHTML, totalMesasVIPHTML) {
    const tablaDatos = document.getElementById('tabla-datos').getElementsByTagName('tbody')[0];
    tablaDatos.innerHTML = '';

    const filaEntradas = tablaDatos.insertRow();
    filaEntradas.insertCell().textContent = "Entradas";
    filaEntradas.insertCell().textContent = cantidadEntradas;
    filaEntradas.insertCell().textContent = `$${precioEntrada}`;
    filaEntradas.insertCell().textContent = `$${totalEntradasHTML}`;

    for (const bebidaSeleccionada of bebidasSeleccionadas) {
        const bebida = encontrarBebida(bebidaSeleccionada.nombre);
        if (bebida) {
            const filaBebidas = tablaDatos.insertRow();
            filaBebidas.insertCell().textContent = bebida.nombre;
            filaBebidas.insertCell().textContent = bebidaSeleccionada.cantidad;
            filaBebidas.insertCell().textContent = `$${bebida.precio}`;
            filaBebidas.insertCell().textContent = `$${bebida.precio * bebidaSeleccionada.cantidad}`;
        }
    }

    const filaMesasVIP = tablaDatos.insertRow();
    filaMesasVIP.insertCell().textContent = "Mesas VIP";
    filaMesasVIP.insertCell().textContent = document.getElementById('cantidad-mesas-vip') ? document.getElementById('cantidad-mesas-vip').value : 0;
    filaMesasVIP.insertCell().textContent = "$156000";
    filaMesasVIP.insertCell().textContent = `$${totalMesasVIPHTML}`;
}

// Función para llenar la tabla de nombre y apellido
function llenarTablaNombreApellido(nombre, apellido) {
    const tablaNombreApellido = document.getElementById('tabla-nombre-apellido');

    if (tablaNombreApellido) {
        const tbody = tablaNombreApellido.getElementsByTagName('tbody')[0];
        tbody.innerHTML = ''; // Limpiar la tabla antes de llenarla

        const filaNombre = tbody.insertRow();
        const celdaCampoNombre = filaNombre.insertCell(0);
        const celdaValorNombre = filaNombre.insertCell(1);
        celdaCampoNombre.textContent = 'Nombre';
        celdaValorNombre.textContent = nombre;

        const filaApellido = tbody.insertRow();
        const celdaCampoApellido = filaApellido.insertCell(0);
        const celdaValorApellido = filaApellido.insertCell(1);
        celdaCampoApellido.textContent = 'Apellido';
        celdaValorApellido.textContent = apellido;
    } else {
        console.error('No se encontró la tabla de nombre y apellido en el DOM.');
    }
}
