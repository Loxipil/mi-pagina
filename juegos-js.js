/* ═══════════════════════════════════════════════
   ORÁCULO CIENTÍFICO — JavaScript
   Pegá esto ANTES del cierre </body>
═══════════════════════════════════════════════ */

(function () {
  'use strict';

  let DATOS = null;

  fetch('juegos-data.json')
    .then(r => r.json())
    .then(d => { DATOS = d; })
    .catch(() => console.warn('No se pudo cargar juegos-data.json'));

  const panel       = document.getElementById('juego-panel');
  const panelConten = document.getElementById('juego-panel-contenido');
  const btnCerrar   = document.getElementById('juego-cerrar');

  document.querySelectorAll('.juego-card').forEach(card => {
    card.addEventListener('click', () => abrirJuego(card.dataset.juego));
  });

  document.querySelectorAll('.juego-btn').forEach(btn => {
    btn.addEventListener('click', e => {
      e.stopPropagation();
      abrirJuego(btn.closest('.juego-card').dataset.juego);
    });
  });

  btnCerrar.addEventListener('click', cerrarPanel);

  function cerrarPanel() {
    panel.hidden = true;
    panelConten.innerHTML = '';
    limpiarMascotas();
  }

  function abrirPanel(html) {
    panelConten.innerHTML = html;
    panel.hidden = false;
    panel.scrollIntoView({ behavior: 'smooth', block: 'start' });
    iniciarTimerPayasita();
  }

  function abrirJuego(nombre) {
    if (!DATOS) { alert('Cargando datos, intentá de nuevo en un momento.'); return; }
    trackJuego(nombre);
    switch (nombre) {
      case 'adibonanza':    renderAdibonanza();    break;
      case 'veoveo':        renderVeoVeo();        break;
      case 'teoriacuerdas': renderTeoriaCuerdas(); break;
      case 'sopa':          renderSopa();          break;
      case 'calculin':      renderCalculin();      break;
    }
  }

  /* ── TRACKING SIMPLE ── */
  function trackJuego(nombre) {
    try {
      const key = 'juegos_stats';
      const stats = JSON.parse(localStorage.getItem(key) || '{}');
      stats[nombre] = (stats[nombre] || 0) + 1;
      localStorage.setItem(key, JSON.stringify(stats));
    } catch(e) {}
  }

  /* ── HELPERS ── */
  function normalizar(s) {
    return s.trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  }

  function errorAleatorio() {
    const e = DATOS.errores;
    return e[Math.floor(Math.random() * e.length)];
  }

  function tituloPorPagina(num) {
    const hoja = DATOS.calculin.hojas.find(h => h.numero === num);
    return hoja || null;
  }

  function personitaHTML() {
    const acciones = ['bailando', 'pintando', 'escribiendo', 'musica', 'cortando'];
    const accion = acciones[Math.floor(Math.random() * acciones.length)];
    return `<div class="personita-wrap"><div class="personita ${accion}" aria-hidden="true">
      <div class="p-cabeza"></div><div class="p-cuerpo"></div>
      <div class="p-brazo i"></div><div class="p-brazo d"></div>
      <div class="p-pierna i"></div><div class="p-pierna d"></div>
    </div></div>`;
  }

  function resultadoHojaHTML(numero, titulo) {
    return `
      <div class="resultado-hoja visible">
        <div class="resultado-hoja-numero">${numero}</div>
        <div class="resultado-hoja-titulo">${titulo}</div>
        <div class="resultado-hoja-indice">Esa es tu hoja en el libro.</div>
      </div>
      ${personitaHTML()}
    `;
  }

  /* ════════════════════════════════════════
     MASCOTAS
  ════════════════════════════════════════ */

  /* -- TIMER PAYASITA QUE SE ASOMA (2.png) -- */
  let timerPayasita = null;

  const FRASES_PAYASITA2 = [
    'Hay alguien ahí?', 'Que onda?', 'Todo bien?', 'Que tul?',
    'Que pasaindú?', 'Que talqui?', 'Te fuiste?', 'Dale gas',
    'Vamoarriba', 'Mandale play', 'Matecito?'
  ];

  function iniciarTimerPayasita() {
    limpiarTimerPayasita();
    timerPayasita = setTimeout(() => mostrarPayasita2(), 20000); // 20 segundos
  }

  function resetearTimerPayasita() {
    iniciarTimerPayasita();
  }

  function limpiarTimerPayasita() {
    if (timerPayasita) { clearTimeout(timerPayasita); timerPayasita = null; }
    const vieja = document.getElementById('mascota-payasita2');
    if (vieja) vieja.remove();
  }

  function mostrarPayasita2() {
    const vieja = document.getElementById('mascota-payasita2');
    if (vieja) vieja.remove();
    const frase = FRASES_PAYASITA2[Math.floor(Math.random() * FRASES_PAYASITA2.length)];
    const el = document.createElement('div');
    el.id = 'mascota-payasita2';
    el.className = 'mascota-payasita2';
    el.innerHTML = `
      <div class="mascota-globo mascota-globo-payasita2">${frase}</div>
      <img src="imagenespaginalau/animacionesokcomp/2.webp" alt="payasita" class="mascota-img-payasita2">
    `;
    document.body.appendChild(el);
    setTimeout(() => el.classList.add('visible'), 50);
    setTimeout(() => {
      el.classList.remove('visible');
      setTimeout(() => el.remove(), 600);
      resetearTimerPayasita();
    }, 4000);
  }

  function limpiarMascotas() {
    limpiarTimerPayasita();
    ['mascota-payasita2', 'mascota-freud', 'mascota-payasita1', 'mascota-hombregato'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.remove();
    });
  }

  /* -- PAYASITA DE LA MANO (1.png) -- */
  const FRASES_PAYASITA1 = [
    'dale y againnnn', 'Pasame la repeee', 'No estuvo bien eso',
    'Otra vez!', 'Auch!', 'Probá de nuevo!', 'Next!', 'Ayyyy no no'
  ];

  function mostrarPayasita1() {
    resetearTimerPayasita();
    const vieja = document.getElementById('mascota-payasita1');
    if (vieja) vieja.remove();
    const frase = FRASES_PAYASITA1[Math.floor(Math.random() * FRASES_PAYASITA1.length)];
    const el = document.createElement('div');
    el.id = 'mascota-payasita1';
    el.className = 'mascota-payasita1';
    el.innerHTML = `
      <img src="imagenespaginalau/animacionesokcomp/1.webp" alt="payasita" class="mascota-img-payasita1">
      <div class="mascota-globo mascota-globo-payasita1">${frase}</div>
    `;
    document.body.appendChild(el);
    setTimeout(() => el.classList.add('visible'), 50);
    setTimeout(() => {
      el.classList.remove('visible');
      setTimeout(() => el.remove(), 600);
    }, 3500);
  }

  /* -- FREUD -- */
  const FREUD_ERRORES = [
    { img: '3.png', frases: ['Mira como te miro.', 'Yo no lo sé. Al parecer tú tampoco.', '¿Acaso has soñado con este acierto que falta?'] },
    { img: '4.png', frases: ['Anotaré en mi cuaderno: Resistencia', 'Tú no lo sabes. Tu inconsciente sí.'] },
    { img: '5.png', frases: ['Oh, es incorrecto. ¿Has pensado en tu padre?', 'Ah, con que ¿te resistes?'] },
    { img: '6.png', frases: ['Eso está muy mal ¿cómo te sientes al respecto?', 'Por aquí debe estar esta equivocación repetida'] },
    { img: '7.png', frases: ['Perfecto, tu madre.', 'Has perdido. ¿Cómo te sientes?', 'Este impulso por el desacierto ¿de dónde intuyes que viene?'] },
  ];

  const FREUD_ACIERTOS = {
    img: '8.png',
    frases: ['¡Hurra! ¿A que te recuerda?', '¡Felicidades! Gocemos', '¡Muy bien! ¿Cómo se siente la victoria?', 'Has ganado. Aunque la falta continúa.', 'Has acertado. ¿Te sientes satisfecho?']
  };

  // Mapa de qué clase de entrada usa cada imagen de Freud
  const FREUD_CLASE = {
    '3.png': 'freud-centro',
    '4.png': 'freud-centro',
    '5.png': 'freud-derecha',
    '6.png': 'freud-centro',
    '7.png': 'freud-centro',
    '8.png': 'freud-izquierda',
  };

  function mostrarFreudError() {
    resetearTimerPayasita();
    const viejo = document.getElementById('mascota-freud');
    if (viejo) viejo.remove();
    const grupo = FREUD_ERRORES[Math.floor(Math.random() * FREUD_ERRORES.length)];
    const frase = grupo.frases[Math.floor(Math.random() * grupo.frases.length)];
    const clase = FREUD_CLASE[grupo.img] || 'freud-centro';
    const el = document.createElement('div');
    el.id = 'mascota-freud';
    el.className = `mascota-freud ${clase}`;
    el.innerHTML = `
      <img src="imagenespaginalau/animacionesokcomp/${grupo.img.replace('.png','.webp')}" alt="Freud" class="mascota-img-freud">
      <div class="mascota-globo mascota-globo-freud">${frase}</div>
    `;
    document.body.appendChild(el);
    setTimeout(() => el.classList.add('visible'), 50);
    setTimeout(() => {
      el.classList.remove('visible');
      setTimeout(() => el.remove(), 600);
    }, 3500);
  }

  function mostrarFreudAcierto() {
    const viejo = document.getElementById('mascota-freud');
    if (viejo) viejo.remove();
    const frase = FREUD_ACIERTOS.frases[Math.floor(Math.random() * FREUD_ACIERTOS.frases.length)];
    const el = document.createElement('div');
    el.id = 'mascota-freud';
    el.className = 'mascota-freud freud-izquierda';
    el.innerHTML = `
      <img src="imagenespaginalau/animacionesokcomp/8.webp" alt="Freud" class="mascota-img-freud">
      <div class="mascota-globo mascota-globo-freud">${frase}</div>
    `;
    document.body.appendChild(el);
    setTimeout(() => el.classList.add('visible'), 50);
    setTimeout(() => {
      el.classList.remove('visible');
      setTimeout(() => el.remove(), 600);
    }, 4000);
  }

  /* -- HOMBRE GATO -- */
  const FRASES_HOMBREGATO = [
    'GENIAL!', 'ESPECTACULAR!', 'SABIA QUE LO HARIAS!',
    'EY! PERO QUE DESTREZA!', 'ESE CEREBRITO ESTA CARGADO!',
    'PERO ESTE SER ES UNA NAVE!', 'ESE ES MI TEAM!',
    'PERO CLARO QUERIDA!', 'AHORA SI!',
    'NOS VAMOS DE FIESTAAAAAAAAAA', 'AVISALE A POLAROIDDDDDDDDDDDD'
  ];

  function mostrarHombreGato() {
    const viejo = document.getElementById('mascota-hombregato');
    if (viejo) viejo.remove();
    const frase = FRASES_HOMBREGATO[Math.floor(Math.random() * FRASES_HOMBREGATO.length)];
    const el = document.createElement('div');
    el.id = 'mascota-hombregato';
    el.className = 'mascota-hombregato';
    el.innerHTML = `
      <div class="mascota-globo mascota-globo-gato">${frase}</div>
      <img src="imagenespaginalau/animacionesokcomp/hombregato.webp" alt="hombre gato" class="mascota-img-gato">
    `;
    document.body.appendChild(el);
    setTimeout(() => el.classList.add('visible'), 50);
    setTimeout(() => {
      el.classList.remove('visible');
      setTimeout(() => el.remove(), 600);
    }, 4000);
  }

  /* -- HADITA (sigue el cursor) -- */
  (function initHadita() {
    const hadita = document.createElement('div');
    hadita.id = 'hadita';
    hadita.innerHTML = `<img src="imagenespaginalau/animacionesokcomp/priscila.webp" alt="" class="hadita-img"><canvas id="hadita-canvas" class="hadita-canvas"></canvas>`;
    document.body.appendChild(hadita);

    let mx = window.innerWidth / 2, my = window.innerHeight / 2;
    let hx = mx, hy = my;
    const particulas = [];

    document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });

    const canvas = document.getElementById('hadita-canvas');
    const ctx = canvas.getContext('2d');

    function resizeCanvas() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    function crearParticula() {
      particulas.push({
        x: hx, y: hy,
        vx: (Math.random() - 0.5) * 2,
        vy: (Math.random() - 0.5) * 2 - 1,
        vida: 1,
        tam: Math.random() * 4 + 2,
        color: ['#f9d4e8','#d4b8f0','#b8e0f0','#f0e6b8'][Math.floor(Math.random()*4)]
      });
    }

    function animarHadita() {
      hx += (mx - hx) * 0.06;
      hy += (my - hy) * 0.06;
      hadita.style.transform = `translate(${hx - 40}px, ${hy - 40}px)`;

      if (Math.random() < 0.4) crearParticula();

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (let i = particulas.length - 1; i >= 0; i--) {
        const p = particulas[i];
        p.x += p.vx; p.y += p.vy; p.vida -= 0.025;
        if (p.vida <= 0) { particulas.splice(i, 1); continue; }
        ctx.save();
        ctx.globalAlpha = p.vida;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.tam * p.vida, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
      requestAnimationFrame(animarHadita);
    }
    animarHadita();
  })();

  /* ════════════════════════════════════════
     ADIBONANZA
  ════════════════════════════════════════ */
  function renderAdibonanza() {
    const items = DATOS.adibonanza;
    const item  = items[Math.floor(Math.random() * items.length)];
    let pistaActual = 0;

    abrirPanel(`
      <p class="panel-titulo">Adibonanza</p>
      <div id="adi-pistas"></div>
      <button class="panel-pista-btn" id="adi-mas">Otra pista →</button>
      <div class="panel-input-wrap">
        <input class="panel-input" id="adi-input" type="text" placeholder="Tu respuesta..." autocomplete="off">
        <button class="panel-enviar-btn" id="adi-enviar">Enviar →</button>
      </div>
      <div class="panel-respuesta-error" id="adi-error"></div>
      <div class="panel-respuesta-ok" id="adi-ok"></div>
      <div class="panel-deriva">¿Esta palabra está en el libro? <a href="#libro">Descubrilo.</a></div>
    `);

    const pistasEl = document.getElementById('adi-pistas');
    const masBtn   = document.getElementById('adi-mas');
    const inputEl  = document.getElementById('adi-input');
    const okEl     = document.getElementById('adi-ok');
    const errorEl  = document.getElementById('adi-error');

    function mostrarPista() {
      if (pistaActual >= item.pistas.length) { masBtn.style.display = 'none'; return; }
      const p = document.createElement('div');
      p.className = 'panel-pista';
      p.textContent = item.pistas[pistaActual];
      pistasEl.appendChild(p);
      setTimeout(() => p.classList.add('visible'), 50);
      pistaActual++;
      if (pistaActual >= item.pistas.length) masBtn.style.display = 'none';
    }

    mostrarPista();
    masBtn.addEventListener('click', mostrarPista);

    function verificar() {
      const val  = normalizar(inputEl.value);
      const resp = normalizar(item.respuesta);
      if (!val) return;
      if (val === resp) {
        okEl.textContent = '✓ ' + item.respuesta.toUpperCase();
        okEl.classList.add('visible');
        errorEl.classList.remove('visible');
        inputEl.disabled = true;
        mostrarFreudAcierto();
      } else {
        errorEl.textContent = errorAleatorio();
        errorEl.classList.add('visible');
        setTimeout(() => errorEl.classList.remove('visible'), 2000);
        // al azar: Freud o payasita1
        if (Math.random() < 0.5) mostrarFreudError();
        else mostrarPayasita1();
      }
    }

    inputEl.addEventListener('keyup', e => { if (e.key === 'Enter') verificar(); });
    inputEl.addEventListener('keydown', e => { if (e.key === 'Enter') { e.preventDefault(); verificar(); } });
    inputEl.addEventListener('input', () => {
      if (normalizar(inputEl.value) === normalizar(item.respuesta)) verificar();
    });
    document.getElementById('adi-enviar').addEventListener('click', verificar);
  }

  /* ════════════════════════════════════════
     VEO VEO
  ════════════════════════════════════════ */
  function renderVeoVeo() {
    if (!DATOS.veoveo || DATOS.veoveo.length === 0) {
      abrirPanel(`<p class="panel-titulo">Veo Veo</p>
        <p style="font-family:'DM Sans',sans-serif;color:var(--fog);font-size:0.9rem;">
          Este juego está en construcción. ¡Volvé pronto!
        </p>`);
      return;
    }
    const items = DATOS.veoveo;
    const item  = items[Math.floor(Math.random() * items.length)];

    abrirPanel(`
      <p class="panel-titulo">Veo Veo</p>
      <div class="veoveo-imagenes">${item.imagenes.map(img =>
        `<img src="${img}" alt="" class="veoveo-img">`
      ).join('<span class="veoveo-mas">+</span>')}</div>
      <div class="veoveo-pistas">${item.pista}</div>
      <div class="panel-input-wrap">
        <input class="panel-input" id="veo-input" type="text" placeholder="Tu respuesta..." autocomplete="off">
        <button class="panel-enviar-btn" id="veo-enviar">Enviar →</button>
      </div>
      <div class="panel-respuesta-error" id="veo-error"></div>
      <div class="panel-respuesta-ok" id="veo-ok"></div>
      <div class="panel-deriva">Este título existe en el libro. <a href="#libro">Ir al libro.</a></div>
    `);

    const inputEl = document.getElementById('veo-input');
    const okEl    = document.getElementById('veo-ok');
    const errorEl = document.getElementById('veo-error');

    function verificar() {
      const val  = normalizar(inputEl.value);
      const resp = normalizar(item.respuesta);
      if (!val) return;
      if (val === resp) {
        okEl.textContent = '✓ ' + item.respuesta.toUpperCase();
        okEl.classList.add('visible');
        errorEl.classList.remove('visible');
        inputEl.disabled = true;
      } else {
        errorEl.textContent = errorAleatorio();
        errorEl.classList.add('visible');
        setTimeout(() => errorEl.classList.remove('visible'), 2000);
      }
    }

    inputEl.addEventListener('keyup', e => { if (e.key === 'Enter') verificar(); });
    inputEl.addEventListener('keydown', e => { if (e.key === 'Enter') { e.preventDefault(); verificar(); } });
    inputEl.addEventListener('input', () => {
      if (normalizar(inputEl.value) === normalizar(item.respuesta)) verificar();
    });
    document.getElementById('veo-enviar').addEventListener('click', verificar);
  }

  /* ════════════════════════════════════════
     TEORÍA DE CUERDAS FLOJAS
  ════════════════════════════════════════ */
  function renderTeoriaCuerdas() {
    const items = DATOS.teoriacuerdas;
    const item  = items[Math.floor(Math.random() * items.length)];

    abrirPanel(`
      <p class="panel-titulo">Teoría de cuerdas flojas</p>
      <p class="panel-subtitulo">Despejá la X. La solución es tu página en el libro.</p>
      <div class="panel-pista visible cuerdas-ecuacion">${item.ecuacion}</div>
      <div class="cuerdas-input-wrap">
        <span class="cuerdas-x-label">X =</span>
        <input class="panel-input cuerdas-input" id="cuerdas-input" type="number" placeholder="?" min="31" max="373">
        <button class="calculin-igual" id="cuerdas-btn">Confirmar</button>
      </div>
      <div class="panel-respuesta-error" id="cuerdas-error"></div>
      <div id="cuerdas-result"></div>
      <div class="panel-deriva" id="cuerdas-deriva" style="opacity:0;transition:opacity 0.5s;">
        Tu hoja te espera. <a href="#libro">Conocé el libro.</a>
      </div>
    `);

    const inputEl  = document.getElementById('cuerdas-input');
    const btnConf  = document.getElementById('cuerdas-btn');
    const resultEl = document.getElementById('cuerdas-result');
    const errorEl  = document.getElementById('cuerdas-error');
    const derivaEl = document.getElementById('cuerdas-deriva');

    function verificar() {
      const val = parseInt(inputEl.value);
      if (isNaN(val)) return;
      if (val === item.solucion) {
        resultEl.innerHTML = resultadoHojaHTML(item.hoja, item.titulo);
        derivaEl.style.opacity = '1';
        errorEl.classList.remove('visible');
        inputEl.disabled = true;
        btnConf.disabled = true;
        mostrarFreudAcierto();
      } else {
        errorEl.textContent = errorAleatorio();
        errorEl.classList.add('visible');
        setTimeout(() => errorEl.classList.remove('visible'), 2000);
        mostrarFreudError();
      }
    }

    btnConf.addEventListener('click', verificar);
    inputEl.addEventListener('keyup', e => { if (e.key === 'Enter') verificar(); });
    inputEl.addEventListener('keydown', e => { if (e.key === 'Enter') { e.preventDefault(); verificar(); } });
  }

  /* ════════════════════════════════════════
     SOPA CONSCIENTE
  ════════════════════════════════════════ */
  function renderSopa() {
    const todasPalabras = DATOS.sopa.palabras;
    const porTirada     = DATOS.sopa.palabrasPorTirada || 5;
    const N             = DATOS.sopa.tamaño || 16;

    const shuffled = [...todasPalabras].sort(() => Math.random() - 0.5);
    const palabras  = shuffled.slice(0, porTirada);

    const grilla     = generarSopa(palabras, N);
    const encontradas = new Set();
    let seleccion = [];
    let mouseDown = false;

    const celdasHtml = grilla.map((fila, r) =>
      fila.map((letra, c) =>
        `<div class="sopa-celda" data-r="${r}" data-c="${c}">${letra}</div>`
      ).join('')
    ).join('');

    const palabrasHtml = palabras.map(p =>
      `<span class="sopa-palabra-item" data-palabra="${normalizar(p)}">${p}</span>`
    ).join('');

    abrirPanel(`
      <p class="panel-titulo">Sopa consciente</p>
      <div class="sopa-scroll-wrap">
        <div class="sopa-grid" id="sopa-grid"
          style="grid-template-columns:repeat(${N},34px);grid-template-rows:repeat(${N},34px);">
          ${celdasHtml}
        </div>
      </div>
      <div class="sopa-palabras-lista">${palabrasHtml}</div>
      <div id="sopa-completa"></div>
      <div class="panel-deriva" style="margin-top:1.5rem;">
        Estas palabras viven en el libro. <a href="#libro">Ir al libro.</a>
      </div>
    `);

    const grid = document.getElementById('sopa-grid');

    grid.addEventListener('mousedown', e => {
      if (!e.target.classList.contains('sopa-celda')) return;
      mouseDown = true;
      seleccion = [e.target];
      e.target.classList.add('seleccionada');
    });
    grid.addEventListener('mouseover', e => {
      if (!mouseDown || !e.target.classList.contains('sopa-celda')) return;
      if (!seleccion.includes(e.target)) {
        seleccion.push(e.target);
        e.target.classList.add('seleccionada');
      }
    });
    document.addEventListener('mouseup', () => {
      if (!mouseDown) return;
      mouseDown = false;
      verificarSopa(seleccion, palabras, encontradas, N);
      seleccion.forEach(c => c.classList.remove('seleccionada'));
      seleccion = [];
      chequearCompleta(palabras, encontradas);
    });

    grid.addEventListener('touchstart', e => {
      const cel = document.elementFromPoint(e.touches[0].clientX, e.touches[0].clientY);
      if (!cel || !cel.classList.contains('sopa-celda')) return;
      mouseDown = true;
      seleccion = [cel];
      cel.classList.add('seleccionada');
    }, { passive: true });
    grid.addEventListener('touchmove', e => {
      if (!mouseDown) return;
      const cel = document.elementFromPoint(e.touches[0].clientX, e.touches[0].clientY);
      if (!cel || !cel.classList.contains('sopa-celda')) return;
      if (!seleccion.includes(cel)) {
        seleccion.push(cel);
        cel.classList.add('seleccionada');
      }
    }, { passive: true });
    grid.addEventListener('touchend', () => {
      if (!mouseDown) return;
      mouseDown = false;
      verificarSopa(seleccion, palabras, encontradas, N);
      seleccion.forEach(c => c.classList.remove('seleccionada'));
      seleccion = [];
      chequearCompleta(palabras, encontradas);
    });
  }

  function chequearCompleta(palabras, encontradas) {
    const todas = palabras.every(p => encontradas.has(normalizar(p)));
    if (todas) {
      const el = document.getElementById('sopa-completa');
      if (el) {
        el.innerHTML = `<div class="panel-respuesta-ok visible" style="margin-top:1rem;">
          ✓ ¡Encontraste todas!</div>${personitaHTML()}`;
      }
      mostrarHombreGato();
      mostrarFreudAcierto();
    }
  }

  function verificarSopa(celdas, palabras, encontradas, N) {
    if (celdas.length < 2) return;

    const r0 = parseInt(celdas[0].dataset.r), c0 = parseInt(celdas[0].dataset.c);
    const r1 = parseInt(celdas[celdas.length-1].dataset.r), c1 = parseInt(celdas[celdas.length-1].dataset.c);
    const dr = Math.sign(r1 - r0), dc = Math.sign(c1 - c0);

    let enLinea = true;
    for (let i = 0; i < celdas.length; i++) {
      const r = parseInt(celdas[i].dataset.r), c = parseInt(celdas[i].dataset.c);
      if (r !== r0 + dr*i || c !== c0 + dc*i) { enLinea = false; break; }
    }
    if (!enLinea) return;

    const texto     = celdas.map(c => c.textContent).join('');
    const textoNorm = normalizar(texto);
    const textoRev  = textoNorm.split('').reverse().join('');

    palabras.forEach(p => {
      const pal = normalizar(p);
      if ((textoNorm === pal || textoRev === pal) && !encontradas.has(pal)) {
        encontradas.add(pal);
        celdas.forEach(c => { c.classList.remove('seleccionada'); c.classList.add('encontrada'); });
        const item = document.querySelector(`.sopa-palabra-item[data-palabra="${pal}"]`);
        if (item) item.classList.add('encontrada');
      }
    });
  }

  function generarSopa(palabras, N) {
    const grid = Array.from({ length: N }, () => Array(N).fill(''));
    const dirs = [[0,1],[1,0],[1,1],[0,-1],[-1,0],[-1,-1],[1,-1],[-1,1]];
    const letras = 'abcdefghijklmnopqrstuvwxyz';
    const ordenadas = [...palabras].sort((a, b) => b.length - a.length);

    ordenadas.forEach(p => {
      const pal = normalizar(p);
      let colocada = false, intentos = 0;
      while (!colocada && intentos < 300) {
        intentos++;
        const [dr, dc] = dirs[Math.floor(Math.random() * dirs.length)];
        const r = Math.floor(Math.random() * N);
        const c = Math.floor(Math.random() * N);
        const endR = r + dr * (pal.length - 1);
        const endC = c + dc * (pal.length - 1);
        if (endR < 0 || endR >= N || endC < 0 || endC >= N) continue;
        let ok = true;
        for (let i = 0; i < pal.length; i++) {
          const cr = r + dr*i, cc = c + dc*i;
          if (grid[cr][cc] !== '' && grid[cr][cc] !== pal[i]) { ok = false; break; }
        }
        if (ok) {
          for (let i = 0; i < pal.length; i++) grid[r + dr*i][c + dc*i] = pal[i];
          colocada = true;
        }
      }
    });

    for (let r = 0; r < N; r++)
      for (let c = 0; c < N; c++)
        if (grid[r][c] === '') grid[r][c] = letras[Math.floor(Math.random() * letras.length)];

    return grid;
  }

  /* ════════════════════════════════════════
     CALCULÍN
  ════════════════════════════════════════ */
  function renderCalculin() {
    const { digitos, operadores } = DATOS.calculin;

    const digitosHtml = digitos.map(n =>
      `<button class="calculin-chip" data-val="${n}">${n}</button>`
    ).join('');
    const opsHtml = operadores.map(o =>
      `<button class="calculin-operador" data-op="${o}">${o}</button>`
    ).join('');

    abrirPanel(`
      <p class="panel-titulo">Calculín</p>
      <p class="panel-subtitulo">Armá un número de dos cifras y operá. El resultado es tu página.</p>
      <div class="calculin-wrap">
        <span class="calculin-label">DÍGITOS</span>
        ${digitosHtml}
      </div>
      <div class="calculin-wrap" style="margin-top:0.5rem;">
        <span class="calculin-label">OPERADORES</span>
        ${opsHtml}
      </div>
      <div class="calculin-constructor" id="calc-constructor">
        <div class="calculin-display" id="calc-display">_ _</div>
        <button class="calculin-igual" id="calc-igual">= resultado</button>
        <button class="panel-pista-btn" id="calc-reset">Borrar</button>
      </div>
      <div id="calc-result"></div>
      <div class="panel-deriva">El azar también es un método. <a href="#libro">Ir al libro.</a></div>
    `);

    const display  = document.getElementById('calc-display');
    const btnIgual = document.getElementById('calc-igual');
    const btnReset = document.getElementById('calc-reset');

    let expresion = '';
    let digitosPulsados = 0;

    function actualizarDisplay() {
      display.textContent = expresion || '_ _';
    }

    document.querySelectorAll('.calculin-chip').forEach(btn => {
      btn.addEventListener('click', () => {
        expresion += btn.dataset.val;
        digitosPulsados++;
        actualizarDisplay();
      });
    });

    document.querySelectorAll('.calculin-operador').forEach(btn => {
      btn.addEventListener('click', () => {
        const op = btn.dataset.op;
        if (expresion === '' || expresion.slice(-1).match(/[+\-×÷]/)) return;
        expresion += ' ' + op + ' ';
        actualizarDisplay();
      });
    });

    btnReset.addEventListener('click', () => {
      expresion = '';
      digitosPulsados = 0;
      document.querySelectorAll('.calculin-chip, .calculin-operador').forEach(b => b.classList.remove('activo'));
      actualizarDisplay();
      document.getElementById('calc-result').innerHTML = '';
    });

    btnIgual.addEventListener('click', () => {
      if (!expresion) return;
      let resultado;
      try {
        const expr = expresion.replace(/×/g, '*').replace(/÷/g, '/');
        resultado = Math.round(eval(expr));
      } catch(e) {
        document.getElementById('calc-result').innerHTML =
          `<div class="panel-respuesta-error visible">Expresión inválida. Intentá de nuevo.</div>`;
        mostrarPayasita1();
        return;
      }

      const resEl = document.getElementById('calc-result');
      if (isNaN(resultado) || resultado < 31 || resultado > 373) {
        resEl.innerHTML = `<div class="resultado-hoja visible">
          <div class="resultado-hoja-titulo">Ese número está fuera del libro (pág. 31–373).</div>
          <div class="resultado-hoja-indice">Intentá otra combinación.</div></div>`;
        mostrarPayasita1();
        return;
      }

      const hoja = tituloPorPagina(resultado);
      if (hoja) {
        resEl.innerHTML = resultadoHojaHTML(hoja.numero, hoja.titulo);
      } else {
        resEl.innerHTML = resultadoHojaHTML(resultado, 'Hoja ' + resultado);
      }
      mostrarHombreGato();
    });
  }

})();
