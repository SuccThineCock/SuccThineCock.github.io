// Firebase ES modules from the official CDN
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth, signInAnonymously, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getFirestore, collection, onSnapshot, doc, getDoc, setDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// 1) Paste your config from Firebase console (Project settings → Your apps → Web)
const firebaseConfig = {
  apiKey: "AIzaSyDV4xMGLtMwZDMACr9gX5IAW-pLEVX3dng",
  authDomain: "neocities-bedb7.firebaseapp.com",
  projectId: "neocities-bedb7",
  appId: "1:102287796472:web:7d40ca875212a70796b30d"
};


