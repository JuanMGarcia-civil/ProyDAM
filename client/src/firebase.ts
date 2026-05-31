import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBNTeIq-JyHSo36Mg-BH7nhihksncIGsNg",
  authDomain: "plotme-proydam-jmg.firebaseapp.com",
  projectId: "plotme-proydam-jmg",
  storageBucket: "plotme-proydam-jmg.firebasestorage.app",
  messagingSenderId: "616153650973",
  appId: "1:616153650973:web:3c3024ae0ba1cd76dd33f4"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
