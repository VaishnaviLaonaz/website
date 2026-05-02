// // /*  src/components/cards/CommentList.jsx  */
// // import { useState, useEffect, useRef } from "react";
// // import {
// //   ref,
// //   push,
// //   set,
// //   onValue,
// //   get,
// //   remove,
// //   update,
// //   serverTimestamp,
// // } from "firebase/database";
// // import { rtdb } from "../../configs/firebase";
// // import {
// //   MDBInputGroup,
// //   MDBBtn,
// //   MDBIcon,
// // } from "mdb-react-ui-kit";

// // /**
// //  * Live comment thread for an article.
// //  * Props:
// //  *  - articleId   string
// //  *  - currentUser firebase auth user (or null)
// //  */
// // export default function CommentList({ articleId, currentUser }) {
// //   const uid   = currentUser?.uid;
// //   const uname = currentUser?.displayName || currentUser?.email?.split("@")[0];
// //   const uava  = currentUser?.photoURL;

// //   /* local state ----------------------------------------------------------- */
// //   const [comments,   setComments]   = useState([]);  // [{ id, text, …, replies:[…] }]
// //   const [likesMap,   setLikesMap]   = useState({});  // { cid : [uid,…] , `${cid}_${rid}`:[uid,…] }
// //   const [text,       setText]       = useState("");  // for new top-level comment
// //   const [replyFor,   setReplyFor]   = useState(null);// commentId currently replying to
// //   const [replyText,  setReplyText]  = useState("");
// //   const [editKey,    setEditKey]    = useState(null);// "cid" or "cid_rid"
// //   const [editText,   setEditText]   = useState("");
// //   const listEndRef = useRef(null);

// //   /* helpers to build db paths -------------------------------------------- */
// //   const cPath   = cid            => `comments/${articleId}/${cid}`;
// //   const rPath   = (cid,rid)      => `${cPath(cid)}/replies/${rid}`;
// //   const likeKey = (cid,rid=null) => (rid ? `${cid}_${rid}` : cid);

// //   /* initial load + live stream ------------------------------------------- */
// //   useEffect(() => {
// //     if (!articleId) return;
// //     const base = ref(rtdb, `comments/${articleId}`);

// //     const unsub = onValue(base, snap => {
// //       const cmts = [];
// //       const lk   = {};

// //       snap.forEach(c => {
// //         const cData = { id:c.key, ...c.val(), replies:[] };

// //         /* collect likes for the comment */
// //         const cLikes = [];
// //         c.child("likedBy").forEach(u => cLikes.push(u.key));
// //         lk[c.key] = cLikes;

// //         /* iterate replies */
// //         c.child("replies").forEach(r => {
// //           const rData = { id:r.key, ...r.val(), parentId:c.key };
// //           cData.replies.push(rData);

// //           /* likes for reply */
// //           const rLikes = [];
// //           r.child("likedBy").forEach(u => rLikes.push(u.key));
// //           lk[likeKey(c.key,r.key)] = rLikes;
// //         });

// //         cmts.push(cData);
// //       });

// //       setComments(cmts);
// //       setLikesMap(lk);

// //       /* scroll on update */
// //       setTimeout(
// //         () => listEndRef.current?.scrollIntoView({ behavior:"smooth" }),
// //         0
// //       );
// //     });

// //     return unsub;
// //   }, [articleId]);

// //   /* create comment / reply ----------------------------------------------- */
// //   const sendComment = async () => {
// //     if (!uid || !text.trim()) return;
// //     const cRef = push(ref(rtdb, `comments/${articleId}`));
// //     await set(cRef, {
// //       uid, username: uname, avatarUrl:uava,
// //       text:text.trim(), createdAt:Date.now()
// //     });
// //     setText("");
// //   };

// //   const sendReply = async cid => {
// //     if (!uid || !replyText.trim()) return;
// //     const rRef = push(ref(rtdb, `${cPath(cid)}/replies`));
// //     await set(rRef, {
// //       uid, username: uname, avatarUrl:uava,
// //       text:replyText.trim(), createdAt:Date.now()
// //     });
// //     setReplyText(""); setReplyFor(null);
// //   };

// //   /* like / unlike --------------------------------------------------------- */
// //   const toggleLike = async (cid,rid=null) => {
// //     if (!uid) return;
// //     const lRef = ref(rtdb, `${rid ? rPath(cid,rid) : cPath(cid)}/likedBy/${uid}`);
// //     const snap = await get(lRef);
// //     snap.exists() ? remove(lRef) : set(lRef,true);
// //   };

// //   /* edit / delete --------------------------------------------------------- */
// //   const startEdit = (cid,rid=null,text) => {
// //     setEditKey(likeKey(cid,rid));
// //     setEditText(text);
// //   };

// //   const saveEdit = async (cid,rid=null) => {
// //     if (!editText.trim()) return;
// //     await update(
// //       ref(rtdb, rid ? rPath(cid,rid) : cPath(cid)),
// //       { text:editText.trim(), updatedAt:serverTimestamp() }
// //     );
// //     setEditKey(null); setEditText("");
// //   };

// //   const del = (cid,rid=null) =>
// //     remove(ref(rtdb, rid ? rPath(cid,rid) : cPath(cid)));

// //   /* UI helpers ----------------------------------------------------------- */
// //   const LikeChip = ({ cid,rid, count }) => {
// //     const id  = likeKey(cid,rid);
// //     const on  = (likesMap[id] || []).includes(uid);
// //     const dis = !uid;
// //     const props = dis
// //       ? { style:{cursor:"not-allowed",opacity:0.5} }
// //       : { role:"button", onClick:() => toggleLike(cid,rid) };

// //     return (
// //       <span {...props}>
// //         <MDBIcon
// //           far={!on}
// //           fas={on}
// //           icon="thumbs-up"
// //           className="me-1"
// //         />
// //         {count}
// //       </span>
// //     );
// //   };

// //   const Meta = ({ createdAt, updatedAt }) => (
// //     <small className="text-muted">
// //       {new Date(createdAt).toLocaleDateString()}
// //       {updatedAt && (
// //         <> · edited {new Date(updatedAt).toLocaleTimeString()}</>
// //       )}
// //     </small>
// //   );

// //   /* ---------------------------------------------------------------------- */
// //   return (
// //     <div>
// //       {/* new comment input */}
// //       {uid ? (
// //         <MDBInputGroup className="mb-4">
// //           <textarea
// //             className="form-control"
// //             rows={2}
// //             placeholder="Add your comment…"
// //             value={text}
// //             onChange={e => setText(e.target.value)}
// //           />
// //           <MDBBtn onClick={sendComment}>Post</MDBBtn>
// //         </MDBInputGroup>
// //       ) : (
// //         <p className="text-muted fst-italic mb-4">
// //           Please log in to post comments.
// //         </p>
// //       )}

// //       {/* threaded list */}
// //       <ul className="list-group border-0">
// //         {comments.map(c => {
// //           const mine = uid === c.uid;
// //           const editing = editKey === likeKey(c.id);
// //           return (
// //             <li key={c.id} className="list-group-item border-0 px-0">
// //               {/* ── comment bubble ─────────────────────────────── */}
// //               <div className="d-flex gap-3">
// //                 <img
// //                   src={c.avatarUrl || "https://placehold.co/40x40"}
// //                   alt=""
// //                   className="rounded-circle flex-shrink-0"
// //                   width="40" height="40"
// //                 />

// //                 <div className="flex-grow-1">
// //                   <div className="d-flex justify-content-between">
// //                     <span className="fw-semibold">{c.username}</span>
// //                     <Meta createdAt={c.createdAt} updatedAt={c.updatedAt} />
// //                   </div>

// //                   {/* text or edit box */}
// //                   {editing ? (
// //                     <MDBInputGroup className="my-2">
// //                       <input
// //                         className="form-control"
// //                         value={editText}
// //                         onChange={e => setEditText(e.target.value)}
// //                       />
// //                       <MDBBtn size="sm" onClick={() => saveEdit(c.id)}>
// //                         Save
// //                       </MDBBtn>
// //                       <MDBBtn size="sm" color="link" onClick={() => setEditKey(null)}>
// //                         Cancel
// //                       </MDBBtn>
// //                     </MDBInputGroup>
// //                   ) : (
// //                     <p className="mb-1">{c.text}</p>
// //                   )}

// //                   {/* actions */}
// //                   <div className="d-flex gap-3 small text-muted">
// //                     <LikeChip
// //                       cid={c.id}
// //                       count={(likesMap[c.id] || []).length}
// //                     />

// //                     {uid && (
// //                       <span
// //                         role="button"
// //                         onClick={() =>
// //                           replyFor === c.id ? setReplyFor(null) : setReplyFor(c.id)
// //                         }
// //                       >
// //                         <MDBIcon far icon="reply" className="me-1" />
// //                         Reply
// //                       </span>
// //                     )}

// //                     {mine && !editing && (
// //                       <>
// //                         <span role="button" onClick={() => startEdit(c.id,null,c.text)}>
// //                           <MDBIcon fas icon="edit" className="me-1" />Edit
// //                         </span>
// //                         <span role="button" onClick={() => del(c.id)}>
// //                           <MDBIcon fas icon="trash-alt" className="me-1 text-danger" />Delete
// //                         </span>
// //                       </>
// //                     )}
// //                   </div>
// //                 </div>
// //               </div>

// //               {/* reply input */}
// //               {replyFor === c.id && uid && (
// //                 <MDBInputGroup className="mt-3 ms-5">
// //                   <input
// //                     className="form-control"
// //                     placeholder="Write a reply…"
// //                     value={replyText}
// //                     onChange={e => setReplyText(e.target.value)}
// //                   />
// //                   <MDBBtn size="sm" onClick={() => sendReply(c.id)}>Reply</MDBBtn>
// //                 </MDBInputGroup>
// //               )}

// //               {/* replies list */}
// //               {c.replies.length > 0 && (
// //                 <ul className="list-unstyled mt-3 ms-5">
// //                   {c.replies.map(r => {
// //                     const rMine    = uid === r.uid;
// //                     const rEditing = editKey === likeKey(c.id,r.id);
// //                     return (
// //                       <li key={r.id} className="mb-3">
// //                         <div className="d-flex gap-3">
// //                           <img
// //                             src={r.avatarUrl || "https://placehold.co/32x32"}
// //                             alt=""
// //                             className="rounded-circle flex-shrink-0"
// //                             width="32" height="32"
// //                           />

// //                           <div className="flex-grow-1">
// //                             <div className="d-flex justify-content-between">
// //                               <span className="fw-semibold">{r.username}</span>
// //                               <Meta createdAt={r.createdAt} updatedAt={r.updatedAt} />
// //                             </div>

// //                             {rEditing ? (
// //                               <MDBInputGroup className="my-2">
// //                                 <input
// //                                   className="form-control"
// //                                   value={editText}
// //                                   onChange={e => setEditText(e.target.value)}
// //                                 />
// //                                 <MDBBtn size="sm" onClick={() => saveEdit(c.id,r.id)}>
// //                                   Save
// //                                 </MDBBtn>
// //                                 <MDBBtn size="sm" color="link" onClick={() => setEditKey(null)}>
// //                                   Cancel
// //                                 </MDBBtn>
// //                               </MDBInputGroup>
// //                             ) : (
// //                               <p className="mb-1">{r.text}</p>
// //                             )}

// //                             <div className="d-flex gap-3 small text-muted">
// //                               <LikeChip
// //                                 cid={c.id}
// //                                 rid={r.id}
// //                                 count={(likesMap[likeKey(c.id,r.id)] || []).length}
// //                               />

// //                               {rMine && !rEditing && (
// //                                 <>
// //                                   <span
// //                                     role="button"
// //                                     onClick={() => startEdit(c.id,r.id,r.text)}
// //                                   >
// //                                     <MDBIcon fas icon="edit" className="me-1" />Edit
// //                                   </span>
// //                                   <span
// //                                     role="button"
// //                                     onClick={() => del(c.id,r.id)}
// //                                   >
// //                                     <MDBIcon fas icon="trash-alt" className="me-1 text-danger" />
// //                                     Delete
// //                                   </span>
// //                                 </>
// //                               )}
// //                             </div>
// //                           </div>
// //                         </div>
// //                       </li>
// //                     );
// //                   })}
// //                 </ul>
// //               )}
// //             </li>
// //           );
// //         })}
// //         <li ref={listEndRef} />
// //       </ul>
// //     </div>
// //   );
// // }





// /*  src/components/cards/CommentList.jsx  */
// import { useState, useEffect, useRef } from "react";
// import {
//   ref,
//   push,
//   set,
//   onValue,
//   get,
//   remove,
//   update,
//   serverTimestamp,
// } from "firebase/database";
// import { rtdb } from "../../configs/firebase";
// import { MDBInputGroup, MDBBtn, MDBIcon } from "mdb-react-ui-kit";

// /**
//  * Live, unlimited-depth comment thread.
//  * Props:
//  *  - articleId   string
//  *  - currentUser firebase auth user | null
//  */
// export default function CommentList({ articleId, currentUser }) {
//   /* ─── user helpers ─── */
//   const uid   = currentUser?.uid;
//   const uname = currentUser?.displayName || currentUser?.email?.split("@")[0];
//   const uava  = currentUser?.photoURL;

//   /* ─── local state ─── */
//   const [tree,      setTree]     = useState([]);  // nested comments
//   const [likesMap,  setLikes]    = useState({}); // { commentId : [uids] }
//   const [text,      setText]     = useState("");  // new top-level
//   const [replyFor,  setReplyFor] = useState(null);
//   const [replyTxt,  setReplyTxt] = useState("");
//   const [editId,    setEditId]   = useState(null);
//   const [editTxt,   setEditTxt]  = useState("");
//   const bottomRef = useRef(null);

//   const cPath = (cid = "") => `comments/${articleId}/${cid}`;

//   /* ─── realtime listener (build a tree) ─── */
//   useEffect(() => {
//     if (!articleId) return;
//     const base = ref(rtdb, `comments/${articleId}`);

//     const unsub = onValue(base, snap => {
//       const map = {};
//       const lk  = {};

//       snap.forEach(c => {
//         const node = { id:c.key, ...c.val(), children:[] };
//         map[node.id] = node;

//         /* collect likes */
//         const likes = [];
//         c.child("likedBy").forEach(u => likes.push(u.key));
//         lk[node.id] = likes;
//       });

//       /* link children */
//       const roots = [];
//       Object.values(map).forEach(node => {
//         if (node.parentId) {
//           map[node.parentId]?.children.push(node);
//         } else {
//           roots.push(node);
//         }
//       });

//       setTree(roots);
//       setLikes(lk);
//       setTimeout(() => bottomRef.current?.scrollIntoView({behavior:"smooth"}), 0);
//     });

//     return unsub;
//   }, [articleId]);

//   /* ─── CRUD helpers ─── */
//   const post = async (txt, parentId = null) => {
//     if (!uid || !txt.trim()) return;
//     await set(
//       push(ref(rtdb, `comments/${articleId}`)),
//       {
//         uid, username:uname, avatarUrl:uava,
//         text:txt.trim(),
//         parentId,
//         createdAt:Date.now()
//       }
//     );
//   };

//   const toggleLike = async cid => {
//     if (!uid) return;
//     const lRef = ref(rtdb, `${cPath(cid)}/likedBy/${uid}`);
//     (await get(lRef)).exists() ? remove(lRef) : set(lRef, true);
//   };

//   const saveEdit = async cid => {
//     if (!editTxt.trim()) return;
//     await update(ref(rtdb, cPath(cid)), {
//       text:editTxt.trim(),
//       updatedAt:serverTimestamp()
//     });
//     setEditId(null); setEditTxt("");
//   };

//   const del = cid => remove(ref(rtdb, cPath(cid)));

//   /* ─── UI helpers ─── */
//   const Meta = ({ c }) => (
//     <small className="text-muted">
//       {new Date(c.createdAt).toLocaleDateString()}
//       {c.updatedAt && <> · edited {new Date(c.updatedAt).toLocaleTimeString()}</>}
//     </small>
//   );

//   const Node = ({ node, depth }) => {
//     const mine   = uid === node.uid;
//     const liked  = (likesMap[node.id] || []).includes(uid);
//     const editing= editId === node.id;

//     return (
//       <li className="mb-3" style={{ marginLeft: depth ? depth*24 : 0 }}>
//         <div className="d-flex gap-3">
//           <img
//             src={node.avatarUrl || "https://placehold.co/32x32"}
//             className="rounded-circle flex-shrink-0"
//             width="32" height="32"
//             alt=""
//           />
//           <div className="flex-grow-1">
//             <div className="d-flex justify-content-between">
//               <span className="fw-semibold">{node.username}</span>
//               <Meta c={node} />
//             </div>

//             {editing ? (
//               <MDBInputGroup className="my-2">
//                 <input
//                   className="form-control"
//                   value={editTxt}
//                   onChange={e => setEditTxt(e.target.value)}
//                 />
//                 <MDBBtn size="sm" onClick={() => saveEdit(node.id)}>Save</MDBBtn>
//                 <MDBBtn size="sm" color="link" onClick={() => setEditId(null)}>Cancel</MDBBtn>
//               </MDBInputGroup>
//             ) : (
//               <p className="mb-1">{node.text}</p>
//             )}

//             <div className="d-flex gap-3 small text-muted">
//               {/* like */}
//               <span
//                 role={uid ? "button" : undefined}
//                 style={!uid ? {cursor:"not-allowed",opacity:0.5}:undefined}
//                 onClick={() => uid && toggleLike(node.id)}
//               >
//                 <MDBIcon fas={liked} far={!liked} icon="thumbs-up" className="me-1" />
//                 {(likesMap[node.id] || []).length}
//               </span>

//               {/* reply */}
//               {uid && (
//                 <span role="button"
//                       onClick={() => setReplyFor(replyFor===node.id?null:node.id)}>
//                   <MDBIcon far icon="reply" className="me-1" />Reply
//                 </span>
//               )}

//               {/* owner actions */}
//               {mine && !editing && (
//                 <>
//                   <span role="button" onClick={() => { setEditId(node.id); setEditTxt(node.text); }}>
//                     <MDBIcon fas icon="edit" className="me-1" />Edit
//                   </span>
//                   <span role="button" onClick={() => del(node.id)}>
//                     <MDBIcon fas icon="trash-alt" className="me-1 text-danger" />Delete
//                   </span>
//                 </>
//               )}
//             </div>

//             {/* reply box */}
//             {replyFor === node.id && uid && (
//               <MDBInputGroup className="mt-3">
//                 <input
//                   className="form-control"
//                   placeholder="Write a reply…"
//                   value={replyTxt}
//                   onChange={e => setReplyTxt(e.target.value)}
//                 />
//                 <MDBBtn size="sm" onClick={() => { post(replyTxt,node.id); setReplyTxt(""); setReplyFor(null); }}>
//                   Reply
//                 </MDBBtn>
//               </MDBInputGroup>
//             )}
//           </div>
//         </div>

//         {/* children */}
//         {node.children?.length > 0 && (
//           <ul className="list-unstyled mt-3">
//             {node.children.map(child => (
//               <Node key={child.id} node={child} depth={depth+1} />
//             ))}
//           </ul>
//         )}
//       </li>
//     );
//   };

//   /* ─── render ─── */
//   return (
//     <div>
//       {/* new root comment */}
//       {uid ? (
//         <MDBInputGroup className="mb-4">
//           <textarea
//             className="form-control"
//             rows={2}
//             placeholder="Add your comment…"
//             value={text}
//             onChange={e => setText(e.target.value)}
//           />
//           <MDBBtn onClick={() => { post(text); setText(""); }}>Post</MDBBtn>
//         </MDBInputGroup>
//       ) : (
//         <p className="text-muted fst-italic mb-4">Please log in to post comments.</p>
//       )}

//       <ul className="list-unstyled">
//         {tree.map(root => <Node key={root.id} node={root} depth={0} />)}
//         <li ref={bottomRef} />
//       </ul>
//     </div>
//   );
// }



// /*  src/components/cards/CommentList.jsx  */
// import { useState, useEffect, useRef, memo } from "react";
// import {
//   ref, push, set, onValue, get, remove, update, serverTimestamp
// } from "firebase/database";
// import { rtdb } from "../../configs/firebase";
// import { MDBInputGroup, MDBBtn, MDBIcon } from "mdb-react-ui-kit";

// export default function CommentList({ articleId, currentUser }) {
//   /* user helpers */
//   const uid   = currentUser?.uid;
//   const uname = currentUser?.displayName || currentUser?.email?.split("@")[0];
//   const uava  = currentUser?.photoURL;

//   /* local state */
//   const [tree,      setTree]      = useState([]);
//   const [likesMap,  setLikes]     = useState({});
//   const [rootText,  setRootText]  = useState("");
//   const [replyFor,  setReplyFor]  = useState(null);   // open reply box id
//   const [replyDrafts, setReplyDrafts] = useState({}); // <-- new
//   const [editId,    setEditId]    = useState(null);
//   const [editDrafts, setEditDrafts] = useState({});   // <-- new
//   const bottomRef = useRef(null);

//   const cPath = (cid="") => `comments/${articleId}/${cid}`;

//   /* realtime listener */
//   useEffect(() => {
//     if (!articleId) return;
//     const base = ref(rtdb, `comments/${articleId}`);
//     const unsub = onValue(base, snap => {
//       const map = {}, lk = {};
//       snap.forEach(c => {
//         const node = { id:c.key, ...c.val(), children:[] };
//         map[node.id] = node;
//         const likes = []; c.child("likedBy").forEach(u => likes.push(u.key));
//         lk[node.id] = likes;
//       });
//       const roots = [];
//       Object.values(map).forEach(n => {
//         n.parentId ? map[n.parentId]?.children.push(n) : roots.push(n);
//       });
//       setTree(roots); setLikes(lk);
//       setTimeout(()=>bottomRef.current?.scrollIntoView({behavior:"smooth"}),0);
//     });
//     return unsub;
//   }, [articleId]);

//   /* helpers */
//   const post = async (txt, parentId=null) => {
//     if (!uid || !txt.trim()) return;
//     await set(push(ref(rtdb, `comments/${articleId}`)), {
//       uid, username:uname, avatarUrl:uava,
//       text:txt.trim(), parentId, createdAt:Date.now()
//     });
//   };
//   const toggleLike = async id => {
//     if (!uid) return;
//     const lRef = ref(rtdb, `${cPath(id)}/likedBy/${uid}`);
//     (await get(lRef)).exists() ? remove(lRef) : set(lRef,true);
//   };
//   const saveEdit = async id => {
//     const txt = editDrafts[id]?.trim();
//     if (!txt) return;
//     await update(ref(rtdb, cPath(id)), { text:txt, updatedAt:serverTimestamp() });
//     setEditId(null); setEditDrafts(prev => ({...prev, [id]:""}));
//   };
//   const del = id => remove(ref(rtdb, cPath(id)));

//   /* meta */
//   const Meta = ({ c }) => (
//     <small className="text-muted">
//       {new Date(c.createdAt).toLocaleDateString()}
//       {c.updatedAt && <> · edited {new Date(c.updatedAt).toLocaleTimeString()}</>}
//     </small>
//   );

//   /* recursive node */
//   const Node = ({ node, depth }) => {
//     const mine    = uid === node.uid;
//     const liked   = (likesMap[node.id]||[]).includes(uid);
//     const editing = editId === node.id;

//     return (
//       <li className="mb-3" style={{marginLeft: depth?depth*24:0}}>
//         <div className="d-flex gap-3">
//           <img src={node.avatarUrl||"https://placehold.co/32x32"}
//                className="rounded-circle flex-shrink-0" width="32" height="32" alt="" />
//           <div className="flex-grow-1">
//             {/* header */}
//             <div className="d-flex justify-content-between">
//               <span className="fw-semibold">{node.username}</span>
//               <Meta c={node}/>
//             </div>

//             {/* body */}
//             {editing ? (
//               <MDBInputGroup className="my-2">
//                 <input className="form-control"
//                        value={editDrafts[node.id] ?? ""}
//                        onChange={e => setEditDrafts(prev=>({...prev,[node.id]:e.target.value}))}/>
//                 <MDBBtn size="sm" onClick={()=>saveEdit(node.id)}>Save</MDBBtn>
//                 <MDBBtn size="sm" color="link" onClick={()=>setEditId(null)}>Cancel</MDBBtn>
//               </MDBInputGroup>
//             ) : (
//               <p className="mb-1">{node.text}</p>
//             )}

//             {/* actions */}
//             <div className="d-flex gap-3 small text-muted">
//               <span role={uid?"button":undefined}
//                     style={!uid?{cursor:"not-allowed",opacity:0.5}:undefined}
//                     onClick={()=>uid&&toggleLike(node.id)}>
//                 <MDBIcon fas={liked} far={!liked} icon="thumbs-up" className="me-1"/>
//                 {(likesMap[node.id]||[]).length}
//               </span>
//               {uid && (
//                 <span role="button" onClick={()=>setReplyFor(replyFor===node.id?null:node.id)}>
//                   <MDBIcon far icon="reply" className="me-1"/>Reply
//                 </span>
//               )}
//               {mine && !editing && (
//                 <>
//                   <span role="button" onClick={()=>{setEditId(node.id); setEditDrafts(prev=>({...prev,[node.id]:node.text}));}}>
//                     <MDBIcon fas icon="edit" className="me-1"/>Edit
//                   </span>
//                   <span role="button" onClick={()=>del(node.id)}>
//                     <MDBIcon fas icon="trash-alt" className="me-1 text-danger"/>Delete
//                   </span>
//                 </>
//               )}
//             </div>

//             {/* reply box */}
//             {replyFor===node.id && uid && (
//               <MDBInputGroup className="mt-3">
//                 <input className="form-control" placeholder="Write a reply…"
//                        value={replyDrafts[node.id] ?? ""}
//                        onChange={e=>setReplyDrafts(prev=>({...prev,[node.id]:e.target.value}))}/>
//                 <MDBBtn size="sm" onClick={()=>{
//                   post(replyDrafts[node.id]||"",node.id);
//                   setReplyDrafts(prev=>({...prev,[node.id]:""}));
//                   setReplyFor(null);
//                 }}>Reply</MDBBtn>
//               </MDBInputGroup>
//             )}
//           </div>
//         </div>

//         {/* children */}
//         {node.children?.length>0 && (
//           <ul className="list-unstyled mt-3">
//             {node.children.map(ch=> <Node key={ch.id} node={ch} depth={depth+1}/>)}
//           </ul>
//         )}
//       </li>
//     );
//   };

//   /* render */
//   return (
//     <div>
//       {uid ? (
//         <MDBInputGroup className="mb-4">
//           <textarea className="form-control" rows={2}
//                     value={rootText}
//                     onChange={e=>setRootText(e.target.value)}
//                     placeholder="Add your comment…"/>
//           <MDBBtn onClick={()=>{post(rootText); setRootText("");}}>Post</MDBBtn>
//         </MDBInputGroup>
//       ) : (
//         <p className="text-muted fst-italic mb-4">Please log in to post comments.</p>
//       )}

//       <ul className="list-unstyled">
//         {tree.map(r=> <Node key={r.id} node={r} depth={0}/>)}
//         <li ref={bottomRef}/>
//       </ul>
//     </div>
//   );
// }


// /*  src/components/cards/CommentList.jsx  */
// import { useState, useEffect, useRef } from "react";
// import {
//   ref, push, set, onValue, get, remove, update, serverTimestamp
// } from "firebase/database";
// import { rtdb } from "../../configs/firebase";
// import { MDBInputGroup, MDBBtn, MDBIcon } from "mdb-react-ui-kit";

// export default function CommentList({ articleId, currentUser }) {
//   /* user helpers */
//   const uid   = currentUser?.uid;
//   const uname = currentUser?.displayName || currentUser?.email?.split("@")[0];
//   const uava  = currentUser?.photoURL;

//   /* root-level state */
//   const [tree,  setTree]  = useState([]);   // nested
//   const [likes, setLikes] = useState({});   // {id:[uids]}
//   const [rootDraft, setRootDraft] = useState("");

//   const bottomRef = useRef(null);
//   const cPath = (cid="") => `comments/${articleId}/${cid}`;

//   /* realtime listener */
//   useEffect(()=>{
//     if(!articleId) return;
//     return onValue(ref(rtdb, `comments/${articleId}`), snap=>{
//       const map={}, lk={};
//       snap.forEach(c=>{
//         const n={ id:c.key, ...c.val(), children:[] };
//         map[n.id]=n;
//         const arr=[]; c.child("likedBy").forEach(u=>arr.push(u.key));
//         lk[n.id]=arr;
//       });
//       const roots=[];
//       Object.values(map).forEach(n=>{
//         n.parentId ? map[n.parentId]?.children.push(n) : roots.push(n);
//       });
//       setTree(roots); setLikes(lk);
//       setTimeout(()=>bottomRef.current?.scrollIntoView({behavior:"smooth"}),0);
//     });
//   },[articleId]);

//   /* helpers */
//   const post = async(text,parentId=null)=>{
//     if(!uid || !text.trim()) return;
//     await set(push(ref(rtdb,`comments/${articleId}`)),{
//       uid,username:uname,avatarUrl:uava,
//       text:text.trim(),parentId,createdAt:Date.now()
//     });
//   };
//   const toggleLike = async id=>{
//     if(!uid) return;
//     const lRef=ref(rtdb,`${cPath(id)}/likedBy/${uid}`);
//     (await get(lRef)).exists() ? remove(lRef) : set(lRef,true);
//   };
//   const saveEdit = async(id,txt,setEditing)=>{
//     if(!txt.trim()) return;
//     await update(ref(rtdb,cPath(id)),{
//       text:txt.trim(), updatedAt:serverTimestamp()
//     });
//     setEditing(false);
//   };
//   const del = id => remove(ref(rtdb,cPath(id)));

//   /* tiny meta */
//   const Meta=({c})=>(
//     <small className="text-muted">
//       {new Date(c.createdAt).toLocaleDateString()}
//       {c.updatedAt && <> · edited {new Date(c.updatedAt).toLocaleTimeString()}</>}
//     </small>
//   );

//   /* comment / reply node */
//   const Node = ({node, depth})=>{
//     const mine  = uid===node.uid;
//     const [editing,setEditing]=useState(false);
//     const [editDraft,setEditDraft]=useState(node.text);
//     const [replyOpen,setReplyOpen]=useState(false);
//     const [replyDraft,setReplyDraft]=useState("");

//     const liked = (likes[node.id]||[]).includes(uid);

//     return(
//       <li className="mb-3" style={{marginLeft:depth*24}}>
//         <div className="d-flex gap-3">
//           <img src={node.avatarUrl||"https://placehold.co/32x32"} width="32" height="32"
//                className="rounded-circle flex-shrink-0" alt=""/>
//           <div className="flex-grow-1">

//             {/* header */}
//             <div className="d-flex justify-content-between">
//               <span className="fw-semibold">{node.username}</span>
//               <Meta c={node}/>
//             </div>

//             {/* body */}
//             {editing?(
//               <MDBInputGroup className="my-2">
//                 <input className="form-control"
//                        value={editDraft}
//                        onChange={e=>setEditDraft(e.target.value)}/>
//                 <MDBBtn size="sm" onClick={()=>saveEdit(node.id,editDraft,setEditing)}>Save</MDBBtn>
//                 <MDBBtn size="sm" color="link" onClick={()=>setEditing(false)}>Cancel</MDBBtn>
//               </MDBInputGroup>
//             ):(
//               <p className="mb-1">{node.text}</p>
//             )}

//             {/* actions */}
//             <div className="d-flex gap-3 small text-muted">
//               <span role={uid?"button":undefined}
//                     style={!uid?{cursor:"not-allowed",opacity:.5}:undefined}
//                     onClick={()=>uid&&toggleLike(node.id)}>
//                 <MDBIcon fas={liked} far={!liked} icon="thumbs-up" className="me-1"/>
//                 {(likes[node.id]||[]).length}
//               </span>

//               {uid&&(
//                 <span role="button" onClick={()=>setReplyOpen(o=>!o)}>
//                   <MDBIcon far icon="reply" className="me-1"/>Reply
//                 </span>
//               )}

//               {mine && !editing&&(
//                 <>
//                   <span role="button" onClick={()=>setEditing(true)}>
//                     <MDBIcon fas icon="edit" className="me-1"/>Edit
//                   </span>
//                   <span role="button" onClick={()=>del(node.id)}>
//                     <MDBIcon fas icon="trash-alt" className="me-1 text-danger"/>Delete
//                   </span>
//                 </>
//               )}
//             </div>

//             {/* reply box */}
//             {replyOpen&&uid&&(
//               <MDBInputGroup className="mt-3">
//                 <input className="form-control" placeholder="Write a reply…"
//                        value={replyDraft}
//                        onChange={e=>setReplyDraft(e.target.value)}/>
//                 <MDBBtn size="sm" onClick={()=>{
//                   post(replyDraft,node.id);
//                   setReplyDraft(""); setReplyOpen(false);
//                 }}>Reply</MDBBtn>
//               </MDBInputGroup>
//             )}
//           </div>
//         </div>

//         {/* children */}
//         {node.children?.length>0&&(
//           <ul className="list-unstyled mt-3">
//             {node.children.map(ch=><Node key={ch.id} node={ch} depth={depth+1}/>)}
//           </ul>
//         )}
//       </li>
//     );
//   };

//   /* render */
//   return (
//     <div>
//       {uid?(
//         <MDBInputGroup className="mb-4">
//           <textarea rows={2} className="form-control"
//                     value={rootDraft} onChange={e=>setRootDraft(e.target.value)}
//                     placeholder="Add your comment…"/>
//           <MDBBtn onClick={()=>{post(rootDraft); setRootDraft("");}}>Post</MDBBtn>
//         </MDBInputGroup>
//       ):(
//         <p className="text-muted fst-italic mb-4">
//           Please log in to post comments.
//         </p>
//       )}

//       <ul className="list-unstyled">
//         {tree.map(r=><Node key={r.id} node={r} depth={0}/>)}
//         <li ref={bottomRef}/>
//       </ul>
//     </div>
//   );
// }



// // CommentList.jsx
// import { useState, useEffect, useRef } from "react";
// import {
//   ref, push, set, onValue, get, remove, update, serverTimestamp, runTransaction
// } from "firebase/database";
// import { doc, getDoc } from "firebase/firestore";              // ⬅️ NEW
// import { rtdb, db as fsDb } from "../../configs/firebase";      // ⬅️ NEW (db alias)
// import { MDBInputGroup, MDBBtn, MDBIcon } from "mdb-react-ui-kit";
// import { Link } from "react-router-dom";

// export default function CommentList({ articleId, currentUser }) {
//   /* user helpers */
//   const uid   = currentUser?.uid;
//   const uname = currentUser?.displayName || currentUser?.email?.split("@")[0];
//   const uava  = currentUser?.photoURL;

//   /* local state */
//   const [tree,  setTree]   = useState([]);
//   const [likes, setLikes]  = useState({});
//   const [draft, setDraft]  = useState("");
//   const [slugMap, setSlugMap] = useState({});                  // ⬅️ NEW


//   const bottomRef = useRef(null);
//   const cPath = (cid="") => `comments/${articleId}/${cid}`;
//   const counterRef = ref(rtdb, `articles/${articleId}/commentsCount`);

//   /* realtime listener */
//   useEffect(()=>{
//     if (!articleId) return;

//     return onValue(ref(rtdb, `comments/${articleId}`), async snap=>{
//       const map={}, lk={};
//       const uidsNeeded = new Set();
//       snap.forEach(c=>{
//         const n={ id:c.key, ...c.val(), children:[] };
//         map[n.id]=n;
//         const arr=[]; 
//         c.child("likedBy").forEach(u=>arr.push(u.key));
//         lk[n.id]=arr;
//         if (!slugMap[n.uid]) uidsNeeded.add(n.uid);
        
//       });
//       if (uidsNeeded.size > 0) {
//         const promises = [...uidsNeeded].map(async id => {
//           try {
//             const s = await getDoc(doc(fsDb, "users", id));
//             return s.exists() ? { id, slug: s.data().username || null } : { id, slug: null };
//           } catch { return { id, slug: null }; }
//         });

//         const results = await Promise.all(promises);
//         setSlugMap(prev => {
//           const next = { ...prev };
//           results.forEach(({ id, slug }) => { next[id] = slug; });
//           return next;
//         });
//       }
//       const roots=[];
//       Object.values(map).forEach(n=>{
//         n.parentId ? map[n.parentId]?.children.push(n) : roots.push(n);
//       });
//       setTree(roots); 
//       setLikes(lk);
//       setTimeout(()=>bottomRef.current?.scrollIntoView({behavior:"smooth"}),0);
//     });
//   },[articleId, slugMap]);

//   /* helpers ------------------------------------------------------------ */
//   const incrementCounter = delta =>
//     runTransaction(counterRef, cur => Math.max((cur || 0) + delta, 0));

//   const addComment = async (text, parentId=null) => {
//     if (!uid || !text.trim()) return;
//     await set(
//       push(ref(rtdb, `comments/${articleId}`)),
//       {
//         uid, username: uname, avatarUrl: uava,
//         text: text.trim(),
//         parentId,
//         createdAt: Date.now()
//       }
//     );
//     await incrementCounter(1);
//   };

//   const deleteComment = async id => {
//     await remove(ref(rtdb, cPath(id)));
//     await incrementCounter(-1);
//   };

//   const toggleLike = async id => {
//     if (!uid) return;
//     const lRef = ref(rtdb, `${cPath(id)}/likedBy/${uid}`);
//     (await get(lRef)).exists() ? remove(lRef) : set(lRef,true);
//   };

//   const saveEdit = async (id, text) => {
//     if (!text.trim()) return;
//     await update(ref(rtdb, cPath(id)), {
//       text: text.trim(),
//       updatedAt: serverTimestamp()
//     });
//   };

//   /* tiny meta */
//   const Meta = ({ c }) => (
//     <small className="text-muted">
//       {new Date(c.createdAt).toLocaleDateString()}
//       {c.updatedAt && <> · edited {new Date(c.updatedAt).toLocaleTimeString()}</>}
//     </small>
//   );

//   const Node = ({ node, depth }) => {
//   const mine   = uid === node.uid;
//   const liked  = (likes[node.id] || []).includes(uid);

//   // ✅ correct link
//   const profileLink = mine ? "/profile" : `/u/${node.username || node.uid}`;

//   // local UI state
//   const [editing, setEditing] = useState(false);
//   const [eDraft,  setEDraft]  = useState(node.text);
//   const [open,    setOpen]    = useState(false);
//   const [rDraft,  setRDraft]  = useState("");

//   return (
//     <li className="mb-3" style={{ marginLeft: depth * 24 }}>
//       <div className="d-flex gap-3">
//         <Link to={profileLink} className="flex-shrink-0">
//           <img
//             src={node.avatarUrl || "https://placehold.co/32x32"}
//             width="32" height="32" alt=""
//             className="rounded-circle"
//           />
//         </Link>

//         <div className="flex-grow-1">
//           <div className="d-flex justify-content-between">
//             <Link
//               to={profileLink}
//               className="fw-semibold text-reset"
//               style={{ textDecoration: "none" }}
//             >
//               {node.username}
//             </Link>
//             <Meta c={node} />
//           </div>

//           {editing ? (
//             <MDBInputGroup className="my-2">
//               <input
//                 className="form-control"
//                 value={eDraft}
//                 onChange={e => setEDraft(e.target.value)}
//               />
//               <MDBBtn size="sm" onClick={() => { saveEdit(node.id, eDraft); setEditing(false); }}>
//                 Save
//               </MDBBtn>
//               <MDBBtn size="sm" color="link" onClick={() => setEditing(false)}>
//                 Cancel
//               </MDBBtn>
//             </MDBInputGroup>
//           ) : (
//             <p className="mb-1">{node.text}</p>
//           )}

//           <div className="d-flex gap-3 small text-muted">
//             <span
//               role={uid ? "button" : undefined}
//               style={!uid ? { cursor: "not-allowed", opacity: .5 } : undefined}
//               onClick={() => uid && toggleLike(node.id)}
//             >
//               <MDBIcon fas={liked} far={!liked} icon="thumbs-up" className="me-1" />
//               {(likes[node.id] || []).length}
//             </span>

//             {uid && (
//               <span role="button" onClick={() => setOpen(o => !o)}>
//                 <MDBIcon far icon="reply" className="me-1" />Reply
//               </span>
//             )}

//             {mine && !editing && (
//               <>
//                 <span role="button" onClick={() => setEditing(true)}>
//                   <MDBIcon fas icon="edit" className="me-1" />Edit
//                 </span>
//                 <span role="button" onClick={() => deleteComment(node.id)}>
//                   <MDBIcon fas icon="trash-alt" className="me-1 text-danger" />Delete
//                 </span>
//               </>
//             )}
//           </div>

//           {open && uid && (
//             <MDBInputGroup className="mt-3">
//               <input
//                 className="form-control"
//                 placeholder="Write a reply…"
//                 value={rDraft}
//                 onChange={e => setRDraft(e.target.value)}
//               />
//               <MDBBtn size="sm" onClick={() => { addComment(rDraft, node.id); setRDraft(""); setOpen(false); }}>
//                 Reply
//               </MDBBtn>
//             </MDBInputGroup>
//           )}
//         </div>
//       </div>

//       {/* children */}
//       {node.children?.length > 0 && (
//         <ul className="list-unstyled mt-3">
//           {node.children.map(ch => <Node key={ch.id} node={ch} depth={depth + 1} />)}
//         </ul>
//       )}
//     </li>
//   );
// };

//   /* render */
//   return (
//     <div>
//       {uid ? (
//         <MDBInputGroup className="mb-4">
//           <textarea rows={2} className="form-control"
//                     value={draft}
//                     onChange={e=>setDraft(e.target.value)}
//                     placeholder="Add your comment…" />
//           <MDBBtn onClick={()=>{ addComment(draft); setDraft(""); }}>Post</MDBBtn>
//         </MDBInputGroup>
//       ) : (
//         <p className="text-muted fst-italic mb-4">Please log in to post comments.</p>
//       )}

//       <ul className="list-unstyled">
//         {tree.map(n => <Node key={n.id} node={n} depth={0} />)}
//         <li ref={bottomRef} />
//       </ul>
//     </div>
//   );
// }






// // correct one is below

// //CommentList.jsx
// import { useState, useEffect, useRef } from "react";
// import {
//   ref, push, set, onValue, get, remove,
//   update, serverTimestamp, runTransaction,
// } from "firebase/database";
// import { doc, getDoc } from "firebase/firestore";         
// import { rtdb, db as fsDb } from "../../configs/firebase";  
// import { MDBInputGroup, MDBBtn, MDBIcon } from "mdb-react-ui-kit";
// import { Link } from "react-router-dom";
// import {
//   streamCommentLikes,
//   likeComment
// } from "../../configs/useArticles";


// export default function CommentList({ articleId, currentUser }) {
//   /* auth info */
//   const uid        = currentUser?.uid;
//   const avatarUrl  = currentUser?.photoURL || null;

//   /* local state */
//   const [tree,      setTree]    = useState([]);
//   const [likes,     setLikes]   = useState({});
//   const [draft,     setDraft]   = useState("");
//   const [slugMap,   setSlugMap] = useState({});      // uid → slug
//   const [mySlug,    setMySlug]  = useState(null);    // current user’s slug

//   const bottomRef  = useRef(null);
//   const cPath      = cid => `comments/${articleId}/${cid}`;
//   const counterRef = ref(rtdb, `articles/${articleId}/commentsCount`);

//   /* ───── fetch *my* slug once ───── */
//   useEffect(() => {
//     if (!uid) return;
//     (async () => {
//       try {
//         const snap = await getDoc(doc(fsDb, "users", uid));
//         if (snap.exists()) setMySlug(snap.data().username || uid);
//       } catch { /* ignore */ }
//     })();
//   }, [uid]);

//   /* ───── realtime listener ───── */
//   useEffect(() => {
//     if (!articleId) return;

//     return onValue(ref(rtdb, `comments/${articleId}`), async snap => {
//       const map = {}, lk = {}, uidsNeeded = new Set();

//       snap.forEach(c => {
//         const n = { id: c.key, ...c.val(), children: [] };
//         map[n.id] = n;

//         const arr = [];
//         c.child("likedBy").forEach(u => arr.push(u.key));
//         lk[n.id] = arr;

//         if (!slugMap[n.uid]) uidsNeeded.add(n.uid);
//       });

//       /* lazy-fetch missing slugs */
//       if (uidsNeeded.size > 0) {
//         const fetched = await Promise.all(
//           [...uidsNeeded].map(async id => {
//             try {
//               const s = await getDoc(doc(fsDb, "users", id));
//               return { id, slug: s.exists() ? s.data().username || null : null };
//             } catch { return { id, slug: null }; }
//           })
//         );
//         setSlugMap(prev => {
//           const next = { ...prev };
//           fetched.forEach(({ id, slug }) => (next[id] = slug));
//           return next;
//         });
//       }

//       /* flatten into tree */
//       const roots = [];
//       Object.values(map).forEach(n =>
//         n.parentId ? map[n.parentId]?.children.push(n) : roots.push(n)
//       );

//       setTree(roots);
//       setLikes(lk);
//       setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: "smooth" }), 0);
//     });
//   }, [articleId, slugMap]);

//   /* ───── helpers ───── */
//   const incrementCounter = delta =>
//     runTransaction(counterRef, cur => Math.max((cur || 0) + delta, 0));

//   const addComment = async (text, parentId = null) => {
//     if (!uid || !text.trim()) return;

//     /* ensure we have our slug */
//     let slug = mySlug;
//     if (!slug) {
//       try {
//         const s = await getDoc(doc(fsDb, "users", uid));
//         slug = s.exists() ? s.data().username || uid : uid;
//         setMySlug(slug);
//       } catch { slug = uid; }
//     }

//     await set(
//       push(ref(rtdb, `comments/${articleId}`)),
//       {
//         uid,
//         username: slug,          // ← canonical username
//         avatarUrl,
//         text: text.trim(),
//         parentId,
//         createdAt: Date.now(),
//       }
//     );
//     await incrementCounter(1);
//   };

//   const deleteComment  = async id => { await remove(ref(rtdb, cPath(id))); await incrementCounter(-1); };
//   // const toggleLike     = async id => { if (!uid) return; const p = ref(rtdb, `${cPath(id)}/likedBy/${uid}`); (await get(p)).exists() ? remove(p) : set(p, true); };
  
  
//   const toggleLike = async id => {
//   if (!uid) return;
//   const lPath = `${cPath(id)}/likedBy/${uid}`;
//   const lRef  = ref(rtdb, lPath);
//   const exists = (await get(lRef)).exists();

//   // optimistic local mirror
//   setLikes(prev => {
//     const map = { ...prev };
//     const arr = map[id] ? [...map[id]] : [];
//     if (exists) {
//       map[id] = arr.filter(u => u !== uid);
//     } else {
//       arr.push(uid);
//       map[id] = arr;
//     }
//     return map;
//   });

//   // server
//   exists ? remove(lRef) : set(lRef, true);
// };


//   const saveEdit       = async (id, text) => { if (!text.trim()) return; await update(ref(rtdb, cPath(id)), { text: text.trim(), updatedAt: serverTimestamp() }); };

//   /* small date line */
//   const Meta = ({ c }) => (
//     <small className="text-muted">
//       {new Date(c.createdAt).toLocaleDateString()}
//       {c.updatedAt && <> · edited {new Date(c.updatedAt).toLocaleTimeString()}</>}
//     </small>
//   );

//   /* ───── recursive node ───── */
//   const Node = ({ node, depth }) => {
//     const mine   = uid === node.uid;
//     const liked  = (likes[node.id] || []).includes(uid);
//     const slug   = node.username || slugMap[node.uid] || node.uid;   // always a slug now
//     const link   = mine ? "/profile" : `/u/${slug}`;

//     /* local UI state */
//     const [editing, setEditing] = useState(false);
//     const [eDraft,  setEDraft]  = useState(node.text);
//     const [open,    setOpen]    = useState(false);
//     const [rDraft,  setRDraft]  = useState("");

//     return (
//       <li className="mb-3" style={{ marginLeft: depth * 24 }}>
//         <div className="d-flex gap-3">
//           <Link to={link} className="flex-shrink-0">
//             <img
//               src={node.avatarUrl || "https://placehold.co/32x32"}
//               width="32" height="32" alt=""
//               className="rounded-circle"
//             />
//           </Link>

//           <div className="flex-grow-1">
//             <div className="d-flex justify-content-between">
//               <Link to={link} className="fw-semibold text-reset" style={{ textDecoration: "none" }}>
//                 {slug}
//               </Link>
//               <Meta c={node} />
//             </div>

//             {editing ? (
//               <MDBInputGroup className="my-2">
//                 <input className="form-control" value={eDraft} onChange={e => setEDraft(e.target.value)} />
//                 <MDBBtn size="sm" onClick={() => { saveEdit(node.id, eDraft); setEditing(false); }}>Save</MDBBtn>
//                 <MDBBtn size="sm" color="link" onClick={() => setEditing(false)}>Cancel</MDBBtn>
//               </MDBInputGroup>
//             ) : (
//               <p className="mb-1">{node.text}</p>
//             )}

//             <div className="d-flex gap-3 small text-muted">
//               <span
//                 role={uid ? "button" : undefined}
//                 style={!uid ? { cursor: "not-allowed", opacity: .5 } : undefined}
//                 onClick={() => uid && toggleLike(node.id)}
//               >
//                 <MDBIcon fas={liked} far={!liked} icon="thumbs-up" className="me-1" />
//                 {(likes[node.id] || []).length}
//               </span>

//               {uid && (
//                 <span role="button" onClick={() => setOpen(o => !o)}>
//                   <MDBIcon far icon="reply" className="me-1" />Reply
//                 </span>
//               )}

//               {mine && !editing && (
//                 <>
//                   <span role="button" onClick={() => setEditing(true)}>
//                     <MDBIcon fas icon="edit" className="me-1" />Edit
//                   </span>
//                   <span role="button" onClick={() => deleteComment(node.id)}>
//                     <MDBIcon fas icon="trash-alt" className="me-1 text-danger" />Delete
//                   </span>
//                 </>
//               )}
//             </div>

//             {open && uid && (
//               <MDBInputGroup className="mt-3">
//                 <input
//                   className="form-control"
//                   placeholder="Write a reply…"
//                   value={rDraft}
//                   onChange={e => setRDraft(e.target.value)}
//                 />
//                 <MDBBtn
//                   size="sm"
//                   onClick={() => { addComment(rDraft, node.id); setRDraft(""); setOpen(false); }}
//                 >
//                   Reply
//                 </MDBBtn>
//               </MDBInputGroup>
//             )}
//           </div>
//         </div>

//         {node.children?.length > 0 && (
//           <ul className="list-unstyled mt-3">
//             {node.children.map(ch => <Node key={ch.id} node={ch} depth={depth + 1} />)}
//           </ul>
//         )}
//       </li>
//     );
//   };

//   /* ───── render ───── */
//   return (
//     <div>
//       {uid ? (
//         <MDBInputGroup className="mb-4">
//           <textarea
//             rows={2}
//             className="form-control"
//             value={draft}
//             onChange={e => setDraft(e.target.value)}
//             placeholder="Add your comment…"
//           />
//           <MDBBtn onClick={() => { addComment(draft); setDraft(""); }}>Post</MDBBtn>
//         </MDBInputGroup>
//       ) : (
//         <p className="text-muted fst-italic mb-4">Please log in to post comments.</p>
//       )}

//       <ul className="list-unstyled">
//         {tree.map(n => <Node key={n.id} node={n} depth={0} />)}
//         <li ref={bottomRef} />
//       </ul>
//     </div>
//   );
// }


// Correct one below like working

// // CommentList
// import { useState, useEffect, useRef } from "react";
// import {
//   ref, push, set, onValue, get, remove,
//   update, runTransaction
// } from "firebase/database";
// import { doc, getDoc } from "firebase/firestore";
// import { rtdb, db as fsDb } from "../../configs/firebase";
// import {
//   streamCommentLikes,
//   likeComment
// } from "../../configs/useArticles";
// import { MDBInputGroup, MDBBtn, MDBIcon } from "mdb-react-ui-kit";
// import { Link } from "react-router-dom";

// export default function CommentList({ articleId, currentUser }) {
//   const uid       = currentUser?.uid;
//   const avatarUrl = currentUser?.photoURL || null;

//   const [tree,    setTree]    = useState([]);
//   const [likes,   setLikes]   = useState({});
//   const [draft,   setDraft]   = useState("");
//   const [slugMap, setSlugMap] = useState({});
//   const [mySlug,  setMySlug]  = useState(null);

//   const bottomRef = useRef(null);
//   const cPath     = cid => `comments/${articleId}/${cid}`;
//   const counterRef = ref(rtdb, `articles/${articleId}/commentsCount`);

//   // subscribe to comment likes per comment/reply
//   useEffect(() => {
//     if (!articleId) return;
//     const unsub = streamCommentLikes(articleId, setLikes);
//     return () => unsub();
//   }, [articleId]);

//   /* fetch my slug */
//   useEffect(() => {
//     if (!uid) return;
//     (async () => {
//       try {
//         const snap = await getDoc(doc(fsDb, "users", uid));
//         if (snap.exists()) setMySlug(snap.data().username || uid);
//       } catch {}
//     })();
//   }, [uid]);

//   // build tree structure
//   useEffect(() => {
//     if (!articleId) return;
//     const unsub = onValue(ref(rtdb, `comments/${articleId}`), async snap => {
//       const map = {};
//       const uidsToFetch = new Set();

//       snap.forEach(c => {
//         const n = { id: c.key, ...c.val(), children: [] };
//         map[n.id] = n;
//         if (!slugMap[n.uid]) uidsToFetch.add(n.uid);
//       });

//       if (uidsToFetch.size) {
//         const fetched = await Promise.all(
//           [...uidsToFetch].map(async id => {
//             try {
//               const s = await getDoc(doc(fsDb, "users", id));
//               return [id, s.exists() ? s.data().username || id : id];
//             } catch {
//               return [id, id];
//             }
//           })
//         );
//         setSlugMap(prev => ({ ...prev, ...Object.fromEntries(fetched) }));
//       }

//       const roots = [];
//       Object.values(map).forEach(n => {
//         if (n.parentId && map[n.parentId]) map[n.parentId].children.push(n);
//         else roots.push(n);
//       });

//       setTree(roots);
//       setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: "smooth" }), 0);
//     });
//     return () => unsub();
//   }, [articleId, slugMap]);

//   const incrementCounter = delta =>
//     runTransaction(counterRef, cur => Math.max((cur || 0) + delta, 0));

//   const addComment = async (text, parentId = null) => {
//     if (!uid || !text.trim()) return;
//     let slug = mySlug;
//     if (!slug) {
//       try {
//         const s = await getDoc(doc(fsDb, "users", uid));
//         slug = s.exists() ? s.data().username || uid : uid;
//         setMySlug(slug);
//       } catch {
//         slug = uid;
//       }
//     }
//     const newRef = push(ref(rtdb, `comments/${articleId}`));
//     await set(newRef, {
//       uid,
//       username: slug,
//       avatarUrl,
//       text: text.trim(),
//       parentId,
//       createdAt: Date.now(),
//     });
//     await incrementCounter(1);
//   };

//   const deleteComment = async id => {
//     await remove(ref(rtdb, cPath(id)));
//     await incrementCounter(-1);
//   };

//   // const toggleLike = async id => {
//   //   if (!uid) return;
//   //   await likeComment(articleId, id, uid);
//   // };

//   const toggleLike = async id => {
//         if (!uid) return;
    
//         /* optimistic local update */
//         setLikes(prev => {
//           const arr = prev[id] || [];
//           const nextArr = arr.includes(uid)
//             ? arr.filter(x => x !== uid)
//             : [...arr, uid];
//           return { ...prev, [id]: nextArr };
//         });
    
//         try {
//           await likeComment(articleId, id, uid);         // RTDB write + notification
//         } catch (err) {
//           console.error(err);
//           /* roll-back if the write failed */
//           setLikes(prev => {
//             const arr = prev[id] || [];
//             const nextArr = arr.includes(uid)
//               ? arr.filter(x => x !== uid)
//               : [...arr, uid];
//             return { ...prev, [id]: nextArr };
//           });
//         }
//       };

//   const saveEdit = async (id, text) => {
//     if (!text.trim()) return;
//     await update(ref(rtdb, cPath(id)), { text: text.trim(), updatedAt: Date.now() });
//   };

//   const Meta = ({ c }) => (
//     <small className="text-muted">
//       {new Date(c.createdAt).toLocaleDateString()}
//       {c.updatedAt && <> · edited {new Date(c.updatedAt).toLocaleTimeString()}</>}
//     </small>
//   );

//   const Node = ({ node, depth }) => {
//     const mine  = uid === node.uid;
//     const liked = (likes[node.id] || []).includes(uid);
//     const slug  = node.username || slugMap[node.uid] || node.uid;
//     const link  = mine ? "/profile" : `/u/${slug}`;

//     const [editing, setEditing] = useState(false);
//     const [eDraft, setEDraft]   = useState(node.text);
//     const [open, setOpen]       = useState(false);
//     const [rDraft, setRDraft]   = useState("");

//     return (
//       <li className="mb-3" style={{ marginLeft: depth * 24 }}>
//         <div className="d-flex gap-3">
//           <Link to={link} className="flex-shrink-0">
//             <img src={node.avatarUrl || "https://placehold.co/32x32"} width="32" height="32" className="rounded-circle" />
//           </Link>
//           <div className="flex-grow-1">
//             <div className="d-flex justify-content-between">
//               <Link to={link} className="fw-semibold text-reset" style={{ textDecoration: "none" }}>
//                 {slug}
//               </Link>
//               <Meta c={node} />
//             </div>

//             {editing ? (
//               <MDBInputGroup className="my-2">
//                 <input className="form-control" value={eDraft} onChange={e => setEDraft(e.target.value)} />
//                 <MDBBtn size="sm" onClick={() => { saveEdit(node.id, eDraft); setEditing(false); }}>Save</MDBBtn>
//                 <MDBBtn size="sm" color="link" onClick={() => setEditing(false)}>Cancel</MDBBtn>
//               </MDBInputGroup>
//             ) : (
//               <p className="mb-1">{node.text}</p>
//             )}

//             <div className="d-flex gap-3 small text-muted">
//               <span onClick={() => uid && toggleLike(node.id)} style={{ cursor: uid ? 'pointer' : 'not-allowed', opacity: uid ? 1 : 0.5 }}>
//                 <MDBIcon fas={liked} far={!liked} icon="thumbs-up" className="me-1" />
//                 {(likes[node.id] || []).length}
//               </span>
//               {uid && (
//                 <span onClick={() => setOpen(o => !o)} style={{ cursor: 'pointer' }}>
//                   <MDBIcon far icon="reply" className="me-1" /> Reply
//                 </span>
//               )}
//               {mine && !editing && (
//                 <>  
//                   <span onClick={() => setEditing(true)} style={{ cursor: 'pointer' }}>
//                     <MDBIcon fas icon="edit" className="me-1" />Edit
//                   </span>
//                   <span onClick={() => deleteComment(node.id)} style={{ cursor: 'pointer' }}>
//                     <MDBIcon fas icon="trash-alt" className="me-1 text-danger" />Delete
//                   </span>
//                 </>
//               )}
//             </div>

//             {open && uid && (
//               <MDBInputGroup className="mt-3">
//                 <input
//                   className="form-control"
//                   placeholder="Write a reply…"
//                   value={rDraft}
//                   onChange={e => setRDraft(e.target.value)}
//                 />
//                 <MDBBtn size="sm" onClick={() => { addComment(rDraft, node.id); setRDraft(""); setOpen(false); }}>
//                   Reply
//                 </MDBBtn>
//               </MDBInputGroup>
//             )}
//           </div>
//         </div>

//         {node.children?.length > 0 && (
//           <ul className="list-unstyled mt-3">
//             {node.children.map(ch => <Node key={ch.id} node={ch} depth={depth + 1} />)}
//           </ul>
//         )}
//       </li>
//     );
//   };

//   return (
//     <div>
//       {uid ? (
//         <MDBInputGroup className="mb-4">
//           <textarea rows={2} className="form-control" value={draft} onChange={e => setDraft(e.target.value)} placeholder="Add your comment…" />
//           <MDBBtn onClick={() => { addComment(draft); setDraft(""); }}>Post</MDBBtn>
//         </MDBInputGroup>
//       ) : (
//         <p className="text-muted fst-italic mb-4">Please log in to post comments.</p>
//       )}

//       <ul className="list-unstyled">
//         {tree.map(n => <Node key={n.id} node={n} depth={0} />)}
//         <li ref={bottomRef} />
//       </ul>
//     </div>
//   );
// }






// CommentList
import { useState, useEffect, useRef } from "react";
import {
  ref, push, set, onValue, get, remove,
  update, runTransaction
} from "firebase/database";
import { doc, getDoc } from "firebase/firestore";
import { rtdb, db as fsDb } from "../../configs/firebase";

import { tryNotify } from "../../configs/notifications";
import { get as rtdbGet, ref as rtdbRef } from "firebase/database";

import {
  streamCommentLikes,
  likeComment
} from "../../configs/useArticles";
import { MDBInputGroup, MDBBtn, MDBIcon } from "mdb-react-ui-kit";
import { Link } from "react-router-dom";
import '../../styles/auth_header.css';

/* ─────────── ICON ASSETS (your SVGs) ─────────── */
import LikeIcon from '../../images/icons/like icon.svg';
import CommentIcon from '../../images/icons/comment icon.svg';
import EditIcon from '../../images/icons/edit icon.svg';
import DeleteIcon from '../../images/icons/delete icon.svg';



export default function CommentList({ articleId, currentUser }) {
  const uid       = currentUser?.uid;
  const avatarUrl = currentUser?.photoURL || null;

  const [tree,    setTree]    = useState([]);
  const [likes,   setLikes]   = useState({});
  const [draft,   setDraft]   = useState("");
  const [slugMap, setSlugMap] = useState({});
  const [mySlug,  setMySlug]  = useState(null);

  const bottomRef = useRef(null);
  const cPath     = cid => `comments/${articleId}/${cid}`;
  const counterRef = ref(rtdb, `articles/${articleId}/commentsCount`);

  // subscribe to comment likes per comment/reply
  useEffect(() => {
    if (!articleId) return;
    // const unsub = streamCommentLikes(articleId, setLikes);
    // const unsub = streamCommentLikes(articleId, newMap =>
    //   setLikes(prev => ({ ...prev, ...newMap }))
    // );
    const unsub = streamCommentLikes(articleId, setLikes);
    return () => unsub?.();
  }, [articleId]);

  /* fetch my slug */
  useEffect(() => {
    if (!uid) return;
    (async () => {
      try {
        const snap = await getDoc(doc(fsDb, "users", uid));
        if (snap.exists()) setMySlug(snap.data().username || uid);
      } catch {}
    })();
  }, [uid]);

  // build tree structure
  useEffect(() => {
    if (!articleId) return;
    const unsub = onValue(ref(rtdb, `comments/${articleId}`), async snap => {
      const map = {};
      const uidsToFetch = new Set();

      snap.forEach(c => {
        const n = { id: c.key, ...c.val(), children: [] };
        map[n.id] = n;
        if (!slugMap[n.uid]) uidsToFetch.add(n.uid);
      });

      if (uidsToFetch.size) {
        const fetched = await Promise.all(
          [...uidsToFetch].map(async id => {
            try {
              const s = await getDoc(doc(fsDb, "users", id));
              return [id, s.exists() ? s.data().username || id : id];
            } catch {
              return [id, id];
            }
          })
        );
        setSlugMap(prev => ({ ...prev, ...Object.fromEntries(fetched) }));
      }

      const roots = [];
      Object.values(map).forEach(n => {
        if (n.parentId && map[n.parentId]) map[n.parentId].children.push(n);
        else roots.push(n);
      });

      setTree(roots);
      // setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: "smooth" }), 0);
    });
    return () => unsub();
  }, [articleId, slugMap]);

  const incrementCounter = delta =>
    runTransaction(counterRef, cur => Math.max((cur || 0) + delta, 0));

  const addComment = async (text, parentId = null) => {
    if (!uid || !text.trim()) return;
    let slug = mySlug;
    if (!slug) {
      try {
        const s = await getDoc(doc(fsDb, "users", uid));
        slug = s.exists() ? s.data().username || uid : uid;
        setMySlug(slug);
      } catch {
        slug = uid;
      }
    }
    const newRef = push(ref(rtdb, `comments/${articleId}`));
    await set(newRef, {
      uid,
      username: slug,
      avatarUrl,
      text: text.trim(),
      parentId,
      createdAt: Date.now(),
    });
    await incrementCounter(1);
    const artSnap = await rtdbGet(rtdbRef(rtdb, `articles/${articleId}`));
      const article = artSnap.val();
      if (article && article.authorId !== uid) {
        const actorSnap = await getDoc(doc(fsDb, "users", uid));
        const actor    = actorSnap.exists() ? actorSnap.data() : {};
        await tryNotify(article.authorId, {
          type: "comment",
          actorId:   uid,
          actorName:
            actor.username ||
            [actor.firstName, actor.lastName].filter(Boolean).join(" ") ||
            actor.email ||
            "Someone",
          actorAvatar: avatarUrl || "",
          articleId,
          articleTitle: article.title || "",
        });
      }
  };

  const deleteComment = async id => {
    await remove(ref(rtdb, cPath(id)));
    await incrementCounter(-1);
  };

  // const toggleLike = async id => {
  //   if (!uid) return;
  //   await likeComment(articleId, id, uid);
  // };

  const toggleLike = async id => {
        if (!uid) return;
    
        /* optimistic local update */
        setLikes(prev => {
          const arr = prev[id] || [];
          const nextArr = arr.includes(uid)
            ? arr.filter(x => x !== uid)
            : [...arr, uid];
          return { ...prev, [id]: nextArr };
        });
    
        try {
          await likeComment(articleId, id, uid);         // RTDB write + notification
        } catch (err) {
          console.error(err);
          /* roll-back if the write failed */
          setLikes(prev => {
            const arr = prev[id] || [];
            const nextArr = arr.includes(uid)
              ? arr.filter(x => x !== uid)
              : [...arr, uid];
            return { ...prev, [id]: nextArr };
          });
        }
      };

  const saveEdit = async (id, text) => {
    if (!text.trim()) return;
    await update(ref(rtdb, cPath(id)), { text: text.trim(), updatedAt: Date.now() });
  };

  const Meta = ({ c }) => (
    <small className="text-muted">
      {new Date(c.createdAt).toLocaleDateString()}
      {c.updatedAt && <> · edited {new Date(c.updatedAt).toLocaleTimeString()}</>}
    </small>
  );

  const Node = ({ node, depth }) => {
    const mine  = uid === node.uid;
    const liked = (likes[node.id] || []).includes(uid);
    const slug  = node.username || slugMap[node.uid] || node.uid;
    const link  = mine ? "/profile" : `/u/${slug}`;

    const [editing, setEditing] = useState(false);
    const [eDraft, setEDraft]   = useState(node.text);
    const [open, setOpen]       = useState(false);
    const [rDraft, setRDraft]   = useState("");
    const repliesCount = node.children?.length || 0;

    // return (
    //   <li className="mb-3" style={{ marginLeft: depth * 24 }}>
    //     <div className="d-flex gap-3">
    //       <Link to={link} className="flex-shrink-0">
    //         <img src={node.avatarUrl || "https://placehold.co/32x32"} width="32" height="32" className="rounded-circle" />
    //       </Link>
    //       <div className="flex-grow-1">
    //         <div className="d-flex justify-content-between">
    //           <Link to={link} className="fw-semibold text-reset" style={{ textDecoration: "none" }}>
    //             {slug}
    //           </Link>
    //           <Meta c={node} />
    //         </div>

    //         {editing ? (
    //           <MDBInputGroup className="my-2">
    //             <input className="form-control" value={eDraft} onChange={e => setEDraft(e.target.value)} />
    //             <MDBBtn type="button" size="sm" onClick={() => { saveEdit(node.id, eDraft); setEditing(false); }}>Save</MDBBtn>
    //             <MDBBtn type="button" size="sm" color="link" onClick={() => setEditing(false)}>Cancel</MDBBtn>
    //           </MDBInputGroup>
    //         ) : (
    //           <p className="mb-1">{node.text}</p>
    //         )}

    //         <div className="d-flex gap-3 small text-muted">
    //           <span onClick={() => uid && toggleLike(node.id)} style={{ cursor: uid ? 'pointer' : 'not-allowed', opacity: uid ? 1 : 0.5 }}>
    //             <MDBIcon fas={liked} far={!liked} icon="thumbs-up" className="me-1" />
    //             {(likes[node.id] || []).length}
    //           </span>
    //           {uid && (
    //             <span onClick={() => setOpen(o => !o)} style={{ cursor: 'pointer' }}>
    //               <MDBIcon far icon="reply" className="me-1" /> Reply
    //             </span>
    //           )}
    //           {mine && !editing && (
    //             <>  
    //               <span onClick={() => setEditing(true)} style={{ cursor: 'pointer' }}>
    //                 <MDBIcon fas icon="edit" className="me-1" />Edit
    //               </span>
    //               <span onClick={() => deleteComment(node.id)} style={{ cursor: 'pointer' }}>
    //                 <MDBIcon fas icon="trash-alt" className="me-1 text-danger" />Delete
    //               </span>
    //             </>
    //           )}
    //         </div>

    //         {open && uid && (
    //           <MDBInputGroup className="mt-3">
    //             <input
    //               className="form-control"
    //               placeholder="Write a reply…"
    //               value={rDraft}
    //               onChange={e => setRDraft(e.target.value)}
    //             />
    //             <MDBBtn type="button" size="sm" onClick={() => { addComment(rDraft, node.id); setRDraft(""); setOpen(false); }}>
    //               Reply
    //             </MDBBtn>
    //           </MDBInputGroup>
    //         )}
    //       </div>
    //     </div>

    //     {node.children?.length > 0 && (
    //       <ul className="list-unstyled mt-3">
    //         {node.children.map(ch => <Node key={ch.id} node={ch} depth={depth + 1} />)}
    //       </ul>
    //     )}
    //   </li>
    // );
  
    return (
      <li className={`comment-item depth-${depth}`} >
        <div className="d-flex gap-3">
          <Link to={link} className="flex-shrink-0">
            <img
              src={node.avatarUrl || "https://placehold.co/40x40"}
              width={depth === 0 ? 40 : 32}
              height={depth === 0 ? 40 : 32}
              className="rounded-circle comment-avatar"
            />
          </Link>

          <div className="flex-grow-1">
            {/* Header: name (bold) */}
            <div className="comment-header">
              <Link to={link} className="comment-author text-reset">
                {slug}
              </Link>
              {/* optional subline if you store it later */}
            </div>

            {/* Body */}
           {editing ? (
  <div className="comment-composer my-2">
    <input
      className="form-control comment-input"
      value={eDraft}
      placeholder="Edit your comment…"
      onChange={e => setEDraft(e.target.value)}
      onKeyDown={e => {
        if (e.key === 'Enter' && !e.shiftKey) {
          e.preventDefault();
          saveEdit(node.id, eDraft); setEditing(false);
        }
      }}
    />
    <button
      type="button"
      className="btn-outline-gold-solid"
      onClick={() => { saveEdit(node.id, eDraft); setEditing(false); }}
    >
      Save
    </button>
    <button
      type="button"
      className="btn-cancel-link"
      onClick={() => setEditing(false)}
    >
      Cancel
    </button>
  </div>
) : (
  <p className="comment-text mb-0">{node.text}</p>
)}


            {/* Meta row exactly like the mock */}
            <div className="comment-meta">
              <Meta c={node} />

              <span
                type="button"
                className="action like"
                onClick={() => uid && toggleLike(node.id)}
                // style={{ cursor: uid ? 'pointer' : 'not-allowed', opacity: uid ? 1 : 0.5 }}
                title={liked ? "Unlike" : "Like"}
              >
                {/* <MDBIcon icon="thumbs-up" fas={liked} far={!liked} /> */}
                <img
                  src={LikeIcon}
                  alt=""
                  className="comment-action-icon"
                  style={{ width: 18, height: 18, objectFit: 'contain' }}
                />
                {(likes[node.id] || []).length}
              </span>

              <span
                className="action reply"
                onClick={() => uid && setOpen(o => !o)}
                style={{ cursor: uid ? 'pointer' : 'not-allowed', opacity: uid ? 1 : 0.5 }}
                title="Reply"
              >
                {/* <MDBIcon far icon="comment" /> */}
                <img
                  src={CommentIcon}
                  alt=""
                  className="comment-action-icon"
                  style={{ width: 18, height: 18, objectFit: 'contain' }}
                />
                {repliesCount === 1 ? "1 reply" : `${repliesCount} replies`}
              </span>

              {mine && !editing && (
                <>
                  <span className="action edit" onClick={() => setEditing(true)} title="Edit">
                    {/* <MDBIcon fas icon="pen" /> */}
                    <img
                      src={EditIcon}
                      alt=""
                      className="comment-action-icon"
                      style={{ width: 18, height: 18, objectFit: 'contain' }}
                    />
                    edit
                  </span>
                  <span className="action delete" onClick={() => deleteComment(node.id)} title="Delete">
                    <img
                      src={DeleteIcon}
                      alt=""
                      className="comment-action-icon"
                      style={{ width: 18, height: 18, objectFit: 'contain' }}
                    />
                    {/* <MDBIcon fas icon="trash-alt" /> */}
                    delete
                  </span>
                </>
              )}
            </div>

            {/* Inline reply composer */}
           {open && uid && (
              <div className="comment-composer mt-3">
                <input
                  className="form-control comment-input"
                  placeholder="Write a reply…"
                  value={rDraft}
                  onChange={e => setRDraft(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      addComment(rDraft, node.id); setRDraft(""); setOpen(false);
                    }
                  }}
                />
                <button
                  type="button"
                  className="btn-outline-gold-solid"
                  onClick={() => { addComment(rDraft, node.id); setRDraft(""); setOpen(false); }}
                >
                  Reply
                </button>
              </div>
            )}
          </div>
     
          
        </div>

        {/* Replies with thread line */}
        {node.children?.length > 0 && (
          <ul className="comment-children list-unstyled">
            {node.children.map(ch => <Node key={ch.id} node={ch} depth={depth + 1} />)}
          </ul>
        )}
      </li>
    );
  };

  

  // return (
  //   <div>
  //     {uid ? (
  //       <MDBInputGroup className="comment-composer mb-4">
  //         <textarea rows={2} className="form-control comment-input" value={draft} onChange={e => setDraft(e.target.value)} 
  //         onKeyDown={e => {
  //             if (e.key === 'Enter' && !e.shiftKey) {
  //               e.preventDefault();
  //               addComment(draft); setDraft("");
  //             }
  //           }}
  //           placeholder="Help extend the article with your comments" />
  //         <MDBBtn type="button"  className="btn-outline-gold btn-48" onClick={() => { addComment(draft); setDraft(""); }}>Comment</MDBBtn>
  //       </MDBInputGroup>
  //     ) : (
  //       <p className="text-muted fst-italic mb-4">Please log in to post comments.</p>
  //     )}

  //     <ul className="list-unstyled">
  //       {tree.map(n => <Node key={n.id} node={n} depth={0} />)}
  //       <li ref={bottomRef} />
  //     </ul>
  //   </div>
  // );

 return (
    <div>
      {uid ? (
        /* ==== Composer redesigned to match the mock ==== */
        <div className="comment-composer mb-4">
          <input
            className="form-control comment-input"
            type="text"
            placeholder="Help extend the article with your comments"
            value={draft}
            onChange={e => setDraft(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                addComment(draft); setDraft("");
              }
            }}
          />
          <button
            type="button"
            className="btn-outline-gold-solid"
            onClick={() => { addComment(draft); setDraft(""); }}
          >
            Comment
          </button>
        </div>
      ) : (
        <p className="text-muted fst-italic mb-4">Please log in to post comments.</p>
      )}

      <ul className="list-unstyled">
        {tree.map(n => <Node key={n.id} node={n} depth={0} />)}
        <li ref={bottomRef} />
      </ul>
    </div>
  );


}
