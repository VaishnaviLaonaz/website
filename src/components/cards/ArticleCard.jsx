// import React, { useState, useEffect } from 'react';
// import {
//   MDBCard,
//   MDBCardBody,
//   MDBCardImage,
//   MDBIcon,
//   MDBBtn,
// } from 'mdb-react-ui-kit';
// import { Link } from 'react-router-dom';

// import { useAuth } from '../../context/AuthContext';
// import {
//   likeArticle,
//   streamLikes,
//   addComment,
//   streamComments,
//   toggleBookmark,        
//   streamBookmarks
// } from '../../configs/useArticles';
// import CommentOverlay from './CommentOverlay';

// export default function ArticleCard({
//   article,
//   author,
//   isOwner = false,
//   onEdit,
//   onDelete,
// }) {
//   // Always call hooks at the top level
//   const { currentUser } = useAuth();
//   const uid               = currentUser?.uid;  
//   const [likedBy, setLikedBy] = useState([]);
//   const [commentsCount, setCommentsCount] = useState([]);
//   const [showComments, setShowComments] = useState(false);
//   const [bookmarks, setBookmarks] = useState([]);


//   useEffect(() => {
//     const u1 = streamLikes(article.id, setLikes);
//     const u2 = streamBookmarks(article.id, setBookmarks);
//     return () => { u1(); u2(); };
//   }, [article.id]);

//   useEffect(() => {
//     if (!article?.id) return;
//     const unsubLikes = streamLikes(article.id, setLikedBy);
//     const unsubComments = streamComments(article.id, items => setCommentsCount(Array.isArray(items) ? items.length : 0));
//     return () => {
//       unsubLikes();
//       unsubComments();
//     };
//   }, [article?.id]);

//   // Safe guard after hooks
//   if (!article) return null;


//   const createdDate = new Date(article.createdAt);
//   const updatedDate = new Date(article.updatedAt);
//   const hasBeenEdited = article.updatedAt !== article.createdAt;
//   const hasLiked = uid ? likedBy.includes(uid) : false;
//   const bookmarked = bookmarks.includes(currentUser?.uid);


//   const handleLike = () => {
//    if (!uid) return;                      
//     likeArticle(article.id, uid);
    
//   };
//   const handleBookmark  = () => toggleBookmark(article.id, currentUser.uid);


//   const openComments = () => {
//   console.log("Opening comments for article:", article.id);
//   setShowComments(true);
// };

//  const LikeBtn = (
//     <span role="button" onClick={handleLike} style={{ color: hasLiked ? '#0d6efd' : undefined }}>
//       <MDBIcon far icon="thumbs-up" className="me-1" />
//       {likedBy.length}
//     </span>
//   );

//   const CommentBtn = (
//     <span role="button" onClick={openComments}>
//       <MDBIcon far icon="comment" className="me-1" />
//       {commentsCount}
//     </span>
//   );

//   return (
//     <MDBCard className="h-100 shadow-3-strong border-0">

//       <MDBBtn
//         size="sm"
//         color="link"
//         onClick={handleBookmark}
//         className="position-absolute p-0"
//         style={{ top: 8, right: 8 }}
//       >
//         <MDBIcon
//           icon={bookmarked ? 'star' : 'star'}
//           fas
//           style={{ color: bookmarked ? '#ffc107' : '#adb5bd' }}
//         />
//       </MDBBtn>


//       <Link to={`/article/${article.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
//         <MDBCardImage
//           src={article.coverUrl || 'https://placehold.co/600x400?text=Image'}
//           alt={article.title}
//           position="top"
//           style={{ objectFit: 'cover', height: '180px' }}
//         />
//       </Link>

//       <MDBCardBody className="d-flex flex-column">
//         <Link to={`/article/${article.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
//           <h6 className="fw-semibold mb-1">{article.title}</h6>
//         </Link>
//         <small className="text-muted d-block mb-2">
//           #{article.category || 'General'}
//         </small>

//         {author && (
//           <Link
//             to={`/u/${author.username || author.uid}`}
//             className="d-flex align-items-center gap-2 small text-reset mb-3 mt-auto"
//             style={{ textDecoration: 'none' }}
//           >
//             <img
//               src={author.avatarUrl || 'https://placehold.co/32x32'}
//               alt={author.displayName}
//               className="rounded-circle"
//               width="28"
//               height="28"
//             />
//             <span className="fw-semibold">{author.displayName}</span>
//           </Link>
//         )}

//         <div className="d-flex justify-content-between align-items-center mt-2">
//           <div className="text-muted small">
//             {hasBeenEdited
//               ? `Last edited: ${updatedDate.toLocaleDateString()}`
//               : `Published: ${createdDate.toLocaleDateString()}`}
//           </div>

//           {isOwner ? (
//             <div className="d-flex gap-2">
//               <MDBBtn size="sm" color="link" className="p-0" onClick={() => onEdit?.(article)}>
//                 <MDBIcon fas icon="edit" />
//               </MDBBtn>
//               <MDBBtn size="sm" color="link" className="p-0 text-danger" onClick={() => onDelete?.(article.id)}>
//                 <MDBIcon fas icon="trash-alt" />
//               </MDBBtn>
//             </div>
//           ) : (
//               <div className="d-flex gap-3 text-muted small">
//               {LikeBtn}
//               {CommentBtn}
//             </div>
//           )}
//         </div>

//         <CommentOverlay
//           isOpen={showComments}
//           onClose={() => setShowComments(false)}
//           articleId={article.id}
//         />
//       </MDBCardBody>
//     </MDBCard>
//   );
// }

// correct one below
// import React, { useState, useEffect } from 'react';
// import {
//   MDBCard, MDBCardBody, MDBCardImage,
//   MDBIcon, MDBBtn
// } from 'mdb-react-ui-kit';
// import { Link } from 'react-router-dom';

// import { useAuth } from '../../context/AuthContext';
// import {
//   likeArticle,
//   streamLikes,
//   streamComments,
//   toggleBookmark,
//   streamBookmarks,
//   streamCommentCount
// } from '../../configs/useArticles';
// import CommentOverlay from './CommentOverlay';

// export default function ArticleCard({
//   article,
//   author,
//   isOwner = false,
//   onEdit,
//   onDelete
// }) {
//   /* ── current user ── */
//   const { currentUser } = useAuth();
//   const uid = currentUser?.uid;

//   /* ── realtime state ── */
//   const [likes,       setLikes]       = useState([]);   // user-ids of likers
//   const [commentsCnt, setCommentsCnt] = useState(0);    // number
//   const [bookmarks,   setBookmarks]   = useState([]);   // user-ids
//   const [showComments, setShowComments] = useState(false);

//   /* ── live likes & bookmarks ── */
//   useEffect(() => {
//     if (!article?.id) return;
//     const u1 = streamLikes     (article.id, setLikes);
//     const u2 = streamBookmarks (article.id, setBookmarks);
//     const unsubCommentCnt = streamCommentCount(article.id, cnt => setCommentsCnt(cnt));
//     return () => { u1(); u2(); unsubCommentCnt(); };
//   }, [article?.id]);

//   /* ── live comments count ── */
//   useEffect(() => {
//     if (!article?.id) return;
//     const unsub = streamComments(article.id, list =>
//       setCommentsCnt(Array.isArray(list) ? list.length : 0)
//     );
//     return unsub;
//   }, [article?.id]);

//   /* ── derived flags ── */
//   const hasLiked   = uid ? likes.includes(uid) : false;
//   const bookmarked = uid ? bookmarks.includes(uid) : false;

//   /* ── handlers ── */
//   const handleLike = async e => {
//     e.stopPropagation();          // prevent Link navigation
//     if (!uid) return;
//     // optimistic toggle
//     setLikes(prev => prev.includes(uid)
//       ? prev.filter(u => u !== uid)
//       : [...prev, uid]);
//     await likeArticle(article.id, uid);
//   };
// const handleBookmark = async e => {
//     e.stopPropagation();
//     if (!uid) return;
//     // optimistic toggle
//     setBookmarks(prev => prev.includes(uid)
//       ? prev.filter(u => u !== uid)
//       : [...prev, uid]);
//     await toggleBookmark(article.id, uid);
//   }; 
  
// const openComments = e => {
//     e.stopPropagation();
//     setShowComments(true);
//   };
//   /* ── guard ── */
//   if (!article) return null;

//   /* ── dates ── */
//   const createdDate  = new Date(article.createdAt);
//   const updatedDate  = new Date(article.updatedAt);
//   const hasBeenEdited = article.updatedAt !== article.createdAt;

//   /* ── tiny sub-components ── */
//   const LikeBtn = (
//     <span role="button" onClick={handleLike}
//           style={{ color: hasLiked ? '#0d6efd' : undefined }}>
//       <MDBIcon far={!hasLiked} fas={hasLiked} icon="thumbs-up" className="me-1" />
//       {likes.length}
//     </span>
//   );

//   const CommentBtn = (
//     <span role="button" onClick={openComments}>
//       <MDBIcon far icon="comment" className="me-1" />
//       {commentsCnt}
//     </span>
//   );

//   /* ── render ── */
//   return (
//     <MDBCard className="h-100 shadow-3-strong border-0 position-relative">

//       {/* bookmark star (top-right) */}
//       <MDBBtn
//         size="sm"
//         color="link"
//         className="position-absolute p-0"
//         style={{ top: 8, right: 8 }}
//         onClick={handleBookmark}
//       >
//         <MDBIcon
//           icon="star"
//           fas
//           style={{ color: bookmarked ? '#ffc107' : '#adb5bd' }}
//         />
//       </MDBBtn>

//       {/* cover image */}
//       <Link to={`/article/${article.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
//         <MDBCardImage
//           src={article.coverUrl || 'https://placehold.co/600x400?text=Image'}
//           alt={article.title}
//           position="top"
//           style={{ objectFit: 'cover', height: '180px' }}
//         />
//       </Link>

//       <MDBCardBody className="d-flex flex-column">
//         {/* title */}
//         <Link to={`/article/${article.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
//           <h6 className="fw-semibold mb-1">{article.title}</h6>
//         </Link>
//         <small className="text-muted d-block mb-2">
//           #{article.category || 'General'}
//         </small>

//         {/* author */}
//         {author && (
//           <Link
//             to={`/u/${author.username || author.uid}`}
//             className="d-flex align-items-center gap-2 small text-reset mb-3 mt-auto"
//             style={{ textDecoration: 'none' }}
//           >
//             <img
//               src={author.avatarUrl || 'https://placehold.co/32x32'}
//               alt={author.displayName}
//               className="rounded-circle"
//               width="28"
//               height="28"
//             />
//             <span className="fw-semibold">{author.displayName}</span>
//           </Link>
//         )}

//         {/* footer */}
//         <div className="d-flex justify-content-between align-items-center mt-2">
//           <div className="text-muted small">
//             {hasBeenEdited
//               ? `Last edited: ${updatedDate.toLocaleDateString()}`
//               : `Published: ${createdDate.toLocaleDateString()}`}
//           </div>

//           {isOwner ? (
//             <div className="d-flex gap-2">
//               <MDBBtn
//                 size="sm" color="link" className="p-0"
//                 onClick={() => onEdit?.(article)}
//               >
//                 <MDBIcon fas icon="edit" />
//               </MDBBtn>
//               <MDBBtn
//                 size="sm" color="link" className="p-0 text-danger"
//                 onClick={() => onDelete?.(article.id)}
//               >
//                 <MDBIcon fas icon="trash-alt" />
//               </MDBBtn>
//             </div>
//           ) : (
//             <div className="d-flex gap-3 text-muted small">
//               {LikeBtn}
//               {CommentBtn}
//             </div>
//           )}
//         </div>

//         {/* comments overlay */}
//         <CommentOverlay
//           isOpen={showComments}
//           onClose={() => setShowComments(false)}
//           articleId={article.id}
//         />
//       </MDBCardBody>
//     </MDBCard>
//   );
// }






// // src/components/cards/ArticleCard.jsx
// import React, { useState, useEffect } from "react";
// import {
//   MDBCard,
//   MDBCardBody,
//   MDBCardImage,
//   MDBIcon,
//   MDBBtn,
// } from "mdb-react-ui-kit";
// import { Link, useNavigate } from "react-router-dom";
// import CommentList from "./CommentList";

// import { useAuth } from "../../context/AuthContext";
// import {
//   likeArticle,
//   streamLikes,
//   streamComments,
//   toggleBookmark,
//   streamBookmarks,
//   streamCommentCount,
// } from "../../configs/useArticles";

// export default function ArticleCard({
//   article,
//   author,
//   isOwner = false,
//   onEdit,
//   onDelete,
// }) {
//   /* ─────────── current user ─────────── */
//   const { currentUser } = useAuth();
//   const uid = currentUser?.uid;
//   const navigate = useNavigate();

//   /* ─────────── live state ─────────── */
//   const [likes, setLikes] = useState([]); // user-ids of likers
//   const [commentsCnt, setCommentsCnt] = useState(0);
//   const [bookmarks, setBookmarks] = useState([]);
//    const [showComments, setShowComments] = useState(false);

//   /* ─────── likes / bookmarks / commentCnt ─────── */
//   useEffect(() => {
//     if (!article?.id) return;
//     const u1 = streamLikes(article.id, setLikes);
//     const u2 = streamBookmarks(article.id, setBookmarks);
//     const u3 = streamCommentCount(article.id, (cnt) => setCommentsCnt(cnt));
//     return () => {
//       u1();
//       u2();
//       u3();
//     };
//   }, [article?.id]);

//   /* ─────────── derived flags ─────────── */
//   const hasLiked = uid ? likes.includes(uid) : false;
//   const bookmarked = uid ? bookmarks.includes(uid) : false;

//   /* ─────────── handlers ─────────── */
//   const handleLike = async (e) => {
//     e.stopPropagation();
//     if (!uid) return;
//     // optimistic
//     setLikes((prev) =>
//       prev.includes(uid) ? prev.filter((u) => u !== uid) : [...prev, uid]
//     );
//     await likeArticle(article.id, uid);
//   };

//   const handleBookmark = async (e) => {
//     e.stopPropagation();
//     if (!uid) return;
//     setBookmarks((prev) =>
//       prev.includes(uid) ? prev.filter((u) => u !== uid) : [...prev, uid]
//     );
//     await toggleBookmark(article.id, uid);
//   };

//   const goToComments = (e) => {
//     e.stopPropagation();
//     navigate(`/article/${article.id}#comments`);
//   };

//   /* ─────────── guard ─────────── */
//   if (!article) return null;

//   /* ─────────── date helpers ─────────── */
//   const createdDate = new Date(article.createdAt);
//   const updatedDate = new Date(article.updatedAt);
//   const hasBeenEdited = article.updatedAt !== article.createdAt;

//   /* ─────────── tiny sub-components ─────────── */
//   const LikeBtn = (
//     <span
//       role="button"
//       onClick={handleLike}
//       style={{ color: hasLiked ? "#0d6efd" : undefined }}
//     >
//       <MDBIcon
//         far={!hasLiked}
//         fas={hasLiked}
//         icon="thumbs-up"
//         className="me-1"
//       />
//       {likes.length}
//     </span>
//   );

//   const CommentBtn = (
//     <span role="button" onClick={goToComments}>
//       <MDBIcon far icon="comment" className="me-1" /> {commentsCnt}
//     </span>
//   );

//   /* ─────────── render ─────────── */
//   return (
//     <MDBCard className="h-100 shadow-3-strong border-0 position-relative">
//       {/* bookmark (top-right) */}
//       <MDBBtn
//         size="sm"
//         color="link"
//         className="position-absolute p-0"
//         style={{ top: 8, right: 8 }}
//         onClick={handleBookmark}
//       >
//         <MDBIcon
//           icon="star"
//           fas
//           style={{ color: bookmarked ? "#ffc107" : "#adb5bd" }}
//         />
//       </MDBBtn>

//       {/* cover image */}
//       <Link
//         to={`/article/${article.id}`}
//         style={{ textDecoration: "none", color: "inherit" }}
//       >
//         <MDBCardImage
//           src={article.coverUrl || "https://placehold.co/600x400?text=Image"}
//           alt={article.title}
//           position="top"
//           style={{ objectFit: "cover", height: "200px" }}
//         />
//       </Link>

//       <MDBCardBody className="d-flex flex-column gap-1">
//         {/* title */}
//         <Link
//           to={`/article/${article.id}`}
//           style={{ textDecoration: "none", color: "inherit" }}
//         >
//           <h5 className="fw-bold mb-1">{article.title}</h5>
//         </Link>

//         {/* hashtag / category */}
//         <span className="text-success fw-semibold mb-2">
//           #{article.category || "General"}
//         </span>

//         {/* meta row: date · views · likes · comments */}
//         <div className="d-flex align-items-center gap-3 text-muted small mb-3">
//           <span>
//             {hasBeenEdited
//               ? updatedDate.toLocaleDateString()
//               : createdDate.toLocaleDateString()}
//           </span>

//           <span>
//             <MDBIcon icon="eye" className="me-1" />
//             {article.viewCount ?? article.views ?? 0}
//           </span>

//           {LikeBtn}
//           {CommentBtn}
//         </div>

//         {/* author block */}
//         {author && (
//           <div className="d-flex align-items-center gap-3 mt-auto">
//             <img
//               src={author.avatarUrl || "https://placehold.co/40x40"}
//               alt={author.displayName}
//               className="rounded-circle flex-shrink-0"
//               width="40"
//               height="40"
//             />
//             <div>
//               <div className="fw-semibold">{author.displayName}</div>
//               {author.tagline && (
//                 <small className="text-muted">{author.tagline}</small>
//               )}
//             </div>
//           </div>
//         )}

//         {/* owner actions */}
//         {isOwner && (
//           <div className="d-flex gap-2 position-absolute" style={{ top: 8, left: 8 }}>
//             <MDBBtn size="sm" color="link" className="p-0" onClick={() => onEdit?.(article)}>
//               <MDBIcon fas icon="edit" />
//             </MDBBtn>
//             <MDBBtn
//               size="sm"
//               color="link"
//               className="p-0 text-danger"
//               onClick={() => onDelete?.(article.id)}
//             >
//               <MDBIcon fas icon="trash-alt" />
//             </MDBBtn>
//           </div>
//         )}
//       </MDBCardBody>
//     </MDBCard>
//   );
// }


// // src/components/cards/ArticleCard.jsx
// import React, { useState, useEffect } from "react";
// import {
//   MDBCard,
//   MDBCardBody,
//   MDBCardImage,
//   MDBIcon,
//   MDBBtn,
// } from "mdb-react-ui-kit";
// import { Link } from "react-router-dom";

// import { useAuth } from "../../context/AuthContext";
// import {
//   likeArticle,
//   streamLikes,
//   streamBookmarks,
//   streamCommentCount,
//   toggleBookmark,
// } from "../../configs/useArticles";

// import CommentList from "./CommentList";        

// export default function ArticleCard({
//   article,
//   author,
//   isOwner = false,
//   onEdit,
//   onDelete,
// }) {
//   /* ─────────── current user ─────────── */
//   const { currentUser } = useAuth();
//   const uid = currentUser?.uid;

//   /* ─────────── live state ─────────── */
//   const [likes,       setLikes]       = useState([]); // user-ids of likers
//   const [commentsCnt, setCommentsCnt] = useState(0);
//   const [bookmarks,   setBookmarks]   = useState([]);
//   const [showComments, setShowComments] = useState(false);   // ⬅️ NEW

//   /* ─────── likes / bookmarks / commentCnt ─────── */
//   useEffect(() => {
//     if (!article?.id) return;
//     const u1 = streamLikes(article.id, setLikes);
//     const u2 = streamBookmarks(article.id, setBookmarks);
//     const u3 = streamCommentCount(article.id, cnt => setCommentsCnt(cnt));
//     return () => { u1(); u2(); u3(); };
//   }, [article?.id]);

//   /* ─────────── derived flags ─────────── */
//   const hasLiked   = uid ? likes.includes(uid)      : false;
//   const hasBookmarked = uid ? bookmarks.includes(uid)  : false;
//     // const hasBookmarked = uid && bookmarks.includes(uid);


//   /* ─────────── handlers ─────────── */
//   const handleLike = async e => {
//     e.stopPropagation();
//     if (!uid) return;
//     setLikes(prev =>
//       prev.includes(uid) ? prev.filter(u => u !== uid) : [...prev, uid]
//     );
//     await likeArticle(article.id, uid);
//   };

//   // const handleBookmark = () => uid && toggleBookmark(article.id, uid);

//   const handleBookmark = async e => {
//     e.stopPropagation();
//     if (!uid) return;
//     setBookmarks(prev => 
//       prev.includes(uid) ? prev.filter(u => u !== uid) : [...prev, uid]
//     );
//     await toggleBookmark(article.id, uid);
//   };

//   const toggleComments = e => {
//     e.stopPropagation();
//     setShowComments(prev => !prev);
//   };

//   /* ─────────── guard ─────────── */
//   if (!article) return null;

//   /* ─────────── date helpers ─────────── */
//   const createdDate   = new Date(article.createdAt);
//   const updatedDate   = new Date(article.updatedAt);
//   const hasBeenEdited = article.updatedAt !== article.createdAt;

//   const profileLink =
//     author && uid && author.uid === uid
//       ? "/profile"
//       : `/u/${author?.username || author?.uid}`;

//   /* ─────────── tiny sub-components ─────────── */
//   const LikeBtn = (
//     <span
//       role="button"
//       onClick={handleLike}
//       style={{ color: hasLiked ? "#0d6efd" : undefined }}
//     >
//       {hasLiked ? (
//         <MDBIcon fas icon="thumbs-up" className="me-1" />
//       ) : (
//         <MDBIcon far icon="thumbs-up" className="me-1" />
//       )}
//       {likes.length}
//     </span>
//   );

//   const CommentBtn = (
//     <span role="button" onClick={toggleComments}>
//       <MDBIcon far icon="comment" className="me-1" /> {commentsCnt}
//     </span>
//   );

//   /* ─────────── render ─────────── */
//   return (
//     <MDBCard className="h-100 shadow-3-strong border-0 position-relative">
//       {/* bookmark (top-right) */}
//           <MDBBtn
//         size="sm"
//         color="link"
//         className="position-absolute p-0"
//         style={{ top: 8, right: 8 }}
//         onClick={handleBookmark}
//       >
//         {hasBookmarked ? (
//           <MDBIcon
//             fas
//             icon="bookmark"
//             style={{ fontSize: "1.2rem", color: "#ffc107" }}
//           />
//         ) : (
//           <MDBIcon
//             far
//             icon="bookmark"
//             style={{ fontSize: "1.2rem", color: "#adb5bd" }}
//           />
//         )}
//       </MDBBtn>

//       {/* cover image */}
//       <Link
//         to={`/article/${article.id}`}
//         style={{ textDecoration: "none", color: "inherit" }}
//       >
//         <MDBCardImage
//           src={article.coverUrl || "https://placehold.co/600x400?text=Image"}
//           alt={article.title}
//           position="top"
//           style={{ objectFit: "cover", height: "200px" }}
//         />
//       </Link>

//       <MDBCardBody className="d-flex flex-column gap-1">
//         {/* title */}
//         <Link
//           to={`/article/${article.id}`}
//           style={{ textDecoration: "none", color: "inherit" }}
//         >
//           <h5 className="fw-bold mb-1">{article.title}</h5>
//         </Link>

//         {/* hashtag / category */}
//         <span className="text-success fw-semibold mb-2">
//           #{article.category || "General"}
//         </span>

//         {/* meta row */}
//         <div className="d-flex align-items-center gap-3 text-muted small mb-3">
//           <span>
//             {hasBeenEdited
//               ? updatedDate.toLocaleDateString()
//               : createdDate.toLocaleDateString()}
//           </span>

//           <span>
//             <MDBIcon icon="eye" className="me-1" />
//             {article.viewCount ?? article.views ?? 0}
//           </span>

//           {LikeBtn}
//           {CommentBtn}
//         </div>

//         {/* author block */}
//         {author && (
//           <Link
//             to={profileLink}
//             className="d-flex align-items-center gap-3 mt-auto text-reset"
//             style={{ textDecoration: "none" }}
//           >
//             <img
//               src={author.avatarUrl || "https://placehold.co/40x40"}
//               alt={author.displayName}
//               className="rounded-circle flex-shrink-0"
//               width="40" height="40"
//             />
//             <div>
//               <div className="fw-semibold">{author.displayName}</div>
//               {author.tagline && <small className="text-muted">{author.tagline}</small>}
//             </div>
//           </Link>
//         )}

//         {/* owner actions */}
//         {isOwner && (
//           <div
//             className="d-flex gap-2 position-absolute"
//             style={{ top: 8, left: 8 }}
//           >
//             <MDBBtn
//               size="sm"
//               color="link"
//               className="p-0"
//               onClick={() => onEdit?.(article)}
//             >
//               <MDBIcon fas icon="edit" />
//             </MDBBtn>
//             <MDBBtn
//               size="sm"
//               color="link"
//               className="p-0 text-danger"
//               onClick={() => onDelete?.(article.id)}
//             >
//               <MDBIcon fas icon="trash-alt" />
//             </MDBBtn>
//           </div>
//         )}

//         {/* inline comments pane ---------------------------------------- */}
//         {showComments && (
//           <div className="mt-4">
//             <CommentList
//               articleId={article.id}
//               currentUser={currentUser}
//             />
//           </div>
//         )}
//       </MDBCardBody>
//     </MDBCard>
//   );
// }





// import React, { useState, useEffect } from "react";
// import {
//   MDBCard,
//   MDBCardBody,
//   MDBCardImage,
//   MDBIcon,
//   MDBBtn,
// } from "mdb-react-ui-kit";
// import { Link } from "react-router-dom";

// import { useAuth } from "../../context/AuthContext";
// import {
//   likeArticle,
//   streamLikes,
//   streamBookmarks,
//   streamCommentCount,
//   toggleBookmark,
//   streamMyBookmarks,
// } from "../../configs/useArticles";

// import CommentList from "./CommentList";

// export default function ArticleCard({
//   article,
//   author,
//   isOwner = false,
//   onEdit,
//   onDelete,
// }) {
//   /* ─────────── current user ─────────── */
//   const { currentUser } = useAuth();
//   const uid = currentUser?.uid;

//   /* ─────────── live state ─────────── */
//   const [likes, setLikes] = useState([]);            // user-ids who liked
//   const [commentsCnt, setCommentsCnt] = useState(0);
//   const [bookmarks, setBookmarks] = useState([]);    // user-ids who bookmarked (for count)
//   const [myBookmarks, setMyBookmarks] = useState([]);// article-ids I bookmarked (for toggle)
//   const [showComments, setShowComments] = useState(false);

//   /* ─────── subscribe to likes/bookmarks/commentCnt ─────── */
//   useEffect(() => {
//     if (!article?.id) return;
//     const u1 = streamLikes(article.id, setLikes);
//     const u2 = streamBookmarks(article.id, setBookmarks);
//     const u3 = streamCommentCount(article.id, setCommentsCnt);
//     return () => { u1(); u2(); u3(); };
//   }, [article?.id]);

//   /* ─────── subscribe to my bookmark list ─────── */
//   useEffect(() => {
//     if (!uid) return;
//     const unsub = streamMyBookmarks(uid, setMyBookmarks);
//     return () => unsub();
//   }, [uid]);

//   /* ─────────── derived flags ─────────── */
//   const hasLiked      = uid && likes.includes(uid);
//   const hasBookmarked = uid && myBookmarks.includes(article.id);

//   /* ─────────── handlers ─────────── */
//   const handleLike = async e => {
//     e.stopPropagation();
//     if (!uid) return;
//     // optimistic UI flip
//     setLikes(prev =>
//       prev.includes(uid) ? prev.filter(u => u !== uid) : [...prev, uid]
//     );
//     try {
//     await likeArticle(article.id, uid);
//   } catch (err) {
//     console.error("Failed to like:", err);
//   }
//   };

//   const handleBookmark = async e => {
//     e.stopPropagation();
//     if (!uid) return;
//     // optimistic UI flip in myBookmarks
//     setMyBookmarks(prev =>
//       prev.includes(article.id)
//         ? prev.filter(id => id !== article.id)
//         : [...prev, article.id]
//     );
//     await toggleBookmark(article.id, uid);
//   };

//   const toggleComments = e => {
//     e.stopPropagation();
//     setShowComments(prev => !prev);
//   };

//   /* ─────────── guard ─────────── */
//   if (!article) return null;

//   /* ─────────── render ─────────── */
//   return (
//     <MDBCard className="h-100 shadow-3-strong border-0 position-relative">
//       {/* bookmark (top-right) */}
//       <MDBBtn
//         size="sm"
//         color="link"
//         className="position-absolute p-0"
//         style={{ top: 8, right: 8 }}
//         onClick={handleBookmark}
//       >
//         {hasBookmarked ? (
//           <MDBIcon
//             fas
//             icon="bookmark"
//             style={{ fontSize: "1.2rem", color: "#ffc107" }}
//           />
//         ) : (
//           <MDBIcon
//             far
//             icon="bookmark"
//             style={{ fontSize: "1.2rem", color: "#adb5bd" }}
//           />
//         )}
//       </MDBBtn>

//       {/* cover image */}
//       <Link
//         to={`/article/${article.id}`}
//         style={{ textDecoration: "none", color: "inherit" }}
//       >
//         <MDBCardImage
//           src={article.coverUrl || "https://placehold.co/600x400?text=Image"}
//           alt={article.title}
//           position="top"
//           style={{ objectFit: "cover", height: "200px" }}
//         />
//       </Link>

//       <MDBCardBody className="d-flex flex-column gap-1">
//         {/* title */}
//         <Link
//           to={`/article/${article.id}`}
//           style={{ textDecoration: "none", color: "inherit" }}
//         >
//           <h5 className="fw-bold mb-1">{article.title}</h5>
//         </Link>

//         {/* hashtag / category */}
//         <span className="text-success fw-semibold mb-2">
//           #{article.category || "General"}
//         </span>

//         {/* meta row */}
//         <div className="d-flex align-items-center gap-3 text-muted small mb-3">
//           <span>{new Date(article.createdAt).toLocaleDateString()}</span>

//           <span>
//             <MDBIcon icon="eye" className="me-1" />
//             {article.viewCount ?? article.views ?? 0}
//           </span>

//           <span
//               role="button"
//               onClick={handleLike}
//               style={{ color: hasLiked ? "#0d6efd" : undefined }}
//             >
//               {hasLiked
//                 ? <MDBIcon fas icon="thumbs-up" className="me-1" />
//                 : <MDBIcon far icon="thumbs-up" className="me-1" />
//               }
//               {likes.length}
//             </span>

//           <span role="button" onClick={toggleComments}>
//             <MDBIcon far icon="comment" className="me-1" />
//             {commentsCnt}
//           </span>
//         </div>

//         {/* author block */}
//         {author && (
//           <Link
//             to={author.uid === uid ? "/profile" : `/u/${author.username || author.uid}`}
//             className="d-flex align-items-center gap-3 mt-auto text-reset"
//             style={{ textDecoration: "none" }}
//           >
//             <img
//               src={author.avatarUrl || "https://placehold.co/40x40"}
//               alt={author.displayName}
//               className="rounded-circle flex-shrink-0"
//               width="40"
//               height="40"
//             />
//             <div>
//               <div className="fw-semibold">{author.displayName}</div>
//               {author.tagline && <small className="text-muted">{author.tagline}</small>}
//             </div>
//           </Link>
//         )}

//         {/* owner actions */}
//         {isOwner && (
//           <div className="d-flex gap-2 position-absolute" style={{ top: 8, left: 8 }}>
//             <MDBBtn size="sm" color="link" className="p-0" onClick={() => onEdit?.(article)}>
//               <MDBIcon fas icon="edit" />
//             </MDBBtn>
//             <MDBBtn size="sm" color="link" className="p-0 text-danger" onClick={() => onDelete?.(article.id)}>
//               <MDBIcon fas icon="trash-alt" />
//             </MDBBtn>
//           </div>
//         )}

//         {/* inline comments pane */}
//         {showComments && (
//           <div className="mt-4">
//             <CommentList articleId={article.id} currentUser={currentUser} />
//           </div>
//         )}
//       </MDBCardBody>
//     </MDBCard>
//   );
// }





// correct one below for bookmarks

// import React, { useState, useEffect } from "react";
// import {
//   MDBCard,
//   MDBCardBody,
//   MDBCardImage,
//   MDBIcon,
//   MDBBtn,
// } from "mdb-react-ui-kit";
// import { Link } from "react-router-dom";

// import { useAuth } from "../../context/AuthContext";
// import {
//   likeArticle,
//   streamLikes,
//   streamCommentCount,
//   toggleBookmark,
//   streamBookmarks,
// } from "../../configs/useArticles";

// import CommentList from "./CommentList";

// export default function ArticleCard({
//   article,
//   author,
//   isOwner = false,
//   onEdit,
//   onDelete,
// }) {
//   /* ─────────── current user ─────────── */
//   const { currentUser } = useAuth();
//   const uid = currentUser?.uid;

//   /* ─────────── live state ─────────── */
//   const [likes, setLikes] = useState([]);            // user-ids who liked
//   const [commentsCnt, setCommentsCnt] = useState(0);
//   const [bookmarks, setBookmarks] = useState([]);    // user-ids who bookmarked
//   const [showComments, setShowComments] = useState(false);

//   /* ─────── subscribe to likes/bookmarks/commentCnt ─────── */
//   useEffect(() => {
//     if (!article?.id) return;
//     const unsubLikes = streamLikes(article.id, setLikes);
//     const unsubBooks = streamBookmarks(article.id, setBookmarks);
//     const unsubCnt   = streamCommentCount(article.id, setCommentsCnt);
//     return () => {
//       unsubLikes();
//       unsubBooks();
//       unsubCnt();
//     };
//   }, [article?.id]);

//   /* ─────────── derived flags ─────────── */
//   const hasLiked      = uid && likes.includes(uid);
//   const hasBookmarked = uid && bookmarks.includes(uid);

//   /* ─────────── handlers ─────────── */
//   const handleLike = async e => {
//     e.stopPropagation();
//     if (!uid) return;
//     // optimistic UI flip
//     setLikes(prev =>
//       prev.includes(uid) ? prev.filter(u => u !== uid) : [...prev, uid]
//     );
//     try {
//       await likeArticle(article.id, uid);
//     } catch (err) {
//       console.error("Failed to like:", err);
//     }
//   };

//   const handleBookmark = async e => {
//     e.stopPropagation();
//     if (!uid) return;
//     // optimistic UI flip
//     setBookmarks(prev =>
//       prev.includes(uid) ? prev.filter(u => u !== uid) : [...prev, uid]
//     );
//     try {
//       await toggleBookmark(article.id, uid);
//     } catch (err) {
//       console.error("Failed to bookmark:", err);
//     }
//   };

//   const toggleComments = e => {
//     e.stopPropagation();
//     setShowComments(prev => !prev);
//   };

//   /* ─────────── guard ─────────── */
//   if (!article) return null;

//   /* ─────────── render ─────────── */
//   return (
//     <MDBCard className="h-100 shadow-3-strong border-0 position-relative">
//       {/* bookmark (top-right) */}
//       <MDBBtn
//         size="sm"
//         color="link"
//         className="position-absolute p-0"
//         style={{ top: 8, right: 8 }}
//         onClick={handleBookmark}
//       >
//         {hasBookmarked ? (
//           <MDBIcon
//             fas
//             icon="bookmark"
//             style={{ fontSize: "1.2rem", color: "#ffc107" }}
//           />
//         ) : (
//           <MDBIcon
//             far
//             icon="bookmark"
//             style={{ fontSize: "1.2rem", color: "#adb5bd" }}
//           />
//         )}
//       </MDBBtn>

//       {/* cover image */}
//       <Link
//         to={`/article/${article.id}`}
//         style={{ textDecoration: "none", color: "inherit" }}
//       >
//         <MDBCardImage
//           src={article.coverUrl || "https://placehold.co/600x400?text=Image"}
//           alt={article.title}
//           position="top"
//           style={{ objectFit: "cover", height: "200px" }}
//         />
//       </Link>

//       <MDBCardBody className="d-flex flex-column gap-1">
//         {/* title */}
//         <Link
//           to={`/article/${article.id}`}
//           style={{ textDecoration: "none", color: "inherit" }}
//         >
//           <h5 className="fw-bold mb-1">{article.title}</h5>
//         </Link>

//         {/* hashtag / category */}
//         <span className="text-success fw-semibold mb-2">
//           #{article.category || "General"}
//         </span>

//         {/* meta row */}
//         <div className="d-flex align-items-center gap-3 text-muted small mb-3">
//           <span>{new Date(article.createdAt).toLocaleDateString()}</span>

//           <span>
//             <MDBIcon icon="eye" className="me-1" />
//             {article.viewCount ?? article.views ?? 0}
//           </span>

//           <span
//             role="button"
//             onClick={handleLike}
//             style={{ color: hasLiked ? "#0d6efd" : undefined }}
//           >
//             {hasLiked ? (
//               <MDBIcon fas icon="thumbs-up" className="me-1" />
//             ) : (
//               <MDBIcon far icon="thumbs-up" className="me-1" />
//             )}
//             {likes.length}
//           </span>

//           <span role="button" onClick={toggleComments}>
//             <MDBIcon far icon="comment" className="me-1" />
//             {commentsCnt}
//           </span>
//         </div>

//         {/* author block */}
//         {author && (
//           <Link
//             to={author.uid === uid ? "/profile" : `/u/${author.username || author.uid}`}
//             className="d-flex align-items-center gap-3 mt-auto text-reset"
//             style={{ textDecoration: "none" }}
//           >
//             <img
//               src={author.avatarUrl || "https://placehold.co/40x40"}
//               alt={author.displayName}
//               className="rounded-circle flex-shrink-0"
//               width="40"
//               height="40"
//             />
//             <div>
//               <div className="fw-semibold">{author.displayName}</div>
//               {author.tagline && <small className="text-muted">{author.tagline}</small>}
//             </div>
//           </Link>
//         )}

//         {/* owner actions */}
//         {isOwner && (
//           <div className="d-flex gap-2 position-absolute" style={{ top: 8, left: 8 }}>
//             <MDBBtn size="sm" color="link" className="p-0" onClick={() => onEdit?.(article)}>
//               <MDBIcon fas icon="edit" />
//             </MDBBtn>
//             <MDBBtn size="sm" color="link" className="p-0 text-danger" onClick={() => onDelete?.(article.id)}>
//               <MDBIcon fas icon="trash-alt" />
//             </MDBBtn>
//           </div>
//         )}

//         {/* inline comments pane */}
//         {showComments && (
//           <div className="mt-4">
//             <CommentList articleId={article.id} currentUser={currentUser} />
//           </div>
//         )}
//       </MDBCardBody>
//     </MDBCard>
//   );
// }




// import React, { useState, useEffect } from "react";
// import {
//   MDBCard,
//   MDBCardBody,
//   MDBCardImage,
//   MDBIcon,
//   MDBBtn,
// } from "mdb-react-ui-kit";
// import { Link } from "react-router-dom";

// import { useAuth } from "../../context/AuthContext";
// import {
//   likeArticle,
//   streamLikes,
//   streamLikeCount,
//   streamCommentCount,
//   toggleBookmark,
//   streamBookmarks,
// } from "../../configs/useArticles";

// import CommentList from "./CommentList";

// export default function ArticleCard({
//   article,
//   author,
//   isOwner = false,
//   onEdit,
//   onDelete,
// }) {
//   const { currentUser } = useAuth();
//   const uid = currentUser?.uid;

//   // per-article user like IDs (for toggle state)
//   const [likes, setLikes]       = useState([]);
//   // dedicated count from counter node
//   const [likeCount, setLikeCount] = useState(article?.likesCount || 0);
//   const [commentsCnt, setCommentsCnt] = useState(0);
//   const [bookmarks, setBookmarks]     = useState([]);
//   const [showComments, setShowComments] = useState(false);

//   // subscribe to like IDs and count
//   useEffect(() => {
//     if (!article?.id) return;
//     const u1 = streamLikes(article.id, setLikes);
//     const u2 = streamLikeCount(article.id, setLikeCount);
//     return () => { u1(); u2(); };
//   }, [article?.id]);

//   // subscribe to comments and bookmarks
//   useEffect(() => {
//     if (!article?.id) return;
//     const u1 = streamCommentCount(article.id, setCommentsCnt);
//     const u2 = streamBookmarks(article.id, setBookmarks);
//     return () => { u1(); u2(); };
//   }, [article?.id]);

//   const hasLiked      = uid && likes.includes(uid);
//   const hasBookmarked = uid && bookmarks.includes(uid);

//   const handleLike = async e => {
//     e.stopPropagation();
//     if (!uid) return;
//     // optimistic UI flip for toggle state
//     setLikes(prev =>
//       prev.includes(uid) ? prev.filter(u => u !== uid) : [...prev, uid]
//     );
//     try {
//       await likeArticle(article.id, uid);
//     } catch (err) {
//       console.error("Failed to like:", err);
//     }
//   };

//   const handleBookmark = async e => {
//     e.stopPropagation();
//     if (!uid) return;
//     setBookmarks(prev =>
//       prev.includes(uid) ? prev.filter(u => u !== uid) : [...prev, uid]
//     );
//     await toggleBookmark(article.id, uid);
//   };

//   const toggleComments = e => {
//     e.stopPropagation();
//     setShowComments(prev => !prev);
//   };

//   if (!article) return null;

//   return (
//     <MDBCard className="h-100 shadow-sm position-relative">
//       <MDBBtn
//         size="sm"
//         color="link"
//         className="position-absolute p-0"
//         style={{ top: 8, right: 8 }}
//         onClick={handleBookmark}
//       >
//         {hasBookmarked ? (
//           <MDBIcon
//             fas
//             icon="bookmark"
//             className="me-1"
//             style={{ color: '#ffc107' }}
//           />
//         ) : (
//           <MDBIcon
//             far
//             icon="bookmark"
//             className="me-1"
//             style={{ color: '#adb5bd' }}
//           />
//         )}
//         {/* {bookmarks.length} */}
//       </MDBBtn>

//       <Link to={`/article/${article.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
//         <MDBCardImage
//           src={article.coverUrl || 'https://placehold.co/600x400?text=Image'}
//           alt={article.title}
//           position="top"
//           style={{ objectFit: 'cover', height: '200px', cursor: 'pointer' }}
//         />
//       </Link>

//       <MDBCardBody className="d-flex flex-column gap-1">
//         <Link to={`/article/${article.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
//           <h5 className="fw-bold mb-1">{article.title}</h5>
//         </Link>

//         <span className="text-success fw-semibold mb-2">
//           #{article.category || 'General'}
//         </span>

//         <div className="d-flex align-items-center gap-3 text-muted small mb-3">
//           <span>{new Date(article.createdAt).toLocaleDateString()}</span>
//           <span>
//             <MDBIcon icon="eye" className="me-1" />
//             {article.views || 0}
//           </span>

//           <span
//             role="button"
//             onClick={handleLike}
//             style={{ color: hasLiked ? '#0d6efd' : undefined }}
//           >
//             {hasLiked ? (
//               <MDBIcon fas icon="thumbs-up" className="me-1" />
//             ) : (
//               <MDBIcon far icon="thumbs-up" className="me-1" />
//             )}
//             {likeCount}
//           </span>

//           <span role="button" onClick={toggleComments}>
//             <MDBIcon far icon="comment" className="me-1" />
//             {commentsCnt}
//           </span>
//         </div>

//         {author && (
//           <Link
//             to={author.uid === uid ? '/profile' : `/u/${author.username || author.uid}`}
//             className="d-flex align-items-center gap-2 mt-auto text-reset"
//             style={{ textDecoration: 'none' }}
//           >
//             <img
//               src={author.avatarUrl || 'https://placehold.co/40x40'}
//               alt={author.displayName}
//               className="rounded-circle"
//               width="40"
//               height="40"
//             />
//             <div>
//               <div className="fw-semibold">{author.displayName}</div>
//               {author.tagline && <small className="text-muted">{author.tagline}</small>}
//             </div>
//           </Link>
//         )}

//         {isOwner && (
//           <div className="d-flex gap-2 position-absolute" style={{ top: 8, left: 8 }}>
//             <MDBBtn size="sm" color="link" className="p-0" onClick={() => onEdit?.(article)}>
//               <MDBIcon fas icon="edit" />
//             </MDBBtn>
//             <MDBBtn size="sm" color="link" className="p-0 text-danger" onClick={() => onDelete?.(article.id)}>
//               <MDBIcon fas icon="trash-alt" />
//             </MDBBtn>
//           </div>
//         )}

//         {showComments && (
//           <div className="mt-3">
//             <CommentList articleId={article.id} currentUser={currentUser} />
//           </div>
//         )}
//       </MDBCardBody>
//     </MDBCard>
//   );
// }





// import React, { useState, useEffect } from "react";
// import {
//   MDBCard, MDBCardBody, MDBCardImage, MDBIcon, MDBBtn,
// } from "mdb-react-ui-kit";
// import { Link } from "react-router-dom";
// import { useAuth } from "../../context/AuthContext";
// import {
//   likeArticle,
//   streamLikes,
//   streamLikeCount,
//   streamCommentCount,
//   toggleBookmark,
//   streamBookmarks,
// } from "../../configs/useArticles";
// import CommentList from "./CommentList";

// export default function ArticleCard({ article, author, isOwner=false,
//                                      onEdit, onDelete }) {
//   const { currentUser } = useAuth();
//   const uid = currentUser?.uid;

//   /* ---------- remote state ---------- */
//   const [likes,      setLikes]      = useState([]);
//   const [likeCount,  setLikeCount]  = useState(article?.likesCount || 0);
//   const [bookmarks,  setBookmarks]  = useState([]);
//   const [commentsCnt,setCommentsCnt]= useState(0);

//   /* ---------- local optimistic flags ---------- */
//   const [likedLocal,     setLikedLocal]     = useState(false);
//   const [bookmarkedLocal,setBookmarkedLocal]= useState(false);

//   /* ---------- keep remote lists live ---------- */
//   useEffect(() => {
//     if (!article?.id) return;
//     const u1 = streamLikes(article.id, setLikes);
//     const u2 = streamLikeCount(article.id, setLikeCount);
//     const u3 = streamBookmarks(article.id, setBookmarks);
//     const u4 = streamCommentCount(article.id, setCommentsCnt);
//     return () => { u1(); u2(); u3(); u4(); };
//   }, [article?.id]);

//   /* ---------- sync optimistic flags when lists change ---------- */
//   useEffect(() => {
//     setLikedLocal(likes.includes(uid));
//   }, [likes, uid]);

//   useEffect(() => {
//     setBookmarkedLocal(bookmarks.includes(uid));
//   }, [bookmarks, uid]);

//   /* ---------- handlers ---------- */
//   const doLike = async e => {
//     e.stopPropagation();
//     if (!uid) return;
//     setLikedLocal(x => !x);                 // flip immediately
//     try {
//       await likeArticle(article.id, uid);   // async
//     } catch {
//       setLikedLocal(x => !x);               // revert on failure
//     }
//   };

//   const doBookmark = async e => {
//     e.stopPropagation();
//     if (!uid) return;
//     setBookmarkedLocal(x => !x);
//     try {
//       await toggleBookmark(article.id, uid);
//     } catch {
//       setBookmarkedLocal(x => !x);
//     }
//   };

//   /* ---------- derived flags ---------- */
//   const hasLiked      = likedLocal;
//   const hasBookmarked = bookmarkedLocal;

//   /* ---------- render ---------- */
//   return (
//     <MDBCard className="h-100 shadow-sm position-relative">
//       {/* —— bookmark —— */}
//       <MDBBtn
//         size="sm"
//         color="link"
//         className="position-absolute p-0"
//         style={{ top: 8, right: 8 }}
//         onClick={doBookmark}
//       >
//         <MDBIcon
//           icon="bookmark"
//           fas={hasBookmarked}
//           far={!hasBookmarked}
//           style={{ color: hasBookmarked ? "#ffc107" : "#adb5bd" }}
//         />
//       </MDBBtn>

//       {/* —— cover —— */}
//       <Link to={`/article/${article.id}`}>
//         <MDBCardImage
//           src={article.coverUrl || "https://placehold.co/600x400?text=Image"}
//           alt={article.title}
//           position="top"
//           style={{ objectFit: "cover", height: 200 }}
//         />
//       </Link>

//       <MDBCardBody className="d-flex flex-column gap-1">
//         {/* title */}
//         <Link to={`/article/${article.id}`} className="text-reset text-decoration-none">
//           <h5 className="fw-bold mb-1">{article.title}</h5>
//         </Link>

//         <span className="text-success fw-semibold mb-2">
//           #{article.category || "General"}
//         </span>

//         {/* —— meta row —— */}
//         <div className="d-flex align-items-center gap-3 text-muted small mb-3">
//           <span>{new Date(article.createdAt).toLocaleDateString()}</span>

//           <span><MDBIcon icon="eye" className="me-1"/>{article.views || 0}</span>

//           <span role="button" onClick={doLike}
//                 style={{ color: hasLiked ? "#0d6efd" : undefined }}>
//             <MDBIcon icon="thumbs-up"
//                      fas={hasLiked} far={!hasLiked} className="me-1"/>
//             {likeCount + (hasLiked && !likes.includes(uid) ? 1 : 0)}
//           </span>

//           <span role="button"><MDBIcon far icon="comment" className="me-1"/>
//             {commentsCnt}</span>
//         </div>

//         {/* …rest of the card (author, owner buttons, comments) stays unchanged … */}
//       </MDBCardBody>
//     </MDBCard>
//   );
// }



// // src/components/cards/ArticleCard.jsx
// import React, { useState, useEffect } from "react";
// import {
//   MDBCard,
//   MDBCardBody,
//   MDBCardImage,
//   MDBIcon,
//   MDBBtn,
// } from "mdb-react-ui-kit";
// import { Link } from "react-router-dom";

// import { ref, onValue } from "firebase/database";
// import { rtdb } from "../../configs/firebase";

// import { useAuth } from "../../context/AuthContext";
// import {
//   likeArticle,
//   streamLikeCount,
//   streamCommentCount,
//   toggleBookmark,
// } from "../../configs/useArticles";

// import CommentList from "./CommentList";

// export default function ArticleCard({
//   article,
//   author,
//   isOwner = false,
//   onEdit,
//   onDelete,
// }) {
//   /* ---------- auth ---------- */
//   const { currentUser } = useAuth();
//   const uid = currentUser?.uid;

//   /* ---------- remote counters ---------- */
//   const [likeCount, setLikeCount]       = useState(article?.likesCount || 0);
//   const [commentsCnt, setCommentsCnt]   = useState(0);

//   /* ---------- local toggle flags ---------- */
//   const [likedMe,       setLikedMe]       = useState(false);
//   const [bookmarkedMe,  setBookmarkedMe]  = useState(false);
//   const [showComments,  setShowComments]  = useState(false);

//   /* ----------  listen to counters ---------- */
//   useEffect(() => {
//     if (!article?.id) return;
//     const u1 = streamLikeCount   (article.id, setLikeCount);
//     const u2 = streamCommentCount(article.id, setCommentsCnt);
//     return () => { u1(); u2(); };
//   }, [article?.id]);

//   /* ----------  listen to *my* like / bookmark flags ---------- */
//   useEffect(() => {
//     if (!uid || !article?.id) return;
//     const likeRef = ref(rtdb, `articles/${article.id}/likedBy/${uid}`);
//     const bmRef   = ref(rtdb, `articles/${article.id}/bookmarkedBy/${uid}`);

//     const u1 = onValue(likeRef, s => setLikedMe(!!s.val()));
//     const u2 = onValue(bmRef,   s => setBookmarkedMe(!!s.val()));
//     return () => { u1(); u2(); };
//   }, [uid, article?.id]);

//   /* ---------- handlers ---------- */
//   const handleLike = async e => {
//     e.stopPropagation();
//     if (!uid) return;
//     setLikedMe(x => !x);                     // optimistic flip
//     try   { await likeArticle(article.id, uid); }
//     catch { setLikedMe(x => !x); }           // revert on error
//   };

//   const handleBookmark = async e => {
//     e.stopPropagation();
//     if (!uid) return;
//     setBookmarkedMe(x => !x);
//     try   { await toggleBookmark(article.id, uid); }
//     catch { setBookmarkedMe(x => !x); }
//   };

//   const toggleComments = e => {
//     e.stopPropagation();
//     setShowComments(p => !p);
//   };

//   if (!article) return null;

//   /* ---------- render ---------- */
//   return (
//     <MDBCard className="h-100 shadow-sm position-relative">
//       {/* ——— bookmark ——— */}
//       <MDBBtn size="sm" color="link"
//               className="position-absolute p-0"
//               style={{ top: 8, right: 8 }}
//               onClick={handleBookmark}>
//         <MDBIcon icon="bookmark"
//                  fas={bookmarkedMe}
//                  far={!bookmarkedMe}
//                  style={{ color: bookmarkedMe ? "#ffc107" : "#adb5bd" }} />
//       </MDBBtn>

//       {/* ——— cover image ——— */}
//       <Link to={`/article/${article.id}`} style={{ textDecoration: "none" }}>
//         <MDBCardImage
//           src={article.coverUrl || "https://placehold.co/600x400?text=Image"}
//           alt={article.title}
//           position="top"
//           style={{ objectFit: "cover", height: 200 }}
//         />
//       </Link>

//       <MDBCardBody className="d-flex flex-column gap-1">
//         {/* title */}
//         <Link to={`/article/${article.id}`} className="text-reset text-decoration-none">
//           <h5 className="fw-bold mb-1">{article.title}</h5>
//         </Link>

//         <span className="text-success fw-semibold mb-2">
//           #{article.category || "General"}
//         </span>

//         {/* meta row */}
//         <div className="d-flex align-items-center gap-3 text-muted small mb-3">
//           <span>{new Date(article.createdAt).toLocaleDateString()}</span>

//           <span><MDBIcon icon="eye" className="me-1" />{article.views || 0}</span>

//           <span role="button" onClick={handleLike}
//                 style={{ color: likedMe ? "#0d6efd" : undefined }}>
//             <MDBIcon icon="thumbs-up"
//                      fas={likedMe}
//                      far={!likedMe}
//                      className="me-1" />
//             {likeCount + (likedMe ? 1 : 0)}
//           </span>

//           <span role="button" onClick={toggleComments}>
//             <MDBIcon far icon="comment" className="me-1" />
//             {commentsCnt}
//           </span>
//         </div>

//         {/* —— author block, owner buttons, inline comments —— */}
//         {author && (
//           <Link to={author.uid === uid ? "/profile" : `/u/${author.username || author.uid}`}
//                 className="d-flex align-items-center gap-2 mt-auto text-reset text-decoration-none">
//             <img src={author.avatarUrl || "https://placehold.co/40x40"}
//                  alt={author.displayName}
//                  className="rounded-circle" width="40" height="40" />
//             <div>
//               <div className="fw-semibold">{author.displayName}</div>
//               {author.tagline && <small className="text-muted">{author.tagline}</small>}
//             </div>
//           </Link>
//         )}

//         {isOwner && (
//           <div className="d-flex gap-2 position-absolute" style={{ top: 8, left: 8 }}>
//             <MDBBtn size="sm" color="link" className="p-0" onClick={() => onEdit?.(article)}>
//               <MDBIcon fas icon="edit" />
//             </MDBBtn>
//             <MDBBtn size="sm" color="link" className="p-0 text-danger" onClick={() => onDelete?.(article.id)}>
//               <MDBIcon fas icon="trash-alt" />
//             </MDBBtn>
//           </div>
//         )}

//         {showComments && (
//           <div className="mt-3">
//             <CommentList articleId={article.id} currentUser={currentUser} />
//           </div>
//         )}
//       </MDBCardBody>
//     </MDBCard>
//   );
// }






// // correct one is below

// // src/components/cards/ArticleCard.jsx
// import React, { useState, useEffect } from "react";
// import {
//   MDBCard, MDBCardBody, MDBCardImage, MDBIcon, MDBBtn,
// } from "mdb-react-ui-kit";
// import { Link } from "react-router-dom";
// import { ref, onValue } from "firebase/database";          // ⬅️ new
// import { rtdb }        from "../../configs/firebase";       // ⬅️ new
// import { useAuth }     from "../../context/AuthContext";
// import {
//   likeArticle,
//   streamLikeCount,
//   streamCommentCount,
//   toggleBookmark,
//   streamBookmarkCount,
// } from "../../configs/useArticles";
// import CommentList from "./CommentList";

// export default function ArticleCard({
//   article, author, isOwner=false,
//   onEdit, onDelete,
// }) {
//   const { currentUser } = useAuth();
//   const uid = currentUser?.uid;

//   /* ---------- live state ---------- */
//   const [likedMe,      setLikedMe]      = useState(false);   // colour
//   const [likesTotal,   setLikesTotal]   = useState(0);       // number
//   const [bookmarkedMe, setBookmarkedMe] = useState(false);   // colour
//   const [bmarksTotal,  setBmarksTotal]  = useState(0);       // number
//   const [commentsCnt,  setCommentsCnt]  = useState(0);
//   const [showComments, setShowComments] = useState(false);

//   /* ---------- lightweight listeners ---------- */
//   useEffect(() => {
//     if (!article?.id || !uid) return;

//     // my like / bookmark flags (guaranteed readable)
//     const likeRef = ref(rtdb, `articles/${article.id}/likedBy/${uid}`);
//     const bmRef   = ref(rtdb, `articles/${article.id}/bookmarkedBy/${uid}`);

//     const off1 = onValue(likeRef, s => setLikedMe(!!s.val()));
//     const off2 = onValue(bmRef,   s => setBookmarkedMe(!!s.val()));

//     // total counters
//     const off3 = streamLikeCount   (article.id, setLikesTotal);
//     const off4 = streamBookmarkCount(article.id, setBmarksTotal);
//     const off5 = streamCommentCount(article.id, setCommentsCnt);

//     return () => { off1(); off2(); off3(); off4(); off5(); };
//   }, [article?.id, uid]);

//   /* ---------- actions with optimistic toggle ---------- */
//   const doLike = e => {
//     e.stopPropagation();
//     if (!uid) return;
//     setLikedMe(x => !x);
//     likeArticle(article.id, uid).catch(() => setLikedMe(x => !x));
//   };

//   const doBookmark = e => {
//     e.stopPropagation();
//     if (!uid) return;
//     setBookmarkedMe(x => !x);
//     toggleBookmark(article.id, uid).catch(() => setBookmarkedMe(x => !x));
//   };

//   /* ---------- render ---------- */
//   if (!article) return null;

//   return (
//     <MDBCard className="h-100 shadow-sm position-relative">

//       {/* —— bookmark —— */}
//       <MDBBtn size="sm" color="link" className="position-absolute p-0"
//               style={{ top: 8, right: 8 }} onClick={doBookmark}>
//         <MDBIcon icon="bookmark"
//                  fas={bookmarkedMe} far={!bookmarkedMe}
//                  style={{ color: bookmarkedMe ? "#ffc107" : "#adb5bd" }}/>
//       </MDBBtn>

//       {/* cover */}
//       <Link to={`/article/${article.id}`} className="text-reset">
//         <MDBCardImage src={article.coverUrl || "https://placehold.co/600x400?text=Image"}
//                       position="top" style={{ objectFit: "cover", height: 200 }}/>
//       </Link>

//       <MDBCardBody className="d-flex flex-column gap-1">

//         {/* title & tag */}
//         <Link to={`/article/${article.id}`} className="text-reset text-decoration-none">
//           <h5 className="fw-bold mb-1">{article.title}</h5>
//         </Link>
//         <span className="text-success fw-semibold mb-2">
//           #{article.category || "General"}
//         </span>

//         {/* meta */}
//         <div className="d-flex align-items-center gap-3 text-muted small mb-3">
//           <span>{new Date(article.createdAt).toLocaleDateString()}</span>
//           <span><MDBIcon icon="eye" className="me-1"/>{article.views || 0}</span>

//           <span role="button" onClick={doLike}
//                 style={{ color: likedMe ? "#0d6efd" : undefined }}>
//             <MDBIcon icon="thumbs-up" fas={likedMe} far={!likedMe} className="me-1"/>
//             {likesTotal + ( likedMe && !article.likedBy?.[uid] ? 1 : 0 )
//                        - (!likedMe &&  article.likedBy?.[uid] ? 1 : 0 )}
//           </span>

//           <span role="button" onClick={() => setShowComments(x => !x)}>
//             <MDBIcon far icon="comment" className="me-1"/>{commentsCnt}
//           </span>
//         </div>

//         {/* [ author block | owner buttons | comments ]  — unchanged — */}
//         {/* ... put your existing markup here ... */}

//       </MDBCardBody>
//     </MDBCard>
//   );
// }


// // currect code 2nd below
// // src/components/cards/ArticleCard.jsx
// import React, { useState, useEffect } from "react";
// import {
//   MDBCard, MDBCardBody, MDBCardImage, MDBIcon, MDBBtn,
// } from "mdb-react-ui-kit";
// import { Link } from "react-router-dom";
// import { ref, onValue }   from "firebase/database";
// import { rtdb }           from "../../configs/firebase";
// import { useAuth }        from "../../context/AuthContext";
// import {
//   likeArticle, streamLikeCount,
//   streamCommentCount, toggleBookmark,
//   streamBookmarkCount,
// } from "../../configs/useArticles";
// import CommentList from "./CommentList";

// export default function ArticleCard({
//   article, author, isOwner = false,
//   onEdit, onDelete,
// }) {
//   const { currentUser } = useAuth();
//   const uid = currentUser?.uid;

//   /* ─────────── live state ─────────── */
//   const [likedMe,      setLikedMe]      = useState(false);
//   const [likesTotal,   setLikesTotal]   = useState(0);
//   const [bookmarkedMe, setBookmarkedMe] = useState(false);
//   const [bmarksTotal,  setBmarksTotal]  = useState(0);
//   const [commentsCnt,  setCommentsCnt]  = useState(0);
//   const [showComments, setShowComments] = useState(false);

//   /* ─────────── firebase listeners ─────────── */
//   useEffect(() => {
//     if (!article?.id || !uid) return;
//     const likeRef = ref(rtdb, `articles/${article.id}/likedBy/${uid}`);
//     const bmRef   = ref(rtdb, `articles/${article.id}/bookmarkedBy/${uid}`);

//     const off1 = onValue(likeRef, s => setLikedMe(!!s.val()));
//     const off2 = onValue(bmRef,   s => setBookmarkedMe(!!s.val()));
//     const off3 = streamLikeCount      (article.id, setLikesTotal);
//     const off4 = streamBookmarkCount  (article.id, setBmarksTotal);
//     const off5 = streamCommentCount   (article.id, setCommentsCnt);

//     return () => { off1(); off2(); off3(); off4(); off5(); };
//   }, [article?.id, uid]);

//   /* ─────────── actions ─────────── */
//   const doLike = e => {
//     e.stopPropagation();
//     if (!uid) return;
//     setLikedMe(x => !x);
//     likeArticle(article.id, uid).catch(() => setLikedMe(x => !x));
//   };

//   const doBookmark = e => {
//     e.stopPropagation();
//     if (!uid) return;
//     setBookmarkedMe(x => !x);
//     toggleBookmark(article.id, uid).catch(() => setBookmarkedMe(x => !x));
//   };

//   /* ─────────── render ─────────── */
//   if (!article) return null;

//   /* smart counter offset (optimistic) */
//   const liveLikes = likesTotal +
//       ( likedMe && !article.likedBy?.[uid] ? 1 : 0 ) -
//       (!likedMe &&  article.likedBy?.[uid] ? 1 : 0 );

//   return (
//     <MDBCard className="h-100 shadow-3-strong border-0 position-relative">

//       {/* ───── Bookmark toggle (top-right) ───── */}
//       <MDBBtn size="sm" color="link" className="position-absolute p-0"
//               style={{ top: 12, right: 12 }} onClick={doBookmark}>
//         <MDBIcon icon="bookmark"
//                  fas={bookmarkedMe} far={!bookmarkedMe}
//                  style={{ fontSize:"1.2rem",
//                           color: bookmarkedMe ? "#ffc107" : "#adb5bd" }}/>
//       </MDBBtn>

//       {/* ───── Hero illustration ───── */}
//       <Link to={`/article/${article.id}`} className="text-reset text-decoration-none">
//         <MDBCardImage
//           src={article.coverUrl ||
//                "https://placehold.co/800x450?text=No+Image"}
//           alt={article.title}
//           position="top"
//           style={{ objectFit:"cover", height:260 }}
//         />
//       </Link>

//       {/* ───── Content block (pale bg) ───── */}
//       <MDBCardBody style={{ background:"#f5f6eb" }}
//                    className="d-flex flex-column gap-2 rounded-bottom-4">

//         {/* Title */}
//         <Link to={`/article/${article.id}`} className="text-reset text-decoration-none">
//           <h5 className="fw-bold lh-sm mb-1" style={{ fontSize:"1.4rem" }}>
//             {article.title}
//           </h5>
//         </Link>

//         {/* Hashtag */}
//         <span className="fw-semibold" style={{ color:"#516c3f" }}>
//           #{(article.category || "General")}
//         </span>

//         {/* Meta row */}
//         <div className="d-flex align-items-center flex-wrap gap-4 text-muted small">

//           <span>{new Date(article.createdAt).toLocaleDateString()}</span>

//           <span>
//             <MDBIcon far icon="eye" className="me-1"/>{article.views || 0}
//           </span>

//           <span role="button" onClick={doLike}
//                 style={{ color: likedMe ? "#0d6efd" : undefined }}>
//             <MDBIcon icon="thumbs-up"
//                      fas={likedMe} far={!likedMe} className="me-1"/>
//             {liveLikes}
//           </span>

//           <span role="button" onClick={() => setShowComments(x => !x)}>
//             <MDBIcon far icon="comment" className="me-1"/>{commentsCnt}
//           </span>
//         </div>

//         {/* Author block */}
//         {author && (
//           <Link to={author.uid === uid ? "/profile" : `/u/${author.username || author.uid}`}
//                 className="d-flex align-items-center gap-2 mt-3 text-reset text-decoration-none">
//             <img src={author.avatarUrl || "https://placehold.co/40x40"}
//                  alt={author.displayName}
//                  className="rounded-circle flex-shrink-0" width="40" height="40"/>
//             <div>
//               <div className="fw-semibold">{author.displayName}</div>
//               {author.tagline && (
//                 <small className="text-muted">{author.tagline}</small>
//               )}
//             </div>
//           </Link>
//         )}

//         {/* Owner edit / delete buttons (kept) */}
//         {isOwner && (
//           <div className="d-flex gap-2 position-absolute" style={{ top:12, left:12 }}>
//             <MDBBtn size="sm" color="link" className="p-0"
//                     onClick={() => onEdit?.(article)}>
//               <MDBIcon fas icon="edit"/>
//             </MDBBtn>
//             <MDBBtn size="sm" color="link" className="p-0 text-danger"
//                     onClick={() => onDelete?.(article.id)}>
//               <MDBIcon fas icon="trash-alt"/>
//             </MDBBtn>
//           </div>
//         )}

//         {/* Inline comments toggle */}
//         {showComments && (
//           <div className="mt-4">
//             <CommentList articleId={article.id} currentUser={currentUser}/>
//           </div>
//         )}
//       </MDBCardBody>
//     </MDBCard>
//   );
// }








// // src/components/cards/ArticleCard.jsx
// import React, { useState, useEffect } from "react";
// import {
//   MDBCard,
//   MDBCardBody,
//   MDBCardImage,
//   MDBIcon,
//   MDBBtn,
// } from "mdb-react-ui-kit";
// import { Link } from "react-router-dom";
// import { ref, onValue } from "firebase/database";
// import { rtdb } from "../../configs/firebase";
// import { useAuth } from "../../context/AuthContext";
// import {
//   likeArticle,
//   streamLikeCount,
//   streamCommentCount,
//   toggleBookmark,
//   streamBookmarkCount,
// } from "../../configs/useArticles";
// import CommentList from "./CommentList";

// export default function ArticleCard({
//   article,
//   author,
//   isOwner = false,
//   onEdit,
//   onDelete,
// }) {
//   const { currentUser } = useAuth();
//   const uid = currentUser?.uid;

//   /* ─────────── live state ─────────── */
//   const [likedMe, setLikedMe] = useState(false);
//   const [likesTotal, setLikesTotal] = useState(0);
//   const [bookmarkedMe, setBookmarkedMe] = useState(false);
//   const [commentsCnt, setCommentsCnt] = useState(0);
//   const [showComments, setShowComments] = useState(false);

//   /* ─────────── firebase listeners ─────────── */
//   useEffect(() => {
//     if (!article?.id || !uid) return;

//     const likeRef = ref(rtdb, `articles/${article.id}/likedBy/${uid}`);
//     const bmRef = ref(rtdb, `articles/${article.id}/bookmarkedBy/${uid}`);

//     const off1 = onValue(likeRef, (s) => setLikedMe(!!s.val()));
//     const off2 = onValue(bmRef, (s) => setBookmarkedMe(!!s.val()));
//     const off3 = streamLikeCount(article.id, setLikesTotal);
//     const off4 = streamBookmarkCount(article.id, () => {}); // not shown on card
//     const off5 = streamCommentCount(article.id, setCommentsCnt);

//     return () => {
//       off1();
//       off2();
//       off3();
//       off4();
//       off5();
//     };
//   }, [article?.id, uid]);

//   /* ─────────── actions ─────────── */
//   const doLike = (e) => {
//     e.stopPropagation();
//     if (!uid) return;
//     setLikedMe((x) => !x);
//     likeArticle(article.id, uid).catch(() => setLikedMe((x) => !x));
//   };

//   const doBookmark = (e) => {
//     e.stopPropagation();
//     if (!uid) return;
//     setBookmarkedMe((x) => !x);
//     toggleBookmark(article.id, uid).catch(() => setBookmarkedMe((x) => !x));
//   };

//   /* ─────────── render ─────────── */
//   if (!article) return null;

//   /* optimistic like counter */
//   const liveLikes =
//     likesTotal +
//     (likedMe && !article.likedBy?.[uid] ? 1 : 0) -
//     (!likedMe && article.likedBy?.[uid] ? 1 : 0);

//   return (
//     <MDBCard className="h-100 shadow-3-strong border-0 position-relative">
//       {/* ───── Bookmark toggle ───── */}
//       <MDBBtn
//         size="sm"
//         color="link"
//         className="position-absolute p-0"
//         style={{ top: 12, right: 12 }}
//         onClick={doBookmark}
//       >
//         <MDBIcon
//           icon="bookmark"
//           fas={bookmarkedMe}
//           far={!bookmarkedMe}
//           style={{
//             fontSize: "1.2rem",
//             color: bookmarkedMe ? "#ffc107" : "#adb5bd",
//           }}
//         />
//       </MDBBtn>

//       {/* ───── Cover image ───── */}
//       <Link
//         to={`/article/${article.id}`}
//         className="text-reset text-decoration-none"
//       >
//         <MDBCardImage
//           className="w-100"
//           src={article.coverUrl || "https://placehold.co/800x450?text=No+Image"}
//           alt={article.title}
//           position="top"
//           style={{ objectFit: "cover", height: 260 }}
//         />
//       </Link>

//       {/* ───── Card body ───── */}
//       <MDBCardBody
//         style={{ background: "#f5f6eb" }}
//         className="d-flex flex-column gap-2 rounded-bottom-4"
//       >
//         {/* title */}
//         <Link
//           to={`/article/${article.id}`}
//           className="text-reset text-decoration-none"
//         >
//           <h5 className="fw-bold mb-1 lh-sm" style={{ fontSize: "1.35rem" }}>
//             {article.title}
//           </h5>
//         </Link>

//         {/* tag */}
//         <span className="fw-semibold" style={{ color: "#516c3f" }}>
//           #{article.category || "General"}
//         </span>

//         {/* meta row */}
//         <div className="d-flex align-items-center flex-wrap gap-4 text-muted small">
//           <span>{new Date(article.createdAt).toLocaleDateString()}</span>

//           <span>
//             <MDBIcon far icon="eye" className="me-1" />
//             {article.views || 0}
//           </span>

//           <span
//             role="button"
//             onClick={doLike}
//             style={{ color: likedMe ? "#0d6efd" : undefined }}
//           >
//             <MDBIcon
//               icon="thumbs-up"
//               fas={likedMe}
//               far={!likedMe}
//               className="me-1"
//             />
//             {liveLikes}
//           </span>

//           <span role="button" onClick={() => setShowComments((x) => !x)}>
//             <MDBIcon far icon="comment" className="me-1" />
//             {commentsCnt}
//           </span>
//         </div>

//         {/* author block */}
//         {(() => {
//           /* --------- name & avatar fallbacks --------- */
//           const name =
//             author?.displayName ||
//             `${author?.firstName || ""} ${author?.lastName || ""}`.trim() ||
//             article.authorName ||
//             "Unknown author";

//           const tagline =
//             author?.tagline || article.authorTagline || "";

//           const avatar =
//             author?.avatarUrl ||
//             article.authorAvatar ||
//             "https://placehold.co/40x40";

//           const authorId = author?.uid;

//           const AuthorMarkup = () => (
//             <>
//               <img
//                 src={avatar}
//                 alt={name}
//                 className="rounded-circle flex-shrink-0"
//                 width="40"
//                 height="40"
//               />
//               <div>
//                 <div className="fw-semibold">{name}</div>
//                 {tagline && <small className="text-muted">{tagline}</small>}
//               </div>
//             </>
//           );

//           /* link only if we know the Firestore uid */
//           return authorId ? (
//             <Link
//               to={authorId === uid ? "/profile" : `/u/${author.username || authorId}`}
//               className="d-flex align-items-center gap-2 mt-3 text-reset text-decoration-none"
//             >
//               <AuthorMarkup />
//             </Link>
//           ) : (
//             <div className="d-flex align-items-center gap-2 mt-3">
//               <AuthorMarkup />
//             </div>
//           );
//         })()}

//         {/* owner tools */}
//         {isOwner && (
//           <div
//             className="d-flex gap-2 position-absolute"
//             style={{ top: 12, left: 12 }}
//           >
//             <MDBBtn
//               size="sm"
//               color="link"
//               className="p-0"
//               onClick={() => onEdit?.(article)}
//             >
//               <MDBIcon fas icon="edit" />
//             </MDBBtn>
//             <MDBBtn
//               size="sm"
//               color="link"
//               className="p-0 text-danger"
//               onClick={() => onDelete?.(article.id)}
//             >
//               <MDBIcon fas icon="trash-alt" />
//             </MDBBtn>
//           </div>
//         )}

//         {/* comments inline */}
//         {showComments && (
//           <div className="mt-4">
//             <CommentList articleId={article.id} currentUser={currentUser} />
//           </div>
//         )}
//       </MDBCardBody>
//     </MDBCard>
//   );
// }

// //Correct one below before cost cutting

// /* ------------------------------------------------------------------ */
// /*  src/components/cards/ArticleCard.jsx                              */
// /* ------------------------------------------------------------------ */
// import React, { useState, useEffect } from "react";
// import {
//   MDBCard,
//   MDBBadge,
//   MDBCardBody,
//   MDBCardImage,
//   MDBIcon,
//   MDBBtn,
// } from "mdb-react-ui-kit";
// import { Link, useNavigate  } from "react-router-dom";
// import { ref, onValue } from "firebase/database";
// import { rtdb } from "../../configs/firebase";
// import { useAuth } from "../../context/AuthContext";
// import {
//   likeArticle,
//   streamLikeCount,
//   streamCommentCount,
//   toggleBookmark,
//   streamBookmarkCount,
// } from "../../configs/useArticles";
// import CommentList from "./CommentList";
// import '../../styles/design-tokens.css';

// /* ─────────── ICON ASSETS (your SVGs) ─────────── */
// import ViewIcon from '../../images/icons/View Icon.svg';
// import CommentIcon from '../../images/icons/comment icon.svg';
// import EditIcon from '../../images/icons/edit icon.svg';
// import DeleteIcon from '../../images/icons/delete icon.svg';
// import LikeIcon from '../../images/icons/like icon.svg';

// /* ─────────── responsive helpers ─────────── */
// const coverH   = 260; 
// const titleRem = 1.35;

// export default function ArticleCard({
//   article,
//   author,
//   isOwner = false,
//   onEdit,
//   onDelete,
//   isWinner = false, 
//   isDraft = false, 
//   liveMeta = true,            
// }) {
//   const navigate = useNavigate();
//   const { currentUser } = useAuth();
//   const uid = currentUser?.uid;

//   /* ─────────── live state ─────────── */
//   const [likedMe, setLikedMe] = useState(false);

//   // seed counters from whatever is already in the snapshot
//   const [likesTotal, setLikesTotal] = useState(
//     article?.likesCount ??
//       (article?.likedBy ? Object.keys(article.likedBy).length : 0)
//   );
//   const [bookmarkedMe, setBookmarkedMe] = useState(false);
//   const [commentsCnt, setCommentsCnt] = useState(article?.commentsCount ?? 0);
//   const [showComments, setShowComments] = useState(false);
//   const [imgLoaded, setImgLoaded] = useState(false);
//   /* ─────────── firebase listeners ─────────── */
//   useEffect(() => {
//     if (!article?.id || !liveMeta) return;

//     // listeners that *do* need uid
//     let offLikeMine = () => {};
//     let offBmMine   = () => {};
//     if (uid) {
//       offLikeMine = onValue(
//         ref(rtdb, `articles/${article.id}/likedBy/${uid}`),
//         (s) => setLikedMe(!!s.val())
//       );
//       offBmMine = onValue(
//         ref(rtdb, `articles/${article.id}/bookmarkedBy/${uid}`),
//         (s) => setBookmarkedMe(!!s.val())
//       );
//     }

//     // counters
//     const offLikesTot = streamLikeCount(article.id, setLikesTotal);
//     const offComTot   = streamCommentCount(article.id, setCommentsCnt);

//     // (we don’t show the bookmark counter in this compact card)
//     const offBmTot    = streamBookmarkCount(article.id, () => {});
//     return () => {
//       offLikeMine(); offBmMine(); offLikesTot(); offComTot(); offBmTot();
//     };
//   }, [article?.id, uid, liveMeta]);

//   /* ─────────── actions ─────────── */
//   const doLike = (e) => {
//     e.preventDefault();
//     e.stopPropagation();
//     if (!uid) return;
//     setLikedMe((x) => !x);
//     likeArticle(article.id, uid).catch(() => setLikedMe((x) => !x));
//   };

//   const doBookmark = (e) => {
//     e.preventDefault();
//     e.stopPropagation();
//     if (!uid) return;
//     setBookmarkedMe((x) => !x);
//     toggleBookmark(article.id, uid).catch(() => setBookmarkedMe((x) => !x));
//   };

//   /* ─────────── render ─────────── */
//   if (!article) return null;

//   /* optimistic like counter */
//   const liveLikes =
//     likesTotal +
//     (likedMe && !article.likedBy?.[uid] ? 1 : 0) -
//     (!likedMe && article.likedBy?.[uid] ? 1 : 0);

//   /* fall-backs for author data */
//   const name =
//     author?.displayName ||
//     article.authorName ||
//     author?.username ||
//     "Unknown author";
//   const tagline = author?.tagline || article.authorTagline || "";
//   const avatar =
//     author?.avatarUrl || article.authorAvatar || "https://placehold.co/40x40" || currentUser.photoURL;
//   const authorId = author?.uid;

//   const articleHref = isDraft ? `/write/edit/${article.id}?draft=1` : `/article/${article.id}`;

// const coverSrc =
//     article.coverUrl || "https://placehold.co/800x450?text=No+Image";

//   return (
//     <MDBCard
//       className={`h-100 position-relative ${
//         isWinner ? "border border-warning border-3" : ""
//       }`}
//       style={{
//        background: 'transparent',
//       //  borderRadius: '0.5rem',         // rounded corners on entire card
//        border: 'none',    // light border
//        boxShadow: 'none',              // no MDB shadow
//      }}
//     >
//       {/* ───── Bookmark ───── */}
//     {!isDraft && (
//       <MDBBtn
//         size="sm"
//         color="link"
//         className="position-absolute p-0"
//         style={{ top: 8, right: 8 }}
//         onClick={doBookmark}
//       >
//         <MDBIcon
//           icon="bookmark"
//           fas={bookmarkedMe}
//           far={!bookmarkedMe}
//           style={{
//             fontSize: "1.1rem",
//             color: bookmarkedMe ? "#ffc107" : "#adb5bd",
//           }}
//         />
//       </MDBBtn>
//      )}
//       {/* ───── Cover ───── */}
//       <Link
//         // to={`/article/${article.id}`}
//         to={articleHref}
//         className="text-reset text-decoration-none"
//       >
//          <div style={{ position: 'relative' }}>

//           <div className="article-cover-wrapper">
//             <img
//               src={coverSrc}
//               alt={article.title}
//               loading="lazy"
//               className={
//                 "article-cover-img " + (imgLoaded ? "is-loaded" : "")
//               }
//               onLoad={() => setImgLoaded(true)}
//             />
//           </div>

//            {/* <ProgressiveCover
//             src={article.coverUrl}
//             placeholder={article.coverThumbUrl}
//             alt={article.title}
//           /> */}

//         {/* <MDBCardImage
//           className="w-100"
//           src={article.coverUrl || "https://placehold.co/800x450?text=No+Image"}
//           alt={article.title}
//           position="top"
//           // loading="lazy" 
//           style={{ objectFit: "cover", height: coverH, borderRadius: 0 }}
//         /> */}
       
//            {isDraft && (
//             <div
//               style={{
//                 position: 'absolute',
//                 inset: 0,
//                 display: 'flex',
//                 alignItems: 'center',
//                 justifyContent: 'center',
//               }}
//             >
//               <span
//                 style={{
//                   padding: '10px 18px',
//                   borderRadius: '14px',
//                   border: '2px solid #FFFFFF',
//                   color: '#FFFFFF',
//                   fontFamily: 'Poppins, sans-serif',
//                   fontWeight: 600,
//                   fontSize: 16,
//                   letterSpacing: '0.02em',
//                   background: 'rgba(0,0,0,0.28)',
//                   backdropFilter: 'blur(1px)',
//                 }}
//               >
//                 Draft
//               </span>
//             </div>
//           )}
//         </div>       
//       </Link>

//       {/* ───── Body ───── */}
//       <MDBCardBody
//         // style={{ background: "#f5f6eb" }}
//         style={{ background: "transparent", borderBottomLeftRadius: '0.5rem',borderBottomRightRadius: '0.5rem', }}
//         className="d-flex px-0 flex-column gap-2 rounded-bottom-4"
//       >
//        <div>
//           {new Date(article.createdAt).toLocaleDateString('en-US', {
//              month: 'long',
//              day:   'numeric',
//              year:  'numeric'
//            })}
//         </div>



//         {/* title */}
//         <Link
//           // to={`/article/${article.id}`}
//            to={articleHref}
//           className="text-reset text-decoration-none"
//         >
//           <h5
//             className="fw-bold mb-1 lh-sm article-card-title"
//             style={{ 
//               margin: '0 0 0.75rem',  
//               fontFamily: "Poppins, sans-serif",
//               fontSize: `${titleRem}rem`,
//               fontWeight: 400,
//               fontSize: '18px',
//               lineHeight: '1.4',
//               color: '#0A0A0A', }}
//             >
//             {article.title}
//           </h5>
//         </Link>

//         {/* tag */}
//         {/* <span className="fw-semibold" style={{ color: "#516c3f" }}>
//           #{article.category || "General"}
//         </span> */}
//         <div className="article-card-tags">
//           {Array.isArray(article.tags) && article.tags.map(t => (
//             // <MDBBadge key={t} pill color="success" className="px-2 py-1">
//             //   #{t}
//             // </MDBBadge>
//             <span
//               key={t}
//               style={{
//                 fontFamily: 'Poppins, sans-serif',
//                 fontWeight: 600,           // SemiBold
//                 fontSize: '14px',
//                 lineHeight: '150%',
//                 letterSpacing: '0px',
//                 color: '#5C6B3C',
//               }}
//             >
//               #{t}
//             </span>
//           ))}
//         </div>

//         {/* meta */}
// <div className="d-flex align-items-center flex-nowrap gap-3 text-muted small">
          

// {/* <div className="d-flex align-items-center flex-nowrap gap-3 mt-1"> */}
//           <span className="d-inline-flex align-items-center"> 
//             {/* <MDBIcon far icon="eye" className="me-1" /> */}
//              <img
//               src={ViewIcon}
//               alt=""
//               className="article-meta-icon me-1"
//             />
//             {article.views || 0}
//           </span>

//           <span
//             role="button"
//             onClick={doLike}
//             className="d-inline-flex align-items-center"
//             style={{ color: likedMe ? "#0d6efd" : undefined }}
//           >
//             {/* <MDBIcon
//               icon="thumbs-up"
//               fas={likedMe}
//               far={!likedMe}
//               className="me-1"
//             /> */}
//             <img
//               // fas={likedMe}
//               // far={!likedMe}
//               src={LikeIcon}
//               alt=""
//               className="article-meta-icon me-1"
//             />
//             {liveLikes}
//           </span>

//           <span role="button" onClick={() => setShowComments((x) => !x)}
//              className="d-inline-flex align-items-center"
//              >
//             {/* <MDBIcon far icon="comment" className="me-1" /> */}
//            <img
//               src={CommentIcon}
//               alt=""
//               className="article-meta-icon me-1"
//             />
//             {commentsCnt}
//           </span>
//            </div>
//         {/* </div> */}

//         {/* author */}
//         {authorId ? (
//           <Link
//             to={authorId === uid ? "/profile" : `/u/${author.username || authorId}`}
//             className="d-flex align-items-center gap-2 mt-2 text-reset text-decoration-none"
//           >
//             <img
//               src={avatar}
//               alt={name}
//               className="rounded-circle flex-shrink-0"
//               width="40"
//               height="40"
//             />
//             <div>
//               <div 
//               style={{
//                 fontFamily: 'Poppins, sans-serif',
//                 fontWeight: 600,
//                 fontSize: '14px',
//                 color: '#0A0A0A',
//               }}
//               className="fw-semibold">{name}</div>
//               {tagline && <small 
//               style={{
//                   fontFamily: 'DM Sans, sans-serif',
//                   fontWeight: 400,
//                   fontSize: '12px',
//                   color: '#6c757d',
//                 }}
//                 className="text-muted">{tagline}</small>}
//             </div>
//           </Link>
//         ) : (
//           <div className="d-flex align-items-center gap-2 mt-2">
//             <img
//               src={avatar}
//               alt={name}
//               className="rounded-circle  flex-shrink-0"
//               width="40"
//               height="40"
//             />
//             <div>
//               <div className="fw-semibold">{name}</div>
//               {tagline && <small className="text-muted">{tagline}</small>}
//             </div>
//           </div>
//         )}

//         {/* owner tools */}
//         {isOwner && (
//           <div
//             className="d-flex gap-2 position-absolute"
//             style={{ top: 8, left: 8 }}
//           >
//             <MDBBtn
//               size="sm"
//               color="link"
//               className="p-0"
//                aria-label="Edit article"
//               onClick={e => {
//                 e.preventDefault();
//                 e.stopPropagation();
//                 if (onEdit) onEdit(article);
//                 else navigate(`/write/edit/${article.id}`);
//               }}
//             >
//               {/* <MDBIcon fas icon="edit" /> */}
//                <img
//                 src={EditIcon}
//                 alt="Edit"
//                 className="article-tool-icon"
//               />
//             </MDBBtn>
//             <MDBBtn
//               size="sm"
//               color="link"
//               className="p-0 text-danger"
//               aria-label="Delete article"
//                onClick={e => {
//         e.preventDefault();
//         e.stopPropagation();
//         if (!onDelete) return;
//         if (window.confirm("Delete this item?")) onDelete(article);  // <-- pass object
//       }}
//             >
//               {/* <MDBIcon fas icon="trash-alt" /> */}
//               <img
//                 src={DeleteIcon}
//                 alt="Delete"
//                 className="article-tool-icon"
//               />
//             </MDBBtn>
//           </div>
//         )}

//         {/* comments inline */}
//         {/* {showComments && (
//           <div className="mt-3">
//             <CommentList articleId={article.id} currentUser={currentUser} />
//           </div>
//         )} */}
//       </MDBCardBody>
//     </MDBCard>
//   );
// }

// /* ─────────── simple responsive tweaks ─────────── */
// const css = `

// .article-meta-icon{
//   width: 18px;
//   height: 18px;
//   object-fit: contain;
//   display: inline-block;
// }

// .article-tool-icon{
//   width: 18px;
//   height: 18px;
//   object-fit: contain;
//   display: inline-block;
// }

// .article-card-title{
//   display: -webkit-box;
//   -webkit-box-orient: vertical;
//   -webkit-line-clamp: 2;   /* show max 2 lines */
//   overflow: hidden;
//   text-overflow: ellipsis;
//   min-height: 2.8em;       /* ≈ 2 lines with line-height:1.4 */
// }

//  /* 2-line clamp for tags */
// .article-card-tags {
//   font-family: 'Poppins', sans-serif;
//   font-weight: 600;
//   font-size: 14px;
//   line-height: 1.4;
//   letter-spacing: 0px;
//   color: #5C6B3C;

//   display: -webkit-box;
//   -webkit-box-orient: vertical;
//   -webkit-line-clamp: 2;      /* show max 2 lines */
//   overflow: hidden;
//   text-overflow: ellipsis;

//   min-height: 2.8em;          /* same as title → perfect alignment */
//   white-space: normal;
// }


// /* Progressive cover */
// .article-cover-wrapper{
//   position: relative;
//   width: 100%;
//   height: ${coverH}px;
//   overflow: hidden;
// }


// .article-cover-img{
//   position: absolute;
//   inset: 0;
//   width: 100%;
//   height: 100%;
//   object-fit: cover;
//   transition: opacity 0.4s ease, filter 0.4s ease, transform 0.4s ease;
// }

// .article-cover-blur{
//   filter: blur(12px);
//   transform: scale(1.05);
// }

// .article-cover-img.is-hidden{
//   opacity: 0;
// }

// .article-cover-img.is-visible{
//   opacity: 1;
// }


// @media (max-width: 991.98px) {
//   .mdb-card-image[style*="height: ${coverH}px"] { height: 220px !important; }
//   h5[style*="font-size: ${titleRem}rem"]      { font-size: 1.2rem !important; }
// }
// @media (max-width: 767.98px) {
//   .mdb-card-image[style*="height: ${coverH}px"] { height: 180px !important; }
//   h5[style*="font-size: ${titleRem}rem"]      { font-size: 1.05rem !important; }
// }`;
// const styleSheet = document.createElement("style");
// styleSheet.type = "text/css";
// styleSheet.innerText = css;
// document.head.appendChild(styleSheet);



// above one is correct before cost cutting

/* ------------------------------------------------------------------ */
/*  src/components/cards/ArticleCard.jsx                              */
/* ------------------------------------------------------------------ */
import React, { useState, useEffect } from "react";
import {
  MDBCard,
  MDBCardBody,
  MDBIcon,
  MDBBtn,
} from "mdb-react-ui-kit";
import { Link, useNavigate } from "react-router-dom";
import { ref, onValue } from "firebase/database";
import { rtdb } from "../../configs/firebase";
import { useAuth } from "../../context/AuthContext";
import {
  likeArticle,
  streamLikeCount,
  streamCommentCount,
  toggleBookmark,
} from "../../configs/useArticles";
import "../../styles/design-tokens.css";

/* ─────────── ICON ASSETS (your SVGs) ─────────── */
import ViewIcon from "../../images/icons/View Icon.svg";
import CommentIcon from "../../images/icons/comment icon.svg";
import EditIcon from "../../images/icons/edit icon.svg";
import DeleteIcon from "../../images/icons/delete icon.svg";
import LikeIcon from "../../images/icons/like icon.svg";

/* ─────────── responsive helpers ─────────── */
const coverH = 260;
const titleRem = 1.35;

const COVER_FALLBACK = "https://placehold.co/800x450?text=No+Image";
const AVATAR_FALLBACK = "https://placehold.co/40x40";

export default function ArticleCard({
  article,
  author,
  isOwner = false,
  onEdit,
  onDelete,
  isWinner = false,
  isDraft = false,
  liveMeta = true,
}) {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const uid = currentUser?.uid;

  /* ─────────── live state ─────────── */
  const [likedMe, setLikedMe] = useState(false);

  // Seed counter from snapshot, then Firebase listener keeps it updated.
  const [likesTotal, setLikesTotal] = useState(
    article?.likesCount ??
      (article?.likedBy ? Object.keys(article.likedBy).length : 0)
  );

  const [bookmarkedMe, setBookmarkedMe] = useState(false);
  const [commentsCnt, setCommentsCnt] = useState(article?.commentsCount ?? 0);
  const [showComments, setShowComments] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);
  const [coverError, setCoverError] = useState(false);
  const [avatarError, setAvatarError] = useState(false);

  /* ─────────── firebase listeners ─────────── */
  useEffect(() => {
    if (!article?.id || !liveMeta) return;

    let offLikeMine = () => {};
    let offBmMine = () => {};

    if (uid) {
      offLikeMine = onValue(
        ref(rtdb, `articles/${article.id}/likedBy/${uid}`),
        (snapshot) => setLikedMe(!!snapshot.val())
      );

      offBmMine = onValue(
        ref(rtdb, `articles/${article.id}/bookmarkedBy/${uid}`),
        (snapshot) => setBookmarkedMe(!!snapshot.val())
      );
    }

    const offLikesTotal = streamLikeCount(article.id, setLikesTotal);
    const offCommentsTotal = streamCommentCount(article.id, setCommentsCnt);

    /*
     * Cost saving:
     * Removed streamBookmarkCount(article.id, () => {})
     * because this compact card does not display bookmark count.
     * Bookmark icon state still works through offBmMine above.
     */
    return () => {
      offLikeMine();
      offBmMine();
      offLikesTotal();
      offCommentsTotal();
    };
  }, [article?.id, uid, liveMeta]);

  useEffect(() => {
    setImgLoaded(false);
    setCoverError(false);
    setAvatarError(false);
  }, [article?.id, article?.coverUrl, author?.avatarUrl, article?.authorAvatar]);

  /* ─────────── actions ─────────── */
  const doLike = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!uid || !article?.id) return;

    /*
     * Important:
     * Do not optimistically change likedMe or likesTotal here.
     * likedMe is updated by articles/{id}/likedBy/{uid}
     * likesTotal is updated by articles/{id}/likesCount
     * This prevents the old +2 / -2 bug.
     */
    likeArticle(article.id, uid).catch((err) => {
      console.error("likeArticle failed:", err);
    });
  };

  const doBookmark = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!uid || !article?.id) return;

    setBookmarkedMe((value) => !value);

    toggleBookmark(article.id, uid).catch((err) => {
      console.error("toggleBookmark failed:", err);
      setBookmarkedMe((value) => !value);
    });
  };

  /* ─────────── render ─────────── */
  if (!article) return null;

  /*
   * Live Firebase counter.
   * Do not add/subtract optimistic values here.
   */
  const liveLikes = likesTotal;

  /* fall-backs for author data */
  const name =
    author?.displayName ||
    article.authorName ||
    author?.username ||
    "Unknown author";

  const tagline = author?.tagline || article.authorTagline || "";

  const avatar =
    !avatarError
      ? author?.avatarUrl ||
        article.authorAvatar ||
        currentUser?.photoURL ||
        AVATAR_FALLBACK
      : AVATAR_FALLBACK;

  const authorId = author?.uid;

  const articleHref = isDraft
    ? `/write/edit/${article.id}?draft=1`
    : `/article/${article.id}`;

  const coverSrc =
    !coverError && article.coverUrl ? article.coverUrl : COVER_FALLBACK;

  return (
    <MDBCard
      className={`h-100 position-relative ${
        isWinner ? "border border-warning border-3" : ""
      }`}
      style={{
        background: "transparent",
        border: "none",
        boxShadow: "none",
      }}
    >
      {/* ───── Bookmark ───── */}
      {!isDraft && (
        <MDBBtn
          size="sm"
          color="link"
          className="position-absolute p-0"
          style={{ top: 8, right: 8 }}
          onClick={doBookmark}
        >
          <MDBIcon
            icon="bookmark"
            fas={bookmarkedMe}
            far={!bookmarkedMe}
            style={{
              fontSize: "1.1rem",
              color: bookmarkedMe ? "#ffc107" : "#adb5bd",
            }}
          />
        </MDBBtn>
      )}

      {/* ───── Cover ───── */}
      <Link to={articleHref} className="text-reset text-decoration-none">
        <div style={{ position: "relative" }}>
          <div className="article-cover-wrapper">
            <img
              src={coverSrc}
              alt={article.title || "Article cover"}
              loading="lazy"
              decoding="async"
              className={"article-cover-img " + (imgLoaded ? "is-loaded" : "")}
              onLoad={() => setImgLoaded(true)}
              onError={() => {
                setCoverError(true);
                setImgLoaded(true);
              }}
            />
          </div>

          {isDraft && (
            <div
              style={{
                position: "absolute",
                inset: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <span
                style={{
                  padding: "10px 18px",
                  borderRadius: "14px",
                  border: "2px solid #FFFFFF",
                  color: "#FFFFFF",
                  fontFamily: "Poppins, sans-serif",
                  fontWeight: 600,
                  fontSize: 16,
                  letterSpacing: "0.02em",
                  background: "rgba(0,0,0,0.28)",
                  backdropFilter: "blur(1px)",
                }}
              >
                Draft
              </span>
            </div>
          )}
        </div>
      </Link>

      {/* ───── Body ───── */}
      <MDBCardBody
        style={{
          background: "transparent",
          borderBottomLeftRadius: "0.5rem",
          borderBottomRightRadius: "0.5rem",
        }}
        className="d-flex px-0 flex-column gap-2 rounded-bottom-4"
      >
        <div>
          {new Date(article.createdAt).toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric",
          })}
        </div>

        {/* title */}
        <Link to={articleHref} className="text-reset text-decoration-none">
          <h5
            className="fw-bold mb-1 lh-sm article-card-title"
            style={{
              margin: "0 0 0.75rem",
              fontFamily: "Poppins, sans-serif",
              fontWeight: 400,
              fontSize: "18px",
              lineHeight: "1.4",
              color: "#0A0A0A",
            }}
          >
            {article.title}
          </h5>
        </Link>

        {/* tags */}
        <div className="article-card-tags">
          {Array.isArray(article.tags) &&
            article.tags.map((tag) => (
              <span
                key={tag}
                style={{
                  fontFamily: "Poppins, sans-serif",
                  fontWeight: 600,
                  fontSize: "14px",
                  lineHeight: "150%",
                  letterSpacing: "0px",
                  color: "#5C6B3C",
                }}
              >
                #{tag}
              </span>
            ))}
        </div>

        {/* meta */}
        <div className="d-flex align-items-center flex-nowrap gap-3 text-muted small">
          <span className="d-inline-flex align-items-center">
            <img src={ViewIcon} alt="" className="article-meta-icon me-1" />
            {article.views || 0}
          </span>

          <span
            role="button"
            onClick={doLike}
            className="d-inline-flex align-items-center"
            style={{ color: likedMe ? "#0d6efd" : undefined }}
          >
            <img src={LikeIcon} alt="" className="article-meta-icon me-1" />
            {liveLikes}
          </span>

          <span
            role="button"
            onClick={() => setShowComments((value) => !value)}
            className="d-inline-flex align-items-center"
          >
            <img src={CommentIcon} alt="" className="article-meta-icon me-1" />
            {commentsCnt}
          </span>
        </div>

        {/* author */}
        {authorId ? (
          <Link
            to={authorId === uid ? "/profile" : `/u/${author.username || authorId}`}
            className="d-flex align-items-center gap-2 mt-2 text-reset text-decoration-none"
          >
            <img
              src={avatar}
              alt={name}
              className="rounded-circle flex-shrink-0"
              width="40"
              height="40"
              loading="lazy"
              decoding="async"
              onError={() => setAvatarError(true)}
            />

            <div>
              <div
                style={{
                  fontFamily: "Poppins, sans-serif",
                  fontWeight: 600,
                  fontSize: "14px",
                  color: "#0A0A0A",
                }}
                className="fw-semibold"
              >
                {name}
              </div>

              {tagline && (
                <small
                  style={{
                    fontFamily: "DM Sans, sans-serif",
                    fontWeight: 400,
                    fontSize: "12px",
                    color: "#6c757d",
                  }}
                  className="text-muted"
                >
                  {tagline}
                </small>
              )}
            </div>
          </Link>
        ) : (
          <div className="d-flex align-items-center gap-2 mt-2">
            <img
              src={avatar}
              alt={name}
              className="rounded-circle flex-shrink-0"
              width="40"
              height="40"
              loading="lazy"
              decoding="async"
              onError={() => setAvatarError(true)}
            />

            <div>
              <div className="fw-semibold">{name}</div>
              {tagline && <small className="text-muted">{tagline}</small>}
            </div>
          </div>
        )}

        {/* owner tools */}
        {isOwner && (
          <div
            className="d-flex gap-2 position-absolute"
            style={{ top: 8, left: 8 }}
          >
            <MDBBtn
              size="sm"
              color="link"
              className="p-0"
              aria-label="Edit article"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();

                if (onEdit) onEdit(article);
                else navigate(`/write/edit/${article.id}`);
              }}
            >
              <img src={EditIcon} alt="Edit" className="article-tool-icon" />
            </MDBBtn>

            <MDBBtn
              size="sm"
              color="link"
              className="p-0 text-danger"
              aria-label="Delete article"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();

                if (!onDelete) return;
                if (window.confirm("Delete this item?")) onDelete(article);
              }}
            >
              <img src={DeleteIcon} alt="Delete" className="article-tool-icon" />
            </MDBBtn>
          </div>
        )}

        {/* comments inline intentionally disabled */}
      </MDBCardBody>
    </MDBCard>
  );
}

/* ─────────── simple responsive tweaks ─────────── */
const css = `
.article-meta-icon{
  width: 18px;
  height: 18px;
  object-fit: contain;
  display: inline-block;
}

.article-tool-icon{
  width: 18px;
  height: 18px;
  object-fit: contain;
  display: inline-block;
}

.article-card-title{
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
  text-overflow: ellipsis;
  min-height: 2.8em;
}

.article-card-tags {
  font-family: 'Poppins', sans-serif;
  font-weight: 600;
  font-size: 14px;
  line-height: 1.4;
  letter-spacing: 0px;
  color: #5C6B3C;

  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
  text-overflow: ellipsis;

  min-height: 2.8em;
  white-space: normal;
}

.article-cover-wrapper{
  position: relative;
  width: 100%;
  height: ${coverH}px;
  overflow: hidden;
}

.article-cover-img{
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: opacity 0.4s ease, filter 0.4s ease, transform 0.4s ease;
}

.article-cover-blur{
  filter: blur(12px);
  transform: scale(1.05);
}

.article-cover-img.is-hidden{
  opacity: 0;
}

.article-cover-img.is-visible{
  opacity: 1;
}

@media (max-width: 991.98px) {
  .mdb-card-image[style*="height: ${coverH}px"] { height: 220px !important; }
  h5[style*="font-size: ${titleRem}rem"] { font-size: 1.2rem !important; }
}

@media (max-width: 767.98px) {
  .mdb-card-image[style*="height: ${coverH}px"] { height: 180px !important; }
  h5[style*="font-size: ${titleRem}rem"] { font-size: 1.05rem !important; }
}
`;

if (
  typeof document !== "undefined" &&
  !document.getElementById("article-card-inline-css")
) {
  const styleSheet = document.createElement("style");
  styleSheet.id = "article-card-inline-css";
  styleSheet.type = "text/css";
  styleSheet.innerText = css;
  document.head.appendChild(styleSheet);
}