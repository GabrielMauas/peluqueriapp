let pagina = 1;

const cita = {
    nombre: '',
    fecha: '',
    hora: '',
    servicios: []
};

document.addEventListener('DOMContentLoaded', function() {
    iniciarApp();
})

function iniciarApp() {

    mostrarServicios();

    // Resalta el DIV actual según el tab al que se presiona
    mostrarSeccion();

    // Oculta o muestra una sección según el tab al que se presiona
    cambiarSeccion();

    // Paginación Siguiente y Anterior
    paginaSiguiente();
    paginaAnterior();

    // Comprueba la Pagina actual para ocultar o mostrar la paginación
    botonesPaginador();

    // Muestra el Resumen de la cita o mensaje de error en caso de no pasar la validación
    mostrarResumen();

    // Almacena el nombre de la cita en el objeto
    nombreCita();

    // Almacena la fecha de la cita en el objeto
    fechaCita();

    // Deshabilita días pasados
    deshabilitarFechas();

    // Almacena la hora de la cita en el objeto
    horaCita();
}


function mostrarSeccion() {

    // Eliminar 'mostrar-seccion' de la seccion anterior
    const seccionAnterior = document.querySelector('.mostrar-seccion');
    if(seccionAnterior) {
        seccionAnterior.classList.remove('mostrar-seccion');
    }

    const seccionActual = document.querySelector(`#paso-${pagina}`);
    seccionActual.classList.add('mostrar-seccion');

    // Eliminar la clase 'actual' en el tab anterior
    const tabAnterior = document.querySelector('.tabs .actual');
    if(tabAnterior) {
        tabAnterior.classList.remove('actual');
    }

    // Resalta le tab actual
    const tab = document.querySelector(`[data-paso="${pagina}"]`);
    tab.classList.add('actual');
}

function cambiarSeccion() {
    const enlaces = document.querySelectorAll('.tabs button');

    enlaces.forEach(enlace => {
        enlace.addEventListener('click', e => {
            e.preventDefault();
            pagina = parseInt(e.target.dataset.paso);

            // Llamar la función de mostrar sección
            mostrarSeccion();
            botonesPaginador();
        })
    })
}

async function mostrarServicios(){
    try {

        const url = 'http://localhost:3000/servicios.php';

        const resultado = await fetch(url);
        const db = await resultado.json();

        // console.log(db);

        // const {servicios} = db;

        // Generar HTML
        db.forEach( servicio => {
            const {id, nombre, precio} = servicio;

            // DOM Scripting

            // Generar nombre servicio
            const nombreServicio = document.createElement('P');
            nombreServicio.textContent = nombre;
            nombreServicio.classList.add('nombre-servicio');

            // Generar precio servicio
            const precioServicio = document.createElement('P');
            precioServicio.textContent = `$${precio}`;
            precioServicio.classList.add('precio-servicio');

            // Generar div contenedor de servicio
            const servicioDiv = document.createElement('DIV');
            servicioDiv.classList.add('servicio');
            servicioDiv.dataset.idServicio = id;

            // Selecciona un servicio
            servicioDiv.onclick = seleccionarServicio;

            // Inyectar precio y nombre al div de servicio
            servicioDiv.appendChild(nombreServicio);
            servicioDiv.appendChild(precioServicio);

            // Inyectarlo en el HTML
            document.querySelector('#servicios').appendChild(servicioDiv);

        })
    } catch (error) {
        console.log(error)
    }
}

function seleccionarServicio(e) {

    // Forzar que el elemento que le demos click sea el DIV
    let elemento;

    if(e.target.tagName === 'P') {
        elemento = e.target.parentElement;
    } else {
        elemento = e.target;
    }

    // Seleccionar / Deseleccionar
    if(elemento.classList.contains('seleccionado')) { // Contains verifica si contiene la clase.
        elemento.classList.remove('seleccionado');

        const id = parseInt(elemento.dataset.idServicio);

        eliminarServicio(id);
    } else {
        elemento.classList.add('seleccionado');

        const servicioObj = {
            id: parseInt(elemento.dataset.idServicio),
            nombre: elemento.firstElementChild.textContent,
            precio: elemento.firstElementChild.nextElementSibling.textContent
        }
        
        agregarServicio(servicioObj);
    }
}

function eliminarServicio(id) {
    const {servicios} = cita;
    cita.servicios = servicios.filter(servicio => servicio.id !== id);

    // console.log(cita);
}

function agregarServicio(servicioObj) {
    const {servicios} = cita;
    cita.servicios = [...servicios, servicioObj];

    // console.log(cita);
}

function paginaSiguiente() {
    const pagSig = document.querySelector('#siguiente')
    pagSig.addEventListener('click', () => {
        pagina++;
        // console.log(pagina);

        botonesPaginador();
    });
}

function paginaAnterior() {
    const pagAnt = document.querySelector('#anterior');
    pagAnt.addEventListener('click', () => {
        pagina--;
        // console.log(pagina);

        botonesPaginador();
    });
}

function botonesPaginador() {
    const pagSig = document.querySelector('#siguiente');
    const pagAnt = document.querySelector('#anterior');

    if(pagina === 1) {
        pagAnt.classList.add('ocultar');
        pagSig.classList.remove('ocultar');
    } else if(pagina === 3) {
        pagSig.classList.add('ocultar');
        pagAnt.classList.remove('ocultar');

        mostrarResumen(); // carga el resumen de la cita de nuevo
    } else {
        pagAnt.classList.remove('ocultar');
        pagSig.classList.remove('ocultar');
    }

    mostrarSeccion(); // Cambia la sección por la de la página
}

function mostrarResumen() {
    // Destructuring
    const {nombre, fecha, hora, servicios} = cita;


    // Seleccionar el Resumen
    const resumenDiv = document.querySelector('.contenido-resumen');

    // Limpia el HTML previo  // Mejor optimizado
    while(resumenDiv.firstChild) {
        resumenDiv.removeChild(resumenDiv.firstChild);
    }

    // Validación
    if(Object.values(cita).includes('')) {
        const noServicios = document.createElement('P');
        noServicios.textContent = 'Faltan datos de Servicios, hora, fecha o nombre';
        noServicios.classList.add('invalidar-cita');

        // Agregar a resumenDiv
        resumenDiv.appendChild(noServicios);

        return;   
    }

    const headingCita = document.createElement('H3');
    headingCita.textContent = 'Resumen del Turno';

    // Mostrar el resumen
    const nombreCita = document.createElement('P');
    nombreCita.innerHTML = `<span>Nombre:</span> ${nombre}`;

    const fechaCita = document.createElement('P');
    fechaCita.innerHTML = `<span>Fecha:</span> ${fecha}`;
    
    const horaCita = document.createElement('P');
    horaCita.innerHTML = `<span>Hora:</span> ${hora}`;

    const serviciosCita = document.createElement('DIV');
    serviciosCita.classList.add('resumen-servicios');

    const headingServicios = document.createElement('H3');
    headingServicios.textContent = 'Resumen de Servicios';

    serviciosCita.appendChild(headingServicios);

    let cantidad = 0;

    // Iterar sobre el arreglo de Servicios
    servicios.forEach(servicio => {
        const contServicio = document.createElement('DIV');
        contServicio.classList.add('contenedor-servicio');

        const {nombre, precio} = servicio;

        const textoServicio = document.createElement('P');
        textoServicio.textContent = nombre;

        const precioServicio = document.createElement('P');
        precioServicio.textContent = precio;
        precioServicio.classList.add('precio');

        const totalServicio = precio.split('$');
        cantidad += parseInt(totalServicio[1].trim());

        // Colocar texto y precio en el DIV
        contServicio.appendChild(textoServicio);
        contServicio.appendChild(precioServicio);

        serviciosCita.appendChild(contServicio);
    });

    resumenDiv.appendChild(headingCita);
    resumenDiv.appendChild(nombreCita);
    resumenDiv.appendChild(fechaCita);
    resumenDiv.appendChild(horaCita);

    resumenDiv.appendChild(serviciosCita);

    const cantPagar = document.createElement('P');
    cantPagar.classList.add('total');
    cantPagar.innerHTML = `<span>Total a Pagar: </span> $${cantidad}`;

    resumenDiv.appendChild(cantPagar);
}

function nombreCita() {
    const nombreInput = document.querySelector('#nombre');
    nombreInput.addEventListener('input', evt => {
        const nombreTxt = evt.target.value.trim();

        // Validación de que nombreTxt debe tener algo
        if(nombreTxt === '' || nombreTxt.length < 3) {
            mostrarAlerta('Nombre no válido', 'error');
            // console.log('no valido');
            const alr = document.querySelector('#nombre');
            alr.classList.add('alr');
        } else {
            const alerta = document.querySelector('.alerta');
            const alrt = document.querySelector('.alr');
            if(alrt) {
                alrt.classList.remove('alr');
            }
            if(alerta) {
                alerta.remove();
            }
            cita.nombre = nombreTxt;
            // console.log('valido');
            // console.log(cita);
        }
    })
}

function mostrarAlerta(mensaje, tipo) {

    // Si hay una alerta previa entonces no crear otra
    const alertaPrevia = document.querySelector('.alerta');
    if(alertaPrevia) {
        return;
    }

    const alerta = document.createElement('DIV');
    alerta.textContent = mensaje;
    alerta.classList.add('alerta');

    if(tipo == 'error') {
        alerta.classList.add('error');
    }

    // Insertar en el HTML
    const formulario = document.querySelector('.formulario');
    formulario.appendChild(alerta);

    // Eliminar la alerta despues de 3 segundos
    setTimeout(() => {
        alerta.remove();
    }, 3000);

}

function fechaCita() {
    const fechaInput = document.querySelector('#fecha');
    fechaInput.addEventListener('input', evt => {
        const dia = new Date(evt.target.value).getUTCDay(); // Devuelve un numero entre 0 y 6, 0 es Domingo.

        if([0, 6].includes(dia)) {
            evt.preventDefault();
            fechaInput.value = '';
            mostrarAlerta('Fines de semana no permitidos', 'error');
        } else {
            cita.fecha = fechaInput.value;

            // console.log(cita);
        }
    })
}

function deshabilitarFechas() {
    const inputFecha = document.querySelector('#fecha');

    const fechaActual = new Date();
    const year = fechaActual.getFullYear();
    const _month = fechaActual.getMonth() + 1;
    const _day = fechaActual.getDate() + 1;
    let month;
    let day;

    if(_month < 10) {
        month = `0${_month}`; 
    } else {
        month = _month.toString();
    }
    if(_day < 10) {
        day = `0${day}`;
    } else {
        day = _day.toString();
    }

    let fechaDeshabilitar = `${year}-${month}-${day}`;

    inputFecha.min = fechaDeshabilitar;
}

function horaCita() {
    const inputHora = document.querySelector('#hora');
    inputHora.addEventListener('input', evt => {
        const horaCita = evt.target.value;
        const hora = horaCita.split(':');

        if(hora[0] < 10 || hora[0] > 20) {
            mostrarAlerta('Hora no válida', 'error');
            setTimeout(() => {
                inputHora.value = '';
            }, 1000);
            inputHora.classList.add('alr');
        } else {
            cita.hora = horaCita;
            inputHora.classList.remove('alr');
        }
    })
}
