// Page render functions

function renderHome() {
  const site = content.site;
  return `
  <!-- Hero Section -->
  <section class="relative bg-gradient-to-br from-teal-700 via-teal-600 to-emerald-500 text-white overflow-hidden">
    <div class="absolute inset-0 opacity-10">
      <div class="absolute top-20 left-10 w-72 h-72 bg-white rounded-full blur-3xl"></div>
      <div class="absolute bottom-10 right-10 w-96 h-96 bg-teal-300 rounded-full blur-3xl"></div>
    </div>
    <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
      <div class="text-center max-w-3xl mx-auto">
        <h1 class="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">${esc(site.heroTitulo)}</h1>
        <p class="text-xl md:text-2xl text-teal-100 mb-10">${esc(site.heroSubtitulo)}</p>
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <a href="#schedule" onclick="navigate('schedule'); return false;" class="bg-white text-teal-700 px-8 py-4 rounded-xl font-bold text-lg hover:bg-teal-50 transition shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
            ${t('hero_cta')}
          </a>
          <a href="#courses" onclick="navigate('courses'); return false;" class="border-2 border-white/40 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-white/10 transition">
            ${t('hero_secondary_cta')}
          </a>
        </div>
      </div>
    </div>
    <div class="absolute bottom-0 left-0 right-0">
      <svg viewBox="0 0 1440 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M0 50L48 45C96 40 192 30 288 35C384 40 480 60 576 65C672 70 768 60 864 50C960 40 1056 30 1152 35C1248 40 1344 60 1392 70L1440 80V100H0V50Z" fill="white"/>
      </svg>
    </div>
  </section>

  ${outubroRosa() ? renderOutubroRosaSecao() : ''}

  <!-- Features Section -->
  <section class="py-20 bg-white">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <h2 class="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-4">${t('features_title')}</h2>
      <div class="w-20 h-1 bg-teal-500 mx-auto mb-16 rounded-full"></div>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        ${renderFeatureCard('&#128218;', t('feature_courses_title'), t('feature_courses_desc'), 'courses')}
        ${renderFeatureCard('&#127916;', t('feature_videos_title'), t('feature_videos_desc'), 'courses')}
        ${renderFeatureCard('&#128214;', t('feature_materials_title'), t('feature_materials_desc'), 'materials')}
        ${renderFeatureCard('&#129504;', t('feature_activities_title'), t('feature_activities_desc'), 'activities')}
        ${renderFeatureCard('&#128197;', t('feature_schedule_title'), t('feature_schedule_desc'), 'schedule')}
        ${renderFeatureCard('&#128274;', t('feature_sigilo_title'), t('feature_sigilo_desc'), 'privacidade')}
      </div>
    </div>
  </section>

  <!-- About Section -->
  <section class="py-20 bg-gray-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div>
          <h2 class="text-3xl md:text-4xl font-bold text-gray-800 mb-6">${t('about_title')}</h2>
          <p class="text-lg text-gray-600 mb-8 leading-relaxed whitespace-pre-line">${esc(site.sobreTexto)}</p>
          <div class="grid grid-cols-2 gap-4">
            ${(site.credenciais || []).filter(Boolean).map(c => `
            <div class="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
              <div class="text-teal-600 font-semibold text-sm">${esc(c)}</div>
            </div>`).join('')}
          </div>
        </div>
        <div class="flex justify-center">
          <div class="w-80 h-96 bg-gradient-to-br from-teal-100 to-emerald-100 rounded-2xl flex items-center justify-center shadow-lg overflow-hidden">
            <div class="text-center px-4">
              <div class="w-48 h-48 rounded-full mx-auto mb-4 overflow-hidden border-4 border-white shadow-lg">
                <img src="${esc(fotoProfissional(site))}" alt="${esc(site.profissional)}" class="w-full h-full object-cover object-top">
              </div>
              <p class="text-teal-700 font-semibold text-lg">${esc(site.profissional)}</p>
              <p class="text-teal-600 text-sm">${[site.profissao, site.registro].filter(Boolean).map(esc).join(' &middot; ')}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  ${renderFaq()}

  <!-- CTA Section -->
  <section class="py-16 bg-gradient-to-r from-teal-600 to-emerald-500 text-white">
    <div class="max-w-4xl mx-auto text-center px-4">
      ${content.planosAtiva ? `
      <h2 class="text-3xl md:text-4xl font-bold mb-6">Comece sua jornada de transformação hoje</h2>
      <p class="text-xl text-teal-100 mb-8">Assine e tenha acesso a todos os conteúdos e ferramentas da plataforma.</p>
      <a href="#plans" onclick="navigate('plans'); return false;" class="inline-block bg-white text-teal-700 px-10 py-4 rounded-xl font-bold text-lg hover:bg-teal-50 transition shadow-lg">${t('plans_cta')}</a>` : `
      <h2 class="text-3xl md:text-4xl font-bold mb-6">Dê o primeiro passo</h2>
      <p class="text-xl text-teal-100 mb-8">Agende uma conversa e descubra como entender melhor a forma como você se comunica e se relaciona.</p>
      <a href="#schedule" onclick="navigate('schedule'); return false;" class="inline-block bg-white text-teal-700 px-10 py-4 rounded-xl font-bold text-lg hover:bg-teal-50 transition shadow-lg">${t('hero_cta')}</a>`}
    </div>
  </section>`;
}

function renderOutubroRosaSecao() {
  const card = (emoji, titulo, texto) => `
        <div class="bg-white/80 p-6 rounded-2xl border border-pink-100">
          <div class="text-3xl mb-3">${emoji}</div>
          <h3 class="font-bold text-pink-700 mb-2">${titulo}</h3>
          <p class="text-gray-600 text-sm leading-relaxed">${texto}</p>
        </div>`;
  return `
  <section class="py-16 bg-gradient-to-br from-pink-50 to-rose-100">
    <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center mb-10">
        ${lacoRosa('w-14 h-14 mx-auto mb-4', '#ec4899')}
        <h2 class="text-3xl md:text-4xl font-bold text-pink-700 mb-4">Outubro Rosa</h2>
        <p class="text-lg text-gray-700 max-w-3xl mx-auto">Outubro é o mês de conscientização sobre o câncer de mama. Quando descoberto cedo, as chances de tratamento são muito maiores. Cuidar de você também é prevenção.</p>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        ${card('&#128269;', 'Conheça seu corpo', 'Observe suas mamas no dia a dia. Caroços, mudanças na pele ou no mamilo e secreções merecem atenção.')}
        ${card('&#129658;', 'Faça seus exames', 'Converse com seu médico ou enfermeiro sobre a mamografia e a periodicidade indicada para você.')}
        ${card('&#128151;', 'Cuide das emoções', 'O diagnóstico e o tratamento mexem com a saúde emocional de quem passa por eles e de quem está por perto. Pedir ajuda faz parte do cuidado.')}
      </div>
      <div class="text-center mt-10">
        <a href="#schedule" onclick="navigate('schedule'); return false;" class="inline-block bg-pink-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-pink-700 transition shadow-md">Agende uma conversa</a>
      </div>
    </div>
  </section>`;
}

function renderFeatureCard(emoji, title, desc, link) {
  return `
  <a href="#${link}" onclick="navigate('${link}'); return false;" class="block bg-white p-8 rounded-2xl shadow-sm hover:shadow-lg border border-gray-100 transition-all hover:-translate-y-1 group">
    <div class="text-4xl mb-4">${emoji}</div>
    <h3 class="text-xl font-bold text-gray-800 mb-3 group-hover:text-teal-600 transition">${title}</h3>
    <p class="text-gray-600 leading-relaxed">${desc}</p>
  </a>`;
}

function renderFaq() {
  const faq = (content.site.faq || []).filter(f => f && f.pergunta && f.resposta);
  if (!faq.length) return '';
  return `
  <section class="py-20 bg-white">
    <div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
      <h2 class="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-4">${t('faq_title')}</h2>
      <div class="w-20 h-1 bg-teal-500 mx-auto mb-12 rounded-full"></div>
      <div class="space-y-3">
        ${faq.map(f => `
        <details class="group bg-gray-50 border border-gray-100 rounded-xl">
          <summary class="flex items-center justify-between gap-4 cursor-pointer list-none p-5 font-semibold text-gray-800">
            ${esc(f.pergunta)}
            <span class="text-teal-600 text-xl transition group-open:rotate-45" aria-hidden="true">+</span>
          </summary>
          <p class="px-5 pb-5 text-gray-600 leading-relaxed whitespace-pre-line">${esc(f.resposta)}</p>
        </details>`).join('')}
      </div>
    </div>
  </section>`;
}

// Foto salva pelo painel (data URL) ou a foto padrão do site.
function fotoProfissional(site) {
  return /^data:image\//.test(site.fotoUrl || '') ? site.fotoUrl : 'foto.jpg';
}

function tipoBadge(colecao, tipo) {
  const info = window.SV_TIPOS[colecao][tipo] || { rotulo: tipo, cor: 'bg-gray-100 text-gray-700' };
  return `<span class="text-xs px-2 py-1 rounded-full ${info.cor} font-medium">${esc(info.rotulo)}</span>`;
}

// Botão de acesso dos cards: abre o link do conteúdo; sem link, mostra "Em breve".
function accessButton(item, label, cls) {
  const url = safeUrl(item.link);
  const novaAba = LINK_INTERNO.test(url) ? '' : ' target="_blank" rel="noopener"';
  return url
    ? `<a href="${esc(url)}"${novaAba} class="block text-center ${cls} bg-teal-600 text-white hover:bg-teal-700">${label}</a>`
    : `<span class="block text-center ${cls} bg-gray-100 text-gray-500 cursor-default">${t('content_soon')}</span>`;
}

// Rótulos dos filtros (no plural) por tipo.
const FILTROS = {
  cursos: { curso: 'Cursos', video: 'Vídeos' },
  materiais: { ebook: 'E-books', artigo: 'Artigos', guia: 'Guias' },
  atividades: { respiracao: 'Respiração', diario: 'Diário', meditacao: 'Meditação', exercicios: 'Exercícios' },
};

// Filtros só com os tipos que existem na lista; some se houver um tipo só.
function filterBar(colecao, itens) {
  const tipos = Object.keys(FILTROS[colecao]).filter(tp => itens.some(i => i.tipo === tp));
  if (tipos.length < 2) return '';
  const botao = (valor, rotulo) => `
        <button onclick="setFiltro('${valor}')" aria-pressed="${app.filtro === valor}" class="px-5 py-2 rounded-full font-medium text-sm transition ${app.filtro === valor ? 'bg-teal-600 text-white' : 'bg-white text-gray-600 border hover:border-teal-300'}">${rotulo}</button>`;
  return `
      <div class="flex justify-center gap-3 mb-10 flex-wrap">
        ${botao('todos', t('filter_all'))}
        ${tipos.map(tp => botao(tp, FILTROS[colecao][tp])).join('')}
      </div>`;
}

function filtrar(itens) {
  return app.filtro === 'todos' ? itens : itens.filter(i => i.tipo === app.filtro);
}

function pageHeader(titulo, subtitulo) {
  return `
      <div class="text-center mb-12">
        <h1 class="text-3xl md:text-4xl font-bold text-gray-800 mb-4">${titulo}</h1>
        <p class="text-lg text-gray-600">${subtitulo}</p>
      </div>`;
}

function emptyState() {
  return `<p class="text-center text-gray-500 py-12">${t('content_empty')}</p>`;
}

function renderCourses() {
  const lista = filtrar(content.cursos);

  return `
  <section class="py-16 bg-gray-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      ${pageHeader(t('courses_title'), t('courses_subtitle'))}
      ${filterBar('cursos', content.cursos)}
      ${lista.length ? '' : emptyState()}
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        ${lista.map(c => `
          <div class="bg-white rounded-2xl shadow-sm hover:shadow-lg border border-gray-100 overflow-hidden transition-all hover:-translate-y-1 group flex flex-col">
            <div class="h-40 bg-gradient-to-br from-teal-50 to-emerald-50 flex items-center justify-center">
              <span class="text-6xl">${esc(c.icone)}</span>
            </div>
            <div class="p-6 flex flex-col flex-1">
              <div class="flex items-center gap-2 mb-2">
                ${tipoBadge('cursos', c.tipo)}
                ${Number(c.aulas) > 0 ? `<span class="text-xs text-gray-500">${Number(c.aulas)} ${t('courses_lessons')}</span>` : ''}
                ${Number(c.duracao) > 0 ? `<span class="text-xs text-gray-500">${Number(c.duracao)} ${t('courses_duration')}</span>` : ''}
              </div>
              <h3 class="text-lg font-bold text-gray-800 mb-2 group-hover:text-teal-600 transition">${esc(c.titulo)}</h3>
              <p class="text-gray-600 text-sm mb-4 flex-1">${esc(c.descricao)}</p>
              ${accessButton(c, c.tipo === 'video' ? t('courses_watch') : t('courses_start'), 'w-full py-2.5 rounded-xl font-medium text-sm transition')}
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  </section>`;
}

function renderMaterials() {
  const lista = filtrar(content.materiais);

  return `
  <section class="py-16 bg-gray-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      ${pageHeader(t('materials_title'), t('materials_subtitle'))}
      ${filterBar('materiais', content.materiais)}
      ${lista.length ? '' : emptyState()}
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        ${lista.map(m => `
          <div class="bg-white rounded-2xl shadow-sm hover:shadow-lg border border-gray-100 overflow-hidden transition-all hover:-translate-y-1 group flex flex-col">
            <div class="h-36 bg-gradient-to-br from-amber-50 to-orange-50 flex items-center justify-center">
              <span class="text-5xl">${esc(m.icone)}</span>
            </div>
            <div class="p-6 flex flex-col flex-1">
              <div class="flex items-center gap-2 mb-3">
                ${tipoBadge('materiais', m.tipo)}
                ${Number(m.paginas) > 0 ? `<span class="text-xs text-gray-500">${Number(m.paginas)} ${t('materials_pages')}</span>` : ''}
              </div>
              <h3 class="text-lg font-bold text-gray-800 mb-2 group-hover:text-teal-600 transition">${esc(m.titulo)}</h3>
              <p class="text-gray-600 text-sm mb-4 flex-1">${esc(m.descricao)}</p>
              ${accessButton(m, m.tipo === 'ebook' ? t('materials_download') : t('materials_read'), 'w-full py-2.5 rounded-xl font-medium text-sm transition')}
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  </section>`;
}

function renderActivities() {
  const lista = filtrar(content.atividades);

  return `
  <section class="py-16 bg-gray-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      ${pageHeader(t('activities_title'), t('activities_subtitle'))}
      ${filterBar('atividades', content.atividades)}
      ${lista.length ? '' : emptyState()}
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        ${lista.map(a => `
          <div class="bg-white rounded-2xl shadow-sm hover:shadow-lg border border-gray-100 p-6 transition-all hover:-translate-y-1 group flex flex-col">
            <div class="flex items-start justify-between mb-4">
              <span class="text-4xl">${esc(a.icone)}</span>
              ${tipoBadge('atividades', a.tipo)}
            </div>
            <h3 class="text-lg font-bold text-gray-800 mb-2 group-hover:text-teal-600 transition">${esc(a.titulo)}</h3>
            <p class="text-gray-600 text-sm mb-4 flex-1">${esc(a.descricao)}</p>
            <div class="flex items-center justify-between gap-3">
              <span class="text-sm text-gray-500">${Number(a.duracao) > 0 ? `&#9201; ${Number(a.duracao)} ${t('activities_duration')}` : ''}</span>
              ${accessButton(a, t('activities_start'), 'px-5 py-2 rounded-xl font-medium text-sm transition')}
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  </section>`;
}

function renderSchedule() {
  const inputCls = 'w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition';
  return `
  <section class="py-16 bg-gray-50">
    <div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
      ${pageHeader(t('schedule_title'), t('schedule_subtitle'))}
      <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
        <form id="schedule-form" class="space-y-6" novalidate>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label for="sched-nome" class="block text-sm font-semibold text-gray-700 mb-2">${t('schedule_name')}</label>
              <input type="text" id="sched-nome" name="nome" maxlength="100" required autocomplete="name" class="${inputCls}">
            </div>
            <div>
              <label for="sched-email" class="block text-sm font-semibold text-gray-700 mb-2">${t('schedule_email')}</label>
              <input type="email" id="sched-email" name="email" maxlength="120" autocomplete="email" class="${inputCls}">
            </div>
          </div>
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-2">${t('schedule_type')}</label>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <label class="flex items-center gap-3 p-4 border-2 border-gray-200 rounded-xl cursor-pointer hover:border-teal-300 transition has-[:checked]:border-teal-500 has-[:checked]:bg-teal-50">
                <input type="radio" name="modalidade" value="online" checked class="text-teal-600 focus:ring-teal-500">
                <div class="font-medium text-gray-800">&#128187; ${t('schedule_type_online')}</div>
              </label>
              ${content.site.presencial ? `
              <label class="flex items-center gap-3 p-4 border-2 border-gray-200 rounded-xl cursor-pointer hover:border-teal-300 transition has-[:checked]:border-teal-500 has-[:checked]:bg-teal-50">
                <input type="radio" name="modalidade" value="presencial" class="text-teal-600 focus:ring-teal-500">
                <div class="font-medium text-gray-800">&#127970; ${t('schedule_type_presencial')}</div>
              </label>` : ''}
            </div>
          </div>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label for="sched-data" class="block text-sm font-semibold text-gray-700 mb-2">${t('schedule_date')}</label>
              <input type="date" id="sched-data" name="data" required class="${inputCls}">
            </div>
            <div>
              <label for="sched-horario" class="block text-sm font-semibold text-gray-700 mb-2">${t('schedule_time')}</label>
              <select id="sched-horario" name="horario" required disabled class="${inputCls} bg-white disabled:bg-gray-50">
                <option value="">${t('schedule_time_pick_date')}</option>
              </select>
            </div>
          </div>
          <div>
            <label for="sched-motivo" class="block text-sm font-semibold text-gray-700 mb-2">${t('schedule_notes')}</label>
            <textarea id="sched-motivo" name="motivo" maxlength="1000" class="${inputCls} h-28 resize-none" placeholder="${t('schedule_notes_placeholder')}"></textarea>
            <p class="text-xs text-gray-500 mt-1">${t('schedule_notes_hint')}</p>
          </div>
          <label class="flex items-start gap-3 text-sm text-gray-700">
            <input type="checkbox" name="consentimento" class="mt-0.5 text-teal-600 focus:ring-teal-500">
            <span>Li e concordo com a <a href="#privacidade" target="_blank" rel="noopener" class="text-teal-700 font-semibold underline">Política de Privacidade</a> e autorizo o uso dos meus dados para o agendamento.</span>
          </label>
          <p id="sched-erro" role="alert" class="hidden bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl text-sm"></p>
          <button type="submit" class="w-full bg-teal-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-teal-700 transition shadow-md disabled:opacity-60">
            ${t('schedule_confirm')}
          </button>
          <p class="text-center text-sm text-gray-500">${t('schedule_hint')}</p>
          <div id="sched-ok" class="hidden bg-green-50 border border-green-200 text-green-700 p-4 rounded-xl text-center font-medium">
            &#9989; ${t('schedule_success')}
          </div>
        </form>
      </div>
    </div>
  </section>`;
}

// Maior desconto do plano anual em relação ao mensal, em %.
function economiaAnual(planos) {
  const pagos = planos.filter(p => Number(p.mensal) > 0 && Number(p.anual) > 0);
  return Math.max(0, ...pagos.map(p => Math.round((1 - p.anual / p.mensal) * 100)));
}

function renderPlanCard(p) {
  const anual = app.billingCycle === 'yearly';
  const preco = Number(anual ? p.anual : p.mensal) || 0;
  const url = safeUrl(anual ? p.linkAnual : p.linkMensal);
  const check = '<svg class="w-5 h-5 text-teal-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>';
  const btnCls = p.destaque
    ? 'w-full py-3 rounded-xl bg-teal-600 text-white font-semibold hover:bg-teal-700 transition shadow-md'
    : 'w-full py-3 rounded-xl border-2 border-gray-200 text-gray-700 font-semibold hover:border-teal-300 transition';
  // Sem link de pagamento, o botão leva ao WhatsApp (ou ao agendamento, se o WhatsApp não estiver configurado).
  const wa = whatsappLink(`Olá, ${content.site.profissional}! Tenho interesse no plano ${p.nome}.`);
  const botao = url
    ? `<a href="${esc(url)}" target="_blank" rel="noopener" class="block text-center ${btnCls}">${t('plans_subscribe')}</a>`
    : wa
      ? `<a href="${esc(wa)}" target="_blank" rel="noopener" class="block text-center ${btnCls}">${t('plans_contact')}</a>`
      : `<a href="#schedule" onclick="navigate('schedule'); return false;" class="block text-center ${btnCls}">${t('plans_contact')}</a>`;

  return `
        <div class="bg-white rounded-2xl p-8 relative flex flex-col ${p.destaque ? 'shadow-lg border-2 border-teal-500 md:scale-105' : 'shadow-sm border border-gray-200 hover:shadow-lg transition'}">
          ${p.destaque ? `<div class="absolute -top-3 left-1/2 -translate-x-1/2 bg-teal-600 text-white text-xs font-bold px-4 py-1 rounded-full">${t('plans_popular')}</div>` : ''}
          <h3 class="text-xl font-bold text-gray-800 mb-2">${esc(p.nome)}</h3>
          <div class="mb-6">
            <span class="text-4xl font-bold text-gray-800">${t('plans_currency')} ${formatPreco(preco)}</span>
            ${preco > 0 ? `<span class="text-gray-500">${t('plans_period')}</span>` : ''}
          </div>
          <ul class="space-y-3 mb-8 flex-1">
            ${(p.recursos || []).filter(Boolean).map(r => `<li class="flex items-center gap-2 text-sm text-gray-600">${check}${esc(r)}</li>`).join('')}
          </ul>
          ${botao}
        </div>`;
}

function renderPlans() {
  const economia = economiaAnual(content.planos);
  return `
  <section class="py-16 bg-gray-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center mb-12">
        <h1 class="text-3xl md:text-4xl font-bold text-gray-800 mb-4">${t('plans_title')}</h1>
        <p class="text-lg text-gray-600">${t('plans_subtitle')}</p>
        <div class="flex items-center justify-center gap-4 mt-8">
          <span class="font-medium ${app.billingCycle === 'monthly' ? 'text-teal-700' : 'text-gray-500'}">${t('plans_monthly')}</span>
          <button onclick="app.billingCycle = app.billingCycle === 'monthly' ? 'yearly' : 'monthly'; render();" aria-label="Alternar entre mensal e anual" class="relative w-14 h-7 rounded-full transition ${app.billingCycle === 'yearly' ? 'bg-teal-600' : 'bg-gray-300'}">
            <div class="absolute top-0.5 ${app.billingCycle === 'yearly' ? 'left-7' : 'left-0.5'} w-6 h-6 bg-white rounded-full shadow transition-all"></div>
          </button>
          <span class="font-medium ${app.billingCycle === 'yearly' ? 'text-teal-700' : 'text-gray-500'}">${t('plans_yearly')}</span>
          ${app.billingCycle === 'yearly' && economia > 0 ? `<span class="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-medium">${t('plans_save')} ${economia}%</span>` : ''}
        </div>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
        ${content.planos.map(renderPlanCard).join('')}
      </div>
    </div>
  </section>`;
}

// Texto-base da Política de Privacidade (LGPD). Deve ser revisado pela profissional.
function renderPrivacidade() {
  const site = content.site;
  const responsavel = [site.profissional, site.profissao, site.registro].filter(Boolean).map(esc).join(', ');
  const wa = whatsappLink();
  const email = emailValido();
  const contatos = [
    email ? `pelo e-mail <a href="mailto:${esc(email)}" class="text-teal-700 underline">${esc(email)}</a>` : '',
    wa ? `pelo <a href="${esc(wa)}" target="_blank" rel="noopener" class="text-teal-700 underline">WhatsApp</a>` : '',
  ].filter(Boolean);
  const contato = contatos.length ? contatos.join(' ou ') : 'pelos canais de contato informados no site';
  const secao = (titulo, corpo) => `
        <h2 class="text-xl font-bold text-gray-800 mt-8 mb-3">${titulo}</h2>
        ${corpo}`;
  const p = texto => `<p class="text-gray-600 leading-relaxed mb-3">${texto}</p>`;
  const ul = itens => `<ul class="list-disc pl-6 text-gray-600 leading-relaxed mb-3 space-y-1">${itens.map(i => `<li>${i}</li>`).join('')}</ul>`;

  return `
  <section class="py-16 bg-gray-50">
    <div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 md:p-10">
        <h1 class="text-3xl font-bold text-gray-800 mb-2">Política de Privacidade</h1>
        <p class="text-sm text-gray-500 mb-6">Última atualização: outubro de 2026</p>
        ${p('Esta política explica quais dados pessoais este site coleta, para que eles são usados e quais são os seus direitos, de acordo com a Lei Geral de Proteção de Dados (Lei nº 13.709/2018, LGPD).')}
        ${secao('1. Quem é responsável pelos seus dados', p(`O site Sobre você é mantido por ${responsavel}, responsável pelo tratamento dos dados pessoais coletados aqui.`))}
        ${secao('2. Quais dados coletamos', `
          ${p('Coletamos apenas os dados que você informa no formulário de agendamento:')}
          ${ul(['nome;', 'e-mail (opcional);', 'data, horário e modalidade de atendimento desejados;', 'observações sobre o motivo da consulta (opcional).'])}
          ${p('As observações podem conter informações sobre a sua saúde, que a LGPD considera dados sensíveis. Escreva apenas o necessário para o agendamento. Os detalhes podem ser conversados durante o atendimento.')}
          ${p('O site não usa cookies de rastreamento nem ferramentas de análise de visitantes.')}`)}
        ${secao('3. Para que usamos os dados', p('Os dados são usados exclusivamente para responder ao seu pedido, organizar o agendamento e realizar o atendimento. O tratamento acontece com base no seu consentimento, dado ao marcar a caixa de concordância no formulário.'))}
        ${secao('4. Onde os dados ficam', `
          ${ul([
            'O registro do pedido é armazenado no Google Firebase, um serviço de banco de dados do Google, com acesso restrito à profissional.',
            'A mensagem de agendamento é enviada pelo WhatsApp, a partir do seu próprio aplicativo, e segue também a política de privacidade do WhatsApp.',
            'Para funcionar, o site carrega fontes e componentes técnicos de serviços do Google, que podem registrar dados técnicos de acesso, como o endereço IP.',
          ])}`)}
        ${secao('5. Compartilhamento', p('Seus dados não são vendidos nem compartilhados com terceiros, exceto quando houver obrigação legal ou ordem judicial.'))}
        ${secao('6. Por quanto tempo guardamos', p('Os dados são guardados pelo tempo necessário ao atendimento e pelos prazos exigidos pela legislação e pelas normas éticas e profissionais da enfermagem.'))}
        ${secao('7. Sigilo profissional', p('Todas as informações compartilhadas no atendimento são protegidas pelo sigilo profissional previsto no Código de Ética dos Profissionais de Enfermagem.'))}
        ${secao('8. Seus direitos', `
          ${p('Você pode, a qualquer momento:')}
          ${ul(['confirmar se tratamos seus dados e pedir acesso a eles;', 'corrigir dados incompletos ou desatualizados;', 'pedir a exclusão dos seus dados;', 'revogar o consentimento.'])}
          ${p(`Para exercer esses direitos ou tirar dúvidas, entre em contato ${contato}.`)}`)}
        ${secao('9. Alterações', p('Esta política pode ser atualizada. A data da última atualização fica sempre no topo desta página.'))}
      </div>
    </div>
  </section>`;
}
