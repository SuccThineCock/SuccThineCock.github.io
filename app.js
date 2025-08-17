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

// 2) Init Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db   = getFirestore(app);

// 3) DOM
const msgEl = document.getElementById('msg');
const errEl = document.getElementById('err');
const btns  = Array.from(document.querySelectorAll('button[data-choice]'));

const counts = { scifi: 0, fantasy: 0, community: 0 };
function renderCounts() {
  document.getElementById('c-scifi').textContent = counts.scifi;
  document.getElementById('c-fantasy').textContent = counts.fantasy;
  document.getElementById('c-community').textContent = counts.community;
}

// 4) Live tally (client-side aggregation)
const votesCol = collection(db, "votes");
onSnapshot(votesCol, (snap) => {
  counts.scifi = counts.fantasy = counts.community = 0;
  snap.forEach(d => {
    const c = d.data().choice;
    if (c && counts[c] !== undefined) counts[c]++;
  });
  renderCounts();
});

// 5) Sign in anonymously (requires Auth → Anonymous enabled and your domain authorized)
await signInAnonymously(auth);

let voted = false;
onAuthStateChanged(auth, async (user) => {
  if (!user) return;
  const myVoteRef = doc(db, "votes", user.uid);
  const myVote = await getDoc(myVoteRef);
  voted = myVote.exists();
  btns.forEach(b => b.disabled = voted); // lock buttons if already voted
  msgEl.textContent = voted ? "You already voted. Thanks!" : "Pick one option.";
});

// 6) Vote handler: writes to /votes/{auth.uid}
btns.forEach(b => {
  b.addEventListener('click', async () => {
    errEl.textContent = "";
    const user = auth.currentUser;
    if (!user) return (errEl.textContent = "Not signed in.");
    if (voted) return (errEl.textContent = "You already voted.");

    const choice = b.dataset.choice;
    try {
      const myVoteRef = doc(db, "votes", user.uid);
      await setDoc(myVoteRef, { choice, createdAt: serverTimestamp() }, { merge: false });
      voted = true;
      btns.forEach(x => x.disabled = true);
      msgEl.textContent = "Vote recorded!";
    } catch (e) {
      errEl.textContent = e.message || String(e);
    }
  });
});
