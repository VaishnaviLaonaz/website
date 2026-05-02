import React, { useState, useEffect } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import {
  doc, setDoc, Timestamp, collection,
  getDocs, query, where, limit
} from 'firebase/firestore';
import { db } from '../../configs/firebase';
import { useAuth } from '../../context/AuthContext';
// import { uploadAvatar } from '../../configs/storage';
import { MDBContainer, MDBRow, MDBCol, MDBIcon } from 'mdb-react-ui-kit';
import '../../styles/design-tokens.css';
import '../../styles/auth.css';

export default function ProfileSetup() {
  /* ---------- hooks ---------- */
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  /* ---------- local state ---------- */
  const [step, setStep] = useState(1);

  // avatar
  // const [photoFile, setPhotoFile] = useState(null);
  // const [photoURL , setPhotoURL ] = useState(null);

  // basic details
  const [firstName, setFirst] = useState('');
  const [lastName , setLast ] = useState('');
  const [dob      , setDob  ] = useState('');           // ISO date string yyyy-mm-dd
  const [location , setLoc  ] = useState('');

  // NEW — username
  const [username      , setUsername     ] = useState('');
  const [usernameError , setUsernameError] = useState(null);
  const [checkingUser  , setCheckingUser ] = useState(true);

  // roles
  const [roles       , setRoles      ] = useState([]);
  const [roleOptions , setRoleOptions] = useState(null); // null → loading

  /* ---------- helpers ---------- */
  /** Check whether a username already exists (case-insensitive). */
  const isUsernameTaken = async (name) => {
    const q = query(
      collection(db, 'users'),
      where('username', '==', name.toLowerCase()),
      limit(1)
    );
    const snap = await getDocs(q);
    return !snap.empty;
  };

  /** Generate a unique, friendly default username. */
  const generateUniqueUsername = async () => {
    if (!currentUser) return;
    let base =
      currentUser.email?.split('@')[0] ??
      `user${currentUser.uid.slice(0, 6)}`;
    base = base.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
    let candidate = base;
    let suffix = 0;
    while (await isUsernameTaken(candidate)) {
      suffix += 1;
      candidate = `${base}${suffix}`;
    }
    setUsername(candidate);
    setCheckingUser(false);
  };

  /** Validate current `username` and set error text (or null). */
  const validateUsername = async () => {
    if (!username.trim()) {
      setUsernameError('Username is required');
      return false;
    }
    if (/[^a-z0-9]/.test(username)) {
      setUsernameError('Use only lowercase letters & numbers');
      return false;
    }
    setCheckingUser(true);
    if (await isUsernameTaken(username)) {
      setUsernameError('Username already taken');
      setCheckingUser(false);
      return false;
    }
    setUsernameError(null);
    setCheckingUser(false);
    return true;
  };

  /**
   * Convert ISO DOB (yyyy-mm-dd) → yyyy-Mon-D
   * Day is **NOT** padded -- this aligns with EditProfilePage.
   */
  const formatDob = (isoDate) => {
    if (!isoDate) return '';
    const [y, m, d] = isoDate.split('-');
    const months = [
      'Jan','Feb','Mar','Apr','May','Jun',
      'Jul','Aug','Sep','Oct','Nov','Dec'
    ];
    const mon   = months[Number(m) - 1];
    const day   = String(Number(d));            // removes leading zero
    return `${y}-${mon}-${day}`;
  };

  /* ---------- effects ---------- */
  useEffect(() => {
    async function fetchRoles() {
      const snap = await getDocs(collection(db, 'roles'));
      setRoleOptions(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    }
    fetchRoles().catch(console.error);
  }, []);

  useEffect(() => {
    if (currentUser) generateUniqueUsername().catch(console.error);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser]);

  /* ---------- guards ---------- */
  if (currentUser === undefined) return null;
  if (!currentUser) return <Navigate to="/login" replace />;

  /* ---------- handlers ---------- */
  // const handlePhotoChange = (e) => {
  //   const file = e.target.files?.[0];
  //   if (!file) return;
  //   const reader = new FileReader();
  //   reader.onload = () => {
  //     setPhotoFile(file);
  //     setPhotoURL(reader.result);
  //   };
  //   reader.readAsDataURL(file);
  // };

  const toggleRole = (id) =>
    setRoles((r) => (r.includes(id) ? r.filter((x) => x !== id) : [...r, id]));

  const saveStep1 = async (e) => {
    e.preventDefault();
    if (await validateUsername()) setStep(2);
  };

  /* ---------- final save ---------- */
  async function saveStep2() {
    try {
      if (!(await validateUsername())) return;

      // let avatarUrl = '';
      // if (photoFile) {
      //   avatarUrl = await uploadAvatar(photoFile, currentUser.uid);
      // }

      await setDoc(
        doc(db, 'users', currentUser.uid),
        {
          createdAt  : Timestamp.now(),
          firstName  : firstName.trim(),
          lastName   : lastName.trim(),
          dob        : formatDob(dob),       
          location   : location.trim(),
          roles,
          // avatarUrl,
          username   : username.trim().toLowerCase(),
          onboarded  : true,
          completedAt: Timestamp.now(),
        },
        { merge: true }
      );
      navigate('/home', { replace: true });
    } catch (err) {
      console.error('Profile save failed:', err);
    }
  }

  const writeStubProfile = () =>
    setDoc(
      doc(db, 'users', currentUser.uid),
      { createdAt: Timestamp.now(), onboarded: false, username  : username.trim().toLowerCase(), },
      { merge: true }
    );

  const handleSkip = async () => {
    await writeStubProfile().catch(console.error);
    navigate('/home', { replace: true });
  };
 return (
    <div className="auth-shell">
      <MDBContainer fluid className="p-0 auth-bounded">
        <MDBRow className="g-0 flex-fill">
          {/* Left */}
          <MDBCol md="6" className="auth-left d-flex flex-column justify-content-center align-items-center text-center">
            <h1 className="auth-slogan mb-4">Grow<br/>Your<br/>Credibility</h1>
            <p className="u-body" style={{ color:'#9ba88a', maxWidth: 320 }}>
              a complete profile builds trust in the community.
            </p>
          </MDBCol>

          {/* Right */}
          <MDBCol md="6" className="auth-right">
            {/* STEP 1 */}
            {step === 1 && (
              <form className="auth-form auth-form--narrow" onSubmit={saveStep1}>
                <h2 className="auth-title mb-5">Profile Set Up</h2>

                <label className="auth-label">Name</label>
                <div className="d-flex flex-column flex-md-row gap-2 mb-4">
                  <input
                    value={firstName}
                    onChange={(e) => setFirst(e.target.value)}
                    className="form-control auth-input"
                    placeholder="First Name"
                  />
                  <input
                    value={lastName}
                    onChange={(e) => setLast(e.target.value)}
                    className="form-control auth-input"
                    placeholder="Last Name"
                  />
                </div>

                <label className="auth-label">Username</label>
                <input
                  value={username}
                  onChange={(e) => { setUsername(e.target.value.toLowerCase()); setUsernameError(null); }}
                  onBlur={validateUsername}
                  className={`form-control auth-input ${usernameError ? 'is-invalid' : ''}`}
                  placeholder="Username"
                  disabled={checkingUser}
                />
                {usernameError && <div className="invalid-feedback">{usernameError}</div>}
                {!usernameError && checkingUser && <div className="form-text text-white-50">checking…</div>}

                <label className="auth-label mt-4">Date of Birth</label>
                <input
                  type="date"
                  value={dob}
                  onChange={(e) => setDob(e.target.value)}
                  className="form-control auth-input mb-4"
                />

                <label className="auth-label">Location</label>
                <input
                  value={location}
                  onChange={(e) => setLoc(e.target.value)}
                  className="form-control auth-input"
                  placeholder="Enter Your Location"
                />
                <a className="d-inline-block mt-1" href="#manual">
                  Enter location manually
                </a>

                <div className="text-center mt-5">
                  <button type="submit" className="btn-accent" disabled={checkingUser}>NEXT</button>
                </div>

                <p className="text-center mt-3">
                  <button type="button" className="skip-link" onClick={handleSkip}>
                    Skip for now
                  </button>
                </p>
              </form>
            )}

            {/* STEP 2 */}
            {step === 2 && (
              <div className="auth-form auth-form--narrow">
                <h2 className="auth-title mb-5">Profile Set Up</h2>

                <p className="text-white fw-bold mb-4">
                  Role(s) – please select all that apply to you
                </p>

                {!roleOptions ? (
                  <p className="text-white-50">Loading…</p>
                ) : (
                  roleOptions.map((r) => (
                    <button
                      key={r.id}
                      type="button"
                      onClick={() => toggleRole(r.id)}
                      className={`role-card mb-3 ${roles.includes(r.id) ? 'role-selected' : ''}`}
                    >
                      <div className="d-flex align-items-start gap-3">
                        <span className="fs-3" style={{ width: '1.8rem' }}>{r.icon}</span>
                        <div>
                          <div className="fw-semibold">{r.label}</div>
                          <div className="small text-muted lh-sm">{r.desc}</div>
                        </div>
                      </div>
                    </button>
                  ))
                )}

                <div className="text-center mt-5">
                  <button
                    type="button"
                    onClick={saveStep2}
                    disabled={!roleOptions || checkingUser}
                    className="btn-accent"
                  >
                    Update Profile
                  </button>
                </div>

                <p className="text-center mt-3">
                  <button type="button" className="skip-link" onClick={handleSkip}>
                    Skip for now
                  </button>
                </p>
              </div>
            )}
          </MDBCol>
        </MDBRow>
      </MDBContainer>
    </div>
  );
}