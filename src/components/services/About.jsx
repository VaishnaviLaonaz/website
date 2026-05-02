// src/pages/About.jsx
import React, { useEffect, useState } from "react";
import {
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBCard,
  MDBCardBody,
  MDBIcon,
  MDBBtn
} from "mdb-react-ui-kit";

/* ------------------------------------------------------------------
   1️⃣  Replace this whole object with a Firestore document snapshot
   ------------------------------------------------------------------ */
const staticContent = {
  hero: {
    lines: ["Stands", "With", "Farmers"],                 // large stacked words
    tagline: "Empowering the Future of UK Agriculture ",
    taglineAccent: "Together",
    challenges: [
      "Rising costs.",
      "Climate uncertainty.",
      "Growing knowledge gaps."
    ],
    intro: `Innovation is slowing, and livelihoods are at risk. 
            But it doesn’t have to be this way. LAONAZ brings UK farmers,
            gardeners, producers, and agri-innovators together—so challenges
            become shared opportunities, and individual insight becomes 
            collective progress. Because the future of agriculture isn’t just
            about tools—it’s about people.`,
    cta: { text: "JOIN THE COMMUNITY", link: "/register" }
  },

  why: {
    title: "Why Choose LAONAZ?",
    blurb: `Laonaz is built for a diverse but interconnected community across
            the UK food and farming ecosystem. Whether you’re working the land,
            growing in your garden, serving local food, or building tech for
            sustainability, Laonaz gives you the space, tools, and voice to
            thrive.`,
    points: [
      {
        icon: "seedling",
        title: "Local Advice That Works",
        desc: `Get crop, garden, or land suggestions based on your location
                and conditions — not generic advice from a faraway source.`
      },
      {
        icon: "comments",
        title: "Answers from People Like You",
        desc: `Have a question? Ask it in the community and hear from farmers,
                gardeners, or experts who’ve actually done it before.`
      },
      {
        icon: "chart-line",
        title: "Grow With Purpose",
        desc: `Whether you’re farming for your family or your future, Laonaz
                helps you make informed decisions that sustain land, people,
                and legacy.`
      },
      {
        icon: "newspaper",
        title: "Stay Informed, Stay Ahead",
        desc: `Subscribe to the Laonaz newsletter for seasonal tips, community
                highlights, and the latest innovations straight to your inbox.`
      }
    ]
  },

  value: {
    heading: "Real Value for Real People",
    highlight: "Value",
    groups: [
      {
        title: "Small & Medium-Scale Farmers",
        icon: "tractor",
        bullets: [
          "Share best practices on sustainability and cost efficiency",
          "Plan and adjust crop cycles with localised AI insights",
          "Get peer support on equipment, grants, and diversification",
          "Document your methods and earn from your expertise"
        ]
      },
      {
        title: "Gardeners & Hobby Growers",
        icon: "leaf",
        bullets: [
          "Learn seasonal planting tips tailored to your zone",
          "Exchange advice and ideas with like-minded growers",
          "Build your reputation by sharing progress and guides",
          "Turn your garden content into income via helpful posts"
        ]
      },
      {
        title: "Food Producers & Restaurant Owners",
        icon: "utensils",
        bullets: [
          "Discover and connect with nearby farmers or growers",
          "Build relationships with authentic sources",
          "Feature local ingredients in your brand narrative",
          "Join a community rooted in transparency and trust"
        ]
      },
      {
        title: "Smart Farming Startups & Innovators",
        icon: "rocket",
        bullets: [
          "Collaborate with growers to pilot technologies",
          "Collect feedback and refine your prototypes",
          "Access anonymised data to train your AI/IoT solutions",
          "Gain visibility within a highly engaged niche audience"
        ]
      },
      {
        title: "Researchers & Educators",
        icon: "graduation-cap",
        bullets: [
          "Launch surveys and pilot studies with grassroots participants",
          "Share findings in a way growers can actually apply",
          "Turn complex science into useful everyday advice",
          "Involve students in hands-on, real-world agricultural knowledge"
        ]
      },
      {
        title: "Policy Influencers & NGOs",
        icon: "balance-scale",
        bullets: [
          "Understand real pain points directly from the field",
          "Support and amplify underserved voices",
          "Track emerging issues through user-generated trends",
          "Use community-driven data to inform better decisions"
        ]
      }
    ],
    cta: { text: "SET UP MY PROFILE", link: "/profile" }
  }
};

/* ------------------------------------------------------------------
   2️⃣  Component
   ------------------------------------------------------------------ */
export default function About() {
  const [content, setContent] = useState(staticContent);

  /* In production, fetch Firestore doc here instead of staticContent.
     Example:
     useEffect(() => {
       const unsub = onSnapshot(doc(db, 'pages', 'about'), snap =>
         setContent(snap.data())
       );
       return unsub;
     }, []);
  */

  const olive = "#697c50";                   // design’s accent colour
  const heroFont = { fontSize: "clamp(3rem, 8vw, 8rem)", lineHeight: 0.9 };

  return (
    <main style={{ background: "#f5f6eb" }}>
      {/* ───────── Hero ───────── */}
      <section className="text-center pt-5">
        <MDBContainer>
          {content.hero.lines.map((line) => (
            <div
              key={line}
              style={{ ...heroFont, color: olive }}
              className="fw-semibold"
            >
              {line}
            </div>
          ))}

          <h4 className="fw-semibold mt-5">
            {content.hero.tagline}
            <span style={{ color: olive }}>{content.hero.taglineAccent}</span>
          </h4>

          <p className="fw-semibold small text-uppercase mt-4 mb-0">
            {content.hero.challenges.join("   ")}
          </p>

          <p className="mx-auto mt-3 mb-5" style={{ maxWidth: 640 }}>
            {content.hero.intro}
          </p>

         
        </MDBContainer>
      </section>

      {/* ───────── Why choose ───────── */}
      <section className="py-5">
        <MDBContainer>
          <h2 className="text-center fw-bold mb-3">{content.why.title}</h2>
          <p className="text-center mx-auto mb-5" style={{ maxWidth: 720 }}>
            {content.why.blurb}
          </p>

          <MDBRow className="g-4">
            {content.why.points.map((p, i) => (
              <MDBCol md="6" lg="3" key={i}>
                <div className="text-center px-3 px-lg-2">
                  <MDBIcon
                    fas
                    icon={p.icon}
                    size="2x"
                    className="mb-3"
                    style={{ color: olive }}
                  />
                  <h6 className="fw-semibold mb-2">{p.title}</h6>
                  <p className="small text-muted">{p.desc}</p>
                </div>
              </MDBCol>
            ))}
          </MDBRow>
        </MDBContainer>
      </section>

 <div className="text-center mt-5">
       <MDBBtn
            tag="a"
            href={content.hero.cta.link}
            size="lg"
            className="rounded-pill px-4"
            style={{ background: "#d4b950", border: 0 }}
          >
            {content.hero.cta.text}
          </MDBBtn>
      </div>

      {/* ───────── Value groups ───────── */}
      <section className="py-5">
        <MDBContainer>
          <h2 className="text-center fw-bold mb-1">
            Real{" "}
            <span style={{ color: olive }}>{content.value.highlight}</span> for
            Real People
          </h2>

          <MDBRow className="g-5 mt-5">
            {content.value.groups.map((g, idx) => (
              <MDBCol md="6" lg="4" key={idx}>
                <MDBCard className="border-0 shadow-sm h-100">
                  <MDBCardBody className="p-4">
                    <div className="d-flex align-items-center gap-2 mb-3">
                      <MDBIcon
                        fas
                        icon={g.icon}
                        className="fs-5"
                        style={{ color: olive }}
                      />
                      <h6 className="fw-semibold mb-0">{g.title}</h6>
                    </div>
                    <ul className="list-unstyled small">
                      {g.bullets.map((b, i) => (
                        <li key={i} className="d-flex gap-2 mb-2">
                          <MDBIcon fas icon="check" size="sm" />
                          <span>{b}</span>
                        </li>
                      ))}
                    </ul>
                  </MDBCardBody>
                </MDBCard>
              </MDBCol>
            ))}
          </MDBRow>

          <div className="text-center mt-5">
            <MDBBtn
              tag="a"
              href={content.value.cta.link}
              size="lg"
              className="rounded-pill px-4"
              style={{ background: "#d4b950", border: 0 }}
            >
              {content.value.cta.text}
            </MDBBtn>
          </div>
        </MDBContainer>
      </section>
    </main>
  );
}
