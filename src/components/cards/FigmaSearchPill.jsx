// import { MDBInputGroup } from "mdb-react-ui-kit";

// export default function FigmaSearchPill({ query, setQuery }) {
//   return (
//     <div
//       style={{
//         display: "flex",
//         flexDirection: "column",
//         alignItems: "flex-start",
//         padding: 0,
//         gap: 12,
//         width: "100%",
//         maxWidth: 300, // Responsive: max 300px, but can shrink
//       }}
//     >
//       <MDBInputGroup
//         className="rounded-pill"
//         style={{
//           width: "100%",         // Responsive
//           height: 36,            // Smaller height
//           background: "#fff",
//           border: "2px solid #b9b99b",
//           borderRadius: 18,      // Half of 36 for pill
//           overflow: "hidden",
//         }}
//       >
//         <span
//           className="input-group-text border-0 bg-white"
//           style={{
//             background: "#fff",
//             paddingLeft: 10,
//             paddingRight: 7,
//             border: "none",
//             display: "flex",
//             alignItems: "center",
//             height: 36,
//           }}
//         >
//           {/* Smaller SVG */}
//           <svg
//             width="20"
//             height="20"
//             viewBox="0 0 28 28"
//             fill="none"
//             xmlns="http://www.w3.org/2000/svg"
//             style={{
//               display: "block",
//             }}
//           >
//             <circle
//               cx="13"
//               cy="13"
//               r="8"
//               stroke="#222"
//               strokeWidth="2"
//               fill="none"
//             />
//             <line
//               x1="19"
//               y1="19"
//               x2="25"
//               y2="25"
//               stroke="#222"
//               strokeWidth="2"
//               strokeLinecap="round"
//             />
//           </svg>
//         </span>
//         <input
//           type="text"
//           className="form-control border-0 shadow-none"
//           style={{
//             color: "#888",
//             fontFamily: "'Montserrat', Arial, sans-serif",
//             fontWeight: 400,
//             fontSize: 16,
//             background: "#fff",
//             height: 36,
//             lineHeight: 1,
//             paddingLeft: 0,
//             outline: "none",
//             boxShadow: "none",
//           }}
//           placeholder="Search"
//           value={query}
//           onChange={(e) => setQuery(e.target.value)}
//         />
//       </MDBInputGroup>
//     </div>
//   );
// }



// // Correct correct below one is correct


// import React, { useMemo } from "react";
// import { Link } from "react-router-dom";
// import { MDBInputGroup } from "mdb-react-ui-kit";
// import { useArticles } from "../../configs/useArticles";

// export default function FigmaSearchPill({ query, setQuery }) {
//   // fetch all articles for searching (increase limit as needed)
//   const articles = useArticles(100) ?? [];

//   // derive filtered list of articles matching query in title or tags
//   const filtered = useMemo(() => {
//     const q = query.trim().toLowerCase();
//     if (!q) return [];
//     return articles.filter((a) => {
//       const titleMatch = a.title?.toLowerCase().includes(q);
//       const tagsMatch = Array.isArray(a.tags) && a.tags.some((t) => t.toLowerCase().includes(q));
//       return titleMatch || tagsMatch;
//     });
//   }, [query, articles]);

//   return (
//     <div
//       style={{
//         display: "flex",
//         flexDirection: "column",
//         alignItems: "flex-start",
//         width: "100%",
//         maxWidth: 300,
//       }}
//     >
//       <MDBInputGroup
//         className="rounded-pill"
//         style={{
//           width: "100%",
//           height: 36,
//           background: "#fff",
//           border: "2px solid #b9b99b",
//           borderRadius: 18,
//           overflow: "hidden",
//         }}
//       >
//         <span
//           className="input-group-text border-0 bg-white"
//           style={{
//             paddingLeft: 10,
//             paddingRight: 7,
//             display: "flex",
//             alignItems: "center",
//             height: 36,
//           }}
//         >
//           <svg
//             width="20"
//             height="20"
//             viewBox="0 0 28 28"
//             fill="none"
//             xmlns="http://www.w3.org/2000/svg"
//           >
//             <circle
//               cx="13"
//               cy="13"
//               r="8"
//               stroke="#222"
//               strokeWidth="2"
//             />
//             <line
//               x1="19"
//               y1="19"
//               x2="25"
//               y2="25"
//               stroke="#222"
//               strokeWidth="2"
//               strokeLinecap="round"
//             />
//           </svg>
//         </span>
//         <input
//           type="text"
//           className="form-control border-0 shadow-none"
//           style={{
//             color: "#888",
//             fontFamily: "'Montserrat', Arial, sans-serif",
//             fontWeight: 400,
//             fontSize: 16,
//             background: "#fff",
//             height: 36,
//             lineHeight: 1,
//             paddingLeft: 0,
//             outline: "none",
//           }}
//           placeholder="Search"
//           value={query}
//           onChange={(e) => setQuery(e.target.value)}
//         />
//       </MDBInputGroup>

//       {/* live suggestions */}
//       {query && filtered.length > 0 && (
//         <div
//           style={{
//             marginTop: 4,
//             width: "100%",
//             maxHeight: 200,
//             overflowY: "auto",
//             background: "#fff",
//             border: "1px solid #eaeaea",
//             borderRadius: 8,
//             boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
//             zIndex: 100,
//           }}
//         >
//           {filtered.map((a) => (
//             <Link
//               key={a.id}
//               to={`/article/${a.id}`}
//               onClick={() => setQuery("")}
//               className="d-block px-3 py-2 text-decoration-none text-dark"
//               style={{ fontSize: 14 }}
//             >
//               {a.title}
//             </Link>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }

// correct below

import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import { MDBInputGroup } from "mdb-react-ui-kit";
import { useArticles } from "../../configs/useArticles";

export default function FigmaSearchPill({ query, setQuery }) {
  // fetch articles for search
  const articles = useArticles(100) ?? [];

  // filter by title or tags
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return articles.filter((a) => {
      const titleMatch = a.title?.toLowerCase().includes(q);
      const tagsMatch = Array.isArray(a.tags) && a.tags.some((t) => t.toLowerCase().includes(q));
      return titleMatch || tagsMatch;
    });
  }, [query, articles]);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        background: "#F1F1E6",
        width: "100%",
        maxWidth: 300,
        
      }}
    >
      <MDBInputGroup
        // className="bg-white"
        style={{
          width: "300px",
      
          background: "#F5F5F5",
          border: "1.5px solid #b9b99b",
          borderRadius: 8,
          overflow: "hidden",
        }}
      >
        <span
          className="input-group-text border-0"
          style={{
            paddingLeft: 10,
            paddingRight: 7,
            paddingBottom: 5,
            display: "flex",
            alignItems: "center",
            borderTopLeftRadius: 4, 
            background: "#F5F5F5",   
            borderBottomLeftRadius: 4,
            height: 45,
          }}
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 28 28"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle cx="13" cy="13" r="8" stroke="#222" strokeWidth="2" />
            <line
              x1="19"
              y1="19"
              x2="25"
              y2="25"
              stroke="#222"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </span>
        <input
          type="text"
          className="form-control border-0 shadow-none"
          style={{
            background: "#F5F5F5",
            color: "#888",
            fontFamily: "'Montserrat', Arial, sans-serif",
            fontWeight: 400,
            fontSize: 14,
            paddingBottom: 5,
            height: 45,
            lineHeight: 1,
            paddingLeft: 0,
            outline: "none",
           
            
          }}
          placeholder="Search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </MDBInputGroup>

      {/* live suggestions */}
      {query && filtered.length > 0 && (
        <div
          style={{
            marginTop: 4,
            width: "100%",
            maxHeight: 200,
            overflowY: "auto",
            height: 45,
            border: "1px solid #e0e0e0",
            background: "#F5F5F5",
            borderRadius: 8,
            boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
            zIndex: 100,
          }}
        >
          {filtered.map((a, idx) => (
            <Link
              key={a.id}
              to={`/article/${a.id}`}
              onClick={() => setQuery("")}
              className="d-block text-dark"
              style={{
                display: "block",
                padding: "8px 12px",
                fontSize: 14,
                fontWeight: 500,
                textDecoration: "none",
                background: "#F5F5F5",
                borderBottom: idx < filtered.length - 1 ? "1px solid #F1F1E6" : "none",
                transition: "background 0.2s",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = "#f9f9f9"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "#F1F1E6"; }}
            >
              {a.title}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

