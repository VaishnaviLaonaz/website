// // services/articles.js
// import {
//   ref,
//   push,
//   set,
//   update,
//   remove,
//   onValue,
//   query,
//   orderByChild,
//   limitToLast, get, runTransaction
// } from 'firebase/database'
// import { rtdb } from './firebase';

// export function streamAllArticles(callback, limit = 20) {
//   const articlesQuery = query(
//     ref(rtdb, 'articles'),
//     orderByChild('createdAt'),
//     limitToLast(limit)
//   )

//   // onValue returns an unsubscribe function
//   return onValue(articlesQuery, snapshot => {
//     const items = []
//     snapshot.forEach(childSnap => {
//       items.push({ id: childSnap.key, ...childSnap.val() })
//     })
//     // Newest last → reverse so newest first
//     callback(items.reverse())
//   })
// }

// /**
//  * Create a new article.
//  * article should be an object with fields: title, body, authorId, createdAt, updatedAt
//  * Returns { id }
//  */
// export async function createArticle(article) {
//   const listRef = ref(rtdb, 'articles')
//   const newRef = push(listRef)
//   await set(newRef, article)
//   return { id: newRef.key }
// }

// /**
//  * Update an existing article by id.
//  * article must include id + any fields to change (e.g. title, body, updatedAt)
//  */
// export async function updateArticle(id, updates){
//   const artRef = ref(rtdb, `articles/${id}`)
//   await update(artRef, updates)
//   return { id, ...updates }
// }

// /**
//  * Delete an article by id.
//  */
// export async function deleteArticle(id) {
//   await remove(ref(rtdb, `articles/${id}`))
//   return { id }
// }



// /**
//  * Toggle a like by {userId} on article {articleId}.
//  */
// export async function likeArticle(articleId, userId) {
//   const likeRef = ref(rtdb, `articles/${articleId}/likedBy/${userId}`)
//   const snap = await get(likeRef)
//   if (snap.exists()) {
//     // already liked → remove
//     await remove(likeRef)
//   } else {
//     // not yet liked → add
//     await set(likeRef, true)
//   }
// }

// /**
//  * Real-time subscription to the list of likers.
//  * cb receives an array of userIds.
//  */
// export function streamLikes(articleId, cb) {
//   const likesRef = ref(rtdb, `articles/${articleId}/likedBy`)
//   return onValue(likesRef, snap => {
//     const uids = []
//     snap.forEach(child => {
//       uids.push(child.key)
//     })
//     cb(uids)
//   })
// }






// export async function incrementView(articleId, userId = null) {
//   try {
//     // unique view safeguard
//     if (userId) {
//       const flagRef = ref(rtdb, `articles/${articleId}/viewedBy/${userId}`);
//       const flag = await get(flagRef);
//       if (flag.exists()) return;          // already counted
//       await set(flagRef, true);
//     }
//     // atomic counter
//     const viewRef = ref(rtdb, `articles/${articleId}/views`);
//     await runTransaction(viewRef, cur => (cur || 0) + 1);
//   } catch (err) {
//     console.error('incrementView:', err);
//   }
// }

// /** Live subscription to the view counter */
// export function streamViews(articleId, cb) {
//   return onValue(ref(rtdb, `articles/${articleId}/views`), snap =>
//     cb(snap.val() || 0)
//   );
// }

// /* ─────────── Comments ─────────── */




// /** Add a comment under comments/{articleId} */
// export async function addComment(articleId, comment) {
//   const commentsRef = ref(rtdb, `comments/${articleId}`);
//   const newRef = push(commentsRef);
//   await set(newRef, comment);
//   return { id: newRef.key };
// }

// /** Stream all comments under comments/{articleId} */
// export function streamComments(articleId, cb, limit = 100) {
//   if (!articleId) return () => {}; 
//   const commentsQuery = query(
//     ref(rtdb, `comments/${articleId}`),
//     orderByChild('createdAt'),
//     limitToLast(limit)
//   );
//   return onValue(commentsQuery, snap => {
//     const items = [];
//     snap.forEach(child => items.push({ id: child.key, ...child.val() }));
//     cb(items.reverse());
//   });
// }

// /** Update one comment’s fields */
// export async function updateComment(articleId, commentId, updates) {
//   const cRef = ref(rtdb, `comments/${articleId}/${commentId}`);
//   await update(cRef, updates);
//   return { id: commentId, ...updates };
// }

// /** Delete a comment */
// export async function deleteComment(articleId, commentId) {
//   const cRef = ref(rtdb, `comments/${articleId}/${commentId}`);
//   await remove(cRef);
//   return { id: commentId };
// }

// /** Toggle like on a specific comment */
// export async function likeComment(articleId, commentId, userId) {
//   const likeRef = ref(rtdb, `comments/${articleId}/${commentId}/likedBy/${userId}`);
//   const snap = await get(likeRef);
//   if (snap.exists()) {
//     await remove(likeRef);
//   } else {
//     await set(likeRef, true);
//   }
// }

// /** Stream likes for all comments on this article.
//  *  Calls cb with an object: { commentId1: [uid,…], commentId2: […] }
//  */
// export function streamCommentLikes(articleId, cb) {
//   if (!articleId) return () => {}; 
//   const allLikesRef = ref(rtdb, `comments/${articleId}`);
//   // subscribe to all children and their likedBy subtrees
//   return onValue(allLikesRef, snap => {
//     const map = {};
//     snap.forEach(cSnap => {
//       const likedBySnap = cSnap.child('likedBy');
//       const uids = [];
//       likedBySnap.forEach(u => uids.push(u.key));
//       map[cSnap.key] = uids;
//     });
//     cb(map);
//   });
// }


// Correct one is below

// // services/articles.js
// import {
//   ref,
//   push,
//   set,
//   update,
//   remove,
//   onValue,
//   query,
//   orderByChild,
//   limitToLast,
//   get,
//   runTransaction
// } from 'firebase/database';
// import { rtdb } from './firebase';
// /* ─────────── Articles list ─────────── */
// export function streamAllArticles(callback, limit = 20) {
//   const articlesQuery = query(
//     ref(rtdb, 'articles'),
//     orderByChild('createdAt'),
//     limitToLast(limit)
//   );

//   // onValue returns an unsubscribe fn
//   return onValue(articlesQuery, snapshot => {
//     const items = [];
//     snapshot.forEach(childSnap => {
//       items.push({ id: childSnap.key, ...childSnap.val() });
//     });
//     callback(items.reverse());           // newest first
//   });
// }

// /* ─────────── CRUD ─────────── */
// export async function createArticle(article) {
//   const listRef = ref(rtdb, 'articles');
//   const newRef  = push(listRef);
//   await set(newRef, { ...article, views: 0, likesCount: 0, commentsCount: 0, bookmarksCount: 0    });
//   return { id: newRef.key };
// }
// export async function updateArticle(id, updates) {
//   const artRef = ref(rtdb, `articles/${id}`);
//   await update(artRef, updates);
//   return { id, ...updates };
// }
// export async function deleteArticle(id) {
//   await remove(ref(rtdb, `articles/${id}`));
//   return { id };
// }

// /* ─────────── Likes ─────────── */
// export async function likeArticle(articleId, userId) {
//   const likeRef = ref(rtdb, `articles/${articleId}/likedBy/${userId}`);
//   const counter = ref(rtdb, `articles/${articleId}/likesCount`);
//   const snap = await get(likeRef);

//   if (snap.exists()) {
//     // already liked → remove & decrement
//     await remove(likeRef);
//     await runTransaction(counter, cur => Math.max((cur || 1) - 1, 0));
//   } else {
//     // not liked yet → add & increment
//     await set(likeRef, true);
//     await runTransaction(counter, cur => (cur || 0) + 1);
//   }
// }
// export function streamLikes(articleId, cb) {
//   const likesRef = ref(rtdb, `articles/${articleId}/likedBy`);
//   return onValue(likesRef, snap => {
//     const uids = [];
//     snap.forEach(child => uids.push(child.key));
//     cb(uids);
//   });
// }
// export function streamLikeCount(articleId, cb) {
//   return onValue(
//     ref(rtdb, `articles/${articleId}/likesCount`),
//     snap => cb(snap.val() || 0)
//   );
// }
// /* ─────────── Views ─────────── */
// export async function incrementView(articleId, viewerId = null, authorId = null) {
//   try {
//     // skip if author is viewing their own article
//     if (viewerId && authorId && viewerId === authorId) return;

//     // allow multiple views by same user → no unique flag
//     const viewRef = ref(rtdb, `articles/${articleId}/views`);
//     await runTransaction(viewRef, cur => (cur || 0) + 1);
//   } catch (err) {
//     console.error('incrementView:', err);
//   }
// }

// export function streamViews(articleId, cb) {
//   return onValue(ref(rtdb, `articles/${articleId}/views`), snap =>
//     cb(snap.val() || 0)
//   );
// }

// /* ─────────── Comments ─────────── */
// export async function addComment(articleId, comment) {
//   const commentsRef = ref(rtdb, `comments/${articleId}`);
//   const newRef      = push(commentsRef);
//   await set(newRef, comment);
//   // increment atomic counter on the article node
//   const counter = ref(rtdb, `articles/${articleId}/commentsCount`);
//   await runTransaction(counter, cur => (cur || 0) + 1);
//   return { id: newRef.key };
// }


// export function streamComments(articleId, cb, limit = 100) {
//   if (!articleId) return () => {};
//   const commentsQuery = query(
//     ref(rtdb, `comments/${articleId}`),
//     orderByChild('createdAt'),
//     limitToLast(limit)
//   );
//   return onValue(commentsQuery, snap => {
//     const items = [];
//     snap.forEach(child => items.push({ id: child.key, ...child.val() }));
//     cb(items);
//   });
// }

// export async function updateComment(articleId, commentId, updates) {
//   const cRef = ref(rtdb, `comments/${articleId}/${commentId}`);
//   await update(cRef, updates);
//   return { id: commentId, ...updates };
// }

// export async function deleteComment(articleId, commentId) {
//   // remove comment
//   await remove(ref(rtdb, `comments/${articleId}/${commentId}`));
//   // decrement counter
//   const counter = ref(rtdb, `articles/${articleId}/commentsCount`);
//   await runTransaction(counter, cur => Math.max((cur || 1) - 1, 0));
//   return { id: commentId };
// }
// /* tiny helper so UI can listen only to the number */
// export function streamCommentCount(articleId, cb) {
//   return onValue(ref(rtdb, `articles/${articleId}/commentsCount`), snap =>
//     cb(snap.val() || 0)
//   );
// }

// /* ─────────── Comment likes (unchanged) ─────────── */
// // export async function likeComment(articleId, commentId, userId) {
// //   const likeRef = ref(
// //     rtdb,
// //     comments/${articleId}/${commentId}/likedBy/${userId}
// //   );
// //   const snap = await get(likeRef);
// //   if (snap.exists()) {
// //     await remove(likeRef);
// //   } else {
// //     await set(likeRef, true);
// //   }
// // }
// export async function likeComment(aId, cId, uId) {
//   const lRef = ref(rtdb, `comments/${aId}/${cId}/likedBy/${uId}`);
//   (await get(lRef)).exists() ? remove(lRef) : set(lRef, true);
// }
// // export function streamCommentLikes(articleId, cb) {
// //   if (!articleId) return () => {};
// //   const allLikesRef = ref(rtdb, comments/${articleId});
// //   return onValue(allLikesRef, snap => {
// //     const map = {};
// //     snap.forEach(cSnap => {
// //       const uids = [];
// //       cSnap.child('likedBy').forEach(u => uids.push(u.key));
// //       map[cSnap.key] = uids;
// //     });
// //     cb(map);
// //   });
// // }

// export const streamCommentLikes = (aId, cb) => {
//   if (!aId) return () => {};
//   return onValue(ref(rtdb, `comments/${aId}`), s => {
//     const map = {};
//     s.forEach(c => {
//       const u = []; c.child('likedBy').forEach(x => u.push(x.key));
//       map[c.key] = u;
//     });
//     cb(map);
//   });
// };




// // services/articles.js  ← keep existing imports & code above

// /* ─────────── NEW: Bookmarks ─────────── */
// // export async function toggleBookmark(articleId, userId) {
// //   const bRef = ref(rtdb, `articles/${articleId}/bookmarkedBy/${userId}`);
// //   const counterRef = ref(rtdb, `articles/${articleId}/bookmarksCount`);
// //   const snap = await get(bRef);

// //   if (snap.exists()) {
// //     await remove(bRef);
// //     await runTransaction(counterRef, cur => Math.max((cur || 1) - 1, 0));
// //   } else {
// //     await set(bRef, true);
// //     await runTransaction(counterRef, cur => (cur || 0) + 1);
// //   }
// // }
// // /** live list of bookmarker uids */
// // export function streamBookmarks(articleId, cb) {
// //   const bRef = ref(rtdb, `articles/${articleId}/bookmarkedBy`);
// //   return onValue(bRef, snap => {
// //     const uids = [];
// //     snap.forEach(c => uids.push(c.key));
// //     cb(uids);
// //   });
// // }


// export async function toggleBookmark(articleId, userId) {
//   const artPath = `articles/${articleId}/bookmarkedBy/${userId}`;
//   const userPath = `userBookmarks/${userId}/${articleId}`;
//   const counterRef = ref(rtdb, `articles/${articleId}/bookmarksCount`);

//   const artRef = ref(rtdb, artPath);
//   const userRef = ref(rtdb, userPath);

//   const already = (await get(artRef)).exists();

//   if (already) {
//     await Promise.all([
//       remove(artRef),
//       remove(userRef),
//       runTransaction(counterRef, (cur) => Math.max((cur || 1) - 1, 0)),
//     ]);
//   } else {
//     await Promise.all([
//       set(artRef, true),
//       set(userRef, true),
//       runTransaction(counterRef, (cur) => (cur || 0) + 1),
//     ]);
//   }
// }

// /** Live list of *user IDs* who have bookmarked a given article */
// export function streamBookmarks(articleId, cb) {
//   const bRef = ref(rtdb, `articles/${articleId}/bookmarkedBy`);
//   return onValue(bRef, (snap) => {
//     const uids = [];
//     snap.forEach((c) => uids.push(c.key));
//     cb(uids);
//   });
// }

// /** Live list of *article IDs* that the current user has bookmarked */
// export function streamMyBookmarks(userId, cb) {
//   if (!userId) return () => {};
//   const uRef = ref(rtdb, `userBookmarks/${userId}`);
//   return onValue(uRef, (snap) => {
//     const ids = [];
//     snap.forEach((c) => ids.push(c.key));
//     cb(ids);
//   });
// }

// export function streamBookmarkCount(articleId, cb) {
//     return onValue(
//       ref(rtdb, `articles/${articleId}/bookmarksCount`),
//       snap => cb(snap.val() || 0)
//     );
//   }

  







//notifiaction 

// // configs/articles.js
// import {
//   ref,
//   push,
//   set,
//   update,
//   remove,
//   onValue,
//   query,
//   orderByChild,
//   limitToLast,
//   get,
//   runTransaction
// } from 'firebase/database';
// import { rtdb } from './firebase';

// import { db } from './firebase';
// import { doc, getDoc } from 'firebase/firestore';
// import { addNotification } from './notifications';
// /* ─────────── Articles list ─────────── */
// export function streamAllArticles(callback, limit = 20) {
//   const articlesQuery = query(
//     ref(rtdb, 'articles'),
//     orderByChild('createdAt'),
//     limitToLast(limit)
//   );

//   // onValue returns an unsubscribe fn
//   return onValue(articlesQuery, snapshot => {
//     const items = [];
//     snapshot.forEach(childSnap => {
//       items.push({ id: childSnap.key, ...childSnap.val() });
//     });
//     callback(items.reverse());           // newest first
//   });
// }

// /* ─────────── CRUD ─────────── */
// export async function createArticle(article) {
//   const listRef = ref(rtdb, 'articles');
//   const newRef  = push(listRef);
//   await set(newRef, { ...article, views: 0, likesCount: 0, commentsCount: 0, bookmarksCount: 0    });
//   return { id: newRef.key };
// }
// export async function updateArticle(id, updates) {
//   const artRef = ref(rtdb, `articles/${id}`);
//   await update(artRef, updates);
//   return { id, ...updates };
// }
// export async function deleteArticle(id) {
//   await remove(ref(rtdb, `articles/${id}`));
//   return { id };
// }

// /* ─────────── Likes ─────────── */
// export async function likeArticle(articleId, userId) {
//   const likeRef = ref(rtdb, `articles/${articleId}/likedBy/${userId}`);
//   const counter = ref(rtdb, `articles/${articleId}/likesCount`);
//   const snap = await get(likeRef);

//   if (snap.exists()) {
//     // already liked → remove & decrement
//     await remove(likeRef);
//     await runTransaction(counter, cur => Math.max((cur || 1) - 1, 0));
//   } else {
//     // not liked yet → add & increment
//     await set(likeRef, true);
//     await runTransaction(counter, cur => (cur || 0) + 1);

//      const artSnap = await get(ref(rtdb, `articles/${articleId}`));
//       const article = artSnap.val();
//       if (article && article.authorId !== userId) {
//         const actor = (await getDoc(doc(db, 'users', userId))).data() || {};
//         await addNotification(article.authorId, {
//           type        : 'like',
//           actorId     : userId,
//           actorName   : actor.username ||
//                         [actor.firstName, actor.lastName].filter(Boolean).join(' ') ||
//                         actor.email || 'Someone',
//           actorAvatar : actor.avatarUrl || '',
//           articleId,
//           articleTitle: article.title || ''
//         });
//       }

//   }
// }
// export function streamLikes(articleId, cb) {
//   const likesRef = ref(rtdb, `articles/${articleId}/likedBy`);
//   return onValue(likesRef, snap => {
//     const uids = [];
//     snap.forEach(child => uids.push(child.key));
//     cb(uids);
//   });
// }
// export function streamLikeCount(articleId, cb) {
//   return onValue(
//     ref(rtdb, `articles/${articleId}/likesCount`),
//     snap => cb(snap.val() || 0)
//   );
// }
// /* ─────────── Views ─────────── */
// export async function incrementView(articleId, viewerId = null, authorId = null) {
//   try {
//     // skip if author is viewing their own article
//     if (viewerId && authorId && viewerId === authorId) return;

//     // allow multiple views by same user → no unique flag
//     const viewRef = ref(rtdb, `articles/${articleId}/views`);
//     await runTransaction(viewRef, cur => (cur || 0) + 1);
//   } catch (err) {
//     console.error('incrementView:', err);
//   }
// }

// export function streamViews(articleId, cb) {
//   return onValue(ref(rtdb, `articles/${articleId}/views`), snap =>
//     cb(snap.val() || 0)
//   );
// }

// /* ─────────── Comments ─────────── */
// export async function addComment(articleId, comment) {
//   const commentsRef = ref(rtdb, `comments/${articleId}`);
//   const newRef      = push(commentsRef);
//   await set(newRef, comment);
//   // increment atomic counter on the article node
//   const counter = ref(rtdb, `articles/${articleId}/commentsCount`);
//   await runTransaction(counter, cur => (cur || 0) + 1);

//   {
//           const artSnap = await get(ref(rtdb, `articles/${articleId}`));
//           const article = artSnap.val();
//           if (article && article.authorId !== comment.uid) {
//             const actorSnap = await getDoc(doc(db, 'users', comment.uid));
//             const actor     = actorSnap.data() || {};
//             await addNotification(article.authorId, {
//               type        : 'comment',
//               actorId     : comment.uid,
//               actorName   : actor.username ||
//                             [actor.firstName, actor.lastName].filter(Boolean).join(' ') ||
//                             actor.email || 'Someone',
//               actorAvatar : actor.avatarUrl || '',
//               articleId,
//               articleTitle: article.title || ''
//             });
//           }
//         }
//   if (comment.parentId) {
//       const parentSnap = await get(
//         ref(rtdb, `comments/${articleId}/${comment.parentId}`)
//       );
//       const parent = parentSnap.val();
//       if (parent && parent.uid !== comment.uid) {
//         const actor = (await getDoc(doc(db, 'users', comment.uid))).data() || {};
//         await addNotification(parent.uid, {
//           type       : 'comment-reply',
//           actorId    : comment.uid,
//           actorName  : actor.username ||
//                        [actor.firstName, actor.lastName].filter(Boolean).join(' ') ||
//                        actor.email || 'Someone',
//           actorAvatar: actor.avatarUrl || '',
//           articleId  : articleId,
//           commentId  : comment.parentId
//         });
//       }
//     }

//   return { id: newRef.key };
// }


// export function streamComments(articleId, cb, limit = 100) {
//   if (!articleId) return () => {};
//   const commentsQuery = query(
//     ref(rtdb, `comments/${articleId}`),
//     orderByChild('createdAt'),
//     limitToLast(limit)
//   );
//   return onValue(commentsQuery, snap => {
//     const items = [];
//     snap.forEach(child => items.push({ id: child.key, ...child.val() }));
//     cb(items);
//   });
// }

// export async function updateComment(articleId, commentId, updates) {
//   const cRef = ref(rtdb, `comments/${articleId}/${commentId}`);
//   await update(cRef, updates);
//   return { id: commentId, ...updates };
// }

// export async function deleteComment(articleId, commentId) {
//   // remove comment
//   await remove(ref(rtdb, `comments/${articleId}/${commentId}`));
//   // decrement counter
//   const counter = ref(rtdb, `articles/${articleId}/commentsCount`);
//   await runTransaction(counter, cur => Math.max((cur || 1) - 1, 0));
//   return { id: commentId };
// }
// /* tiny helper so UI can listen only to the number */
// export function streamCommentCount(articleId, cb) {
//   return onValue(ref(rtdb, `articles/${articleId}/commentsCount`), snap =>
//     cb(snap.val() || 0)
//   );
// }

// /* ─────────── Comment likes (unchanged) ─────────── */
// // export async function likeComment(articleId, commentId, userId) {
// //   const likeRef = ref(
// //     rtdb,
// //     comments/${articleId}/${commentId}/likedBy/${userId}
// //   );
// //   const snap = await get(likeRef);
// //   if (snap.exists()) {
// //     await remove(likeRef);
// //   } else {
// //     await set(likeRef, true);
// //   }
// // }
// export async function likeComment(aId, cId, uId) {
//   const lRef = ref(rtdb, `comments/${aId}/${cId}/likedBy/${uId}`);
//   (await get(lRef)).exists() ? remove(lRef) : set(lRef, true);
// }
// // export function streamCommentLikes(articleId, cb) {
// //   if (!articleId) return () => {};
// //   const allLikesRef = ref(rtdb, comments/${articleId});
// //   return onValue(allLikesRef, snap => {
// //     const map = {};
// //     snap.forEach(cSnap => {
// //       const uids = [];
// //       cSnap.child('likedBy').forEach(u => uids.push(u.key));
// //       map[cSnap.key] = uids;
// //     });
// //     cb(map);
// //   });
// // }

// export const streamCommentLikes = (aId, cb) => {
//   if (!aId) return () => {};
//   return onValue(ref(rtdb, `comments/${aId}`), s => {
//     const map = {};
//     s.forEach(c => {
//       const u = []; c.child('likedBy').forEach(x => u.push(x.key));
//       map[c.key] = u;
//     });
//     cb(map);
//   });
// };




// // services/articles.js  ← keep existing imports & code above

// /* ─────────── NEW: Bookmarks ─────────── */
// // export async function toggleBookmark(articleId, userId) {
// //   const bRef = ref(rtdb, `articles/${articleId}/bookmarkedBy/${userId}`);
// //   const counterRef = ref(rtdb, `articles/${articleId}/bookmarksCount`);
// //   const snap = await get(bRef);

// //   if (snap.exists()) {
// //     await remove(bRef);
// //     await runTransaction(counterRef, cur => Math.max((cur || 1) - 1, 0));
// //   } else {
// //     await set(bRef, true);
// //     await runTransaction(counterRef, cur => (cur || 0) + 1);
// //   }
// // }
// // /** live list of bookmarker uids */
// // export function streamBookmarks(articleId, cb) {
// //   const bRef = ref(rtdb, `articles/${articleId}/bookmarkedBy`);
// //   return onValue(bRef, snap => {
// //     const uids = [];
// //     snap.forEach(c => uids.push(c.key));
// //     cb(uids);
// //   });
// // }


// export async function toggleBookmark(articleId, userId) {
//   const artPath = `articles/${articleId}/bookmarkedBy/${userId}`;
//   const userPath = `userBookmarks/${userId}/${articleId}`;
//   const counterRef = ref(rtdb, `articles/${articleId}/bookmarksCount`);

//   const artRef = ref(rtdb, artPath);
//   const userRef = ref(rtdb, userPath);

//   const already = (await get(artRef)).exists();

//   if (already) {
//     await Promise.all([
//       remove(artRef),
//       remove(userRef),
//       runTransaction(counterRef, (cur) => Math.max((cur || 1) - 1, 0)),
//     ]);
//   } else {
//     await Promise.all([
//       set(artRef, true),
//       set(userRef, true),
//       runTransaction(counterRef, (cur) => (cur || 0) + 1),
//     ]);
//   }
// }

// /** Live list of *user IDs* who have bookmarked a given article */
// export function streamBookmarks(articleId, cb) {
//   const bRef = ref(rtdb, `articles/${articleId}/bookmarkedBy`);
//   return onValue(bRef, (snap) => {
//     const uids = [];
//     snap.forEach((c) => uids.push(c.key));
//     cb(uids);
//   });
// }

// /** Live list of *article IDs* that the current user has bookmarked */
// export function streamMyBookmarks(userId, cb) {
//   if (!userId) return () => {};
//   const uRef = ref(rtdb, `userBookmarks/${userId}`);
//   return onValue(uRef, (snap) => {
//     const ids = [];
//     snap.forEach((c) => ids.push(c.key));
//     cb(ids);
//   });
// }

// export function streamBookmarkCount(articleId, cb) {
//     return onValue(
//       ref(rtdb, `articles/${articleId}/bookmarksCount`),
//       snap => cb(snap.val() || 0)
//     );
//   }

  










// // src/configs/articles.js
// import {
//   ref,
//   push,
//   set,
//   update,
//   remove,
//   onValue,
//   query,
//   orderByChild,
//   limitToLast,
//   get,
//   runTransaction,
// } from 'firebase/database';
// import { rtdb } from './firebase';

// import { db } from './firebase';
// import { doc, getDoc } from 'firebase/firestore';
// import { tryNotify } from './notifications';

// /* ─────────── Articles list ─────────── */
// export function streamAllArticles(callback, limit = 20) {
//   const articlesQuery = query(
//     ref(rtdb, 'articles'),
//     orderByChild('createdAt'),
//     limitToLast(limit)
//   );

//   return onValue(articlesQuery, (snapshot) => {
//     const items = [];
//     snapshot.forEach((childSnap) => {
//       items.push({ id: childSnap.key, ...childSnap.val() });
//     });
//     callback(items.reverse()); // newest first
//   });
// }

// /* ─────────── CRUD ─────────── */
// export async function createArticle(article) {
//   const listRef = ref(rtdb, 'articles');
//   const newRef = push(listRef);
//   await set(newRef, {
//     ...article,
//     views: 0,
//     likesCount: 0,
//     commentsCount: 0,
//     bookmarksCount: 0,
//   });
//   return { id: newRef.key };
// }
// export async function updateArticle(id, updates) {
//   const artRef = ref(rtdb, `articles/${id}`);
//   await update(artRef, updates);
//   return { id, ...updates };
// }
// export async function deleteArticle(id) {
//   await remove(ref(rtdb, `articles/${id}`));
//   return { id };
// }

// /* ─────────── Likes ─────────── */
// export async function likeArticle(articleId, userId) {
//   const likeRef = ref(rtdb, `articles/${articleId}/likedBy/${userId}`);
//   const counter = ref(rtdb, `articles/${articleId}/likesCount`);
//   const snap = await get(likeRef);

//   if (snap.exists()) {
//     await remove(likeRef);
//     await runTransaction(counter, (cur) => Math.max((cur || 1) - 1, 0));
//   } else {
//     await set(likeRef, true);
//     await runTransaction(counter, (cur) => (cur || 0) + 1);

//     const artSnap = await get(ref(rtdb, `articles/${articleId}`));
//     const article = artSnap.val();
//     if (article && article.authorId !== userId) {
//       const actor =
//         (await getDoc(doc(db, 'users', userId))).data() || {};
//       tryNotify(article.authorId, {
//         type: 'like',
//         actorId: userId,
//         actorName:
//           actor.username ||
//           [actor.firstName, actor.lastName].filter(Boolean).join(' ') ||
//           actor.email ||
//           'Someone',
//         actorAvatar: actor.avatarUrl || '',
//         articleId,
//         articleTitle: article.title || '',
//       });
//     }
//   }
// }
// export function streamLikes(articleId, cb) {
//   const likesRef = ref(rtdb, `articles/${articleId}/likedBy`);
//   return onValue(likesRef, (snap) => {
//     const uids = [];
//     snap.forEach((child) => uids.push(child.key));
//     cb(uids);
//   });
// }
// export function streamLikeCount(articleId, cb) {
//   return onValue(
//     ref(rtdb, `articles/${articleId}/likesCount`),
//     (snap) => cb(snap.val() || 0)
//   );
// }

// /* ─────────── Views ─────────── */
// export async function incrementView(
//   articleId,
//   viewerId = null,
//   authorId = null
// ) {
//   try {
//     if (viewerId && authorId && viewerId === authorId) return;
//     const viewRef = ref(rtdb, `articles/${articleId}/views`);
//     await runTransaction(viewRef, (cur) => (cur || 0) + 1);
//   } catch (err) {
//     console.error('incrementView:', err);
//   }
// }
// export function streamViews(articleId, cb) {
//   return onValue(ref(rtdb, `articles/${articleId}/views`), (snap) =>
//     cb(snap.val() || 0)
//   );
// }

// /* ─────────── Comments ─────────── */
// export async function addComment(articleId, comment) {
//   const commentsRef = ref(rtdb, `comments/${articleId}`);
//   const newRef = push(commentsRef);
//   await set(newRef, comment);

//   const counter = ref(rtdb, `articles/${articleId}/commentsCount`);
//   await runTransaction(counter, (cur) => (cur || 0) + 1);

//   /* --- notify article author (top-level comment) --- */
//   {
//     const artSnap = await get(ref(rtdb, `articles/${articleId}`));
//     const article = artSnap.val();
//     if (article && article.authorId !== comment.uid) {
//       const actor =
//         (await getDoc(doc(db, 'users', comment.uid))).data() || {};
//       tryNotify(article.authorId, {
//         type: 'comment',
//         actorId: comment.uid,
//         actorName:
//           actor.username ||
//           [actor.firstName, actor.lastName].filter(Boolean).join(' ') ||
//           actor.email ||
//           'Someone',
//         actorAvatar: actor.avatarUrl || '',
//         articleId,
//         articleTitle: article.title || '',
//       });
//     }
//   }

//   /* --- notify parent comment author (reply) --- */
//   if (comment.parentId) {
//     const parentSnap = await get(
//       ref(rtdb, `comments/${articleId}/${comment.parentId}`)
//     );
//     const parent = parentSnap.val();
//     if (parent && parent.uid !== comment.uid) {
//       const actor =
//         (await getDoc(doc(db, 'users', comment.uid))).data() || {};
//       tryNotify(parent.uid, {
//         type: 'comment-reply',
//         actorId: comment.uid,
//         actorName:
//           actor.username ||
//           [actor.firstName, actor.lastName].filter(Boolean).join(' ') ||
//           actor.email ||
//           'Someone',
//         actorAvatar: actor.avatarUrl || '',
//         articleId,
//         commentId: comment.parentId,
//       });
//     }
//   }

//   return { id: newRef.key };
// }
// export function streamComments(articleId, cb, limit = 100) {
//   if (!articleId) return () => {};
//   const commentsQuery = query(
//     ref(rtdb, `comments/${articleId}`),
//     orderByChild('createdAt'),
//     limitToLast(limit)
//   );
//   return onValue(commentsQuery, (snap) => {
//     const items = [];
//     snap.forEach((child) =>
//       items.push({ id: child.key, ...child.val() })
//     );
//     cb(items);
//   });
// }
// export async function updateComment(articleId, commentId, updates) {
//   const cRef = ref(rtdb, `comments/${articleId}/${commentId}`);
//   await update(cRef, updates);
//   return { id: commentId, ...updates };
// }
// export async function deleteComment(articleId, commentId) {
//   await remove(ref(rtdb, `comments/${articleId}/${commentId}`));
//   const counter = ref(rtdb, `articles/${articleId}/commentsCount`);
//   await runTransaction(counter, (cur) => Math.max((cur || 1) - 1, 0));
//   return { id: commentId };
// }
// export function streamCommentCount(articleId, cb) {
//   return onValue(
//     ref(rtdb, `articles/${articleId}/commentsCount`),
//     (snap) => cb(snap.val() || 0)
//   );
// }

// /* ─────────── Comment likes  (✨ notification added) ─────────── */
// export async function likeComment(articleId, commentId, userId) {
//   const likeRef = ref(
//     rtdb,
//     `comments/${articleId}/${commentId}/likedBy/${userId}`
//   );
//   const already = (await get(likeRef)).exists();

//   if (already) {
//     await remove(likeRef);
//   } else {
//     await set(likeRef, true);

//     /* ----- notify comment author & (optionally) article author ----- */
//     const [cSnap, aSnap] = await Promise.all([
//       get(ref(rtdb, `comments/${articleId}/${commentId}`)),
//       get(ref(rtdb, `articles/${articleId}`)),
//     ]);
//     const comment = cSnap.val();
//     const article = aSnap.val();
//     if (!comment) return; // should never happen

//     const actor =
//       (await getDoc(doc(db, 'users', userId))).data() || {};

//     const payload = {
//       type: 'comment-like',
//       actorId: userId,
//       actorName:
//         actor.username ||
//         [actor.firstName, actor.lastName].filter(Boolean).join(' ') ||
//         actor.email ||
//         'Someone',
//       actorAvatar: actor.avatarUrl || '',
//       articleId,
//       commentId,
//     };

//     if (comment.uid && comment.uid !== userId) {
//       tryNotify(comment.uid, payload);
//     }

//     if (
//       article &&
//       article.authorId &&
//       article.authorId !== userId &&
//       article.authorId !== comment.uid
//     ) {
//       tryNotify(article.authorId, payload);
//     }
//   }

// }
// export const streamCommentLikes = (aId, cb) => {
//   if (!aId) return () => {};
//   return onValue(ref(rtdb, `comments/${aId}`), (s) => {
//     const map = {};
//     s.forEach((c) => {
//       const u = [];
//       c.child('likedBy').forEach((x) => u.push(x.key));
//       map[c.key] = u;
//     });
//     cb(map);
//   });
// };

// /* ─────────── Bookmarks (unchanged) ─────────── */
// /* keep your existing toggleBookmark / bookmark streams here */



// // services/articles.js  ← keep existing imports & code above

// /* ─────────── NEW: Bookmarks ─────────── */
// // export async function toggleBookmark(articleId, userId) {
// //   const bRef = ref(rtdb, `articles/${articleId}/bookmarkedBy/${userId}`);
// //   const counterRef = ref(rtdb, `articles/${articleId}/bookmarksCount`);
// //   const snap = await get(bRef);

// //   if (snap.exists()) {
// //     await remove(bRef);
// //     await runTransaction(counterRef, cur => Math.max((cur || 1) - 1, 0));
// //   } else {
// //     await set(bRef, true);
// //     await runTransaction(counterRef, cur => (cur || 0) + 1);
// //   }
// // }
// // /** live list of bookmarker uids */
// // export function streamBookmarks(articleId, cb) {
// //   const bRef = ref(rtdb, `articles/${articleId}/bookmarkedBy`);
// //   return onValue(bRef, snap => {
// //     const uids = [];
// //     snap.forEach(c => uids.push(c.key));
// //     cb(uids);
// //   });
// // }


// export async function toggleBookmark(articleId, userId) {
//   const artPath = `articles/${articleId}/bookmarkedBy/${userId}`;
//   const userPath = `userBookmarks/${userId}/${articleId}`;
//   const counterRef = ref(rtdb, `articles/${articleId}/bookmarksCount`);

//   const artRef = ref(rtdb, artPath);
//   const userRef = ref(rtdb, userPath);

//   const already = (await get(artRef)).exists();

//   if (already) {
//     await Promise.all([
//       remove(artRef),
//       remove(userRef),
//       runTransaction(counterRef, (cur) => Math.max((cur || 1) - 1, 0)),
//     ]);
//   } else {
//     await Promise.all([
//       set(artRef, true),
//       set(userRef, true),
//       runTransaction(counterRef, (cur) => (cur || 0) + 1),
//     ]);
//   }
// }

// /** Live list of *user IDs* who have bookmarked a given article */
// export function streamBookmarks(articleId, cb) {
//   const bRef = ref(rtdb, `articles/${articleId}/bookmarkedBy`);
//   return onValue(bRef, (snap) => {
//     const uids = [];
//     snap.forEach((c) => uids.push(c.key));
//     cb(uids);
//   });
// }

// /** Live list of *article IDs* that the current user has bookmarked */
// export function streamMyBookmarks(userId, cb) {
//   if (!userId) return () => {};
//   const uRef = ref(rtdb, `userBookmarks/${userId}`);
//   return onValue(uRef, (snap) => {
//     const ids = [];
//     snap.forEach((c) => ids.push(c.key));
//     cb(ids);
//   });
// }

// export function streamBookmarkCount(articleId, cb) {
//     return onValue(
//       ref(rtdb, `articles/${articleId}/bookmarksCount`),
//       snap => cb(snap.val() || 0)
//     );
//   }

  





// src/configs/articles.js
import {
  ref,
  push,
  set,
  update,
  remove,
  onValue,
  query,
  orderByChild,
  limitToLast,
  get,
  runTransaction,
} from 'firebase/database';
import { rtdb } from './firebase';

import { db } from './firebase';
import { doc, getDoc } from 'firebase/firestore';
import { tryNotify, notifyAllUsersArticlePublish } from './notifications';

/* ─────────── Articles list ─────────── */
export function streamAllArticles(callback, limit = 20) {
  const articlesQuery = query(
    ref(rtdb, 'articles'),
    orderByChild('createdAt'),
    limitToLast(limit)
  );

  return onValue(articlesQuery, (snapshot) => {
    const items = [];
    snapshot.forEach((childSnap) => {
      items.push({ id: childSnap.key, ...childSnap.val() });
    });
    callback(items.reverse()); // newest first
  });
}

/* ─────────── CRUD ─────────── */
export async function createArticle(article) {
  const listRef = ref(rtdb, 'articles');
  const newRef = push(listRef);
  await set(newRef, {
    ...article,
    views: 0,
    likesCount: 0,
    commentsCount: 0,
    bookmarksCount: 0,
  });
  if (article.authorId && article.title) {
    notifyAllUsersArticlePublish(
      article.authorId,
      newRef.key,
      article.title
    );
  }
  return { id: newRef.key };
}
export async function updateArticle(id, updates) {
  const artRef = ref(rtdb, `articles/${id}`);
  await update(artRef, updates);
  return { id, ...updates };
}
export async function deleteArticle(id) {
  await remove(ref(rtdb, `articles/${id}`));
  return { id };
}

/* ---------- Drafts (per user, same shape) ---------- */
export function streamMyDrafts(uid, cb, limit = 100) {
  if (!uid) return () => {};
  const q = query(ref(rtdb, `drafts/${uid}`), orderByChild('createdAt'), limitToLast(limit));
  return onValue(q, (snap) => {
    const items = [];
    snap.forEach((c) => items.push({ id: c.key, ...c.val() }));
    cb(items.reverse());
  });
}
export async function getDraftOnce(uid, draftId) {
  const s = await get(ref(rtdb, `drafts/${uid}/${draftId}`));
  return s.exists() ? s.val() : null;
}
export async function createDraft(uid, draftPayload) {
  const newRef = push(ref(rtdb, `drafts/${uid}`));
  await set(newRef, draftPayload);
  return { id: newRef.key };
}
export async function updateDraft(uid, draftId, updates) {
  await update(ref(rtdb, `drafts/${uid}/${draftId}`), updates);
  return { id: draftId, ...updates };
}
export async function deleteDraft(uid, draftId) {
  await remove(ref(rtdb, `drafts/${uid}/${draftId}`));
  return { id: draftId };
}

/* ─────────── Likes ─────────── */
export async function likeArticle(articleId, userId) {
  const likeRef = ref(rtdb, `articles/${articleId}/likedBy/${userId}`);
  const counter = ref(rtdb, `articles/${articleId}/likesCount`);
  const snap = await get(likeRef);

  if (snap.exists()) {
    await remove(likeRef);
    await runTransaction(counter, (cur) => Math.max((cur || 1) - 1, 0));
  } else {
    await set(likeRef, true);
    await runTransaction(counter, (cur) => (cur || 0) + 1);

    const artSnap = await get(ref(rtdb, `articles/${articleId}`));
    const article = artSnap.val();
    if (article && article.authorId !== userId) {
      const actor =
        (await getDoc(doc(db, 'users', userId))).data() || {};
      tryNotify(article.authorId, {
        type: 'like',
        actorId: userId,
        actorName:
          actor.username ||
          [actor.firstName, actor.lastName].filter(Boolean).join(' ') ||
          actor.email ||
          'Someone',
        actorAvatar: actor.avatarUrl || '',
        articleId,
        articleTitle: article.title || '',
      });
    }
  }
}
export function streamLikes(articleId, cb) {
  const likesRef = ref(rtdb, `articles/${articleId}/likedBy`);
  return onValue(likesRef, (snap) => {
    const uids = [];
    snap.forEach((child) => uids.push(child.key));
    cb(uids);
  });
}
export function streamLikeCount(articleId, cb) {
  return onValue(
    ref(rtdb, `articles/${articleId}/likesCount`),
    (snap) => cb(snap.val() || 0)
  );
}

/* ─────────── Views ─────────── */
export async function incrementView(
  articleId,
  viewerId = null,
  authorId = null
) {
  try {
    // if (viewerId && authorId && viewerId === authorId) return;
    const viewRef = ref(rtdb, `articles/${articleId}/views`);
    await runTransaction(viewRef, (cur) => (cur || 0) + 1);
  } catch (err) {
    console.error('incrementView:', err);
  }
}
export function streamViews(articleId, cb) {
  return onValue(ref(rtdb, `articles/${articleId}/views`), (snap) =>
    cb(snap.val() || 0)
  );
}

/* ─────────── Comments ─────────── */
export async function addComment(articleId, comment) {
  const commentsRef = ref(rtdb, `comments/${articleId}`);
  const newRef = push(commentsRef);
  await set(newRef, comment);

  const counter = ref(rtdb, `articles/${articleId}/commentsCount`);
  await runTransaction(counter, (cur) => (cur || 0) + 1);

  /* --- notify article author (top-level comment) --- */
  {
    const artSnap = await get(ref(rtdb, `articles/${articleId}`));
    const article = artSnap.val();
    if (article && article.authorId !== comment.uid) {
      const actor =
        (await getDoc(doc(db, 'users', comment.uid))).data() || {};
      tryNotify(article.authorId, {
        type: 'comment',
        actorId: comment.uid,
        actorName:
          actor.username ||
          [actor.firstName, actor.lastName].filter(Boolean).join(' ') ||
          actor.email ||
          'Someone',
        actorAvatar: actor.avatarUrl || '',
        articleId,
        articleTitle: article.title || '',
      });
    }
  }

  /* --- notify parent comment author (reply) --- */
  if (comment.parentId) {
    const parentSnap = await get(
      ref(rtdb, `comments/${articleId}/${comment.parentId}`)
    );
    const parent = parentSnap.val();
    if (parent && parent.uid !== comment.uid) {
      const actor =
        (await getDoc(doc(db, 'users', comment.uid))).data() || {};
      tryNotify(parent.uid, {
        type: 'comment-reply',
        actorId: comment.uid,
        actorName:
          actor.username ||
          [actor.firstName, actor.lastName].filter(Boolean).join(' ') ||
          actor.email ||
          'Someone',
        actorAvatar: actor.avatarUrl || '',
        articleId,
        commentId: comment.parentId,
      });
    }
  }

  return { id: newRef.key };
}
export function streamComments(articleId, cb, limit = 100) {
  if (!articleId) return () => {};
  const commentsQuery = query(
    ref(rtdb, `comments/${articleId}`),
    orderByChild('createdAt'),
    limitToLast(limit)
  );
  return onValue(commentsQuery, (snap) => {
    const items = [];
    snap.forEach((child) =>
      items.push({ id: child.key, ...child.val() })
    );
    cb(items);
  });
}
export async function updateComment(articleId, commentId, updates) {
  const cRef = ref(rtdb, `comments/${articleId}/${commentId}`);
  await update(cRef, updates);
  return { id: commentId, ...updates };
}
export async function deleteComment(articleId, commentId) {
  await remove(ref(rtdb, `comments/${articleId}/${commentId}`));
  const counter = ref(rtdb, `articles/${articleId}/commentsCount`);
  await runTransaction(counter, (cur) => Math.max((cur || 1) - 1, 0));
  return { id: commentId };
}
export function streamCommentCount(articleId, cb) {
  return onValue(
    ref(rtdb, `articles/${articleId}/commentsCount`),
    (snap) => cb(snap.val() || 0)
  );
}

/* ─────────── Comment likes  (✨ notification added) ─────────── */
export async function likeComment(articleId, commentId, userId) {
  const likeRef = ref(
    rtdb,
    `comments/${articleId}/${commentId}/likedBy/${userId}`
  );
  const already = (await get(likeRef)).exists();

  if (already) {
    await remove(likeRef);
  } else {
    await set(likeRef, true);

    /* ----- notify comment author & (optionally) article author ----- */
    const [cSnap, aSnap] = await Promise.all([
      get(ref(rtdb, `comments/${articleId}/${commentId}`)),
      get(ref(rtdb, `articles/${articleId}`)),
    ]);
    const comment = cSnap.val();
    const article = aSnap.val();
    if (!comment) return; // should never happen

    const actor =
      (await getDoc(doc(db, 'users', userId))).data() || {};

    const payload = {
      type: 'comment-like',
      actorId: userId,
      actorName:
        actor.username ||
        [actor.firstName, actor.lastName].filter(Boolean).join(' ') ||
        actor.email ||
        'Someone',
      actorAvatar: actor.avatarUrl || '',
      articleId,
      commentId,
    };

    if (comment.uid && comment.uid !== userId) {
      tryNotify(comment.uid, payload);
    }

    if (
      article &&
      article.authorId &&
      article.authorId !== userId &&
      article.authorId !== comment.uid
    ) {
      tryNotify(article.authorId, payload);
    }
  }

}
export const streamCommentLikes = (aId, cb) => {
  if (!aId) return () => {};
  return onValue(ref(rtdb, `comments/${aId}`), (s) => {
    const map = {};
    s.forEach((c) => {
      const u = [];
      c.child('likedBy').forEach((x) => u.push(x.key));
      map[c.key] = u;
    });
    cb(map);
  });
};

/* ─────────── Bookmarks (unchanged) ─────────── */
/* keep your existing toggleBookmark / bookmark streams here */



// services/articles.js  ← keep existing imports & code above

/* ─────────── NEW: Bookmarks ─────────── */
// export async function toggleBookmark(articleId, userId) {
//   const bRef = ref(rtdb, articles/${articleId}/bookmarkedBy/${userId});
//   const counterRef = ref(rtdb, articles/${articleId}/bookmarksCount);
//   const snap = await get(bRef);

//   if (snap.exists()) {
//     await remove(bRef);
//     await runTransaction(counterRef, cur => Math.max((cur || 1) - 1, 0));
//   } else {
//     await set(bRef, true);
//     await runTransaction(counterRef, cur => (cur || 0) + 1);
//   }
// }
// /** live list of bookmarker uids */
// export function streamBookmarks(articleId, cb) {
//   const bRef = ref(rtdb, articles/${articleId}/bookmarkedBy);
//   return onValue(bRef, snap => {
//     const uids = [];
//     snap.forEach(c => uids.push(c.key));
//     cb(uids);
//   });
// }


export async function toggleBookmark(articleId, userId) {
  const artPath = `articles/${articleId}/bookmarkedBy/${userId}`;
  const userPath = `userBookmarks/${userId}/${articleId}`;
  const counterRef = ref(rtdb, `articles/${articleId}/bookmarksCount`);

  const artRef = ref(rtdb, artPath);
  const userRef = ref(rtdb, userPath);

  const already = (await get(artRef)).exists();

  if (already) {
    await Promise.all([
      remove(artRef),
      remove(userRef),
      runTransaction(counterRef, (cur) => Math.max((cur || 1) - 1, 0)),
    ]);
  } else {
    await Promise.all([
      set(artRef, true),
      set(userRef, true),
      runTransaction(counterRef, (cur) => (cur || 0) + 1),
    ]);
  }
}

/** Live list of *user IDs* who have bookmarked a given article */
export function streamBookmarks(articleId, cb) {
  const bRef = ref(rtdb, `articles/${articleId}/bookmarkedBy`);
  return onValue(bRef, (snap) => {
    const uids = [];
    snap.forEach((c) => uids.push(c.key));
    cb(uids);
  });
}

/** Live list of *article IDs* that the current user has bookmarked */
export function streamMyBookmarks(userId, cb) {
  if (!userId) return () => {};
  const uRef = ref(rtdb, `userBookmarks/${userId}`);
  return onValue(uRef, (snap) => {
    const ids = [];
    snap.forEach((c) => ids.push(c.key));
    cb(ids);
  });
}

export function streamBookmarkCount(articleId, cb) {
    return onValue(
      ref(rtdb, `articles/${articleId}/bookmarksCount`),
      snap => cb(snap.val() || 0)
    );
  }

  
