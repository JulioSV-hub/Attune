// Carrega o conteúdo do site e inicia o app (window.startApp, em app.js).
// Usa o conteúdo inicial (defaults.js) quando o Firebase não está configurado ou quando o
// banco ainda não foi iniciado (config/site inexistente). A importação do conteúdo inicial,
// feita pelo painel, grava config/site junto com todo o resto numa única operação.
import { isConfigured } from './firebase-config.js';

const FIRESTORE = 'https://www.gstatic.com/firebasejs/12.19.0/firebase-firestore-lite.js';
const D = window.SV_DEFAULTS;

const porOrdem = (a, b) => (Number(a.ordem) || 0) - (Number(b.ordem) || 0);

// Campos ausentes no banco usam o padrão.
export function mergeSite(data = {}) {
  return { ...structuredClone(D.site), ...data };
}

// Os planos são mesclados pelo id; planos desconhecidos são ignorados.
export function mergePlanos(lista = []) {
  return structuredClone(D.planos).map(p => ({ ...p, ...lista.find(x => x.id === p.id) }));
}

async function carregarDoBanco() {
  const { db } = await import('./firebase.js');
  const { doc, getDoc, getDocs, collection } = await import(FIRESTORE);
  const siteSnap = await getDoc(doc(db, 'config', 'site'));
  if (!siteSnap.exists()) return structuredClone(D);

  const listar = async nome => (await getDocs(collection(db, nome))).docs
    .map(d => ({ id: d.id, ...d.data() })).sort(porOrdem);
  const [planosSnap, cursos, materiais, atividades] = await Promise.all([
    getDoc(doc(db, 'config', 'planos')), listar('cursos'), listar('materiais'), listar('atividades'),
  ]);
  return {
    site: mergeSite(siteSnap.data()),
    planos: mergePlanos(planosSnap.exists() ? planosSnap.data().planos : []),
    cursos, materiais, atividades,
  };
}

// Registra o pedido de agendamento para o painel. Retorna a Promise da gravação (ou null sem Firebase).
async function criarAgendamento({ nome, email, data, horario, modalidade, motivo }) {
  const { db } = await import('./firebase.js');
  const { collection, addDoc, serverTimestamp } = await import(FIRESTORE);
  const registro = { nome, data, horario, status: 'pendente', criadoEm: serverTimestamp() };
  if (email) registro.email = email;
  if (modalidade) registro.modalidade = modalidade;
  if (motivo) registro.motivo = motivo;
  return addDoc(collection(db, 'agendamentos'), registro);
}

// Só no site público (o painel importa este módulo apenas pelas funções de mesclagem).
if (window.startApp) {
  window.SV = { criarAgendamento: isConfigured ? criarAgendamento : null };
  let conteudo;
  try {
    conteudo = isConfigured ? await carregarDoBanco() : structuredClone(D);
  } catch (err) {
    console.error('Não foi possível carregar o conteúdo do banco; usando o conteúdo inicial.', err);
    conteudo = structuredClone(D);
  }
  window.startApp(conteudo);
}
