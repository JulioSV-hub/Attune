// Main Application Router and State
const app = {
  currentPage: 'home',
  isLoggedIn: false,
  user: null,
  billingCycle: 'monthly',
};

// Conteúdo editável pelo painel (site, planos, cursos, materiais, atividades).
// Preenchido por js/store.js, que chama startApp quando termina de carregar.
let content = null;

// Escapa texto vindo do banco antes de inserir no HTML.
function esc(value) {
  return String(value ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

// Aceita apenas links https; qualquer outra coisa vira vazio.
function safeUrl(value) {
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

// Simple SPA Router
function navigate(page) {
  app.currentPage = page;
  render();
  window.scrollTo(0, 0);
  // Update URL hash
  window.location.hash = page;
}

// Mock login
function mockLogin(email) {
  app.isLoggedIn = true;
  app.user = { name: email.split('@')[0], email: email };
  localStorage.setItem('sobrevoce_user', JSON.stringify(app.user));
  navigate('home');
}

function mockLogout() {
  app.isLoggedIn = false;
  app.user = null;
  localStorage.removeItem('sobrevoce_user');
  navigate('home');
}

// Check if user was logged in
function checkAuth() {
  const saved = localStorage.getItem('sobrevoce_user');
  if (saved) {
    app.user = JSON.parse(saved);
    app.isLoggedIn = true;
  }
}

// Render the full app
function render() {
  const root = document.getElementById('app');
  root.innerHTML = `
    ${renderNav()}
    <main class="min-h-screen">
      ${renderPage()}
    </main>
    ${renderFooter()}
  `;
  attachEventListeners();
}

function renderNav() {
  return `
  <nav class="bg-gradient-to-r from-teal-700 to-teal-600 text-white shadow-lg sticky top-0 z-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-16">
        <div class="flex items-center gap-2 cursor-pointer" onclick="navigate('home')">
          <div class="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
            <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
            </svg>
          </div>
          <span class="font-bold text-xl tracking-tight">Sobre você</span>
        </div>

        <!-- Desktop Nav -->
        <div class="hidden md:flex items-center gap-1">
          <a onclick="navigate('home')" class="nav-link px-3 py-2 rounded-md text-sm font-medium hover:bg-white/10 cursor-pointer transition ${app.currentPage === 'home' ? 'bg-white/20' : ''}">${t('nav_home')}</a>
          <a onclick="navigate('courses')" class="nav-link px-3 py-2 rounded-md text-sm font-medium hover:bg-white/10 cursor-pointer transition ${app.currentPage === 'courses' ? 'bg-white/20' : ''}">${t('nav_courses')}</a>
          <a onclick="navigate('materials')" class="nav-link px-3 py-2 rounded-md text-sm font-medium hover:bg-white/10 cursor-pointer transition ${app.currentPage === 'materials' ? 'bg-white/20' : ''}">${t('nav_materials')}</a>
          <a onclick="navigate('activities')" class="nav-link px-3 py-2 rounded-md text-sm font-medium hover:bg-white/10 cursor-pointer transition ${app.currentPage === 'activities' ? 'bg-white/20' : ''}">${t('nav_activities')}</a>
          <a onclick="navigate('schedule')" class="nav-link px-3 py-2 rounded-md text-sm font-medium hover:bg-white/10 cursor-pointer transition ${app.currentPage === 'schedule' ? 'bg-white/20' : ''}">${t('nav_schedule')}</a>
          <a onclick="navigate('plans')" class="nav-link px-3 py-2 rounded-md text-sm font-medium hover:bg-white/10 cursor-pointer transition ${app.currentPage === 'plans' ? 'bg-white/20' : ''}">${t('nav_plans')}</a>
        </div>

        <div class="flex items-center gap-3">
          ${app.isLoggedIn
            ? `<div class="flex items-center gap-2">
                <span class="text-sm hidden sm:inline">${esc(app.user.name)}</span>
                <button onclick="mockLogout()" class="text-sm bg-white/10 hover:bg-white/20 px-3 py-1 rounded-full transition">${t('nav_logout')}</button>
              </div>`
            : `<button onclick="navigate('login')" class="text-sm bg-white/20 hover:bg-white/30 px-4 py-1.5 rounded-full transition font-medium">${t('nav_login')}</button>`
          }
          <!-- Mobile menu button -->
          <button onclick="toggleMobileMenu()" class="md:hidden p-2 rounded-md hover:bg-white/10">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
            </svg>
          </button>
        </div>
      </div>

      <!-- Mobile Nav -->
      <div id="mobile-menu" class="md:hidden hidden pb-4">
        <div class="flex flex-col gap-1">
          <a onclick="navigate('home'); closeMobileMenu();" class="px-3 py-2 rounded-md text-sm font-medium hover:bg-white/10 cursor-pointer">${t('nav_home')}</a>
          <a onclick="navigate('courses'); closeMobileMenu();" class="px-3 py-2 rounded-md text-sm font-medium hover:bg-white/10 cursor-pointer">${t('nav_courses')}</a>
          <a onclick="navigate('materials'); closeMobileMenu();" class="px-3 py-2 rounded-md text-sm font-medium hover:bg-white/10 cursor-pointer">${t('nav_materials')}</a>
          <a onclick="navigate('activities'); closeMobileMenu();" class="px-3 py-2 rounded-md text-sm font-medium hover:bg-white/10 cursor-pointer">${t('nav_activities')}</a>
          <a onclick="navigate('schedule'); closeMobileMenu();" class="px-3 py-2 rounded-md text-sm font-medium hover:bg-white/10 cursor-pointer">${t('nav_schedule')}</a>
          <a onclick="navigate('plans'); closeMobileMenu();" class="px-3 py-2 rounded-md text-sm font-medium hover:bg-white/10 cursor-pointer">${t('nav_plans')}</a>
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
  return `
  <footer class="bg-gray-900 text-gray-300 py-12">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <div class="flex items-center gap-2 mb-4">
            <div class="w-8 h-8 bg-teal-600 rounded-lg flex items-center justify-center">
              <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
              </svg>
            </div>
            <span class="font-bold text-xl text-white">Sobre você</span>
          </div>
          <p class="text-sm text-gray-400">${t('footer_location')}</p>
        </div>
        <div>
          <h4 class="font-semibold text-white mb-3">Links</h4>
          <div class="flex flex-col gap-2 text-sm">
            <a onclick="navigate('plans')" class="hover:text-white cursor-pointer transition">${t('nav_plans')}</a>
            <a onclick="navigate('courses')" class="hover:text-white cursor-pointer transition">${t('nav_courses')}</a>
            <a onclick="navigate('schedule')" class="hover:text-white cursor-pointer transition">${t('nav_schedule')}</a>
          </div>
        </div>
        <div>
          <h4 class="font-semibold text-white mb-3">Legal</h4>
          <div class="flex flex-col gap-2 text-sm">
            <a class="hover:text-white cursor-pointer transition">${t('footer_privacy')}</a>
            <a class="hover:text-white cursor-pointer transition">${t('footer_terms')}</a>
            <a class="hover:text-white cursor-pointer transition">${t('footer_contact')}</a>
            <a href="admin/" class="hover:text-white transition">Área da profissional</a>
          </div>
        </div>
      </div>
      <div class="border-t border-gray-700 mt-8 pt-8 text-center text-sm text-gray-500">
        &copy; 2026 Sobre você. ${t('footer_rights')}
      </div>
    </div>
  </footer>`;
}

function renderPage() {
  switch (app.currentPage) {
    case 'home': return renderHome();
    case 'courses': return renderCourses();
    case 'materials': return renderMaterials();
    case 'activities': return renderActivities();
    case 'schedule': return renderSchedule();
    case 'plans': return renderPlans();
    case 'login': return renderLogin();
    case 'signup': return renderSignup();
    default: return renderHome();
  }
}

function attachEventListeners() {
  // Attach form listeners after render
  const loginForm = document.getElementById('login-form');
  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = document.getElementById('login-email').value;
      mockLogin(email);
    });
  }

  const signupForm = document.getElementById('signup-form');
  if (signupForm) {
    signupForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = document.getElementById('signup-email').value;
      mockLogin(email);
    });
  }

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

    const numero = String(site.whatsapp || '').replace(/\D/g, '');
    if (numero.length < 12) {
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
    window.open(`https://wa.me/${numero}?text=${encodeURIComponent(linhas.join('\n'))}`, '_blank', 'noopener');
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
  checkAuth();
  const hash = window.location.hash.slice(1);
  if (hash) app.currentPage = hash;
  render();
}

// Se o carregamento do conteúdo falhar por completo (ex.: módulo bloqueado), mostra o conteúdo inicial.
setTimeout(() => startApp(structuredClone(window.SV_DEFAULTS)), 10000);

window.addEventListener('hashchange', () => {
  const hash = window.location.hash.slice(1);
  if (hash && hash !== app.currentPage) {
    app.currentPage = hash;
    if (content) render();
  }
});
