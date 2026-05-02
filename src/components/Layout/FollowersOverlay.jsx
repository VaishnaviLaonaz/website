// // FollowersOverlay.jsx

// import React, { useState, useMemo } from "react";
// import {
//   MDBBtn, MDBIcon, MDBInputGroup, MDBCardImage,MDBSpinner,
// } from "mdb-react-ui-kit";
// import { Link } from "react-router-dom";
// import PropTypes from "prop-types";

// export default function FollowersOverlay({
//   isOpen, onClose, followers = [], onToggleFollow,
// }) {
//   const [q, setQ] = useState("");
//   const [items, setItems] = useState([]);

//   const ROW_HEIGHT = 64;
//   const MAX_VISIBLE_ROWS = 5;

//   /* simple filter */
//   const list = useMemo(
//     () =>
//       q.trim()
//         ? followers.filter(u =>
//             u.name.toLowerCase().includes(q.toLowerCase()) ||
//             u.username.toLowerCase().includes(q.toLowerCase()))
//         : followers,
//     [q, followers]
//   );

//   if (!isOpen) return null;

//   const olive = "#475a2d";
//   const cream = "#f5f6eb";

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
//           style={{ background: cream, maxHeight: "85vh", overflowY: "auto" }}
//         >
//           {/* search */}
//           {/* <form onSubmit={e => e.preventDefault()}>
//             <MDBInputGroup
//               className="border border-2 rounded-pill mb-4"
//                style={{
//                   display: "flex",
//                   alignItems: "center",
//                   width: "100%",
//                   borderRadius: 999,
//                   border: "1px solid #b9b99b",
//                   background: "#FFFFFF",
//                   padding: "6px 10px",
//                 }}
//             >
//               <span className="input-group-text bg-white border-0 ps-3">
//                 <MDBIcon fas icon="search" size="lg"  style={{ color: "#6c757d" }}/>
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

//           <div
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

//               {u.isFollowing ? (
//                 <MDBBtn
//                   outline
//                   className="rounded-pill px-4 py-1 fw-semibold"
//                   onClick={() => onToggleFollow(u.uid, false)}
//                 >
//                   Following
//                 </MDBBtn>
//               ) : (
//                 <MDBBtn
//                   className="rounded-pill px-4 py-1 fw-semibold"
//                   style={{ background: olive }}
//                   onClick={() => onToggleFollow(u.uid, true)}
//                 >
//                   Follow
//                 </MDBBtn>
//               )}
//             </div>
//           ))}
//         </div>
//       </div>
//       </div>
//     </div>
//   );
// }

// FollowersOverlay.propTypes = {
//   isOpen: PropTypes.bool.isRequired,
//   onClose: PropTypes.func.isRequired,
//   followers: PropTypes.array.isRequired,
//   onToggleFollow: PropTypes.func.isRequired,
// };




// import React, { useState, useMemo, useEffect } from "react";
// import {
//   MDBBtn, MDBIcon, MDBInputGroup, MDBCardImage,
// } from "mdb-react-ui-kit";
// import { Link } from "react-router-dom";
// import PropTypes from "prop-types";
// import {
//   collection, query, orderBy, startAt, endAt, limit, getDocs,
// } from "firebase/firestore";
// import { db } from "../../configs/firebase";

// export default function FollowersOverlay({
//   isOpen, onClose, followers = [], onToggleFollow,
//   currentFollowingIds = [], // NEW: to know if I already follow a follower
// }) {
//   const [q, setQ] = useState("");
//   const [items, setItems] = useState(followers);
//   const [searchResults, setSearchResults] = useState([]);
//   const [pendingUid, setPendingUid] = useState(null);

//   const olive = "#475a2d";
//   const cream = "#f5f6eb";
//   const followingSet = useMemo(() => new Set(currentFollowingIds), [currentFollowingIds]);

//   useEffect(() => { if (isOpen) setItems(followers); }, [isOpen, followers]);

//   // ------ Global search ------
//   useEffect(() => {
//     const run = async () => {
//       const term = q.trim();
//       if (term.length < 2) { setSearchResults([]); return; }

//       const usersRef = collection(db, "users");
//       const q1 = query(usersRef, orderBy("username"), startAt(term), endAt(term + "\uf8ff"), limit(20));
//       const q2 = query(usersRef, orderBy("displayName"), startAt(term), endAt(term + "\uf8ff"), limit(20));
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

//       const merged = [...s1.docs, ...s2.docs]
//         .reduce((acc, d) => { acc.set(d.id, d); return acc; }, new Map());
//       setSearchResults([...merged.values()].map(mapDoc));
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

//   const handleToggle = async (u, follow) => {
//     setPendingUid(u.uid);

//     // optimistic flip in search results always
//     if (showingSearch) {
//       setSearchResults(prev => prev.map(x => x.uid === u.uid ? { ...x, isFollowing: follow } : x));
//     } else {
//       setItems(prev => prev.map(x => x.uid === u.uid ? { ...x, isFollowing: follow } : x));
//     }

//     try {
//       await onToggleFollow(u.uid, follow);
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
//       <div className="w-100" style={{ maxWidth: 380 }} onClick={e => e.stopPropagation()}>
//         <div
//           className="p-4 rounded-4"
//           style={{ background: cream, height: "85vh", maxHeight: "85vh", overflow: "hidden", display: "flex", flexDirection: "column" }}
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
//           <div style={{ flex: "1 1 auto", minHeight: 0, overflowY: "auto", WebkitOverflowScrolling: "touch" }}>
//             {list.map(u => {
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
//                       onClick={() => handleToggle(u, false)}
//                     >
//                       {pendingUid === u.uid ? "Processing" : "Following"}
//                     </MDBBtn>
//                   ) : (
//                     <MDBBtn
//                       disabled={pendingUid === u.uid}
//                       className="rounded-pill px-4 py-1 fw-semibold"
//                       style={{ background: olive }}
//                       onClick={() => handleToggle(u, true)}
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

// FollowersOverlay.propTypes = {
//   isOpen: PropTypes.bool.isRequired,
//   onClose: PropTypes.func.isRequired,
//   followers: PropTypes.array.isRequired,
//   onToggleFollow: PropTypes.func.isRequired,
//   currentFollowingIds: PropTypes.array,
// };

// correct
// import React, { useState, useMemo, useEffect } from "react";
// import { MDBBtn, MDBIcon, MDBInputGroup, MDBCardImage } from "mdb-react-ui-kit";
// import { Link } from "react-router-dom";
// import PropTypes from "prop-types";
// import {
//   collection, query, orderBy, startAt, endAt, limit, getDocs,
// } from "firebase/firestore";
// import { db } from "../../configs/firebase";
// import "../../styles/follow.css";   // shared button styles

// export default function FollowersOverlay({
//   isOpen, onClose, followers = [],
//   onToggleFollow,            // (uid, shouldFollow)
//   currentFollowingIds = [],  // to know if I already follow them
// }) {
//   const [q, setQ] = useState("");
//   const [items, setItems] = useState(followers);
//   const [searchResults, setSearchResults] = useState([]);
//   const [pendingUid, setPendingUid] = useState(null);

//   const cream = "#f5f6eb";
    
// const OLIVE = '#5C6B3C';
// const CANVAS = '#FFFFFF';
// const DIVIDER = 'rgba(92, 107, 60, 0.35)'; // subtle olive divider
// const SHADOW = '0 10px 30px rgba(0,0,0,0.18)';

//   const followingSet = useMemo(() => new Set(currentFollowingIds), [currentFollowingIds]);

//   useEffect(() => { if (isOpen) setItems(followers); }, [isOpen, followers]);

//   // global search (min 2 chars)
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
//           isFollowing: followingSet.has(d.id), // whether I follow them (for follow-back)
//         };
//       };
//       const merged = new Map();
//       [...s1.docs, ...s2.docs].forEach(d => merged.set(d.id, d));
//       setSearchResults([...merged.values()].map(mapDoc));
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
//         // Unfollow (allowed here too)
//         flipLocal(u.uid, { isFollowing: false }, inSearch);
//         await onToggleFollow?.(u.uid, false);
//       } else {
//         // Follow back (or follow from search)
//         flipLocal(u.uid, { isFollowing: true }, inSearch);
//         await onToggleFollow?.(u.uid, true);
//       }
//     } finally {
//       setPendingUid(null);
//     }
//   };

//   return (
//     <div
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
//       <div className="w-100" style={{ maxWidth: 380 }} onClick={e => e.stopPropagation()}>
//         <div className="p-4 rounded-4"
//              style={{ background: cream, height: "85vh", maxHeight: "85vh", overflow: "hidden", display: "flex", flexDirection: "column" }}>
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
//           <div style={{ flex: "1 1 auto", minHeight: 0, overflowY: "auto", WebkitOverflowScrolling: "touch" }}>
//             {list.map(u => (
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
//             {list.length === 0 && <p className="text-center text-muted my-3">No users.</p>}
//           </div>
//         </div>
//       </div>
//     </div>
//     </div>
//   );
// }

// FollowersOverlay.propTypes = {
//   isOpen: PropTypes.bool.isRequired,
//   onClose: PropTypes.func.isRequired,
//   followers: PropTypes.array.isRequired,
//   onToggleFollow: PropTypes.func,
//   currentFollowingIds: PropTypes.array,
// };



//FollowersOverlay.jsx
import React, { useState, useMemo, useEffect } from "react";
import {
  MDBBtn, MDBIcon, MDBInputGroup, MDBCardImage
} from "mdb-react-ui-kit";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import {
  collection, query, orderBy, startAt, endAt, limit, getDocs,
} from "firebase/firestore";
import { db } from "../../configs/firebase";
import "../../styles/follow.css";

export default function FollowersOverlay({
  isOpen, onClose,
  followers = [],
  onToggleFollow,
  currentFollowingIds = [],
}) {
  const [q, setQ] = useState("");
  const [items, setItems] = useState(followers);
  const [searchResults, setSearchResults] = useState([]);
  const [pendingUid, setPendingUid] = useState(null);

  /* ⭐ NEW shadow cache for unfollowed state */
  const [localMap, setLocalMap] = useState({});

  /* ⭐ skeleton loading (for search results) */
  const [loading, setLoading] = useState(false);

  const cream = "#f5f6eb";
  const OLIVE = "#5C6B3C";
  const CANVAS = "#FFFFFF";
  const SHADOW = "0 10px 30px rgba(0,0,0,0.18)";

  const followingSet = useMemo(() => new Set(currentFollowingIds), [currentFollowingIds]);

  /* Reset cache on close */
  useEffect(() => {
    if (!isOpen) {
      setLocalMap({});
      setQ("");
      setSearchResults([]);
    }
  }, [isOpen]);

  /* Sync with parent but override with localMap */
  useEffect(() => {
    if (isOpen) {
      setItems(() => {
        const merged = followers.map((u) =>
          localMap[u.uid] ? { ...u, ...localMap[u.uid] } : u
        );

        Object.keys(localMap).forEach((uid) => {
          if (!merged.find((x) => x.uid === uid)) {
            merged.push(localMap[uid]);
          }
        });

        return merged;
      });
    }
  }, [isOpen, followers, localMap]);

  /* SEARCH (unchanged except loading + map override) */
  useEffect(() => {
    const run = async () => {
      const term = q.trim();
      if (term.length < 2) {
        setSearchResults([]);
        return;
      }

      setLoading(true);

      const usersRef = collection(db, "users");
      const q1 = query(
        usersRef,
        orderBy("username"),
        startAt(term),
        endAt(term + "\uf8ff"),
        limit(20)
      );
      const q2 = query(
        usersRef,
        orderBy("displayName"),
        startAt(term),
        endAt(term + "\uf8ff"),
        limit(20)
      );

      const [s1, s2] = await Promise.all([getDocs(q1), getDocs(q2)]);

      const baseMap = new Map();
      [...s1.docs, ...s2.docs].forEach((d) => baseMap.set(d.id, d));

      const mapped = [...baseMap.values()].map((d) => {
        const data = d.data() || {};
        const base = {
          uid: d.id,
          name: data.displayName || "Member",
          username:
            data.username ||
            (data.email ? data.email.split("@")[0] : d.id.slice(0, 8)),
          avatar: data.avatarUrl || "https://placehold.co/48x48",
          isFollowing: followingSet.has(d.id),

          /* ⭐ NEW default flags */
          unfollowed: false,
          mutual: followers.some((f) => f.uid === d.id), // if they follow me back
        };

        return localMap[d.id] ? { ...base, ...localMap[d.id] } : base;
      });

      setSearchResults(mapped);
      setLoading(false);
    };

    run().catch(() => setLoading(false));
  }, [q, followingSet, localMap, followers]);


  const showingSearch = q.trim().length >= 2;

  const list = useMemo(() => {
    if (showingSearch) return searchResults;
    if (!q.trim()) return items;

    const t = q.trim().toLowerCase();
    return items.filter(
      (u) =>
        (u.name || "").toLowerCase().includes(t) ||
        (u.username || "").toLowerCase().includes(t)
    );
  }, [showingSearch, searchResults, items, q]);


  if (!isOpen) return null;

  /* ⭐ UPDATED LABEL */
  const label = (u) => {
    if (u.unfollowed) return "Unfollowed";
    return (u.isFollowing ?? followingSet.has(u.uid)) ? "Following" : "Follow";
  };

  const flipLocal = (uid, changes, inSearch) => {
    if (inSearch)
      setSearchResults((prev) =>
        prev.map((x) => (x.uid === uid ? { ...x, ...changes } : x))
      );
    else
      setItems((prev) =>
        prev.map((x) => (x.uid === uid ? { ...x, ...changes } : x))
      );
  };

  /* ⭐ UPDATED FOLLOW - UNFOLLOW LOGIC */
  const handleClick = async (u) => {
    setPendingUid(u.uid);

    const inSearch = showingSearch;
    const currentlyFollowing =
      (u.isFollowing ?? followingSet.has(u.uid)) && !u.unfollowed;

    try {
      if (currentlyFollowing) {
        // ⭐ UNFOLLOW BUT KEEP IN LIST
        const updated = { ...u, isFollowing: false, unfollowed: true };
        setLocalMap((m) => ({ ...m, [u.uid]: updated }));
        flipLocal(u.uid, updated, inSearch);
        await onToggleFollow?.(u.uid, false);
      } else {
        // ⭐ FOLLOW BACK
        const updated = {
          ...u,
          unfollowed: false,
          isFollowing: true,
        };
        setLocalMap((m) => ({ ...m, [u.uid]: updated }));
        flipLocal(u.uid, updated, inSearch);
        await onToggleFollow?.(u.uid, true);
      }
    } finally {
      setPendingUid(null);
    }
  };

  /* ⭐ SKELETON COMPONENT */
  const SkeletonItem = () => (
    <div className="d-flex align-items-center justify-content-between py-3">
      <div className="d-flex align-items-center gap-3">
        <div
          style={{
            width: 54,
            height: 54,
            borderRadius: "50%",
            background: "#ddd",
            animation: "pulse 1.5s infinite",
          }}
        />
        <div>
          <div style={{ width: 130, height: 14, background: "#ddd", borderRadius: 8 }} />
          <div
            style={{
              width: 90,
              height: 12,
              background: "#e5e5e5",
              borderRadius: 6,
              marginTop: 6,
            }}
          />
        </div>
      </div>
      <div
        style={{
          width: 85,
          height: 34,
          background: "#ddd",
          borderRadius: 20,
        }}
      />
    </div>
  );


  return (
    <div
      className="position-absolute top-100 end-0"
      style={{
        minWidth: 300,
        background: CANVAS,
        border: `1px solid ${OLIVE}`,
        borderRadius: 10,
        boxShadow: SHADOW,
        zIndex: 999,
        overflow: "hidden",
      }}
      role="dialog"
      aria-label="Followers Overlay"
    >

      {/* OVERLAY BACKDROP */}
      <div
        className="position-fixed top-0 bottom-0 start-0 end-0 d-flex justify-content-center align-items-start pt-5"
        style={{ background: "rgba(0,0,0,.55)", zIndex: 1050 }}
        onClick={onClose}
      >

        {/* PANEL */}
        <div className="w-100" style={{ maxWidth: 380 }} onClick={(e) => e.stopPropagation()}>
          <div
            className="p-4 rounded-4"
            style={{
              background: cream,
              height: "85vh",
              maxHeight: "85vh",
              overflow: "hidden",
              display: "flex",
              flexDirection: "column",
            }}
          >

            {/* SEARCH BOX */}
            <form onSubmit={(e) => e.preventDefault()}>
              <MDBInputGroup className="mb-4">
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    width: "100%",
                    borderRadius: 999,
                    border: "1px solid #b9b99b",
                    background: "#FFFFFF",
                    padding: "6px 10px",
                  }}
                >
                  <MDBIcon fas icon="search" size="sm" style={{ color: "#6c757d" }} />
                  <input
                    className="border-0 bg-transparent ms-2"
                    style={{
                      outline: "none",
                      boxShadow: "none",
                      width: "100%",
                      fontFamily: "Poppins, sans-serif",
                      fontSize: "14px",
                    }}
                    placeholder="Search by name or @username (min 2 chars)"
                    value={q}
                    onChange={(e) => setQ(e.target.value)}
                  />
                </div>
              </MDBInputGroup>
            </form>

            {/* LIST */}
            <div
              style={{
                flex: "1 1 auto",
                minHeight: 0,
                overflowY: "auto",
                WebkitOverflowScrolling: "touch",
              }}
            >
              {loading &&
                [...Array(6)].map((_, i) => <SkeletonItem key={i} />)}

              {!loading &&
                list.map((u) => (
                  <div
                    key={u.uid}
                    className="d-flex align-items-center justify-content-between py-3"
                  >
                    <Link
                      to={`/u/${u.username || u.uid}`}
                      className="d-flex align-items-center gap-3 text-reset"
                      style={{ textDecoration: "none", minWidth: 0 }}
                    >
                      <MDBCardImage
                        src={u.avatar}
                        alt={u.name || "Member"}
                        width={54}
                        height={54}
                        className="rounded-circle object-fit-cover"
                      />

                      <div
                        style={{
                          width: "160px",
                          overflow: "hidden",
                          whiteSpace: "nowrap",
                          textOverflow: "ellipsis",
                        }}
                      >
                        <div className="fw-semibold text-truncate">
                          {u.name || "Member"}
                        </div>
                        <div className="text-muted small text-truncate">
                          @{u.username}
                        </div>

                        {/* ⭐ MUTUAL BADGE */}
                        {u.mutual && (
                          <span
                            style={{
                              background: OLIVE,
                              color: "white",
                              padding: "2px 8px",
                              borderRadius: 10,
                              fontSize: 11,
                              marginTop: 4,
                              display: "inline-block",
                            }}
                          >
                            Mutual
                          </span>
                        )}
                      </div>
                    </Link>

                    {/* BUTTON */}
                    <MDBBtn
                      outline={label(u) !== "Follow"}
                      disabled={pendingUid === u.uid}
                      className="rounded-pill px-4 py-1 fw-semibold"
                      style={{ flexShrink: 0 }}
                      onClick={() => handleClick(u)}
                    >
                      {label(u)}
                    </MDBBtn>
                  </div>
                ))}

              {!loading && list.length === 0 && (
                <p className="text-center text-muted my-3">No users.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

FollowersOverlay.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  followers: PropTypes.array.isRequired,
  onToggleFollow: PropTypes.func,
  currentFollowingIds: PropTypes.array,
};
