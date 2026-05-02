// // congifs/hooks.js
// import {
//   collection,
//   doc,
//   onSnapshot,
//   query,
//   where,
//   orderBy,
//   limit,
//   addDoc,
//   deleteDoc,
//   getDocs,
//   serverTimestamp
// } from 'firebase/firestore';
// import { useEffect, useState } from 'react';
// import { db } from './firebase';
// import { useAuth } from '../context/AuthContext';

// // 1️⃣ Current user document
// export function useCurrentUserDoc() {
//   const { currentUser } = useAuth();
//   const [docData, setDocData] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     if (!currentUser) { setDocData(null); setLoading(false); return; }
//     return onSnapshot(doc(db, 'users', currentUser.uid), snap => {
//       setDocData(snap.data() || null);
//       setLoading(false);
//     });
//   }, [currentUser]);

//   return { doc: docData, loading };
// }

// // 2️⃣ My articles
// export function useMyArticles(pageSize = 6) {
//   const { currentUser } = useAuth();
//   const [state, setState] = useState({ list: [], loading: true });

//   useEffect(() => {
//     if (!currentUser) { setState({ list: [], loading: false }); return; }
//     const q = query(
//       collection(db, 'articles'),
//       where('authorId', '==', currentUser.uid),
//       orderBy('createdAt', 'desc'),
//       limit(pageSize)
//     );
//     return onSnapshot(
//       q,
//       snap => setState({ list: snap.docs.map(d => ({ id: d.id, ...d.data() })), loading: false }),
//       err => { console.error(err); setState({ list: [], loading: false }); }
//     );
//   }, [currentUser, pageSize]);

//   return state;
// }

// // 3️⃣ Follow / unfollow
// // export const follow = async (myUid, targetUid) => {
// //   await addDoc(collection(db, 'followers', targetUid, 'people'), { uid: myUid, at: serverTimestamp() });
// //   await addDoc(collection(db, 'following', myUid, 'people'), { uid: targetUid, at: serverTimestamp() });
// // };
// // export const unfollow = async (myUid, targetUid) => {
// //   await deleteDoc(doc(db, 'followers', targetUid, 'people', myUid));
// //   await deleteDoc(doc(db, 'following', myUid, 'people', targetUid));
// // };

// // 4️⃣ Load followers/following
// // export async function loadFList(kind, uid) {
// //   const col = collection(db, kind === 'followers' ? 'followers' : 'following', uid, 'people');
// //   const snap = await getDocs(col);
// //   return snap.docs.map(d => ({ uid: d.id, ...d.data() }));
// // }



// congifs/hooks.js
import {
  collection,
  doc,
  onSnapshot,
  query,
  where,
  orderBy,
  limit,
  addDoc,
  deleteDoc,
  getDocs,
  serverTimestamp
} from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { db } from './firebase';
import { useAuth } from '../context/AuthContext';

// 1️⃣ Current user document
export function useCurrentUserDoc() {
  const { currentUser } = useAuth();
  const [docData, setDocData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentUser) { setDocData(null); setLoading(false); return; }
    return onSnapshot(doc(db, 'users', currentUser.uid), snap => {
      setDocData(snap.data() || null);
      setLoading(false);
    });
  }, [currentUser]);

  return { doc: docData, loading };
}

// 2️⃣ My articles
export function useMyArticles(pageSize = 6) {
  const { currentUser } = useAuth();
  const [state, setState] = useState({ list: [], loading: true });

  useEffect(() => {
    if (!currentUser) { setState({ list: [], loading: false }); return; }
    const q = query(
      collection(db, 'articles'),
      where('authorId', '==', currentUser.uid),
      orderBy('createdAt', 'desc'),
      limit(pageSize)
    );
    return onSnapshot(
      q,
      snap => setState({ list: snap.docs.map(d => ({ id: d.id, ...d.data() })), loading: false }),
      err => { console.error(err); setState({ list: [], loading: false }); }
    );
  }, [currentUser, pageSize]);

  return state;
}
