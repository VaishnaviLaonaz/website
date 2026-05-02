import React from "react";
import { Link } from "react-router-dom";
import "../../styles/legal-pages.css";

export default function TermsPage() {
  return (
    <main className="legal-page bounded ">
      <section className="legal-hero">
        <p className="legal-kicker">LAONAZ TERMS</p>
        <h1>Terms of Use</h1>
        <p>
          These terms explain how visitors and registered members may use Laonaz.
          By using this website, you agree to use the platform responsibly,
          respectfully, and for educational and community-focused purposes.
        </p>
      </section>

      <section className="legal-content">
        <div className="legal-block">
          <h2>1. About Laonaz</h2>
          <p>
            Laonaz is an educational blogging and community platform focused on
            farming knowledge, sustainability, practical learning, and community
            support. Members may read articles, publish blogs, comment on posts,
            follow other users, and participate in knowledge-sharing discussions.
          </p>
        </div>

        <div className="legal-block">
          <h2>2. User accounts</h2>
          <p>
            Some features require an account, such as writing articles,
            commenting, liking, bookmarking, following users, or managing your
            profile. You are responsible for keeping your account login details
            secure and for all activity performed through your account.
          </p>
        </div>

        <div className="legal-block">
          <h2>3. Community conduct</h2>
          <p>
            Members must use Laonaz respectfully. Do not post abusive,
            misleading, harmful, discriminatory, illegal, spam-like, or
            intentionally false content. Comments and articles should support
            learning, discussion, and constructive community interaction.
          </p>
        </div>

        <div className="legal-block">
          <h2>4. Educational content</h2>
          <p>
            Content on Laonaz is provided for educational and community
            knowledge-sharing purposes. Farming practices can vary by region,
            climate, soil, crop, regulation, and available resources. Users
            should apply their own judgment and consult qualified professionals
            before making important farming, financial, safety, or business
            decisions.
          </p>
        </div>

        <div className="legal-block">
          <h2>5. User-generated content</h2>
          <p>
            When you publish articles, comments, profile information, images, or
            other content, you confirm that you have the right to share that
            content. You should not upload copied material, private information,
            or content that violates another person’s rights.
          </p>
        </div>

        <div className="legal-block">
          <h2>6. Platform moderation</h2>
          <p>
            Laonaz may remove, restrict, or review content that appears unsafe,
            misleading, spam-like, abusive, or unrelated to the purpose of the
            community. Accounts that repeatedly misuse the platform may lose
            access to community features.
          </p>
        </div>

        <div className="legal-block">
          <h2>7. Changes to the platform</h2>
          <p>
            Laonaz may update, improve, remove, or modify website features over
            time. We may also update these terms when the platform evolves. Your
            continued use of Laonaz means you accept the latest version of these
            terms.
          </p>
        </div>

        <div className="legal-footer-note">
          <p>
            Last updated: May 2026. For privacy-related details, please read our{" "}
            <Link to="/privacy">Privacy Policy</Link>.
          </p>
        </div>
      </section>
    </main>
  );
}