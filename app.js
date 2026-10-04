// Main Application Router and State
const app = {
  currentPage: 'home',
  isLoggedIn: false,
  user: null,
  billingCycle: 'monthly',
};

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
  const langOptions = currentLang === 'pt' 
    ? '<button onclick="setLanguage(\'en\'); render();" class="text-sm bg-white/10 hover:bg-white/20 px-3 py-1 rounded-full transition">EN</button>'
    : '<button onclick="setLanguage(\'pt\'); render();" class="text-sm bg-white/10 hover:bg-white/20 px-3 py-1 rounded-full transition">PT</button>';

  return `
  <nav class="bg-gradient-to-r from-teal-700 to-teal-600 text-white shadow-lg sticky top-0 z-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-16">
        <div class="flex items-center gap-2 cursor-pointer" onclick="navigate('home')">
          <div class="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
            <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
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
          ${langOptions}
          ${app.isLoggedIn 
            ? `<div class="flex items-center gap-2">
                <span class="text-sm hidden sm:inline">${app.user.name}</span>
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
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
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
  if (scheduleForm) {
    scheduleForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const successMsg = document.getElementById('schedule-success');
      if (successMsg) {
        successMsg.classList.remove('hidden');
        setTimeout(() => successMsg.classList.add('hidden'), 5000);
      }
    });
  }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  checkAuth();
  // Handle hash navigation
  const hash = window.location.hash.slice(1);
  if (hash) app.currentPage = hash;
  render();
});

window.addEventListener('hashchange', () => {
  const hash = window.location.hash.slice(1);
  if (hash && hash !== app.currentPage) {
    app.currentPage = hash;
    render();
  }
});
