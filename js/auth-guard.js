import { auth } from './firebase-config.js';
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-auth.js";

onAuthStateChanged(auth, (user) => {
  const path = window.location.pathname;
  const cleanPath = path.replace('.html', '').replace(/\/$/, '');
  
  const isAuthPage = cleanPath.endsWith('auth');
  const isPrivacyPage = cleanPath.endsWith('privacy');
  const isTermsPage = cleanPath.endsWith('terms');
  const isHelpPage = cleanPath.endsWith('help');
  const isAuthActionPage = cleanPath.endsWith('auth-action') || path.includes('/__/auth/action');
  const isIndexPage = cleanPath.endsWith('index') || cleanPath === '/' || cleanPath === '' || cleanPath.endsWith('Cinemart_WebProd1.5.3') || cleanPath.endsWith('Cinemart_WebProd1.8.0');
  const isMoviesPage = cleanPath.endsWith('movies');
  const isMovieDetailsPage = cleanPath.endsWith('movie-details');
  const isEventsPage = cleanPath.endsWith('events');
  
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
