// Mecanismo das atividades interativas (atividades/*.html).
// Cada página define window.ATIVIDADE antes de carregar este arquivo e tem um <div id="atividade">.
//
// Tipos:
//   guiada: sequência de etapas com tempo (respiração, meditação, body scan).
//     { tipo: 'guiada', circulo?: true, ciclos?: { opcoes: [4, 6, 8], padrao: 4 },
//       etapas: [{ titulo, texto, segundos, fase?: 'inspirar' | 'segurar' | 'expirar' }] }
//     Com "ciclos", as etapas se repetem o número de vezes escolhido.
//   diario: campos para escrever, salvos só neste navegador (localStorage).
//     { tipo: 'diario', chave, campos: [{ id, rotulo, tipo: 'texto' | 'linha' | 'escala', placeholder?, dica? }],
//       timer?: { opcoes: [10, 15, 20], padrao: 20 } }
(() => {
  const cfg = window.ATIVIDADE;
  const raiz = document.getElementById('atividade');
  if (!cfg || !raiz) return;

  const esc = v => String(v ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const mmss = s => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(Math.floor(s % 60)).padStart(2, '0')}`;

  // Som suave ao trocar de etapa (Web Audio, sem arquivos).
  let audio = null;
  function sino() {
    try {
      audio = audio || new (window.AudioContext || window.webkitAudioContext)();
      const osc = audio.createOscillator();
      const vol = audio.createGain();
      osc.type = 'sine';
      osc.frequency.value = 528;
      vol.gain.setValueAtTime(0.0001, audio.currentTime);
      vol.gain.exponentialRampToValueAtTime(0.25, audio.currentTime + 0.05);
      vol.gain.exponentialRampToValueAtTime(0.0001, audio.currentTime + 1.6);
      osc.connect(vol).connect(audio.destination);
      osc.start();
      osc.stop(audio.currentTime + 1.7);
    } catch { /* sem áudio no navegador: segue em silêncio */ }
  }

  // Cronômetro que não acumula atraso (usa o relógio, não a contagem de intervalos).
  function cronometro(aoTique) {
    let inicio = 0, acumulado = 0, id = null;
    return {
      get rodando() { return id !== null; },
      iniciar() { if (id) return; inicio = performance.now(); id = setInterval(() => aoTique(this.segundos), 200); },
      pausar() { if (!id) return; acumulado += performance.now() - inicio; clearInterval(id); id = null; },
      zerar() { this.pausar(); acumulado = 0; },
      get segundos() { return (acumulado + (id ? performance.now() - inicio : 0)) / 1000; },
    };
  }

  // -------------------------------------------------------------------------
  // Atividade guiada

  function guiada() {
    const temCiclos = Boolean(cfg.ciclos);
    raiz.innerHTML = `
      <div class="guiada">
        ${cfg.circulo ? '<div class="circulo-area"><div class="circulo" data-circulo></div><span class="circulo-rotulo" data-rotulo>Pronto?</span></div>' : ''}
        <p class="etapa-contador" data-contador></p>
        <h2 class="etapa-titulo" data-titulo>${esc(cfg.etapas[0].titulo)}</h2>
        <p class="etapa-texto" data-texto>${esc(cfg.inicio || 'Encontre uma posição confortável e clique em Iniciar quando estiver pronta(o).')}</p>
        <p class="etapa-tempo" data-tempo>${mmss(0)}</p>
        <div class="barra" aria-hidden="true"><div data-barra></div></div>
        <div class="controles print:hidden">
          <button type="button" class="botao-principal" data-play>Iniciar</button>
          <button type="button" class="botao-secundario" data-zerar>Recomeçar</button>
        </div>
        <div class="opcoes print:hidden">
          ${temCiclos ? `<label>Ciclos: <select data-ciclos>${cfg.ciclos.opcoes.map(n => `<option value="${n}"${n === cfg.ciclos.padrao ? ' selected' : ''}>${n}</option>`).join('')}</select></label>` : ''}
          <label><input type="checkbox" data-som checked> Som ao trocar de etapa</label>
        </div>
        <p class="concluido" data-fim hidden></p>
      </div>`;

    const $ = s => raiz.querySelector(`[data-${s}]`);
    let ciclos = temCiclos ? cfg.ciclos.padrao : 1;
    let etapaAtual = -1;

    // Linha do tempo completa: etapas repetidas por ciclo.
    function sequencia() {
      const seq = [];
      for (let c = 0; c < ciclos; c++) cfg.etapas.forEach((e, i) => seq.push({ ...e, ciclo: c + 1, indice: i }));
      let t = 0;
      return seq.map(e => ({ ...e, inicio: (t += e.segundos) - e.segundos }));
    }
    let seq = sequencia();
    const total = () => seq.reduce((s, e) => s + e.segundos, 0);

    function mostrarEtapa(e) {
      $('titulo').textContent = e.titulo;
      $('texto').textContent = e.texto || '';
      $('contador').textContent = temCiclos
        ? `Ciclo ${e.ciclo} de ${ciclos}`
        : `Etapa ${e.indice + 1} de ${cfg.etapas.length}`;
      const circulo = $('circulo');
      if (circulo && e.fase) {
        circulo.style.transitionDuration = `${e.segundos}s`;
        if (e.fase === 'inspirar') circulo.classList.add('cheio');
        if (e.fase === 'expirar') circulo.classList.remove('cheio');
        $('rotulo').textContent = e.titulo;
      }
    }

    const relogio = cronometro(seg => {
      if (seg >= total()) return terminar();
      const i = seq.findIndex(e => seg < e.inicio + e.segundos);
      if (i !== etapaAtual) {
        etapaAtual = i;
        mostrarEtapa(seq[i]);
        if (i > 0 && $('som').checked) sino();
      }
      const e = seq[i];
      $('tempo').textContent = mmss(Math.ceil(e.inicio + e.segundos - seg));
      $('barra').style.width = `${(seg / total()) * 100}%`;
    });

    function terminar() {
      relogio.zerar();
      etapaAtual = -1;
      $('barra').style.width = '100%';
      $('tempo').textContent = mmss(0);
      $('play').textContent = 'Fazer de novo';
      $('titulo').textContent = 'Concluído';
      $('texto').textContent = cfg.fim || 'Volte devagar, no seu ritmo. Observe como você se sente agora.';
      $('contador').textContent = '';
      $('circulo')?.classList.remove('cheio');
      if ($('rotulo')) $('rotulo').textContent = 'Muito bem';
      if ($('som').checked) sino();
    }

    function zerar() {
      relogio.zerar();
      etapaAtual = -1;
      seq = sequencia();
      $('barra').style.width = '0%';
      $('tempo').textContent = mmss(total());
      $('play').textContent = 'Iniciar';
      $('titulo').textContent = cfg.etapas[0].titulo;
      $('texto').textContent = cfg.inicio || '';
      $('contador').textContent = '';
      const circulo = $('circulo');
      if (circulo) { circulo.style.transitionDuration = '0.6s'; circulo.classList.remove('cheio'); $('rotulo').textContent = 'Pronto?'; }
    }

    $('play').addEventListener('click', () => {
      if (relogio.rodando) {
        relogio.pausar();
        $('play').textContent = 'Continuar';
        return;
      }
      if (etapaAtual === -1 && relogio.segundos === 0) zerar();
      if (audio?.state === 'suspended') audio.resume();
      relogio.iniciar();
      $('play').textContent = 'Pausar';
    });
    $('zerar').addEventListener('click', zerar);
    $('ciclos')?.addEventListener('change', e => { ciclos = Number(e.target.value); zerar(); });
    zerar();
  }

  // -------------------------------------------------------------------------
  // Diário (salvo só neste navegador)

  function diario() {
    const chave = `sobrevoce.atividade.${cfg.chave}`;
    const ler = () => { try { return JSON.parse(localStorage.getItem(chave)) || []; } catch { return []; } };
    const gravar = lista => localStorage.setItem(chave, JSON.stringify(lista));
    const hoje = new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

    const campoHtml = c => {
      const id = `campo-${c.id}`;
      const dica = c.dica ? `<span class="dica">${esc(c.dica)}</span>` : '';
      if (c.tipo === 'escala') {
        return `<div class="campo"><label for="${id}">${esc(c.rotulo)} <output data-saida="${c.id}">50</output></label>
          <input type="range" id="${id}" name="${c.id}" min="0" max="100" step="5" value="50">${dica}</div>`;
      }
      if (c.tipo === 'linha') {
        return `<div class="campo"><label for="${id}">${esc(c.rotulo)}</label>
          <input type="text" id="${id}" name="${c.id}" maxlength="300" placeholder="${esc(c.placeholder)}">${dica}</div>`;
      }
      return `<div class="campo"><label for="${id}">${esc(c.rotulo)}</label>
        <textarea id="${id}" name="${c.id}" rows="${c.linhas || 4}" maxlength="10000" placeholder="${esc(c.placeholder)}"></textarea>${dica}</div>`;
    };

    raiz.innerHTML = `
      <form class="diario" novalidate>
        <p class="data">${esc(hoje.charAt(0).toUpperCase() + hoje.slice(1))}</p>
        ${cfg.timer ? `
        <div class="timer print:hidden">
          <span class="timer-tempo" data-tempo>${mmss(cfg.timer.padrao * 60)}</span>
          <select data-minutos aria-label="Duração">${cfg.timer.opcoes.map(n => `<option value="${n}"${n === cfg.timer.padrao ? ' selected' : ''}>${n} min</option>`).join('')}</select>
          <button type="button" class="botao-secundario" data-timer>Iniciar tempo</button>
        </div>` : ''}
        ${cfg.campos.map(campoHtml).join('')}
        <div class="controles print:hidden">
          <button type="submit" class="botao-principal">Salvar neste aparelho</button>
          <button type="button" class="botao-secundario" data-imprimir>Imprimir</button>
          <button type="button" class="botao-secundario" data-limpar>Limpar</button>
        </div>
        <p class="aviso-privacidade">&#128274; O que você escreve fica só neste navegador. Nada é enviado pela internet e ninguém mais tem acesso, nem a profissional.</p>
        <p class="mensagem" data-msg role="status" hidden></p>
      </form>
      <section class="historico print:hidden" data-historico hidden>
        <h3>Registros salvos neste aparelho</h3>
        <div data-lista></div>
        <button type="button" class="link-apagar" data-apagar-tudo>Apagar todos os registros</button>
      </section>`;

    const form = raiz.querySelector('form');
    const $ = s => raiz.querySelector(`[data-${s}]`);
    const msg = texto => { $('msg').textContent = texto; $('msg').hidden = !texto; };

    form.querySelectorAll('input[type=range]').forEach(r => {
      r.addEventListener('input', () => { raiz.querySelector(`[data-saida="${r.name}"]`).textContent = r.value; });
    });

    function valores() {
      return Object.fromEntries(cfg.campos.map(c => [c.id, form.elements[c.id].value.trim()]));
    }

    function renderHistorico() {
      const lista = ler();
      $('historico').hidden = lista.length === 0;
      $('lista').innerHTML = lista.map((r, i) => {
        const data = new Date(r.data).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
        const corpo = cfg.campos.filter(c => r.valores[c.id] !== '' && r.valores[c.id] != null)
          .map(c => `<p><strong>${esc(c.rotulo)}</strong><br>${esc(r.valores[c.id]).replace(/\n/g, '<br>')}</p>`).join('');
        return `<details class="registro"><summary>${esc(data)}</summary>${corpo}
          <button type="button" class="link-apagar" data-apagar="${i}">Apagar este registro</button></details>`;
      }).join('');
    }

    form.addEventListener('submit', e => {
      e.preventDefault();
      const v = valores();
      const textos = cfg.campos.filter(c => c.tipo !== 'escala').map(c => v[c.id]);
      if (!textos.some(Boolean)) return msg('Escreva alguma coisa antes de salvar.');
      const lista = ler();
      lista.unshift({ data: new Date().toISOString(), valores: v });
      try {
        gravar(lista);
      } catch {
        return msg('Não foi possível salvar neste navegador. Você pode usar o botão Imprimir para guardar uma cópia.');
      }
      form.reset();
      form.querySelectorAll('input[type=range]').forEach(r => r.dispatchEvent(new Event('input')));
      msg('Registro salvo neste aparelho. Ele aparece na lista abaixo.');
      renderHistorico();
    });

    $('imprimir').addEventListener('click', () => window.print());
    $('limpar').addEventListener('click', () => {
      if (Object.values(valores()).some(v => v && v !== '50') && !confirm('Apagar o que você escreveu agora?')) return;
      form.reset();
      form.querySelectorAll('input[type=range]').forEach(r => r.dispatchEvent(new Event('input')));
      msg('');
    });
    $('lista').addEventListener('click', e => {
      const btn = e.target.closest('[data-apagar]');
      if (!btn || !confirm('Apagar este registro? Isso não pode ser desfeito.')) return;
      const lista = ler();
      lista.splice(Number(btn.dataset.apagar), 1);
      gravar(lista);
      renderHistorico();
    });
    $('apagar-tudo').addEventListener('click', () => {
      if (!confirm('Apagar todos os registros desta atividade salvos neste aparelho?')) return;
      localStorage.removeItem(chave);
      renderHistorico();
    });

    // Tempo opcional para escrever (não bloqueia nada quando termina).
    if (cfg.timer) {
      let minutos = cfg.timer.padrao;
      const relogio = cronometro(seg => {
        const resta = minutos * 60 - seg;
        if (resta <= 0) {
          relogio.zerar();
          $('tempo').textContent = mmss(0);
          $('timer').textContent = 'Iniciar tempo';
          sino();
          msg('O tempo terminou. Termine a frase com calma e respire.');
          return;
        }
        $('tempo').textContent = mmss(Math.ceil(resta));
      });
      $('timer').addEventListener('click', () => {
        if (relogio.rodando) { relogio.pausar(); $('timer').textContent = 'Continuar'; return; }
        if (audio?.state === 'suspended') audio.resume();
        relogio.iniciar();
        $('timer').textContent = 'Pausar';
      });
      $('minutos').addEventListener('change', e => {
        minutos = Number(e.target.value);
        relogio.zerar();
        $('tempo').textContent = mmss(minutos * 60);
        $('timer').textContent = 'Iniciar tempo';
      });
    }

    renderHistorico();
  }

  if (cfg.tipo === 'guiada') guiada();
  if (cfg.tipo === 'diario') diario();
})();
