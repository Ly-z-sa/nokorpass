import { initializeApp } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-firestore.js";

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
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };
