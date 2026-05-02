// import { doc, getDoc, onSnapshot, writeBatch } from 'firebase/firestore';
// import { db } from './firebase';
// import { useEffect, useState } from 'react';
// import { useAuth } from '../context/AuthContext';

// // Claim a unique username
// export async function claimUsername(uid, requestedName) {
//   const uname = requestedName.toLowerCase().replace(/[^\w]/g, '');
//   const ref = doc(db, 'usernames', uname);
//   if ((await getDoc(ref)).exists()) throw new Error('username-taken');

//   const batch = writeBatch(db);
//   batch.set(ref, { uid });
//   batch.set(
//     doc(db, 'users', uid),
//     { username: uname, usernameChangedAt: Date.now() },
//     { merge: true }
//   );
//   await batch.commit();
//   return uname;
// }

// // Hook: stream current user profile
// export function useUserDoc() {
//   const { currentUser } = useAuth();
//   const [userDoc, setUserDoc] = useState(null);
//   // const [loading, setLoading] = useState(true);

//  useEffect(() => {
//     if (!currentUser) return
//     const unsub = onSnapshot(
//       doc(db, 'users', currentUser.uid),
//       snap => setUserDoc(snap.exists() ? snap.data() : null),
//       console.error
//     )
//     return () => unsub()
//   }, [currentUser])

//   return { userDoc };
// }




//configs/user.js
import { doc, getDoc, onSnapshot, writeBatch } from 'firebase/firestore';
import {  db } from './firebase';

import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';

// Claim a unique username
export async function claimUsername(uid, requestedName) {
  const uname = requestedName.toLowerCase().replace(/[^\w]/g, '');
  const ref = doc(db, 'usernames', uname);
  if ((await getDoc(ref)).exists()) throw new Error('username-taken');

  const batch = writeBatch(db);
  batch.set(ref, { uid });
  batch.set(
    doc(db, 'users', uid),
    { username: uname, usernameChangedAt: Date.now() },
    { merge: true }
  );
  await batch.commit();
  return uname;
}

// Hook: stream current user profile
export function useUserDoc() {
  const { currentUser } = useAuth();
  const [userDoc, setUserDoc] = useState(null);
  // const [loading, setLoading] = useState(true);

 useEffect(() => {
    if (!currentUser) return
    const unsub = onSnapshot(
      doc(db, 'users', currentUser.uid),
      snap => setUserDoc(snap.exists() ? snap.data() : null),
      console.error
    )
    return () => unsub()
  }, [currentUser])

  return { userDoc };
}