// Painel admin: login (Firebase Auth) e edição do conteúdo (Firestore).
import { isConfigured } from '../js/firebase-config.js';
import { mergeSite, mergePlanos } from '../js/store.js';

const AUTH = 'https://www.gstatic.com/firebasejs/12.19.0/firebase-auth.js';
const FIRESTORE = 'https://www.gstatic.com/firebasejs/12.19.0/firebase-firestore-lite.js';

const D = window.SV_DEFAULTS;
const TIPOS = window.SV_TIPOS;
const $ = id => document.getElementById(id);

const DIAS = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
const STATUS_LABEL = { pendente: 'Pendente', confirmado: 'Confirmado', concluido: 'Concluído', cancelado: 'Cancelado' };
const FOTO_PADRAO = '../foto.jpg';

// ---------------------------------------------------------------------------
// Utilitários

function escapeHtml(value) {
  return String(value ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

function formatDate(iso) {
  if (!iso) return '';
  const [a, m, d] = String(iso).split('-');
  return `${d}/${m}/${a}`;
}

// Aceita links https (com ou sem "https://" digitado); retorna '' se inválido.
function linkSeguro(value) {
  const texto = String(value || '').trim();
  if (!texto) return '';
  try {
    const url = new URL(/^[a-z]+:/i.test(texto) ? texto : `https://${texto}`);
    return url.protocol === 'https:' ? url.href : '';
  } catch {
    return '';
  }
}

let toastTimer = null;
function showNotification(msg, tipo = 'ok') {
  const el = $('toast');
  el.textContent = msg;
  el.className = el.className.replace(/\bbg-\S+/g, '') + (tipo === 'erro' ? ' bg-red-600' : tipo === 'info' ? ' bg-gray-800' : ' bg-teal-600');
  el.hidden = false;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => { el.hidden = true; }, 5000);
}

function showView(id) {
  ['viewCarregando', 'viewNaoConfigurado', 'viewLogin', 'viewSemPermissao', 'viewTrocarSenha', 'viewPainel']
    .forEach(v => { $(v).hidden = v !== id; });
  $('alterarSenhaBtn').hidden = id !== 'viewPainel';
}

// Botão "Mostrar": mostra/oculta o conteúdo do campo de senha ao lado.
document.querySelectorAll('.toggle-senha').forEach(btn => {
  btn.addEventListener('click', () => {
    const input = btn.parentElement.querySelector('input');
    const mostrar = input.type === 'password';
    input.type = mostrar ? 'text' : 'password';
    btn.textContent = mostrar ? 'Ocultar' : 'Mostrar';
    input.focus();
  });
});

function ocultarSenhas(form) {
  form.querySelectorAll('.password-field input').forEach(i => { i.type = 'password'; });
  form.querySelectorAll('.toggle-senha').forEach(b => { b.textContent = 'Mostrar'; });
}

function setError(el, msg) {
  el.textContent = msg || '';
  el.hidden = !msg;
}

function errorMessage(err) {
  const code = err?.code || '';
  if (code === 'permission-denied') return 'Sem permissão para esta ação. Faça login novamente.';
  if (code === 'unavailable' || code === 'auth/network-request-failed') return 'Sem conexão. Verifique a internet e tente de novo.';
  return 'Algo deu errado. Tente novamente.';
}

function fail(err) {
  console.error(err);
  showNotification(errorMessage(err), 'erro');
}

// Evita duplo clique em botões de salvar durante a gravação.
async function withBusy(button, fn) {
  if (button.disabled) return;
  button.disabled = true;
  try {
    return await fn();
  } finally {
    button.disabled = false;
  }
}

function todayIso() {
  const d = new Date();
  const p = n => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
}

function linhas(texto) {
  return String(texto || '').split('\n').map(s => s.trim()).filter(Boolean);
}

// Alterações não salvas: avisa antes de sair da página ou trocar de aba.
const dirtyForms = new Set();
function trackDirty(form) {
  form.addEventListener('input', () => dirtyForms.add(form.id));
  form.addEventListener('change', () => dirtyForms.add(form.id));
}
function clearDirty(form) { dirtyForms.delete(form.id); }
function confirmDiscard() {
  return dirtyForms.size === 0 || confirm('Há alterações não salvas. Deseja descartá-las?');
}
window.addEventListener('beforeunload', e => {
  if (dirtyForms.size) { e.preventDefault(); e.returnValue = ''; }
});

// ---------------------------------------------------------------------------
// Firebase (carregado só quando configurado)

let fb = null; // { auth, db, emulator, ...funções do SDK }

async function carregarFirebase() {
  const [{ app, db, emulator }, authSdk, fsSdk] = await Promise.all([
    import('../js/firebase.js'), import(AUTH), import(FIRESTORE),
  ]);
  const auth = authSdk.getAuth(app);
  if (emulator) authSdk.connectAuthEmulator(auth, 'http://127.0.0.1:9099', { disableWarnings: true });
  fb = { ...authSdk, ...fsSdk, app, auth, db, emulator };
}

// ---------------------------------------------------------------------------
// Autenticação

async function onUser(user) {
  $('sairBtn').hidden = !user;
  $('usuarioEmail').textContent = user?.email || '';
  if (!user) {
    showView('viewLogin');
    return;
  }
  showView('viewCarregando');
  try {
    const adminDoc = await fb.getDoc(fb.doc(fb.db, 'admins', user.uid));
    if (!adminDoc.exists()) {
      $('semPermissaoUid').textContent = user.uid;
      showView('viewSemPermissao');
      return;
    }
    if (await usandoSenhaProvisoria(user)) {
      abrirTrocaSenha(true);
      return;
    }
    await abrirPainel();
  } catch (err) {
    fail(err);
    showView('viewLogin');
  }
}

let painelCarregado = false;
async function abrirPainel() {
  showView('viewPainel');
  if (painelCarregado) return;
  painelCarregado = true;
  await loadAll();
  // Primeiro acesso com o banco vazio: importa o conteúdo inicial automaticamente,
  // para o site não ficar sem conteúdo. Só acontece uma vez (cria config/site).
  if (!siteExiste) {
    try {
      await importarConteudoInicial();
      showNotification('Bem-vinda! O conteúdo inicial do site foi carregado. Agora é só editar.', 'info');
    } catch (err) { fail(err); }
  }
}

// Senha provisória = nunca trocada desde que a conta foi criada no Console do Firebase.
// Quem já redefiniu pelo "Esqueci minha senha" ou pelo painel não é obrigado a trocar de novo.
async function usandoSenhaProvisoria(user) {
  try {
    const base = fb.emulator ? 'http://127.0.0.1:9099/identitytoolkit.googleapis.com' : 'https://identitytoolkit.googleapis.com';
    const resp = await fetch(`${base}/v1/accounts:lookup?key=${fb.app.options.apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ idToken: await user.getIdToken() }),
    });
    if (!resp.ok) throw new Error(`accounts:lookup ${resp.status}`);
    const info = (await resp.json()).users?.[0] || {};
    const criada = Number(info.createdAt);
    const senhaAlterada = Number(info.passwordUpdatedAt);
    // Na criação as duas datas são iguais; qualquer troca posterior as separa.
    return Boolean(criada && senhaAlterada) && senhaAlterada - criada < 2000;
  } catch (err) {
    // Falha na consulta não bloqueia o acesso; a troca segue disponível no botão "Senha".
    console.warn('Não foi possível verificar a senha provisória.', err);
    return false;
  }
}

function abrirTrocaSenha(obrigatoria) {
  const form = $('trocarSenhaForm');
  form.reset();
  ocultarSenhas(form);
  $('trocarSenhaUsuario').value = fb.auth.currentUser?.email || '';
  $('trocarSenhaTitulo').textContent = obrigatoria ? 'Crie sua senha' : 'Alterar senha';
  $('trocarSenhaTexto').textContent = obrigatoria
    ? 'Por segurança, troque a senha provisória antes de usar o painel.'
    : 'Escolha uma nova senha para acessar o painel.';
  $('trocarSenhaCancelar').hidden = obrigatoria;
  setError($('trocarSenhaErro'), '');
  showView('viewTrocarSenha');
  $('senhaAtual').focus();
}

$('alterarSenhaBtn').addEventListener('click', () => {
  if (!confirmDiscard()) return;
  abrirTrocaSenha(false);
});

$('trocarSenhaCancelar').addEventListener('click', () => abrirPainel());

$('trocarSenhaForm').addEventListener('submit', async e => {
  e.preventDefault();
  const erro = $('trocarSenhaErro');
  const atual = $('senhaAtual').value;
  const nova = $('senhaNova').value;
  if (!atual) return setError(erro, 'Digite a senha atual.');
  if (nova.length < 8 || !/[A-Za-z]/.test(nova) || !/\d/.test(nova)) {
    return setError(erro, 'A nova senha precisa ter pelo menos 8 caracteres, com letras e números.');
  }
  if (nova === atual) return setError(erro, 'A nova senha precisa ser diferente da atual.');
  if (nova !== $('senhaConfirmar').value) return setError(erro, 'A confirmação não confere com a nova senha.');
  setError(erro, '');

  await withBusy($('trocarSenhaForm').querySelector('button[type=submit]'), async () => {
    const user = fb.auth.currentUser;
    try {
      // Confirmar a senha atual também evita o erro de "login recente necessário".
      await fb.reauthenticateWithCredential(user, fb.EmailAuthProvider.credential(user.email, atual));
      await fb.updatePassword(user, nova);
      $('trocarSenhaForm').reset();
      ocultarSenhas($('trocarSenhaForm'));
      showNotification('Senha alterada com sucesso.');
      await abrirPainel();
    } catch (err) {
      const code = err.code || '';
      if (['auth/invalid-credential', 'auth/wrong-password'].includes(code)) setError(erro, 'Senha atual incorreta.');
      else if (code === 'auth/weak-password' || code === 'auth/password-does-not-meet-requirements') setError(erro, 'Senha fraca. Use pelo menos 8 caracteres, com letras e números.');
      else if (code === 'auth/too-many-requests') setError(erro, 'Muitas tentativas. Aguarde alguns minutos.');
      else setError(erro, errorMessage(err));
    }
  });
});

$('loginForm').addEventListener('submit', async e => {
  e.preventDefault();
  const erro = $('loginErro');
  setError(erro, '');
  await withBusy($('loginForm').querySelector('button[type=submit]'), async () => {
    try {
      await fb.signInWithEmailAndPassword(fb.auth, $('loginEmail').value.trim(), $('loginSenha').value);
      $('loginSenha').value = '';
      ocultarSenhas($('loginForm'));
    } catch (err) {
      const code = err.code || '';
      if (['auth/invalid-credential', 'auth/wrong-password', 'auth/user-not-found', 'auth/invalid-email'].includes(code)) {
        setError(erro, 'E-mail ou senha incorretos.');
      } else if (code === 'auth/too-many-requests') {
        setError(erro, 'Muitas tentativas. Aguarde alguns minutos ou redefina a senha.');
      } else {
        setError(erro, errorMessage(err));
      }
    }
  });
});

$('esqueciBtn').addEventListener('click', async () => {
  const email = $('loginEmail').value.trim();
  if (!email) {
    setError($('loginErro'), 'Digite seu e-mail acima e clique novamente em "Esqueci minha senha".');
    return;
  }
  try {
    await fb.sendPasswordResetEmail(fb.auth, email);
  } catch (err) {
    console.error(err);
  }
  // Mesma mensagem com ou sem conta, para não revelar quais e-mails existem.
  setError($('loginErro'), '');
  showNotification('Se este e-mail tiver acesso, você receberá um link para criar uma nova senha.', 'info');
});

$('sairBtn').addEventListener('click', () => {
  if (!confirmDiscard()) return;
  dirtyForms.clear();
  painelCarregado = false;
  fb.signOut(fb.auth);
});

// ---------------------------------------------------------------------------
// Abas

document.querySelectorAll('.tab').forEach(tab => {
  tab.addEventListener('click', () => {
    if (tab.classList.contains('active')) return;
    if (!confirmDiscard()) return;
    discardAll();
    document.querySelectorAll('.tab').forEach(t => t.classList.toggle('active', t === tab));
    document.querySelectorAll('[data-panel]').forEach(p => { p.hidden = p.dataset.panel !== tab.dataset.tab; });
  });
});

function discardAll() {
  dirtyForms.clear();
  Object.values(editores).forEach(ed => ed.fechar());
  renderSiteForm();
  renderPlanosForm();
}

async function loadAll() {
  await Promise.all([loadAgendamentos(), loadSite(), loadPlanos(), ...Object.values(editores).map(ed => ed.carregar())]);
  updateImportBox();
}

// ---------------------------------------------------------------------------
// Agendamentos

let agendamentos = [];

async function loadAgendamentos() {
  const snap = await fb.getDocs(fb.collection(fb.db, 'agendamentos'));
  agendamentos = snap.docs.map(d => ({ id: d.id, ...d.data() }))
    .sort((a, b) => `${a.data} ${a.horario}`.localeCompare(`${b.data} ${b.horario}`));
  renderAgendamentos();
}

function renderAgendamentos() {
  const filtro = $('agFiltro').value;
  const hoje = todayIso();
  let lista = agendamentos;
  if (filtro === 'proximos') {
    lista = lista.filter(a => a.data >= hoje && ['pendente', 'confirmado'].includes(a.status));
  } else if (filtro !== 'todos') {
    lista = lista.filter(a => a.status === filtro);
  }
  // Histórico: mais recentes primeiro; próximos: ordem cronológica.
  if (!['proximos', 'pendente', 'confirmado'].includes(filtro)) lista = [...lista].reverse();

  const pendentes = agendamentos.filter(a => a.status === 'pendente' && a.data >= hoje).length;
  $('pendentesBadge').textContent = pendentes;
  $('pendentesBadge').hidden = pendentes === 0;

  $('agVazio').hidden = lista.length > 0;
  $('agTabelaBox').hidden = lista.length === 0;
  $('agTabela').innerHTML = lista.map(a => {
    const dia = a.data ? DIAS[new Date(a.data + 'T12:00').getDay()] : '';
    const passado = a.data < hoje;
    const acoes = [];
    if (a.status === 'pendente') acoes.push(['confirmado', '✓', '', 'Confirmar']);
    if (a.status === 'confirmado') acoes.push(['concluido', '✓✓', '', 'Marcar como concluído']);
    if (['pendente', 'confirmado'].includes(a.status)) acoes.push(['cancelado', '✕', 'danger', 'Cancelar']);
    if (['cancelado', 'concluido'].includes(a.status)) acoes.push(['pendente', '↺', '', 'Voltar para pendente']);
    return `
    <tr>
      <td class="whitespace-nowrap">${formatDate(a.data)}<div class="muted">${dia}${passado ? ' · passado' : ''}</div></td>
      <td>${escapeHtml(a.horario)}</td>
      <td>${escapeHtml(a.nome)}${a.email ? `<div class="muted"><a class="hover:underline" href="mailto:${escapeHtml(a.email)}">${escapeHtml(a.email)}</a></div>` : ''}</td>
      <td>${escapeHtml(a.modalidade || '')}</td>
      <td class="max-w-xs whitespace-pre-line">${escapeHtml(a.motivo || '')}</td>
      <td><span class="status-badge status-${escapeHtml(a.status)}">${STATUS_LABEL[a.status] || escapeHtml(a.status)}</span></td>
      <td class="whitespace-nowrap space-x-1">
        ${acoes.map(([st, icone, cls, title]) =>
          `<button type="button" class="icon-btn ${cls}" data-ag="${a.id}" data-status="${st}" title="${title}" aria-label="${title}">${icone}</button>`).join('')}
        <button type="button" class="icon-btn danger" data-ag-excluir="${a.id}" title="Excluir" aria-label="Excluir">🗑️</button>
      </td>
    </tr>`;
  }).join('');
}

$('agFiltro').addEventListener('change', renderAgendamentos);
$('agRecarregar').addEventListener('click', () => withBusy($('agRecarregar'), () => loadAgendamentos().catch(fail)));

$('agTabela').addEventListener('click', async e => {
  const btn = e.target.closest('button');
  if (!btn) return;
  const id = btn.dataset.ag || btn.dataset.agExcluir;
  const item = agendamentos.find(a => a.id === id);
  if (!item) return;
  try {
    if (btn.dataset.agExcluir) {
      if (!confirm(`Excluir o pedido de ${item.nome}? Isso não pode ser desfeito.`)) return;
      await fb.deleteDoc(fb.doc(fb.db, 'agendamentos', id));
      agendamentos = agendamentos.filter(a => a.id !== id);
      showNotification('Pedido excluído.');
    } else {
      const status = btn.dataset.status;
      await fb.updateDoc(fb.doc(fb.db, 'agendamentos', id), { status, atualizadoEm: fb.serverTimestamp() });
      item.status = status;
      showNotification(`Status alterado para "${STATUS_LABEL[status]}".`);
    }
    renderAgendamentos();
  } catch (err) {
    fail(err);
  }
});

// ---------------------------------------------------------------------------
// Cursos e vídeos, Materiais, Atividades: mesmo editor de lista, com campos diferentes.

const CAMPOS = {
  tipo: { rotulo: 'Tipo *' },
  icone: { rotulo: 'Ícone (emoji)', tipo: 'text', max: 8, dica: 'Cole um emoji, ex.: 💬' },
  titulo: { rotulo: 'Título *', tipo: 'text', max: 120 },
  descricao: { rotulo: 'Descrição', tipo: 'textarea', max: 400 },
  aulas: { rotulo: 'Número de aulas', tipo: 'number', max: 500, dica: 'Deixe 0 para vídeos avulsos.' },
  duracao: { rotulo: 'Duração (minutos)', tipo: 'number', max: 10000 },
  paginas: { rotulo: 'Número de páginas', tipo: 'number', max: 5000 },
  link: { rotulo: 'Link do conteúdo', tipo: 'url', dica: 'Ex.: link do YouTube, Google Drive ou da plataforma do curso. Sem link, o site mostra "Em breve".' },
};

const COLECOES = {
  cursos: { titulo: 'Cursos e vídeos', singular: 'conteúdo', campos: ['tipo', 'icone', 'titulo', 'descricao', 'aulas', 'duracao', 'link'] },
  materiais: { titulo: 'Materiais de leitura', singular: 'material', campos: ['tipo', 'icone', 'titulo', 'descricao', 'paginas', 'link'] },
  atividades: { titulo: 'Atividades terapêuticas', singular: 'atividade', campos: ['tipo', 'icone', 'titulo', 'descricao', 'duracao', 'link'] },
};

function campoHtml(colecao, nome) {
  const c = CAMPOS[nome];
  const id = `${colecao}-${nome}`;
  const dica = c.dica ? `<span class="hint">${escapeHtml(c.dica)}</span>` : '';
  if (nome === 'tipo') {
    const opcoes = Object.entries(TIPOS[colecao]).map(([v, info]) => `<option value="${v}">${escapeHtml(info.rotulo)}</option>`).join('');
    return `<div><label for="${id}" class="label">${c.rotulo}</label><select id="${id}" name="${nome}" class="input">${opcoes}</select></div>`;
  }
  if (c.tipo === 'checkbox') {
    return `<div class="md:col-span-2"><label class="flex items-center gap-2"><input type="checkbox" id="${id}" name="${nome}"> ${escapeHtml(c.rotulo)}</label></div>`;
  }
  if (c.tipo === 'textarea') {
    return `<div class="md:col-span-2"><label for="${id}" class="label">${c.rotulo}</label><textarea id="${id}" name="${nome}" rows="3" maxlength="${c.max}" class="input"></textarea>${dica}</div>`;
  }
  const extra = c.tipo === 'number' ? `min="0" max="${c.max}" step="1"` : c.max ? `maxlength="${c.max}"` : '';
  const largo = c.tipo === 'url' || nome === 'titulo' ? ' class="md:col-span-2"' : '';
  return `<div${largo}><label for="${id}" class="label">${c.rotulo}</label><input type="${c.tipo === 'url' ? 'text' : c.tipo}" id="${id}" name="${nome}" ${extra} class="input" ${c.tipo === 'url' ? 'placeholder="https://..." inputmode="url"' : ''}>${dica}</div>`;
}

function criarEditor(colecao) {
  const cfg = COLECOES[colecao];
  const painel = document.querySelector(`[data-panel="${colecao}"]`);
  painel.innerHTML = `
    <div class="flex flex-wrap items-center justify-between gap-3 mb-4">
      <h2 class="text-xl font-bold">${cfg.titulo}</h2>
      <button type="button" class="btn btn-primary" data-novo>+ Novo ${cfg.singular}</button>
    </div>
    <form class="card mb-6" id="${colecao}Form" hidden novalidate>
      <h3 class="font-semibold text-lg mb-4" data-form-titulo></h3>
      <div class="grid md:grid-cols-2 gap-4">${cfg.campos.map(n => campoHtml(colecao, n)).join('')}</div>
      <p class="form-error mt-4" data-erro role="alert" hidden></p>
      <div class="flex gap-2 mt-4">
        <button type="submit" class="btn btn-primary">Salvar</button>
        <button type="button" class="btn btn-outline" data-cancelar>Cancelar</button>
      </div>
    </form>
    <div class="card p-0 overflow-x-auto" data-tabela-box>
      <table class="admin-table">
        <thead><tr><th></th><th>Título</th><th>Tipo</th><th>No site</th><th>Ações</th></tr></thead>
        <tbody data-tabela></tbody>
      </table>
    </div>
    <div class="card text-center text-gray-500" data-vazio hidden>Nada cadastrado ainda.</div>`;

  const form = painel.querySelector('form');
  const erro = form.querySelector('[data-erro]');
  const tabela = painel.querySelector('[data-tabela]');
  trackDirty(form);
  let itens = [];
  let editId = null;

  async function carregar() {
    const snap = await fb.getDocs(fb.collection(fb.db, colecao));
    itens = snap.docs.map(d => ({ id: d.id, ...d.data() }))
      .sort((a, b) => (Number(a.ordem) || 0) - (Number(b.ordem) || 0));
    render();
  }

  function render() {
    painel.querySelector('[data-vazio]').hidden = itens.length > 0;
    painel.querySelector('[data-tabela-box]').hidden = itens.length === 0;
    tabela.innerHTML = itens.map((it, i) => {
      const tipo = TIPOS[colecao][it.tipo];
      const link = linkSeguro(it.link);
      return `
      <tr>
        <td class="text-2xl">${escapeHtml(it.icone)}</td>
        <td>${escapeHtml(it.titulo)}<div class="muted">${escapeHtml(String(it.descricao || '').slice(0, 90))}</div></td>
        <td><span class="status-badge ${tipo?.cor || 'bg-gray-100'}">${escapeHtml(tipo?.rotulo || it.tipo)}</span></td>
        <td class="whitespace-nowrap text-xs">${link ? 'Com link' : '<span class="text-gray-400">Em breve</span>'}</td>
        <td class="whitespace-nowrap space-x-1">
          <button type="button" class="icon-btn" data-mover="-1" data-id="${it.id}" title="Subir" aria-label="Subir" ${i === 0 ? 'disabled' : ''}>↑</button>
          <button type="button" class="icon-btn" data-mover="1" data-id="${it.id}" title="Descer" aria-label="Descer" ${i === itens.length - 1 ? 'disabled' : ''}>↓</button>
          <button type="button" class="icon-btn" data-editar="${it.id}" title="Editar" aria-label="Editar">✎</button>
          ${link ? `<a class="icon-btn" href="${escapeHtml(link)}" target="_blank" rel="noopener" title="Abrir link">↗</a>` : ''}
          <button type="button" class="icon-btn danger" data-excluir="${it.id}" title="Excluir" aria-label="Excluir">🗑️</button>
        </td>
      </tr>`;
    }).join('');
  }

  function abrir(item) {
    if (!confirmDiscard()) return;
    discardAll();
    editId = item?.id || null;
    form.querySelector('[data-form-titulo]').textContent = item ? `Editar ${cfg.singular}` : `Novo ${cfg.singular}`;
    for (const nome of cfg.campos) {
      const el = form.elements[nome];
      if (CAMPOS[nome].tipo === 'checkbox') el.checked = Boolean(item?.[nome]);
      else if (nome === 'tipo') el.value = item?.tipo || Object.keys(TIPOS[colecao])[0];
      else el.value = item?.[nome] ?? (CAMPOS[nome].tipo === 'number' ? 0 : '');
    }
    setError(erro, '');
    form.hidden = false;
    clearDirty(form);
    form.elements.titulo.focus();
  }

  function fechar() {
    form.hidden = true;
    editId = null;
    clearDirty(form);
  }

  painel.querySelector('[data-novo]').addEventListener('click', () => abrir(null));
  form.querySelector('[data-cancelar]').addEventListener('click', () => {
    if (confirmDiscard()) fechar();
  });

  tabela.addEventListener('click', async e => {
    const btn = e.target.closest('button');
    if (!btn) return;
    if (btn.dataset.editar) return abrir(itens.find(x => x.id === btn.dataset.editar));
    try {
      if (btn.dataset.excluir) {
        const it = itens.find(x => x.id === btn.dataset.excluir);
        if (!it || !confirm(`Excluir "${it.titulo}"? Isso não pode ser desfeito.`)) return;
        await fb.deleteDoc(fb.doc(fb.db, colecao, it.id));
        itens = itens.filter(x => x.id !== it.id);
        if (editId === it.id) fechar();
        render();
        showNotification('Excluído.');
      } else if (btn.dataset.mover) {
        // Troca a posição com o vizinho e regrava a ordem dos dois.
        const i = itens.findIndex(x => x.id === btn.dataset.id);
        const j = i + Number(btn.dataset.mover);
        if (i < 0 || j < 0 || j >= itens.length) return;
        [itens[i], itens[j]] = [itens[j], itens[i]];
        const batch = fb.writeBatch(fb.db);
        itens.forEach((it, n) => {
          if (it.ordem !== n + 1) {
            it.ordem = n + 1;
            batch.update(fb.doc(fb.db, colecao, it.id), { ordem: n + 1 });
          }
        });
        render();
        await withBusy(btn, () => batch.commit());
      }
    } catch (err) {
      fail(err);
      carregar().catch(console.error);
    }
  });

  form.addEventListener('submit', e => {
    e.preventDefault();
    const dados = {};
    for (const nome of cfg.campos) {
      const el = form.elements[nome];
      const c = CAMPOS[nome];
      if (c.tipo === 'checkbox') dados[nome] = el.checked;
      else if (c.tipo === 'number') dados[nome] = el.value === '' ? 0 : Number(el.value);
      else dados[nome] = el.value.trim();
    }
    if (!dados.titulo) return setError(erro, 'Informe o título.');
    for (const nome of cfg.campos.filter(n => CAMPOS[n].tipo === 'number')) {
      if (!Number.isInteger(dados[nome]) || dados[nome] < 0 || dados[nome] > CAMPOS[nome].max) {
        return setError(erro, `${CAMPOS[nome].rotulo}: use um número inteiro de 0 a ${CAMPOS[nome].max}.`);
      }
    }
    if (dados.link) {
      const link = linkSeguro(dados.link);
      if (!link) return setError(erro, 'Link inválido. Copie o endereço completo, começando com https://');
      dados.link = link;
    }
    setError(erro, '');

    withBusy(form.querySelector('button[type=submit]'), async () => {
      try {
        if (editId) {
          await fb.updateDoc(fb.doc(fb.db, colecao, editId), { ...dados, atualizadoEm: fb.serverTimestamp() });
        } else {
          const ordem = Math.max(0, ...itens.map(x => Number(x.ordem) || 0)) + 1;
          await fb.setDoc(fb.doc(fb.collection(fb.db, colecao)), { ...dados, ordem, criadoEm: fb.serverTimestamp() });
        }
        await carregar();
        fechar();
        showNotification('Salvo. Já aparece no site.');
      } catch (err) { fail(err); }
    });
  });

  return { carregar, fechar, total: () => itens.length };
}

const editores = Object.fromEntries(Object.keys(COLECOES).map(c => [c, criarEditor(c)]));

// ---------------------------------------------------------------------------
// Textos e dados do site

let siteData = mergeSite();
let siteExiste = false;
let fotoAtual = '';
const siteForm = $('siteForm');
trackDirty(siteForm);

const SITE_CAMPOS = {
  siteProfissional: 'profissional', siteProfissao: 'profissao', siteRegistro: 'registro', siteWhatsapp: 'whatsapp',
  siteEmail: 'email', siteInstagram: 'instagram',
  siteHeroTitulo: 'heroTitulo', siteHeroSubtitulo: 'heroSubtitulo', siteSobreTexto: 'sobreTexto',
};

// Aceita "@perfil", "perfil" ou o link do perfil; retorna só o nome (ou null se inválido).
function perfilInstagram(texto) {
  const t = String(texto || '').trim();
  if (!t) return '';
  const m = t.match(/^(?:https?:\/\/)?(?:www\.)?instagram\.com\/([A-Za-z0-9._]{1,30})\/?(?:\?.*)?$/i) || t.match(/^@?([A-Za-z0-9._]{1,30})$/);
  return m ? m[1] : null;
}

function faqItemHtml(item = { pergunta: '', resposta: '' }) {
  return `
    <div class="flex gap-3 items-start border border-gray-200 rounded-lg p-3" data-faq>
      <div class="flex-1 space-y-2">
        <input type="text" data-campo="pergunta" maxlength="150" class="input" placeholder="Pergunta" aria-label="Pergunta" value="${escapeHtml(item.pergunta)}">
        <textarea data-campo="resposta" rows="3" maxlength="1000" class="input" placeholder="Resposta" aria-label="Resposta">${escapeHtml(item.resposta)}</textarea>
      </div>
      <div class="flex flex-col gap-1">
        <button type="button" class="icon-btn" data-mover="-1" title="Subir" aria-label="Subir">↑</button>
        <button type="button" class="icon-btn" data-mover="1" title="Descer" aria-label="Descer">↓</button>
        <button type="button" class="icon-btn danger" data-remover title="Remover" aria-label="Remover">🗑️</button>
      </div>
    </div>`;
}

$('faqAdicionar').addEventListener('click', () => {
  $('faqLista').insertAdjacentHTML('beforeend', faqItemHtml());
  $('faqLista').lastElementChild.querySelector('input').focus();
  dirtyForms.add('siteForm');
});

$('faqLista').addEventListener('click', e => {
  const item = e.target.closest('[data-faq]');
  if (!item) return;
  if (e.target.closest('[data-remover]')) {
    item.remove();
  } else if (e.target.closest('[data-mover]')) {
    const dir = Number(e.target.closest('[data-mover]').dataset.mover);
    const alvo = dir < 0 ? item.previousElementSibling : item.nextElementSibling;
    if (!alvo) return;
    if (dir < 0) alvo.before(item); else alvo.after(item);
  } else {
    return;
  }
  dirtyForms.add('siteForm');
});

$('horariosGrid').innerHTML = DIAS.map((dia, i) =>
  `<label for="horarios${i}" class="text-sm">${dia}</label><input type="text" id="horarios${i}" class="input" placeholder="Sem atendimento">`).join('');

async function loadSite() {
  const snap = await fb.getDoc(fb.doc(fb.db, 'config', 'site'));
  siteExiste = snap.exists();
  siteData = mergeSite(snap.exists() ? snap.data() : {});
  renderSiteForm();
}

function renderSiteForm() {
  for (const [id, campo] of Object.entries(SITE_CAMPOS)) $(id).value = siteData[campo] || '';
  $('siteCredenciais').value = (siteData.credenciais || []).join('\n');
  $('sitePresencial').checked = Boolean(siteData.presencial);
  $('faqLista').innerHTML = (siteData.faq || []).map(faqItemHtml).join('');
  DIAS.forEach((_, i) => { $(`horarios${i}`).value = (siteData.horarios?.[i] || []).join(', '); });
  fotoAtual = siteData.fotoUrl || '';
  $('fotoPreview').src = fotoAtual || FOTO_PADRAO;
  setError($('siteErro'), '');
  clearDirty(siteForm);
}

$('fotoTrocar').addEventListener('click', () => $('fotoArquivo').click());
$('fotoRemover').addEventListener('click', () => {
  fotoAtual = '';
  $('fotoPreview').src = FOTO_PADRAO;
  dirtyForms.add('siteForm');
});

// Reduz a foto para no máximo 480px e salva como JPEG (texto base64 no próprio documento).
$('fotoArquivo').addEventListener('change', async () => {
  const file = $('fotoArquivo').files[0];
  $('fotoArquivo').value = '';
  if (!file) return;
  try {
    const bitmap = await createImageBitmap(file);
    const escala = Math.min(1, 480 / Math.max(bitmap.width, bitmap.height));
    const canvas = document.createElement('canvas');
    canvas.width = Math.round(bitmap.width * escala);
    canvas.height = Math.round(bitmap.height * escala);
    canvas.getContext('2d').drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
    if (dataUrl.length > 700000) throw new Error('imagem grande demais');
    fotoAtual = dataUrl;
    $('fotoPreview').src = dataUrl;
    dirtyForms.add('siteForm');
  } catch (err) {
    console.error(err);
    showNotification('Não foi possível usar esta imagem. Tente uma foto JPG ou PNG.', 'erro');
  }
});

function parseHorarios(text) {
  const itens = text.split(/[\s,;]+/).filter(Boolean);
  const invalidos = itens.filter(h => !/^([01]\d|2[0-3]):[0-5]\d$/.test(h));
  return { lista: [...new Set(itens)].sort(), invalidos };
}

siteForm.addEventListener('submit', e => {
  e.preventDefault();
  const erro = $('siteErro');
  const dados = {};
  for (const [id, campo] of Object.entries(SITE_CAMPOS)) dados[campo] = $(id).value.trim();
  if (!dados.profissional) return setError(erro, 'Informe o nome da profissional.');
  const digitos = dados.whatsapp.replace(/\D/g, '');
  if (dados.whatsapp && (digitos.length < 12 || digitos.length > 13 || !digitos.startsWith('55'))) {
    return setError(erro, 'WhatsApp inválido. Use 55 + DDD + número, ex.: 5511987654321.');
  }
  dados.whatsapp = digitos;
  if (dados.email && !$('siteEmail').checkValidity()) return setError(erro, 'E-mail de contato inválido.');
  const perfil = perfilInstagram(dados.instagram);
  if (perfil === null) return setError(erro, 'Instagram inválido. Use o nome do perfil, ex.: @seuperfil.');
  dados.instagram = perfil;
  dados.faq = [...$('faqLista').querySelectorAll('[data-faq]')].map(el => ({
    pergunta: el.querySelector('[data-campo=pergunta]').value.trim(),
    resposta: el.querySelector('[data-campo=resposta]').value.trim(),
  })).filter(f => f.pergunta || f.resposta);
  if (dados.faq.some(f => !f.pergunta || !f.resposta)) return setError(erro, 'Cada pergunta frequente precisa de pergunta e resposta.');
  dados.credenciais = linhas($('siteCredenciais').value);
  if (dados.credenciais.length > 6) return setError(erro, 'Use no máximo 6 destaques.');
  dados.presencial = $('sitePresencial').checked;
  dados.horarios = {};
  for (let i = 0; i < 7; i++) {
    const { lista, invalidos } = parseHorarios($(`horarios${i}`).value);
    if (invalidos.length) return setError(erro, `Horário inválido em ${DIAS[i]}: ${invalidos.join(', ')}. Use o formato 08:00.`);
    dados.horarios[i] = lista;
  }
  dados.fotoUrl = fotoAtual;
  setError(erro, '');

  withBusy(siteForm.querySelector('button[type=submit]'), async () => {
    try {
      await fb.setDoc(fb.doc(fb.db, 'config', 'site'), { ...dados, atualizadoEm: fb.serverTimestamp() });
      siteData = mergeSite(dados);
      siteExiste = true;
      clearDirty(siteForm);
      updateImportBox();
      showNotification('Textos e dados salvos.');
    } catch (err) { fail(err); }
  });
});

// ---------------------------------------------------------------------------
// Planos

let planosData = mergePlanos();
let planosAtiva = false;
const planosForm = $('planosForm');
trackDirty(planosForm);

// Aceita "39,90", "39.90" e "1.299,00".
function parsePreco(texto) {
  let t = String(texto || '').replace(/[^\d.,]/g, '');
  if (t.includes(',')) t = t.replace(/\./g, '').replace(',', '.');
  const n = Number(t || 0);
  return Number.isFinite(n) ? Math.round(n * 100) / 100 : NaN;
}

function precoParaCampo(n) {
  const v = Number(n) || 0;
  return v % 1 ? v.toFixed(2).replace('.', ',') : String(v);
}

async function loadPlanos() {
  const snap = await fb.getDoc(fb.doc(fb.db, 'config', 'planos'));
  planosData = mergePlanos(snap.exists() ? snap.data().planos : []);
  planosAtiva = snap.exists() && snap.data().ativa === true;
  renderPlanosForm();
}

function renderPlanosForm() {
  $('planosAtiva').checked = planosAtiva;
  $('planosLista').innerHTML = planosData.map(p => `
    <fieldset data-plano="${p.id}">
      <legend>${escapeHtml(p.nome)}</legend>
      <div class="grid md:grid-cols-3 gap-4">
        <div>
          <label class="label">Nome do plano</label>
          <input type="text" data-campo="nome" maxlength="40" class="input" value="${escapeHtml(p.nome)}">
        </div>
        <div>
          <label class="label">Preço mensal (R$)</label>
          <input type="text" inputmode="decimal" data-campo="mensal" class="input" value="${precoParaCampo(p.mensal)}">
        </div>
        <div>
          <label class="label">No plano anual (R$ por mês)</label>
          <input type="text" inputmode="decimal" data-campo="anual" class="input" value="${precoParaCampo(p.anual)}">
        </div>
        <div class="md:col-span-3">
          <label class="label">O que inclui</label>
          <textarea data-campo="recursos" rows="4" maxlength="800" class="input">${escapeHtml((p.recursos || []).join('\n'))}</textarea>
          <span class="hint">Um item por linha.</span>
        </div>
        <div class="md:col-span-3 grid md:grid-cols-2 gap-4">
          <div>
            <label class="label">Link de pagamento (mensal)</label>
            <input type="text" inputmode="url" data-campo="linkMensal" class="input" placeholder="https://..." value="${escapeHtml(p.linkMensal)}">
          </div>
          <div>
            <label class="label">Link de pagamento (anual)</label>
            <input type="text" inputmode="url" data-campo="linkAnual" class="input" placeholder="https://..." value="${escapeHtml(p.linkAnual)}">
          </div>
        </div>
      </div>
    </fieldset>`).join('');
  $('planoDestaque').innerHTML = planosData.map(p =>
    `<label class="flex items-center gap-2"><input type="radio" name="planoDestaque" value="${p.id}"${p.destaque ? ' checked' : ''}> ${escapeHtml(p.nome)}</label>`).join('');
  setError($('planosErro'), '');
  clearDirty(planosForm);
}

planosForm.addEventListener('submit', e => {
  e.preventDefault();
  const erro = $('planosErro');
  const destaque = planosForm.querySelector('input[name=planoDestaque]:checked')?.value;
  const planos = [];
  for (const el of $('planosLista').querySelectorAll('[data-plano]')) {
    const campo = c => el.querySelector(`[data-campo=${c}]`).value.trim();
    const p = {
      id: el.dataset.plano,
      nome: campo('nome'),
      mensal: parsePreco(campo('mensal')),
      anual: parsePreco(campo('anual')),
      recursos: linhas(campo('recursos')),
      linkMensal: campo('linkMensal'),
      linkAnual: campo('linkAnual'),
      destaque: el.dataset.plano === destaque,
    };
    if (!p.nome) return setError(erro, 'Dê um nome a cada plano.');
    if (Number.isNaN(p.mensal) || Number.isNaN(p.anual)) return setError(erro, `Preço inválido no plano ${p.nome}. Use o formato 39,90.`);
    for (const k of ['linkMensal', 'linkAnual']) {
      if (p[k] && !linkSeguro(p[k])) return setError(erro, `Link inválido no plano ${p.nome}. Use o endereço completo, começando com https://`);
      p[k] = linkSeguro(p[k]);
    }
    planos.push(p);
  }
  setError(erro, '');

  withBusy(planosForm.querySelector('button[type=submit]'), async () => {
    try {
      const ativa = $('planosAtiva').checked;
      await fb.setDoc(fb.doc(fb.db, 'config', 'planos'), { planos, ativa, atualizadoEm: fb.serverTimestamp() });
      planosData = mergePlanos(planos);
      planosAtiva = ativa;
      renderPlanosForm();
      showNotification(ativa ? 'Planos salvos. A página está no site.' : 'Planos salvos (página escondida no site).');
    } catch (err) { fail(err); }
  });
});

// ---------------------------------------------------------------------------
// Importação do conteúdo inicial (banco vazio)

function updateImportBox() {
  $('importarBox').hidden = siteExiste;
}

// Copia textos, planos, cursos, materiais e atividades de exemplo para o banco, numa única operação.
async function importarConteudoInicial() {
  const batch = fb.writeBatch(fb.db);
  const agora = fb.serverTimestamp();
  batch.set(fb.doc(fb.db, 'config', 'site'), { ...structuredClone(D.site), atualizadoEm: agora });
  batch.set(fb.doc(fb.db, 'config', 'planos'), { planos: structuredClone(D.planos), ativa: D.planosAtiva, atualizadoEm: agora });
  for (const colecao of Object.keys(COLECOES)) {
    D[colecao].forEach(({ id, ...item }) => batch.set(fb.doc(fb.db, colecao, id), { ...item, criadoEm: agora }));
  }
  await batch.commit();
  await loadAll();
}

$('importarBtn').addEventListener('click', () => {
  if (!confirm('Importar os textos, cursos, materiais, atividades e planos de exemplo?')) return;
  withBusy($('importarBtn'), async () => {
    try {
      await importarConteudoInicial();
      showNotification('Conteúdo inicial importado.');
    } catch (err) { fail(err); }
  });
});

// ---------------------------------------------------------------------------
// Início: com o painel montado, carrega o Firebase e acompanha o login.

if (!isConfigured) {
  showView('viewNaoConfigurado');
} else {
  try {
    await carregarFirebase();
    fb.onAuthStateChanged(fb.auth, onUser);
  } catch (err) {
    console.error(err);
    showView('viewNaoConfigurado');
  }
}
