/* ═══════════════════════════════════════════════
   ORÁCULO CIENTÍFICO — JavaScript
   Pegá esto ANTES del cierre </body>
═══════════════════════════════════════════════ */

(function() {
  'use strict';

  let DATOS = null;

  // Carga el JSON de datos
  fetch('juegos-data.json')
    .then(r => r.json())
    .then(d => { DATOS = d; })
    .catch(() => console.warn('No se pudo cargar juegos-data.json'));

  const panel       = document.getElementById('juego-panel');
  const panelConten = document.getElementById('juego-panel-contenido');
  const btnCerrar   = document.getElementById('juego-cerrar');

  // Click en cards
  document.querySelectorAll('.juego-card').forEach(card => {
    card.addEventListener('click', () => {
      const juego = card.dataset.juego;
      abrirJuego(juego);
    });
  });

  // Botones "Jugar"
  document.querySelectorAll('.juego-btn').forEach(btn => {
    btn.addEventListener('click', e => {
      e.stopPropagation();
      const juego = btn.closest('.juego-card').dataset.juego;
      abrirJuego(juego);
    });
  });

  // Cerrar panel
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
    switch (nombre) {
      case 'adibonanza':    renderAdibonanza();    break;
      case 'veoveo':        renderVeoVeo();        break;
      case 'teoriacuerdas': renderTeoriaCuerdas(); break;
      case 'sopa':          renderSopa();          break;
      case 'calculin':      renderCalculin();      break;
    }
  }

  /* ─── ADIBONANZA ─── */
  function renderAdibonanza() {
    const items = DATOS.adibonanza;
    const item  = items[Math.floor(Math.random() * items.length)];
    let pistaActual = 0;

    const html = `
      <p class="panel-titulo">Adibonanza</p>
      <div id="adi-pistas"></div>
      <button class="panel-pista-btn" id="adi-mas">Otra pista →</button>
      <input class="panel-input" id="adi-input" type="text" placeholder="Tu respuesta...">
      <div class="panel-respuesta-ok" id="adi-ok"></div>
      <div class="panel-deriva">¿Esta palabra está en el libro? <a href="#libro">Descubrilo.</a></div>
    `;
    abrirPanel(html);

    const pistasEl = document.getElementById('adi-pistas');
    const masBtn   = document.getElementById('adi-mas');
    const inputEl  = document.getElementById('adi-input');
    const okEl     = document.getElementById('adi-ok');

    function mostrarPista() {
      if (pistaActual >= item.pistas.length) {
        masBtn.style.display = 'none';
        return;
      }
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

    inputEl.addEventListener('input', () => {
      const val = inputEl.value.trim().toLowerCase()
        .normalize('NFD').replace(/[\u0300-\u036f]/g,'');
      const resp = item.respuesta.toLowerCase()
        .normalize('NFD').replace(/[\u0300-\u036f]/g,'');
      if (val === resp) {
        okEl.textContent = '✓ ' + item.respuesta.toUpperCase();
        okEl.classList.add('visible');
        inputEl.disabled = true;
      }
    });
  }

  /* ─── VEO VEO ─── */
  function renderVeoVeo() {
    const items = DATOS.veoveo;
    const item  = items[Math.floor(Math.random() * items.length)];

    const html = `
      <p class="panel-titulo">Veo Veo</p>
      <div class="panel-pista visible" style="font-size:1.4rem;letter-spacing:0.18em;">${item.acertijo}</div>
      <input class="panel-input" id="veo-input" type="text" placeholder="Tu respuesta...">
      <div class="panel-respuesta-ok" id="veo-ok"></div>
      <div class="panel-deriva">Este título existe en el libro. <a href="#libro">Ir al libro.</a></div>
    `;
    abrirPanel(html);

    const inputEl = document.getElementById('veo-input');
    const okEl    = document.getElementById('veo-ok');

    inputEl.addEventListener('input', () => {
      const val  = inputEl.value.trim().toLowerCase()
        .normalize('NFD').replace(/[\u0300-\u036f]/g,'');
      const resp = item.respuesta.toLowerCase()
        .normalize('NFD').replace(/[\u0300-\u036f]/g,'');
      if (val === resp) {
        okEl.textContent = '✓ ' + item.respuesta.toUpperCase();
        okEl.classList.add('visible');
        inputEl.disabled = true;
      }
    });
  }

  /* ─── TEORÍA DE CUERDAS FLOJAS ─── */
  function renderTeoriaCuerdas() {
    const items   = DATOS.teoriacuerdas;
    const item    = items[Math.floor(Math.random() * items.length)];
    const opciones = generarOpciones(item.cuenta, 4, 1, 50);

    const botonesHtml = opciones.map(n =>
      `<button class="calculin-chip" data-val="${n}">${n}</button>`
    ).join('');

    const html = `
      <p class="panel-titulo">Teoría de cuerdas flojas</p>
      <p style="font-family:'DM Sans',sans-serif;font-size:0.88rem;color:var(--fog);margin-bottom:1.5rem;">
        ¿Cuánto da esta cuenta? Elegí el resultado correcto.
      </p>
      <div class="panel-pista visible" style="font-size:1.6rem;letter-spacing:0.1em;font-family:'Cormorant Garamond',serif;">
        ${generarCuentaPara(item.cuenta)}
      </div>
      <div class="calculin-wrap" style="margin-top:1.5rem;">${botonesHtml}</div>
      <div class="resultado-hoja" id="cuerdas-result">
        <div class="resultado-hoja-numero">${item.hoja}</div>
        <div class="resultado-hoja-titulo">${item.titulo}</div>
        <div class="resultado-hoja-indice">Esa es tu hoja en el libro.</div>
      </div>
      <div class="panel-deriva" style="opacity:0;transition:opacity 0.5s;" id="cuerdas-deriva">
        Tu hoja te espera. <a href="#libro">Conocé el libro.</a>
      </div>
    `;
    abrirPanel(html);

    document.querySelectorAll('.calculin-chip').forEach(btn => {
      btn.addEventListener('click', () => {
        const val = parseInt(btn.dataset.val);
        if (val === item.cuenta) {
          document.getElementById('cuerdas-result').classList.add('visible');
          document.getElementById('cuerdas-deriva').style.opacity = '1';
        } else {
          btn.style.opacity = '0.3';
          btn.disabled = true;
        }
      });
    });
  }

  function generarCuentaPara(resultado) {
    const a = Math.floor(Math.random() * (resultado - 1)) + 1;
    const b = resultado - a;
    return `${a} + ${b}`;
  }

  function generarOpciones(correcto, cantidad, min, max) {
    const set = new Set([correcto]);
    while (set.size < cantidad) {
      const rand = Math.floor(Math.random() * (max - min)) + min;
      if (rand !== correcto) set.add(rand);
    }
    return [...set].sort(() => Math.random() - 0.5);
  }

  /* ─── SOPA CONSCIENTE ─── */
  function renderSopa() {
    const { palabras, tamaño: N } = DATOS.sopa;
    const grilla = generarSopa(palabras, N);
    const encontradas = new Set();

    let seleccion = [];
    let mouseDown = false;

    const celdasHtml = grilla.map((fila, r) =>
      fila.map((letra, c) =>
        `<div class="sopa-celda" data-r="${r}" data-c="${c}">${letra}</div>`
      ).join('')
    ).join('');

    const palabrasHtml = palabras.map(p =>
      `<span class="sopa-palabra-item" data-palabra="${p.toLowerCase()}">${p}</span>`
    ).join('');

    const html = `
      <p class="panel-titulo">Sopa consciente</p>
      <div class="sopa-grid" id="sopa-grid"
        style="grid-template-columns:repeat(${N},32px);grid-template-rows:repeat(${N},32px);">
        ${celdasHtml}
      </div>
      <div class="sopa-palabras-lista">${palabrasHtml}</div>
      <div class="panel-deriva" style="margin-top:1.5rem;">
        Estas palabras viven en el libro. <a href="#libro">Ir al libro.</a>
      </div>
    `;
    abrirPanel(html);

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
      verificarSopa(seleccion, palabras, encontradas);
      seleccion.forEach(c => c.classList.remove('seleccionada'));
      seleccion = [];
    });
  }

  function verificarSopa(celdas, palabras, encontradas) {
    const texto = celdas.map(c => c.textContent).join('').toLowerCase();
    const textoRev = texto.split('').reverse().join('');
    palabras.forEach(p => {
      const pal = p.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'');
      const t2  = texto.normalize('NFD').replace(/[\u0300-\u036f]/g,'');
      const t2r = textoRev.normalize('NFD').replace(/[\u0300-\u036f]/g,'');
      if ((t2 === pal || t2r === pal) && !encontradas.has(pal)) {
        encontradas.add(pal);
        celdas.forEach(c => { c.classList.remove('seleccionada'); c.classList.add('encontrada'); });
        const item = document.querySelector(`.sopa-palabra-item[data-palabra="${p.toLowerCase()}"]`);
        if (item) item.classList.add('encontrada');
      }
    });
  }

  function generarSopa(palabras, N) {
    const grid = Array.from({length:N}, () => Array(N).fill(''));
    const dirs = [[0,1],[1,0],[1,1],[0,-1],[-1,0],[-1,-1],[1,-1],[-1,1]];
    const letras = 'abcdefghijklmnopqrstuvwxyz';

    palabras.forEach(p => {
      const pal = p.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'');
      let colocada = false;
      let intentos = 0;
      while (!colocada && intentos < 200) {
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

    // Relleno con letras random
    for (let r = 0; r < N; r++)
      for (let c = 0; c < N; c++)
        if (grid[r][c] === '') grid[r][c] = letras[Math.floor(Math.random() * letras.length)];

    return grid;
  }

  /* ─── CALCULÍN ─── */
  function renderCalculin() {
    const { numeros, hojas } = DATOS.calculin;
    let num1 = null, op = null, num2 = null;

    const numsHtml = numeros.map(n =>
      `<button class="calculin-chip" data-val="${n}">${n}</button>`
    ).join('');
    const opsHtml = ['+','−','×','÷'].map(o =>
      `<button class="calculin-operador" data-op="${o}">${o}</button>`
    ).join('');

    const html = `
      <p class="panel-titulo">Calculín</p>
      <p style="font-family:'DM Sans',sans-serif;font-size:0.88rem;color:var(--fog);margin-bottom:1.5rem;">
        Elegí dos números y un operador. El resultado es tu hoja.
      </p>
      <div class="calculin-wrap">
        <span style="font-family:'DM Sans',sans-serif;font-size:0.75rem;color:var(--fog);letter-spacing:0.1em;">NÚMEROS</span>
        ${numsHtml}
      </div>
      <div class="calculin-wrap" style="margin-top:0.5rem;">
        <span style="font-family:'DM Sans',sans-serif;font-size:0.75rem;color:var(--fog);letter-spacing:0.1em;">OPERADORES</span>
        ${opsHtml}
      </div>
      <div style="margin-top:1.5rem;display:flex;align-items:center;gap:1rem;flex-wrap:wrap;">
        <div class="calculin-display" id="calc-display">?</div>
        <button class="calculin-igual" id="calc-igual">= resultado</button>
        <button class="panel-pista-btn" id="calc-reset">Borrar</button>
      </div>
      <div class="resultado-hoja" id="calc-result"></div>
      <div class="panel-deriva">El azar también es un método. <a href="#libro">Ir al libro.</a></div>
    `;
    abrirPanel(html);

    const display  = document.getElementById('calc-display');
    const btnIgual = document.getElementById('calc-igual');
    const btnReset = document.getElementById('calc-reset');

    function actualizarDisplay() {
      const p1 = num1 !== null ? num1 : '?';
      const p2 = num2 !== null ? num2 : '?';
      const o  = op  !== null ? op  : '·';
      display.textContent = `${p1} ${o} ${p2}`;
    }

    document.querySelectorAll('.calculin-chip').forEach(btn => {
      btn.addEventListener('click', () => {
        const val = parseInt(btn.dataset.val);
        document.querySelectorAll('.calculin-chip').forEach(b => b.classList.remove('activo'));
        btn.classList.add('activo');
        if (num1 === null || (num1 !== null && op !== null)) {
          if (op !== null) { num2 = val; } else { num1 = val; }
        } else {
          num1 = val;
        }
        actualizarDisplay();
      });
    });

    document.querySelectorAll('.calculin-operador').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.calculin-operador').forEach(b => b.classList.remove('activo'));
        btn.classList.add('activo');
        op = btn.dataset.op;
        actualizarDisplay();
      });
    });

    btnReset.addEventListener('click', () => {
      num1 = null; op = null; num2 = null;
      document.querySelectorAll('.calculin-chip, .calculin-operador').forEach(b => b.classList.remove('activo'));
      actualizarDisplay();
      document.getElementById('calc-result').classList.remove('visible');
      document.getElementById('calc-result').innerHTML = '';
    });

    btnIgual.addEventListener('click', () => {
      if (num1 === null || op === null || num2 === null) return;
      let resultado;
      switch(op) {
        case '+': resultado = num1 + num2; break;
        case '−': resultado = num1 - num2; break;
        case '×': resultado = num1 * num2; break;
        case '÷': resultado = num2 !== 0 ? Math.round(num1 / num2) : null; break;
      }
      if (resultado === null || resultado <= 0) {
        document.getElementById('calc-result').innerHTML = `
          <div class="resultado-hoja-titulo">Ese resultado no existe en el libro.</div>
          <div class="resultado-hoja-indice">Intentá otra combinación.</div>`;
        document.getElementById('calc-result').classList.add('visible');
        return;
      }
      const hoja = hojas.find(h => h.numero === resultado);
      const resEl = document.getElementById('calc-result');
      if (hoja) {
        resEl.innerHTML = `
          <div class="resultado-hoja-numero">${hoja.numero}</div>
          <div class="resultado-hoja-titulo">${hoja.titulo}</div>
          <div class="resultado-hoja-indice">Esa es tu hoja en el libro.</div>`;
      } else {
        resEl.innerHTML = `
          <div class="resultado-hoja-numero">${resultado}</div>
          <div class="resultado-hoja-titulo">Hoja ${resultado}</div>
          <div class="resultado-hoja-indice">Buscá esa página en el libro.</div>`;
      }
      resEl.classList.add('visible');
    });
  }

})();
