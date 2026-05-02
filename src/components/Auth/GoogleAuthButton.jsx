// ============================================================================
// GoogleAuthButton.jsx  (reusable)
// ============================================================================
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithPopup, fetchSignInMethodsForEmail } from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { MDBBtn, MDBIcon } from 'mdb-react-ui-kit';
import humanFirebaseError from "../../configs/firebaseErrors";

import { auth, db, googleProvider } from '../../configs/firebase';

export default function GoogleAuthButton({
  mode = 'login',              // 'login' | 'register'
  colors = { text: '#fff' },   // button outline color
  className = '',
  fullWidth = false,
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');
  const navigate = useNavigate();

  const handleGoogle = async () => {
    setError('');
    setLoading(true);
    try {
      const { user } = await signInWithPopup(auth, googleProvider);

      const docRef = doc(db, 'users', user.uid);
      const snap   = await getDoc(docRef);

      if (!snap.exists()) {
        // First‑time Google user
        await setDoc(docRef, {
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL,
          provider: 'google',
          registeredAt: serverTimestamp(),
        });
        navigate('/profilesetup');
      } else {
        // Existing user
        navigate(mode === 'login' ? '/home' : '/');
      }
    } catch (err) {
      console.error(err);
      if (err.code === 'auth/account-exists-with-different-credential') {
        const email = err.customData?.email;
        if (email) {
          const methods = await fetchSignInMethodsForEmail(auth, email);
          setError(`Account already exists with ${methods.join(', ')}. Please log in using that method.`);
          navigate('/login');
        } else {
          setError('Account exists with a different sign‑in method.');
        }
      } else {
        setError(humanFirebaseError(err));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {error && <div className="text-danger text-center mb-2" style={{ fontSize: 14 }}>{error}</div>}
     
        <MDBBtn
          outline
          className="d-flex align-items-center justify-content-center mx-auto"
          style={{
            borderColor: colors.text,
            color: colors.text,
            borderRadius: 14,
            padding: '0.5rem 2.5rem',
            gap: '0.5rem',
          }}
          disabled={loading}
          onClick={handleGoogle}
        >
        <MDBIcon fab icon="google" />
          Google
        </MDBBtn>  
   
    </>
  );
}