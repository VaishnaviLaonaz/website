import React from "react";
import { Link } from "react-router-dom";
import "../../styles/laonaz-community-guide.css";

export default function LaonazCommunityGuide() {
  return (
    <main className="laonaz-guide-page">
      <section className="laonaz-guide-hero">
        <div className="laonaz-guide-hero-content">
          <p className="laonaz-guide-kicker">LAONAZ COMMUNITY</p>

          <h1>
            Learn farming, share experience, and grow together through knowledge.
          </h1>

          <p className="laonaz-guide-lead">
            Laonaz is an education-focused farming community where people can
            read articles, write blogs, ask questions, comment on useful posts,
            and help each other with practical knowledge. Our goal is to make
            farming knowledge easier to access, easier to understand, and more
            useful for everyday growers, learners, and rural communities.
          </p>

          <div className="laonaz-guide-actions">
            <Link to="/articlesPage" className="laonaz-guide-btn primary">
              Read Articles
            </Link>
            <Link to="/write" className="laonaz-guide-btn secondary">
              Write a Blog
            </Link>
          </div>
        </div>

        <div className="laonaz-guide-hero-card">
          <span>🌱</span>
          <h2>Education first. Community always.</h2>
          <p>
            Laonaz is built for sharing helpful knowledge, not for spreading
            confusion, private data, or unsupported claims.
          </p>
        </div>
      </section>

      <section className="laonaz-guide-section">
        <div className="laonaz-guide-section-heading">
          <p className="laonaz-guide-kicker">HOW TO USE LAONAZ</p>
          <h2>Simple ways to participate</h2>
        </div>

        <div className="laonaz-guide-grid">
          <article className="laonaz-guide-info-card">
            <span>📖</span>
            <h3>Read useful articles</h3>
            <p>
              Explore blogs, guides, farming tips, community stories, and
              educational content written by members. Use articles to learn what
              others are trying, what is working, and what challenges farmers are
              facing.
            </p>
          </article>

          <article className="laonaz-guide-info-card">
            <span>✍️</span>
            <h3>Write blogs and share knowledge</h3>
            <p>
              If you have farming experience, local knowledge, research notes,
              sustainability ideas, or practical lessons, you can publish them as
              blogs. Write clearly, keep information helpful, and avoid posting
              misleading or harmful advice.
            </p>
          </article>

          <article className="laonaz-guide-info-card">
            <span>💬</span>
            <h3>Comment and help others</h3>
            <p>
              Use comments to ask questions, clarify information, and support
              other members. Good comments can help farmers understand problems,
              compare methods, and make better decisions.
            </p>
          </article>

          <article className="laonaz-guide-info-card">
            <span>🤝</span>
            <h3>Build a trusted community</h3>
            <p>
              Follow members, learn from contributors, and support respectful
              discussion. Laonaz works best when members share honest experience,
              practical solutions, and constructive feedback.
            </p>
          </article>
        </div>
      </section>

      <section className="laonaz-guide-motive">
        <div>
          <p className="laonaz-guide-kicker">OUR MOTIVE</p>
          <h2>Why Laonaz exists</h2>
        </div>

        <p>
          Farming knowledge is often scattered across conversations, local
          experience, videos, social media, and personal trial-and-error. Laonaz
          brings that knowledge into one community space where people can learn
          from each other in a more organized and accessible way. The purpose of
          Laonaz is to support education, awareness, and collaboration in
          farming. We want growers, learners, creators, experts, suppliers, and
          community members to exchange useful information that can reduce
          confusion, improve decision-making, and encourage sustainable thinking.
          Laonaz is not only a blogging platform; it is a knowledge-sharing space
          built around trust, respect, and community learning.
        </p>
      </section>

      <section className="laonaz-guide-section">
        <div className="laonaz-guide-section-heading">
          <p className="laonaz-guide-kicker">COMMUNITY VALUES</p>
          <h2>What we encourage</h2>
        </div>

        <div className="laonaz-guide-values">
          <div>
            <h3>Helpful knowledge</h3>
            <p>
              Share content that can educate, guide, or support others.
            </p>
          </div>

          <div>
            <h3>Respectful discussion</h3>
            <p>
              Ask questions and respond with patience, clarity, and respect.
            </p>
          </div>

          <div>
            <h3>Practical learning</h3>
            <p>
              Prefer real examples, clear explanations, and useful steps.
            </p>
          </div>

          <div>
            <h3>Responsible content</h3>
            <p>
              Avoid false claims, copied content, spam, or harmful advice.
            </p>
          </div>
        </div>
      </section>

      <section className="laonaz-guide-data">
        <div className="laonaz-guide-data-content">
          <p className="laonaz-guide-kicker">DATA AND PRIVACY</p>
          <h2>Your trust matters to us</h2>

          <p>
            Laonaz uses account information only to support website features
            such as login, profile setup, article publishing, comments,
            bookmarks, likes, and community interaction. We do not sell your
            personal data. We do not use your private profile information for
            unrelated third-party sharing. Public activity such as articles,
            comments, profile name, username, avatar, and visible community
            actions may be shown on the website because they are part of the
            blogging and community experience.
          </p>

          <p>
            Members should avoid posting private information such as personal
            addresses, financial details, passwords, identity documents, or
            sensitive personal data in articles or comments. Laonaz is an
            educational blogging community, so information shared here should be
            useful, respectful, and safe for public learning.
          </p>
        </div>

        <div className="laonaz-guide-data-list">
          <h3>We aim to protect trust by:</h3>
          <ul>
            <li>Using login-based access for community features.</li>
            <li>Keeping profile and article data structured in database.</li>
            <li>Showing only community-relevant public information.</li>
            <li>Encouraging safe, educational, and respectful content.</li>
            <li>Not selling personal user data.</li>
          </ul>
        </div>
      </section>

      <section className="laonaz-guide-cta">
        <h2>Be part of a community that grows through shared knowledge.</h2>
        <p>
          Read, write, comment, and help others learn. Every useful post can
          support someone’s farming journey.
        </p>

        <div className="laonaz-guide-actions center">
          <Link to="/login" className="laonaz-guide-btn primary">
            Join Community
          </Link>
          <Link to="/articlesPage" className="laonaz-guide-btn secondary">
            Explore Articles
          </Link>
        </div>
      </section>
    </main>
  );
}