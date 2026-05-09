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



//working before cost cutting code

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
//   streamMyBookmarks as fbStreamMyBookmarks,
//   streamLikeCount as fbStreamLikeCount,
//   streamBookmarkCount  as fbStreamBookmarkCount,

//   /* drafts */
//   streamMyDrafts as fbStreamMyDrafts,
//   createDraft as fbCreateDraft,
//   updateDraft as fbUpdateDraft,
//   deleteDraft as fbDeleteDraft,
//   getDraftOnce as fbGetDraftOnce,
  
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

// /* drafts hook */
// export function useMyDrafts(uid, limit = 100) {
//   const [drafts, setDrafts] = useState([]);
//   useEffect(() => fbStreamMyDrafts(uid, setDrafts, limit), [uid, limit]);
//   return drafts;
// }

// export const streamAllArticles = (cb, limit = 20)       => fbStreamAllArticles(cb, limit);

// export const streamBookmarkCount = (id, cb) => fbStreamBookmarkCount(id, cb);
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

// export const streamMyBookmarks = (id, cb) => fbStreamMyBookmarks(id, cb);
// export const streamLikeCount = (id, cb) => fbStreamLikeCount(id, cb);


// /* drafts ops */
// export const streamMyDrafts = (uid, cb, l) => fbStreamMyDrafts(uid, cb, l);
// export const createDraft    = (uid, d)     => fbCreateDraft(uid, d);
// export const updateDraft    = (uid, id, u) => fbUpdateDraft(uid, id, u);
// export const deleteDraft    = (uid, id)    => fbDeleteDraft(uid, id);
// export const getDraftOnce   = (uid, id)    => fbGetDraftOnce(uid, id);

//end this above is working code before cost cutting



// src/configs/useArticles.js
import { useEffect, useState } from 'react';

import {
  streamAllArticles as fbStreamAllArticles,
  getArticlesOnce as fbGetArticlesOnce,
  getMyArticlesOnce as fbGetMyArticlesOnce,
  getBookmarkedArticlesOnce as fbGetBookmarkedArticlesOnce,
  getArticleBodyOnce as fbGetArticleBodyOnce,
  getArticleWithBodyOnce as fbGetArticleWithBodyOnce,

  createArticle as fbCreate,
  updateArticle as fbUpdate,
  deleteArticle as fbDelete,

  likeArticle as fbLike,
  streamLikes as fbStreamLikes,
  streamLikeCount as fbStreamLikeCount,

  addComment as fbAddComment,
  streamComments as fbStreamComments,
  updateComment as fbUpdateComment,
  deleteComment as fbDeleteComment,
  likeComment as fbLikeComment,
  streamCommentLikes as fbStreamCommentLikes,
  streamCommentCount as fbStreamCommentCount,

  incrementView as fbIncrementView,
  streamViews as fbStreamViews,

  toggleBookmark as fbToggleBookmark,
  streamBookmarks as fbStreamBookmarks,
  streamMyBookmarks as fbStreamMyBookmarks,
  streamBookmarkCount as fbStreamBookmarkCount,

  /* drafts */
  streamMyDrafts as fbStreamMyDrafts,
  createDraft as fbCreateDraft,
  updateDraft as fbUpdateDraft,
  deleteDraft as fbDeleteDraft,
  getDraftOnce as fbGetDraftOnce,
} from './articles';

/* ─────────── cost-safe one-time article list ─────────── */
/**
 * Phase 2 improvement:
 * Earlier this hook kept a realtime listener open.
 * Now it fetches limited articles once, which reduces RTDB reads/downloads.
 *
 * Existing streamAllArticles() is still exported below for components
 * that intentionally need realtime updates.
 */
export function useArticles(limit = 12) {
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    let alive = true;

    fbGetArticlesOnce(limit)
      .then((items) => {
        if (alive) setArticles(items);
      })
      .catch((err) => {
        console.error('useArticles:', err);
        if (alive) setArticles([]);
      });

    return () => {
      alive = false;
    };
  }, [limit]);

  return articles;
}

export function useLiveArticles(limit = 12) {
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    const unsubscribe = fbStreamAllArticles(setArticles, limit);

    return () => {
      if (typeof unsubscribe === 'function') {
        unsubscribe();
      }
    };
  }, [limit]);

  return articles;
}

/* ─────────── cost-safe current user's articles ─────────── */
/**
 * Use this on profile/my articles page.
 * It avoids loading global articles and filtering in frontend.
 */
export function useMyRtdbArticles(uid, limit = 50) {
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    let alive = true;

    if (!uid) {
      setArticles([]);
      return () => {
        alive = false;
      };
    }

    fbGetMyArticlesOnce(uid, limit)
      .then(async (items) => {
        if (items.length > 0) {
          if (alive) setArticles(items);
          return;
        }

        // fallback: old working behavior, but limited
        const fallback = await fbGetArticlesOnce(100);
        const mine = fallback
          .filter((article) => article.authorId === uid)
          .slice(0, limit);

        if (alive) setArticles(mine);
      })
      .catch(async (err) => {
        console.error('useMyRtdbArticles:', err);

        try {
          const fallback = await fbGetArticlesOnce(100);
          const mine = fallback
            .filter((article) => article.authorId === uid)
            .slice(0, limit);

          if (alive) setArticles(mine);
        } catch (fallbackErr) {
          console.error('useMyRtdbArticles fallback:', fallbackErr);
          if (alive) setArticles([]);
        }
      });

    return () => {
      alive = false;
    };
  }, [uid, limit]);

  return articles;
}

/* ─────────── cost-safe bookmarked articles ─────────── */
/**
 * Use this on profile/bookmarked articles page.
 * It reads only user's bookmarked article ids, then those article records.
 */
export function useBookmarkedArticles(uid, limit = 50) {
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    let alive = true;

    if (!uid) {
      setArticles([]);
      return () => {
        alive = false;
      };
    }

    fbGetBookmarkedArticlesOnce(uid, limit)
      .then(async (items) => {
        if (items.length > 0) {
          if (alive) setArticles(items);
          return;
        }

        // fallback: old working behavior, but limited
        const fallback = await fbGetArticlesOnce(100);
        const bookmarked = fallback
          .filter(
            (article) =>
              article.bookmarkedBy &&
              Object.prototype.hasOwnProperty.call(article.bookmarkedBy, uid)
          )
          .slice(0, limit);

        if (alive) setArticles(bookmarked);
      })
      .catch(async (err) => {
        console.error('useBookmarkedArticles:', err);

        try {
          const fallback = await fbGetArticlesOnce(100);
          const bookmarked = fallback
            .filter(
              (article) =>
                article.bookmarkedBy &&
                Object.prototype.hasOwnProperty.call(article.bookmarkedBy, uid)
            )
            .slice(0, limit);

          if (alive) setArticles(bookmarked);
        } catch (fallbackErr) {
          console.error('useBookmarkedArticles fallback:', fallbackErr);
          if (alive) setArticles([]);
        }
      });

    return () => {
      alive = false;
    };
  }, [uid, limit]);

  return articles;
}

/* ─────────── drafts hook ─────────── */
export function useMyDrafts(uid, limit = 100) {
  const [drafts, setDrafts] = useState([]);

  useEffect(() => {
    if (!uid) {
      setDrafts([]);
      return () => {};
    }

    return fbStreamMyDrafts(uid, setDrafts, limit);
  }, [uid, limit]);

  return drafts;
}

/* ─────────── articles wrappers ─────────── */
export const streamAllArticles = (cb, limit = 20) =>
  fbStreamAllArticles(cb, limit);

export const getArticlesOnce = (limit = 12) =>
  fbGetArticlesOnce(limit);

export const getMyArticlesOnce = (uid, limit = 50) =>
  fbGetMyArticlesOnce(uid, limit);

export const getBookmarkedArticlesOnce = (uid, limit = 50) =>
  fbGetBookmarkedArticlesOnce(uid, limit);

export const getArticleBodyOnce = (id) =>
  fbGetArticleBodyOnce(id);

export const getArticleWithBodyOnce = (id) =>
  fbGetArticleWithBodyOnce(id);

export const createArticle = (article) =>
  fbCreate(article);

export const updateArticle = (id, updates) =>
  fbUpdate(id, updates);

export const deleteArticle = (id) =>
  fbDelete(id);

/* ─────────── likes wrappers ─────────── */
export const likeArticle = (id, uid) =>
  fbLike(id, uid);

export const streamLikes = (id, cb) =>
  fbStreamLikes(id, cb);

export const streamLikeCount = (id, cb) =>
  fbStreamLikeCount(id, cb);

/* ─────────── comments wrappers ─────────── */
export const addComment = (id, comment) =>
  fbAddComment(id, comment);

export const streamComments = (id, cb, limit) =>
  fbStreamComments(id, cb, limit);

export const updateComment = (articleId, commentId, updates) =>
  fbUpdateComment(articleId, commentId, updates);

export const deleteComment = (articleId, commentId) =>
  fbDeleteComment(articleId, commentId);

export const likeComment = (articleId, commentId, uid) =>
  fbLikeComment(articleId, commentId, uid);

export const streamCommentLikes = (articleId, cb) =>
  fbStreamCommentLikes(articleId, cb);

export const streamCommentCount = (id, cb) =>
  fbStreamCommentCount(id, cb);

/* ─────────── views wrappers ─────────── */
export const incrementView = (id, uid, authorId = null) =>
  fbIncrementView(id, uid, authorId);

export const streamViews = (id, cb) =>
  fbStreamViews(id, cb);

/* ─────────── bookmarks wrappers ─────────── */
export const toggleBookmark = (id, uid) =>
  fbToggleBookmark(id, uid);

export const streamBookmarks = (id, cb) =>
  fbStreamBookmarks(id, cb);

export const streamMyBookmarks = (uid, cb) =>
  fbStreamMyBookmarks(uid, cb);

export const streamBookmarkCount = (id, cb) =>
  fbStreamBookmarkCount(id, cb);

/* ─────────── drafts wrappers ─────────── */
export const streamMyDrafts = (uid, cb, limit) =>
  fbStreamMyDrafts(uid, cb, limit);

export const createDraft = (uid, draft) =>
  fbCreateDraft(uid, draft);

export const updateDraft = (uid, id, updates) =>
  fbUpdateDraft(uid, id, updates);

export const deleteDraft = (uid, id) =>
  fbDeleteDraft(uid, id);

export const getDraftOnce = (uid, id) =>
  fbGetDraftOnce(uid, id);