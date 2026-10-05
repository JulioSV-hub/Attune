// Textos fixos da interface. O conteúdo editável pelo painel (textos da profissional,
// cursos, materiais, atividades, planos e perguntas frequentes) fica em js/defaults.js e no Firestore.
const textos = {
  // Navigation
  nav_home: "Início",
  nav_courses: "Cursos",
  nav_materials: "Materiais",
  nav_activities: "Atividades",
  nav_schedule: "Agendar",
  nav_plans: "Planos",
  nav_cta: "Agendar consulta",

  // Hero section
  hero_cta: "Agendar consulta",
  hero_secondary_cta: "Ver conteúdos",

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
  feature_sigilo_title: "Sigilo e Acolhimento",
  feature_sigilo_desc: "Escuta acolhedora e sigilo profissional. Seus dados são usados apenas para o seu cuidado.",

  // About
  about_title: "Sobre a Profissional",

  // FAQ
  faq_title: "Perguntas frequentes",

  // Conteúdos (cursos, materiais, atividades)
  filter_all: "Todos",
  content_soon: "Em breve",
  content_empty: "Nenhum conteúdo publicado ainda.",
  courses_title: "Cursos & Vídeos",
  courses_subtitle: "Aprenda no seu ritmo com nossos cursos e conteúdos exclusivos",
  courses_lessons: "aulas",
  courses_duration: "min",
  courses_start: "Começar",
  courses_watch: "Assistir",
  materials_title: "Materiais de Leitura",
  materials_subtitle: "E-books, artigos e guias para seu desenvolvimento pessoal",
  materials_download: "Baixar",
  materials_read: "Ler",
  materials_pages: "páginas",
  activities_title: "Atividades Terapêuticas",
  activities_subtitle: "Exercícios práticos para fortalecer sua saúde mental diariamente",
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
  schedule_notes_hint: "Escreva só o necessário. Os detalhes podem ser conversados na consulta.",
  schedule_confirm: "Enviar pedido pelo WhatsApp",
  schedule_hint: "O WhatsApp abre com a mensagem pronta. A consulta é confirmada pela profissional.",
  schedule_success: "Pedido registrado! Envie a mensagem no WhatsApp para concluir.",

  // Plans page
  plans_title: "Planos de Assinatura",
  plans_subtitle: "Escolha o plano ideal para sua jornada de desenvolvimento pessoal",
  plans_cta: "Conhecer Planos",
  plans_monthly: "Mensal",
  plans_yearly: "Anual",
  plans_save: "Economize",
  plans_subscribe: "Assinar",
  plans_contact: "Quero este plano",
  plans_popular: "Mais Popular",
  plans_currency: "R$",
  plans_period: "/mês",

  // Footer
  footer_rights: "Todos os direitos reservados.",
  footer_privacy: "Política de Privacidade",
  footer_contact: "Contato",
  footer_location: "Comunicação e análise comportamental",
  footer_crise: "Este site não atende emergências. Em situação de crise, ligue 188 (CVV, 24 horas) ou 192 (SAMU).",
};

function t(key) {
  return textos[key] || key;
}
