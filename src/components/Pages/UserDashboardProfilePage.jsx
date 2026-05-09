// // src/pages/UserDashboardProfilePage.jsx
// import React, { useState, useEffect } from "react";
// import {
//   MDBContainer, MDBRow, MDBCol, MDBCard, MDBCardBody, MDBCardImage,
//   MDBBtn, MDBBadge, MDBIcon,
// } from "mdb-react-ui-kit";
// import { useNavigate, Link } from "react-router-dom";
// import { doc, getDoc, collection, query, where, getDocs } from "firebase/firestore";

// import {
//   getDatabase, ref as rdbRef, get as rdbGet,
// } from 'firebase/database';

// import { useAuth } from "../../context/AuthContext";
// import { useCurrentUserDoc, follow, unfollow, loadFList } from "../../configs/hooks";
// import { useUserDoc } from "../../configs/user";
// import { useArticles, deleteArticle, updateArticle  } from "../../configs/useArticles";
// import { db } from "../../configs/firebase";
// import ArticleCard from "../cards/ArticleCard";
// import FollowersOverlay from "../Layout/FollowersOverlay";
// import FollowingOverlay from "../Layout/FollowingOverlay";

// /* ---------- tiny presentational stat card ---------- */
// const StatCard = ({ label, value, change }) => (
//   <MDBCard className="text-center shadow-0 border-0">
//     <MDBCardBody>
//       <h5 className="fw-bold mb-1">{value}</h5>
//       <p className="mb-0 text-muted" style={{ fontSize: ".875rem" }}>
//         {label}
//       </p>
//       <p className="mb-0" style={{ fontSize: ".75rem", color: "#198754" }}>
//         +{change}%
//       </p>
//     </MDBCardBody>
//   </MDBCard>
// );

// export default function UserDashboardProfilePage() {
//   /* ─── basic hooks ─── */
//   const { currentUser } = useAuth();
//   const { doc: user, loading: userLoading } = useCurrentUserDoc();
//   const { userDoc } = useUserDoc();
//   const navigate = useNavigate();

//   /* ─── tab state FIRST so we can use it below ─── */
//   const [activeTab, setActiveTab] = useState("mine"); // 'mine' | 'bookmarked'
//   const showMine = activeTab === "mine";

//   /* ─── articles & filters ─── */
//   const articles = useArticles(100); // all recent 100
//   const mine = articles?.filter((a) => a.authorId === currentUser.uid) ?? [];
//   const bookmarked = articles?.filter((a) => a.bookmarked) ?? [];

//   /* ─── author lookup for bookmarked tab ─── */
//   const [authors, setAuthors] = useState({});
//   const fetchAuthors = async (uids) => {
//     const pairs = await Promise.all(
//       uids.map(async (uid) => {
//         const snap = await getDoc(doc(db, "users", uid));
//         return [uid, snap.exists() ? { uid, ...snap.data() } : null];
//       })
//     );
//     setAuthors((prev) => ({ ...prev, ...Object.fromEntries(pairs) }));
//   };
//   useEffect(() => {
//     const missing = [
//       ...new Set(bookmarked.map((b) => b.authorId).filter((id) => !authors[id])),
//     ];
//     if (missing.length) fetchAuthors(missing);
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [bookmarked]);

//   /* ─── followers / following modal state ─── */
//   const [followers, setFollowers] = useState([]);
//   const [following, setFollowing] = useState([]);
//   const [showFollowers, setShowFollowers] = useState(false);
//   const [showFollowing, setShowFollowing] = useState(false);

//   const openModal = async (kind) => {
//     const list = await loadFList(kind, currentUser.uid);
//     if (kind === "followers") {
//       setFollowers(list);
//       setShowFollowers(true);
//     } else {
//       setFollowing(list);
//       setShowFollowing(true);
//     }
//   };

//   /* ─── fast guards ─── */
//   if (userLoading || articles === null) {
//     return <p className="text-center py-5">Loading…</p>;
//   }
//   if (!user) return null;

//   /* ─── helpers ─── */
//   // const stats = Array.isArray(user.stats) ? user.stats : null;
//   const joined = (user.registeredAt ?? user.createdAt)?.seconds
//     ? new Date((user.registeredAt ?? user.createdAt).seconds * 1000).getFullYear()
//     : "—";

//   const avatarSrc =
//     userDoc?.avatarUrl ||
//     currentUser?.photoURL ||
//     "https://i.pravatar.cc/40?u=default";

//  const handleEdit = (art) => navigate(`/write/edit/${art.id}`)
//  const handleDelete = (id) => deleteArticle(id);

//   /* ─── RENDER ─── */
//   return (
//     <MDBContainer fluid="lg" className="py-4" style={{ maxWidth: 860 }}>
//       <div className="p-4 rounded-4" style={{ background: "#F1F1E6" }}>
//         {/* ───────── Header / profile card ───────── */}
//         <MDBCard
//           className="shadow-0 border-0 text-center mb-4"
//           style={{ background: "transparent" }}
//         >
//           <MDBCardBody>
//             <p className="text-muted mb-2 mt-2" style={{ fontSize: ".8rem" }}>
//               Member since&nbsp;{joined}
//             </p>

//             {/* avatar */}
//             <img
//               src={avatarSrc}
//               width={60}
//               height={60}
//               className="rounded-circle mb-2 mt-3"
//               alt="User avatar"
//             />

//             <h4 className="fw-bold mb-1 mt-2">
//               {user.firstName} {user.lastName}
//             </h4>
//             <p className="text-muted mb-1 mt-2">@{user.username}</p>
//             {user.tagline && <p className="text-muted mb-3 mt-2">{user.tagline}</p>}
//             {user.bio && (
//               <p className="mx-auto" style={{ maxWidth: 520, fontSize: ".9rem" }}>
//                 {user.bio}
//               </p>
//             )}

//             <MDBBtn
//               size="sm"
//               outline
//               color="dark"
//               className="rounded-pill mt-3"
//               onClick={() => navigate("/profile/edit")}
//             >
//               Edit
//             </MDBBtn>

//             {/* follower counts */}
//             <div className="d-flex justify-content-center gap-3 mt-3">
//               <span
//                 role="button"
//                 onClick={() => openModal("followers")}
//                 className="fw-bold text-decoration-underline"
//               >
//                 {followers.length} followers
//               </span>
//               <span
//                 role="button"
//                 onClick={() => openModal("following")}
//                 className="fw-bold text-decoration-underline"
//               >
//                 {following.length} following
//               </span>
//             </div>
//           </MDBCardBody>
//         </MDBCard>

//         {/* ───────── Analytics row ───────── */}
       
//             <div className="d-flex justify-content-between align-items-center mb-2">
//               <h6 className="fw-bold mb-0">Analytics</h6>

              
//             </div>
//             <MDBRow className="gy-3 mb-4">
            
//                 <MDBCol 
//                 // key={s.label}
//                  xs="6" md="3">
                 
//                 </MDBCol>
//                 <MDBCard>
//                 <p>Views</p>
//                 <p>35</p>
//                 <p>+5%</p>
//               </MDBCard>
              
//             </MDBRow>
//              <div className="text-center mt-4">
//               <Link to="/analytics" className="small fw-semibold text-decoration-underline">
//                View More
//               </Link>
//             </div>
     

//         {/* ───────── Articles grid ───────── */}
//         <div className="d-flex justify-content-between align-items-center mb-3">
//           <h6 className="fw-bold mb-0">Articles</h6>
//           <div>
//             <MDBBtn
//               size="sm"
//               color={activeTab === "mine" ? "success" : "light"}
//               className="rounded-pill me-2"
//               onClick={() => setActiveTab("mine")}
//             >
//               My Articles
//             </MDBBtn>
//             <MDBBtn
//               size="sm"
//               color={activeTab === "bookmarked" ? "success" : "light"}
//               className="rounded-pill"
//               onClick={() => setActiveTab("bookmarked")}
//             >
//               Bookmarked
//             </MDBBtn>
//           </div>
//         </div>

//         <MDBRow className="g-3">
//           {(showMine ? mine : bookmarked).map((a) => (
//             <MDBCol key={a.id} xs="6" md="4">
//               <ArticleCard
//                 article={a}
//                 author={showMine ? userDoc : authors[a.authorId]}
//                 isOwner={showMine}
//                 onEdit={handleEdit}
//                 onDelete={handleDelete}
//               />
//             </MDBCol>
//           ))}
//         </MDBRow>
//         <div className="text-center mt-4">
//         <Link to="/articles" className="small fw-semibold text-decoration-underline">
//         View More
//         </Link>
//         </div>

//         {/* ───────── Followers / Following overlays ───────── */}
//         <FollowersOverlay
//           isOpen={showFollowers}
//           onClose={() => setShowFollowers(false)}
//           followers={followers}
//           onToggleFollow={(uid, shouldFollow) =>
//             shouldFollow
//               ? follow(currentUser.uid, uid)
//               : unfollow(currentUser.uid, uid)
//           }
//         />
//         <FollowingOverlay
//           isOpen={showFollowing}
//           onClose={() => setShowFollowing(false)}
//           following={following}
//           onRemove={(uid) => unfollow(currentUser.uid, uid)}
//         />
//       </div>
//     </MDBContainer>
//   );
// }


// // src/components/Pages/UserDashboardProfilePage.jsx
// import React, { useState, useEffect, useMemo } from "react";
// import {
//   MDBContainer,
//   MDBRow,
//   MDBCol,
//   MDBCard,
//   MDBCardBody,
//   MDBBtn
// } from "mdb-react-ui-kit";
// import { useNavigate, Link } from "react-router-dom";
// import { doc, getDoc } from "firebase/firestore";

// import { useAuth } from "../../context/AuthContext";
// import { useCurrentUserDoc, follow, unfollow, loadFList } from "../../configs/hooks";
// import { useUserDoc } from "../../configs/user";
// import { useArticles, deleteArticle } from "../../configs/useArticles";
// import { db } from "../../configs/firebase";

// import ArticleCard from "../cards/ArticleCard";
// import {
//   streamFollowers, streamFollowing,
//   streamFollowersCount, streamFollowingCount,
//   toggleFollow,
// } from "../../configs/follow";
// import FollowersOverlay from "../Layout/FollowersOverlay";
// import FollowingOverlay from "../Layout/FollowingOverlay";


// /* ---------- tiny presentational stat card ---------- */
// const StatCard = ({ label, value, change }) => (
//   <MDBCard className="text-center shadow-0 border-0">
//     <MDBCardBody>
//       <h5 className="fw-bold mb-1">{value}</h5>
//       <p className="mb-0 text-muted" style={{ fontSize: ".875rem" }}>
//         {label}
//       </p>
//       {!!change && (
//         <p className="mb-0" style={{ fontSize: ".75rem", color: "#198754" }}>
//           +{change}%
//         </p>
//       )}
//     </MDBCardBody>
//   </MDBCard>
// );

// export default function UserDashboardProfilePage() {
//   /* ─── basic hooks ─── */
//   const { currentUser } = useAuth();
//   const { doc: user, loading: userLoading } = useCurrentUserDoc();
//   const { userDoc } = useUserDoc();
//   const navigate = useNavigate();

//   /* ─── tab state ─── */
//   const [activeTab, setActiveTab] = useState("mine");
//   const showMine = activeTab === "mine";

//   /* ─── articles & filters ─── */
//   const articles = useArticles(100);

//   /* ①  wrap filters in useMemo → stable refs → ESLint happy */
//   const mine = useMemo(
//     () => articles?.filter(a => a.authorId === currentUser.uid) ?? [],
//     [articles, currentUser.uid]
//   );

//   const bookmarked  = useMemo(
//    () => articles?.filter(
//          a => a.bookmarkedBy && currentUser.uid in a.bookmarkedBy
//        ) ?? [],
//    [articles, currentUser.uid]
//  );

//   /* ─── analytics totals ─── */
//   const [stats, setStats] = useState({
//     views: 0,
//     bookmarks: 0,
//     likes: 0,
//     comments: 0
//   });

//   useEffect(() => {
//     let views = 0,
//       likes = 0,
//       comments = 0,
//       bookmarksCnt = 0;

//     mine.forEach(a => {
//       views += a.views || 0;
//       likes += a.likesCount || (a.likedBy ? Object.keys(a.likedBy).length : 0);
//       comments += a.commentsCount || 0;
//       bookmarksCnt +=
//         a.bookmarksCount ||
//         (a.bookmarkedBy ? Object.keys(a.bookmarkedBy).length : 0);
//     });

//     setStats({
//       views,
//       bookmarks: bookmarksCnt,
//       likes,
//       comments
//     });
//   }, [mine]);

//   /* ─── author lookup for bookmarked tab ─── */
//   const [authors, setAuthors] = useState({});
//   useEffect(() => {
//     const fetchAuthors = async uids => {
//       const pairs = await Promise.all(
//         uids.map(async uid => {
//           const snap = await getDoc(doc(db, "users", uid));
//           return [uid, snap.exists() ? { uid, ...snap.data() } : null];
//         })
//       );
//       setAuthors(prev => ({ ...prev, ...Object.fromEntries(pairs) }));
//     };

//     const missing = [
//       ...new Set(bookmarked.map(b => b.authorId).filter(id => !authors[id]))
//     ];
//     if (missing.length) fetchAuthors(missing);
//   }, [bookmarked, authors]);

//   /* ─── followers / following modal state ─── */
//   const [followers, setFollowers] = useState([]);
//   const [following, setFollowing] = useState([]);
//   const [showFollowers, setShowFollowers] = useState(false);
//   const [showFollowing, setShowFollowing] = useState(false);

//   const openModal = async kind => {
//     const list = await loadFList(kind, currentUser.uid);
//     if (kind === "followers") {
//       setFollowers(list);
//       setShowFollowers(true);
//     } else {
//       setFollowing(list);
//       setShowFollowing(true);
//     }
//   };

//   /* ─── guards ─── */
//   if (userLoading || articles === null)
//     return <p className="text-center py-5">Loading…</p>;
//   if (!user) return null;

//   /* ─── helpers ─── */
//   const joined = (user.registeredAt ?? user.createdAt)?.seconds
//     ? new Date(
//         (user.registeredAt ?? user.createdAt).seconds * 1000
//       ).getFullYear()
//     : "—";

//   const avatarSrc =
//     userDoc?.avatarUrl ||
//     currentUser?.photoURL ||
//     "https://i.pravatar.cc/40?u=default";

//   const handleEdit = art => navigate(`/write/edit/${art.id}`);
//   const handleDelete = id => deleteArticle(id);

//   /* ─── render ─── */
//   return (
//     <MDBContainer fluid="lg" className="py-4" style={{ maxWidth: 860 }}>
//       <div className="p-4 rounded-4" style={{ background: "#F1F1E6" }}>
//         {/* ────── Header ────── */}
//         <div className="text-center mb-4">
//           <p className="text-muted mb-2" style={{ fontSize: ".8rem" }}>
//             Member since&nbsp;{joined}
//           </p>

//           <img
//             src={avatarSrc}
//             width={60}
//             height={60}
//             className="rounded-circle mb-2"
//             alt="User avatar"
//           />

//           <h4 className="fw-bold mb-1">
//             {user.firstName} {user.lastName}
//           </h4>
//           <p className="text-muted mb-1">@{user.username}</p>
//           {user.tagline && (
//             <p className="text-muted mb-2">{user.tagline}</p>
//           )}
//           {user.bio && (
//             <p
//               className="mx-auto"
//               style={{ maxWidth: 520, fontSize: ".9rem" }}
//             >
//               {user.bio}
//             </p>
//           )}

//           <MDBBtn
//             size="sm"
//             outline
//             color="dark"
//             className="rounded-pill"
//             onClick={() => navigate("/profile/edit")}
//           >
//             Edit
//           </MDBBtn>

//           {/* follower counts */}
//           <div className="d-flex justify-content-center gap-3 mt-3">
//             <span
//               role="button"
//               onClick={() => openModal("followers")}
//               className="fw-bold text-decoration-underline"
//             >
//               {followers.length} followers
//             </span>
//             <span
//               role="button"
//               onClick={() => openModal("following")}
//               className="fw-bold text-decoration-underline"
//             >
//               {following.length} following
//             </span>
//           </div>
//         </div>

//         {/* ────── Analytics ────── */}
//         <div className="d-flex justify-content-between align-items-center mb-2">
//           <h6 className="fw-bold mb-0">Analytics</h6>
//         </div>

//         <MDBRow className="gy-3 mb-4">
//           <MDBCol xs="6" md="3">
//             <StatCard
//               label="Views"
//               value={stats.views.toLocaleString()}
//               change={5}
//             />
//           </MDBCol>
//           <MDBCol xs="6" md="3">
//             <StatCard
//               label="Bookmarks"
//               value={stats.bookmarks.toLocaleString()}
//               change={10}
//             />
//           </MDBCol>
//           <MDBCol xs="6" md="3">
//             <StatCard
//               label="Likes"
//               value={stats.likes.toLocaleString()}
//               change={15}
//             />
//           </MDBCol>
//           <MDBCol xs="6" md="3">
//             <StatCard
//               label="Comments"
//               value={stats.comments.toLocaleString()}
//               change={8}
//             />
//           </MDBCol>
//         </MDBRow>

//         <div className="text-center mb-4">
//           <Link
//             to="/analytics"
//             className="small fw-semibold text-decoration-underline"
//           >
//             View More
//           </Link>
//         </div>

//         {/* ────── Articles grid ────── */}
//         <div className="d-flex justify-content-between align-items-center mb-3">
//           <h6 className="fw-bold mb-0">Articles</h6>
//           <div>
//             <MDBBtn
//               size="sm"
//               color={showMine ? "success" : "light"}
//               className="rounded-pill me-2"
//               onClick={() => setActiveTab("mine")}
//             >
//               My Articles
//             </MDBBtn>
//             <MDBBtn
//               size="sm"
//               color={!showMine ? "success" : "light"}
//               className="rounded-pill"
//               onClick={() => setActiveTab("bookmarked")}
//             >
//               Bookmarked
//             </MDBBtn>
//           </div>
//         </div>

//         <MDBRow className="g-3">
//           {(showMine ? mine : bookmarked).map(a => (
//             <MDBCol key={a.id} xs="6" md="4">
//               <ArticleCard
//                 article={a}
//                 author={showMine ? userDoc : authors[a.authorId]}
//                 isOwner={showMine}
//                 onEdit={handleEdit}
//                 onDelete={handleDelete}
//               />
//             </MDBCol>
//           ))}
//         </MDBRow>

//         <div className="text-center mt-4">
//           <Link
//             to="/articles"
//             className="small fw-semibold text-decoration-underline"
//           >
//             View More
//           </Link>
//         </div>

//         {/* ────── Followers / Following overlays ────── */}
//         <FollowersOverlay
//           isOpen={showFollowers}
//           onClose={() => setShowFollowers(false)}
//           followers={followers}
//           onToggleFollow={(uid, shouldFollow) =>
//             shouldFollow
//               ? follow(currentUser.uid, uid)
//               : unfollow(currentUser.uid, uid)
//           }
//         />
//         <FollowingOverlay
//           isOpen={showFollowing}
//           onClose={() => setShowFollowing(false)}
//           following={following}
//           onRemove={uid => unfollow(currentUser.uid, uid)}
//         />
//       </div>
//     </MDBContainer>
//   );
// }












// correct below before cpst cutting

// // src/components/Pages/UserDashboardProfilePage.jsx
// import React, { useState, useEffect, useMemo } from "react";
// import {
//   MDBContainer, MDBRow, MDBCol, MDBCard, MDBCardBody, MDBBtn,
// } from "mdb-react-ui-kit";
// import { useNavigate, Link } from "react-router-dom";
// import { doc, getDoc } from "firebase/firestore";

// import { useAuth } from "../../context/AuthContext";
// import { useCurrentUserDoc } from "../../configs/hooks";
// import { useUserDoc } from "../../configs/user";
// import { useArticles, deleteArticle, useMyDrafts, deleteDraft } from "../../configs/useArticles";
// import { db } from "../../configs/firebase";

// import ArticleCard from "../cards/ArticleCard";
// import {
//   streamFollowers, streamFollowing,
//   streamFollowersCount, streamFollowingCount,
//   toggleFollow, sendFollowRequest, cancelFollowRequest, streamRequestsSent,
// } from "../../configs/follow";
// import FollowersOverlay from "../Layout/FollowersOverlay";
// import FollowingOverlay from "../Layout/FollowingOverlay";

// /* ---------- tiny presentational stat card ---------- */
// const StatCard = ({ label, value, change }) => (
//   // <MDBCard className="text-center shadow-0 border-0">
//   //   <MDBCardBody>
//   //     <h5 className="fw-bold mb-1">{value}</h5>
//   //     <p className="mb-0 text-muted" style={{ fontSize: ".875rem" }}>{label}</p>
//   //     {!!change && (
//   //       <p className="mb-0" style={{ fontSize: ".75rem", color: "#198754" }}>+{change}%</p>
//   //     )}
//   //   </MDBCardBody>
//   // </MDBCard>
//    <MDBCard
//     style={{
//       borderRadius: '0.75rem',
//       background: '#F1F1E6',
//       boxShadow: 'none',
//       border: 'none',
//     }}
//   >
//     <MDBCardBody className="text-center py-4">
//       {/* 1) LABEL */}
//       <div
//         style={{
//           fontFamily: 'Poppins, sans-serif',
//           fontWeight: 600,
//           fontSize: '16px',
//           lineHeight: '150%',
//           color: '#0A0A0A',
//           marginBottom: '0.5rem',
//         }}
//       >
//         {label}
//       </div>

//       {/* 2) VALUE */}
//       <div
//         style={{
//           fontFamily: 'Poppins, sans-serif',
//           fontWeight: 600,
//           fontSize: '28px',
//           lineHeight: '150%',
//           color: '#0A0A0A',
//           marginBottom: change != null ? '0.75rem' : 0,
//         }}
//       >
//         {value}
//       </div>

//     </MDBCardBody>
//   </MDBCard>

// );


// export default function UserDashboardProfilePage() {
//   /* ─── auth & profile docs ─── */
//   const { currentUser } = useAuth();
//   const myUid = currentUser.uid;
//   const { doc: user, loading: userLoading } = useCurrentUserDoc();
//   const { userDoc } = useUserDoc();                     // hydrated Firestore doc
//   const navigate = useNavigate();

//   /* ─── tabs & articles ─── */
//   const [activeTab, setActiveTab] = useState("mine");   // mine | bookmarked
//   const showMine = activeTab === "mine";
//   const articles = useArticles(100);
//   const drafts = useMyDrafts(myUid, 100);

//   const mine = useMemo(
//     () => articles?.filter(a => a.authorId === myUid) ?? [],
//     [articles, myUid],
//   );

//    const combinedMine = useMemo(() => {
//     const draftsNormalized = drafts.map(d => ({ ...d, id: d.id, isDraft: true }));
//     const joined = [...draftsNormalized, ...mine];
//     return [...joined].sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
//   }, [drafts, mine]);

//   const bookmarked = useMemo(
//     () => articles?.filter(a => a.bookmarkedBy && myUid in a.bookmarkedBy) ?? [],
//     [articles, myUid],
//   );

//   /* ─── analytics totals ─── */
//   // const [stats, setStats] = useState({ views: 0, bookmarks: 0, likes: 0, comments: 0 });
//   // useEffect(() => {
//   //   let views = 0, likes = 0, comments = 0, bookmarksCnt = 0;
//   //   mine.forEach(a => {
//   //     views       += a.views        || 0;
//   //     likes       += a.likesCount   || (a.likedBy       ? Object.keys(a.likedBy).length       : 0);
//   //     comments    += a.commentsCount|| 0;
//   //     bookmarksCnt+= a.bookmarksCount||(a.bookmarkedBy ? Object.keys(a.bookmarkedBy).length : 0);
//   //   });
//   //   setStats({ views, bookmarks: bookmarksCnt, likes, comments });
//   // }, [mine]);

//   const [stats, setStats] = useState({
//   views: 0,
//   bookmarks: 0,
//   likes: 0,
//   comments: 0,
// });

// useEffect(() => {
//   let views = 0,
//       likes = 0,
//       comments = 0;
//       // bookmarksCnt = 0;

//   mine.forEach(a => {
//     // 1) sum views on my articles
//     views        += a.views         || 0;
//     // 3) sum likesCount on my articles
//     likes        += a.likesCount    || 0;
//     // 4) sum commentsCount on my articles
//     comments     += a.commentsCount || 0;
//     // 2) sum bookmarksCount on my articles
//     // bookmarksCnt += a.bookmarksCount|| 0;
//   });
//   const bookmarksCnt = bookmarked.length;

//   setStats({
//     views,
//     bookmarks: bookmarksCnt,
//     likes,
//     comments,
//   });
// }, [mine, bookmarked]);


//   /* ─── author lookup for bookmarked tab ─── */
//   const [authors, setAuthors] = useState({});
//   useEffect(() => {
//     const fetchAuthors = async uids => {
//       const pairs = await Promise.all(
//         uids.map(async uid => {
//           const snap = await getDoc(doc(db, "users", uid));
//           return [uid, snap.exists() ? { uid, ...snap.data() } : null];
//         }),
//       );
//       setAuthors(prev => ({ ...prev, ...Object.fromEntries(pairs) }));
//     };
//     const missing = [...new Set(bookmarked.map(b => b.authorId).filter(id => !authors[id]))];
//     if (missing.length) fetchAuthors(missing);
//   }, [bookmarked, authors]);

//   /* ─── follower / following live state ─── */
//   const [followersCnt, setFollowersCnt] = useState(0);
//   const [followingCnt, setFollowingCnt] = useState(0);
//   const [followersIds, setFollowersIds] = useState([]);
//   const [followingIds, setFollowingIds] = useState([]);
//   const [sentReqIds, setSentReqIds] = useState([]);

//   useEffect(() => {
//     const u1 = streamFollowersCount(myUid,   setFollowersCnt);
//     const u2 = streamFollowingCount(myUid,   setFollowingCnt);
//     const u3 = streamFollowers(myUid,        setFollowersIds);
//     const u4 = streamFollowing(myUid,        setFollowingIds);
//     const u5 = streamRequestsSent(myUid,     setSentReqIds);
//     return () => { u1(); u2(); u3(); u4(); u5(); };
//   }, [myUid]);

//   /* ─── overlays + hydrated lists ─── */
//   const [showFollowers, setShowFollowers] = useState(false);
//   const [showFollowing, setShowFollowing] = useState(false);
//   const [followersList, setFollowersList] = useState([]);
//   const [followingList, setFollowingList] = useState([]);

//   useEffect(() => {
//   if (showFollowers) {
//     hydrate(followersIds, setFollowersList);
//   }
// }, [showFollowers, followersIds]);

// useEffect(() => {
//   if (showFollowing) {
//     hydrate(followingIds, setFollowingList);
//   }
// }, [showFollowing, followingIds]);  

//   // const hydrate = async (ids, setter) => {
//   //   const docs = await Promise.all(ids.map(async id => {
//   //     const s = await getDoc(doc(db, "users", id));
//   //     return s.exists()
//   //       ? {
//   //           uid: id,
//   //           name: s.data().displayName,
//   //           username: s.data().username,
//   //           avatar: s.data().avatarUrl || "https://placehold.co/48x48",
//   //           isFollowing: followingIds.includes(id),
//   //         }
//   //       : null;
//   //   }));
//   //   setter(docs.filter(Boolean));
//   // };
//     // --- replace hydrate with this robust version ---
// const hydrate = async (ids, setter) => {
//   if (!ids || !ids.length) {
//     setter([]);
//     return;
//   }

//   // optional debug — remove after verifying
//   // console.log("[hydrate] ids:", ids);

//   const results = await Promise.allSettled(
//     ids.map(async (id) => {
//       try {
//         const snap = await getDoc(doc(db, "users", id));
//         if (!snap.exists()) {
//           // no profile doc — still return a stub so list renders
//           return {
//             uid: id,
//             name: "Member",
//             username: id.slice(0, 8),
//             avatar: "https://placehold.co/48x48",
//             isFollowing: followingIds.includes(id),
//           };
//         }

//         const data = snap.data() || {};
//         const name =
//           data.displayName ||
//           `${data.firstName || ""} ${data.lastName || ""}`.trim() ||
//           "Member";
//         const username =
//           data.username ||
//           (data.email ? data.email.split("@")[0] : id.slice(0, 8));

//         return {
//           uid: id,
//           name,
//           username,
//           avatar: data.avatarUrl || "https://placehold.co/48x48",
//           isFollowing: followingIds.includes(id),
//         };
//       } catch (err) {
//         // console.warn("[hydrate] getDoc failed for", id, err);
//         // fall back to a stub even on exception
//         return {
//           uid: id,
//           name: "Member",
//           username: id.slice(0, 8),
//           avatar: "https://placehold.co/48x48",
//           isFollowing: followingIds.includes(id),
//         };
//       }
//     })
//   );

//   const docs = results
//     .map((r) => (r.status === "fulfilled" ? r.value : null))
//     .filter(Boolean);

//   // optional debug — remove after verifying
//   // console.log("[hydrate] built profiles:", docs.length, docs);

//   setter(docs);
// };

//   const openFollowers = async () => {
//     await hydrate(followersIds, setFollowersList);
//     setShowFollowers(true);
//   };
//   const openFollowing = async () => {
//     await hydrate(followingIds, setFollowingList);
//     setShowFollowing(true);
//   };

//   /* ─── follow / unfollow actions ─── */
//   // Fix: properly define handleToggleFollow with parameters and remove extraneous '+'
//   const handleToggleFollow = async (uid, shouldFollow) => {
//     // You can implement follow/unfollow logic here if needed
//     try {
//       await toggleFollow(uid, myUid);
//     } catch (e) {
//       // handle error if needed
//       console.error(e);
//     }
//   };
//   const handleSendRequest = async (uid) => {
//   try { await sendFollowRequest(uid, myUid); } catch (e) { console.error(e); }
// };
// const handleCancelRequest = async (uid) => {
//  try { await cancelFollowRequest(uid, myUid); } catch (e) { console.error(e); }
// };
     

//   /* ─── guards ─── */
//   if (userLoading || articles === null)
//     return <p className="text-center py-5">Loading…</p>;
//   if (!user) return null;

//   /* ─── helpers ─── */
//   const joined = (user.registeredAt ?? user.createdAt)?.seconds
//     ? new Date((user.registeredAt ?? user.createdAt).seconds * 1000).getFullYear()
//     : "—";

//   const avatarSrc =
//     userDoc?.avatarUrl ||
//     currentUser?.photoURL;

//   const handleEditPublished     = art => navigate(`/write/edit/${art.id}`);
//   const handleEditDraft = draft => navigate(`/write/edit/${draft.id}?draft=1`);

//   // const handleDelete  = id  => deleteArticle(id);
//    const handleDelete = (item) => {
//     if (item.isDraft) return deleteDraft(myUid, item.id);
//     return deleteArticle(item.id);
//   };
//   /* ─── render ─── */
//   return (
    
//     <MDBContainer fluid="lg" className="py-4 px-2 px-md-4" style={{ backgroundColor: "#F1F1E6" }}>
//       <div className="p-3 p-md-4" style={{maxWidth: 860, background: "#FFFFFF", margin: "0 auto",borderRadius: "3rem",  }}>
//         {/* ────── Header ────── */}
//         <div className="text-center mb-4">
//           <p className="text-muted mb-2" 
//          style={{
//               fontFamily: 'Poppins, sans-serif',
//               fontWeight: 600,
//               fontSize: '16px',
//               lineHeight: '150%',
//               letterSpacing: '0px',
//               textAlign: 'center',
//               color: '#5C6B3C',
//               marginBottom: '1rem',
//             }}
// >
//             Member since&nbsp;{joined}
//           </p>

//           <img
//             src={avatarSrc}
//             style={{
//              width: 128,
//              height: 128,
//              minWidth: 128,
//              minHeight: 128,
//              borderRadius: 64,
//              display: 'block',
//              margin: '1rem auto 1rem',
//            }}
//             className="rounded-circle mb-4 mt-4"
//             alt="User avatar"

//           />

//           <h4 
//           style={{
//             fontFamily: 'Poppins, sans-serif',
//             fontWeight: 600,
//             fontSize: '22px',
//             lineHeight: '150%',
//             letterSpacing: '5%',
//             textAlign: 'center',
//             margin: '0 0 0.25rem',
//           }}
//           className="fw-bold mb-1">{user.firstName} {user.lastName}</h4>
//           <p 
//            style={{
//               fontFamily: 'Poppins, sans-serif',
//               fontWeight: 600,
//               fontSize: '22px',
//               lineHeight: '150%',
//               letterSpacing: '5%',
//               textAlign: 'center',
//               margin: '0 0 0.5rem',
//               color: '#0A0A0A',
//             }}
//           className="text-muted mb-1">@{user.username}</p>
//           {user.tagline && 
//           <p 
//           style={{
//           fontFamily: 'Poppins, sans-serif',
//           fontWeight: 600,
//           fontSize: '16px',
//           lineHeight: '150%',
//           letterSpacing: '0px',
//           textAlign: 'center',
//           margin: '0 0 1rem',
//           color: '#5C6B3C',
//         }}
//           className="text-muted mb-2">{user.tagline}</p>}
//           {user.bio && (
//             <p 
//             style={{
//             fontFamily: 'DM Sans, sans-serif',
//             fontWeight: 400,
//             fontSize: '16px',
//             lineHeight: '150%',
//             letterSpacing: '0px',
//             textAlign: 'center',
//             maxWidth: 520,
//             margin: '0 auto 1.5rem',
//             color: '#0A0A0A',
//           }}
//             className="mx-auto">{user.bio}</p>
//           )}

//           {/* <MDBBtn
//             size="sm" outline color="dark"
//             className="rounded-pill"
//             onClick={() => navigate("/profile/edit")}
//           >
//             Edit
//           </MDBBtn> */}
//           <MDBBtn
//             size="sm"
//             onClick={() => navigate("/profile/edit")}
//             style={{
//               border: '2px solid #D6B100',
//               background: 'transparent',
//               color: '#D6B100',
//               borderRadius: '0.5rem',
//               fontFamily: 'Poppins, sans-serif',
//               fontWeight: 600,
//               fontSize: '16px',
//               padding: '0.5rem 1rem',
//               display: 'block',
//               margin: '0 auto 1.5rem',
//               textTransform: 'none',
//             }}
//           >
//             Edit
//           </MDBBtn>

//           {/* follower counts */}
//           <div className="d-flex justify-content-center gap-3 mt-3">
//             <span role="button" onClick={openFollowers} className="fw-bold text-decoration-underline"
//             style={{
//                     fontFamily: 'Poppins, sans-serif',
//                     fontWeight: 600,
//                     fontSize: '16px',
//                     lineHeight: '150%',
//                     letterSpacing: '0px',
//                     color: '#0A0A0A',
//                     cursor: 'pointer',
//                   }}
//                >
//      {followersCnt} followers
//             </span>
//             <span role="button" onClick={openFollowing} className="fw-bold text-decoration-underline"
//              style={{
//               fontFamily: 'Poppins, sans-serif',
//               fontWeight: 600,
//               fontSize: '16px',
//               lineHeight: '150%',
//               letterSpacing: '0px',
//               color: '#0A0A0A',
//               cursor: 'pointer',
//             }}
//             >
//               {followingCnt} following
//             </span>
//           </div>
//         </div>

//         {/* ────── Analytics ────── */}
//         <div className="d-flex justify-content-between align-items-center mb-2">
//           <h6 className="mb-3 px-2 px-md-0"
//           style={{
//              fontFamily: 'Poppins, sans-serif',
//              fontWeight: 600,
//              fontSize: '22px',
//              lineHeight: '150%',
//              letterSpacing: '0px',
//              color: '#0A0A0A',
//              margin: 0,
//            }}
//             >Analytics</h6>
//         </div>

//         <MDBRow className="gy-3 mb-4">
//           <MDBCol size="6"  md="3"><StatCard label="Views"      value={stats.views.toLocaleString()}        /></MDBCol>
//           <MDBCol size="6"  md="3"><StatCard label="Bookmarks"  value={stats.bookmarks.toLocaleString()}   /></MDBCol>
//           <MDBCol size="6"  md="3"><StatCard label="Likes"      value={stats.likes.toLocaleString()}      /></MDBCol>
//           <MDBCol size="6"  md="3"><StatCard label="Comments"   value={stats.comments.toLocaleString()}    /></MDBCol>
//         </MDBRow>
  
//         {/* <div className="text-center mb-4">
//           <Link to="/analytics" className="small fw-semibold text-decoration-underline">View More</Link>
//         </div> */}

//         {/* ────── Articles grid ────── */}
//         <div className="mb-3">
//           <h6 className="fw-bold mb-0"
//           style={{
//             fontFamily: 'Poppins, sans-serif',
//             fontWeight: 600,
//             fontSize: '22px',
//             lineHeight: '150%',
//             color: '#0A0A0A',
//             margin: 0,
//           }}
//           >Articles</h6>
//            </div>
//           <div className="d-flex flex-row flex-wrap gap-3 mb-5 px-2 px-md-0">
//             <MDBBtn
//               size="sm"
//               color={showMine ? "success" : "light"}
//               className="rounded-pill me-2"
//               onClick={() => setActiveTab("mine")}
//               style={{
//                background: showMine ? '#5C6B3C' : 'transparent',
//                color: showMine ? '#FFFFFF' : '#0A0A0A',
//                border: `2px solid #5C6B3C`,
//                borderRadius: '0.5rem',
//                fontFamily: 'Poppins, sans-serif',
//                fontWeight: 600,
//                fontSize: '16px',
//                padding: '0.5rem 1rem',
//                marginRight: '0.5rem',
//                textTransform: 'none',
//              }}
//             >
//               My Articles
//             </MDBBtn>
//             <MDBBtn
//               size="sm"
//               color={!showMine ? "success" : "light"}
//               className="rounded-pill"
//               onClick={() => setActiveTab("bookmarked")}
//              style={{
//                background: !showMine ? '#5C6B3C' : 'transparent',
//                color: !showMine ? '#FFFFFF' : '#0A0A0A',
//                border: `2px solid #5C6B3C`,
//                borderRadius: '0.5rem',
//                fontFamily: 'Poppins, sans-serif',
//                fontWeight: 600,
//                fontSize: '16px',
//                padding: '0.5rem 1rem',
//                textTransform: 'none',
//              }}

//             >
//               Bookmarked
//             </MDBBtn>
//           </div>
       

//         <MDBRow className="g-5">
//           {(showMine ? combinedMine  : bookmarked).map(a => (
//             <MDBCol key={a.id} xs="6" md="4">
//               <ArticleCard
//                 article={a}
//                 author={showMine ? userDoc : authors[a.authorId]}
//                 isOwner={showMine}
//                 isDraft={!!a.isDraft}
//                 // onEdit={handleEdit}
//                 onEdit={a.isDraft ? handleEditDraft : handleEditPublished}   
//                 onDelete={handleDelete}
//               />
//             </MDBCol>
//           ))}
//         </MDBRow>

//         {/* <div className="text-center mt-4">
//           <Link to="/articles" className="small fw-semibold text-decoration-underline">View More</Link>
//         </div> */}

//         {/* ────── Followers / Following overlays ────── */}
//         <FollowersOverlay
//           isOpen={showFollowers}
//           onClose={() => setShowFollowers(false)}
//           followers={followersList}
//           onToggleFollow={(uid, shouldFollow) => handleToggleFollow(uid, shouldFollow)}
//           currentFollowingIds={followingIds}
//           currentSentIds={sentReqIds}
//           onSendRequest={handleSendRequest}
//           onCancelRequest={handleCancelRequest}
//         />
//         <FollowingOverlay
//           isOpen={showFollowing}
//           onClose={() => setShowFollowing(false)}
//           following={followingList}
//           onRemove={uid => handleToggleFollow(uid, false)}
//           onToggleFollow={(uid, shouldFollow) => handleToggleFollow(uid, shouldFollow)}
//           currentFollowingIds={followingIds}
//           currentSentIds={sentReqIds}
//           onSendRequest={handleSendRequest}
//           onCancelRequest={handleCancelRequest}
//         />
//       </div>
//     </MDBContainer>
   
//   );
// }


// correct above before cost cutting


// // src/components/Pages/UserDashboardProfilePage.jsx
// import React, { useState, useEffect, useMemo } from "react";
// import {
//   MDBContainer,
//   MDBRow,
//   MDBCol,
//   MDBCard,
//   MDBCardBody,
//   MDBBtn,
// } from "mdb-react-ui-kit";
// import { useNavigate } from "react-router-dom";
// import { doc, getDoc } from "firebase/firestore";

// import { useAuth } from "../../context/AuthContext";
// import { useCurrentUserDoc } from "../../configs/hooks";
// import { useUserDoc } from "../../configs/user";
// import {
//   deleteArticle,
//   useMyDrafts,
//   deleteDraft,
//   useMyRtdbArticles,
//   useBookmarkedArticles,
// } from "../../configs/useArticles";
// import { db } from "../../configs/firebase";

// import ArticleCard from "../cards/ArticleCard";
// import {
//   streamFollowers,
//   streamFollowing,
//   streamFollowersCount,
//   streamFollowingCount,
//   toggleFollow,
//   sendFollowRequest,
//   cancelFollowRequest,
//   streamRequestsSent,
// } from "../../configs/follow";
// import FollowersOverlay from "../Layout/FollowersOverlay";
// import FollowingOverlay from "../Layout/FollowingOverlay";

// /* ---------- tiny presentational stat card ---------- */
// const StatCard = ({ label, value, change }) => (
//   <MDBCard
//     style={{
//       borderRadius: "0.75rem",
//       background: "#F1F1E6",
//       boxShadow: "none",
//       border: "none",
//     }}
//   >
//     <MDBCardBody className="text-center py-4">
//       <div
//         style={{
//           fontFamily: "Poppins, sans-serif",
//           fontWeight: 600,
//           fontSize: "16px",
//           lineHeight: "150%",
//           color: "#0A0A0A",
//           marginBottom: "0.5rem",
//         }}
//       >
//         {label}
//       </div>

//       <div
//         style={{
//           fontFamily: "Poppins, sans-serif",
//           fontWeight: 600,
//           fontSize: "28px",
//           lineHeight: "150%",
//           color: "#0A0A0A",
//           marginBottom: change != null ? "0.75rem" : 0,
//         }}
//       >
//         {value}
//       </div>
//     </MDBCardBody>
//   </MDBCard>
// );

// export default function UserDashboardProfilePage() {
//   /* ─── auth & profile docs ─── */
//   const { currentUser } = useAuth();
//   const myUid = currentUser.uid;

//   const { doc: user, loading: userLoading } = useCurrentUserDoc();
//   const { userDoc } = useUserDoc();
//   const navigate = useNavigate();

//   /* ─── tabs & articles ─── */
//   const [activeTab, setActiveTab] = useState("mine");
//   const showMine = activeTab === "mine";

//   /*
//    * Phase 2 cost improvement:
//    * Old flow:
//    *   const articles = useArticles(100);
//    *   const mine = articles.filter(...)
//    *   const bookmarked = articles.filter(...)
//    *
//    * New flow:
//    *   Fetch only current user's articles.
//    *   Fetch only current user's bookmarked articles.
//    *
//    * This avoids downloading global article data on the profile page.
//    */
//   const mine = useMyRtdbArticles(myUid, 50);
//   const bookmarked = useBookmarkedArticles(myUid, 50);
//   const drafts = useMyDrafts(myUid, 100);

//   const combinedMine = useMemo(() => {
//     const draftsNormalized = drafts.map((draft) => ({
//       ...draft,
//       id: draft.id,
//       isDraft: true,
//     }));

//     const joined = [...draftsNormalized, ...mine];

//     return [...joined].sort(
//       (a, b) => (b.createdAt || 0) - (a.createdAt || 0)
//     );
//   }, [drafts, mine]);

//   /* ─── analytics totals ─── */
//   const [stats, setStats] = useState({
//     views: 0,
//     bookmarks: 0,
//     likes: 0,
//     comments: 0,
//   });

//   useEffect(() => {
//     let views = 0;
//     let likes = 0;
//     let comments = 0;

//     mine.forEach((article) => {
//       views += article.views || 0;
//       likes += article.likesCount || 0;
//       comments += article.commentsCount || 0;
//     });

//     const bookmarksCnt = bookmarked.length;

//     setStats({
//       views,
//       bookmarks: bookmarksCnt,
//       likes,
//       comments,
//     });
//   }, [mine, bookmarked]);

//   /* ─── author lookup for bookmarked tab ─── */
//   const [authors, setAuthors] = useState({});

//   useEffect(() => {
//     let alive = true;

//     const fetchAuthors = async (uids) => {
//       const pairs = await Promise.all(
//         uids.map(async (uid) => {
//           const snap = await getDoc(doc(db, "users", uid));
//           return [uid, snap.exists() ? { uid, ...snap.data() } : null];
//         })
//       );

//       if (alive) {
//         setAuthors((prev) => ({
//           ...prev,
//           ...Object.fromEntries(pairs),
//         }));
//       }
//     };

//     const missing = [
//       ...new Set(
//         bookmarked
//           .map((article) => article.authorId)
//           .filter((id) => id && !authors[id])
//       ),
//     ];

//     if (missing.length) {
//       fetchAuthors(missing);
//     }

//     return () => {
//       alive = false;
//     };
//   }, [bookmarked, authors]);

//   /* ─── follower / following live state ─── */
//   const [followersCnt, setFollowersCnt] = useState(0);
//   const [followingCnt, setFollowingCnt] = useState(0);
//   const [followersIds, setFollowersIds] = useState([]);
//   const [followingIds, setFollowingIds] = useState([]);
//   const [sentReqIds, setSentReqIds] = useState([]);

//   useEffect(() => {
//     const u1 = streamFollowersCount(myUid, setFollowersCnt);
//     const u2 = streamFollowingCount(myUid, setFollowingCnt);
//     const u3 = streamFollowers(myUid, setFollowersIds);
//     const u4 = streamFollowing(myUid, setFollowingIds);
//     const u5 = streamRequestsSent(myUid, setSentReqIds);

//     return () => {
//       u1();
//       u2();
//       u3();
//       u4();
//       u5();
//     };
//   }, [myUid]);

//   /* ─── overlays + hydrated lists ─── */
//   const [showFollowers, setShowFollowers] = useState(false);
//   const [showFollowing, setShowFollowing] = useState(false);
//   const [followersList, setFollowersList] = useState([]);
//   const [followingList, setFollowingList] = useState([]);

//   const hydrate = async (ids, setter) => {
//     if (!ids || !ids.length) {
//       setter([]);
//       return;
//     }

//     const results = await Promise.allSettled(
//       ids.map(async (id) => {
//         try {
//           const snap = await getDoc(doc(db, "users", id));

//           if (!snap.exists()) {
//             return {
//               uid: id,
//               name: "Member",
//               username: id.slice(0, 8),
//               avatar: "https://placehold.co/48x48",
//               isFollowing: followingIds.includes(id),
//             };
//           }

//           const data = snap.data() || {};
//           const name =
//             data.displayName ||
//             `${data.firstName || ""} ${data.lastName || ""}`.trim() ||
//             "Member";

//           const username =
//             data.username ||
//             (data.email ? data.email.split("@")[0] : id.slice(0, 8));

//           return {
//             uid: id,
//             name,
//             username,
//             avatar: data.avatarUrl || "https://placehold.co/48x48",
//             isFollowing: followingIds.includes(id),
//           };
//         } catch (err) {
//           return {
//             uid: id,
//             name: "Member",
//             username: id.slice(0, 8),
//             avatar: "https://placehold.co/48x48",
//             isFollowing: followingIds.includes(id),
//           };
//         }
//       })
//     );

//     const docs = results
//       .map((result) => (result.status === "fulfilled" ? result.value : null))
//       .filter(Boolean);

//     setter(docs);
//   };

//   useEffect(() => {
//     if (showFollowers) {
//       hydrate(followersIds, setFollowersList);
//     }
//   }, [showFollowers, followersIds]); // eslint-disable-line react-hooks/exhaustive-deps

//   useEffect(() => {
//     if (showFollowing) {
//       hydrate(followingIds, setFollowingList);
//     }
//   }, [showFollowing, followingIds]); // eslint-disable-line react-hooks/exhaustive-deps

//   const openFollowers = async () => {
//     await hydrate(followersIds, setFollowersList);
//     setShowFollowers(true);
//   };

//   const openFollowing = async () => {
//     await hydrate(followingIds, setFollowingList);
//     setShowFollowing(true);
//   };

//   /* ─── follow / unfollow actions ─── */
//   const handleToggleFollow = async (uid, shouldFollow) => {
//     try {
//       await toggleFollow(uid, myUid);
//     } catch (e) {
//       console.error(e);
//     }
//   };

//   const handleSendRequest = async (uid) => {
//     try {
//       await sendFollowRequest(uid, myUid);
//     } catch (e) {
//       console.error(e);
//     }
//   };

//   const handleCancelRequest = async (uid) => {
//     try {
//       await cancelFollowRequest(uid, myUid);
//     } catch (e) {
//       console.error(e);
//     }
//   };

//   /* ─── guards ─── */
//   if (userLoading) {
//     return <p className="text-center py-5">Loading…</p>;
//   }

//   if (!user) return null;

//   /* ─── helpers ─── */
//   const joined = (user.registeredAt ?? user.createdAt)?.seconds
//     ? new Date(
//         (user.registeredAt ?? user.createdAt).seconds * 1000
//       ).getFullYear()
//     : "—";

//   const avatarSrc = userDoc?.avatarUrl || currentUser?.photoURL;

//   const handleEditPublished = (article) => {
//     navigate(`/write/edit/${article.id}`);
//   };

//   const handleEditDraft = (draft) => {
//     navigate(`/write/edit/${draft.id}?draft=1`);
//   };

//   const handleDelete = (item) => {
//     if (item.isDraft) return deleteDraft(myUid, item.id);
//     return deleteArticle(item.id);
//   };

//   /* ─── render ─── */
//   return (
//     <MDBContainer
//       fluid="lg"
//       className="py-4 px-2 px-md-4"
//       style={{ backgroundColor: "#F1F1E6" }}
//     >
//       <div
//         className="p-3 p-md-4"
//         style={{
//           maxWidth: 860,
//           background: "#FFFFFF",
//           margin: "0 auto",
//           borderRadius: "3rem",
//         }}
//       >
//         {/* ────── Header ────── */}
//         <div className="text-center mb-4">
//           <p
//             className="text-muted mb-2"
//             style={{
//               fontFamily: "Poppins, sans-serif",
//               fontWeight: 600,
//               fontSize: "16px",
//               lineHeight: "150%",
//               letterSpacing: "0px",
//               textAlign: "center",
//               color: "#5C6B3C",
//               marginBottom: "1rem",
//             }}
//           >
//             Member since&nbsp;{joined}
//           </p>

//           <img
//             src={avatarSrc}
//             style={{
//               width: 128,
//               height: 128,
//               minWidth: 128,
//               minHeight: 128,
//               borderRadius: 64,
//               display: "block",
//               margin: "1rem auto 1rem",
//             }}
//             className="rounded-circle mb-4 mt-4"
//             alt="User avatar"
//           />

//           <h4
//             style={{
//               fontFamily: "Poppins, sans-serif",
//               fontWeight: 600,
//               fontSize: "22px",
//               lineHeight: "150%",
//               letterSpacing: "5%",
//               textAlign: "center",
//               margin: "0 0 0.25rem",
//             }}
//             className="fw-bold mb-1"
//           >
//             {user.firstName} {user.lastName}
//           </h4>

//           <p
//             style={{
//               fontFamily: "Poppins, sans-serif",
//               fontWeight: 600,
//               fontSize: "22px",
//               lineHeight: "150%",
//               letterSpacing: "5%",
//               textAlign: "center",
//               margin: "0 0 0.5rem",
//               color: "#0A0A0A",
//             }}
//             className="text-muted mb-1"
//           >
//             @{user.username}
//           </p>

//           {user.tagline && (
//             <p
//               style={{
//                 fontFamily: "Poppins, sans-serif",
//                 fontWeight: 600,
//                 fontSize: "16px",
//                 lineHeight: "150%",
//                 letterSpacing: "0px",
//                 textAlign: "center",
//                 margin: "0 0 1rem",
//                 color: "#5C6B3C",
//               }}
//               className="text-muted mb-2"
//             >
//               {user.tagline}
//             </p>
//           )}

//           {user.bio && (
//             <p
//               style={{
//                 fontFamily: "DM Sans, sans-serif",
//                 fontWeight: 400,
//                 fontSize: "16px",
//                 lineHeight: "150%",
//                 letterSpacing: "0px",
//                 textAlign: "center",
//                 maxWidth: 520,
//                 margin: "0 auto 1.5rem",
//                 color: "#0A0A0A",
//               }}
//               className="mx-auto"
//             >
//               {user.bio}
//             </p>
//           )}

//           <MDBBtn
//             size="sm"
//             onClick={() => navigate("/profile/edit")}
//             style={{
//               border: "2px solid #D6B100",
//               background: "transparent",
//               color: "#D6B100",
//               borderRadius: "0.5rem",
//               fontFamily: "Poppins, sans-serif",
//               fontWeight: 600,
//               fontSize: "16px",
//               padding: "0.5rem 1rem",
//               display: "block",
//               margin: "0 auto 1.5rem",
//               textTransform: "none",
//             }}
//           >
//             Edit
//           </MDBBtn>

//           {/* follower counts */}
//           <div className="d-flex justify-content-center gap-3 mt-3">
//             <span
//               role="button"
//               onClick={openFollowers}
//               className="fw-bold text-decoration-underline"
//               style={{
//                 fontFamily: "Poppins, sans-serif",
//                 fontWeight: 600,
//                 fontSize: "16px",
//                 lineHeight: "150%",
//                 letterSpacing: "0px",
//                 color: "#0A0A0A",
//                 cursor: "pointer",
//               }}
//             >
//               {followersCnt} followers
//             </span>

//             <span
//               role="button"
//               onClick={openFollowing}
//               className="fw-bold text-decoration-underline"
//               style={{
//                 fontFamily: "Poppins, sans-serif",
//                 fontWeight: 600,
//                 fontSize: "16px",
//                 lineHeight: "150%",
//                 letterSpacing: "0px",
//                 color: "#0A0A0A",
//                 cursor: "pointer",
//               }}
//             >
//               {followingCnt} following
//             </span>
//           </div>
//         </div>

//         {/* ────── Analytics ────── */}
//         <div className="d-flex justify-content-between align-items-center mb-2">
//           <h6
//             className="mb-3 px-2 px-md-0"
//             style={{
//               fontFamily: "Poppins, sans-serif",
//               fontWeight: 600,
//               fontSize: "22px",
//               lineHeight: "150%",
//               letterSpacing: "0px",
//               color: "#0A0A0A",
//               margin: 0,
//             }}
//           >
//             Analytics
//           </h6>
//         </div>

//         <MDBRow className="gy-3 mb-4">
//           <MDBCol size="6" md="3">
//             <StatCard label="Views" value={stats.views.toLocaleString()} />
//           </MDBCol>

//           <MDBCol size="6" md="3">
//             <StatCard
//               label="Bookmarks"
//               value={stats.bookmarks.toLocaleString()}
//             />
//           </MDBCol>

//           <MDBCol size="6" md="3">
//             <StatCard label="Likes" value={stats.likes.toLocaleString()} />
//           </MDBCol>

//           <MDBCol size="6" md="3">
//             <StatCard
//               label="Comments"
//               value={stats.comments.toLocaleString()}
//             />
//           </MDBCol>
//         </MDBRow>

//         {/* ────── Articles grid ────── */}
//         <div className="mb-3">
//           <h6
//             className="fw-bold mb-0"
//             style={{
//               fontFamily: "Poppins, sans-serif",
//               fontWeight: 600,
//               fontSize: "22px",
//               lineHeight: "150%",
//               color: "#0A0A0A",
//               margin: 0,
//             }}
//           >
//             Articles
//           </h6>
//         </div>

//         <div className="d-flex flex-row flex-wrap gap-3 mb-5 px-2 px-md-0">
//           <MDBBtn
//             size="sm"
//             color={showMine ? "success" : "light"}
//             className="rounded-pill me-2"
//             onClick={() => setActiveTab("mine")}
//             style={{
//               background: showMine ? "#5C6B3C" : "transparent",
//               color: showMine ? "#FFFFFF" : "#0A0A0A",
//               border: "2px solid #5C6B3C",
//               borderRadius: "0.5rem",
//               fontFamily: "Poppins, sans-serif",
//               fontWeight: 600,
//               fontSize: "16px",
//               padding: "0.5rem 1rem",
//               marginRight: "0.5rem",
//               textTransform: "none",
//             }}
//           >
//             My Articles
//           </MDBBtn>

//           <MDBBtn
//             size="sm"
//             color={!showMine ? "success" : "light"}
//             className="rounded-pill"
//             onClick={() => setActiveTab("bookmarked")}
//             style={{
//               background: !showMine ? "#5C6B3C" : "transparent",
//               color: !showMine ? "#FFFFFF" : "#0A0A0A",
//               border: "2px solid #5C6B3C",
//               borderRadius: "0.5rem",
//               fontFamily: "Poppins, sans-serif",
//               fontWeight: 600,
//               fontSize: "16px",
//               padding: "0.5rem 1rem",
//               textTransform: "none",
//             }}
//           >
//             Bookmarked
//           </MDBBtn>
//         </div>

//         <MDBRow className="g-5">
//           {(showMine ? combinedMine : bookmarked).map((article) => (
//             <MDBCol key={article.id} xs="6" md="4">
//               <ArticleCard
//                 article={article}
//                 author={showMine ? userDoc : authors[article.authorId]}
//                 isOwner={showMine}
//                 isDraft={!!article.isDraft}
//                 onEdit={article.isDraft ? handleEditDraft : handleEditPublished}
//                 onDelete={handleDelete}
//               />
//             </MDBCol>
//           ))}
//         </MDBRow>

//         {/* ────── Followers / Following overlays ────── */}
//         <FollowersOverlay
//           isOpen={showFollowers}
//           onClose={() => setShowFollowers(false)}
//           followers={followersList}
//           onToggleFollow={(uid, shouldFollow) =>
//             handleToggleFollow(uid, shouldFollow)
//           }
//           currentFollowingIds={followingIds}
//           currentSentIds={sentReqIds}
//           onSendRequest={handleSendRequest}
//           onCancelRequest={handleCancelRequest}
//         />

//         <FollowingOverlay
//           isOpen={showFollowing}
//           onClose={() => setShowFollowing(false)}
//           following={followingList}
//           onRemove={(uid) => handleToggleFollow(uid, false)}
//           onToggleFollow={(uid, shouldFollow) =>
//             handleToggleFollow(uid, shouldFollow)
//           }
//           currentFollowingIds={followingIds}
//           currentSentIds={sentReqIds}
//           onSendRequest={handleSendRequest}
//           onCancelRequest={handleCancelRequest}
//         />
//       </div>
//     </MDBContainer>
//   );
// }


// src/components/Pages/UserDashboardProfilePage.jsx
import React, { useState, useEffect, useMemo } from "react";
import {
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBCard,
  MDBCardBody,
  MDBBtn,
} from "mdb-react-ui-kit";
import { useNavigate } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";

import { useAuth } from "../../context/AuthContext";
import { useCurrentUserDoc } from "../../configs/hooks";
import { useUserDoc } from "../../configs/user";
import {
  deleteArticle,
  useMyDrafts,
  deleteDraft,
  useMyRtdbArticles,
  useBookmarkedArticles,
} from "../../configs/useArticles";
import { db } from "../../configs/firebase";

import ArticleCard from "../cards/ArticleCard";
import {
  streamFollowers,
  streamFollowing,
  streamFollowersCount,
  streamFollowingCount,
  toggleFollow,
  sendFollowRequest,
  cancelFollowRequest,
  streamRequestsSent,
} from "../../configs/follow";
import FollowersOverlay from "../Layout/FollowersOverlay";
import FollowingOverlay from "../Layout/FollowingOverlay";

/* ---------- tiny presentational stat card ---------- */
const StatCard = ({ label, value, change }) => (
  <MDBCard
    style={{
      borderRadius: "0.75rem",
      background: "#F1F1E6",
      boxShadow: "none",
      border: "none",
    }}
  >
    <MDBCardBody className="text-center py-4">
      <div
        style={{
          fontFamily: "Poppins, sans-serif",
          fontWeight: 600,
          fontSize: "16px",
          lineHeight: "150%",
          color: "#0A0A0A",
          marginBottom: "0.5rem",
        }}
      >
        {label}
      </div>

      <div
        style={{
          fontFamily: "Poppins, sans-serif",
          fontWeight: 600,
          fontSize: "28px",
          lineHeight: "150%",
          color: "#0A0A0A",
          marginBottom: change != null ? "0.75rem" : 0,
        }}
      >
        {value}
      </div>
    </MDBCardBody>
  </MDBCard>
);

export default function UserDashboardProfilePage() {
  /* ─── auth & profile docs ─── */
  const { currentUser } = useAuth();
  const myUid = currentUser.uid;

  const { doc: user, loading: userLoading } = useCurrentUserDoc();
  const { userDoc } = useUserDoc();
  const navigate = useNavigate();

  /* ─── tabs & articles ─── */
  const [activeTab, setActiveTab] = useState("mine");
  const showMine = activeTab === "mine";

  /*
   * Cost-safe UI update:
   * We are using one-time article reads instead of realtime article lists.
   * So after delete succeeds, we hide the deleted card locally.
   */
  const [deletedIds, setDeletedIds] = useState([]);

  /*
   * Phase 2 cost improvement:
   * Fetch only current user's articles and current user's bookmarks.
   * Avoid loading global article data on profile page.
   */
  const rawMine = useMyRtdbArticles(myUid, 50);
  const rawBookmarked = useBookmarkedArticles(myUid, 50);
  const rawDrafts = useMyDrafts(myUid, 100);

  const mine = useMemo(
    () => rawMine.filter((article) => !deletedIds.includes(article.id)),
    [rawMine, deletedIds]
  );

  const bookmarked = useMemo(
    () =>
      rawBookmarked.filter(
        (article) => !deletedIds.includes(article.id)
      ),
    [rawBookmarked, deletedIds]
  );

  const drafts = useMemo(
    () => rawDrafts.filter((draft) => !deletedIds.includes(draft.id)),
    [rawDrafts, deletedIds]
  );

  const combinedMine = useMemo(() => {
    const draftsNormalized = drafts.map((draft) => ({
      ...draft,
      id: draft.id,
      isDraft: true,
    }));

    const joined = [...draftsNormalized, ...mine];

    return [...joined].sort(
      (a, b) => (b.createdAt || 0) - (a.createdAt || 0)
    );
  }, [drafts, mine]);

  /* ─── analytics totals ─── */
  const [stats, setStats] = useState({
    views: 0,
    bookmarks: 0,
    likes: 0,
    comments: 0,
  });

  useEffect(() => {
    let views = 0;
    let likes = 0;
    let comments = 0;

    mine.forEach((article) => {
      views += article.views || 0;
      likes += article.likesCount || 0;
      comments += article.commentsCount || 0;
    });

    const bookmarksCnt = bookmarked.length;

    setStats({
      views,
      bookmarks: bookmarksCnt,
      likes,
      comments,
    });
  }, [mine, bookmarked]);

  /* ─── author lookup for bookmarked tab ─── */
  const [authors, setAuthors] = useState({});

  useEffect(() => {
    let alive = true;

    const fetchAuthors = async (uids) => {
      const pairs = await Promise.all(
        uids.map(async (uid) => {
          const snap = await getDoc(doc(db, "users", uid));
          return [uid, snap.exists() ? { uid, ...snap.data() } : null];
        })
      );

      if (alive) {
        setAuthors((prev) => ({
          ...prev,
          ...Object.fromEntries(pairs),
        }));
      }
    };

    const missing = [
      ...new Set(
        bookmarked
          .map((article) => article.authorId)
          .filter((id) => id && !authors[id])
      ),
    ];

    if (missing.length) {
      fetchAuthors(missing);
    }

    return () => {
      alive = false;
    };
  }, [bookmarked, authors]);

  /* ─── follower / following live state ─── */
  const [followersCnt, setFollowersCnt] = useState(0);
  const [followingCnt, setFollowingCnt] = useState(0);
  const [followersIds, setFollowersIds] = useState([]);
  const [followingIds, setFollowingIds] = useState([]);
  const [sentReqIds, setSentReqIds] = useState([]);

  useEffect(() => {
    const u1 = streamFollowersCount(myUid, setFollowersCnt);
    const u2 = streamFollowingCount(myUid, setFollowingCnt);
    const u3 = streamFollowers(myUid, setFollowersIds);
    const u4 = streamFollowing(myUid, setFollowingIds);
    const u5 = streamRequestsSent(myUid, setSentReqIds);

    return () => {
      u1();
      u2();
      u3();
      u4();
      u5();
    };
  }, [myUid]);

  /* ─── overlays + hydrated lists ─── */
  const [showFollowers, setShowFollowers] = useState(false);
  const [showFollowing, setShowFollowing] = useState(false);
  const [followersList, setFollowersList] = useState([]);
  const [followingList, setFollowingList] = useState([]);

  const hydrate = async (ids, setter) => {
    if (!ids || !ids.length) {
      setter([]);
      return;
    }

    const results = await Promise.allSettled(
      ids.map(async (id) => {
        try {
          const snap = await getDoc(doc(db, "users", id));

          if (!snap.exists()) {
            return {
              uid: id,
              name: "Member",
              username: id.slice(0, 8),
              avatar: "https://placehold.co/48x48",
              isFollowing: followingIds.includes(id),
            };
          }

          const data = snap.data() || {};
          const name =
            data.displayName ||
            `${data.firstName || ""} ${data.lastName || ""}`.trim() ||
            "Member";

          const username =
            data.username ||
            (data.email ? data.email.split("@")[0] : id.slice(0, 8));

          return {
            uid: id,
            name,
            username,
            avatar: data.avatarUrl || "https://placehold.co/48x48",
            isFollowing: followingIds.includes(id),
          };
        } catch (err) {
          return {
            uid: id,
            name: "Member",
            username: id.slice(0, 8),
            avatar: "https://placehold.co/48x48",
            isFollowing: followingIds.includes(id),
          };
        }
      })
    );

    const docs = results
      .map((result) => (result.status === "fulfilled" ? result.value : null))
      .filter(Boolean);

    setter(docs);
  };

  useEffect(() => {
    if (showFollowers) {
      hydrate(followersIds, setFollowersList);
    }
  }, [showFollowers, followersIds]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (showFollowing) {
      hydrate(followingIds, setFollowingList);
    }
  }, [showFollowing, followingIds]); // eslint-disable-line react-hooks/exhaustive-deps

  const openFollowers = async () => {
    await hydrate(followersIds, setFollowersList);
    setShowFollowers(true);
  };

  const openFollowing = async () => {
    await hydrate(followingIds, setFollowingList);
    setShowFollowing(true);
  };

  /* ─── follow / unfollow actions ─── */
  const handleToggleFollow = async (uid, shouldFollow) => {
    try {
      await toggleFollow(uid, myUid);
    } catch (e) {
      console.error(e);
    }
  };

  const handleSendRequest = async (uid) => {
    try {
      await sendFollowRequest(uid, myUid);
    } catch (e) {
      console.error(e);
    }
  };

  const handleCancelRequest = async (uid) => {
    try {
      await cancelFollowRequest(uid, myUid);
    } catch (e) {
      console.error(e);
    }
  };

  /* ─── guards ─── */
  if (userLoading) {
    return <p className="text-center py-5">Loading…</p>;
  }

  if (!user) return null;

  /* ─── helpers ─── */
  const joined = (user.registeredAt ?? user.createdAt)?.seconds
    ? new Date(
        (user.registeredAt ?? user.createdAt).seconds * 1000
      ).getFullYear()
    : "—";

  const avatarSrc = userDoc?.avatarUrl || currentUser?.photoURL;

  const handleEditPublished = (article) => {
    navigate(`/write/edit/${article.id}`);
  };

  const handleEditDraft = (draft) => {
    navigate(`/write/edit/${draft.id}?draft=1`);
  };

  const handleDelete = async (item) => {
    const ok = window.confirm(
      item.isDraft
        ? "Delete this draft?"
        : "Delete this article permanently?"
    );

    if (!ok) return;

    try {
      if (item.isDraft) {
        await deleteDraft(myUid, item.id);
      } else {
        await deleteArticle(item.id);
      }

      // Hide immediately from UI without restoring expensive realtime list.
      setDeletedIds((prev) =>
        prev.includes(item.id) ? prev : [...prev, item.id]
      );
    } catch (err) {
      console.error("Delete failed:", err);
      alert("Failed to delete. Please try again.");
    }
  };

  /* ─── render ─── */
  return (
    <MDBContainer
      fluid="lg"
      className="py-4 px-2 px-md-4"
      style={{ backgroundColor: "#F1F1E6" }}
    >
      <div
        className="p-3 p-md-4"
        style={{
          maxWidth: 860,
          background: "#FFFFFF",
          margin: "0 auto",
          borderRadius: "3rem",
        }}
      >
        {/* ────── Header ────── */}
        <div className="text-center mb-4">
          <p
            className="text-muted mb-2"
            style={{
              fontFamily: "Poppins, sans-serif",
              fontWeight: 600,
              fontSize: "16px",
              lineHeight: "150%",
              letterSpacing: "0px",
              textAlign: "center",
              color: "#5C6B3C",
              marginBottom: "1rem",
            }}
          >
            Member since&nbsp;{joined}
          </p>

          <img
            src={avatarSrc}
            style={{
              width: 128,
              height: 128,
              minWidth: 128,
              minHeight: 128,
              borderRadius: 64,
              display: "block",
              margin: "1rem auto 1rem",
            }}
            className="rounded-circle mb-4 mt-4"
            alt="User avatar"
          />

          <h4
            style={{
              fontFamily: "Poppins, sans-serif",
              fontWeight: 600,
              fontSize: "22px",
              lineHeight: "150%",
              letterSpacing: "5%",
              textAlign: "center",
              margin: "0 0 0.25rem",
            }}
            className="fw-bold mb-1"
          >
            {user.firstName} {user.lastName}
          </h4>

          <p
            style={{
              fontFamily: "Poppins, sans-serif",
              fontWeight: 600,
              fontSize: "22px",
              lineHeight: "150%",
              letterSpacing: "5%",
              textAlign: "center",
              margin: "0 0 0.5rem",
              color: "#0A0A0A",
            }}
            className="text-muted mb-1"
          >
            @{user.username}
          </p>

          {user.tagline && (
            <p
              style={{
                fontFamily: "Poppins, sans-serif",
                fontWeight: 600,
                fontSize: "16px",
                lineHeight: "150%",
                letterSpacing: "0px",
                textAlign: "center",
                margin: "0 0 1rem",
                color: "#5C6B3C",
              }}
              className="text-muted mb-2"
            >
              {user.tagline}
            </p>
          )}

          {user.bio && (
            <p
              style={{
                fontFamily: "DM Sans, sans-serif",
                fontWeight: 400,
                fontSize: "16px",
                lineHeight: "150%",
                letterSpacing: "0px",
                textAlign: "center",
                maxWidth: 520,
                margin: "0 auto 1.5rem",
                color: "#0A0A0A",
              }}
              className="mx-auto"
            >
              {user.bio}
            </p>
          )}

          <MDBBtn
            size="sm"
            onClick={() => navigate("/profile/edit")}
            style={{
              border: "2px solid #D6B100",
              background: "transparent",
              color: "#D6B100",
              borderRadius: "0.5rem",
              fontFamily: "Poppins, sans-serif",
              fontWeight: 600,
              fontSize: "16px",
              padding: "0.5rem 1rem",
              display: "block",
              margin: "0 auto 1.5rem",
              textTransform: "none",
            }}
          >
            Edit
          </MDBBtn>

          {/* follower counts */}
          <div className="d-flex justify-content-center gap-3 mt-3">
            <span
              role="button"
              onClick={openFollowers}
              className="fw-bold text-decoration-underline"
              style={{
                fontFamily: "Poppins, sans-serif",
                fontWeight: 600,
                fontSize: "16px",
                lineHeight: "150%",
                letterSpacing: "0px",
                color: "#0A0A0A",
                cursor: "pointer",
              }}
            >
              {followersCnt} followers
            </span>

            <span
              role="button"
              onClick={openFollowing}
              className="fw-bold text-decoration-underline"
              style={{
                fontFamily: "Poppins, sans-serif",
                fontWeight: 600,
                fontSize: "16px",
                lineHeight: "150%",
                letterSpacing: "0px",
                color: "#0A0A0A",
                cursor: "pointer",
              }}
            >
              {followingCnt} following
            </span>
          </div>
        </div>

        {/* ────── Analytics ────── */}
        <div className="d-flex justify-content-between align-items-center mb-2">
          <h6
            className="mb-3 px-2 px-md-0"
            style={{
              fontFamily: "Poppins, sans-serif",
              fontWeight: 600,
              fontSize: "22px",
              lineHeight: "150%",
              letterSpacing: "0px",
              color: "#0A0A0A",
              margin: 0,
            }}
          >
            Analytics
          </h6>
        </div>

        <MDBRow className="gy-3 mb-4">
          <MDBCol size="6" md="3">
            <StatCard label="Views" value={stats.views.toLocaleString()} />
          </MDBCol>

          <MDBCol size="6" md="3">
            <StatCard
              label="Bookmarks"
              value={stats.bookmarks.toLocaleString()}
            />
          </MDBCol>

          <MDBCol size="6" md="3">
            <StatCard label="Likes" value={stats.likes.toLocaleString()} />
          </MDBCol>

          <MDBCol size="6" md="3">
            <StatCard
              label="Comments"
              value={stats.comments.toLocaleString()}
            />
          </MDBCol>
        </MDBRow>

        {/* ────── Articles grid ────── */}
        <div className="mb-3">
          <h6
            className="fw-bold mb-0"
            style={{
              fontFamily: "Poppins, sans-serif",
              fontWeight: 600,
              fontSize: "22px",
              lineHeight: "150%",
              color: "#0A0A0A",
              margin: 0,
            }}
          >
            Articles
          </h6>
        </div>

        <div className="d-flex flex-row flex-wrap gap-3 mb-5 px-2 px-md-0">
          <MDBBtn
            size="sm"
            color={showMine ? "success" : "light"}
            className="rounded-pill me-2"
            onClick={() => setActiveTab("mine")}
            style={{
              background: showMine ? "#5C6B3C" : "transparent",
              color: showMine ? "#FFFFFF" : "#0A0A0A",
              border: "2px solid #5C6B3C",
              borderRadius: "0.5rem",
              fontFamily: "Poppins, sans-serif",
              fontWeight: 600,
              fontSize: "16px",
              padding: "0.5rem 1rem",
              marginRight: "0.5rem",
              textTransform: "none",
            }}
          >
            My Articles
          </MDBBtn>

          <MDBBtn
            size="sm"
            color={!showMine ? "success" : "light"}
            className="rounded-pill"
            onClick={() => setActiveTab("bookmarked")}
            style={{
              background: !showMine ? "#5C6B3C" : "transparent",
              color: !showMine ? "#FFFFFF" : "#0A0A0A",
              border: "2px solid #5C6B3C",
              borderRadius: "0.5rem",
              fontFamily: "Poppins, sans-serif",
              fontWeight: 600,
              fontSize: "16px",
              padding: "0.5rem 1rem",
              textTransform: "none",
            }}
          >
            Bookmarked
          </MDBBtn>
        </div>

        <MDBRow className="g-5">
          {(showMine ? combinedMine : bookmarked).map((article) => (
            <MDBCol key={article.id} xs="6" md="4">
              <ArticleCard
                article={article}
                author={showMine ? userDoc : authors[article.authorId]}
                isOwner={showMine}
                isDraft={!!article.isDraft}
                onEdit={article.isDraft ? handleEditDraft : handleEditPublished}
                onDelete={handleDelete}
              />
            </MDBCol>
          ))}
        </MDBRow>

        {/* ────── Followers / Following overlays ────── */}
        <FollowersOverlay
          isOpen={showFollowers}
          onClose={() => setShowFollowers(false)}
          followers={followersList}
          onToggleFollow={(uid, shouldFollow) =>
            handleToggleFollow(uid, shouldFollow)
          }
          currentFollowingIds={followingIds}
          currentSentIds={sentReqIds}
          onSendRequest={handleSendRequest}
          onCancelRequest={handleCancelRequest}
        />

        <FollowingOverlay
          isOpen={showFollowing}
          onClose={() => setShowFollowing(false)}
          following={followingList}
          onRemove={(uid) => handleToggleFollow(uid, false)}
          onToggleFollow={(uid, shouldFollow) =>
            handleToggleFollow(uid, shouldFollow)
          }
          currentFollowingIds={followingIds}
          currentSentIds={sentReqIds}
          onSendRequest={handleSendRequest}
          onCancelRequest={handleCancelRequest}
        />
      </div>
    </MDBContainer>
  );
}