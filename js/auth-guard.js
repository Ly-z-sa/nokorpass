import { auth, db } from './firebase-config.js';
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-auth.js";
import { doc, getDoc, setDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-firestore.js";

async function syncUserProfile(user) {
  if (!user) return;
  try {
    const userRef = doc(db, "users", user.uid);
    const snap = await getDoc(userRef);
    if (!snap.exists()) {
      await setDoc(userRef, {
        uid: user.uid,
        email: user.email || '',
        displayName: user.displayName || user.email?.split('@')[0] || 'User',
        isAdmin: false,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
    } else {
      // Keep email/name up to date without overwriting isAdmin
      await setDoc(userRef, {
        email: user.email || snap.data().email || '',
        displayName: user.displayName || snap.data().displayName || 'User',
        updatedAt: serverTimestamp()
      }, { merge: true });
    }
  } catch (err) {
    console.error("Error syncing user profile:", err);
  }
}

onAuthStateChanged(auth, (user) => {
  if (user) {
    syncUserProfile(user);
  }

  const path = window.location.pathname;
  const cleanPath = path.replace('.html', '').replace(/\/$/, '');
  
  const isAuthPage = cleanPath.endsWith('auth');
  const isPrivacyPage = cleanPath.endsWith('privacy');
  const isTermsPage = cleanPath.endsWith('terms');
  const isHelpPage = cleanPath.endsWith('help');
  const isAuthActionPage = cleanPath.endsWith('auth-action') || path.includes('/__/auth/action');
  const isIndexPage = cleanPath.endsWith('index') || cleanPath === '/' || cleanPath === '' || cleanPath.endsWith('Cinemart_WebProd1.5.3');
  const isMoviesPage = cleanPath.endsWith('movies');
  const isMovieDetailsPage = cleanPath.endsWith('movie-details');
  const isEventsPage = cleanPath.endsWith('events');
  const isSnacksPage = cleanPath.endsWith('snacks');
  
  const isPublicPage = isAuthPage || isAuthActionPage || isPrivacyPage || isTermsPage || isHelpPage || isIndexPage || isMoviesPage || isMovieDetailsPage || isEventsPage || isSnacksPage;
  
  const redirectUrl = encodeURIComponent(window.location.href);

  if (!user) {
    if (!isPublicPage) {
      window.location.href = `auth.html?redirect=${redirectUrl}`;
    }
    return;
  }

  // Determine if user authenticated via Google (Google verifies their own emails)
  const isGoogleUser = user.providerData && user.providerData.some(p => p.providerId === 'google.com');
  const isVerified = user.emailVerified || isGoogleUser;

  if (!isVerified) {
    // Email/password user who hasn't verified yet — only allow public pages
    if (!isPublicPage) {
      window.location.href = `auth.html?redirect=${redirectUrl}`;
    }
  } else if (isAuthPage) {
    // Already logged in and verified — don't let them stay on auth page
    window.location.href = 'index.html';
  }
});
