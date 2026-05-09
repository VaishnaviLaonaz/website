// // // configs/storage.js
// // import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
// // export async function uploadAvatar(file, uid) {

// //   const storage = getStorage();
// //  const imageRef = ref(storage, `profile_images/${uid}/${file}`);
// //   await uploadBytes(imageRef, file);
// //   const imageUrl = await getDownloadURL(imageRef);

// //   return  imageUrl;
  
// // }
//below code woring before cost cutting

// // configs/storage.js
// import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
// import { storage } from './firebase'   // ← your initialized storage instance

// /**
//  * Upload an avatar and return its HTTPS download URL.
//  */
// export async function uploadAvatar(file, uid) {
//   const safeName = encodeURIComponent(file.name)
//   const imageRef = ref(storage, `profile_images/${uid}/${safeName}`)
//   await uploadBytes(imageRef, file)
//   return getDownloadURL(imageRef)
// }

// // import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

// // const storage = getStorage();
// // const storageRef = ref(storage, 'images/rivers.jpg');

// // const uploadTask = uploadBytesResumable(storageRef, file);

// // // Register three observers:
// // // 1. 'state_changed' observer, called any time the state changes
// // // 2. Error observer, called on failure
// // // 3. Completion observer, called on successful completion
// // uploadTask.on('state_changed', 
// //   (snapshot) => {
// //     // Observe state change events such as progress, pause, and resume
// //     // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
// //     const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
// //     console.log('Upload is ' + progress + '% done');
// //     switch (snapshot.state) {
// //       case 'paused':
// //         console.log('Upload is paused');
// //         break;
// //       case 'running':
// //         console.log('Upload is running');
// //         break;
// //     }
// //   }, 
// //   (error) => {
// //     // Handle unsuccessful uploads
// //   }, 
// //   () => {
// //     // Handle successful uploads on complete
// //     // For instance, get the download URL: https://firebasestorage.googleapis.com/...
// //     getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
// //       console.log('File available at', downloadURL);
// //     });
// //   }
// // );


//above code working before cost cutting

// src/configs/storage.js
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "./firebase";

/*
 * Phase 4: Image optimization
 *
 * Goal:
 * - Do not upload original large phone/camera images.
 * - Convert/compress images in browser before Firebase Storage upload.
 * - Use stable WebP filenames so old duplicate filenames do not create waste.
 * - Add long cache headers to reduce repeated downloads.
 */

const IMAGE_TYPES_ALLOWED = ["image/jpeg", "image/png", "image/webp"];

const IMAGE_PRESETS = {
  avatar: {
    maxWidth: 400,
    maxHeight: 400,
    quality: 0.75,
    fileName: "avatar.webp",
    contentType: "image/webp",
  },
  articleCover: {
    maxWidth: 1200,
    maxHeight: 800,
    quality: 0.78,
    fileName: "cover.webp",
    contentType: "image/webp",
  },
};

/* ─────────── validation ─────────── */

function validateImageFile(file) {
  if (!file) {
    throw new Error("No image file selected.");
  }

  if (!IMAGE_TYPES_ALLOWED.includes(file.type)) {
    throw new Error("Only JPG, PNG, and WebP images are allowed.");
  }
}

/* ─────────── browser image compression ─────────── */

function loadImageFromFile(file) {
  return new Promise((resolve, reject) => {
    const objectUrl = URL.createObjectURL(file);
    const image = new Image();

    image.onload = () => {
      URL.revokeObjectURL(objectUrl);
      resolve(image);
    };

    image.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error("Could not read selected image."));
    };

    image.src = objectUrl;
  });
}

function getContainedSize(width, height, maxWidth, maxHeight) {
  const ratio = Math.min(maxWidth / width, maxHeight / height, 1);

  return {
    width: Math.round(width * ratio),
    height: Math.round(height * ratio),
  };
}

function canvasToBlob(canvas, contentType, quality) {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error("Image compression failed."));
          return;
        }

        resolve(blob);
      },
      contentType,
      quality
    );
  });
}

async function compressImage(file, preset) {
  validateImageFile(file);

  const image = await loadImageFromFile(file);
  const { width, height } = getContainedSize(
    image.width,
    image.height,
    preset.maxWidth,
    preset.maxHeight
  );

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext("2d", { alpha: false });

  if (!ctx) {
    throw new Error("Your browser does not support image compression.");
  }

  ctx.drawImage(image, 0, 0, width, height);

  const blob = await canvasToBlob(canvas, preset.contentType, preset.quality);

  return new File([blob], preset.fileName, {
    type: preset.contentType,
    lastModified: Date.now(),
  });
}

/* ─────────── upload helper ─────────── */

async function uploadOptimizedImage(file, path, preset) {
  const optimizedFile = await compressImage(file, preset);

  const imageRef = ref(storage, path);

  await uploadBytes(imageRef, optimizedFile, {
    contentType: preset.contentType,
    cacheControl: "public,max-age=31536000,immutable",
  });

  return getDownloadURL(imageRef);
}

/**
 * Upload an avatar and return its HTTPS download URL.
 *
 * Existing function name preserved.
 * Existing usage should continue working.
 *
 * New path:
 * profile_images/{uid}/avatar.webp
 */
export async function uploadAvatar(file, uid) {
  if (!uid) {
    throw new Error("User id is required to upload avatar.");
  }

  return uploadOptimizedImage(
    file,
    `profile_images/${uid}/${IMAGE_PRESETS.avatar.fileName}`,
    IMAGE_PRESETS.avatar
  );
}

/**
 * Upload article cover image and return HTTPS download URL.
 *
 * Use this from Write/Edit Article page.
 *
 * Path:
 * article_covers/{uid}/{articleId}/cover.webp
 */
export async function uploadArticleCover(file, uid, articleId) {
  if (!uid) {
    throw new Error("User id is required to upload article cover.");
  }

  if (!articleId) {
    throw new Error("Article id is required to upload article cover.");
  }

  return uploadOptimizedImage(
    file,
    `article_covers/${uid}/${articleId}/${IMAGE_PRESETS.articleCover.fileName}`,
    IMAGE_PRESETS.articleCover
  );
}