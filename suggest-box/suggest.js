import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth, signInAnonymously } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getFirestore, collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// TODO: paste your Firebase config here
const firebaseConfig = {
  apiKey: "AIzaSyDV4xMGLtMwZDMACr9gX5IAW-pLEVX3dng",
  authDomain: "neocities-bedb7.firebaseapp.com",
  projectId: "neocities-bedb7",
  appId: "1:102287796472:web:7d40ca875212a70796b30d"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db   = getFirestore(app);

// sign in anonymously so rules allow create
await signInAnonymously(auth);

// cheap client-side rate limit: 1 submission per 60s per browser
const lastKey = "suggest.last";
function canSubmit() {
  const last = Number(localStorage.getItem(lastKey) || 0);
  return Date.now() - last > 60_000;
}
function markSubmitted() {
  localStorage.setItem(lastKey, String(Date.now()));
}

const form = document.getElementById("form");
const msgEl = document.getElementById("msg");
const errEl = document.getElementById("err");
const btn = document.getElementById("send");

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  errEl.textContent = "";
  msgEl.textContent = "";

  if (!canSubmit()) {
    errEl.textContent = "Please wait a minute before sending another suggestion.";
    return;
  }

  const name = (document.getElementById("name").value || "").trim();
  const text = (document.getElementById("text").value || "").trim();
  if (!text) {
    errEl.textContent = "Write a suggestion first.";
    return;
  }

  btn.disabled = true;
  try {
    await addDoc(collection(db, "suggestions"), {
      name: name || null,
      text,
      uid: auth.currentUser?.uid || null,
      createdAt: serverTimestamp()
    });
    markSubmitted();
    msgEl.textContent = "Thanks! Your suggestion was sent.";
    form.reset();
  } catch (e) {
    errEl.textContent = e.message || String(e);
  } finally {
    btn.disabled = false;
  }
});
