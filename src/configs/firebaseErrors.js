// src/lib/firebaseErrors.js
export default function humanFirebaseError(err) {
  if (!err?.code) return err?.message ?? String(err);

  const nice = {
    'auth/email-already-in-use' : 'This email address is already registered.',
    'auth/invalid-email'        : 'Please enter a valid email address.',
    'auth/user-not-found'       : 'No account exists with that email.',
    'auth/wrong-password'       : 'Incorrect password.',
    'auth/weak-password'        : 'Password must be at least 6 characters.',
    'auth/too-many-requests'    : 'Too many attempts – try again later.',
    'permission-denied'         : 'You do not have permission to do that.',
    'storage/unauthorized'      : 'You are not authorised to upload that file.',
  };

  return nice[err.code] || 'Something went wrong – please try again.';
}
