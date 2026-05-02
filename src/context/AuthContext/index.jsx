
// contex/AuthContect/index.js:
// src/context/AuthContext/index.jsx
import { createContext, useContext, useEffect, useState } from 'react';
import { auth } from '../../configs/firebase';
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  updatePassword,
  sendPasswordResetEmail,
  createUserWithEmailAndPassword,
  signOut,
} from 'firebase/auth';

const AuthCtx = createContext();

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading,      setLoading]     = useState(true);

  /* keep Firebase auth in sync */
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, user => {
      setCurrentUser(user);
      setLoading(false);
    });
    return unsub;
  }, []);

// useEffect(() => {
//   if (!currentUser) return;

//   const lastLoginMs = Date.parse(currentUser.metadata.lastSignInTime); // number
//   const expiresMs   = lastLoginMs + 48 * 60 * 60 * 1_000;              // +48 h
//   const msUntil     = expiresMs - Date.now();

//   if (msUntil <= 0) { auth.signOut(); return; }

//   const t = setTimeout(() => auth.signOut(), msUntil);
//   return () => clearTimeout(t);
// }, [currentUser]);

  /* wrappers you can import elsewhere */
  const login  = (e, p) => signInWithEmailAndPassword(auth, e, p);
  const signup = (e, p) => createUserWithEmailAndPassword(auth, e, p);
  const resetPassword = (email) => sendPasswordResetEmail(auth, email);
  const passwordUpdate = (newPwd) => updatePassword(auth.currentUser, newPwd);
  const logout = ()      => signOut(auth);

  const value = { currentUser, login, signup, logout, resetPassword, passwordUpdate };

  return (
    <AuthCtx.Provider value={value}>
      {!loading && children}
    </AuthCtx.Provider>
  );
}

export function useAuth() {
  return useContext(AuthCtx);
}