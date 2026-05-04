// configs/notifications.js
import {
  collection,
  getDocs, doc, getDoc,
  addDoc,
  serverTimestamp,
  query,
  where,
  onSnapshot
} from 'firebase/firestore';
import { db } from './firebase';

/* ───────────── create a notification ───────────── */
export async function addNotification(userId, data) {
  await addDoc(collection(db, 'users', userId, 'notifications'), {
    ...data,
    read: false,
    createdAt: serverTimestamp()
  });
}

/* ───────────── live unread-count stream ─────────── */
export function streamUnreadNotifications(userId, setCount) {
  const q = query(
    collection(db, 'users', userId, 'notifications'),
    where('read', '==', false)
  );
  return onSnapshot(q, (snap) => setCount(snap.size));
}

export async function tryNotify(userId, data) {
  try   { 
    const q = query(
      collection(db, 'users', userId, 'notifications'),
      where('type', '==', data.type),
      where('actorId', '==', data.actorId),
      where('articleId', '==', data.articleId || null),
    );
    const snap = await getDocs(q);
    if (!snap.empty) return;
    await addNotification(userId, data); }
  catch (e) { console.warn('notification skipped:', e?.message || e); }
}


export async function notifyAllUsersArticlePublish(authorUid, articleId, articleTitle) {
  try {
    // get author info
    const authorSnap = await getDoc(doc(db, "users", authorUid));
    const author = authorSnap.data() || {};
    if (!author.username) return;
    const authorName =
      author.displayName ||
      author.username ||
      author.email?.split("@")[0] ||
      "Someone";

    const authorUsername = author.username;
    const authorAvatar = author.avatarUrl || "";
  //  const authorAvatar = author.avatarUrl || author.photoURL || "";
    // fetch all users
    const snap = await getDocs(collection(db, "users"));

    // loop through all users and notify
    snap.forEach((u) => {
      if (u.id === authorUid) return; // don't notify author

      tryNotify(u.id, {
        type: "article-publish",
        actorId: authorUid,
        actorName: authorName,
        actorUsername: authorUsername,
        actorAvatar: authorAvatar,
        articleId,
        articleTitle,
      });
    });

  } catch (err) {
    console.error("notifyAllUsersArticlePublish failed", err);
  }
}


// src/configs/notifications.js

// import {
//   collection,
//   getDocs,
//   doc,
//   getDoc,
//   addDoc,
//   serverTimestamp,
//   query,
//   where,
//   onSnapshot,
// } from "firebase/firestore";

// import { db } from "./firebase";

// export async function addNotification(userId, data) {
//   if (!userId) return;

//   await addDoc(collection(db, "users", userId, "notifications"), {
//     type: data.type || "",
//     actorId: data.actorId || "",
//     actorName: data.actorName || "Someone",
//     actorUsername: data.actorUsername || "",
//     actorAvatar: data.actorAvatar || "",
//     articleId: data.articleId || null,
//     articleTitle: data.articleTitle || "",
//     commentId: data.commentId || null,
//     read: false,
//     createdAt: serverTimestamp(),
//   });
// }

// export function streamUnreadNotifications(userId, setCount) {
//   if (!userId) return () => {};

//   const q = query(
//     collection(db, "users", userId, "notifications"),
//     where("read", "==", false)
//   );

//   return onSnapshot(
//     q,
//     (snap) => setCount(snap.size),
//     (err) => {
//       console.error("Unread notification stream failed:", err);
//       setCount(0);
//     }
//   );
// }

// export async function tryNotify(userId, data) {
//   try {
//     if (!userId || !data?.type || !data?.actorId) return;

//     const q = query(
//       collection(db, "users", userId, "notifications"),
//       where("type", "==", data.type),
//       where("actorId", "==", data.actorId),
//       where("articleId", "==", data.articleId || null)
//     );

//     const snap = await getDocs(q);
//     if (!snap.empty) return;

//     await addNotification(userId, data);
//   } catch (e) {
//     console.warn("notification skipped:", e?.message || e);
//   }
// }

// export async function notifyAllUsersArticlePublish(authorUid, articleId, articleTitle) {
//   try {
//     if (!authorUid || !articleId) return;

//     const authorSnap = await getDoc(doc(db, "users", authorUid));
//     const author = authorSnap.data() || {};

//     const authorName =
//       author.displayName ||
//       `${author.firstName || ""} ${author.lastName || ""}`.trim() ||
//       author.username ||
//       author.email?.split("@")[0] ||
//       "Someone";

//     const authorUsername = author.username || "";
//     const authorAvatar = author.avatarUrl || author.photoURL || "";

//     const usersSnap = await getDocs(collection(db, "users"));

//     const notificationTasks = [];

//     usersSnap.forEach((userDoc) => {
//       if (userDoc.id === authorUid) return;

//       notificationTasks.push(
//         tryNotify(userDoc.id, {
//           type: "article-publish",
//           actorId: authorUid,
//           actorName: authorName,
//           actorUsername: authorUsername,
//           actorAvatar: authorAvatar,
//           articleId,
//           articleTitle: articleTitle || "a new article",
//         })
//       );
//     });

//     await Promise.all(notificationTasks);
//   } catch (err) {
//     console.error("notifyAllUsersArticlePublish failed", err);
//   }
// }