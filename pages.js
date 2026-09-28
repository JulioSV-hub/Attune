// Page render functions

function renderHome() {
  return `
  <!-- Hero Section -->
  <section class="relative bg-gradient-to-br from-teal-700 via-teal-600 to-emerald-500 text-white overflow-hidden">
    <div class="absolute inset-0 opacity-10">
      <div class="absolute top-20 left-10 w-72 h-72 bg-white rounded-full blur-3xl"></div>
      <div class="absolute bottom-10 right-10 w-96 h-96 bg-teal-300 rounded-full blur-3xl"></div>
    </div>
    <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
      <div class="text-center max-w-3xl mx-auto">
        <h1 class="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">${t('hero_title')}</h1>
        <p class="text-xl md:text-2xl text-teal-100 mb-10">${t('hero_subtitle')}</p>
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
          <p class="text-lg text-gray-600 mb-8 leading-relaxed">${t('about_text')}</p>
          <div class="grid grid-cols-2 gap-4">
            <div class="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
              <div class="text-teal-600 font-semibold text-sm">${t('about_credential1')}</div>
            </div>
            <div class="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
              <div class="text-teal-600 font-semibold text-sm">${t('about_credential2')}</div>
            </div>
            <div class="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
              <div class="text-teal-600 font-semibold text-sm">${t('about_credential3')}</div>
            </div>
            <div class="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
              <div class="text-teal-600 font-semibold text-sm">${t('about_credential4')}</div>
            </div>
          </div>
        </div>
        <div class="flex justify-center">
          <div class="w-80 h-96 bg-gradient-to-br from-teal-100 to-emerald-100 rounded-2xl flex items-center justify-center shadow-lg overflow-hidden">
            <div class="text-center">
              <div class="w-48 h-48 rounded-full mx-auto mb-4 overflow-hidden border-4 border-white shadow-lg">
                <img src="igor.jpg" alt="Dr. Igor - Psic&oacute;logo" class="w-full h-full object-cover">
              </div>
              <p class="text-teal-700 font-semibold text-lg">Dr. Igor</p>
              <p class="text-teal-600 text-sm">CRP 00/00000</p>
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
      <h2 class="text-3xl md:text-4xl font-bold mb-6">${currentLang === 'pt' ? 'Comece sua jornada de transforma\u00e7\u00e3o hoje' : 'Start your transformation journey today'}</h2>
      <p class="text-xl text-teal-100 mb-8">${currentLang === 'pt' ? 'Assine e tenha acesso a todos os conte\u00fados e ferramentas da plataforma.' : 'Subscribe and get access to all content and tools on the platform.'}</p>
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

function renderCourses() {
  const courses = [
    { title: t('course1_title'), desc: t('course1_desc'), lessons: 12, duration: 180, type: 'course', img: '&#129496;' },
    { title: t('course2_title'), desc: t('course2_desc'), lessons: 10, duration: 150, type: 'course', img: '&#128170;' },
    { title: t('course3_title'), desc: t('course3_desc'), lessons: 8, duration: 120, type: 'course', img: '&#10084;&#65039;' },
    { title: t('course4_title'), desc: t('course4_desc'), lessons: 6, duration: 90, type: 'course', img: '&#129504;' },
    { title: t('course5_title'), desc: t('course5_desc'), lessons: 10, duration: 140, type: 'course', img: '&#127919;' },
    { title: t('course6_title'), desc: t('course6_desc'), lessons: 5, duration: 75, type: 'course', img: '&#128564;' },
    { title: t('video1_title'), desc: t('video1_desc'), duration: 25, type: 'video', img: '&#127968;' },
    { title: t('video2_title'), desc: t('video2_desc'), duration: 30, type: 'video', img: '&#127758;' },
    { title: t('video3_title'), desc: t('video3_desc'), duration: 20, type: 'video', img: '&#128172;' },
  ];

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
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        ${courses.map((c, i) => `
          <div class="bg-white rounded-2xl shadow-sm hover:shadow-lg border border-gray-100 overflow-hidden transition-all hover:-translate-y-1 group">
            <div class="h-40 bg-gradient-to-br from-teal-50 to-emerald-50 flex items-center justify-center">
              <span class="text-6xl">${c.img}</span>
            </div>
            <div class="p-6">
              <div class="flex items-center gap-2 mb-2">
                <span class="text-xs px-2 py-1 rounded-full ${c.type === 'course' ? 'bg-teal-100 text-teal-700' : 'bg-purple-100 text-purple-700'} font-medium">
                  ${c.type === 'course' ? t('courses_filter_courses') : t('courses_filter_videos')}
                </span>
                ${c.lessons ? `<span class="text-xs text-gray-500">${c.lessons} ${t('courses_lessons')}</span>` : ''}
                <span class="text-xs text-gray-500">${c.duration} ${t('courses_duration')}</span>
              </div>
              <h3 class="text-lg font-bold text-gray-800 mb-2 group-hover:text-teal-600 transition">${c.title}</h3>
              <p class="text-gray-600 text-sm mb-4">${c.desc}</p>
              <button class="w-full py-2.5 rounded-xl ${i < 3 && app.isLoggedIn ? 'bg-teal-600 text-white hover:bg-teal-700' : 'bg-gray-100 text-gray-500 cursor-not-allowed'} font-medium text-sm transition">
                ${i < 3 && app.isLoggedIn ? t('courses_start') : t('courses_locked')}
              </button>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  </section>`;
}

function renderMaterials() {
  const materials = [
    { title: t('material1_title'), desc: t('material1_desc'), type: 'guide', pages: 32, img: '&#128203;' },
    { title: t('material2_title'), desc: t('material2_desc'), type: 'ebook', pages: 85, img: '&#128216;' },
    { title: t('material3_title'), desc: t('material3_desc'), type: 'article', pages: 8, img: '&#128240;' },
    { title: t('material4_title'), desc: t('material4_desc'), type: 'guide', pages: 24, img: '&#129496;' },
    { title: t('material5_title'), desc: t('material5_desc'), type: 'ebook', pages: 120, img: '&#128215;' },
    { title: t('material6_title'), desc: t('material6_desc'), type: 'article', pages: 12, img: '&#128196;' },
  ];

  const typeLabels = { guide: t('materials_filter_guides'), ebook: t('materials_filter_ebooks'), article: t('materials_filter_articles') };
  const typeColors = { guide: 'bg-amber-100 text-amber-700', ebook: 'bg-blue-100 text-blue-700', article: 'bg-green-100 text-green-700' };

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
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        ${materials.map((m, i) => `
          <div class="bg-white rounded-2xl shadow-sm hover:shadow-lg border border-gray-100 overflow-hidden transition-all hover:-translate-y-1 group">
            <div class="h-36 bg-gradient-to-br from-amber-50 to-orange-50 flex items-center justify-center">
              <span class="text-5xl">${m.img}</span>
            </div>
            <div class="p-6">
              <div class="flex items-center gap-2 mb-3">
                <span class="text-xs px-2 py-1 rounded-full ${typeColors[m.type]} font-medium">${typeLabels[m.type]}</span>
                <span class="text-xs text-gray-500">${m.pages} ${t('materials_pages')}</span>
              </div>
              <h3 class="text-lg font-bold text-gray-800 mb-2 group-hover:text-teal-600 transition">${m.title}</h3>
              <p class="text-gray-600 text-sm mb-4">${m.desc}</p>
              <button class="w-full py-2.5 rounded-xl ${i < 2 && app.isLoggedIn ? 'bg-teal-600 text-white hover:bg-teal-700' : 'bg-gray-100 text-gray-500 cursor-not-allowed'} font-medium text-sm transition">
                ${i < 2 && app.isLoggedIn ? (m.type === 'ebook' ? t('materials_download') : t('materials_read')) : t('courses_locked')}
              </button>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  </section>`;
}

function renderActivities() {
  const activities = [
    { title: t('activity1_title'), desc: t('activity1_desc'), type: 'breathing', duration: 5, img: '&#127788;&#65039;' },
    { title: t('activity2_title'), desc: t('activity2_desc'), type: 'journal', duration: 10, img: '&#128591;' },
    { title: t('activity3_title'), desc: t('activity3_desc'), type: 'meditation', duration: 10, img: '&#129496;' },
    { title: t('activity4_title'), desc: t('activity4_desc'), type: 'exercises', duration: 15, img: '&#128161;' },
    { title: t('activity5_title'), desc: t('activity5_desc'), type: 'meditation', duration: 15, img: '&#129723;' },
    { title: t('activity6_title'), desc: t('activity6_desc'), type: 'journal', duration: 20, img: '&#9997;&#65039;' },
  ];

  const typeLabels = { breathing: t('activities_filter_breathing'), journal: t('activities_filter_journal'), meditation: t('activities_filter_meditation'), exercises: t('activities_filter_exercises') };
  const typeColors = { breathing: 'bg-sky-100 text-sky-700', journal: 'bg-violet-100 text-violet-700', meditation: 'bg-indigo-100 text-indigo-700', exercises: 'bg-rose-100 text-rose-700' };

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
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        ${activities.map((a) => `
          <div class="bg-white rounded-2xl shadow-sm hover:shadow-lg border border-gray-100 p-6 transition-all hover:-translate-y-1 group">
            <div class="flex items-start justify-between mb-4">
              <span class="text-4xl">${a.img}</span>
              <span class="text-xs px-2 py-1 rounded-full ${typeColors[a.type]} font-medium">${typeLabels[a.type]}</span>
            </div>
            <h3 class="text-lg font-bold text-gray-800 mb-2 group-hover:text-teal-600 transition">${a.title}</h3>
            <p class="text-gray-600 text-sm mb-4">${a.desc}</p>
            <div class="flex items-center justify-between">
              <span class="text-sm text-gray-500">&#9201; ${a.duration} ${t('activities_duration')}</span>
              <button class="px-5 py-2 rounded-xl bg-teal-600 text-white font-medium text-sm hover:bg-teal-700 transition">
                ${t('activities_start')}
              </button>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  </section>`;
}

function renderSchedule() {
  return `
  <section class="py-16 bg-gray-50">
    <div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center mb-12">
        <h1 class="text-3xl md:text-4xl font-bold text-gray-800 mb-4">${t('schedule_title')}</h1>
        <p class="text-lg text-gray-600">${t('schedule_subtitle')}</p>
      </div>
      <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
        <form id="schedule-form" class="space-y-6">
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-2">${t('schedule_type')}</label>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <label class="flex items-center gap-3 p-4 border-2 border-teal-500 rounded-xl cursor-pointer bg-teal-50">
                <input type="radio" name="type" value="online" checked class="text-teal-600 focus:ring-teal-500">
                <div class="font-medium text-gray-800">&#128187; ${t('schedule_type_online')}</div>
              </label>
              <label class="flex items-center gap-3 p-4 border-2 border-gray-200 rounded-xl cursor-pointer hover:border-teal-300 transition">
                <input type="radio" name="type" value="presencial" class="text-teal-600 focus:ring-teal-500">
                <div class="font-medium text-gray-800">&#127970; ${t('schedule_type_presencial')}</div>
              </label>
            </div>
          </div>
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-2">${t('schedule_date')}</label>
            <input type="date" class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition" required>
          </div>
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-2">${t('schedule_time')}</label>
            <div class="grid grid-cols-3 gap-3 mb-3">
              <div class="text-center text-xs font-medium text-gray-500 uppercase">${t('schedule_morning')}</div>
              <div class="text-center text-xs font-medium text-gray-500 uppercase">${t('schedule_afternoon')}</div>
              <div class="text-center text-xs font-medium text-gray-500 uppercase">${t('schedule_evening')}</div>
            </div>
            <div class="grid grid-cols-3 gap-2">
              <button type="button" onclick="selectTime(this)" class="time-slot py-2 px-3 text-sm border border-gray-200 rounded-lg hover:border-teal-400 hover:bg-teal-50 transition text-center">09:00</button>
              <button type="button" onclick="selectTime(this)" class="time-slot py-2 px-3 text-sm border border-gray-200 rounded-lg hover:border-teal-400 hover:bg-teal-50 transition text-center">14:00</button>
              <button type="button" onclick="selectTime(this)" class="time-slot py-2 px-3 text-sm border border-gray-200 rounded-lg hover:border-teal-400 hover:bg-teal-50 transition text-center">18:00</button>
              <button type="button" onclick="selectTime(this)" class="time-slot py-2 px-3 text-sm border border-gray-200 rounded-lg hover:border-teal-400 hover:bg-teal-50 transition text-center">10:00</button>
              <button type="button" onclick="selectTime(this)" class="time-slot py-2 px-3 text-sm border border-gray-200 rounded-lg hover:border-teal-400 hover:bg-teal-50 transition text-center">15:00</button>
              <button type="button" onclick="selectTime(this)" class="time-slot py-2 px-3 text-sm border border-gray-200 rounded-lg hover:border-teal-400 hover:bg-teal-50 transition text-center">19:00</button>
              <button type="button" onclick="selectTime(this)" class="time-slot py-2 px-3 text-sm border border-gray-200 rounded-lg hover:border-teal-400 hover:bg-teal-50 transition text-center">11:00</button>
              <button type="button" onclick="selectTime(this)" class="time-slot py-2 px-3 text-sm border border-gray-200 rounded-lg hover:border-teal-400 hover:bg-teal-50 transition text-center">16:00</button>
              <button type="button" onclick="selectTime(this)" class="time-slot py-2 px-3 text-sm border border-gray-200 rounded-lg hover:border-teal-400 hover:bg-teal-50 transition text-center">20:00</button>
            </div>
          </div>
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-2">${t('schedule_notes')}</label>
            <textarea class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition h-28 resize-none" placeholder="${t('schedule_notes_placeholder')}"></textarea>
          </div>
          <button type="submit" class="w-full bg-teal-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-teal-700 transition shadow-md">
            ${t('schedule_confirm')}
          </button>
          <div id="schedule-success" class="hidden bg-green-50 border border-green-200 text-green-700 p-4 rounded-xl text-center font-medium">
            &#9989; ${t('schedule_success')}
          </div>
        </form>
      </div>
    </div>
  </section>`;
}

function selectTime(el) {
  document.querySelectorAll('.time-slot').forEach(s => {
    s.classList.remove('border-teal-500', 'bg-teal-50', 'text-teal-700', 'font-semibold');
  });
  el.classList.add('border-teal-500', 'bg-teal-50', 'text-teal-700', 'font-semibold');
}

function renderPlans() {
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
          ${app.billingCycle === 'yearly' ? `<span class="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-medium">${t('plans_save')}</span>` : ''}
        </div>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
        <!-- Free -->
        <div class="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 hover:shadow-lg transition">
          <h3 class="text-xl font-bold text-gray-800 mb-2">${t('plan_free_name')}</h3>
          <div class="mb-6">
            <span class="text-4xl font-bold text-gray-800">${t('plans_currency')} ${t('plan_free_price')}</span>
          </div>
          <ul class="space-y-3 mb-8">
            <li class="flex items-center gap-2 text-sm text-gray-600"><svg class="w-5 h-5 text-teal-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>${t('plan_free_f1')}</li>
            <li class="flex items-center gap-2 text-sm text-gray-600"><svg class="w-5 h-5 text-teal-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>${t('plan_free_f2')}</li>
            <li class="flex items-center gap-2 text-sm text-gray-600"><svg class="w-5 h-5 text-teal-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>${t('plan_free_f3')}</li>
          </ul>
          <button onclick="navigate('signup')" class="w-full py-3 rounded-xl border-2 border-gray-200 text-gray-700 font-semibold hover:border-teal-300 transition">${t('plans_subscribe')}</button>
        </div>
        <!-- Essential -->
        <div class="bg-white rounded-2xl shadow-lg border-2 border-teal-500 p-8 relative md:scale-105">
          <div class="absolute -top-3 left-1/2 -translate-x-1/2 bg-teal-600 text-white text-xs font-bold px-4 py-1 rounded-full">${t('plans_popular')}</div>
          <h3 class="text-xl font-bold text-gray-800 mb-2">${t('plan_essential_name')}</h3>
          <div class="mb-6">
            <span class="text-4xl font-bold text-gray-800">${t('plans_currency')} ${app.billingCycle === 'monthly' ? t('plan_essential_price_monthly') : t('plan_essential_price_yearly')}</span>
            <span class="text-gray-500">${app.billingCycle === 'monthly' ? t('plans_period_monthly') : t('plans_period_yearly')}</span>
          </div>
          <ul class="space-y-3 mb-8">
            <li class="flex items-center gap-2 text-sm text-gray-600"><svg class="w-5 h-5 text-teal-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>${t('plan_essential_f1')}</li>
            <li class="flex items-center gap-2 text-sm text-gray-600"><svg class="w-5 h-5 text-teal-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>${t('plan_essential_f2')}</li>
            <li class="flex items-center gap-2 text-sm text-gray-600"><svg class="w-5 h-5 text-teal-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>${t('plan_essential_f3')}</li>
            <li class="flex items-center gap-2 text-sm text-gray-600"><svg class="w-5 h-5 text-teal-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>${t('plan_essential_f4')}</li>
          </ul>
          <button onclick="navigate('signup')" class="w-full py-3 rounded-xl bg-teal-600 text-white font-semibold hover:bg-teal-700 transition shadow-md">${t('plans_subscribe')}</button>
        </div>
        <!-- Premium -->
        <div class="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 hover:shadow-lg transition">
          <h3 class="text-xl font-bold text-gray-800 mb-2">${t('plan_premium_name')}</h3>
          <div class="mb-6">
            <span class="text-4xl font-bold text-gray-800">${t('plans_currency')} ${app.billingCycle === 'monthly' ? t('plan_premium_price_monthly') : t('plan_premium_price_yearly')}</span>
            <span class="text-gray-500">${app.billingCycle === 'monthly' ? t('plans_period_monthly') : t('plans_period_yearly')}</span>
          </div>
          <ul class="space-y-3 mb-8">
            <li class="flex items-center gap-2 text-sm text-gray-600"><svg class="w-5 h-5 text-teal-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>${t('plan_premium_f1')}</li>
            <li class="flex items-center gap-2 text-sm text-gray-600"><svg class="w-5 h-5 text-teal-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>${t('plan_premium_f2')}</li>
            <li class="flex items-center gap-2 text-sm text-gray-600"><svg class="w-5 h-5 text-teal-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>${t('plan_premium_f3')}</li>
            <li class="flex items-center gap-2 text-sm text-gray-600"><svg class="w-5 h-5 text-teal-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>${t('plan_premium_f4')}</li>
            <li class="flex items-center gap-2 text-sm text-gray-600"><svg class="w-5 h-5 text-teal-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>${t('plan_premium_f5')}</li>
          </ul>
          <button onclick="navigate('signup')" class="w-full py-3 rounded-xl border-2 border-teal-500 text-teal-700 font-semibold hover:bg-teal-50 transition">${t('plans_subscribe')}</button>
        </div>
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
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
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
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
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
