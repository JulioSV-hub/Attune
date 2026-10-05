// Main Application Router and State
const app = {
  currentPage: 'home',
  billingCycle: 'monthly',
  filtro: 'todos', // filtro por tipo nas páginas de cursos, materiais e atividades
};

// Conteúdo editável pelo painel (site, planos, cursos, materiais, atividades).
// Preenchido por js/store.js, que chama startApp quando termina de carregar.
let content = null;

// Escapa texto vindo do banco antes de inserir no HTML.
function esc(value) {
  return String(value ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

// Página interna do site (ex.: e-books), aberta na mesma aba.
const LINK_INTERNO = /^ebooks\/[a-z0-9-]+\.html$/;

// Aceita apenas links https ou páginas internas; qualquer outra coisa vira vazio.
function safeUrl(value) {
  if (LINK_INTERNO.test(String(value || '').trim())) return String(value).trim();
  try {
    const url = new URL(String(value || '').trim());
    return url.protocol === 'https:' ? url.href : '';
  } catch {
    return '';
  }
}

function formatPreco(n) {
  const v = Number(n) || 0;
  return v.toLocaleString('pt-BR', { minimumFractionDigits: v % 1 ? 2 : 0, maximumFractionDigits: 2 });
}

// Contatos da profissional (vazios até serem preenchidos no painel).
function whatsappNumero() {
  const n = String(content.site.whatsapp || '').replace(/\D/g, '');
  return n.length >= 12 ? n : '';
}

function whatsappLink(texto) {
  const n = whatsappNumero();
  return n ? `https://wa.me/${n}${texto ? `?text=${encodeURIComponent(texto)}` : ''}` : '';
}

function instagramLink() {
  const u = String(content.site.instagram || '').trim().replace(/^@/, '');
  return /^[A-Za-z0-9._]{1,30}$/.test(u) ? `https://www.instagram.com/${u}/` : '';
}

function emailValido() {
  const e = String(content.site.email || '').trim();
  return /^[^\s@<>"]+@[^\s@<>"]+\.[^\s@<>"]+$/.test(e) ? e : '';
}

// Páginas disponíveis (a de planos só aparece quando ativada no painel).
function paginaExiste(page) {
  if (page === 'plans') return content.planosAtiva;
  return ['home', 'courses', 'materials', 'activities', 'schedule', 'privacidade'].includes(page);
}

// Simple SPA Router
function navigate(page) {
  app.currentPage = paginaExiste(page) ? page : 'home';
  app.filtro = 'todos';
  render();
  window.scrollTo(0, 0);
  window.location.hash = app.currentPage;
}

function setFiltro(tipo) {
  app.filtro = tipo;
  render();
}

// Render the full app
function render() {
  const root = document.getElementById('app');
  root.innerHTML = `
    ${outubroRosa() ? renderOutubroRosaFaixa() : ''}
    ${renderNav()}
    <main class="min-h-screen">
      ${renderPage()}
    </main>
    ${renderFooter()}
    ${renderWhatsappFlutuante()}
  `;
  attachEventListeners();
}

// Campanha Outubro Rosa: aparece só durante o mês de outubro.
function outubroRosa() {
  return new Date().getMonth() === 9;
}

// Laço da campanha em SVG (o emoji de laço aparece amarelo em alguns sistemas).
function lacoRosa(cls, cor) {
  return `<svg class="${cls}" viewBox="0 0 64 64" aria-hidden="true"><path fill="${cor}" d="M32 4c-7 0-12 5-12 12 0 6 4 12 8 18L14 58l8 2 10-16 10 16 8-2-14-24c4-6 8-12 8-18 0-7-5-12-12-12zm0 8c3 0 5 2 5 5 0 3-2 7-5 11-3-4-5-8-5-11 0-3 2-5 5-5z"/></svg>`;
}

function renderOutubroRosaFaixa() {
  return `
  <div class="bg-pink-500 text-white text-sm font-medium px-4 py-2 flex items-center justify-center gap-2 text-center">
    ${lacoRosa('w-4 h-4 flex-shrink-0', '#fff')}
    <span>Outubro Rosa: cuide de você e incentive as mulheres ao seu redor a fazerem seus exames.</span>
  </div>`;
}

const ICONE_WHATSAPP = '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" class="w-full h-full"><path d="M17.47 14.38c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.48-.89-.79-1.49-1.77-1.66-2.07-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48s1.07 2.88 1.21 3.07c.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.69.63.71.23 1.36.2 1.87.12.57-.09 1.76-.72 2.01-1.41.25-.7.25-1.29.17-1.41-.07-.13-.27-.2-.57-.35zM12.05 21.5h-.01a9.45 9.45 0 01-4.82-1.32l-.35-.21-3.58.94.96-3.49-.23-.36a9.43 9.43 0 01-1.45-5.03c0-5.22 4.25-9.46 9.48-9.46 2.53 0 4.9.99 6.69 2.78a9.4 9.4 0 012.77 6.69c0 5.22-4.25 9.46-9.46 9.46zm8.05-17.51A11.32 11.32 0 0012.05.65C5.78.65.67 5.75.67 12.03c0 2 .52 3.96 1.52 5.69L.57 23.65l6.07-1.59a11.35 11.35 0 005.41 1.38h.01c6.27 0 11.38-5.1 11.38-11.38 0-3.04-1.18-5.9-3.34-8.07z"/></svg>';
const ICONE_INSTAGRAM = '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" class="w-full h-full"><path d="M12 2.16c3.2 0 3.58.01 4.85.07 1.17.05 1.8.25 2.23.41.56.22.96.48 1.38.9.42.42.68.82.9 1.38.16.42.36 1.06.41 2.23.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.05 1.17-.25 1.8-.41 2.23-.22.56-.48.96-.9 1.38-.42.42-.82.68-1.38.9-.42.16-1.06.36-2.23.41-1.27.06-1.65.07-4.85.07s-3.58-.01-4.85-.07c-1.17-.05-1.8-.25-2.23-.41a3.72 3.72 0 01-1.38-.9 3.72 3.72 0 01-.9-1.38c-.16-.42-.36-1.06-.41-2.23C2.17 15.58 2.16 15.2 2.16 12s.01-3.58.07-4.85c.05-1.17.25-1.8.41-2.23.22-.56.48-.96.9-1.38.42-.42.82-.68 1.38-.9.42-.16 1.06-.36 2.23-.41C8.42 2.17 8.8 2.16 12 2.16zM12 0C8.74 0 8.33.01 7.05.07 5.78.13 4.9.33 4.14.63a5.88 5.88 0 00-2.13 1.38A5.88 5.88 0 00.63 4.14C.33 4.9.13 5.78.07 7.05.01 8.33 0 8.74 0 12s.01 3.67.07 4.95c.06 1.27.26 2.15.56 2.91.3.79.71 1.46 1.38 2.13a5.88 5.88 0 002.13 1.38c.76.3 1.64.5 2.91.56C8.33 23.99 8.74 24 12 24s3.67-.01 4.95-.07c1.27-.06 2.15-.26 2.91-.56a5.88 5.88 0 002.13-1.38 5.88 5.88 0 001.38-2.13c.3-.76.5-1.64.56-2.91.06-1.28.07-1.69.07-4.95s-.01-3.67-.07-4.95c-.06-1.27-.26-2.15-.56-2.91a5.88 5.88 0 00-1.38-2.13A5.88 5.88 0 0019.86.63C19.1.33 18.22.13 16.95.07 15.67.01 15.26 0 12 0zm0 5.84a6.16 6.16 0 100 12.32 6.16 6.16 0 000-12.32zM12 16a4 4 0 110-8 4 4 0 010 8zm6.4-11.85a1.44 1.44 0 100 2.88 1.44 1.44 0 000-2.88z"/></svg>';

function renderWhatsappFlutuante() {
  const link = whatsappLink(`Olá, ${content.site.profissional}! Vim pelo site e gostaria de mais informações.`);
  if (!link) return '';
  return `
  <a href="${esc(link)}" target="_blank" rel="noopener" aria-label="Conversar pelo WhatsApp" title="Conversar pelo WhatsApp"
     class="fixed bottom-5 right-5 z-40 w-14 h-14 p-3 rounded-full bg-[#25D366] text-white shadow-lg hover:scale-105 transition">
    ${ICONE_WHATSAPP}
  </a>`;
}

function navItens() {
  return [
    ['home', t('nav_home')],
    ['courses', t('nav_courses')],
    ['materials', t('nav_materials')],
    ['activities', t('nav_activities')],
    ['schedule', t('nav_schedule')],
    ...(content.planosAtiva ? [['plans', t('nav_plans')]] : []),
  ];
}

function renderNav() {
  return `
  <nav class="bg-gradient-to-r from-teal-700 to-teal-600 text-white shadow-lg sticky top-0 z-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-16">
        <a href="#home" onclick="navigate('home'); return false;" class="flex items-center gap-2">
          <div class="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
            <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
            </svg>
          </div>
          <span class="font-bold text-xl tracking-tight">Sobre você</span>
        </a>

        <!-- Desktop Nav -->
        <div class="hidden md:flex items-center gap-1">
          ${navItens().map(([page, rotulo]) => `
          <a href="#${page}" onclick="navigate('${page}'); return false;" class="nav-link px-3 py-2 rounded-md text-sm font-medium hover:bg-white/10 transition ${app.currentPage === page ? 'bg-white/20' : ''}">${rotulo}</a>`).join('')}
        </div>

        <div class="flex items-center gap-3">
          <a href="#schedule" onclick="navigate('schedule'); return false;" class="hidden sm:inline-block text-sm bg-white text-teal-700 hover:bg-teal-50 px-4 py-1.5 rounded-full transition font-semibold">${t('nav_cta')}</a>
          <!-- Mobile menu button -->
          <button onclick="toggleMobileMenu()" class="md:hidden p-2 rounded-md hover:bg-white/10" aria-label="Abrir menu">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
            </svg>
          </button>
        </div>
      </div>

      <!-- Mobile Nav -->
      <div id="mobile-menu" class="md:hidden hidden pb-4">
        <div class="flex flex-col gap-1">
          ${navItens().map(([page, rotulo]) => `
          <a href="#${page}" onclick="navigate('${page}'); closeMobileMenu(); return false;" class="px-3 py-2 rounded-md text-sm font-medium hover:bg-white/10">${rotulo}</a>`).join('')}
        </div>
      </div>
    </div>
  </nav>`;
}

function toggleMobileMenu() {
  const menu = document.getElementById('mobile-menu');
  if (menu) menu.classList.toggle('hidden');
}

function closeMobileMenu() {
  const menu = document.getElementById('mobile-menu');
  if (menu) menu.classList.add('hidden');
}

function renderFooter() {
  const site = content.site;
  const linkCls = 'hover:text-white transition';
  const wa = whatsappLink();
  const ig = instagramLink();
  const email = emailValido();
  const contatos = [
    wa ? `<a href="${esc(wa)}" target="_blank" rel="noopener" class="${linkCls} flex items-center gap-2"><span class="w-4 h-4">${ICONE_WHATSAPP}</span> WhatsApp</a>` : '',
    ig ? `<a href="${esc(ig)}" target="_blank" rel="noopener" class="${linkCls} flex items-center gap-2"><span class="w-4 h-4">${ICONE_INSTAGRAM}</span> Instagram</a>` : '',
    email ? `<a href="mailto:${esc(email)}" class="${linkCls} break-all">${esc(email)}</a>` : '',
  ].filter(Boolean);

  return `
  <footer class="bg-gray-900 text-gray-300 pt-12 pb-8">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
        <div class="md:col-span-2">
          <div class="flex items-center gap-2 mb-4">
            <div class="w-8 h-8 bg-teal-600 rounded-lg flex items-center justify-center">
              <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
              </svg>
            </div>
            <span class="font-bold text-xl text-white">Sobre você</span>
          </div>
          <p class="text-sm text-gray-400 mb-1">${t('footer_location')}</p>
          <p class="text-sm text-gray-400">${[site.profissional, site.profissao, site.registro].filter(Boolean).map(esc).join(' &middot; ')}</p>
        </div>
        <div>
          <h4 class="font-semibold text-white mb-3">Links</h4>
          <div class="flex flex-col gap-2 text-sm">
            ${navItens().filter(([p]) => p !== 'home').map(([page, rotulo]) =>
              `<a href="#${page}" onclick="navigate('${page}'); return false;" class="${linkCls}">${rotulo}</a>`).join('')}
          </div>
        </div>
        <div>
          <h4 class="font-semibold text-white mb-3">${t('footer_contact')}</h4>
          <div class="flex flex-col gap-2 text-sm">
            ${contatos.join('')}
            <a href="#privacidade" onclick="navigate('privacidade'); return false;" class="${linkCls}">${t('footer_privacy')}</a>
            <a href="admin/" class="${linkCls}">Área da profissional</a>
          </div>
        </div>
      </div>
      <div class="border-t border-gray-700 mt-8 pt-6 text-center text-xs text-gray-400 space-y-2">
        <p>${t('footer_crise')}</p>
        <p class="text-gray-500">&copy; ${new Date().getFullYear()} Sobre você. ${t('footer_rights')}</p>
      </div>
    </div>
  </footer>`;
}

function renderPage() {
  switch (app.currentPage) {
    case 'courses': return renderCourses();
    case 'materials': return renderMaterials();
    case 'activities': return renderActivities();
    case 'schedule': return renderSchedule();
    case 'plans': return renderPlans();
    case 'privacidade': return renderPrivacidade();
    default: return renderHome();
  }
}

function attachEventListeners() {
  const scheduleForm = document.getElementById('schedule-form');
  if (scheduleForm) setupScheduleForm(scheduleForm);
}

// ---------------------------------------------------------------------------
// Agendamento: abre o WhatsApp da profissional com a mensagem pronta e registra o pedido no painel.

function isoLocal(d) {
  const pad = n => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

function parseLocal(iso) {
  const [a, m, d] = iso.split('-').map(Number);
  return new Date(a, m - 1, d);
}

// Horários do dia da semana; no dia de hoje, só os que começam daqui a mais de 1 hora.
function horariosDisponiveis(iso) {
  let lista = [...((content.site.horarios || {})[parseLocal(iso).getDay()] || [])].sort();
  if (iso === isoLocal(new Date())) {
    const agora = new Date();
    const minutosAgora = agora.getHours() * 60 + agora.getMinutes();
    lista = lista.filter(h => {
      const [hh, mm] = h.split(':').map(Number);
      return hh * 60 + mm > minutosAgora + 60;
    });
  }
  return lista;
}

function setupScheduleForm(form) {
  const dataInput = form.querySelector('#sched-data');
  const horarioSelect = form.querySelector('#sched-horario');
  const erro = form.querySelector('#sched-erro');
  const ok = form.querySelector('#sched-ok');
  const enviarBtn = form.querySelector('button[type=submit]');

  const hoje = new Date();
  const limite = new Date(hoje);
  limite.setMonth(limite.getMonth() + 6);
  dataInput.min = isoLocal(hoje);
  dataInput.max = isoLocal(limite);

  function resetHorarios() {
    horarioSelect.innerHTML = '';
    horarioSelect.add(new Option(t('schedule_time_pick_date'), ''));
    horarioSelect.disabled = true;
  }

  dataInput.addEventListener('change', () => {
    const anterior = horarioSelect.value;
    if (!dataInput.value) return resetHorarios();
    const lista = horariosDisponiveis(dataInput.value);
    horarioSelect.innerHTML = '';
    horarioSelect.disabled = lista.length === 0;
    horarioSelect.add(new Option(lista.length ? t('schedule_time_select') : t('schedule_time_none'), ''));
    lista.forEach(h => horarioSelect.add(new Option(h, h)));
    if (lista.includes(anterior)) horarioSelect.value = anterior;
  });

  function mostrarErro(msg, campo) {
    erro.textContent = msg;
    erro.classList.toggle('hidden', !msg);
    if (msg) ok.classList.add('hidden');
    if (campo) campo.focus();
  }

  form.addEventListener('submit', e => {
    e.preventDefault();
    const site = content.site;
    const nome = form.nome.value.trim();
    const email = form.email.value.trim();
    const data = dataInput.value;
    const horario = horarioSelect.value;
    const modalidade = form.modalidade.value === 'presencial' ? t('schedule_type_presencial') : t('schedule_type_online');
    const motivo = form.motivo.value.trim();

    if (nome.length < 2) return mostrarErro('Informe seu nome.', form.nome);
    if (email && !form.email.checkValidity()) return mostrarErro('E-mail inválido.', form.email);
    if (!data) return mostrarErro('Escolha a data desejada.', dataInput);
    if (data < dataInput.min || data > dataInput.max) {
      return mostrarErro('Escolha uma data entre hoje e os próximos 6 meses.', dataInput);
    }
    if (!horariosDisponiveis(data).length) return mostrarErro('Não há atendimento neste dia. Escolha outra data.', dataInput);
    if (!horario) return mostrarErro('Escolha um horário.', horarioSelect);
    if (!form.consentimento.checked) {
      return mostrarErro('Para enviar o pedido, confirme que leu e concorda com a Política de Privacidade.', form.consentimento);
    }

    const numero = whatsappNumero();
    if (!numero) {
      return mostrarErro('O agendamento pelo WhatsApp ainda não está configurado. Tente novamente mais tarde.');
    }
    mostrarErro('');

    const [a, m, d] = data.split('-');
    const diaSemana = parseLocal(data).toLocaleDateString('pt-BR', { weekday: 'long' });
    const linhas = [
      `Olá, ${site.profissional}! Gostaria de agendar uma consulta.`,
      '',
      `*Nome:* ${nome}`,
      email ? `*E-mail:* ${email}` : null,
      `*Data desejada:* ${d}/${m}/${a} (${diaSemana})`,
      `*Horário:* ${horario}`,
      `*Modalidade:* ${modalidade}`,
      motivo ? `*Motivo:* ${motivo}` : null,
    ].filter(l => l !== null);

    // Registra o pedido e, na mesma ação do clique, abre o WhatsApp
    // (abrir depois de aguardar a gravação faria o navegador bloquear a janela).
    const gravacao = window.SV?.criarAgendamento?.({ nome, email, data, horario, modalidade, motivo });
    window.open(whatsappLink(linhas.join('\n')), '_blank', 'noopener');
    if (!gravacao) return;

    enviarBtn.disabled = true;
    gravacao
      .then(() => {
        form.reset();
        resetHorarios();
        ok.classList.remove('hidden');
      })
      .catch(err => {
        console.error(err);
        mostrarErro('O WhatsApp foi aberto, mas não conseguimos registrar o pedido aqui. Envie a mensagem normalmente.');
      })
      .finally(() => { enviarBtn.disabled = false; });
  });
}

// ---------------------------------------------------------------------------
// Inicialização: js/store.js chama startApp com o conteúdo carregado.

function startApp(conteudo) {
  if (content) return;
  content = conteudo;
  const hash = window.location.hash.slice(1);
  if (paginaExiste(hash)) app.currentPage = hash;
  render();
}

// Se o carregamento do conteúdo falhar por completo (ex.: módulo bloqueado), mostra o conteúdo inicial.
setTimeout(() => startApp(structuredClone(window.SV_DEFAULTS)), 10000);

window.addEventListener('hashchange', () => {
  const hash = window.location.hash.slice(1);
  if (!content || !hash || hash === app.currentPage) return;
  app.currentPage = paginaExiste(hash) ? hash : 'home';
  app.filtro = 'todos';
  render();
  window.scrollTo(0, 0);
});
