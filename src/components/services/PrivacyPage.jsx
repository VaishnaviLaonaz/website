import React from "react";
import { Link } from "react-router-dom";
import "../../styles/legal-pages.css";

export default function PrivacyPage() {
  return (
    <main className="legal-page bounded ">
      <section className="legal-hero">
        <p className="legal-kicker">LAONAZ PRIVACY</p>
        <h1>Privacy Policy</h1>
        <p>
          Your trust matters to us. This policy explains what information Laonaz
          collects, why we use it, and how we handle community data responsibly.
        </p>
      </section>

      <section className="legal-content">
        <div className="legal-block">
          <h2>1. Information we collect</h2>
          <p>
            Laonaz may collect information you provide during registration,
            login, profile setup, article publishing, comments, bookmarks,
            likes, follows, and community interactions. This may include your
            name, username, email address, profile image, location, selected
            role, article content, comments, and activity related to community
            features.
          </p>
        </div>

        <div className="legal-block">
          <h2>2. How we use information</h2>
          <p>
            We use information to operate the website, authenticate users,
            manage profiles, display articles, support comments and community
            interactions, improve the platform, prevent misuse, and maintain a
            safer educational blogging environment.
          </p>
        </div>

        <div className="legal-block">
          <h2>3. Public community information</h2>
          <p>
            Some information is visible to others because Laonaz is a blogging
            and community platform. Public information may include your username,
            profile name, avatar, articles, comments, likes, follows, and other
            visible community actions.
          </p>
        </div>

        <div className="legal-block">
          <h2>4. Private information</h2>
          <p>
            We do not sell your personal data. We do not intentionally share
            private account information with unrelated third parties for
            advertising resale. Access to data is limited to what is needed to
            operate, secure, and improve the Laonaz platform.
          </p>
        </div>

        <div className="legal-block">
          <h2>5. Firebase and platform services</h2>
          <p>
            Laonaz uses Firebase services for authentication, database storage,
            hosting, file storage, and related platform functionality. These
            services help us manage login, user profiles, articles, comments,
            likes, bookmarks, and other app features.
          </p>
        </div>

        <div className="legal-block">
          <h2>6. Data safety responsibilities</h2>
          <p>
            Users should not post sensitive personal information in public
            areas. Avoid sharing identity documents, passwords, financial
            details, private addresses, personal phone numbers, or confidential
            farming/business information in articles, comments, or public
            profiles.
          </p>
        </div>

        <div className="legal-block">
          <h2>7. Account and data requests</h2>
          <p>
            If you want to update profile information, remove content, or request
            account-related changes, you can use available platform settings or
            contact the Laonaz team through the official support/contact channel
            provided on the website.
          </p>
        </div>

        <div className="legal-footer-note">
          <p>
            Last updated: May 2026. For website cookie details, read our{" "}
            <Link to="/cookies">Cookie Policy</Link>.
          </p>
        </div>
      </section>
    </main>
  );
}