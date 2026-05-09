// // src/pages/ArticlesPage.jsx
// import React, { useEffect, useMemo, useState } from "react";
// import {
//   MDBContainer, MDBRow, MDBCol, MDBListGroup, MDBListGroupItem,
// } from "mdb-react-ui-kit";
// import { useArticles } from "../../configs/useArticles";
// import ArticleCard   from "../../components/cards/ArticleCard";
// import { db }        from "../../configs/firebase";
// import { doc, getDoc } from "firebase/firestore";

// /* ----------------  static “viral” hashtags  ---------------- */
// const TOP_TAGS = [
//   "general", "agriculture", "technology", "sustainability", "environment",
//   "economy", "education", "health", "policy", "climate",
//   "innovation", "science", "energy", "water", "food",
//   "community", "research", "biodiversity", "finance", "startup",
// ];

// /* ----------------  helper: author lookup  ------------------ */
// async function fetchAuthors(uids) {
//   if (!uids.length) return {};
//   const pairs = await Promise.all(
//     uids.map(async uid => {
//       const snap = await getDoc(doc(db, "users", uid));
//       return [uid, snap.exists() ? { uid, ...snap.data() } : null];
//     }),
//   );
//   return Object.fromEntries(pairs);
// }

// /* ====================  Main Page  ========================= */
// export default function ArticlesPage() {
//   /* live article list */
//   const articles = useArticles(500);              // grab plenty
//   /* current filter tag (null ⇒ all) */
//   const [tag, setTag] = useState(null);

//   /* filter memo + sort newest -> oldest */
//   const visible = useMemo(() => {
//     const list = tag
//       ? articles.filter(a => (a.category || "general").toLowerCase() === tag)
//       : articles;
//     return [...list].sort((a,b) => b.createdAt - a.createdAt);
//   }, [articles, tag]);

//   /* lazy author hydrate */
//   const [authors, setAuthors] = useState({});
//   useEffect(() => {
//     const missing = [
//       ...new Set(visible.map(a => a.authorId).filter(id => !authors[id])),
//     ];
//     if (missing.length)
//       fetchAuthors(missing).then(m => setAuthors(p => ({ ...p, ...m })));
//   }, [visible]);

//   return (
//     <main style={{ background:"#f5f6eb" }} className="py-4">
//       <MDBContainer fluid="lg">
//         <MDBRow>
//           {/* ----------- left rail : tags ------------ */}
//           <MDBCol md="2" className="mb-4">
//             <h6 className="fw-bold mb-3"># Hashtags</h6>
//             <MDBListGroup flush className="sticky-top" style={{ top:80 }}>
//               <MDBListGroupItem
//                 action onClick={() => setTag(null)}
//                 active={tag === null}
//               >
//                 All
//               </MDBListGroupItem>

//               {TOP_TAGS.map(t => (
//                 <MDBListGroupItem
//                   key={t} action
//                   active={tag === t}
//                   onClick={() => setTag(t)}
//                 >
//                   #{t}
//                 </MDBListGroupItem>
//               ))}
//             </MDBListGroup>
//           </MDBCol>

//           {/* ----------- articles grid --------------- */}
//           <MDBCol md="10">
//             <MDBRow className="g-4">
//               {visible.map(a => (
//                 <MDBCol lg="4" md="6" key={a.id}>
//                   <ArticleCard
//                     article={a}
//                     author={authors[a.authorId]}
//                     isOwner={false}
//                   />
//                 </MDBCol>
//               ))}
//               {visible.length === 0 && (
//                 <p className="text-center w-100 py-5">No articles for this tag yet.</p>
//               )}
//             </MDBRow>
//           </MDBCol>
//         </MDBRow>
//       </MDBContainer>
//     </main>
//   );
// }


// Correct one below


// // src/pages/ArticlesPage.jsx
// import React, { useEffect, useMemo, useState } from "react";
// import {
//   MDBContainer, MDBRow, MDBCol, MDBListGroup, MDBListGroupItem,
// } from "mdb-react-ui-kit";
// import { useArticles } from "../../configs/useArticles";
// import ArticleCard   from "../../components/cards/ArticleCard";
// import { db }        from "../../configs/firebase";
// import { doc, getDoc } from "firebase/firestore";

// /* ----------------  static “viral” hashtags  ---------------- */
// const TOP_TAGS = [
//   "general", "agriculture", "technology", "sustainability", "environment",
//   "economy", "education", "health", "policy", "climate",
//   "innovation", "science", "energy", "water", "food",
//   "community", "research", "biodiversity", "finance", "startup",
// ];

// /* ----------------  helper: author lookup  ------------------ */
// async function fetchAuthors(uids) {
//   if (!uids.length) return {};
//   const pairs = await Promise.all(
//     uids.map(async uid => {
//       const snap = await getDoc(doc(db, "users", uid));
//       return [uid, snap.exists() ? { uid, ...snap.data() } : null];
//     }),
//   );
//   return Object.fromEntries(pairs);
// }

// export default function ArticlesPage() {
//   const articles = useArticles(500);
//   const [tag, setTag] = useState(null);

//   const visible = useMemo(() => {
//     const list = tag
//       ? articles.filter(a =>
//           Array.isArray(a.tags) &&
//           a.tags.map(t => t.toLowerCase()).includes(tag)
//         )
//       : articles;
//     return [...list].sort((a,b) => b.createdAt - a.createdAt);
//   }, [articles, tag]);

//   const [authors, setAuthors] = useState({});
//   useEffect(() => {
//     const missing = [
//       ...new Set(visible.map(a => a.authorId).filter(id => !authors[id])),
//     ];
//     if (missing.length)
//       fetchAuthors(missing).then(m => setAuthors(p => ({ ...p, ...m })));
//   }, [visible]);

//   return (
//     <main style={{ background:"#f5f6eb" }} className="py-4">
//       <MDBContainer fluid="lg">
//         <MDBRow>
//           <MDBCol md="2" className="mb-4">
//             <h6 className="fw-bold mb-3"># Hashtags</h6>
//             <MDBListGroup flush className="sticky-top" style={{ top:80 }}>
//               <MDBListGroupItem
//                 action onClick={() => setTag(null)}
//                 active={tag === null}
//               >
//                 All
//               </MDBListGroupItem>

//               {TOP_TAGS.map(t => (
//                 <MDBListGroupItem
//                   key={t} action
//                   active={tag === t}
//                   onClick={() => setTag(t)}
//                 >
//                   #{t}
//                 </MDBListGroupItem>
//               ))}
//             </MDBListGroup>
//           </MDBCol>

//           <MDBCol md="10">
//             <MDBRow className="g-4">
//               {visible.map(a => (
//                 <MDBCol lg="4" md="6" key={a.id}>
//                   <ArticleCard
//                     article={a}
//                     author={authors[a.authorId]}
//                     isOwner={false}
//                   />
//                 </MDBCol>
//               ))}
//               {visible.length === 0 && (
//                 <p className="text-center w-100 py-5">No articles for this tag yet.</p>
//               )}
//             </MDBRow>
//           </MDBCol>
//         </MDBRow>
//       </MDBContainer>
//     </main>
//   );
// }




// Correct one below

//ArticlePage.jsx

// import React, { useEffect, useMemo, useState } from "react";
// import {
//   MDBContainer, MDBRow, MDBCol, MDBListGroup, MDBListGroupItem,
// } from "mdb-react-ui-kit";
// import { useArticles } from "../../configs/useArticles";
// import ArticleCard from "../../components/cards/ArticleCard";
// import { db as fsDb } from "../../configs/firebase";
// import { doc, getDoc, collection, onSnapshot } from "firebase/firestore";

// /* ---------------- default hashtag fallbacks ---------------- */
// const DEFAULT_TAGS = [
//   "general", "agriculture", "technology", "sustainability", "environment",
//   "economy", "education", "health", "policy", "climate",
//   "innovation", "science", "energy", "water", "food",
//   "community", "research", "biodiversity", "finance", "startup",
// ];

// async function fetchAuthors(uids) {
//   if (!uids.length) return {};
//   const pairs = await Promise.all(
//     uids.map(async uid => {
//       const snap = await getDoc(doc(fsDb, "users", uid));
//       return [uid, snap.exists() ? { uid, ...snap.data() } : null];
//     })
//   );
//   return Object.fromEntries(pairs);
// }

// export default function ArticlesPage() {
//   const articles = useArticles(500) || [];
//   const [filterTag, setFilterTag] = useState(null);
//   const [allTags, setAllTags] = useState(DEFAULT_TAGS);

//   // subscribe to dynamic tags collection
//   useEffect(() => {
//     const tagsCol = collection(fsDb, 'tags');
//     const unsub = onSnapshot(tagsCol, snap => {
//       const fetched = snap.docs.map(d => d.id.toLowerCase());
//       setAllTags([...new Set([...DEFAULT_TAGS, ...fetched])]);
//     });
//     return unsub;
//   }, []);

//   // filter + sort
//   const visible = useMemo(() => {
//     const list = filterTag
//       ? articles.filter(a => Array.isArray(a.tags) && a.tags.map(t => t.toLowerCase()).includes(filterTag))
//       : articles;
//     return [...list].sort((a,b) => b.createdAt - a.createdAt);
//   }, [articles, filterTag]);

//   const [authors, setAuthors] = useState({});
//   useEffect(() => {
//     const missing = [...new Set(visible.map(a => a.authorId).filter(id => !authors[id]))];
//     if (missing.length) fetchAuthors(missing).then(m => setAuthors(p => ({ ...p, ...m })));
//   }, [visible, authors]);

//   return (
//     <main style={{ background: "#f5f6eb" }} className="py-4">
//       <MDBContainer fluid="lg">
//         <MDBRow>
//           <MDBCol md="2" className="mb-4">
//             <h6 className="fw-bold mb-3"># Hashtags</h6>
//             <MDBListGroup flush className="sticky-top" style={{ top: 80 }}>
//               <MDBListGroupItem action onClick={() => setFilterTag(null)} active={filterTag === null} style={{ cursor: "pointer" }}>
//                 All
//               </MDBListGroupItem>
//               {allTags.map(t => (
//                 <MDBListGroupItem
//                   key={t}
//                   action
//                   active={filterTag === t.toLowerCase()}
//                   onClick={() => setFilterTag(t.toLowerCase())}
//                   style={{ cursor: "pointer" }}
//                 >
//                   #{t}
//                 </MDBListGroupItem>
//               ))}
//             </MDBListGroup>
//           </MDBCol>
//           <MDBCol md="10">
//             <MDBRow className="g-4">
//               {visible.map(a => (
//                 <MDBCol lg="4" md="6" key={a.id}>
//                   <ArticleCard article={a} author={authors[a.authorId]} isOwner={false} />
//                 </MDBCol>
//               ))}
//               {visible.length === 0 && (
//                 <p className="text-center w-100 py-5">No articles for this tag yet.</p>
//               )}
//             </MDBRow>
//           </MDBCol>
//         </MDBRow>
//       </MDBContainer>
//     </main>
//   );
// }


// ArticlePage.jsx
// ArticlePage.jsx
// ArticlePage.jsx

// ArticlePage.jsx

// import React, { useEffect, useMemo, useState } from "react";
// import {
//   MDBContainer,
//   MDBRow,
//   MDBCol,
//   MDBListGroup,
//   MDBListGroupItem,
//   MDBBtn,
// } from "mdb-react-ui-kit";
// import { useArticles } from "../../configs/useArticles";
// import ArticleCard from "../../components/cards/ArticleCard";
// import { db as fsDb } from "../../configs/firebase";
// import { doc, getDoc, collection, onSnapshot } from "firebase/firestore";

// /* ---------------- default hashtag fallbacks ---------------- */
// const DEFAULT_TAGS = [
//   "general", "agriculture", "technology", "sustainability", "environment",
//   "economy", "education", "health", "policy", "climate",
//   "innovation", "science", "energy", "water", "food",
//   "community", "research", "biodiversity", "finance", "startup",
// ];

// const SORT_MODES = { RECENT: "RECENT", VIEWS: "VIEWS", LIKES: "LIKES", COMMENTS: "COMMENTS" };

// const toNum = (v) => (Number.isFinite(Number(v)) ? Number(v) : 0);
// const toMillis = (v) => (v && typeof v.toMillis === "function" ? v.toMillis() : (Number.isFinite(v) ? v : 0));

// async function fetchAuthors(uids) {
//   if (!uids.length) return {};
//   const pairs = await Promise.all(
//     uids.map(async (uid) => {
//       const snap = await getDoc(doc(fsDb, "users", uid));
//       return [uid, snap.exists() ? { uid, ...snap.data() } : null];
//     })
//   );
//   return Object.fromEntries(pairs);
// }

// /* ---------- pill button style helpers (exact to mock) ---------- */
// const OLIVE = "#5C6B3C";
// const CANVAS = "#F1F1E6";
// const BORDER = "#0A0A0A";

// const pillBase = {
//   borderRadius: "9999px",
//   border: `2px solid ${BORDER}`,
//   fontFamily: "Poppins, sans-serif",
//   fontWeight: 600,
//   fontSize: "18px",
//   lineHeight: 1.25,
//   padding: "0.75rem 1.5rem",
//   textTransform: "none",
//   boxShadow: "none",
//   height: "40px",
//   display: "inline-flex",
//   alignItems: "center",
// };

// const asActive = { ...pillBase, background: OLIVE, color: "#F1F1E6" };
// const asInactive = { ...pillBase, background: CANVAS, color: "#0A0A0A" };

// export default function ArticlesPage() {
//   const articles = useArticles(500) || [];

//   const [filterTag, setFilterTag] = useState(null);
//   const [allTags, setAllTags] = useState(DEFAULT_TAGS);
//   const [sortMode, setSortMode] = useState(SORT_MODES.RECENT);

//   const PAGE_SIZE = 8;
//   const [showCount, setShowCount] = useState(PAGE_SIZE);

//   // subscribe to dynamic tags collection
//   useEffect(() => {
//     const tagsCol = collection(fsDb, "tags");
//     const unsub = onSnapshot(tagsCol, (snap) => {
//       const fetched = snap.docs.map((d) => d.id.toLowerCase());
//       setAllTags([...new Set([...DEFAULT_TAGS, ...fetched])]);
//     });
//     return unsub;
//   }, []);

//   // filter + sort (viewsCount ?? views)
//   const filteredSorted = useMemo(() => {
//     const pool = filterTag
//       ? articles.filter(
//           (a) =>
//             Array.isArray(a.tags) &&
//             a.tags.map((t) => String(t).toLowerCase()).includes(filterTag)
//         )
//       : articles;

//     const sorted = [...pool].sort((a, b) => {
//       const byRecent = toMillis(b.createdAt) - toMillis(a.createdAt);
//       if (sortMode === SORT_MODES.VIEWS) {
//         const diff = toNum(b.viewsCount ?? b.views) - toNum(a.viewsCount ?? a.views);
//         return diff !== 0 ? diff : byRecent;
//       }
//       if (sortMode === SORT_MODES.LIKES) {
//         const diff = toNum(b.likesCount) - toNum(a.likesCount);
//         return diff !== 0 ? diff : byRecent;
//       }
//       if (sortMode === SORT_MODES.COMMENTS) {
//         const diff = toNum(b.commentsCount) - toNum(a.commentsCount);
//         return diff !== 0 ? diff : byRecent;
//       }
//       return byRecent; // RECENT
//     });

//     return sorted;
//   }, [articles, filterTag, sortMode]);

//   // authors cache
//   const [authors, setAuthors] = useState({});
//   useEffect(() => {
//     const missing = [
//       ...new Set(
//         filteredSorted.map((a) => a.authorId).filter((id) => !authors[id])
//       ),
//     ];
//     if (missing.length)
//       fetchAuthors(missing).then((m) => setAuthors((p) => ({ ...p, ...m })));
//   }, [filteredSorted, authors]);

//   // pagination slice
//   const sliced = useMemo(
//     () => filteredSorted.slice(0, showCount),
//     [filteredSorted, showCount]
//   );

//   // reset “page” on filter/sort change
//   useEffect(() => {
//     setShowCount(PAGE_SIZE);
//   }, [filterTag, sortMode]);

//   const hasMore = showCount < filteredSorted.length;

//   /* ===== Desktop pixel grid =====
//      - Max frame width 1218px
//      - Sidebar 246px
//      - Gap 40px
//      - Content rail 931px
//      - Article grid 4 columns, 40px gap, top "border" 2px
//   */
//   const desktopFrame = {
//     maxWidth: "1218px",
//     margin: "0 auto",
//     padding: "0", // Figma shows snug frame
//   };

//   const sidebarStyle = {
//     width: "246px",
//     flex: "0 0 246px",
//   };

//   const railStyle = {
//     width: "931px",
//     flex: "0 0 931px",
//   };

//   const rowBetween = {
//     display: "flex",
//     columnGap: "40px",
//   };

//   return (
//     <main style={{ background: "#F5F6EB" }} className="py-4">
//       <div style={desktopFrame}>
//         {/* custom row to control exact 40px column gap */}
//         <div style={rowBetween}>
//           {/* Left rail: hashtags */}
//           <div style={sidebarStyle} className="mb-4">
//             <div
//               className="d-flex flex-column"
//               style={{
//                 backgroundColor: "#F5F6EB",
//                 fontFamily: "Poppins, sans-serif",
//                 fontWeight: 500,
//                 fontSize: "16px",
//                 color: "#0A0A0A",
//               }}
//             >
//               <div
//                 onClick={() => setFilterTag(null)}
//                 style={{
//                   display: "flex",
//                   alignItems: "center",
//                   gap: "10px",
//                   cursor: "pointer",
//                   padding: "14px 16px",
//                   backgroundColor: filterTag === null ? "#5C6B3C" : "transparent",
//                   color: filterTag === null ? "#FFFFFF" : "#0A0A0A",
//                   borderBottom:
//                     filterTag === null ? "none" : "1px solid rgba(0,0,0,0.1)",
//                   transition: "background 0.2s ease, color 0.2s ease",
//                 }}
//               >
//                 <span
//                   style={{
//                     fontSize: "24px",
//                     lineHeight: "20px",
//                     fontWeight: 600,
//                     color: filterTag === null ? "#FFFFFF" : "#0A0A0A",
//                   }}
//                 >
//                   #
//                 </span>
//                 <span style={{ fontWeight: filterTag === null ? 600 : 500 }}>
//                   All
//                 </span>
//               </div>

//               {allTags.map((t) => {
//                 const active = filterTag === t.toLowerCase();
//                 return (
//                   <div
//                     key={t}
//                     onClick={() => setFilterTag(t.toLowerCase())}
//                     style={{
//                       display: "flex",
//                       alignItems: "center",
//                       gap: "10px",
//                       cursor: "pointer",
//                       padding: "14px 16px",
//                       backgroundColor: active ? "#5C6B3C" : "transparent",
//                       color: active ? "#FFFFFF" : "#0A0A0A",
//                       borderBottom: active ? "none" : "1px solid rgba(0,0,0,0.1)",
//                       transition: "background 0.2s ease, color 0.2s ease",
//                     }}
//                   >
//                     <span
//                       style={{
//                         fontSize: "24px",
//                         lineHeight: "20px",
//                         fontWeight: 600,
//                         color: active ? "#FFFFFF" : "#0A0A0A",
//                       }}
//                     >
//                       #
//                     </span>
//                     <span style={{ fontWeight: active ? 600 : 500, fontSize: "16px" }}>
//                       {t.charAt(0).toUpperCase() + t.slice(1)}
//                     </span>
//                   </div>
//                 );
//               })}
//             </div>
//           </div>

//           {/* Content rail (931px) */}
//           <div style={railStyle}>
//             {/* Pills row */}
//             <div
//               className="d-flex flex-row flex-wrap"
//               style={{ gap: "24px", marginBottom: "24px" }}
//             >
//               <MDBBtn
//                 size="lg"
//                 style={sortMode === SORT_MODES.RECENT ? asActive : asInactive}
//                 onClick={() => setSortMode(SORT_MODES.RECENT)}
//               >
//                 Most Recent Articles
//               </MDBBtn>
//               <MDBBtn
//                 size="lg"
//                 style={sortMode === SORT_MODES.VIEWS ? asActive : asInactive}
//                 onClick={() => setSortMode(SORT_MODES.VIEWS)}
//               >
//                 Most Viewed
//               </MDBBtn>
//               <MDBBtn
//                 size="lg"
//                 style={sortMode === SORT_MODES.LIKES ? asActive : asInactive}
//                 onClick={() => setSortMode(SORT_MODES.LIKES)}
//               >
//                 Most Liked
//               </MDBBtn>
//               <MDBBtn
//                 size="lg"
//                 style={sortMode === SORT_MODES.COMMENTS ? asActive : asInactive}
//                 onClick={() => setSortMode(SORT_MODES.COMMENTS)}
//               >
//                 Most Commented
//               </MDBBtn>
//             </div>

//             {/* Article grid — exact 4×N with 40px gap and 2px top border */}
//             <div
//               style={{
//                 borderTop: "2px solid transparent",
//                 paddingTop: "16px",
//               }}
//             >
//               <div
//                 style={{
//                   display: "grid",
//                   gridTemplateColumns: "repeat(4, 1fr)",
//                   gap: "40px",
//                 }}
//               >
//                 {sliced.map((a) => (
//                   <div key={a.id}>
//                     <ArticleCard
//                       article={a}
//                       author={authors[a.authorId]}
//                       isOwner={false}
//                     />
//                   </div>
//                 ))}
//               </div>

//               {sliced.length === 0 && (
//                 <p className="text-center w-100 py-5">
//                   No articles for this selection yet.
//                 </p>
//               )}

//               {hasMore && (
//                 <div className="text-center mt-4">
//                   <MDBBtn
//                     color="link"
//                     className="text-dark text-decoration-underline"
//                     onClick={() => setShowCount((n) => n + PAGE_SIZE)}
//                     style={{ fontFamily: "Poppins, sans-serif", fontWeight: 600 }}
//                   >
//                     View More
//                   </MDBBtn>
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>
//     </main>
//   );
// }


// ArticlePage.jsx
import React, { useEffect, useMemo, useState } from "react";
import { MDBBtn } from "mdb-react-ui-kit";
import { useLiveArticles } from "../../configs/useArticles";
import ArticleCard from "../../components/cards/ArticleCard";
import { db as fsDb } from "../../configs/firebase";
import { doc, getDoc, collection, onSnapshot } from "firebase/firestore";
import { Link } from "react-router-dom";
/* ---------------- default hashtag fallbacks ---------------- */
const DEFAULT_TAGS =[];


const SORT_MODES = { RECENT:"RECENT", VIEWS:"VIEWS", LIKES:"LIKES", COMMENTS:"COMMENTS" };

const toNum = (v) => (Number.isFinite(Number(v)) ? Number(v) : 0);
const toMillis = (v) => (v && typeof v.toMillis === "function" ? v.toMillis() : (Number.isFinite(v) ? v : 0));

/* ---------- pill button style helpers (exact to mock) ---------- */
const OLIVE = "#5C6B3C";
const CANVAS = "#F1F1E6"; // your screenshot background shade
const BORDER = "#0A0A0A";

const pillBase = {
  borderRadius: "500px",               // exactly Figma radius
  border: `1px solid ${BORDER}`,       // 1px black border
  fontFamily: "Poppins, sans-serif",
  fontWeight: 400,                     // semibold
  fontSize: "14px",                    // 16px as shown
  lineHeight: "1.25",
  padding: "10px 20px",                // top/bottom 10px, sides 20px
  textTransform: "none",
  boxShadow: "none",
  height: "41px",                      // fixed height
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "8px",                          // 8px between icon/text (future-safe)
  cursor: "pointer",
  transition: "background 0.2s ease, color 0.2s ease",
};

const asActive = {
  ...pillBase,
  background: OLIVE,
  color: CANVAS,
};

const asInactive = {
  ...pillBase,
  background: CANVAS,
  color: "#0A0A0A",
};
async function fetchAuthors(uids) {
  if (!uids.length) return {};
  const pairs = await Promise.all(
    uids.map(async (uid) => {
      const snap = await getDoc(doc(fsDb, "users", uid));
      return [uid, snap.exists() ? { uid, ...snap.data() } : null];
    })
  );
  return Object.fromEntries(pairs);
}

export default function ArticlesPage() {
  const articles = useLiveArticles(80) || [];
  const [filterTag, setFilterTag] = useState(null);
  const [allTags, setAllTags] = useState(DEFAULT_TAGS);
  const [sortMode, setSortMode] = useState(SORT_MODES.RECENT);

  const PAGE_SIZE = 8;
  const [showCount, setShowCount] = useState(PAGE_SIZE);

  // subscribe to dynamic tags collection
  useEffect(() => {
    const tagsCol = collection(fsDb, "tags");
    const unsub = onSnapshot(tagsCol, (snap) => {
      const fetched = snap.docs.map((d) => d.id.toLowerCase());
      setAllTags([...new Set([...DEFAULT_TAGS, ...fetched])]);
    });
    return unsub;
  }, []);

  // filter + sort (viewsCount ?? views)
  const filteredSorted = useMemo(() => {
    const pool = filterTag
      ? articles.filter(
          (a) =>
            Array.isArray(a.tags) &&
            a.tags.map((t) => String(t).toLowerCase()).includes(filterTag)
        )
      : articles;

    return [...pool].sort((a, b) => {
      const byRecent = toMillis(b.createdAt) - toMillis(a.createdAt);
      if (sortMode === SORT_MODES.VIEWS) {
        const diff = toNum(b.viewsCount ?? b.views) - toNum(a.viewsCount ?? a.views);
        return diff !== 0 ? diff : byRecent;
      }
      if (sortMode === SORT_MODES.LIKES) {
        const diff = toNum(b.likesCount) - toNum(a.likesCount);
        return diff !== 0 ? diff : byRecent;
      }
      if (sortMode === SORT_MODES.COMMENTS) {
        const diff = toNum(b.commentsCount) - toNum(a.commentsCount);
        return diff !== 0 ? diff : byRecent;
      }
      return byRecent;
    });
  }, [articles, filterTag, sortMode]);

  const [authors, setAuthors] = useState({});
  useEffect(() => {
    const missing = [
      ...new Set(
        filteredSorted.map((a) => a.authorId).filter((id) => !authors[id])
      ),
    ];
    if (missing.length)
      fetchAuthors(missing).then((m) => setAuthors((p) => ({ ...p, ...m })));
  }, [filteredSorted, authors]);

  const sliced = useMemo(
    () => filteredSorted.slice(0, showCount),
    [filteredSorted, showCount]
  );

  useEffect(() => {
    setShowCount(PAGE_SIZE);
  }, [filterTag, sortMode]);

  const hasMore = showCount < filteredSorted.length;

  /* ===== Desktop pixel grid ===== */
  const desktopFrame = { maxWidth: "1218px", margin: "0 auto", padding: "0" };
  const sidebarStyle  = { width: "246px", flex: "0 0 246px" };
  const railStyle     = { width: "931px", flex: "0 0 931px" };
  const rowBetween    = { display: "flex", columnGap: "40px" };

  return (
    <main style={{ background: "#F1F1E6" }} className="py-4">
      <div style={desktopFrame}>
        <div style={rowBetween}>
          {/* Left rail: hashtags */}
          <div style={sidebarStyle} className="mb-4">
            <div
              className="d-flex flex-column"
              style={{
                backgroundColor: "#F1F1E6",
                fontFamily: "Poppins, sans-serif",
                fontWeight: 500,
                fontSize: "16px",
                color: "#0A0A0A",
              }}
            >
              {/* All */}
              <div
                onClick={() => setFilterTag(null)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "9.24px",
                  cursor: "pointer",
                  padding: "14px 16px",
                  backgroundColor: filterTag === null ? "#5C6B3C" : "transparent",
                  color: filterTag === null ? "#FFFFFF" : "#0A0A0A",
                  borderBottom: filterTag === null ? "none" : "1px solid rgba(0,0,0,0.1)",
                  transition: "background 0.2s ease, color 0.2s ease",
                }}
              >
                <span style={{ fontSize: "28px", lineHeight: "150%", fontWeight: 400, color: filterTag === null ? "#F5F5F5" : "#0A0A0A" }}>#</span>
                <span style={{ fontWeight: filterTag === null ? 600 : 500, fontSize: "14px" }}>All</span>
              </div>

              {allTags.map((t) => {
                const active = filterTag === t.toLowerCase();
                return (
                  <div
                    key={t}
                    onClick={() => setFilterTag(t.toLowerCase())}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "9.24px",
                      cursor: "pointer",
                      padding: "14px 16px",
                      backgroundColor: active ? "#5C6B3C" : "transparent",
                      color: active ? "#F5F5F5" : "#0A0A0A",
                      borderBottom: active ? "none" : "1px solid rgba(0,0,0,0.1)",
                      transition: "background 0.2s ease, color 0.2s ease",
                    }}
                  >
                    <span style={{ fontSize: "28px", lineHeight: "150%", fontWeight: 400, color: active ? "#F5F5F5" : "#0A0A0A" }}>#</span>
                    <span style={{ fontWeight: active ? 600 : 500, fontSize: "14px" }}>
                      {t.charAt(0).toUpperCase() + t.slice(1)}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Content rail */}
          <div style={railStyle}>
            {/* Pills */}
            <div className="d-flex flex-row flex-wrap" style={{ gap: "24px", marginBottom: "24px" }}>
              <MDBBtn size="lg" style={sortMode === SORT_MODES.RECENT ? asActive : asInactive} onClick={() => setSortMode(SORT_MODES.RECENT)}>
                Most Recent Articles
              </MDBBtn>
              <MDBBtn size="lg" style={sortMode === SORT_MODES.VIEWS ? asActive : asInactive} onClick={() => setSortMode(SORT_MODES.VIEWS)}>
                Most Viewed
              </MDBBtn>
              <MDBBtn size="lg" style={sortMode === SORT_MODES.LIKES ? asActive : asInactive} onClick={() => setSortMode(SORT_MODES.LIKES)}>
                Most Liked
              </MDBBtn>
              <MDBBtn size="lg" style={sortMode === SORT_MODES.COMMENTS ? asActive : asInactive} onClick={() => setSortMode(SORT_MODES.COMMENTS)}>
                Most Commented
              </MDBBtn>
            </div>

            {/* Article grid — 4×N with 40px gap; top border removed */}
            <div style={{ /* borderTop removed */ paddingTop: "16px" }}>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, minmax(0, 1fr))", gap: "24px" }}>
                {sliced.map((a) => (
                  <div key={a.id} style={{ minWidth: 0 }}>
                    <ArticleCard article={a} author={authors[a.authorId]} isOwner={false} liveMeta={false}  />
                  </div>
                ))}
              </div>

              {sliced.length === 0 && (
                <p className="text-center w-100 py-5">No articles for this selection yet.</p>
              )}

              {hasMore && (
                <div className="text-center mt-4">
                  <Link onClick={() => setShowCount((n) => n + PAGE_SIZE)} className="view-more-link">
                      View More
                    </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
