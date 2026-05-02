// functions/index.js (Node 18+)
const functions = require("firebase-functions/v2");
const admin = require("firebase-admin");
admin.initializeApp();
const db = admin.firestore();

exports.onLikeWrite = functions.firestore
  .document("articleLikes/{articleId}/byUser/{uid}")
  .onWrite(async (change, ctx) => {
    const { articleId } = ctx.params;
    const statsRef = db.doc(`articleStats/${articleId}`);
    const inc = change.after.exists ? 1 : -1;
    await statsRef.set({ likes: admin.firestore.FieldValue.increment(inc) }, { merge: true });
  });

  exports.onCommentWrite = functions.firestore
  .document("articles/{articleId}/comments/{commentId}")
  .onWrite(async (change, ctx) => {
    const { articleId } = ctx.params;
    const statsRef = db.doc(`articleStats/${articleId}`);
    const inc = change.after.exists ? (change.before.exists ? 0 : 1) : -1;
    if (inc !== 0) {
      await statsRef.set({ comments: admin.firestore.FieldValue.increment(inc) }, { merge: true });
    }
  });
