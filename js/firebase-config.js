import { initializeApp } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-firestore.js";
import { initializeAppCheck, ReCaptchaV3Provider } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-app-check.js";

const firebaseConfig = {
  apiKey: "AIzaSyBvvGVXQVCfItHCeZZI1mMjmc-dzPSMlao",
  authDomain: "cinemart-ticket-service.firebaseapp.com",
  projectId: "cinemart-ticket-service",
  storageBucket: "cinemart-ticket-service.firebasestorage.app",
  messagingSenderId: "1066002281166",
  appId: "1:1066002281166:web:3d2af8e26997d1b11e569f",
  measurementId: "G-SMJJ74RV6N"
};

const app = initializeApp(firebaseConfig);

const path = typeof window !== 'undefined' ? window.location.pathname : '';
const isAuthActionPage =
  path.includes('/__/auth/action') || path.endsWith('auth-action.html');

/* App Check + reCAPTCHA is not loaded on email link pages — skip or Auth hangs forever */
if (!isAuthActionPage) {
  initializeAppCheck(app, {
    provider: new ReCaptchaV3Provider('6LfKqPUsAAAAAHzs58j0An6sTuCNQWEYMbs979Nd'),
    isTokenAutoRefreshEnabled: true,
  });
}

const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };
