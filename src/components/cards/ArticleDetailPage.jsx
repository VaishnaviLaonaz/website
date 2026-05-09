// // src/pages/ArticleDetailPage.jsx
// import React, { useEffect, useState } from "react";
// import {
//   MDBContainer,
//   MDBRow,
//   MDBCol,
//   MDBCard,
//   MDBCardBody,
//   MDBCardImage,
//   MDBIcon,
//   MDBSpinner,
//   MDBBtn,
//   MDBInputGroup,
// } from "mdb-react-ui-kit";
// import { useParams, Link } from "react-router-dom";
// import { getDatabase, ref as rdbRef, get as rdbGet } from "firebase/database";
// import {
//   doc,
//   getDoc,
//   onSnapshot,      
// } from "firebase/firestore";
// import { db as fsDb } from "../../configs/firebase";
// import { useAuth } from "../../context/AuthContext";
// import {
//   streamComments,
//   addComment,
//   streamCommentLikes,
//   likeComment,
//   updateComment,
//   deleteComment,

//   incrementView,       
//   streamViews,

// } from "../../configs/useArticles";

// export default function ArticleDetailPage() {
//   const { articleId } = useParams();
//   const { currentUser } = useAuth();

//   const uid               = currentUser?.uid; 

//   const [article, setArticle]   = useState(null);
//   const [author, setAuthor]     = useState(null);
//   const [loading, setLoading]   = useState(true);

//   const [profile, setProfile]   = useState(null);        

//   const [comments, setComments]       = useState([]);
//   const [commentLikes, setCommentLikes] = useState({});
//   const [newComment, setNewComment]   = useState("");
//   const [editingId, setEditingId]     = useState(null);
//   const [editText,  setEditText]      = useState("");

//   const [views,      setViews]        = useState(0); 

//   /* ───────── fetch article & author ───────── */
//   // useEffect(() => {
//   //   async function fetchArticle() {
//   //     try {
//   //       const rtdb  = getDatabase();
//   //       const snap  = await rdbGet(rdbRef(rtdb, `articles/${articleId}`));
//   //       if (snap.exists()) {
//   //         const data = snap.val();
//   //         setArticle(data);

//   //         const authorSnap = await getDoc(doc(fsDb, "users", data.authorId));
//   //         if (authorSnap.exists()) setAuthor(authorSnap.data());
//   //       }
//   //     } catch (err) {
//   //       console.error(err);
//   //     } finally {
//   //       setLoading(false);
//   //     }
//   //   }
//   //   fetchArticle();
//   // }, [articleId]);

//   useEffect(() => {
//     (async () => {
//       try {
//         const snap = await rdbGet(rdbRef(getDatabase(), `articles/${articleId}`));
//         if (!snap.exists()) { setLoading(false); return; }
//         const data = snap.val();
//         setArticle({ id: articleId, ...data });

//         const aSnap = await getDoc(doc(fsDb, 'users', data.authorId));
//         aSnap.exists() && setAuthor(aSnap.data());
//       } catch (err) { console.error(err); }
//       finally { setLoading(false); }
//     })();
//   }, [articleId]);

//   /* ───────── live comments & likes ───────── */
//   useEffect(() => {
//     if (!articleId) return;
//     const unsubC = streamComments(articleId, setComments);
//     const unsubL = streamCommentLikes(articleId, setCommentLikes);
//     return () => {
//       unsubC();
//       unsubL();
//     };
//   }, [articleId]);


//   useEffect(() => {
//     if (!articleId) return;
//     const unsub = streamViews(articleId, setViews);
//     incrementView(articleId, uid);
//     return unsub;
//   }, [articleId, uid]);

//   /* ───────── current-user profile (for username) ───────── */
//   useEffect(() => {
//     if (!uid) return;
//     const unsub = onSnapshot(doc(fsDb, "users", uid), (snap) => {
//       if (snap.exists()) setProfile(snap.data());
//     });
//     return unsub;
//   }, [uid]);

//   /* ───────── helpers ───────── */
//   const handlePost = async () => {
//     if (!uid || !newComment.trim()) return;
//     await addComment(articleId, {
//       uid: currentUser.uid,
//       username:
//         profile?.username ||
//         currentUser.displayName ||
//         currentUser.email.split("@")[0],
//       avatarUrl: profile?.avatarUrl || currentUser.photoURL,
//       text: newComment.trim(),
//       createdAt: Date.now(),
//     });
//     setNewComment("");
//   };

//   const handleLikeComment = (cid) => likeComment(articleId, cid, uid);

//   const startEdit   = (c)    => { setEditingId(c.id); setEditText(c.text); };
//   const saveEdit    = async (cid) => {
//     await updateComment(articleId, cid, { text: editText, updatedAt: Date.now() });
//     setEditingId(null); setEditText("");
//   };
//   const cancelEdit  = () => setEditingId(null);
//   const handleDelete = async (cid) => deleteComment(articleId, cid);

//   if (loading)            return <MDBSpinner className="d-block mx-auto my-5" />;
//   if (!article)           return <p className="text-center my-5">Article not found.</p>;

//   const sortedComments = [...comments].sort((a, b) => b.createdAt - a.createdAt);
//   const createdDate    = new Date(article.createdAt);
//   const updatedDate    = new Date(article.updatedAt);
//   const hasBeenEdited  = article.updatedAt !== article.createdAt;

//   return (
//     <MDBContainer className="py-5">
//       <MDBRow className="justify-content-center">
//         <MDBCol lg="8">
//           {/* ——— Article Card ——— */}
//           <MDBCard className="shadow mb-4">
//             <MDBCardImage
//               src={article.coverUrl || "https://placehold.co/800x400?text=No+Image"}
//               alt={article.title}
//               position="top"
//               style={{ height: "400px", objectFit: "cover" }}
//             />
//             <MDBCardBody>
//               <h2 className="fw-bold mb-3">{article.title}</h2>
//               <div className="text-muted mb-3" style={{ fontSize: ".9rem" }}>
//                 #{article.category || "General"}
//               </div>
//               <div className="text-muted mb-4" style={{ fontSize: ".8rem" }}>
//                 {hasBeenEdited
//                   ? `Last edited: ${updatedDate.toLocaleDateString()}`
//                   : `Published: ${createdDate.toLocaleDateString()}`}
//               </div>

//               {author && (
//                 <Link
//                   to={`/u/${author.username || author.uid}`}
//                   className="d-flex align-items-center gap-2 mb-4 text-reset"
//                   style={{ textDecoration: "none" }}
//                 >
//                   <img
//                     src={author.avatarUrl || "https://placehold.co/40x40"}
//                     alt={author.displayName}
//                     className="rounded-circle"
//                     width="40"
//                     height="40"
//                   />
//                   <span className="fw-semibold">{author.displayName}</span>
//                 </Link>
//               )}

//               <p className="mb-4" style={{ lineHeight: 1.6 }}>{article.body}</p>

//               <div className="text-muted d-flex gap-4 mb-5" style={{ fontSize: ".9rem" }}>
//                 <span><MDBIcon far icon="eye" className="me-1" />{article.views || 0}</span>
//                 <span><MDBIcon far icon="thumbs-up" className="me-1" />{article.likes || 0}</span>
//               </div>
//             </MDBCardBody>
//           </MDBCard>

//           {/* ——— Comments Section ——— */}
//           <div className="mb-5">
//             <h5 className="mb-3">Comments</h5>

//             {/* Input */}
//             <div className="d-flex align-items-start gap-3 mb-4">
//               <Link to={`/u/${profile?.username || currentUser.uid}`}>
//                 <img
//                   src={profile?.avatarUrl || currentUser.photoURL || "https://placehold.co/40x40"}
//                   alt={profile?.username || currentUser.displayName || "Me"}
//                   className="rounded-circle"
//                   width="40"
//                   height="40"
//                 />
//               </Link>

//               <MDBInputGroup>
//                 <textarea
//                   className="form-control"
//                   placeholder="Add your comment..."
//                   rows={2}
//                   value={newComment}
//                   onChange={(e) => setNewComment(e.target.value)}
//                 />
//                 <MDBBtn onClick={handlePost}>Post</MDBBtn>
//               </MDBInputGroup>
//             </div>

//             {/* List */}
//             {sortedComments.map(c => {
//               const cLikes = commentLikes[c.id] || [];
//               const liked  = cLikes.includes(uid);
//               return (
//                 <div key={c.id} className="mb-4">
//                   <div className="d-flex align-items-start gap-3">
//                     <Link to={`/u/${c.username}`}>
//                       <img
//                         src={c.avatarUrl || "https://placehold.co/32x32"}
//                         alt={c.username}
//                         className="rounded-circle"
//                         width="32"
//                         height="32"
//                       />
//                     </Link>

//                     <div className="w-100">
//                       <div className="d-flex justify-content-between">
//                         <Link
//                           to={`/u/${c.username}`}
//                           className="fw-semibold text-reset"
//                           style={{ textDecoration: "none" }}
//                         >
//                           {c.username}
//                         </Link>
//                         <small className="text-muted">
//                           {new Date(c.createdAt).toLocaleDateString()}
//                         </small>
//                       </div>

//                       {editingId === c.id ? (
//                         <div className="d-flex gap-2 mt-2">
//                           <input
//                             className="form-control"
//                             value={editText}
//                             onChange={(e) => setEditText(e.target.value)}
//                           />
//                           <MDBBtn size="sm" onClick={() => saveEdit(c.id)}>Save</MDBBtn>
//                           <MDBBtn size="sm" color="link" onClick={cancelEdit}>Cancel</MDBBtn>
//                         </div>
//                       ) : (
//                         <p className="mb-1">{c.text}</p>
//                       )}

//                       <div className="d-flex gap-4 text-muted small">
//                         <span role="button" onClick={() => handleLikeComment(c.id)}>
//                           <MDBIcon fas icon={liked ? "thumbs-up" : ["far", "thumbs-up"]} className="me-1" />
//                           {(cLikes[c.id] || []).length}
//                         </span>

//                         {c.uid === currentUser.uid && editingId !== c.id && (
//                           <>
//                             <span role="button" onClick={() => startEdit(c)}>
//                               <MDBIcon fas icon="edit" className="me-1" />Edit
//                             </span>
//                             <span role="button" onClick={() => handleDelete(c.id)}>
//                               <MDBIcon fas icon="trash-alt" className="me-1 text-danger" />Delete
//                             </span>
//                           </>
//                         )}
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               );
//             })}
//           </div>
//         </MDBCol>
//       </MDBRow>
//     </MDBContainer>
//   );
// }





// // src/pages/ArticleDetailPage.jsx
// import React, { useEffect, useState } from 'react';
// import {
//   MDBContainer, MDBRow, MDBCol, MDBCard, MDBCardBody, MDBCardImage,
//   MDBIcon, MDBSpinner, MDBBtn, MDBInputGroup,
// } from 'mdb-react-ui-kit';
// import { useParams, Link } from 'react-router-dom';
// import { getDatabase, ref as rdbRef, get as rdbGet } from 'firebase/database';
// import { doc, getDoc, onSnapshot } from 'firebase/firestore';
// import { db as fsDb } from '../../configs/firebase';
// import { useAuth } from '../../context/AuthContext';
// import {
//   streamComments, addComment, streamCommentLikes, likeComment,
//   updateComment, deleteComment,
//   incrementView, streamViews,toggleBookmark, streamBookmarks, likeArticle, streamLikes
// } from '../../configs/useArticles';

// export default function ArticleDetailPage() {
//   const { articleId }   = useParams();
//   const { currentUser } = useAuth();
//   const uid             = currentUser?.uid;          // single source of truth

//   /* ─── state ─── */
//   const [article, setArticle]   = useState(null);
//   const [author,  setAuthor]    = useState(null);
//   const [loading, setLoading]   = useState(true);
//   const [profile, setProfile]   = useState(null);

//   const [comments, setComments]     = useState([]);
//   const [commentLikes, setCLikes]   = useState({});
//   const [newComment, setNewComment] = useState('');
//   const [editingId,  setEditingId]  = useState(null);
//   const [editText,   setEditText]   = useState('');
//   const [views,      setViews]      = useState(0);

//   /* ─── fetch article & author ─── */
//   useEffect(() => {
//     (async () => {
//       try {
//         const snap = await rdbGet(rdbRef(getDatabase(), `articles/${articleId}`));
//         if (!snap.exists()) { setLoading(false); return; }
//         const data = snap.val();
//         setArticle({ id: articleId, ...data });

//         const aSnap = await getDoc(doc(fsDb, 'users', data.authorId));
//         aSnap.exists() && setAuthor(aSnap.data());
//       } catch (err) { console.error(err); }
//       finally       { setLoading(false); }
//     })();
//   }, [articleId]);

//   /* ─── live comments / likes ─── */
//   useEffect(() => {
//     if (!articleId) return;
//     const u1 = streamComments     (articleId, setComments);
//     const u2 = streamCommentLikes (articleId, setCLikes);
//     return () => { u1(); u2(); };
//   }, [articleId]);

//   /* ─── live views + unique increment ─── */
//   useEffect(() => {
//     if (!articleId) return;
//     const unsub = streamViews(articleId, v => setViews(v || 0));
//     incrementView(articleId, uid);
//     return unsub;
//   }, [articleId, uid]);

//   /* ─── viewer profile (for avatar / name) ─── */
//   useEffect(() => {
//     if (!uid) return;
//     return onSnapshot(doc(fsDb, 'users', uid), s => s.exists() && setProfile(s.data()));
//   }, [uid]);

//   /* ─── helpers ─── */
//   const handlePost = async () => {
//     if (!uid || !newComment.trim()) return;
//     await addComment(articleId, {
//       uid,
//       username: profile?.username || currentUser.displayName || currentUser.email.split('@')[0],
//       avatarUrl: profile?.avatarUrl || currentUser.photoURL,
//       text: newComment.trim(),
//       createdAt: Date.now(),
//     });
//     setNewComment('');
//   };

//   const handleLikeComment = cid => uid && likeComment(articleId, cid, uid);
//   const startEdit  = c  => { setEditingId(c.id); setEditText(c.text); };
//   const saveEdit   = cid => updateComment(articleId, cid, { text: editText, updatedAt: Date.now() })
//                              .then(() => { setEditingId(null); setEditText(''); });
//   const cancelEdit = ()  => setEditingId(null);
//   const handleDelete = cid => deleteComment(articleId, cid);

//   /* ─── guards ─── */
//   if (loading)  return <MDBSpinner className="d-block mx-auto my-5" />;
//   if (!article) return <p className="text-center my-5">Article not found.</p>;

//   const sorted = [...comments].sort((a, b) => b.createdAt - a.createdAt);
//   const created = new Date(article.createdAt);
//   const updated = new Date(article.updatedAt);
//   const edited  = article.updatedAt !== article.createdAt;

//   return (
//     <MDBContainer className="py-5">
//       <MDBRow className="justify-content-center">
//         <MDBCol lg="8">
//           {/* ─── Article ─── */}
//           <MDBCard className="shadow mb-4">
//             <MDBCardImage
//               src={article.coverUrl || 'https://placehold.co/800x400?text=No+Image'}
//               alt={article.title}
//               position="top"
//               style={{ height: '400px', objectFit: 'cover' }}
//             />
//             <MDBCardBody>
//               <h2 className="fw-bold mb-3">{article.title}</h2>
//               <div className="text-muted mb-3" style={{ fontSize: '.9rem' }}>#{article.category || 'General'}</div>
//               <div className="text-muted mb-4" style={{ fontSize: '.8rem' }}>
//                 {edited
//                   ? `Last edited: ${updated.toLocaleDateString()}`
//                   : `Published: ${created.toLocaleDateString()}`}
//               </div>

//               {author && (
//                 <Link
//                   to={`/u/${author.username || author.uid}`}
//                   className="d-flex align-items-center gap-2 mb-4 text-reset"
//                   style={{ textDecoration: 'none' }}
//                 >
//                   <img
//                     src={author.avatarUrl || 'https://placehold.co/40x40'}
//                     alt={author.displayName}
//                     className="rounded-circle" width="40" height="40"
//                   />
//                   <span className="fw-semibold">{author.displayName}</span>
//                 </Link>
//               )}

//               <p className="mb-4" style={{ lineHeight: 1.6 }}>{article.body}</p>

//               <div className="text-muted d-flex gap-4 mb-5" style={{ fontSize: '.9rem' }}>
//                 <span><MDBIcon far icon="eye"       className="me-1" />{views}</span>
//                 <span><MDBIcon far icon="thumbs-up" className="me-1" />{article.likes || 0}</span>
//               </div>
//             </MDBCardBody>
//           </MDBCard>

//           {/* ─── Comments ─── */}
//           <h5 className="mb-3">Comments</h5>

//           {/* input – only when logged-in */}
//           {uid && (
//             <div className="d-flex align-items-start gap-3 mb-4">
//               <Link to={`/u/${profile?.username || uid}`}>
//                 <img
//                   src={profile?.avatarUrl || currentUser.photoURL || 'https://placehold.co/40x40'}
//                   alt={profile?.username || currentUser.displayName || 'Me'}
//                   className="rounded-circle" width="40" height="40"
//                 />
//               </Link>

//               <MDBInputGroup>
//                 <textarea
//                   className="form-control" rows={2}
//                   placeholder="Add your comment…"
//                   value={newComment}
//                   onChange={e => setNewComment(e.target.value)}
//                 />
//                 <MDBBtn onClick={handlePost}>Post</MDBBtn>
//               </MDBInputGroup>
//             </div>
//           )}

//           {sorted.map(c => {
//             const liked = (commentLikes[c.id] || []).includes(uid);
//             return (
//               <div key={c.id} className="mb-4">
//                 <div className="d-flex align-items-start gap-3">
//                   <Link to={`/u/${c.username}`}>
//                     <img
//                       src={c.avatarUrl || 'https://placehold.co/32x32'}
//                       alt={c.username}
//                       className="rounded-circle" width="32" height="32"
//                     />
//                   </Link>

//                   <div className="w-100">
//                     <div className="d-flex justify-content-between">
//                       <Link to={`/u/${c.username}`} className="fw-semibold text-reset">{c.username}</Link>
//                       <small className="text-muted">{new Date(c.createdAt).toLocaleDateString()}</small>
//                     </div>

//                     {editingId === c.id ? (
//                       <div className="d-flex gap-2 mt-2">
//                         <input className="form-control" value={editText} onChange={e => setEditText(e.target.value)} />
//                         <MDBBtn size="sm" onClick={() => saveEdit(c.id)}>Save</MDBBtn>
//                         <MDBBtn size="sm" color="link" onClick={cancelEdit}>Cancel</MDBBtn>
//                       </div>
//                     ) : (
//                       <p className="mb-1">{c.text}</p>
//                     )}

//                     <div className="d-flex gap-4 text-muted small">
//                       <span role="button" onClick={() => handleLikeComment(c.id)}>
//                         <MDBIcon fas icon={liked ? 'thumbs-up' : ['far', 'thumbs-up']} className="me-1" />
//                         {(commentLikes[c.id] || []).length}
//                       </span>

//                       {uid && c.uid === uid && editingId !== c.id && (
//                         <>
//                           <span role="button" onClick={() => startEdit(c)}>
//                             <MDBIcon fas icon="edit" className="me-1" />Edit
//                           </span>
//                           <span role="button" onClick={() => handleDelete(c.id)}>
//                             <MDBIcon fas icon="trash-alt" className="me-1 text-danger" />Delete
//                           </span>
//                         </>
//                       )}
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             );
//           })}
//         </MDBCol>
//       </MDBRow>
//     </MDBContainer>
//   );
// }






// //ArticleDetailsPage.jsx
// import React, { useEffect, useState, useRef } from 'react';
// import {
//   MDBContainer, MDBRow, MDBCol, MDBCard, MDBCardBody, MDBCardImage,
//   MDBIcon, MDBSpinner, MDBBtn, MDBInputGroup
// } from 'mdb-react-ui-kit';
// import { useParams, Link } from 'react-router-dom';
// import { getDatabase, ref as rdbRef, get as rdbGet } from 'firebase/database';
// import { doc, getDoc, onSnapshot } from 'firebase/firestore';
// import { db as fsDb } from '../../configs/firebase';
// import { useAuth } from '../../context/AuthContext';
// import {
//   streamComments, addComment, streamCommentLikes, likeComment,
//   updateComment, deleteComment,
//   incrementView, streamViews,
//   toggleBookmark, streamBookmarks,
//   likeArticle,   streamLikes,  streamCommentCount,
// } from '../../configs/useArticles';
// // import CommentOverlay from './CommentOverlay';
// import CommentList from './CommentList';
// export default function ArticleDetailPage() {
//   const { articleId }   = useParams();
//   const { currentUser } = useAuth();
//   const uid             = currentUser?.uid;

//   /* ─── core state ─── */
//   const [article, setArticle]   = useState(null);
//   const [author,  setAuthor]    = useState(null);
//   const [loading, setLoading]   = useState(true);

//   /* realtime side-state */
//   const [views,   setViews]   = useState(0);
//   const [likes,   setLikes]   = useState([]);
//   const [bookmarks, setBookmarks] = useState([]);
//   const [commentCount, setCommentCount] = useState(0); 

//   /* comments */
//   const [comments,    setComments]   = useState([]);
//   const [commentLikes, setCLikes]    = useState({});
//   const [newComment,  setNewComment] = useState('');
//   const [editingId,   setEditingId]  = useState(null);
//   const [editText,    setEditText]   = useState('');

//   /* viewer profile (for avatar) */
//   const [profile, setProfile] = useState(null);

//   const listEndRef = useRef(null);

//   /* ─── fetch article + author once ─── */
//   useEffect(() => {
//     (async () => {
//       try {
//         const snap = await rdbGet(rdbRef(getDatabase(), `articles/${articleId}`));
//         if (!snap.exists()) { setLoading(false); return; }
//         const data = snap.val();
//         setArticle({ id: articleId, ...data });

//         const aSnap = await getDoc(doc(fsDb, 'users', data.authorId));
//         aSnap.exists() && setAuthor(aSnap.data());
//       } catch (err) {
//         console.error(err);
//       } finally {
//         setLoading(false);
//       }
//     })();
//   }, [articleId]);

//   /* ─── live comments / likes / bookmarks ─── */
//   useEffect(() => {
//     if (!articleId) return;
// const u1 = streamComments     (articleId, list => {
//       setComments(list);
//       setTimeout(() => listEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 0);
//     });    
//     const u2 = streamCommentLikes (articleId, setCLikes);
//     const u3 = streamLikes        (articleId, setLikes);
//     const u4 = streamBookmarks    (articleId, setBookmarks);
//     return () => { u1(); u2(); u3(); u4(); };
//   }, [articleId]);

//   /* ─── views ─── */
//   useEffect(() => {
//     if (!articleId) return;
//     const unsub = streamViews(articleId, v => setViews(v || 0));
//     // don't count author's own views
//     incrementView(articleId, uid, article?.authorId);
//     return unsub;
//   }, [articleId, uid, article?.authorId]);

//   /* ─── viewer profile (avatar) ─── */
//   useEffect(() => {
//     if (!uid) return;
//     return onSnapshot(doc(fsDb, 'users', uid), s => s.exists() && setProfile(s.data()));
//   }, [uid]);

//   /* ─── comment helpers ─── */
//   const handlePost = async () => {
//     if (!uid || !newComment.trim()) return;
//     await addComment(articleId, {
//       uid,
//       username: profile?.username || currentUser.displayName ||
//                 currentUser.email.split('@')[0],
//       avatarUrl: profile?.avatarUrl || currentUser.photoURL,
//       text: newComment.trim(),
//       createdAt: Date.now()
//     });
//     setNewComment('');
//   };

//   const handleLikeComment = cid => uid && likeComment(articleId, cid, uid);
//   const startEdit   = c  => { setEditingId(c.id); setEditText(c.text); };
//   const saveEdit    = cid => updateComment(articleId, cid, { text: editText, updatedAt: Date.now() })
//                               .then(() => { setEditingId(null); setEditText(''); });
//   const cancelEdit  = ()  => setEditingId(null);
//   const handleDelete = cid => deleteComment(articleId, cid);

//   /* ─── article like / bookmark handlers ─── */
//   const articleLiked   = uid ? likes.includes(uid)     : false;
//   const articleMarked  = uid ? bookmarks.includes(uid) : false;
//   const likeArticleBtn = () => uid && likeArticle(articleId, uid);
//   const bookmarkBtn    = () => uid && toggleBookmark(articleId, uid);

//   /* ─── guards ─── */
//   if (loading)  return <MDBSpinner className="d-block mx-auto my-5" />;
//   if (!article) return <p className="text-center my-5">Article not found.</p>;

//   /* ─── prep render vars ─── */
//   const sorted = [...comments].sort((a, b) => b.createdAt - a.createdAt);
//   const created = new Date(article.createdAt);
//   const updated = new Date(article.updatedAt);
//   const edited  = article.updatedAt !== article.createdAt;

//   /* ─── render ─── */
//   return (
//     <MDBContainer className="py-5">
//       <MDBRow className="justify-content-center">
//         <MDBCol lg="8">
//           {/* ───────── Article card ───────── */}
//           <MDBCard className="shadow mb-4 position-relative">

//             {/* like & bookmark (top-right) */}
//             <div className="position-absolute d-flex gap-2" style={{ top: 12, right: 12 }}>
//               <MDBBtn size="sm" color="link" className="p-0" onClick={bookmarkBtn}>
//                 <MDBIcon icon="star" fas
//                   style={{ color: articleMarked ? '#ffc107' : '#adb5bd' }}
//                 />
//               </MDBBtn>
//               <MDBBtn size="sm" color="link" className="p-0" onClick={likeArticleBtn}>
//                 <MDBIcon
//                   icon="thumbs-up"
//                   fas={articleLiked}
//                   far={!articleLiked}
//                   style={{ color: articleLiked ? '#0d6efd' : '#adb5bd' }}
//                 />
//                 <span className="ms-1">{likes.length}</span>
//               </MDBBtn>
//             </div>

//             <MDBCardImage
//               src={article.coverUrl || 'https://placehold.co/800x400?text=No+Image'}
//               alt={article.title}
//               position="top"
//               style={{ height: '400px', objectFit: 'cover' }}
//             />

//             <MDBCardBody>
//               <h2 className="fw-bold mb-3">{article.title}</h2>
//               <div className="text-muted mb-3" style={{ fontSize: '.9rem' }}>
//                 #{article.category || 'General'}
//               </div>
//               <div className="text-muted mb-4" style={{ fontSize: '.8rem' }}>
//                 {edited
//                   ? `Last edited: ${updated.toLocaleDateString()}`
//                   : `Published: ${created.toLocaleDateString()}`}
//               </div>

//               {author && (
//                 <Link
//                   to={`/u/${author.username || author.uid}`}
//                   className="d-flex align-items-center gap-2 mb-4 text-reset"
//                   style={{ textDecoration: 'none' }}
//                 >
//                   <img
//                     src={author.avatarUrl || 'https://placehold.co/40x40'}
//                     alt={author.displayName}
//                     className="rounded-circle" width="40" height="40"
//                   />
//                   <span className="fw-semibold">{author.displayName}</span>
//                 </Link>
//               )}

//               <p className="mb-4" style={{ lineHeight: 1.6 }}>{article.body}</p>

//               <div className="text-muted d-flex gap-4 mb-5" style={{ fontSize: '.9rem' }}>
//                 <span><MDBIcon far icon="eye"       className="me-1" />{views}</span>
//                 <span><MDBIcon far icon="comment"   className="me-1" />{comments.length}</span>
//               </div>
//             </MDBCardBody>
//           </MDBCard>

//           {/* ───────── Comments ───────── */}
//           <h5 className="mb-3">Comments</h5>
//           <CommentOverlay />
          

//           {/* input – only when logged-in */}
//           {uid && (
//             <div className="d-flex align-items-start gap-3 mb-4">
//               <Link to={`/u/${profile?.username || uid}`}>
//                 <img
//                   src={profile?.avatarUrl || currentUser.photoURL || 'https://placehold.co/40x40'}
//                   alt={profile?.username || currentUser.displayName || 'Me'}
//                   className="rounded-circle" width="40" height="40"
//                 />
//               </Link>

//               <MDBInputGroup>
//                 <textarea
//                   className="form-control" rows={2}
//                   placeholder="Add your comment…"
//                   value={newComment}
//                   onChange={e => setNewComment(e.target.value)}
//                 />
//                 <MDBBtn onClick={handlePost}>Post</MDBBtn>
//               </MDBInputGroup>
//             </div>
//           )}

//           {/* comment list */}
//           {sorted.map(c => {
//             const liked = (commentLikes[c.id] || []).includes(uid);
//             return (
//               <div key={c.id} className="mb-4">
//                 <div className="d-flex align-items-start gap-3">
//                   <Link to={`/u/${c.username}`}>
//                     <img
//                       src={c.avatarUrl || 'https://placehold.co/32x32'}
//                       alt={c.username}
//                       className="rounded-circle" width="32" height="32"
//                     />
//                   </Link>

//                   <div className="w-100">
//                     <div className="d-flex justify-content-between">
//                       <Link to={`/u/${c.username}`} className="fw-semibold text-reset">{c.username}</Link>
//                       <small className="text-muted">{new Date(c.createdAt).toLocaleDateString()}</small>
//                     </div>

//                     {editingId === c.id ? (
//                       <div className="d-flex gap-2 mt-2">
//                         <input className="form-control"
//                                value={editText}
//                                onChange={e => setEditText(e.target.value)} />
//                         <MDBBtn size="sm" onClick={() => saveEdit(c.id)}>Save</MDBBtn>
//                         <MDBBtn size="sm" color="link" onClick={cancelEdit}>Cancel</MDBBtn>
//                       </div>
//                     ) : (
//                       <p className="mb-1">{c.text}</p>
//                     )}

//                     <div className="d-flex gap-4 text-muted small">
//                       <span role="button" onClick={() => handleLikeComment(c.id)}>
//                         <MDBIcon fas={liked} far={!liked} icon="thumbs-up" className="me-1" />
//                         {(commentLikes[c.id] || []).length}
//                       </span>

//                       {uid && c.uid === uid && editingId !== c.id && (
//                         <>
//                           <span role="button" onClick={() => startEdit(c)}>
//                             <MDBIcon fas icon="edit" className="me-1" />Edit
//                           </span>
//                           <span role="button" onClick={() => handleDelete(c.id)}>
//                             <MDBIcon fas icon="trash-alt" className="me-1 text-danger" />Delete
//                           </span>
//                         </>
//                       )}
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             );
//           })}
//         </MDBCol>
//       </MDBRow>
//     </MDBContainer>
//   );
// }


// Correct one is above








// import React, { useState, useEffect, useRef } from "react";
// import {
//   MDBContainer,
//   MDBRow,
//   MDBCol,
//   MDBCard,
//   MDBCardBody,
//   MDBCardImage,
//   MDBBtn,
//   MDBIcon,
//   MDBSpinner,
//   MDBInputGroup,
//   MDBBadge,
// } from "mdb-react-ui-kit";
// import { useParams, useNavigate } from "react-router-dom";
// import { doc, getDoc } from "firebase/firestore";
// import { db as fsDb, rtdb } from "../../configs/firebase";
// import { ref as rdbRef, get as rdbGet } from "firebase/database";
// import { useAuth } from "../../context/AuthContext";

// // RTDB helpers (services)
// import {
//   addComment,
//   streamComments,
//   updateComment,
//   deleteComment,
//   likeComment,
//   streamCommentLikes,
//   streamLikes,
//   likeArticle,
//   streamViews,
//   incrementView,
//   toggleBookmark,
//   streamBookmarks,
//   streamAllArticles,
// } from "../../configs/useArticles";

// import ArticleCard from "../cards/ArticleCard";

// /* ───────────────────────────── Comment UI ───────────────────────────── */
// function CommentItem({ comment, likes = [], onEdit, onDelete, onLike, isOwner }) {
//   const [isEditing, setIsEditing] = useState(false);
//   const [text, setText] = useState(comment.text);

//   const save = () => {
//     onEdit(text);
//     setIsEditing(false);
//   };

//   return (
//     <MDBCard className="mb-3 shadow-0 border-0 bg-transparent">
//       <MDBCardBody className="p-2">
//         <div className="d-flex align-items-start gap-2">
//           <MDBCardImage
//             src={comment.authorPhotoURL || "/avatar_placeholder.png"}
//             alt="avatar"
//             style={{ width: 36, height: 36, borderRadius: "50%" }}
//           />
//           <div className="flex-grow-1">
//             <div className="d-flex justify-content-between align-items-start">
//               <span className="fw-semibold small">{comment.authorName}</span>
//               {isOwner && !isEditing && (
//                 <div className="d-flex gap-2">
//                   <MDBBtn
//                     size="sm"
//                     color="link"
//                     className="p-0"
//                     onClick={() => setIsEditing(true)}
//                   >
//                     <MDBIcon fas icon="pen" />
//                   </MDBBtn>
//                   <MDBBtn
//                     size="sm"
//                     color="link"
//                     className="p-0 text-danger"
//                     onClick={onDelete}
//                   >
//                     <MDBIcon fas icon="trash" />
//                   </MDBBtn>
//                 </div>
//               )}
//             </div>
//             {isEditing ? (
//               <div className="d-flex gap-2 mt-1">
//                 <MDBInputGroup>
//                   <input
//                     className="form-control form-control-sm"
//                     value={text}
//                     onChange={(e) => setText(e.target.value)}
//                   />
//                 </MDBInputGroup>
//                 <MDBBtn size="sm" onClick={save} disabled={!text.trim()}>
//                   Save
//                 </MDBBtn>
//               </div>
//             ) : (
//               <p className="small mb-1">{comment.text}</p>
//             )}
//             <div className="d-flex align-items-center gap-3">
//               <MDBBtn
//                 size="sm"
//                 color="link"
//                 className="p-0 d-flex align-items-center gap-1"
//                 onClick={onLike}
//               >
//                 <MDBIcon
//                   fas
//                   icon="heart"
//                   className={likes.includes(comment.currentUid) ? "text-danger" : ""}
//                 />
//                 <small>{likes.length}</small>
//               </MDBBtn>
//               <small className="text-muted">
//                 {new Date(comment.createdAt).toLocaleDateString()}
//               </small>
//             </div>
//           </div>
//         </div>
//       </MDBCardBody>
//     </MDBCard>
//   );
// }

// function CommentSection({ articleId }) {
//   const { currentUser } = useAuth();
//   const [comments, setComments] = useState([]);
//   const [likesMap, setLikesMap] = useState({});
//   const [text, setText] = useState("");
//   const listRef = useRef(null);

//   /* live comments */
//   useEffect(() => {
//     const unsubC = streamComments(articleId, setComments);
//     const unsubL = streamCommentLikes(articleId, setLikesMap);
//     return () => {
//       unsubC();
//       unsubL();
//     };
//   }, [articleId]);

//   /* auto‑scroll on new comment */
//   useEffect(() => {
//     if (listRef.current) {
//       listRef.current.scrollTop = listRef.current.scrollHeight;
//     }
//   }, [comments.length]);

//   const send = async () => {
//     if (!text.trim()) return;
//     await addComment(articleId, {
//       text: text.trim(),
//       authorId: currentUser.uid,
//       authorName: currentUser.displayName || "Unknown",
//       authorPhotoURL: currentUser.photoURL || "",
//       createdAt: Date.now(),
//     });
//     setText("");
//   };

//   return (
//     <section className="my-5">
//       <h5 className="fw-bold mb-3">Comments</h5>
//       {/* input */}
//       {currentUser && (
//         <div className="d-flex align-items-start gap-2 mb-3">
//           <MDBCardImage
//             src={currentUser.photoURL || "/avatar_placeholder.png"}
//             alt="avatar"
//             style={{ width: 36, height: 36, borderRadius: "50%" }}
//           />
//           <div className="flex-grow-1">
//             <MDBInputGroup className="shadow-0">
//               <input
//                 className="form-control"
//                 placeholder="Add a comment..."
//                 value={text}
//                 onChange={(e) => setText(e.target.value)}
//                 onKeyDown={(e) => e.key === "Enter" && send()}
//               />
//               <MDBBtn onClick={send} disabled={!text.trim()}>
//                 Post
//               </MDBBtn>
//             </MDBInputGroup>
//           </div>
//         </div>
//       )}

//       {/* list */}
//       <div ref={listRef} style={{ maxHeight: 400, overflowY: "auto" }}>
//         {comments.map((c) => (
//           <CommentItem
//             key={c.id}
//             comment={{ ...c, currentUid: currentUser?.uid }}
//             likes={likesMap[c.id] || []}
//             isOwner={c.authorId === currentUser?.uid}
//             onEdit={(newText) => updateComment(articleId, c.id, { text: newText })}
//             onDelete={() => deleteComment(articleId, c.id)}
//             onLike={() => likeComment(articleId, c.id, currentUser.uid)}
//           />
//         ))}
//         {!comments.length && <p className="text-muted small">Be the first to comment.</p>}
//       </div>
//     </section>
//   );
// }

// /* ─────────────────────────── Article Detail ─────────────────────────── */
// export default function ArticleDetailPage() {
//   const { articleId } = useParams();
//   const { currentUser } = useAuth();
//   const nav = useNavigate();

//   const [article, setArticle] = useState(null);
//   const [author, setAuthor] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [likes, setLikes] = useState([]);
//   const [views, setViews] = useState(0);
//   const [bookmarks, setBookmarks] = useState([]);
//   const [related, setRelated] = useState([]);

//   /* fetch article (RTDB) */
//   useEffect(() => {
//     async function fetchArticle() {
//       setLoading(true);
//       try {
//         const snap = await rdbGet(rdbRef(rtdb, `articles/${articleId}`));
//         if (!snap.exists()) {
//           nav("/404", { replace: true });
//           return;
//         }
//         const data = { id: articleId, ...snap.val() };
//         setArticle(data);
//         // increment view count (RTDB helper handles skip‑if‑author)
//         incrementView(articleId, currentUser?.uid, data.authorId);

//         // fetch author profile (stored in Firestore)
//         const authorSnap = await getDoc(doc(fsDb, "users", data.authorId));
//         if (authorSnap.exists()) setAuthor(authorSnap.data());
//       } finally {
//         setLoading(false);
//       }
//     }
//     fetchArticle();
//   }, [articleId, currentUser?.uid, nav]);

//   /* live metadata */
//   useEffect(() => {
//     if (!articleId) return () => {};
//     const unsubL = streamLikes(articleId, setLikes);
//     const unsubV = streamViews(articleId, setViews);
//     const unsubB = streamBookmarks(articleId, setBookmarks);
//     return () => {
//       unsubL();
//       unsubV();
//       unsubB();
//     };
//   }, [articleId]);

//   /* recommended */
//   useEffect(() => {
//     if (!article) return;
//     const unsub = streamAllArticles((list) => {
//       const rec = list
//         .filter((a) => a.id !== article.id && a.category === article.category)
//         .slice(0, 4);
//       setRelated(rec);
//     }, 50);
//     return unsub;
//   }, [article]);

//   if (loading) {
//     return (
//       <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "60vh" }}>
//         <MDBSpinner />
//       </div>
//     );
//   }

//   if (!article) return null; // already redirected

//   const isLiked = currentUser && likes.includes(currentUser.uid);
//   const isBookmarked = currentUser && bookmarks.includes(currentUser.uid);

//   const actionBtn = (icon, active, onClick, label) => (
//     <MDBBtn
//       size="sm"
//       color="link"
//       className="p-1 d-flex align-items-center gap-1"
//       onClick={onClick}
//     >
//       <MDBIcon fas icon={icon} className={active ? "text-success" : ""} />
//       <small className="text-muted">{label}</small>
//     </MDBBtn>
//   );

//   return (
//     <MDBContainer className="py-4" style={{ maxWidth: 780 }}>
//       {/* Article header */}
//       <h2 className="fw-bold lh-sm mb-2" style={{ fontFamily: "'DM Sans', sans-serif" }}>
//         {article.title}
//       </h2>
//       <div className="d-flex align-items-center gap-2 mb-2">
//         <small className="text-muted">
//           {new Date(article.createdAt).toLocaleDateString()}
//         </small>
//         <span className="text-muted">•</span>
//         <small className="text-muted">{views} views</small>
//         <span className="text-muted">•</span>
//         {actionBtn("heart", isLiked, () => likeArticle(articleId, currentUser.uid), likes.length)}
//         {actionBtn("bookmark", isBookmarked, () => toggleBookmark(articleId, currentUser.uid), bookmarks.length)}
//       </div>

//       {/* cover image */}
//       {article.coverUrl && (
//         <MDBCardImage src={article.coverUrl} alt="cover" fluid className="rounded mb-4" />
//       )}

//       {/* body */}
//       <p style={{ whiteSpace: "pre-wrap" }}>{article.body}</p>

//       {/* written by */}
//       {author && (
//         <section className="my-5 text-center">
//           <h6 className="fw-semibold mb-3">Written by</h6>
//           <MDBCardImage
//             src={author.photoURL || "/avatar_placeholder.png"}
//             alt="author"
//             style={{ width: 80, height: 80, borderRadius: "50%" }}
//           />
//           <h6 className="mt-2 mb-0">{author.displayName}</h6>
//           {author.role && <small className="text-muted">{author.role}</small>}
//         </section>
//       )}

//       {/* comments */}
//       <CommentSection articleId={articleId} />

//       {/* recommended */}
//       {!!related.length && (
//         <section className="my-5">
//           <h5 className="fw-bold mb-3">Recommended from LAONAZ</h5>
//           <MDBRow className="g-4">
//             {related.map((art) => (
//               <MDBCol sm="6" md="4" lg="3" key={art.id}>
//                 <ArticleCard article={art} />
//               </MDBCol>
//             ))}
//           </MDBRow>
//         </section>
//       )}
//     </MDBContainer>
//   );
// }



// // current one is below
// // src/pages/ArticleDetailPage.jsx
// import React, { useEffect, useState, useRef } from "react";
// import {
//   MDBContainer,
//   MDBRow,
//   MDBCol,
//   MDBCard,
//   MDBCardBody,
//   MDBCardImage,
//   MDBIcon,
//   MDBSpinner,
//   MDBBtn,
// } from "mdb-react-ui-kit";
// import { useParams, Link } from "react-router-dom";
// import {
//   getDatabase,
//   ref as rdbRef,
//   get as rdbGet,
// } from "firebase/database";
// import { doc, getDoc, onSnapshot } from "firebase/firestore";
// import { db as fsDb } from "../../configs/firebase";
// import { useAuth } from "../../context/AuthContext";
// import {
//   streamViews,
//   incrementView,
//   toggleBookmark,
//   streamBookmarks,
//   likeArticle,
//   streamLikes,
//   streamCommentCount,          
// } from "../../configs/useArticles";

// import CommentList from "../../components/cards/CommentList"; 

// export default function ArticleDetailPage() {
//   const { articleId } = useParams();
//   const { currentUser } = useAuth();
//   const uid = currentUser?.uid;

//   /* ─── core state ─── */
//   const [article, setArticle] = useState(null);
//   const [author, setAuthor] = useState(null);
//   const [loading, setLoading] = useState(true);

//   /* realtime side-state */
//   const [views, setViews] = useState(0);
//   const [likes, setLikes] = useState([]);
//   const [bookmarks, setBookmarks] = useState([]);
//   const [commentCount, setCommentCount] = useState(0);   // ⬅️ NEW

//   /* viewer profile (for avatar in meta rows) */
//   const [profile, setProfile] = useState(null);
//   const listEndRef = useRef(null);

//   /* ─── fetch article + author once ─── */
//   useEffect(() => {
//     (async () => {
//       try {
//         const snap = await rdbGet(
//           rdbRef(getDatabase(), `articles/${articleId}`)
//         );
//         if (!snap.exists()) {
//           setLoading(false);
//           return;
//         }
//         const data = snap.val();
//         setArticle({ id: articleId, ...data });

//         const aSnap = await getDoc(doc(fsDb, "users", data.authorId));
//         aSnap.exists() && setAuthor(aSnap.data());
//       } catch (err) {
//         console.error(err);
//       } finally {
//         setLoading(false);
//       }
//     })();
//   }, [articleId]);

//   /* ─── live likes / bookmarks / comment count ─── */
//   useEffect(() => {
//     if (!articleId) return;
//     const u1 = streamLikes(articleId, setLikes);
//     const u2 = streamBookmarks(articleId, setBookmarks);
//     const u3 = streamCommentCount(articleId, cnt => setCommentCount(cnt)); // ⬅️ NEW
//     return () => {
//       u1();
//       u2();
//       u3();
//     };
//   }, [articleId]);

//   /* ─── views ─── */
// useEffect(() => {
//     if (!articleId) return;

//     /* 1️⃣ subscribe so UI stays live */
//     const unsub = streamViews(articleId, v => setViews(v || 0));

//     /* 2️⃣ count view only if not counted in this tab already */
//     const key = `viewed_${articleId}`;
//     if (!sessionStorage.getItem(key) && !(uid && uid === article?.authorId)) {
//       incrementView(articleId, uid, article?.authorId);
//       sessionStorage.setItem(key, "1");
//     }
//     return unsub;
//   }, [articleId, uid, article?.authorId]);


//   useEffect(() => {
//     if (!uid) return onSnapshot;               // noop cleanup
//     return onSnapshot(doc(fsDb, "users", uid), s => s.exists() && setProfile(s.data()));
//   }, [uid]);


//   /* ─── article like / bookmark handlers ─── */
//   const articleLiked = uid ? likes.includes(uid) : false;
//   const articleMarked = uid ? bookmarks.includes(uid) : false;
//   const likeArticleBtn = () => uid && likeArticle(articleId, uid);
//   const bookmarkBtn = () => uid && toggleBookmark(articleId, uid);

//   /* ─── guards ─── */
//   if (loading)
//     return <MDBSpinner className="d-block mx-auto my-5" />;
//   if (!article)
//     return <p className="text-center my-5">Article not found.</p>;

//   /* ─── prep render vars ─── */
//   const created = new Date(article.createdAt);
//   const updated = new Date(article.updatedAt);
//   const edited = article.updatedAt !== article.createdAt;

//   const authorLink =
//     author && uid && author.uid === uid
//       ? "/profile"
//       : `/u/${author?.username || author?.uid}`;

//   /* ─── render ─── */
//   return (
//     <MDBContainer className="py-5">
//       <MDBRow className="justify-content-center">
//         <MDBCol lg="8">
//           {/* ───────── Article card ───────── */}
//           <MDBCard className="shadow mb-4 position-relative">
//             {/* like & bookmark (top-right) */}
//             <div
//               className="position-absolute d-flex gap-2"
//               style={{ top: 12, right: 12 }}
//             >
//               <MDBBtn
//                 size="sm"
//                 color="link"
//                 className="p-0"
//                 onClick={bookmarkBtn}
//               >
//                 <MDBIcon
//                   icon="star"
//                   fas
//                   style={{
//                     color: articleMarked ? "#ffc107" : "#adb5bd",
//                   }}
//                 />
//               </MDBBtn>
//               <MDBBtn
//                 size="sm"
//                 color="link"
//                 className="p-0"
//                 onClick={likeArticleBtn}
//               >
//                 <MDBIcon
//                   icon="thumbs-up"
//                   fas={articleLiked}
//                   far={!articleLiked}
//                   style={{
//                     color: articleLiked ? "#0d6efd" : "#adb5bd",
//                   }}
//                 />
//                 <span className="ms-1">{likes.length}</span>
//               </MDBBtn>
//             </div>

//             <MDBCardImage
//               src={
//                 article.coverUrl ||
//                 "https://placehold.co/800x400?text=No+Image"
//               }
//               alt={article.title}
//               position="top"
//               style={{ height: "400px", objectFit: "cover" }}
//             />

//             <MDBCardBody>
//               <h2 className="fw-bold mb-3">{article.title}</h2>
//               <div
//                 className="text-muted mb-3"
//                 style={{ fontSize: ".9rem" }}
//               >
//                 #{article.category || "General"}
//               </div>
//               <div
//                 className="text-muted mb-4"
//                 style={{ fontSize: ".8rem" }}
//               >
//                 {edited
//                   ? `Last edited: ${updated.toLocaleDateString()}`
//                   : `Published: ${created.toLocaleDateString()}`}
//               </div>

//               {author && (
//                 <Link to={authorLink} className="d-flex align-items-center gap-2 mb-4 text-reset"
//                       style={{ textDecoration: "none" }}>
//                   <img
//                     src={author.avatarUrl || "https://placehold.co/40x40"}
//                     alt={author.displayName}
//                     className="rounded-circle"
//                     width="40" height="40"
//                   />
//                   <span className="fw-semibold">{author.displayName}</span>
//                 </Link>
//               )}

//               <p className="mb-4" style={{ lineHeight: 1.6 }}>
//                 {article.body}
//               </p>
              

//               <div
//                 className="text-muted d-flex gap-4 mb-5"
//                 style={{ fontSize: ".9rem" }}
//               >
//                 <span>
//                   <MDBIcon far icon="eye" className="me-1" />
//                   {views}
//                 </span>
//                 <span>
//                   <MDBIcon far icon="comment" className="me-1" />
//                   {commentCount /* ⬅️ live count */}
//                 </span>
//               </div>
//             </MDBCardBody>
//           </MDBCard>

//           {/* ───────── Comments (inline component) ───────── */}
//           <h5 className="mb-3">Comments</h5>

//           <CommentList              
//             articleId={articleId}
//             currentUser={currentUser}
//           />

//           {/* dummy ref to keep scroll behaviour from old version */} 
//           <div ref={listEndRef} />
//         </MDBCol>
//       </MDBRow>
//     </MDBContainer>
//   );
// }











// // Correct one below

// // src/pages/ArticleDetailPage.jsx
// import React, { useEffect, useState, useRef } from "react";
// import {
//   MDBContainer,
//   MDBRow,
//   MDBCol,
//   MDBCard,
//   MDBCardBody,
//   MDBCardImage,
//   MDBIcon,
//   MDBSpinner,
//   MDBBtn,
// } from "mdb-react-ui-kit";
// import { useParams, Link } from "react-router-dom";
// import {
//   getDatabase,
//   ref as rdbRef,
//   get as rdbGet,
//   onValue,
// } from "firebase/database";
// import { doc, getDoc, onSnapshot } from "firebase/firestore";
// import { db as fsDb } from "../../configs/firebase";
// import { useAuth } from "../../context/AuthContext";
// import {
//   streamViews,
//   incrementView,
//   toggleBookmark,
//   streamBookmarks,
//   likeArticle,
//   streamLikes,
//   streamCommentCount,
// } from "../../configs/useArticles";

// import CommentList from "../../components/cards/CommentList";

// export default function ArticleDetailPage() {
//   const { articleId } = useParams();
//   const { currentUser } = useAuth();
//   const uid = currentUser?.uid;

//   /* ─── core state ─── */
//   const [article, setArticle] = useState(null);
//   const [author, setAuthor] = useState(null);
//   const [loading, setLoading] = useState(true);

//   /* realtime side-state */
//   const [views, setViews] = useState(0);
//   const [likes, setLikes] = useState([]);
//   const [bookmarks, setBookmarks] = useState([]);
//   const [commentCount, setCommentCount] = useState(0);

//   /* viewer profile */
//   const [profile, setProfile] = useState(null);
//   const listEndRef = useRef(null);

//   /* fetch article + author once */
//   useEffect(() => {
//     (async () => {
//       try {
//         const snap = await rdbGet(
//           rdbRef(getDatabase(), `articles/${articleId}`)
//         );
//         if (!snap.exists()) {
//           setLoading(false);
//           return;
//         }
//         const data = snap.val();
//         setArticle({ id: articleId, ...data });
//         const aSnap = await getDoc(doc(fsDb, "users", data.authorId));
//         if (aSnap.exists()) setAuthor(aSnap.data());
//       } catch (err) {
//         console.error(err);
//       } finally {
//         setLoading(false);
//       }
//     })();
//   }, [articleId]);

//   /* live counts */
//   useEffect(() => {
//     if (!articleId) return;
//     const unsubViews    = streamViews(articleId, v => setViews(v || 0));
//     const unsubLikes    = streamLikes(articleId, setLikes);
//     const unsubBMs      = streamBookmarks(articleId, setBookmarks);
//     const unsubComments = streamCommentCount(articleId, cnt => setCommentCount(cnt));
//     return () => {
//       unsubViews();
//       unsubLikes();
//       unsubBMs();
//       unsubComments();
//     };
//   }, [articleId]);

//   /* increment view once per session */
//   useEffect(() => {
//     if (!articleId) return;
//     const key = `viewed_${articleId}`;
//     if (!sessionStorage.getItem(key) && !(uid && uid === article?.authorId)) {
//       incrementView(articleId, uid, article?.authorId);
//       sessionStorage.setItem(key, "1");
//     }
//   }, [articleId, uid, article?.authorId]);



//   /* handlers */
//   const articleLiked  = uid ? likes.includes(uid)      : false;
//   const articleMarked = uid ? bookmarks.includes(uid)  : false;
//   const likeArticleBtn = () => uid && likeArticle(articleId, uid);
//   const bookmarkBtn    = () => uid && toggleBookmark(articleId, uid);

//   /* guards */
//   if (loading) return <MDBSpinner className="d-block mx-auto my-5" />;
//   if (!article) return <p className="text-center my-5">Article not found.</p>;

//   const created = new Date(article.createdAt);
//   const updated = new Date(article.updatedAt);
//   const edited  = article.updatedAt !== article.createdAt;

//   const authorLink = author && uid && author.uid === uid
//     ? "/profile"
//     : `/u/${author?.username || author?.uid}`;

//   return (
//     <MDBContainer className="py-5">
//       <MDBRow className="justify-content-center">
//         <MDBCol lg="8">
//           <MDBCard className="shadow mb-4 position-relative">
//             <div className="position-absolute d-flex gap-3" style={{ top: 12, right: 12 }}>
//               <MDBBtn size="sm" color="link" className="p-0" onClick={bookmarkBtn}>
//                 <MDBIcon icon="star" fas style={{ color: articleMarked ? "#ffc107" : "#adb5bd" }} />
//                 <span className="ms-1">{bookmarks.length}</span>
//               </MDBBtn>
//               <MDBBtn size="sm" color="link" className="p-0" onClick={likeArticleBtn}>
//                 <MDBIcon icon="thumbs-up" fas={articleLiked} far={!articleLiked}
//                   style={{ color: articleLiked ? "#0d6efd" : "#adb5bd" }} />
//                 <span className="ms-1">{likes.length}</span>
//               </MDBBtn>
//             </div>

//             <MDBCardImage
//               src={article.coverUrl || "https://placehold.co/800x400?text=No+Image"}
//               alt={article.title}
//               position="top"
//               style={{ height: "400px", objectFit: "cover" }}
//             />

//             <MDBCardBody>
//               <h2 className="fw-bold mb-3">{article.title}</h2>
//               <div className="text-muted mb-3" style={{ fontSize: ".9rem" }}>
//                 #{article.category || "General"}
//               </div>
//               <div className="text-muted mb-4" style={{ fontSize: ".8rem" }}>
//                 {edited
//                   ? `Last edited: ${updated.toLocaleDateString()}`
//                   : `Published: ${created.toLocaleDateString()}`}
//               </div>

//               {author && (
//                 <Link to={authorLink} className="d-flex align-items-center gap-2 mb-4 text-reset" style={{ textDecoration: "none" }}>
//                   <img src={author.avatarUrl || "https://placehold.co/40x40"} alt={author.displayName}
//                     className="rounded-circle" width="40" height="40" />
//                   <span className="fw-semibold">{author.displayName}</span>
//                 </Link>
//               )}

//               <p className="mb-4" style={{ lineHeight: 1.6 }}>{article.body}</p>

//               <div className="text-muted d-flex gap-4 mb-5" style={{ fontSize: ".9rem" }}>
//                 <span><MDBIcon far icon="eye" className="me-1" />{views}</span>
//                 <span><MDBIcon far icon="comment" className="me-1" />{commentCount}</span>
//               </div>
//             </MDBCardBody>
//           </MDBCard>

//           <h5 className="mb-3">Comments</h5>

//           <CommentList articleId={articleId} currentUser={currentUser} />

//           <div ref={listEndRef} />
//         </MDBCol>
//       </MDBRow>
//     </MDBContainer>
//   );
// }


// correct one below



// // src/pages/ArticleDetailPage.jsx
// import React, { useEffect, useState, useRef } from "react";
// import {
//   MDBContainer, MDBRow, MDBCol, MDBCard, MDBCardBody, MDBCardImage,
//   MDBIcon, MDBSpinner, MDBBadge
// } from "mdb-react-ui-kit";
// import { useParams, Link } from "react-router-dom";
// import { getDatabase, ref as rdbRef, get as rdbGet } from "firebase/database";
// import { doc, getDoc } from "firebase/firestore";

// import { auth, db as fsDb }            from "../../configs/firebase";
// import { useAuth }               from "../../context/AuthContext";
// import {
//   streamViews, incrementView,
//   toggleBookmark, streamBookmarks,
//   likeArticle,   streamLikes,
//   streamCommentCount, useArticles,
// } from "../../configs/useArticles";

// import CommentList from "../../components/cards/CommentList";
// import ArticleCard from "../../components/cards/ArticleCard";
// import DOMPurify from "dompurify";

// export default function ArticleDetailPage() {
//   const { articleId }   = useParams();
//   const { currentUser } = useAuth();
//   const uid             = currentUser?.uid;

//   /* ── hooks must be first ── */
//   useEffect(() => {
//     if (window.location.hash) {
//       window.history.replaceState(null, document.title, window.location.pathname);
//     }
//     window.scrollTo({ top: 0, behavior: 'auto' });
//   }, [articleId]);

//   const allArticles = useArticles(50) ?? [];

//   /* ── local state ── */
//   const [article, setArticle]     = useState(null);
//   const [author , setAuthor ]     = useState(null);
//   const [loading, setLoading]     = useState(true);

//   const [views      , setViews]      = useState(0);
//   const [likes      , setLikes]      = useState([]);
//   const [bookmarks  , setBookmarks]  = useState([]);
//   const [commentCnt , setCommentCnt]= useState(0);

//   const [authorMap, setAuthorMap]    = useState({});
//   const listEndRef = useRef(null);

//   /* ── 1. first fetch ── */
//   useEffect(() => {
//     (async () => {
//       try {
//         const snap = await rdbGet(rdbRef(getDatabase(), `articles/${articleId}`));
//         if (!snap.exists()) return setLoading(false);

//         const data = snap.val();
//         setArticle({ id: articleId, ...data });

//         const aSnap = await getDoc(doc(fsDb, "users", data.authorId));
//         aSnap.exists() && setAuthor(aSnap.data());
//       } catch (e) { console.error(e); }
//       finally     { setLoading(false); }
//     })();
//   }, [articleId]);

//   /* ── 2. live counters ── */
//   useEffect(() => {
//     if (!articleId) return;
//     const u1 = streamViews        (articleId, v => setViews(v || 0));
//     const u2 = streamLikes        (articleId,   setLikes);
//     const u3 = streamBookmarks    (articleId,   setBookmarks);
//     const u4 = streamCommentCount (articleId,   setCommentCnt);
//     return () => { u1(); u2(); u3(); u4(); };
//   }, [articleId]);

//   /* ── 3. unique view per session ── */
//   // useEffect(() => {
//   //   if (!articleId) return;
//   //   const key = `viewed_${articleId}`;
//   //   if (!sessionStorage.getItem(key) && !(uid && uid === article?.authorId)) {
//   //     incrementView(articleId, uid, article?.authorId);
//   //     sessionStorage.setItem(key, "1");
//   //   }
//   // }, [articleId, uid, article?.authorId]);
//    useEffect(() => {
//     if (!articleId) return;
//     const timer = setTimeout(() => {
//       incrementView(articleId);
//     }, 10000);
//     return () => clearTimeout(timer);
//   }, [articleId]);

//   /* ── 4. rec/related lists & author cache ── */
//   const rec     = allArticles.filter(a => a.id !== articleId).slice(0, 4);
//   const related = allArticles.filter(
//                     a => a.category === article?.category && a.id !== articleId
//                   ).slice(0, 4);

//   useEffect(() => {
//     const need = new Set([...rec, ...related].map(a => a.authorId));
//     const miss = [...need].filter(id => id && !authorMap[id]);
//     if (!miss.length) return;

//     (async () => {
//       const pairs = await Promise.all(
//         miss.map(async id => {
//           const s = await getDoc(doc(fsDb, "users", id));
//           return [id, s.exists() ? { uid:id, ...s.data() } : null];
//         })
//       );
//       setAuthorMap(p => ({ ...p, ...Object.fromEntries(pairs) }));
//     })();
//   }, [rec, related, authorMap]);

//   /* ── guards ── */
//   if (loading)  return <MDBSpinner className="d-block mx-auto my-5" />;
//   if (!article) return <p className="text-center my-5">Article not found.</p>;

//   /* ── helpers ── */
//   const created = new Date(article.createdAt).toLocaleDateString();
//   const updated = new Date(article.updatedAt).toLocaleDateString();
//   const edited  = article.updatedAt !== article.createdAt;

//   const liked   = uid ? likes.includes(uid)     : false;
//   const marked  = uid ? bookmarks.includes(uid) : false;
//   const doLike  = () => uid && likeArticle   (articleId, uid);
//   const doMark  = () => uid && toggleBookmark(articleId, uid);

//   const fullName =
//       author?.username ||
//       author?.displayName ||
//       `${author?.firstName || ""} ${author?.lastName || ""}`.trim() ||
//       "Unknown author";

//   /* ────── UI ────── */
//   return (
//     <MDBContainer fluid="lg" className="py-5">
//       <MDBRow className="justify-content-center">
//         <MDBCol lg="8">

//           {/* --------- TOP CARD --------- */}
//           <MDBCard className="border-0 shadow-0 mb-5" style={{ background:"#f5f6eb" }}>
//             <MDBCardImage
//               src={article.coverUrl || "https://placehold.co/1200x600?text=No+Image"}
//               alt={article.title}
//               position="top"
//               style={{ objectFit:"cover", maxHeight:450 }}
//             />

//             <MDBCardBody className="px-md-5 px-3 py-4">

//               {/* ─── HEADER (title | author) ─── */}
 
//  {/* ─────────── ARTICLE HEADER ─────────── */}
// <MDBRow className="g-5 flex-column flex-md-row align-items-start mb-5">

//   {/* ❶ LEFT  – title, tag, meta  */}
//   <MDBCol md="8" className="order-2 order-md-1">
//     <h1 className="fw-bold display-4 mb-4" style={{ lineHeight: 1.2 }}>
//       {article.title}
//     </h1>
//     {Array.isArray(article.tags) && (
//                     <div className="d-flex flex-wrap gap-1 mb-3">
//                       {article.tags.map(t => (
//                         <MDBBadge key={t} pill color="info" className="px-2 py-1">
//                           #{t}
//                         </MDBBadge>
//                       ))}
//                     </div>
//                   )}

//      {/* <div className="d-flex flex-wrap gap-1 mb-3">
//        {Array.isArray(article.tags) && article.tags.map(t => (
//       <MDBBadge key={t} pill color="info" className="px-2 py-1">#{t}</MDBBadge>
//         ))}
//     </div> */}

//     {/* meta row */}
//     <div className="d-flex align-items-center flex-wrap gap-4 small">
//       <span>{edited ? `Updated ${updated}` : created}</span>

//       <span className="fs-5">
//         <MDBIcon far icon="eye" className="me-1" />{views}
//       </span>

//       <span
//         role="button"
//         onClick={doLike}
//         className="fs-5"
//         style={{ color: liked ? "#0d6efd" : "#adb5bd" }}
//       >
//         <MDBIcon icon="thumbs-up" fas={liked} far={!liked} className="me-1" />
//         {likes.length}
//       </span>

//       <span className="fs-5">
//         <MDBIcon far icon="comment" className="me-1" />{commentCnt}
//       </span>

//       <span className="fs-5"><MDBIcon far icon="share-square" /></span>

//       <span
//         role="button"
//         onClick={doMark}
//         className="fs-5"
//         style={{ color: marked ? "#ffc107" : "#adb5bd" }}
//       >
//         <MDBIcon icon="star" fas={marked} far={!marked} />
//       </span>
//     </div>
//   </MDBCol>

//   {/* ❷ RIGHT – avatar card  */}
//   {/* <MDBCol
//     md="4"
//     className="order-1 order-md-2 d-flex justify-content-center justify-content-md-start"
//   >
//     <div
//       className="ps-md-5 border-start d-flex flex-column align-items-center align-items-md-start text-center text-md-start"
//       style={{ borderColor: "#d6d9c6", minWidth: 220 }}
//     >
//       <img
//         src={author?.avatarUrl || "https://placehold.co/160x160"}
//         alt={fullName}
//         className="rounded-circle mb-3 flex-shrink-0"
//         width="160"
//         height="160"
//         style={{ objectFit: "cover" }}
//       />
//       <div className="fw-semibold">{fullName}</div>
//       {author?.tagline && <small className="text-muted">{author.tagline}</small>}
//     </div>
//   </MDBCol> */}
//     {/* Right: Author Card */}
//                 <MDBCol md="4" className="order-1 order-md-2 d-flex justify-content-center justify-content-md-start">
//                   <Link
//                     to={author?.username ? `/u/${author.username}` : "/profile"}
//                     className="ps-md-5 border-start d-flex flex-column align-items-center align-items-md-start text-center text-md-start"
//                     style={{ borderColor: "#d6d9c6", minWidth: 220 }}
//                   >
//                     <img
//                       src={author?.avatarUrl || "https://placehold.co/160x160" || currentUser.photoURL}
//                       alt={fullName}
//                       className="rounded-circle mb-3"
//                       width="160" height="160"
//                       style={{ objectFit: "cover" }}
//                     />
//                     <div className="fw-semibold">{fullName}</div>
//                     {author?.tagline && <small className="text-muted">{author.tagline}</small>}
//                   </Link>
//                 </MDBCol>
              

// </MDBRow>



//               {/* article body */}
//               {/* <p style={{ lineHeight:1.7, whiteSpace:"pre-wrap" }}>{article.body}</p> */}
//         <div className="article-body" style={{ lineHeight: 1.7, whiteSpace: "pre-wrap" }} dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(article.body) }} />
//             </MDBCardBody>
//           </MDBCard>

//           {/* --------- COMMENTS --------- */}
//           <h5 className="fw-bold mb-3">Comments</h5>
//           <CommentList articleId={articleId} currentUser={currentUser}/>
//           <div ref={listEndRef}/>

//           {/* --------- RECOMMENDED --------- */}
//           {rec.length > 0 && (
//             <>
//               <h5 className="fw-bold mt-5 mb-3">Recommended from LAONAZ</h5>
//               <MDBRow className="g-4">
//                 {rec.map(a => (
//                   <MDBCol md="6" key={a.id}>
//                     <ArticleCard article={a} author={authorMap[a.authorId]}/>
//                   </MDBCol>
//                 ))}
//               </MDBRow>
//             </>
//           )}

//           {/* --------- RELATED --------- */}
//           {related.length > 0 && (
//             <>
//               <h5 className="fw-bold mt-5 mb-3">
//                 More articles related to {article.category ? `#${article.category}` : "this topic"}
//               </h5>
//               <MDBRow className="g-4">
//                 {related.map(a => (
//                   <MDBCol md="6" key={a.id}>
//                     <ArticleCard article={a} author={authorMap[a.authorId]}/>
//                   </MDBCol>
//                 ))}
//               </MDBRow>
//             </>
//           )}

//         </MDBCol>
//       </MDBRow>
//     </MDBContainer>
//   );
// }


//nelow code is workig before cost cutting

// // src/pages/ArticleDetailPage.jsx
// import React, { useEffect, useState, useRef, useMemo } from "react";
// import {
//   MDBContainer, MDBRow, MDBCol, MDBCard, MDBCardBody,
//   MDBIcon, MDBSpinner, MDBBadge
// } from "mdb-react-ui-kit";
// import { useParams, Link } from "react-router-dom";
// import { getDatabase, ref as rdbRef, get as rdbGet } from "firebase/database";
// import { doc, getDoc } from "firebase/firestore";

// import { auth, db as fsDb } from "../../configs/firebase";
// import { useAuth } from "../../context/AuthContext";
// import {
//   streamViews, incrementView,
//   toggleBookmark, streamBookmarks,
//   likeArticle, streamLikes,
//   streamCommentCount, useArticles,
// } from "../../configs/useArticles";

// import CommentList from "../../components/cards/CommentList";
// import ArticleCard from "../../components/cards/ArticleCard";
// import DOMPurify from "dompurify";


// /* ─────────── ICON ASSETS (your SVGs) ─────────── */
// import ViewIcon from '../../images/icons/View Icon.svg';
// import CommentIcon from '../../images/icons/comment icon.svg';
// import EditIcon from '../../images/icons/edit icon.svg';
// import DeleteIcon from '../../images/icons/delete icon.svg';
// import LikeIcon from '../../images/icons/like icon.svg';


// import '../../styles/ArticleDetailsPage.css';

// export default function ArticleDetailPage() {
//   const { articleId } = useParams();
//   const { currentUser } = useAuth();
//   const uid = currentUser?.uid;

//   /* ── keep URL clean + jump to top ── */
//   useEffect(() => {
//     if (window.location.hash) {
//       window.history.replaceState(null, document.title, window.location.pathname);
//     }
//     window.scrollTo({ top: 0, behavior: "auto" });
//   }, [articleId]);

//   const allArticles = useArticles(50) ?? [];

//   /* ── local state ── */
//   const [article, setArticle] = useState(null);
//   const [author, setAuthor] = useState(null);
//   const [loading, setLoading] = useState(true);

//   const [views, setViews] = useState(0);
//   const [likes, setLikes] = useState([]);
//   const [bookmarks, setBookmarks] = useState([]);
//   const [commentCnt, setCommentCnt] = useState(0);

//   const [authorMap, setAuthorMap] = useState({});
//   const listEndRef = useRef(null);

//   const safeBodyHTML = useMemo(() => {
//     return DOMPurify.sanitize(article?.body  || "", {
//       ADD_ATTR: ["data-size", "class"], // keep our image sizing + class hooks
//     });
//   }, [article?.body]);


//   /* ── 1. first fetch ── */
//   useEffect(() => {
//     (async () => {
//       try {
//         const snap = await rdbGet(rdbRef(getDatabase(), `articles/${articleId}`));
//         if (!snap.exists()) return setLoading(false);

//         const data = snap.val();
//         setArticle({ id: articleId, ...data });

//         const aSnap = await getDoc(doc(fsDb, "users", data.authorId));
//         aSnap.exists() && setAuthor(aSnap.data());
//       } catch (e) {
//         console.error(e);
//       } finally {
//         setLoading(false);
//       }
//     })();
//   }, [articleId]);


  

//   /* ── 2. live counters ── */
//   useEffect(() => {
//     if (!articleId) return;
//     const u1 = streamViews(articleId, (v) => setViews(v || 0));
//     const u2 = streamLikes(articleId, setLikes);
//     const u3 = streamBookmarks(articleId, setBookmarks);
//     const u4 = streamCommentCount(articleId, setCommentCnt);
//     return () => {
//       u1();
//       u2();
//       u3();
//       u4();
//     };
//   }, [articleId]);

//   /* ── 3. unique-ish view (time-on-page) ── */
//   useEffect(() => {
//     if (!articleId) return;
//     const timer = setTimeout(() => {
//       incrementView(articleId);
//     }, 10000);
//     return () => clearTimeout(timer);
//   }, [articleId]);

//   /* ── 4. rec/related lists & author cache ── */
//   const rec = allArticles.filter((a) => a.id !== articleId).slice(0, 4);
//   const related = allArticles
//     .filter((a) => a.category === article?.category && a.id !== articleId)
//     .slice(0, 4);

//   useEffect(() => {
//     const need = new Set([...rec, ...related].map((a) => a.authorId));
//     const miss = [...need].filter((id) => id && !authorMap[id]);
//     if (!miss.length) return;

//     (async () => {
//       const pairs = await Promise.all(
//         miss.map(async (id) => {
//           const s = await getDoc(doc(fsDb, "users", id));
//           return [id, s.exists() ? { uid: id, ...s.data() } : null];
//         })
//       );
//       setAuthorMap((p) => ({ ...p, ...Object.fromEntries(pairs) }));
//     })();
//   }, [rec, related, authorMap]);

  

//   /* ── guards ── */
//   if (loading) return <MDBSpinner className="d-block mx-auto my-5" />;
//   if (!article) return <p className="text-center my-5">Article not found.</p>;

//   /* ── helpers ── */
//   // const created = new Date(article.createdAt).toLocaleDateString();
//   // const updated = new Date(article.updatedAt).toLocaleDateString();
//   // const edited = article.updatedAt !== article.createdAt;

//   const formatDate = (d) =>
//   new Date(d).toLocaleDateString("en-US", {
//     month: "long",
//     day: "2-digit",
//     year: "numeric",
//   });

//   const created = formatDate(article.createdAt);
//   const updated = formatDate(article.updatedAt);
//   const edited  = article.updatedAt !== article.createdAt;

//   const liked = uid ? likes.includes(uid) : false;
//   const marked = uid ? bookmarks.includes(uid) : false;
//   const doLike = () => uid && likeArticle(articleId, uid);
//   const doMark = () => uid && toggleBookmark(articleId, uid);

 

//   const fullName =
//     author?.username ||
//     author?.displayName ||
//     `${author?.firstName || ""} ${author?.lastName || ""}`.trim() ||
//     "Unknown author";

    
//   /* ── design palette from your system ── */
//   const C = {
//     pageBg: 'var(--clr-field-mist)',
//     text: "#0A0A0A",
//     accent: "#5C6B3C",
//     muted: "#6B6B6B",
//     border: "#D6D9C6",
//     tagBg: "#E7ECD6",
//   };

  

//   /* ────── UI ────── */
//   return (
//     <MDBContainer fluid="lg" className="py-5" style={{background: 'var(--clr-field-mist)'}}>
//       <MDBRow className="justify-content-center">
//         <MDBCol lg="8">
//           {/* ====== TOP CARD (Hero + Header) ====== */}
//           <MDBCard className="border-0 shadow-0 mb-5" style={{ background: C.pageBg, borderRadius: 24 }}>
//             {/* Hero image (show the whole image, no crop) */}
//             {/* <div
//               style={{
//                 width: "100%",
//                 background: C.pageBg,
//                 borderTopLeftRadius: 24,
//                 borderTopRightRadius: 24,
//                 overflow: "hidden",
//               }}
//             > */}
//               {/* <div
//                 style={{
//                   width: "100%",
//                   aspectRatio: "16 / 9",
//                   display: "flex",
//                   alignItems: "center",
//                   justifyContent: "center",
//                 }}
//               > */}
//                 {/* <img
//                   src={article.coverUrl || "https://placehold.co/1200x675?text=No+Image"}
//                   alt={article.title}
//                   style={{
//                     maxWidth: "100%",
//                     maxHeight: "100%",
//                     width: "100%",
//                     height: "100%",
//                     objectFit: "contain", // ← show entire image in frame
//                   }}
//                 /> */}
//               {/* </div> */}
//             {/* </div> */}

//             {/* <MDBCardBody className="px-md-5 px-3 py-4">
//             <MDBRow className="g-5 flex-column flex-md-row align-items-stretch">               
//                 <MDBCol md="8" className="order-2 order-md-1 d-flex flex-column">
//                   <h1
//                     className="fw-bold mb-7"
//                     style={{ lineHeight: 1.2, fontSize: "2.4rem", color: C.text }}
//                   >
//                     {article.title}
//                   </h1>

//                   {Array.isArray(article.tags) && article.tags.length > 0 && (
//                     <div className="d-flex flex-wrap gap-2 mb-4">
//                       {article.tags.map((t) => (
//                          <span
//                       key={t}
//                       style={{
//                         fontFamily: 'Poppins, sans-serif',
//                         fontWeight: 600,          
//                         fontSize: '14px',
//                         lineHeight: '150%',
//                         letterSpacing: '0px',
//                         color: '#5C6B3C',
//                       }}
//                     >
//                       #{t}
//                     </span>
//                       ))}
//                     </div>
//                   )}

//                   <div
//                     className="d-flex align-items-center flex-wrap gap-4 small"
//                     style={{ color: C.muted }}
//                   >
//                     <span>{edited ? `Updated ${updated}` : created}</span>

                   

//                     <span className="d-inline-flex align-items-center">
//                       <MDBIcon far icon="eye" className="me-2" />
//                       {views}
//                     </span>

//                     <button
//                       type="button"
//                       onClick={doLike}
//                       className="btn btn-link p-0 text-decoration-none d-inline-flex align-items-center"
//                       style={{ color: liked ? C.accent : C.muted }}
//                     >
//                       <MDBIcon icon="thumbs-up" fas={liked} far={!liked} className="me-2" />
//                       {likes.length}
//                     </button>

//                     <span className="d-inline-flex align-items-center">
//                       <MDBIcon far icon="comment" className="me-2" />
//                       {commentCnt}
//                     </span>

//                     <span className="d-inline-flex align-items-center" role="button" title="Share">
//                       <MDBIcon far icon="share-square" />
//                     </span>

//                     <button
//                       type="button"
//                       onClick={doMark}
//                       className="btn btn-link p-0 text-decoration-none d-inline-flex align-items-center"
//                       style={{ color: marked ? "#FFC107" : C.muted }}
//                       title={marked ? "Bookmarked" : "Bookmark"}
//                     >
//                       <MDBIcon icon="star" fas={marked} far={!marked} />
//                     </button>
//                   </div>

                 
                  
//                 </MDBCol>
//                  <div
//                   className="d-none d-md-block"
//                   style={{
//                     width: 2,
//                     background: "#C9CEB6",
//                     margin: "0 1.5rem",
//                   }}
//                 />
               

//                 <MDBCol
//                   md="4"
//                   className="order-1 order-md-2 d-flex justify-content-center justify-content-md-start"
//                 >
                  
//                   <Link
//                     to={author?.username ? `/u/${author.username}` : "/profile"}
//                     className="ps-md-4 d-flex flex-column align-items-center align-items-md-start text-center text-md-start w-100"
//                     style={{
//                       textDecoration: "none",
//                       color: "inherit",
//                     }}
//                   >
//                     <img
//                       src={author?.avatarUrl || currentUser?.photoURL || "https://placehold.co/160x160"}
//                       alt={fullName}
//                       className="rounded-circle mb-3"
//                       width="96"
//                       height="96"
//                       style={{ objectFit: "cover" }}
//                     />
//                     <div className="fw-semibold">{fullName}</div>
//                     {author?.tagline && (
//                       <small className="text-muted">{author.tagline}</small>
//                     )}
//                   </Link>
//                 </MDBCol>
//               </MDBRow>

//               <div
//                 className="article-body mt-5 mb-4"
//                 style={{
//                   lineHeight: 1.8,
//                   color: C.text,
//                   fontSize: "1.02rem",
//                 }}
//                 dangerouslySetInnerHTML={{
//                   __html: DOMPurify.sanitize(article.body),
//                 }}
//               />
//             </MDBCardBody> */}
//             <MDBCardBody className="article-card px-md-5 px-3 py-4">
//   {/* ====== ARTICLE HEADER (title + meta + author side) ====== */}
//   <MDBRow className="g-5 flex-column flex-md-row align-items-stretch article-head">
//     {/* LEFT: Title + tags + meta */}
//     <MDBCol md="8" className="order-2 order-md-1 d-flex flex-column">
//       <h1 className="article-title mb-4">
//         {article.title}
//       </h1>

//       {/* tags row */}
//       {Array.isArray(article.tags) && article.tags.length > 0 && (
//         <div className="d-flex flex-wrap gap-2 mb-4 article-tags">
//           {article.tags.map((t) => (
//             <span className="article-tag" key={t}>#{t}</span>
//           ))}
//         </div>
//       )}

//       {/* meta row with icons */}
//       <div className="article-meta">
//         <span>{edited ? `Updated ${updated}` : created}</span>

//         <span className="d-inline-flex align-items-center">
//           {/* <MDBIcon far  src={ViewIcon} className="meta-ico me-2" /> */}
//            <img 
//             src={ViewIcon}
//             alt=""
//             className="far meta-ico me-1"
//             />
//           {views}
//         </span>

//         <button
//           type="button"
//           onClick={doLike}
//           className="btn btn-link p-0 text-decoration-none d-inline-flex align-items-center article-like"
//         >
//           {/* <MDBIcon icon="thumbs-up" fas={liked} far={!liked} className="meta-ico me-2" /> */}
//           <img 
//           // fas={liked} far={!liked}
//             src={LikeIcon}
//             alt=""
//             className="meta-ico me-1"
//                       />
//           {likes.length}
//         </button>

//         <span className="d-inline-flex align-items-center">
//           {/* <MDBIcon far icon="comment" className="meta-ico me-2" /> */}
//           <img
//             src={CommentIcon}
//             alt=""
//             className="far meta-ico me-1"
//                       />
//           {commentCnt}
//         </span>

//         <span className="d-inline-flex align-items-center" role="button" title="Share">
//           <MDBIcon far icon="share-square" className="meta-ico-large" />
//         </span>

//         <button
//           type="button"
//           onClick={doMark}
//           className="btn btn-link p-0 text-decoration-none d-inline-flex align-items-center article-bookmark"
//           title={marked ? 'Bookmarked' : 'Bookmark'}
//         >
//           <MDBIcon icon="star" fas={marked} far={!marked} className="meta-ico meta-ico-large" />
//         </button>
//       </div>
//     </MDBCol>

//     {/* RIGHT: Author block with vertical divider */}
//     <MDBCol
//       md="4"
//       className="order-1 order-md-2 d-flex justify-content-center justify-content-md-start position-relative author-col"
//     >
//       <Link
//         to={author?.username ? `/u/${author.username}` : "/profile"}
//         className="d-flex flex-column align-items-center align-items-md-start text-center text-md-start w-100 author-link"
//       >
//         <img
//           src={author?.avatarUrl || "https://placehold.co/160x160"}
//           alt={fullName}
//           className="rounded-circle mb-5 author-avatar"
//         />
//         <div className="author-name">{fullName}</div>
//         {author?.tagline && (
//           <small className="author-role">{author.tagline}</small>
//         )}
//       </Link>
//     </MDBCol>
//   </MDBRow>

//   {/* ====== ARTICLE BODY ====== */}
//   <div
//     className="article-body mt-5 mb-4"
//     dangerouslySetInnerHTML={{
//       __html: safeBodyHTML ,
//     }}
//   />
// </MDBCardBody>

//           </MDBCard>

//            <div
//             className="mt-5 mb-5"
//             style={{ height: 1, background: C.border }}
//             />

//           {/* ====== COMMENTS ====== */}
//           <div
//             className="mb-4"
//             // style={{
//             //   background: "#FFFFFF",
//             //   border: `1px solid ${C.border}`,
//             //   borderRadius: 16,
//             //   padding: "1.25rem",
//             // }}
//           >
//             <div className="d-flex align-items-center justify-content-between mb-3">
//               <h5 className="fw-bold m-0">Add your comment</h5>
//               {/* <span
//                 className="badge rounded-pill"
//                 style={{ background: C.tagBg, color: C.accent, border: `1px solid ${C.border}` }}
//               >
//                 {commentCnt}
//               </span> */}
//             </div>

//             {/* keep your existing component, just wrapped for visuals */}
//             <CommentList articleId={articleId} currentUser={currentUser} />
//             <div ref={listEndRef} />
//           </div>

//           {/* ====== RECOMMENDED ====== */}
//           {rec.length > 0 && (
//             <>
//               <h5 className="fw-bold mt-4 mb-3">Recommended from LAONAZ</h5>
//               <MDBRow className="g-4">
//                 {rec.map((a) => (
//                   <MDBCol md="6" key={a.id}>
//                     <ArticleCard article={a} author={authorMap[a.authorId]} />
//                   </MDBCol>
//                 ))}
//               </MDBRow>
//             </>
//           )}

//           {/* ====== RELATED ====== */}
//           {related.length > 0 && (
//             <>
//               <h5 className="fw-bold mt-5 mb-3">
//                 More articles related to {article.category ? `#${article.category}` : "this topic"}
//               </h5>
//               <MDBRow className="g-4">
//                 {related.map((a) => (
//                   <MDBCol md="6" key={a.id}>
//                     <ArticleCard article={a} author={authorMap[a.authorId]} />
//                   </MDBCol>
//                 ))}
//               </MDBRow>
//             </>
//           )}
//         </MDBCol>
//       </MDBRow>
//     </MDBContainer>
//   );
// }


//above code is working before cost cutting

//below is 1st cost cutting file

// // src/pages/ArticleDetailPage.jsx
// import React, { useEffect, useState, useRef, useMemo } from "react";
// import {
//   MDBContainer,
//   MDBRow,
//   MDBCol,
//   MDBCard,
//   MDBCardBody,
//   MDBIcon,
//   MDBSpinner,
// } from "mdb-react-ui-kit";
// import { useParams, Link } from "react-router-dom";
// import { getDatabase, ref as rdbRef, get as rdbGet } from "firebase/database";
// import { doc, getDoc } from "firebase/firestore";

// import { db as fsDb } from "../../configs/firebase";
// import { useAuth } from "../../context/AuthContext";
// import {
//   streamViews,
//   incrementView,
//   toggleBookmark,
//   streamBookmarks,
//   likeArticle,
//   streamLikes,
//   streamCommentCount,
//   useArticles,
// } from "../../configs/useArticles";

// import CommentList from "../../components/cards/CommentList";
// import ArticleCard from "../../components/cards/ArticleCard";
// import DOMPurify from "dompurify";

// /* ─────────── ICON ASSETS (your SVGs) ─────────── */
// import ViewIcon from "../../images/icons/View Icon.svg";
// import CommentIcon from "../../images/icons/comment icon.svg";
// import LikeIcon from "../../images/icons/like icon.svg";

// import "../../styles/ArticleDetailsPage.css";

// const RELATED_SOURCE_LIMIT = 20;
// const CARD_LIMIT = 4;

// export default function ArticleDetailPage() {
//   const { articleId } = useParams();
//   const { currentUser } = useAuth();
//   const uid = currentUser?.uid;

//   /* ── keep URL clean + jump to top ── */
//   useEffect(() => {
//     if (window.location.hash) {
//       window.history.replaceState(
//         null,
//         document.title,
//         window.location.pathname
//       );
//     }

//     window.scrollTo({ top: 0, behavior: "auto" });
//   }, [articleId]);

//   /*
//    * Cost saving:
//    * Earlier this page loaded 50 articles for recommended/related.
//    * 20 is enough for 4 recommended + 4 related cards and reduces list reads.
//    */
//   const allArticles = useArticles(RELATED_SOURCE_LIMIT) ?? [];

//   /* ── local state ── */
//   const [article, setArticle] = useState(null);
//   const [author, setAuthor] = useState(null);
//   const [loading, setLoading] = useState(true);

//   const [views, setViews] = useState(0);
//   const [likes, setLikes] = useState([]);
//   const [bookmarks, setBookmarks] = useState([]);
//   const [commentCnt, setCommentCnt] = useState(0);

//   const [authorMap, setAuthorMap] = useState({});
//   const [commentsReady, setCommentsReady] = useState(false);

//   const listEndRef = useRef(null);
//   const commentsSectionRef = useRef(null);

//   /*
//    * Cost/performance:
//    * Keep DOMPurify sanitization, but add lazy/async image loading to article body.
//    * This does not change image URLs or editor-generated HTML structure.
//    */
//   const safeBodyHTML = useMemo(() => {
//     const cleanHTML = DOMPurify.sanitize(article?.body || "", {
//       ADD_ATTR: [
//         "data-size",
//         "class",
//         "loading",
//         "decoding",
//         "referrerpolicy",
//         "alt",
//       ],
//     });

//     try {
//       const parser = new DOMParser();
//       const parsed = parser.parseFromString(cleanHTML, "text/html");

//       parsed.querySelectorAll("img").forEach((img) => {
//         img.setAttribute("loading", "lazy");
//         img.setAttribute("decoding", "async");
//         img.setAttribute("referrerpolicy", "no-referrer");

//         if (!img.getAttribute("alt")) {
//           img.setAttribute("alt", article?.title || "Article image");
//         }
//       });

//       return parsed.body.innerHTML;
//     } catch {
//       return cleanHTML;
//     }
//   }, [article?.body, article?.title]);

//   /* ── 1. first fetch ── */
//   useEffect(() => {
//     let alive = true;

//     (async () => {
//       try {
//         setLoading(true);
//         setArticle(null);
//         setAuthor(null);
//         setCommentsReady(false);

//         const snap = await rdbGet(
//           rdbRef(getDatabase(), `articles/${articleId}`)
//         );

//         if (!alive) return;

//         if (!snap.exists()) {
//           setArticle(null);
//           setAuthor(null);
//           setLoading(false);
//           return;
//         }

//         const data = snap.val();

//         setArticle({ id: articleId, ...data });

//         if (data.authorId) {
//           const aSnap = await getDoc(doc(fsDb, "users", data.authorId));

//           if (!alive) return;

//           setAuthor(aSnap.exists() ? aSnap.data() : null);
//         } else {
//           setAuthor(null);
//         }
//       } catch (e) {
//         console.error("Article fetch failed:", e);
//       } finally {
//         if (alive) {
//           setLoading(false);
//         }
//       }
//     })();

//     return () => {
//       alive = false;
//     };
//   }, [articleId]);

//   /* ── 2. live counters for current article only ── */
//   useEffect(() => {
//     if (!articleId) return;

//     const u1 = streamViews(articleId, (v) => setViews(v || 0));
//     const u2 = streamLikes(articleId, setLikes);
//     const u3 = streamBookmarks(articleId, setBookmarks);
//     const u4 = streamCommentCount(articleId, setCommentCnt);

//     return () => {
//       u1();
//       u2();
//       u3();
//       u4();
//     };
//   }, [articleId]);

//   /*
//    * ── 3. unique-ish view (time-on-page) ──
//    * Cost saving:
//    * Keep the same 10-second view rule, but only increment once per article
//    * per browser session. This avoids repeated refresh/write cost.
//    */
//   useEffect(() => {
//     if (!articleId) return;

//     const viewerKey = uid || "guest";
//     const sessionKey = `laonaz:viewed:${articleId}:${viewerKey}`;

//     const timer = setTimeout(() => {
//       try {
//         if (sessionStorage.getItem(sessionKey)) return;

//         sessionStorage.setItem(sessionKey, "1");
//         incrementView(articleId);
//       } catch {
//         incrementView(articleId);
//       }
//     }, 10000);

//     return () => clearTimeout(timer);
//   }, [articleId, uid]);

//   /*
//    * ── 4. lazy comments ──
//    * Cost saving:
//    * CommentList may open comment listeners/reads.
//    * We mount it only when the comment section comes near viewport.
//    * If browser does not support IntersectionObserver, comments still load.
//    */
//  useEffect(() => {
//   if (commentsReady) return;

//   const node = commentsSectionRef.current;

//   // Safe fallback: do not keep comments stuck forever.
//   const fallbackTimer = setTimeout(() => {
//     setCommentsReady(true);
//   }, 1000);

//   if (!node || !("IntersectionObserver" in window)) {
//     return () => clearTimeout(fallbackTimer);
//   }

//   const observer = new IntersectionObserver(
//     (entries) => {
//       const entry = entries[0];

//       if (entry?.isIntersecting) {
//         setCommentsReady(true);
//         observer.disconnect();
//         clearTimeout(fallbackTimer);
//       }
//     },
//     {
//       root: null,
//       rootMargin: "600px",
//       threshold: 0,
//     }
//   );

//   observer.observe(node);

//   return () => {
//     observer.disconnect();
//     clearTimeout(fallbackTimer);
//   };
// }, [commentsReady, articleId]);

//   /* ── 5. rec/related lists & author cache ── */
//   const rec = useMemo(() => {
//     return allArticles
//       .filter((a) => a.id !== articleId)
//       .slice(0, CARD_LIMIT);
//   }, [allArticles, articleId]);

//   const related = useMemo(() => {
//     return allArticles
//       .filter((a) => a.category === article?.category && a.id !== articleId)
//       .slice(0, CARD_LIMIT);
//   }, [allArticles, article?.category, articleId]);

//   useEffect(() => {
//     const need = new Set([...rec, ...related].map((a) => a.authorId));
//     const miss = [...need].filter((id) => id && !authorMap[id]);

//     if (!miss.length) return;

//     let alive = true;

//     (async () => {
//       try {
//         const pairs = await Promise.all(
//           miss.map(async (id) => {
//             const s = await getDoc(doc(fsDb, "users", id));
//             return [id, s.exists() ? { uid: id, ...s.data() } : null];
//           })
//         );

//         if (!alive) return;

//         setAuthorMap((prev) => ({
//           ...prev,
//           ...Object.fromEntries(pairs),
//         }));
//       } catch (err) {
//         console.error("Author cache fetch failed:", err);
//       }
//     })();

//     return () => {
//       alive = false;
//     };
//   }, [rec, related, authorMap]);

//   /* ── guards ── */
//   if (loading) return <MDBSpinner className="d-block mx-auto my-5" />;
//   if (!article) return <p className="text-center my-5">Article not found.</p>;

//   /* ── helpers ── */
//   const formatDate = (d) =>
//     new Date(d).toLocaleDateString("en-US", {
//       month: "long",
//       day: "2-digit",
//       year: "numeric",
//     });

//   const created = formatDate(article.createdAt);
//   const updated = formatDate(article.updatedAt);
//   const edited = article.updatedAt !== article.createdAt;

//   const liked = uid ? likes.includes(uid) : false;
//   const marked = uid ? bookmarks.includes(uid) : false;

//   const doLike = () => {
//     if (!uid) return;

//     likeArticle(articleId, uid).catch((err) => {
//       console.error("likeArticle failed:", err);
//     });
//   };

//   const doMark = () => {
//     if (!uid) return;

//     toggleBookmark(articleId, uid).catch((err) => {
//       console.error("toggleBookmark failed:", err);
//     });
//   };

//   const fullName =
//     author?.username ||
//     author?.displayName ||
//     `${author?.firstName || ""} ${author?.lastName || ""}`.trim() ||
//     "Unknown author";

//   /* ── design palette from your system ── */
//   const C = {
//     pageBg: "var(--clr-field-mist)",
//     text: "#0A0A0A",
//     accent: "#5C6B3C",
//     muted: "#6B6B6B",
//     border: "#D6D9C6",
//     tagBg: "#E7ECD6",
//   };

//   /* ────── UI ────── */
//   return (
//     <MDBContainer
//       fluid="lg"
//       className="py-5"
//       style={{ background: "var(--clr-field-mist)" }}
//     >
//       <MDBRow className="justify-content-center">
//         <MDBCol lg="8">
//           {/* ====== TOP CARD (Hero + Header) ====== */}
//           <MDBCard
//             className="border-0 shadow-0 mb-5"
//             style={{ background: C.pageBg, borderRadius: 24 }}
//           >
//             <MDBCardBody className="article-card px-md-5 px-3 py-4">
//               {/* ====== ARTICLE HEADER (title + meta + author side) ====== */}
//               <MDBRow className="g-5 flex-column flex-md-row align-items-stretch article-head">
//                 {/* LEFT: Title + tags + meta */}
//                 <MDBCol
//                   md="8"
//                   className="order-2 order-md-1 d-flex flex-column"
//                 >
//                   <h1 className="article-title mb-4">{article.title}</h1>

//                   {/* tags row */}
//                   {Array.isArray(article.tags) && article.tags.length > 0 && (
//                     <div className="d-flex flex-wrap gap-2 mb-4 article-tags">
//                       {article.tags.map((t) => (
//                         <span className="article-tag" key={t}>
//                           #{t}
//                         </span>
//                       ))}
//                     </div>
//                   )}

//                   {/* meta row with icons */}
//                   <div className="article-meta">
//                     <span>{edited ? `Updated ${updated}` : created}</span>

//                     <span className="d-inline-flex align-items-center">
//                       <img
//                         src={ViewIcon}
//                         alt=""
//                         className="far meta-ico me-1"
//                       />
//                       {views}
//                     </span>

//                     <button
//                       type="button"
//                       onClick={doLike}
//                       className="btn btn-link p-0 text-decoration-none d-inline-flex align-items-center article-like"
//                       style={{ color: liked ? C.accent : undefined }}
//                     >
//                       <img src={LikeIcon} alt="" className="meta-ico me-1" />
//                       {likes.length}
//                     </button>

//                     <span className="d-inline-flex align-items-center">
//                       <img
//                         src={CommentIcon}
//                         alt=""
//                         className="far meta-ico me-1"
//                       />
//                       {commentCnt}
//                     </span>

//                     <span
//                       className="d-inline-flex align-items-center"
//                       role="button"
//                       title="Share"
//                     >
//                       <MDBIcon
//                         far
//                         icon="share-square"
//                         className="meta-ico-large"
//                       />
//                     </span>

//                     <button
//                       type="button"
//                       onClick={doMark}
//                       className="btn btn-link p-0 text-decoration-none d-inline-flex align-items-center article-bookmark"
//                       title={marked ? "Bookmarked" : "Bookmark"}
//                       style={{ color: marked ? "#FFC107" : undefined }}
//                     >
//                       <MDBIcon
//                         icon="star"
//                         fas={marked}
//                         far={!marked}
//                         className="meta-ico meta-ico-large"
//                       />
//                     </button>
//                   </div>
//                 </MDBCol>

//                 {/* RIGHT: Author block with vertical divider */}
//                 <MDBCol
//                   md="4"
//                   className="order-1 order-md-2 d-flex justify-content-center justify-content-md-start position-relative author-col"
//                 >
//                   <Link
//                     to={author?.username ? `/u/${author.username}` : "/profile"}
//                     className="d-flex flex-column align-items-center align-items-md-start text-center text-md-start w-100 author-link"
//                   >
//                     <img
//                       src={author?.avatarUrl || "https://placehold.co/160x160"}
//                       alt={fullName}
//                       className="rounded-circle mb-5 author-avatar"
//                       loading="lazy"
//                       decoding="async"
//                     />

//                     <div className="author-name">{fullName}</div>

//                     {author?.tagline && (
//                       <small className="author-role">{author.tagline}</small>
//                     )}
//                   </Link>
//                 </MDBCol>
//               </MDBRow>

//               {/* ====== ARTICLE BODY ====== */}
//               <div
//                 className="article-body mt-5 mb-4"
//                 dangerouslySetInnerHTML={{
//                   __html: safeBodyHTML,
//                 }}
//               />
//             </MDBCardBody>
//           </MDBCard>

//           <div
//             className="mt-5 mb-5"
//             style={{ height: 1, background: C.border }}
//           />

//           {/* ====== COMMENTS ====== */}
//           <div className="mb-4" ref={commentsSectionRef}>
//             <div className="d-flex align-items-center justify-content-between mb-3">
//               <h5 className="fw-bold m-0">Add your comment</h5>
//             </div>

//            {commentsReady ? (
//   <>
//     <CommentList articleId={articleId} currentUser={currentUser} />
//     <div ref={listEndRef} />
//   </>
// ) : (
//   <div className="py-3 text-muted">
//     <button
//       type="button"
//       className="btn btn-link p-0"
//       onClick={() => setCommentsReady(true)}
//       style={{
//         color: "#5C6B3C",
//         fontFamily: "Poppins, sans-serif",
//         fontWeight: 600,
//         textDecoration: "underline",
//       }}
//     >
//       Load comments
//     </button>
//   </div>
// )}
//           </div>

//           {/* ====== RECOMMENDED ====== */}
//           {rec.length > 0 && (
//             <>
//               <h5 className="fw-bold mt-4 mb-3">Recommended from LAONAZ</h5>

//               <MDBRow className="g-4">
//                 {rec.map((a) => (
//                   <MDBCol md="6" key={a.id}>
//                     <ArticleCard
//                       article={a}
//                       author={authorMap[a.authorId]}
//                       liveMeta={false}
//                     />
//                   </MDBCol>
//                 ))}
//               </MDBRow>
//             </>
//           )}

//           {/* ====== RELATED ====== */}
//           {related.length > 0 && (
//             <>
//               <h5 className="fw-bold mt-5 mb-3">
//                 More articles related to{" "}
//                 {article.category ? `#${article.category}` : "this topic"}
//               </h5>

//               <MDBRow className="g-4">
//                 {related.map((a) => (
//                   <MDBCol md="6" key={a.id}>
//                     <ArticleCard
//                       article={a}
//                       author={authorMap[a.authorId]}
//                       liveMeta={false}
//                     />
//                   </MDBCol>
//                 ))}
//               </MDBRow>
//             </>
//           )}
//         </MDBCol>
//       </MDBRow>
//     </MDBContainer>
//   );
// }


//above is working with cost cutting file below one is new one for articlebody cost cutting


// src/pages/ArticleDetailPage.jsx
import React, { useEffect, useState, useRef, useMemo } from "react";
import {
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBCard,
  MDBCardBody,
  MDBIcon,
  MDBSpinner,
} from "mdb-react-ui-kit";
import { useParams, Link } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";

import { db as fsDb } from "../../configs/firebase";
import { useAuth } from "../../context/AuthContext";
import {
  streamViews,
  incrementView,
  toggleBookmark,
  streamBookmarks,
  likeArticle,
  streamLikes,
  streamCommentCount,
  useArticles,
} from "../../configs/useArticles";
import { getArticleWithBodyOnce } from "../../configs/articles";

import CommentList from "../../components/cards/CommentList";
import ArticleCard from "../../components/cards/ArticleCard";
import DOMPurify from "dompurify";

/* ─────────── ICON ASSETS (your SVGs) ─────────── */
import ViewIcon from "../../images/icons/View Icon.svg";
import CommentIcon from "../../images/icons/comment icon.svg";
import LikeIcon from "../../images/icons/like icon.svg";

import "../../styles/ArticleDetailsPage.css";

const RELATED_SOURCE_LIMIT = 20;
const CARD_LIMIT = 4;


function upsertMeta(selector, attrs) {
  let element = document.head.querySelector(selector);

  if (!element) {
    element = document.createElement("meta");
    document.head.appendChild(element);
  }

  Object.entries(attrs).forEach(([key, value]) => {
    element.setAttribute(key, value);
  });
}

function upsertLink(selector, attrs) {
  let element = document.head.querySelector(selector);

  if (!element) {
    element = document.createElement("link");
    document.head.appendChild(element);
  }

  Object.entries(attrs).forEach(([key, value]) => {
    element.setAttribute(key, value);
  });
}

function upsertJsonLd(id, data) {
  let element = document.getElementById(id);

  if (!element) {
    element = document.createElement("script");
    element.id = id;
    element.type = "application/ld+json";
    document.head.appendChild(element);
  }

  element.textContent = JSON.stringify(data);
}

function stripHtml(html = "") {
  return String(html)
    .replace(/<[^>]*>?/gm, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function makeDescription(article) {
  const fromExcerpt = article?.excerpt || "";
  const fromBody = stripHtml(article?.body || "");

  const text =
    fromExcerpt ||
    fromBody ||
    "Read farming knowledge, organic farming, smart agriculture, soil health, seeds, government schemes, and sustainable farming articles on Laonaz.";

  return text.length > 155 ? `${text.slice(0, 152).trim()}...` : text;
}

export default function ArticleDetailPage() {
  const { articleId } = useParams();
  const { currentUser } = useAuth();
  const uid = currentUser?.uid;

  /* ── keep URL clean + jump to top ── */
  useEffect(() => {
    if (window.location.hash) {
      window.history.replaceState(
        null,
        document.title,
        window.location.pathname
      );
    }

    window.scrollTo({ top: 0, behavior: "auto" });
  }, [articleId]);

  /*
   * Cost saving:
   * This page uses 20 summaries for recommended/related.
   * Full article body is loaded only for the opened article through getArticleWithBodyOnce().
   */
  const allArticles = useArticles(RELATED_SOURCE_LIMIT) ?? [];

  /* ── local state ── */
  const [article, setArticle] = useState(null);
  const [author, setAuthor] = useState(null);
  const [loading, setLoading] = useState(true);

  const [views, setViews] = useState(0);
  const [likes, setLikes] = useState([]);
  const [bookmarks, setBookmarks] = useState([]);
  const [commentCnt, setCommentCnt] = useState(0);

  const [authorMap, setAuthorMap] = useState({});
  const [commentsReady, setCommentsReady] = useState(false);

  const listEndRef = useRef(null);
  const commentsSectionRef = useRef(null);

  /*
   * Cost/performance:
   * Keep DOMPurify sanitization, but add lazy/async image loading to article body.
   * This does not change image URLs or editor-generated HTML structure.
   */
  const safeBodyHTML = useMemo(() => {
    const cleanHTML = DOMPurify.sanitize(article?.body || "", {
      ADD_ATTR: [
        "data-size",
        "class",
        "loading",
        "decoding",
        "referrerpolicy",
        "alt",
      ],
    });

    try {
      const parser = new DOMParser();
      const parsed = parser.parseFromString(cleanHTML, "text/html");

      parsed.querySelectorAll("img").forEach((img) => {
        img.setAttribute("loading", "lazy");
        img.setAttribute("decoding", "async");
        img.setAttribute("referrerpolicy", "no-referrer");

        if (!img.getAttribute("alt")) {
          img.setAttribute("alt", article?.title || "Article image");
        }
      });

      return parsed.body.innerHTML;
    } catch {
      return cleanHTML;
    }
  }, [article?.body, article?.title]);

  /*
   * ── 1. first fetch ──
   * Phase 5:
   * Fetch lightweight article summary + full body separately.
   * This supports:
   * - new articles: body from articleBodies/{articleId}/body
   * - old articles: fallback body from articles/{articleId}/body
   */
  useEffect(() => {
  if (!article) return;

  const siteName = "Laonaz";
  const baseUrl = "https://laonaz.co.in";
  const articleUrl = `${baseUrl}/article/${articleId}`;

  const title = article.title
    ? `${article.title} | Laonaz`
    : "Farming Article | Laonaz";

  const description = makeDescription(article);
  const imageUrl = article.coverUrl || `${baseUrl}/logo2.png`;

  document.title = title;

  upsertMeta('meta[name="description"]', {
    name: "description",
    content: description,
  });

  upsertMeta('meta[name="robots"]', {
    name: "robots",
    content: "index, follow, max-image-preview:large",
  });

  upsertLink('link[rel="canonical"]', {
    rel: "canonical",
    href: articleUrl,
  });

  upsertMeta('meta[property="og:type"]', {
    property: "og:type",
    content: "article",
  });

  upsertMeta('meta[property="og:site_name"]', {
    property: "og:site_name",
    content: siteName,
  });

  upsertMeta('meta[property="og:title"]', {
    property: "og:title",
    content: title,
  });

  upsertMeta('meta[property="og:description"]', {
    property: "og:description",
    content: description,
  });

  upsertMeta('meta[property="og:url"]', {
    property: "og:url",
    content: articleUrl,
  });

  upsertMeta('meta[property="og:image"]', {
    property: "og:image",
    content: imageUrl,
  });

  upsertMeta('meta[name="twitter:card"]', {
    name: "twitter:card",
    content: "summary_large_image",
  });

  upsertMeta('meta[name="twitter:title"]', {
    name: "twitter:title",
    content: title,
  });

  upsertMeta('meta[name="twitter:description"]', {
    name: "twitter:description",
    content: description,
  });

  upsertMeta('meta[name="twitter:image"]', {
    name: "twitter:image",
    content: imageUrl,
  });

  const publishedDate = article.createdAt
    ? new Date(article.createdAt).toISOString()
    : new Date().toISOString();

  const modifiedDate = article.updatedAt
    ? new Date(article.updatedAt).toISOString()
    : publishedDate;

  upsertJsonLd("laonaz-article-jsonld", {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title || "Laonaz Farming Article",
    description,
    image: imageUrl,
    author: {
      "@type": "Person",
      name:
        author?.username ||
        author?.displayName ||
        `${author?.firstName || ""} ${author?.lastName || ""}`.trim() ||
        "Laonaz Author",
    },
    publisher: {
      "@type": "Organization",
      name: "Laonaz",
      logo: {
        "@type": "ImageObject",
        url: `${baseUrl}/logo2.png`,
      },
    },
    datePublished: publishedDate,
    dateModified: modifiedDate,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": articleUrl,
    },
    keywords: Array.isArray(article.tags) ? article.tags.join(", ") : "",
  });
}, [article, author, articleId]);

  useEffect(() => {
    let alive = true;

    (async () => {
      try {
        setLoading(true);
        setArticle(null);
        setAuthor(null);
        setCommentsReady(false);

        const data = await getArticleWithBodyOnce(articleId);

        if (!alive) return;

        if (!data) {
          setArticle(null);
          setAuthor(null);
          setLoading(false);
          return;
        }

        setArticle(data);

        if (data.authorId) {
          const aSnap = await getDoc(doc(fsDb, "users", data.authorId));

          if (!alive) return;

          setAuthor(aSnap.exists() ? aSnap.data() : null);
        } else {
          setAuthor(null);
        }
      } catch (e) {
        console.error("Article fetch failed:", e);
      } finally {
        if (alive) {
          setLoading(false);
        }
      }
    })();

    return () => {
      alive = false;
    };
  }, [articleId]);

  /* ── 2. live counters for current article only ── */
  useEffect(() => {
    if (!articleId) return;

    const u1 = streamViews(articleId, (v) => setViews(v || 0));
    const u2 = streamLikes(articleId, setLikes);
    const u3 = streamBookmarks(articleId, setBookmarks);
    const u4 = streamCommentCount(articleId, setCommentCnt);

    return () => {
      u1();
      u2();
      u3();
      u4();
    };
  }, [articleId]);

  /*
   * ── 3. unique-ish view (time-on-page) ──
   * Cost saving:
   * Keep the same 10-second view rule, but only increment once per article
   * per browser session. This avoids repeated refresh/write cost.
   */
  useEffect(() => {
    if (!articleId) return;

    const viewerKey = uid || "guest";
    const sessionKey = `laonaz:viewed:${articleId}:${viewerKey}`;

    const timer = setTimeout(() => {
      try {
        if (sessionStorage.getItem(sessionKey)) return;

        sessionStorage.setItem(sessionKey, "1");
        incrementView(articleId);
      } catch {
        incrementView(articleId);
      }
    }, 10000);

    return () => clearTimeout(timer);
  }, [articleId, uid]);

  /*
   * ── 4. lazy comments ──
   * Cost saving:
   * CommentList may open comment listeners/reads.
   * We mount it only when the comment section comes near viewport.
   * Fallback timer prevents comments from staying stuck.
   */
  useEffect(() => {
    if (commentsReady) return;

    const node = commentsSectionRef.current;

    const fallbackTimer = setTimeout(() => {
      setCommentsReady(true);
    }, 1000);

    if (!node || !("IntersectionObserver" in window)) {
      return () => clearTimeout(fallbackTimer);
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];

        if (entry?.isIntersecting) {
          setCommentsReady(true);
          observer.disconnect();
          clearTimeout(fallbackTimer);
        }
      },
      {
        root: null,
        rootMargin: "600px",
        threshold: 0,
      }
    );

    observer.observe(node);

    return () => {
      observer.disconnect();
      clearTimeout(fallbackTimer);
    };
  }, [commentsReady, articleId]);

  /* ── 5. rec/related lists & author cache ── */
  const rec = useMemo(() => {
    return allArticles
      .filter((a) => a.id !== articleId)
      .slice(0, CARD_LIMIT);
  }, [allArticles, articleId]);

  const related = useMemo(() => {
    return allArticles
      .filter((a) => a.category === article?.category && a.id !== articleId)
      .slice(0, CARD_LIMIT);
  }, [allArticles, article?.category, articleId]);

  useEffect(() => {
    const need = new Set([...rec, ...related].map((a) => a.authorId));
    const miss = [...need].filter((id) => id && !authorMap[id]);

    if (!miss.length) return;

    let alive = true;

    (async () => {
      try {
        const pairs = await Promise.all(
          miss.map(async (id) => {
            const s = await getDoc(doc(fsDb, "users", id));
            return [id, s.exists() ? { uid: id, ...s.data() } : null];
          })
        );

        if (!alive) return;

        setAuthorMap((prev) => ({
          ...prev,
          ...Object.fromEntries(pairs),
        }));
      } catch (err) {
        console.error("Author cache fetch failed:", err);
      }
    })();

    return () => {
      alive = false;
    };
  }, [rec, related, authorMap]);

  /* ── guards ── */
  if (loading) return <MDBSpinner className="d-block mx-auto my-5" />;
  if (!article) return <p className="text-center my-5">Article not found.</p>;

  /* ── helpers ── */
  const formatDate = (d) =>
    new Date(d).toLocaleDateString("en-US", {
      month: "long",
      day: "2-digit",
      year: "numeric",
    });

  const created = formatDate(article.createdAt);
  const updated = formatDate(article.updatedAt);
  const edited = article.updatedAt !== article.createdAt;

  const liked = uid ? likes.includes(uid) : false;
  const marked = uid ? bookmarks.includes(uid) : false;

  const doLike = () => {
    if (!uid) return;

    likeArticle(articleId, uid).catch((err) => {
      console.error("likeArticle failed:", err);
    });
  };

  const doMark = () => {
    if (!uid) return;

    toggleBookmark(articleId, uid).catch((err) => {
      console.error("toggleBookmark failed:", err);
    });
  };

  const fullName =
    author?.username ||
    author?.displayName ||
    `${author?.firstName || ""} ${author?.lastName || ""}`.trim() ||
    "Unknown author";

  /* ── design palette from your system ── */
  const C = {
    pageBg: "var(--clr-field-mist)",
    text: "#0A0A0A",
    accent: "#5C6B3C",
    muted: "#6B6B6B",
    border: "#D6D9C6",
    tagBg: "#E7ECD6",
  };

  /* ────── UI ────── */
  return (
    <MDBContainer
      fluid="lg"
      className="py-5"
      style={{ background: "var(--clr-field-mist)" }}
    >
      <MDBRow className="justify-content-center">
        <MDBCol lg="8">
          {/* ====== TOP CARD (Hero + Header) ====== */}
          <MDBCard
            className="border-0 shadow-0 mb-5"
            style={{ background: C.pageBg, borderRadius: 24 }}
          >
            <MDBCardBody className="article-card px-md-5 px-3 py-4">
              {/* ====== ARTICLE HEADER (title + meta + author side) ====== */}
              <MDBRow className="g-5 flex-column flex-md-row align-items-stretch article-head">
                {/* LEFT: Title + tags + meta */}
                <MDBCol
                  md="8"
                  className="order-2 order-md-1 d-flex flex-column"
                >
                  <h1 className="article-title mb-4">{article.title}</h1>

                  {/* tags row */}
                  {Array.isArray(article.tags) && article.tags.length > 0 && (
                    <div className="d-flex flex-wrap gap-2 mb-4 article-tags">
                      {article.tags.map((t) => (
                        <span className="article-tag" key={t}>
                          #{t}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* meta row with icons */}
                  <div className="article-meta">
                    <span>{edited ? `Updated ${updated}` : created}</span>

                    <span className="d-inline-flex align-items-center">
                      <img
                        src={ViewIcon}
                        alt=""
                        className="far meta-ico me-1"
                      />
                      {views}
                    </span>

                    <button
                      type="button"
                      onClick={doLike}
                      className="btn btn-link p-0 text-decoration-none d-inline-flex align-items-center article-like"
                      style={{ color: liked ? C.accent : undefined }}
                    >
                      <img src={LikeIcon} alt="" className="meta-ico me-1" />
                      {likes.length}
                    </button>

                    <span className="d-inline-flex align-items-center">
                      <img
                        src={CommentIcon}
                        alt=""
                        className="far meta-ico me-1"
                      />
                      {commentCnt}
                    </span>

                    <span
                      className="d-inline-flex align-items-center"
                      role="button"
                      title="Share"
                    >
                      <MDBIcon
                        far
                        icon="share-square"
                        className="meta-ico-large"
                      />
                    </span>

                    <button
                      type="button"
                      onClick={doMark}
                      className="btn btn-link p-0 text-decoration-none d-inline-flex align-items-center article-bookmark"
                      title={marked ? "Bookmarked" : "Bookmark"}
                      style={{ color: marked ? "#FFC107" : undefined }}
                    >
                      <MDBIcon
                        icon="star"
                        fas={marked}
                        far={!marked}
                        className="meta-ico meta-ico-large"
                      />
                    </button>
                  </div>
                </MDBCol>

                {/* RIGHT: Author block with vertical divider */}
                <MDBCol
                  md="4"
                  className="order-1 order-md-2 d-flex justify-content-center justify-content-md-start position-relative author-col"
                >
                  <Link
                    to={author?.username ? `/u/${author.username}` : "/profile"}
                    className="d-flex flex-column align-items-center align-items-md-start text-center text-md-start w-100 author-link"
                  >
                    <img
                      src={author?.avatarUrl || "https://placehold.co/160x160"}
                      alt={fullName}
                      className="rounded-circle mb-5 author-avatar"
                      loading="lazy"
                      decoding="async"
                    />

                    <div className="author-name">{fullName}</div>

                    {author?.tagline && (
                      <small className="author-role">{author.tagline}</small>
                    )}
                  </Link>
                </MDBCol>
              </MDBRow>

              {/* ====== ARTICLE BODY ====== */}
              <div
                className="article-body mt-5 mb-4"
                dangerouslySetInnerHTML={{
                  __html: safeBodyHTML,
                }}
              />
            </MDBCardBody>
          </MDBCard>

          <div
            className="mt-5 mb-5"
            style={{ height: 1, background: C.border }}
          />

          {/* ====== COMMENTS ====== */}
          <div className="mb-4" ref={commentsSectionRef}>
            <div className="d-flex align-items-center justify-content-between mb-3">
              <h5 className="fw-bold m-0">Add your comment</h5>
            </div>

            {commentsReady ? (
              <>
                <CommentList articleId={articleId} currentUser={currentUser} />
                <div ref={listEndRef} />
              </>
            ) : (
              <div className="py-3 text-muted">
                <button
                  type="button"
                  className="btn btn-link p-0"
                  onClick={() => setCommentsReady(true)}
                  style={{
                    color: "#5C6B3C",
                    fontFamily: "Poppins, sans-serif",
                    fontWeight: 600,
                    textDecoration: "underline",
                  }}
                >
                  Load comments
                </button>
              </div>
            )}
          </div>

          {/* ====== RECOMMENDED ====== */}
          {rec.length > 0 && (
            <>
              <h5 className="fw-bold mt-4 mb-3">Recommended from LAONAZ</h5>

              <MDBRow className="g-4">
                {rec.map((a) => (
                  <MDBCol md="6" key={a.id}>
                    <ArticleCard
                      article={a}
                      author={authorMap[a.authorId]}
                      liveMeta={false}
                    />
                  </MDBCol>
                ))}
              </MDBRow>
            </>
          )}

          {/* ====== RELATED ====== */}
          {related.length > 0 && (
            <>
              <h5 className="fw-bold mt-5 mb-3">
                More articles related to{" "}
                {article.category ? `#${article.category}` : "this topic"}
              </h5>

              <MDBRow className="g-4">
                {related.map((a) => (
                  <MDBCol md="6" key={a.id}>
                    <ArticleCard
                      article={a}
                      author={authorMap[a.authorId]}
                      liveMeta={false}
                    />
                  </MDBCol>
                ))}
              </MDBRow>
            </>
          )}
        </MDBCol>
      </MDBRow>
    </MDBContainer>
  );
}