// // FollowingOverlay.jsx

// import React, { useMemo, useState } from "react";
// import {
//   MDBBtn, MDBIcon, MDBInputGroup, MDBCardImage,
// } from "mdb-react-ui-kit";
// import { Link } from "react-router-dom";
// import PropTypes from "prop-types";

// export default function FollowingOverlay({
//   isOpen, onClose, following = [], onRemove,
// }) {
//   const [q, setQ] = useState("");
//   const [items, setItems] = useState([]);

//   const ROW_HEIGHT = 64;
//   const MAX_VISIBLE_ROWS = 5;

//   const list = useMemo(
//     () =>
//       q.trim()
//         ? following.filter(u =>
//             u.name.toLowerCase().includes(q.toLowerCase()) ||
//             u.username.toLowerCase().includes(q.toLowerCase()))
//         : following,
//     [q, following]
//   );

//   if (!isOpen) return null;
//   const hasScroll = list.length > MAX_VISIBLE_ROWS;


//   return (
//     <div
//       className="position-fixed top-0 bottom-0 start-0 end-0 d-flex justify-content-center align-items-start pt-5"
//       style={{ background: "rgba(0,0,0,.55)", zIndex: 1050 }}
//       onClick={onClose}
//     >
//       <div
//         className="w-100" style={{ maxWidth: 380 }}
//         onClick={e => e.stopPropagation()}
//       >
//         <div
//           className="p-4 rounded-4"
//           style={{ background: "#f5f6eb", maxHeight: "85vh", overflowY: "auto" }}
//         >
//           {/* search */}
//           {/* <form onSubmit={e => e.preventDefault()}>
//             <MDBInputGroup
//               className="border border-2 rounded-pill mb-4"
//               style={{ borderColor: "#b9b99b" }}
//             >
//               <span className="input-group-text bg-white border-0 ps-3">
//                 <MDBIcon fas icon="search" size="lg" />
//               </span>
//               <input
//                 className="form-control border-0 shadow-none ps-2"
//                 placeholder="Search"
//                 value={q}
//                 onChange={e => setQ(e.target.value)}
//               />
//             </MDBInputGroup>
//           </form> */}
//            <form onSubmit={(e) => e.preventDefault()}>
//             <MDBInputGroup className="mb-4">
//               <div
//                 style={{
//                   display: "flex",
//                   alignItems: "center",
//                   width: "100%",
//                   borderRadius: 999,
//                   border: "1px solid #b9b99b",
//                   background: "#FFFFFF",
//                   padding: "6px 10px",
//                 }}
//               >
//                 <MDBIcon
//                   fas
//                   icon="search"
//                   size="sm"
//                   style={{ color: "#6c757d" }}
//                 />
//                 <input
//                   className="border-0 bg-transparent ms-2"
//                   style={{
//                     outline: "none",
//                     boxShadow: "none",
//                     width: "100%",
//                     fontFamily: "Poppins, sans-serif",
//                     fontSize: "14px",
//                   }}
//                   placeholder="Search by name or @username"
//                   value={q}
//                   onChange={(e) => setQ(e.target.value)}
//                 />
//               </div>
//             </MDBInputGroup>
//           </form>

//           {/* list */}
//       <div
//         style={{
//           padding: 0,
//           maxHeight: `${ROW_HEIGHT * MAX_VISIBLE_ROWS}px`,
//           overflowY: hasScroll ? "auto" : "visible",
//         }}
//       >
//           {list.map(u => (
//             <div
//               key={u.uid}
//               className="d-flex align-items-center justify-content-between py-3"
//             >
//               <Link to={`/u/${u.username}`} className="d-flex align-items-center gap-3 text-reset"
//                     style={{ textDecoration: "none" }}>
//                 <MDBCardImage
//                   src={u.avatar}
//                   alt={u.name}
//                   width={54} height={54}
//                   className="rounded-circle object-fit-cover"
//                 />
//                 <div>
//                   <div className="fw-semibold">{u.name}</div>
//                   <div className="text-muted small">@{u.username}</div>
//                 </div>
//               </Link>

//               <MDBBtn
//                 outline
//                 className="rounded-pill px-4 py-1 fw-semibold"
//                 onClick={() => onRemove(u.uid)}
//               >
//                 Remove
//               </MDBBtn>
//             </div>
//           ))}
//         </div>
//       </div>
//       </div>
//     </div>
//   );
// }

// FollowingOverlay.propTypes = {
//   isOpen: PropTypes.bool.isRequired,
//   onClose: PropTypes.func.isRequired,
//   following: PropTypes.array.isRequired,
//   onRemove: PropTypes.func.isRequired,
// };



// src/components/Layout/FollowingOverlay.jsx

// import React, { useMemo, useState } from "react";
// import {
//   MDBBtn,
//   MDBIcon,
//   MDBInputGroup,
//   MDBCardImage,
// } from "mdb-react-ui-kit";
// import { Link } from "react-router-dom";
// import PropTypes from "prop-types";

// export default function FollowingOverlay({
//   isOpen,
//   onClose,
//   following = [],
//   onRemove,
// }) {
//   const [q, setQ] = useState("");

//   const cream = "#f5f6eb";

//   const qLower = q.trim().toLowerCase();

//   const list = useMemo(() => {
//     if (!qLower) return following;
//     return following.filter((u) => {
//       const n = (u.name || "").toLowerCase();
//       const un = (u.username || "").toLowerCase();
//       return n.includes(qLower) || un.includes(qLower);
//     });
//   }, [qLower, following]);

  

//   if (!isOpen) return null;

//   return (
//     <div
//       className="position-fixed top-0 bottom-0 start-0 end-0 d-flex justify-content-center align-items-start pt-5"
//       style={{ background: "rgba(0,0,0,.55)", zIndex: 1050 }}
//       onClick={onClose}
//     >
//       <div
//         className="w-100"
//         style={{ maxWidth: 380 }}
//         onClick={(e) => e.stopPropagation()}
//       >
//         {/* Main card as flex column */}
//         <div
//           className="rounded-4"
//           style={{
//             background: cream,
//             /* FIX 1: give a definite height and clip overflow
//                so the inner flex child can actually scroll */
//             height: "85vh",
//             maxHeight: "85vh",
//             overflow: "hidden",

//             display: "flex",
//             flexDirection: "column",
//             padding: "1.5rem",
//           }}
//         >
//           {/* search */}
//           <form onSubmit={(e) => e.preventDefault()}>
//             <MDBInputGroup className="mb-4">
//               <div
//                 style={{
//                   display: "flex",
//                   alignItems: "center",
//                   width: "100%",
//                   borderRadius: 999,
//                   border: "1px solid #b9b99b",
//                   background: "#FFFFFF",
//                   padding: "6px 10px",
//                 }}
//               >
//                 <MDBIcon
//                   fas
//                   icon="search"
//                   size="sm"
//                   style={{ color: "#6c757d" }}
//                 />
//                 <input
//                   className="border-0 bg-transparent ms-2"
//                   style={{
//                     outline: "none",
//                     boxShadow: "none",
//                     width: "100%",
//                     fontFamily: "Poppins, sans-serif",
//                     fontSize: "14px",
//                   }}
//                   placeholder="Search by name or @username"
//                   value={q}
//                   onChange={(e) => setQ(e.target.value)}
//                 />
//               </div>
//             </MDBInputGroup>
//           </form>

//           {/* Scrollable list area */}
//           <div
//            style={{
//               flex: "1 1 auto",
//               minHeight: 0,
//               overflowY: "auto",
//               maxHeight: "calc(85vh - 96px)",
//               WebkitOverflowScrolling: "touch",
//               overscrollBehavior: "contain",
//             }}
//           >
//             {list.map((u) => (
//               <div
//                 key={u.uid}
//                 className="d-flex align-items-center justify-content-between py-3"
//               >
//                 <Link
//                   to={`/u/${u.username || u.uid}`}
//                   className="d-flex align-items-center gap-3 text-reset"
//                   style={{ textDecoration: "none" }}
//                 >
//                   <MDBCardImage
//                     src={u.avatar}
//                     alt={u.name}
//                     width={54}
//                     height={54}
//                     className="rounded-circle object-fit-cover"
//                   />
//                   <div>
//                      <div className="fw-semibold">{u.name || "Member"}</div>
//                      <div className="text-muted small">@{u.username || u.uid?.slice(0, 8)}</div>                
//                      </div>
//                      </Link>

//                 <MDBBtn
//                   outline
//                   className="rounded-pill px-4 py-1 fw-semibold"
//                   onClick={() => onRemove(u.uid)}
//                 >
//                   Remove
//                 </MDBBtn>
//               </div>
//             ))}

//             {list.length === 0 && (
//               <p className="text-center text-muted my-3">
//                 You’re not following anyone yet.
//               </p>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// FollowingOverlay.propTypes = {
//   isOpen: PropTypes.bool.isRequired,
//   onClose: PropTypes.func.isRequired,
//   following: PropTypes.array.isRequired,
//   onRemove: PropTypes.func.isRequired,
// };




// import React, { useEffect, useMemo, useState } from "react";
// import { MDBBtn, MDBIcon, MDBInputGroup, MDBCardImage } from "mdb-react-ui-kit";
// import { Link } from "react-router-dom";
// import PropTypes from "prop-types";
// import {
//   collection, query, orderBy, startAt, endAt, limit, getDocs,
// } from "firebase/firestore";
// import { db } from "../../configs/firebase";

// export default function FollowingOverlay({
//   isOpen,
//   onClose,
//   following = [],
//   onRemove,               // keep for backward compatibility (unfollow)
//   onToggleFollow, 
//   onSendRequest,    
//   onCancelRequest,      // NEW: follow/unfollow toggle
//   currentFollowingIds = [],
//   currentSentIds = [], // NEW: array of ids you're following (for search results)
// }) {
//   const [q, setQ] = useState("");
//   const [items, setItems] = useState(following); // local copy for instant UI
//   const [searchResults, setSearchResults] = useState([]); // global search pool
//   const [pendingUid, setPendingUid] = useState(null);

//   const cream = "#f5f6eb";
//   const followingSet = useMemo(() => new Set(currentFollowingIds), [currentFollowingIds]);
//   const sentSet = useMemo(() => new Set(currentSentIds), [currentSentIds]);

//   // sync local items whenever overlay opens or parent list changes
//   useEffect(() => {
//     if (isOpen) setItems(following);
//   }, [isOpen, following]);

//   // ------- Global search (username/displayName) -------
//   useEffect(() => {
//     const run = async () => {
//       const term = q.trim();
//       if (term.length < 2) {
//         setSearchResults([]);
//         return;
//       }
//       // username search
//       const usersRef = collection(db, "users");
//       const qUser = query(usersRef, orderBy("username"), startAt(term), endAt(term + "\uf8ff"), limit(20));
//       const snap1 = await getDocs(qUser);

//       // displayName search
//       const qName = query(usersRef, orderBy("displayName"), startAt(term), endAt(term + "\uf8ff"), limit(20));
//       const snap2 = await getDocs(qName);

//       const mapDoc = (d) => {
//         const data = d.data() || {};
//         return {
//           uid: d.id,
//           name: data.displayName || "Member",
//           username: data.username || (data.email ? data.email.split("@")[0] : d.id.slice(0, 8)),
//           avatar: data.avatarUrl || "https://placehold.co/48x48",
//           isFollowing: followingSet.has(d.id),
//         };
//       };

//       const merged = [...snap1.docs, ...snap2.docs]
//         .reduce((acc, d) => { acc.set(d.id, d); return acc; }, new Map());
//       setSearchResults([...merged.values()].map(mapDoc));
//     };
//     run().catch(() => setSearchResults([]));
//   }, [q, followingSet]);

//   const showingSearch = q.trim().length >= 2;
//   const baseList = items;
//   const list = useMemo(() => {
//     if (showingSearch) return searchResults;
//     if (!q.trim()) return baseList;
//     const t = q.trim().toLowerCase();
//     return baseList.filter((u) =>
//       (u.name || "").toLowerCase().includes(t) ||
//       (u.username || "").toLowerCase().includes(t)
//     );
//   }, [showingSearch, searchResults, baseList, q]);

//   if (!isOpen) return null;

//   const handleFollowToggle = async (u, follow) => {
//     // optimistic UI
//     setPendingUid(u.uid);
//     if (showingSearch) {
//       setSearchResults(prev => prev.map(x => x.uid === u.uid ? { ...x, isFollowing: follow } : x));
//       if (follow) setItems(prev => prev.find(p => p.uid === u.uid) ? prev : [{ ...u, isFollowing: true }, ...prev]);
//       else       setItems(prev => prev.filter(p => p.uid !== u.uid));
//     } else {
//       if (follow) setItems(prev => prev.map(x => x.uid === u.uid ? { ...x, isFollowing: true } : x));
//       else        setItems(prev => prev.filter(x => x.uid !== u.uid));
//     }

//     try {
//       // call the proper handler
//       if (follow) {
//         await onToggleFollow?.(u.uid, true);
//       } else {
//         await (onToggleFollow ? onToggleFollow(u.uid, false) : onRemove?.(u.uid));
//       }
//     } finally {
//       setPendingUid(null);
//     }
//   };

//   return (
//     <div
//       className="position-fixed top-0 bottom-0 start-0 end-0 d-flex justify-content-center align-items-start pt-5"
//       style={{ background: "rgba(0,0,0,.55)", zIndex: 1050 }}
//       onClick={onClose}
//     >
//       <div className="w-100" style={{ maxWidth: 380 }} onClick={(e) => e.stopPropagation()}>
//         <div
//           className="rounded-4"
//           style={{
//             background: cream,
//             height: "85vh",
//             maxHeight: "85vh",
//             overflow: "hidden",
//             display: "flex",
//             flexDirection: "column",
//             padding: "1.5rem",
//           }}
//         >
//           {/* search */}
//           <form onSubmit={(e) => e.preventDefault()}>
//             <MDBInputGroup className="mb-4">
//               <div style={{
//                 display: "flex", alignItems: "center", width: "100%",
//                 borderRadius: 999, border: "1px solid #b9b99b", background: "#FFFFFF", padding: "6px 10px",
//               }}>
//                 <MDBIcon fas icon="search" size="sm" style={{ color: "#6c757d" }} />
//                 <input
//                   className="border-0 bg-transparent ms-2"
//                   style={{ outline: "none", boxShadow: "none", width: "100%", fontFamily: "Poppins, sans-serif", fontSize: "14px" }}
//                   placeholder="Search by name or @username (min 2 chars)"
//                   value={q}
//                   onChange={(e) => setQ(e.target.value)}
//                 />
//               </div>
//             </MDBInputGroup>
//           </form>

//           {/* list */}
//           <div
//             style={{
//               flex: "1 1 auto", minHeight: 0, overflowY: "auto",
//               maxHeight: "calc(85vh - 96px)", WebkitOverflowScrolling: "touch", overscrollBehavior: "contain",
//             }}
//           >
//             {list.map((u) => {
//               const isFollowing = u.isFollowing ?? followingSet.has(u.uid);
//               return (
//                 <div key={u.uid} className="d-flex align-items-center justify-content-between py-3">
//                   <Link to={`/u/${u.username || u.uid}`} className="d-flex align-items-center gap-3 text-reset" style={{ textDecoration: "none" }}>
//                     <MDBCardImage src={u.avatar} alt={u.name || "Member"} width={54} height={54} className="rounded-circle object-fit-cover" />
//                     <div>
//                       <div className="fw-semibold">{u.name || "Member"}</div>
//                       <div className="text-muted small">@{u.username || u.uid?.slice(0, 8)}</div>
//                     </div>
//                   </Link>

//                   {isFollowing ? (
//                     <MDBBtn
//                       outline
//                       disabled={pendingUid === u.uid}
//                       className="rounded-pill px-4 py-1 fw-semibold"
//                       onClick={() => handleFollowToggle(u, false)}
//                     >
//                       {pendingUid === u.uid ? "Processing" : "Remove"}
//                     </MDBBtn>
//                   ) : (
//                     <MDBBtn
//                       disabled={pendingUid === u.uid}
//                       className="rounded-pill px-4 py-1 fw-semibold"
//                       onClick={() => handleFollowToggle(u, true)}
//                     >
//                       {pendingUid === u.uid ? "Processing" : "Follow"}
//                     </MDBBtn>
//                   )}
//                 </div>
//               );
//             })}

//             {list.length === 0 && (
//               <p className="text-center text-muted my-3">No users.</p>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// FollowingOverlay.propTypes = {
//   isOpen: PropTypes.bool.isRequired,
//   onClose: PropTypes.func.isRequired,
//   following: PropTypes.array.isRequired,
//   onRemove: PropTypes.func,          // optional now
//   onToggleFollow: PropTypes.func,    // optional but recommended
//   currentFollowingIds: PropTypes.array, // for search result badges
// };



// correct
// import React, { useEffect, useMemo, useState } from "react";
// import { MDBBtn, MDBIcon, MDBInputGroup, MDBCardImage } from "mdb-react-ui-kit";
// import { Link } from "react-router-dom";
// import PropTypes from "prop-types";
// import {
//   collection, query, orderBy, startAt, endAt, limit, getDocs,
// } from "firebase/firestore";
// import { db } from "../../configs/firebase";
// import "../../styles/follow.css";   // shared button styles

// export default function FollowingOverlay({
//   isOpen,
//   onClose,
//   following = [],
//   onRemove,                // optional legacy unfollow handler
//   onToggleFollow,          // (uid, shouldFollow)
//   currentFollowingIds = [],// live ids from parent
// }) {
//   const [q, setQ] = useState("");
//   const [items, setItems] = useState(following);
//   const [searchResults, setSearchResults] = useState([]);
//   const [pendingUid, setPendingUid] = useState(null);
//   const cream = "#f5f6eb";
  
// const OLIVE = '#5C6B3C';
// const CANVAS = '#FFFFFF';
// const SHADOW = '0 10px 30px rgba(0,0,0,0.18)';

//   const followingSet = useMemo(() => new Set(currentFollowingIds), [currentFollowingIds]);

//   // sync local list when overlay opens or prop changes
//   useEffect(() => { if (isOpen) setItems(following); }, [isOpen, following]);

//   // global search (min 2 chars) across users
//   useEffect(() => {
//     const run = async () => {
//       const term = q.trim();
//       if (term.length < 2) { setSearchResults([]); return; }

//       const usersRef = collection(db, "users");
//       const q1 = query(usersRef, orderBy("username"),     startAt(term), endAt(term + "\uf8ff"), limit(20));
//       const q2 = query(usersRef, orderBy("displayName"),  startAt(term), endAt(term + "\uf8ff"), limit(20));
//       const [s1, s2] = await Promise.all([getDocs(q1), getDocs(q2)]);

//       const mapDoc = (d) => {
//         const data = d.data() || {};
//         return {
//           uid: d.id,
//           name: data.displayName || "Member",
//           username: data.username || (data.email ? data.email.split("@")[0] : d.id.slice(0, 8)),
//           avatar: data.avatarUrl || "https://placehold.co/48x48",
//           isFollowing: followingSet.has(d.id),
//         };
//       };

//       // merge duplicates by id
//       const mergedMap = new Map();
//       [...s1.docs, ...s2.docs].forEach(d => mergedMap.set(d.id, d));
//       setSearchResults([...mergedMap.values()].map(mapDoc));
//     };
//     run().catch(() => setSearchResults([]));
//   }, [q, followingSet]);

//   const showingSearch = q.trim().length >= 2;
//   const list = useMemo(() => {
//     if (showingSearch) return searchResults;
//     if (!q.trim()) return items;
//     const t = q.trim().toLowerCase();
//     return items.filter(u =>
//       (u.name || "").toLowerCase().includes(t) ||
//       (u.username || "").toLowerCase().includes(t)
//     );
//   }, [showingSearch, searchResults, items, q]);

//   if (!isOpen) return null;

//   const label = (u) => (u.isFollowing ?? followingSet.has(u.uid)) ? "Following" : "Follow";

//   const flipLocal = (uid, changes, inSearch) => {
//     if (inSearch) setSearchResults(prev => prev.map(x => x.uid === uid ? { ...x, ...changes } : x));
//     else          setItems(prev => prev.map(x => x.uid === uid ? { ...x, ...changes } : x));
//   };

//   const handleClick = async (u) => {
//     setPendingUid(u.uid);
//     const inSearch = showingSearch;
//     const isFollowing = u.isFollowing ?? followingSet.has(u.uid);

//     try {
//       if (isFollowing) {
//         // UNFOLLOW: optimistic remove from following list view
//         if (!inSearch) setItems(prev => prev.filter(x => x.uid !== u.uid));
//         else           flipLocal(u.uid, { isFollowing: false }, true);
//         if (onToggleFollow) await onToggleFollow(u.uid, false);
//         else if (onRemove)  await onRemove(u.uid); // legacy
//       } else {
//         // FOLLOW
//         flipLocal(u.uid, { isFollowing: true }, inSearch);
//         await onToggleFollow?.(u.uid, true);
//       }
//     } finally {
//       setPendingUid(null);
//     }
//   };

//   return (
//      <div
//       className="position-absolute top-100 end-0"
//       style={{
//         minWidth: 300,
//         minHeight: 200,
//         background: CANVAS,
//         border: `1px solid ${OLIVE}`,
//         borderRadius: 10,
//         boxShadow: SHADOW,
//         zIndex: 999,
//         overflow: 'hidden' // keeps header radius clean
//       }}
//       role="dialog"
//       aria-label="Notifications"
//     >
//     <div
//       className="position-fixed top-0 bottom-0 start-0 end-0 d-flex justify-content-center align-items-start pt-5"
//       style={{ background: "rgba(0,0,0,.55)", zIndex: 1050 }}
//       onClick={onClose}
//     >
//       <div className="w-100" style={{ maxWidth: 380 }} onClick={(e) => e.stopPropagation()}>
//         <div
//           className="rounded-4"
//           style={{
//             background: cream,
//             height: "85vh",
//             maxHeight: "85vh",
//             overflow: "hidden",
//             display: "flex",
//             flexDirection: "column",
//             padding: "1.5rem",
//           }}
//         >
//           {/* Search */}
//           <form onSubmit={(e) => e.preventDefault()}>
//             <MDBInputGroup className="mb-4">
//               <div style={{
//                 display: "flex", alignItems: "center", width: "100%",
//                 borderRadius: 999, border: "1px solid #b9b99b", background: "#FFFFFF", padding: "6px 10px",
//               }}>
//                 <MDBIcon fas icon="search" size="sm" style={{ color: "#6c757d" }} />
//                 <input
//                   className="border-0 bg-transparent ms-2"
//                   style={{ outline: "none", boxShadow: "none", width: "100%", fontFamily: "Poppins, sans-serif", fontSize: "14px" }}
//                   placeholder="Search by name or @username (min 2 chars)"
//                   value={q}
//                   onChange={(e) => setQ(e.target.value)}
//                 />
//               </div>
//             </MDBInputGroup>
//           </form>

//           {/* List */}
//           <div
//             style={{
//               flex: "1 1 auto", minHeight: 0, overflowY: "auto",
//               maxHeight: "calc(85vh - 96px)", WebkitOverflowScrolling: "touch", overscrollBehavior: "contain",
//             }}
//           >
//             {list.map((u) => (
//               <div key={u.uid} className="d-flex align-items-center justify-content-between py-3">
//                 <Link to={`/u/${u.username || u.uid}`} className="d-flex align-items-center gap-3 text-reset" style={{ textDecoration: "none" }}>
//                   <MDBCardImage src={u.avatar} alt={u.name || "Member"} width={54} height={54} className="rounded-circle object-fit-cover" />
//                   <div>
//                     <div className="fw-semibold">{u.name || "Member"}</div>
//                     <div className="text-muted small">@{u.username || u.uid?.slice(0, 8)}</div>
//                   </div>
//                 </Link>

//                 <MDBBtn
//                   outline={label(u) !== "Follow"}  // Following => outline pill
//                   disabled={pendingUid === u.uid}
//                   className="rounded-pill px-4 py-1 fw-semibold"
//                   onClick={() => handleClick(u)}
//                 >
//                   {pendingUid === u.uid ? "Following" : label(u)}
//                 </MDBBtn>
//               </div>
//             ))}

//             {list.length === 0 && (
//               <p className="text-center text-muted my-3">No users.</p>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//     </div>
//   );
// }

// FollowingOverlay.propTypes = {
//   isOpen: PropTypes.bool.isRequired,
//   onClose: PropTypes.func.isRequired,
//   following: PropTypes.array.isRequired,
//   onRemove: PropTypes.func,
//   onToggleFollow: PropTypes.func,
//   currentFollowingIds: PropTypes.array,
// };



// src/components/Layout/FollowingOverlay.jsx
import React, { useEffect, useMemo, useState } from "react";
import { MDBBtn, MDBIcon, MDBInputGroup, MDBCardImage } from "mdb-react-ui-kit";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import {
  collection, query, orderBy, startAt, endAt, limit, getDocs,
} from "firebase/firestore";
import { db } from "../../configs/firebase";
import "../../styles/follow.css";

export default function FollowingOverlay({
  isOpen,
  onClose,
  following = [],
  onRemove,
  onToggleFollow,
  currentFollowingIds = [],
}) {
  const [q, setQ] = useState("");
  const [items, setItems] = useState(following);
  const [searchResults, setSearchResults] = useState([]);
  const [pendingUid, setPendingUid] = useState(null);

  const cream = "#f5f6eb";
  const OLIVE = '#5C6B3C';
  const CANVAS = '#FFFFFF';
  const SHADOW = '0 10px 30px rgba(0,0,0,0.18)';

  const followingSet = useMemo(() => new Set(currentFollowingIds), [currentFollowingIds]);

  /* ⭐ ADDED shadow local cache */
  const [localMap, setLocalMap] = useState({});

  /* ⭐ reset cache when closing overlay */
  useEffect(() => {
    if (!isOpen) setLocalMap({});
  }, [isOpen]);


  /* ⭐ UPDATED: sync list but override with localMap */
  useEffect(() => {
    if (isOpen) {
      setItems(() => {
        const merged = following.map(u => {
          return localMap[u.uid] ? { ...u, ...localMap[u.uid] } : u;
        });

        // include unfollowed users even if parent removed them
        Object.keys(localMap).forEach(uid => {
          if (!merged.find(u => u.uid === uid)) {
            merged.push(localMap[uid]);
          }
        });

        return merged;
      });
    }
  }, [isOpen, following, localMap]);


  /* SEARCH — untouched */
  useEffect(() => {
    const run = async () => {
      const term = q.trim();
      if (term.length < 2) { setSearchResults([]); return; }

      const usersRef = collection(db, "users");
      const q1 = query(usersRef, orderBy("username"), startAt(term), endAt(term + "\uf8ff"), limit(20));
      const q2 = query(usersRef, orderBy("displayName"), startAt(term), endAt(term + "\uf8ff"), limit(20));
      const [s1, s2] = await Promise.all([getDocs(q1), getDocs(q2)]);

      const mapDoc = (d) => {
        const data = d.data() || {};
        const base = {
          uid: d.id,
          name: data.displayName || "Member",
          username: data.username || (data.email ? data.email.split("@")[0] : d.id.slice(0, 8)),
          avatar: data.avatarUrl || "https://placehold.co/48x48",
          isFollowing: followingSet.has(d.id),
          unfollowed: false,
        };

        return localMap[d.id] ? { ...base, ...localMap[d.id] } : base;
      };

      const mergedMap = new Map();
      [...s1.docs, ...s2.docs].forEach(d => mergedMap.set(d.id, d));

      setSearchResults([...mergedMap.values()].map(mapDoc));
    };
    run().catch(() => setSearchResults([]));
  }, [q, followingSet, localMap]);


  const showingSearch = q.trim().length >= 2;

  const list = useMemo(() => {
    if (showingSearch) return searchResults;
    if (!q.trim()) return items;
    const t = q.trim().toLowerCase();
    return items.filter(u =>
      (u.name || "").toLowerCase().includes(t) ||
      (u.username || "").toLowerCase().includes(t)
    );
  }, [showingSearch, searchResults, items, q]);

  if (!isOpen) return null;


  /* ⭐ UPDATED label */
  const label = (u) => {
    if (u.unfollowed) return "Unfollowed";
    return (u.isFollowing ?? followingSet.has(u.uid)) ? "Following" : "Follow";
  };


  /* SAME flipLocal */
  const flipLocal = (uid, changes, inSearch) => {
    if (inSearch)
      setSearchResults(prev => prev.map(x => x.uid === uid ? { ...x, ...changes } : x));
    else
      setItems(prev => prev.map(x => x.uid === uid ? { ...x, ...changes } : x));
  };


  /* ⭐ UPDATED FULL LOGIC: no deletion, use localMap */
  const handleClick = async (u) => {
    setPendingUid(u.uid);

    const inSearch = showingSearch;
    const currentlyFollowing =
      (u.isFollowing ?? followingSet.has(u.uid)) && !u.unfollowed;

    try {
      if (currentlyFollowing) {
        // ⭐ UNFOLLOW but KEEP visible
        const updated = { ...u, isFollowing: false, unfollowed: true };
        setLocalMap(m => ({ ...m, [u.uid]: updated }));
        flipLocal(u.uid, updated, inSearch);
        await onToggleFollow?.(u.uid, false);

      } else {
        // ⭐ FOLLOW BACK
        const updated = { ...u, unfollowed: false, isFollowing: true };
        setLocalMap(m => ({ ...m, [u.uid]: updated }));
        flipLocal(u.uid, updated, inSearch);
        await onToggleFollow?.(u.uid, true);
      }

    } finally {
      setPendingUid(null);
    }
  };


  return (
    <div
      className="position-absolute top-100 end-0"
      style={{
        minWidth: 300,
        minHeight: 200,
        background: CANVAS,
        border: `1px solid ${OLIVE}`,
        borderRadius: 10,
        boxShadow: SHADOW,
        zIndex: 999,
        overflow: 'hidden'
      }}
      role="dialog"
      aria-label="Notifications"
    >

      <div
        className="position-fixed top-0 bottom-0 start-0 end-0 d-flex justify-content-center align-items-start pt-5"
        style={{ background: "rgba(0,0,0,.55)", zIndex: 1050 }}
        onClick={onClose}
      >
        <div className="w-100" style={{ maxWidth: 380 }} onClick={(e) => e.stopPropagation()}>
          <div
            className="rounded-4"
            style={{
              background: cream,
              height: "85vh",
              maxHeight: "85vh",
              overflow: "hidden",
              display: "flex",
              flexDirection: "column",
              padding: "1.5rem",
            }}
          >

            {/* Search — untouched */}
            <form onSubmit={(e) => e.preventDefault()}>
              <MDBInputGroup className="mb-4">
                <div style={{
                  display: "flex", alignItems: "center", width: "100%",
                  borderRadius: 999, border: "1px solid #b9b99b", background: "#FFFFFF", padding: "6px 10px",
                }}>
                  <MDBIcon fas icon="search" size="sm" style={{ color: "#6c757d" }} />
                  <input
                    className="border-0 bg-transparent ms-2"
                    style={{
                      outline: "none", boxShadow: "none",
                      width: "100%", fontFamily: "Poppins, sans-serif", fontSize: "14px"
                    }}
                    placeholder="Search by name or @username (min 2 chars)"
                    value={q}
                    onChange={(e) => setQ(e.target.value)}
                  />
                </div>
              </MDBInputGroup>
            </form>


            {/* LIST — updated only name width + button fixed */}
            <div
              style={{
                flex: "1 1 auto", minHeight: 0, overflowY: "auto",
                maxHeight: "calc(85vh - 96px)", WebkitOverflowScrolling: "touch",
                overscrollBehavior: "contain",
              }}
            >
              {list.map((u) => (
                <div key={u.uid} className="d-flex align-items-center justify-content-between py-3">

                  <Link
                    to={`/u/${u.username || u.uid}`}
                    className="d-flex align-items-center gap-3 text-reset"
                    style={{ textDecoration:"none", minWidth:0 }}
                  >
                    <MDBCardImage
                      src={u.avatar}
                      alt={u.name || "Member"}
                      width={54}
                      height={54}
                      className="rounded-circle object-fit-cover"
                    />

                    {/* ⭐ FIXED WIDTH TEXT */}
                    <div
                      style={{
                        width: "160px",
                        overflow: "hidden",
                        whiteSpace: "nowrap",
                        textOverflow: "ellipsis",
                      }}
                    >
                      <div className="fw-semibold text-truncate">{u.name || "Member"}</div>
                      <div className="text-muted small text-truncate">@{u.username || u.uid?.slice(0,8)}</div>
                    </div>
                  </Link>

                  <MDBBtn
                    outline={label(u) !== "Follow"}
                    disabled={pendingUid === u.uid}
                    className="rounded-pill px-4 py-1 fw-semibold"
                    onClick={() => handleClick(u)}
                    style={{ flexShrink: 0 }}
                  >
                    {pendingUid === u.uid ? label(u) : label(u)}
                  </MDBBtn>
                </div>
              ))}

              {list.length === 0 && (
                <p className="text-center text-muted my-3">No users.</p>
              )}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

FollowingOverlay.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  following: PropTypes.array.isRequired,
  onRemove: PropTypes.func,
  onToggleFollow: PropTypes.func,
  currentFollowingIds: PropTypes.array,
};
