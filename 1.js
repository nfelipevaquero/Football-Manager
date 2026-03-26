// ==========================================
// 1. CARGAR HEADER Y FOOTER
// ==========================================
fetch('header.html').then(res => res.text()).then(data => { 
    const h = document.getElementById('main-header'); 
    if (h) h.innerHTML = data; 
}).catch(e => console.error('Error header:', e));

fetch('footer.html').then(res => res.text()).then(data => { 
    const f = document.getElementById('main-footer'); 
    if (f) f.innerHTML = data; 
}).catch(e => console.error('Error footer:', e));

// ==========================================
// 2. CARGAR EQUIPOS Y ENTRENADORES (consulta.html)
// ==========================================
const contenedorEquipos = document.getElementById('lista-equipos');
if (contenedorEquipos) {
    fetch('jugadors.json').then(res => res.json()).then(equipos => {
        equipos.forEach(equipo => {
            const card = document.createElement('div');
            const claseEquipo = equipo.equip.toLowerCase().replace(/\s+/g, '-');
            card.className = `card-equipo has-gradient ${claseEquipo}`;
            
            let filasJugadores = equipo.jugadors.map(j => 
                `<tr><td>${j.dorsal}</td><td>${j.nomPersona}</td><td>${j.posicio}</td><td class="calidad">${j.qualitat}</td></tr>`
            ).join('');

            // Aseguramos que la ruta sea relativa correcta para GitHub Pages
            const rutaEscudo = `escudos/${equipo.equip}.png`;
            const rutaDT = `entrenadores/${equipo.entrenador.nomPersona}.png`;

            card.innerHTML = `
                <div class="info-principal">
                    <img class="escudo-equipo" 
                         src="${rutaEscudo}" 
                         onerror="console.warn('Escudo no encontrado:', this.src); this.remove();">
                    <h2 class="nombre-equipo">${equipo.equip}</h2>
                    <img class="foto-dt" 
                         src="${rutaDT}" 
                         onerror="this.remove();">
                    <p>DT: ${equipo.entrenador.nomPersona}</p>
                </div>
                <div class="tabla-oculta">
                    <table>
                        <thead>
                            <tr><th>#</th><th>Nombre</th><th>Pos.</th><th>Val.</th></tr>
                        </thead>
                        <tbody>${filasJugadores}</tbody>
                    </table>
                </div>`;
            contenedorEquipos.appendChild(card);
        });
    }).catch(err => console.error("Error equipos:", err));
}

// ==========================================
// 3. CARGAR RESULTADOS DE PARTIDOS (resultat.html)
// ==========================================
const contenedorPartido = document.getElementById('contenedor-partidos');
if (contenedorPartido) {
    fetch('FM_partits_masc.json').then(res => res.json()).then(partidos => {
        contenedorPartido.innerHTML = '<h2 class="main-title">Marcadores de la Jornada</h2>';
        const tabla = document.createElement('div');
        tabla.className = 'tabla-resultados';

        partidos.forEach(p => {
            const fila = document.createElement('div');
            fila.className = 'fila-partido';
            const fObj = new Date(p.data);
            const fecha = fObj.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit' });
            const hora = fObj.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });

            const rutaLocal = `escudos/${p.equip_local.nom}.png`;
            const rutaVisitante = `escudos/${p.equip_visitant.nom}.png`;

            fila.innerHTML = `
                <div class="col-info">
                    <span class="fecha">${fecha}</span>
                    <span class="hora">${hora}</span>
                </div>
                <div class="col-equipo local">
                    <span>${p.equip_local.nom}</span>
                    <img src="${rutaLocal}" onerror="this.onerror=null; this.style.visibility='hidden';">
                </div>
                <div class="col-score">${p.resultat}</div>
                <div class="col-equipo visitante">
                    <img src="${rutaVisitante}" onerror="this.onerror=null; this.style.visibility='hidden';">
                    <span>${p.equip_visitant.nom}</span>
                </div>
                <div class="col-status">FINALIZADO</div>`;
            tabla.appendChild(fila);
        });
        contenedorPartido.appendChild(tabla);
    }).catch(err => console.error("Error partidos:", err));
}

// ==========================================
// 4. LÓGICA DEL FORMULARIO
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    const selectTipo = document.getElementById('tipo');
    const contenedorPosicion = document.getElementById('contenedor-posicion');
    if (selectTipo && contenedorPosicion) {
        selectTipo.addEventListener('change', function() {
            if (this.value === 'Jugador') {
                contenedorPosicion.classList.remove('ocultar');
            } else {
                contenedorPosicion.classList.add('ocultar');
            }
        });
    }

    const selectEquipo = document.getElementById('equipo');
    const equiposList = [
        "FC Barcelona", "Real Madrid CF", "Atletico de Madrid", 
        "Sevilla FC", "Real Sociedad", "Real Betis", 
        "Athletic Club", "Villarreal CF", "Valencia CF", 
        "Girona FC", "RCD Espanyol", "Rayo Vallecano"
    ];
    if (selectEquipo) {
        selectEquipo.innerHTML = '<option value="" disabled selected>Selecciona un equipo</option>';
        equiposList.forEach(e => {
            const opt = document.createElement('option');
            opt.value = e;
            opt.textContent = e;
            selectEquipo.appendChild(opt);
        });
    }

    const inputFoto = document.getElementById('foto');
    const previewContainer = document.getElementById('preview-container');
    const previewImg = document.getElementById('foto-preview');

    if (inputFoto && previewImg) {
        inputFoto.addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(event) {
                    previewImg.src = event.target.result;
                    if(previewContainer) previewContainer.classList.remove('ocultar');
                }
                reader.readAsDataURL(file);
            }
        });
    }
});