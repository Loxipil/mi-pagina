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
  }

  function abrirPanel(html) {
    panelConten.innerHTML = html;
    panel.hidden = false;
    panel.scrollIntoView({ behavior: 'smooth', block: 'start' });
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

  /* ── TRACKING SIMPLE (sin GA, solo localStorage) ── */
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
      } else {
        errorEl.textContent = errorAleatorio();
        errorEl.classList.add('visible');
        setTimeout(() => errorEl.classList.remove('visible'), 2000);
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

    // Elegir palabras al azar para esta tirada
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

    // Mouse
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

    // Touch
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
    }
  }

  function verificarSopa(celdas, palabras, encontradas, N) {
    if (celdas.length < 2) return;

    const r0 = parseInt(celdas[0].dataset.r), c0 = parseInt(celdas[0].dataset.c);
    const r1 = parseInt(celdas[celdas.length-1].dataset.r), c1 = parseInt(celdas[celdas.length-1].dataset.c);
    const dr = Math.sign(r1 - r0), dc = Math.sign(c1 - c0);

    // Verificar que todas las celdas están en línea recta
    let enLinea = true;
    for (let i = 0; i < celdas.length; i++) {
      const r = parseInt(celdas[i].dataset.r), c = parseInt(celdas[i].dataset.c);
      if (r !== r0 + dr*i || c !== c0 + dc*i) { enLinea = false; break; }
    }
    if (!enLinea) return;

    const texto    = celdas.map(c => c.textContent).join('');
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
    // 8 direcciones incluyendo diagonales
    const dirs = [[0,1],[1,0],[1,1],[0,-1],[-1,0],[-1,-1],[1,-1],[-1,1]];
    const letras = 'abcdefghijklmnopqrstuvwxyz';

    // Ordenar por longitud descendente para colocar las más largas primero
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

    // Estado: construimos una expresión libre
    let expresion = '';
    let digitosPulsados = 0; // para armar números de dos dígitos

    function actualizarDisplay() {
      display.textContent = expresion || '_ _';
    }

    document.querySelectorAll('.calculin-chip').forEach(btn => {
      btn.addEventListener('click', () => {
        const d = btn.dataset.val;
        expresion += d;
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
        // Reemplazar símbolos para eval
        const expr = expresion.replace(/×/g, '*').replace(/÷/g, '/');
        resultado = Math.round(eval(expr));
      } catch(e) {
        document.getElementById('calc-result').innerHTML =
          `<div class="panel-respuesta-error visible">Expresión inválida. Intentá de nuevo.</div>`;
        return;
      }

      const resEl = document.getElementById('calc-result');
      if (isNaN(resultado) || resultado < 31 || resultado > 373) {
        resEl.innerHTML = `<div class="resultado-hoja visible">
          <div class="resultado-hoja-titulo">Ese número está fuera del libro (pág. 31–373).</div>
          <div class="resultado-hoja-indice">Intentá otra combinación.</div></div>`;
        return;
      }

      const hoja = tituloPorPagina(resultado);
      if (hoja) {
        resEl.innerHTML = resultadoHojaHTML(hoja.numero, hoja.titulo);
      } else {
        resEl.innerHTML = resultadoHojaHTML(resultado, 'Hoja ' + resultado);
      }
    });
  }

})();
