// src/lib/firebaseErrors.js

export default function humanFirebaseError(err) {
  const code = err?.code;
  const message = err?.message;

  if (!code) {
    return message || "Something went wrong. Please try again.";
  }

  const nice = {
    // Auth - registration/login
    "auth/email-already-in-use": "This email address is already registered. Please log in instead.",
    "auth/invalid-email": "Please enter a valid email address.",
    "auth/user-not-found": "No account exists with this email address.",
    "auth/wrong-password": "Incorrect password. Please try again.",
    "auth/invalid-credential": "Invalid email or password. Please check your details and try again.",
    "auth/missing-password": "Please enter your password.",
    "auth/missing-email": "Please enter your email address.",
    "auth/weak-password": "Password must be at least 6 characters.",
    "auth/too-many-requests": "Too many failed attempts. Please wait and try again later.",
    "auth/network-request-failed": "Network error. Please check your internet connection.",
    "auth/popup-closed-by-user": "Google sign-in was closed before completion.",
    "auth/cancelled-popup-request": "Another sign-in popup is already open.",
    "auth/popup-blocked": "Popup was blocked by your browser. Please allow popups and try again.",
    "auth/account-exists-with-different-credential": "An account already exists with this email using a different sign-in method.",
    "auth/requires-recent-login": "For security, please log in again before making this change.",
    "auth/user-disabled": "This account has been disabled. Please contact support.",
    "auth/operation-not-allowed": "This sign-in method is not enabled yet.",
    "auth/unauthorized-domain": "This domain is not authorized for Firebase login.",

    // Firestore
    "permission-denied": "You do not have permission to perform this action.",
    "not-found": "The requested data was not found.",
    "already-exists": "This data already exists.",
    "resource-exhausted": "Too many requests. Please try again later.",
    "failed-precondition": "This action cannot be completed right now. Please refresh and try again.",
    "unavailable": "Service is temporarily unavailable. Please try again shortly.",
    "deadline-exceeded": "The request took too long. Please check your connection and try again.",
    "cancelled": "The request was cancelled. Please try again.",
    "data-loss": "Some data could not be processed safely.",
    "unauthenticated": "Please log in to continue.",

    // Firebase Storage
    "storage/unauthorized": "You are not authorized to upload or access this file.",
    "storage/canceled": "File upload was cancelled.",
    "storage/unknown": "Something went wrong during file upload.",
    "storage/object-not-found": "The requested file was not found.",
    "storage/quota-exceeded": "Storage limit exceeded. Please try again later.",
    "storage/invalid-format": "Invalid file format.",
    "storage/invalid-event-name": "Invalid upload event.",
    "storage/retry-limit-exceeded": "Upload took too long. Please try again.",
  };

  return nice[code] || "Something went wrong. Please try again.";
}