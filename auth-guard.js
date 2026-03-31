import { auth } from './firebase-config.js';
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-auth.js";

onAuthStateChanged(auth, (user) => {
  const path = window.location.pathname;
  const isAuthPage = path.endsWith('auth.html');
  const isPrivacyPage = path.endsWith('privacy.html');
  const isTermsPage = path.endsWith('terms.html');
  
  const isPublicPage = isAuthPage || isPrivacyPage || isTermsPage;
  
  if (!user) {
    if (!isPublicPage) {
      window.location.href = 'auth.html';
    }
  } else {
    // If logged in but not verified, only allowed on public pages (like verification screen in auth.html)
    if (!user.emailVerified) {
       if (!isPublicPage) {
         window.location.href = 'auth.html';
       }
    } else if (isAuthPage) {
      // If user is already logged in and verified, don't let them stay on auth page
      window.location.href = 'index.html';
    }
  }
});
