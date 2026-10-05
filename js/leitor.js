// Leitura em voz alta pelo navegador (Web Speech API), sem custo e sem arquivos de áudio.
// - window.SVVoz: { disponivel, falar(texto, aoTerminar), parar() }, usado pelas atividades guiadas.
// - Nos e-books (<main class="ebook">): botão "Ouvir" no topo e barra de reprodução por capítulo.
// Se o aparelho não tiver voz em português, nada aparece.
(() => {
  const synth = window.speechSynthesis;
  if (!synth || !window.SpeechSynthesisUtterance) return;

  // Prefere vozes em pt-BR mais naturais (Edge "Natural/Online", Google), depois qualquer pt-BR, depois pt.
  const CHAVE_VOZ = 'sobrevoce.voz';
  let voz = null;
  let vozesPt = [];

  function escolherVoz() {
    const vozes = synth.getVoices();
    const pontos = v => (v.lang.replace('_', '-').toLowerCase().startsWith('pt-br') ? 10 : v.lang.toLowerCase().startsWith('pt') ? 5 : -100)
      + (/natural|online/i.test(v.name) ? 3 : /google/i.test(v.name) ? 2 : 0);
    vozesPt = vozes.filter(v => pontos(v) > 0).sort((a, b) => pontos(b) - pontos(a));
    const salva = localStorage.getItem(CHAVE_VOZ);
    voz = vozesPt.find(v => v.name === salva) || vozesPt[0] || null;
    return vozes.length;
  }

  function usarVoz(nome) {
    const escolhida = vozesPt.find(v => v.name === nome);
    if (!escolhida) return;
    voz = escolhida;
    try { localStorage.setItem(CHAVE_VOZ, nome); } catch { /* navegação privada */ }
  }

  // Nome curto para a lista: "Microsoft Francisca Online (Natural) - Portuguese (Brazil)" vira "Francisca (natural)".
  function nomeCurto(v) {
    let n = v.name
      .replace(/^(Microsoft|Google|Apple)\s+/i, '')
      .replace(/\s*[-–]\s*(Portuguese|Portugu[eê]s).*$/i, '')
      .replace(/\s*\((Brazil|Brasil|Portugal|Portuguese[^)]*)\)/gi, '')
      .trim();
    const natural = /natural/i.test(v.name);
    n = n.replace(/\s*(Online|Natural)\s*/gi, ' ').replace(/\(\s*\)/g, '').replace(/\s+/g, ' ').trim() || v.name;
    const pt = v.lang.replace('_', '-').toLowerCase().startsWith('pt-br') ? '' : ' · Portugal';
    return `${n}${natural ? ' (natural)' : ''}${pt}`;
  }

  // Algumas vozes carregam depois da página: espera até 2 s antes de decidir.
  const pronto = new Promise(ok => {
    if (escolherVoz()) return ok();
    const fim = () => { escolherVoz(); ok(); };
    synth.addEventListener?.('voiceschanged', fim, { once: true });
    setTimeout(fim, 2000);
  });

  let velocidade = 1;
  function falar(texto, aoTerminar) {
    const u = new SpeechSynthesisUtterance(texto);
    u.lang = voz?.lang || 'pt-BR';
    if (voz) u.voice = voz;
    u.rate = velocidade;
    if (aoTerminar) {
      u.onend = aoTerminar;
      u.onerror = e => { if (e.error !== 'interrupted' && e.error !== 'canceled') aoTerminar(); };
    }
    synth.speak(u);
  }
  function parar() { synth.cancel(); }

  window.SVVoz = {
    pronto,
    get vozes() { return vozesPt.map(v => ({ nome: v.name, rotulo: nomeCurto(v) })); },
    get vozAtual() { return voz?.name || ''; },
    usarVoz,
    // Sem lista de vozes (alguns Android), tenta falar mesmo assim com lang pt-BR.
    get disponivel() { return Boolean(voz) || synth.getVoices().length === 0; },
    falar(texto) { parar(); falar(texto); },
    parar,
  };
  window.addEventListener('pagehide', parar);

  // -------------------------------------------------------------------------
  // Player dos e-books

  const ebook = document.querySelector('main.ebook');
  if (!ebook) return;

  // Trechos lidos, na ordem da página, com o capítulo de cada um.
  function montarTrechos() {
    const trechos = [];
    const add = (el, texto, capitulo) => {
      const t = texto.replace(/_{2,}/g, ' … ').replace(/\s+/g, ' ').trim();
      if (t) trechos.push({ el, texto: t, capitulo });
    };
    const capa = ebook.querySelector('.capa');
    const capitulos = [{ titulo: capa?.querySelector('h1')?.textContent.trim() || 'Início', el: capa }];
    if (capa) {
      add(capa.querySelector('h1'), capa.querySelector('h1').textContent, 0);
      const sub = capa.querySelector('h1 + p');
      if (sub) add(sub, sub.textContent, 0);
      const autora = capa.querySelector('p.font-bold');
      if (autora) add(autora, `Por ${autora.textContent}`, 0);
    }
    ebook.querySelectorAll('section.capitulo').forEach(sec => {
      const h2 = sec.querySelector('h2');
      capitulos.push({ titulo: h2?.textContent.trim() || '', el: sec });
      const n = capitulos.length - 1;
      sec.querySelectorAll('h2, h3, p, li, tr').forEach(el => {
        if (el.closest('.print\\:hidden, .cta, fieldset, thead, #resultado, .assinatura')) return;
        if (el.matches('li') && el.closest('.autoavaliacao')) return add(el, el.querySelector('span')?.textContent || '', n);
        if (el.matches('tr')) {
          const cab = [...(el.closest('table').querySelectorAll('thead th'))].map(th => th.textContent.trim());
          const celulas = [...el.children].map((td, i) => {
            const v = td.textContent.trim();
            return v ? (cab[i] ? `${cab[i]}: ${v}` : v) : '';
          }).filter(Boolean);
          // Linhas de tabela para preencher (só o dia da semana) não são lidas.
          if (celulas.length > 1) add(el, celulas.join('. '), n);
          return;
        }
        if (el.matches('p') && el.closest('li, td')) return;
        add(el, el.textContent, n);
      });
    });
    return { trechos, capitulos };
  }

  const { trechos, capitulos } = montarTrechos();
  if (!trechos.length) return;

  let atual = 0;
  let tocando = false;
  let barra = null;
  // Cada leitura iniciada ganha um número; avisos de fim de leituras antigas (canceladas) são ignorados.
  let geracao = 0;

  const ICONE_PLAY = '<svg viewBox="0 0 24 24" fill="currentColor" class="w-6 h-6" aria-hidden="true"><path d="M8 5v14l11-7z"/></svg>';
  const ICONE_PAUSA = '<svg viewBox="0 0 24 24" fill="currentColor" class="w-6 h-6" aria-hidden="true"><path d="M6 5h4v14H6zM14 5h4v14h-4z"/></svg>';
  const ICONE_FONE = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="w-4 h-4" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" d="M3 18v-6a9 9 0 0118 0v6M21 19a2 2 0 01-2 2h-1a2 2 0 01-2-2v-3a2 2 0 012-2h3zM3 19a2 2 0 002 2h1a2 2 0 002-2v-3a2 2 0 00-2-2H3z"/></svg>';

  function marcar(i) {
    ebook.querySelectorAll('.lendo').forEach(el => el.classList.remove('lendo'));
    const el = trechos[i]?.el;
    if (!el) return;
    el.classList.add('lendo');
    const r = el.getBoundingClientRect();
    if (r.top < 80 || r.bottom > window.innerHeight - 110) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  function atualizarBarra() {
    if (!barra) return;
    barra.querySelector('[data-play]').innerHTML = tocando ? ICONE_PAUSA : ICONE_PLAY;
    barra.querySelector('[data-play]').setAttribute('aria-label', tocando ? 'Pausar' : 'Ouvir');
    const cap = trechos[atual]?.capitulo ?? 0;
    barra.querySelector('[data-capitulo]').textContent = capitulos[cap].titulo;
    barra.querySelector('[data-progresso]').style.width = `${(atual / trechos.length) * 100}%`;
  }

  function lerDaqui() {
    if (!tocando) return;
    if (atual >= trechos.length) {
      tocando = false;
      atual = 0;
      marcar(-1);
      atualizarBarra();
      return;
    }
    marcar(atual);
    atualizarBarra();
    const i = atual;
    const g = ++geracao;
    falar(trechos[i].texto, () => {
      if (!tocando || g !== geracao || atual !== i) return;
      atual++;
      lerDaqui();
    });
  }

  // Pausar = cancelar e lembrar o trecho; "continuar" recomeça o trecho atual (mais confiável entre navegadores).
  function alternar() {
    abrirBarra();
    if (tocando) {
      tocando = false;
      parar();
    } else {
      tocando = true;
      recomecar();
    }
    atualizarBarra();
  }

  // Alguns navegadores ignoram falar logo depois de cancelar: espera um instante.
  function recomecar() {
    parar();
    geracao++;
    setTimeout(lerDaqui, 80);
  }

  function irPara(i) {
    atual = Math.max(0, Math.min(trechos.length - 1, i));
    if (tocando) recomecar(); else { parar(); marcar(atual); atualizarBarra(); }
  }

  function capituloRelativo(delta) {
    const capAtual = trechos[atual]?.capitulo ?? 0;
    // "Anterior" no meio de um capítulo volta para o começo dele.
    const inicioAtual = trechos.findIndex(t => t.capitulo === capAtual);
    let alvo = capAtual + delta;
    if (delta < 0 && atual > inicioAtual + 1) alvo = capAtual;
    alvo = Math.max(0, Math.min(capitulos.length - 1, alvo));
    const i = trechos.findIndex(t => t.capitulo === alvo);
    if (i >= 0) irPara(i);
  }

  function abrirBarra() {
    if (barra) { barra.hidden = false; return; }
    document.body.insertAdjacentHTML('beforeend', `
      <div class="leitor print:hidden" role="region" aria-label="Ouvir o e-book">
        <div class="leitor-progresso"><div data-progresso></div></div>
        <div class="leitor-conteudo">
          <button type="button" class="leitor-botao" data-anterior aria-label="Capítulo anterior" title="Capítulo anterior">
            <svg viewBox="0 0 24 24" fill="currentColor" class="w-5 h-5" aria-hidden="true"><path d="M6 6h2v12H6zM9.5 12l8.5 6V6z"/></svg>
          </button>
          <button type="button" class="leitor-play" data-play aria-label="Ouvir">${ICONE_PLAY}</button>
          <button type="button" class="leitor-botao" data-proximo aria-label="Próximo capítulo" title="Próximo capítulo">
            <svg viewBox="0 0 24 24" fill="currentColor" class="w-5 h-5" aria-hidden="true"><path d="M16 6h2v12h-2zM6 18l8.5-6L6 6z"/></svg>
          </button>
          <div class="leitor-info">
            <span class="leitor-rotulo">Ouvindo</span>
            <span class="leitor-capitulo" data-capitulo></span>
          </div>
          <label class="leitor-selecao" data-voz-campo hidden><span class="sr-only">Voz</span>
            <select data-voz title="Voz da leitura"></select>
          </label>
          <label class="leitor-selecao"><span class="sr-only">Velocidade</span>
            <select data-velocidade title="Velocidade da leitura">
              ${[0.8, 0.9, 1, 1.15, 1.3, 1.5].map(v => `<option value="${v}"${v === 1 ? ' selected' : ''}>${String(v).replace('.', ',')}×</option>`).join('')}
            </select>
          </label>
          <button type="button" class="leitor-botao" data-fechar aria-label="Fechar o player" title="Fechar">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="w-5 h-5" aria-hidden="true"><path stroke-linecap="round" d="M6 6l12 12M18 6L6 18"/></svg>
          </button>
        </div>
      </div>`);
    barra = document.body.lastElementChild;
    document.body.classList.add('com-leitor');
    barra.querySelector('[data-play]').addEventListener('click', alternar);
    barra.querySelector('[data-anterior]').addEventListener('click', () => capituloRelativo(-1));
    barra.querySelector('[data-proximo]').addEventListener('click', () => capituloRelativo(1));
    barra.querySelector('[data-velocidade]').addEventListener('change', e => {
      velocidade = Number(e.target.value);
      if (tocando) recomecar();
    });
    // Lista de vozes: só aparece quando o aparelho tem mais de uma em português.
    const campoVoz = barra.querySelector('[data-voz-campo]');
    const seletorVoz = barra.querySelector('[data-voz]');
    if (vozesPt.length > 1) {
      seletorVoz.innerHTML = vozesPt.map(v => `<option value="${v.name.replace(/"/g, '&quot;')}">${nomeCurto(v)}</option>`).join('');
      seletorVoz.value = voz?.name || '';
      campoVoz.hidden = false;
      seletorVoz.addEventListener('change', e => {
        usarVoz(e.target.value);
        if (tocando) recomecar();
      });
    }
    barra.querySelector('[data-fechar]').addEventListener('click', () => {
      tocando = false;
      parar();
      marcar(-1);
      barra.hidden = true;
      document.body.classList.remove('com-leitor');
    });
    atualizarBarra();
  }

  // Clicar num parágrafo enquanto o player está aberto começa a ler dali.
  ebook.addEventListener('click', e => {
    if (!barra || barra.hidden || e.target.closest('a, button, input, label, select, summary')) return;
    const i = trechos.findIndex(t => t.el === e.target.closest('h1, h2, h3, p, li, tr'));
    if (i >= 0) { tocando = true; irPara(i); atualizarBarra(); }
  });

  pronto.then(() => {
    if (!window.SVVoz.disponivel) return;
    // Botão "Ouvir" no topo, ao lado de "Baixar PDF", e um convite logo abaixo da capa.
    const baixar = document.querySelector('header a[download]');
    baixar?.insertAdjacentHTML('beforebegin',
      `<button type="button" class="text-sm bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-full inline-flex items-center gap-1.5" data-ouvir>${ICONE_FONE}<span>Ouvir</span></button>`);
    ebook.querySelector('.capa')?.insertAdjacentHTML('afterend', `
      <div class="max-w-3xl mx-auto px-6 pt-8 print:hidden">
        <button type="button" class="ouvir-convite" data-ouvir>
          ${ICONE_FONE}<span><strong>Prefere ouvir?</strong> Clique para escutar este conteúdo em voz alta.</span>
        </button>
      </div>`);
    document.querySelectorAll('[data-ouvir]').forEach(b => b.addEventListener('click', () => { if (!tocando) alternar(); else abrirBarra(); }));
  });
})();
