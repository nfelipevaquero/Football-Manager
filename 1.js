// ==========================================
// 1. CARGAR HEADER Y FOOTER
// ==========================================
const cargarSeccion = (id, url) => {
    fetch(url)
        .then(res => res.text())
        .then(data => {
            const el = document.getElementById(id);
            if (el) el.innerHTML = data;
        })
        .catch(err => console.error("Error cargando " + url, err));
};

cargarSeccion('main-header', 'header.html');
cargarSeccion('main-footer', 'footer.html');

// ==========================================
// FUNCIÓN PARA NORMALIZAR ESCUDOS (SÓLO ESCUDOS)
// ==========================================
function rutaEscudoLimpia(nombre) {
    if (!nombre) return "";
    // Convierte "Atlético de Madrid" -> "ATLETICO DE MADRID"
    return nombre.toUpperCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, ""); 
}

// ==========================================
// 2. CARGAR EQUIPOS Y ENTRENADORES (consulta.html)
// ==========================================
const contenedorEquipos = document.getElementById('lista-equipos');
if (contenedorEquipos) {
    fetch('jugadors.json')
        .then(res => res.json())
        .then(equipos => {
            equipos.forEach(equipo => {
                const card = document.createElement('div');
                const claseEquipo = equipo.equip.toLowerCase().replace(/\s+/g, '-');
                card.className = `card-equipo has-gradient ${claseEquipo}`;
                
                let filasJugadores = equipo.jugadors.map(j => 
                    `<tr><td>${j.dorsal}</td><td>${j.nomPersona}</td><td>${j.posicio}</td><td class="calidad">${j.qualitat}</td></tr>`
                ).join('');

                // Regla 1: Escudos en MAYÚSCULAS y .PNG
                const srcEscudo = `./escudos/${rutaEscudoLimpia(equipo.equip)}.PNG`;
                
                // Regla 2: Entrenadores tal cual están en el JSON y .png
                const srcDT = `./entrenadores/${equipo.entrenador.nomPersona}.png`;

                card.innerHTML = `
                    <div class="info-principal">
                        <img class="escudo-equipo" src="${srcEscudo}" 
                             onerror="this.onerror=null; this.style.display='none';">
                        <h2 class="nombre-equipo">${equipo.equip}</h2>
                        <img class="foto-dt" src="${srcDT}" 
                             onerror="this.onerror=null; this.style.display='none';">
                        <p>DT: ${equipo.entrenador.nomPersona}</p>
                    </div>
                    <div class="tabla-oculta">
                        <table>
                            <thead><tr><th>#</th><th>Nombre</th><th>Pos.</th><th>Val.</th></tr></thead>
                            <tbody>${filasJugadores}</tbody>
                        </table>
                    </div>`;
                contenedorEquipos.appendChild(card);
            });
        });
}

// ==========================================
// 3. CARGAR RESULTADOS DE PARTIDOS (resultat.html)
// ==========================================
const contenedorPartido = document.getElementById('contenedor-partidos');
if (contenedorPartido) {
    fetch('FM_partits_masc.json')
        .then(res => res.json())
        .then(partidos => {
            contenedorPartido.innerHTML = '<h2 class="main-title">Marcadores de la Jornada</h2>';
            const tabla = document.createElement('div');
            tabla.className = 'tabla-resultados';

            partidos.forEach(p => {
                const fila = document.createElement('div');
                fila.className = 'fila-partido';
                const fObj = new Date(p.data);
                const fecha = fObj.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit' });
                const hora = fObj.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });

                const escLocal = `./escudos/${rutaEscudoLimpia(p.equip_local.nom)}.PNG`;
                const escVis = `./escudos/${rutaEscudoLimpia(p.equip_visitant.nom)}.PNG`;

                fila.innerHTML = `
                    <div class="col-info"><span class="fecha">${fecha}</span><span class="hora">${hora}</span></div>
                    <div class="col-equipo local">
                        <span>${p.equip_local.nom}</span>
                        <img src="${escLocal}" onerror="this.onerror=null; this.style.visibility='hidden';">
                    </div>
                    <div class="col-score">${p.resultat}</div>
                    <div class="col-equipo visitante">
                        <img src="${escVis}" onerror="this.onerror=null; this.style.visibility='hidden';">
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
        const lista = ["FC Barcelona", "Real Madrid CF", "Atletico de Madrid", "Sevilla FC", "Real Sociedad", "Real Betis", "Athletic Club", "Villarreal CF", "Valencia CF", "Girona FC", "RCD Espanyol", "Rayo Vallecano"];
        selectEquipo.innerHTML = '<option value="" disabled selected>Selecciona un equipo</option>';
        lista.forEach(e => {
            const opt = document.createElement('option');
            opt.value = e; opt.textContent = e;
            selectEquipo.appendChild(opt);
        });
    }
});