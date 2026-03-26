// ==========================================
// 1. CARGAR HEADER Y FOOTER
// ==========================================
const cargar = (id, url) => {
    fetch(url).then(res => res.text()).then(html => {
        const el = document.getElementById(id);
        if (el) el.innerHTML = html;
    }).catch(err => console.error("Error cargando " + url, err));
};

cargar('main-header', 'header.html');
cargar('main-footer', 'footer.html');

// ==========================================
// 2. CARGAR EQUIPOS Y ENTRENADORES
// ==========================================
const contenedorEquipos = document.getElementById('lista-equipos');
if (contenedorEquipos) {
    fetch('jugadors.json').then(res => res.json()).then(equipos => {
        equipos.forEach(equipo => {
            const card = document.createElement('div');
            const claseEquipo = equipo.equip.toLowerCase().replace(/\s+/g, '-');
            card.className = `card-equipo has-gradient ${claseEquipo}`;
            
            let filas = equipo.jugadors.map(j => 
                `<tr><td>${j.dorsal}</td><td>${j.nomPersona}</td><td>${j.posicio}</td><td class="calidad">${j.qualitat}</td></tr>`
            ).join('');

            // PROBAMOS RUTA RELATIVA DIRECTA (Sin el punto inicial)
            const nombreArchivo = equipo.equip + ".png";
            const rutaEscudo = "escudos/" + nombreArchivo; 

            card.innerHTML = `
                <div class="info-principal">
                    <img class="escudo-equipo" src="${rutaEscudo}" onerror="this.onerror=null; this.style.display='none';">
                    <h2 class="nombre-equipo">${equipo.equip}</h2>
                    <img class="foto-dt" src="entrenadores/${equipo.entrenador.nomPersona}.png" onerror="this.onerror=null; this.style.display='none';">
                    <p>DT: ${equipo.entrenador.nomPersona}</p>
                </div>
                <div class="tabla-oculta">
                    <table>
                        <thead><tr><th>#</th><th>Nombre</th><th>Pos.</th><th>Val.</th></tr></thead>
                        <tbody>${filas}</tbody>
                    </table>
                </div>`;
            contenedorEquipos.appendChild(card);
        });
    });
}

// ==========================================
// 3. CARGAR RESULTADOS
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

            fila.innerHTML = `
                <div class="col-info"><span class="fecha">${fecha}</span><span class="hora">${hora}</span></div>
                <div class="col-equipo local">
                    <span>${p.equip_local.nom}</span>
                    <img src="escudos/${p.equip_local.nom}.png" onerror="this.onerror=null; this.style.visibility='hidden';">
                </div>
                <div class="col-score">${p.resultat}</div>
                <div class="col-equipo visitante">
                    <img src="escudos/${p.equip_visitant.nom}.png" onerror="this.onerror=null; this.style.visibility='hidden';">
                    <span>${p.equip_visitant.nom}</span>
                </div>
                <div class="col-status">FINALIZADO</div>`;
            tabla.appendChild(fila);
        });
        contenedorPartido.appendChild(tabla);
    });
}

// ==========================================
// 4. LÓGICA DEL FORMULARIO
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    const selectTipo = document.getElementById('tipo');
    const contenedorPosicion = document.getElementById('contenedor-posicion');
    if (selectTipo && contenedorPosicion) {
        selectTipo.addEventListener('change', function() {
            this.value === 'Jugador' ? contenedorPosicion.classList.remove('ocultar') : contenedorPosicion.classList.add('ocultar');
        });
    }

    const selectEquipo = document.getElementById('equipo');
    if (selectEquipo) {
        const equiposList = ["FC Barcelona", "Real Madrid CF", "Atletico de Madrid", "Sevilla FC", "Real Sociedad", "Real Betis", "Athletic Club", "Villarreal CF", "Valencia CF", "Girona FC", "RCD Espanyol", "Rayo Vallecano"];
        selectEquipo.innerHTML = '<option value="" disabled selected>Selecciona un equipo</option>';
        equiposList.forEach(e => {
            const opt = document.createElement('option');
            opt.value = e; opt.textContent = e;
            selectEquipo.appendChild(opt);
        });
    }
});