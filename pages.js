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
          <button onclick="navigate('${app.isLoggedIn ? 'courses' : 'signup'}')" class="bg-white text-teal-700 px-8 py-4 rounded-xl font-bold text-lg hover:bg-teal-50 transition shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
            ${t('hero_cta')}
          </button>
          <button onclick="navigate('plans')" class="border-2 border-white/40 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-white/10 transition">
            ${t('hero_secondary_cta')}
          </button>
        </div>
      </div>
    </div>
    <div class="absolute bottom-0 left-0 right-0">
      <svg viewBox="0 0 1440 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M0 50L48 45C96 40 192 30 288 35C384 40 480 60 576 65C672 70 768 60 864 50C960 40 1056 30 1152 35C1248 40 1344 60 1392 70L1440 80V100H0V50Z" fill="white"/>
      </svg>
    </div>
  </section>

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
        ${renderFeatureCard('&#128101;', t('feature_community_title'), t('feature_community_desc'), 'plans')}
      </div>
    </div>
  </section>

  <!-- About Section -->
  <section class="py-20 bg-gray-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div>
          <h2 class="text-3xl md:text-4xl font-bold text-gray-800 mb-6">${t('about_title')}</h2>
          <p class="text-lg text-gray-600 mb-8 leading-relaxed">${esc(site.sobreTexto)}</p>
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

  <!-- Testimonials Section -->
  <section class="py-20 bg-white">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <h2 class="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-4">${t('testimonials_title')}</h2>
      <div class="w-20 h-1 bg-teal-500 mx-auto mb-16 rounded-full"></div>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        ${renderTestimonial(t('testimonial1_text'), t('testimonial1_author'))}
        ${renderTestimonial(t('testimonial2_text'), t('testimonial2_author'))}
        ${renderTestimonial(t('testimonial3_text'), t('testimonial3_author'))}
      </div>
    </div>
  </section>

  <!-- CTA Section -->
  <section class="py-16 bg-gradient-to-r from-teal-600 to-emerald-500 text-white">
    <div class="max-w-4xl mx-auto text-center px-4">
      <h2 class="text-3xl md:text-4xl font-bold mb-6">Comece sua jornada de transforma\u00e7\u00e3o hoje</h2>
      <p class="text-xl text-teal-100 mb-8">Assine e tenha acesso a todos os conte\u00fados e ferramentas da plataforma.</p>
      <button onclick="navigate('plans')" class="bg-white text-teal-700 px-10 py-4 rounded-xl font-bold text-lg hover:bg-teal-50 transition shadow-lg">
        ${t('hero_secondary_cta')}
      </button>
    </div>
  </section>`;
}

function renderFeatureCard(emoji, title, desc, link) {
  return `
  <div onclick="navigate('${link}')" class="bg-white p-8 rounded-2xl shadow-sm hover:shadow-lg border border-gray-100 cursor-pointer transition-all hover:-translate-y-1 group">
    <div class="text-4xl mb-4">${emoji}</div>
    <h3 class="text-xl font-bold text-gray-800 mb-3 group-hover:text-teal-600 transition">${title}</h3>
    <p class="text-gray-600 leading-relaxed">${desc}</p>
  </div>`;
}

function renderTestimonial(text, author) {
  return `
  <div class="bg-gray-50 p-8 rounded-2xl border border-gray-100">
    <div class="text-teal-500 mb-4">
      <svg class="w-8 h-8" fill="currentColor" viewBox="0 0 24 24"><path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983z"/></svg>
    </div>
    <p class="text-gray-700 italic mb-4 leading-relaxed">${text}</p>
    <p class="text-teal-700 font-semibold">${author}</p>
  </div>`;
}

// Foto salva pelo painel (data URL) ou a foto padrão do site.
function fotoProfissional(site) {
  return /^data:image\//.test(site.fotoUrl || '') ? site.fotoUrl : 'foto.jpg';
}

function tipoBadge(colecao, tipo) {
  const info = window.SV_TIPOS[colecao][tipo] || { rotulo: tipo, cor: 'bg-gray-100 text-gray-700' };
  return `<span class="text-xs px-2 py-1 rounded-full ${info.cor} font-medium">${esc(info.rotulo)}</span>`;
}

// Botão de acesso dos cards: liberado para quem tem conta (abre o link, se houver); senão, bloqueado.
function accessButton(item, label) {
  if (!(item.liberado && app.isLoggedIn)) {
    return `<button class="w-full py-2.5 rounded-xl bg-gray-100 text-gray-500 cursor-not-allowed font-medium text-sm transition">${t('courses_locked')}</button>`;
  }
  const cls = 'w-full py-2.5 rounded-xl bg-teal-600 text-white hover:bg-teal-700 font-medium text-sm transition';
  const url = safeUrl(item.link);
  return url
    ? `<a href="${esc(url)}" target="_blank" rel="noopener" class="block text-center ${cls}">${label}</a>`
    : `<button class="${cls}">${label}</button>`;
}

function emptyState() {
  return `<p class="text-center text-gray-500 py-12">${t('courses_empty')}</p>`;
}

function renderCourses() {
  const courses = content.cursos;

  return `
  <section class="py-16 bg-gray-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center mb-12">
        <h1 class="text-3xl md:text-4xl font-bold text-gray-800 mb-4">${t('courses_title')}</h1>
        <p class="text-lg text-gray-600">${t('courses_subtitle')}</p>
      </div>
      <div class="flex justify-center gap-3 mb-10 flex-wrap">
        <button class="px-5 py-2 rounded-full bg-teal-600 text-white font-medium text-sm">${t('courses_filter_all')}</button>
        <button class="px-5 py-2 rounded-full bg-white text-gray-600 font-medium text-sm border hover:border-teal-300 transition">${t('courses_filter_courses')}</button>
        <button class="px-5 py-2 rounded-full bg-white text-gray-600 font-medium text-sm border hover:border-teal-300 transition">${t('courses_filter_videos')}</button>
      </div>
      ${courses.length ? '' : emptyState()}
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        ${courses.map(c => `
          <div class="bg-white rounded-2xl shadow-sm hover:shadow-lg border border-gray-100 overflow-hidden transition-all hover:-translate-y-1 group">
            <div class="h-40 bg-gradient-to-br from-teal-50 to-emerald-50 flex items-center justify-center">
              <span class="text-6xl">${esc(c.icone)}</span>
            </div>
            <div class="p-6">
              <div class="flex items-center gap-2 mb-2">
                ${tipoBadge('cursos', c.tipo)}
                ${Number(c.aulas) > 0 ? `<span class="text-xs text-gray-500">${Number(c.aulas)} ${t('courses_lessons')}</span>` : ''}
                ${Number(c.duracao) > 0 ? `<span class="text-xs text-gray-500">${Number(c.duracao)} ${t('courses_duration')}</span>` : ''}
              </div>
              <h3 class="text-lg font-bold text-gray-800 mb-2 group-hover:text-teal-600 transition">${esc(c.titulo)}</h3>
              <p class="text-gray-600 text-sm mb-4">${esc(c.descricao)}</p>
              ${accessButton(c, t('courses_start'))}
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  </section>`;
}

function renderMaterials() {
  const materials = content.materiais;

  return `
  <section class="py-16 bg-gray-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center mb-12">
        <h1 class="text-3xl md:text-4xl font-bold text-gray-800 mb-4">${t('materials_title')}</h1>
        <p class="text-lg text-gray-600">${t('materials_subtitle')}</p>
      </div>
      <div class="flex justify-center gap-3 mb-10 flex-wrap">
        <button class="px-5 py-2 rounded-full bg-teal-600 text-white font-medium text-sm">${t('materials_filter_all')}</button>
        <button class="px-5 py-2 rounded-full bg-white text-gray-600 font-medium text-sm border hover:border-teal-300 transition">${t('materials_filter_ebooks')}</button>
        <button class="px-5 py-2 rounded-full bg-white text-gray-600 font-medium text-sm border hover:border-teal-300 transition">${t('materials_filter_articles')}</button>
        <button class="px-5 py-2 rounded-full bg-white text-gray-600 font-medium text-sm border hover:border-teal-300 transition">${t('materials_filter_guides')}</button>
      </div>
      ${materials.length ? '' : emptyState()}
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        ${materials.map(m => `
          <div class="bg-white rounded-2xl shadow-sm hover:shadow-lg border border-gray-100 overflow-hidden transition-all hover:-translate-y-1 group">
            <div class="h-36 bg-gradient-to-br from-amber-50 to-orange-50 flex items-center justify-center">
              <span class="text-5xl">${esc(m.icone)}</span>
            </div>
            <div class="p-6">
              <div class="flex items-center gap-2 mb-3">
                ${tipoBadge('materiais', m.tipo)}
                ${Number(m.paginas) > 0 ? `<span class="text-xs text-gray-500">${Number(m.paginas)} ${t('materials_pages')}</span>` : ''}
              </div>
              <h3 class="text-lg font-bold text-gray-800 mb-2 group-hover:text-teal-600 transition">${esc(m.titulo)}</h3>
              <p class="text-gray-600 text-sm mb-4">${esc(m.descricao)}</p>
              ${accessButton(m, m.tipo === 'ebook' ? t('materials_download') : t('materials_read'))}
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  </section>`;
}

function renderActivities() {
  const activities = content.atividades;

  return `
  <section class="py-16 bg-gray-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center mb-12">
        <h1 class="text-3xl md:text-4xl font-bold text-gray-800 mb-4">${t('activities_title')}</h1>
        <p class="text-lg text-gray-600">${t('activities_subtitle')}</p>
      </div>
      <div class="flex justify-center gap-3 mb-10 flex-wrap">
        <button class="px-5 py-2 rounded-full bg-teal-600 text-white font-medium text-sm">${t('activities_filter_all')}</button>
        <button class="px-5 py-2 rounded-full bg-white text-gray-600 font-medium text-sm border hover:border-teal-300 transition">${t('activities_filter_breathing')}</button>
        <button class="px-5 py-2 rounded-full bg-white text-gray-600 font-medium text-sm border hover:border-teal-300 transition">${t('activities_filter_journal')}</button>
        <button class="px-5 py-2 rounded-full bg-white text-gray-600 font-medium text-sm border hover:border-teal-300 transition">${t('activities_filter_meditation')}</button>
        <button class="px-5 py-2 rounded-full bg-white text-gray-600 font-medium text-sm border hover:border-teal-300 transition">${t('activities_filter_exercises')}</button>
      </div>
      ${activities.length ? '' : emptyState()}
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        ${activities.map(a => {
          const url = safeUrl(a.link);
          const cls = 'px-5 py-2 rounded-xl bg-teal-600 text-white font-medium text-sm hover:bg-teal-700 transition';
          return `
          <div class="bg-white rounded-2xl shadow-sm hover:shadow-lg border border-gray-100 p-6 transition-all hover:-translate-y-1 group">
            <div class="flex items-start justify-between mb-4">
              <span class="text-4xl">${esc(a.icone)}</span>
              ${tipoBadge('atividades', a.tipo)}
            </div>
            <h3 class="text-lg font-bold text-gray-800 mb-2 group-hover:text-teal-600 transition">${esc(a.titulo)}</h3>
            <p class="text-gray-600 text-sm mb-4">${esc(a.descricao)}</p>
            <div class="flex items-center justify-between">
              <span class="text-sm text-gray-500">${Number(a.duracao) > 0 ? `&#9201; ${Number(a.duracao)} ${t('activities_duration')}` : ''}</span>
              ${url
                ? `<a href="${esc(url)}" target="_blank" rel="noopener" class="${cls}">${t('activities_start')}</a>`
                : `<button class="${cls}">${t('activities_start')}</button>`}
            </div>
          </div>`;
        }).join('')}
      </div>
    </div>
  </section>`;
}

function renderSchedule() {
  const inputCls = 'w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition';
  return `
  <section class="py-16 bg-gray-50">
    <div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center mb-12">
        <h1 class="text-3xl md:text-4xl font-bold text-gray-800 mb-4">${t('schedule_title')}</h1>
        <p class="text-lg text-gray-600">${t('schedule_subtitle')}</p>
      </div>
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
          </div>
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
  const botao = url
    ? `<a href="${esc(url)}" target="_blank" rel="noopener" class="block text-center ${btnCls}">${t('plans_subscribe')}</a>`
    : `<button onclick="navigate('signup')" class="${btnCls}">${t('plans_subscribe')}</button>`;

  return `
        <div class="bg-white rounded-2xl p-8 relative ${p.destaque ? 'shadow-lg border-2 border-teal-500 md:scale-105' : 'shadow-sm border border-gray-200 hover:shadow-lg transition'}">
          ${p.destaque ? `<div class="absolute -top-3 left-1/2 -translate-x-1/2 bg-teal-600 text-white text-xs font-bold px-4 py-1 rounded-full">${t('plans_popular')}</div>` : ''}
          <h3 class="text-xl font-bold text-gray-800 mb-2">${esc(p.nome)}</h3>
          <div class="mb-6">
            <span class="text-4xl font-bold text-gray-800">${t('plans_currency')} ${formatPreco(preco)}</span>
            ${preco > 0 ? `<span class="text-gray-500">${t('plans_period')}</span>` : ''}
          </div>
          <ul class="space-y-3 mb-8">
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
          <button onclick="app.billingCycle = app.billingCycle === 'monthly' ? 'yearly' : 'monthly'; render();" class="relative w-14 h-7 rounded-full transition ${app.billingCycle === 'yearly' ? 'bg-teal-600' : 'bg-gray-300'}">
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

function renderLogin() {
  return `
  <section class="py-16 bg-gray-50 min-h-screen flex items-center">
    <div class="max-w-md mx-auto px-4 w-full">
      <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
        <div class="text-center mb-8">
          <div class="w-16 h-16 bg-gradient-to-br from-teal-500 to-emerald-500 rounded-2xl mx-auto mb-4 flex items-center justify-center">
            <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
            </svg>
          </div>
          <h1 class="text-2xl font-bold text-gray-800">${t('login_title')}</h1>
        </div>
        <form id="login-form" class="space-y-5">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">${t('login_email')}</label>
            <input type="email" id="login-email" required class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition" placeholder="seu@email.com">
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">${t('login_password')}</label>
            <input type="password" required class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition" placeholder="********">
          </div>
          <div class="flex justify-end">
            <a class="text-sm text-teal-600 hover:text-teal-700 cursor-pointer">${t('login_forgot')}</a>
          </div>
          <button type="submit" class="w-full bg-teal-600 text-white py-3 rounded-xl font-semibold hover:bg-teal-700 transition shadow-md">${t('login_submit')}</button>
        </form>
        <div class="mt-6 text-center text-sm text-gray-600">
          ${t('login_no_account')} <a onclick="navigate('signup')" class="text-teal-600 font-semibold hover:text-teal-700 cursor-pointer">${t('login_signup_link')}</a>
        </div>
      </div>
    </div>
  </section>`;
}

function renderSignup() {
  return `
  <section class="py-16 bg-gray-50 min-h-screen flex items-center">
    <div class="max-w-md mx-auto px-4 w-full">
      <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
        <div class="text-center mb-8">
          <div class="w-16 h-16 bg-gradient-to-br from-teal-500 to-emerald-500 rounded-2xl mx-auto mb-4 flex items-center justify-center">
            <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
            </svg>
          </div>
          <h1 class="text-2xl font-bold text-gray-800">${t('signup_title')}</h1>
        </div>
        <form id="signup-form" class="space-y-5">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">${t('signup_name')}</label>
            <input type="text" required class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition" placeholder="Joao Silva">
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">${t('signup_email')}</label>
            <input type="email" id="signup-email" required class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition" placeholder="seu@email.com">
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">${t('signup_password')}</label>
            <input type="password" required class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition" placeholder="********">
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">${t('signup_confirm')}</label>
            <input type="password" required class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition" placeholder="********">
          </div>
          <button type="submit" class="w-full bg-teal-600 text-white py-3 rounded-xl font-semibold hover:bg-teal-700 transition shadow-md">${t('signup_submit')}</button>
        </form>
        <div class="mt-6 text-center text-sm text-gray-600">
          ${t('signup_has_account')} <a onclick="navigate('login')" class="text-teal-600 font-semibold hover:text-teal-700 cursor-pointer">${t('signup_login_link')}</a>
        </div>
      </div>
    </div>
  </section>`;
}
