let pagina=1;const cita={nombre:"",fecha:"",hora:"",servicios:[]};function iniciarApp(){mostrarServicios(),mostrarSeccion(),cambiarSeccion(),paginaSiguiente(),paginaAnterior(),botonesPaginador(),mostrarResumen(),nombreCita(),fechaCita(),deshabilitarFechas(),horaCita()}function mostrarSeccion(){const e=document.querySelector(".mostrar-seccion");e&&e.classList.remove("mostrar-seccion");document.querySelector("#paso-"+pagina).classList.add("mostrar-seccion");const t=document.querySelector(".tabs .actual");t&&t.classList.remove("actual");document.querySelector(`[data-paso="${pagina}"]`).classList.add("actual")}function cambiarSeccion(){document.querySelectorAll(".tabs button").forEach(e=>{e.addEventListener("click",e=>{e.preventDefault(),pagina=parseInt(e.target.dataset.paso),mostrarSeccion(),botonesPaginador()})})}async function mostrarServicios(){try{const e="http://localhost:3000/servicios.php",t=await fetch(e);(await t.json()).forEach(e=>{const{id:t,nombre:n,precio:a}=e,o=document.createElement("P");o.textContent=n,o.classList.add("nombre-servicio");const r=document.createElement("P");r.textContent="$"+a,r.classList.add("precio-servicio");const c=document.createElement("DIV");c.classList.add("servicio"),c.dataset.idServicio=t,c.onclick=seleccionarServicio,c.appendChild(o),c.appendChild(r),document.querySelector("#servicios").appendChild(c)})}catch(e){console.log(e)}}function seleccionarServicio(e){let t;if(t="P"===e.target.tagName?e.target.parentElement:e.target,t.classList.contains("seleccionado")){t.classList.remove("seleccionado");eliminarServicio(parseInt(t.dataset.idServicio))}else{t.classList.add("seleccionado");agregarServicio({id:parseInt(t.dataset.idServicio),nombre:t.firstElementChild.textContent,precio:t.firstElementChild.nextElementSibling.textContent})}}function eliminarServicio(e){const{servicios:t}=cita;cita.servicios=t.filter(t=>t.id!==e)}function agregarServicio(e){const{servicios:t}=cita;cita.servicios=[...t,e]}function paginaSiguiente(){document.querySelector("#siguiente").addEventListener("click",()=>{pagina++,botonesPaginador()})}function paginaAnterior(){document.querySelector("#anterior").addEventListener("click",()=>{pagina--,botonesPaginador()})}function botonesPaginador(){const e=document.querySelector("#siguiente"),t=document.querySelector("#anterior");1===pagina?(t.classList.add("ocultar"),e.classList.remove("ocultar")):3===pagina?(e.classList.add("ocultar"),t.classList.remove("ocultar"),mostrarResumen()):(t.classList.remove("ocultar"),e.classList.remove("ocultar")),mostrarSeccion()}function mostrarResumen(){const{nombre:e,fecha:t,hora:n,servicios:a}=cita,o=document.querySelector(".contenido-resumen");for(;o.firstChild;)o.removeChild(o.firstChild);if(Object.values(cita).includes("")){const e=document.createElement("P");return e.textContent="Faltan datos de Servicios, hora, fecha o nombre",e.classList.add("invalidar-cita"),void o.appendChild(e)}const r=document.createElement("H3");r.textContent="Resumen del Turno";const c=document.createElement("P");c.innerHTML="<span>Nombre:</span> "+e;const i=document.createElement("P");i.innerHTML="<span>Fecha:</span> "+t;const s=document.createElement("P");s.innerHTML="<span>Hora:</span> "+n;const l=document.createElement("DIV");l.classList.add("resumen-servicios");const d=document.createElement("H3");d.textContent="Resumen de Servicios",l.appendChild(d);let m=0;a.forEach(e=>{const t=document.createElement("DIV");t.classList.add("contenedor-servicio");const{nombre:n,precio:a}=e,o=document.createElement("P");o.textContent=n;const r=document.createElement("P");r.textContent=a,r.classList.add("precio");const c=a.split("$");m+=parseInt(c[1].trim()),t.appendChild(o),t.appendChild(r),l.appendChild(t)}),o.appendChild(r),o.appendChild(c),o.appendChild(i),o.appendChild(s),o.appendChild(l);const u=document.createElement("P");u.classList.add("total"),u.innerHTML="<span>Total a Pagar: </span> $"+m,o.appendChild(u)}function nombreCita(){document.querySelector("#nombre").addEventListener("input",e=>{const t=e.target.value.trim();if(""===t||t.length<3){mostrarAlerta("Nombre no válido","error");document.querySelector("#nombre").classList.add("alr")}else{const e=document.querySelector(".alerta"),n=document.querySelector(".alr");n&&n.classList.remove("alr"),e&&e.remove(),cita.nombre=t}})}function mostrarAlerta(e,t){if(document.querySelector(".alerta"))return;const n=document.createElement("DIV");n.textContent=e,n.classList.add("alerta"),"error"==t&&n.classList.add("error");document.querySelector(".formulario").appendChild(n),setTimeout(()=>{n.remove()},3e3)}function fechaCita(){const e=document.querySelector("#fecha");e.addEventListener("input",t=>{const n=new Date(t.target.value).getUTCDay();[0,6].includes(n)?(t.preventDefault(),e.value="",mostrarAlerta("Fines de semana no permitidos","error")):cita.fecha=e.value})}function deshabilitarFechas(){const e=document.querySelector("#fecha"),t=new Date,n=t.getFullYear(),a=t.getMonth()+1,o=t.getDate()+1;let r,c;r=a<10?"0"+a:a.toString(),c=o<10?"0"+c:o.toString();let i=`${n}-${r}-${c}`;e.min=i}function horaCita(){const e=document.querySelector("#hora");e.addEventListener("input",t=>{const n=t.target.value,a=n.split(":");a[0]<10||a[0]>20?(mostrarAlerta("Hora no válida","error"),setTimeout(()=>{e.value=""},1e3),e.classList.add("alr")):(cita.hora=n,e.classList.remove("alr"))})}document.addEventListener("DOMContentLoaded",(function(){iniciarApp()}));