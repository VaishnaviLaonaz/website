// src/components/Auth/VerifyEmailPage.jsx
// -----------------------------------------------------------------------------
// Stand‑alone verification screen, styled exactly like RegistrationPage layout.
// Left panel → existing <RegistrationLeftPanel />
// Right panel → green background, big check‑circle on success.
// Logic unchanged from original inline component.
// -----------------------------------------------------------------------------
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  applyActionCode,
  sendEmailVerification,
} from 'firebase/auth';
import {
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBIcon,
  MDBBtn,
  MDBSpinner,
} from 'mdb-react-ui-kit';

import { auth } from '../../configs/firebase';
import RegistrationLeftPanel from './RegistrationLeftPanel';
import '../../styles/design-tokens.css';
import '../../styles/auth.css';

export default function VerifyEmailPage() {
  const [phase, setPhase] = useState('checking'); // checking | success | error | waiting
  const [error, setError] = useState('');

  const navigate = useNavigate();
  const location = useLocation();

  /* ── 1. Try to apply oobCode if present ── */
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const mode = params.get('mode');
    const oob = params.get('oobCode');

    if (mode === 'verifyEmail' && oob) {
      applyActionCode(auth, oob)
        .then(async () => {
          await auth.currentUser?.reload();
          setPhase('success');
        })
        .catch((err) => {
          console.error(err);
          setError(err.message);
          setPhase('error');
        });
    } else {
      setPhase('waiting');
    }
  }, [location.search]);

  /* ── 2. Poll every 5 s while waiting ── */
  useEffect(() => {
    if (phase !== 'waiting') return;
    const id = setInterval(async () => {
      if (auth.currentUser) {
        await auth.currentUser.reload();
        if (auth.currentUser.emailVerified) setPhase('success');
      }
    }, 5000);
    return () => clearInterval(id);
  }, [phase]);

  /* ── 3. Auto‑redirect after success ── */
  useEffect(() => {
    if (phase === 'success') {
      const t = setTimeout(() => navigate('/profilesetup'), 1500);
      return () => clearTimeout(t);
    }
  }, [phase, navigate]);

  /* ── resend helper ── */
  const resend = async () => {
    try {
      if (auth.currentUser)
        await sendEmailVerification(auth.currentUser, {
          url: `${window.location.origin}/verify-email`,
          handleCodeInApp: true,
        });
      alert('Verification email resent.');
    } catch (err) {
      console.error(err);
      setError(err.message);
      setPhase('error');
    }
  };

  
 return (
    <div className="auth-shell">
      <MDBContainer fluid className="p-0 auth-bounded">
        <MDBRow className="g-0 flex-fill">
          <RegistrationLeftPanel />

          <MDBCol md="6" className="auth-right">
            <div className="auth-card">
              {phase === 'checking' && (
                <>
                  <h4 className="mb-3">Verifying…</h4>
                  <MDBSpinner />
                </>
              )}

              {phase === 'waiting' && (
                <>
                  <h4 className="mb-3">Check your inbox</h4>
                  <p className="text-muted mb-4">
                    We sent a verification link. Once clicked, this page will update automatically.
                  </p>
                  <p className="small">
                    Didn’t get it?{' '}
                    <button className="btn btn-link p-0 fw-semibold" onClick={resend}>resend</button>
                  </p>
                </>
              )}

              {phase === 'success' && (
                <>
                  <MDBIcon fas icon="check-circle" size="4x" className="text-success mb-3" />
                  <h4 className="mb-2">Email verified!</h4>
                  <p className="text-muted mb-4">Redirecting to profile setup…</p>
                  <MDBBtn color="success" onClick={() => navigate('/profilesetup')}>Continue now</MDBBtn>
                </>
              )}

              {phase === 'error' && (
                <>
                  <h4 className="text-danger mb-3">Verification failed</h4>
                  <p className="text-danger small">{error || 'Invalid / expired link'}</p>
                  <button className="btn btn-link p-0 fw-semibold" onClick={resend}>
                    resend verification email
                  </button>
                </>
              )}
            </div>
          </MDBCol>
        </MDBRow>
      </MDBContainer>
    </div>
  );
}