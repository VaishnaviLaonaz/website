import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { MDBContainer, MDBIcon } from 'mdb-react-ui-kit';
// import '../../styles/auth_header.css';
import '../../styles/design-tokens.css';
import '../../styles/auth_header.css';
import Logo from '../ui/Logo';
export default function AuthHeader() {
  const { pathname } = useLocation();

  /* ── state ───────────────────────────── */
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);

  /* close on outside‑click */
  useEffect(() => {
    const handleClick = (e) => {
      if (open && menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, [open]);

  /* auto‑collapse when viewport reaches md (≥768 px) */
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 768px)');
    const handler = (e) => e.matches && setOpen(false);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  /* routes */
  const links = [
    { to: '/', label: 'Home' },
    { to: '/about', label: 'About' },
    { to: '/community', label: 'Community' },
  ];

  /* colour tokens */
  const C = { bar: '#F1F1E6', logo: '#566138', pill: '#FFFFFF', cta: '#C9AE31', olive: '#566138' };

//   return (
//     <MDBContainer
//       fluid
//       className="auth-header d-flex flex-column flex-md-row px-3 py-4"
//       style={{ background: C.bar, zIndex: 10 }}
//     >
//       {/* ────────── TOP ROW ────────── */}
//       <div className="d-flex w-100 align-items-center justify-content-between gap-3">
//         {/* logo */}
//         <Link to="/" className="text-decoration-none me-auto">
//             <Logo />
//           </Link>

//         {/* pill nav – desktop only */}
//         <nav
//           className="ah-pill d-none d-md-flex justify-content-center mx-auto px-4 py-2 gap-4"
//           style={{
//             background: C.pill,
//             borderRadius: 9999,
//             gap: '2rem',
//             whiteSpace: 'nowrap',
//             maxWidth: '80vw',
//             position: 'absolute', 
//             left: '50%', 
//             transform: 'translateX(-50%)',
//           }}
//         >
//           {links.map(({ to, label }) => (
//             <Link
//               key={to}
//               to={to}
//               className={'ah-pill-link text-decoration-none ' + (pathname === to ? 'fw-bold' : '')}
//               style={{ color: '#000', fontSize: 15 }}
//             >
//               {label}
//             </Link>
//           ))}
//         </nav>

//         {/* burger + register */}
//         <div className="d-flex align-items-center gap-3">
//           {/* burger icon – mobile only */}
//           <span className="d-md-none" ref={menuRef}>
//             <MDBIcon
//               icon={open ? 'times' : 'bars'}
//               role="button"
//               aria-label="Toggle navigation"
//               onClick={(e) => {
//                 e.stopPropagation();
//                 setOpen((o) => !o);
//               }}
//               className="ah-burger-icon"
//               style={{ fontSize: 24, cursor: 'pointer', color: C.olive }}
//             />
//           </span>

//           {/* register CTA */}
//           <Link
//             to="/register"
//             className="text-decoration-none"
//             style={{
//               border: `2px solid ${C.cta}`,
//               borderRadius: 14,
//               padding: '0.45rem 1.8rem',
//               color: C.cta,
//               fontWeight: 600,
//               fontSize: 13,
//               whiteSpace: 'nowrap',
//             }}
//           >
//             REGISTER
//           </Link>
//         </div>
//       </div>

//       {/* ────────── MOBILE DROPDOWN ────────── */}
//       {open && (
//         <div
//           className="mobile-drop d-md-none pt-3 pb-4 gap-3 d-flex flex-column align-items-center"
//           ref={menuRef}
//         >
//           {links.map(({ to, label }) => (
//             <Link
//               key={to}
//               to={to}
//               onClick={() => setOpen(false)}
//               className={'mobile-link ' + (pathname === to ? 'fw-bold' : '')}
//             >
//               {label}
//             </Link>
//           ))}
//         </div>
//       )}
//     </MDBContainer>
//   );
// }

return (
    <header className="site-header">
      <MDBContainer fluid>
        <div className="header-inner">
          {/* logo (left) */}
          <Link to="/" className="text-decoration-none me-auto ps-lg-5">
            <Logo />
          </Link>

          {/* pill nav – desktop only, centered */}
          {/* <nav className="pill-nav desktop-only">
            {links.map(({ to, label }) => (
              <Link
                key={to}
                to={to}
                className={'pill-link ' + (pathname === to ? 'active' : '')}
              >
                {label}
              </Link>
            ))}
          </nav> */}

          {/* burger + register (right) */}
          {/* <div className="d-flex align-items-center gap-3">
            <span className="mobile-only" ref={menuRef}>
              <MDBIcon
                icon={open ? 'times' : 'bars'}
                role="button"
                aria-label="Toggle navigation"
                onClick={(e) => {
                  e.stopPropagation();
                  setOpen((o) => !o);
                }}
                className="ah-burger-icon"
              />
            </span>

            <Link to="/register" className="btn-outline-gold">
              REGISTER
            </Link>
          </div> */}
        </div>

        {/* ────────── MOBILE DROPDOWN ────────── */}
        {/* {open && (
          <div
            className="mobile-drop d-flex flex-column align-items-center"
            ref={menuRef}
          >
            {links.map(({ to, label }) => (
              <Link
                key={to}
                to={to}
                onClick={() => setOpen(false)}
                className={'mobile-link ' + (pathname === to ? 'fw-bold' : '')}
              >
                {label}
              </Link>
            ))}
          </div>
        )} */}
      </MDBContainer>
    </header>
  );
}
