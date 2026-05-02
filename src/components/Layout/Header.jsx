
// // import React, { useState, useRef, useEffect } from 'react';
// // import { Link } from 'react-router-dom';
// // // import { useAuth } from '../../hooks/useAuth';
// // import { MDBNavbar, MDBContainer, MDBBtn, MDBIcon } from 'mdb-react-ui-kit';


// // export default function Header() {
 
// // //   const { user, logout } = useAuth();
// //  const displayName = "user";
// //   // = user?.username || 'User';
// //   const [profOpen, setProfOpen] = useState(false);
// //   const profRef = useRef(null);
// // //   const displayName = user?.username || user?.displayName || user?.email?.split("@")[0] || "User";

// //   // Close dropdown when clicking outside
// //   useEffect(() => {
// //     function handleClickOutside(e) {
// //       if (profRef.current && !profRef.current.contains(e.target)) {
// //         setProfOpen(false);
// //       }
// //     }
// //     document.addEventListener('mousedown', handleClickOutside);
// //     return () => document.removeEventListener('mousedown', handleClickOutside);
// //   }, []);

// //   return (
// //     <MDBNavbar light bgColor="light">
// //       <MDBContainer fluid className="d-flex justify-content-between align-items-center flex-nowrap">

// //         {/* 1) Brand + Tagline */}
// //         <div className="d-sm-flex align-items-center">
// //           <span className="fs-1 fw-bold" style={{ letterSpacing: '2px', color: '#5a5f34' }}>
// //             LAONAZ
// //           </span>
// //           <span className="ms-3 fs-6 text-farmer d-none d-md-inline" style={{ color: '#5a5f34' }}>
// //             Stands with farmers
// //           </span>
// //         </div>

// //         {/* 2) Desktop nav links */}
// //         <div className="d-none d-sm-flex align-items-center">
// //           <Link to="/about" className="me-4 text-decoration-none text-dark">About</Link>
// //           <Link to="/weather" className="me-4 text-decoration-none text-dark">Weather</Link>
// //           <Link to="/community" className="me-4 text-decoration-none text-dark">Community</Link>
// //         </div>

// //         {/* 3) Profile + mobile menu */}
// //         <div ref={profRef} className="position-relative">
// //           <MDBBtn color="link" onClick={() => setProfOpen(open => !open)}>
// //             <MDBIcon fas icon="user-circle" size="2x" className="text-dark" />
// //             <span className="ms-2 d-none d-sm-inline">{displayName}</span>
// //           </MDBBtn>

// //           {profOpen && (
// //             <div className="position-absolute top-100 end-0 bg-white shadow p-3" style={{ minWidth: '200px', zIndex: 999 }}>
// //               {/* Mobile-only nav links */}
// //               <div className="d-block d-sm-none mb-3">
// //                 <Link to="/about" className="d-block mb-2 text-dark">About</Link>
// //                 <Link to="/weather" className="d-block mb-2 text-dark">Weather</Link>
// //                 <Link to="/community" className="d-block mb-2 text-dark">Community</Link>
// //                 <Link to="/subscribe" className="d-block mb-2 text-dark">Subscribe</Link>
// //               </div>
          
// //               {/* Auth links */}
// //               {/* {user ? (
// //                 <> */}
// //                   <Link to="/profile" className="d-block mb-2 text-dark">Dashboard</Link>
// //                   {/* <MDBBtn
// //                     color="link"
// //                     className="p-0 text-dark"
// //                     // onClick={() => { logout(); setProfOpen(false); }}
// //                   >
// //                     Logout
// //                   </MDBBtn>
// //                 </> */}
// //               {/* ) : ( */}
// //                 <>
// //                   <Link to="/login" className="d-block mb-2 text-dark">Login</Link>
// //                   <Link to="/register" className="d-block text-dark">Register</Link>
// //                 </>
// //               {/* )} */}
// //             </div>
// //           )}
// //         </div>
// //       </MDBContainer>
// //     </MDBNavbar>
// //   );
// // }



// import React, { useState, useRef, useEffect } from "react";
// import { Link, useNavigate } from "react-router-dom";
// // import { useAuth } from '../../hooks/useAuth';
// import {
//   MDBNavbar,
//   MDBContainer,
//   MDBBtn,
//   MDBIcon,
//   MDBInputGroup,
//   MDBInput,
// } from "mdb-react-ui-kit";

// export default function Header() {
//   // const { user, logout } = useAuth();     // ready for Firebase auth
//   const user = null;                         // ⬅️  mock
//   const displayName = "user";                // = user?.username …

//   const navigate = useNavigate();            // used by handleSearch
//   const [profOpen, setProfOpen] = useState(false);
//   const profRef   = useRef(null);

//   /* ---------- search state (ready for Firestore queries later) ---------- */
//   const [query, setQuery] = useState("");

//   function handleSearch(e) {
//     e.preventDefault();
//     if (!query.trim()) return;
//     // 👉 Replace with Firestore-powered search later
//     navigate(`/search?q=${encodeURIComponent(query.trim())}`);
//   }

//   /* ---------- close profile dropdown on outside-click ---------- */
//   useEffect(() => {
//     function handleClickOutside(e) {
//       if (profRef.current && !profRef.current.contains(e.target))
//         setProfOpen(false);
//     }
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, []);

//   /* ---------- palette helpers ---------- */
//   const olive  = "#5a5f34";
//   const gold   = "#d4b950";

//   return (
//     <MDBNavbar light bgColor="light">
//       <MDBContainer
//         fluid
//         className="d-flex justify-content-between align-items-center flex-nowrap gap-3"
//       >
//         {/* 1) Brand */}
//         <Link to="/" className="text-decoration-none">
//           <span className="fs-1 fw-bold" style={{ letterSpacing: "2px", color: olive }}>
//             LAONAZ
//           </span>
//         </Link>

//         {/* 2) Search bar (desktop) */}
//         <form className="flex-grow-1 d-none d-md-block" onSubmit={handleSearch}>
//           <MDBInputGroup className="w-100">
//             <span className="input-group-text bg-white border-end-0">
//               <MDBIcon fas icon="search" />
//             </span>
//             <MDBInput
//               type="text"
//               placeholder="Search"
//               className="border-start-0"
//               value={query}
//               onChange={(e) => setQuery(e.target.value)}
//             />
//           </MDBInputGroup>
//         </form>

//         {/* 3) “Write” button */}
//         <MDBBtn
//           tag={Link}
//           to={user ? "/write" : "/login"}     /* if user null, redirect later */
//           outline
//           className="d-none d-md-flex align-items-center gap-2 rounded-3 px-4 py-2"
//           style={{ borderColor: gold, color: gold }}
//         >
//           <MDBIcon fas icon="pen-clip" /> {/* pencil-in-square icon */}
//           Write
//         </MDBBtn>

//         {/* 4) Desktop nav links (optional – kept from your code) */}
//         {/* <div className="d-none d-lg-flex align-items-center">
//           <Link to="/about" className="me-4 text-decoration-none text-dark">
//             About
//           </Link>
//           <Link to="/weather" className="me-4 text-decoration-none text-dark">
//             Weather
//           </Link>
//           <Link to="/community" className="me-4 text-decoration-none text-dark">
//             Community
//           </Link>
//         </div> */}

//         {/* 5) Profile / auth dropdown */}
//         <div ref={profRef} className="position-relative">
//           <MDBBtn
//             color="link"
//             className="p-0"
//             onClick={() => setProfOpen((o) => !o)}
//           >
//             <MDBIcon
//               fas
//               icon="user-circle"
//               size="2x"
//               className="text-dark"
//             />
//             <span className="ms-2 d-none d-sm-inline">{displayName}</span>
//           </MDBBtn>

//           {profOpen && (
//             <div
//               className="position-absolute top-100 end-0 bg-white shadow p-3"
//               style={{ minWidth: "200px", zIndex: 999 }}
//             >
//               {/* Mobile-only nav links */}
//               {/* <div className="d-block d-lg-none mb-3">
//                 <Link to="/about" className="d-block mb-2 text-dark">
//                   About
//                 </Link>
//                 <Link to="/weather" className="d-block mb-2 text-dark">
//                   Weather
//                 </Link>
//                 <Link to="/community" className="d-block mb-2 text-dark">
//                   Community
//                 </Link>
//                 <Link to="/subscribe" className="d-block mb-2 text-dark">
//                   Subscribe
//                 </Link>
//               </div> */}

//               {/* ---------- Auth links (ready for Firebase) ---------- */}
//               {user ? (
//                 <>
//                   <Link to="/profile" className="d-block mb-2 text-dark">
//                     Dashboard
//                   </Link>
//                   {/* <MDBBtn
//                     color="link"
//                     className="p-0 text-dark"
//                     onClick={() => { logout(); setProfOpen(false); }}
//                   >
//                     Logout
//                   </MDBBtn> */}
//                 </>
//               ) : (
//                 <>
//                   <Link to="/login" className="d-block mb-2 text-dark">
//                     Login
//                   </Link>
//                   <Link to="/register" className="d-block text-dark">
//                     Register
//                   </Link>
//                 </>
//               )}
//             </div>
//           )}
//         </div>
//       </MDBContainer>
//     </MDBNavbar>
//   );
// }


/* .......................... Header.jsx .......................... */
// import React, { useState, useRef, useEffect } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import {
//   MDBNavbar,
//   MDBContainer,
//   MDBBtn,
//   MDBIcon,
//   MDBInputGroup,
//   MDBInput,
// } from "mdb-react-ui-kit";

// // import { useAuth } from "../../hooks/useAuth";
// export default function Header() {
//   // const { user, logout } = useAuth();
//   const user = null;                // ⬅️  replace with Firebase user later
//   const displayName = "Daniel Jeon";

//   const navigate  = useNavigate();
//   const profRef   = useRef(null);
//   const [profOpen, setProfOpen] = useState(false);
//   const [query, setQuery]       = useState("");

//   /* close dropdown on outside-click */
//   useEffect(() => {
//     const handle = (e) => {
//       if (profRef.current && !profRef.current.contains(e.target))
//         setProfOpen(false);
//     };
//     window.addEventListener("mousedown", handle);
//     return () => window.removeEventListener("mousedown", handle);
//   }, []);

//   /* ------- colours from design ------- */
//   const olive = "#5a5f34";
//   const gold  = "#d4b950";

//   /* ------- search submit handler ------- */
//   const handleSearch = (e) => {
//     e.preventDefault();
//     if (!query.trim()) return;
//     navigate(`/search?q=${encodeURIComponent(query.trim())}`);
//   };

//   return (
//     <MDBNavbar light bgColor="light">
//       <MDBContainer
//         fluid
//         className="d-flex align-items-center justify-content-between gap-3"
//       >
//         {/* brand */}
//         <Link to="/" className="text-decoration-none me-auto">
//           <span
//             className="fs-1 fw-bold"
//             style={{ letterSpacing: "2px", color: olive }}
//           >
//             LAONAZ
//           </span>
//         </Link>

//         {/* search (fixed width on ≥ md) */}
//         <form
//           onSubmit={handleSearch}
//           className="d-none d-md-block"
//           style={{ width: 320 }}
//         >
//           <MDBInputGroup className="border border-2 border-dark rounded-pill">
//   {/* icon */}
//   <span className="input-group-text bg-white border-0 ps-3">
//     <MDBIcon fas icon="search" size="lg" />
//   </span>

//   {/* input */}
//   <input
//     type="text"
//     className="form-control border-0 shadow-none ps-2"
//     placeholder="Search"
//     value={query}
//     onChange={(e) => setQuery(e.target.value)}
//   />
// </MDBInputGroup>
//         </form>

//         {/* “Write” button */}
//         <MDBBtn
//           tag={Link}
//           to={user ? "/write" : "/login"}
//           outline
//           className="d-none d-md-flex align-items-center gap-2 rounded-3 px-4 py-2"
//           style={{ borderColor: gold, color: gold }}
//         >
//           <MDBIcon fas icon="pen-clip" />
//           Write
//         </MDBBtn>

//         {/* avatar / dropdown */}
//         <div ref={profRef} className="position-relative ms-2">
//           <MDBBtn
//             color="link"
//             className="p-0 d-flex align-items-center gap-2"
//             onClick={() => setProfOpen((o) => !o)}
//           >
//             <img
//               src="https://i.pravatar.cc/40?u=avatar"
//               alt="avatar"
//               width={40}
//               height={40}
//               className="rounded-circle object-fit-cover"
//             />
//             <span className="d-none d-md-inline text-dark">{displayName}</span>
//           </MDBBtn>

//           {profOpen && (
//             <div
//               className="position-absolute top-100 end-0 bg-white shadow p-3"
//               style={{ minWidth: 200, zIndex: 999 }}
//             >
//               {user ? (
//                 <>
//                   <Link to="/profile" className="d-block mb-2 text-dark">
//                     Dashboard
//                   </Link>
//                   {/* <MDBBtn color="link" className="p-0 text-dark"
//                            onClick={() => { logout(); setProfOpen(false); }}>
//                     Logout
//                   </MDBBtn> */}
//                 </>
//               ) : (
//                 <>
//                   <Link to="/login" className="d-block mb-2 text-dark">
//                     Login
//                   </Link>
//                   <Link to="/register" className="d-block text-dark">
//                     Register
//                   </Link>
//                 </>
//               )}
//             </div>
//           )}
//         </div>
//       </MDBContainer>
//     </MDBNavbar>
//   );
// }



/* .......................... Header.jsx .......................... */
// import React, { useState, useRef, useEffect } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import {
//   MDBNavbar,
//   MDBContainer,
//   MDBBtn,
//   MDBIcon,
//   MDBInputGroup,
//   MDBInput,
// } from "mdb-react-ui-kit";

// // import { useAuth } from "../../hooks/useAuth";
// export default function Header() {
//   // const { user, logout } = useAuth();
//   const user = null;                         // 🔗 replace with Firebase user
//   const displayName = "Daniel Jeon";

//   const navigate  = useNavigate();
//   const profRef   = useRef(null);
//   const [profOpen, setProfOpen] = useState(false);
//   const [query, setQuery]       = useState("");

//   /* close dropdown */
//   useEffect(() => {
//     const handle = (e) =>
//       profRef.current && !profRef.current.contains(e.target) && setProfOpen(false);
//     window.addEventListener("mousedown", handle);
//     return () => window.removeEventListener("mousedown", handle);
//   }, []);

//   const olive = "#5a5f34";
//   const gold  = "#d4b950";

//   const handleSearch = (e) => {
//     e.preventDefault();
//     if (!query.trim()) return;
//     navigate(`/search?q=${encodeURIComponent(query.trim())}`);
//   };

//   return (
//     <MDBNavbar light bgColor="light">
//       <MDBContainer fluid className="d-flex align-items-center gap-3">
//         {/* brand */}
//         <Link to="/" className="text-decoration-none me-auto">
//           <span className="fs-1 fw-bold" style={{ letterSpacing: "2px", color: olive }}>
//             LAONAZ
//           </span>
//         </Link>

//         {/* search */}
//         <form onSubmit={handleSearch} className="d-none d-md-block" style={{ width: 320 }}>
//           <MDBInputGroup className="border border-2 border-dark rounded-pill">
//             <span className="input-group-text bg-white border-0 ps-3">
//               <MDBIcon fas icon="search" size="lg" />
//             </span>
//             <input
//               type="text"
//               className="form-control border-0 shadow-none ps-2"
//               placeholder="Search"
//               value={query}
//               onChange={(e) => setQuery(e.target.value)}
//             />
//           </MDBInputGroup>
//         </form>

//         {/* ---------------- AUTH-SPECIFIC UI ---------------- */}
//         {user ? (
//           /* ---------- logged-in: Write + avatar ---------- */
//           <>
//             <MDBBtn
//               tag={Link}
//               to="/write"
//               outline
//               className="d-none d-md-flex align-items-center gap-2 rounded-3 px-4 py-2"
//               style={{ borderColor: gold, color: gold }}
//             >
//               <MDBIcon fas icon="pen-clip" />
//               Write
//             </MDBBtn>

//             {/* avatar / dropdown */}
//             <div ref={profRef} className="position-relative ms-2">
//               <MDBBtn
//                 color="link"
//                 className="p-0 d-flex align-items-center gap-2"
//                 onClick={() => setProfOpen((o) => !o)}
//               >
//                 <img
//                   src="https://i.pravatar.cc/40?u=avatar"
//                   alt="avatar"
//                   width={40}
//                   height={40}
//                   className="rounded-circle object-fit-cover"
//                 />
//                 <span className="d-none d-md-inline text-dark">{displayName}</span>
//               </MDBBtn>

//               {profOpen && (
//                 <div
//                   className="position-absolute top-100 end-0 bg-white shadow p-3"
//                   style={{ minWidth: 200, zIndex: 999 }}
//                 >
//                   <Link to="/profile" className="d-block mb-2 text-dark">
//                     Dashboard
//                   </Link>
//                   {/* <MDBBtn color="link" className="p-0 text-dark"
//                            onClick={() => { logout(); setProfOpen(false); }}>
//                     Logout
//                   </MDBBtn> */}
//                 </div>
//               )}
//             </div>
//           </>
//         ) : (
//           /* ---------- logged-out: single gold button ---------- */
//           <MDBBtn
//             tag={Link}
//             to="/login"
//             outline
//             className="d-none d-md-flex rounded-3 px-4 py-2 fw-semibold text-uppercase"
//             style={{ borderColor: gold, color: gold }}
//           >
//             Log&nbsp;In&nbsp;/&nbsp;Register
//           </MDBBtn>
//         )}
//       </MDBContainer>
//     </MDBNavbar>
//   );
// }


/* .......................... Header.jsx .......................... */
// import React, { useState, useRef, useEffect } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import {
//   MDBNavbar,
//   MDBContainer,
//   MDBBtn,
//   MDBIcon,
//   MDBInputGroup,
// } from "mdb-react-ui-kit";

// // import { useAuth } from "../../hooks/useAuth";
// export default function Header() {
//   // const { user, logout } = useAuth();
//   const user = null;          // 🔗 swap with Firebase user later
//   const displayName = "Daniel Jeon";

//   const navigate   = useNavigate();
//   const profRef    = useRef(null);
//   const [profOpen, setProfOpen] = useState(false);
//   const [query, setQuery]       = useState("");

//   /* close dropdown on outside-click */
//   useEffect(() => {
//     const h = (e) =>
//       profRef.current && !profRef.current.contains(e.target) && setProfOpen(false);
//     window.addEventListener("mousedown", h);
//     return () => window.removeEventListener("mousedown", h);
//   }, []);

//   const olive = "#5a5f34";
//   const gold  = "#d4b950";

//   const handleSearch = (e) => {
//     e.preventDefault();
//     if (!query.trim()) return;
//     navigate(`/search?q=${encodeURIComponent(query.trim())}`);
//   };

//   return (
//     <MDBNavbar light bgColor="light">
//       <MDBContainer fluid className="d-flex align-items-center gap-3">

//         {/* ── Brand ─────────────────────────────────────────────── */}
//         <Link to="/" className="text-decoration-none me-auto">
//           <span className="fs-1 fw-bold" style={{ letterSpacing: "2px", color: olive }}>
//             LAONAZ
//           </span>
//         </Link>

//         {/* ── SEARCH + ACTION BUTTON (Write or Login/Register) ──── */}
//         <div className="d-none d-md-flex align-items-center gap-4">

//           {/* search */}
//           <form onSubmit={handleSearch} style={{ width: 320 }}>
//             <MDBInputGroup
//               className="border border-2 rounded-pill"
//               style={{ borderColor: "#b9b99b" }}
//             >
//               <span className="input-group-text bg-white border-0 ps-3">
//                 <MDBIcon fas icon="search" size="lg" />
//               </span>
//               <input
//                 type="text"
//                 className="form-control border-0 shadow-none ps-2"
//                 placeholder="Search"
//                 value={query}
//                 onChange={(e) => setQuery(e.target.value)}
//               />
//             </MDBInputGroup>
//           </form>

//           {/* write OR login/register */}
//           {user ? (
//             <MDBBtn
//               tag={Link}
//               to="/write"
//               outline
//               className="d-flex align-items-center gap-2 px-4 py-2 rounded-3 fw-semibold"
//               style={{ borderColor: gold, color: gold }}
//             >
//               <MDBIcon fas icon="pen-clip" />
//               Write
//             </MDBBtn>
//           ) : (
//             <MDBBtn
//               tag={Link}
//               to="/login"
//               outline
//               className="px-4 py-2 rounded-3 fw-semibold text-uppercase"
//               style={{ borderColor: gold, color: gold }}
//             >
//               Log&nbsp;In&nbsp;/&nbsp;Register
//             </MDBBtn>
//           )}
//         </div>

//         {/* ── Avatar (only when logged-in) ──────────────────────── */}
//         {user && (
//           <div ref={profRef} className="position-relative ms-2">
//             <MDBBtn
//               color="link"
//               className="p-0 d-flex align-items-center gap-2"
//               onClick={() => setProfOpen((o) => !o)}
//             >
//               <img
//                 src="https://i.pravatar.cc/40?u=avatar"
//                 alt="avatar"
//                 width={40}
//                 height={40}
//                 className="rounded-circle object-fit-cover"
//               />
//               <span className="d-none d-md-inline text-dark">{displayName}</span>
//             </MDBBtn>

//             {profOpen && (
//               <div
//                 className="position-absolute top-100 end-0 bg-white shadow p-3"
//                 style={{ minWidth: 200, zIndex: 999 }}
//               >
//                 <Link to="/profile" className="d-block mb-2 text-dark">
//                   Dashboard
//                 </Link>
//                 {/* <MDBBtn color="link" className="p-0 text-dark"
//                          onClick={() => { logout(); setProfOpen(false); }}>
//                   Logout
//                 </MDBBtn> */}
//               </div>
//             )}
//           </div>
//         )}
//       </MDBContainer>
//     </MDBNavbar>
//   );
// }


// // correct one is below
// //Header.jsx
// import React, { useState, useRef, useEffect } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import { MDBNavbar, MDBContainer, MDBBtn, MDBIcon, MDBInputGroup } from 'mdb-react-ui-kit';

// import { useAuth } from '../../context/AuthContext';
// import { useUserDoc } from '../../configs/user';
// import FigmaSearchPill from '../cards/FigmaSearchPill';

// export default function Header() {
//   // if (!currentUser) return null;
//   const { currentUser, logout } = useAuth(); // ← NOW LIVE
//   const navigate = useNavigate();
//   const { userDoc } = useUserDoc();

//   /* -------------------------------- state -------------------------------- */
//   const [profOpen, setProfOpen] = useState(false);
//   const [query, setQuery] = useState('');

//   const profRef = useRef(null);


//   /* close avatar dropdown on outside-click */
//   useEffect(() => {
//     const h = (e) => profRef.current && !profRef.current.contains(e.target) && setProfOpen(false);
//     window.addEventListener('mousedown', h);
//     return () => window.removeEventListener('mousedown', h);
//   }, []);

//   /* colour helpers */
//   const olive = '#5a5f34';
//   const gold = '#d4b950';

//   /* search */
//   function handleSearch(e) {
//     e.preventDefault();
//     if (!query.trim()) return;
//     navigate(`/search?q=${encodeURIComponent(query.trim())}`);
//   }

//   /* pick a display name */
//   const displayName =
//     userDoc?.username ??
//     [userDoc?.firstName, userDoc?.lastName].filter(Boolean).join(' ') ??
//     currentUser?.email?.split('@')[0] ??
//     'User';

//   const avatarSrc =
//     userDoc?.avatarUrl || currentUser?.photoURL || 'https://i.pravatar.cc/40?u=default';

//   /* -------------------------------- render ------------------------------- */
//   return (
//     <MDBNavbar light bgColor="light">
//       <MDBContainer fluid className="d-flex align-items-center gap-3">
//         {/* ── Brand ─────────────────────────────────────────────── */}
//         <Link to="/" className="text-decoration-none me-auto">
//           <span className="fs-1 fw-bold" style={{ letterSpacing: '2px', color: olive }}>
//             LAONAZ
//           </span>
//         </Link>

//         <div className="d-none d-md-flex align-items-center gap-4">
//           {/* search */}
//           <FigmaSearchPill query={query} setQuery={setQuery} />


//           {/* write OR login/register */}
//           {currentUser ? (
//             <Link
//               to="/write"
//               className="btn btn-outline d-flex align-items-center gap-2 px-4 py-2 rounded-3 fw-semibold"
//               style={{ borderColor: gold, color: gold }}
//             >
//               <MDBIcon fas icon="pen-clip" />
//               Write
//             </Link>
//           ) : (
//             <Link
//               to="/login"
//               className="btn btn-outline px-4 py-2 rounded-3 fw-semibold text-uppercase"
//               style={{ borderColor: gold, color: gold }}
//             >
//               Log&nbsp;In&nbsp;/&nbsp;Register
//             </Link>
//           )}
//         </div>

//         {/* ── Avatar (only when logged-in) ──────────────────────── */}
//         {currentUser && (
//           <div ref={profRef} className="position-relative ms-2">
//             <MDBBtn
//               color="link"
//               className="p-0 d-flex align-items-center gap-2"
//               onClick={() => setProfOpen((o) => !o)}
//             >
//               <img
//                 src={avatarSrc}
//                 width={40}
//                 height={40}
//                 className="rounded-circle object-fit-cover"
//               />
//               <span className="d-none d-md-inline text-dark">{displayName}</span>
//             </MDBBtn>

//             {profOpen && (
//               <div
//                 className="position-absolute top-100 end-0 bg-white shadow p-3"
//                 style={{ minWidth: 200, zIndex: 999 }}
//               >
//                 <Link to="/profile" className="d-block mb-2 text-dark">
//                   Dashboard
//                 </Link>
//                 <Link
//                   to="/profile"
//                   onClick={() => { logout(); navigate('/login'); }}
//                   className="d-block mb-2 text-dark"
//                 >
//                   Logout
//                 </Link>
//                 {/* TODO: add a Logout button once you have logout() */}
//               </div>
//             )}
//           </div>
//         )}
//       </MDBContainer>
//     </MDBNavbar>
//   );
// }


// // correct 2ndone is below

// // Header.jsx
// import React, { useState, useRef, useEffect } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import {
//   MDBNavbar,
//   MDBContainer,
//   MDBBtn,
//   MDBIcon
// } from 'mdb-react-ui-kit';

// import { useAuth } from '../../context/AuthContext';
// import { useUserDoc } from '../../configs/user';
// import FigmaSearchPill from '../cards/FigmaSearchPill';

// export default function Header() {
//   const { currentUser, logout } = useAuth();
//   const navigate = useNavigate();
//   const { userDoc } = useUserDoc();

//   /* -------------------------------- state -------------------------------- */
//   const [profOpen, setProfOpen] = useState(false);
//   const [query, setQuery] = useState('');
//   const [showMobileSearch, setShowMobileSearch] = useState(false);

//   const profRef         = useRef(null);
//   const searchToggleRef = useRef(null); // button with magnifying-glass
//   const searchFormRef   = useRef(null); // expanding form wrapper

//   /* ---------- close avatar dropdown on outside-click ---------- */
//   useEffect(() => {
//     const h = (e) =>
//       profRef.current && !profRef.current.contains(e.target) && setProfOpen(false);
//     window.addEventListener('mousedown', h);
//     return () => window.removeEventListener('mousedown', h);
//   }, []);

//   /* ---------- auto-hide mobile search on outside-click ---------- */
//   useEffect(() => {
//     if (!showMobileSearch) return;
//     const h = (e) => {
//       const tgt = e.target;
//       if (
//         !searchFormRef.current?.contains(tgt) &&
//         !searchToggleRef.current?.contains(tgt)
//       ) {
//         setShowMobileSearch(false);
//       }
//     };
//     window.addEventListener('mousedown', h);
//     return () => window.removeEventListener('mousedown', h);
//   }, [showMobileSearch]);

//   /* ---------- auto-hide mobile search when screen ≥ md ---------- */
//   useEffect(() => {
//     const mq = window.matchMedia('(min-width: 768px)');
//     const hide = () => mq.matches && setShowMobileSearch(false);
//     mq.addEventListener('change', hide);
//     return () => mq.removeEventListener('change', hide);
//   }, []);

//   /* ---------- colour helpers ---------- */
//   const olive = '#5a5f34';
//   const gold  = '#d4b950';

//   /* ---------- search submit (mobile) ---------- */
//   const handleSearch = (e) => {
//     e.preventDefault();
//     if (!query.trim()) return;
//     navigate(`/search?q=${encodeURIComponent(query.trim())}`);
//     setShowMobileSearch(false);
//   };

//   /* ---------- display name & avatar ---------- */
//   const displayName =
//     userDoc?.username ||
//     [userDoc?.firstName, userDoc?.lastName].filter(Boolean).join(' ') ||
//     currentUser?.email?.split('@')[0] ||
//     'User';

//   const avatarSrc =
//     userDoc?.avatarUrl ||
//     currentUser?.photoURL ||
//     'https://i.pravatar.cc/40?u=default';

//   /* ---------------------------------------------------------------- UI ---------------------------------------------------------------- */
//   return (
//     <>
//       {/* ---------- Top bar ---------- */}
//       <MDBNavbar light bgColor="light">
//         <MDBContainer fluid className="d-flex align-items-center gap-3">

//           {/* Brand */}
//           <Link to="/" className="text-decoration-none me-auto">
//             <span
//               className="fs-1 fw-bold"
//               style={{ letterSpacing: '2px', color: olive }}
//             >
//               LAONAZ
//             </span>
//           </Link>

//           {/* Desktop tools */}
//           <div className="d-none d-md-flex align-items-center gap-4">
//             <FigmaSearchPill query={query} setQuery={setQuery} />

//             {currentUser ? (
//               <Link
//                 to="/write"
//                 className="btn btn-outline d-flex align-items-center gap-2 px-4 py-2 rounded-3 fw-semibold"
//                 style={{ borderColor: gold, color: gold }}
//               >
//                 <MDBIcon fas icon="pen-clip" />
//                 Write
//               </Link>
//             ) : (
//               <Link
//                 to="/login"
//                 className="btn btn-outline px-4 py-2 rounded-3 fw-semibold text-uppercase"
//                 style={{ borderColor: gold, color: gold }}
//               >
//                 Log&nbsp;In&nbsp;/&nbsp;Register
//               </Link>
//             )}
//           </div>

//           {/* Mobile buttons */}
//           <div className="d-flex d-md-none align-items-center gap-2">

//             {/* search icon */}
//             <MDBBtn
//               color="link"
//               className="p-0 me-3"
//               ref={searchToggleRef}
//               onClick={() => setShowMobileSearch((v) => !v)}
//             >
//               <MDBIcon fas icon="search" size="lg" />
//             </MDBBtn>

//             {/* write / auth */}
//             {currentUser ? (
//               <MDBBtn
//                 color="link"
//                 className="p-0 me-2"
//                 onClick={() => navigate('/write')}
//               >
//                 <MDBIcon fas icon="pen-clip" size="lg" />
//               </MDBBtn>
//             ) : (
//               <Link
//                 to="/login"
//                 className="btn btn-outline px-3 py-1 rounded-3 fw-semibold"
//                 style={{ borderColor: gold, color: gold, fontSize: '0.8rem' }}
//               >
//                 Log&nbsp;In
//               </Link>
//             )}
//           </div>

//           {/* Avatar */}
//           {currentUser && (
//             <div ref={profRef} className="position-relative ms-2">
//               <MDBBtn
//                 color="link"
//                 className="p-0 d-flex align-items-center gap-2"
//                 onClick={() => setProfOpen((o) => !o)}
//               >
//                 <img
//                   src={avatarSrc}
//                   width={40}
//                   height={40}
//                   className="rounded-circle object-fit-cover"
//                 />
//                 <span className="d-none d-md-inline text-dark">
//                   {displayName}
//                 </span>
//               </MDBBtn>

//               {profOpen && (
//                 <div
//                   className="position-absolute top-100 end-0 bg-white shadow p-3"
//                   style={{ minWidth: 200, zIndex: 999 }}
//                 >
//                   <Link to="/profile" className="d-block mb-2 text-dark">
//                     Dashboard
//                   </Link>
//                   <Link
//                     to="/profile"
//                     onClick={() => {
//                       logout();
//                       navigate('/login');
//                     }}
//                     className="d-block mb-2 text-dark"
//                   >
//                     Logout
//                   </Link>
//                 </div>
//               )}
//             </div>
//           )}
//         </MDBContainer>
//       </MDBNavbar>

//       {/* ---------- Mobile expanding search ---------- */}
//       {showMobileSearch && (
//         <form
//           ref={searchFormRef}
//           onSubmit={handleSearch}
//           className="bg-light border-top"
//         >
//           <div className="container py-2">
//             <FigmaSearchPill
//               query={query}
//               setQuery={setQuery}
//               autoFocus
//               className="w-100"
//             />
//           </div>
//         </form>
//       )}
//     </>
//   );
// }




// Layout/Header.jsx
import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation  } from 'react-router-dom';
import {
  MDBNavbar,
  MDBContainer,
  MDBBtn,
  MDBIcon
} from 'mdb-react-ui-kit';
import { useAuth } from '../../context/AuthContext';
import { useUserDoc } from '../../configs/user';
import FigmaSearchPill from '../cards/FigmaSearchPill';
import Notifications from '../Pages/Notifications';
import { streamUnreadNotifications } from '../../configs/notifications'; 
import Logo from '../ui/Logo';
import '../../styles/design-tokens.css';
import '../../styles/auth_header.css'; 
import NotificationIcon from '../ui/NotificationIcon';

// import NotificationIcon from '../ui/NotificationIcon';
export default function Header() {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();   
  const { userDoc } = useUserDoc();

  /* -------------------------------- state -------------------------------- */
  const [profOpen,  setProfOpen ] = useState(false);
  const [profOpenMobile, setProfOpenMobile] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);                   // NEW
  const [unread,    setUnread   ] = useState(0);                       // NEW
  const [query,     setQuery    ] = useState('');
  const [showMobileSearch, setShowMobileSearch] = useState(false);

  const profRef         = useRef(null);
  const profMobileRef = useRef(null);
  const notifRef        = useRef(null);          
  const bellBtnRef      = useRef(null);          
  const searchToggleRef = useRef(null);
  const searchFormRef   = useRef(null);

  /* ---------- close avatar / notif dropdowns on outside-click ---------- */
  useEffect(() => {
    const h = (e) => {
      const tgt = e.target;
      if (profRef.current  && !profRef.current.contains(tgt))  setProfOpen(false);
       if (profMobileRef.current && !profMobileRef.current.contains(tgt)) {
        setProfOpenMobile(false);
      }
      if (
        notifRef.current &&
        !notifRef.current.contains(tgt) &&
        !bellBtnRef.current?.contains(tgt)
      ) {
        setTimeout(() => setNotifOpen(false), 50); 
      }
    };
   window.addEventListener('click', h, { capture: true });
    return () => window.removeEventListener('click', h);
  }, []);

  /* ---------- real-time unread notif badge ---------- */
  useEffect(() => {
    if (!currentUser) return;
    return streamUnreadNotifications(currentUser.uid, setUnread);
  }, [currentUser]);

  /* ---------- auto-hide mobile search on outside-click ---------- */
  useEffect(() => {
    if (!showMobileSearch) return;
    const h = (e) => {
      if (
        !searchFormRef.current?.contains(e.target) &&
        !searchToggleRef.current?.contains(e.target)
      ) {
        setShowMobileSearch(false);
      }
    };
    window.addEventListener('mousedown', h);
    return () => window.removeEventListener('mousedown', h);
  }, [showMobileSearch]);

  /* ---------- auto-hide mobile search when screen ≥ md ---------- */
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 768px)');
    const hide = () => mq.matches && setShowMobileSearch(false);
    mq.addEventListener('change', hide);
    return () => mq.removeEventListener('change', hide);
  }, []);

  /* ---------- colour helpers ---------- */
  const olive = '#5a5f34';
  const gold  = '#d4b950';

  /* ---------- search submit (mobile) ---------- */
  const handleSearch = (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    navigate(`/search?q=${encodeURIComponent(query.trim())}`);
    setShowMobileSearch(false);
  };

  /* ---------- display name & avatar ---------- */
  const displayName =
    userDoc?.username ||
    [userDoc?.firstName, userDoc?.lastName].filter(Boolean).join(' ') ||
    currentUser?.email?.split('@')[0] ||
    'User';

  const avatarSrc =
    userDoc?.avatarUrl ||
    currentUser?.photoURL;
 const onWritePage = location.pathname.startsWith('/write');
//  return (
//     <>
//       {/* full-bleed background; bounded content inside */}
//       <header className="site-header">
//         <MDBNavbar className="border-0 shadow-none">
//           <MDBContainer fluid className="bounded">
//             <div className="header-inner w-100">
//               {/* Brand */}
//               <Link to="/" className="text-decoration-none me-auto">
//                 <Logo />
//               </Link>

//               {/* Desktop tools */}
//               <div className="d-none d-md-flex align-items-center gap-5">
//                 <FigmaSearchPill query={query} setQuery={setQuery} />

//                 {currentUser ? (
//                   <Link to="/write" className="btn-outline-gold">
//                     <MDBIcon fas icon="pen-to-square" />
//                     <span>Write</span>
//                   </Link>
//                 ) : (
//                   <Link to="/login" className="btn-outline-gold text-uppercase">
//                     Log&nbsp;In&nbsp;/&nbsp;Register
//                   </Link>
//                 )}
//               </div>

//               {/* Mobile buttons */}
//               <div className="d-flex d-md-none align-items-center gap-2">
//                 <MDBBtn
//                   color="link"
//                   className="p-0 me-2"
//                   ref={searchToggleRef}
//                   onClick={() => setShowMobileSearch((v) => !v)}
//                 >
//                   <MDBIcon fas icon="search" size="2x" />
//                 </MDBBtn>

//                 {currentUser ? (
//                   <MDBBtn color="link" className="p-0 me-2" onClick={() => navigate('/write')}>
//                     <MDBIcon fas icon="pen-clip" size="2x" />
//                   </MDBBtn>
//                 ) : (
//                   <Link to="/login" className="btn-outline-gold" style={{ fontSize: '0.85rem' }}>
//                     Log&nbsp;In
//                   </Link>
//                 )}
//               </div>

//               {/* Notification bell */}
//               {currentUser && (
//                 <div ref={notifRef} className="position-relative ms-5">
//                   <MDBBtn color="link" className="p-0" ref={bellBtnRef} onClick={() => setNotifOpen((o) => !o)}>
//                     <MDBIcon fas icon="bell" size="2x" />
//                     {unread > 0 && (
//                       <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
//                         {unread}
//                       </span>
//                     )}
//                   </MDBBtn>
//                   {notifOpen && <Notifications onClose={() => setNotifOpen(false)} />}
//                 </div>
//               )}

//               {/* Avatar */}
//               {currentUser && (
//                 <div ref={profRef} className="position-relative ms-5">
//                   <MDBBtn
//                     color="link"
//                     className="p-0 d-flex align-items-center gap-2 text-reset text-decoration-none"
//                     onClick={() => setProfOpen((o) => !o)}
//                     style={{ textTransform: 'none' }}
//                   >
//                     {avatarSrc ? (
//                       <img src={avatarSrc} width={40} height={40} className="rounded-circle object-fit-cover" />
//                     ) : (
//                       <MDBIcon fas icon="user-circle" size="2x" className="text-muted" style={{ width: 40, height: 40 }} />
//                     )}
//                     <span className="d-none d-md-inline u-body" style={{ fontWeight: 600, color: 'var(--text-strong)' }}>
//                       {displayName}
//                     </span>
//                   </MDBBtn>

//                   {profOpen && (
//                     <div className="menu-panel position-absolute top-100 end-0">
//                       <Link to="/profile" className="menu-item">
//                         Dashboard
//                       </Link>
//                       <Link
//                         to="/profile"
//                         className="menu-item"
//                         onClick={() => {
//                           logout();
//                           navigate('/login');
//                         }}
//                       >
//                         Logout
//                       </Link>
//                     </div>
//                   )}
//                 </div>
//               )}
//             </div>
//           </MDBContainer>
//         </MDBNavbar>

//         {/* Mobile expanding search */}
//         {showMobileSearch && (
//           <form ref={searchFormRef} onSubmit={handleSearch} className="border-top">
//             <div className="bounded py-2">
//               <FigmaSearchPill query={query} setQuery={setQuery} autoFocus className="w-100" />
//             </div>
//           </form>
//         )}
//       </header>
//     </>
//   );
// }

 return (
    <>
    
      <header className="site-header">
        <MDBNavbar className="border-0 shadow-none">
          <MDBContainer fluid 
          // className="bounded"
          >
            <div className="header-inner w-100">
              {/* Brand */}
              <Link to="/" className="text-decoration-none me-auto">
              
               <Logo />
                        
              </Link>

              {/* ───────── Desktop tools: unified row & spacing ───────── */}
              <div className="header-tools d-none d-md-flex align-items-center ">
                {/* Search */}
                <div className="header-search">
                  <FigmaSearchPill query={query} setQuery={setQuery} />
                </div>

                {/* Write / Auth */}
                {currentUser ? (
                  !onWritePage && (
                    <Link to="/write" className="btn-outline-gold btn-48">
                      <MDBIcon fas icon="pen-to-square" />
                      <span>Write</span>
                    </Link>
                  )
                ) : (
                  <Link to="/login" className="btn-outline-gold text-uppercase">
                    Log&nbsp;In&nbsp;/&nbsp;Register
                  </Link>
                )}

                {/* Notification bell */}
                {/* {currentUser && (
                  <div ref={notifRef} className="position-relative">
                    <MDBBtn
                      color="link"
                      className="icon-btn"
                      ref={bellBtnRef}
                      onClick={() => setNotifOpen((o) => !o)}
                    >
                      <MDBIcon fas icon="bell" className="bell-ico" />
                      {unread > 0 && (
                        <span className="badge rounded-pill bg-danger">
                          {unread}
                        </span>
                      )}
                    </MDBBtn>
                    {notifOpen && <Notifications onClose={() => setNotifOpen(false)} />}
                  </div>
                )} */}
                {currentUser && (
                  <div ref={notifRef} className="position-relative">
                    <MDBBtn
                      color="link"
                      className="icon-btn"
                      ref={bellBtnRef}
                      onClick={() => setNotifOpen((o) => !o)}
                      aria-haspopup="dialog"
                      aria-expanded={notifOpen}
                      aria-label="Open notifications"
                    >
                      {/* EXACT size + placement via size and className */}
                      <NotificationIcon
                        on={unread > 0}
                        size={28}
                        className="bell-ico"
                      />
                      {/* {unread > 0 && (
                        <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                          {unread}
                        </span>
                      )} */}
                    </MDBBtn>
                    {notifOpen && <Notifications onClose={() => setNotifOpen(false)} />}
                  </div>
                )}

                {/* Avatar */}
                {currentUser && (
                  <div ref={profRef} className="position-relative">
                    <MDBBtn
                      color="link"
                      className="p-0 d-flex align-items-center gap-2 text-reset text-decoration-none avatar-btn"
                      onClick={() => setProfOpen((o) => !o)}
                      style={{ textTransform: 'none' }}
                    >
                      {avatarSrc ? (
                        <img src={avatarSrc} width={40} height={40} className="rounded-circle object-fit-cover" />
                      ) : (
                        <MDBIcon fas icon="user-circle" className="text-muted" style={{ width: 40, height: 40 }} />
                      )}
                      <span className="d-none d-md-inline u-body" style={{ fontWeight: 600, color: 'var(--text-strong)' }}>
                        {displayName}
                      </span>
                    </MDBBtn>

                    {profOpen && (
                      <div className="menu-panel position-absolute top-100 end-0">
                        <Link to="/profile" className="menu-item">Dashboard</Link>
                        <Link
                          to="/profile"
                          className="menu-item"
                          onClick={() => {
                            logout();
                            navigate('/login');
                          }}
                        >
                          Logout
                        </Link>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* ───────── Mobile buttons ───────── */}
              <div className="d-flex d-md-none align-items-center gap-2">
                <MDBBtn
                  color="link"
                  className="p-0 me-2"
                  ref={searchToggleRef}
                  onClick={() => setShowMobileSearch((v) => !v)}
                >
                  <MDBIcon fas icon="search" size="2x" />
                </MDBBtn>

                {currentUser ? (
                  <MDBBtn color="link" className="p-0 me-2" onClick={() => navigate('/write')}>
                    <MDBIcon fas icon="pen-clip" size="2x" />
                  </MDBBtn>
                ) : (
                  <Link to="/login" className="btn-outline-gold" style={{ fontSize: '0.85rem' }}>
                    Log&nbsp;In
                  </Link>
                )}
                {currentUser && (
                <div ref={notifRef} className="position-relative">
                  <MDBBtn
                    color="link"
                    className="p-0"
                    ref={bellBtnRef}
                    onClick={() => setNotifOpen((o) => !o)}
                    aria-haspopup="dialog"
                    aria-expanded={notifOpen}
                  >
                    <NotificationIcon
                      on={unread > 0}
                      size={28}
                    />
                  </MDBBtn>
            
                  {/* Notification Panel in Mobile */}
                  {notifOpen && <Notifications onClose={() => setNotifOpen(false)} />}
                </div>
            )}
          
                   {currentUser && (
                  <div ref={profMobileRef} className="position-relative">
                    <MDBBtn
                      color="link"
                      className="p-0 d-flex align-items-center text-reset text-decoration-none avatar-btn"
                      onClick={() => setProfOpenMobile((o) => !o)}
                      style={{ textTransform: 'none' }}
                    >
                      {avatarSrc ? (
                        <img
                          src={avatarSrc}
                          width={36}
                          height={36}
                          className="rounded-circle object-fit-cover"
                        />
                      ) : (
                        <MDBIcon
                          fas
                          icon="user-circle"
                          className="text-muted"
                          style={{ width: 36, height: 36 }}
                        />
                      )}
                    </MDBBtn>

                    {profOpenMobile && (
                      <div className="menu-panel position-absolute top-100 end-0">
                        <Link
                          to="/profile"
                          className="menu-item"
                          onClick={() => setProfOpenMobile(false)}
                        >
                          Dashboard
                        </Link>
                        <Link
                          to="/profile"
                          className="menu-item"
                          onClick={() => {
                            setProfOpenMobile(false);
                            logout();
                            navigate('/login');
                          }}
                        >
                          Logout
                        </Link>
                      </div>
                    )}
                  </div>
                )}


              </div>
            </div>
          </MDBContainer>
        </MDBNavbar>

        {/* Mobile expanding search */}
        {showMobileSearch && (
          <form ref={searchFormRef} onSubmit={handleSearch} className="border-top">
            <div className="bounded py-2">
              <FigmaSearchPill query={query} setQuery={setQuery} autoFocus className="w-100" />
            </div>
          </form>
        )}
      </header>
    </>
  );
}