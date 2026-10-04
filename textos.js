// Textos fixos da interface. O conteúdo editável pelo painel (textos da profissional,
// cursos, materiais, atividades e planos) fica em js/defaults.js e no Firestore.
const textos = {
  // Navigation
  nav_home: "Início",
  nav_courses: "Cursos",
  nav_materials: "Materiais",
  nav_activities: "Atividades",
  nav_schedule: "Agendar",
  nav_plans: "Planos",
  nav_login: "Entrar",
  nav_signup: "Cadastrar",
  nav_logout: "Sair",

  // Hero section
  hero_cta: "Comece Agora",
  hero_secondary_cta: "Conhecer Planos",

  // Features
  features_title: "O que oferecemos",
  feature_courses_title: "Cursos Online",
  feature_courses_desc: "Cursos completos sobre comunicação, análise comportamental, relacionamentos e mais.",
  feature_videos_title: "Vídeos Exclusivos",
  feature_videos_desc: "Conteúdos em vídeo sobre comportamento, emoções e saúde mental.",
  feature_materials_title: "Materiais de Leitura",
  feature_materials_desc: "E-books, artigos e guias práticos para aprofundar seu desenvolvimento pessoal.",
  feature_activities_title: "Atividades Terapêuticas",
  feature_activities_desc: "Exercícios e dinâmicas para praticar no dia a dia e fortalecer sua saúde mental.",
  feature_schedule_title: "Atendimento Online",
  feature_schedule_desc: "Agende consultas individuais online ou presenciais com facilidade.",
  feature_community_title: "Comunidade",
  feature_community_desc: "Conecte-se com outras pessoas em sua jornada de autoconhecimento e crescimento.",

  // About
  about_title: "Sobre a Profissional",

  // Testimonials
  testimonials_title: "O que dizem nossos assinantes",
  testimonial1_text: "\"A plataforma mudou minha vida. Os cursos são incríveis e o atendimento é acolhedor e profissional.\"",
  testimonial1_author: "Maria S. - São Paulo",
  testimonial2_text: "\"Os cursos de comunicação mudaram a forma como me relaciono no trabalho e em casa. Os materiais complementam muito as consultas.\"",
  testimonial2_author: "Carlos R. - Belo Horizonte",
  testimonial3_text: "\"As atividades me ajudam a perceber meus padrões de comportamento no dia a dia. Recomendo!\"",
  testimonial3_author: "Ana P. - Rio de Janeiro",

  // Courses page
  courses_title: "Cursos & Vídeos",
  courses_subtitle: "Aprenda no seu ritmo com nossos cursos e conteúdos exclusivos",
  courses_filter_all: "Todos",
  courses_filter_courses: "Cursos",
  courses_filter_videos: "Vídeos",
  courses_lessons: "aulas",
  courses_duration: "min",
  courses_start: "Começar",
  courses_locked: "Assine para acessar",
  courses_empty: "Nenhum conteúdo publicado ainda.",

  // Materials page
  materials_title: "Materiais de Leitura",
  materials_subtitle: "E-books, artigos e guias para seu desenvolvimento pessoal",
  materials_filter_all: "Todos",
  materials_filter_ebooks: "E-books",
  materials_filter_articles: "Artigos",
  materials_filter_guides: "Guias",
  materials_download: "Baixar",
  materials_read: "Ler",
  materials_pages: "páginas",

  // Activities page
  activities_title: "Atividades Terapêuticas",
  activities_subtitle: "Exercícios práticos para fortalecer sua saúde mental diariamente",
  activities_filter_all: "Todas",
  activities_filter_breathing: "Respiração",
  activities_filter_journal: "Diário",
  activities_filter_meditation: "Meditação",
  activities_filter_exercises: "Exercícios",
  activities_start: "Iniciar",
  activities_duration: "min",

  // Schedule page
  schedule_title: "Agendar Atendimento",
  schedule_subtitle: "Escolha o melhor horário para sua consulta",
  schedule_name: "Seu nome",
  schedule_email: "E-mail (opcional)",
  schedule_type: "Tipo de Atendimento",
  schedule_type_online: "Online (Videochamada)",
  schedule_type_presencial: "Presencial",
  schedule_date: "Data",
  schedule_time: "Horário",
  schedule_time_pick_date: "Escolha a data",
  schedule_time_select: "Selecione",
  schedule_time_none: "Sem horários neste dia",
  schedule_notes: "Observações (opcional)",
  schedule_notes_placeholder: "Conte brevemente o motivo da consulta...",
  schedule_confirm: "Enviar pedido pelo WhatsApp",
  schedule_hint: "O WhatsApp abre com a mensagem pronta. A consulta é confirmada pela profissional.",
  schedule_success: "Pedido registrado! Envie a mensagem no WhatsApp para concluir.",

  // Plans page
  plans_title: "Planos de Assinatura",
  plans_subtitle: "Escolha o plano ideal para sua jornada de desenvolvimento pessoal",
  plans_monthly: "Mensal",
  plans_yearly: "Anual",
  plans_save: "Economize",
  plans_subscribe: "Assinar",
  plans_popular: "Mais Popular",
  plans_currency: "R$",
  plans_period: "/mês",

  // Login page
  login_title: "Entrar na Plataforma",
  login_email: "E-mail",
  login_password: "Senha",
  login_forgot: "Esqueceu a senha?",
  login_submit: "Entrar",
  login_no_account: "Não tem conta?",
  login_signup_link: "Cadastre-se",
  signup_title: "Criar Conta",
  signup_name: "Nome completo",
  signup_email: "E-mail",
  signup_password: "Senha",
  signup_confirm: "Confirmar Senha",
  signup_submit: "Cadastrar",
  signup_has_account: "Já tem conta?",
  signup_login_link: "Entrar",

  // Footer
  footer_rights: "Todos os direitos reservados.",
  footer_privacy: "Privacidade",
  footer_terms: "Termos de Uso",
  footer_contact: "Contato",
  footer_location: "Comunicação e análise comportamental",
};

function t(key) {
  return textos[key] || key;
}
