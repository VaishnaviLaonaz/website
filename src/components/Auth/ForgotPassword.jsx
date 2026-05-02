import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MDBContainer, MDBRow, MDBCol, MDBBtn, MDBIcon } from 'mdb-react-ui-kit';
import RegistrationLeftPanel from './RegistrationLeftPanel';
import { resetPassword } from '../../configs/firebase';  
import '../../styles/design-tokens.css';
import '../../styles/auth.css';

export default function ForgotPassword() {
  const navigate = useNavigate();
 

  /* ------- flow control: step 1 → 2 → 3 -------- */
  const [step, setStep] = useState(1);

  /* ------- state for each step ------------------ */
  const [email, setEmail] = useState('');
  const [emailValid, setEmailValid] = useState(false);
  const [pwd, setPwd] = useState('');
  const [pwdValid, setPwdValid] = useState(false);
  const [sending, setSending] = useState(false);  

  /* simple strength rule: ≥8 chars incl. letter & digit */
  const rule = /^(?=.*[A-Za-z])(?=.*\d).{8,}$/;
  const emailRule = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

  async function sendReset() {
    if (!emailValid) return;
    setSending(true);
    try {
      await resetPassword(email.trim());
      setStep(2);                   // success screen
    } catch (err) {
      alert(err.message);
    } finally {
      setSending(false);
    }
  }


return (
    <div className="auth-shell">
      <MDBContainer fluid className="p-0 auth-bounded">
        <MDBRow className="g-0 flex-fill">
          <RegistrationLeftPanel />

          <MDBCol md="6" className="auth-right">
            <div className="auth-form auth-form--narrow">
              <h1 className="auth-title mb-5">Password Reset</h1>

              {/* STEP 1 */}
              {step === 1 && (
                <>
                  <div className="mb-4">
                    <label className="auth-label">
                      Enter your email or username to reset your password
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        setEmailValid(emailRule.test(e.target.value));
                      }}
                      className="form-control auth-input"
                      placeholder="you@example.com"
                      required
                    />
                    {email && !emailValid && (
                      <div className="text-danger small mt-1">Enter a valid e-mail</div>
                    )}
                  </div>

                  <div className="text-center mb-4">
                    <button
                      type="button"
                      className="btn-accent"
                      onClick={sendReset}
                      disabled={!emailValid || sending}
                    >
                      {sending ? 'Sending…' : 'SEND LINK'}
                    </button>
                  </div>

                  <p className="text-center">
                    <Link className="auth-link" to="/login">
                      Back to Login
                    </Link>
                  </p>

                  <div className="text-center" style={{ color: '#FFFFFF' }}>
                    Don’t have an account?{' '}
                    <Link to="/register" className="fw-semibold auth-link">Register</Link>
                  </div>
                </>
              )}

              {/* STEP 2 */}
              {step === 2 && (
                <>
                  <div className="mb-4">
                    <label className="auth-label">New Password</label>
                    <input
                      type="password"
                      value={pwd}
                      onChange={(e) => {
                        setPwd(e.target.value);
                        setPwdValid(rule.test(e.target.value));
                      }}
                      className="form-control auth-input"
                      placeholder="at least 8 characters, include a number"
                      required
                    />
                    {pwd && !pwdValid && (
                      <div className="text-danger small mt-1">
                        Must be 8+ chars and include a number
                      </div>
                    )}
                  </div>

                  <div className="text-center mb-4">
                    <button
                      type="button"
                      className="btn-accent"
                      onClick={() => setStep(3)}
                      disabled={!pwdValid}
                    >
                      SET PASSWORD
                    </button>
                  </div>

                  <p className="text-center">
                    <Link className="auth-link" to="/login">Back to Login</Link>
                  </p>

                  <div className="text-center" style={{ color: '#FFFFFF' }}>
                    Don’t have an account?{' '}
                    <Link to="/register" className="fw-semibold auth-link">Register</Link>
                  </div>
                </>
              )}

              {/* STEP 3 */}
              {step === 3 && (
                <div className="text-center">
                  <div className="mb-4">
                    <MDBIcon fas icon="check-circle" size="3x" className="text-success" />
                  </div>
                  <p className="text-white mb-4">
                    Your password has been reset.
                    <br />You can now log in.
                  </p>
                  <button className="btn-brand" onClick={() => navigate('/login')}>
                    LOG IN
                  </button>
                </div>
              )}
            </div>
          </MDBCol>
        </MDBRow>
      </MDBContainer>
    </div>
  );
}