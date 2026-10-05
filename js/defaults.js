// Conteúdo inicial do site. É usado enquanto o Firebase não está configurado ou o banco
// ainda não foi iniciado, e é copiado para o Firestore no primeiro acesso ao painel.
// Script clássico (não módulo): o site e o painel leem window.SV_DEFAULTS.
window.SV_DEFAULTS = {
  site: {
    profissional: 'Claudia Alves de Assis',
    profissao: 'Enfermeira',
    registro: 'COREN 000000',
    whatsapp: '',
    email: '',
    instagram: '',
    fotoUrl: '',
    heroTitulo: 'Entenda como você se comunica, sente e se comporta',
    heroSubtitulo: 'Cursos e materiais sobre comunicação e análise comportamental com uma enfermeira especialista em saúde mental, além de atendimento online',
    sobreTexto: 'Enfermeira com pós-graduação em psiquiatria, com foco em comunicação e análise comportamental. Une a prática clínica a cursos e materiais que ajudam você a entender seus padrões de comportamento e a se comunicar melhor nas relações pessoais e profissionais.',
    credenciais: ['COREN Ativo', 'Pós-graduada em Psiquiatria', 'Análise Comportamental', 'Comunicação Interpessoal'],
    presencial: true,
    faq: [
      { pergunta: 'Como funciona o atendimento online?', resposta: 'A consulta acontece por videochamada, no dia e horário combinados. Você só precisa de um celular ou computador com internet, em um lugar reservado e tranquilo.' },
      { pergunta: 'Como faço para agendar?', resposta: 'Na página Agendar, escolha a data e o horário e envie o pedido pelo WhatsApp. A confirmação é feita diretamente com a profissional.' },
      { pergunta: 'Minhas informações ficam em sigilo?', resposta: 'Sim. O atendimento segue o sigilo profissional da enfermagem, e seus dados são usados apenas para o seu atendimento. Veja a Política de Privacidade.' },
      { pergunta: 'E se eu precisar de ajuda urgente?', resposta: 'Este site não atende emergências. Em situação de risco, ligue 192 (SAMU) ou procure o pronto-socorro mais próximo. Para conversar com alguém a qualquer hora, o CVV atende de graça pelo telefone 188, 24 horas por dia.' },
    ],
    // Horários oferecidos no agendamento, por dia da semana (0 = domingo).
    horarios: {
      0: [],
      1: ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00', '18:00', '19:00', '20:00'],
      2: ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00', '18:00', '19:00', '20:00'],
      3: ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00', '18:00', '19:00', '20:00'],
      4: ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00', '18:00', '19:00', '20:00'],
      5: ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00', '18:00', '19:00', '20:00'],
      6: [],
    },
  },

  // A página de planos fica escondida até a profissional confirmar valores e itens (painel → Planos).
  planosAtiva: false,

  // Os três planos têm id fixo; nome, preços, recursos e links são editáveis.
  planos: [
    { id: 'gratuito', nome: 'Gratuito', mensal: 0, anual: 0, destaque: false, linkMensal: '', linkAnual: '',
      recursos: ['Acesso a 2 vídeos', '1 material de leitura', 'Atividades básicas'] },
    { id: 'essencial', nome: 'Essencial', mensal: 197, anual: 158, destaque: true, linkMensal: '', linkAnual: '',
      recursos: ['Todos os cursos e vídeos', 'Materiais completos', 'Todas as atividades', '1 sessão/mês incluída'] },
    { id: 'premium', nome: 'Premium', mensal: 397, anual: 318, destaque: false, linkMensal: '', linkAnual: '',
      recursos: ['Tudo do plano Essencial', '4 sessões/mês incluídas', 'Acesso prioritário', 'Grupo exclusivo WhatsApp', 'Suporte por mensagem'] },
  ],

  cursos: [
    { id: 'c1', ordem: 1, tipo: 'curso', icone: '🧘', titulo: 'Gestão da Ansiedade', descricao: 'Aprenda técnicas comprovadas para controlar a ansiedade no dia a dia.', aulas: 12, duracao: 180, link: '' },
    { id: 'c2', ordem: 2, tipo: 'curso', icone: '💪', titulo: 'Autoestima e Autoconfiança', descricao: 'Desenvolva uma relação saudável consigo mesmo e fortaleça sua autoestima.', aulas: 10, duracao: 150, link: '' },
    { id: 'c3', ordem: 3, tipo: 'curso', icone: '❤️', titulo: 'Relacionamentos Saudáveis', descricao: 'Construa e mantenha relacionamentos interpessoais positivos.', aulas: 8, duracao: 120, link: '' },
    { id: 'c4', ordem: 4, tipo: 'curso', icone: '🧠', titulo: 'Mindfulness para Iniciantes', descricao: 'Introdução à prática de atenção plena para reduzir estresse.', aulas: 6, duracao: 90, link: '' },
    { id: 'c5', ordem: 5, tipo: 'curso', icone: '🎯', titulo: 'Inteligência Emocional', descricao: 'Desenvolva sua capacidade de reconhecer e gerenciar emoções.', aulas: 10, duracao: 140, link: '' },
    { id: 'c6', ordem: 6, tipo: 'curso', icone: '😴', titulo: 'Sono e Bem-estar', descricao: 'Estratégias para melhorar a qualidade do sono e descanso.', aulas: 5, duracao: 75, link: '' },
    { id: 'v3', ordem: 7, tipo: 'video', icone: '💬', titulo: 'Comunicação Assertiva', descricao: 'Aprenda a se comunicar de forma clara e respeitosa.', aulas: 0, duracao: 20, link: '' },
  ],

  materiais: [
    { id: 'm1', ordem: 1, tipo: 'guia', icone: '📋', titulo: 'Guia Prático: Controle da Ansiedade', descricao: 'Um guia completo com exercícios práticos para o dia a dia.', paginas: 32, link: '' },
    { id: 'm2', ordem: 2, tipo: 'ebook', icone: '📘', titulo: 'E-book: Autoconhecimento', descricao: 'Descubra ferramentas para se conhecer melhor e viver com propósito.', paginas: 85, link: '' },
    { id: 'm3', ordem: 3, tipo: 'artigo', icone: '📰', titulo: 'Artigo: Expatriação e Saúde Mental', descricao: 'Como cuidar da saúde mental vivendo longe de casa.', paginas: 8, link: '' },
    { id: 'm4', ordem: 4, tipo: 'guia', icone: '🧘', titulo: 'Guia: Meditação para Iniciantes', descricao: 'Passo a passo para começar a meditar hoje.', paginas: 24, link: '' },
    { id: 'm5', ordem: 5, tipo: 'ebook', icone: '📗', titulo: 'E-book: Comunicação Não-Violenta', descricao: 'Aprenda a se comunicar de forma empática e eficaz.', paginas: 120, link: '' },
    { id: 'm6', ordem: 6, tipo: 'artigo', icone: '📄', titulo: 'Artigo: Resiliência Emocional', descricao: 'Estratégias para desenvolver resiliência diante dos desafios.', paginas: 12, link: '' },
  ],

  atividades: [
    { id: 'a1', ordem: 1, tipo: 'respiracao', icone: '🌬️', titulo: 'Respiração 4-7-8', descricao: 'Técnica de respiração para acalmar o sistema nervoso rapidamente.', duracao: 5, link: '' },
    { id: 'a2', ordem: 2, tipo: 'diario', icone: '🙏', titulo: 'Diário de Gratidão', descricao: 'Escreva 3 coisas pelas quais você é grato hoje.', duracao: 10, link: '' },
    { id: 'a3', ordem: 3, tipo: 'meditacao', icone: '🧘', titulo: 'Meditação Guiada', descricao: '10 minutos de meditação para clareza mental.', duracao: 10, link: '' },
    { id: 'a4', ordem: 4, tipo: 'exercicios', icone: '💡', titulo: 'Reestruturação Cognitiva', descricao: 'Identifique e desafie pensamentos negativos automáticos.', duracao: 15, link: '' },
    { id: 'a5', ordem: 5, tipo: 'meditacao', icone: '🪻', titulo: 'Body Scan', descricao: 'Escaneamento corporal para consciência e relaxamento.', duracao: 15, link: '' },
    { id: 'a6', ordem: 6, tipo: 'diario', icone: '✍️', titulo: 'Journaling Expressivo', descricao: 'Escreva livremente sobre seus sentimentos e pensamentos.', duracao: 20, link: '' },
  ],
};

// Tipos de cada coleção: rótulo exibido e cor do selo (classes Tailwind).
window.SV_TIPOS = {
  cursos: {
    curso: { rotulo: 'Curso', cor: 'bg-teal-100 text-teal-700' },
    video: { rotulo: 'Vídeo', cor: 'bg-purple-100 text-purple-700' },
  },
  materiais: {
    ebook: { rotulo: 'E-book', cor: 'bg-blue-100 text-blue-700' },
    artigo: { rotulo: 'Artigo', cor: 'bg-green-100 text-green-700' },
    guia: { rotulo: 'Guia', cor: 'bg-amber-100 text-amber-700' },
  },
  atividades: {
    respiracao: { rotulo: 'Respiração', cor: 'bg-sky-100 text-sky-700' },
    diario: { rotulo: 'Diário', cor: 'bg-violet-100 text-violet-700' },
    meditacao: { rotulo: 'Meditação', cor: 'bg-indigo-100 text-indigo-700' },
    exercicios: { rotulo: 'Exercícios', cor: 'bg-rose-100 text-rose-700' },
  },
};
