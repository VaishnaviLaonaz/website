import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
  applyActionCode,
 } from 'firebase/auth';
import {getDoc, doc, setDoc, serverTimestamp } from 'firebase/firestore';
import {
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBIcon,
} from 'mdb-react-ui-kit';

import { auth, db } from '../../configs/firebase';
import GoogleAuthButton from './GoogleAuthButton';
import RegistrationLeftPanel from './RegistrationLeftPanel';

import '../../styles/design-tokens.css';
import '../../styles/auth.css';
/*****************************************************************
 * 1. RegistrationPage (default export)                          *
 *****************************************************************/
export default function RegistrationPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPwd, setShowPwd] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { user } = await createUserWithEmailAndPassword(auth, email.trim(), password);

      // send verification email that brings user back to /verify-email
      await sendEmailVerification(user, {
        url: `${window.location.origin}/verify-email`,
        handleCodeInApp: true,
      });

      await setDoc(doc(db, 'users', user.uid), {
        email: email.trim(),
        registeredAt: serverTimestamp(),
      });

      navigate('/verify-email');
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };


return (
    <div className="auth-shell">
      <MDBContainer fluid className="p-0 auth-bounded">
        <MDBRow className="g-0 flex-fill">
        

          <RegistrationLeftPanel />

          <MDBCol md="6" className="auth-right">
            <div className="auth-form auth-form--narrow">
              <h1 className="auth-title mb-5">Create your account</h1>

              {error && <div className="auth-error mb-3">{error}</div>}

              <form onSubmit={handleRegister}>
                <div className="mb-4">
                  <label className="auth-label">Email</label>
                  <input
                    type="email"
                    className="form-control auth-input"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                <div className="mb-5">
                  <label className="auth-label">Password</label>
                  <div className="position-relative">
                    <input
                      type={showPwd ? 'text' : 'password'}
                      className="form-control auth-input pe-5 no-native-pwd-icon"
                      placeholder="at least 8 characters, include a number"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                    <MDBIcon
                      fas
                      icon={showPwd ? 'eye' : 'eye-slash'}
                      onClick={() => setShowPwd(v => !v)}
                      className="position-absolute"
                      style={{ top: '50%', right: '1rem', transform: 'translateY(-50%)', cursor: 'pointer', color: '#6b6b6b' }}
                    />
                  </div>
                </div>

                <div className="text-center mb-4">
                  <button type="submit" disabled={loading} className="btn-accent">
                    {loading ? 'CREATING…' : 'CREATE ACCOUNT'}
                  </button>
                </div>
              </form>

              <div className="auth-divider mb-4">
                <hr style={{ color: '#FFFFFF' }} /><span>or continue with</span><hr />
              </div>

              <div className="text-center mb-5">
                <GoogleAuthButton mode="register" />
              </div>

              <div className="text-center" style={{ color: '#FFFFFF' }}>
                Already have an account?{' '}
                <Link to="/login" className="fw-semibold auth-link">Log In</Link>
              </div>
            </div>
          </MDBCol>
        </MDBRow>
      </MDBContainer>
    </div>
  );
}







// /*****************************************************************
//  * 2. VerifyEmailPage (named export)                             *
//  *****************************************************************/
// export function VerifyEmailPage() {
//   const [phase, setPhase] = useState('checking'); // checking | success | error | waiting
//   const [error, setError] = useState('');

//   const navigate  = useNavigate();
//   const location  = useLocation();

//   // ── Try to apply oobCode if present ──
//   useEffect(() => {
//     const params = new URLSearchParams(location.search);
//     const mode = params.get('mode');
//     const oob  = params.get('oobCode');

//     if (mode === 'verifyEmail' && oob) {
//       applyActionCode(auth, oob)
//         .then(async () => {
//           await auth.currentUser?.reload();
//           setPhase('success');
//         })
//         .catch((err) => {
//           console.error(err);
//           setError(err.message);
//           setPhase('error');
//         });
//     } else {
//       setPhase('waiting');
//     }
//   }, [location.search]);

//   // ── Poll every 5 s while waiting ──
//   useEffect(() => {
//     if (phase !== 'waiting') return;
//     const id = setInterval(async () => {
//       if (auth.currentUser) {
//         await auth.currentUser.reload();
//         if (auth.currentUser.emailVerified) {
//           setPhase('success');
//         }
//       }
//     }, 5000);
//     return () => clearInterval(id);
//   }, [phase]);

//   // ── On success, auto-redirect after short delay ──
//   useEffect(() => {
//     if (phase === 'success') {
//       const t = setTimeout(() => navigate('/profilesetup'), 1200);
//       return () => clearTimeout(t);
//     }
//   }, [phase, navigate]);

//   const resend = async () => {
//     try {
//       if (auth.currentUser) await sendEmailVerification(auth.currentUser, { url: `${window.location.origin}/verify-email`, handleCodeInApp: true });
//       alert('Verification email resent.');
//     } catch (err) {
//       console.error(err);
//       setError(err.message);
//       setPhase('error');
//     }
//   };

//   return (
//     <MDBContainer fluid className="d-flex flex-column align-items-center justify-content-center min-vh-100" style={{ background: '#F4F4EC' }}>
//       <div className="bg-white p-4 rounded-3 shadow" style={{ maxWidth: 420, width: '100%' }}>
//         {phase === 'checking' && (
//           <>
//             <h4 className="text-center mb-3">Verifying…</h4>
//             <div className="d-flex justify-content-center"><MDBSpinner /></div>
//           </>
//         )}

//         {phase === 'success' && (
//           <div className="text-center">
//             <MDBIcon fas icon="check-circle" size="3x" className="text-success mb-3" />
//             <h4 className="mb-2">Email verified!</h4>
//             <p className="text-muted mb-4">Redirecting to profile setup…</p>
//             <MDBBtn onClick={() => navigate('/profilesetup')}>Continue now</MDBBtn>
//           </div>
//         )}

//         {phase === 'error' && (
//           <>
//             <h4 className="text-center text-danger mb-3">Verification failed</h4>
//             <p className="text-center text-danger">{error || 'Invalid / expired link'}</p>
//             <div className="text-center mt-4">
//               <button className="btn btn-link p-0" style={{ textDecoration: 'underline' }} onClick={resend}>
//                 resend verification email
//               </button>
//             </div>
//           </>
//         )}

//         {phase === 'waiting' && (
//           <>
//             <h4 className="text-center mb-3">Check your inbox</h4>
//             <p className="text-center text-muted mb-4">We sent a verification link. Once clicked, this page will update automatically.</p>
//             <div className="text-center mt-2">
//               Didn’t get it?{' '}
//               <button className="btn btn-link p-0" style={{ textDecoration: 'underline' }} onClick={resend}>
//                 resend
//               </button>
//             </div>
//           </>
//         )}
//       </div>
//     </MDBContainer>
//   );
// }

// // -------------------------------------------------------------
// // End of single-file module                                    
// // -------------------------------------------------------------