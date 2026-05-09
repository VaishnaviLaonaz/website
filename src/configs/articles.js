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

  


// Working before cost saving


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
// import { tryNotify, notifyAllUsersArticlePublish } from './notifications';

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
//   if (article.authorId && article.title) {
//     notifyAllUsersArticlePublish(
//       article.authorId,
//       newRef.key,
//       article.title
//     );
//   }
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

// /* ---------- Drafts (per user, same shape) ---------- */
// export function streamMyDrafts(uid, cb, limit = 100) {
//   if (!uid) return () => {};
//   const q = query(ref(rtdb, `drafts/${uid}`), orderByChild('createdAt'), limitToLast(limit));
//   return onValue(q, (snap) => {
//     const items = [];
//     snap.forEach((c) => items.push({ id: c.key, ...c.val() }));
//     cb(items.reverse());
//   });
// }
// export async function getDraftOnce(uid, draftId) {
//   const s = await get(ref(rtdb, `drafts/${uid}/${draftId}`));
//   return s.exists() ? s.val() : null;
// }
// export async function createDraft(uid, draftPayload) {
//   const newRef = push(ref(rtdb, `drafts/${uid}`));
//   await set(newRef, draftPayload);
//   return { id: newRef.key };
// }
// export async function updateDraft(uid, draftId, updates) {
//   await update(ref(rtdb, `drafts/${uid}/${draftId}`), updates);
//   return { id: draftId, ...updates };
// }
// export async function deleteDraft(uid, draftId) {
//   await remove(ref(rtdb, `drafts/${uid}/${draftId}`));
//   return { id: draftId };
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
//     // if (viewerId && authorId && viewerId === authorId) return;
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
// //   const bRef = ref(rtdb, articles/${articleId}/bookmarkedBy/${userId});
// //   const counterRef = ref(rtdb, articles/${articleId}/bookmarksCount);
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
// //   const bRef = ref(rtdb, articles/${articleId}/bookmarkedBy);
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

  
// end above working and perfect code before cost cutting

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
//   equalTo,
//   get,
//   runTransaction,
// } from 'firebase/database';

// import { doc, getDoc } from 'firebase/firestore';
// import { rtdb, db } from './firebase';
// import { tryNotify, notifyAllUsersArticlePublish } from './notifications';

// /* ─────────── Helpers ─────────── */

// function rtdbSnapshotToArray(snapshot, newestFirst = true) {
//   const items = [];

//   snapshot.forEach((childSnap) => {
//     items.push({
//       id: childSnap.key,
//       ...childSnap.val(),
//     });
//   });

//   if (!newestFirst) return items;

//   return items.sort(
//     (a, b) => (Number(b.createdAt) || 0) - (Number(a.createdAt) || 0)
//   );
// }

// /* ─────────── Articles list ─────────── */

// /**
//  * Existing real-time article stream.
//  * Keep this for pages/components that still need live updates.
//  */
// export function streamAllArticles(callback, limit = 20) {
//   const articlesQuery = query(
//     ref(rtdb, 'articles'),
//     orderByChild('createdAt'),
//     limitToLast(limit)
//   );

//   return onValue(articlesQuery, (snapshot) => {
//     const items = [];

//     snapshot.forEach((childSnap) => {
//       items.push({
//         id: childSnap.key,
//         ...childSnap.val(),
//       });
//     });

//     callback(items.reverse()); // newest first
//   });
// }

// /**
//  * Phase 2 cost-safe one-time article fetch.
//  * Use this for homepage, community page, article page, and search.
//  * This avoids keeping realtime listeners open.
//  */
// export async function getArticlesOnce(limitCount = 12) {
//   const articlesQuery = query(
//     ref(rtdb, 'articles'),
//     orderByChild('createdAt'),
//     limitToLast(limitCount)
//   );

//   const snapshot = await get(articlesQuery);
//   return rtdbSnapshotToArray(snapshot, true);
// }

// /**
//  * Phase 2 cost-safe fetch for current user's articles.
//  * This avoids loading global articles and filtering in frontend.
//  */
// export async function getMyArticlesOnce(uid, limitCount = 50) {
//   if (!uid) return [];

//   const articlesQuery = query(
//     ref(rtdb, 'articles'),
//     orderByChild('authorId'),
//     equalTo(uid)
//   );

//   const snapshot = await get(articlesQuery);

//   return rtdbSnapshotToArray(snapshot, true).slice(0, limitCount);
// }

// /**
//  * Phase 2 cost-safe fetch for bookmarked articles.
//  * Reads only user's bookmark ids, then fetches those article records.
//  */
// export async function getBookmarkedArticlesOnce(uid, limitCount = 50) {
//   if (!uid) return [];

//   const bookmarksSnapshot = await get(ref(rtdb, `userBookmarks/${uid}`));

//   if (!bookmarksSnapshot.exists()) return [];

//   const articleIds = [];

//   bookmarksSnapshot.forEach((childSnap) => {
//     articleIds.push(childSnap.key);
//   });

//   const limitedIds = articleIds.slice(-limitCount);

//   const articleSnapshots = await Promise.all(
//     limitedIds.map((articleId) => get(ref(rtdb, `articles/${articleId}`)))
//   );

//   return articleSnapshots
//     .map((snapshot, index) => {
//       if (!snapshot.exists()) return null;

//       return {
//         id: limitedIds[index],
//         ...snapshot.val(),
//       };
//     })
//     .filter(Boolean)
//     .sort(
//       (a, b) => (Number(b.createdAt) || 0) - (Number(a.createdAt) || 0)
//     );
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

//   if (article.authorId && article.title) {
//     notifyAllUsersArticlePublish(
//       article.authorId,
//       newRef.key,
//       article.title
//     );
//   }

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

// /* ─────────── Drafts ─────────── */

// export function streamMyDrafts(uid, cb, limit = 100) {
//   if (!uid) return () => {};

//   const draftsQuery = query(
//     ref(rtdb, `drafts/${uid}`),
//     orderByChild('createdAt'),
//     limitToLast(limit)
//   );

//   return onValue(draftsQuery, (snap) => {
//     const items = [];

//     snap.forEach((c) => {
//       items.push({
//         id: c.key,
//         ...c.val(),
//       });
//     });

//     cb(items.reverse());
//   });
// }

// export async function getDraftOnce(uid, draftId) {
//   const snapshot = await get(ref(rtdb, `drafts/${uid}/${draftId}`));
//   return snapshot.exists() ? snapshot.val() : null;
// }

// export async function createDraft(uid, draftPayload) {
//   const newRef = push(ref(rtdb, `drafts/${uid}`));
//   await set(newRef, draftPayload);
//   return { id: newRef.key };
// }

// export async function updateDraft(uid, draftId, updates) {
//   await update(ref(rtdb, `drafts/${uid}/${draftId}`), updates);
//   return { id: draftId, ...updates };
// }

// export async function deleteDraft(uid, draftId) {
//   await remove(ref(rtdb, `drafts/${uid}/${draftId}`));
//   return { id: draftId };
// }

// /* ─────────── Likes ─────────── */

// export async function likeArticle(articleId, userId) {
//   if (!articleId || !userId) return;

//   const likeRef = ref(rtdb, `articles/${articleId}/likedBy/${userId}`);
//   const counterRef = ref(rtdb, `articles/${articleId}/likesCount`);

//   try {
//     const result = await runTransaction(likeRef, (currentValue) => {
//       if (currentValue === true) {
//         return null; // unlike
//       }

//       return true; // like
//     });

//     if (!result.committed) return;

//     const isLikedNow = result.snapshot.val() === true;

//     if (isLikedNow) {
//       await runTransaction(counterRef, (currentValue) => {
//         return (Number(currentValue) || 0) + 1;
//       });

//       const artSnap = await get(ref(rtdb, `articles/${articleId}`));
//       const article = artSnap.val();

//       if (article && article.authorId !== userId) {
//         const actor = (await getDoc(doc(db, "users", userId))).data() || {};

//         tryNotify(article.authorId, {
//           type: "like",
//           actorId: userId,
//           actorName:
//             actor.username ||
//             [actor.firstName, actor.lastName].filter(Boolean).join(" ") ||
//             actor.email ||
//             "Someone",
//           actorAvatar: actor.avatarUrl || "",
//           articleId,
//           articleTitle: article.title || "",
//         });
//       }

//       return;
//     }

//     await runTransaction(counterRef, (currentValue) => {
//       return Math.max((Number(currentValue) || 0) - 1, 0);
//     });
//   } catch (err) {
//     console.error("likeArticle:", err);
//   }
// }

// export function streamLikes(articleId, cb) {
//   const likesRef = ref(rtdb, `articles/${articleId}/likedBy`);

//   return onValue(likesRef, (snap) => {
//     const uids = [];

//     snap.forEach((child) => {
//       uids.push(child.key);
//     });

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
//     // Existing functionality preserved:
//     // currently every article open can increment view count.
//     // Phase 8 will optimize this later with localStorage/user/day guard.
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

//   const artSnap = await get(ref(rtdb, `articles/${articleId}`));
//   const article = artSnap.val();

//   if (article && article.authorId !== comment.uid) {
//     const actor = (await getDoc(doc(db, 'users', comment.uid))).data() || {};

//     tryNotify(article.authorId, {
//       type: 'comment',
//       actorId: comment.uid,
//       actorName:
//         actor.username ||
//         [actor.firstName, actor.lastName].filter(Boolean).join(' ') ||
//         actor.email ||
//         'Someone',
//       actorAvatar: actor.avatarUrl || '',
//       articleId,
//       articleTitle: article.title || '',
//     });
//   }

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

// export function streamComments(articleId, cb, limit = 30) {
//   if (!articleId) return () => {};

//   const commentsQuery = query(
//     ref(rtdb, `comments/${articleId}`),
//     orderByChild('createdAt'),
//     limitToLast(limit)
//   );

//   return onValue(commentsQuery, (snap) => {
//     const items = [];

//     snap.forEach((child) => {
//       items.push({
//         id: child.key,
//         ...child.val(),
//       });
//     });

//     cb(items);
//   });
// }

// export async function updateComment(articleId, commentId, updates) {
//   const commentRef = ref(rtdb, `comments/${articleId}/${commentId}`);
//   await update(commentRef, updates);
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

// /* ─────────── Comment likes ─────────── */

// export async function likeComment(articleId, commentId, userId) {
//   if (!articleId || !commentId || !userId) return;

//   const likeRef = ref(
//     rtdb,
//     `comments/${articleId}/${commentId}/likedBy/${userId}`
//   );

//   try {
//     const result = await runTransaction(likeRef, (currentValue) => {
//       if (currentValue === true) {
//         return null; // unlike
//       }

//       return true; // like
//     });

//     if (!result.committed) return;

//     const isLikedNow = result.snapshot.val() === true;

//     // only notify on like, not unlike
//     if (!isLikedNow) return;

//     const [commentSnap, articleSnap] = await Promise.all([
//       get(ref(rtdb, `comments/${articleId}/${commentId}`)),
//       get(ref(rtdb, `articles/${articleId}`)),
//     ]);

//     const comment = commentSnap.val();
//     const article = articleSnap.val();

//     if (!comment) return;

//     const actor = (await getDoc(doc(db, "users", userId))).data() || {};

//     const payload = {
//       type: "comment-like",
//       actorId: userId,
//       actorName:
//         actor.username ||
//         [actor.firstName, actor.lastName].filter(Boolean).join(" ") ||
//         actor.email ||
//         "Someone",
//       actorAvatar: actor.avatarUrl || "",
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
//   } catch (err) {
//     console.error("likeComment:", err);
//   }
// }

// export function streamCommentLikes(articleId, cb) {
//   if (!articleId) return () => {};

//   return onValue(ref(rtdb, `comments/${articleId}`), (snapshot) => {
//     const map = {};

//     snapshot.forEach((commentSnap) => {
//       const uids = [];

//       commentSnap.child('likedBy').forEach((userSnap) => {
//         uids.push(userSnap.key);
//       });

//       map[commentSnap.key] = uids;
//     });

//     cb(map);
//   });
// }

// /* ─────────── Bookmarks ─────────── */

// export async function toggleBookmark(articleId, userId) {
//   const articleBookmarkPath = `articles/${articleId}/bookmarkedBy/${userId}`;
//   const userBookmarkPath = `userBookmarks/${userId}/${articleId}`;

//   const articleBookmarkRef = ref(rtdb, articleBookmarkPath);
//   const userBookmarkRef = ref(rtdb, userBookmarkPath);
//   const counterRef = ref(rtdb, `articles/${articleId}/bookmarksCount`);

//   const already = (await get(articleBookmarkRef)).exists();

//   if (already) {
//     await Promise.all([
//       remove(articleBookmarkRef),
//       remove(userBookmarkRef),
//       runTransaction(counterRef, (cur) => Math.max((cur || 1) - 1, 0)),
//     ]);

//     return;
//   }

//   await Promise.all([
//     set(articleBookmarkRef, true),
//     set(userBookmarkRef, true),
//     runTransaction(counterRef, (cur) => (cur || 0) + 1),
//   ]);
// }

// /**
//  * Live list of user IDs who bookmarked a given article.
//  * Keep this for article detail/card state where needed.
//  */
// export function streamBookmarks(articleId, cb) {
//   const bookmarkRef = ref(rtdb, `articles/${articleId}/bookmarkedBy`);

//   return onValue(bookmarkRef, (snap) => {
//     const uids = [];

//     snap.forEach((childSnap) => {
//       uids.push(childSnap.key);
//     });

//     cb(uids);
//   });
// }

// /**
//  * Live list of article IDs bookmarked by the current user.
//  * Keep existing behavior. Phase 2 adds getBookmarkedArticlesOnce above for profile/list pages.
//  */
// export function streamMyBookmarks(userId, cb) {
//   if (!userId) return () => {};

//   const userBookmarkRef = ref(rtdb, `userBookmarks/${userId}`);

//   return onValue(userBookmarkRef, (snap) => {
//     const ids = [];

//     snap.forEach((childSnap) => {
//       ids.push(childSnap.key);
//     });

//     cb(ids);
//   });
// }

// export function streamBookmarkCount(articleId, cb) {
//   return onValue(
//     ref(rtdb, `articles/${articleId}/bookmarksCount`),
//     (snap) => cb(snap.val() || 0)
//   );
// }


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
//   equalTo,
//   get,
//   runTransaction,
// } from 'firebase/database';

// import { doc, getDoc } from 'firebase/firestore';
// import { ref as storageRef, deleteObject } from 'firebase/storage';

// import { rtdb, db, storage } from './firebase';
// import { tryNotify, notifyAllUsersArticlePublish } from './notifications';

// /* ─────────── Helpers ─────────── */

// function rtdbSnapshotToArray(snapshot, newestFirst = true) {
//   const items = [];

//   snapshot.forEach((childSnap) => {
//     items.push({
//       id: childSnap.key,
//       ...childSnap.val(),
//     });
//   });

//   if (!newestFirst) return items;

//   return items.sort(
//     (a, b) => (Number(b.createdAt) || 0) - (Number(a.createdAt) || 0)
//   );
// }

// function extractImageUrlsFromHtml(html = '') {
//   if (!html || typeof html !== 'string') return [];

//   try {
//     const parser = new DOMParser();
//     const doc = parser.parseFromString(html, 'text/html');

//     return Array.from(doc.querySelectorAll('img'))
//       .map((img) => img.getAttribute('src'))
//       .filter(Boolean);
//   } catch {
//     const urls = [];
//     const regex = /<img[^>]+src=["']([^"']+)["']/gi;
//     let match;

//     while ((match = regex.exec(html)) !== null) {
//       if (match[1]) urls.push(match[1]);
//     }

//     return urls;
//   }
// }

// function uniqueArray(items) {
//   return [...new Set(items.filter(Boolean))];
// }

// async function deleteStorageFileFromUrl(url) {
//   if (!url || typeof url !== 'string') return;

//   const isFirebaseStorageUrl =
//     url.includes('firebasestorage.googleapis.com') || url.startsWith('gs://');

//   if (!isFirebaseStorageUrl) return;

//   try {
//     const fileRef = storageRef(storage, url);
//     await deleteObject(fileRef);
//   } catch (err) {
//     /*
//      * Do not block article deletion if Storage cleanup fails.
//      * Example: old /images path is read-only, file already deleted,
//      * or legacy URL is not owned by current rules.
//      */
//     console.warn('Storage URL cleanup skipped:', err?.message || err);
//   }
// }

// async function deleteStorageFileFromPath(path) {
//   if (!path || typeof path !== 'string') return;

//   try {
//     const fileRef = storageRef(storage, path);
//     await deleteObject(fileRef);
//   } catch (err) {
//     /*
//      * Do not block article deletion if exact known path does not exist.
//      */
//     console.warn('Storage path cleanup skipped:', err?.message || err);
//   }
// }

// async function deleteArticleStorageImages(articleId, article) {
//   if (!article || !articleId) return;

//   const bodyImageUrls = extractImageUrlsFromHtml(article.body || '');

//   /*
//    * coverUrl can be:
//    * 1. same URL as body image selected as cover
//    * 2. separate uploaded cover image URL
//    * 3. empty/stale
//    */
//   const urlCandidates = uniqueArray([
//     article.coverUrl,
//     ...bodyImageUrls,
//   ]);

//   /*
//    * Known optimized cover path.
//    * This deletes duplicate cover file even if coverUrl is missing/stale.
//    */
//   const pathCandidates = uniqueArray([
//     article.authorId
//       ? `article_covers/${article.authorId}/${articleId}/cover.webp`
//       : null,
//   ]);

//   await Promise.allSettled([
//     ...urlCandidates.map((url) => deleteStorageFileFromUrl(url)),
//     ...pathCandidates.map((path) => deleteStorageFileFromPath(path)),
//   ]);
// }

// async function deleteArticleBookmarks(articleId, article) {
//   if (!articleId || !article?.bookmarkedBy) return;

//   const bookmarkedUserIds = Object.keys(article.bookmarkedBy || {});

//   if (!bookmarkedUserIds.length) return;

//   await Promise.allSettled(
//     bookmarkedUserIds.map((uid) =>
//       remove(ref(rtdb, `userBookmarks/${uid}/${articleId}`))
//     )
//   );
// }

// /* ─────────── Articles list ─────────── */

// /**
//  * Existing real-time article stream.
//  * Keep this for pages/components that still need live updates.
//  */
// export function streamAllArticles(callback, limit = 20) {
//   const articlesQuery = query(
//     ref(rtdb, 'articles'),
//     orderByChild('createdAt'),
//     limitToLast(limit)
//   );

//   return onValue(articlesQuery, (snapshot) => {
//     const items = [];

//     snapshot.forEach((childSnap) => {
//       items.push({
//         id: childSnap.key,
//         ...childSnap.val(),
//       });
//     });

//     callback(items.reverse());
//   });
// }

// /**
//  * Phase 2 cost-safe one-time article fetch.
//  */
// export async function getArticlesOnce(limitCount = 12) {
//   const articlesQuery = query(
//     ref(rtdb, 'articles'),
//     orderByChild('createdAt'),
//     limitToLast(limitCount)
//   );

//   const snapshot = await get(articlesQuery);
//   return rtdbSnapshotToArray(snapshot, true);
// }

// /**
//  * Phase 2 cost-safe fetch for current user's articles.
//  */
// export async function getMyArticlesOnce(uid, limitCount = 50) {
//   if (!uid) return [];

//   const articlesQuery = query(
//     ref(rtdb, 'articles'),
//     orderByChild('authorId'),
//     equalTo(uid)
//   );

//   const snapshot = await get(articlesQuery);

//   return rtdbSnapshotToArray(snapshot, true).slice(0, limitCount);
// }

// /**
//  * Phase 2 cost-safe fetch for bookmarked articles.
//  */
// export async function getBookmarkedArticlesOnce(uid, limitCount = 50) {
//   if (!uid) return [];

//   const bookmarksSnapshot = await get(ref(rtdb, `userBookmarks/${uid}`));

//   if (!bookmarksSnapshot.exists()) return [];

//   const articleIds = [];

//   bookmarksSnapshot.forEach((childSnap) => {
//     articleIds.push(childSnap.key);
//   });

//   const limitedIds = articleIds.slice(-limitCount);

//   const articleSnapshots = await Promise.all(
//     limitedIds.map((articleId) => get(ref(rtdb, `articles/${articleId}`)))
//   );

//   return articleSnapshots
//     .map((snapshot, index) => {
//       if (!snapshot.exists()) return null;

//       return {
//         id: limitedIds[index],
//         ...snapshot.val(),
//       };
//     })
//     .filter(Boolean)
//     .sort(
//       (a, b) => (Number(b.createdAt) || 0) - (Number(a.createdAt) || 0)
//     );
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

//   if (article.authorId && article.title) {
//     notifyAllUsersArticlePublish(
//       article.authorId,
//       newRef.key,
//       article.title
//     );
//   }

//   return { id: newRef.key };
// }

// export async function updateArticle(id, updates) {
//   const artRef = ref(rtdb, `articles/${id}`);
//   await update(artRef, updates);
//   return { id, ...updates };
// }

// /**
//  * Cascade delete:
//  * - article record
//  * - article comments
//  * - old commentLikes path, if present
//  * - userBookmarks references
//  * - article Storage images used in body/cover
//  * - known duplicate cover path article_covers/{authorId}/{articleId}/cover.webp
//  */
// export async function deleteArticle(id) {
//   if (!id) return { id };

//   const articleSnap = await get(ref(rtdb, `articles/${id}`));
//   const article = articleSnap.exists() ? articleSnap.val() : null;

//   /*
//    * Storage cleanup happens before DB removal because we need body/coverUrl/authorId.
//    * If Storage delete fails, database delete still continues.
//    */
//   await deleteArticleStorageImages(id, article);

//   /*
//    * Clean user bookmark reverse-index before deleting article.
//    */
//   await deleteArticleBookmarks(id, article);

//   await Promise.allSettled([
//     remove(ref(rtdb, `comments/${id}`)),
//     remove(ref(rtdb, `commentLikes/${id}`)),
//     remove(ref(rtdb, `articles/${id}`)),
//   ]);

//   return { id };
// }

// /* ─────────── Drafts ─────────── */

// export function streamMyDrafts(uid, cb, limit = 100) {
//   if (!uid) return () => {};

//   const draftsQuery = query(
//     ref(rtdb, `drafts/${uid}`),
//     orderByChild('createdAt'),
//     limitToLast(limit)
//   );

//   return onValue(draftsQuery, (snap) => {
//     const items = [];

//     snap.forEach((c) => {
//       items.push({
//         id: c.key,
//         ...c.val(),
//       });
//     });

//     cb(items.reverse());
//   });
// }

// export async function getDraftOnce(uid, draftId) {
//   const snapshot = await get(ref(rtdb, `drafts/${uid}/${draftId}`));
//   return snapshot.exists() ? snapshot.val() : null;
// }

// export async function createDraft(uid, draftPayload) {
//   const newRef = push(ref(rtdb, `drafts/${uid}`));
//   await set(newRef, draftPayload);
//   return { id: newRef.key };
// }

// export async function updateDraft(uid, draftId, updates) {
//   await update(ref(rtdb, `drafts/${uid}/${draftId}`), updates);
//   return { id: draftId, ...updates };
// }

// export async function deleteDraft(uid, draftId) {
//   await remove(ref(rtdb, `drafts/${uid}/${draftId}`));
//   return { id: draftId };
// }

// /* ─────────── Likes ─────────── */

// export async function likeArticle(articleId, userId) {
//   if (!articleId || !userId) return;

//   const likeRef = ref(rtdb, `articles/${articleId}/likedBy/${userId}`);
//   const counterRef = ref(rtdb, `articles/${articleId}/likesCount`);

//   try {
//     const result = await runTransaction(likeRef, (currentValue) => {
//       if (currentValue === true) {
//         return null;
//       }

//       return true;
//     });

//     if (!result.committed) return;

//     const isLikedNow = result.snapshot.val() === true;

//     if (isLikedNow) {
//       await runTransaction(counterRef, (currentValue) => {
//         return (Number(currentValue) || 0) + 1;
//       });

//       const artSnap = await get(ref(rtdb, `articles/${articleId}`));
//       const article = artSnap.val();

//       if (article && article.authorId !== userId) {
//         const actor = (await getDoc(doc(db, 'users', userId))).data() || {};

//         tryNotify(article.authorId, {
//           type: 'like',
//           actorId: userId,
//           actorName:
//             actor.username ||
//             [actor.firstName, actor.lastName].filter(Boolean).join(' ') ||
//             actor.email ||
//             'Someone',
//           actorAvatar: actor.avatarUrl || '',
//           articleId,
//           articleTitle: article.title || '',
//         });
//       }

//       return;
//     }

//     await runTransaction(counterRef, (currentValue) => {
//       return Math.max((Number(currentValue) || 0) - 1, 0);
//     });
//   } catch (err) {
//     console.error('likeArticle:', err);
//   }
// }

// export function streamLikes(articleId, cb) {
//   const likesRef = ref(rtdb, `articles/${articleId}/likedBy`);

//   return onValue(likesRef, (snap) => {
//     const uids = [];

//     snap.forEach((child) => {
//       uids.push(child.key);
//     });

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

//   const artSnap = await get(ref(rtdb, `articles/${articleId}`));
//   const article = artSnap.val();

//   if (article && article.authorId !== comment.uid) {
//     const actor = (await getDoc(doc(db, 'users', comment.uid))).data() || {};

//     tryNotify(article.authorId, {
//       type: 'comment',
//       actorId: comment.uid,
//       actorName:
//         actor.username ||
//         [actor.firstName, actor.lastName].filter(Boolean).join(' ') ||
//         actor.email ||
//         'Someone',
//       actorAvatar: actor.avatarUrl || '',
//       articleId,
//       articleTitle: article.title || '',
//     });
//   }

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

// export function streamComments(articleId, cb, limit = 30) {
//   if (!articleId) return () => {};

//   const commentsQuery = query(
//     ref(rtdb, `comments/${articleId}`),
//     orderByChild('createdAt'),
//     limitToLast(limit)
//   );

//   return onValue(commentsQuery, (snap) => {
//     const items = [];

//     snap.forEach((child) => {
//       items.push({
//         id: child.key,
//         ...child.val(),
//       });
//     });

//     cb(items);
//   });
// }

// export async function updateComment(articleId, commentId, updates) {
//   const commentRef = ref(rtdb, `comments/${articleId}/${commentId}`);
//   await update(commentRef, updates);
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

// /* ─────────── Comment likes ─────────── */

// export async function likeComment(articleId, commentId, userId) {
//   if (!articleId || !commentId || !userId) return;

//   const likeRef = ref(
//     rtdb,
//     `comments/${articleId}/${commentId}/likedBy/${userId}`
//   );

//   try {
//     const result = await runTransaction(likeRef, (currentValue) => {
//       if (currentValue === true) {
//         return null;
//       }

//       return true;
//     });

//     if (!result.committed) return;

//     const isLikedNow = result.snapshot.val() === true;

//     if (!isLikedNow) return;

//     const [commentSnap, articleSnap] = await Promise.all([
//       get(ref(rtdb, `comments/${articleId}/${commentId}`)),
//       get(ref(rtdb, `articles/${articleId}`)),
//     ]);

//     const comment = commentSnap.val();
//     const article = articleSnap.val();

//     if (!comment) return;

//     const actor = (await getDoc(doc(db, 'users', userId))).data() || {};

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
//   } catch (err) {
//     console.error('likeComment:', err);
//   }
// }

// export function streamCommentLikes(articleId, cb) {
//   if (!articleId) return () => {};

//   return onValue(ref(rtdb, `comments/${articleId}`), (snapshot) => {
//     const map = {};

//     snapshot.forEach((commentSnap) => {
//       const uids = [];

//       commentSnap.child('likedBy').forEach((userSnap) => {
//         uids.push(userSnap.key);
//       });

//       map[commentSnap.key] = uids;
//     });

//     cb(map);
//   });
// }

// /* ─────────── Bookmarks ─────────── */

// export async function toggleBookmark(articleId, userId) {
//   const articleBookmarkPath = `articles/${articleId}/bookmarkedBy/${userId}`;
//   const userBookmarkPath = `userBookmarks/${userId}/${articleId}`;

//   const articleBookmarkRef = ref(rtdb, articleBookmarkPath);
//   const userBookmarkRef = ref(rtdb, userBookmarkPath);
//   const counterRef = ref(rtdb, `articles/${articleId}/bookmarksCount`);

//   const already = (await get(articleBookmarkRef)).exists();

//   if (already) {
//     await Promise.all([
//       remove(articleBookmarkRef),
//       remove(userBookmarkRef),
//       runTransaction(counterRef, (cur) => Math.max((cur || 1) - 1, 0)),
//     ]);

//     return;
//   }

//   await Promise.all([
//     set(articleBookmarkRef, true),
//     set(userBookmarkRef, true),
//     runTransaction(counterRef, (cur) => (cur || 0) + 1),
//   ]);
// }

// export function streamBookmarks(articleId, cb) {
//   const bookmarkRef = ref(rtdb, `articles/${articleId}/bookmarkedBy`);

//   return onValue(bookmarkRef, (snap) => {
//     const uids = [];

//     snap.forEach((childSnap) => {
//       uids.push(childSnap.key);
//     });

//     cb(uids);
//   });
// }

// export function streamMyBookmarks(userId, cb) {
//   if (!userId) return () => {};

//   const userBookmarkRef = ref(rtdb, `userBookmarks/${userId}`);

//   return onValue(userBookmarkRef, (snap) => {
//     const ids = [];

//     snap.forEach((childSnap) => {
//       ids.push(childSnap.key);
//     });

//     cb(ids);
//   });
// }

// export function streamBookmarkCount(articleId, cb) {
//   return onValue(
//     ref(rtdb, `articles/${articleId}/bookmarksCount`),
//     (snap) => cb(snap.val() || 0)
//   );
// }




// new updated cost cutting file below




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
  equalTo,
  get,
  runTransaction,
} from 'firebase/database';

import { doc, getDoc } from 'firebase/firestore';
import { ref as storageRef, deleteObject } from 'firebase/storage';

import { rtdb, db, storage } from './firebase';
import { tryNotify, notifyAllUsersArticlePublish } from './notifications';

/* ─────────── Helpers ─────────── */

function rtdbSnapshotToArray(snapshot, newestFirst = true) {
  const items = [];

  snapshot.forEach((childSnap) => {
    items.push({
      id: childSnap.key,
      ...childSnap.val(),
    });
  });

  if (!newestFirst) return items;

  return items.sort(
    (a, b) => (Number(b.createdAt) || 0) - (Number(a.createdAt) || 0)
  );
}

function extractImageUrlsFromHtml(html = '') {
  if (!html || typeof html !== 'string') return [];

  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');

    return Array.from(doc.querySelectorAll('img'))
      .map((img) => img.getAttribute('src'))
      .filter(Boolean);
  } catch {
    const urls = [];
    const regex = /<img[^>]+src=["']([^"']+)["']/gi;
    let match;

    while ((match = regex.exec(html)) !== null) {
      if (match[1]) urls.push(match[1]);
    }

    return urls;
  }
}

function htmlToPlainText(html = '') {
  if (!html || typeof html !== 'string') return '';

  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    return (doc.body.textContent || '').replace(/\s+/g, ' ').trim();
  } catch {
    return String(html)
      .replace(/<[^>]*>?/gm, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }
}

function createExcerptFromHtml(html = '', maxLength = 180) {
  const text = htmlToPlainText(html);

  if (text.length <= maxLength) return text;

  return `${text.slice(0, maxLength).trim()}...`;
}

function normalizeSearchValue(value = '') {
  return String(value || '').trim().toLowerCase();
}

function normalizeSearchTags(tags) {
  if (!Array.isArray(tags)) return [];

  return tags
    .map((tag) => normalizeSearchValue(tag))
    .filter(Boolean);
}

function uniqueArray(items) {
  return [...new Set(items.filter(Boolean))];
}

function removeUndefinedFields(obj = {}) {
  return Object.fromEntries(
    Object.entries(obj).filter(([, value]) => value !== undefined)
  );
}

function splitArticleForStorage(article = {}) {
  const { body = '', ...summary } = article;

  const cleanSummary = removeUndefinedFields({
    ...summary,
    excerpt: summary.excerpt || createExcerptFromHtml(body),
    searchTitle: normalizeSearchValue(summary.title),
    searchTags: normalizeSearchTags(summary.tags),
  });

  return {
    summary: cleanSummary,
    body: body || '',
  };
}

async function getArticleBodyValue(articleId) {
  if (!articleId) return '';

  const bodySnap = await get(ref(rtdb, `articleBodies/${articleId}/body`));
  return bodySnap.exists() ? bodySnap.val() || '' : '';
}

/*
 * Strong Storage URL parser.
 * Firebase download URLs look like:
 * https://firebasestorage.googleapis.com/v0/b/<bucket>/o/article_images%2Fuid%2Ffile.webp?alt=media&token=...
 *
 * deleteObject works most reliably when we pass the decoded storage path:
 * article_images/uid/file.webp
 */
function getStoragePathFromUrl(url) {
  if (!url || typeof url !== 'string') return null;

  try {
    if (url.startsWith('gs://')) {
      return decodeURIComponent(url.replace(/^gs:\/\/[^/]+\//, ''));
    }

    if (!url.includes('firebasestorage.googleapis.com')) {
      return null;
    }

    const match = url.match(/\/o\/([^?]+)/);

    if (!match?.[1]) return null;

    return decodeURIComponent(match[1]);
  } catch {
    return null;
  }
}

async function deleteStorageFileFromUrl(url) {
  const path = getStoragePathFromUrl(url);

  if (!path) return;

  try {
    const fileRef = storageRef(storage, path);
    await deleteObject(fileRef);
  } catch (err) {
    /*
     * Do not block article deletion if Storage cleanup fails.
     * Common reasons:
     * - file already deleted
     * - old URL/path
     * - current user is not owner according to Storage rules
     */
    console.warn('Storage URL cleanup skipped:', {
      path,
      message: err?.message || err,
    });
  }
}

async function deleteStorageFileFromPath(path) {
  if (!path || typeof path !== 'string') return;

  try {
    const fileRef = storageRef(storage, path);
    await deleteObject(fileRef);
  } catch (err) {
    /*
     * Do not block article deletion if exact known path does not exist.
     */
    console.warn('Storage path cleanup skipped:', {
      path,
      message: err?.message || err,
    });
  }
}

async function deleteArticleStorageImages(articleId, article) {
  if (!article || !articleId) return;

  const bodyImageUrls = extractImageUrlsFromHtml(article.body || '');

  /*
   * coverUrl can be:
   * 1. same URL as body image selected as cover
   * 2. separate uploaded cover image URL
   * 3. empty/stale
   */
  const urlCandidates = uniqueArray([
    article.coverUrl,
    ...bodyImageUrls,
  ]);

  /*
   * Known optimized cover path.
   * This deletes duplicate cover file even if coverUrl is missing/stale.
   */
  const pathCandidates = uniqueArray([
    article.authorId
      ? `article_covers/${article.authorId}/${articleId}/cover.webp`
      : null,
  ]);

  await Promise.allSettled([
    ...urlCandidates.map((url) => deleteStorageFileFromUrl(url)),
    ...pathCandidates.map((path) => deleteStorageFileFromPath(path)),
  ]);
}

/*
 * Name kept same.
 * Existing responsibility: clean bookmark reverse index.
 * Added safe cleanup for possible old/extra user-like reverse indexes.
 */
async function deleteArticleBookmarks(articleId, article) {
  if (!articleId || !article) return;

  const bookmarkedUserIds = Object.keys(article.bookmarkedBy || {});
  const likedUserIds = Object.keys(article.likedBy || {});

  await Promise.allSettled([
    ...bookmarkedUserIds.map((uid) =>
      remove(ref(rtdb, `userBookmarks/${uid}/${articleId}`))
    ),

    /*
     * Safe cleanup for old/possible reverse like indexes.
     * If these paths do not exist, remove() is harmless.
     */
    ...likedUserIds.map((uid) =>
      remove(ref(rtdb, `userLikes/${uid}/${articleId}`))
    ),

    ...likedUserIds.map((uid) =>
      remove(ref(rtdb, `likedArticles/${uid}/${articleId}`))
    ),
  ]);
}

/* ─────────── Articles list ─────────── */

/**
 * Existing real-time article stream.
 * Keep this for pages/components that still need live updates.
 *
 * Phase 5:
 * This now streams lightweight article summaries only.
 * Full body is stored in articleBodies/{articleId}.
 */
export function streamAllArticles(callback, limit = 20) {
  const articlesQuery = query(
    ref(rtdb, 'articles'),
    orderByChild('createdAt'),
    limitToLast(limit)
  );

  return onValue(articlesQuery, (snapshot) => {
    const items = [];

    snapshot.forEach((childSnap) => {
      items.push({
        id: childSnap.key,
        ...childSnap.val(),
      });
    });

    callback(items.reverse());
  });
}

/**
 * Phase 2 cost-safe one-time article fetch.
 * Phase 5: returns summaries only.
 */
export async function getArticlesOnce(limitCount = 12) {
  const articlesQuery = query(
    ref(rtdb, 'articles'),
    orderByChild('createdAt'),
    limitToLast(limitCount)
  );

  const snapshot = await get(articlesQuery);
  return rtdbSnapshotToArray(snapshot, true);
}

/**
 * Phase 2 cost-safe fetch for current user's articles.
 * Phase 5: returns summaries only.
 */
export async function getMyArticlesOnce(uid, limitCount = 50) {
  if (!uid) return [];

  const articlesQuery = query(
    ref(rtdb, 'articles'),
    orderByChild('authorId'),
    equalTo(uid)
  );

  const snapshot = await get(articlesQuery);

  return rtdbSnapshotToArray(snapshot, true).slice(0, limitCount);
}

/**
 * Phase 2 cost-safe fetch for bookmarked articles.
 * Phase 5: returns summaries only.
 */
export async function getBookmarkedArticlesOnce(uid, limitCount = 50) {
  if (!uid) return [];

  const bookmarksSnapshot = await get(ref(rtdb, `userBookmarks/${uid}`));

  if (!bookmarksSnapshot.exists()) return [];

  const articleIds = [];

  bookmarksSnapshot.forEach((childSnap) => {
    articleIds.push(childSnap.key);
  });

  const limitedIds = articleIds.slice(-limitCount);

  const articleSnapshots = await Promise.all(
    limitedIds.map((articleId) => get(ref(rtdb, `articles/${articleId}`)))
  );

  return articleSnapshots
    .map((snapshot, index) => {
      if (!snapshot.exists()) return null;

      return {
        id: limitedIds[index],
        ...snapshot.val(),
      };
    })
    .filter(Boolean)
    .sort(
      (a, b) => (Number(b.createdAt) || 0) - (Number(a.createdAt) || 0)
    );
}

/**
 * Phase 5 helper:
 * Read full article body only when needed, usually ArticleDetailPage/Edit page.
 * Keeps backward compatibility with old articles that still have body in articles/{id}.
 */
export async function getArticleBodyOnce(articleId) {
  if (!articleId) return '';

  const bodyFromNewPath = await getArticleBodyValue(articleId);
  if (bodyFromNewPath) return bodyFromNewPath;

  const oldArticleSnap = await get(ref(rtdb, `articles/${articleId}/body`));
  return oldArticleSnap.exists() ? oldArticleSnap.val() || '' : '';
}

/**
 * Phase 5 helper:
 * Fetch summary + body together only for pages that truly need full article.
 */
export async function getArticleWithBodyOnce(articleId) {
  if (!articleId) return null;

  const articleSnap = await get(ref(rtdb, `articles/${articleId}`));

  if (!articleSnap.exists()) return null;

  const article = {
    id: articleId,
    ...articleSnap.val(),
  };

  const body = await getArticleBodyOnce(articleId);

  return {
    ...article,
    body: body || article.body || '',
  };
}

/* ─────────── CRUD ─────────── */

export async function createArticle(article) {
  const listRef = ref(rtdb, 'articles');
  const newRef = push(listRef);
  const articleId = newRef.key;

  const { summary, body } = splitArticleForStorage(article);

  const now = Date.now();
  const createdAt = summary.createdAt || now;
  const updatedAt = summary.updatedAt || createdAt;

  const summaryPayload = removeUndefinedFields({
    ...summary,
    createdAt,
    updatedAt,
    views: summary.views ?? 0,
    likesCount: summary.likesCount ?? 0,
    commentsCount: summary.commentsCount ?? 0,
    bookmarksCount: summary.bookmarksCount ?? 0,
  });

  /*
   * Important:
   * Save lightweight summary first so list/card/search pages do not need body.
   */
  await set(newRef, summaryPayload);

  /*
   * Full body goes to a separate path.
   * This is the main Phase 5 cost-saving change.
   */
  await set(ref(rtdb, `articleBodies/${articleId}`), {
    body,
    authorId: summaryPayload.authorId || '',
    createdAt,
    updatedAt,
  });

  if (summaryPayload.authorId && summaryPayload.title) {
    notifyAllUsersArticlePublish(
      summaryPayload.authorId,
      articleId,
      summaryPayload.title
    );
  }

  return { id: articleId };
}

export async function updateArticle(id, updates) {
  if (!id) return { id, ...updates };

  const hasBody = Object.prototype.hasOwnProperty.call(updates || {}, 'body');
  const { summary, body } = splitArticleForStorage(updates || {});

  const updatedAt = summary.updatedAt || Date.now();

  const summaryPayload = removeUndefinedFields({
    ...summary,
    updatedAt,
  });

  /*
   * If body is part of updates, do not store it under articles/{id}.
   * Store it under articleBodies/{id}.
   */
  await update(ref(rtdb, `articles/${id}`), summaryPayload);

  if (hasBody) {
    await update(ref(rtdb, `articleBodies/${id}`), {
      body,
      authorId: summaryPayload.authorId || updates.authorId || '',
      updatedAt,
    });
  }

  return { id, ...updates };
}

/**
 * Cascade delete:
 * - article record
 * - article body record
 * - article comments
 * - old commentLikes path, if present
 * - userBookmarks references
 * - article Storage images used in body/cover
 * - known duplicate cover path article_covers/{authorId}/{articleId}/cover.webp
 * - safe old/possible like/stat paths
 */
export async function deleteArticle(id) {
  if (!id) return { id };

  const articleSnap = await get(ref(rtdb, `articles/${id}`));
  const article = articleSnap.exists() ? articleSnap.val() : null;

  const body = article ? await getArticleBodyOnce(id) : '';

  const articleForCleanup = article
    ? {
        ...article,
        body: body || article.body || '',
      }
    : null;

  /*
   * Storage cleanup happens before DB removal because we need body/coverUrl/authorId.
   * If Storage delete fails, database delete still continues.
   */
  await deleteArticleStorageImages(id, articleForCleanup);

  /*
   * Clean bookmark/like reverse indexes before deleting article.
   */
  await deleteArticleBookmarks(id, articleForCleanup);

  await Promise.allSettled([
    remove(ref(rtdb, `comments/${id}`)),
    remove(ref(rtdb, `commentLikes/${id}`)),

    /*
     * Safe cleanup for old/possible like/stat paths.
     * If your current app does not use them, remove() does nothing.
     */
    remove(ref(rtdb, `articleLikes/${id}`)),
    remove(ref(rtdb, `articleStats/${id}`)),
    remove(ref(rtdb, `likes/${id}`)),

    remove(ref(rtdb, `articleBodies/${id}`)),
    remove(ref(rtdb, `articles/${id}`)),
  ]);

  return { id };
}

/* ─────────── Drafts ─────────── */

export function streamMyDrafts(uid, cb, limit = 100) {
  if (!uid) return () => {};

  const draftsQuery = query(
    ref(rtdb, `drafts/${uid}`),
    orderByChild('createdAt'),
    limitToLast(limit)
  );

  return onValue(draftsQuery, (snap) => {
    const items = [];

    snap.forEach((c) => {
      items.push({
        id: c.key,
        ...c.val(),
      });
    });

    cb(items.reverse());
  });
}

export async function getDraftOnce(uid, draftId) {
  const snapshot = await get(ref(rtdb, `drafts/${uid}/${draftId}`));
  return snapshot.exists() ? snapshot.val() : null;
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
  if (!articleId || !userId) return;

  const likeRef = ref(rtdb, `articles/${articleId}/likedBy/${userId}`);
  const counterRef = ref(rtdb, `articles/${articleId}/likesCount`);

  try {
    const result = await runTransaction(likeRef, (currentValue) => {
      if (currentValue === true) {
        return null;
      }

      return true;
    });

    if (!result.committed) return;

    const isLikedNow = result.snapshot.val() === true;

    if (isLikedNow) {
      await runTransaction(counterRef, (currentValue) => {
        return (Number(currentValue) || 0) + 1;
      });

      const artSnap = await get(ref(rtdb, `articles/${articleId}`));
      const article = artSnap.val();

      if (article && article.authorId !== userId) {
        const actor = (await getDoc(doc(db, 'users', userId))).data() || {};

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

      return;
    }

    await runTransaction(counterRef, (currentValue) => {
      return Math.max((Number(currentValue) || 0) - 1, 0);
    });
  } catch (err) {
    console.error('likeArticle:', err);
  }
}

export function streamLikes(articleId, cb) {
  const likesRef = ref(rtdb, `articles/${articleId}/likedBy`);

  return onValue(likesRef, (snap) => {
    const uids = [];

    snap.forEach((child) => {
      uids.push(child.key);
    });

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

  const artSnap = await get(ref(rtdb, `articles/${articleId}`));
  const article = artSnap.val();

  if (article && article.authorId !== comment.uid) {
    const actor = (await getDoc(doc(db, 'users', comment.uid))).data() || {};

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

export function streamComments(articleId, cb, limit = 30) {
  if (!articleId) return () => {};

  const commentsQuery = query(
    ref(rtdb, `comments/${articleId}`),
    orderByChild('createdAt'),
    limitToLast(limit)
  );

  return onValue(commentsQuery, (snap) => {
    const items = [];

    snap.forEach((child) => {
      items.push({
        id: child.key,
        ...child.val(),
      });
    });

    cb(items);
  });
}

export async function updateComment(articleId, commentId, updates) {
  const commentRef = ref(rtdb, `comments/${articleId}/${commentId}`);
  await update(commentRef, updates);
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

/* ─────────── Comment likes ─────────── */

export async function likeComment(articleId, commentId, userId) {
  if (!articleId || !commentId || !userId) return;

  const likeRef = ref(
    rtdb,
    `comments/${articleId}/${commentId}/likedBy/${userId}`
  );

  try {
    const result = await runTransaction(likeRef, (currentValue) => {
      if (currentValue === true) {
        return null;
      }

      return true;
    });

    if (!result.committed) return;

    const isLikedNow = result.snapshot.val() === true;

    if (!isLikedNow) return;

    const [commentSnap, articleSnap] = await Promise.all([
      get(ref(rtdb, `comments/${articleId}/${commentId}`)),
      get(ref(rtdb, `articles/${articleId}`)),
    ]);

    const comment = commentSnap.val();
    const article = articleSnap.val();

    if (!comment) return;

    const actor = (await getDoc(doc(db, 'users', userId))).data() || {};

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
  } catch (err) {
    console.error('likeComment:', err);
  }
}

export function streamCommentLikes(articleId, cb) {
  if (!articleId) return () => {};

  return onValue(ref(rtdb, `comments/${articleId}`), (snapshot) => {
    const map = {};

    snapshot.forEach((commentSnap) => {
      const uids = [];

      commentSnap.child('likedBy').forEach((userSnap) => {
        uids.push(userSnap.key);
      });

      map[commentSnap.key] = uids;
    });

    cb(map);
  });
}

/* ─────────── Bookmarks ─────────── */

export async function toggleBookmark(articleId, userId) {
  const articleBookmarkPath = `articles/${articleId}/bookmarkedBy/${userId}`;
  const userBookmarkPath = `userBookmarks/${userId}/${articleId}`;

  const articleBookmarkRef = ref(rtdb, articleBookmarkPath);
  const userBookmarkRef = ref(rtdb, userBookmarkPath);
  const counterRef = ref(rtdb, `articles/${articleId}/bookmarksCount`);

  const already = (await get(articleBookmarkRef)).exists();

  if (already) {
    await Promise.all([
      remove(articleBookmarkRef),
      remove(userBookmarkRef),
      runTransaction(counterRef, (cur) => Math.max((cur || 1) - 1, 0)),
    ]);

    return;
  }

  await Promise.all([
    set(articleBookmarkRef, true),
    set(userBookmarkRef, true),
    runTransaction(counterRef, (cur) => (cur || 0) + 1),
  ]);
}

export function streamBookmarks(articleId, cb) {
  const bookmarkRef = ref(rtdb, `articles/${articleId}/bookmarkedBy`);

  return onValue(bookmarkRef, (snap) => {
    const uids = [];

    snap.forEach((childSnap) => {
      uids.push(childSnap.key);
    });

    cb(uids);
  });
}

export function streamMyBookmarks(userId, cb) {
  if (!userId) return () => {};

  const userBookmarkRef = ref(rtdb, `userBookmarks/${userId}`);

  return onValue(userBookmarkRef, (snap) => {
    const ids = [];

    snap.forEach((childSnap) => {
      ids.push(childSnap.key);
    });

    cb(ids);
  });
}

export function streamBookmarkCount(articleId, cb) {
  return onValue(
    ref(rtdb, `articles/${articleId}/bookmarksCount`),
    (snap) => cb(snap.val() || 0)
  );
}