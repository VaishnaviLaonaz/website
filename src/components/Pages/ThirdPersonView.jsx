// import React, { useEffect, useState } from "react";
// import {
//   MDBContainer, MDBRow, MDBCol, MDBCard, MDBCardBody, MDBCardImage,
//   MDBBtn, MDBIcon
// } from "mdb-react-ui-kit";
// import { useParams, Link } from "react-router-dom";
// import { db } from "../../configs/firebase";            // Firestore instance
// import {
//   collection, query, where, getDocs,
// } from "firebase/firestore";
// import { getDatabase, ref as dbRef, query as rtdbQuery,
//          orderByChild, equalTo, get as rtdbGet } from "firebase/database";
// import { useAuth } from "../../context/AuthContext";
// import ArticleCard from "../cards/ArticleCard";
// /* ----------- reusable article card ----------- */
// // function ArticleCard({ a }) {
// //   return (
// //     <MDBCard className="border-0 shadow-sm h-100">
// //       <MDBCardImage src={a.coverUrl} alt={a.title} position="top" />
// //       <MDBCardBody className="px-2 py-3">
// //         <h6 className="fw-semibold mb-1">{a.title}</h6>
// //         <p className="text-muted small mb-1">{a.body}</p>
// //         <div className="text-muted small d-flex align-items-center gap-3">
// //           <span>{new Date(a.createdAt).toLocaleDateString()}</span>
// //           <span className="d-flex align-items-center gap-1">
// //             <MDBIcon far icon="eye" /> {a.views || 0}
// //           </span>
// //         </div>
// //       </MDBCardBody>
// //     </MDBCard>
// //   );
// // }

// export default function ThirdPersonView() {
//   const { username } = useParams();       // pretty URL param
//   const { currentUser } = useAuth();
//   const viewerId = currentUser?.uid;

//   const [profile, setProfile] = useState(null);   // Firestore user doc
//   const [articles, setArticles] = useState([]);   // Realtime-DB list

//   /* ---- Fetch user profile by username (Firestore) ---- */
//   useEffect(() => {
//     getDocs(
//       query(collection(db, "users"), where("username", "==", username))
//     ).then((snap) => {
//       if (!snap.empty) {
//         const d = snap.docs[0];
//         setProfile({ uid: d.id, ...d.data() });
//       }
//     });
//   }, [username]);

//   /* ---- Fetch author’s articles from RTDB ---- */
//   useEffect(() => {
//     if (!profile) return;
//     const rtdb = getDatabase();   // uses same Firebase app
//     const q = rtdbQuery(
//       dbRef(rtdb, "articles"),
//       orderByChild("authorId"),
//       equalTo(profile.uid)
//     );
//     rtdbGet(q).then((snap) => {
//       if (snap.exists()) {
//         const list = Object.entries(snap.val()).map(([id, v]) => ({
//           id,
//           ...v,
//         }));
//         setArticles(list);
//       } else {
//         setArticles([]);
//       }
//     });
//   }, [profile]);

//   if (!profile) return null;

//   /* ---- styling helpers ---- */
//   const panel = { background: "#f5f6eb", borderRadius: 22 };
//   const avatarStyle = {
//     width: 100, height: 100, objectFit: "cover", borderRadius: "50%",
//     border: "4px solid #fff", boxShadow: "0 3px 10px rgba(0,0,0,.07)",
//   };

//   return (
//     <main style={{ background: "#f3f3f4" }} className="py-5">
//       <MDBContainer>
//         <MDBRow className="justify-content-center">
//           <MDBCol lg="10" xl="8">
//             <div style={panel} className="p-4 p-md-5 text-center">
//               {/* member since */}
//               {profile.memberSince && (
//                 <p className="text-muted small mb-3">
//                   Member since {profile.memberSince}
//                 </p>
//               )}

//               {/* avatar + info */}
//               <img src={profile.avatarUrl || "/avatar.svg"} alt="" style={avatarStyle} />
//               <h5 className="fw-bold mt-3 mb-1">{profile.displayName}</h5>
//               <p className="text-uppercase small text-muted mb-1">
//                 @{profile.username}
//               </p>
//               <p className="text-muted mb-3">
//                 {profile.role} in {profile.location}
//               </p>

//               {/* bio */}
//               {profile.bio && (
//                 <p className="mx-auto mb-4" style={{ maxWidth: 550, fontSize: ".93rem" }}>
//                   “{profile.bio}”
//                 </p>
//               )}

//               {/* follows */}
//               <div className="d-flex flex-column align-items-center mb-5">
//                 <div className="d-flex gap-4 fw-semibold mb-3">
//                   <span className="text-decoration-underline">
//                     {profile.followers?.length || 0} followers
//                   </span>
//                   <span className="text-decoration-underline">
//                     {profile.following?.length || 0} following
//                   </span>
//                 </div>

//                 {/* follow button only if viewer ≠ owner */}
//                 {viewerId && viewerId !== profile.uid && (
//                   <MDBBtn
//                     className="rounded-pill px-5 py-2 fw-semibold text-white"
//                     style={{ background: "#566736", border: "2px solid #000" }}
//                   >
//                     Follow
//                   </MDBBtn>
//                 )}
//               </div>

//               {/* Articles */}
//               <h5 className="text-start mb-3">Articles</h5>
//               {articles.length === 0 ? (
//                 <p className="text-muted">No articles yet.</p>
//               ) : (
//                 <MDBRow className="g-4">
//                   {articles.map((a) => (
//                     <MDBCol md="4" sm="6" xs="12" key={a.id}>
//                       <ArticleCard article={a} author={profile} />
//                     </MDBCol>
//                   ))}
//                 </MDBRow>
//               )}

//               <Link
//                 to="/articles"
//                 className="d-inline-block mt-4 fw-semibold small text-decoration-underline"
//               >
//                 View More
//               </Link>
//             </div>
//           </MDBCol>
//         </MDBRow>
//       </MDBContainer>
//     </main>
//   );
// }


// ThirdPersonView
import React, { useEffect, useState } from "react";
import {
  MDBContainer, MDBRow, MDBCol, MDBCard, MDBCardBody, MDBCardImage,
  MDBBtn, MDBIcon,
} from "mdb-react-ui-kit";
import { useParams, Link } from "react-router-dom";
import {
  collection, query, where, getDocs, doc, getDoc,
} from "firebase/firestore";
import {
  getDatabase, ref as dbRef, query as rtdbQuery,
  orderByChild, equalTo, get as rtdbGet,
} from "firebase/database";

import { db } from "../../configs/firebase";           // Firestore instance
import { useAuth } from "../../context/AuthContext";
import ArticleCard from "../cards/ArticleCard";

/* follow helpers + overlays */
import {
  streamFollowersCount, streamFollowingCount,
  streamFollowers, streamFollowing, toggleFollow,
} from "../../configs/follow";
import FollowersOverlay from "../Layout/FollowersOverlay";
import FollowingOverlay from "../Layout/FollowingOverlay";
import "../../styles/follow.css";

export default function ThirdPersonView() {
  const { username } = useParams();          // pretty URL
  const { currentUser } = useAuth();
  const viewerId = currentUser?.uid;

  const [profile,  setProfile]  = useState(null);  // Firestore user doc
  const [articles, setArticles] = useState([]);    // RTDB list

  /* follow state */
  const [followersCnt, setFollowersCnt] = useState(0);
  const [followingCnt, setFollowingCnt] = useState(0);
  const [followersIds, setFollowersIds] = useState([]);
  const [followingIds, setFollowingIds] = useState([]);
  const [iFollow,      setIFollow]      = useState(false);

  /* overlays */
  const [showFollowers, setShowFollowers] = useState(false);
  const [showFollowing, setShowFollowing] = useState(false);
  const [followersList, setFollowersList] = useState([]);
  const [followingList, setFollowingList] = useState([]);

  /* ───── fetch profile by username (Firestore) ───── */
  useEffect(() => {
    (async () => {
      const snap = await getDocs(query(collection(db, "users"), where("username", "==", username)));
      if (!snap.empty) {
        const d = snap.docs[0];
        setProfile({ uid: d.id, ...d.data() });
      }
    })();
  }, [username]);

  /* ───── articles by this author (RTDB) ───── */
  useEffect(() => {
    if (!profile) return;
    const rtdb = getDatabase();
    const q = rtdbQuery(
      dbRef(rtdb, "articles"),
      orderByChild("authorId"),
      equalTo(profile.uid),
    );
    rtdbGet(q).then(snap => {
      if (!snap.exists()) { setArticles([]); return; }
      const list = Object.entries(snap.val()).map(([id, v]) => ({ id, ...v }));
      setArticles(list);
    });
  }, [profile]);

  /* ───── live followers / following ───── */
  useEffect(() => {
    if (!profile?.uid) return;
    const u1 = streamFollowersCount(profile.uid, setFollowersCnt);
    const u2 = streamFollowingCount(profile.uid, setFollowingCnt);
    const u3 = streamFollowers(profile.uid,       setFollowersIds);
    const u4 = streamFollowing(viewerId, ids =>   setIFollow(ids.includes(profile.uid)));
    const u5 = streamFollowing(profile.uid,       setFollowingIds);
    return () => { u1(); u2(); u3(); u4(); u5(); };
  }, [profile?.uid, viewerId]);

  /* ───── overlay hydration helpers ───── */
  const hydrate = async (ids, setter) => {
    const docs = await Promise.all(ids.map(async id => {
      const s = await getDoc(doc(db, "users", id));
      return s.exists()
        ? {
            uid: id,
            name: s.data().displayName,
            username: s.data().username,
            avatar: s.data().avatarUrl || "https://placehold.co/48x48",
            isFollowing: followingIds.includes(id),
          }
        : null;
    }));
    setter(docs.filter(Boolean));
  };
  const openFollowers  = async () => { await hydrate(followersIds, setFollowersList); setShowFollowers(true); };
  const openFollowing  = async () => { await hydrate(followingIds, setFollowingList); setShowFollowing(true); };

  /* ───── follow / unfollow ───── */
  // const handleToggleFollow = async () => {
  //       if (!viewerId) return;      
  //       /* 🚀 optimistic UI -------- */
  //       setIFollow(prev => !prev);                         // flip button instantly
  //       setFollowingIds(prev =>
  //         prev.includes(profile.uid)                       // keep local list in sync
  //           ? prev.filter(id => id !== profile.uid)
  //           : [...prev, profile.uid]
  //       );      
  //       /* write to RTDB (listener will re-sync) */
  //       try {
  //         await toggleFollow(profile.uid, viewerId);
  //       } catch (e) {
  //         // roll back if something went wrong
  //         console.error(e);
  //         setIFollow(prev => !prev);
  //       }
  //     };
  const handleToggleFollow = async () => {
         if (!viewerId) return;
     
         /* optimistic flip */
         const optimistic = !iFollow;
         setIFollow(optimistic);
     
         /* keep local arrays in sync so overlays feel snappy */
         setFollowingIds(prev =>
           optimistic
             ? [...prev, profile.uid]
             : prev.filter(id => id !== profile.uid)
         );
     
         try {
           /* ⬇️ this returns the *authoritative* state (true / false) */
           const finalState = await toggleFollow(profile.uid, viewerId);
           setIFollow(finalState);          // 🡐 guarantee the label is right
         } catch (err) {
           console.error(err);
           setIFollow(!optimistic);         // roll-back on error
         }
       };

  /* ───── guards ───── */
  if (!profile) return null;

  /* ───── styling helpers ───── */
  const panel = { background: "#f5f6eb", borderRadius: 22 };
  const avatarStyle = {
    width: 100, height: 100, objectFit: "cover", borderRadius: "50%",
    border: "4px solid #fff", boxShadow: "0 3px 10px rgba(0,0,0,.07)",
  };

  return (
    <main style={{ background: "#f3f3f4" }} className="py-5">
      <MDBContainer>
        <MDBRow className="justify-content-center">
          <MDBCol lg="10" xl="8">
            <div style={panel} className="p-4 p-md-5 text-center">
              {/* member since */}
              {profile.memberSince && (
                <p className="text-muted small mb-3">
                  Member since {profile.memberSince}
                </p>
              )}

              {/* avatar & names */}
              <img src={profile.avatarUrl} alt="" style={avatarStyle} />
              <h5 className="fw-bold mt-3 mb-1">{profile.displayName}</h5>
              <p className="text-uppercase small text-muted mb-1">@{profile.username}</p>
              <p className="text-muted mb-3">{profile.role} in {profile.location}</p>

              {profile.bio && (
                <p className="mx-auto mb-4" style={{ maxWidth: 550, fontSize: ".93rem" }}>
                  “{profile.bio}”
                </p>
              )}

              {/* follow counters & button */}
              <div className="d-flex flex-column align-items-center mb-5">
                <div className="d-flex gap-4 fw-semibold mb-3">
                  <span role="button" className="text-decoration-underline"
                        onClick={openFollowers}>
                    {followersCnt} followers
                  </span>
                  <span role="button" className="text-decoration-underline"
                        onClick={openFollowing}>
                    {followingCnt} following
                  </span>
                </div>

                {viewerId && viewerId !== profile.uid && (
                  iFollow ? (
                    <MDBBtn
                      outline
                      className="btn-following"
                      onClick={handleToggleFollow}
                    >
                      Following
                    </MDBBtn>
                  ) : (
                    <MDBBtn
                      className="btn-follow"
                      onClick={handleToggleFollow}
                    >
                      Follow
                    </MDBBtn>
                  )
                )}
              </div>

              {/* articles */}
              <h5 className="text-start mb-3">Articles</h5>
              {articles.length === 0 ? (
                <p className="text-muted">No articles yet.</p>
              ) : (
                <MDBRow className="g-6">
                  {articles.map(a => (
                    <MDBCol lg ="6" md="6" sm="12" xs="12" key={a.id}>
                      <ArticleCard article={a} author={profile} />
                    </MDBCol>
                  ))}
                </MDBRow>
              )}

              <Link
                to="/articles"
                className="d-inline-block mt-4 fw-semibold small text-decoration-underline"
              >
                View More
              </Link>
            </div>
          </MDBCol>
        </MDBRow>
      </MDBContainer>

      {/* overlays */}
      <FollowersOverlay
        isOpen={showFollowers}
        onClose={() => setShowFollowers(false)}
        followers={followersList}
        onToggleFollow={(uid, shouldFollow) => toggleFollow(uid, viewerId)}
      />
      <FollowingOverlay
        isOpen={showFollowing}
        onClose={() => setShowFollowing(false)}
        following={followingList}
        onRemove={uid => toggleFollow(uid, viewerId)}
      />
    </main>
  );
}
