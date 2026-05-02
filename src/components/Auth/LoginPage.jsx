import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
// import '../../styles/login_page.css';

import { MDBContainer, MDBRow, MDBCol, MDBBtn, MDBIcon } from 'mdb-react-ui-kit';
import { loginUser } from '../../configs/firebase';
import GoogleAuthButton from './GoogleAuthButton';

import RegistrationLeftPanel from './RegistrationLeftPanel';
import '../../styles/design-tokens.css';
import '../../styles/auth.css';
import humanFirebaseError from "../../configs/firebaseErrors";

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPwd, setShowPwd] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  
  const navigate = useNavigate();

  const handleEmail = (event) => {
    setEmail(event.target.value);
  };

  const handlePassword = (event) => {
    setPassword(event.target.value);
  };

  /* 3 ─ rewrite the handler */
  const handleSubmit = async (e) => {
    e.preventDefault(); // ⬅️ stop the reload
    setError(''); // clear any previous error
    setLoading(true);
    try {
      const { user } = await loginUser(email.trim(), password);
      console.log('Signed in:', user.uid);
      navigate('/home', { replace: true }); // send to the auth-only page
    } catch (err) {
      console.error(err);
      switch (err.code) {
        case 'auth/user-not-found':
        case 'auth/wrong-password':
          setError(humanFirebaseError(err));
          break;
        case 'auth/invalid-email':
          setError(humanFirebaseError(err));
          break;
        default:
          setError(humanFirebaseError(err));
      }
    } finally{
      setLoading(false); 
    }
  };


 return (
    <div className="auth-shell">
      <MDBContainer fluid className="p-0 auth-bounded">
        <MDBRow className="g-0 flex-fill">
          {/* Left */}
          <RegistrationLeftPanel />

          {/* Right */}
          <MDBCol md="6" className="auth-right">
            <div className="auth-form auth-form--narrow">
              <h1 className="auth-title mb-5">Welcome Back</h1>

              {error && <div className="auth-error mb-3">{error}</div>}

              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label className="auth-label">Email / Username</label>
                  <input
                    type="email"
                    className="form-control auth-input"
                    placeholder="johndoe@example.com"
                    value={email}
                    onChange={(e)=>setEmail(e.target.value)}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="auth-label">Password</label>
                  <div className="position-relative">
                    <input
                      type={showPwd ? 'text' : 'password'}
                      className="form-control auth-input pe-5 no-native-pwd-icon"
                      placeholder="at least 8 characters, include a number"
                      value={password}
                      onChange={(e)=>setPassword(e.target.value)}
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

                <div className="text-end mb-4">
                  <Link to="/forgot-password" className="auth-link">Forgot password</Link>
                </div>

                <div className="text-center mb-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="btn-accent"
                  >
                    {loading ? 'Signing in…' : 'LOG IN'}
                  </button>
                </div>
              </form>

              <div className="auth-divider mb-4">
                <hr /><span>or continue with</span><hr />
              </div>

              <div className="text-center mb-5">
                <GoogleAuthButton mode="login" />
              </div>

              <div className="text-center" style={{ color: '#FFFFFF' }}>
                Don’t have an account?{' '}
                <Link to="/register" className="fw-semibold auth-link">Register</Link>
              </div>
            </div>
          </MDBCol>
        </MDBRow>
      </MDBContainer>
    </div>
  );
}