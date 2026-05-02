// // // configs/useArticles.js
// // import { useEffect, useState } from 'react'
// // import {
// //   streamAllArticles,
// //   createArticle as firebaseCreate,
// //   updateArticle as firebaseUpdate,
// //   deleteArticle as firebaseDelete,

// //   likeArticle as firebaseLike,
// //   streamLikes as firebaseStreamLikes,
// //   addComment as firebaseAddComment,
// //   streamComments as firebaseStreamComments,
// //   updateComment as firebaseUpdateComment,
// //   deleteComment as firebaseDeleteComment,
// //   likeComment as firebaseLikeComment,
// //   streamCommentLikes as firebaseStreamCommentLikes,
  
// //   incrementView          as fbIncrementView,   
// //   streamViews            as fbStreamViews,
// // } from './articles'

// // /**
// //  * Real-time hook: returns an array of the most recent limit articles.
// //  */
// // export function useArticles(limit = 20) {
// //   const [articles, setArticles] = useState([])
// //   useEffect(() => {
// //     const unsubscribe = streamAllArticles(setArticles, limit)
// //     return unsubscribe
// //   }, [limit])
// //   return articles
// // }

// // /** Simple wrappers for imperative calls */
// // export function createArticle(article) {
// //   return firebaseCreate(article)
// // }
// // export function updateArticle(id, updates) {
// //   return firebaseUpdate(id, updates)
// // }
// // export function deleteArticle(id) {
// //   return firebaseDelete(id)
// // }



// // export function likeArticle(articleId, userId) {
// //   return firebaseLike(articleId, userId)
// // }
// // export function streamLikes(articleId, callback) {
// //   return firebaseStreamLikes(articleId, callback)
// // }
// // export function addComment(articleId, comment) {
// //   return firebaseAddComment(articleId, comment)
// // }
// // export function streamComments(articleId, callback, limit) {
// //   return firebaseStreamComments(articleId, callback, limit)
// // }

// // export function updateComment(articleId, commentId, updates) {
// //   return firebaseUpdateComment(articleId, commentId, updates);
// // }
// // export function deleteComment(articleId, commentId) {
// //   return firebaseDeleteComment(articleId, commentId);
// // }
// // export function likeComment(articleId, commentId, userId) {
// //   return firebaseLikeComment(articleId, commentId, userId);
// // }
// // export function streamCommentLikes(articleId, cb) {
// //   return firebaseStreamCommentLikes(articleId, cb);
// // }




// // /* ─────────── Views (NEW) ─────────── */
// // export const incrementView  = (id, uid)      => fbIncrementView(id, uid);
// // export const streamViews    = (id, cb)       => fbStreamViews(id, cb);




// // configs/useArticles.js
// import { useEffect, useState } from 'react';
// import {
//   streamAllArticles as fbStreamAllArticles,
//   createArticle  as fbCreate,
//   updateArticle  as fbUpdate,
//   deleteArticle  as fbDelete,
//   likeArticle    as fbLike,
//   streamLikes    as fbStreamLikes,
//   addComment     as fbAddComment,
//   streamComments as fbStreamComments,
//   updateComment  as fbUpdateComment,
//   deleteComment  as fbDeleteComment,
//   likeComment    as fbLikeComment,
//   streamCommentLikes as fbStreamCommentLikes,
//   streamCommentCount as fbStreamCommentCount,   // ➜ NEW
//   incrementView  as fbIncrementView,
//   streamViews    as fbStreamViews,
//   toggleBookmark   as fbToggleBookmark,
//   streamBookmarks  as fbStreamBookmarks,
  
// } from './articles';

// /* ─────────── real-time list ─────────── */
// export function useArticles(limit = 20) {
//   const [articles, setArticles] = useState([]);
//   useEffect(() => {
//     const unsub = streamAllArticles(setArticles, limit);
//     return unsub;
//   }, [limit]);
//   return articles;
// }

// export const streamAllArticles = (cb, limit = 20)       => fbStreamAllArticles(cb, limit);

// /* ─────────── simple wrappers (unchanged) ─────────── */
// export const createArticle  = a            => fbCreate(a);
// export const updateArticle  = (id, u)      => fbUpdate(id, u);
// export const deleteArticle  = id           => fbDelete(id);

// export const likeArticle    = (id, uid)    => fbLike(id, uid);
// export const streamLikes    = (id, cb)     => fbStreamLikes(id, cb);

// export const addComment     = (id, c)      => fbAddComment(id, c);
// export const streamComments = (id, cb, l)  => fbStreamComments(id, cb, l);
// export const updateComment  = (aid, cid,u) => fbUpdateComment(aid,cid,u);
// export const deleteComment  = (aid, cid)   => fbDeleteComment(aid,cid);
// export const likeComment    = (aid,cid,uid)=> fbLikeComment(aid,cid,uid);
// export const streamCommentLikes = (aid,cb) => fbStreamCommentLikes(aid,cb);

// /* views */
// export const incrementView  = (id, uid)    => fbIncrementView(id, uid);
// export const streamViews    = (id, cb)     => fbStreamViews(id, cb);

// /* NEW – comment counter helper if you need it */
// export const streamCommentCount = (id, cb) => fbStreamCommentCount(id, cb);


// export const toggleBookmark  = (id, uid) => fbToggleBookmark(id, uid);
// export const streamBookmarks = (id, cb)  => fbStreamBookmarks(id, cb);





// configs/useArticles.js
import { useEffect, useState } from 'react';
import {
  streamAllArticles as fbStreamAllArticles,
  createArticle  as fbCreate,
  updateArticle  as fbUpdate,
  deleteArticle  as fbDelete,
  likeArticle    as fbLike,
  streamLikes    as fbStreamLikes,
  addComment     as fbAddComment,
  streamComments as fbStreamComments,
  updateComment  as fbUpdateComment,
  deleteComment  as fbDeleteComment,
  likeComment    as fbLikeComment,
  streamCommentLikes as fbStreamCommentLikes,
  streamCommentCount as fbStreamCommentCount,   // ➜ NEW
  incrementView  as fbIncrementView,
  streamViews    as fbStreamViews,
  toggleBookmark   as fbToggleBookmark,
  streamBookmarks  as fbStreamBookmarks,
  streamMyBookmarks as fbStreamMyBookmarks,
  streamLikeCount as fbStreamLikeCount,
  streamBookmarkCount  as fbStreamBookmarkCount,

  /* drafts */
  streamMyDrafts as fbStreamMyDrafts,
  createDraft as fbCreateDraft,
  updateDraft as fbUpdateDraft,
  deleteDraft as fbDeleteDraft,
  getDraftOnce as fbGetDraftOnce,
  
} from './articles';

/* ─────────── real-time list ─────────── */
export function useArticles(limit = 20) {
  const [articles, setArticles] = useState([]);
  useEffect(() => {
    const unsub = streamAllArticles(setArticles, limit);
    return unsub;
  }, [limit]);
  return articles;
}

/* drafts hook */
export function useMyDrafts(uid, limit = 100) {
  const [drafts, setDrafts] = useState([]);
  useEffect(() => fbStreamMyDrafts(uid, setDrafts, limit), [uid, limit]);
  return drafts;
}

export const streamAllArticles = (cb, limit = 20)       => fbStreamAllArticles(cb, limit);

export const streamBookmarkCount = (id, cb) => fbStreamBookmarkCount(id, cb);
/* ─────────── simple wrappers (unchanged) ─────────── */
export const createArticle  = a            => fbCreate(a);
export const updateArticle  = (id, u)      => fbUpdate(id, u);
export const deleteArticle  = id           => fbDelete(id);

export const likeArticle    = (id, uid)    => fbLike(id, uid);
export const streamLikes    = (id, cb)     => fbStreamLikes(id, cb);

export const addComment     = (id, c)      => fbAddComment(id, c);
export const streamComments = (id, cb, l)  => fbStreamComments(id, cb, l);
export const updateComment  = (aid, cid,u) => fbUpdateComment(aid,cid,u);
export const deleteComment  = (aid, cid)   => fbDeleteComment(aid,cid);
export const likeComment    = (aid,cid,uid)=> fbLikeComment(aid,cid,uid);
export const streamCommentLikes = (aid,cb) => fbStreamCommentLikes(aid,cb);

/* views */
export const incrementView  = (id, uid)    => fbIncrementView(id, uid);
export const streamViews    = (id, cb)     => fbStreamViews(id, cb);

/* NEW – comment counter helper if you need it */
export const streamCommentCount = (id, cb) => fbStreamCommentCount(id, cb);


export const toggleBookmark  = (id, uid) => fbToggleBookmark(id, uid);
export const streamBookmarks = (id, cb)  => fbStreamBookmarks(id, cb);

export const streamMyBookmarks = (id, cb) => fbStreamMyBookmarks(id, cb);
export const streamLikeCount = (id, cb) => fbStreamLikeCount(id, cb);


/* drafts ops */
export const streamMyDrafts = (uid, cb, l) => fbStreamMyDrafts(uid, cb, l);
export const createDraft    = (uid, d)     => fbCreateDraft(uid, d);
export const updateDraft    = (uid, id, u) => fbUpdateDraft(uid, id, u);
export const deleteDraft    = (uid, id)    => fbDeleteDraft(uid, id);
export const getDraftOnce   = (uid, id)    => fbGetDraftOnce(uid, id);