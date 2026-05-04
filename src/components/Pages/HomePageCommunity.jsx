// src/pages/Home.jsx
import React, { useEffect, useState, useMemo } from "react";
import {
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBBtn,
} from "mdb-react-ui-kit";
import { Link } from "react-router-dom";
import { useArticles } from "../../configs/useArticles";
import ArticleCard from "../../components/cards/ArticleCard";
import { db } from "../../configs/firebase";
import { doc, getDoc } from "firebase/firestore";

import homepageImg from '../../images/homepage.png';
import communityAvatar from '../../images/notifyicon.png';
import CommunitySubscribeSection from '../Pages/CommunitySubscribeSection';
import '../../styles/components.css';


/* ─────────── ICON ASSETS (your SVGs) ─────────── */
import ViewIcon from '../../images/icons/View Icon.svg';
import LikeIcon from '../../images/icons/like icon.svg';



/* ───────── fetchAuthors helper ───────── */
async function fetchAuthors(uniqueIds) {
  const valid = uniqueIds.filter(
    (uid) => typeof uid === "string" && uid.trim().length
  );
  if (!valid.length) return {};

  const rows = await Promise.all(
    valid.map(async (uid) => {
      const snap = await getDoc(doc(db, "users", uid));
      return [uid, snap.exists() ? { uid, ...snap.data() } : null];
    })
  );
  return Object.fromEntries(rows);
}
/* ─────────────────────────────────────── */

export default function Home() {
  const articles = useArticles(50);               
  const [authors, setAuthors] = useState({});

  /* ── grab missing author docs ── */
  useEffect(() => {
    const missing = [
      ...new Set(articles.map((a) => a.authorId).filter((id) => !authors[id])),
    ];
    if (missing.length) {
      fetchAuthors(missing).then((map) =>
        setAuthors((prev) => ({ ...prev, ...map }))
      );
    }
  }, [articles]); // eslint-disable-line react-hooks/exhaustive-deps

  /* ── top-3 liked articles from *this* calendar month ── */
  const topLiked = useMemo(() => {
    const now   = new Date();
    const y     = now.getFullYear();
    const m     = now.getMonth(); // 0-based

    const thisMonth = articles.filter((a) => {
      const d = new Date(a.createdAt);
      return d.getFullYear() === y && d.getMonth() === m;
    });

    return [...thisMonth]
      .sort((a, b) => (b.likesCount || 0) - (a.likesCount || 0))
      .slice(0, 3);
  }, [articles]);

  /* ───────────────────────────── UI ───────────────────────────── */
  return (
    <main style={{background: 'var(--clr-field-mist)'}} className="pb-5">
      {/* ─────── Hero Section ─────── */}
      {/* <section className="py-5">
        <MDBContainer>
          <MDBRow className="align-items-center">
            <MDBCol lg="6">
              <h1 className="fw-bold display-4 text-success">Together</h1>
              <p className="lead">
                Laonaz is where knowledge is exchanged, costs are reduced, and a more sustainable future takes root.
              </p>
              <MDBBtn color="warning" className="rounded-pill">
                <Link to="/about">About Laonaz</Link>
              </MDBBtn>
            </MDBCol>

            <MDBCol lg="6">
              <MDBCardImage
                className="rounded-4 shadow"
                fluid
                src="https://images.unsplash.com/photo-1524594081293-190a2fe0baae?auto=format&w=800&q=60"
              />
            </MDBCol>
          </MDBRow>
        </MDBContainer>
      </section> */}

    <section className="py-5" style={{ background: 'var(--clr-field-mist)'  }}>
      <MDBContainer fluid className="bounded px-3 px-sm-4 px-lg-4">
        
         {/* On desktop this wrapper becomes a fixed 1232px grid */}
        <MDBRow className=" gx-2 gx-md-3 gx-lg-4 gy-4 gx-lg-4">
          
          {/* ─── Left Column ─────────────────────────────────────────── */}
          <MDBCol
            lg="7" md="12"
            className="d-flex flex-column justify-content-between px-lg-5"
            
          >
            {/* Top part: heading + copy + meta */}
            <div>
              <h1
                className="u-h1 text-heading fw-normal"
              >
                Growing{' '}
                <span style={{ color: '#5C6B3C', fontWeight: 600 }}>
                  Together:
                </span>{' '}
                Knowledge, Community, and a Greener Future
              </h1>

              <p
                className="u-body mt-3"
              >
                Laonaz is where knowledge is exchanged, costs are reduced,
                and a more sustainable future takes root.
                <br/><br/>
                Explore articles, tips, and stories written by growers,
                makers, and innovators. Learn what’s working, what’s changing,
                and how others like you are growing smarter every day.
              </p>

              {/* Meta */}
              <div className="mt-4">
                <div
                 className="fw-semibold u-caption"
                >
                  #Welcome
                </div>

                {/* <div className="d-flex align-items-center gap-4 mt-2 mb-3 u-body">
                  <span>
                    October 10, 2023
                  </span>

                  <span
                    className="d-flex align-items-center gap-1"
                    
                  >
                    {/* <MDBIcon fas icon="eye" />  */}
                     {/* <img
                      src={ViewIcon}
                      alt=""
                      className="fas"
                      />
                    165
                  </span> */}

                  {/* <span
                    className="d-flex align-items-center gap-1"
                    
                  >
                    {/* <MDBIcon fas icon="thumbs-up" /> */}
                    {/* <img
                                  
                      src={LikeIcon}
                      alt=""
                    className="fas"
                    />
                     165
                  </span>
                </div>  */}

                <div className="d-flex align-items-center gap-3">
                  <Link to="/community-guide">
                    <img
                      src={communityAvatar}
                      alt="LAONAZ Community"
                      width={40}
                      height={40}
                      className="rounded-circle "
                    />
                  </Link>
                  <div>
                    <Link
                      to="/community-guide"
                      className=" text-heading fw-semibold text-decoration-none"
                      
                    >
                      LAONAZ Community
                    </Link>
                    <div
                      className="u-caption text-muted"
                    >
                      Stands With Farmers
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom part: About button */}
            <MDBBtn
              style={{
              backgroundColor: '#D6B100',       // same mustard tone
              border: 'none',
              fontFamily: 'Poppins, sans-serif',
              fontWeight: 600,
              fontSize: '16px',
              textTransform: 'none',
              padding: '20px 32px',             
              width: '187px',                   
              height: '48px',                  
              borderRadius: '17px',             
              opacity: 1,
              marginTop: '60px',                
              display: 'flex',                
              alignItems: 'center',
              alignSelf: 'center',
              justifyContent: 'center',
            }}
            >
              <Link
                to="/about"
                className="text-decoration-none"
                style={{ color: '#0A0A0A' }}
              >
                ABOUT LAONAZ
              </Link>
            </MDBBtn>
          </MDBCol>

          {/* ─── Right Column ────────────────────────────────────────── */}
          <MDBCol lg="5" md="8" sm="10" xs="12" className="p-0 mx-md-auto mx-sm-auto px-lg-5 px-md-4 px-sm-3">
            <div
              // style={{
              //   height: '100%',      // fill the column’s height
              //   overflow: 'hidden',
              //   borderTopRightRadius: '1rem',
              //   borderBottomRightRadius: '1rem',
              // }}
            >
              <img
                src={homepageImg}
                alt="Laonaz: Growing Together"
                className="w-100 h-100 object-fit-cover rounded-4"
                style={{ maxHeight: '750px' }}
              />
            </div>
          </MDBCol>

        </MDBRow>
      </MDBContainer>
    </section>
      
      <hr className="my-3 pb-2 bounded" style={{ opacity: 0.1 }} />

      {/* ─────── Latest Articles ─────── */}
      {/* <section>
        <MDBContainer>
          <h4 className="fw-bold mb-4">Latest Articles</h4>

          <MDBRow className="g-4">
            {articles.slice(0, 8).map((article) => (
              <MDBCol lg="3" md="4" sm="6" key={article.id}>
                <ArticleCard
                  article={article}
                  author={authors[article.authorId]}
                />
              </MDBCol>
            ))}
          </MDBRow>

          <div className="text-center mt-4">
            <Link
              to="/articlesPage"
              className="small fw-semibold text-decoration-underline"
            >
              View More
            </Link>
          </div>
        </MDBContainer>
      </section> */}

<section className="py-5" style={{ background: 'var(--clr-field-mist)' }}>
  <MDBContainer fluid className="bounded px-3 px-sm-4 px-lg-5">
    {/* Heading styled per Figma */}
    <h4
      className="u-h3 mb-5 text-heading"
    >
      Latest Articles
    </h4>

    <MDBRow className=" row-cols-1  row-cols-md-3 row-cols-lg-4 gx-lg-4  gx-2 gx-md-3 gy-4">
      {articles.slice(0, 8).map((article) => (
        <MDBCol xs="12" key={article.id}>
          <ArticleCard
            article={article}
            author={authors[article.authorId]}
          />
        </MDBCol>
      ))}
    </MDBRow>

    <div className="text-center mt-3">
  <Link to="/articlesPage" className="view-more-link">
    View More
  </Link>
</div>
  </MDBContainer>
      </section>

      <hr className="my-2 bounded" style={{ opacity: 0.1 }} />

      {/* ─────── Most-liked This Month ─────── */}
      <section className="py-2">
        <MDBContainer fluid className="bounded  px-lg-5">
          <h4 className="u-h3 mb-5 text-heading">Most Engaged Articles This Month</h4>

          {topLiked.length ? (
            <MDBRow className=" gx-2 gx-md-3 gy-4 g-0 g-lg-4 gx-lg-5">
              {topLiked.map((a, idx) => (
                <MDBCol lg="4" md="6" key={a.id}>
                  {/* feel free to swap for a lighter card later */}
                  <ArticleCard
                    article={a}
                    author={authors[a.authorId]}
                    /* highlight the very top article if you like */
                    // isWinner={idx === 0}
                  />
                </MDBCol>
              ))}
            </MDBRow>
          ) : (
            <p className="u-body text-muted">No likes yet this month.</p>
          )}
        </MDBContainer>
      </section>
      <CommunitySubscribeSection
        youtubeUrl="/"
        instagramUrl="https://www.instagram.com/laonaz.community/"
      />
    </main>
  );
}
