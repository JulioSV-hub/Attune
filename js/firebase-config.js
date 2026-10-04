// Configuração do projeto Firebase (Console do Firebase → Configurações do projeto → Seus apps → Web).
// Estes valores são públicos por natureza; a proteção dos dados está nas regras (firestore.rules).
// Enquanto apiKey estiver vazio, o site mostra o conteúdo inicial e o painel admin fica indisponível.
export const firebaseConfig = {
  apiKey: '',
  authDomain: '',
  projectId: '',
  storageBucket: '',
  messagingSenderId: '',
  appId: '',
};

// Desenvolvimento: localStorage 'sobrevoce.emulator' = '1' (em localhost) usa os emuladores locais do Firebase.
export const useEmulator = ['localhost', '127.0.0.1'].includes(location.hostname)
  && localStorage.getItem('sobrevoce.emulator') === '1';

export const isConfigured = useEmulator || Boolean(firebaseConfig.apiKey && firebaseConfig.projectId);
