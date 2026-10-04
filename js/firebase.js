// Inicialização do Firebase compartilhada pelo site e pelo painel admin.
// Só é carregado quando isConfigured é verdadeiro (firebase-config.js).
import { initializeApp } from 'https://www.gstatic.com/firebasejs/12.19.0/firebase-app.js';
import { getFirestore, connectFirestoreEmulator } from 'https://www.gstatic.com/firebasejs/12.19.0/firebase-firestore-lite.js';
import { firebaseConfig, useEmulator } from './firebase-config.js';

const config = useEmulator
  ? { apiKey: 'demo-key', projectId: 'demo-sobre-voce', authDomain: 'demo-sobre-voce.firebaseapp.com' }
  : firebaseConfig;

export const app = initializeApp(config);
export const db = getFirestore(app);
export const emulator = useEmulator;

// Porta do emulador do Firestore: 8080, ou o valor de localStorage 'sobrevoce.emulator.firestorePort'.
if (useEmulator) {
  connectFirestoreEmulator(db, '127.0.0.1', Number(localStorage.getItem('sobrevoce.emulator.firestorePort')) || 8080);
}
