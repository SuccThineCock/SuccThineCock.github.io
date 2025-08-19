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


// functions/index.js
const { onCall } = require('firebase-functions/v2/https');
const admin = require('firebase-admin');
admin.initializeApp();
const db = admin.firestore();

exports.hit = onCall({ region: 'us-central1' }, async (req) => {
  const page = (req.data?.page || 'global').toString().slice(0,200);
  const ref = db.doc(`counters/${encodeURIComponent(page)}`);
  await ref.set({ count: admin.firestore.FieldValue.increment(1),
                  updatedAt: admin.firestore.FieldValue.serverTimestamp() }, { merge: true });
  const snap = await ref.get();
  return { count: snap.get('count') || 0 };
});
