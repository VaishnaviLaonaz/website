import React from "react";
import { Link } from "react-router-dom";
import "../../styles/legal-pages.css";

export default function CookiesPage() {
  return (
    <main className="legal-page">
      <section className="legal-hero">
        <p className="legal-kicker">LAONAZ COOKIES</p>
        <h1>Cookie Policy</h1>
        <p>
          This page explains how Laonaz may use cookies, browser storage, and
          similar technologies to support login, user experience, security, and
          website functionality.
        </p>
      </section>

      <section className="legal-content">
        <div className="legal-block">
          <h2>1. What cookies are</h2>
          <p>
            Cookies are small pieces of data stored by your browser. Websites
            use them to remember sessions, preferences, security state, and
            certain user experience settings. Similar browser technologies may
            include local storage and session storage.
          </p>
        </div>

        <div className="legal-block">
          <h2>2. How Laonaz uses cookies</h2>
          <p>
            Laonaz may use cookies or browser storage to keep you signed in,
            remember authentication state, maintain secure sessions, improve
            navigation, and support website features such as user profiles,
            articles, comments, bookmarks, and community interactions.
          </p>
        </div>

        <div className="legal-block">
          <h2>3. Essential cookies</h2>
          <p>
            Essential cookies and storage are required for important platform
            features such as login, authentication, security, and account-based
            functionality. If you disable these, some parts of Laonaz may not
            work correctly.
          </p>
        </div>

        <div className="legal-block">
          <h2>4. Analytics and improvement</h2>
          <p>
            Laonaz may use technical data to understand website performance,
            errors, and usage patterns. This helps us improve reliability,
            content structure, and the overall community experience.
          </p>
        </div>

        <div className="legal-block">
          <h2>5. Managing cookies</h2>
          <p>
            You can manage cookies through your browser settings. You may delete
            cookies, block them, or configure browser permissions. However,
            blocking essential cookies may affect login and member features.
          </p>
        </div>

        <div className="legal-block">
          <h2>6. Updates</h2>
          <p>
            We may update this Cookie Policy as Laonaz grows or as platform
            features change. Continued use of the website means you accept the
            latest version of this policy.
          </p>
        </div>

        <div className="legal-footer-note">
          <p>
            For broader data handling details, read our{" "}
            <Link to="/privacy">Privacy Policy</Link>.
          </p>
        </div>
      </section>
    </main>
  );
}