import React from "react";
import { Link } from "react-router-dom";
import "../../styles/community-subscribe-section.css";

export default function CommunitySubscribeSection({
  youtubeUrl = "https://www.youtube.com/",
  instagramUrl = "https://www.instagram.com/",
}) {
  return (
    <section className="community-subscribe-section bounded">
      <div className="community-subscribe-card">
        <div className="community-subscribe-content">
          <span className="community-subscribe-eyebrow">
            Join the Laonaz Community
          </span>

          <h2 className="community-subscribe-title">
            Learn, share, and grow with us beyond the website.
          </h2>

          <p className="community-subscribe-text">
            Subscribe to our newsletter, watch helpful farming videos, and follow
            our community updates on Instagram.
          </p>

          <div className="community-subscribe-actions">
            <Link to="/login" className="community-subscribe-primary">
              Join Newsletter
            </Link>

            <a
              href={youtubeUrl}
              target="_blank"
              rel="noreferrer"
              className="community-subscribe-secondary"
            >
              Watch Videos
            </a>
          </div>
        </div>

        <div className="community-social-panel">
          <a
            href={youtubeUrl}
            target="_blank"
            rel="noreferrer"
            className="community-social-link"
          >
            <span className="community-social-icon">▶</span>
            <span>
              <strong>YouTube</strong>
              <small>Watch guides, stories, and learning videos</small>
            </span>
          </a>

          <a
            href={instagramUrl}
            target="_blank"
            rel="noreferrer"
            className="community-social-link"
          >
            <span className="community-social-icon">◎</span>
            <span>
              <strong>Instagram</strong>
              <small>Follow community updates and highlights</small>
            </span>
          </a>

          <Link to="/login" className="community-social-link">
            <span className="community-social-icon">✉</span>
            <span>
              <strong>Newsletter</strong>
              <small>Get updates, articles, and community news</small>
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}