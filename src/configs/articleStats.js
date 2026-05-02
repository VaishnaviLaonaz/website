// utils/articleStats.js
import { doc, setDoc, increment } from "firebase/firestore";
import { db as fsDb } from "../configs/firebase";

export async function recordArticleView(articleId) {
  await setDoc(
    doc(fsDb, "articleStats", articleId),
    { views: increment(1) },
    { merge: true }
  );
}
