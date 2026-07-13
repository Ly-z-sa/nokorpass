import { auth } from './firebase-config.js';
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-auth.js";

onAuthStateChanged(auth, (user) => {
  const path = window.location.pathname;
  const isAuthPage = path.endsWith('auth.html');
  const isPrivacyPage = path.endsWith('privacy.html');
  const isTermsPage = path.endsWith('terms.html');
  const isHelpPage = path.endsWith('help.html');
  const isAuthActionPage = path.endsWith('auth-action.html') || path.includes('/__/auth/action');
  const isIndexPage = path.endsWith('index.html') || path === '/' || path === '';
  const isMoviesPage = path.endsWith('movies.html');
  const isMovieDetailsPage = path.endsWith('movie-details.html');
  
  const isEventsPage = path.endsWith('events.html');
  
  const isPublicPage = isAuthPage || isAuthActionPage || isPrivacyPage || isTermsPage || isHelpPage || isIndexPage || isMoviesPage || isMovieDetailsPage || isEventsPage;
  
  const redirectUrl = encodeURIComponent(window.location.href);
  if (!user) {
    if (!isPublicPage) {
      window.location.href = `auth.html?redirect=${redirectUrl}`;
    }
  } else {
    // If logged in but not verified, only allowed on public pages (like verification screen in auth.html)
    if (!user.emailVerified) {
       if (!isPublicPage) {
         window.location.href = `auth.html?redirect=${redirectUrl}`;
       }
    } else if (isAuthPage) {
      // If user is already logged in and verified, don't let them stay on auth page
      window.location.href = 'index.html';
    }
  }
});
