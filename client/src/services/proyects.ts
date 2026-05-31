import {
  addDoc,
  collection,
  onSnapshot,
  query,
  serverTimestamp,
  where,
} from 'firebase/firestore';
import { db, auth } from '../firebase';

export interface Proyect {
  id: string;
  name: string;
  description: string;
}

const proyectsRef = collection(db, 'proyects');

export async function addProyect(name: string, description: string): Promise<void> {
  console.log('[addProyect] auth.currentUser:', auth.currentUser);
  console.log('[addProyect] payload:', { name, description, uid: auth.currentUser?.uid });
  try {
    const ref = await addDoc(proyectsRef, {
      name,
      description,
      uid: auth.currentUser?.uid,
      createdAt: serverTimestamp(),
    });
    console.log('[addProyect] created doc id:', ref.id);
  } catch (err) {
    console.error('[addProyect] Firestore error:', err);
    throw err;
  }
}

export function subscribeProyects(cb: (proyects: Proyect[]) => void): () => void {
  console.log('[subscribeProyects] auth.currentUser:', auth.currentUser);
  const q = query(proyectsRef, where('uid', '==', auth.currentUser?.uid));
  return onSnapshot(
    q,
    (snap) => {
      console.log('[subscribeProyects] snapshot size:', snap.size);
      cb(
        snap.docs.map((d) => {
          const data = d.data() as { name: string; description: string };
          return { id: d.id, name: data.name, description: data.description };
        })
      );
    },
    (err) => {
      console.error('[subscribeProyects] Firestore error:', err);
    }
  );
}
