import { Routes, Route, Navigate } from 'react-router-dom';

/* pages */
import LoginPage                        from '../components/Auth/LoginPage';
import RegistrationPage                 from '../components/Auth/RegistrationPage';
import ProfileSetup                     from '../components/Auth/ProfileSetup';
import ForgotPassword                   from '../components/Auth/ForgotPassword';

import Home                             from '../components/Pages/HomePageCommunity';
import About                            from '../components/services/About';
import WriteArticle                     from '../components/Pages/Write';
import ArticleDetailPage from '../components/cards/ArticleDetailPage';
import VerifyEmailPage from '../components/Auth/VerifyEmailPage';
import UserDashboardProfilePage         from '../components/Pages/UserDashboardProfilePage';
import EditProfilePageOnProfilePage     from '../components/Pages/EditProfilePageOnProfilePage';
import ThirdPersonView                  from '../components/Pages/ThirdPersonView';
import ArticlesPage from '../components/cards/ArticlesPage';
/* guards */
import { RequireAuth}       from './route-guards';

export default function Router() {
  return (
    <Routes>

      {/* ── PUBLIC ────────────────────────────────────────────── */}
      <Route path="/"        element={<Home />} />
      <Route path="/home"    element={<Home />} />
      <Route path="/about"   element={<About />} />
      <Route path="/u/:username" element={<ThirdPersonView />} />
      <Route path="/article/:articleId" element={<ArticleDetailPage />} />
      <Route path="/articlesPage" element={<ArticlesPage />} />
        <Route path="/verify-email" element={<VerifyEmailPage />} />
      {/* ── GUEST-ONLY (hide once logged-in) ──────────────────── */}
      <Route>
        <Route path="/login"           element={<LoginPage />} />
        <Route path="/register"        element={<RegistrationPage />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
      </Route>

      {/* ── AUTH-REQUIRED ─────────────────────────────────────── */}
      <Route element={<RequireAuth />}>

        {/* profile onboarding can only happen if you ARE logged-in */}
        <Route path="/profilesetup"      element={<ProfileSetup />} />

        {/* member area */}
        <Route path="/profile"           element={<UserDashboardProfilePage />} />
        <Route path="/profile/edit"      element={<EditProfilePageOnProfilePage />} />
        <Route path="/write"             element={<WriteArticle />} />
        {/* <Route path="/article/new" element={<WriteArticle />} /> */}
        <Route path="/write/edit/:id" element={<WriteArticle />} />

        {/* TODO: once you create them, simply add here
              <Route path="/followers"  element={<FollowersPage />} />
              <Route path="/following"  element={<FollowingPage />} />
              <Route path="/bookmarks"  element={<BookmarksPage />} />
              <Route path="/posts"      element={<MyPostsPage />} /> */}
      </Route>

      {/* ── FALLBACK → never show header/footer on nonsense URLs ─ */}
      <Route path="*" element={<Navigate to="/" replace />} />

    </Routes>
  );
}
