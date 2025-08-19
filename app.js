const { onCall } = require('firebase-functions/v2/https');
const { setGlobalOptions } = require('firebase-functions/v2');
const admin = require('firebase-admin');
setGlobalOptions({ region: 'us-central1' });

admin.initializeApp();
const db = admin.firestore();

exports.hit = onCall({}, async (req) => {
  const page = (req.data?.page || 'global').toString().slice(0, 200);
  const ref = db.doc(`counters/${encodeURIComponent(page)}`);
  await ref.set({
    count: admin.firestore.FieldValue.increment(1),
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
  }, { merge: true });
  const snap = await ref.get();
  return { count: snap.get('count') || 0 };
});
