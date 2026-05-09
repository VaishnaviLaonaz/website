// //Pages/Notification.jsx
// import React, { useEffect, useState } from 'react';
// import { Link } from 'react-router-dom';
// import {
//   collection,
//   query,
//   orderBy,
//   limit,
//   onSnapshot,
//   updateDoc
// } from 'firebase/firestore';
// import { db } from '../../configs/firebase';
// import { useAuth } from '../../context/AuthContext';
// import { useUserDoc } from '../../configs/user';

// import { MDBIcon, MDBBtn } from 'mdb-react-ui-kit';
// export default function Notifications({ onClose }) {
//   const { currentUser } = useAuth();
//   const [items, setItems] = useState([]);
//   const { userDoc } = useUserDoc();

//   /* stream latest 20 notifications */
//   useEffect(() => {
//     if (!currentUser) return;
//     const q = query(
//       collection(db, 'users', currentUser.uid, 'notifications'),
//       orderBy('createdAt', 'desc'),
//       limit(20)
//     );
//     return onSnapshot(q, (snap) => {
//       const list = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
//       setItems(list);

//       /* mark everything we just fetched as read */
//       snap.docs.forEach((d) => {
//         if (!d.data().read) updateDoc(d.ref, { read: true });
//       });
//     });
//   }, [currentUser]);
//   const avatarSrc =
//     userDoc?.avatarUrl ||
//     currentUser?.photoURL;

//   return (
//     <div
//       className="position-absolute top-100 end-0 bg-white shadow rounded p-3"
//       style={{ width: 320, zIndex: 1000 }}
//     >
//       <div className="d-flex justify-content-between align-items-center mb-2">
//         <strong>Notifications</strong>
//         <MDBBtn size="sm" color="link" className="p-0" onClick={onClose}>
//           <MDBIcon fas icon="times" />
//         </MDBBtn>
//       </div>

//       {items.length === 0 ? (
//         <p className="text-muted mb-0">No notifications</p>
//       ) : (
//         <ul className="list-unstyled mb-0">
//           {items.map((n) => (
//             <li key={n.id} className="d-flex align-items-start gap-2 mb-3">
//               <img
//                 src={avatarSrc}
//                 alt=""
//                 width={32}
//                 height={32}
//                 className="rounded-circle object-fit-cover"
//               />
//               <div style={{ fontSize: '0.9rem' }}>
//                 {n.type === 'comment' && (
//                   <Link
//                     to={`/article/${n.articleId}`}
//                     className="text-decoration-none"
//                     onClick={onClose}
//                   >
//                     <strong>{n.actorName}</strong> commented on&nbsp;
//                     <em>{n.articleTitle}</em>
//                   </Link>
//                 )}
//                 {n.type === 'like' && (
//                   <Link
//                     to={`/article/${n.articleId}`}
//                     className="text-decoration-none"
//                     onClick={onClose}
//                   >
//                     <strong>{n.actorName}</strong> liked&nbsp;
//                     <em>{n.articleTitle}</em>
//                   </Link>
//                 )}

//                 {n.type === 'comment-reply' && (
//                   <Link
//                     to={`/article/${n.articleId}#comment-${n.commentId}`}
//                     className="text-decoration-none"
//                     onClick={onClose}
//                   >
//                     <strong>{n.actorName}</strong> replied to your comment
//                   </Link>
//                 )}
//                 {n.type === 'comment-like' && (
//                   <Link
//                     to={`/article/${n.articleId}#comment-${n.commentId}`}
//                     className="text-decoration-none"
//                     onClick={onClose}
//                   >
//                     <strong>{n.actorName}</strong> liked your comment
//                   </Link>
//                 )}
//                 {n.type === 'follow' && (
//                   <Link
//                     to={`/profile/${n.actorId}`}
//                     className="text-decoration-none"
//                     onClick={onClose}
//                   >
//                     <strong>{n.actorName}</strong> started following you
//                   </Link>
//                 )}
//               </div>
//             </li>
//           ))}
//         </ul>
//       )}
//     </div>
//   );
// }


// // Pages/Notification.jsx
// import React, { useEffect, useState } from 'react';
// import { Link } from 'react-router-dom';
// import {
//   collection,
//   query,
//   orderBy,
//   limit,
//   onSnapshot,
//   updateDoc
// } from 'firebase/firestore';
// import { db } from '../../configs/firebase';
// import { useAuth } from '../../context/AuthContext';
// import { useUserDoc } from '../../configs/user';

// import { MDBIcon, MDBBtn } from 'mdb-react-ui-kit';

// const OLIVE = '#5C6B3C';
// const CANVAS = '#FFFFFF';
// const DIVIDER = 'rgba(92, 107, 60, 0.35)'; // subtle olive divider
// const SHADOW = '0 10px 30px rgba(0,0,0,0.18)';

// export default function Notifications({ onClose }) {
//   const { currentUser } = useAuth();
//   const [items, setItems] = useState([]);
//   const { userDoc } = useUserDoc();

//   /* stream latest 20 notifications */
//   useEffect(() => {
//     if (!currentUser) return;
//     const q = query(
//       collection(db, 'users', currentUser.uid, 'notifications'),
//       orderBy('createdAt', 'desc'),
//       limit(20)
//     );
//     return onSnapshot(q, (snap) => {
//       const list = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
//       setItems(list);

//       /* mark everything we just fetched as read */
//       snap.docs.forEach((d) => {
//         if (!d.data().read) updateDoc(d.ref, { read: true });
//       });
//     });
//   }, [currentUser]);

//   const avatarSrc = userDoc?.avatarUrl || currentUser?.photoURL;

//   return (
//     <div
//       className="position-absolute top-100 end-0"
//       style={{
//         minWidth: 300,
//         background: CANVAS,
//         border: `1px solid ${OLIVE}`,
//         borderRadius: 10,
//         boxShadow: SHADOW,
//         zIndex: 999,
//         overflow: 'hidden' // keeps header radius clean
//       }}
//     >
//       {/* Header bar */}
//       <div
//         className="d-flex justify-content-between align-items-center"
//         style={{
//           background: OLIVE,
//           color: '#FFF',
//           padding: '12px 16px'
//         }}
//       >
//         <strong style={{ fontFamily: 'Poppins, sans-serif', fontSize: 18 }}>
//           Notifications
//         </strong>
//         <MDBBtn
//           size="sm"
//           color="link"
//           className="p-0 m-0"
//           onClick={onClose}
//           style={{ color: '#FFF' }}
//         >
//           <MDBIcon fas icon="times" />
//         </MDBBtn>
//       </div>

//       {/* List */}
//       <div style={{ padding: 0 }}>
//         {items.length === 0 ? (
//           <p className="text-muted mb-0 py-3 px-3">No notifications</p>
//         ) : (
//           <ul className="list-unstyled mb-0">
//             {items.map((n, idx) => (
//               <li
//                 key={n.id}
//                 className="d-flex align-items-start gap-2"
//                 style={{
//                   padding: '14px 16px',
//                   borderTop: idx === 0 ? 'none' : `1px solid ${DIVIDER}`,
//                   background: CANVAS
//                 }}
//               >
//                 <img
//                   src={avatarSrc}
//                   alt=""
//                   width={36}
//                   height={36}
//                   className="rounded-circle object-fit-cover"
//                 />
//                 <div style={{ fontSize: '0.95rem', lineHeight: 1.35 }}>
//                   {n.type === 'comment' && (
//                     <Link
//                       to={`/article/${n.articleId}`}
//                       className="text-decoration-none"
//                       onClick={onClose}
//                       style={{ color: '#222' }}
//                     >
//                       <strong>{n.actorName}</strong> commented on&nbsp;
//                       <em>{n.articleTitle}</em>
//                     </Link>
//                   )}

//                   {n.type === 'like' && (
//                     <Link
//                       to={`/article/${n.articleId}`}
//                       className="text-decoration-none"
//                       onClick={onClose}
//                       style={{ color: '#222' }}
//                     >
//                       <strong>{n.actorName}</strong> liked&nbsp;
//                       <em>{n.articleTitle}</em>
//                     </Link>
//                   )}

//                   {n.type === 'comment-reply' && (
//                     <Link
//                       to={`/article/${n.articleId}#comment-${n.commentId}`}
//                       className="text-decoration-none"
//                       onClick={onClose}
//                       style={{ color: '#222' }}
//                     >
//                       <strong>{n.actorName}</strong> replied to your comment
//                     </Link>
//                   )}

//                   {n.type === 'comment-like' && (
//                     <Link
//                       to={`/article/${n.articleId}#comment-${n.commentId}`}
//                       className="text-decoration-none"
//                       onClick={onClose}
//                       style={{ color: '#222' }}
//                     >
//                       <strong>{n.actorName}</strong> liked your comment
//                     </Link>
//                   )}

//                   {n.type === 'follow' && (
//                     <Link
//                       to={`/profile/${n.actorId}`}
//                       className="text-decoration-none"
//                       onClick={onClose}
//                       style={{ color: '#222' }}
//                     >
//                       <strong>{n.actorName}</strong> started following you
//                     </Link>
//                   )}
//                 </div>
//               </li>
//             ))}
//           </ul>
//         )}
//       </div>
//     </div>
//   );
// }








// // Pages/Notification.jsx
// import React, { useEffect, useState } from 'react';
// import { Link } from 'react-router-dom';
// import {
//   collection,
//   query,
//   orderBy,
//   limit,
//   onSnapshot,
//   updateDoc
// } from 'firebase/firestore';
// import { db } from '../../configs/firebase';
// import { useAuth } from '../../context/AuthContext';
// import { useUserDoc } from '../../configs/user';
// import { useNavigate } from 'react-router-dom';
// import { MDBIcon, MDBBtn } from 'mdb-react-ui-kit';

// const OLIVE = '#5C6B3C';
// const CANVAS = '#FFFFFF';
// const DIVIDER = 'rgba(92, 107, 60, 0.35)'; // subtle olive divider
// const SHADOW = '0 10px 30px rgba(0,0,0,0.18)';

// // approximate row height (avatar 36px + paddings), used to cap visible rows to 5
// const ROW_HEIGHT = 64;
// const MAX_VISIBLE_ROWS = 5;

// export default function Notifications({ onClose }) {
//   const { currentUser } = useAuth();
//   const [items, setItems] = useState([]);
//   const { userDoc } = useUserDoc();
//   const navigate = useNavigate();

//   /* stream latest 20 notifications */
//   useEffect(() => {
//     if (!currentUser) return;
//     const q = query(
//       collection(db, 'users', currentUser.uid, 'notifications'),
//       orderBy('createdAt', 'desc'),
//       limit(20)
//     );
//     return onSnapshot(q, (snap) => {
//       const list = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
//       setItems(list);

//       /* mark everything we just fetched as read */
//       snap.docs.forEach((d) => {
//         // if (!d.data().read) updateDoc(d.ref, { read: true });
//         const data = d.data();
//         if (data.createdAt && !data.read) updateDoc(d.ref, { read: true});
//       });
//     });
//   }, [currentUser]);

//   const avatarSrc = userDoc?.avatarUrl || currentUser?.photoURL;

//   return (
//     <div
//       className="position-absolute top-100 end-0"
//       style={{
//         minWidth: 300,
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
//       {/* Header bar */}
//       <div
//         className="d-flex justify-content-between align-items-center"
//         style={{
//           background: OLIVE,
//           color: '#FFF',
//           padding: '12px 16px'
//         }}
//       >
//         <strong style={{ fontFamily: 'Poppins, sans-serif', fontSize: 18 }}>
//           Notifications
//         </strong>
//         <MDBBtn
//           size="sm"
//           color="link"
//           className="p-0 m-0"
//           onClick={onClose}
//           style={{ color: '#FFF' }}
//           aria-label="Close notifications"
//         >
//           <MDBIcon fas icon="times" />
//         </MDBBtn>
//       </div>

//       {/* Scrollable list area (max 5 visible rows) */}
//       <div
      
//         style={{
//           padding: 0,
//           maxHeight: `${ROW_HEIGHT * MAX_VISIBLE_ROWS}px`,
//           overflowY: items.length > MAX_VISIBLE_ROWS ? 'auto' : 'visible'
//         }}
//       >
//         {items.length === 0 ? (
//           <p className="text-muted mb-0 py-3 px-3">No notifications</p>
//         ) : (
//           <ul className="list-unstyled mb-0 notification-list">
//             {items.map((n, idx) => (
//               <li
//                 key={n.id}
//                 className="d-flex align-items-start gap-2"
//                 style={{
//                   padding: '14px 16px',
//                   borderTop: idx === 0 ? 'none' : `1px solid ${DIVIDER}`,
//                   background: CANVAS,
//                   minHeight: ROW_HEIGHT
//                 }}
//               >
//                 <img
//                   src={n.actorAvatar}
//                   alt=""
//                   width={36}
//                   height={36}
//                   className="rounded-circle object-fit-cover"
//                 />
//                 <div style={{ fontSize: '0.95rem', lineHeight: 1.35 }}>
//                   {n.type === 'comment' && (
                   
//                    <Link
//                       to={`/article/${n.articleId}`}
//                       className="notification-link"
//                        onClick={(e) => {
//                        e.preventDefault();
//                        const href = e.currentTarget.getAttribute("href");
//                        setTimeout(() => {
//                          onClose?.();
//                          navigate(href);
//                        }, 100);
//                      }}
//                       style={{ color: '#222' }}
//                     >
//                       <strong>{n.actorName}</strong> commented on&nbsp;
//                       <em className="notification-text">{n.articleTitle}</em>
//                     </Link>
//                   )}

//                   {n.type === 'like' && (
//                     <Link
//                       to={`/article/${n.articleId}`}
//                       className="text-decoration-none"
//                       onClick={(e) => {
//                        e.preventDefault();
//                        const href = e.currentTarget.getAttribute("href");
//                        setTimeout(() => {
//                          onClose?.();
//                          navigate(href);
//                        }, 100);
//                      }}
//                       style={{ color: '#222' }}
//                     >
//                       <strong>{n.actorName}</strong> liked&nbsp;
//                       <em className="notification-text">{n.articleTitle}</em>
//                     </Link>
//                   )}

//                   {n.type === 'comment-reply' && (
//                     <Link
//                       to={`/article/${n.articleId}#comment-${n.commentId}`}
//                       className="text-decoration-none"
//                        onClick={(e) => {
//                        e.preventDefault();
//                        const href = e.currentTarget.getAttribute("href");
//                        setTimeout(() => {
//                          onClose?.();
//                          navigate(href);
//                        }, 100);
//                      }}
//                       style={{ color: '#222' }}
//                     >
//                       <strong>{n.actorName}</strong> replied to your comment
//                     </Link>
//                   )}

//                   {n.type === 'comment-like' && (
//                     <Link
//                       to={`/article/${n.articleId}#comment-${n.commentId}`}
//                       className="text-decoration-none"
//                       onClick={(e) => {
//                        e.preventDefault();
//                        const href = e.currentTarget.getAttribute("href");
//                        setTimeout(() => {
//                          onClose?.();
//                          navigate(href);
//                        }, 100);
//                      }}
//                       style={{ color: '#222' }}
//                     >
//                       <strong>{n.actorName}</strong> liked your comment
//                     </Link>
//                   )}

//                   {n.type === 'follow' && (
//                     <Link
                   
//                       // to={`/profile/${n.actorId}`}
//                       to={`/u/${n.actorName || n.actorId}`}
//                       className="text-decoration-none"
//                        onClick={(e) => {
//                        e.preventDefault();
//                        const href = e.currentTarget.getAttribute("href");
//                        setTimeout(() => {
//                          onClose?.();
//                          navigate(href);
//                        }, 100);
//                      }}
//                       style={{ color: '#222' }}
//                     >
//                       <strong>{n.actorName}</strong> started following you
//                     </Link>
//                   )}

//                      {n.type === 'article-publish' && (
//                       <Link
//                         to={`/article/${n.articleId}`}
//                         className="text-decoration-none"
//                          onClick={(e) => {
//                        e.preventDefault();
//                        const href = e.currentTarget.getAttribute("href");
//                        setTimeout(() => {
//                          onClose?.();
//                          navigate(href);
//                        }, 100);
//                      }}
//                         style={{ color: '#222' }}
//                       >
//                         <strong>{n.actorUsername}</strong> published a new article:  
//                         <em className="notification-text">{n.articleTitle}</em>
//                       </Link>
//                     )}
//                 </div>
//               </li>
//             ))}
//           </ul>
//         )}
//       </div>
//     </div>
//   );
// }


// <style>
// {`
//   .notification-text {
//     max-width: 120px;
//     display: inline-block;
//     overflow: hidden;
//     text-overflow: ellipsis;
//     white-space: nowrap;
//     vertical-align: bottom;
//   }

//   .notification-list li {
//     word-break: break-word;
//   }

//   .notification-link {
//     color: #222;
//     text-decoration: none;
//   }

//   .notification-link:hover {
//     text-decoration: underline;
//   }
// `}
// </style>








// // Pages/Notification.jsx
// import React, { useEffect, useState } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import {
//   collection, query, orderBy, limit, onSnapshot, updateDoc
// } from 'firebase/firestore';
// import { db } from '../../configs/firebase';
// import { useAuth } from '../../context/AuthContext';
// import { useUserDoc } from '../../configs/user';
// import { MDBIcon, MDBBtn } from 'mdb-react-ui-kit';

// const OLIVE   = '#5C6B3C';
// const CANVAS  = '#FFFFFF';
// const DIVIDER = 'rgba(92, 107, 60, 0.35)';
// const SHADOW  = '0 10px 30px rgba(0,0,0,0.18)';

// const ROW_HEIGHT       = 64;
// const MAX_VISIBLE_ROWS = 5;

// export default function Notifications({ onClose }) {
//   const { currentUser } = useAuth();
//   const { userDoc } = useUserDoc();
//   const [items, setItems] = useState([]);
//   const navigate = useNavigate();

//   /* stream latest 20 notifications */
//   useEffect(() => {
//     if (!currentUser) return;
//     const q = query(
//       collection(db, 'users', currentUser.uid, 'notifications'),
//       orderBy('createdAt', 'desc'),
//       limit(20)
//     );
//     return onSnapshot(q, (snap) => {
//       const list = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
//       setItems(list);
//       // mark fetched as read
//       snap.docs.forEach((d) => {
//         const data = d.data();
//         if (data.createdAt && !data.read) updateDoc(d.ref, { read: true });
//       });
//     });
//   }, [currentUser]);

//   const avatarSrc = userDoc?.avatarUrl || currentUser?.photoURL;

//   // Only intercept plain LEFT click; allow middle/ctrl/cmd to work natively.
//   const handleNav = (e, href) => {
//     if (
//       e.button !== 0 ||         // not left click
//       e.metaKey || e.ctrlKey || // cmd/ctrl -> new tab
//       e.altKey  || e.shiftKey
//     ) {
//       return; // let browser handle it
//     }
//     e.preventDefault();
//     // close then navigate
//     onClose?.();
//     navigate(href);
//   };

//   return (
//     <>
//       {/* Local styles that actually render */}
//       <style>{`
//         .notification-list { list-style: none; margin: 0; padding: 0; }
//         .notification-item { padding: 14px 16px; min-height: ${ROW_HEIGHT}px; background: ${CANVAS}; }
//         .notification-row   { display: flex; align-items: start; gap: 8px; }
//         .notification-body  { font-size: 0.95rem; line-height: 1.35; flex: 1; min-width: 0; }

//         .notification-link {
//           color: #222;
//           text-decoration: none;
//           display: inline-block;
//           max-width: 220px;         /* keep link compact */
//           vertical-align: bottom;
//         }
//         .notification-link:hover { text-decoration: underline; }

//         .notification-text {
//           max-width: 140px;         /* clamp the title part */
//           display: inline-block;
//           overflow: hidden;
//           text-overflow: ellipsis;
//           white-space: nowrap;
//           vertical-align: bottom;
//         }
//       `}</style>

//       <div
//         className="position-absolute top-100 end-0"
//         style={{
//           minWidth: 300,
//           background: CANVAS,
//           border: `1px solid ${OLIVE}`,
//           borderRadius: 10,
//           boxShadow: SHADOW,
//           zIndex: 999,
//           overflow: 'hidden'
//         }}
//         role="dialog"
//         aria-label="Notifications"
//       >
//         {/* Header */}
//         <div
//           className="d-flex justify-content-between align-items-center"
//           style={{ background: OLIVE, color: '#FFF', padding: '12px 16px' }}
//         >
//           <strong style={{ fontFamily: 'Poppins, sans-serif', fontSize: 18 }}>
//             Notifications
//           </strong>
//           <MDBBtn
//             size="sm"
//             color="link"
//             className="p-0 m-0"
//             onClick={onClose}
//             style={{ color: '#FFF' }}
//             aria-label="Close notifications"
//           >
//             <MDBIcon fas icon="times" />
//           </MDBBtn>
//         </div>

//         {/* List */}
//         <div
//           style={{
//             padding: 0,
//             maxHeight: `${ROW_HEIGHT * MAX_VISIBLE_ROWS}px`,
//             overflowY: items.length > MAX_VISIBLE_ROWS ? 'auto' : 'visible'
//           }}
//         >
//           {items.length === 0 ? (
//             <p className="text-muted mb-0 py-3 px-3">No notifications</p>
//           ) : (
//             <ul className="notification-list">
//               {items.map((n, idx) => {
//                 const borderTop = idx === 0 ? 'none' : `1px solid ${DIVIDER}`;
//                 return (
//                   <li key={n.id} className="notification-item" style={{ borderTop }}>
//                     <div className="notification-row">
//                       <img
//                         src={n.actorAvatar}
//                         alt=""
//                         width={36}
//                         height={36}
//                         className="rounded-circle object-fit-cover"
//                       />

//                       <div className="notification-body">
//                         {/* comment on article */}
//                         {n.type === 'comment' && (
//                           <Link
//                             to={`/article/${n.articleId}`}
//                             className="notification-link"
//                             onClick={(e) => handleNav(e, `/article/${n.articleId}`)}
//                           >
//                             <strong>{n.actorName}</strong> commented on{' '}
//                             <em className="notification-text">{n.articleTitle}</em>
//                           </Link>
//                         )}

//                         {/* like on article */}
//                         {n.type === 'like' && (
//                           <Link
//                             to={`/article/${n.articleId}`}
//                             className="notification-link"
//                             onClick={(e) => handleNav(e, `/article/${n.articleId}`)}
//                           >
//                             <strong>{n.actorName}</strong> liked{' '}
//                             <em className="notification-text">{n.articleTitle}</em>
//                           </Link>
//                         )}

//                         {/* reply to your comment */}
//                         {n.type === 'comment-reply' && (
//                           <Link
//                             to={`/article/${n.articleId}#comment-${n.commentId}`}
//                             className="notification-link"
//                             onClick={(e) => handleNav(e, `/article/${n.articleId}#comment-${n.commentId}`)}
//                           >
//                             <strong>{n.actorName}</strong> replied to your comment
//                           </Link>
//                         )}

//                         {/* like on your comment */}
//                         {n.type === 'comment-like' && (
//                           <Link
//                             to={`/article/${n.articleId}#comment-${n.commentId}`}
//                             className="notification-link"
//                             onClick={(e) => handleNav(e, `/article/${n.articleId}#comment-${n.commentId}`)}
//                           >
//                             <strong>{n.actorName}</strong> liked your comment
//                           </Link>
//                         )}

//                         {/* started following you */}
//                         {n.type === 'follow' && (
//                           <Link
//                             to={`/u/${n.actorName || n.actorId}`}
//                             className="notification-link"
//                             onClick={(e) => handleNav(e, `/u/${n.actorName || n.actorId}`)}
//                           >
//                             <strong>{n.actorName}</strong> started following you
//                           </Link>
//                         )}

//                         {/* article publish broadcast */}
//                         {n.type === 'article-publish' && (
//                           <Link
//                             to={`/article/${n.articleId}`}
//                             className="notification-link"
//                             onClick={(e) => handleNav(e, `/article/${n.articleId}`)}
//                           >
//                             <strong>{n.actorUsername}</strong> published a new article:{' '}
//                             <em className="notification-text">{n.articleTitle}</em>
//                           </Link>
//                         )}
//                       </div>
//                     </div>
//                   </li>
//                 );
//               })}
//             </ul>
//           )}
//         </div>
//       </div>
//     </>
//   );
// }




// // Pages/Notification.jsx
// import React, { useEffect, useState } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import {
//   collection, query, orderBy, limit, onSnapshot, updateDoc
// } from 'firebase/firestore';
// import { db } from '../../configs/firebase';
// import { useAuth } from '../../context/AuthContext';
// import { useUserDoc } from '../../configs/user';
// import { MDBIcon, MDBBtn } from 'mdb-react-ui-kit';

// const OLIVE   = '#5C6B3C';
// const CANVAS  = '#FFFFFF';
// const DIVIDER = 'rgba(92, 107, 60, 0.35)';
// const SHADOW  = '0 10px 30px rgba(0,0,0,0.18)';

// const ROW_HEIGHT       = 64;
// const MAX_VISIBLE_ROWS = 5;

// export default function Notifications() {
//   const { currentUser } = useAuth();
//   const { userDoc } = useUserDoc();
//   const [items, setItems] = useState([]);
//   const navigate = useNavigate();

//   useEffect(() => {
//     if (!currentUser) return;
//     const q = query(
//       collection(db, 'users', currentUser.uid, 'notifications'),
//       orderBy('createdAt', 'desc'),
//       limit(20)
//     );
//     return onSnapshot(q, (snap) => {
//       const list = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
//       setItems(list);

//       snap.docs.forEach((d) => {
//         const data = d.data();
//         if (data.createdAt && !data.read) updateDoc(d.ref, { read: true });
//       });
//     });
//   }, [currentUser]);

//   const fallbackAvatar = "https://placehold.co/40x40"; 

  

//  return (
//   <>
//     <style>{`
//       .notification-list { list-style: none; margin: 0; padding: 0; }
//       .notification-item { padding: 14px 16px; min-height: ${ROW_HEIGHT}px; background: ${CANVAS}; }
//       .notification-row  { display: flex; align-items: flex-start; gap: 10px; }
//       .notification-body { font-size: 0.95rem; line-height: 1.35; flex: 1; }

//       .notification-link {
//         color: #222;
//         text-decoration: none;
//         display: inline-block;
//         max-width: 230px;
//         cursor: pointer;
//       }

//       .notification-link:hover {
//         text-decoration: underline;
//       }

//       .notification-text {
//         display: inline-block;
//         overflow: hidden;
//         text-overflow: ellipsis;
//         white-space: nowrap;
//         vertical-align: bottom;
//         font-style: italic;
//       }

//       .notification-avatar {
//         width: 36px;
//         height: 36px;
//         border-radius: 50%;
//         object-fit: cover;
//       }
//     `}</style>

//     <div
//       className="position-absolute top-100 end-0"
//       style={{
//         minWidth: 300,
//         background: CANVAS,
//         border: `1px solid ${OLIVE}`,
//         borderRadius: 10,
//         boxShadow: SHADOW,
//         zIndex: 999,
//         overflow: 'hidden'
//       }}
//       role="dialog"
//       aria-label="Notifications"
//     >
//       <div
//         className="d-flex justify-content-between align-items-center"
//         style={{ background: OLIVE, color: '#FFF', padding: '12px 16px' }}
//       >
//         <strong style={{ fontFamily: 'Poppins, sans-serif', fontSize: 18 }}>
//           Notifications
//         </strong>
//         <MDBBtn
//           size="sm"
//           color="link"
//           className="p-0 m-0"
//           onClick={onClose}
//           style={{ color: '#FFF' }}
//           aria-label="Close notifications"
//         >
//           <MDBIcon fas icon="times" />
//         </MDBBtn>
//       </div>

//       <div
//         style={{
//           maxHeight: `${ROW_HEIGHT * MAX_VISIBLE_ROWS}px`,
//           overflowY: items.length > MAX_VISIBLE_ROWS ? 'auto' : 'visible'
//         }}
//       >
//         {items.length === 0 ? (
//           <p className="text-muted mb-0 py-3 px-3">No notifications</p>
//         ) : (
//           <ul className="notification-list">
//             {items.map((n, idx) => {
//               const borderTop = idx === 0 ? 'none' : `1px solid ${DIVIDER}`;
//               const avatar = n.actorAvatar || fallbackAvatar;
//               const name = n.actorName || 'Someone';
//               const title = n.articleTitle || 'your article';

//               const handleClick = (path) => {
//                 setTimeout(() => {
//                   onClose?.();
//                   navigate(path);
//                 }, 50);
//               };

//               return (
//                 <li key={n.id} className="notification-item" style={{ borderTop }}>
//                   <div className="notification-row">
//                     <img
//                       src={avatar}
//                       alt=""
//                       className="notification-avatar"
//                     />
//                     <div className="notification-body">
//                       {n.type === 'comment' && (
//                         <div
//                           className="notification-link"
//                           onClick={() => handleClick(`/article/${n.articleId}`)}
//                         >
//                           <strong>{name}</strong> commented on{' '}
//                           <span className="notification-text">{title}</span>
//                         </div>
//                       )}
//                       {n.type === 'like' && (
//                         <div
//                           className="notification-link"
//                           onClick={() => handleClick(`/article/${n.articleId}`)}
//                         >
//                           <strong>{name}</strong> liked{' '}
//                           <span className="notification-text">{title}</span>
//                         </div>
//                       )}
//                       {n.type === 'comment-reply' && (
//                         <div
//                           className="notification-link"
//                           onClick={() => handleClick(`/article/${n.articleId}#comment-${n.commentId}`)}
//                         >
//                           <strong>{name}</strong> replied to your comment
//                         </div>
//                       )}
//                       {n.type === 'comment-like' && (
//                         <div
//                           className="notification-link"
//                           onClick={() => handleClick(`/article/${n.articleId}#comment-${n.commentId}`)}
//                         >
//                           <strong>{name}</strong> liked your comment
//                         </div>
//                       )}
//                       {n.type === 'follow' && (
//                         <div
//                           className="notification-link"
//                           onClick={() => handleClick(`/u/${n.actorUsername || n.actorName}`)}
//                         >
//                           <strong>{name}</strong> started following you
//                         </div>
//                       )}
//                       {n.type === 'article-publish' && (
//                         <div
//                           className="notification-link"
//                           onClick={() => handleClick(`/article/${n.articleId}`)}
//                         >
//                           <strong>{name}</strong> published{' '}
//                           <span className="notification-text">{title}</span>
//                         </div>
//                       )}
//                     </div>
//                   </div>
//                 </li>
//               );
//             })}
//           </ul>
//         )}
//       </div>
//     </div>
//   </>
// );

// }



//below is correct and working before cost cutting

// import React, { useEffect, useState } from 'react';
// import { Link } from 'react-router-dom';
// import {
//   collection, query, orderBy, limit, onSnapshot, updateDoc
// } from 'firebase/firestore';
// import { db } from '../../configs/firebase';
// import { useAuth } from '../../context/AuthContext';
// import { useUserDoc } from '../../configs/user';
// import { MDBIcon, MDBBtn } from 'mdb-react-ui-kit';

// const OLIVE   = '#5C6B3C';
// const CANVAS  = '#FFFFFF';
// const DIVIDER = 'rgba(92, 107, 60, 0.35)';
// const SHADOW  = '0 10px 30px rgba(0,0,0,0.18)';

// const ROW_HEIGHT       = 64;
// const MAX_VISIBLE_ROWS = 5;

// export default function Notifications() {
//   const { currentUser } = useAuth();
//   const { userDoc } = useUserDoc();
//   const [items, setItems] = useState([]);

//   useEffect(() => {
//     if (!currentUser) return;
//     const q = query(
//       collection(db, 'users', currentUser.uid, 'notifications'),
//       orderBy('createdAt', 'desc'),
//       limit(20)
//     );
//     return onSnapshot(q, (snap) => {
//       const list = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
//       setItems(list);

//       snap.docs.forEach((d) => {
//         const data = d.data();
//         if (data.createdAt && !data.read) updateDoc(d.ref, { read: true });
//       });
//     });
//   }, [currentUser]);

//   const fallbackAvatar = 'https://placehold.co/40x40';

//   return (
//     <>
//       <style>{`
//         .notification-list { list-style: none; margin: 0; padding: 0; }
//         .notification-item { padding: 14px 16px; min-height: ${ROW_HEIGHT}px; background: ${CANVAS}; }
//         .notification-row  { display: flex; align-items: flex-start; gap: 10px; }
//         .notification-body { font-size: 0.95rem; line-height: 1.35; flex: 1; }

//         .notification-link {
//           color: #222;
//           text-decoration: none;
//           display: inline-block;
//           max-width: 230px;
//         }

//         .notification-link:hover {
//           text-decoration: underline;
//         }

//         .notification-text {
//             display: inline-block;
//             overflow: hidden;
//             text-overflow: ellipsis;
//             white-space: nowrap;
//             max-width: 130px;
//             vertical-align: bottom;
//             font-style: italic;
//         }

//         .notification-avatar {
//           width: 36px;
//           height: 36px;
//           border-radius: 50%;
//           object-fit: cover;
//         }
//       `}</style>

//       <div
//         onClick={(e) => e.stopPropagation()} // prevent closing on internal click
//         className="position-absolute top-100 end-0"
//         style={{
//           minWidth: 300,
//           background: CANVAS,
//           border: `1px solid ${OLIVE}`,
//           borderRadius: 10,
//           boxShadow: SHADOW,
//           zIndex: 999,
//           overflow: 'hidden'
//         }}
//         role="dialog"
//         aria-label="Notifications"
//       >
//         <div
//           className="d-flex justify-content-between align-items-center"
//           style={{ background: OLIVE, color: '#FFF', padding: '12px 16px' }}
//         >
//           <strong style={{ fontFamily: 'Poppins, sans-serif', fontSize: 18 }}>
//             Notifications
//           </strong>
//         </div>

//         <div
//           style={{
//             maxHeight: `${ROW_HEIGHT * MAX_VISIBLE_ROWS}px`,
//             overflowY: items.length > MAX_VISIBLE_ROWS ? 'auto' : 'visible'
//           }}
//         >
//           {items.length === 0 ? (
//             <p className="text-muted mb-0 py-3 px-3">No notifications</p>
//           ) : (
//             <ul className="notification-list">
//               {items.map((n, idx) => {
//                 const borderTop = idx === 0 ? 'none' : `1px solid ${DIVIDER}`;
//                 const avatar = n.actorAvatar || fallbackAvatar;
//                 const name = n.actorName || 'Someone';
//                 const title = n.articleTitle || 'your article';

//                 return (
//                   <li key={n.id} className="notification-item" style={{ borderTop }}>
//                     <div className="notification-row">
//                       <img src={avatar} alt="" className="notification-avatar" />
//                       <div className="notification-body">
//                         {n.type === 'comment' && (
//                           <Link to={`/article/${n.articleId}`} className="notification-link">
//                             <strong>{name}</strong> commented on <span className="notification-text">{title}</span>
//                           </Link>
//                         )}
//                         {n.type === 'like' && (
//                           <Link to={`/article/${n.articleId}`} className="notification-link">
//                             <strong>{name}</strong> liked <span className="notification-text">{title}</span>
//                           </Link>
//                         )}
//                         {n.type === 'comment-reply' && (
//                           <Link to={`/article/${n.articleId}#comment-${n.commentId}`} className="notification-link">
//                             <strong>{name}</strong> replied to your comment
//                           </Link>
//                         )}
//                         {n.type === 'comment-like' && (
//                           <Link to={`/article/${n.articleId}#comment-${n.commentId}`} className="notification-link">
//                             <strong>{name}</strong> liked your comment
//                           </Link>
//                         )}
//                         {n.type === 'follow' && (
//                           <Link to={`/u/${n.actorUsername || n.actorName}`} className="notification-link">
//                             <strong>{name}</strong> started following you
//                           </Link>
//                         )}
//                         {n.type === 'article-publish' && (
//                           <Link to={`/article/${n.articleId}`} className="notification-link">
//                             <strong>{name}</strong> published <span className="notification-text">{title}</span>
//                           </Link>
//                         )}
//                       </div>
//                     </div>
//                   </li>
//                 );
//               })}
//             </ul>
//           )}
//         </div>
//       </div>
//     </>
//   );
// }


//above one is correct workimg before cost cutting


import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  collection,
  query,
  orderBy,
  limit,
  onSnapshot,
  updateDoc,
} from "firebase/firestore";

import { db } from "../../configs/firebase";
import { useAuth } from "../../context/AuthContext";

const OLIVE = "#5C6B3C";
const CANVAS = "#FFFFFF";
const DIVIDER = "rgba(92, 107, 60, 0.35)";
const SHADOW = "0 10px 30px rgba(0,0,0,0.18)";

const ROW_HEIGHT = 64;
const MAX_VISIBLE_ROWS = 5;
const NOTIFICATIONS_LIMIT = 20;

export default function Notifications() {
  const { currentUser } = useAuth();
  const [items, setItems] = useState([]);

  /*
   * Prevent repeated read-marking writes for same notification id
   * while onSnapshot re-runs.
   */
  const markingRef = useRef(new Set());

  useEffect(() => {
    if (!currentUser?.uid) {
      setItems([]);
      return () => {};
    }

    const notificationsQuery = query(
      collection(db, "users", currentUser.uid, "notifications"),
      orderBy("createdAt", "desc"),
      limit(NOTIFICATIONS_LIMIT)
    );

    const unsubscribe = onSnapshot(
      notificationsQuery,
      async (snap) => {
        const list = snap.docs.map((notificationDoc) => ({
          id: notificationDoc.id,
          ...notificationDoc.data(),
        }));

        setItems(list);

        const unreadDocs = snap.docs.filter((notificationDoc) => {
          const data = notificationDoc.data();

          return (
            data.createdAt &&
            !data.read &&
            !markingRef.current.has(notificationDoc.id)
          );
        });

        if (!unreadDocs.length) return;

        unreadDocs.forEach((notificationDoc) => {
          markingRef.current.add(notificationDoc.id);
        });

        try {
          await Promise.all(
            unreadDocs.map((notificationDoc) =>
              updateDoc(notificationDoc.ref, { read: true })
            )
          );
        } catch (err) {
          console.error("markNotificationsRead:", err);

          unreadDocs.forEach((notificationDoc) => {
            markingRef.current.delete(notificationDoc.id);
          });
        }
      },
      (err) => {
        console.error("notifications listener:", err);
        setItems([]);
      }
    );

    return () => unsubscribe();
  }, [currentUser?.uid]);

  const fallbackAvatar = "https://placehold.co/40x40";

  return (
    <>
      <style>{`
        .notification-list {
          list-style: none;
          margin: 0;
          padding: 0;
        }

        .notification-item {
          padding: 14px 16px;
          min-height: ${ROW_HEIGHT}px;
          background: ${CANVAS};
        }

        .notification-row {
          display: flex;
          align-items: flex-start;
          gap: 10px;
        }

        .notification-body {
          font-size: 0.95rem;
          line-height: 1.35;
          flex: 1;
        }

        .notification-link {
          color: #222;
          text-decoration: none;
          display: inline-block;
          max-width: 230px;
        }

        .notification-link:hover {
          text-decoration: underline;
        }

        .notification-text {
          display: inline-block;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          max-width: 130px;
          vertical-align: bottom;
          font-style: italic;
        }

        .notification-avatar {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          object-fit: cover;
        }
      `}</style>

      <div
        onClick={(e) => e.stopPropagation()}
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
        aria-label="Notifications"
      >
        <div
          className="d-flex justify-content-between align-items-center"
          style={{
            background: OLIVE,
            color: "#FFF",
            padding: "12px 16px",
          }}
        >
          <strong
            style={{
              fontFamily: "Poppins, sans-serif",
              fontSize: 18,
            }}
          >
            Notifications
          </strong>
        </div>

        <div
          style={{
            maxHeight: `${ROW_HEIGHT * MAX_VISIBLE_ROWS}px`,
            overflowY: items.length > MAX_VISIBLE_ROWS ? "auto" : "visible",
          }}
        >
          {items.length === 0 ? (
            <p className="text-muted mb-0 py-3 px-3">No notifications</p>
          ) : (
            <ul className="notification-list">
              {items.map((notification, idx) => {
                const borderTop =
                  idx === 0 ? "none" : `1px solid ${DIVIDER}`;

                const avatar = notification.actorAvatar || fallbackAvatar;
                const name = notification.actorName || "Someone";
                const title = notification.articleTitle || "your article";

                return (
                  <li
                    key={notification.id}
                    className="notification-item"
                    style={{ borderTop }}
                  >
                    <div className="notification-row">
                      <img
                        src={avatar}
                        alt=""
                        className="notification-avatar"
                      />

                      <div className="notification-body">
                        {notification.type === "comment" && (
                          <Link
                            to={`/article/${notification.articleId}`}
                            className="notification-link"
                          >
                            <strong>{name}</strong> commented on{" "}
                            <span className="notification-text">{title}</span>
                          </Link>
                        )}

                        {notification.type === "like" && (
                          <Link
                            to={`/article/${notification.articleId}`}
                            className="notification-link"
                          >
                            <strong>{name}</strong> liked{" "}
                            <span className="notification-text">{title}</span>
                          </Link>
                        )}

                        {notification.type === "comment-reply" && (
                          <Link
                            to={`/article/${notification.articleId}#comment-${notification.commentId}`}
                            className="notification-link"
                          >
                            <strong>{name}</strong> replied to your comment
                          </Link>
                        )}

                        {notification.type === "comment-like" && (
                          <Link
                            to={`/article/${notification.articleId}#comment-${notification.commentId}`}
                            className="notification-link"
                          >
                            <strong>{name}</strong> liked your comment
                          </Link>
                        )}

                        {notification.type === "follow" && (
                          <Link
                            to={`/u/${
                              notification.actorUsername ||
                              notification.actorName
                            }`}
                            className="notification-link"
                          >
                            <strong>{name}</strong> started following you
                          </Link>
                        )}

                        {notification.type === "article-publish" && (
                          <Link
                            to={`/article/${notification.articleId}`}
                            className="notification-link"
                          >
                            <strong>{name}</strong> published{" "}
                            <span className="notification-text">{title}</span>
                          </Link>
                        )}
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>
    </>
  );
}