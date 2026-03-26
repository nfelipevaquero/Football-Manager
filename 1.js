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
// 2. CARGAR EQUIPOS Y ENTRENADORES
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

            // FORZAMOS MAYÚSCULAS Y QUITAMOS TILDES PARA LA URL
            const nombreLimpio = equipo.equip.toUpperCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
            const rutaEscudo = `./escudos/${nombreLimpio}.PNG`;

            card.innerHTML = `
                <div class="info-principal">
                    <img class="escudo-equipo" 
                         src="${rutaEscudo}" 
                         onerror="console.log('Fallo escudo: ' + this.src); this.onerror=null; this.style.display='none';">
                    <h2 class="nombre-equipo">${equipo.equip}</h2>
                    <img class="foto-dt" 
                         src="./entrenadores/${equipo.entrenador.nomPersona.toUpperCase()}.PNG" 
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

            const localMayus = p.equip_local.nom.toUpperCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
            const visMayus = p.equip_visitant.nom.toUpperCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

            fila.innerHTML = `
                <div class="col-info"><span class="fecha">${fecha}</span><span class="hora">${hora}</span></div>
                <div class="col-equipo local">
                    <span>${p.equip_local.nom}</span>
                    <img src="./escudos/${localMayus}.PNG" onerror="this.onerror=null; this.style.visibility='hidden';">
                </div>
                <div class="col-score">${p.resultat}</div>
                <div class="col-equipo visitante">
                    <img src="./escudos/${visMayus}.PNG" onerror="this.onerror=null; this.style.visibility='hidden';">
                    <span>${p.equip_visitant.nom}</span>
                </div>
                <div class="col-status">FINALIZADO</div>`;
            tabla.appendChild(fila);
        });
        contenedorPartido.appendChild(tabla);
    });
}