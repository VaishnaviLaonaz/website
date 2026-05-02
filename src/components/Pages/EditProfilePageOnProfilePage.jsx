// import React, { useEffect, useRef, useState } from 'react';
// import {
//   MDBContainer,
//   MDBRow,
//   MDBCol,
//   MDBCard,
//   MDBCardBody,
//   MDBBtn,
//   MDBInput,
//   MDBFile,
//   MDBCheckbox,
//   MDBSpinner,
// } from 'mdb-react-ui-kit';
// import ProfileImageUploader from './ProfileImageUploader';
// // import { useNavigate } from 'react-router-dom';
// import { auth, db } from '../../configs/firebase';
// import { updateProfile } from 'firebase/auth'

// import { doc, getDoc, setDoc, serverTimestamp, collection, getDocs } from 'firebase/firestore';
// import { useAuth } from '../../context/AuthContext';
// import { uploadAvatar } from '../../configs/storage';
// import styles from '../../styles/EditProfilePage.module.css';

// export default function EditProfilePage() {
//   const { currentUser } = useAuth();
//   const uid = currentUser?.uid ?? '';

//   /* ───── component-state ─────────────────────────────────────────── */
//   const [form, setForm] = useState({
//     firstName: '',
//     lastName: '',
//     username: '',
//     bio: '',
//     phoneNumber: '',
//     dob: { day: '', month: '', year: '' },
//     gender: '',
//     location: '',
//     roles: /** @type string[] */ ([]),
//     avatarUrl: '',
//   });

//   const [roleOptions, setRoleOptions] = useState(null);
//   const [previewUrl, setPreviewUrl] = useState('')
//   const [uploading, setUploading] = useState(false);
//   const fileInput = useRef(null);

//   useEffect(() => {
//     getDocs(collection(db, 'roles'))
//       .then((snap) => {
//         setRoleOptions(snap.docs.map((d) => ({ value: d.id, ...d.data() })));
//       })
//       .catch(console.error);
//   }, []);

//   /* preload profile */
//   useEffect(() => {
//     getDoc(doc(db, 'users', uid)).then((snap) => {
//       if (!snap.exists()) return
//       const data = snap.data()

//       // parse dob:
//       let dobObj = { day: '', month: '', year: '' }
//       if (typeof data.dob === 'string') {
//         const [year, month, day] = data.dob.split('-')
//         dobObj = { day, month, year }
//       } else if (data.dob?.seconds) {
//         // if you stored a Timestamp at some point:
//         const dt = data.dob.toDate()
//         dobObj = {
//           day: String(dt.getDate()).padStart(2, '0'),
//           month: String(dt.getMonth() + 1).padStart(2, '0'),
//           year: String(dt.getFullYear())
//         }
//       }

//       setForm((f) => ({
//         ...f,
//         ...data,
//         dob: dobObj,
//       }))
//     })
//   }, [uid])


//   /* ───── basic field handler ───────────────────────────────────── */
//   const handleChange = (e) => {
//     const { name, value, type, checked } = e.target;
//     if (['day', 'month', 'year'].includes(name)) {
//       setForm((f) => ({ ...f, dob: { ...f.dob, [name]: value } }));
//     } else if (name === 'role') {
//       setForm((f) => ({
//         ...f,
//         roles: checked ? [...f.roles, value] : f.roles.filter((r) => r !== value),
//       }));
//     } else {
//       setForm((f) => ({ ...f, [name]: type === 'checkbox' ? checked : value }));
//     }
//   };
// // File preview + upload
//    const handleFileChange = async e => {
//     const file = e.target.files?.[0]
//     if (!file) return
//     setPreviewUrl(URL.createObjectURL(file))

//     setUploading(true)
//     const url = await uploadAvatar(file, uid)
//     // sync into Auth profile
//     await updateProfile(auth.currentUser, { photoURL: url })
//     // write into Firestore
//     await setDoc(doc(db, 'users', uid), { avatarUrl: url }, { merge: true })
//     setForm(f => ({ ...f, avatarUrl: url }))
//     setPreviewUrl('')
//     setUploading(false)
//   }


//   const handleSubmit = async e => {
//     e.preventDefault();
//     // … username logic …
//     const dobString = `${form.dob.year
//       .padStart(4, '0')}-${form.dob.month.padStart(2, '0')}-${form.dob.day.padStart(2, '0')}`
//       await setDoc(
//          doc(db, 'users', uid),
//          {
//        ...form,
//        dob: dobString,
//        updatedAt: serverTimestamp(),
//      },
//      { merge: true }
//    )


//     alert('Profile updated!');
//   };
//   if (!currentUser) return null;
//   /* ───── UI ────────────────────────────────────────────────────── */
//   if (roleOptions === null) {
//     return (
//       <div
//         className="d-flex justify-content-center align-items-center"
//         style={{ minHeight: '60vh' }}
//       >
//         <MDBSpinner grow />
//       </div>
//     );
//   }

//   return (
//     <section className={`${styles.wrapper} py-5`}>
//       <MDBContainer>
//         <MDBRow className="justify-content-center">
//           <MDBCol lg="12" md="10" sm="8">
//             <MDBCard className={styles.card}>
//               <MDBCardBody className="p-md-5 p-4">
//                 {/* avatar picker */}
//                 <div className="text-center mb-4">
//                   <ProfileImageUploader />
//                   <img
//                     src={previewUrl || form.avatarUrl || 'https://placehold.co/120x120?text=Avatar'}
//                     alt="avatar"
//                     className={styles.avatar}
//                     onClick={() => fileInput.current?.click()}
//                   />
//                   <MDBFile
//                     id="avatar-upload"
//                     ref={fileInput}
//                     accept="image/*"
//                     hidden
//                     onChange={handleFileChange}
//                   />
//                   <MDBBtn
//                     color="link"
//                     className="p-0 mt-2 d-block mx-auto"
//                     onClick={() => fileInput.current?.click()}
//                     disabled={uploading}
//                   >
//                     {uploading ? 'Uploading…' : 'Upload Image'}
//                   </MDBBtn>
//                 </div>

//                 <form onSubmit={handleSubmit}>
//                   {/* names */}
//                   <MDBRow>
//                     <MDBCol md="6" className="mb-3">
//                       <MDBInput
//                         label="First Name"
//                         name="firstName"
//                         value={form.firstName}
//                         onChange={handleChange}
//                       />
//                     </MDBCol>
//                     <MDBCol md="6" className="mb-3">
//                       <MDBInput
//                         label="Last Name"
//                         name="lastName"
//                         value={form.lastName}
//                         onChange={handleChange}
//                       />
//                     </MDBCol>
//                   </MDBRow>

//                   <MDBInput
//                     label="Username"
//                     name="username"
//                     className="mb-3"
//                     value={form.username}
//                     onChange={handleChange}
//                   />

//                   <MDBInput
//                     label="Bio"
//                     name="bio"
//                     className="mb-3"
//                     textarea
//                     rows={3}
//                     value={form.bio}
//                     onChange={handleChange}
//                   />

//                   <MDBInput
//                     label="Phone Number"
//                     name="phoneNumber"
//                     className="mb-3"
//                     value={form.phoneNumber}
//                     onChange={handleChange}
//                   />

//                   {/* DOB pickers */}
//                   <MDBRow>
//                     {['day', 'month', 'year'].map((part) => (
//                       <MDBCol md="4" key={part}>
//                         <select
//                           className="form-control mb-3"
//                           name={part}
//                           value={form.dob[part]}
//                           onChange={handleChange}
//                         >
//                           <option value="">
//                             {part === 'day' ? 'Day' : part === 'month' ? 'Month' : 'Year'}
//                           </option>
//                           {part === 'day' &&
//                             [...Array(31)].map((_, i) => <option key={i + 1}>{i + 1}</option>)}
//                           {part === 'month' &&
//                             [
//                               'Jan',
//                               'Feb',
//                               'Mar',
//                               'Apr',
//                               'May',
//                               'Jun',
//                               'Jul',
//                               'Aug',
//                               'Sep',
//                               'Oct',
//                               'Nov',
//                               'Dec',
//                             ].map((m) => <option key={m}>{m}</option>)}
//                           {part === 'year' &&
//                             Array.from({ length: 100 }, (_, i) => new Date().getFullYear() - i).map(
//                               (y) => <option key={y}>{y}</option>
//                             )}
//                         </select>
//                       </MDBCol>
//                     ))}
//                   </MDBRow>
                  

//                   {/* gender */}
//                   <select
//                     className="form-control mb-3"
//                     name="gender"
//                     value={form.gender}
//                     onChange={handleChange}
//                   >
//                     <option value="">Select Gender</option>
//                     <option>Male</option>
//                     <option>Female</option>
//                     <option>Other</option>
//                   </select>

//                   {/* location */}
//                   <MDBInput
//                     label="Location"
//                     name="location"
//                     className="mb-1"
//                     value={form.location}
//                     onChange={handleChange}
//                   />
//                   <button
//                     type="button"
//                     className="btn btn-link p-0"
//                     style={{ fontSize: '0.85rem' }}
//                     onClick={() => alert('Manual location coming soon')}
//                   >
//                     Enter location manually
//                   </button>

//                   {/* dynamic role list */}
//                   <p className="mt-4 mb-2 fw-bold">Role(s) – select all that apply</p>
//                   {roleOptions.map(({ value, label, icon }) => (
//                     <div key={value} className={styles.roleCard}>
//                       <MDBCheckbox
//                         id={value}
//                         name="role"
//                         value={value}
//                         checked={form.roles.includes(value)}
//                         onChange={handleChange}
//                         className="me-2"
//                       />
//                       <div>
//                         <strong>
//                           {icon} {label}
//                         </strong>
//                       </div>
//                     </div>
//                   ))}

//                   <div className="text-center mt-4">
//                     <MDBBtn type="submit" className={styles.confirmBtn} size="lg">
//                       CONFIRM
//                     </MDBBtn>
//                   </div>
//                 </form>
//               </MDBCardBody>
//             </MDBCard>
//           </MDBCol>
//         </MDBRow>
//       </MDBContainer>
//     </section>
//   );
// }


// src/pages/EditProfilePage.jsx
// import React, { useEffect, useState } from "react";
// import {
//   MDBContainer,
//   MDBRow,
//   MDBCol,
//   MDBCard,
//   MDBCardBody,
//   MDBInput,
//   MDBCheckbox,
//   MDBBtn,
//   MDBSpinner,
// } from "mdb-react-ui-kit";
// import { useParams } from "react-router-dom";
// import {
//   collection,
//   doc,
//   getDoc,
//   getDocs,
//   serverTimestamp,
//   setDoc,
// } from "firebase/firestore";
// import { db, storage, auth } from "../../configs/firebase";
// import { useAuth } from "../../context/AuthContext";
// import styles from "../../styles/EditProfilePage.module.css";

// import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
// import { v4 as uuid } from "uuid";
// import { updateProfile } from "firebase/auth";

// /* -------------------------------------------------------------------- */
// /*                           Edit-or-View Profile                        */
// /* -------------------------------------------------------------------- */
// export default function EditProfilePage() {
//   /* ----- auth & routing ----- */
//   const { currentUser } = useAuth();
//   const { uid: routeUid } = useParams();      // optional :uid
//   const uid = routeUid || currentUser?.uid || "";
//   const isOwner = uid === currentUser?.uid;

//   /* ----- uploader local state ----- */
//   const [imageUpload, setImageUpload] = useState(null);
 
//   /* handle actual upload */
//   const uploadFile = async () => {
//     if (!imageUpload) return;
//     const imageRef = ref(storage, `images/${imageUpload.name}-${uuid()}`);

//     try {
//       /* 1️⃣  push file to Storage */
//       await uploadBytes(imageRef, imageUpload);

//       /* 2️⃣  get downloadable URL */
//       const url = await getDownloadURL(imageRef);

//       /* 3️⃣  owner-only: persist avatar */
//       if (uid) {
//         await setDoc(doc(db, "users", uid), { avatarUrl: url }, { merge: true });
//         await updateProfile(auth.currentUser, { photoURL: url });
//       }

//       /* 4️⃣  update local UI */
//       setForm((f) => ({ ...f, avatarUrl: url }));
    
//       setImageUpload(null);
//       alert("Avatar updated!");
//     } catch (err) {
//       console.error("Upload failed", err);
//       alert("Failed to upload image");
//     }
//   };

 

//   /* ----- profile form state ----- */
//   const [roleOptions, setRoleOptions] = useState(null); // null = loading
//   const [form, setForm] = useState({
//     firstName: "",
//     lastName: "",
//     username: "",
//     bio: "",
//     phoneNumber: "",
//     dob: { day: "", month: "", year: "" },
//     gender: "",
//     location: "",
//     roles: /** @type string[] */ ([]),
//     avatarUrl: "",
//   });

//   /* fetch roles once */
//   useEffect(() => {
//     getDocs(collection(db, "roles"))
//       .then((snap) =>
//         setRoleOptions(snap.docs.map((d) => ({ value: d.id, ...d.data() })))
//       )
//       .catch(console.error);
//   }, []);

//   /* preload profile */
//   useEffect(() => {
//     if (!uid) return;
//     getDoc(doc(db, "users", uid)).then((snap) => {
//       if (!snap.exists()) return;
//       const data = snap.data();

//       // normalise DOB
//       let dobObj = { day: "", month: "", year: "" };
//       if (typeof data.dob === "string") {
//         const [y, m, d] = data.dob.split("-");
//         dobObj = { day: d, month: m, year: y };
//       } else if (data.dob?.seconds) {
//         const dt = data.dob.toDate();
//         dobObj = {
//           day: String(dt.getDate()).padStart(2, "0"),
//           month: String(dt.getMonth() + 1).padStart(2, "0"),
//           year: String(dt.getFullYear()),
//         };
//       }
//       setForm((f) => ({ ...f, ...data, dob: dobObj }));
//     });
//   }, [uid]);

//   /* generic field handler */
//   const handleChange = ({ target }) => {
//     const { name, value, type, checked } = target;

//     if (["day", "month", "year"].includes(name)) {
//       setForm((f) => ({ ...f, dob: { ...f.dob, [name]: value } }));
//     } else if (name === "role") {
//       setForm((f) => ({
//         ...f,
//         roles: checked ? [...f.roles, value] : f.roles.filter((r) => r !== value),
//       }));
//     } else {
//       setForm((f) => ({ ...f, [name]: type === "checkbox" ? checked : value }));
//     }
//   };

//   /* submit */
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!isOwner) return;

//     const dob = `${form.dob.year.padStart(4, "0")}-${form.dob.month.padStart(
//       2,
//       "0"
//     )}-${form.dob.day.padStart(2, "0")}`;

//     await setDoc(
//       doc(db, "users", uid),
//       { ...form, dob, updatedAt: serverTimestamp() },
//       { merge: true }
//     );
//     alert("Profile updated!");
//   };

//   /* loading */
//   if (!currentUser) return null;
//   if (roleOptions === null) {
//     return (
//       <div
//         className="d-flex justify-content-center align-items-center"
//         style={{ minHeight: "60vh" }}
//       >
//         <MDBSpinner grow />
//       </div>
//     );
//   }

//   /* ---------------------------------------------------------------- */
//   /*                               UI                                 */
//   /* ---------------------------------------------------------------- */
//   return (
//     <section className={`${styles.wrapper} py-5`}>
//       <MDBContainer>
//         <MDBRow className="justify-content-center">
//           <MDBCol lg="12" md="10" sm="8">
//             <MDBCard className={styles.card}>
//               <MDBCardBody className="p-md-5 p-4">
//                 {/* ------------ Avatar / Uploader ------------- */}
//                 <div className="text-center mb-4">
//                   {isOwner ? (
//                     <>
//                       <img
                      
//                         src={
//                           form.avatarUrl ||
//                           "https://placehold.co/120x120?text=Avatar"
//                         }
//                         alt="avatar"
//                         className={`${styles.avatar} mb-2`}
//                       />

//                       <div>
//                         <input
//                           type="file"
//                           accept="image/*"
//                           onChange={(e) =>
//                             setImageUpload(e.target.files?.[0] || null)
//                           }
//                         />
//                         <MDBBtn
//                           size="sm"
//                           className="mt-2"
//                           disabled={!imageUpload}
//                           onClick={uploadFile}
//                         >
//                           Upload
//                         </MDBBtn>
//                       </div>
//                     </>
//                   ) : (
//                     <img
//                       src={
//                         form.avatarUrl ||
//                         "https://placehold.co/120x120?text=Avatar"
//                       }
//                       alt="avatar"
//                       className={styles.avatar}
//                     />
//                   )}
//                 </div>

//                 {/* --------------- Profile Form --------------- */}
//                 <form onSubmit={handleSubmit}>
//                   {/* names */}
//                   <MDBRow>
//                     <MDBCol md="6" className="mb-3">
//                       <MDBInput
//                         label="First Name"
//                         name="firstName"
//                         value={form.firstName}
//                         onChange={handleChange}
//                         disabled={!isOwner}
//                       />
//                     </MDBCol>
//                     <MDBCol md="6" className="mb-3">
//                       <MDBInput
//                         label="Last Name"
//                         name="lastName"
//                         value={form.lastName}
//                         onChange={handleChange}
//                         disabled={!isOwner}
//                       />
//                     </MDBCol>
//                   </MDBRow>

//                   <MDBInput
//                     label="Username"
//                     name="username"
//                     className="mb-3"
//                     value={form.username}
//                     onChange={handleChange}
//                     disabled={!isOwner}
//                   />

//                   <MDBInput
//                     label="Bio"
//                     name="bio"
//                     className="mb-3"
//                     textarea
//                     rows={3}
//                     value={form.bio}
//                     onChange={handleChange}
//                     disabled={!isOwner}
//                   />

//                   <MDBInput
//                     label="Phone Number"
//                     name="phoneNumber"
//                     className="mb-3"
//                     value={form.phoneNumber}
//                     onChange={handleChange}
//                     disabled={!isOwner}
//                   />

//                   {/* DOB */}
//                   <MDBRow>
//                     {["day", "month", "year"].map((part) => (
//                       <MDBCol md="4" key={part}>
//                         <select
//                           className="form-control mb-3"
//                           name={part}
//                           value={form.dob[part]}
//                           onChange={handleChange}
//                           disabled={!isOwner}
//                         >
//                           <option value="">
//                             {part === "day"
//                               ? "Day"
//                               : part === "month"
//                               ? "Month"
//                               : "Year"}
//                           </option>
//                           {part === "day" &&
//                             [...Array(31)].map((_, i) => (
//                               <option key={i + 1}>{i + 1}</option>
//                             ))}
//                           {part === "month" &&
//                             [
//                               "Jan",
//                               "Feb",
//                               "Mar",
//                               "Apr",
//                               "May",
//                               "Jun",
//                               "Jul",
//                               "Aug",
//                               "Sep",
//                               "Oct",
//                               "Nov",
//                               "Dec",
//                             ].map((m) => <option key={m}>{m}</option>)}
//                           {part === "year" &&
//                             Array.from(
//                               { length: 100 },
//                               (_, i) => new Date().getFullYear() - i
//                             ).map((y) => <option key={y}>{y}</option>)}
//                         </select>
//                       </MDBCol>
//                     ))}
//                   </MDBRow>

//                   {/* gender */}
//                   <select
//                     className="form-control mb-3"
//                     name="gender"
//                     value={form.gender}
//                     onChange={handleChange}
//                     disabled={!isOwner}
//                   >
//                     <option value="">Select Gender</option>
//                     <option>Male</option>
//                     <option>Female</option>
//                     <option>Other</option>
//                   </select>

//                   {/* location */}
//                   <MDBInput
//                     label="Location"
//                     name="location"
//                     className="mb-1"
//                     value={form.location}
//                     onChange={handleChange}
//                     disabled={!isOwner}
//                   />

//                   {/* roles */}
//                   <p className="mt-4 mb-2 fw-bold">
//                     Role(s) – select all that apply
//                   </p>
//                   {roleOptions.map(({ value, label, icon }) => (
//                     <div key={value} className={styles.roleCard}>
//                       <MDBCheckbox
//                         id={value}
//                         name="role"
//                         value={value}
//                         checked={form.roles.includes(value)}
//                         onChange={handleChange}
//                         className="me-2"
//                         disabled={!isOwner}
//                       />
//                       <div>
//                         <strong>
//                           {icon} {label}
//                         </strong>
//                       </div>
//                     </div>
//                   ))}

//                   {isOwner && (
//                     <div className="text-center mt-4">
//                       <MDBBtn type="submit" className={styles.confirmBtn} size="lg">
//                         CONFIRM
//                       </MDBBtn>
//                     </div>
//                   )}
//                 </form>
//               </MDBCardBody>
//             </MDBCard>
//           </MDBCol>
//         </MDBRow>
//       </MDBContainer>
//     </section>
//   );
// }


// // Correct one below


// // src/pages/EditProfilePage.jsx
// import React, { useEffect, useRef, useState } from "react";
// import {
//   MDBContainer,
//   MDBRow,
//   MDBCol,
//   MDBCard,
//   MDBCardBody,
//   MDBInput,
//   MDBCheckbox,
//   MDBBtn,
//   MDBSpinner,
// } from "mdb-react-ui-kit";
// import { useNavigate, useParams } from "react-router-dom";
// import {
//   collection,
//   doc,
//   getDoc,
//   getDocs,
//   serverTimestamp,
//   setDoc,
// } from "firebase/firestore";
// import { db, storage, auth } from "../../configs/firebase";
// import { useAuth } from "../../context/AuthContext";
// import styles from "../../styles/EditProfilePage.module.css";

// import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
// import { v4 as uuid } from "uuid";
// import { updateProfile } from "firebase/auth";

// /* -------------------------------------------------------------------- */
// /*                           Edit-or-View Profile                        */
// /* -------------------------------------------------------------------- */
// export default function EditProfilePage() {
//   /* ----- auth & routing ----- */
//   const { currentUser } = useAuth();
//   const { uid: routeUid } = useParams(); // optional :uid
//   const navigate = useNavigate();

//   const uid = routeUid || currentUser?.uid || "";
//   const isOwner = uid === currentUser?.uid;

//   const fileInputRef = useRef(null);

//   /* ----- avatar local state ----- */
//   const [imageUpload, setImageUpload] = useState(null);  // File | null
//   const [tempPreview, setTempPreview] = useState("");   
//   /* ----- profile form state ----- */
//   const [roleOptions, setRoleOptions] = useState(null); // null = loading
//   const [form, setForm] = useState({
//     firstName: "",
//     lastName: "",
//     username: "",
//     bio: "",
//     phoneNumber: "",
//     dob: { day: "", month: "", year: "" },
//     gender: "",
//     location: "",
//     roles: /** @type string[] */ ([]),
//     avatarUrl: "",
//   });

//   /* fetch roles once */
//   useEffect(() => {
//     getDocs(collection(db, "roles"))
//       .then((snap) =>
//         setRoleOptions(snap.docs.map((d) => ({ value: d.id, ...d.data() })))
//       )
//       .catch(console.error);
//   }, []);

//   /* preload profile */
//   // useEffect(() => {
//   //   if (!uid) return;
//   //   getDoc(doc(db, "users", uid)).then((snap) => {
//   //     if (!snap.exists()) return;
//   //     const data = snap.data();

//   //     // normalise DOB
//   //     let dobObj = { day: "", month: "", year: "" };
//   //     if (typeof data.dob === "string") {
//   //       const [y, m, d] = data.dob.split("-");
//   //       dobObj = { day: d, month: m, year: y };
//   //     } else if (data.dob?.seconds) {
//   //       const dt = data.dob.toDate();
//   //       dobObj = {
//   //         day: String(dt.getDate()).padStart(2, "0"),
//   //         month: String(dt.getMonth() + 1).padStart(2, "0"),
//   //         year: String(dt.getFullYear()),
//   //       };
//   //     }
//   //     setForm((f) => ({ ...f, ...data, dob: dobObj }));
//   //   });
//   // }, [uid]);

//    useEffect(() => {
//     if (!uid) return;
//     getDoc(doc(db, "users", uid)).then((snap) => {
//       if (!snap.exists()) return;
//       const data = snap.data();
//       let dobObj = { day: "", month: "", year: "" };
//       if (data.dob) {
//         const parts = data.dob.split("-");
//         if (parts.length === 3) {
//           dobObj = { year: parts[0], month: parts[1], day: parts[2] };
//         }
//       }
//       setForm((f) => ({ ...f, ...data, dob: dobObj }));
//     });
//   }, [uid]);


//   /* generic field handler */
//   const handleChange = ({ target }) => {
//     const { name, value, type, checked } = target;

//     if (["day", "month", "year"].includes(name)) {
//       setForm((f) => ({ ...f, dob: { ...f.dob, [name]: value } }));
//     } else if (name === "role") {
//       setForm((f) => ({
//         ...f,
//         roles: checked ? [...f.roles, value] : f.roles.filter((r) => r !== value),
//       }));
//     } else {
//       setForm((f) => ({ ...f, [name]: type === "checkbox" ? checked : value }));
//     }
//   };

//   const handleAvatarChange = (e) => {
//     const file = e.target.files?.[0] || null;
//     setImageUpload(file);
//     if (file) {
//       const reader = new FileReader();
//       reader.onloadend = () => setTempPreview(reader.result);
//       reader.readAsDataURL(file);
//     } else {
//       setTempPreview("");
//     }
//   };

//   /* submit (uploads avatar if chosen, then saves profile) */
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!isOwner) return;

//     let avatarUrl = form.avatarUrl;

//     if (imageUpload) {
//       const imageRef = ref(storage, `images/${imageUpload.name}-${uuid()}`);
//       await uploadBytes(imageRef, imageUpload);
//       avatarUrl = await getDownloadURL(imageRef);

//       await updateProfile(auth.currentUser, { photoURL: avatarUrl });
//     }

//      const { year = "", month = "", day = "" } = form.dob;
//      const dob = `${year.padStart(4, '0')}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;

// //  const dob = `${String(year).padStart(4,"0")}-${String(month).padStart(2,"0")}-` +
// //              `${String(day).padStart(2,"0")}`;

//     await setDoc(
//       doc(db, "users", uid),
//       {
//         ...form,
//         avatarUrl,
//         dob,
//         updatedAt: serverTimestamp(),
//       },
//       { merge: true }
//     );

//     navigate("/profile");
//   };

//   /* loading */
//   if (!currentUser) return null;
//   if (roleOptions === null) {
//     return (
//       <div
//         className="d-flex justify-content-center align-items-center"
//         style={{ minHeight: "60vh" }}
//       >
//         <MDBSpinner grow />
//       </div>
//     );
//   }

//   /* ---------------------------------------------------------------- */
//   /*                               UI                                 */
//   /* ---------------------------------------------------------------- */
//   return (
//     <section className={`${styles.wrapper} py-5`}>
//       <MDBContainer>
//         <MDBRow className="justify-content-center">
//           <MDBCol lg="12" md="10" sm="8">
//             <MDBCard className={styles.card}>
//               <MDBCardBody className="p-md-5 p-4">
//                 {/* ------------ Avatar Picker ------------- */}
//                 {/* <div className="text-center mb-4">
//                   <img
//                     src={
//                       previewUrl ||
//                       form.avatarUrl ||
//                       "https://placehold.co/120x120?text=Avatar"
//                     }
//                     alt="avatar"
//                     className={`${styles.avatar} mb-2`}
//                     onClick={() => isOwner && fileInputRef.current?.click()}
//                     style={{ cursor: isOwner ? "pointer" : "default" }}
//                   />
//                   {isOwner && (
//                     <input
//                       type="file"
//                       accept="image/*"
//                       ref={fileInputRef}
//                       hidden
//                       onChange={(e) => {
//                         const file = e.target.files?.[0] || null;
//                         setImageUpload(file);
//                         if (file) setPreviewUrl(URL.createObjectURL(file));
//                       }}
//                     />
//                   )}
//                 </div> */}
//                 <div className="text-center mb-4">
//                   {isOwner ? (
//                     <label style={{ cursor: "pointer" }}>
//                       <img
//                         src={form.avatarUrl || "https://placehold.co/120x120?text=Avatar"}
//                         alt="avatar"
//                         className={`${styles.avatar} mb-2`}
//                       />
//                       <input
//                         id="avatarInput"
//                         type="file"
//                         accept="image/*"
//                         hidden
//                         onChange={handleAvatarChange}
//                       //   onChange={e => {
//                       //   const file = e.target.files?.[0] || null;
//                       //   setImageUpload(file);                      
//                       //   // generate base-64 preview (avoids blocked blob:// URL)
//                       //   if (file) {
//                       //     const reader = new FileReader();
//                       //     reader.onloadend = () => setTempPreview(reader.result);
//                       //     reader.readAsDataURL(file);
//                       //   } else {
//                       //     setTempPreview("");
//                       //   }
//                       // } }                     
//                       />
//                     </label>
//                   ) : (
//                     <img
//                     src={
//                         //  tempPreview ||    // <-- show instant preview if user just picked a file
//                          form.avatarUrl || // otherwise show stored avatar
//                          "https://placehold.co/120x120?text=Avatar"
//                        }
//                       alt="avatar"
//                       className={styles.avatar}
//                     />
//                   )}
//                 </div>

//                 {/* --------------- Profile Form --------------- */}
//                 <form onSubmit={handleSubmit}>
//                   {/* names */}
//                   <MDBRow>
//                     <MDBCol md="6" className="mb-3">
//                       <MDBInput
//                         label="First Name"
//                         name="firstName"
//                         value={form.firstName}
//                         onChange={handleChange}
//                         disabled={!isOwner}
//                       />
//                     </MDBCol>
//                     <MDBCol md="6" className="mb-3">
//                       <MDBInput
//                         label="Last Name"
//                         name="lastName"
//                         value={form.lastName}
//                         onChange={handleChange}
//                         disabled={!isOwner}
//                       />
//                     </MDBCol>
//                   </MDBRow>

//                   <MDBInput
//                     label="Username"
//                     name="username"
//                     className="mb-3"
//                     value={form.username}
//                     onChange={handleChange}
//                     disabled={!isOwner}
//                   />

//                   <MDBInput
//                     label="Bio"
//                     name="bio"
//                     className="mb-3"
//                     textarea
//                     rows={3}
//                     value={form.bio}
//                     onChange={handleChange}
//                     disabled={!isOwner}
//                   />

//                   <MDBInput
//                     label="Phone Number"
//                     name="phoneNumber"
//                     className="mb-3"
//                     value={form.phoneNumber}
//                     onChange={handleChange}
//                     disabled={!isOwner}
//                   />

//                   {/* DOB */}
//                   {/* <MDBRow>
//                     {["day", "month", "year"].map((part) => (
//                       <MDBCol md="4" key={part}>
//                         <select
//                           className="form-control mb-3"
//                           name={part}
//                           value={form.dob[part]}
//                           onChange={handleChange}
//                           disabled={!isOwner}
//                         >
//                           <option value="">
//                             {part === "day"
//                               ? "Day"
//                               : part === "month"
//                               ? "Month"
//                               : "Year"}
//                           </option>
//                           {part === "day" &&
//                             [...Array(31)].map((_, i) => (
//                               <option key={i + 1}>{i + 1}</option>
//                             ))}
//                           {part === "month" &&
//                             [
//                               "Jan",
//                               "Feb",
//                               "Mar",
//                               "Apr",
//                               "May",
//                               "Jun",
//                               "Jul",
//                               "Aug",
//                               "Sep",
//                               "Oct",
//                               "Nov",
//                               "Dec",
//                             ].map((m) => <option key={m}>{m}</option>)}
//                           {part === "year" &&
//                             Array.from(
//                               { length: 100 },
//                               (_, i) => new Date().getFullYear() - i
//                             ).map((y) => <option key={y}>{y}</option>)}
//                         </select>
//                       </MDBCol>
//                     ))}
//                   </MDBRow> */}
//                      <MDBRow>
//                     <MDBCol md="4">
//                       <select
//                         className="form-control mb-3"
//                         name="day"
//                         value={form.dob.day}
//                         onChange={handleChange}
//                         disabled={!isOwner}
//                       >
//                         <option value="">Day</option>
//                         {[...Array(31)].map((_, i) => {
//                           const d = String(i + 1).padStart(2, '0');
//                           return <option key={d} value={d}>{d}</option>;
//                         })}
//                       </select>
//                     </MDBCol>
//                     <MDBCol md="4">
//                       <select
//                         className="form-control mb-3"
//                         name="month"
//                         value={form.dob.month}
//                         onChange={handleChange}
//                         disabled={!isOwner}
//                       >
//                         <option value="">Month</option>
//                         {[
//                           'Jan','Feb','Mar','Apr','May','Jun',
//                           'Jul','Aug','Sep','Oct','Nov','Dec',
//                         ].map((m, idx) => {
//                           const v = String(idx + 1).padStart(2, '0');
//                           return <option key={v} value={v}>{m}</option>;
//                         })}
//                       </select>
//                     </MDBCol>
//                     <MDBCol md="4">
//                       <select
//                         className="form-control mb-3"
//                         name="year"
//                         value={form.dob.year}
//                         onChange={handleChange}
//                         disabled={!isOwner}
//                       >
//                         <option value="">Year</option>
//                         {Array.from({ length: 100 }, (_, i) => new Date().getFullYear() - i)
//                           .map((y) => <option key={y} value={String(y)}>{y}</option>)}
//                       </select>
//                     </MDBCol>
//                   </MDBRow>

//                   {/* gender */}
//                   <select
//                     className="form-control mb-3"
//                     name="gender"
//                     value={form.gender}
//                     onChange={handleChange}
//                     disabled={!isOwner}
//                   >
//                     <option value="">Select Gender</option>
//                     <option>Male</option>
//                     <option>Female</option>
//                     <option>Other</option>
//                   </select>

//                   {/* location */}
//                   <MDBInput
//                     label="Location"
//                     name="location"
//                     className="mb-1"
//                     value={form.location}
//                     onChange={handleChange}
//                     disabled={!isOwner}
//                   />

//                   {/* roles */}
//                   <p className="mt-4 mb-2 fw-bold">
//                     Role(s) – select all that apply
//                   </p>
//                   {roleOptions.map(({ value, label, icon }) => (
//                     <div key={value} className={styles.roleCard}>
//                       <MDBCheckbox
//                         id={value}
//                         name="role"
//                         value={value}
//                         checked={form.roles.includes(value)}
//                         onChange={handleChange}
//                         className="me-2"
//                         disabled={!isOwner}
//                       />
//                       <div>
//                         <strong>
//                           {icon} {label}
//                         </strong>
//                       </div>
//                     </div>
//                   ))}

//                   {isOwner && (
//                     <div className="text-center mt-4">
//                       <MDBBtn type="submit" className={styles.confirmBtn} size="lg">
//                         CONFIRM
//                       </MDBBtn>
//                     </div>
//                   )}
//                 </form>
//               </MDBCardBody>
//             </MDBCard>
//           </MDBCol>
//         </MDBRow>
//       </MDBContainer>
//     </section>
//   );
// }








// Correct one below... final file



// src/pages/EditProfilePage.jsx
import React, { useEffect, useRef, useState } from "react";
import {
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBCard,
  MDBCardBody,
  MDBInput,
  MDBCheckbox,
  MDBBtn,
  MDBSpinner,
} from "mdb-react-ui-kit";
import { useNavigate, useParams } from "react-router-dom";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";
import { db, storage, auth } from "../../configs/firebase";
import { useAuth } from "../../context/AuthContext";
import styles from "../../styles/EditProfilePage.module.css";

import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { v4 as uuid } from "uuid";
import { updateProfile } from "firebase/auth";

/* -------------------------------------------------------------------- */
/*                           Edit-or-View Profile                        */
/* -------------------------------------------------------------------- */
export default function EditProfilePage() {
  /* ----- auth & routing ----- */
  const { currentUser } = useAuth();
  const { uid: routeUid } = useParams(); // optional :uid
  const navigate = useNavigate();

  const uid = routeUid || currentUser?.uid || "";
  const isOwner = uid === currentUser?.uid;

  const fileInputRef = useRef(null);

  /* ----- avatar local state ----- */
  const [imageUpload, setImageUpload] = useState(null);  // File | null
  const [tempPreview, setTempPreview] = useState("");   
  /* ----- profile form state ----- */
  const [roleOptions, setRoleOptions] = useState(null); // null = loading
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    username: "",
    bio: "",
    phoneNumber: "",
    dob: { day: "", month: "", year: "" },
    gender: "",
    location: "",
    roles: /** @type string[] */ ([]),
    avatarUrl: "",
  });

  /* fetch roles once */
  useEffect(() => {
    getDocs(collection(db, "roles"))
      .then((snap) =>
        setRoleOptions(snap.docs.map((d) => ({ value: d.id, ...d.data() })))
      )
      .catch(console.error);
  }, []);

  /* preload profile */
  // useEffect(() => {
  //   if (!uid) return;
  //   getDoc(doc(db, "users", uid)).then((snap) => {
  //     if (!snap.exists()) return;
  //     const data = snap.data();

  //     // normalise DOB
  //     let dobObj = { day: "", month: "", year: "" };
  //     if (typeof data.dob === "string") {
  //       const [y, m, d] = data.dob.split("-");
  //       dobObj = { day: d, month: m, year: y };
  //     } else if (data.dob?.seconds) {
  //       const dt = data.dob.toDate();
  //       dobObj = {
  //         day: String(dt.getDate()).padStart(2, "0"),
  //         month: String(dt.getMonth() + 1).padStart(2, "0"),
  //         year: String(dt.getFullYear()),
  //       };
  //     }
  //     setForm((f) => ({ ...f, ...data, dob: dobObj }));
  //   });
  // }, [uid]);

   useEffect(() => {
    if (!uid) return;
    getDoc(doc(db, "users", uid)).then((snap) => {
      if (!snap.exists()) return;
      const data = snap.data();
      let dobObj = { day: "", month: "", year: "" };
      if (data.dob) {
        const parts = data.dob.split("-");
        if (parts.length === 3) {
          dobObj = { year: parts[0], month: parts[1], day: parts[2] };
        }
      }
      setForm((f) => ({ ...f, ...data, dob: dobObj }));
    });
  }, [uid]);


  /* generic field handler */
  const handleChange = ({ target }) => {
    const { name, value, type, checked } = target;

    if (["day", "month", "year"].includes(name)) {
      setForm((f) => ({ ...f, dob: { ...f.dob, [name]: value } }));
    } else if (name === "role") {
      setForm((f) => ({
        ...f,
        roles: checked ? [...f.roles, value] : f.roles.filter((r) => r !== value),
      }));
    } else {
      setForm((f) => ({ ...f, [name]: type === "checkbox" ? checked : value }));
    }
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0] || null;
    setImageUpload(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setTempPreview(reader.result);
      reader.readAsDataURL(file);
    } else {
      setTempPreview("");
    }
  };

  /* submit (uploads avatar if chosen, then saves profile) */
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isOwner) return;

    let avatarUrl = form.avatarUrl;

    if (imageUpload) {
      const imageRef = ref(storage, `images/${imageUpload.name}-${uuid()}`);
      await uploadBytes(imageRef, imageUpload);
      avatarUrl = await getDownloadURL(imageRef);

      await updateProfile(auth.currentUser, { photoURL: avatarUrl });
    }

     const { year = "", month = "", day = "" } = form.dob;
     const dob = `${year.padStart(4, '0')}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;

//  const dob = `${String(year).padStart(4,"0")}-${String(month).padStart(2,"0")}-` +
//              `${String(day).padStart(2,"0")}`;

    await setDoc(
      doc(db, "users", uid),
      {
        ...form,
        avatarUrl,
        dob,
        updatedAt: serverTimestamp(),
      },
      { merge: true }
    );

    navigate("/profile");
  };

  /* loading */
  if (!currentUser) return null;
  if (roleOptions === null) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ minHeight: "60vh" }}
      >
        <MDBSpinner grow />
      </div>
    );
  }

  /* ---------------------------------------------------------------- */
  /*                               UI                                 */
  /* ---------------------------------------------------------------- */
  return (
    <section className={`${styles.wrapper} py-5 px-2 px-md-4`}>
      <MDBContainer>
        <MDBRow className="justify-content-center">
          <MDBCol lg="12" md="10" sm="8">
            <MDBCard className={styles.card}>
              <MDBCardBody className="p-md-2 p-4">
                {/* ------------ Avatar Picker ------------- */}
                {/* <div className="text-center mb-4">
                  <img
                    src={
                      previewUrl ||
                      form.avatarUrl ||
                      "https://placehold.co/120x120?text=Avatar"
                    }
                    alt="avatar"
                    className={`${styles.avatar} mb-2`}
                    onClick={() => isOwner && fileInputRef.current?.click()}
                    style={{ cursor: isOwner ? "pointer" : "default" }}
                  />
                  {isOwner && (
                    <input
                      type="file"
                      accept="image/*"
                      ref={fileInputRef}
                      hidden
                      onChange={(e) => {
                        const file = e.target.files?.[0] || null;
                        setImageUpload(file);
                        if (file) setPreviewUrl(URL.createObjectURL(file));
                      }}
                    />
                  )}
                </div> */}
                <div className="text-center mb-4">
                  {isOwner ? (
                    <label style={{ cursor: "pointer" }}>
                      <img
                        src={tempPreview || form.avatarUrl || "https://placehold.co/120x120?text=Avatar"}
                        alt="avatar"
                        className={`${styles.avatar} mb-2`}
                      />
                      <input
                        id="avatarInput"
                        type="file"
                        accept="image/*"
                        hidden
                        onChange={handleAvatarChange}
                      //   onChange={e => {
                      //   const file = e.target.files?.[0] || null;
                      //   setImageUpload(file);                      
                      //   // generate base-64 preview (avoids blocked blob:// URL)
                      //   if (file) {
                      //     const reader = new FileReader();
                      //     reader.onloadend = () => setTempPreview(reader.result);
                      //     reader.readAsDataURL(file);
                      //   } else {
                      //     setTempPreview("");
                      //   }
                      // } }                     
                      />
                    </label>
                  ) : (
                    <img
                    src={
                        //  tempPreview ||    // <-- show instant preview if user just picked a file
                         form.avatarUrl || // otherwise show stored avatar
                         "https://placehold.co/120x120?text=Avatar"
                       }
                      alt="avatar"
                      className={styles.avatar}
                    />
                  )}
                 
                </div>
              <span className="d-block text-center mb-4">Upload Image</span>
                {/* --------------- Profile Form --------------- */}
                <form onSubmit={handleSubmit}>
                  {/* names */}
                  <MDBRow>
                    <MDBCol md="6" className="mb-4">
                      <MDBInput
                        label="First Name"
                        name="firstName"
                        value={form.firstName}
                        onChange={handleChange}
                        disabled={!isOwner}
                        style={{ backgroundColor: '#FFFFFF' }}
                      />
                    </MDBCol>
                    <MDBCol md="6" className="mb-4">
                      <MDBInput
                        label="Last Name"
                        name="lastName"
                        value={form.lastName}
                        onChange={handleChange}
                        disabled={!isOwner}
                        style={{ backgroundColor: '#FFFFFF' }}
                      />
                    </MDBCol>
                  </MDBRow>

                  <MDBInput
                    label="Username"
                    name="username"
                    className="mb-4"
                    value={form.username}
                    onChange={handleChange}
                    disabled={!isOwner}
                    style={{ backgroundColor: '#FFFFFF' }}
                  />

                  <MDBInput
                    label="Bio"
                    name="bio"
                    className="mb-4"
                    textarea
                    rows={3}
                    value={form.bio}
                    onChange={handleChange}
                    disabled={!isOwner}
                    style={{ backgroundColor: '#FFFFFF' }}
                  />

                  <MDBInput
                    label="Phone Number"
                    name="phoneNumber"
                    className="mb-4"
                    value={form.phoneNumber}
                    onChange={handleChange}
                    disabled={!isOwner}
                    style={{ backgroundColor: '#FFFFFF' }}
                  />

                  {/* DOB */}
                  {/* <MDBRow>
                    {["day", "month", "year"].map((part) => (
                      <MDBCol md="4" key={part}>
                        <select
                          className="form-control mb-3"
                          name={part}
                          value={form.dob[part]}
                          onChange={handleChange}
                          disabled={!isOwner}
                        >
                          <option value="">
                            {part === "day"
                              ? "Day"
                              : part === "month"
                              ? "Month"
                              : "Year"}
                          </option>
                          {part === "day" &&
                            [...Array(31)].map((_, i) => (
                              <option key={i + 1}>{i + 1}</option>
                            ))}
                          {part === "month" &&
                            [
                              "Jan",
                              "Feb",
                              "Mar",
                              "Apr",
                              "May",
                              "Jun",
                              "Jul",
                              "Aug",
                              "Sep",
                              "Oct",
                              "Nov",
                              "Dec",
                            ].map((m) => <option key={m}>{m}</option>)}
                          {part === "year" &&
                            Array.from(
                              { length: 100 },
                              (_, i) => new Date().getFullYear() - i
                            ).map((y) => <option key={y}>{y}</option>)}
                        </select>
                      </MDBCol>
                    ))}
                  </MDBRow> */}
                     <MDBRow>
                    <MDBCol md="4">
                      <select
                        className="form-control mb-4"
                        name="day"
                        value={form.dob.day}
                        onChange={handleChange}
                        disabled={!isOwner}
                      >
                        <option value="">Day</option>
                        {[...Array(31)].map((_, i) => {
                          const d = String(i + 1).padStart(2, '0');
                          return <option key={d} value={d}>{d}</option>;
                        })}
                      </select>
                    </MDBCol>
                    <MDBCol md="4">
                      <select
                        className="form-control mb-4"
                        name="month"
                        value={form.dob.month}
                        onChange={handleChange}
                        disabled={!isOwner}
                      >
                        <option value="">Month</option>
                        {[
                          'Jan','Feb','Mar','Apr','May','Jun',
                          'Jul','Aug','Sep','Oct','Nov','Dec',
                        ].map((m, idx) => {
                          const v = String(idx + 1).padStart(2, '0');
                          return <option key={v} value={v}>{m}</option>;
                        })}
                      </select>
                    </MDBCol>
                    <MDBCol md="4">
                      <select
                        className="form-control mb-4"
                        name="year"
                        value={form.dob.year}
                        onChange={handleChange}
                        disabled={!isOwner}
                      >
                        <option value="">Year</option>
                        {Array.from({ length: 100 }, (_, i) => new Date().getFullYear() - i)
                          .map((y) => <option key={y} value={String(y)}>{y}</option>)}
                      </select>
                    </MDBCol>
                  </MDBRow>

                  {/* gender */}
                  <select
                    className="form-control mb-4"
                    name="gender"
                    value={form.gender}
                    onChange={handleChange}
                    disabled={!isOwner}
                  >
                    <option value="">Select Gender</option>
                    <option>Male</option>
                    <option>Female</option>
                    <option>Other</option>
                  </select>

                  {/* location */}
                  <MDBInput
                    label="Location"
                    name="location"
                    className="mb-1"
                    value={form.location}
                    onChange={handleChange}
                    disabled={!isOwner}
                    style={{ backgroundColor: '#FFFFFF' }}
                  />

                  {/* roles */}
                  <p className="mt-4 mb-2 fw-bold">
                    Role(s) – select all that apply
                  </p>
                  {roleOptions.map(({ value, label, icon, desc }) => (
                    <div key={value} className={styles.roleCard}>
                      <MDBCheckbox
                        id={value}
                        name="role"
                        value={value}
                        checked={form.roles.includes(value)}
                        onChange={handleChange}
                        className="me-2"
                        disabled={!isOwner}
                      />
                      <div>
                        <strong>
                          <span className="fs-3" style={{ width: '1.8rem' }}>
                     {icon}
                    </span>
                    <div>
                      <div className="fw-semibold">{label} </div>
                      <div className="small text-muted lh-sm"> {desc}</div>
                    </div>
                          {/* {icon} {label} {desc} */}
                        </strong>
                      </div>
                    </div>
                  ))}

                  {isOwner && (
                    <div className="d-flex justify-content-center align-items-center gap-3 mt-4">
                    {/* Back button: outlined */}
                    <MDBBtn
                      onClick={() => navigate("/profile")}
                      size="lg"
                      style={{
                        border: "2px solid #D6B100",
                        background: "transparent",
                        color: "#D6B100",
                        borderRadius: "1rem",
                        fontFamily: "Poppins, sans-serif",
                        fontWeight: 600,
                        fontSize: "16px",
                        padding: "0.5rem 1.5rem",
                        textTransform: "none",
                      }}
                    >
                      Back
                    </MDBBtn>
                  
                    {/* Confirm button: filled */}
                    <MDBBtn
                      type="submit"
                      size="lg"
                      style={{
                        border: "none",
                        background: "#D6B100",
                        color: "#0A0A0A",
                        borderRadius: "1rem",
                        fontFamily: "Poppins, sans-serif",
                        fontWeight: 600,
                        fontSize: "16px",
                        padding: "0.5rem 1.5rem",
                        textTransform: "uppercase",
                      }}
                    >
                      Confirm
                    </MDBBtn>
                  </div>
                  )}
                </form>
              </MDBCardBody>
            </MDBCard>
          </MDBCol>
        </MDBRow>
      </MDBContainer>
    </section>
  );
}



















// // src/pages/EditProfilePage.jsx
// import React, { useEffect, useRef, useState } from "react";
// import {
//   MDBContainer,
//   MDBRow,
//   MDBCol,
//   MDBCard,
//   MDBCardBody,
//   MDBInput,
//   MDBCheckbox,
//   MDBBtn,
//   MDBSpinner,
// } from "mdb-react-ui-kit";
// import { useNavigate, useParams } from "react-router-dom";
// import {
//   collection,
//   doc,
//   getDoc,
//   getDocs,
//   serverTimestamp,
//   setDoc,
// } from "firebase/firestore";
// import { db, storage, auth } from "../../configs/firebase";
// import { useAuth } from "../../context/AuthContext";
// import styles from "../../styles/EditProfilePage.module.css";

// import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
// import { v4 as uuid } from "uuid";
// import { updateProfile } from "firebase/auth";
// import AvatarCropModal from "../../components/ui/AvatarCropModal"
// /* -------------------------------------------------------------------- */
// /*                           Edit-or-View Profile                        */
// /* -------------------------------------------------------------------- */
// export default function EditProfilePage() {
//   /* ----- auth & routing ----- */
//   const { currentUser } = useAuth();
//   const { uid: routeUid } = useParams(); // optional :uid
//   const navigate = useNavigate();

//   const uid = routeUid || currentUser?.uid || "";
//   const isOwner = uid === currentUser?.uid;

// const [cropOpen , setCropOpen ] = useState(false);
// const [pickFile , setPickFile ] = useState(null);    // File before crop
// const [dataUrl  , setDataUrl  ] = useState(null);
// const [previewUrl, setPreviewUrl] = useState('');

//   const fileInputRef = useRef(null);

//   /* ----- avatar local state ----- */
//   const [imageUpload, setImageUpload] = useState(null);  // File | null
//   const [tempPreview, setTempPreview] = useState("");   
//   /* ----- profile form state ----- */
//   const [roleOptions, setRoleOptions] = useState(null); // null = loading
//   const [form, setForm] = useState({
//     firstName: "",
//     lastName: "",
//     username: "",
//     bio: "",
//     phoneNumber: "",
//     dob: { day: "", month: "", year: "" },
//     gender: "",
//     location: "",
//     roles: /** @type string[] */ ([]),
//     avatarUrl: "",
//   });

//   /* fetch roles once */
//   useEffect(() => {
//     getDocs(collection(db, "roles"))
//       .then((snap) =>
//         setRoleOptions(snap.docs.map((d) => ({ value: d.id, ...d.data() })))
//       )
//       .catch(console.error);
//   }, []);

//   /* preload profile */
//   // useEffect(() => {
//   //   if (!uid) return;
//   //   getDoc(doc(db, "users", uid)).then((snap) => {
//   //     if (!snap.exists()) return;
//   //     const data = snap.data();

//   //     // normalise DOB
//   //     let dobObj = { day: "", month: "", year: "" };
//   //     if (typeof data.dob === "string") {
//   //       const [y, m, d] = data.dob.split("-");
//   //       dobObj = { day: d, month: m, year: y };
//   //     } else if (data.dob?.seconds) {
//   //       const dt = data.dob.toDate();
//   //       dobObj = {
//   //         day: String(dt.getDate()).padStart(2, "0"),
//   //         month: String(dt.getMonth() + 1).padStart(2, "0"),
//   //         year: String(dt.getFullYear()),
//   //       };
//   //     }
//   //     setForm((f) => ({ ...f, ...data, dob: dobObj }));
//   //   });
//   // }, [uid]);

//    useEffect(() => {
//     if (!uid) return;
//     getDoc(doc(db, "users", uid)).then((snap) => {
//       if (!snap.exists()) return;
//       const data = snap.data();
//       let dobObj = { day: "", month: "", year: "" };
//       if (data.dob) {
//         const parts = data.dob.split("-");
//         if (parts.length === 3) {
//           dobObj = { year: parts[0], month: parts[1], day: parts[2] };
//         }
//       }
//       setForm((f) => ({ ...f, ...data, dob: dobObj }));
//     });
//   }, [uid]);


//   /* generic field handler */
//   const handleChange = ({ target }) => {
//     const { name, value, type, checked } = target;

//     if (["day", "month", "year"].includes(name)) {
//       setForm((f) => ({ ...f, dob: { ...f.dob, [name]: value } }));
//     } else if (name === "role") {
//       setForm((f) => ({
//         ...f,
//         roles: checked ? [...f.roles, value] : f.roles.filter((r) => r !== value),
//       }));
//     } else {
//       setForm((f) => ({ ...f, [name]: type === "checkbox" ? checked : value }));
//     }
//   };

//   // const handleAvatarChange = (e) => {
//   //   const file = e.target.files?.[0] || null;
//   //   setImageUpload(file);
//   //   if (file) {
//   //     const reader = new FileReader();
//   //     reader.onloadend = () => setTempPreview(reader.result);
//   //     reader.readAsDataURL(file);
//   //   } else {
//   //     setTempPreview("");
//   //   }
//   // };

//   const handleAvatarChange = (e) => {
//   const f = e.target.files?.[0];
//   if (!f) return;
//   setPickFile(f);
//   setCropOpen(true);           // show modal cropper
// };
// const handleCropDone = (url) => {
//   setDataUrl(url);             // string ready for upload
//   setTempPreview(url);         // immediate preview
// };
//   /* submit (uploads avatar if chosen, then saves profile) */
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!isOwner) return;

//     let avatarUrl = form.avatarUrl;

//     if (imageUpload) {
//       const imageRef = ref(storage, `images/${imageUpload.name}-${uuid()}`);
//       await uploadBytes(imageRef, imageUpload);
//       avatarUrl = await getDownloadURL(imageRef);

//       await updateProfile(auth.currentUser, { photoURL: avatarUrl });
//     }

//      const { year = "", month = "", day = "" } = form.dob;
//      const dob = `${year.padStart(4, '0')}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;

// //  const dob = `${String(year).padStart(4,"0")}-${String(month).padStart(2,"0")}-` +
// //              `${String(day).padStart(2,"0")}`;

//     await setDoc(
//       doc(db, "users", uid),
//       {
//         ...form,
//         avatarUrl,
//         dob,
//         updatedAt: serverTimestamp(),
//       },
//       { merge: true }
//     );

//     navigate("/profile");
//   };

//   /* loading */
//   if (!currentUser) return null;
//   if (roleOptions === null) {
//     return (
//       <div
//         className="d-flex justify-content-center align-items-center"
//         style={{ minHeight: "60vh" }}
//       >
//         <MDBSpinner grow />
//       </div>
//     );
//   }

//   /* ---------------------------------------------------------------- */
//   /*                               UI                                 */
//   /* ---------------------------------------------------------------- */
//   return (
//     <section className={`${styles.wrapper} py-5`}>
//       <MDBContainer>
//         <MDBRow className="justify-content-center">
//           <MDBCol lg="12" md="10" sm="8">
//             <MDBCard className={styles.card}>
//               <MDBCardBody className="p-md-5 p-4">
//                 {/* ------------ Avatar Picker ------------- */}
//                <div className="text-center mb-4">
//                 <AvatarCropModal
//   file={pickFile}
//   open={cropOpen}
//   onClose={() => setCropOpen(false)}
//   onDone={handleCropDone}
// />
//                   <img
//                     src={
//                       previewUrl ||
//                       form.avatarUrl ||
//                       "https://placehold.co/120x120?text=Avatar"
//                     }
//                     alt="avatar"
//                     className={`${styles.avatar} mb-2`}
//                     onClick={() => isOwner && fileInputRef.current?.click()}
//                     style={{ cursor: isOwner ? "pointer" : "default" }}
//                   />
//                   {isOwner && (
//                     <input
//                       type="file"
//                       accept="image/*"
//                       ref={fileInputRef}
//                       hidden
//                       onChange={(e) => {
//                         const file = e.target.files?.[0] || null;
//                         setImageUpload(file);
//                         if (file) setPreviewUrl(URL.createObjectURL(file));
//                       }}
//                     />
//                   )}
//                 </div> 
//                 {/* <div className="text-center mb-4">
//                   {isOwner ? (
//                     <label style={{ cursor: "pointer" }}>
//                       <img
//                         src={tempPreview || form.avatarUrl || "https://placehold.co/120x120?text=Avatar"}
//                         alt="avatar"
//                         className={`${styles.avatar} mb-2`}
//                       />
//                       <input
//                         id="avatarInput"
//                         type="file"
//                         accept="image/*"
//                         hidden
//                         onChange={handleAvatarChange}
//                       //   onChange={e => {
//                       //   const file = e.target.files?.[0] || null;
//                       //   setImageUpload(file);                      
//                       //   // generate base-64 preview (avoids blocked blob:// URL)
//                       //   if (file) {
//                       //     const reader = new FileReader();
//                       //     reader.onloadend = () => setTempPreview(reader.result);
//                       //     reader.readAsDataURL(file);
//                       //   } else {
//                       //     setTempPreview("");
//                       //   }
//                       // } }                     
//                       />
//                     </label>
//                   ) : (
//                     <img
//                     src={
//                         //  tempPreview ||    // <-- show instant preview if user just picked a file
//                          form.avatarUrl || // otherwise show stored avatar
//                          "https://placehold.co/120x120?text=Avatar"
//                        }
//                       alt="avatar"
//                       className={styles.avatar}
//                     />
//                   )}
//                 </div> */}
                

//                 {/* --------------- Profile Form --------------- */}
//                 <form onSubmit={handleSubmit}>
//                   {/* names */}
//                   <MDBRow>
//                     <MDBCol md="6" className="mb-3">
//                       <MDBInput
//                         label="First Name"
//                         name="firstName"
//                         value={form.firstName}
//                         onChange={handleChange}
//                         disabled={!isOwner}
//                       />
//                     </MDBCol>
//                     <MDBCol md="6" className="mb-3">
//                       <MDBInput
//                         label="Last Name"
//                         name="lastName"
//                         value={form.lastName}
//                         onChange={handleChange}
//                         disabled={!isOwner}
//                       />
//                     </MDBCol>
//                   </MDBRow>

//                   <MDBInput
//                     label="Username"
//                     name="username"
//                     className="mb-3"
//                     value={form.username}
//                     onChange={handleChange}
//                     disabled={!isOwner}
//                   />

//                   <MDBInput
//                     label="Bio"
//                     name="bio"
//                     className="mb-3"
//                     textarea
//                     rows={3}
//                     value={form.bio}
//                     onChange={handleChange}
//                     disabled={!isOwner}
//                   />

//                   <MDBInput
//                     label="Phone Number"
//                     name="phoneNumber"
//                     className="mb-3"
//                     value={form.phoneNumber}
//                     onChange={handleChange}
//                     disabled={!isOwner}
//                   />

//                   {/* DOB */}
//                   {/* <MDBRow>
//                     {["day", "month", "year"].map((part) => (
//                       <MDBCol md="4" key={part}>
//                         <select
//                           className="form-control mb-3"
//                           name={part}
//                           value={form.dob[part]}
//                           onChange={handleChange}
//                           disabled={!isOwner}
//                         >
//                           <option value="">
//                             {part === "day"
//                               ? "Day"
//                               : part === "month"
//                               ? "Month"
//                               : "Year"}
//                           </option>
//                           {part === "day" &&
//                             [...Array(31)].map((_, i) => (
//                               <option key={i + 1}>{i + 1}</option>
//                             ))}
//                           {part === "month" &&
//                             [
//                               "Jan",
//                               "Feb",
//                               "Mar",
//                               "Apr",
//                               "May",
//                               "Jun",
//                               "Jul",
//                               "Aug",
//                               "Sep",
//                               "Oct",
//                               "Nov",
//                               "Dec",
//                             ].map((m) => <option key={m}>{m}</option>)}
//                           {part === "year" &&
//                             Array.from(
//                               { length: 100 },
//                               (_, i) => new Date().getFullYear() - i
//                             ).map((y) => <option key={y}>{y}</option>)}
//                         </select>
//                       </MDBCol>
//                     ))}
//                   </MDBRow> */}
//                      <MDBRow>
//                     <MDBCol md="4">
//                       <select
//                         className="form-control mb-3"
//                         name="day"
//                         value={form.dob.day}
//                         onChange={handleChange}
//                         disabled={!isOwner}
//                       >
//                         <option value="">Day</option>
//                         {[...Array(31)].map((_, i) => {
//                           const d = String(i + 1).padStart(2, '0');
//                           return <option key={d} value={d}>{d}</option>;
//                         })}
//                       </select>
//                     </MDBCol>
//                     <MDBCol md="4">
//                       <select
//                         className="form-control mb-3"
//                         name="month"
//                         value={form.dob.month}
//                         onChange={handleChange}
//                         disabled={!isOwner}
//                       >
//                         <option value="">Month</option>
//                         {[
//                           'Jan','Feb','Mar','Apr','May','Jun',
//                           'Jul','Aug','Sep','Oct','Nov','Dec',
//                         ].map((m, idx) => {
//                           const v = String(idx + 1).padStart(2, '0');
//                           return <option key={v} value={v}>{m}</option>;
//                         })}
//                       </select>
//                     </MDBCol>
//                     <MDBCol md="4">
//                       <select
//                         className="form-control mb-3"
//                         name="year"
//                         value={form.dob.year}
//                         onChange={handleChange}
//                         disabled={!isOwner}
//                       >
//                         <option value="">Year</option>
//                         {Array.from({ length: 100 }, (_, i) => new Date().getFullYear() - i)
//                           .map((y) => <option key={y} value={String(y)}>{y}</option>)}
//                       </select>
//                     </MDBCol>
//                   </MDBRow>

//                   {/* gender */}
//                   <select
//                     className="form-control mb-3"
//                     name="gender"
//                     value={form.gender}
//                     onChange={handleChange}
//                     disabled={!isOwner}
//                   >
//                     <option value="">Select Gender</option>
//                     <option>Male</option>
//                     <option>Female</option>
//                     <option>Other</option>
//                   </select>

//                   {/* location */}
//                   <MDBInput
//                     label="Location"
//                     name="location"
//                     className="mb-1"
//                     value={form.location}
//                     onChange={handleChange}
//                     disabled={!isOwner}
//                   />

//                   {/* roles */}
//                   <p className="mt-4 mb-2 fw-bold">
//                     Role(s) – select all that apply
//                   </p>
//                   {roleOptions.map(({ value, label, icon }) => (
//                     <div key={value} className={styles.roleCard}>
//                       <MDBCheckbox
//                         id={value}
//                         name="role"
//                         value={value}
//                         checked={form.roles.includes(value)}
//                         onChange={handleChange}
//                         className="me-2"
//                         disabled={!isOwner}
//                       />
//                       <div>
//                         <strong>
//                           {icon} {label}
//                         </strong>
//                       </div>
//                     </div>
//                   ))}

//                   {isOwner && (
//                     <div className="text-center mt-4">
//                       <MDBBtn type="submit" className={styles.confirmBtn} size="lg">
//                         CONFIRM
//                       </MDBBtn>
//                     </div>
//                   )}
//                 </form>
//               </MDBCardBody>
//             </MDBCard>
//           </MDBCol>
//         </MDBRow>
//       </MDBContainer>
//     </section>
//   );
// }






