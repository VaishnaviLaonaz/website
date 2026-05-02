// /* RTDB follow helpers — canonical place for all follow logic */
// import {
//   ref, set, remove, get, runTransaction, onValue,
// } from 'firebase/database';
// import { rtdb } from './firebase';

// /* ---------------- toggle ---------------- */
// export async function toggleFollow(targetUid, actorUid) {
//   if (!targetUid || !actorUid || targetUid === actorUid) return null;

//   const followerRef  = ref(rtdb, `users/${targetUid}/followers/${actorUid}`);
//   const followingRef = ref(rtdb, `users/${actorUid}/following/${targetUid}`);
//   const fCntRef = ref(rtdb, `users/${targetUid}/followersCount`);
//   const gCntRef = ref(rtdb, `users/${actorUid}/followingCount`);

//   const snap = await get(followerRef);
//   const isNowFollowing = !snap.exists();

//   if (isNowFollowing) {
//     await set(followerRef,  true);
//     await set(followingRef, true);
//     await runTransaction(fCntRef, c => (c || 0) + 1);
//     await runTransaction(gCntRef, c => (c || 0) + 1);
//   } else {
//     await remove(followerRef);
//     await remove(followingRef);
//     await runTransaction(fCntRef, c => Math.max((c || 1) - 1, 0));
//     await runTransaction(gCntRef, c => Math.max((c || 1) - 1, 0));
//   }
//   return isNowFollowing;           // true = now following, false = now unfollowed
// }

// /* ---------------- live streams ---------------- */
// export const streamFollowers = (uid, cb) =>
//   onValue(ref(rtdb, `users/${uid}/followers`), s => {
//     const ids = []; s.forEach(c => ids.push(c.key)); cb(ids);
//   });

// export const streamFollowing = (uid, cb) =>
//   onValue(ref(rtdb, `users/${uid}/following`), s => {
//     const ids = []; s.forEach(c => ids.push(c.key)); cb(ids);
//   });

// export const streamFollowersCount  = (uid, cb) =>
//   onValue(ref(rtdb, `users/${uid}/followersCount`), s => cb(s.val() || 0));

// export const streamFollowingCount  = (uid, cb) =>
//   onValue(ref(rtdb, `users/${uid}/followingCount`), s => cb(s.val() || 0));




// /* RTDB follow helpers — canonical place for all follow logic */
// import {
//   ref, set, remove, get, runTransaction, onValue,
// } from 'firebase/database';
// import { rtdb } from './firebase';
// import { db } from './firebase';
// import { getDoc, doc } from 'firebase/firestore';
// import { addNotification } from './notifications';

// export async function toggleFollow(targetUid, actorUid) {
//   if (!targetUid || !actorUid || targetUid === actorUid) return null;

//   /* paths & refs we’ll touch */
//   const followerPath  = `users/${targetUid}/followers/${actorUid}`;
//   const followingPath = `users/${actorUid}/following/${targetUid}`;

//   const followerRef = ref(rtdb, followerPath);
//   const followingRef = ref(rtdb, followingPath);
//   const fCntRef = ref(rtdb, `users/${targetUid}/followersCount`);
//   const gCntRef = ref(rtdb, `users/${actorUid}/followingCount`);

//   /* -----------------------------------------------------------
//      1️⃣  Atomically flip the single “followers” flag.
//          runTransaction guarantees a race-free toggle and
//          avoids stale-cache reads that caused the quick revert.
//   ----------------------------------------------------------- */
//   const { committed, snapshot } = await runTransaction(
//     followerRef,
//     (cur) => (cur ? null : true),    // null = remove (unfollow), true = follow
//     { applyLocally: false }         // prevent double local events
//   );
//   if (!committed) return null;      // nothing changed

//   const isNowFollowing = snapshot.val() === true;

//   /* -----------------------------------------------------------
//      2️⃣  Mirror flag under /following and update the counters
//          – these can run safely after the toggle committed.
//   ----------------------------------------------------------- */
//   if (isNowFollowing) {
//     await set(followingRef, true);
//   } else {
//     await remove(followingRef);
//   }

//   await Promise.all([
//     runTransaction(fCntRef,  c => isNowFollowing ? (c || 0) + 1 : Math.max((c || 1) - 1, 0)),
//     runTransaction(gCntRef,  c => isNowFollowing ? (c || 0) + 1 : Math.max((c || 1) - 1, 0)),
//   ]);

//   /* -----------------------------------------------------------
//      3️⃣  One-time follow notification
//   ----------------------------------------------------------- */
//   if (isNowFollowing) {
//     const actorSnap = await getDoc(doc(db, 'users', actorUid));
//     const actor     = actorSnap.data() || {};
//     await addNotification(targetUid, {
//       type        : 'follow',
//       actorId     : actorUid,
//       actorName   : actor.username ||
//                     [actor.firstName, actor.lastName].filter(Boolean).join(' ') ||
//                     actor.email || 'Someone',
//       actorAvatar : actor.avatarUrl || '',
//     });
//   }

//   return isNowFollowing; // true = now following, false = now unfollowed
// }


// /* ---------------- live streams ---------------- */
// export const streamFollowers = (uid, cb) =>
//   onValue(ref(rtdb, `users/${uid}/followers`), s => {
//     const ids = []; s.forEach(c => ids.push(c.key)); cb(ids);
//   });

// export const streamFollowing = (uid, cb) =>
//   onValue(ref(rtdb, `users/${uid}/following`), s => {
//     const ids = []; s.forEach(c => ids.push(c.key)); cb(ids);
//   });

// export const streamFollowersCount  = (uid, cb) =>
//   onValue(ref(rtdb, `users/${uid}/followersCount`), s => cb(s.val() || 0));

// export const streamFollowingCount  = (uid, cb) =>
//   onValue(ref(rtdb, `users/${uid}/followingCount`), s => cb(s.val() || 0));



// src/configs/follow.js
import {
  ref, set, remove, get, runTransaction, onValue, update
} from 'firebase/database';
import { rtdb, db } from './firebase';
import { doc, getDoc } from 'firebase/firestore';
import { tryNotify } from './notifications';

export async function toggleFollow(targetUid, actorUid) {
  if (!targetUid || !actorUid || targetUid === actorUid) return null;

  const followerRef  = ref(rtdb, `users/${targetUid}/followers/${actorUid}`);
  const followingRef = ref(rtdb, `users/${actorUid}/following/${targetUid}`);
  const cntFRef      = ref(rtdb, `users/${targetUid}/followersCount`);
  const cntGRef      = ref(rtdb, `users/${actorUid}/followingCount`);

  /* current state */
  const already = (await get(followerRef)).exists();
  const nowFollowing = !already;

  if (nowFollowing) {
    /* ---- FOLLOW ---- */
    await Promise.all([
      /* flags */
      set(followerRef,  true),
      set(followingRef, true),

      /* counters */
      runTransaction(cntFRef, c => (c || 0) + 1),
      runTransaction(cntGRef, c => (c || 0) + 1),
    ]);

    /* one-time notification */
    const actorSnap = await getDoc(doc(db, 'users', actorUid));
    const actor     = actorSnap.data() || {};
    tryNotify(targetUid, {
      type        : 'follow',
      actorId     : actorUid,
      actorName   : actor.displayName 
                 || actor.username
                 || [actor.firstName, actor.lastName].filter(Boolean).join(' ')
                 || actor.email
                 || 'Someone',
      actorUsername : actor.username || actorUid,
      actorAvatar   : actor.avatarUrl || actor.photoURL || '',
    });

  } else {
    /* ---- UNFOLLOW ---- */
    await Promise.all([
      remove(followerRef),
      remove(followingRef),
      runTransaction(cntFRef, c => Math.max((c || 1) - 1, 0)),
      runTransaction(cntGRef, c => Math.max((c || 1) - 1, 0)),
    ]);
  }

  return nowFollowing;               // true = following, false = unfollowed
}

/* ---------------- live streams (unchanged) ---------------- */
export const streamFollowers = (uid, cb) =>
  onValue(ref(rtdb, `users/${uid}/followers`), s => {
    const obj = s.val() || {};
    // const ids = []; s.forEach(c => ids.push(c.key)); cb(ids);
    const ids = Object.keys(obj).filter(k => !!obj[k]);
    cb(ids);
  });

export const streamFollowing = (uid, cb) =>
  onValue(ref(rtdb, `users/${uid}/following`), s => {
    const obj = s.val() || {};
    // const ids = []; s.forEach(c => ids.push(c.key)); cb(ids);
    const ids = Object.keys(obj).filter(k => !!obj[k]);;
    cb(ids);
  });

export const streamFollowersCount  = (uid, cb) =>
  onValue(ref(rtdb, `users/${uid}/followersCount`), s => cb(s.val() || 0));

export const streamFollowingCount  = (uid, cb) =>
  onValue(ref(rtdb, `users/${uid}/followingCount`), s => cb(s.val() || 0));


// ADD these new helpers (keep your existing imports at top)
export async function sendFollowRequest(targetUid, actorUid) {
  if (!targetUid || !actorUid || targetUid === actorUid) return;

  const sentRef     = ref(rtdb, `users/${actorUid}/requests/sent/${targetUid}`);
  const recvRef     = ref(rtdb, `users/${targetUid}/requests/received/${actorUid}`);

  await Promise.all([
    set(sentRef, true),
    set(recvRef, true),
  ]);

  // optional: notify target
  try {
    const actorSnap = await getDoc(doc(db, 'users', actorUid));
    const actor = actorSnap.data() || {};
    tryNotify(targetUid, {
      type: 'follow_request',
      actorId: actorUid,
      actorName: actor.username
        || [actor.firstName, actor.lastName].filter(Boolean).join(' ')
        || actor.email
        || 'Someone',
      actorAvatar: actor.avatarUrl || '',
    });
  } catch {}
}

export async function cancelFollowRequest(targetUid, actorUid) {
  if (!targetUid || !actorUid || targetUid === actorUid) return;

  await Promise.all([
    remove(ref(rtdb, `users/${actorUid}/requests/sent/${targetUid}`)),
    remove(ref(rtdb, `users/${targetUid}/requests/received/${actorUid}`)),
  ]);
}

// When target ACCEPTS actor's request.
// It creates the real follower/following relation and updates counters,
// then clears the pending request flags.
export async function acceptFollowRequest(actorUid, targetUid) {
  if (!targetUid || !actorUid || targetUid === actorUid) return;

  const followerRef  = ref(rtdb, `users/${targetUid}/followers/${actorUid}`);
  const followingRef = ref(rtdb, `users/${actorUid}/following/${targetUid}`);
  const cntFRef      = ref(rtdb, `users/${targetUid}/followersCount`);
  const cntGRef      = ref(rtdb, `users/${actorUid}/followingCount`);

  await Promise.all([
    // create relation
    set(followerRef, true),
    set(followingRef, true),
    runTransaction(cntFRef, c => (c || 0) + 1),
    runTransaction(cntGRef, c => (c || 0) + 1),

    // clear request
    remove(ref(rtdb, `users/${actorUid}/requests/sent/${targetUid}`)),
    remove(ref(rtdb, `users/${targetUid}/requests/received/${actorUid}`)),
  ]);
}

// ----- streams for requests -----
export const streamRequestsSent = (uid, cb) =>
  onValue(ref(rtdb, `users/${uid}/requests/sent`), s => {
    const obj = s.val() || {};
    cb(Object.keys(obj).filter(k => !!obj[k]));
  });

export const streamRequestsReceived = (uid, cb) =>
  onValue(ref(rtdb, `users/${uid}/requests/received`), s => {
    const obj = s.val() || {};
    cb(Object.keys(obj).filter(k => !!obj[k]));
  });
