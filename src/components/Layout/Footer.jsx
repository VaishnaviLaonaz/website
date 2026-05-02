// // src/components/Layout/Footer.jsx
// import React from 'react';
// import { MDBFooter, MDBContainer, MDBRow, MDBCol } from 'mdb-react-ui-kit';
// import { Link } from 'react-router-dom';
// import Logo from '../ui/Logo';
// import '../../styles/design-tokens.css';
// import '../../styles/auth_header.css';
// export default function Footer() {
//   /* ----- brand & palette taken from the design ----- */
//   // const colors = {
//   //   bg:   "#F4F4EC",   // light cream
//   //   logo: "#566138",   // olive “LAONAZ”
//   //   link: "#000000",   // normal text / links
//   //   border: "rgba(0,0,0,0.15)" // subtle border
//   // };
//   /* ----- footer layout ----- */
// // return (
// //     <MDBFooter
// //       className="text-muted"
// //       style={{
// //         backgroundColor: colors.bg,
// //         border: `1px solid ${colors.border}`
// //       }}
// //     >
// //       <MDBContainer fluid className="py-4">
// //         <MDBRow className="align-items-center">
// //           {/* ---- Brand (left) ---------------------------------- */}
// //           <MDBCol md="auto" className="mb-3 mb-md-0">
// //             <Link to="/" className="text-decoration-none me-auto">
// //             <Logo />
// //           </Link>
// //           </MDBCol>

// //           {/* ---- Copyright (centre) ---------------------------- */}
// //           <MDBCol md="auto" className="mb-3 mb-md-0">
// //             <small className="text-black">
// //               © 2025&nbsp;LAONAZ. All rights reserved.
// //             </small>
// //           </MDBCol>

// //           {/* ---- Links (right) -------------------------------- */}
// //           <MDBCol className="d-flex justify-content-md-end flex-wrap gap-4">
// //             <Link
// //               to="/terms-of-service"
// //               className="text-decoration-underline"
// //               style={{ color: colors.link }}
// //             >
// //               Terms
// //             </Link>

// //             <Link
// //               to="/privacy-policy"
// //               className="text-decoration-underline"
// //               style={{ color: colors.link }}
// //             >
// //               Privacy
// //             </Link>

// //             <Link
// //               to="/security"
// //               className="text-decoration-underline"
// //               style={{ color: colors.link }}
// //             >
// //               Security
// //             </Link>

// //             <Link
// //               to="/about"
// //               className="text-decoration-underline"
// //               style={{ color: colors.link }}
// //             >
// //               About
// //             </Link>

// //             <Link
// //               to="/cookies-settings"
// //               className="text-decoration-underline"
// //               style={{ color: colors.link }}
// //             >
// //               Manage cookies
// //             </Link>
// //           </MDBCol>
// //         </MDBRow>
// //       </MDBContainer>
// //     </MDBFooter>
// //   );
// // }

// return (
//     // full-bleed footer background; bounded inner row
//     <footer className="site-footer">
//       <MDBFooter className="m-0 p-0">
//         <div className="bounded">
//           <div className="footer-inner">
//             {/* Brand (left) */}
//             <Link to="/" className="text-decoration-none me-auto ">
//               <Logo />
//             </Link>

//             {/* Copyright (center) */}
//             <div className="footer-copy">© 2025&nbsp;LAONAZ. All rights reserved.</div>

//             {/* Links (right) — horizontal scroll on tiny phones */}
//             <nav className="footer-scroll">
//               <Link to="/terms-of-service" className="footer-link">Terms</Link>
//               <Link to="/privacy-policy"  className="footer-link">Privacy</Link>
//               <Link to="/security"        className="footer-link">Security</Link>
//               <Link to="/about"           className="footer-link">About</Link>
//               <Link to="/cookies-settings" className="footer-link">Manage cookies</Link>
//             </nav>
//           </div>
//         </div>
//       </MDBFooter>
//     </footer>
//   );
// }

// src/components/Layout/Footer.jsx
import React from 'react';
import { MDBFooter } from 'mdb-react-ui-kit';
import { Link } from 'react-router-dom';
import Logo from '../ui/Logo';
import '../../styles/design-tokens.css';
import '../../styles/auth_header.css';
import '../../styles/Footer.css';

export default function Footer() {
  return (
    <footer className="site-footer">
      <MDBFooter className="m-0 p-0">
        {/* <div className="bounded"> */}
          <div className="footer-wrap">
            <div className="footer-bar">
              <div className="footer-left">
                <Link to="/" className="footer-brand text-decoration-none">
                  <Logo />
                </Link>
                <div className="footer-copy">© 2025&nbsp;LAONAZ. All rights reserved.</div>
              </div>

              <nav className="footer-links">
                <Link to="/terms"  className="footer-link">Terms</Link>
                <Link to="/privacy"    className="footer-link">Privacy</Link>
                <Link to="/security"          className="footer-link">Security</Link>
                <Link to="/about"             className="footer-link">About</Link>
                <Link to="/cookies"  className="footer-link">Manage cookies</Link>
              </nav>
            </div>
          </div>
        
      </MDBFooter>
    </footer>
  );
}
