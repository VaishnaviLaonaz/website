import React from "react";
import { Link } from "react-router-dom";
import "../../styles/legal-pages.css";

export default function SecurityPage() {
  return (
    <main className="legal-page bounded">
      <section className="legal-hero">
        <p className="legal-kicker">LAONAZ SECURITY</p>
        <h1>Security</h1>
        <p>
          Laonaz is designed to protect user access, community data, and public
          content through structured authentication, database rules, and careful
          access control.
        </p>
      </section>

      <section className="legal-content">
        <div className="legal-block">
          <h2>1. Authentication</h2>
          <p>
            Laonaz uses secure authentication methods such as email/password and
            Google sign-in. Account-based access helps protect private actions
            such as writing articles, editing profiles, posting comments,
            bookmarking content, and managing community activity.
          </p>
        </div>

        <div className="legal-block">
          <h2>2. Database access rules</h2>
          <p>
            Laonaz uses database security rules to control how users can read
            and write data. Public content such as articles and visible profiles
            may be readable by visitors, while protected actions require a
            logged-in account and proper ownership permissions.
          </p>
        </div>

        <div className="legal-block">
          <h2>3. User responsibility</h2>
          <p>
            Users must keep their login details private and avoid sharing
            passwords or account access. If you suspect unauthorized account
            activity, reset your password and contact the Laonaz team through
            the official support channel.
          </p>
        </div>

        <div className="legal-block">
          <h2>4. Content safety</h2>
          <p>
            Members should not upload unsafe files, malicious links, spam,
            copied content, or private documents. Laonaz is an educational
            blogging platform, and content should remain useful, safe, and
            respectful.
          </p>
        </div>

        <div className="legal-block">
          <h2>5. Platform monitoring</h2>
          <p>
            We may review technical errors, suspicious activity, misuse patterns,
            and platform behavior to protect the website and improve reliability.
            Security-related monitoring is used to maintain trust and prevent
            abuse.
          </p>
        </div>

        <div className="legal-block">
          <h2>6. Limitations</h2>
          <p>
            No online platform can guarantee absolute security. Laonaz applies
            reasonable technical and operational protections, but users should
            also take care when sharing information publicly and when accessing
            the platform from shared devices or public networks.
          </p>
        </div>

        <div className="legal-footer-note">
          <p>
            Learn how we handle personal data in our{" "}
            <Link to="/privacy">Privacy Policy</Link>.
          </p>
        </div>
      </section>
    </main>
  );
}