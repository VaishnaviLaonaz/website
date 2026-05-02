// // components/WriteArticle.jsx
// import { useState } from 'react'
// import { useNavigate } from 'react-router-dom'
// import { useAuth } from '../../context/AuthContext'
// import { createArticle } from '../../configs/useArticles'

// export default function WriteArticle() {
//   const { currentUser } = useAuth()
//   const [title, setTitle] = useState('')
//   const [body, setBody] = useState('')
//   const navigate = useNavigate()

//   async function publish() {
//     if (!title.trim() || !body.trim()) {
//       return alert('Both title and body are required.')
//     }

//     const timestamp = Date.now()
//     const articleData = {
//       title,
//       body,
//       authorId: currentUser.uid,
//       createdAt: timestamp,
//       updatedAt: timestamp
//     }

//     const { id } = await createArticle(articleData)
//     navigate(`/article/${id}`)
//   }

//   return (
//     <section className="py-5">
//       <div className="container" style={{ maxWidth: 720 }}>
//         <input
//           className="form-control mb-3 fw-bold fs-4"
//           placeholder="Title"
//           value={title}
//           onChange={e => setTitle(e.target.value)}
//         />
//         <textarea
//           className="form-control mb-3"
//           rows="12"
//           placeholder="Write…"
//           value={body}
//           onChange={e => setBody(e.target.value)}
//         />
//         <button onClick={publish} className="btn btn-success">
//           Publish
//         </button>
//       </div>
//     </section>
//   )
// }

// // Correct code below
// // src/components/WriteArticle.jsx
// import React, { useState, useEffect } from 'react'
// import { useNavigate, useParams } from 'react-router-dom'
// import { useAuth } from '../../context/AuthContext'
// import { createArticle, updateArticle } from '../../configs/useArticles'
// import { get, ref } from 'firebase/database'
// import { rtdb } from '../../configs/firebase'

// export default function WriteArticle() {
//   const { currentUser } = useAuth()
//   const navigate = useNavigate()
//   const { id } = useParams()            // will be undefined when creating
//   const isEdit = Boolean(id)

//   const [title, setTitle] = useState('')
//   const [body, setBody] = useState('')

//   // If editing, fetch the existing article
//   useEffect(() => {
//     if (!isEdit) return
//     get(ref(rtdb, `articles/${id}`)).then((snap) => {
//       if (!snap.exists()) {
//         alert('Article not found.')
//         return navigate('/')
//       }
//       const data = snap.val()
//       setTitle(data.title)
//       setBody(data.body)
//     })
//   }, [id, isEdit, navigate])

//   async function handleSubmit() {
//     if (!title.trim() || !body.trim()) {
//       return alert('Both title and body are required.')
//     }
//     const timestamp = Date.now()
//     if (isEdit) {
//       // update existing
//       await updateArticle(id, {
//         title,
//         body,
//         updatedAt: timestamp
//       })
//       navigate(`/article/${id}`)
//     } else {
//       // create new
//       const { id: newId } = await createArticle({
//         title,
//         body,
//         authorId: currentUser.uid,
//         createdAt: timestamp,
//         updatedAt: timestamp
//       })
//       navigate(`/article/${newId}`)
//     }
//   }

//   return (
//     <section className="py-5">
//       <div className="container" style={{ maxWidth: 720 }}>
//         <input
//           className="form-control mb-3 fw-bold fs-4"
//           placeholder="Title"
//           value={title}
//           onChange={e => setTitle(e.target.value)}
//         />
//         <textarea
//           className="form-control mb-3"
//           rows="12"
//           placeholder="Write…"
//           value={body}
//           onChange={e => setBody(e.target.value)}
//         />
//         <button
//           onClick={handleSubmit}
//           className={`btn btn-${isEdit ? 'primary' : 'success'}`}
//         >
//           {isEdit ? 'Update' : 'Publish'}
//         </button>
//       </div>
//     </section>
//   )
// }






// /* eslint-disable react/prop-types */
// import React, { useState, useEffect } from 'react';
// import { useNavigate, useParams } from 'react-router-dom';
// import { useAuth } from '../../context/AuthContext';
// import { createArticle, updateArticle } from '../../configs/useArticles';
// import { get, ref } from 'firebase/database';
// import { rtdb } from '../../configs/firebase';

// /* ----- TipTap core + extensions ----- */
// import { useEditor, EditorContent } from '@tiptap/react';
// import StarterKit  from '@tiptap/starter-kit';
// import Underline   from '@tiptap/extension-underline';
// import TextStyle   from '@tiptap/extension-text-style';
// import Color       from '@tiptap/extension-color';
// import Highlight   from '@tiptap/extension-highlight';
// import Link        from '@tiptap/extension-link';
// import Image       from '@tiptap/extension-image';
// import Youtube     from '@tiptap/extension-youtube';
// import Emoji       from '@tiptap/extension-emoji';
// import TextAlign   from '@tiptap/extension-text-align';

// import Picker    from '@emoji-mart/react';
// import emojiData from '@emoji-mart/data';

// import 'tippy.js/dist/tippy.css';
// import '../../styles/PostEditor.css';

// export default function WriteArticle() {
//   const { currentUser } = useAuth();
//   const nav             = useNavigate();
//   const { id }          = useParams();
//   const isEdit          = Boolean(id);

//   const [title, setTitle]    = useState('');
//   const [tags, setTags]      = useState(['Farming', 'Technology']);
//   const [picker, showPicker] = useState(false);

//   /* ----- TipTap init ----- */
//   const editor = useEditor({
//     extensions: [
//       StarterKit.configure({ heading:{ levels:[1,2,3] } }),
//       Underline, TextStyle, Color, Highlight,
//       Link.configure({ openOnClick:false }),
//       Image,
//       Youtube.configure({ inline:false, width:640 }),
//       Emoji,
//       TextAlign.configure({ types:['heading','paragraph'] }),
//     ],
//     content:'<p>Write your article here…</p>',
//   });

//   /* ----- preload article when editing ----- */
//   useEffect(() => {
//     if (!isEdit) return;
//     get(ref(rtdb, `articles/${id}`)).then(snap => {
//       if (!snap.exists()) { alert('Article not found'); nav('/'); return; }
//       const art = snap.val();
//       setTitle(art.title);
//       setTags (art.tags || []);
//       setTimeout(() => editor?.commands.setContent(art.body || '<p></p>'), 0);
//     });
//   }, [id, isEdit, nav, editor]);

//   /* ----- helpers ----- */
//   const addTag    = t => setTags(p => [...p, t]);
//   const removeTag = t => setTags(p => p.filter(x => x !== t));

//   const insertEmoji = e => {
//     editor.chain().focus().insertContent(e.native).run();
//     showPicker(false);
//   };

//   const handleImgUpload = e => {
//     const f = e.target.files[0]; if (!f) return;
//     const reader = new FileReader();
//     reader.onload = () =>
//       editor.chain().focus().setImage({ src:reader.result }).run();
//     reader.readAsDataURL(f);
//   };

//   async function handleSubmit() {
//     const body = editor.getHTML();
//     if (!title.trim() || !body.replace(/<[^>]*>?/gm,'').trim()) {
//       return alert('Title and body are required');
//     }
//     const ts = Date.now();
//     if (isEdit) {
//       await updateArticle(id, { title, body, tags, updatedAt:ts });
//       nav(`/article/${id}`);
//     } else {
//       const { id:newId } = await createArticle({
//         title, body, tags,
//         authorId: currentUser.uid,
//         createdAt: ts, updatedAt: ts,
//       });
//       nav(`/article/${newId}`);
//     }
//   }

//   /* ----- UI ----- */
//   return (
//     <section className="post-wrapper">
//       <div className="container" style={{ maxWidth:920 }}>
//         {/* HEADER */}
//         <header className="post-meta d-flex">
//           <div className="meta-left">
//             <time className="meta-date">
//               {new Date().toLocaleDateString('en-US',{
//                 month:'long', day:'numeric', year:'numeric'
//               })}
//             </time>

//             <input
//               className="post-title"
//               placeholder="TITLE"
//               value={title}
//               onChange={e => setTitle(e.target.value)}
//             />

//             {/* TAGS */}
//             <div className="tag-row">
//               {tags.map(t => (
//                 <span
//                   key={t}
//                   className={`tag-pill ${t==='Farming' ? 'filled':''}`}
//                   onClick={() => removeTag(t)}
//                 >
//                   #{t}
//                 </span>
//               ))}

//               <input
//                 className="tag-input"
//                 placeholder="+ Tag"
//                 onKeyDown={e => {
//                   if (e.key==='Enter' && e.target.value.trim()){
//                     addTag(e.target.value.trim());
//                     e.target.value='';
//                   }
//                 }}
//               />
//             </div>
//           </div>

//           {/* AUTHOR */}
//           <div className="author-card">
//             <img src={currentUser.photoURL || '/avatar.svg'} alt="avatar" />
//             <strong>{currentUser.displayName || 'Anonymous'}</strong>
//             <small>Chief Editor</small>
//           </div>
//         </header>

//         {/* TOOLBAR */}
//         <EditorToolbar
//           editor={editor}
//           onToggleEmoji={() => showPicker(v => !v)}
//           onImageUpload={handleImgUpload}
//         />

//         {/* EDITOR */}
//         <EditorContent editor={editor} className="editor-canvas" />

//         {picker && (
//           <Picker
//             data={emojiData}
//             onEmojiSelect={insertEmoji}
//             theme="light"
//             style={{ position:'fixed', bottom:200, left:24, zIndex:2000 }}
//           />
//         )}

//         {/* PUBLISH */}
//         <button className="btn btn-success publish-btn" onClick={handleSubmit}>
//           PUBLISH
//         </button>
//       </div>
//     </section>
//   );
// }

// /* ---------- toolbar component ---------- */
// function EditorToolbar({ editor, onToggleEmoji, onImageUpload }) {
//   if (!editor) return null;
//   const Btn = (icon, fn, active=false) => (
//     <button
//       type="button"
//       className={`tool-btn ${active ? 'active':''}`}
//       onClick={fn}
//     >
//       <i className={`mdi mdi-${icon}`} />
//     </button>
//   );

//   return (
//     <div className="toolbar-static">
//       {/* formatting */}
//       {Btn('format-bold',        () => editor.chain().focus().toggleBold().run(),       editor.isActive('bold'))}
//       {Btn('format-italic',      () => editor.chain().focus().toggleItalic().run(),     editor.isActive('italic'))}
//       {Btn('format-underline',   () => editor.chain().focus().toggleUnderline().run(),  editor.isActive('underline'))}
//       {Btn('format-strikethrough', () => editor.chain().focus().toggleStrike().run(),   editor.isActive('strike'))}
//       {Btn('marker',             () => editor.chain().focus().toggleHighlight().run(),  editor.isActive('highlight'))}

//       {/* colour + emoji */}
//       {Btn('palette', () => {
//         const c = prompt('Hex colour?'); if (c) editor.chain().focus().setColor(c).run();
//       })}
//       {Btn('emoticon-outline', onToggleEmoji)}

//       {/* lists */}
//       {Btn('format-list-bulleted',
//            () => editor.chain().focus().toggleBulletList().run(),
//            editor.isActive('bulletList'))}

//       {/* alignment */}
//       {Btn('format-align-left',
//            () => editor.chain().focus().setTextAlign('left').run(),
//            editor.isActive({ textAlign:'left' }))}
//       {Btn('format-align-center',
//            () => editor.chain().focus().setTextAlign('center').run(),
//            editor.isActive({ textAlign:'center' }))}
//       {Btn('format-align-right',
//            () => editor.chain().focus().setTextAlign('right').run(),
//            editor.isActive({ textAlign:'right' }))}

//       {/* link / media */}
//       {Btn('link', () => {
//         const url = prompt('Enter URL');
//         if (url) editor.chain().focus()
//                         .extendMarkRange('link')
//                         .setLink({ href:url }).run();
//       }, editor.isActive('link'))}

//       <label className="tool-btn mb-0">
//         <i className="mdi mdi-image" />
//         <input type="file" accept="image/*" hidden onChange={onImageUpload} />
//       </label>

//       {Btn('youtube', () => {
//         const url = prompt('YouTube link');
//         if (url) editor.chain().focus().setYoutubeVideo({ src:url }).run();
//       })}

//       {/* history */}
//       {Btn('undo', () => editor.chain().focus().undo().run())}
//       {Btn('redo', () => editor.chain().focus().redo().run())}
//     </div>
//   );
// }







// /* eslint-disable react/prop-types */
// import React, { useState, useEffect } from 'react';
// import { useNavigate, useParams } from 'react-router-dom';
// import { useAuth } from '../../context/AuthContext';
// import { createArticle, updateArticle } from '../../configs/useArticles';
// import { get, ref } from 'firebase/database';
// import { rtdb } from '../../configs/firebase';

// /* ----- TipTap core + extensions ----- */
// import { useEditor, EditorContent } from '@tiptap/react';
// import StarterKit from '@tiptap/starter-kit';
// import Underline from '@tiptap/extension-underline';
// import TextStyle from '@tiptap/extension-text-style';
// import Color from '@tiptap/extension-color';
// import Highlight from '@tiptap/extension-highlight';
// import Link from '@tiptap/extension-link';
// import Image from '@tiptap/extension-image';
// import Youtube from '@tiptap/extension-youtube';
// import Emoji from '@tiptap/extension-emoji';
// import TextAlign from '@tiptap/extension-text-align';

// import Picker from '@emoji-mart/react';
// import emojiData from '@emoji-mart/data';
// import DOMPurify from 'dompurify';

// export default function WriteArticle() {
//   const { currentUser } = useAuth();
//   const nav = useNavigate();
//   const { id } = useParams();
//   const isEdit = Boolean(id);

//   const [title, setTitle] = useState('');
//   const [tags, setTags] = useState(['Farming', 'Technology']);
//   const [picker, showPicker] = useState(false);

//   const editor = useEditor({
//     extensions: [
//       StarterKit.configure({ heading: { levels: [1, 2, 3] } }),
//       Underline,
//       TextStyle,
//       Color,
//       Highlight,
//       Link.configure({ openOnClick: false }),
//       Image,
//       Youtube.configure({ inline: false, width: 640 }),
//       Emoji,
//       TextAlign.configure({ types: ['heading', 'paragraph'] }),
//     ],
//     content: '<p>Write your article here…</p>',
//   });

//   useEffect(() => {
//     if (!isEdit) return;
//     get(ref(rtdb, `articles/${id}`)).then((snap) => {
//       if (!snap.exists()) {
//         alert('Article not found');
//         nav('/');
//         return;
//       }
//       const art = snap.val();
//       setTitle(art.title);
//       setTags(art.tags || []);
//       setTimeout(
//         () => editor?.commands.setContent(art.body || '<p></p>'),
//         0
//       );
//     });
//   }, [id, isEdit, nav, editor]);

//   const addTag = (t) => setTags((p) => [...p, t]);
//   const removeTag = (t) => setTags((p) => p.filter((x) => x !== t));

//   const insertEmoji = (e) => {
//     editor.chain().focus().insertContent(e.native).run();
//     showPicker(false);
//   };

//   const handleImgUpload = (e) => {
//     const f = e.target.files[0];
//     if (!f) return;
//     const reader = new FileReader();
//     reader.onload = () =>
//       editor.chain().focus().setImage({ src: reader.result }).run();
//     reader.readAsDataURL(f);
//   };

//   async function handleSubmit() {
//     const body = editor.getHTML();
//     if (!title.trim() || !body.replace(/<[^>]*>?/gm, '').trim()) {
//       return alert('Title and body are required');
//     }
//     const ts = Date.now();
//     if (isEdit) {
//       await updateArticle(id, { title, body, tags, updatedAt: ts });
//       nav(`/article/${id}`);
//     } else {
//       const { id: newId } = await createArticle({
//         title,
//         body,
//         tags,
//         authorId: currentUser.uid,
//         createdAt: ts,
//         updatedAt: ts,
//       });
//       nav(`/article/${newId}`);
//     }
//   }

//   return (
//     <section className="post-wrapper">
//       <div className="container" style={{ maxWidth: 920 }}>
//         {/* HEADER */}
//         <header className="post-meta d-flex justify-content-between align-items-start mb-4">
//           <div>
//             <time className="text-muted d-block mb-2">
//               {new Date().toLocaleDateString('en-US', {
//                 month: 'long',
//                 day: 'numeric',
//                 year: 'numeric',
//               })}
//             </time>
//             <input
//               className="form-control form-control-lg mb-3"
//               placeholder="TITLE"
//               value={title}
//               onChange={(e) => setTitle(e.target.value)}
//             />

//             {/* TAGS */}
//             <div className="d-flex flex-wrap gap-2">
//               {tags.map((t) => (
//                 <span
//                   key={t}
//                   className="badge bg-secondary"
//                   style={{ cursor: 'pointer' }}
//                   onClick={() => removeTag(t)}
//                 >
//                   #{t} &times;
//                 </span>
//               ))}
//               <input
//                 className="form-control form-control-sm"
//                 placeholder="+ Tag"
//                 style={{ flex: '1 0 100px' }}
//                 onKeyDown={(e) => {
//                   if (e.key === 'Enter' && e.target.value.trim()) {
//                     addTag(e.target.value.trim());
//                     e.target.value = '';
//                   }
//                 }}
//               />
//             </div>
//           </div>

//           {/* AUTHOR */}
//           <div className="text-center">
//             <img
//               src={currentUser.photoURL || '/avatar.svg'}
//               alt="avatar"
//               className="rounded-circle mb-2"
//               style={{ width: 60, height: 60, objectFit: 'cover' }}
//             />
//             <strong className="d-block">
//               {currentUser.displayName || 'Anonymous'}
//             </strong>
//             <small className="text-muted">Chief Editor</small>
//           </div>
//         </header>

//         {/* TOOLBAR */}
//         <EditorToolbar
//           editor={editor}
//           onToggleEmoji={() => showPicker((v) => !v)}
//           onImageUpload={handleImgUpload}
//         />

//         {/* EDITOR CANVAS */}
//         <div
//           className="border rounded mb-3"
//           style={{ minHeight: 300, background: '#fff', padding: '1rem' }}
//         >
//           <EditorContent editor={editor} />
//         </div>

//         {/* PREVIEW */}
//         <div className="mb-3">
//           <h5 className="mb-2">Preview</h5>
//           <div
//             className="border rounded p-3"
//             dangerouslySetInnerHTML={{
//               __html: DOMPurify.sanitize(editor?.getHTML() || ''),
//             }}
//           />
//         </div>

//         {picker && (
//           <Picker
//             data={emojiData}
//             onEmojiSelect={insertEmoji}
//             theme="light"
//             style={{ position: 'fixed', bottom: 200, left: 24, zIndex: 2000 }}
//           />
//         )}

//         {/* PUBLISH */}
//         <button className="btn btn-success btn-lg" onClick={handleSubmit}>
//           <i className="bi bi-send-fill me-2"></i>
//           PUBLISH
//         </button>
//       </div>
//     </section>
//   );
// }

// /* ---------- toolbar component ---------- */
// function EditorToolbar({ editor, onToggleEmoji, onImageUpload }) {
//   if (!editor) return null;

//   const btn = (iconClass, onClick, active = false, tooltip = '') => (
//     <button
//       type="button"
//       className={`btn btn-outline-secondary btn-sm me-2${
//         active ? ' active' : ''
//       }`}
//       onClick={onClick}
//       title={tooltip}
//     >
//       <i className={`bi bi-${iconClass}`}></i>
//     </button>
//   );

//   return (
//     <div className="mb-3">
//       {btn('type-bold', () => editor.chain().focus().toggleBold().run(), editor.isActive('bold'), 'Bold')}
//       {btn('type-italic', () => editor.chain().focus().toggleItalic().run(), editor.isActive('italic'), 'Italic')}
//       {btn('type-underline', () => editor.chain().focus().toggleUnderline().run(), editor.isActive('underline'), 'Underline')}
//       {btn('type-strikethrough', () => editor.chain().focus().toggleStrike().run(), editor.isActive('strike'), 'Strike')}
//       {btn('brush', () => editor.chain().focus().toggleHighlight().run(), editor.isActive('highlight'), 'Highlight')}

//       {btn('palette', () => {
//         const c = prompt('Hex color?');
//         if (c) editor.chain().focus().setColor(c).run();
//       }, false, 'Color')}
//       {btn('emoji-smile', onToggleEmoji, false, 'Emoji')}

//       {btn('list-ul', () => editor.chain().focus().toggleBulletList().run(), editor.isActive('bulletList'), 'Bullet List')}

//       {btn('align-left', () => editor.chain().focus().setTextAlign('left').run(), editor.isActive({ textAlign: 'left' }), 'Align Left')}
//       {btn('align-center', () => editor.chain().focus().setTextAlign('center').run(), editor.isActive({ textAlign: 'center' }), 'Align Center')}
//       {btn('align-right', () => editor.chain().focus().setTextAlign('right').run(), editor.isActive({ textAlign: 'right' }), 'Align Right')}

//       {btn('link-45deg', () => {
//         const url = prompt('Enter URL');
//         if (url) editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
//       }, editor.isActive('link'), 'Link')}

//       <button type="button" className="btn btn-outline-secondary btn-sm me-2" title="Image">
//         <i className="bi bi-image"></i>
//         <input type="file" accept="image/*" hidden onChange={onImageUpload} />
//       </button>

//       {btn('youtube', () => {
//         const url = prompt('YouTube link');
//         if (url) editor.chain().focus().setYoutubeVideo({ src: url }).run();
//       }, false, 'YouTube')}

//       {btn('arrow-counterclockwise', () => editor.chain().focus().undo().run(), false, 'Undo')}
//       {btn('arrow-clockwise', () => editor.chain().focus().redo().run(), false, 'Redo')}
//     </div>
//   );
// }






// // correct one below

// /* eslint-disable react/prop-types */
// import React, { useState, useEffect } from 'react';
// import { useNavigate, useParams } from 'react-router-dom';
// import { useAuth } from '../../context/AuthContext';
// import { createArticle, updateArticle } from '../../configs/useArticles';
// import { get, ref } from 'firebase/database';
// import { rtdb } from '../../configs/firebase';

// // Styles and icons
// import 'mdb-react-ui-kit/dist/css/mdb.min.css';
// import '@fortawesome/fontawesome-free/css/all.min.css';

// /* TipTap core + extensions */
// import { useEditor, EditorContent } from '@tiptap/react';
// import StarterKit from '@tiptap/starter-kit';
// import Underline from '@tiptap/extension-underline';
// import TextStyle from '@tiptap/extension-text-style';
// import Color from '@tiptap/extension-color';
// import Highlight from '@tiptap/extension-highlight';
// import Link from '@tiptap/extension-link';
// import Image from '@tiptap/extension-image';
// import Youtube from '@tiptap/extension-youtube';
// import Emoji from '@tiptap/extension-emoji';
// import TextAlign from '@tiptap/extension-text-align';
// import Picker from '@emoji-mart/react';
// import emojiData from '@emoji-mart/data';
// import DOMPurify from 'dompurify';

// /* MDB React UI Kit Components */
// import {
//   MDBContainer,
//   MDBRow,
//   MDBCol,
//   MDBInput,
//   MDBBadge,
//   MDBBtn,
//   MDBIcon,
//   MDBCard,
//   MDBCardBody
// } from 'mdb-react-ui-kit';

// export default function WriteArticle() {
//   const { currentUser } = useAuth();
//   const nav = useNavigate();
//   const { id } = useParams();
//   const isEdit = Boolean(id);

//   const [title, setTitle] = useState('');
//   const [tags, setTags] = useState(['Farming', 'Technology']);
//   const [picker, showPicker] = useState(false);
//   const [colorPicker, showColorPicker] = useState(false);

//   const editor = useEditor({
//     extensions: [
//       StarterKit.configure({ heading: { levels: [1, 2, 3] } }),
//       Underline,
//       TextStyle,
//       Color,
//       Highlight,
//       Link.configure({ openOnClick: false }),
//       Image,
//       Youtube.configure({ inline: false, width: 640 }),
//       Emoji,
//       TextAlign.configure({ types: ['heading', 'paragraph'] })
//     ],
//     content: '<p> </p>'
//   });

//   useEffect(() => {
//     if (!isEdit) return;
//     get(ref(rtdb, `articles/${id}`)).then(snap => {
//       if (!snap.exists()) { alert('Article not found'); nav('/'); return; }
//       const art = snap.val();
//       setTitle(art.title);
//       setTags(art.tags || []);
//       setTimeout(() => editor?.commands.setContent(art.body || '<p></p>'), 0);
//     });
//   }, [id, isEdit, nav, editor]);

//   const addTag = (t) => setTags(prev => [...prev, t]);
//   const removeTag = (t) => setTags(prev => prev.filter(x => x !== t));

//   const insertEmoji = (e) => {
//     editor.chain().focus().insertContent(e.native).run();
//     showPicker(false);
//   };

//   const handleImgUpload = (e) => {
//     const f = e.target.files[0];
//     if (!f) return;
//     const reader = new FileReader();
//     reader.onload = () => editor.chain().focus().setImage({ src: reader.result }).run();
//     reader.readAsDataURL(f);
//   };

//   const handleSubmit = async () => {
//     const body = editor.getHTML();
//     if (!title.trim() || !body.replace(/<[^>]*>?/gm, '').trim()) {
//       return alert('Title and body are required');
//     }
//     const ts = Date.now();
//     if (isEdit) {
//       await updateArticle(id, { title, body, tags, updatedAt: ts });
//       nav(`/article/${id}`);
//     } else {
//       const { id: newId } = await createArticle({
//         title,
//         body,
//         tags,
//         authorId: currentUser.uid,
//         createdAt: ts,
//         updatedAt: ts
//       });
//       nav(`/article/${newId}`);
//     }
//   };

//   return (
//     <MDBContainer className="py-5">
//       <MDBRow center>
//         <MDBCol md="10" lg="8">

//           {/* Header */}
//           <div className="mb-4 text-center">
//             <small className="text-muted">{new Date().toLocaleDateString()}</small>
//             <MDBInput
//               className="mt-2"
//               placeholder="TITLE"
//               value={title}
//               onChange={e => setTitle(e.target.value)}
//               size="lg"
//             />
//           </div>

//           {/* Tags */}
//           <div className="d-flex flex-wrap gap-2 mb-3 justify-content-center">
//             {tags.map(t => (
//               <MDBBadge key={t} pill color="info" className="px-3 py-2 d-flex align-items-center">
//                 #{t}
//                 <MDBIcon fas icon="times-circle" className="ms-2" style={{ cursor: 'pointer' }}
//                   onClick={() => removeTag(t)}
//                 />
//               </MDBBadge>
//             ))}
//             <MDBInput
//               placeholder="+ Tag"
//               style={{ width: '150px' }}
//               onKeyDown={e => {
//                 if (e.key === 'Enter' && e.target.value.trim()) {
//                   addTag(e.target.value.trim());
//                   e.target.value = '';
//                 }
//               }}
//             />
//           </div>

//           {/* Toolbar */}
//           <MDBCard className="mb-3 shadow-sm">
//             <MDBCardBody className="d-flex flex-wrap gap-2 bg-white">
//               {[
//                 { cmd: 'toggleBold', icon: 'bold' },
//                 { cmd: 'toggleItalic', icon: 'italic' },
//                 { cmd: 'toggleUnderline', icon: 'underline' },
//                 { cmd: 'toggleStrike', icon: 'strikethrough' },
//                 { cmd: 'toggleHighlight', icon: 'paint-brush' }
//               ].map(({ cmd, icon }) => (
//                 <MDBBtn
//                   key={cmd}
//                   size="sm"
//                   outline
//                   color={editor?.isActive(cmd.replace('toggle', '').toLowerCase()) ? 'primary' : 'secondary'}
//                   onClick={() => editor.chain().focus()[cmd]().run()}
//                 >
//                   <MDBIcon fas icon={icon} />
//                 </MDBBtn>
//               ))}

//               {/* Color Picker */}
//               <div className="input-group input-group-sm me-2" style={{ width: 40 }}>
//                 <input type="color" className="form-control form-control-color p-0" title="Text Color"
//                   onChange={e => editor.chain().focus().setColor(e.target.value).run()}
//                 />
//               </div>

//               <MDBBtn size="sm" outline color="secondary" onClick={() => editor.chain().focus().toggleBulletList().run()}>
//                 <MDBIcon fas icon="list-ul" />
//               </MDBBtn>
//               <MDBBtn size="sm" outline color="secondary" onClick={() => editor.chain().focus().setTextAlign('left').run()}>
//                 <MDBIcon fas icon="align-left" />
//               </MDBBtn>
//               <MDBBtn size="sm" outline color="secondary" onClick={() => editor.chain().focus().setTextAlign('center').run()}>
//                 <MDBIcon fas icon="align-center" />
//               </MDBBtn>
//               <MDBBtn size="sm" outline color="secondary" onClick={() => editor.chain().focus().setTextAlign('right').run()}>
//                 <MDBIcon fas icon="align-right" />
//               </MDBBtn>

//               <MDBBtn size="sm" outline color="secondary" onClick={() => {
//                 const url = prompt('Enter URL');
//                 if (url) editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
//               }}>
//                 <MDBIcon fas icon="link" />
//               </MDBBtn>

//               {/* Emoji Picker Toggle */}
//               <MDBBtn size="sm" outline color="secondary" onClick={() => showPicker(v => !v)}>
//                 <MDBIcon fas icon="smile" />
//               </MDBBtn>
//               {picker && (
//                 <Picker
//                   data={emojiData}
//                   onEmojiSelect={insertEmoji}
//                   theme="light"
//                   style={{ position: 'absolute', bottom: 100, left: 50, zIndex: 1000 }}
//                 />
//               )}

//               <MDBBtn size="sm" outline color="secondary" onClick={() => document.getElementById('img-upload').click()}>
//                 <MDBIcon fas icon="image" />
//                 <input id="img-upload" type="file" accept="image/*" hidden onChange={handleImgUpload} />
//               </MDBBtn>

//               <MDBBtn size="sm" outline color="secondary" onClick={() => editor.chain().focus().undo().run()}>
//                 <MDBIcon fas icon="undo" />
//               </MDBBtn>
//               <MDBBtn size="sm" outline color="secondary" onClick={() => editor.chain().focus().redo().run()}>
//                 <MDBIcon fas icon="redo" />
//               </MDBBtn>
//             </MDBCardBody>
//           </MDBCard>

//           {/* Editor Canvas */}
//           <div className="mb-3 bg-white shadow-sm rounded" style={{ minHeight: 300, padding: '1rem' }}>
//             <EditorContent editor={editor} />
//           </div>

//           {/* Live Preview */}
//           <div className="mb-4">
//             <h5 className="mb-2">Preview</h5>
//             <div
//               className="p-3 bg-light rounded shadow-sm"
//               dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(editor?.getHTML() || '') }}
//             />
//           </div>

//           {/* Publish Button */}
//           <div className="text-center">
//             <MDBBtn color="primary" size="lg" onClick={handleSubmit} className="d-flex align-items-center mx-auto">
//               <MDBIcon fas icon="paper-plane" className="me-2" /> Publish
//             </MDBBtn>
//           </div>
//         </MDBCol>
//       </MDBRow>
//     </MDBContainer>
//   );
// }



// Correct one below


// /* eslint-disable react/prop-types */
// import React, { useState, useEffect } from 'react';
// import { useNavigate, useParams } from 'react-router-dom';
// import { useAuth } from '../../context/AuthContext';
// import { createArticle, updateArticle } from '../../configs/useArticles';
// import { get, ref } from 'firebase/database';
// import { auth, rtdb } from '../../configs/firebase';
// import { doc, getDoc } from 'firebase/firestore';
// import { db } from '../../configs/firebase';

// // Styles and icons
// import 'mdb-react-ui-kit/dist/css/mdb.min.css';
// import '@fortawesome/fontawesome-free/css/all.min.css';

// /* TipTap core + extensions */
// import { useEditor, EditorContent } from '@tiptap/react';
// import StarterKit from '@tiptap/starter-kit';
// import Underline from '@tiptap/extension-underline';
// import TextStyle from '@tiptap/extension-text-style';
// import Color from '@tiptap/extension-color';
// import Highlight from '@tiptap/extension-highlight';
// import Link from '@tiptap/extension-link';
// import Image from '@tiptap/extension-image';
// import Youtube from '@tiptap/extension-youtube';
// import Emoji from '@tiptap/extension-emoji';
// import TextAlign from '@tiptap/extension-text-align';
// import Picker from '@emoji-mart/react';
// import emojiData from '@emoji-mart/data';
// import DOMPurify from 'dompurify';

// /* MDB React UI Kit Components */
// import {
//   MDBContainer,
//   MDBRow,
//   MDBCol,
//   MDBInput,
//   MDBBadge,
//   MDBBtn,
//   MDBIcon,
//   MDBCard,
//   MDBCardBody,
//   MDBCardImage
// } from 'mdb-react-ui-kit';

// export default function WriteArticle() {
//   const { currentUser } = useAuth();
//   const nav = useNavigate();
//   const { id } = useParams();
//   const isEdit = Boolean(id);

//   const [profile, setProfile] = useState(null);

//   useEffect(() => {
//     if (!currentUser) return;
//     getDoc(doc(db, 'users', currentUser.uid))
//       .then(snap => snap.exists() && setProfile(snap.data()))
//       .catch(console.error);
//   }, [currentUser]);

//   const [title, setTitle] = useState('');
//   const [tags, setTags] = useState(['Farming', 'Technology']);
//   const [picker, showPicker] = useState(false);

//   const editor = useEditor({
//     extensions: [
//       StarterKit.configure({ heading: { levels: [1, 2, 3] } }),
//       Underline,
//       TextStyle,
//       Color,
//       Highlight,
//       Link.configure({ openOnClick: false }),
//       Image,
//       Youtube.configure({ inline: false, width: 640 }),
//       Emoji,
//       TextAlign.configure({ types: ['heading', 'paragraph'] })
//     ],
//     content: '<p> </p>'
//   });

//   useEffect(() => {
//     if (!isEdit) return;
//     get(ref(rtdb, `articles/${id}`)).then(snap => {
//       if (!snap.exists()) { alert('Article not found'); nav('/'); return; }
//       const art = snap.val();
//       setTitle(art.title);
//       setTags(art.tags || []);
//       setTimeout(() => editor?.commands.setContent(art.body || '<p></p>'), 0);
//     });
//   }, [id, isEdit, nav, editor]);

//   const addTag = t => setTags(prev => [...prev, t]);
//   const removeTag = t => setTags(prev => prev.filter(x => x !== t));

//   const insertEmoji = e => {
//     editor.chain().focus().insertContent(e.native).run();
//     showPicker(false);
//   };

//   const handleImgUpload = e => {
//     const f = e.target.files[0];
//     if (!f) return;
//     const reader = new FileReader();
//     reader.onload = () => editor.chain().focus().setImage({ src: reader.result }).run();
//     reader.readAsDataURL(f);
//   };

//   const handleSubmit = async () => {
//     const body = editor.getHTML();
//     if (!title.trim() || !body.replace(/<[^>]*>?/gm, '').trim()) {
//       return alert('Title and body are required');
//     }
//     const ts = Date.now();
//     if (isEdit) {
//       await updateArticle(id, { title, body, tags, updatedAt: ts });
//       nav(`/article/${id}`);
//     } else {
//       const { id: newId } = await createArticle({
//         title,
//         body,
//         tags,
//         authorId: currentUser.uid,
//         createdAt: ts,
//         updatedAt: ts
//       });
//       nav(`/article/${newId}`);
//     }
//   };
//    const authorName =
//     profile?.username ||
//     [profile?.firstName, profile?.lastName].filter(Boolean).join(' ') ||
//     currentUser?.email ||
//     'Unknown';

//   return (
//     <MDBContainer className="py-5">
//       <MDBRow center>
//         <MDBCol md="10" lg="8">

//           {/* User Avatar & Name */}
//           <div className="d-flex align-items-center gap-3 mb-4">
//             <MDBCardImage
//               src={currentUser.photoURL}
//               alt="Avatar"
//               className="rounded-circle"
//               style={{ width: '50px', height: '50px', objectFit: 'cover' }}
//             />
//             <h5 className="mb-0">{authorName}</h5>
//           </div>

//           {/* Header */}
//           <div className="mb-4 text-center">
//             <small className="text-muted">{new Date().toLocaleDateString()}</small>
//             <MDBInput
//               className="mt-2"
//               placeholder="TITLE"
//               value={title}
//               onChange={e => setTitle(e.target.value)}
//               size="lg"
//             />
//           </div>

//           {/* Tags */}
//           <div className="d-flex flex-nowrap gap-2 mb-3 justify-content-center">
//             {tags.map(t => (
//               <MDBBadge
//                 key={t}
//                 pill
//                 color="info"
//                 className="px-2 py-1 d-flex align-items-center"
//               >
//                 #{t}
//                 <MDBIcon
//                   fas
//                   icon="times-circle"
//                   className="ms-1"
//                   style={{ cursor: 'pointer', fontSize: '0.9rem' }}
//                   onClick={() => removeTag(t)}
//                 />
//               </MDBBadge>
//             ))}
//             <MDBInput
//               placeholder="+ Tag"
//               style={{ width: '100px', fontSize: '0.9rem' }}
//               onKeyDown={e => {
//                 if (e.key === 'Enter' && e.target.value.trim()) {
//                   addTag(e.target.value.trim());
//                   e.target.value = '';
//                 }
//               }}
//               size="sm"
//             />
//           </div>

//           {/* Toolbar */}
//           <MDBCard className="mb-3 shadow-sm">
//             <MDBCardBody className="d-flex flex-wrap gap-2 bg-white">
//               {[ 
//                 { cmd: 'toggleBold', icon: 'bold' },
//                 { cmd: 'toggleItalic', icon: 'italic' },
//                 { cmd: 'toggleUnderline', icon: 'underline' },
//                 { cmd: 'toggleStrike', icon: 'strikethrough' },
//                 { cmd: 'toggleHighlight', icon: 'paint-brush' }
//               ].map(({ cmd, icon }) => (
//                 <MDBBtn
//                   key={cmd}
//                   size="sm"
//                   outline
//                   color={editor?.isActive(cmd.replace('toggle', '').toLowerCase()) ? 'primary' : 'secondary'}
//                   onClick={() => editor.chain().focus()[cmd]().run()}
//                 >
//                   <MDBIcon fas icon={icon} />
//                 </MDBBtn>
//               ))}

//               {/* Color Picker */}
//               <div className="input-group input-group-sm me-2" style={{ width: 40 }}>
//                 <input
//                   type="color"
//                   className="form-control form-control-color p-0"
//                   title="Text Color"
//                   onChange={e => editor.chain().focus().setColor(e.target.value).run()}
//                 />
//               </div>

//               <MDBBtn size="sm" outline color="secondary" onClick={() => editor.chain().focus().toggleBulletList().run()}>
//                 <MDBIcon fas icon="list-ul" />
//               </MDBBtn>
//               {['left','center','right'].map(align => (
//                 <MDBBtn
//                   key={align}
//                   size="sm"
//                   outline
//                   color="secondary"
//                   onClick={() => editor.chain().focus().setTextAlign(align).run()}
//                 >
//                   <MDBIcon fas icon={`align-${align}`} />
//                 </MDBBtn>
//               ))}
//               <MDBBtn
//                 size="sm"
//                 outline
//                 color="secondary"
//                 onClick={() => {
//                   const url = prompt('Enter URL');
//                   if (url) editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
//                 }}
//               >
//                 <MDBIcon fas icon="link" />
//               </MDBBtn>

//               {/* Emoji */}
//               <MDBBtn size="sm" outline color="secondary" onClick={() => showPicker(v => !v)}>
//                 <MDBIcon fas icon="smile" />
//               </MDBBtn>
//               {picker && (
//                 <Picker
//                   data={emojiData}
//                   onEmojiSelect={insertEmoji}
//                   theme="light"
//                   style={{ position: 'absolute', bottom: 100, left: 50, zIndex: 1000 }}
//                 />
//               )}

//               <MDBBtn size="sm" outline color="secondary" onClick={() => document.getElementById('img-upload').click()}>
//                 <MDBIcon fas icon="image" />
//                 <input id="img-upload" type="file" accept="image/*" hidden onChange={handleImgUpload} />
//               </MDBBtn>
//               <MDBBtn size="sm" outline color="secondary" onClick={() => editor.chain().focus().undo().run()}>
//                 <MDBIcon fas icon="undo" />
//               </MDBBtn>
//               <MDBBtn size="sm" outline color="secondary" onClick={() => editor.chain().focus().redo().run()}>
//                 <MDBIcon fas icon="redo" />
//               </MDBBtn>
//             </MDBCardBody>
//           </MDBCard>

//           {/* Editor Canvas */}
//           <div className="mb-3">
//             <label className="form-label fw-bold">Write Your Article</label>
//             <div
//               className="bg-white shadow-sm rounded border"
//               style={{ minHeight: 400, padding: '1rem' }}
//             >
//               <EditorContent editor={editor} />
//             </div>
//           </div>

//           {/* Live Preview */}
//           <div className="mb-4">
//             <h5 className="mb-2">Preview</h5>
//             <div
//               className="p-3 bg-light rounded shadow-sm"
//               dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(editor?.getHTML() || '') }}
//             />
//           </div>

//           {/* Publish Button */}
//           <div className="text-center">
//             <MDBBtn color="primary" size="lg" onClick={handleSubmit} className="d-flex align-items-center mx-auto">
//               <MDBIcon fas icon="paper-plane" className="me-2" /> Publish
//             </MDBBtn>
//           </div>
          
//         </MDBCol>
//       </MDBRow>
//     </MDBContainer>
//   );
// }

// Correct one below

// // src/pages/WriteArticle.jsx
// import React, { useState, useEffect } from 'react';
// import { useNavigate, useParams } from 'react-router-dom';
// import { useAuth } from '../../context/AuthContext';
// import { createArticle, updateArticle } from '../../configs/useArticles';
// import { ref, get } from 'firebase/database';
// import { rtdb, db as fsDb } from '../../configs/firebase';
// import { doc, getDoc, setDoc, collection, serverTimestamp } from 'firebase/firestore';
// import 'mdb-react-ui-kit/dist/css/mdb.min.css';
// import '@fortawesome/fontawesome-free/css/all.min.css';
// import { useEditor, EditorContent } from '@tiptap/react';
// import StarterKit from '@tiptap/starter-kit';
// import Underline from '@tiptap/extension-underline';
// import TextStyle from '@tiptap/extension-text-style';
// import Color from '@tiptap/extension-color';
// import Highlight from '@tiptap/extension-highlight';
// import LinkExt from '@tiptap/extension-link';
// import Image from '@tiptap/extension-image';
// import Youtube from '@tiptap/extension-youtube';
// import Emoji from '@tiptap/extension-emoji';
// import TextAlign from '@tiptap/extension-text-align';
// import Picker from '@emoji-mart/react';
// import emojiData from '@emoji-mart/data';
// import DOMPurify from 'dompurify';
// import {
//   MDBContainer, MDBRow, MDBCol, MDBInput, MDBBadge, MDBBtn,
//   MDBIcon, MDBCardImage, MDBCard, MDBCardBody,
// } from 'mdb-react-ui-kit';

// export default function WriteArticle() {
//   const { currentUser } = useAuth();
//   const nav = useNavigate();
//   const { id } = useParams();
//   const isEdit = Boolean(id);
//   const [profile, setProfile] = useState(null);
//   const [allTags, setAllTags] = useState([]);


//   useEffect(() => {
//     if (!currentUser) return;
//     getDoc(doc(fsDb, 'users', currentUser.uid)).then(snap => snap.exists() && setProfile(snap.data())).catch(console.error);
//   }, [currentUser]);

//   const [title, setTitle] = useState('');
//   const [tags, setTags] = useState([]);
//   const [picker, showPicker] = useState(false);

//   const editor = useEditor({
//     extensions: [
//       StarterKit.configure({ heading: { levels: [1,2,3] } }),
//       Underline, TextStyle, Color, Highlight,
//       LinkExt.configure({ openOnClick: false }),
//       Image, Youtube.configure({ inline:false, width:640 }),
//       Emoji, TextAlign.configure({ types:['heading','paragraph'] })
//     ],
//     content: '<p> </p>'
//   });

//   useEffect(() => {
//     if (!isEdit) return;
//     get(ref(rtdb, `articles/${id}`)).then(snap => {
//       if (!snap.exists()) { alert('Article not found'); nav('/'); return; }
//       const art = snap.val(); setTitle(art.title); setTags(art.tags || []);
//       setTimeout(() => editor?.commands.setContent(art.body || '<p>...</p>'), 0);
//     });
//   }, [id, isEdit, nav, editor]);

//   const addTag = t => {
//     const norm = t.trim().toLowerCase();
//     if (norm && !tags.includes(norm)) setTags(prev => [...prev, norm]);
//   };
//   const removeTag = t => setTags(prev => prev.filter(x => x !== t));

//   const insertEmoji = e => {
//     editor.chain().focus().insertContent(e.native).run();
//     showPicker(false);
//   };

//   const handleImgUpload = e => {
//     const f = e.target.files[0];
//     if (!f) return;
//     const reader = new FileReader();
//     reader.onload = () => editor.chain().focus().setImage({ src: reader.result }).run();
//     reader.readAsDataURL(f);
//   };

//   const handleSubmit = async () => {
//     const body = editor.getHTML();
//     if (!title.trim() || !body.replace(/<[^>]*>?/gm, '').trim()) return alert('Title and body are required');
//     const ts = Date.now();
//     const payload = { title, body, tags, authorId: currentUser.uid, createdAt: ts, updatedAt: ts };

//     let articleId;
//     if (isEdit) {
//       await updateArticle(id, payload);
//       articleId = id;
//     } else {
//       const res = await createArticle(payload);
//       articleId = res.id;
//     }

//     // upsert tags collection
//     const batchPromises = tags.map(tag => {
//       const tagId = tag.toLowerCase();
//       return setDoc(doc(fsDb, 'tags', tagId), { name: tag, updatedAt: serverTimestamp() });
//     });
//     await Promise.all(batchPromises);

//     nav(`/article/${articleId}`);
//   };

//   const authorName = profile?.username || [profile?.firstName, profile?.lastName].filter(Boolean).join(' ') || currentUser?.email || 'Unknown';

//  return (
//     <MDBContainer className="py-5">
//       <MDBRow center>
//         <MDBCol md="10" lg="8">

//           {/* User Avatar & Name */}
//           <div className="d-flex align-items-center gap-3 mb-4">
//             <MDBCardImage
//               src={currentUser.photoURL}
//               alt="Avatar"
//               className="rounded-circle"
//               style={{ width: '50px', height: '50px', objectFit: 'cover' }}
//             />
//             <h5 className="mb-0">{authorName}</h5>
//           </div>

//           {/* Header */}
//           <div className="mb-4 text-center">
//             <small className="text-muted">{new Date().toLocaleDateString()}</small>
//             <MDBInput
//               className="mt-2"
//               placeholder="TITLE"
//               value={title}
//               onChange={e => setTitle(e.target.value)}
//               size="lg"
//             />
//           </div>

//           {/* Tags */}
//             <div className="d-flex flex-wrap gap-2 mb-2 justify-content-center">
//             {tags.map(t => (
//               <MDBBadge key={t} pill color="info" className="px-2 py-1 d-flex align-items-center">
//                 #{t}
//                 <MDBIcon fas icon="times-circle" className="ms-1" onClick={() => removeTag(t)} />
//               </MDBBadge>
//             ))}
//             <MDBInput
//               placeholder="+ Tag"
//               style={{ width: 100, fontSize: '0.9rem' }}
//               size="sm"
//               onKeyDown={e => {
//                 if (e.key === 'Enter' && e.target.value.trim()) {
//                   addTag(e.target.value);
//                   e.target.value = '';
//                 }
//               }}
//             />
//           </div>


//           {/* Toolbar */}
//           <MDBCard className="mb-3 shadow-sm">
//             <MDBCardBody className="d-flex flex-wrap gap-2 bg-white">
//               {[ 
//                 { cmd: 'toggleBold', icon: 'bold' },
//                 { cmd: 'toggleItalic', icon: 'italic' },
//                 { cmd: 'toggleUnderline', icon: 'underline' },
//                 { cmd: 'toggleStrike', icon: 'strikethrough' },
//                 { cmd: 'toggleHighlight', icon: 'paint-brush' }
//               ].map(({ cmd, icon }) => (
//                 <MDBBtn
//                   key={cmd}
//                   size="sm"
//                   outline
//                   color={editor?.isActive(cmd.replace('toggle', '').toLowerCase()) ? 'primary' : 'secondary'}
//                   onClick={() => editor.chain().focus()[cmd]().run()}
//                 >
//                   <MDBIcon fas icon={icon} />
//                 </MDBBtn>
//               ))}

//               {/* Color Picker */}
//               <div className="input-group input-group-sm me-2" style={{ width: 40 }}>
//                 <input
//                   type="color"
//                   className="form-control form-control-color p-0"
//                   title="Text Color"
//                   onChange={e => editor.chain().focus().setColor(e.target.value).run()}
//                 />
//               </div>

//               <MDBBtn size="sm" outline color="secondary" onClick={() => editor.chain().focus().toggleBulletList().run()}>
//                 <MDBIcon fas icon="list-ul" />
//               </MDBBtn>
//               {['left','center','right'].map(align => (
//                 <MDBBtn
//                   key={align}
//                   size="sm"
//                   outline
//                   color="secondary"
//                   onClick={() => editor.chain().focus().setTextAlign(align).run()}
//                 >
//                   <MDBIcon fas icon={`align-${align}`} />
//                 </MDBBtn>
//               ))}
//               <MDBBtn
//                 size="sm"
//                 outline
//                 color="secondary"
//                 onClick={() => {
//                   const url = prompt('Enter URL');
//                   if (url) editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
//                 }}
//               >
//                 <MDBIcon fas icon="link" />
//               </MDBBtn>

//               {/* Emoji */}
//               <MDBBtn size="sm" outline color="secondary" onClick={() => showPicker(v => !v)}>
//                 <MDBIcon fas icon="smile" />
//               </MDBBtn>
//               {picker && (
//                 <Picker
//                   data={emojiData}
//                   onEmojiSelect={insertEmoji}
//                   theme="light"
//                   style={{ position: 'absolute', bottom: 100, left: 50, zIndex: 1000 }}
//                 />
//               )}

//               <MDBBtn size="sm" outline color="secondary" onClick={() => document.getElementById('img-upload').click()}>
//                 <MDBIcon fas icon="image" />
//                 <input id="img-upload" type="file" accept="image/*" hidden onChange={handleImgUpload} />
//               </MDBBtn>
//               <MDBBtn size="sm" outline color="secondary" onClick={() => editor.chain().focus().undo().run()}>
//                 <MDBIcon fas icon="undo" />
//               </MDBBtn>
//               <MDBBtn size="sm" outline color="secondary" onClick={() => editor.chain().focus().redo().run()}>
//                 <MDBIcon fas icon="redo" />
//               </MDBBtn>
//             </MDBCardBody>
//           </MDBCard>

//           {/* Editor Canvas */}
//           <div className="mb-3">
//             <label className="form-label fw-bold">Write Your Article</label>
//             <div
//               className="bg-white shadow-sm rounded border"
//               style={{ minHeight: 400, padding: '1rem' }}
//             >
//               <EditorContent editor={editor} />
//             </div>
//           </div>

//           {/* Live Preview */}
//           <div className="mb-4">
//             <h5 className="mb-2">Preview</h5>
//             <div
//               className="p-3 bg-light rounded shadow-sm"
//               dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(editor?.getHTML() || '') }}
//             />
//           </div>

//           {/* Publish Button */}
//           <div className="text-center">
//             <MDBBtn color="primary" size="lg" onClick={handleSubmit} className="d-flex align-items-center mx-auto">
//               <MDBIcon fas icon="paper-plane" className="me-2" /> Publish
//             </MDBBtn>
//           </div>
          
//         </MDBCol>
//       </MDBRow>
//     </MDBContainer>
//   );
// }








// // src/pages/WriteArticle.jsx
// import React, { useState, useEffect } from 'react';
// import { useNavigate, useParams } from 'react-router-dom';
// import { useAuth } from '../../context/AuthContext';
// import { createArticle, updateArticle } from '../../configs/useArticles';
// import { ref as rtdbRef, get as rtdbGet } from 'firebase/database';
// import { rtdb, db as fsDb, storage } from '../../configs/firebase';
// import {
//   doc,
//   getDoc,
//   setDoc,
//   collection,
//   onSnapshot,
//   serverTimestamp,
//   increment,
// } from 'firebase/firestore';
// import { uploadBytes, uploadBytesResumable, getDownloadURL, ref as sRef } from 'firebase/storage';

// import '../../styles/write.css';
// import 'mdb-react-ui-kit/dist/css/mdb.min.css';
// import '@fortawesome/fontawesome-free/css/all.min.css';
// import { useEditor, EditorContent, BubbleMenu } from '@tiptap/react';
// import StarterKit from '@tiptap/starter-kit';
// import Underline from '@tiptap/extension-underline';
// import TextStyle from '@tiptap/extension-text-style';
// import Color from '@tiptap/extension-color';
// import Highlight from '@tiptap/extension-highlight';
// import LinkExt from '@tiptap/extension-link';
// import Image from '@tiptap/extension-image';
// import Youtube from '@tiptap/extension-youtube';
// import Emoji from '@tiptap/extension-emoji';
// import TextAlign from '@tiptap/extension-text-align';
// import Picker from '@emoji-mart/react';
// import emojiData from '@emoji-mart/data';
// import DOMPurify from 'dompurify';
// import {
//   MDBContainer,
//   MDBRow,
//   MDBCol,
//   MDBInput,
//   MDBBadge,
//   MDBBtn,
//   MDBIcon,
//   MDBCard,
//   MDBCardBody,
//   MDBCardImage,
//   MDBSpinner,
// } from 'mdb-react-ui-kit';

// export default function WriteArticle() {
//   const { currentUser } = useAuth();
//   const nav = useNavigate();
//   const { id } = useParams();
//   const isEdit = Boolean(id);
//   const [profile, setProfile] = useState(null);
//   const [suggestedTags, setSuggestedTags] = useState([]);
//   const [publishing, setPublishing] = useState(false);

//   useEffect(() => {
//     if (!currentUser) return;
//     getDoc(doc(fsDb, 'users', currentUser.uid))
//       .then(snap => snap.exists() && setProfile(snap.data()))
//       .catch(console.error);

//     const unsub = onSnapshot(collection(fsDb, 'tags'), snap => {
//       const tags = snap.docs.map(d => ({ name: d.id, count: d.data().count || 0 }));
//       tags.sort((a, b) => b.count - a.count);
//       setSuggestedTags(tags);
//     });
//     return () => unsub();
//   }, [currentUser]);

//   const [title, setTitle] = useState('');
//   const [tags, setTags] = useState([]);
//   const [draftTag, setDraftTag] = useState('');
//   const [pickerVisible, setPickerVisible] = useState(false);

//   const [coverFile, setCoverFile] = useState(null);   // File
//   const [coverURL , setCoverURL ] = useState(null);   // preview / download URL


//   const editor = useEditor({
//     extensions: [
//       StarterKit.configure({ heading: { levels: [1, 2, 3] } }),
//       Underline,
//       TextStyle,
//       Color,
//       Highlight,
//       LinkExt.configure({ openOnClick: false }),
//       Image.configure({ allowBase64: true, HTMLAttributes: { class: 'article-img' } }),
//       Youtube.configure({ inline: false, width: 640 }),
//       Emoji,
//       TextAlign.configure({ types: ['heading', 'paragraph'] }),
//     ],
//     content: '<p></p>',
//   });

//   useEffect(() => {
//     if (!isEdit) return;
//     rtdbGet(rtdbRef(rtdb, `articles/${id}`)).then(snap => {
//       if (!snap.exists()) { nav('/'); return; }
//       const art = snap.val();
//       setTitle(art.title || '');
//       setTags(art.tags || []);
//       setCoverURL(art.coverUrl || null);
//       setTimeout(() => editor?.commands.setContent(art.body || '<p></p>'), 0);
//     });
//   }, [id, isEdit, nav, editor]);

//   const addTag = tagName => {
//     const tag = tagName.trim().toLowerCase();
//     if (tag && !tags.includes(tag)) setTags(prev => [...prev, tag]);
//   };
//   const removeTag = tagToRemove => {
//     setTags(prev => prev.filter(t => t !== tagToRemove));
//   };

//   const handleDraftKeyDown = e => {
//     if (e.key === 'Enter' && draftTag.trim()) {
//       addTag(draftTag);
//       setDraftTag('');
//     }
//   };

//   const handleCoverSelect = e => {
//     const f = e.target.files?.[0];
//     if (!f) return;
//     setCoverFile(f);
//     const reader = new FileReader();
//     reader.onload = () => setCoverURL(reader.result);
//     reader.readAsDataURL(f);
//   };
//   const removeCoverImage = () => {
//     setCoverFile(null); setCoverURL(null);
//   };

//   const insertEmoji = emoji => {
//     editor.chain().focus().insertContent(emoji.native).run();
//     setPickerVisible(false);
//   };

//   const handleImgUpload = e => {
//     const file = e.target.files[0];
//     if (!file) return;
//     const reader = new FileReader();
//     reader.onload = () => editor.chain().focus().setImage({ src: reader.result }).run();
//     reader.readAsDataURL(file);
//   };
  

//    const handleReplaceSelectedImage = e => {
//     const file = e.target.files[0];
//     if (!file) return;
//     const reader = new FileReader();
//     reader.onload = () => {
//       if (editor.isActive('image')) {
//         editor.chain().focus()
//           .updateAttributes('image', { src: reader.result })
//           .run();
//       }
//     };
//     reader.readAsDataURL(file);
//      e.target.value = '';
//   };

//   const handleSubmit = async () => {
//      if (publishing) return;   
//     const body = editor.getHTML();
//     if (!title.trim() || !body.replace(/<[^>]*>?/gm, '').trim()) {
//       return alert('Title and body are required');
//     }
//     setPublishing(true); 
//     try{
//     let coverDownloadURL = coverURL; // may be null (no cover) OR existing
//     if (coverFile) {
//       const path   = `covers/${currentUser.uid}/${Date.now()}_${coverFile.name}`;
//       const ref    = sRef(storage, path);
//       await uploadBytes(ref, coverFile);
//       coverDownloadURL = await getDownloadURL(ref);
//     }

//     const ts = Date.now();
//     const payload = { title, body, tags, coverUrl: coverDownloadURL || '', authorId: currentUser.uid, createdAt: ts, updatedAt: ts };

//     let artId;
//     if (isEdit) {
//       await updateArticle(id, payload);
//       artId = id;
//     } else {
//       const res = await createArticle(payload);
//       artId = res.id;
//     }

//     // ensure tag docs exist and increment count
//     await Promise.all(
//       tags.map(async t => {
//         const refDoc = doc(fsDb, 'tags', t);
//         await setDoc(refDoc,
//           { count: increment(1), updatedAt: serverTimestamp() },
//           { merge: true }
//         );
//       })
//     );

//     nav(`/article/${artId}`);
//   }
//   catch (err) {
//       console.error(err);
//       alert('Something went wrong, please try again.');
//       setPublishing(false);                // allow retry
//     }
//   };

//   const authorName =
//     profile?.username || [profile?.firstName, profile?.lastName].filter(Boolean).join(' ') ||
//     currentUser?.email || 'Unknown';

//   return (
//     <MDBContainer className="py-5">
//       <MDBRow className="justify-content-center">
//         <MDBCol md="10" lg="8">
//           <div className="d-flex align-items-center gap-3 mb-4">
//             <MDBCardImage src={currentUser.photoURL} alt="Avatar" className="rounded-circle" style={{ width: 50, height: 50, objectFit: 'cover' }} />
//             <h5 className="mb-0">{authorName}</h5>
//           </div>

//           {/* cover image box */}
//           {/* <div className="mb-4 text-center">
//             <h5 className="mb-2">Cover Image</h5>
//             {coverURL && (
//               <img src={coverURL} alt="cover preview"
//                 style={{maxWidth:'100%',maxHeight:400,borderRadius:8,objectFit:'contain'

//                 }}
//                 />

//             )}
//             <div className="mt-2">
//               <MDBBtn outline size="sm"
//                 onClick={()=>document.getElementById('cover-input').click()}>
//                 <MDBIcon fas icon="image" className="me-1"/> Select Cover
//               </MDBBtn>
//               <input id="cover-input" hidden type="file" accept="image/*"
//                      onChange={handleCoverSelect}/>
//             </div>
//           </div> */}
//           <div className="mb-4 text-center">
//             <h5 className="mb-2">Cover Image</h5>
//             {coverURL && (
//               <div style={{ position: 'relative', display: 'inline-block' }}>
//                 <img
//                   src={coverURL}
//                   alt="cover preview"
//                   style={{
//                     maxWidth: '100%', maxHeight: 400,
//                     borderRadius: 8, objectFit: 'contain',
//                   }}
//                 />
//                 {/* edit */}
//                 <MDBBtn
//                   type="button"
//                   size="sm"
//                   floating color="light"
//                   style={{ position: 'absolute', top: 8, right: 50 }}
//                   onClick={() => document.getElementById('cover-input').click()}
//                   title="Change cover"
//                 >
//                   <MDBIcon fas icon="pencil-alt" />
//                 </MDBBtn>
//                 {/* delete */}
//                 <MDBBtn
//                   type="button"
//                   size="sm"
//                   floating color="light"
//                   style={{ position: 'absolute', top: 8, right: 8 }}
//                   onClick={removeCoverImage}
//                   title="Remove cover"
//                 >
//                   <MDBIcon fas icon="times" />
//                 </MDBBtn>
//               </div>
//             )}
//             <div className="mt-2">
//               <MDBBtn
//                 outline size="sm"
//                 onClick={() => document.getElementById('cover-input').click()}
//               >
//                 <MDBIcon fas icon="image" className="me-1" /> Select Cover
//               </MDBBtn>
//               <input
//                 id="cover-input" hidden type="file" accept="image/*"
//                 onChange={handleCoverSelect}
//               />
//             </div>
//           </div>

//           {/* title */}
//           <div className="mb-4 text-center">
//             <small className="text-muted">{new Date().toLocaleDateString()}</small>
//              <h3>TITLE</h3>
//             <MDBInput placeholder="TITLE" value={title} onChange={e => setTitle(e.target.value)} size="lg" className="mt-2" />
//           </div>

//           {/* Tag Input & Suggestions */}
//           <div className="mb-4">
//              <h3>Add Tags</h3>
//             <div className="mb-2">
//               {suggestedTags.map(({ name, count }) => (
//                 <MDBBadge
//                   key={name}
//                   pill
//                   outline
//                   className="me-1 mb-1"
//                   style={{ cursor: 'pointer' }}
//                   onClick={() => addTag(name)}
//                 >
//                   #{name} ({count})
//                 </MDBBadge>
//               ))}
//             </div>
           
//             <div className="d-flex flex-wrap gap-2 mb-2">
//               {tags.map(t => (
//                 <MDBBadge key={t} pill color="info" className="px-2 py-1 d-flex align-items-center">
//                   #{t}
//                   <MDBIcon fas icon="times-circle" className="ms-1" style={{ cursor: 'pointer' }} onClick={() => removeTag(t)} />
//                 </MDBBadge>
//               ))}
//             </div>
            
//             <MDBInput
//               placeholder="+ Tag and press Enter"
//               value={draftTag}
//               onChange={e => setDraftTag(e.target.value)}
//               onKeyDown={handleDraftKeyDown}
//               size="sm"
//               style={{ width: '150px' }}
//             />
//           </div>

//           {/* Editor Toolbar */}
//           <MDBCard className="mb-3 shadow-sm">
//             <MDBCardBody className="d-flex flex-wrap gap-2 bg-white">
//               {[
//                 { cmd: 'toggleBold', icon: 'bold' },
//                 { cmd: 'toggleItalic', icon: 'italic' },
//                 { cmd: 'toggleUnderline', icon: 'underline' },
//                 { cmd: 'toggleStrike', icon: 'strikethrough' },
//                 { cmd: 'toggleHighlight', icon: 'paint-brush' },
//               ].map(({ cmd, icon }) => (
//                 <MDBBtn
//                   type="button"
//                   key={cmd}
//                   size="sm"
//                   outline
//                   color={editor?.isActive(cmd.replace('toggle', '').toLowerCase()) ? 'primary' : 'secondary'}
//                   onClick={() => editor.chain().focus()[cmd]().run()}
//                 >
//                   <MDBIcon fas icon={icon} />
//                 </MDBBtn>
//               ))}
//               <div className="input-group input-group-sm me-2" style={{ width: 40 }}>
//                 <input type="color" className="form-control form-control-color p-0" title="Text Color" onChange={e => editor.chain().focus().setColor(e.target.value).run()} />
//               </div>
//               {['left', 'center', 'right'].map(align => (
//                 <MDBBtn  type="button" key={align} size="sm" outline color="secondary" onClick={() => editor.chain().focus().setTextAlign(align).run()}>
//                   <MDBIcon fas icon={`align-${align}`} />
//                 </MDBBtn>
//               ))}
//               <MDBBtn  type="button" size="sm" outline color="secondary" onClick={() => {
//                 const url = prompt('Enter URL');
//                 if (url) editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
//               }}>
//                 <MDBIcon fas icon="link" />
//               </MDBBtn>
//               <MDBBtn  type="button" size="sm" outline color="secondary" onClick={() => setPickerVisible(v => !v)}><MDBIcon fas icon="smile" /></MDBBtn>
//               {pickerVisible && <Picker data={emojiData} onEmojiSelect={insertEmoji} theme="light" style={{ position: 'absolute', bottom: 100, left: 50, zIndex: 1000 }} />}
//               <MDBBtn  type="button" size="sm" outline color="secondary" onClick={() => document.getElementById('img-upload').click()}><MDBIcon fas icon="image" /><input id="img-upload" type="file" accept="image/*" hidden onChange={handleImgUpload} /></MDBBtn>
//               <MDBBtn  type="button" size="sm" outline color="secondary" onClick={() => editor.chain().focus().undo().run()}><MDBIcon fas icon="undo" /></MDBBtn>
//               <MDBBtn  type="button" size="sm" outline color="secondary" onClick={() => editor.chain().focus().redo().run()}><MDBIcon fas icon="redo" /></MDBBtn>
//             </MDBCardBody>
//           </MDBCard>

//           {/* Editor Canvas */}
//           <div className="mb-3">
//             <label className="form-label fw-bold">Write Your Article</label>
//             <div className="bg-white shadow-sm rounded border" 
//                style={{
//                    minHeight: '300px',      // ensure it’s tall like an input box
//                    boxSizing:  'border-box',
//                    border: '0px solid #eaeaea' 
//                  }}
//                >   
//               <EditorContent editor={editor} 
//               style={{flex: 1, overflowY:  'auto', outline: 'none', padding: '0.5rem'  }}
//                onFocus={() => document.querySelector('.ProseMirror').style.outline = 'none'}
//               />
//             </div>
//              {editor && (
//               <BubbleMenu
//                 editor={editor}
//                 shouldShow={({ editor }) => editor.isActive('image')}
//                 tippyOptions={{ duration: 0 }}
//               >
//                 <div className="d-flex gap-1">
//                   <MDBBtn
//                     type="button"
//                     size="sm" color="light" floating
//                     onClick={() => document.getElementById('img-edit-upload').click()}
//                     title="Replace image"
//                   >
//                     <MDBIcon fas icon="pencil-alt" />
//                   </MDBBtn>
//                   <MDBBtn  type="button"
//                     size="sm" color="light" floating
//                     onClick={() => editor.chain().focus().deleteSelection().run()}
//                     title="Delete image"
//                   >
//                     <MDBIcon fas icon="trash" />
//                   </MDBBtn>
//                 </div>
//               </BubbleMenu>
//             )}
//             <input
//               id="img-edit-upload" hidden type="file" accept="image/*"
//               onChange={handleReplaceSelectedImage}
//             />
//           </div>

//           {/* Preview */}
//           <div className="mb-4">
//             <h5 className="mb-2">Preview</h5>
//             <div className="p-3 bg-light rounded shadow-sm" dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(editor?.getHTML() || '') }} />
//           </div>

//           {/* Publish */}
//           <div className="text-center">
//             <MDBBtn color="primary" 
//             size="lg"
//             disabled={publishing}
//             onClick={handleSubmit} 
//             className="d-flex align-items-center mx-auto"
//             >

//            {publishing && (
//             <>
//               <MDBSpinner size="sm" tag="span" className="me-2" role="status" />
//               Publishing…
//             </>
//           )}
//           {!publishing && (
//             <>
//               <MDBIcon fas icon="paper-plane" className="me-2" />
//               {isEdit ? 'Update' : 'Publish'}
//             </>
//           )}            
//           </MDBBtn>
//           </div>
//         </MDBCol>
//       </MDBRow>
//     </MDBContainer>
//   );
// }



// // src/pages/WriteArticle.jsx
// import React, { useState, useEffect } from 'react';
// import { useNavigate, useParams, Link } from 'react-router-dom';
// import { useAuth } from '../../context/AuthContext';
// import { createArticle, updateArticle } from '../../configs/useArticles';
// import { ref as rtdbRef, get as rtdbGet, remove as rtdbRemove } from 'firebase/database';
// import { rtdb, db as fsDb, storage } from '../../configs/firebase';
// import {
//   doc,
//   getDoc,
//   setDoc,
//   collection,
//   onSnapshot,
//   serverTimestamp,
//   increment,
// } from 'firebase/firestore';
// import { uploadBytes, getDownloadURL, ref as sRef } from 'firebase/storage';

// import '../../styles/writearticlepage.css';
// import 'mdb-react-ui-kit/dist/css/mdb.min.css';
// import '@fortawesome/fontawesome-free/css/all.min.css';

// import { useEditor, EditorContent, BubbleMenu } from '@tiptap/react';
// import StarterKit from '@tiptap/starter-kit';
// import Underline from '@tiptap/extension-underline';
// import TextStyle from '@tiptap/extension-text-style';
// import Color from '@tiptap/extension-color';
// import Highlight from '@tiptap/extension-highlight';
// import LinkExt from '@tiptap/extension-link';
// import Image from '@tiptap/extension-image';
// import Youtube from '@tiptap/extension-youtube';
// import Emoji from '@tiptap/extension-emoji';
// import TextAlign from '@tiptap/extension-text-align';

// import Picker from '@emoji-mart/react';
// import emojiData from '@emoji-mart/data';
// import DOMPurify from 'dompurify';

// import {
//   MDBContainer,
//   MDBRow,
//   MDBCol,
//   MDBInput,
//   MDBBadge,
//   MDBBtn,
//   MDBIcon,
//   MDBCard,
//   MDBCardBody,
//   MDBCardImage,
//   MDBSpinner,
// } from 'mdb-react-ui-kit';

// export default function WriteArticle() {
//   const { currentUser } = useAuth();
//   const nav = useNavigate();
//   const { id } = useParams();
//   const isEdit = Boolean(id);

//   const [profile, setProfile] = useState(null);
//   const [suggestedTags, setSuggestedTags] = useState([]);
//   const [publishing, setPublishing] = useState(false);

//   useEffect(() => {
//     if (!currentUser) return;
//     getDoc(doc(fsDb, 'users', currentUser.uid))
//       .then(snap => snap.exists() && setProfile(snap.data()))
//       .catch(console.error);

//     const unsub = onSnapshot(collection(fsDb, 'tags'), snap => {
//       const tags = snap.docs.map(d => ({ name: d.id, count: d.data().count || 0 }));
//       tags.sort((a, b) => b.count - a.count);
//       setSuggestedTags(tags);
//     });
//     return () => unsub();
//   }, [currentUser]);

//   const [title, setTitle] = useState('');
//   const [tags, setTags] = useState([]);
//   const [draftTag, setDraftTag] = useState('');
//   const [pickerVisible, setPickerVisible] = useState(false);

//   const [coverFile, setCoverFile] = useState(null);   // File
//   const [coverURL , setCoverURL ] = useState(null);   // preview / download URL

//   const editor = useEditor({
//     extensions: [
//       StarterKit.configure({ heading: { levels: [1, 2, 3] } }),
//       Underline,
//       TextStyle,
//       Color,
//       Highlight,
//       LinkExt.configure({ openOnClick: false }),
//       Image.configure({ allowBase64: true, HTMLAttributes: { class: 'article-img' } }),
//       Youtube.configure({ inline: false, width: 640 }),
//       Emoji,
//       TextAlign.configure({ types: ['heading', 'paragraph'] }),
//     ],
//     content: '<p></p>',
//   });

//   useEffect(() => {
//     if (!isEdit) return;
//     rtdbGet(rtdbRef(rtdb, `articles/${id}`)).then(snap => {
//       if (!snap.exists()) { nav('/'); return; }
//       const art = snap.val();
//       setTitle(art.title || '');
//       setTags(art.tags || []);
//       setCoverURL(art.coverUrl || null);
//       setTimeout(() => editor?.commands.setContent(art.body || '<p></p>'), 0);
//     });
//   }, [id, isEdit, nav, editor]);

//   const addTag = tagName => {
//     const tag = tagName.trim().toLowerCase();
//     if (tag && !tags.includes(tag)) setTags(prev => [...prev, tag]);
//   };
//   const removeTag = tagToRemove => {
//     setTags(prev => prev.filter(t => t !== tagToRemove));
//   };
//   const handleDraftKeyDown = e => {
//     if (e.key === 'Enter' && draftTag.trim()) {
//       addTag(draftTag);
//       setDraftTag('');
//     }
//   };

//   const handleCoverSelect = e => {
//     const f = e.target.files?.[0];
//     if (!f) return;
//     setCoverFile(f);
//     const reader = new FileReader();
//     reader.onload = () => setCoverURL(reader.result);
//     reader.readAsDataURL(f);
//   };
//   const removeCoverImage = () => {
//     setCoverFile(null); setCoverURL(null);
//   };

//   const insertEmoji = emoji => {
//     editor.chain().focus().insertContent(emoji.native).run();
//     setPickerVisible(false);
//   };

//   const handleImgUpload = e => {
//     const file = e.target.files[0];
//     if (!file) return;
//     const reader = new FileReader();
//     reader.onload = () => editor.chain().focus().setImage({ src: reader.result }).run();
//     reader.readAsDataURL(file);
//   };
//   const handleReplaceSelectedImage = e => {
//     const file = e.target.files[0];
//     if (!file) return;
//     const reader = new FileReader();
//     reader.onload = () => {
//       if (editor.isActive('image')) {
//         editor.chain().focus().updateAttributes('image', { src: reader.result }).run();
//       }
//     };
//     reader.readAsDataURL(file);
//     e.target.value = '';
//   };

//   const handleSubmit = async () => {
//     if (publishing) return;
//     const body = editor.getHTML();
//     if (!title.trim() || !body.replace(/<[^>]*>?/gm, '').trim()) {
//       return alert('Title and body are required');
//     }
//     setPublishing(true);
//     try{
//       let coverDownloadURL = coverURL;
//       if (coverFile) {
//         const path   = `covers/${currentUser.uid}/${Date.now()}_${coverFile.name}`;
//         const ref    = sRef(storage, path);
//         await uploadBytes(ref, coverFile);
//         coverDownloadURL = await getDownloadURL(ref);
//       }

//       const ts = Date.now();
//       const payload = {
//         title, body, tags,
//         coverUrl: coverDownloadURL || '',
//         authorId: currentUser.uid,
//         createdAt: ts, updatedAt: ts
//       };

//       let artId;
//       if (isEdit) {
//         await updateArticle(id, payload);
//         artId = id;
//       } else {
//         const res = await createArticle(payload);
//         artId = res.id;
//       }

//       // increment tag counts (unchanged)
//       await Promise.all(
//         tags.map(async t => {
//           const refDoc = doc(fsDb, 'tags', t);
//           await setDoc(refDoc, { count: increment(1), updatedAt: serverTimestamp() }, { merge: true });
//         })
//       );

//       nav(`/article/${artId}`);
//     } catch (err) {
//       console.error(err);
//       alert('Something went wrong, please try again.');
//       setPublishing(false);
//     }
//   };

//   /* ---------- Save Draft (Firestore "drafts" collection, centered UX) ---------- */
//   const handleSaveDraft = async () => {
//     try {
//       const body = editor.getHTML();
//       const draftId = isEdit ? id : `draft-${Date.now()}`;
//       const payload = {
//         userId: currentUser.uid,
//         title: title || '(untitled)',
//         body, tags,
//         coverUrl: coverURL || '',
//         status: 'draft',
//         updatedAt: serverTimestamp()
//       };
//       await setDoc(doc(fsDb, 'drafts', `${currentUser.uid}-${draftId}`), payload, { merge: true });
//       alert('Draft saved.');
//     } catch (err) {
//       console.error(err);
//       alert('Could not save draft. Please try again.');
//     }
//   };

//   /* ---------- Delete Article (only when editing) ---------- */
//   const handleDelete = async () => {
//     if (!isEdit) return;
//     const ok = window.confirm('Delete this article permanently?');
//     if (!ok) return;
//     try {
//       await rtdbRemove(rtdbRef(rtdb, `articles/${id}`));
//       alert('Article deleted.');
//       nav('/');
//     } catch (err) {
//       console.error(err);
//       alert('Failed to delete. Try again.');
//     }
//   };

//   const authorName =
//     profile?.username || [profile?.firstName, profile?.lastName].filter(Boolean).join(' ') ||
//     currentUser?.email || 'Unknown';

//   return (
//     <MDBContainer className="write-wrap py-4">
//       {/* top slim bar: back + delete */}
//       <div className="write-topbar bounded mb-4">
//         <Link to="/" className="topbar-link">
//           <MDBIcon fas icon="arrow-left" className="me-2" /> back to home
//         </Link>
//         {isEdit && (
//           <button type="button" className="topbar-delete-btn" onClick={handleDelete}>
//             <MDBIcon fas icon="trash-alt" className="me-2" /> delete article
//           </button>
//         )}
//       </div>

//       <div className="bounded">
//         <MDBRow className="justify-content-center">
//           <MDBCol md="10" lg="9">
//             {/* author identity */}
//             <div className="d-flex align-items-center gap-3 mb-4 justify-content-center">
//               {/* <MDBCardImage
//                 src={currentUser.photoURL}
//                 alt="Avatar"
//                 className="rounded-circle object-fit-cover"
//                 style={{ width: 44, height: 44 }}
//               /> */}
//               {/* <div className="text-center"> */}
//                 {/* <div className="author-name">{authorName}</div> */}
//                 {/* <div className="author-sub">Writer</div> */}
//               {/* </div> */}
//             </div>

//             {/* header meta: cover + divider + date/title/tags */}
//             <div className="write-meta grid mt-2">
//               {/* cover circle */}
//               <div className="cover-col">
//                 <button
//                   type="button"
//                   className="cover-circle"
//                   onClick={() => document.getElementById('cover-input').click()}
//                   title="Select cover"
//                 >
//                   {coverURL ? (
//                     <img src={coverURL} alt="cover" />
//                   ) : (
//                     <div className="cover-empty">
//                       <MDBIcon far icon="image" />
//                       <span>Cover Image</span>
//                     </div>
//                   )}
//                   {coverURL && (
//                     <span
//                       className="cover-remove"
//                       title="Remove"
//                       onClick={(e) => { e.stopPropagation(); removeCoverImage(); }}
//                     >
//                       <MDBIcon fas icon="times" />
//                     </span>
//                   )}
//                 </button>
//                 <input id="cover-input" hidden type="file" accept="image/*" onChange={handleCoverSelect} />
//               </div>

//               {/* thin divider */}
//               <div className="meta-divider" aria-hidden />

//               {/* right meta: date + title + tags */}
//               <div className="title-col">
//                 <div className="write-date text-center">{new Date().toLocaleDateString()}</div>

//                 <input
//                   className="title-input text-center"
//                   placeholder="TITLE"
//                   value={title}
//                   onChange={e => setTitle(e.target.value)}
//                 />

//                 {/* <div className="tags-row justify-center"> */}
//                   {/* {tags.map(t => (
//                     <span key={t} className="chip chip-filled">
//                       #{t}
//                       <button
//                         type="button"
//                         className="chip-x"
//                         onClick={() => removeTag(t)}
//                         title="Remove"
//                       >
//                         <MDBIcon fas icon="times" />
//                       </button>
//                     </span>
//                   ))} */}

//                   {/* inline adder */}
//                   {/* <div className="chip add-chip">
//                     <span>#</span>
//                     <input
//                       className="chip-input"
//                       placeholder="Tag"
//                       value={draftTag}
//                       onChange={e => setDraftTag(e.target.value)}
//                       onKeyDown={handleDraftKeyDown}
//                     />
//                   </div> */}
//                 {/* </div> */}

//                 {suggestedTags.length > 0 && (
//                   <div className="tag-suggest justify-center">
//                     {suggestedTags.slice(0, 8).map(({ name }) => (
//                       <button
//                         type="button"
//                         key={name}
//                         className="chip chip-outline"
//                         onClick={() => addTag(name)}
//                         title={`Add #${name}`}
//                       >
//                         #{name}
//                       </button>
//                     ))}
//                   </div>
//                 )}
//               </div>
//             </div>

//             {/* editor area – transparent canvas; toolbar BELOW */}
//             <div className="editor-shell mt-5">
//               <div className="editor-canvas transparent">
//                 <EditorContent editor={editor} />
//               </div>

//               {pickerVisible && (
//                 <div className="emoji-pop below">
//                   <Picker data={emojiData} onEmojiSelect={insertEmoji} theme="light" />
//                 </div>
//               )}

//               {/* toolbar BELOW the editor */}
//               <div className="editor-toolbar bottom shadow-soft">
//                 {[
//                   { cmd: 'toggleBold', icon: 'bold' },
//                   { cmd: 'toggleItalic', icon: 'italic' },
//                   { cmd: 'toggleUnderline', icon: 'underline' },
//                   { cmd: 'toggleStrike', icon: 'strikethrough' },
//                   { cmd: 'toggleHighlight', icon: 'paint-brush' },
//                 ].map(({ cmd, icon }) => (
//                   <button
//                     type="button"
//                     key={cmd}
//                     className="tb-btn"
//                     onClick={() => editor?.chain().focus()[cmd]().run()}
//                     title={cmd.replace('toggle', '')}
//                   >
//                     <MDBIcon fas icon={icon} />
//                   </button>
//                 ))}

//                 <label className="tb-color" title="Text Color">
//                   <input
//                     type="color"
//                     onChange={e => editor?.chain().focus().setColor(e.target.value).run()}
//                   />
//                 </label>

//                 {['left', 'center', 'right'].map(align => (
//                   <button
//                     type="button"
//                     key={align}
//                     className="tb-btn"
//                     onClick={() => editor?.chain().focus().setTextAlign(align).run()}
//                     title={`Align ${align}`}
//                   >
//                     <MDBIcon fas icon={`align-${align}`} />
//                   </button>
//                 ))}

//                 <button
//                   type="button"
//                   className="tb-btn"
//                   onClick={() => {
//                     const url = prompt('Enter URL');
//                     if (url) editor?.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
//                   }}
//                   title="Link"
//                 >
//                   <MDBIcon fas icon="link" />
//                 </button>

//                 <button type="button" className="tb-btn" onClick={() => setPickerVisible(v => !v)} title="Emoji">
//                   <MDBIcon fas icon="smile" />
//                 </button>

//                 <button
//                   type="button"
//                   className="tb-btn"
//                   onClick={() => document.getElementById('img-upload').click()}
//                   title="Image"
//                 >
//                   <MDBIcon fas icon="image" />
//                   <input id="img-upload" type="file" accept="image/*" hidden onChange={handleImgUpload} />
//                 </button>

//                 <button type="button" className="tb-btn" onClick={() => editor?.chain().focus().undo().run()} title="Undo">
//                   <MDBIcon fas icon="undo" />
//                 </button>
//                 <button type="button" className="tb-btn" onClick={() => editor?.chain().focus().redo().run()} title="Redo">
//                   <MDBIcon fas icon="redo" />
//                 </button>
//               </div>

//               {/* image bubble tools (unchanged) */}
//               {editor && (
//                 <BubbleMenu
//                   editor={editor}
//                   shouldShow={({ editor }) => editor.isActive('image')}
//                   tippyOptions={{ duration: 0 }}
//                 >
//                   <div className="d-flex gap-1">
//                     <MDBBtn
//                       type="button"
//                       size="sm" color="light" floating
//                       onClick={() => document.getElementById('img-edit-upload').click()}
//                       title="Replace image"
//                     >
//                       <MDBIcon fas icon="pencil-alt" />
//                     </MDBBtn>
//                     <MDBBtn
//                       type="button"
//                       size="sm" color="light" floating
//                       onClick={() => editor.chain().focus().deleteSelection().run()}
//                       title="Delete image"
//                     >
//                       <MDBIcon fas icon="trash" />
//                     </MDBBtn>
//                   </div>
//                 </BubbleMenu>
//               )}
//               <input id="img-edit-upload" hidden type="file" accept="image/*" onChange={handleReplaceSelectedImage} />
//             </div>

//             {/* actions row */}
//             <div className="write-actions text-center mt-5">
//               <button type="button" className="btn-outline-gold pill-btn me-2">Preview</button>

//               <button
//                 type="button"
//                 className="btn-outline-gold-solid pill-btn"
//                 disabled={publishing}
//                 onClick={handleSubmit}
//               >
//                 {publishing ? (
//                   <>
//                     <MDBSpinner size="sm" tag="span" className="me-2" role="status" />
//                     Publishing…
//                   </>
//                 ) : (
//                   'PUBLISH'
//                 )}
//               </button>

//               <div className="mt-3">
//                 <button type="button" className="save-draft-link" onClick={handleSaveDraft}>
//                   Save as Draft
//                 </button>
//               </div>
//             </div>

//             {/* optional live HTML preview (kept) */}
//             {/* <div className="mt-5 bounded--tight">
//               <h6 className="text-muted mb-2 text-center">Preview</h6>
//               <div
//                 className="preview-box transparent"
//                 dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(editor?.getHTML() || '') }}
//               />
//             </div> */}
//           </MDBCol>
//         </MDBRow>
//       </div>
//     </MDBContainer>
//   );
// }

// import React, { useState, useEffect, useMemo } from 'react';
// import { useNavigate, useParams, Link } from 'react-router-dom';
// import { useAuth } from '../../context/AuthContext';
// import { createArticle, updateArticle } from '../../configs/useArticles';
// import { ref as rtdbRef, get as rtdbGet, remove as rtdbRemove } from 'firebase/database';
// import { rtdb, db as fsDb, storage } from '../../configs/firebase';
// import {
//   doc, getDoc, setDoc, collection, onSnapshot,
//   serverTimestamp, increment,
// } from 'firebase/firestore';
// import { uploadBytes, getDownloadURL, ref as sRef } from 'firebase/storage';

// import '../../styles/writearticlepage.css';
// import 'mdb-react-ui-kit/dist/css/mdb.min.css';
// import '@fortawesome/fontawesome-free/css/all.min.css';

// import { useEditor, EditorContent, BubbleMenu } from '@tiptap/react';
// import StarterKit from '@tiptap/starter-kit';
// import Underline from '@tiptap/extension-underline';
// import TextStyle from '@tiptap/extension-text-style';
// import Color from '@tiptap/extension-color';
// import Highlight from '@tiptap/extension-highlight';
// import LinkExt from '@tiptap/extension-link';
// import Image from '@tiptap/extension-image';
// import Youtube from '@tiptap/extension-youtube';
// import Emoji from '@tiptap/extension-emoji';
// import TextAlign from '@tiptap/extension-text-align';

// import Picker from '@emoji-mart/react';
// import emojiData from '@emoji-mart/data';
// import { MDBContainer, MDBRow, MDBCol, MDBBtn, MDBIcon, MDBSpinner } from 'mdb-react-ui-kit';

// function ToolbarButton({ title, icon, onClick, active }) {
//   return (
//     <button
//       type="button"
//       className={`tb-btn${active ? ' is-active' : ''}`}
//       title={title}
//       onClick={onClick}
//     >
//       <i className={`fas fa-${icon}`} />
//     </button>
//   );
// }

// export default function WriteArticle() {
//   const { currentUser } = useAuth();
//   const nav = useNavigate();
//   const { id } = useParams();
//   const isEdit = Boolean(id);

//   const [profile, setProfile] = useState(null);
//   const [suggestedTags, setSuggestedTags] = useState([]);
//   const [publishing, setPublishing] = useState(false);

//   useEffect(() => {
//     if (!currentUser) return;
//     getDoc(doc(fsDb, 'users', currentUser.uid))
//       .then(snap => snap.exists() && setProfile(snap.data()))
//       .catch(() => {});
//     const unsub = onSnapshot(collection(fsDb, 'tags'), snap => {
//       const tags = snap.docs.map(d => ({ name: d.id, count: d.data().count || 0 }));
//       tags.sort((a, b) => b.count - a.count);
//       setSuggestedTags(tags);
//     });
//     return () => unsub();
//   }, [currentUser]);

//   const [title, setTitle] = useState('');
//   const [tags, setTags] = useState([]);
//   const [draftTag, setDraftTag] = useState('');
//   const [pickerVisible, setPickerVisible] = useState(false);
//   const [coverFile, setCoverFile] = useState(null);
//   const [coverURL, setCoverURL] = useState(null);
//   const [isEmpty, setIsEmpty] = useState(true);

//   const editor = useEditor({
//     extensions: [
//       StarterKit.configure({ heading: { levels: [1, 2, 3] } }),
//       Underline,
//       TextStyle,
//       Color,
//       Highlight,
//       LinkExt.configure({ openOnClick: false, HTMLAttributes: { rel: 'noopener nofollow' } }),
//       Image.configure({ allowBase64: true, HTMLAttributes: { class: 'article-img' } }),
//       Youtube.configure({ inline: false, width: 640 }),
//       Emoji,
//       TextAlign.configure({ types: ['heading', 'paragraph'] }),
//     ],
//     content: '<p></p>',
//     onUpdate({ editor }) {
//       const txt = editor.state.doc.textContent.trim();
//       setIsEmpty(txt.length === 0);
//     },
//   });

//   useEffect(() => {
//     if (!isEdit) return;
//     rtdbGet(rtdbRef(rtdb, `articles/${id}`)).then(snap => {
//       if (!snap.exists()) { nav('/'); return; }
//       const art = snap.val();
//       setTitle(art.title || '');
//       setTags(art.tags || []);
//       setCoverURL(art.coverUrl || null);
//       setTimeout(() => {
//         editor?.commands.setContent(art.body || '<p></p>');
//         const txt = (art.body || '').replace(/<[^>]*>?/g, '').trim();
//         setIsEmpty(txt.length === 0);
//       }, 0);
//     });
//   }, [id, isEdit, nav, editor]);

//   const addTag = (name) => {
//     const tag = name.trim().toLowerCase();
//     if (!tag || tags.includes(tag)) return;
//     setTags(prev => [...prev, tag]);
//   };
//   const removeTag = (name) => setTags(prev => prev.filter(t => t !== name));

//   const handleDraftKeyDown = (e) => {
//     if (e.key === 'Enter' && draftTag.trim()) {
//       addTag(draftTag);
//       setDraftTag('');
//     }
//   };

//   const handleCoverSelect = (e) => {
//     const f = e.target.files?.[0];
//     if (!f) return;
//     setCoverFile(f);
//     const reader = new FileReader();
//     reader.onload = () => setCoverURL(reader.result);
//     reader.readAsDataURL(f);
//   };
//   const removeCoverImage = () => { setCoverFile(null); setCoverURL(null); };

  // const insertEmoji = (emoji) => {
  //   editor.chain().focus().insertContent(emoji.native).run();
  //   setPickerVisible(false);
  // };

//   const handleImgUpload = (e) => {
//     const file = e.target.files?.[0];
//     if (!file) return;
//     const reader = new FileReader();
//     reader.onload = () => editor.chain().focus().setImage({ src: reader.result }).run();
//     reader.readAsDataURL(file);
//   };
//   const handleReplaceSelectedImage = (e) => {
//     const file = e.target.files?.[0];
//     if (!file) return;
//     const reader = new FileReader();
//     reader.onload = () => {
//       if (editor.isActive('image')) {
//         editor.chain().focus().updateAttributes('image', { src: reader.result }).run();
//       }
//     };
//     reader.readAsDataURL(file);
//     e.target.value = '';
//   };

//   const handleSubmit = async () => {
//     if (publishing) return;
//     const body = editor.getHTML();
//     const bodyText = body.replace(/<[^>]*>?/gm, '').trim();
//     if (!title.trim() || !bodyText) {
//       alert('Title and body are required');
//       return;
//     }
//     setPublishing(true);
//     try {
//       let coverDownloadURL = coverURL;
//       if (coverFile) {
//         const path = `covers/${currentUser.uid}/${Date.now()}_${coverFile.name}`;
//         const ref = sRef(storage, path);
//         await uploadBytes(ref, coverFile);
//         coverDownloadURL = await getDownloadURL(ref);
//       }
//       const ts = Date.now();
//       const payload = {
//         title, body, tags,
//         coverUrl: coverDownloadURL || '',
//         authorId: currentUser.uid,
//         createdAt: ts, updatedAt: ts,
//       };
//       let artId;
//       if (isEdit) {
//         await updateArticle(id, payload);
//         artId = id;
//       } else {
//         const res = await createArticle(payload);
//         artId = res.id;
//       }
//       await Promise.all(
//         tags.map(async t => {
//           const refDoc = doc(fsDb, 'tags', t);
//           await setDoc(refDoc, { count: increment(1), updatedAt: serverTimestamp() }, { merge: true });
//         })
//       );
//       nav(`/article/${artId}`);
//     } catch {
//       alert('Something went wrong, please try again.');
//       setPublishing(false);
//     }
//   };

//   const handleSaveDraft = async () => {
//     if (!currentUser) { alert('Please sign in first.'); return; }
//     try {
//       const body = editor.getHTML();
//       const draftId = isEdit ? id : String(Date.now());
//       const payload = {
//         userId: currentUser.uid,
//         title: title || '(untitled)',
//         body, tags,
//         coverUrl: coverURL || '',
//         status: 'draft',
//         updatedAt: serverTimestamp(),
//       };
//       // save to per-user subcollection: users/{uid}/drafts/{draftId}
//       await setDoc(doc(fsDb, 'users', currentUser.uid, 'drafts', draftId), payload, { merge: true });
//       alert('Draft saved.');
//     } catch (e) {
//       console.error('Draft save error:', e);
//       alert('Could not save draft. Please try again.');
//     }
//   };

//   const handleDelete = async () => {
//     if (!isEdit) return;
//     const ok = window.confirm('Delete this article permanently?');
//     if (!ok) return;
//     try {
//       await rtdbRemove(rtdbRef(rtdb, `articles/${id}`));
//       alert('Article deleted.');
//       nav('/');
//     } catch {
//       alert('Failed to delete. Try again.');
//     }
//   };

//   const dateString = useMemo(() => {
//     const now = new Date();
//     const opts = { year: 'numeric', month: 'long', day: 'numeric' };
//     return now.toLocaleDateString(undefined, opts);
//   }, []);

//   return (
//     <MDBContainer className="write-wrap py-4">
//       <div className="write-topbar bounded mb-4">
//         <Link to="/" className="topbar-link">
//           <MDBIcon fas icon="arrow-left" className="me-2" /> back to home
//         </Link>
//         {isEdit && (
//           <button type="button" className="topbar-delete-btn" onClick={handleDelete}>
//             <MDBIcon fas icon="trash-alt" className="me-2" /> delete article
//           </button>
//         )}
//       </div>

//       <div className="bounded">
//         <MDBRow className="justify-content-center">
//           <MDBCol md="10" lg="9">
//             <div className="write-meta grid mt-2">
//               <div className="cover-col">
//                 <button
//                   type="button"
//                   className="cover-circle"
//                   onClick={() => document.getElementById('cover-input').click()}
//                   title="Select cover"
//                 >
//                   {coverURL ? (
//                     <img src={coverURL} alt="cover" />
//                   ) : (
//                     <div className="cover-empty">
//                       <i className="far fa-image" />
//                       <span>Cover Image</span>
//                     </div>
//                   )}
//                   {coverURL && (
//                     <span
//                       className="cover-remove"
//                       title="Remove"
//                       onClick={(e) => { e.stopPropagation(); removeCoverImage(); }}
//                     >
//                       <i className="fas fa-times" />
//                     </span>
//                   )}
//                 </button>
//                 <input id="cover-input" hidden type="file" accept="image/*" onChange={handleCoverSelect} />
//               </div>

//               <div className="meta-divider" aria-hidden />

//               <div className="title-col">
//                 <div className="write-date">{dateString}</div>
//                 <input
//                   className="title-input"
//                   placeholder="TITLE"
//                   value={title}
//                   onChange={e => setTitle(e.target.value)}
//                 />

//                 <div className="tag-suggest">
//                   {suggestedTags.slice(0, 8).map(({ name }) => (
//                     <button
//                       type="button"
//                       key={name}
//                       className="chip chip-outline"
//                       onClick={() => addTag(name)}
//                       title={`Add #${name}`}
//                     >
//                       #{name}
//                     </button>
//                   ))}
//                 </div>

//                 {tags.length > 0 && (
//                   <div className="tags-row">
//                     {tags.map(t => (
//                       <span key={t} className="chip chip-filled">
//                         #{t}
//                         <button
//                           type="button"
//                           className="chip-x"
//                           onClick={() => removeTag(t)}
//                           title="Remove"
//                         >
//                           <i className="fas fa-times" />
//                         </button>
//                       </span>
//                     ))}
//                     <div className="chip add-chip">
//                       <span>#</span>
//                       <input
//                         className="chip-input"
//                         placeholder="Tag"
//                         value={draftTag}
//                         onChange={e => setDraftTag(e.target.value)}
//                         onKeyDown={handleDraftKeyDown}
//                       />
//                     </div>
//                   </div>
//                 )}
//               </div>
//             </div>

//             <div className="editor-shell mt-5">
//               <div
//                 className="editor-canvas transparent"
//                 onClick={() => editor?.chain().focus().run()}
//                 role="textbox"
//                 aria-label="Article body editor"
//               >
//                 {isEmpty && <div className="editor-placeholder">Write your article here…</div>}
//                 <EditorContent editor={editor} />
//               </div>

              // {pickerVisible && (
              //   <div className="emoji-pop below">
              //     <Picker data={emojiData} onEmojiSelect={insertEmoji} theme="light" />
              //   </div>
              // )}

//               <div className="editor-toolbar bottom shadow-soft">
//                 <ToolbarButton title="Bold" icon="bold" active={editor?.isActive('bold')}
//                   onClick={() => editor?.chain().focus().toggleBold().run()} />
//                 <ToolbarButton title="Italic" icon="italic" active={editor?.isActive('italic')}
//                   onClick={() => editor?.chain().focus().toggleItalic().run()} />
//                 <ToolbarButton title="Underline" icon="underline" active={editor?.isActive('underline')}
//                   onClick={() => editor?.chain().focus().toggleUnderline().run()} />
//                 <ToolbarButton title="Strikethrough" icon="strikethrough" active={editor?.isActive('strike')}
//                   onClick={() => editor?.chain().focus().toggleStrike().run()} />

//                 <span className="tb-sep" />

//                 <ToolbarButton title="Bullet List" icon="list-ul" active={editor?.isActive('bulletList')}
//                   onClick={() => editor?.chain().focus().toggleBulletList().run()} />
//                 <ToolbarButton title="Numbered List" icon="list-ol" active={editor?.isActive('orderedList')}
//                   onClick={() => editor?.chain().focus().toggleOrderedList().run()} />
//                 <ToolbarButton title="Blockquote" icon="quote-right" active={editor?.isActive('blockquote')}
//                   onClick={() => editor?.chain().focus().toggleBlockquote().run()} />

//                 <span className="tb-sep" />

//                 <ToolbarButton title="Highlight" icon="highlighter" active={editor?.isActive('highlight')}
//                   onClick={() => editor?.chain().focus().toggleHighlight().run()} />

//                 <label className="tb-color" title="Text Color">
//                   <input type="color"
//                     onChange={e => editor?.chain().focus().setColor(e.target.value).run()} />
//                 </label>

//                 <span className="tb-sep" />

//                 <ToolbarButton title="Align Left" icon="align-left"
//                   onClick={() => editor?.chain().focus().setTextAlign('left').run()} />
//                 <ToolbarButton title="Align Center" icon="align-center"
//                   onClick={() => editor?.chain().focus().setTextAlign('center').run()} />
//                 <ToolbarButton title="Align Right" icon="align-right"
//                   onClick={() => editor?.chain().focus().setTextAlign('right').run()} />

//                 <span className="tb-sep" />

//                 <ToolbarButton title="Link" icon="link"
//                   onClick={() => {
//                     const url = window.prompt('Enter URL');
//                     if (url) editor?.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
//                   }} />

//                 <button type="button" className="tb-btn" title="Insert Image"
//                   onClick={() => document.getElementById('img-upload').click()}>
//                   <i className="fas fa-image" />
//                   <input id="img-upload" type="file" accept="image/*" hidden onChange={handleImgUpload} />
//                 </button>

//                 <button type="button" className="tb-btn" title="Emoji"
//                   onClick={() => setPickerVisible(v => !v)}>
//                   <i className="fas fa-smile" />
//                 </button>

//                 <span className="tb-sep" />

//                 <ToolbarButton title="Undo" icon="undo"
//                   onClick={() => editor?.chain().focus().undo().run()} />
//                 <ToolbarButton title="Redo" icon="redo"
//                   onClick={() => editor?.chain().focus().redo().run()} />
//               </div>

//               {editor && (
//                 <BubbleMenu
//                   editor={editor}
//                   shouldShow={({ editor }) => editor.isActive('image')}
//                   tippyOptions={{ duration: 0 }}
//                 >
//                   <div className="bubble-tools">
//                     <MDBBtn type="button" size="sm" color="light"
//                       onClick={() => document.getElementById('img-edit-upload').click()}
//                       title="Replace image">
//                       <MDBIcon fas icon="pencil-alt" />
//                     </MDBBtn>
//                     <MDBBtn type="button" size="sm" color="light"
//                       onClick={() => editor.chain().focus().deleteSelection().run()}
//                       title="Delete image">
//                       <MDBIcon fas icon="trash" />
//                     </MDBBtn>
//                   </div>
//                 </BubbleMenu>
//               )}
//               <input id="img-edit-upload" hidden type="file" accept="image/*" onChange={handleReplaceSelectedImage} />
//             </div>

//             <div className="write-actions text-left mt-5">
//               <button type="button" className="btn-preview pill-btn me-2">Preview</button>
//               <button type="button" className="btn-publish pill-btn"
//                 disabled={publishing} onClick={handleSubmit}>
//                 {publishing ? (
//                   <>
//                     <MDBSpinner size="sm" tag="span" className="me-2" role="status" />
//                     Publishing…
//                   </>
//                 ) : 'PUBLISH'}
//               </button>
//               <div className="mt-3">
//                 <button type="button" className="save-draft-link" onClick={handleSaveDraft}>
//                   Save as Draft
//                 </button>
//               </div>
//             </div>
//           </MDBCol>
//         </MDBRow>
//       </div>
//     </MDBContainer>
//   );
// }



// import React, { useState, useEffect, useMemo } from 'react';
// import { useNavigate, useParams, Link, useLocation } from 'react-router-dom';
// import { useAuth } from '../../context/AuthContext';
// import { createArticle, updateArticle } from '../../configs/useArticles';
// import {
//   createDraft,
//   updateDraft,
//   deleteDraft,
//   getDraftOnce,
// } from '../../configs/useArticles';
// import { ref as rtdbRef, get as rtdbGet, remove as rtdbRemove } from 'firebase/database';
// import { rtdb, db as fsDb, storage } from '../../configs/firebase';
// import {
//   doc, getDoc, setDoc, collection, onSnapshot,
//   serverTimestamp, increment,
// } from 'firebase/firestore';
// import { uploadBytes, getDownloadURL, ref as sRef } from 'firebase/storage';
// import DOMPurify from 'dompurify';

// import '../../styles/writearticlepage.css';
// import 'mdb-react-ui-kit/dist/css/mdb.min.css';
// import '@fortawesome/fontawesome-free/css/all.min.css';

// import { useEditor, EditorContent, BubbleMenu } from '@tiptap/react';
// import StarterKit from '@tiptap/starter-kit';
// import Underline from '@tiptap/extension-underline';
// import TextStyle from '@tiptap/extension-text-style';
// import Color from '@tiptap/extension-color';
// import Highlight from '@tiptap/extension-highlight';
// import LinkExt from '@tiptap/extension-link';
// import Image from '@tiptap/extension-image';
// import Youtube from '@tiptap/extension-youtube';
// import TextAlign from '@tiptap/extension-text-align';

// import { MDBContainer, MDBRow, MDBCol, MDBBtn, MDBIcon, MDBSpinner } from 'mdb-react-ui-kit';

// function ToolbarButton({ title, icon, onClick, active }) {
//   return (
//     <button
//       type="button"
//       className={`tb-btn${active ? ' is-active' : ''}`}
//       title={title}
//       onClick={onClick}
//     >
//       <i className={`fas fa-${icon}`} />
//     </button>
//   );
// }

// /* tiny, dependency-free emoji panel */
// const EMOJIS = ['😀','😂','😉','😍','🤔','👏','🔥','🌱','🌿','🌾','🌧️','🌻','🚜','💡','📌','✅','❌','➡️','📷','🔗'];
// function EmojiPanel({ onPick }) {
//   return (
//     <div className="emoji-pop below">
//       <div className="emoji-grid">
//         {EMOJIS.map(e => (
//           <button key={e} type="button" className="emoji-cell" onClick={() => onPick(e)}>
//             {e}
//           </button>
//         ))}
//       </div>
//     </div>
//   );
// }

// export default function WriteArticle() {
//   const { currentUser } = useAuth();
//   const nav = useNavigate();
//   const { id } = useParams();               // id is articleId or draftId (when draft=1)
//   const location = useLocation();
//   const isDraftMode = new URLSearchParams(location.search).get('draft') === '1';
//   const isEdit = Boolean(id);

//   const [suggestedTags, setSuggestedTags] = useState([]);
//   const [publishing, setPublishing] = useState(false);
//   const [previewOpen, setPreviewOpen] = useState(false);
//   const [isFocused, setIsFocused] = useState(false);
//   useEffect(() => {
//     if (!currentUser) return;
//     const unsub = onSnapshot(collection(fsDb, 'tags'), snap => {
//       const tags = snap.docs.map(d => ({ name: d.id, count: d.data().count || 0 }));
//       tags.sort((a, b) => b.count - a.count);
//       setSuggestedTags(tags);
//     });
//     return () => unsub();
//   }, [currentUser]);

//   const [title, setTitle] = useState('');
//   const [tags, setTags] = useState([]);
//   const [draftTag, setDraftTag] = useState('');
//   const [pickerVisible, setPickerVisible] = useState(false);
//   const [coverFile, setCoverFile] = useState(null);
//   const [coverURL, setCoverURL] = useState(null);
//   const [isEmpty, setIsEmpty] = useState(true);

//   const editor = useEditor({
//     extensions: [
//       StarterKit.configure({ heading: { levels: [1, 2, 3] } }),
//       Underline,
//       TextStyle,
//       Color,
//       Highlight,
//       LinkExt.configure({ openOnClick: false, HTMLAttributes: { rel: 'noopener nofollow' } }),
//       Image.configure({ allowBase64: true, HTMLAttributes: { class: 'article-img' } }),
//       Youtube.configure({ inline: false, width: 640 }),
//       TextAlign.configure({ types: ['heading', 'paragraph'] }),
//     ],
//     content: '<p></p>',
//     onUpdate({ editor }) {
//       const txt = editor.state.doc.textContent.trim();
//       setIsEmpty(txt.length === 0);
//     },
//        onFocus() {
//        setIsFocused(true);
//      },
//      onBlur() {
//        setIsFocused(false);
//      },
//   });

//   useEffect(() => {
//     if (!isEdit) return;
//     if (isDraftMode) {
//       getDraftOnce(currentUser.uid, id).then(draft => {
//         if (!draft) { nav('/profile'); return; }
//         setTitle(draft.title || '');
//         setTags(draft.tags || []);
//         setCoverURL(draft.coverUrl || null);
//         setTimeout(() => editor?.commands.setContent(draft.body || '<p></p>'), 0);
//       });
//       return;
//     }
//     rtdbGet(rtdbRef(rtdb, `articles/${id}`)).then(snap => {
//       if (!snap.exists()) { nav('/'); return; }
//       const art = snap.val();
//       setTitle(art.title || '');
//       setTags(art.tags || []);
//       setCoverURL(art.coverUrl || null);
//       setTimeout(() => editor?.commands.setContent(art.body || '<p></p>'), 0);
//     });
//   }, [id, isEdit, isDraftMode, nav, editor, currentUser]);

//   const addTag = name => {
//     const tag = String(name || '').trim().toLowerCase();
//     if (tag && !tags.includes(tag)) setTags(prev => [...prev, tag]);
//   };
//   const removeTag = name => setTags(prev => prev.filter(t => t !== name));

//   // --- BLOCK TYPE MENU ---
// const setBlockType = (e) => {
//   const v = e.target.value;
//   const chain = editor?.chain().focus();
//   if (!chain) return;
//   if (v === 'p') chain.setParagraph().run();
//   if (v === 'h1') chain.toggleHeading({ level: 1 }).run();
//   if (v === 'h2') chain.toggleHeading({ level: 2 }).run();
//   if (v === 'h3') chain.toggleHeading({ level: 3 }).run();
//   if (v === 'blockquote') chain.toggleBlockquote().run();
//   if (v === 'codeblock') chain.toggleCodeBlock().run();
// };

// // --- LINK ---
// const addLink = () => {
//   const url = window.prompt('Enter URL (https://…)');
//   if (!url) return;
//   editor?.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
// };
// const removeLink = () => editor?.chain().focus().unsetLink().run();

// // --- HR ---
// const insertHR = () => editor?.chain().focus().setHorizontalRule().run();

// // --- YOUTUBE ---
// const insertYouTube = () => {
//   const url = window.prompt('Paste a YouTube URL');
//   if (!url) return;
//   editor?.chain().focus().setYoutubeVideo({ src: url, width: 640, height: 360 }).run();
// };

// // --- FILE ATTACH (upload to Storage → insert link) ---
// const handleFileAttach = async (e) => {
//   const file = e.target.files?.[0];
//   if (!file || !currentUser) return;
//   try {
//     const path = `files/${currentUser.uid}/${Date.now()}_${file.name}`;
//     const ref = sRef(storage, path);
//     await uploadBytes(ref, file);
//     const url = await getDownloadURL(ref);
//     editor?.chain().focus()
//       .insertContent(`<a href="${url}" rel="noopener nofollow" target="_blank">${file.name}</a>`)
//       .run();
//   } finally {
//     e.target.value = '';
//   }
// };

// // --- CLEAR / INDENT ---
// const clearFormatting = () => editor?.chain().focus().clearNodes().unsetAllMarks().run();
// const indentList = () => editor?.chain().focus().sinkListItem('listItem').run();
// const outdentList = () => editor?.chain().focus().liftListItem('listItem').run();


//   const handleCoverSelect = e => {
//     const f = e.target.files?.[0];
//     if (!f) return;
//     setCoverFile(f);
//     const reader = new FileReader();
//     reader.onload = () => setCoverURL(reader.result);
//     reader.readAsDataURL(f);
//   };
//   const removeCoverImage = () => { setCoverFile(null); setCoverURL(null); };

//   const insertEmoji = emojiChar => {
//     editor?.chain().focus().insertContent(emojiChar).run();
//     setPickerVisible(false);
//   };

//   const handleImgUpload = e => {
//     const file = e.target.files?.[0];
//     if (!file) return;
//     const reader = new FileReader();
//     reader.onload = () => editor?.chain().focus().setImage({ src: reader.result }).run();
//     reader.readAsDataURL(file);
//   };
//   const handleReplaceSelectedImage = e => {
//     const file = e.target.files?.[0];
//     if (!file) return;
//     const reader = new FileReader();
//     reader.onload = () => {
//       if (editor?.isActive('image')) editor.chain().focus().updateAttributes('image', { src: reader.result }).run();
//     };
//     reader.readAsDataURL(file);
//     e.target.value = '';
//   };

//   const handleSubmit = async () => {
//     if (publishing) return;
//     const body = editor.getHTML();
//     const bodyText = body.replace(/<[^>]*>?/gm, '').trim();
//     if (!title.trim() || !bodyText) { alert('Title and body are required'); return; }
//     setPublishing(true);
//     try {
//       let coverDownloadURL = coverURL;
//       if (coverFile) {
//         const path = `covers/${currentUser.uid}/${Date.now()}_${coverFile.name}`;
//         const ref = sRef(storage, path);
//         await uploadBytes(ref, coverFile);
//         coverDownloadURL = await getDownloadURL(ref);
//       }
//       const ts = Date.now();
//       const payload = {
//         title, body, tags,
//         coverUrl: coverDownloadURL || '',
//         authorId: currentUser.uid,
//         createdAt: ts, updatedAt: ts,
//       };

//       let artId;
//       if (isEdit && !isDraftMode) {
//         await updateArticle(id, payload);
//         artId = id;
//       } else {
//         const res = await createArticle(payload);
//         artId = res.id;
//         if (isDraftMode) await deleteDraft(currentUser.uid, id); // remove the draft after publishing
//       }

//       await Promise.all(
//         tags.map(async t => {
//           const refDoc = doc(fsDb, 'tags', t);
//           await setDoc(refDoc, { count: increment(1), updatedAt: serverTimestamp() }, { merge: true });
//         })
//       );

//       nav(`/article/${artId}`);
//     } catch (e) {
//       console.error(e);
//       alert('Something went wrong, please try again.');
//       setPublishing(false);
//     }
//   };

//   const handleSaveDraft = async () => {
//     if (!currentUser) { alert('Please sign in first.'); return; }
//     try {
//       const body = editor.getHTML();
//       const ts = Date.now();
//       const draftPayload = {
//         userId: currentUser.uid,
//         title: title || '(untitled)',
//         body, tags,
//         coverUrl: coverURL || '',
//         status: 'draft',
//         createdAt: isEdit && isDraftMode ? ts : ts,
//         updatedAt: ts,
//       };

//       if (isEdit && isDraftMode) {
//         await updateDraft(currentUser.uid, id, draftPayload);
//       } else {
//         await createDraft(currentUser.uid, draftPayload);
//       }
//       alert('Draft saved.');
//     } catch (e) {
//       console.error('Draft save error:', e);
//       alert('Could not save draft. Please try again.');
//     }
//   };

//   const handleDelete = async () => {
//     if (!isEdit) return;
//     const ok = window.confirm('Delete this article permanently?');
//     if (!ok) return;
//     try {
//       if (isDraftMode) {
//         await deleteDraft(currentUser.uid, id);
//         alert('Draft deleted.');
//         nav('/profile');
//       } else {
//         await rtdbRemove(rtdbRef(rtdb, `articles/${id}`));
//         alert('Article deleted.');
//         nav('/');
//       }
//     } catch {
//       alert('Failed to delete. Try again.');
//     }
//   };

//   const dateString = useMemo(() => {
//     const now = new Date();
//     const opts = { year: 'numeric', month: 'long', day: 'numeric' };
//     return now.toLocaleDateString(undefined, opts);
//   }, []);

//   return (
//     <div style={{backgroundColor:"#F1F1E6"}}>
//     <MDBContainer className="write-wrap py-4">
//       <div className="write-topbar bounded mb-4">
//         <Link to="/" className="topbar-link">
//           <MDBIcon fas icon="arrow-left" className="me-2" /> back to home
//         </Link>
//         {isEdit && (
//           <button type="button" className="topbar-delete-btn" onClick={handleDelete}>
//             <MDBIcon fas icon="trash-alt" className="me-2" /> {isDraftMode ? 'delete draft' : 'delete article'}
//           </button>
//         )}
//       </div>

//       <div className="bounded">
//         <MDBRow className="justify-content-center">
//           <MDBCol md="10" lg="9">
//             <div className="write-meta grid mt-2">
//               <div className="cover-col">
//                 <button
//                   type="button"
//                   className="cover-circle"
//                   onClick={() => document.getElementById('cover-input').click()}
//                   title="Select cover"
//                 >
//                   {coverURL ? (
//                     <img src={coverURL} alt="cover" />
//                   ) : (
//                     <div className="cover-empty">
//                       <i className="far fa-image" />
//                       <span>Cover Image</span>
//                     </div>
//                   )}
//                   {coverURL && (
//                     <span
//                       className="cover-remove"
//                       title="Remove"
//                       onClick={(e) => { e.stopPropagation(); removeCoverImage(); }}
//                     >
//                       <i className="fas fa-times" />
//                     </span>
//                   )}
//                 </button>
//                 <input id="cover-input" hidden type="file" accept="image/*" onChange={handleCoverSelect} />
//               </div>

//               <div className="meta-divider" aria-hidden />

//               <div className="title-col">
//                 <div className="write-date">{dateString}</div>
//                 <input
//                   className="title-input"
//                   placeholder="TITLE"
//                   value={title}
//                   onChange={e => setTitle(e.target.value)}
//                 />

//                 <div className="tag-suggest">
//                   {suggestedTags.slice(0, 8).map(({ name }) => (
//                     <button
//                       type="button"
//                       key={name}
//                       className="chip chip-outline"
//                       onClick={() => addTag(name)}
//                       title={`Add #${name}`}
//                     >
//                       #{name}
//                     </button>
//                   ))}
//                 </div>

//                 {tags.length > 0 && (
//                   <div className="tags-row mt-3">
//                     {tags.map(t => (
//                       <span key={t} className="chip chip-filled">
//                         #{t}
//                         <button type="button" className="chip-x" onClick={() => removeTag(t)} title="Remove">
//                           <i className="fas fa-times" />
//                         </button>
//                       </span>
//                     ))}
//                     {/* <div className="chip add-chip">
//                       <span>#</span>
//                       <input
//                         className="chip-input"
//                         placeholder="Tag"
//                         value={draftTag}
//                         onChange={e => setDraftTag(e.target.value)}
//                         onKeyDown={handleDraftKeyDown}
//                       />
//                     </div> */}
//                   </div>
//                 )}
//               </div>
//             </div>

//             <div className="editor-shell mt-5">
//               <div
//                 className="editor-canvas transparent"
//                 onClick={() => editor?.chain().focus().run()}
//                 role="textbox"
//                 aria-label="Article body editor"
//                 onMouseDown={(e) => {
//                 e.preventDefault();
//                editor?.commands.focus('end');
//     }}
//               >
//                 {isEmpty && <div className="editor-placeholder">Write your article here…</div>}
//                 <EditorContent editor={editor} />
//               </div>

//               {pickerVisible && <EmojiPanel onPick={insertEmoji} />}


// <div className="editor-toolbar bottom shadow-soft">
//   {/* ——— Inline styles ——— */}
//   <ToolbarButton title="Bold" icon="bold"
//     active={editor?.isActive('bold')}
//     onClick={() => editor?.chain().focus().toggleBold().run()} />
//   <ToolbarButton title="Italic" icon="italic"
//     active={editor?.isActive('italic')}
//     onClick={() => editor?.chain().focus().toggleItalic().run()} />
//   <ToolbarButton title="Underline" icon="underline"
//     active={editor?.isActive('underline')}
//     onClick={() => editor?.chain().focus().toggleUnderline().run()} />
//   <ToolbarButton title="Strikethrough" icon="strikethrough"
//     active={editor?.isActive('strike')}
//     onClick={() => editor?.chain().focus().toggleStrike().run()} />

//   {/* color & highlight */}
//   <label className="tb-color" title="Text color">
//     <input type="color"
//       onChange={e => editor?.chain().focus().setColor(e.target.value).run()} />
//   </label>
//   <ToolbarButton title="Highlight" icon="highlighter"
//     active={editor?.isActive('highlight')}
//     onClick={() => editor?.chain().focus().toggleHighlight().run()} />

//   {/* emoji */}
//   <button type="button" className="tb-btn" title="Emoji" onClick={() => setPickerVisible(v => !v)}>
//     <i className="fas fa-smile" />
//   </button>

//   <span className="tb-sep" />

//   {/* ——— Block type menu ——— */}
//   <select
//     className="tb-select"
//     aria-label="Block type"
//     value={
//       editor?.isActive('heading', { level: 1 }) ? 'h1' :
//       editor?.isActive('heading', { level: 2 }) ? 'h2' :
//       editor?.isActive('heading', { level: 3 }) ? 'h3' :
//       editor?.isActive('blockquote') ? 'blockquote' :
//       editor?.isActive('codeBlock') ? 'codeblock' : 'p'
//     }
//     onChange={setBlockType}
//   >
//     <option value="p">¶ Paragraph</option>
//     <option value="h1">H1</option>
//     <option value="h2">H2</option>
//     <option value="h3">H3</option>
//     <option value="blockquote">Quote</option>
//     <option value="codeblock">Code Block</option>
//   </select>

//   <span className="tb-sep" />

//   {/* ——— Lists & indent ——— */}
//   <ToolbarButton title="Numbered list" icon="list-ol"
//     active={editor?.isActive('orderedList')}
//     onClick={() => editor?.chain().focus().toggleOrderedList().run()} />
//   <ToolbarButton title="Bulleted list" icon="list-ul"
//     active={editor?.isActive('bulletList')}
//     onClick={() => editor?.chain().focus().toggleBulletList().run()} />
//   <ToolbarButton title="Indent (lists)" icon="angle-right" onClick={indentList} />
//   <ToolbarButton title="Outdent (lists)" icon="angle-left" onClick={outdentList} />

//   <span className="tb-sep" />

//   {/* ——— Alignment ——— */}
//   <ToolbarButton title="Align left" icon="align-left"
//     onClick={() => editor?.chain().focus().setTextAlign('left').run()} />
//   <ToolbarButton title="Align center" icon="align-center"
//     onClick={() => editor?.chain().focus().setTextAlign('center').run()} />
//   <ToolbarButton title="Align right" icon="align-right"
//     onClick={() => editor?.chain().focus().setTextAlign('right').run()} />
//   <ToolbarButton title="Justify" icon="align-justify"
//     onClick={() => editor?.chain().focus().setTextAlign('justify').run()} />

//   <span className="tb-sep" />

//   {/* ——— Link / media / hr ——— */}
//   <ToolbarButton title="Insert link" icon="link" onClick={addLink} />
//   <ToolbarButton title="Remove link" icon="unlink" onClick={removeLink} />

//   <button type="button" className="tb-btn" title="Insert image"
//     onClick={() => document.getElementById('img-upload').click()}>
//     <i className="fas fa-image" />
//     <input id="img-upload" type="file" accept="image/*" hidden onChange={handleImgUpload} />
//   </button>

//   <button type="button" className="tb-btn" title="Attach file"
//     onClick={() => document.getElementById('file-upload').click()}>
//     <i className="fas fa-file" />
//     <input id="file-upload" type="file" hidden onChange={handleFileAttach} />
//   </button>

//   <ToolbarButton title="Insert YouTube" icon="video" onClick={insertYouTube} />
//   <ToolbarButton title="Horizontal rule" icon="minus" onClick={insertHR} />

//   <span className="tb-sep" />

//   {/* ——— Clear / Undo / Redo ——— */}
//   <ToolbarButton title="Clear formatting" icon="eraser" onClick={clearFormatting} />
//   <ToolbarButton title="Undo" icon="undo" onClick={() => editor?.chain().focus().undo().run()} />
//   <ToolbarButton title="Redo" icon="redo" onClick={() => editor?.chain().focus().redo().run()} />
// </div>
// <ToolbarButton title="Indent" icon="angle-right"
//   onClick={indentList}
//   active={false}
//   disabled={!editor?.isActive('listItem')}
// />

// {pickerVisible && <EmojiPanel onPick={(e) => { editor?.chain().focus().insertContent(e).run(); setPickerVisible(false); }} />}


//               {editor && (
//                 <BubbleMenu
//                   editor={editor}
//                   shouldShow={({ editor }) => editor.isActive('image')}
//                   tippyOptions={{ duration: 0 }}
//                 >
//                   <div className="bubble-tools">
//                     <MDBBtn type="button" size="sm" color="light"
//                       onClick={() => document.getElementById('img-edit-upload').click()} title="Replace image">
//                       <MDBIcon fas icon="pencil-alt" />
//                     </MDBBtn>
//                     <MDBBtn type="button" size="sm" color="light"
//                       onClick={() => editor.chain().focus().deleteSelection().run()} title="Delete image">
//                       <MDBIcon fas icon="trash" />
//                     </MDBBtn>
//                   </div>
//                 </BubbleMenu>
//               )}
//               <input id="img-edit-upload" hidden type="file" accept="image/*" onChange={handleReplaceSelectedImage} />
//             </div>

//             <div className="write-actions mt-5" aria-label="article actions">
//               <button type="button" className="btn-preview pill-btn" onClick={() => setPreviewOpen(true)}>Preview</button>
//               <button type="button" className="btn-publish pill-btn" disabled={publishing} onClick={handleSubmit}>
//                 {publishing ? (<><MDBSpinner size="sm" tag="span" className="me-2" role="status" />Publishing…</>) : 'PUBLISH'}
//               </button>
//               <div className="save-row">
//                 <button type="button" className="save-draft-link" onClick={handleSaveDraft}>Save as Draft</button>
//               </div>
//             </div>
//           </MDBCol>
//         </MDBRow>
//       </div>
//     </MDBContainer>
//      {/* PREVIEW OVERLAY */}
//       <PreviewOverlay
//         open={previewOpen}
//         onClose={() => setPreviewOpen(false)}
//         onPublish={handleSubmit}
//         title={title}
//         tags={tags}
//         coverUrl={coverURL}
//         bodyHTML={editor?.getHTML?.() || ''}
//       />
//     </div>
//   );
// }




// function PreviewOverlay({ open, onClose, onPublish, title, tags, coverUrl, bodyHTML }) {
//   if (!open) return null;

//   const textOnly = bodyHTML.replace(/<[^>]*>?/g, ' ').replace(/\s+/g, ' ').trim();
//   const description = textOnly.slice(0, 180);

//   return (
//     <div className="preview-overlay" role="dialog" aria-modal="true">
//       <div className="preview-panel">
//         <div className="preview-header">
//           <div className="preview-cover">
//             {coverUrl ? (
//               <img src={coverUrl} alt="Cover" />
//             ) : (
//               <div className="preview-cover--empty">
//                 <i className="far fa-image" />
//               </div>
//             )}
//           </div>

//           <div className="preview-meta">
//             <h1 className="preview-title">{title || 'Untitled'}</h1>

//             {Array.isArray(tags) && tags.length > 0 && (
//               <div className="preview-tags">
//                 {tags.map(t => (
//                   <span key={t} className="chip chip-outline">#{t}</span>
//                 ))}
//               </div>
//             )}

//           <div
//           className="preview-body"
//           dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(bodyHTML || '') }}
//         />          </div>
//         </div>

       

//         <div className="preview-actions">
//           <button type="button" className="btn-preview pill-btn" onClick={onClose}>Back</button>
//         </div>
//       </div>
//     </div>
//   );
// }
// /* ========== END PREVIEW OVERLAY ========== */


// Correct code below

// import React, { useState, useEffect, useMemo, useRef } from 'react';
// import { useNavigate, useParams, Link, useLocation } from 'react-router-dom';
// import { useAuth } from '../../context/AuthContext';
// import { createArticle, updateArticle } from '../../configs/useArticles';
// import {
//   createDraft,
//   updateDraft,
//   deleteDraft,
//   getDraftOnce,
// } from '../../configs/useArticles';
// import { ref as rtdbRef, get as rtdbGet, remove as rtdbRemove } from 'firebase/database';
// import { rtdb, db as fsDb, storage } from '../../configs/firebase';
// import {
//   doc, setDoc, collection, onSnapshot,
//   serverTimestamp, increment,
// } from 'firebase/firestore';
// import { uploadBytes, getDownloadURL, ref as sRef } from 'firebase/storage';
// import DOMPurify from 'dompurify';

// import '../../styles/writearticlepage.css';
// import 'mdb-react-ui-kit/dist/css/mdb.min.css';
// import '@fortawesome/fontawesome-free/css/all.min.css';

// import { useEditor, EditorContent, BubbleMenu } from '@tiptap/react';
// import StarterKit from '@tiptap/starter-kit';
// import Underline from '@tiptap/extension-underline';
// import TextStyle from '@tiptap/extension-text-style';
// import Color from '@tiptap/extension-color';
// import Highlight from '@tiptap/extension-highlight';
// import LinkExt from '@tiptap/extension-link';
// import Image from '@tiptap/extension-image';
// import Youtube from '@tiptap/extension-youtube';
// import TextAlign from '@tiptap/extension-text-align';

// import { MDBContainer, MDBRow, MDBCol, MDBBtn, MDBIcon, MDBSpinner } from 'mdb-react-ui-kit';

// /* ---------- tiny button primitive for the toolbar ---------- */
// function ToolbarButton({ title, icon, onClick, active, disabled }) {
//   return (
//     <button
//       type="button"
//       className={`tb-btn${active ? ' is-active' : ''}`}
//       title={title}
//       onClick={onClick}
//       disabled={disabled}
//       aria-pressed={!!active}
//       aria-label={title}
//     >
//       <i className={`fas fa-${icon}`} />
//     </button>
//   );
// }

// /* ---------- super-light emoji popover ---------- */
// const EMOJIS = ['😀','😂','😉','😍','🤔','👏','🔥','🌱','🌿','🌾','🌧️','🌻','🚜','💡','📌','✅','❌','➡️','📷','🔗'];
// function EmojiPanel({ onPick }) {
//   return (
//     <div className="emoji-pop below">
//       <div className="emoji-grid">
//         {EMOJIS.map(e => (
//           <button key={e} type="button" className="emoji-cell" onClick={() => onPick(e)}>
//             {e}
//           </button>
//         ))}
//       </div>
//     </div>
//   );
// }

// export default function WriteArticle() {
//   const { currentUser } = useAuth();
//   const nav = useNavigate();
//   const { id } = useParams();               // id is articleId or draftId (when draft=1)
//   const location = useLocation();
//   const isDraftMode = new URLSearchParams(location.search).get('draft') === '1';
//   const isEdit = Boolean(id);

//   const [suggestedTags, setSuggestedTags] = useState([]);
//   const [publishing, setPublishing] = useState(false);
//   const [previewOpen, setPreviewOpen] = useState(false);

//   const [title, setTitle] = useState('');
//   const [tags, setTags] = useState([]);
//   const [draftTag, setDraftTag] = useState('');
//   const [pickerVisible, setPickerVisible] = useState(false);
//   const [coverFile, setCoverFile] = useState(null);
//   const [coverURL, setCoverURL] = useState(null);
//   const [isEmpty, setIsEmpty] = useState(true);

//   // refs for hidden inputs
//   const imgInputRef = useRef(null);
//   const fileInputRef = useRef(null);

//   /* ---------- tags (firestore) ---------- */
//   useEffect(() => {
//     if (!currentUser) return;
//     const unsub = onSnapshot(collection(fsDb, 'tags'), snap => {
//       const tags = snap.docs.map(d => ({ name: d.id, count: d.data().count || 0 }));
//       tags.sort((a, b) => b.count - a.count);
//       setSuggestedTags(tags);
//     });
//     return () => unsub();
//   }, [currentUser]);

//   /* ---------- editor ---------- */
//   const editor = useEditor({
//     extensions: [
//       StarterKit.configure({ heading: { levels: [1, 2, 3] } }),
//       Underline,
//       TextStyle,
//       Color,
//       Highlight,
//       LinkExt.configure({ openOnClick: false, HTMLAttributes: { rel: 'noopener nofollow' } }),
//       Image.configure({ allowBase64: true, HTMLAttributes: { class: 'article-img' } }),
//       Youtube.configure({ inline: false, width: 640 }),
//       TextAlign.configure({ types: ['heading', 'paragraph'] }),
//     ],
//     content: '<p></p>',
//     onUpdate({ editor }) {
//       const txt = editor.state.doc.textContent.trim();
//       setIsEmpty(txt.length === 0);
//     },
//   });

//   /* ---------- load article/draft ---------- */
//   useEffect(() => {
//     if (!isEdit) return;
//     if (!editor) return;

//     const setFrom = (obj) => {
//       setTitle(obj.title || '');
//       setTags(obj.tags || []);
//       setCoverURL(obj.coverUrl || null);
//       editor.commands.setContent(obj.body || '<p></p>');
//     };

//     if (isDraftMode) {
//       getDraftOnce(currentUser.uid, id).then(draft => {
//         if (!draft) { nav('/profile'); return; }
//         setFrom(draft);
//       });
//     } else {
//       rtdbGet(rtdbRef(rtdb, `articles/${id}`)).then(snap => {
//         if (!snap.exists()) { nav('/'); return; }
//         setFrom(snap.val());
//       });
//     }
//   }, [id, isEdit, isDraftMode, nav, editor, currentUser]);

//   /* ---------- tag helpers ---------- */
//   const addTag = name => {
//     const tag = String(name || '').trim().toLowerCase();
//     if (tag && !tags.includes(tag)) setTags(prev => [...prev, tag]);
//   };
//   const removeTag = name => setTags(prev => prev.filter(t => t !== name));
//   const handleDraftKeyDown = e => {
//     if (e.key === 'Enter' && draftTag.trim()) {
//       addTag(draftTag);
//       setDraftTag('');
//     }
//   };

//   /* ---------- cover ---------- */
//   const handleCoverSelect = e => {
//     const f = e.target.files?.[0];
//     if (!f) return;
//     setCoverFile(f);
//     const reader = new FileReader();
//     reader.onload = () => setCoverURL(reader.result);
//     reader.readAsDataURL(f);
//   };
//   const removeCoverImage = () => { setCoverFile(null); setCoverURL(null); };

//   /* ---------- inline media ---------- */
//   const handleImgUpload = e => {
//     const file = e.target.files?.[0];
//     if (!file) return;
//     const reader = new FileReader();
//     reader.onload = () => editor?.chain().focus().setImage({ src: reader.result }).run();
//     reader.readAsDataURL(file);
//     e.target.value = '';
//   };
//   const handleReplaceSelectedImage = e => {
//     const file = e.target.files?.[0];
//     if (!file) return;
//     const reader = new FileReader();
//     reader.onload = () => {
//       if (editor?.isActive('image')) {
//         editor.chain().focus().updateAttributes('image', { src: reader.result }).run();
//       }
//     };
//     reader.readAsDataURL(file);
//     e.target.value = '';
//   };

//   /* ---------- toolbar helpers ---------- */
//   const setBlockType = (e) => {
//     const v = e.target.value;
//     const chain = editor?.chain().focus();
//     if (!chain) return;
//     if (v === 'p') chain.setParagraph().run();
//     if (v === 'h1') chain.toggleHeading({ level: 1 }).run();
//     if (v === 'h2') chain.toggleHeading({ level: 2 }).run();
//     if (v === 'h3') chain.toggleHeading({ level: 3 }).run();
//     if (v === 'blockquote') chain.toggleBlockquote().run();
//     if (v === 'codeblock') chain.toggleCodeBlock().run();
//   };
//   const addLink = () => {
//     const url = window.prompt('Enter URL (https://…)');
//     if (!url) return;
//     editor?.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
//   };
//   const removeLink = () => editor?.chain().focus().unsetLink().run();
//   const insertHR = () => editor?.chain().focus().setHorizontalRule().run();
//   const insertYouTube = () => {
//     const url = window.prompt('Paste a YouTube URL');
//     if (!url) return;
//     editor?.chain().focus().setYoutubeVideo({ src: url, width: 640, height: 360 }).run();
//   };
//   const handleFileAttach = async (e) => {
//     const file = e.target.files?.[0];
//     if (!file || !currentUser) return;
//     try {
//       const path = `files/${currentUser.uid}/${Date.now()}_${file.name}`;
//       const ref = sRef(storage, path);
//       await uploadBytes(ref, file);
//       const url = await getDownloadURL(ref);
//       editor?.chain().focus()
//         .insertContent(`<a href="${url}" rel="noopener nofollow" target="_blank">${file.name}</a>`)
//         .run();
//     } finally {
//       e.target.value = '';
//     }
//   };
//   const clearFormatting = () => editor?.chain().focus().clearNodes().unsetAllMarks().run();
//   const indentList = () => editor?.chain().focus().sinkListItem('listItem').run();
//   const outdentList = () => editor?.chain().focus().liftListItem('listItem').run();

//   /* ---------- submit & draft ---------- */
//   const handleSubmit = async () => {
//     if (publishing) return;
//     const body = editor.getHTML();
//     const bodyText = body.replace(/<[^>]*>?/gm, '').trim();
//     if (!title.trim() || !bodyText) { alert('Title and body are required'); return; }
//     setPublishing(true);
//     try {
//       let coverDownloadURL = coverURL;
//       if (coverFile) {
//         const path = `covers/${currentUser.uid}/${Date.now()}_${coverFile.name}`;
//         const ref = sRef(storage, path);
//         await uploadBytes(ref, coverFile);
//         coverDownloadURL = await getDownloadURL(ref);
//       }
//       const ts = Date.now();
//       const payload = {
//         title, body, tags,
//         coverUrl: coverDownloadURL || '',
//         authorId: currentUser.uid,
//         createdAt: ts, updatedAt: ts,
//       };

//       let artId;
//       if (isEdit && !isDraftMode) {
//         await updateArticle(id, payload);
//         artId = id;
//       } else {
//         const res = await createArticle(payload);
//         artId = res.id;
//         if (isDraftMode) await deleteDraft(currentUser.uid, id); // remove the draft after publishing
//       }

//       await Promise.all(
//         tags.map(async t => {
//           const refDoc = doc(fsDb, 'tags', t);
//           await setDoc(refDoc, { count: increment(1), updatedAt: serverTimestamp() }, { merge: true });
//         })
//       );

//       nav(`/article/${artId}`);
//     } catch (e) {
//       console.error(e);
//       alert('Something went wrong, please try again.');
//       setPublishing(false);
//     }
//   };

//   const handleSaveDraft = async () => {
//     if (!currentUser) { alert('Please sign in first.'); return; }
//     try {
//       const body = editor.getHTML();
//       const ts = Date.now();
//       const draftPayload = {
//         userId: currentUser.uid,
//         title: title || '(untitled)',
//         body, tags,
//         coverUrl: coverURL || '',
//         status: 'draft',
//         createdAt: ts,
//         updatedAt: ts,
//       };

//       if (isEdit && isDraftMode) {
//         await updateDraft(currentUser.uid, id, draftPayload);
//       } else {
//         await createDraft(currentUser.uid, draftPayload);
//       }
//       alert('Draft saved.');
//     } catch (e) {
//       console.error('Draft save error:', e);
//       alert('Could not save draft. Please try again.');
//     }
//   };

//   const handleDelete = async () => {
//     if (!isEdit) return;
//     const ok = window.confirm('Delete this article permanently?');
//     if (!ok) return;
//     try {
//       if (isDraftMode) {
//         await deleteDraft(currentUser.uid, id);
//         alert('Draft deleted.');
//         nav('/profile');
//       } else {
//         await rtdbRemove(rtdbRef(rtdb, `articles/${id}`));
//         alert('Article deleted.');
//         nav('/');
//       }
//     } catch {
//       alert('Failed to delete. Try again.');
//     }
//   };

//   const dateString = useMemo(() => {
//     const now = new Date();
//     const opts = { year: 'numeric', month: 'long', day: 'numeric' };
//     return now.toLocaleDateString(undefined, opts);
//   }, []);

//   return (
//     <div style={{ backgroundColor: '#F1F1E6' }}>
//       <MDBContainer className="write-wrap py-4">
//         <div className="write-topbar bounded mb-4">
//           <Link to="/" className="topbar-link">
//             <MDBIcon fas icon="arrow-left" className="me-2" /> back to home
//           </Link>
//           {isEdit && (
//             <button type="button" className="topbar-delete-btn" onClick={handleDelete}>
//               <MDBIcon fas icon="trash-alt" className="me-2" /> {isDraftMode ? 'delete draft' : 'delete article'}
//             </button>
//           )}
//         </div>

//         <div className="bounded">
//           <MDBRow className="justify-content-center">
//             <MDBCol md="10" lg="9">
//               <div className="write-meta grid mt-2">
//                 <div className="cover-col">
//                   <button
//                     type="button"
//                     className="cover-circle"
//                     onClick={() => document.getElementById('cover-input').click()}
//                     title="Select cover"
//                   >
//                     {coverURL ? (
//                       <img src={coverURL} alt="cover" />
//                     ) : (
//                       <div className="cover-empty">
//                         <i className="far fa-image" />
//                         <span>Cover Image</span>
//                       </div>
//                     )}
//                     {coverURL && (
//                       <span
//                         className="cover-remove"
//                         title="Remove"
//                         onClick={(e) => { e.stopPropagation(); removeCoverImage(); }}
//                       >
//                         <i className="fas fa-times" />
//                       </span>
//                     )}
//                   </button>
//                   <input id="cover-input" hidden type="file" accept="image/*" onChange={handleCoverSelect} />
//                 </div>

//                 <div className="meta-divider" aria-hidden />

//                 <div className="title-col">
//                   <div className="write-date">{dateString}</div>
//                   <input
//                     className="title-input"
//                     placeholder="TITLE"
//                     value={title}
//                     onChange={e => setTitle(e.target.value)}
//                   />

//                   <div className="tag-suggest">
//                     {suggestedTags.slice(0, 8).map(({ name }) => (
//                       <button
//                         type="button"
//                         key={name}
//                         className="chip chip-outline"
//                         onClick={() => addTag(name)}
//                         title={`Add #${name}`}
//                       >
//                         #{name}
//                       </button>
//                     ))}
//                   </div>

//                   {tags.length > 0 && (
//                     <div className="tags-row mt-3">
//                       {tags.map(t => (
//                         <span key={t} className="chip chip-filled">
//                           #{t}
//                           <button type="button" className="chip-x" onClick={() => removeTag(t)} title="Remove">
//                             <i className="fas fa-times" />
//                           </button>
//                         </span>
//                       ))}
//                       {/* If you want manual entry, re-enable the add-chip block here */}
//                     </div>
//                   )}
//                 </div>
//               </div>

//               {/* ===== Editor ===== */}
//               <div className="editor-shell mt-5">
//                 <div
//                   className="editor-canvas transparent"
//                   onClick={() => editor?.chain().focus().run()}
//                   role="textbox"
//                   aria-label="Article body editor"
//                 >
//                   {isEmpty && <div className="editor-placeholder">Write your article here…</div>}
//                   <EditorContent editor={editor} />
//                 </div>

//                 {/* Emoji panel (rendered once) */}
//                 {pickerVisible && (
//                   <EmojiPanel
//                     onPick={(emoji) => {
//                       editor?.chain().focus().insertContent(emoji).run();
//                       setPickerVisible(false);
//                     }}
//                   />
//                 )}

//                 {/* ===== Toolbar ===== */}
//                 <div className="editor-toolbar bottom shadow-soft">
//                   {/* inline styles */}
//                   <ToolbarButton title="Bold" icon="bold"
//                     active={editor?.isActive('bold')}
//                     onClick={() => editor?.chain().focus().toggleBold().run()} />
//                   <ToolbarButton title="Italic" icon="italic"
//                     active={editor?.isActive('italic')}
//                     onClick={() => editor?.chain().focus().toggleItalic().run()} />
//                   <ToolbarButton title="Underline" icon="underline"
//                     active={editor?.isActive('underline')}
//                     onClick={() => editor?.chain().focus().toggleUnderline().run()} />
//                   <ToolbarButton title="Strikethrough" icon="strikethrough"
//                     active={editor?.isActive('strike')}
//                     onClick={() => editor?.chain().focus().toggleStrike().run()} />

//                   {/* color & highlight */}
//                   <label className="tb-color" title="Text color">
//                     <input type="color"
//                       onChange={e => editor?.chain().focus().setColor(e.target.value).run()} />
//                   </label>
//                   <ToolbarButton title="Highlight" icon="highlighter"
//                     active={editor?.isActive('highlight')}
//                     onClick={() => editor?.chain().focus().toggleHighlight().run()} />

//                   {/* emoji */}
//                   <button type="button" className="tb-btn" title="Emoji" onClick={() => setPickerVisible(v => !v)}>
//                     <i className="fas fa-smile" />
//                   </button>

//                   <span className="tb-sep" />

//                   {/* block type menu */}
//                   <select
//                     className="tb-select"
//                     aria-label="Block type"
//                     value={
//                       editor?.isActive('heading', { level: 1 }) ? 'h1' :
//                       editor?.isActive('heading', { level: 2 }) ? 'h2' :
//                       editor?.isActive('heading', { level: 3 }) ? 'h3' :
//                       editor?.isActive('blockquote') ? 'blockquote' :
//                       editor?.isActive('codeBlock') ? 'codeblock' : 'p'
//                     }
//                     onChange={setBlockType}
//                   >
//                     <option value="p">¶ Paragraph</option>
//                     <option value="h1">H1</option>
//                     <option value="h2">H2</option>
//                     <option value="h3">H3</option>
//                     <option value="blockquote">Quote</option>
//                     <option value="codeblock">Code Block</option>
//                   </select>

//                   <span className="tb-sep" />

//                   {/* lists & indent */}
//                   <ToolbarButton title="Numbered list" icon="list-ol"
//                     active={editor?.isActive('orderedList')}
//                     onClick={() => editor?.chain().focus().toggleOrderedList().run()} />
//                   <ToolbarButton title="Bulleted list" icon="list-ul"
//                     active={editor?.isActive('bulletList')}
//                     onClick={() => editor?.chain().focus().toggleBulletList().run()} />
//                   <ToolbarButton
//                     title="Indent (lists)"
//                     icon="angle-right"
//                     onClick={indentList}
//                     disabled={!editor?.isActive('listItem')}
//                   />
//                   <ToolbarButton
//                     title="Outdent (lists)"
//                     icon="angle-left"
//                     onClick={outdentList}
//                     disabled={!editor?.isActive('listItem')}
//                   />

//                   <span className="tb-sep" />

//                   {/* alignment */}
//                   <ToolbarButton title="Align left" icon="align-left"
//                     onClick={() => editor?.chain().focus().setTextAlign('left').run()} />
//                   <ToolbarButton title="Align center" icon="align-center"
//                     onClick={() => editor?.chain().focus().setTextAlign('center').run()} />
//                   <ToolbarButton title="Align right" icon="align-right"
//                     onClick={() => editor?.chain().focus().setTextAlign('right').run()} />
//                   <ToolbarButton title="Justify" icon="align-justify"
//                     onClick={() => editor?.chain().focus().setTextAlign('justify').run()} />

//                   <span className="tb-sep" />

//                   {/* link / media / hr */}
//                   <ToolbarButton title="Insert link" icon="link" onClick={addLink} />
//                   <ToolbarButton title="Remove link" icon="unlink" onClick={removeLink} />

//                   <button type="button" className="tb-btn" title="Insert image"
//                           onClick={() => imgInputRef.current?.click()}>
//                     <i className="fas fa-image" />
//                   </button>
//                   <input ref={imgInputRef} type="file" hidden accept="image/*" onChange={handleImgUpload} />

//                   <button type="button" className="tb-btn" title="Attach file"
//                           onClick={() => fileInputRef.current?.click()}>
//                     <i className="fas fa-file" />
//                   </button>
//                   <input ref={fileInputRef} type="file" hidden onChange={handleFileAttach} />

//                   <ToolbarButton title="Insert YouTube" icon="video" onClick={insertYouTube} />
//                   <ToolbarButton title="Horizontal rule" icon="minus" onClick={insertHR} />

//                   <span className="tb-sep" />

//                   {/* clear / undo / redo */}
//                   <ToolbarButton title="Clear formatting" icon="eraser" onClick={clearFormatting} />
//                   <ToolbarButton title="Undo" icon="undo" onClick={() => editor?.chain().focus().undo().run()} />
//                   <ToolbarButton title="Redo" icon="redo" onClick={() => editor?.chain().focus().redo().run()} />
//                 </div>

//                 {/* image bubble tools */}
//                 {editor && (
//                   <BubbleMenu
//                     editor={editor}
//                     shouldShow={({ editor }) => editor.isActive('image')}
//                     tippyOptions={{ duration: 0 }}
//                   >
//                     <div className="bubble-tools">
//                       <MDBBtn type="button" size="sm" color="light"
//                         onClick={() => document.getElementById('img-edit-upload').click()} title="Replace image">
//                         <MDBIcon fas icon="pencil-alt" />
//                       </MDBBtn>
//                       <MDBBtn type="button" size="sm" color="light"
//                         onClick={() => editor.chain().focus().deleteSelection().run()} title="Delete image">
//                         <MDBIcon fas icon="trash" />
//                       </MDBBtn>
//                     </div>
//                   </BubbleMenu>
//                 )}
//                 <input id="img-edit-upload" hidden type="file" accept="image/*" onChange={handleReplaceSelectedImage} />
//               </div>

//               {/* ===== Actions (preview / publish / save) ===== */}
//               <div className="write-actions mt-5" aria-label="article actions">
//                 <button type="button" className="btn-preview pill-btn" onClick={() => setPreviewOpen(true)}>
//                   Preview
//                 </button>
//                 <button type="button" className="btn-publish pill-btn" disabled={publishing} onClick={handleSubmit}>
//                   {publishing ? (<><MDBSpinner size="sm" tag="span" className="me-2" role="status" />Publishing…</>) : 'PUBLISH'}
//                 </button>
//                 <div className="save-row">
//                   <button type="button" className="save-draft-link" onClick={handleSaveDraft}>Save as Draft</button>
//                 </div>
//               </div>
//             </MDBCol>
//           </MDBRow>
//         </div>
//       </MDBContainer>

//       {/* PREVIEW OVERLAY */}
//       <PreviewOverlay
//         open={previewOpen}
//         onClose={() => setPreviewOpen(false)}
//         onPublish={handleSubmit}
//         title={title}
//         tags={tags}
//         coverUrl={coverURL}
//         bodyHTML={editor?.getHTML?.() || ''}
//       />
//     </div>
//   );
// }

// /* ---------- Preview overlay (unchanged except for formatting) ---------- */
// function PreviewOverlay({ open, onClose, onPublish, title, tags, coverUrl, bodyHTML }) {
//   if (!open) return null;

//   return (
//     <div className="preview-overlay" role="dialog" aria-modal="true">
//       <div className="preview-panel">
//         <div className="preview-header">
//           <div className="preview-cover">
//             {coverUrl ? (
//               <img src={coverUrl} alt="Cover" />
//             ) : (
//               <div className="preview-cover--empty">
//                 <i className="far fa-image" />
//               </div>
//             )}
//           </div>

//           <div className="preview-meta">
//             <h1 className="preview-title">{title || 'Untitled'}</h1>

//             {Array.isArray(tags) && tags.length > 0 && (
//               <div className="preview-tags">
//                 {tags.map(t => (
//                   <span key={t} className="chip chip-outline">#{t}</span>
//                 ))}
//               </div>
//             )}

//             <div
//               className="preview-body"
//               dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(bodyHTML || '') }}
//             />
//           </div>
//         </div>

//         <div className="preview-actions">
//           <button type="button" className="btn-preview pill-btn" onClick={onClose}>Back</button>
//         </div>
//       </div>
//     </div>
//   );
// }


// import React, { useState, useEffect, useMemo, useRef } from 'react';
// import { useNavigate, useParams, Link, useLocation } from 'react-router-dom';
// import { useAuth } from '../../context/AuthContext';
// import { createArticle, updateArticle } from '../../configs/useArticles';
// import {
//   createDraft,
//   updateDraft,
//   deleteDraft,
//   getDraftOnce,
// } from '../../configs/useArticles';
// import { ref as rtdbRef, get as rtdbGet, remove as rtdbRemove } from 'firebase/database';
// import { rtdb, db as fsDb, storage } from '../../configs/firebase';
// import {
//   doc, setDoc, collection, onSnapshot,
//   serverTimestamp, increment,
// } from 'firebase/firestore';
// import { uploadBytes, getDownloadURL, ref as sRef } from 'firebase/storage';
// import DOMPurify from 'dompurify';

// import '../../styles/writearticlepage.css';
// import 'mdb-react-ui-kit/dist/css/mdb.min.css';
// import '@fortawesome/fontawesome-free/css/all.min.css';

// import { useEditor, EditorContent, BubbleMenu } from '@tiptap/react';
// import StarterKit from '@tiptap/starter-kit';
// import Underline from '@tiptap/extension-underline';
// import TextStyle from '@tiptap/extension-text-style';
// import Color from '@tiptap/extension-color';
// import Highlight from '@tiptap/extension-highlight';
// import LinkExt from '@tiptap/extension-link';
// import Image from '@tiptap/extension-image';
// import Youtube from '@tiptap/extension-youtube';
// import TextAlign from '@tiptap/extension-text-align';
// import Picker from '@emoji-mart/react';
// import emojiData from '@emoji-mart/data';
// import { MDBContainer, MDBRow, MDBCol, MDBBtn, MDBIcon, MDBSpinner } from 'mdb-react-ui-kit';

// /* ---------- tiny button primitive for the toolbar ---------- */
// function ToolbarButton({ title, icon, onClick, active, disabled }) {
//   return (
//     <button
//       type="button"
//       className={`tb-btn${active ? ' is-active' : ''}`}
//       title={title}
//       onClick={onClick}
//       disabled={disabled}
//       aria-pressed={!!active}
//       aria-label={title}
//     >
//       <i className={`fas fa-${icon}`} />
//     </button>
//   );
// }


// export default function WriteArticle() {
//   const { currentUser } = useAuth();
//   const nav = useNavigate();
//   const { id } = useParams();               // id is articleId or draftId (when draft=1)
//   const location = useLocation();
//   const isDraftMode = new URLSearchParams(location.search).get('draft') === '1';
//   const isEdit = Boolean(id);

//   const [suggestedTags, setSuggestedTags] = useState([]);
//   const [publishing, setPublishing] = useState(false);
//   const [previewOpen, setPreviewOpen] = useState(false);

//   const [title, setTitle] = useState('');
//   const [tags, setTags] = useState([]);
//   const [draftTag, setDraftTag] = useState('');
//   const [pickerVisible, setPickerVisible] = useState(false);
//   const [coverFile, setCoverFile] = useState(null);
//   const [coverURL, setCoverURL] = useState(null);
//   const [isEmpty, setIsEmpty] = useState(true);

//   // refs for hidden inputs
//   const imgInputRef = useRef(null);
//   const fileInputRef = useRef(null);
//   const [moreOpen, setMoreOpen] = useState(false);
//   const moreRef = useRef(null);

//   // emoji picker state/refs
//   const emojiBtnRef = useRef(null);
//   const emojiPanelRef = useRef(null);
//   const [emojiPos, setEmojiPos] = useState({ top: 0, left: 0 });
//   /* ---------- tags (firestore) ---------- */
//   useEffect(() => {
//     if (!currentUser) return;
//     const unsub = onSnapshot(collection(fsDb, 'tags'), snap => {
//       const tags = snap.docs.map(d => ({ name: d.id, count: d.data().count || 0 }));
//       tags.sort((a, b) => b.count - a.count);
//       setSuggestedTags(tags);
//     });
//     return () => unsub();
//   }, [currentUser]);

//   /* ---------- editor ---------- */
//   const editor = useEditor({
//     extensions: [
//       StarterKit.configure({ heading: { levels: [1, 2, 3] } }),
//       Underline,
//       TextStyle,
//       Color,
//       Highlight,
//       LinkExt.configure({ openOnClick: false, HTMLAttributes: { rel: 'noopener nofollow' } }),
//       Image.configure({ allowBase64: true, HTMLAttributes: { class: 'article-img' } }),
//       Youtube.configure({ inline: false, width: 640 }),
//       TextAlign.configure({ types: ['heading', 'paragraph'] }),
//     ],
//     content: '<p></p>',
//     onUpdate({ editor }) {
//       const txt = editor.state.doc.textContent.trim();
//       setIsEmpty(txt.length === 0);
//     },
//   });

//   /* ---------- load article/draft ---------- */
//   useEffect(() => {
//     if (!isEdit) return;
//     if (!editor) return;

//     const setFrom = (obj) => {
//       setTitle(obj.title || '');
//       setTags(obj.tags || []);
//       setCoverURL(obj.coverUrl || null);
//       editor.commands.setContent(obj.body || '<p></p>');
//     };

//     if (isDraftMode) {
//       getDraftOnce(currentUser.uid, id).then(draft => {
//         if (!draft) { nav('/profile'); return; }
//         setFrom(draft);
//       });
//     } else {
//       rtdbGet(rtdbRef(rtdb, `articles/${id}`)).then(snap => {
//         if (!snap.exists()) { nav('/'); return; }
//         setFrom(snap.val());
//       });
//     }
//   }, [id, isEdit, isDraftMode, nav, editor, currentUser]);

//   /* ---------- tag helpers ---------- */
//   const addTag = name => {
//     const tag = String(name || '').trim().toLowerCase();
//     if (tag && !tags.includes(tag)) setTags(prev => [...prev, tag]);
//   };
//   const removeTag = name => setTags(prev => prev.filter(t => t !== name));
//   const handleDraftKeyDown = e => {
//     if (e.key === 'Enter' && draftTag.trim()) {
//       addTag(draftTag);
//       setDraftTag('');
//     }
//   };

//   useEffect(() => {
//   const onDocClick = (e) => {
//     if (moreRef.current && !moreRef.current.contains(e.target)) setMoreOpen(false);
//     const targetInsideEmoji = emojiPanelRef.current?.contains(e.target) || emojiBtnRef.current?.contains(e.target);
//     if (!targetInsideEmoji) setPickerVisible(false);
//   };
//   const onEsc = (e) => { if (e.key === 'Escape') setMoreOpen(false); };

//   document.addEventListener('mousedown', onDocClick);
//   document.addEventListener('keydown', onEsc);
//   return () => {
//     document.removeEventListener('mousedown', onDocClick);
//     document.removeEventListener('keydown', onEsc);
//   };
// }, []);

//  // position emoji panel near the smile button
//   useEffect(() => {
//     if (!pickerVisible) return;
//     const rect = emojiBtnRef.current?.getBoundingClientRect();
//     if (rect) {
//       setEmojiPos({
//         top: rect.bottom + 8 + window.scrollY,
//         left: rect.left + window.scrollX - 8,
//       });
//     }
//   }, [pickerVisible]);

//   /* ---------- cover ---------- */
//   const handleCoverSelect = e => {
//     const f = e.target.files?.[0];
//     if (!f) return;
//     setCoverFile(f);
//     const reader = new FileReader();
//     reader.onload = () => setCoverURL(reader.result);
//     reader.readAsDataURL(f);
//   };
//   const removeCoverImage = () => { setCoverFile(null); setCoverURL(null); };

//   /* ---------- inline media ---------- */
//   const handleImgUpload = e => {
//     const file = e.target.files?.[0];
//     if (!file) return;
//     const reader = new FileReader();
//     reader.onload = () => editor?.chain().focus().setImage({ src: reader.result }).run();
//     reader.readAsDataURL(file);
//     e.target.value = '';
//   };
//   const handleReplaceSelectedImage = e => {
//     const file = e.target.files?.[0];
//     if (!file) return;
//     const reader = new FileReader();
//     reader.onload = () => {
//       if (editor?.isActive('image')) {
//         editor.chain().focus().updateAttributes('image', { src: reader.result }).run();
//       }
//     };
//     reader.readAsDataURL(file);
//     e.target.value = '';
//   };

//   /* ---------- toolbar helpers ---------- */
//   const setBlockType = (e) => {
//     const v = e.target.value;
//     const chain = editor?.chain().focus();
//     if (!chain) return;
//     if (v === 'p') chain.setParagraph().run();
//     if (v === 'h1') chain.toggleHeading({ level: 1 }).run();
//     if (v === 'h2') chain.toggleHeading({ level: 2 }).run();
//     if (v === 'h3') chain.toggleHeading({ level: 3 }).run();
//     if (v === 'blockquote') chain.toggleBlockquote().run();
//     if (v === 'codeblock') chain.toggleCodeBlock().run();
//   };
//   const addLink = () => {
//     const url = window.prompt('Enter URL (https://…)');
//     if (!url) return;
//     editor?.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
//   };
//   const removeLink = () => editor?.chain().focus().unsetLink().run();
//   const insertHR = () => editor?.chain().focus().setHorizontalRule().run();
//   const insertYouTube = () => {
//     const url = window.prompt('Paste a YouTube URL');
//     if (!url) return;
//     editor?.chain().focus().setYoutubeVideo({ src: url, width: 640, height: 360 }).run();
//   };
//   const handleFileAttach = async (e) => {
//     const file = e.target.files?.[0];
//     if (!file || !currentUser) return;
//     try {
//       const path = `files/${currentUser.uid}/${Date.now()}_${file.name}`;
//       const ref = sRef(storage, path);
//       await uploadBytes(ref, file);
//       const url = await getDownloadURL(ref);
//       editor?.chain().focus()
//         .insertContent(`<a href="${url}" rel="noopener nofollow" target="_blank">${file.name}</a>`)
//         .run();
//     } finally {
//       e.target.value = '';
//     }
//   };
//   const clearFormatting = () => editor?.chain().focus().clearNodes().unsetAllMarks().run();
//   const indentList = () => editor?.chain().focus().sinkListItem('listItem').run();
//   const outdentList = () => editor?.chain().focus().liftListItem('listItem').run();

//   /* ---------- emoji handlers ---------- */
//   const handleEmojiSelect = (emoji) => {
//     const char = emoji?.native || '';
//     if (!char) return;
//     editor?.chain().focus().insertContent(char).run();
//     setPickerVisible(false);
//   };
//   /* ---------- submit & draft ---------- */
//   const handleSubmit = async () => {
//     if (publishing) return;
//     const body = editor.getHTML();
//     const bodyText = body.replace(/<[^>]*>?/gm, '').trim();
//     if (!title.trim() || !bodyText) { alert('Title and body are required'); return; }
//     setPublishing(true);
//     try {
//       let coverDownloadURL = coverURL;
//       if (coverFile) {
//         const path = `covers/${currentUser.uid}/${Date.now()}_${coverFile.name}`;
//         const ref = sRef(storage, path);
//         await uploadBytes(ref, coverFile);
//         coverDownloadURL = await getDownloadURL(ref);
//       }
//       const ts = Date.now();
//       const payload = {
//         title, body, tags,
//         coverUrl: coverDownloadURL || '',
//         authorId: currentUser.uid,
//         createdAt: ts, updatedAt: ts,
//       };

//       let artId;
//       if (isEdit && !isDraftMode) {
//         await updateArticle(id, payload);
//         artId = id;
//       } else {
//         const res = await createArticle(payload);
//         artId = res.id;
//         if (isDraftMode) await deleteDraft(currentUser.uid, id); // remove the draft after publishing
//       }

//       await Promise.all(
//         tags.map(async t => {
//           const refDoc = doc(fsDb, 'tags', t);
//           await setDoc(refDoc, { count: increment(1), updatedAt: serverTimestamp() }, { merge: true });
//         })
//       );

//       nav(`/article/${artId}`);
//     } catch (e) {
//       console.error(e);
//       alert('Something went wrong, please try again.');
//       setPublishing(false);
//     }
//   };

//   const handleSaveDraft = async () => {
//     if (!currentUser) { alert('Please sign in first.'); return; }
//     try {
//       const body = editor.getHTML();
//       const ts = Date.now();
//       const draftPayload = {
//         userId: currentUser.uid,
//         title: title || '(untitled)',
//         body, tags,
//         coverUrl: coverURL || '',
//         status: 'draft',
//         createdAt: ts,
//         updatedAt: ts,
//       };

//       if (isEdit && isDraftMode) {
//         await updateDraft(currentUser.uid, id, draftPayload);
//       } else {
//         await createDraft(currentUser.uid, draftPayload);
//       }
//       alert('Draft saved.');
//     } catch (e) {
//       console.error('Draft save error:', e);
//       alert('Could not save draft. Please try again.');
//     }
//   };

//   const handleDelete = async () => {
//     if (!isEdit) return;
//     const ok = window.confirm('Delete this article permanently?');
//     if (!ok) return;
//     try {
//       if (isDraftMode) {
//         await deleteDraft(currentUser.uid, id);
//         alert('Draft deleted.');
//         nav('/profile');
//       } else {
//         await rtdbRemove(rtdbRef(rtdb, `articles/${id}`));
//         alert('Article deleted.');
//         nav('/');
//       }
//     } catch {
//       alert('Failed to delete. Try again.');
//     }
//   };

//   const dateString = useMemo(() => {
//     const now = new Date();
//     const opts = { year: 'numeric', month: 'long', day: 'numeric' };
//     return now.toLocaleDateString(undefined, opts);
//   }, []);

//   return (
//     <div style={{ backgroundColor: '#F1F1E6' }}>
//       <MDBContainer className="write-wrap py-4">
//         <div className="write-topbar bounded mb-4">
//           <Link to="/" className="topbar-link">
//             <MDBIcon fas icon="arrow-left" className="me-2" /> back to home
//           </Link>
//           {isEdit && (
//             <button type="button" className="topbar-delete-btn" onClick={handleDelete}>
//               <MDBIcon fas icon="trash-alt" className="me-2" /> {isDraftMode ? 'delete draft' : 'delete article'}
//             </button>
//           )}
//         </div>

//         <div className="bounded">
//           <MDBRow className="justify-content-center">
//             <MDBCol md="10" lg="9">
//               <div className="write-meta grid mt-2">
//                 <div className="cover-col">
//                   <button
//                     type="button"
//                     className="cover-circle"
//                     onClick={() => document.getElementById('cover-input').click()}
//                     title="Select cover"
//                   >
//                     {coverURL ? (
//                       <img src={coverURL} alt="cover" />
//                     ) : (
//                       <div className="cover-empty">
//                         <i className="far fa-image" />
//                         <span>Cover Image</span>
//                       </div>
//                     )}
//                     {coverURL && (
//                       <span
//                         className="cover-remove"
//                         title="Remove"
//                         onClick={(e) => { e.stopPropagation(); removeCoverImage(); }}
//                       >
//                         <i className="fas fa-times" />
//                       </span>
//                     )}
//                   </button>
//                   <input id="cover-input" hidden type="file" accept="image/*" onChange={handleCoverSelect} />
//                 </div>

//                 <div className="meta-divider" aria-hidden />

//                 <div className="title-col">
//                   <div className="write-date">{dateString}</div>
//                   <input
//                     className="title-input"
//                     placeholder="TITLE"
//                     value={title}
//                     onChange={e => setTitle(e.target.value)}
//                   />

//                   <div className="tag-suggest">
//                     {suggestedTags.slice(0, 8).map(({ name }) => (
//                       <button
//                         type="button"
//                         key={name}
//                         className="chip chip-outline"
//                         onClick={() => addTag(name)}
//                         title={`Add #${name}`}
//                       >
//                         #{name}
//                       </button>
//                     ))}
//                   </div>

//                   {tags.length > 0 && (
//                     <div className="tags-row mt-3">
//                       {tags.map(t => (
//                         <span key={t} className="chip chip-filled">
//                           #{t}
//                           <button type="button" className="chip-x" onClick={() => removeTag(t)} title="Remove">
//                             <i className="fas fa-times" />
//                           </button>
//                         </span>
//                       ))}
//                       {/* If you want manual entry, re-enable the add-chip block here */}
//                     </div>
//                   )}
//                 </div>
//               </div>

//               {/* ===== Editor ===== */}
//               <div className="editor-shell mt-5">
//                 <div
//                   className="editor-canvas transparent"
//                   onClick={() => editor?.chain().focus().run()}
//                   role="textbox"
//                   aria-label="Article body editor"
//                 >
//                   {isEmpty && <div className="editor-placeholder">Write your article here…</div>}
//                   <EditorContent editor={editor} />
//                 </div>

                

//                 {/* ===== Toolbar ===== */}
//                 <div className="editor-toolbar bottom shadow-soft">
//                   {/* inline styles */}
//                   <ToolbarButton title="Bold" icon="bold"
//                     active={editor?.isActive('bold')}
//                     onClick={() => editor?.chain().focus().toggleBold().run()} />
//                   <ToolbarButton title="Italic" icon="italic"
//                     active={editor?.isActive('italic')}
//                     onClick={() => editor?.chain().focus().toggleItalic().run()} />
//                   <ToolbarButton title="Underline" icon="underline"
//                     active={editor?.isActive('underline')}
//                     onClick={() => editor?.chain().focus().toggleUnderline().run()} />
//                   <ToolbarButton title="Strikethrough" icon="strikethrough"
//                     active={editor?.isActive('strike')}
//                     onClick={() => editor?.chain().focus().toggleStrike().run()} />

//                   {/* color & highlight */}
//                   <label className="tb-color" title="Text color">
//                     <input type="color"
//                       onChange={e => editor?.chain().focus().setColor(e.target.value).run()} />
//                   </label>
//                   <ToolbarButton title="Highlight" icon="highlighter"
//                     active={editor?.isActive('highlight')}
//                     onClick={() => editor?.chain().focus().toggleHighlight().run()} />

//                   {/* emoji */}
//                    <button
//                     type="button"
//                     ref={emojiBtnRef}
//                     className="tb-btn"
//                     title="Emoji"
//                     onClick={() => setPickerVisible(v => !v)}
//                     aria-expanded={pickerVisible}
//                     aria-haspopup="dialog"
//                   >
//                     <i className="fas fa-smile" />
//                   </button>

//                   <span className="tb-sep" />

//                   {/* block type menu */}
//                   <select
//                     className="tb-select"
//                     aria-label="Block type"
//                     value={
//                       editor?.isActive('heading', { level: 1 }) ? 'h1' :
//                       editor?.isActive('heading', { level: 2 }) ? 'h2' :
//                       editor?.isActive('heading', { level: 3 }) ? 'h3' :
//                       editor?.isActive('blockquote') ? 'blockquote' :
//                       editor?.isActive('codeBlock') ? 'codeblock' : 'p'
//                     }
//                     onChange={setBlockType}
//                   >
//                     <option value="p">¶ Paragraph</option>
//                     <option value="h1">H1</option>
//                     <option value="h2">H2</option>
//                     <option value="h3">H3</option>
//                     <option value="blockquote">Quote</option>
//                     <option value="codeblock">Code Block</option>
//                   </select>

//                   <span className="tb-sep" />

//                   {/* lists & indent */}
//                   <ToolbarButton title="Numbered list" icon="list-ol"
//                     active={editor?.isActive('orderedList')}
//                     onClick={() => editor?.chain().focus().toggleOrderedList().run()} />
//                   <ToolbarButton title="Bulleted list" icon="list-ul"
//                     active={editor?.isActive('bulletList')}
//                     onClick={() => editor?.chain().focus().toggleBulletList().run()} />
//                   <ToolbarButton
//                     title="Indent (lists)"
//                     icon="angle-right"
//                     onClick={indentList}
//                     disabled={!editor?.isActive('listItem')}
//                   />
//                   <ToolbarButton
//                     title="Outdent (lists)"
//                     icon="angle-left"
//                     onClick={outdentList}
//                     disabled={!editor?.isActive('listItem')}
//                   />

//                   <span className="tb-sep" />

//                   {/* alignment */}
//                   <ToolbarButton title="Align left" icon="align-left"
//                     onClick={() => editor?.chain().focus().setTextAlign('left').run()} />
//                   <ToolbarButton title="Align center" icon="align-center"
//                     onClick={() => editor?.chain().focus().setTextAlign('center').run()} />
//                   <ToolbarButton title="Align right" icon="align-right"
//                     onClick={() => editor?.chain().focus().setTextAlign('right').run()} />
//                   <ToolbarButton title="Justify" icon="align-justify"
//                     onClick={() => editor?.chain().focus().setTextAlign('justify').run()} />

//                   <span className="tb-sep" />

//                   {/* link / media / hr */}
//                    {/* ——— Quick insert “+” menu ——— */}
// <div className="tb-more" ref={moreRef}>
//   <button
//     type="button"
//     className="tb-btn tb-plus"
//     title="More"
//     onClick={() => setMoreOpen(o => !o)}
//     aria-expanded={moreOpen}
//     aria-haspopup="menu"
//   >
//     <i className="fas fa-plus" />
//   </button>

//   {moreOpen && (
//     <div className="tb-more-panel" role="menu">
//       <button className="tb-item" onClick={addLink}>
//         <i className="fas fa-link" /><span>Insert link</span>
//       </button>
//       <button className="tb-item" onClick={removeLink}>
//         <i className="fas fa-unlink" /><span>Remove link</span>
//       </button>

//       <button className="tb-item" onClick={() => imgInputRef.current?.click()}>
//         <i className="fas fa-image" /><span>Insert image</span>
//       </button>
//       <input ref={imgInputRef} type="file" hidden accept="image/*" onChange={handleImgUpload} />

//       <button className="tb-item" onClick={() => fileInputRef.current?.click()}>
//         <i className="fas fa-file" /><span>Attach file</span>
//       </button>
//       <input ref={fileInputRef} type="file" hidden onChange={handleFileAttach} />

//       <button className="tb-item" onClick={insertYouTube}>
//         <i className="fas fa-video" /><span>Insert YouTube</span>
//       </button>
//       <button className="tb-item" onClick={insertHR}>
//         <i className="fas fa-minus" /><span>Horizontal rule</span>
//       </button>

//       <div className="tb-divider" />

//       <button className="tb-item" onClick={clearFormatting}>
//         <i className="fas fa-eraser" /><span>Clear formatting</span>
//       </button>
//       <button className="tb-item" onClick={() => editor?.chain().focus().undo().run()}>
//         <i className="fas fa-undo" /><span>Undo</span>
//       </button>
//       <button className="tb-item" onClick={() => editor?.chain().focus().redo().run()}>
//         <i className="fas fa-redo" /><span>Redo</span>
//       </button>
//     </div>
//   )}
// </div>

// <span className="tb-sep" />

//                 </div>

//                 {/* image bubble tools */}
//                 {editor && (
//                   <BubbleMenu
//                     editor={editor}
//                     shouldShow={({ editor }) => editor.isActive('image')}
//                     tippyOptions={{ duration: 0 }}
//                   >
//                     <div className="bubble-tools">
//                       <MDBBtn type="button" size="sm" color="light"
//                         onClick={() => document.getElementById('img-edit-upload').click()} title="Replace image">
//                         <MDBIcon fas icon="pencil-alt" />
//                       </MDBBtn>
//                       <MDBBtn type="button" size="sm" color="light"
//                         onClick={() => editor.chain().focus().deleteSelection().run()} title="Delete image">
//                         <MDBIcon fas icon="trash" />
//                       </MDBBtn>
//                     </div>
//                   </BubbleMenu>
//                 )}
//                 <input id="img-edit-upload" hidden type="file" accept="image/*" onChange={handleReplaceSelectedImage} />
//               </div>

//               {/* ===== Actions (preview / publish / save) ===== */}
//               <div className="write-actions mt-5" aria-label="article actions">
//                 <button type="button" className="btn-preview pill-btn" onClick={() => setPreviewOpen(true)}>
//                   Preview
//                 </button>
//                 <button type="button" className="btn-publish pill-btn" disabled={publishing} onClick={handleSubmit}>
//                   {publishing ? (<><MDBSpinner size="sm" tag="span" className="me-2" role="status" />Publishing…</>) : 'PUBLISH'}
//                 </button>
//                 <div className="save-row">
//                   <button type="button" className="save-draft-link" onClick={handleSaveDraft}>Save as Draft</button>
//                 </div>
//               </div>
//             </MDBCol>
//           </MDBRow>
//         </div>
//       </MDBContainer>

//       {/* PREVIEW OVERLAY */}
//       <PreviewOverlay
//         open={previewOpen}
//         onClose={() => setPreviewOpen(false)}
//         onPublish={handleSubmit}
//         title={title}
//         tags={tags}
//         coverUrl={coverURL}
//         bodyHTML={editor?.getHTML?.() || ''}
//       />
//     </div>
//   );
// }

// /* ---------- Preview overlay (unchanged except for formatting) ---------- */
// function PreviewOverlay({ open, onClose, onPublish, title, tags, coverUrl, bodyHTML }) {
//   if (!open) return null;

//   return (
//     <div className="preview-overlay" role="dialog" aria-modal="true">
//       <div className="preview-panel">
//         <div className="preview-header">
//           <div className="preview-cover">
//             {coverUrl ? (
//               <img src={coverUrl} alt="Cover" />
//             ) : (
//               <div className="preview-cover--empty">
//                 <i className="far fa-image" />
//               </div>
//             )}
//           </div>

//           <div className="preview-meta">
//             <h1 className="preview-title">{title || 'Untitled'}</h1>

//             {Array.isArray(tags) && tags.length > 0 && (
//               <div className="preview-tags">
//                 {tags.map(t => (
//                   <span key={t} className="chip chip-outline">#{t}</span>
//                 ))}
//               </div>
//             )}

//             <div
//               className="preview-body"
//               dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(bodyHTML || '') }}
//             />
//           </div>
//         </div>

//         <div className="preview-actions">
//           <button type="button" className="btn-preview pill-btn" onClick={onClose}>Back</button>
//         </div>
//       </div>
//     </div>
//   );
// }





// import React, { useState, useEffect, useMemo, useRef } from 'react';
// import { createPortal } from 'react-dom';
// import { useNavigate, useParams, Link, useLocation } from 'react-router-dom';
// import { useAuth } from '../../context/AuthContext';
// import { createArticle, updateArticle } from '../../configs/useArticles';
// import {
//   createDraft,
//   updateDraft,
//   deleteDraft,
//   getDraftOnce,
// } from '../../configs/useArticles';
// import { ref as rtdbRef, get as rtdbGet, remove as rtdbRemove } from 'firebase/database';
// import { rtdb, db as fsDb, storage } from '../../configs/firebase';
// import {
//   doc, setDoc, collection, onSnapshot,
//   serverTimestamp, increment,
// } from 'firebase/firestore';
// import { uploadBytes, getDownloadURL, ref as sRef } from 'firebase/storage';
// import DOMPurify from 'dompurify';

// import '../../styles/writearticlepage.css';
// import 'mdb-react-ui-kit/dist/css/mdb.min.css';
// import '@fortawesome/fontawesome-free/css/all.min.css';

// import { useEditor, EditorContent, BubbleMenu } from '@tiptap/react';
// import StarterKit from '@tiptap/starter-kit';
// import Underline from '@tiptap/extension-underline';
// import TextStyle from '@tiptap/extension-text-style';
// import Color from '@tiptap/extension-color';
// import Highlight from '@tiptap/extension-highlight';
// import LinkExt from '@tiptap/extension-link';
// import Image from '@tiptap/extension-image';
// import Youtube from '@tiptap/extension-youtube';
// import TextAlign from '@tiptap/extension-text-align';

// import Picker from '@emoji-mart/react';
// import emojiData from '@emoji-mart/data';

// import { MDBContainer, MDBRow, MDBCol, MDBBtn, MDBIcon, MDBSpinner } from 'mdb-react-ui-kit';

// /* ---------- tiny button primitive for the toolbar ---------- */
// function ToolbarButton({ title, icon, onClick, active, disabled }) {
//   return (
//     <button
//       type="button"
//       className={`tb-btn${active ? ' is-active' : ''}`}
//       title={title}
//       onClick={onClick}
//       disabled={disabled}
//       aria-pressed={!!active}
//       aria-label={title}
//     >
//       <i className={`fas fa-${icon}`} />
//     </button>
//   );
// }

// export default function WriteArticle() {
//   const { currentUser } = useAuth();
//   const nav = useNavigate();
//   const { id } = useParams();
//   const location = useLocation();
//   const isDraftMode = new URLSearchParams(location.search).get('draft') === '1';
//   const isEdit = Boolean(id);

//   const [suggestedTags, setSuggestedTags] = useState([]);
//   const [publishing, setPublishing] = useState(false);
//   const [previewOpen, setPreviewOpen] = useState(false);

//   const [title, setTitle] = useState('');
//   const [tags, setTags] = useState([]);
//   const [draftTag, setDraftTag] = useState('');
//   const [coverFile, setCoverFile] = useState(null);
//   const [coverURL, setCoverURL] = useState(null);
//   const [isEmpty, setIsEmpty] = useState(true);

//   // toolbar refs
//   const imgInputRef = useRef(null);
//   const fileInputRef = useRef(null);
//   const [moreOpen, setMoreOpen] = useState(false);
//   const moreRef = useRef(null);
//   const [morePos, setMorePos] = useState({ top: 0, left: 0 });
//   const morePanelRef = useRef(null);

//   // emoji picker state/refs
//   const [pickerVisible, setPickerVisible] = useState(false);
//   const emojiBtnRef = useRef(null);
//   const emojiPanelRef = useRef(null);
//   const [emojiPos, setEmojiPos] = useState({ top: 0, left: 0 });

//   /* ---------- tags (firestore) ---------- */
//   useEffect(() => {
//     if (!currentUser) return;
//     const unsub = onSnapshot(collection(fsDb, 'tags'), snap => {
//       const tags = snap.docs.map(d => ({ name: d.id, count: d.data().count || 0 }));
//       tags.sort((a, b) => b.count - a.count);
//       setSuggestedTags(tags);
//     });
//     return () => unsub();
//   }, [currentUser]);

//   /* ---------- editor ---------- */
//   const editor = useEditor({
//     extensions: [
//       StarterKit.configure({ heading: { levels: [1, 2, 3] } }),
//       Underline,
//       TextStyle,
//       Color,
//       Highlight,
//       LinkExt.configure({ openOnClick: false, HTMLAttributes: { rel: 'noopener nofollow' } }),
//       Image.configure({ allowBase64: true, HTMLAttributes: { class: 'article-img' } }),
//       Youtube.configure({ inline: false, width: 640 }),
//       TextAlign.configure({ types: ['heading', 'paragraph'] }),
//     ],
//     content: '<p></p>',
//     onUpdate({ editor }) {
//       const txt = editor.state.doc.textContent.trim();
//       setIsEmpty(txt.length === 0);
//     },
//   });

//   /* ---------- load article/draft ---------- */
//   useEffect(() => {
//     if (!isEdit || !editor) return;

//     const setFrom = (obj) => {
//       setTitle(obj.title || '');
//       setTags(obj.tags || []);
//       setCoverURL(obj.coverUrl || null);
//       editor.commands.setContent(obj.body || '<p></p>');
//     };

//     if (isDraftMode) {
//       getDraftOnce(currentUser.uid, id).then(draft => {
//         if (!draft) { nav('/profile'); return; }
//         setFrom(draft);
//       });
//     } else {
//       rtdbGet(rtdbRef(rtdb, `articles/${id}`)).then(snap => {
//         if (!snap.exists()) { nav('/'); return; }
//         setFrom(snap.val());
//       });
//     }
//   }, [id, isEdit, isDraftMode, nav, editor, currentUser]);

//   /* ---------- tag helpers ---------- */
//   const addTag = name => {
//     const tag = String(name || '').trim().toLowerCase();
//     if (tag && !tags.includes(tag)) setTags(prev => [...prev, tag]);
//   };
//   const removeTag = name => setTags(prev => prev.filter(t => t !== name));
//   const handleDraftKeyDown = e => {
//     if (e.key === 'Enter' && draftTag.trim()) {
//       addTag(draftTag);
//       setDraftTag('');
//     }
//   };

//   /* ---------- click-away for “+ More” and Emoji picker ---------- */
// useEffect(() => {
//   const onDocClick = (e) => {
//     // close More if click is outside its button and panel
//     const inMoreBtn = moreBtnRef.current?.contains(e.target);
//     const inMorePanel = morePanelRef.current?.contains(e.target);
//     if (!inMoreBtn && !inMorePanel) setMoreOpen(false);

//     // close Emoji if click is outside its button and panel
//     const inEmojiBtn = emojiBtnRef.current?.contains(e.target);
//     const inEmojiPanel = emojiPanelRef.current?.contains(e.target);
//     if (!inEmojiBtn && !inEmojiPanel) setPickerVisible(false);
//   };
//   const onEsc = (e) => {
//     if (e.key === 'Escape') { setMoreOpen(false); setPickerVisible(false); }
//   };

//   document.addEventListener('mousedown', onDocClick);
//   document.addEventListener('keydown', onEsc);
//   return () => {
//     document.removeEventListener('mousedown', onDocClick);
//     document.removeEventListener('keydown', onEsc);
//   };
// }, []);

// useEffect(() => {
//   const updatePositions = () => {
//     if (moreOpen && moreBtnRef.current) {
//       const r = moreBtnRef.current.getBoundingClientRect();
//       setMorePos({ top: r.bottom + 8 + window.scrollY, left: r.left + window.scrollX });
//     }
//     if (pickerVisible && emojiBtnRef.current) {
//       const r = emojiBtnRef.current.getBoundingClientRect();
//       setEmojiPos({ top: r.bottom + 8 + window.scrollY, left: r.left + window.scrollX - 8 });
//     }
//   };
//   updatePositions();
//   window.addEventListener('scroll', updatePositions, true);
//   window.addEventListener('resize', updatePositions);
//   return () => {
//     window.removeEventListener('scroll', updatePositions, true);
//     window.removeEventListener('resize', updatePositions);
//   };
// }, [moreOpen, pickerVisible]);


//   // position emoji panel near the smile button
//   useEffect(() => {
//     if (!pickerVisible) return;
//     const rect = emojiBtnRef.current?.getBoundingClientRect();
//     if (rect) {
//       setEmojiPos({
//         top: rect.bottom + 8 + window.scrollY,
//         left: rect.left + window.scrollX - 8,
//       });
//     }
//   }, [pickerVisible]);

//   /* ---------- cover ---------- */
//   const handleCoverSelect = e => {
//     const f = e.target.files?.[0];
//     if (!f) return;
//     setCoverFile(f);
//     const reader = new FileReader();
//     reader.onload = () => setCoverURL(reader.result);
//     reader.readAsDataURL(f);
//   };
//   const removeCoverImage = () => { setCoverFile(null); setCoverURL(null); };

//   /* ---------- inline media ---------- */
//   const handleImgUpload = e => {
//     const file = e.target.files?.[0];
//     if (!file) return;
//     const reader = new FileReader();
//     reader.onload = () => editor?.chain().focus().setImage({ src: reader.result }).run();
//     reader.readAsDataURL(file);
//     e.target.value = '';
//   };
//   const handleReplaceSelectedImage = e => {
//     const file = e.target.files?.[0];
//     if (!file) return;
//     const reader = new FileReader();
//     reader.onload = () => {
//       if (editor?.isActive('image')) {
//         editor.chain().focus().updateAttributes('image', { src: reader.result }).run();
//       }
//     };
//     reader.readAsDataURL(file);
//     e.target.value = '';
//   };

//   /* ---------- toolbar helpers ---------- */
//   const setBlockType = (e) => {
//     const v = e.target.value;
//     const chain = editor?.chain().focus();
//     if (!chain) return;
//     if (v === 'p') chain.setParagraph().run();
//     if (v === 'h1') chain.toggleHeading({ level: 1 }).run();
//     if (v === 'h2') chain.toggleHeading({ level: 2 }).run();
//     if (v === 'h3') chain.toggleHeading({ level: 3 }).run();
//     if (v === 'blockquote') chain.toggleBlockquote().run();
//     if (v === 'codeblock') chain.toggleCodeBlock().run();
//   };
//   const addLink = () => {
//     const url = window.prompt('Enter URL (https://…)');
//     if (!url) return;
//     editor?.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
//   };
//   const removeLink = () => editor?.chain().focus().unsetLink().run();
//   const insertHR = () => editor?.chain().focus().setHorizontalRule().run();
//   const insertYouTube = () => {
//     const url = window.prompt('Paste a YouTube URL');
//     if (!url) return;
//     editor?.chain().focus().setYoutubeVideo({ src: url, width: 640, height: 360 }).run();
//   };
//   const handleFileAttach = async (e) => {
//     const file = e.target.files?.[0];
//     if (!file || !currentUser) return;
//     try {
//       const path = `files/${currentUser.uid}/${Date.now()}_${file.name}`;
//       const ref = sRef(storage, path);
//       await uploadBytes(ref, file);
//       const url = await getDownloadURL(ref);
//       editor?.chain().focus()
//         .insertContent(`<a href="${url}" rel="noopener nofollow" target="_blank">${file.name}</a>`)
//         .run();
//     } finally {
//       e.target.value = '';
//     }
//   };
//   const clearFormatting = () => editor?.chain().focus().clearNodes().unsetAllMarks().run();
//   const indentList = () => editor?.chain().focus().sinkListItem('listItem').run();
//   const outdentList = () => editor?.chain().focus().liftListItem('listItem').run();

//   /* ---------- emoji handlers ---------- */
//   const handleEmojiSelect = (emoji) => {
//     const char = emoji?.native || '';
//     if (!char) return;
//     editor?.chain().focus().insertContent(char).run();
//     setPickerVisible(false);
//   };

//   /* ---------- submit & draft ---------- */
//   const handleSubmit = async () => {
//     if (publishing) return;
//     const body = editor.getHTML();
//     const bodyText = body.replace(/<[^>]*>?/gm, '').trim();
//     if (!title.trim() || !bodyText) { alert('Title and body are required'); return; }
//     setPublishing(true);
//     try {
//       let coverDownloadURL = coverURL;
//       if (coverFile) {
//         const path = `covers/${currentUser.uid}/${Date.now()}_${coverFile.name}`;
//         const ref = sRef(storage, path);
//         await uploadBytes(ref, coverFile);
//         coverDownloadURL = await getDownloadURL(ref);
//       }
//       const ts = Date.now();
//       const payload = {
//         title, body, tags,
//         coverUrl: coverDownloadURL || '',
//         authorId: currentUser.uid,
//         createdAt: ts, updatedAt: ts,
//       };

//       let artId;
//       if (isEdit && !isDraftMode) {
//         await updateArticle(id, payload);
//         artId = id;
//       } else {
//         const res = await createArticle(payload);
//         artId = res.id;
//         if (isDraftMode) await deleteDraft(currentUser.uid, id);
//       }

//       await Promise.all(
//         tags.map(async t => {
//           const refDoc = doc(fsDb, 'tags', t);
//           await setDoc(refDoc, { count: increment(1), updatedAt: serverTimestamp() }, { merge: true });
//         })
//       );

//       nav(`/article/${artId}`);
//     } catch (e) {
//       console.error(e);
//       alert('Something went wrong, please try again.');
//       setPublishing(false);
//     }
//   };

//   const handleSaveDraft = async () => {
//     if (!currentUser) { alert('Please sign in first.'); return; }
//     try {
//       const body = editor.getHTML();
//       const ts = Date.now();
//       const draftPayload = {
//         userId: currentUser.uid,
//         title: title || '(untitled)',
//         body, tags,
//         coverUrl: coverURL || '',
//         status: 'draft',
//         createdAt: ts,
//         updatedAt: ts,
//       };

//       if (isEdit && isDraftMode) {
//         await updateDraft(currentUser.uid, id, draftPayload);
//       } else {
//         await createDraft(currentUser.uid, draftPayload);
//       }
//       alert('Draft saved.');
//     } catch (e) {
//       console.error('Draft save error:', e);
//       alert('Could not save draft. Please try again.');
//     }
//   };

//   const handleDelete = async () => {
//     if (!isEdit) return;
//     const ok = window.confirm('Delete this article permanently?');
//     if (!ok) return;
//     try {
//       if (isDraftMode) {
//         await deleteDraft(currentUser.uid, id);
//         alert('Draft deleted.');
//         nav('/profile');
//       } else {
//         await rtdbRemove(rtdbRef(rtdb, `articles/${id}`));
//         alert('Article deleted.');
//         nav('/');
//       }
//     } catch {
//       alert('Failed to delete. Try again.');
//     }
//   };

//   const dateString = useMemo(() => {
//     const now = new Date();
//     const opts = { year: 'numeric', month: 'long', day: 'numeric' };
//     return now.toLocaleDateString(undefined, opts);
//   }, []);

//   return (
//     <div style={{ backgroundColor: '#F1F1E6' }}>
//       <MDBContainer className="write-wrap py-4">
//         <div className="write-topbar bounded mb-4">
//           <Link to="/" className="topbar-link">
//             <MDBIcon fas icon="arrow-left" className="me-2" /> back to home
//           </Link>
//           {isEdit && (
//             <button type="button" className="topbar-delete-btn" onClick={handleDelete}>
//               <MDBIcon fas icon="trash-alt" className="me-2" /> {isDraftMode ? 'delete draft' : 'delete article'}
//             </button>
//           )}
//         </div>

//         <div className="bounded">
//           <MDBRow className="justify-content-center">
//             <MDBCol md="10" lg="9">
//               <div className="write-meta grid mt-2">
//                 <div className="cover-col">
//                   <button
//                     type="button"
//                     className="cover-circle"
//                     onClick={() => document.getElementById('cover-input').click()}
//                     title="Select cover"
//                   >
//                     {coverURL ? (
//                       <img src={coverURL} alt="cover" />
//                     ) : (
//                       <div className="cover-empty">
//                         <i className="far fa-image" />
//                         <span>Cover Image</span>
//                       </div>
//                     )}
//                     {coverURL && (
//                       <span
//                         className="cover-remove"
//                         title="Remove"
//                         onClick={(e) => { e.stopPropagation(); removeCoverImage(); }}
//                       >
//                         <i className="fas fa-times" />
//                       </span>
//                     )}
//                   </button>
//                   <input id="cover-input" hidden type="file" accept="image/*" onChange={handleCoverSelect} />
//                 </div>

//                 <div className="meta-divider" aria-hidden />

//                 <div className="title-col">
//                   <div className="write-date">{dateString}</div>
//                   <input
//                     className="title-input"
//                     placeholder="TITLE"
//                     value={title}
//                     onChange={e => setTitle(e.target.value)}
//                   />

//                   <div className="tag-suggest">
//                     {suggestedTags.slice(0, 8).map(({ name }) => (
//                       <button
//                         type="button"
//                         key={name}
//                         className="chip chip-outline"
//                         onClick={() => addTag(name)}
//                         title={`Add #${name}`}
//                       >
//                         #{name}
//                       </button>
//                     ))}
//                   </div>

//                   {tags.length > 0 && (
//                     <div className="tags-row mt-3">
//                       {tags.map(t => (
//                         <span key={t} className="chip chip-filled">
//                           #{t}
//                           <button type="button" className="chip-x" onClick={() => removeTag(t)} title="Remove">
//                             <i className="fas fa-times" />
//                           </button>
//                         </span>
//                       ))}
//                       {/* manual entry block could go here if you re-enable it */}
//                     </div>
//                   )}
//                 </div>
//               </div>

//               {/* ===== Editor ===== */}
//               <div className="editor-shell mt-5">
//                 <div
//                   className="editor-canvas transparent"
//                   onClick={() => editor?.chain().focus().run()}
//                   role="textbox"
//                   aria-label="Article body editor"
//                 >
//                   {isEmpty && <div className="editor-placeholder">Write your article here…</div>}
//                   <EditorContent editor={editor} />
//                 </div>

//                 {/* ===== Toolbar ===== */}
//                 <div className="editor-toolbar bottom shadow-soft">
//                   {/* inline styles */}
//                   <ToolbarButton title="Bold" icon="bold"
//                     active={editor?.isActive('bold')}
//                     onClick={() => editor?.chain().focus().toggleBold().run()} />
//                   <ToolbarButton title="Italic" icon="italic"
//                     active={editor?.isActive('italic')}
//                     onClick={() => editor?.chain().focus().toggleItalic().run()} />
//                   <ToolbarButton title="Underline" icon="underline"
//                     active={editor?.isActive('underline')}
//                     onClick={() => editor?.chain().focus().toggleUnderline().run()} />
//                   <ToolbarButton title="Strikethrough" icon="strikethrough"
//                     active={editor?.isActive('strike')}
//                     onClick={() => editor?.chain().focus().toggleStrike().run()} />

//                   {/* color & highlight */}
//                   <label className="tb-color" title="Text color">
//                     <input type="color"
//                       onChange={e => editor?.chain().focus().setColor(e.target.value).run()} />
//                   </label>
//                   <ToolbarButton title="Highlight" icon="highlighter"
//                     active={editor?.isActive('highlight')}
//                     onClick={() => editor?.chain().focus().toggleHighlight().run()} />

//                   {/* emoji (opens emoji-mart) */}
//                   <button
//                     type="button"
//                     ref={emojiBtnRef}
//                     className="tb-btn"
//                     title="Emoji"
//                     onClick={() => setPickerVisible(v => !v)}
//                     aria-expanded={pickerVisible}
//                     aria-haspopup="dialog"
//                   >
//                     <i className="fas fa-smile" />
//                   </button>

//                   <span className="tb-sep" />

//                   {/* block type menu */}
//                   <select
//                     className="tb-select"
//                     aria-label="Block type"
//                     value={
//                       editor?.isActive('heading', { level: 1 }) ? 'h1' :
//                       editor?.isActive('heading', { level: 2 }) ? 'h2' :
//                       editor?.isActive('heading', { level: 3 }) ? 'h3' :
//                       editor?.isActive('blockquote') ? 'blockquote' :
//                       editor?.isActive('codeBlock') ? 'codeblock' : 'p'
//                     }
//                     onChange={setBlockType}
//                   >
//                     <option value="p">¶ Paragraph</option>
//                     <option value="h1">H1</option>
//                     <option value="h2">H2</option>
//                     <option value="h3">H3</option>
//                     <option value="blockquote">Quote</option>
//                     <option value="codeblock">Code Block</option>
//                   </select>

//                   <span className="tb-sep" />

//                   {/* lists & indent */}
//                   <ToolbarButton title="Numbered list" icon="list-ol"
//                     active={editor?.isActive('orderedList')}
//                     onClick={() => editor?.chain().focus().toggleOrderedList().run()} />
//                   <ToolbarButton title="Bulleted list" icon="list-ul"
//                     active={editor?.isActive('bulletList')}
//                     onClick={() => editor?.chain().focus().toggleBulletList().run()} />
//                   <ToolbarButton
//                     title="Indent (lists)"
//                     icon="angle-right"
//                     onClick={indentList}
//                     disabled={!editor?.isActive('listItem')}
//                   />
//                   <ToolbarButton
//                     title="Outdent (lists)"
//                     icon="angle-left"
//                     onClick={outdentList}
//                     disabled={!editor?.isActive('listItem')}
//                   />

//                   <span className="tb-sep" />

//                   {/* alignment */}
//                   <ToolbarButton title="Align left" icon="align-left"
//                     onClick={() => editor?.chain().focus().setTextAlign('left').run()} />
//                   <ToolbarButton title="Align center" icon="align-center"
//                     onClick={() => editor?.chain().focus().setTextAlign('center').run()} />
//                   <ToolbarButton title="Align right" icon="align-right"
//                     onClick={() => editor?.chain().focus().setTextAlign('right').run()} />
//                   <ToolbarButton title="Justify" icon="align-justify"
//                     onClick={() => editor?.chain().focus().setTextAlign('justify').run()} />

//                   <span className="tb-sep" />

//                   {/* ——— Quick insert “+” menu ——— */}
//                   <div className="tb-more" ref={moreRef}>
//                     <button
//                       type="button"
//                       className="tb-btn tb-plus"
//                       title="More"
//                       onClick={() => setMoreOpen(o => !o)}
//                       aria-expanded={moreOpen}
//                       aria-haspopup="menu"
//                     >
//                       <i className="fas fa-plus" />
//                     </button>

//                     {moreOpen && (
//                       <div className="tb-more-panel" role="menu">
//                         <button className="tb-item" onClick={addLink}>
//                           <i className="fas fa-link" /><span>Insert link</span>
//                         </button>
//                         <button className="tb-item" onClick={removeLink}>
//                           <i className="fas fa-unlink" /><span>Remove link</span>
//                         </button>

//                         <button className="tb-item" onClick={() => imgInputRef.current?.click()}>
//                           <i className="fas fa-image" /><span>Insert image</span>
//                         </button>
//                         <input ref={imgInputRef} type="file" hidden accept="image/*" onChange={handleImgUpload} />

//                         <button className="tb-item" onClick={() => fileInputRef.current?.click()}>
//                           <i className="fas fa-file" /><span>Attach file</span>
//                         </button>
//                         <input ref={fileInputRef} type="file" hidden onChange={handleFileAttach} />

//                         <button className="tb-item" onClick={insertYouTube}>
//                           <i className="fas fa-video" /><span>Insert YouTube</span>
//                         </button>
//                         <button className="tb-item" onClick={insertHR}>
//                           <i className="fas fa-minus" /><span>Horizontal rule</span>
//                         </button>

//                         <div className="tb-divider" />

//                         <button className="tb-item" onClick={clearFormatting}>
//                           <i className="fas fa-eraser" /><span>Clear formatting</span>
//                         </button>
//                         <button className="tb-item" onClick={() => editor?.chain().focus().undo().run()}>
//                           <i className="fas fa-undo" /><span>Undo</span>
//                         </button>
//                         <button className="tb-item" onClick={() => editor?.chain().focus().redo().run()}>
//                           <i className="fas fa-redo" /><span>Redo</span>
//                         </button>
//                       </div>
//                     )}
//                   </div>

//                   <span className="tb-sep" />
//                 </div>

//                 {/* Emoji picker popover (emoji-mart) */}
//                 {pickerVisible && (
//                   <div
//                     ref={emojiPanelRef}
//                     className="emoji-all-pop"
//                     style={{ position: 'absolute', top: emojiPos.top, left: emojiPos.left }}
//                     role="dialog"
//                     aria-modal="true"
//                   >
//                     <Picker
//                       data={emojiData}
//                       onEmojiSelect={handleEmojiSelect}
//                       theme="light"
//                       navPosition="bottom"
//                       previewPosition="none"
//                       searchPosition="top"
//                       perLine={8}
//                     />
//                   </div>
//                 )}

//                 {/* image bubble tools */}
//                 {editor && (
//                   <BubbleMenu
//                     editor={editor}
//                     shouldShow={({ editor }) => editor.isActive('image')}
//                     tippyOptions={{ duration: 0 }}
//                   >
//                     <div className="bubble-tools">
//                       <MDBBtn type="button" size="sm" color="light"
//                         onClick={() => document.getElementById('img-edit-upload').click()} title="Replace image">
//                         <MDBIcon fas icon="pencil-alt" />
//                       </MDBBtn>
//                       <MDBBtn type="button" size="sm" color="light"
//                         onClick={() => editor.chain().focus().deleteSelection().run()} title="Delete image">
//                         <MDBIcon fas icon="trash" />
//                       </MDBBtn>
//                     </div>
//                   </BubbleMenu>
//                 )}
//                 <input id="img-edit-upload" hidden type="file" accept="image/*" onChange={handleReplaceSelectedImage} />
//               </div>

//               {/* ===== Actions (preview / publish / save) ===== */}
//               <div className="write-actions mt-5" aria-label="article actions">
//                 <button type="button" className="btn-preview pill-btn" onClick={() => setPreviewOpen(true)}>
//                   Preview
//                 </button>
//                 <button type="button" className="btn-publish pill-btn" disabled={publishing} onClick={handleSubmit}>
//                   {publishing ? (<><MDBSpinner size="sm" tag="span" className="me-2" role="status" />Publishing…</>) : 'PUBLISH'}
//                 </button>
//                 <div className="save-row">
//                   <button type="button" className="save-draft-link" onClick={handleSaveDraft}>Save as Draft</button>
//                 </div>
//               </div>
//             </MDBCol>
//           </MDBRow>
//         </div>
//       </MDBContainer>

//       {/* PREVIEW OVERLAY */}
//       <PreviewOverlay
//         open={previewOpen}
//         onClose={() => setPreviewOpen(false)}
//         onPublish={handleSubmit}
//         title={title}
//         tags={tags}
//         coverUrl={coverURL}
//         bodyHTML={editor?.getHTML?.() || ''}
//       />
//     </div>
//   );
// }

// /* ---------- Preview overlay ---------- */
// function PreviewOverlay({ open, onClose, onPublish, title, tags, coverUrl, bodyHTML }) {
//   if (!open) return null;

//   return (
//     <div className="preview-overlay" role="dialog" aria-modal="true">
//       <div className="preview-panel">
//         <div className="preview-header">
//           <div className="preview-cover">
//             {coverUrl ? (
//               <img src={coverUrl} alt="Cover" />
//             ) : (
//               <div className="preview-cover--empty">
//                 <i className="far fa-image" />
//               </div>
//             )}
//           </div>

//           <div className="preview-meta">
//             <h1 className="preview-title">{title || 'Untitled'}</h1>

//             {Array.isArray(tags) && tags.length > 0 && (
//               <div className="preview-tags">
//                 {tags.map(t => (
//                   <span key={t} className="chip chip-outline">#{t}</span>
//                 ))}
//               </div>
//             )}

//             <div
//               className="preview-body"
//               dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(bodyHTML || '') }}
//             />
//           </div>
//         </div>

//         <div className="preview-actions">
//           <button type="button" className="btn-preview pill-btn" onClick={onClose}>Back</button>
//         </div>
//       </div>
//     </div>
//   );
// }


// Correct one below

// import React, { useState, useEffect, useMemo, useRef } from 'react';
// import { createPortal } from 'react-dom';
// import { useNavigate, useParams, Link, useLocation } from 'react-router-dom';
// import { useAuth } from '../../context/AuthContext';
// import { createArticle, updateArticle } from '../../configs/useArticles';
// import {
//   createDraft,
//   updateDraft,
//   deleteDraft,
//   getDraftOnce,
// } from '../../configs/useArticles';
// import { ref as rtdbRef, get as rtdbGet, remove as rtdbRemove } from 'firebase/database';
// import { rtdb, db as fsDb, storage } from '../../configs/firebase';
// import {
//   doc, setDoc, collection, onSnapshot,
//   serverTimestamp, increment,
// } from 'firebase/firestore';
// import { uploadBytes, getDownloadURL, ref as sRef } from 'firebase/storage';
// import DOMPurify from 'dompurify';

// import '../../styles/writearticlepage.css';
// import 'mdb-react-ui-kit/dist/css/mdb.min.css';
// import '@fortawesome/fontawesome-free/css/all.min.css';

// import { useEditor, EditorContent, BubbleMenu } from '@tiptap/react';
// import StarterKit from '@tiptap/starter-kit';
// import Underline from '@tiptap/extension-underline';
// import TextStyle from '@tiptap/extension-text-style';
// import Color from '@tiptap/extension-color';
// import Highlight from '@tiptap/extension-highlight';
// import LinkExt from '@tiptap/extension-link';
// import Image from '@tiptap/extension-image';
// import Youtube from '@tiptap/extension-youtube';
// import TextAlign from '@tiptap/extension-text-align';

// import Picker from '@emoji-mart/react';
// import emojiData from '@emoji-mart/data';

// import { MDBContainer, MDBRow, MDBCol, MDBBtn, MDBIcon, MDBSpinner } from 'mdb-react-ui-kit';

// /* ---------- tiny button primitive for the toolbar ---------- */
// function ToolbarButton({ title, icon, onClick, active, disabled }) {
//   return (
//     <button
//       type="button"
//       className={`tb-btn${active ? ' is-active' : ''}`}
//       title={title}
//       onClick={onClick}
//       disabled={disabled}
//       aria-pressed={!!active}
//       aria-label={title}
//     >
//       <i className={`fas fa-${icon}`} />
//     </button>
//   );
// }


// const ResizableImage = Image.extend({
//   addAttributes() {
//     return {
//       ...this.parent?.(),

//       // keep your class on the <img>
//       class: {
//         default: 'article-img',
//         parseHTML: element => element.getAttribute('class'),
//         renderHTML: attributes => ({ class: 'article-img' }),
//       },

//       // allow a custom attribute to control CSS width
//       'data-size': {
//         default: null, // sm | md | lg
//         parseHTML: element => element.getAttribute('data-size'),
//         renderHTML: attributes => {
//           if (!attributes['data-size']) return {};
//           return { 'data-size': attributes['data-size'] };
//         },
//       },
//     };
//   },
// });


// export default function WriteArticle() {
//   const { currentUser } = useAuth();
//   const nav = useNavigate();
//   const { id } = useParams();
//   const location = useLocation();
//   const isDraftMode = new URLSearchParams(location.search).get('draft') === '1';
//   const isEdit = Boolean(id);

//   const [suggestedTags, setSuggestedTags] = useState([]);
//   const [publishing, setPublishing] = useState(false);
//   const [previewOpen, setPreviewOpen] = useState(false);

//   const [title, setTitle] = useState('');
//   const [tags, setTags] = useState([]);
//   const [draftTag, setDraftTag] = useState('');
//   const [coverFile, setCoverFile] = useState(null);
//   const [coverURL, setCoverURL] = useState(null);
//   const [isEmpty, setIsEmpty] = useState(true);
//   const [isFocused, setIsFocused] = useState(false);
//   // hidden inputs
//   const imgInputRef = useRef(null);
//   const fileInputRef = useRef(null);

//   // “+ More” panel (portaled)
//   const [moreOpen, setMoreOpen] = useState(false);
//   const moreBtnRef = useRef(null);
//   const morePanelRef = useRef(null);
//   const [morePos, setMorePos] = useState({ top: 0, left: 0 });

//   // Emoji picker (portaled)
//   const [pickerVisible, setPickerVisible] = useState(false);
//   const emojiBtnRef = useRef(null);
//   const emojiPanelRef = useRef(null);
//   const [emojiPos, setEmojiPos] = useState({ top: 0, left: 0 });

//   const lastSelectionRef = useRef(null);
//   /* ---------- tags (firestore) ---------- */
//   useEffect(() => {
//     if (!currentUser) return;
//     const unsub = onSnapshot(collection(fsDb, 'tags'), snap => {
//       const list = snap.docs.map(d => ({ name: d.id, count: d.data().count || 0 }));
//       list.sort((a, b) => b.count - a.count);
//       setSuggestedTags(list);
//     });
//     return () => unsub();
//   }, [currentUser]);

//   /* ---------- editor ---------- */
//   const editor = useEditor({
//     extensions: [
//       StarterKit.configure({ heading: { levels: [1, 2, 3] } }),
//       Underline,
//       TextStyle,
//       Color,
//       Highlight,
//       LinkExt.configure({ openOnClick: false, HTMLAttributes: { rel: 'noopener nofollow' } }),
//       ResizableImage.configure({ allowBase64: true }),
//       Youtube.configure({ inline: false, width: 640 }),
//       TextAlign.configure({ types: ['heading', 'paragraph'] }),
//     ],
//     content: '<p></p>',
//     onCreate({ editor }) {
//       const txt = editor.state.doc.textContent.trim();
//       setIsEmpty(txt.length === 0);
//     },
//     onUpdate({ editor }) {
//       const txt = editor.state.doc.textContent.trim();
//       setIsEmpty(txt.length === 0);
//     },
//   });

//   useEffect(() => {
//     if (!editor) return;
//     const onFocus = () => setIsFocused(true);
//     const onBlur = () => setIsFocused(false);
//     editor.on('focus', onFocus);
//     editor.on('blur', onBlur);
//     return () => {
//       editor.off('focus', onFocus);
//       editor.off('blur', onBlur);
//     };
//   }, [editor]);

//   /* ---------- load article/draft ---------- */
//   useEffect(() => {
//     if (!isEdit || !editor) return;

//     const setFrom = (obj) => {
//       setTitle(obj.title || '');
//       setTags(obj.tags || []);
//       setCoverURL(obj.coverUrl || null);
//       editor.commands.setContent(obj.body || '<p></p>');
//     };

//     if (isDraftMode) {
//       getDraftOnce(currentUser.uid, id).then(draft => {
//         if (!draft) { nav('/profile'); return; }
//         setFrom(draft);
//       });
//     } else {
//       rtdbGet(rtdbRef(rtdb, `articles/${id}`)).then(snap => {
//         if (!snap.exists()) { nav('/'); return; }
//         setFrom(snap.val());
//       });
//     }
//   }, [id, isEdit, isDraftMode, nav, editor, currentUser]);

//   /* ---------- tag helpers ---------- */
//   const addTag = name => {
//     const tag = String(name || '').trim().toLowerCase();
//     if (tag && !tags.includes(tag)) setTags(prev => [...prev, tag]);
//   };
//   const removeTag = name => setTags(prev => prev.filter(t => t !== name));
//   const handleDraftKeyDown = e => {
//     if (e.key === 'Enter' && draftTag.trim()) {
//       addTag(draftTag);
//       setDraftTag('');
//     }
//   };

//   /* ---------- click-away + position for portaled panels ---------- */
//   useEffect(() => {
//     const onDocClick = (e) => {
//       // close +More
//       const inMoreBtn = moreBtnRef.current?.contains(e.target);
//       const inMorePanel = morePanelRef.current?.contains(e.target);
//       if (!inMoreBtn && !inMorePanel) setMoreOpen(false);

//       // close Emoji
//       const inEmojiBtn = emojiBtnRef.current?.contains(e.target);
//       const inEmojiPanel = emojiPanelRef.current?.contains(e.target);
//       if (!inEmojiBtn && !inEmojiPanel) setPickerVisible(false);
//     };
//     const onEsc = (e) => {
//       if (e.key === 'Escape') { setMoreOpen(false); setPickerVisible(false); }
//     };
//     document.addEventListener('mousedown', onDocClick);
//     document.addEventListener('keydown', onEsc);
//     return () => {
//       document.removeEventListener('mousedown', onDocClick);
//       document.removeEventListener('keydown', onEsc);
//     };
//   }, []);

//   useEffect(() => {
//     const updatePositions = () => {
//       if (moreOpen && moreBtnRef.current) {
//         const r = moreBtnRef.current.getBoundingClientRect();
//         setMorePos({ top: r.bottom + 8 + window.scrollY, left: r.left + window.scrollX });
//       }
//       if (pickerVisible && emojiBtnRef.current) {
//         const r = emojiBtnRef.current.getBoundingClientRect();
//         setEmojiPos({ top: r.bottom + 8 + window.scrollY, left: r.left + window.scrollX - 8 });
//       }
//     };
//     updatePositions();
//     window.addEventListener('scroll', updatePositions, true);
//     window.addEventListener('resize', updatePositions);
//     return () => {
//       window.removeEventListener('scroll', updatePositions, true);
//       window.removeEventListener('resize', updatePositions);
//     };
//   }, [moreOpen, pickerVisible]);

//   /* ---------- cover ---------- */
//   const handleCoverSelect = e => {
//     const f = e.target.files?.[0];
//     if (!f) return;
//     setCoverFile(f);
//     const reader = new FileReader();
//     reader.onload = () => setCoverURL(reader.result);
//     reader.readAsDataURL(f);
//   };
//   const removeCoverImage = () => { setCoverFile(null); setCoverURL(null); };

//   /* ---------- inline media ---------- */
//   const handleImgUpload = e => {
//     const file = e.target.files?.[0];
//     if (!file) return;
//     const reader = new FileReader();
//     reader.onload = () => editor?.chain().focus().setImage({ src: reader.result }).run();
//     reader.readAsDataURL(file);
//     e.target.value = '';
//   };
//   const handleReplaceSelectedImage = e => {
//     const file = e.target.files?.[0];
//     if (!file) return;
//     const reader = new FileReader();
//     reader.onload = () => {
//       if (editor?.isActive('image')) {
//         editor.chain().focus().updateAttributes('image', { src: reader.result }).run();
//       }
//     };
//     reader.readAsDataURL(file);
//     e.target.value = '';
//   };

//   /* ---------- toolbar helpers ---------- */
//   const rememberSelection = () => {
//   if (!editor) return;
//   const { from, to } = editor.state.selection;
//   lastSelectionRef.current = { from, to };
// };

// const setBlockType = (e) => {
//   const v = e.target.value;
//   const sel = lastSelectionRef.current;

//   let chain = editor?.chain().focus();   // 1) focus FIRST
//   if (!chain) return;

//   if (sel) {
//     chain = chain.setTextSelection(sel); // 2) then restore saved selection
//   }

//   // 3) apply the block command to the selection
//   switch (v) {
//     case 'p':
//       chain.setParagraph().run();
//       break;
//     case 'h1':
//       chain.toggleHeading({ level: 1 }).run();
//       break;
//     case 'h2':
//       chain.toggleHeading({ level: 2 }).run();
//       break;
//     case 'h3':
//       chain.toggleHeading({ level: 3 }).run();
//       break;
//     case 'blockquote':
//       chain.toggleBlockquote().run();
//       break;
//     case 'codeblock':
//       chain.toggleCodeBlock().run();
//       break;
//     default:
//       break;
//   }

//   // clear it so future changes don't reuse an old selection
//   lastSelectionRef.current = null;
// };


//   const addLink = () => {
//     const url = window.prompt('Enter URL (https://…)');
//     if (!url) return;
//     editor?.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
//   };
//   const removeLink = () => editor?.chain().focus().unsetLink().run();
//   const insertHR = () => editor?.chain().focus().setHorizontalRule().run();
//   const insertYouTube = () => {
//     const url = window.prompt('Paste a YouTube URL');
//     if (!url) return;
//     editor?.chain().focus().setYoutubeVideo({ src: url, width: 640, height: 360 }).run();
//   };
//   const handleFileAttach = async (e) => {
//     const file = e.target.files?.[0];
//     if (!file || !currentUser) return;
//     try {
//       const path = `files/${currentUser.uid}/${Date.now()}_${file.name}`;
//       const ref = sRef(storage, path);
//       await uploadBytes(ref, file);
//       const url = await getDownloadURL(ref);
//       editor?.chain().focus()
//         .insertContent(`<a href="${url}" rel="noopener nofollow" target="_blank">${file.name}</a>`)
//         .run();
//     } finally {
//       e.target.value = '';
//     }
//   };
//   const clearFormatting = () => editor?.chain().focus().clearNodes().unsetAllMarks().run();
//   const indentList = () => editor?.chain().focus().sinkListItem('listItem').run();
//   const outdentList = () => editor?.chain().focus().liftListItem('listItem').run();

//   /* ---------- emoji select ---------- */
//   const handleEmojiSelect = (emoji) => {
//     const char = emoji?.native || '';
//     if (!char) return;
//     editor?.chain().focus().insertContent(char).run();
//     setPickerVisible(false);
//   };

//   /* ---------- submit & draft ---------- */
//   const handleSubmit = async () => {
//     if (publishing) return;
//     const body = editor.getHTML();
//     const bodyText = body.replace(/<[^>]*>?/gm, '').trim();
//     if (!title.trim() || !bodyText) { alert('Title and body are required'); return; }
//     setPublishing(true);
//     try {
//       let coverDownloadURL = coverURL;
//       if (coverFile) {
//         const path = `covers/${currentUser.uid}/${Date.now()}_${coverFile.name}`;
//         const ref = sRef(storage, path);
//         await uploadBytes(ref, coverFile);
//         coverDownloadURL = await getDownloadURL(ref);
//       }
//       const ts = Date.now();
//       const payload = {
//         title, body, tags,
//         coverUrl: coverDownloadURL || '',
//         authorId: currentUser.uid,
//         createdAt: ts, updatedAt: ts,
//       };

//       let artId;
//       if (isEdit && !isDraftMode) {
//         await updateArticle(id, payload);
//         artId = id;
//       } else {
//         const res = await createArticle(payload);
//         artId = res.id;
//         if (isDraftMode) await deleteDraft(currentUser.uid, id);
//       }

//       await Promise.all(
//         tags.map(async t => {
//           const refDoc = doc(fsDb, 'tags', t);
//           await setDoc(refDoc, { count: increment(1), updatedAt: serverTimestamp() }, { merge: true });
//         })
//       );

//       nav(`/article/${artId}`);
//     } catch (e) {
//       console.error(e);
//       alert('Something went wrong, please try again.');
//       setPublishing(false);
//     }
//   };

//   const handleSaveDraft = async () => {
//     if (!currentUser) { alert('Please sign in first.'); return; }
//     try {
//       const body = editor.getHTML();
//       const ts = Date.now();
//       const draftPayload = {
//         userId: currentUser.uid,
//         title: title || '(untitled)',
//         body, tags,
//         coverUrl: coverURL || '',
//         status: 'draft',
//         createdAt: ts,
//         updatedAt: ts,
//       };

//       if (isEdit && isDraftMode) {
//         await updateDraft(currentUser.uid, id, draftPayload);
//       } else {
//         await createDraft(currentUser.uid, draftPayload);
//       }
//       alert('Draft saved.');
//     } catch (e) {
//       console.error('Draft save error:', e);
//       alert('Could not save draft. Please try again.');
//     }
//   };

//   const handleDelete = async () => {
//     if (!isEdit) return;
//     const ok = window.confirm('Delete this article permanently?');
//     if (!ok) return;
//     try {
//       if (isDraftMode) {
//         await deleteDraft(currentUser.uid, id);
//         alert('Draft deleted.');
//         nav('/profile');
//       } else {
//         await rtdbRemove(rtdbRef(rtdb, `articles/${id}`));
//         alert('Article deleted.');
//         nav('/');
//       }
//     } catch {
//       alert('Failed to delete. Try again.');
//     }
//   };

//   const dateString = useMemo(() => {
//     const now = new Date();
//     const opts = { year: 'numeric', month: 'long', day: 'numeric' };
//     return now.toLocaleDateString(undefined, opts);
//   }, []);

//   const setImageSize = (sizeKey) => {
//     if (!editor?.isActive('image')) return;
//     const key = sizeKey === 'sm' || sizeKey === 'lg' ? sizeKey : 'md';
//     editor.chain().focus().updateAttributes('image', { 'data-size': key }).run();
//   };

//   return (
//     <div style={{ backgroundColor: '#F1F1E6' }}>
//       <MDBContainer className="write-wrap py-4">
//         <div className="write-topbar bounded mb-4">
//           <Link to="/" className="topbar-link">
//             <MDBIcon fas icon="arrow-left" className="me-2" /> back to home
//           </Link>
//           {isEdit && (
//             <button type="button" className="topbar-delete-btn" onClick={handleDelete}>
//               <MDBIcon fas icon="trash-alt" className="me-2" /> {isDraftMode ? 'delete draft' : 'delete article'}
//             </button>
//           )}
//         </div>

//         <div className="bounded">
//           <MDBRow className="justify-content-center">
//             <MDBCol md="10" lg="9">
//               <div className="write-meta grid mt-2">
//                 <div className="cover-col">
//                   <button
//                     type="button"
//                     className="cover-circle"
//                     onClick={() => document.getElementById('cover-input').click()}
//                     title="Select cover"
//                   >
//                     {coverURL ? (
//                       <img src={coverURL} alt="cover" />
//                     ) : (
//                       <div className="cover-empty">
//                         <i className="far fa-image" />
//                         <span>Cover Image</span>
//                       </div>
//                     )}
//                     {coverURL && (
//                       <span
//                         className="cover-remove"
//                         title="Remove"
//                         onClick={(e) => { e.stopPropagation(); removeCoverImage(); }}
//                       >
//                         <i className="fas fa-times" />
//                       </span>
//                     )}
//                   </button>
//                   <input id="cover-input" hidden type="file" accept="image/*" onChange={handleCoverSelect} />
//                 </div>

//                 <div className="meta-divider" aria-hidden />

//                 <div className="title-col">
//                   <div className="write-date">{dateString}</div>
//                   <input
//                     className="title-input"
//                     placeholder="TITLE"
//                     value={title}
//                     onChange={e => setTitle(e.target.value)}
//                   />

//                   <div className="tag-suggest">
//                     {suggestedTags.slice(0, 8).map(({ name }) => (
//                       <button
//                         type="button"
//                         key={name}
//                         className="chip chip-outline"
//                         onClick={() => addTag(name)}
//                         title={`Add #${name}`}
//                       >
//                         #{name}
//                       </button>
//                     ))}
//                   </div>

//                   {tags.length > 0 && (
//                     <div className="tags-row mt-3">
//                       {tags.map(t => (
//                         <span key={t} className="chip chip-filled">
//                           #{t}
//                           <button type="button" className="chip-x" onClick={() => removeTag(t)} title="Remove">
//                             <i className="fas fa-times" />
//                           </button>
//                         </span>
//                       ))}
//                     </div>
//                   )}
//                 </div>
//               </div>

//               {/* ===== Editor ===== */}
//               <div className="editor-shell mt-5">
//                 <div
//                   className="editor-canvas transparent"
//                   onClick={() => editor?.chain().focus().run()}
//                   role="textbox"
//                   aria-label="Article body editor"
//                 >
//                     {!isFocused && isEmpty && (
//                     <div className="editor-placeholder" aria-hidden="true">
//                       Write your article here…
//                     </div>
//                   )}                  
//                   <EditorContent editor={editor} />
//                 </div>

//                 {/* ===== Toolbar ===== */}
//                 <div className="editor-toolbar bottom shadow-soft">
//                   {/* inline styles */}
//                   <ToolbarButton title="Bold" icon="bold"
//                     active={editor?.isActive('bold')}
//                     onClick={() => editor?.chain().focus().toggleBold().run()} />
//                   <ToolbarButton title="Italic" icon="italic"
//                     active={editor?.isActive('italic')}
//                     onClick={() => editor?.chain().focus().toggleItalic().run()} />
//                   <ToolbarButton title="Underline" icon="underline"
//                     active={editor?.isActive('underline')}
//                     onClick={() => editor?.chain().focus().toggleUnderline().run()} />
//                   <ToolbarButton title="Strikethrough" icon="strikethrough"
//                     active={editor?.isActive('strike')}
//                     onClick={() => editor?.chain().focus().toggleStrike().run()} />

//                   {/* color & highlight */}
//                   <label className="tb-color" title="Text color">
//                     <input type="color"
//                       onChange={e => editor?.chain().focus().setColor(e.target.value).run()} />
//                   </label>
//                   <ToolbarButton title="Highlight" icon="highlighter"
//                     active={editor?.isActive('highlight')}
//                     onClick={() => editor?.chain().focus().toggleHighlight().run()} />

//                   {/* emoji (opens emoji-mart) */}
//                   <button
//                     type="button"
//                     ref={emojiBtnRef}
//                     className="tb-btn"
//                     title="Emoji"
//                     onClick={() => setPickerVisible(v => !v)}
//                     aria-expanded={pickerVisible}
//                     aria-haspopup="dialog"
//                   >
//                     <i className="fas fa-smile" />
//                   </button>

//                   <span className="tb-sep" />

//                   {/* block type menu */}
//                   <select
//                     className="tb-select"
//                     aria-label="Block type"
//                     value={
//                       editor?.isActive('heading', { level: 1 }) ? 'h1' :
//                       editor?.isActive('heading', { level: 2 }) ? 'h2' :
//                       editor?.isActive('heading', { level: 3 }) ? 'h3' :
//                       editor?.isActive('blockquote') ? 'blockquote' :
//                       editor?.isActive('codeBlock') ? 'codeblock' : 'p'
//                     }
//                     onMouseDown={rememberSelection}
//                     onChange={setBlockType}
//                   >
//                     <option value="p">¶ Paragraph</option>
//                     <option value="h1">H1</option>
//                     <option value="h2">H2</option>
//                     <option value="h3">H3</option>
//                     <option value="blockquote">Quote</option>
//                     <option value="codeblock">Code Block</option>
//                   </select>

//                   <span className="tb-sep" />

//                   {/* lists & indent */}
//                   <ToolbarButton title="Numbered list" icon="list-ol"
//                     active={editor?.isActive('orderedList')}
//                     onClick={() => editor?.chain().focus().toggleOrderedList().run()} />
//                   <ToolbarButton title="Bulleted list" icon="list-ul"
//                     active={editor?.isActive('bulletList')}
//                     onClick={() => editor?.chain().focus().toggleBulletList().run()} />
//                   {/* <ToolbarButton
//                     title="Indent (lists)"
//                     icon="angle-right"
//                     onClick={indentList}
//                     disabled={!editor?.isActive('listItem')}
//                   />
//                   <ToolbarButton
//                     title="Outdent (lists)"
//                     icon="angle-left"
//                     onClick={outdentList}
//                     disabled={!editor?.isActive('listItem')}
//                   /> */}

//                   <span className="tb-sep" />

//                   {/* alignment */}
//                   <ToolbarButton title="Align left" icon="align-left"
//                     onClick={() => editor?.chain().focus().setTextAlign('left').run()} />
//                   <ToolbarButton title="Align center" icon="align-center"
//                     onClick={() => editor?.chain().focus().setTextAlign('center').run()} />
//                   <ToolbarButton title="Align right" icon="align-right"
//                     onClick={() => editor?.chain().focus().setTextAlign('right').run()} />
//                   <ToolbarButton title="Justify" icon="align-justify"
//                     onClick={() => editor?.chain().focus().setTextAlign('justify').run()} />

//                   <span className="tb-sep" />

//                   {/* “+ More” trigger (panel is portaled) */}
//                   <button
//                     type="button"
//                     ref={moreBtnRef}
//                     className="tb-btn tb-plus"
//                     title="More"
//                     onClick={() => setMoreOpen(o => !o)}
//                     aria-expanded={moreOpen}
//                     aria-haspopup="menu"
//                   >
//                     <i className="fas fa-plus" />
//                   </button>
//                 </div>

//                 {/* Hidden inputs for uploads (stay in DOM, not portaled) */}
//                 <input ref={imgInputRef} type="file" hidden accept="image/*" onChange={handleImgUpload} />
//                 <input ref={fileInputRef} type="file" hidden onChange={handleFileAttach} />

//                 {/* Emoji picker (PORTAL) */}
//                 {pickerVisible && createPortal(
//                   <div
//                     ref={emojiPanelRef}
//                     className="emoji-all-pop"
//                     style={{ position: 'absolute', top: emojiPos.top, left: emojiPos.left, zIndex: 9999 }}
//                     role="dialog"
//                     aria-modal="true"
//                   >
//                     <Picker
//                       data={emojiData}
//                       onEmojiSelect={handleEmojiSelect}
//                       theme="light"
//                       navPosition="bottom"
//                       previewPosition="none"
//                       searchPosition="top"
//                       perLine={8}
//                     />
//                   </div>,
//                   document.body
//                 )}

//                 {/* “+ More” panel (PORTAL) */}
//                 {moreOpen && createPortal(
//                   <div
//                     ref={morePanelRef}
//                     className="tb-more-panel"
//                     style={{ position: 'absolute', top: morePos.top, left: morePos.left, zIndex: 9999 }}
//                     role="menu"
//                   >
//                     <button className="tb-item" onClick={addLink}>
//                       <i className="fas fa-link" /><span>Insert link</span>
//                     </button>
//                     <button className="tb-item" onClick={removeLink}>
//                       <i className="fas fa-unlink" /><span>Remove link</span>
//                     </button>

//                     <button className="tb-item" onClick={() => imgInputRef.current?.click()}>
//                       <i className="fas fa-image" /><span>Insert image</span>
//                     </button>
//                     <button className="tb-item" onClick={() => fileInputRef.current?.click()}>
//                       <i className="fas fa-file" /><span>Attach file</span>
//                     </button>

//                     <button className="tb-item" onClick={insertYouTube}>
//                       <i className="fas fa-video" /><span>Insert YouTube</span>
//                     </button>
//                     <button className="tb-item" onClick={insertHR}>
//                       <i className="fas fa-minus" /><span>Horizontal rule</span>
//                     </button>

//                     <div className="tb-divider" />

//                     <button className="tb-item" onClick={clearFormatting}>
//                       <i className="fas fa-eraser" /><span>Clear formatting</span>
//                     </button>
//                     <button className="tb-item" onClick={() => editor?.chain().focus().undo().run()}>
//                       <i className="fas fa-undo" /><span>Undo</span>
//                     </button>
//                     <button className="tb-item" onClick={() => editor?.chain().focus().redo().run()}>
//                       <i className="fas fa-redo" /><span>Redo</span>
//                     </button>
//                   </div>,
//                   document.body
//                 )}

//                 {/* image bubble tools */}
//                 {editor && (
//                   <BubbleMenu
//                     editor={editor}
//                     shouldShow={({ editor }) => editor.isActive('image')}
//                     tippyOptions={{ duration: 0 }}
//                   >
//                     <div className="bubble-tools">
//                        <MDBBtn type="button" size="sm" color="light"
//                         onClick={() => setImageSize('sm')} title="Small image">
//                         S
//                       </MDBBtn>
//                       <MDBBtn type="button" size="sm" color="light"
//                         onClick={() => setImageSize('md')} title="Medium image">
//                         M
//                       </MDBBtn>
//                       <MDBBtn type="button" size="sm" color="light"
//                         onClick={() => setImageSize('lg')} title="Large image">
//                         L
//                       </MDBBtn>
//                       <MDBBtn type="button" size="sm" color="light"
//                         onClick={() => document.getElementById('img-edit-upload').click()} title="Replace image">
//                         <MDBIcon fas icon="pencil-alt" />
//                       </MDBBtn>
//                       <MDBBtn type="button" size="sm" color="light"
//                         onClick={() => editor.chain().focus().deleteSelection().run()} title="Delete image">
//                         <MDBIcon fas icon="trash" />
//                       </MDBBtn>
//                     </div>
//                   </BubbleMenu>
//                 )}
//                 <input id="img-edit-upload" hidden type="file" accept="image/*" onChange={handleReplaceSelectedImage} />
//               </div>

//               {/* ===== Actions ===== */}
//               <div className="write-actions mt-5" aria-label="article actions">
//                 <button type="button" className="btn-preview pill-btn" onClick={() => setPreviewOpen(true)}>
//                   Preview
//                 </button>
//                 <button type="button" className="btn-publish pill-btn" disabled={publishing} onClick={handleSubmit}>
//                   {publishing ? (<><MDBSpinner size="sm" tag="span" className="me-2" role="status" />Publishing…</>) : 'PUBLISH'}
//                 </button>
//                 <div className="save-row">
//                   <button type="button" className="save-draft-link" onClick={handleSaveDraft}>Save as Draft</button>
//                 </div>
//               </div>
//             </MDBCol>
//           </MDBRow>
//         </div>
//       </MDBContainer>

//       {/* PREVIEW OVERLAY */}
//       <PreviewOverlay
//         open={previewOpen}
//         onClose={() => setPreviewOpen(false)}
//         onPublish={handleSubmit}
//         title={title}
//         tags={tags}
//         coverUrl={coverURL}
//         bodyHTML={editor?.getHTML?.() || ''}
//       />
//     </div>
//   );
// }

// /* ---------- Preview overlay ---------- */
// function PreviewOverlay({ open, onClose, onPublish, title, tags, coverUrl, bodyHTML }) {
//   if (!open) return null;

//   return (
//     <div className="preview-overlay" role="dialog" aria-modal="true">
//       <div className="preview-panel">
//         <div className="preview-header">
//           <div className="preview-cover">
//             {coverUrl ? (
//               <img src={coverUrl} alt="Cover" />
//             ) : (
//               <div className="preview-cover--empty">
//                 <i className="far fa-image" />
//               </div>
//             )}
//           </div>

//           <div className="preview-meta">
//             <h1 className="preview-title">{title || 'Untitled'}</h1>

//             {Array.isArray(tags) && tags.length > 0 && (
//               <div className="preview-tags">
//                 {tags.map(t => (
//                   <span key={t} className="chip chip-outline">#{t}</span>
//                 ))}
//               </div>
//             )}

//             <div
//               className="preview-body"
//               dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(bodyHTML || '') }}
//             />
//           </div>
//         </div>

//         <div className="preview-actions">
//           <button type="button" className="btn-preview pill-btn" onClick={onClose}>Back</button>
//         </div>
//       </div>
//     </div>
//   );
// }


// old one above
// new design correct one below




// import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
// import { createPortal } from 'react-dom';
// import { useNavigate, useParams, Link, useLocation } from 'react-router-dom';
// import { useAuth } from '../../context/AuthContext';
// import { useUserDoc } from '../../configs/user';
// import { createArticle, updateArticle } from '../../configs/useArticles';
// import {
//   createDraft,
//   updateDraft,
//   deleteDraft,
//   getDraftOnce,
// } from '../../configs/useArticles';
// import { ref as rtdbRef, get as rtdbGet, remove as rtdbRemove } from 'firebase/database';
// import { rtdb, db as fsDb, storage } from '../../configs/firebase';
// import {
//   doc, setDoc, collection, onSnapshot,
//   serverTimestamp, increment,
// } from 'firebase/firestore';
// import { uploadBytes, getDownloadURL, ref as sRef } from 'firebase/storage';
// import DOMPurify from 'dompurify';

// import '../../styles/writearticlepage.css';
// import 'mdb-react-ui-kit/dist/css/mdb.min.css';
// import '@fortawesome/fontawesome-free/css/all.min.css';

// import { useEditor, EditorContent, BubbleMenu } from '@tiptap/react';
// import StarterKit from '@tiptap/starter-kit';
// import Underline from '@tiptap/extension-underline';
// import TextStyle from '@tiptap/extension-text-style';
// import Color from '@tiptap/extension-color';
// import Highlight from '@tiptap/extension-highlight';
// import LinkExt from '@tiptap/extension-link';
// import Image from '@tiptap/extension-image';
// import Youtube from '@tiptap/extension-youtube';
// import TextAlign from '@tiptap/extension-text-align';

// import Picker from '@emoji-mart/react';
// import emojiData from '@emoji-mart/data';

// import { MDBContainer, MDBRow, MDBCol, MDBBtn, MDBIcon, MDBSpinner } from 'mdb-react-ui-kit';

// /* ---------- tiny button primitive for the toolbar ---------- */
// function ToolbarButton({ title, icon, onClick, active, disabled }) {
//   return (
//     <button
//       type="button"
//       className={`tb-btn${active ? ' is-active' : ''}`}
//       title={title}
//       onClick={onClick}
//       disabled={disabled}
//       aria-pressed={!!active}
//       aria-label={title}
//     >
//       <i className={`fas fa-${icon}`} />
//     </button>
//   );
// }

// /* ---------- Image extension with persistent cover marker ---------- */
// const ResizableImage = Image.extend({
//   addAttributes() {
//     return {
//       ...this.parent?.(),

//       class: {
//         default: 'article-img',
//         parseHTML: el => el.getAttribute('class'),
//         renderHTML: () => ({ class: 'article-img' }),
//       },

//       'data-size': {
//         default: null, // sm | md | lg
//         parseHTML: el => el.getAttribute('data-size'),
//         renderHTML: attrs => (attrs['data-size'] ? { 'data-size': attrs['data-size'] } : {}),
//       },

//       // optional unique id (future-safe)
//       'data-id': {
//         default: null,
//         parseHTML: el => el.getAttribute('data-id'),
//         renderHTML: attrs => (attrs['data-id'] ? { 'data-id': attrs['data-id'] } : {}),
//       },

//       // ✅ persistent "cover" marker
//       'data-cover': {
//         default: null, // "1"
//         parseHTML: el => el.getAttribute('data-cover'),
//         renderHTML: attrs => (attrs['data-cover'] ? { 'data-cover': attrs['data-cover'] } : {}),
//       },
//     };
//   },
// });

// export default function WriteArticle() {
//   const { currentUser } = useAuth();
//   const { userDoc } = useUserDoc();

//   const nav = useNavigate();
//   const { id } = useParams();
//   const location = useLocation();
//   const isDraftMode = new URLSearchParams(location.search).get('draft') === '1';
//   const isEdit = Boolean(id);

//   const [suggestedTags, setSuggestedTags] = useState([]);
//   const [publishing, setPublishing] = useState(false);
//   const [previewOpen, setPreviewOpen] = useState(false);

//   const [title, setTitle] = useState('');
//   const [tags, setTags] = useState([]);

//   // ✅ cover image chosen by clicking an image in body
//   const [coverURL, setCoverURL] = useState(null);

//   // placeholder behavior
//   const [isEmpty, setIsEmpty] = useState(true);
//   const [isFocused, setIsFocused] = useState(false);

//   // hidden inputs
//   const imgInputRef = useRef(null);
//   const fileInputRef = useRef(null);

//   // “+ More” panel (portaled)
//   const [moreOpen, setMoreOpen] = useState(false);
//   const moreBtnRef = useRef(null);
//   const morePanelRef = useRef(null);
//   const [morePos, setMorePos] = useState({ top: 0, left: 0 });

//   // cover hint location (absolute inside editor-shell)
//   const [coverHint, setCoverHint] = useState({ visible: false, top: 0, left: 0, width: 0 });

//   // Emoji picker (portaled)
//   const [pickerVisible, setPickerVisible] = useState(false);
//   const emojiBtnRef = useRef(null);
//   const emojiPanelRef = useRef(null);
//   const [emojiPos, setEmojiPos] = useState({ top: 0, left: 0 });

//   const lastSelectionRef = useRef(null);

//   // ✅ Track currently selected image src (for bubble / selection only)
//   const [selectedImageSrc, setSelectedImageSrc] = useState(null);

//   /* ---------- tags (firestore) ---------- */
//   useEffect(() => {
//     if (!currentUser) return;

//     const unsub = onSnapshot(collection(fsDb, 'tags'), snap => {
//       const map = new Map();

//       snap.docs.forEach(d => {
//         const raw = d.id || '';
//         const key = raw.trim().toLowerCase();
//         if (!key) return;

//         const count = d.data().count || 0;

//         if (!map.has(key)) map.set(key, { name: key, label: raw, count });
//         else {
//           const prev = map.get(key);
//           map.set(key, { ...prev, count: Math.max(prev.count, count) });
//         }
//       });

//       const list = Array.from(map.values()).sort((a, b) => b.count - a.count);
//       setSuggestedTags(list);
//     });

//     return () => unsub();
//   }, [currentUser]);

//   /* ---------- editor ---------- */
//   const editor = useEditor({
//     extensions: [
//       StarterKit.configure({ heading: { levels: [1, 2, 3] } }),
//       Underline,
//       TextStyle,
//       Color,
//       Highlight,
//       LinkExt.configure({ openOnClick: false, HTMLAttributes: { rel: 'noopener nofollow' } }),
//       ResizableImage.configure({ allowBase64: true }),
//       Youtube.configure({ inline: false, width: 640 }),
//       TextAlign.configure({ types: ['heading', 'paragraph'] }),
//     ],
//     content: '<p></p>',
//     onCreate({ editor }) {
//       const hasText = editor.state.doc.textContent.trim().length > 0;
//       const hasImage = !!editor.state.doc.content?.content?.some(n => n.type?.name === 'image'); // quick check
//       setIsEmpty(!hasText && !hasImage);
//     },
//     onUpdate({ editor }) {
//       const hasText = editor.state.doc.textContent.trim().length > 0;

//       // ✅ robust: detect any image anywhere
//       let hasAnyImage = false;
//       editor.state.doc.descendants((node) => {
//         if (node.type.name === 'image') {
//           hasAnyImage = true;
//           return false;
//         }
//         return true;
//       });

//       setIsEmpty(!hasText && !hasAnyImage);
//     },
//   });

//   /* ---------- focus/blur (placeholder) ---------- */
//   useEffect(() => {
//     if (!editor) return;
//     const onFocus = () => setIsFocused(true);
//     const onBlur = () => setIsFocused(false);
//     editor.on('focus', onFocus);
//     editor.on('blur', onBlur);
//     return () => {
//       editor.off('focus', onFocus);
//       editor.off('blur', onBlur);
//     };
//   }, [editor]);

//   /* ---------- tag helpers ---------- */
//   const addTag = name => {
//     const tag = String(name || '').trim().toLowerCase();
//     if (tag && !tags.includes(tag)) setTags(prev => [...prev, tag]);
//   };
//   const removeTag = name => setTags(prev => prev.filter(t => t !== name));

//   /* ---------- ✅ set cover by src (persist into node attrs) ---------- */
//   const setCoverBySrc = useCallback((src) => {
//     if (!editor || !src) return;

//     setCoverURL(src);

//     editor.commands.command(({ tr, state }) => {
//       let changed = false;

//       state.doc.descendants((node, pos) => {
//         if (node.type.name !== 'image') return;

//         const isThis = node.attrs.src === src;
//         const nextCover = isThis ? '1' : null;

//         if (node.attrs['data-cover'] !== nextCover) {
//           tr.setNodeMarkup(pos, undefined, { ...node.attrs, 'data-cover': nextCover });
//           changed = true;
//         }
//       });

//       return changed;
//     });
//   }, [editor]);

//   /* ---------- track selected image (but DON'T auto set cover) ---------- */
//   useEffect(() => {
//     if (!editor) return;

//     const updateSelectedImage = () => {
//       if (!editor.isActive('image')) {
//         setSelectedImageSrc(null);
//         return;
//       }
//       const sel = editor.state.selection;
//       const node = sel?.node;
//       const src = node?.type?.name === 'image' ? node.attrs?.src : null;
//       setSelectedImageSrc(src || null);
//     };

//     editor.on('selectionUpdate', updateSelectedImage);
//     return () => editor.off('selectionUpdate', updateSelectedImage);
//   }, [editor]);

//   /* ---------- click image in editor = set cover ---------- */
//   useEffect(() => {
//     if (!editor) return;

//     const root = editor.view.dom;

//     const onClick = (e) => {
//       const img = e.target?.closest?.('img.article-img');
//       if (!img) return;

//       const src = img.getAttribute('src');
//       if (!src) return;

//       setCoverBySrc(src);
//     };

//     root.addEventListener('click', onClick);
//     return () => root.removeEventListener('click', onClick);
//   }, [editor, setCoverBySrc]);

//   /* ---------- keep cover hint positioned under cover image even while typing ---------- */
//   useEffect(() => {
//     if (!coverURL) {
//       setCoverHint(h => ({ ...h, visible: false }));
//       return;
//     }

//     const update = () => {
//       const imgEl = document.querySelector(`.ProseMirror img.article-img[data-cover="1"]`);
//       if (!imgEl) return;

//       const imgRect = imgEl.getBoundingClientRect();
//       const shell = document.querySelector('.editor-shell');
//       const shellRect = shell?.getBoundingClientRect();
//       if (!shellRect) return;

//       setCoverHint({
//         visible: true,
//         top: imgRect.bottom - shellRect.top + 10,
//         left: imgRect.left - shellRect.left,
//         width: imgRect.width,
//       });
//     };

//     // run now and also when layout changes
//     const raf = requestAnimationFrame(update);
//     window.addEventListener('scroll', update, true);
//     window.addEventListener('resize', update);

//     return () => {
//       cancelAnimationFrame(raf);
//       window.removeEventListener('scroll', update, true);
//       window.removeEventListener('resize', update);
//     };
//   }, [coverURL]);

//   /* ---------- load article/draft ---------- */
//   useEffect(() => {
//     if (!isEdit || !editor) return;

//     const setFrom = (obj) => {
//       setTitle(obj.title || '');
//       setTags(obj.tags || []);
//       setCoverURL(obj.coverUrl || null);
//       editor.commands.setContent(obj.body || '<p></p>');

//       // after content loads, re-apply cover marker (if coverUrl exists)
//       if (obj.coverUrl) {
//         requestAnimationFrame(() => setCoverBySrc(obj.coverUrl));
//       }
//     };

//     if (isDraftMode) {
//       getDraftOnce(currentUser.uid, id).then(draft => {
//         if (!draft) { nav('/profile'); return; }
//         setFrom(draft);
//       });
//     } else {
//       rtdbGet(rtdbRef(rtdb, `articles/${id}`)).then(snap => {
//         if (!snap.exists()) { nav('/'); return; }
//         setFrom(snap.val());
//       });
//     }
//   }, [id, isEdit, isDraftMode, nav, editor, currentUser, setCoverBySrc]);

//   /* ---------- click-away + position for portaled panels ---------- */
//   useEffect(() => {
//     const onDocClick = (e) => {
//       const inMoreBtn = moreBtnRef.current?.contains(e.target);
//       const inMorePanel = morePanelRef.current?.contains(e.target);
//       if (!inMoreBtn && !inMorePanel) setMoreOpen(false);

//       const inEmojiBtn = emojiBtnRef.current?.contains(e.target);
//       const inEmojiPanel = emojiPanelRef.current?.contains(e.target);
//       if (!inEmojiBtn && !inEmojiPanel) setPickerVisible(false);
//     };
//     const onEsc = (e) => {
//       if (e.key === 'Escape') { setMoreOpen(false); setPickerVisible(false); }
//     };
//     document.addEventListener('mousedown', onDocClick);
//     document.addEventListener('keydown', onEsc);
//     return () => {
//       document.removeEventListener('mousedown', onDocClick);
//       document.removeEventListener('keydown', onEsc);
//     };
//   }, []);

//   useEffect(() => {
//     const updatePositions = () => {
//       if (moreOpen && moreBtnRef.current) {
//         const r = moreBtnRef.current.getBoundingClientRect();
//         setMorePos({ top: r.bottom + 8 + window.scrollY, left: r.left + window.scrollX });
//       }
//       if (pickerVisible && emojiBtnRef.current) {
//         const r = emojiBtnRef.current.getBoundingClientRect();
//         setEmojiPos({ top: r.bottom + 8 + window.scrollY, left: r.left + window.scrollX - 8 });
//       }
//     };
//     updatePositions();
//     window.addEventListener('scroll', updatePositions, true);
//     window.addEventListener('resize', updatePositions);
//     return () => {
//       window.removeEventListener('scroll', updatePositions, true);
//       window.removeEventListener('resize', updatePositions);
//     };
//   }, [moreOpen, pickerVisible]);

//   /* ---------- inline media ---------- */
//   const handleImgUpload = e => {
//     const file = e.target.files?.[0];
//     if (!file) return;

//     const reader = new FileReader();
//     reader.onload = () => {
//       // ✅ insert NEW image (never replaces)
//       const id = `img_${Date.now()}_${Math.random().toString(16).slice(2)}`;
//       editor?.chain().focus().setImage({ src: reader.result, 'data-id': id }).run();
//     };
//     reader.readAsDataURL(file);
//     e.target.value = '';
//   };

//   const handleReplaceSelectedImage = e => {
//     const file = e.target.files?.[0];
//     if (!file) return;

//     if (!editor?.isActive('image')) {
//       alert('Select an image first to replace it.');
//       e.target.value = '';
//       return;
//     }

//     const sel = editor.state.selection;
//     const node = sel?.node;
//     const oldSrc = node?.type?.name === 'image' ? node.attrs?.src : null;
//     const wasCover = node?.attrs?.['data-cover'] === '1';

//     const reader = new FileReader();
//     reader.onload = () => {
//       editor.chain().focus().updateAttributes('image', { src: reader.result }).run();

//       // ✅ if the replaced image was cover, keep it cover (update marker + state)
//       if (wasCover && oldSrc) {
//         setCoverBySrc(reader.result);
//       }
//     };

//     reader.readAsDataURL(file);
//     e.target.value = '';
//   };

//   /* ---------- toolbar helpers ---------- */
//   const rememberSelection = () => {
//     if (!editor) return;
//     const { from, to } = editor.state.selection;
//     lastSelectionRef.current = { from, to };
//   };

//   const setBlockType = (e) => {
//     const v = e.target.value;
//     const sel = lastSelectionRef.current;

//     let chain = editor?.chain().focus();
//     if (!chain) return;

//     if (sel) chain = chain.setTextSelection(sel);

//     switch (v) {
//       case 'p': chain.setParagraph().run(); break;
//       case 'h1': chain.toggleHeading({ level: 1 }).run(); break;
//       case 'h2': chain.toggleHeading({ level: 2 }).run(); break;
//       case 'h3': chain.toggleHeading({ level: 3 }).run(); break;
//       case 'blockquote': chain.toggleBlockquote().run(); break;
//       case 'codeblock': chain.toggleCodeBlock().run(); break;
//       default: break;
//     }

//     lastSelectionRef.current = null;
//   };

//   const addLink = () => {
//     const url = window.prompt('Enter URL (https://…)');
//     if (!url) return;
//     editor?.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
//   };
//   const removeLink = () => editor?.chain().focus().unsetLink().run();
//   const insertHR = () => editor?.chain().focus().setHorizontalRule().run();
//   const insertYouTube = () => {
//     const url = window.prompt('Paste a YouTube URL');
//     if (!url) return;
//     editor?.chain().focus().setYoutubeVideo({ src: url, width: 640, height: 360 }).run();
//   };

//   const handleFileAttach = async (e) => {
//     const file = e.target.files?.[0];
//     if (!file || !currentUser) return;
//     try {
//       const path = `files/${currentUser.uid}/${Date.now()}_${file.name}`;
//       const ref = sRef(storage, path);
//       await uploadBytes(ref, file);
//       const url = await getDownloadURL(ref);
//       editor?.chain().focus()
//         .insertContent(`<a href="${url}" rel="noopener nofollow" target="_blank">${file.name}</a>`)
//         .run();
//     } finally {
//       e.target.value = '';
//     }
//   };

//   const clearFormatting = () => editor?.chain().focus().clearNodes().unsetAllMarks().run();

//   /* ---------- emoji select ---------- */
//   const handleEmojiSelect = (emoji) => {
//     const char = emoji?.native || '';
//     if (!char) return;
//     editor?.chain().focus().insertContent(char).run();
//     setPickerVisible(false);
//   };

//   /* ---------- submit & draft ---------- */
//   const handleSubmit = async () => {
//     if (publishing) return;
//     if (!editor) return;

//     const body = editor.getHTML();
//     const bodyText = body.replace(/<[^>]*>?/gm, '').trim();

//     if (!title.trim() || !bodyText) {
//       alert('Title and body are required');
//       return;
//     }

//     setPublishing(true);

//     try {
//       const ts = Date.now();
//       const payload = {
//         title,
//         body,
//         tags,
//         coverUrl: coverURL || '',
//         authorId: currentUser.uid,
//         createdAt: ts,
//         updatedAt: ts,
//       };

//       let artId;
//       if (isEdit && !isDraftMode) {
//         await updateArticle(id, payload);
//         artId = id;
//       } else {
//         const res = await createArticle(payload);
//         artId = res.id;
//         if (isDraftMode) await deleteDraft(currentUser.uid, id);
//       }

//       await Promise.all(
//         tags.map(async t => {
//           const refDoc = doc(fsDb, 'tags', t);
//           await setDoc(refDoc, { count: increment(1), updatedAt: serverTimestamp() }, { merge: true });
//         })
//       );

//       nav(`/article/${artId}`);
//     } catch (e) {
//       console.error(e);
//       alert('Something went wrong, please try again.');
//       setPublishing(false);
//     }
//   };

//   const handleSaveDraft = async () => {
//     if (!currentUser) { alert('Please sign in first.'); return; }
//     if (!editor) return;

//     try {
//       const body = editor.getHTML();
//       const ts = Date.now();
//       const draftPayload = {
//         userId: currentUser.uid,
//         title: title || '(untitled)',
//         body,
//         tags,
//         coverUrl: coverURL || '',
//         status: 'draft',
//         createdAt: ts,
//         updatedAt: ts,
//       };

//       if (isEdit && isDraftMode) await updateDraft(currentUser.uid, id, draftPayload);
//       else await createDraft(currentUser.uid, draftPayload);

//       alert('Draft saved.');
//     } catch (e) {
//       console.error('Draft save error:', e);
//       alert('Could not save draft. Please try again.');
//     }
//   };

//   const handleDelete = async () => {
//     if (!isEdit) return;
//     const ok = window.confirm('Delete this article permanently?');
//     if (!ok) return;

//     try {
//       if (isDraftMode) {
//         await deleteDraft(currentUser.uid, id);
//         alert('Draft deleted.');
//         nav('/profile');
//       } else {
//         await rtdbRemove(rtdbRef(rtdb, `articles/${id}`));
//         alert('Article deleted.');
//         nav('/');
//       }
//     } catch {
//       alert('Failed to delete. Try again.');
//     }
//   };

//   const dateString = useMemo(() => {
//     const now = new Date();
//     const opts = { year: 'numeric', month: 'long', day: 'numeric' };
//     return now.toLocaleDateString(undefined, opts);
//   }, []);

//   const setImageSize = (sizeKey) => {
//     if (!editor?.isActive('image')) return;
//     const key = sizeKey === 'sm' || sizeKey === 'lg' ? sizeKey : 'md';
//     editor.chain().focus().updateAttributes('image', { 'data-size': key }).run();
//   };

//   // current user identity (for right-side profile block)
//   const userName =
//     userDoc?.fullName ||
//     userDoc?.name ||
//     currentUser?.displayName ||
//     'User';

//   const userRole =
//     userDoc?.role ||
//     userDoc?.jobTitle ||
//     userDoc?.designation ||
//     null;

//   const userPhoto =
//     userDoc?.avatarUrl ||
//     currentUser?.photoURL ||
//     null;

//   return (
//     <div style={{ backgroundColor: '#F1F1E6' }}>
//       <MDBContainer className="write-wrap py-4">
//         <div className="write-topbar bounded mb-4">
//           <Link to="/" className="topbar-link">
//             <MDBIcon fas icon="arrow-left" className="me-2" /> back to home
//           </Link>
//           {isEdit && (
//             <button type="button" className="topbar-delete-btn" onClick={handleDelete}>
//               <MDBIcon fas icon="trash-alt" className="me-2" /> {isDraftMode ? 'delete draft' : 'delete article'}
//             </button>
//           )}
//         </div>

//         <div className="bounded">
//           <MDBRow className="justify-content-center">
//             <MDBCol md="10" lg="9">
//               {/* ===================== META ===================== */}
//               <div className="write-meta grid mt-2 write-meta--figma">
//                 <div className="title-col">
//                   <div className="write-date">{dateString}</div>
//                   <input
//                     className="title-input"
//                     placeholder="TITLE"
//                     value={title}
//                     onChange={e => setTitle(e.target.value)}
//                   />

//                   <div className="tag-suggest tag-suggest--grid mt-3">
//                     {suggestedTags.map(({ name, label }) => {
//                       const active = tags.includes(name);
//                       return (
//                         <button
//                           type="button"
//                           key={name}
//                           className={`chip ${active ? 'chip-filled' : 'chip-outline'}`}
//                           onClick={() => (active ? removeTag(name) : addTag(name))}
//                           title={`${active ? 'Remove' : 'Add'} #${name}`}
//                           aria-pressed={active}
//                         >
//                           #{label}
//                         </button>
//                       );
//                     })}
//                   </div>
//                 </div>

//                 <div className="meta-divider" aria-hidden />

//                 <div className="cover-col">
//                   <div className="cover-circle" title="Your profile">
//                     {userPhoto ? (
//                       <img src={userPhoto} alt="Profile" />
//                     ) : (
//                       <div className="cover-empty">
//                         <i className="far fa-user" />
//                         <span>Profile</span>
//                       </div>
//                     )}
//                   </div>

//                   <div className="profile-meta">
//                     <div style={{ fontWeight: 600, fontSize: 16 }}>{userName}</div>
//                     <div style={{ opacity: 0.75, fontSize: 14, fontWeight: 400 }}>{userRole}</div>
//                   </div>
//                 </div>
//               </div>

//               {/* ===== Editor ===== */}
//               <div className="editor-shell mt-5">
//                 <div
//                   className="editor-canvas transparent"
//                   onClick={() => editor?.chain().focus().run()}
//                   role="textbox"
//                   aria-label="Article body editor"
//                 >
//                   {/* ✅ Placeholder hides when focused OR not empty */}
//                   {!isFocused && isEmpty && (
//                     <div className="editor-placeholder" aria-hidden="true">
//                       Write your article here…
//                     </div>
//                   )}

//                   {/* ✅ cover hint anchored to cover image */}
//                   {coverHint.visible && (
//                     <div
//                       className="cover-hint-float"
//                       style={{
//                         position: 'absolute',
//                         top: coverHint.top,
//                         left: coverHint.left,
//                         width: coverHint.width,
//                         textAlign: 'center',
//                         zIndex: 5,
//                         pointerEvents: 'none',
//                       }}
//                     >
//                       Set as the cover photo of the article
//                     </div>
//                   )}

//                   <EditorContent editor={editor} />
//                 </div>

//                 {/* ===== Toolbar ===== */}
//                 <div className="editor-toolbar bottom shadow-soft">
//                   <ToolbarButton title="Bold" icon="bold"
//                     active={editor?.isActive('bold')}
//                     onClick={() => editor?.chain().focus().toggleBold().run()} />
//                   <ToolbarButton title="Italic" icon="italic"
//                     active={editor?.isActive('italic')}
//                     onClick={() => editor?.chain().focus().toggleItalic().run()} />
//                   <ToolbarButton title="Underline" icon="underline"
//                     active={editor?.isActive('underline')}
//                     onClick={() => editor?.chain().focus().toggleUnderline().run()} />
//                   <ToolbarButton title="Strikethrough" icon="strikethrough"
//                     active={editor?.isActive('strike')}
//                     onClick={() => editor?.chain().focus().toggleStrike().run()} />

//                   <label className="tb-color" title="Text color">
//                     <input type="color"
//                       onChange={e => editor?.chain().focus().setColor(e.target.value).run()} />
//                   </label>
//                   <ToolbarButton title="Highlight" icon="highlighter"
//                     active={editor?.isActive('highlight')}
//                     onClick={() => editor?.chain().focus().toggleHighlight().run()} />

//                   <button
//                     type="button"
//                     ref={emojiBtnRef}
//                     className="tb-btn"
//                     title="Emoji"
//                     onClick={() => setPickerVisible(v => !v)}
//                     aria-expanded={pickerVisible}
//                     aria-haspopup="dialog"
//                   >
//                     <i className="fas fa-smile" />
//                   </button>

//                   <span className="tb-sep" />

//                   <select
//                     className="tb-select"
//                     aria-label="Block type"
//                     value={
//                       editor?.isActive('heading', { level: 1 }) ? 'h1' :
//                         editor?.isActive('heading', { level: 2 }) ? 'h2' :
//                           editor?.isActive('heading', { level: 3 }) ? 'h3' :
//                             editor?.isActive('blockquote') ? 'blockquote' :
//                               editor?.isActive('codeBlock') ? 'codeblock' : 'p'
//                     }
//                     onMouseDown={rememberSelection}
//                     onChange={setBlockType}
//                   >
//                     <option value="p">¶</option>
//                     <option value="h1">H1</option>
//                     <option value="h2">H2</option>
//                     <option value="h3">H3</option>
//                     {/* <option value="blockquote">Quote</option>
//                     <option value="codeblock">Code Block</option> */}
//                   </select>

//                   <span className="tb-sep" />

//                   <ToolbarButton title="Numbered list" icon="list-ol"
//                     active={editor?.isActive('orderedList')}
//                     onClick={() => editor?.chain().focus().toggleOrderedList().run()} />
//                   <ToolbarButton title="Bulleted list" icon="list-ul"
//                     active={editor?.isActive('bulletList')}
//                     onClick={() => editor?.chain().focus().toggleBulletList().run()} />

//                   <span className="tb-sep" />

//                   <ToolbarButton title="Align left" icon="align-left"
//                     onClick={() => editor?.chain().focus().setTextAlign('left').run()} />
//                   <ToolbarButton title="Align center" icon="align-center"
//                     onClick={() => editor?.chain().focus().setTextAlign('center').run()} />
//                   <ToolbarButton title="Align right" icon="align-right"
//                     onClick={() => editor?.chain().focus().setTextAlign('right').run()} />
//                   <ToolbarButton title="Justify" icon="align-justify"
//                     onClick={() => editor?.chain().focus().setTextAlign('justify').run()} />

//                   <span className="tb-sep" />

//                   <button
//                     type="button"
//                     ref={moreBtnRef}
//                     className="tb-btn tb-plus"
//                     title="More"
//                     onClick={() => setMoreOpen(o => !o)}
//                     aria-expanded={moreOpen}
//                     aria-haspopup="menu"
//                   >
//                     <i className="fas fa-plus" />
//                   </button>
//                 </div>

//                 {/* Hidden inputs for uploads */}
//                 <input ref={imgInputRef} type="file" hidden accept="image/*" onChange={handleImgUpload} />
//                 <input ref={fileInputRef} type="file" hidden onChange={handleFileAttach} />

//                 {/* Emoji picker (PORTAL) */}
//                 {pickerVisible && createPortal(
//                   <div
//                     ref={emojiPanelRef}
//                     className="emoji-all-pop"
//                     style={{ position: 'absolute', top: emojiPos.top, left: emojiPos.left, zIndex: 9999 }}
//                     role="dialog"
//                     aria-modal="true"
//                   >
//                     <Picker
//                       data={emojiData}
//                       onEmojiSelect={handleEmojiSelect}
//                       theme="light"
//                       navPosition="bottom"
//                       previewPosition="none"
//                       searchPosition="top"
//                       perLine={8}
//                     />
//                   </div>,
//                   document.body
//                 )}

//                 {/* “+ More” panel (PORTAL) */}
//                 {moreOpen && createPortal(
//                   <div
//                     ref={morePanelRef}
//                     className="tb-more-panel"
//                     style={{ position: 'absolute', top: morePos.top, left: morePos.left, zIndex: 9999 }}
//                     role="menu"
//                   >
//                     <button className="tb-item" onClick={addLink}>
//                       <i className="fas fa-link" /><span>Insert link</span>
//                     </button>
//                     <button className="tb-item" onClick={removeLink}>
//                       <i className="fas fa-unlink" /><span>Remove link</span>
//                     </button>

//                     <button className="tb-item" onClick={() => imgInputRef.current?.click()}>
//                       <i className="fas fa-image" /><span>Insert image</span>
//                     </button>
//                     <button className="tb-item" onClick={() => fileInputRef.current?.click()}>
//                       <i className="fas fa-file" /><span>Attach file</span>
//                     </button>

//                     <button className="tb-item" onClick={insertYouTube}>
//                       <i className="fas fa-video" /><span>Insert YouTube</span>
//                     </button>
//                     <button className="tb-item" onClick={insertHR}>
//                       <i className="fas fa-minus" /><span>Horizontal rule</span>
//                     </button>

//                     <div className="tb-divider" />

//                     <button className="tb-item" onClick={clearFormatting}>
//                       <i className="fas fa-eraser" /><span>Clear formatting</span>
//                     </button>
//                     <button className="tb-item" onClick={() => editor?.chain().focus().undo().run()}>
//                       <i className="fas fa-undo" /><span>Undo</span>
//                     </button>
//                     <button className="tb-item" onClick={() => editor?.chain().focus().redo().run()}>
//                       <i className="fas fa-redo" /><span>Redo</span>
//                     </button>
//                   </div>,
//                   document.body
//                 )}

//                 {/* image bubble tools */}
//                 {editor && (
//                   <BubbleMenu
//                     editor={editor}
//                     shouldShow={({ editor }) => editor.isActive('image')}
//                     tippyOptions={{ duration: 0 }}
//                   >
//                     <div className="bubble-tools">
//                       <MDBBtn type="button" size="sm" color="light"
//                         onClick={() => setImageSize('sm')} title="Small image">
//                         S
//                       </MDBBtn>
//                       <MDBBtn type="button" size="sm" color="light"
//                         onClick={() => setImageSize('md')} title="Medium image">
//                         M
//                       </MDBBtn>
//                       <MDBBtn type="button" size="sm" color="light"
//                         onClick={() => setImageSize('lg')} title="Large image">
//                         L
//                       </MDBBtn>

//                       <MDBBtn type="button" size="sm" color="light"
//                         onClick={() => document.getElementById('img-edit-upload').click()}
//                         title="Replace image">
//                         <MDBIcon fas icon="pencil-alt" />
//                       </MDBBtn>

//                       <MDBBtn
//                         type="button"
//                         size="sm"
//                         color="light"
//                         onClick={() => {
//                           const sel = editor?.state?.selection;
//                           const node = sel?.node;
//                           const src = node?.type?.name === 'image' ? node.attrs?.src : null;
//                           const wasCover = node?.attrs?.['data-cover'] === '1';

//                           editor.chain().focus().deleteSelection().run();

//                           // ✅ if deleted image was cover -> clear cover + hide hint
//                           if (wasCover && src && src === coverURL) {
//                             setCoverURL(null);
//                             setCoverHint(h => ({ ...h, visible: false }));
//                           }
//                         }}
//                         title="Delete image"
//                       >
//                         <MDBIcon fas icon="trash" />
//                       </MDBBtn>
//                     </div>
//                   </BubbleMenu>
//                 )}

//                 <input
//                   id="img-edit-upload"
//                   hidden
//                   type="file"
//                   accept="image/*"
//                   onChange={handleReplaceSelectedImage}
//                 />
//               </div>

//               {/* ===== Actions ===== */}
//               <div className="write-actions mt-5" aria-label="article actions">
//                 <button type="button" className="btn-preview pill-btn" onClick={() => setPreviewOpen(true)}>
//                   Preview
//                 </button>
//                 <button type="button" className="btn-publish pill-btn" disabled={publishing} onClick={handleSubmit}>
//                   {publishing ? (<><MDBSpinner size="sm" tag="span" className="me-2" role="status" />Publishing…</>) : 'PUBLISH'}
//                 </button>
//                 <div className="save-row">
//                   <button type="button" className="save-draft-link" onClick={handleSaveDraft}>Save as Draft</button>
//                 </div>
//               </div>
//             </MDBCol>
//           </MDBRow>
//         </div>
//       </MDBContainer>

//       <PreviewOverlay
//         open={previewOpen}
//         onClose={() => setPreviewOpen(false)}
//         onPublish={handleSubmit}
//         title={title}
//         tags={tags}
//         coverUrl={coverURL}
//         bodyHTML={editor?.getHTML?.() || ''}
//       />
//     </div>
//   );
// }

// /* ---------- Preview overlay ---------- */
// function PreviewOverlay({ open, onClose, onPublish, title, tags, coverUrl, bodyHTML }) {
//   if (!open) return null;

//   return (
//     <div className="preview-overlay" role="dialog" aria-modal="true">
//       <div className="preview-panel">
//         <div className="preview-header">
//           <div className="preview-cover">
//             {coverUrl ? (
//               <img src={coverUrl} alt="Cover" />
//             ) : (
//               <div className="preview-cover--empty">
//                 <i className="far fa-image" />
//               </div>
//             )}
//           </div>

//           <div className="preview-meta">
//             <h1 className="preview-title">{title || 'Untitled'}</h1>

//             {Array.isArray(tags) && tags.length > 0 && (
//               <div className="preview-tags">
//                 {tags.map(t => (
//                   <span key={t} className="chip chip-outline">#{t}</span>
//                 ))}
//               </div>
//             )}

//             <div
//               className="preview-body"
//               dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(bodyHTML || '') }}
//             />
//           </div>
//         </div>

//         <div className="preview-actions">
//           <button type="button" className="btn-preview pill-btn" onClick={onClose}>Back</button>
//         </div>
//       </div>
//     </div>
//   );
// }














// import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
// import { createPortal } from 'react-dom';
// import { useNavigate, useParams, Link, useLocation } from 'react-router-dom';
// import { useAuth } from '../../context/AuthContext';
// import { useUserDoc } from '../../configs/user';
// import { createArticle, updateArticle } from '../../configs/useArticles';
// import {
//   createDraft,
//   updateDraft,
//   deleteDraft,
//   getDraftOnce,
// } from '../../configs/useArticles';
// import { ref as rtdbRef, get as rtdbGet, remove as rtdbRemove } from 'firebase/database';
// import { rtdb, db as fsDb, storage } from '../../configs/firebase';
// import {
//   doc, setDoc, collection, onSnapshot,
//   serverTimestamp, increment,
// } from 'firebase/firestore';
// import { uploadBytes, getDownloadURL, ref as sRef } from 'firebase/storage';
// import DOMPurify from 'dompurify';

// import '../../styles/writearticlepage.css';
// import 'mdb-react-ui-kit/dist/css/mdb.min.css';
// import '@fortawesome/fontawesome-free/css/all.min.css';

// import { useEditor, EditorContent, BubbleMenu } from '@tiptap/react';
// import StarterKit from '@tiptap/starter-kit';
// import Underline from '@tiptap/extension-underline';
// import TextStyle from '@tiptap/extension-text-style';
// import Color from '@tiptap/extension-color';
// import Highlight from '@tiptap/extension-highlight';
// import LinkExt from '@tiptap/extension-link';
// import Image from '@tiptap/extension-image';
// import Youtube from '@tiptap/extension-youtube';
// import TextAlign from '@tiptap/extension-text-align';

// // ✅ Checkbox list (Task list)
// import TaskList from '@tiptap/extension-task-list';
// import TaskItem from '@tiptap/extension-task-item';

// import Picker from '@emoji-mart/react';
// import emojiData from '@emoji-mart/data';

// import { MDBContainer, MDBRow, MDBCol, MDBBtn, MDBIcon, MDBSpinner } from 'mdb-react-ui-kit';

// /* ---------- tiny button primitive for the toolbar ---------- */
// function ToolbarButton({ title, icon, onClick, active, disabled, children }) {
//   return (
//     <button
//       type="button"
//       className={`tb-btn${active ? ' is-active' : ''}`}
//       title={title}
//       onClick={onClick}
//       disabled={disabled}
//       aria-pressed={!!active}
//       aria-label={title}
//     >
//       <i className={`fas fa-${icon}`} />
//       {children}
//     </button>
//   );
// }

// /* ---------- Image extension with persistent cover marker ---------- */
// const ResizableImage = Image.extend({
//   addAttributes() {
//     return {
//       ...this.parent?.(),

//       class: {
//         default: 'article-img',
//         parseHTML: el => el.getAttribute('class'),
//         renderHTML: () => ({ class: 'article-img' }),
//       },

//       'data-size': {
//         default: null, // sm | md | lg
//         parseHTML: el => el.getAttribute('data-size'),
//         renderHTML: attrs => (attrs['data-size'] ? { 'data-size': attrs['data-size'] } : {}),
//       },

//       'data-id': {
//         default: null,
//         parseHTML: el => el.getAttribute('data-id'),
//         renderHTML: attrs => (attrs['data-id'] ? { 'data-id': attrs['data-id'] } : {}),
//       },

//       'data-cover': {
//         default: null, // "1"
//         parseHTML: el => el.getAttribute('data-cover'),
//         renderHTML: attrs => (attrs['data-cover'] ? { 'data-cover': attrs['data-cover'] } : {}),
//       },
//     };
//   },
// });

// export default function WriteArticle() {
//   const { currentUser } = useAuth();
//   const { userDoc } = useUserDoc();

//   const nav = useNavigate();
//   const { id } = useParams();
//   const location = useLocation();
//   const isDraftMode = new URLSearchParams(location.search).get('draft') === '1';
//   const isEdit = Boolean(id);

//   const [suggestedTags, setSuggestedTags] = useState([]);
//   const [publishing, setPublishing] = useState(false);
//   const [previewOpen, setPreviewOpen] = useState(false);

//   const [title, setTitle] = useState('');
//   const [tags, setTags] = useState([]);

//   const [coverURL, setCoverURL] = useState(null);

//   const [isEmpty, setIsEmpty] = useState(true);
//   const [isFocused, setIsFocused] = useState(false);

//   const imgInputRef = useRef(null);
//   const fileInputRef = useRef(null);

//   // “+ More” panel (portaled)
//   const [moreOpen, setMoreOpen] = useState(false);
//   const moreBtnRef = useRef(null);
//   const morePanelRef = useRef(null);
//   const [morePos, setMorePos] = useState({ top: 0, left: 0 });

//   // cover hint
//   const [coverHint, setCoverHint] = useState({ visible: false, top: 0, left: 0, width: 0 });

//   // Emoji picker (portaled)
//   const [pickerVisible, setPickerVisible] = useState(false);
//   const emojiBtnRef = useRef(null);
//   const emojiPanelRef = useRef(null);
//   const [emojiPos, setEmojiPos] = useState({ top: 0, left: 0 });

//   // ✅ Highlight dropdown (portaled)
//   const [hlOpen, setHlOpen] = useState(false);
//   const hlBtnRef = useRef(null);
//   const hlPanelRef = useRef(null);
//   const [hlPos, setHlPos] = useState({ top: 0, left: 0 });
//   const [activeHighlightColor, setActiveHighlightColor] = useState('#D9D9D9'); // default grey underline

//   const lastSelectionRef = useRef(null);
//   const [selectedImageSrc, setSelectedImageSrc] = useState(null);

//   /* ---------- tags (firestore) ---------- */
//   useEffect(() => {
//     if (!currentUser) return;

//     const unsub = onSnapshot(collection(fsDb, 'tags'), snap => {
//       const map = new Map();

//       snap.docs.forEach(d => {
//         const raw = d.id || '';
//         const key = raw.trim().toLowerCase();
//         if (!key) return;
//         const count = d.data().count || 0;

//         if (!map.has(key)) map.set(key, { name: key, label: raw, count });
//         else {
//           const prev = map.get(key);
//           map.set(key, { ...prev, count: Math.max(prev.count, count) });
//         }
//       });

//       const list = Array.from(map.values()).sort((a, b) => b.count - a.count);
//       setSuggestedTags(list);
//     });

//     return () => unsub();
//   }, [currentUser]);

//   /* ---------- editor ---------- */

//   const NonInclusiveHighlight = Highlight.extend({
//   inclusive: false,
// }).configure({ multicolor: true });

//   const editor = useEditor({
//     extensions: [
//       StarterKit.configure({ heading: { levels: [1, 2, 3] } }),
//       Underline,
//       TextStyle,
//       Color,

//       // ✅ allow highlight color attribute
//       NonInclusiveHighlight,


//       LinkExt.configure({ openOnClick: false, HTMLAttributes: { rel: 'noopener nofollow' } }),
//       ResizableImage.configure({ allowBase64: true }),
//       Youtube.configure({ inline: false, width: 640 }),

//       // ✅ only affects current paragraph/heading block where cursor is
//       TextAlign.configure({ types: ['heading', 'paragraph'] }),

//       // ✅ Checkbox lists
//       TaskList,
//       TaskItem.configure({ nested: true }),
//     ],
//     content: '<p></p>',
//     onCreate({ editor }) {
//       const hasText = editor.state.doc.textContent.trim().length > 0;
//       let hasAnyImage = false;
//       editor.state.doc.descendants((node) => {
//         if (node.type.name === 'image') { hasAnyImage = true; return false; }
//         return true;
//       });
//       setIsEmpty(!hasText && !hasAnyImage);
//     },
//     onUpdate({ editor }) {
//       const hasText = editor.state.doc.textContent.trim().length > 0;
//       let hasAnyImage = false;
//       editor.state.doc.descendants((node) => {
//         if (node.type.name === 'image') { hasAnyImage = true; return false; }
//         return true;
//       });
//       setIsEmpty(!hasText && !hasAnyImage);
//     },
//   });

//   /* ---------- focus/blur (placeholder) ---------- */
//   useEffect(() => {
//     if (!editor) return;
//     const onFocus = () => setIsFocused(true);
//     const onBlur = () => setIsFocused(false);
//     editor.on('focus', onFocus);
//     editor.on('blur', onBlur);
//     return () => {
//       editor.off('focus', onFocus);
//       editor.off('blur', onBlur);
//     };
//   }, [editor]);

//   /* ---------- tag helpers ---------- */
//   const addTag = name => {
//     const tag = String(name || '').trim().toLowerCase();
//     if (tag && !tags.includes(tag)) setTags(prev => [...prev, tag]);
//   };
//   const removeTag = name => setTags(prev => prev.filter(t => t !== name));

//   /* ---------- ✅ set cover by src (persist into node attrs) ---------- */
//   const setCoverBySrc = useCallback((src) => {
//     if (!editor || !src) return;

//     setCoverURL(src);

//     editor.commands.command(({ tr, state }) => {
//       let changed = false;

//       state.doc.descendants((node, pos) => {
//         if (node.type.name !== 'image') return;

//         const isThis = node.attrs.src === src;
//         const nextCover = isThis ? '1' : null;

//         if (node.attrs['data-cover'] !== nextCover) {
//           tr.setNodeMarkup(pos, undefined, { ...node.attrs, 'data-cover': nextCover });
//           changed = true;
//         }
//       });

//       return changed;
//     });
//   }, [editor]);

//   /* ---------- track selected image ---------- */
//   useEffect(() => {
//     if (!editor) return;

//     const updateSelectedImage = () => {
//       if (!editor.isActive('image')) {
//         setSelectedImageSrc(null);
//         return;
//       }
//       const sel = editor.state.selection;
//       const node = sel?.node;
//       const src = node?.type?.name === 'image' ? node.attrs?.src : null;
//       setSelectedImageSrc(src || null);
//     };

//     editor.on('selectionUpdate', updateSelectedImage);
//     return () => editor.off('selectionUpdate', updateSelectedImage);
//   }, [editor]);

//   /* ---------- click image in editor = set cover ---------- */
//   useEffect(() => {
//     if (!editor) return;

//     const root = editor.view.dom;

//     const onClick = (e) => {
//       const img = e.target?.closest?.('img.article-img');
//       if (!img) return;
//       const src = img.getAttribute('src');
//       if (!src) return;
//       setCoverBySrc(src);
//     };

//     root.addEventListener('click', onClick);
//     return () => root.removeEventListener('click', onClick);
//   }, [editor, setCoverBySrc]);

//   /* ---------- keep cover hint positioned ---------- */
//   useEffect(() => {
//     if (!coverURL) {
//       setCoverHint(h => ({ ...h, visible: false }));
//       return;
//     }

//     const update = () => {
//       const imgEl = document.querySelector(`.ProseMirror img.article-img[data-cover="1"]`);
//       if (!imgEl) return;

//       const imgRect = imgEl.getBoundingClientRect();
//       const shell = document.querySelector('.editor-shell');
//       const shellRect = shell?.getBoundingClientRect();
//       if (!shellRect) return;

//       setCoverHint({
//         visible: true,
//         top: imgRect.bottom - shellRect.top + 10,
//         left: imgRect.left - shellRect.left,
//         width: imgRect.width,
//       });
//     };

//     const raf = requestAnimationFrame(update);
//     window.addEventListener('scroll', update, true);
//     window.addEventListener('resize', update);

//     return () => {
//       cancelAnimationFrame(raf);
//       window.removeEventListener('scroll', update, true);
//       window.removeEventListener('resize', update);
//     };
//   }, [coverURL]);

//   /* ---------- load article/draft ---------- */
//   useEffect(() => {
//     if (!isEdit || !editor) return;

//     const setFrom = (obj) => {
//       setTitle(obj.title || '');
//       setTags(obj.tags || []);
//       setCoverURL(obj.coverUrl || null);
//       editor.commands.setContent(obj.body || '<p></p>');

//       if (obj.coverUrl) {
//         requestAnimationFrame(() => setCoverBySrc(obj.coverUrl));
//       }
//     };

//     if (isDraftMode) {
//       getDraftOnce(currentUser.uid, id).then(draft => {
//         if (!draft) { nav('/profile'); return; }
//         setFrom(draft);
//       });
//     } else {
//       rtdbGet(rtdbRef(rtdb, `articles/${id}`)).then(snap => {
//         if (!snap.exists()) { nav('/'); return; }
//         setFrom(snap.val());
//       });
//     }
//   }, [id, isEdit, isDraftMode, nav, editor, currentUser, setCoverBySrc]);

//   /* ---------- click-away + ESC for portaled panels ---------- */
//   useEffect(() => {
//     const onDocClick = (e) => {
//       const inMoreBtn = moreBtnRef.current?.contains(e.target);
//       const inMorePanel = morePanelRef.current?.contains(e.target);
//       if (!inMoreBtn && !inMorePanel) setMoreOpen(false);

//       const inEmojiBtn = emojiBtnRef.current?.contains(e.target);
//       const inEmojiPanel = emojiPanelRef.current?.contains(e.target);
//       if (!inEmojiBtn && !inEmojiPanel) setPickerVisible(false);

//       const inHlBtn = hlBtnRef.current?.contains(e.target);
//       const inHlPanel = hlPanelRef.current?.contains(e.target);
//       if (!inHlBtn && !inHlPanel) setHlOpen(false);
//     };

//     const onEsc = (e) => {
//       if (e.key === 'Escape') {
//         setMoreOpen(false);
//         setPickerVisible(false);
//         setHlOpen(false);
//       }
//     };

//     document.addEventListener('mousedown', onDocClick);
//     document.addEventListener('keydown', onEsc);
//     return () => {
//       document.removeEventListener('mousedown', onDocClick);
//       document.removeEventListener('keydown', onEsc);
//     };
//   }, []);

//   /* ---------- portal positions ---------- */
//   useEffect(() => {
//     const updatePositions = () => {
//       if (moreOpen && moreBtnRef.current) {
//         const r = moreBtnRef.current.getBoundingClientRect();
//         setMorePos({ top: r.bottom + 8 + window.scrollY, left: r.left + window.scrollX });
//       }
//       if (pickerVisible && emojiBtnRef.current) {
//         const r = emojiBtnRef.current.getBoundingClientRect();
//         setEmojiPos({ top: r.bottom + 8 + window.scrollY, left: r.left + window.scrollX - 8 });
//       }
//       if (hlOpen && hlBtnRef.current) {
//         const r = hlBtnRef.current.getBoundingClientRect();
//         setHlPos({ top: r.bottom + 8 + window.scrollY, left: r.left + window.scrollX - 6 });
//       }
//     };

//     updatePositions();
//     window.addEventListener('scroll', updatePositions, true);
//     window.addEventListener('resize', updatePositions);
//     return () => {
//       window.removeEventListener('scroll', updatePositions, true);
//       window.removeEventListener('resize', updatePositions);
//     };
//   }, [moreOpen, pickerVisible, hlOpen]);

//   /* ---------- inline media ---------- */
//   const handleImgUpload = e => {
//     const file = e.target.files?.[0];
//     if (!file) return;

//     const reader = new FileReader();
//     reader.onload = () => {
//       const id = `img_${Date.now()}_${Math.random().toString(16).slice(2)}`;
//       editor?.chain().focus().setImage({ src: reader.result, 'data-id': id }).run();
//     };
//     reader.readAsDataURL(file);
//     e.target.value = '';
//   };

//   const handleReplaceSelectedImage = e => {
//     const file = e.target.files?.[0];
//     if (!file) return;

//     if (!editor?.isActive('image')) {
//       alert('Select an image first to replace it.');
//       e.target.value = '';
//       return;
//     }

//     const sel = editor.state.selection;
//     const node = sel?.node;
//     const wasCover = node?.attrs?.['data-cover'] === '1';

//     const reader = new FileReader();
//     reader.onload = () => {
//       editor.chain().focus().updateAttributes('image', { src: reader.result }).run();
//       if (wasCover) setCoverBySrc(reader.result);
//     };

//     reader.readAsDataURL(file);
//     e.target.value = '';
//   };

//   /* ---------- toolbar helpers ---------- */
//   const rememberSelection = () => {
//     if (!editor) return;
//     const { from, to } = editor.state.selection;
//     lastSelectionRef.current = { from, to };
//   };

//   const setBlockType = (e) => {
//     const v = e.target.value;
//     const sel = lastSelectionRef.current;

//     let chain = editor?.chain().focus();
//     if (!chain) return;
//     if (sel) chain = chain.setTextSelection(sel);

//     switch (v) {
//       case 'p': chain.setParagraph().run(); break;
//       case 'h1': chain.toggleHeading({ level: 1 }).run(); break;
//       case 'h2': chain.toggleHeading({ level: 2 }).run(); break;
//       case 'h3': chain.toggleHeading({ level: 3 }).run(); break;
//       default: break;
//     }

//     lastSelectionRef.current = null;
//   };

//   const addLink = () => {
//     const url = window.prompt('Enter URL (https://…)');
//     if (!url) return;
//     editor?.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
//   };
//   const removeLink = () => editor?.chain().focus().unsetLink().run();
//   const insertHR = () => editor?.chain().focus().setHorizontalRule().run();
//   const insertYouTube = () => {
//     const url = window.prompt('Paste a YouTube URL');
//     if (!url) return;
//     editor?.chain().focus().setYoutubeVideo({ src: url, width: 640, height: 360 }).run();
//   };

//   const handleFileAttach = async (e) => {
//     const file = e.target.files?.[0];
//     if (!file || !currentUser) return;
//     try {
//       const path = `files/${currentUser.uid}/${Date.now()}_${file.name}`;
//       const ref = sRef(storage, path);
//       await uploadBytes(ref, file);
//       const url = await getDownloadURL(ref);
//       editor?.chain().focus()
//         .insertContent(`<a href="${url}" rel="noopener nofollow" target="_blank">${file.name}</a>`)
//         .run();
//     } finally {
//       e.target.value = '';
//     }
//   };

//   const clearFormatting = () => editor?.chain().focus().clearNodes().unsetAllMarks().run();

//   /* ---------- emoji select ---------- */
//   const handleEmojiSelect = (emoji) => {
//     const char = emoji?.native || '';
//     if (!char) return;
//     editor?.chain().focus().insertContent(char).run();
//     setPickerVisible(false);
//   };

//   /* =========================================================
//      ✅ Highlight dropdown logic (ONLY selected text highlights)
//      ========================================================= */
//   const clearStoredHighlight = useCallback(() => {
//     if (!editor) return;
//     const { state, view } = editor;
//     const markType = state.schema.marks.highlight;
//     if (!markType) return;
//     view.dispatch(state.tr.removeStoredMark(markType));
//   }, [editor]);

//   const applyHighlightColor = useCallback((color) => {
//   if (!editor) return;

//   const { from, to, empty } = editor.state.selection;
//   if (empty) return; // ✅ only selected text

//   // Apply highlight to selected range
//   editor.chain().focus().setHighlight({ color }).run();

//   // ✅ Move cursor AFTER the highlighted selection
//   editor.chain().focus().setTextSelection(to).run();

//   // ✅ clear stored marks (extra safety)
//   clearStoredHighlight();

//   setHlOpen(false);
// }, [editor, clearStoredHighlight]);

// const removeHighlightFromSelection = useCallback(() => {
//   if (!editor) return;

//   const { to, empty } = editor.state.selection;
//   if (empty) return;

//   editor.chain().focus().unsetHighlight().run();

//   // ✅ move cursor after selection (prevents sticky behavior)
//   editor.chain().focus().setTextSelection(to).run();

//   clearStoredHighlight();
//   setHlOpen(false);
// }, [editor, clearStoredHighlight]);


//   // Track active highlight color for underline indicator
//   useEffect(() => {
//     if (!editor) return;

//     const update = () => {
//       const attrs = editor.getAttributes('highlight');
//       const c = attrs?.color;
//       if (editor.isActive('highlight') && c) setActiveHighlightColor(c);
//       else setActiveHighlightColor('#D9D9D9'); // grey underline when none
//     };

//     update();
//     editor.on('selectionUpdate', update);
//     editor.on('transaction', update);
//     return () => {
//       editor.off('selectionUpdate', update);
//       editor.off('transaction', update);
//     };
//   }, [editor]);

//   /* =========================================================
//      ✅ List dropdown logic (cursor line, toggle off with None)
//      Options: none | bullet | ordered | task
//      ========================================================= */
//   const getActiveListType = () => {
//     if (!editor) return 'none';
//     if (editor.isActive('taskList')) return 'task';
//     if (editor.isActive('bulletList')) return 'bullet';
//     if (editor.isActive('orderedList')) return 'ordered';
//     return 'none';
//   };

//   const [listValue, setListValue] = useState('none');

//   useEffect(() => {
//     if (!editor) return;
//     const sync = () => setListValue(getActiveListType());
//     sync();
//     editor.on('selectionUpdate', sync);
//     return () => editor.off('selectionUpdate', sync);
//   }, [editor]);

  
//   const setAlign = (e) => {
//   const v = e.target.value;
//   if (!editor) return;

//   editor.chain().focus().command(({ state, tr }) => {
//     const { $from } = state.selection;

//     // If paragraph has hardBreaks, split at cursor using the transaction
//     if ($from.parent?.type?.name === 'paragraph') {
//       let hasHardBreak = false;
//       $from.parent.descendants((n) => {
//         if (n.type.name === 'hardBreak') { hasHardBreak = true; return false; }
//         return true;
//       });

//       if (hasHardBreak) {
//         // splitBlock equivalent but via tr to keep it in same transaction
//         const canSplit = tr.split(state.selection.from);
//         // if split fails, ignore
//       }
//     }

//     return true;
//   }).setTextAlign(v).run();

//   setAlignValue(v);
// };

  
//   const setListType = (e) => {
//   const v = e.target.value;
//   if (!editor) return;

//   editor
//     .chain()
//     .focus()
//     .command(({ editor, commands }) => {
//       // 1) Remove current list type safely (using commands, not editor.commands)
//       if (editor.isActive('taskList')) commands.toggleTaskList();
//       if (editor.isActive('bulletList')) commands.toggleBulletList();
//       if (editor.isActive('orderedList')) commands.toggleOrderedList();

//       // 2) Apply requested list type
//       if (v === 'bullet') commands.toggleBulletList();
//       if (v === 'ordered') commands.toggleOrderedList();
//       if (v === 'task') commands.toggleTaskList();

//       return true;
//     })
//     .run();

//   setListValue(v);
// };

//   /* =========================================================
//      ✅ Align dropdown logic (ONLY current paragraph/heading)
//      Options: left | center | right
//      ========================================================= */
//   const getActiveAlign = () => {
//     if (!editor) return 'left';
//     if (editor.isActive({ textAlign: 'center' })) return 'center';
//     if (editor.isActive({ textAlign: 'right' })) return 'right';
//     return 'left';
//   };

//   const [alignValue, setAlignValue] = useState('left');

//   useEffect(() => {
//     if (!editor) return;
//     const sync = () => setAlignValue(getActiveAlign());
//     sync();
//     editor.on('selectionUpdate', sync);
//     return () => editor.off('selectionUpdate', sync);
//   }, [editor]);

  
  

//   /* ---------- submit & draft ---------- */
//   const handleSubmit = async () => {
//     if (publishing) return;
//     if (!editor) return;

//     const body = editor.getHTML();
//     const bodyText = body.replace(/<[^>]*>?/gm, '').trim();

//     if (!title.trim() || !bodyText) {
//       alert('Title and body are required');
//       return;
//     }

//     setPublishing(true);

//     try {
//       const ts = Date.now();
//       const payload = {
//         title,
//         body,
//         tags,
//         coverUrl: coverURL || '',
//         authorId: currentUser.uid,
//         createdAt: ts,
//         updatedAt: ts,
//       };

//       let artId;
//       if (isEdit && !isDraftMode) {
//         await updateArticle(id, payload);
//         artId = id;
//       } else {
//         const res = await createArticle(payload);
//         artId = res.id;
//         if (isDraftMode) await deleteDraft(currentUser.uid, id);
//       }

//       await Promise.all(
//         tags.map(async t => {
//           const refDoc = doc(fsDb, 'tags', t);
//           await setDoc(refDoc, { count: increment(1), updatedAt: serverTimestamp() }, { merge: true });
//         })
//       );

//       nav(`/article/${artId}`);
//     } catch (e) {
//       console.error(e);
//       alert('Something went wrong, please try again.');
//       setPublishing(false);
//     }
//   };

//   const handleSaveDraft = async () => {
//     if (!currentUser) { alert('Please sign in first.'); return; }
//     if (!editor) return;

//     try {
//       const body = editor.getHTML();
//       const ts = Date.now();
//       const draftPayload = {
//         userId: currentUser.uid,
//         title: title || '(untitled)',
//         body,
//         tags,
//         coverUrl: coverURL || '',
//         status: 'draft',
//         createdAt: ts,
//         updatedAt: ts,
//       };

//       if (isEdit && isDraftMode) await updateDraft(currentUser.uid, id, draftPayload);
//       else await createDraft(currentUser.uid, draftPayload);

//       alert('Draft saved.');
//     } catch (e) {
//       console.error('Draft save error:', e);
//       alert('Could not save draft. Please try again.');
//     }
//   };

//   const handleDelete = async () => {
//     if (!isEdit) return;
//     const ok = window.confirm('Delete this article permanently?');
//     if (!ok) return;

//     try {
//       if (isDraftMode) {
//         await deleteDraft(currentUser.uid, id);
//         alert('Draft deleted.');
//         nav('/profile');
//       } else {
//         await rtdbRemove(rtdbRef(rtdb, `articles/${id}`));
//         alert('Article deleted.');
//         nav('/');
//       }
//     } catch {
//       alert('Failed to delete. Try again.');
//     }
//   };

//   const dateString = useMemo(() => {
//     const now = new Date();
//     const opts = { year: 'numeric', month: 'long', day: 'numeric' };
//     return now.toLocaleDateString(undefined, opts);
//   }, []);

//   const setImageSize = (sizeKey) => {
//     if (!editor?.isActive('image')) return;
//     const key = sizeKey === 'sm' || sizeKey === 'lg' ? sizeKey : 'md';
//     editor.chain().focus().updateAttributes('image', { 'data-size': key }).run();
//   };

//   const userName =
//     userDoc?.fullName ||
//     userDoc?.name ||
//     currentUser?.displayName ||
//     'User';

//   const userRole =
//     userDoc?.role ||
//     userDoc?.jobTitle ||
//     userDoc?.designation ||
//     null;

//   const userPhoto =
//     userDoc?.avatarUrl ||
//     currentUser?.photoURL ||
//     null;

//   const HIGHLIGHT_COLORS = [
//     { key: 'red', label: 'Red', color: '#F7B2B0' },
//     { key: 'yellow', label: 'Yellow', color: '#F8E08E' },
//     { key: 'blue', label: 'Blue', color: '#AFCBFF' },
//     { key: 'green', label: 'Green', color: '#B8E6C2' },
//     { key: 'grey', label: 'Grey', color: '#D9D9D9' },
//   ];

//   return (
//     <div style={{ backgroundColor: '#F1F1E6' }}>
//       <MDBContainer className="write-wrap py-4">
//         <div className="write-topbar bounded mb-4">
//           <Link to="/" className="topbar-link">
//             <MDBIcon fas icon="arrow-left" className="me-2" /> back to home
//           </Link>
//           {isEdit && (
//             <button type="button" className="topbar-delete-btn" onClick={handleDelete}>
//               <MDBIcon fas icon="trash-alt" className="me-2" /> {isDraftMode ? 'delete draft' : 'delete article'}
//             </button>
//           )}
//         </div>

//         <div className="bounded">
//           <MDBRow className="justify-content-center">
//             <MDBCol md="10" lg="9">
//               {/* ===================== META ===================== */}
//               <div className="write-meta grid mt-2 write-meta--figma">
//                 <div className="title-col">
//                   <div className="write-date">{dateString}</div>
//                   <input
//                     className="title-input"
//                     placeholder="TITLE"
//                     value={title}
//                     onChange={e => setTitle(e.target.value)}
//                   />

//                   <div className="tag-suggest tag-suggest--grid mt-3">
//                     {suggestedTags.map(({ name, label }) => {
//                       const active = tags.includes(name);
//                       return (
//                         <button
//                           type="button"
//                           key={name}
//                           className={`chip ${active ? 'chip-filled' : 'chip-outline'}`}
//                           onClick={() => (active ? removeTag(name) : addTag(name))}
//                           title={`${active ? 'Remove' : 'Add'} #${name}`}
//                           aria-pressed={active}
//                         >
//                           #{label}
//                         </button>
//                       );
//                     })}
//                   </div>
//                 </div>

//                 <div className="meta-divider" aria-hidden />

//                 <div className="cover-col">
//                   <div className="cover-circle" title="Your profile">
//                     {userPhoto ? (
//                       <img src={userPhoto} alt="Profile" />
//                     ) : (
//                       <div className="cover-empty">
//                         <i className="far fa-user" />
//                         <span>Profile</span>
//                       </div>
//                     )}
//                   </div>

//                   <div className="profile-meta">
//                     <div style={{ fontWeight: 600, fontSize: 16 }}>{userName}</div>
//                     <div style={{ opacity: 0.75, fontSize: 14, fontWeight: 400 }}>{userRole}</div>
//                   </div>
//                 </div>
//               </div>

//               {/* ===== Editor ===== */}
//               <div className="editor-shell mt-5">
//                 <div
//                   className="editor-canvas transparent"
//                   onClick={() => editor?.chain().focus().run()}
//                   role="textbox"
//                   aria-label="Article body editor"
//                 >
//                   {!isFocused && isEmpty && (
//                     <div className="editor-placeholder" aria-hidden="true">
//                       Write your article here…
//                     </div>
//                   )}

//                   {coverHint.visible && (
//                     <div
//                       className="cover-hint-float"
//                       style={{
//                         position: 'absolute',
//                         top: coverHint.top,
//                         left: coverHint.left,
//                         width: coverHint.width,
//                         textAlign: 'center',
//                         zIndex: 5,
//                         pointerEvents: 'none',
//                       }}
//                     >
//                       Set as the cover photo of the article
//                     </div>
//                   )}

//                   <EditorContent editor={editor} />
//                 </div>

//                 {/* ===== Toolbar ===== */}
//                 <div className="editor-toolbar bottom shadow-soft">
//                   <ToolbarButton title="Bold" icon="bold"
//                     active={editor?.isActive('bold')}
//                     onClick={() => editor?.chain().focus().toggleBold().run()} />

//                   <ToolbarButton title="Italic" icon="italic"
//                     active={editor?.isActive('italic')}
//                     onClick={() => editor?.chain().focus().toggleItalic().run()} />

//                   <ToolbarButton title="Underline" icon="underline"
//                     active={editor?.isActive('underline')}
//                     onClick={() => editor?.chain().focus().toggleUnderline().run()} />

//                   <ToolbarButton title="Strikethrough" icon="strikethrough"
//                     active={editor?.isActive('strike')}
//                     onClick={() => editor?.chain().focus().toggleStrike().run()} />

//                   <label className="tb-color" title="Text color">
//                     <input
//                       type="color"
//                       onChange={e => editor?.chain().focus().setColor(e.target.value).run()}
//                     />
//                   </label>

//                   {/* ✅ Highlight dropdown button with underline color indicator */}
//                   <button
//                     type="button"
//                     ref={hlBtnRef}
//                     className={`tb-btn tb-highlight${editor?.isActive('highlight') ? ' is-active' : ''}`}
//                     title="Highlight"
//                     onClick={() => setHlOpen(v => !v)}
//                     aria-expanded={hlOpen}
//                     aria-haspopup="menu"
//                   >
//                     <i className="fas fa-highlighter" />
//                     <span className="tb-hl-underline" style={{ background: activeHighlightColor }} />
//                     <i className="fas fa-caret-down tb-caret" />
//                   </button>

//                   <button
//                     type="button"
//                     ref={emojiBtnRef}
//                     className="tb-btn"
//                     title="Emoji"
//                     onClick={() => setPickerVisible(v => !v)}
//                     aria-expanded={pickerVisible}
//                     aria-haspopup="dialog"
//                   >
//                     <i className="fas fa-smile" />
//                   </button>

//                   <span className="tb-sep" />

//                   {/* Block type dropdown */}
//                   <div className="tb-dd">
//                     <select
//                       className="tb-select tb-select--icon"
//                       aria-label="Block type"
//                       value={
//                         editor?.isActive('heading', { level: 1 }) ? 'h1' :
//                         editor?.isActive('heading', { level: 2 }) ? 'h2' :
//                         editor?.isActive('heading', { level: 3 }) ? 'h3' : 'p'
//                       }
//                       onMouseDown={rememberSelection}
//                       onChange={setBlockType}
//                     >
//                       <option value="p">¶</option>
//                       <option value="h1">H1</option>
//                       <option value="h2">H2</option>
//                       <option value="h3">H3</option>
//                     </select>
//                     <i className="fas fa-caret-down tb-dd-caret" />
//                   </div>

//                   <span className="tb-sep" />

//                   {/* ✅ List dropdown (none/bullet/ordered/task) */}
//                   <div className="tb-dd" title="Lists">
//                     <select
//                       className="tb-select tb-select--icon"
//                       aria-label="Lists"
//                       value={listValue}
//                       onChange={setListType}
//                     >
//                       <option value="none">≡</option>
//                       <option value="bullet">•</option>
//                       <option value="ordered">1.</option>
//                       <option value="task">☑</option>
//                     </select>
//                     <i className="fas fa-caret-down tb-dd-caret" />
//                   </div>

//                   <span className="tb-sep" />

//                   {/* ✅ Align dropdown (left/center/right) */}
//                   <div className="tb-dd" title="Align">
//                     <select
//                       className="tb-select tb-select--icon"
//                       aria-label="Align"
//                       value={alignValue}
//                       onChange={setAlign}
//                     >
//                       <option value="left">L</option>
//                       <option value="center">C</option>
//                       <option value="right">R</option>
//                     </select>
//                     <i className="fas fa-caret-down tb-dd-caret" />
//                   </div>
//                   <span className="tb-sep" />

//                   <div className="tb-dd" title="InsertImage">
//                   <button className="tb-item" onClick={() => imgInputRef.current?.click()}>
//                   <i className="fas fa-image" />
//                     </button>
//                     </div>

//                   <span className="tb-sep" />

//                   <button
//                     type="button"
//                     ref={moreBtnRef}
//                     className="tb-btn tb-plus"
//                     title="More"
//                     onClick={() => setMoreOpen(o => !o)}
//                     aria-expanded={moreOpen}
//                     aria-haspopup="menu"
//                   >
//                     <i className="fas fa-plus" />
//                   </button>
//                 </div>

//                 {/* Hidden inputs for uploads */}
//                 <input ref={imgInputRef} type="file" hidden accept="image/*" onChange={handleImgUpload} />
//                 <input ref={fileInputRef} type="file" hidden onChange={handleFileAttach} />

//                 {/* ✅ Highlight menu (PORTAL) */}
//                 {hlOpen && createPortal(
//                   <div
//                     ref={hlPanelRef}
//                     className="tb-hl-panel"
//                     style={{ position: 'absolute', top: hlPos.top, left: hlPos.left, zIndex: 9999 }}
//                     role="menu"
//                   >
//                     {HIGHLIGHT_COLORS.map(c => (
//                       <button
//                         key={c.key}
//                         className="tb-hl-item"
//                         onClick={() => applyHighlightColor(c.color)}
//                       >
//                         <span className="tb-hl-swatch" style={{ background: c.color }} />
//                         <span>{c.label}</span>
//                       </button>
//                     ))}

//                     <div className="tb-divider" />

//                     <button className="tb-hl-item tb-hl-remove" onClick={removeHighlightFromSelection}>
//                       <i className="fas fa-eraser" />
//                       <span>Remove highlight</span>
//                     </button>

//                     <div className="tb-hl-note">
//                       Highlights apply only when text is selected.
//                     </div>
//                   </div>,
//                   document.body
//                 )}

//                 {/* Emoji picker (PORTAL) */}
//                 {pickerVisible && createPortal(
//                   <div
//                     ref={emojiPanelRef}
//                     className="emoji-all-pop"
//                     style={{ position: 'absolute', top: emojiPos.top, left: emojiPos.left, zIndex: 9999 }}
//                     role="dialog"
//                     aria-modal="true"
//                   >
//                     <Picker
//                       data={emojiData}
//                       onEmojiSelect={handleEmojiSelect}
//                       theme="light"
//                       navPosition="bottom"
//                       previewPosition="none"
//                       searchPosition="top"
//                       perLine={8}
//                     />
//                   </div>,
//                   document.body
//                 )}

//                 {/* “+ More” panel (PORTAL) */}
//                 {moreOpen && createPortal(
//                   <div
//                     ref={morePanelRef}
//                     className="tb-more-panel"
//                     style={{ position: 'absolute', top: morePos.top, left: morePos.left, zIndex: 9999 }}
//                     role="menu"
//                   >
//                     <button className="tb-item" onClick={addLink}>
//                       <i className="fas fa-link" /><span>Insert link</span>
//                     </button>
//                     <button className="tb-item" onClick={removeLink}>
//                       <i className="fas fa-unlink" /><span>Remove link</span>
//                     </button>

  
//                     <button className="tb-item" onClick={() => fileInputRef.current?.click()}>
//                       <i className="fas fa-file" /><span>Attach file</span>
//                     </button>

//                     <button className="tb-item" onClick={insertYouTube}>
//                       <i className="fas fa-video" /><span>Insert YouTube</span>
//                     </button>
//                     <button className="tb-item" onClick={insertHR}>
//                       <i className="fas fa-minus" /><span>Horizontal rule</span>
//                     </button>

//                     <div className="tb-divider" />

//                     <button className="tb-item" onClick={clearFormatting}>
//                       <i className="fas fa-eraser" /><span>Clear formatting</span>
//                     </button>
//                     <button className="tb-item" onClick={() => editor?.chain().focus().undo().run()}>
//                       <i className="fas fa-undo" /><span>Undo</span>
//                     </button>
//                     <button className="tb-item" onClick={() => editor?.chain().focus().redo().run()}>
//                       <i className="fas fa-redo" /><span>Redo</span>
//                     </button>
//                   </div>,
//                   document.body
//                 )}

//                 {/* image bubble tools */}
//                 {editor && (
//                   <BubbleMenu
//                     editor={editor}
//                     shouldShow={({ editor }) => editor.isActive('image')}
//                     tippyOptions={{ duration: 0 }}
//                   >
//                     <div className="bubble-tools">
//                       <MDBBtn type="button" size="sm" color="light"
//                         onClick={() => setImageSize('sm')} title="Small image">
//                         S
//                       </MDBBtn>
//                       <MDBBtn type="button" size="sm" color="light"
//                         onClick={() => setImageSize('md')} title="Medium image">
//                         M
//                       </MDBBtn>
//                       <MDBBtn type="button" size="sm" color="light"
//                         onClick={() => setImageSize('lg')} title="Large image">
//                         L
//                       </MDBBtn>

//                       <MDBBtn type="button" size="sm" color="light"
//                         onClick={() => document.getElementById('img-edit-upload').click()}
//                         title="Replace image">
//                         <MDBIcon fas icon="pencil-alt" />
//                       </MDBBtn>

//                       <MDBBtn
//                         type="button"
//                         size="sm"
//                         color="light"
//                         onClick={() => {
//                           const sel = editor?.state?.selection;
//                           const node = sel?.node;
//                           const src = node?.type?.name === 'image' ? node.attrs?.src : null;
//                           const wasCover = node?.attrs?.['data-cover'] === '1';

//                           editor.chain().focus().deleteSelection().run();

//                           if (wasCover && src && src === coverURL) {
//                             setCoverURL(null);
//                             setCoverHint(h => ({ ...h, visible: false }));
//                           }
//                         }}
//                         title="Delete image"
//                       >
//                         <MDBIcon fas icon="trash" />
//                       </MDBBtn>
//                     </div>
//                   </BubbleMenu>
//                 )}

//                 <input
//                   id="img-edit-upload"
//                   hidden
//                   type="file"
//                   accept="image/*"
//                   onChange={handleReplaceSelectedImage}
//                 />
//               </div>

//               {/* ===== Actions ===== */}
//               <div className="write-actions mt-5" aria-label="article actions">
//                 <button type="button" className="btn-preview pill-btn" onClick={() => setPreviewOpen(true)}>
//                   Preview
//                 </button>
//                 <button type="button" className="btn-publish pill-btn" disabled={publishing} onClick={handleSubmit}>
//                   {publishing ? (<><MDBSpinner size="sm" tag="span" className="me-2" role="status" />Publishing…</>) : 'PUBLISH'}
//                 </button>
//                 <div className="save-row">
//                   <button type="button" className="save-draft-link" onClick={handleSaveDraft}>Save as Draft</button>
//                 </div>
//               </div>
//             </MDBCol>
//           </MDBRow>
//         </div>
//       </MDBContainer>

//       <PreviewOverlay
//         open={previewOpen}
//         onClose={() => setPreviewOpen(false)}
//         onPublish={handleSubmit}
//         title={title}
//         tags={tags}
//         coverUrl={coverURL}
//         bodyHTML={editor?.getHTML?.() || ''}
//       />
//     </div>
//   );
// }

// /* ---------- Preview overlay ---------- */
// function PreviewOverlay({ open, onClose, onPublish, title, tags, coverUrl, bodyHTML }) {
//   if (!open) return null;

//   return (
//     <div className="preview-overlay" role="dialog" aria-modal="true">
//       <div className="preview-panel">
//         <div className="preview-header">
//           <div className="preview-cover">
//             {coverUrl ? (
//               <img src={coverUrl} alt="Cover" />
//             ) : (
//               <div className="preview-cover--empty">
//                 <i className="far fa-image" />
//               </div>
//             )}
//           </div>

//           <div className="preview-meta">
//             <h1 className="preview-title">{title || 'Untitled'}</h1>

//             {Array.isArray(tags) && tags.length > 0 && (
//               <div className="preview-tags">
//                 {tags.map(t => (
//                   <span key={t} className="chip chip-outline">#{t}</span>
//                 ))}
//               </div>
//             )}

//             <div
//               className="preview-body"
//               dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(bodyHTML || '') }}
//             />
//           </div>
//         </div>

//         <div className="preview-actions">
//           <button type="button" className="btn-preview pill-btn" onClick={onClose}>Back</button>
//         </div>
//       </div>
//     </div>
//   );
// }













import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate, useParams, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useUserDoc } from '../../configs/user';
import { createArticle, updateArticle } from '../../configs/useArticles';
import {
  createDraft,
  updateDraft,
  deleteDraft,
  getDraftOnce,
} from '../../configs/useArticles';
import { ref as rtdbRef, get as rtdbGet, remove as rtdbRemove } from 'firebase/database';
import { rtdb, db as fsDb, storage } from '../../configs/firebase';
import {
  doc, setDoc, collection, onSnapshot,
  serverTimestamp, increment,
} from 'firebase/firestore';
import { uploadBytes, getDownloadURL, ref as sRef } from 'firebase/storage';
import DOMPurify from 'dompurify';

import '../../styles/writearticlepage.css';
import 'mdb-react-ui-kit/dist/css/mdb.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';

import { useEditor, EditorContent, BubbleMenu } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import TextStyle from '@tiptap/extension-text-style';
import Color from '@tiptap/extension-color';
import Highlight from '@tiptap/extension-highlight';
import LinkExt from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import Youtube from '@tiptap/extension-youtube';
import TextAlign from '@tiptap/extension-text-align';
import { TextSelection } from 'prosemirror-state';
// ✅ Checkbox list (Task list)
import TaskList from '@tiptap/extension-task-list';
import TaskItem from '@tiptap/extension-task-item';

import Picker from '@emoji-mart/react';
import emojiData from '@emoji-mart/data';

import { MDBContainer, MDBRow, MDBCol, MDBBtn, MDBIcon, MDBSpinner } from 'mdb-react-ui-kit';

/* ---------- tiny button primitive for the toolbar ---------- */
function ToolbarButton({ title, icon, onClick, active, disabled, children }) {
  return (
    <button
      type="button"
      className={`tb-btn${active ? ' is-active' : ''}`}
      title={title}
      onClick={onClick}
      disabled={disabled}
      aria-pressed={!!active}
      aria-label={title}
    >
      <i className={`fas fa-${icon}`} />
      {children}
    </button>
  );
}

export default function WriteArticle() {
  const { currentUser } = useAuth();
  const { userDoc } = useUserDoc();

  const nav = useNavigate();
  const { id } = useParams();
  const location = useLocation();
  const isDraftMode = new URLSearchParams(location.search).get('draft') === '1';
  const isEdit = Boolean(id);

  const [suggestedTags, setSuggestedTags] = useState([]);
  const [publishing, setPublishing] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);

  const [title, setTitle] = useState('');
  const [tags, setTags] = useState([]);

  const [coverURL, setCoverURL] = useState(null);

  const [isEmpty, setIsEmpty] = useState(true);
  const [isFocused, setIsFocused] = useState(false);

  const imgInputRef = useRef(null);
  const fileInputRef = useRef(null);

  // “+ More” panel (portaled)
  const [moreOpen, setMoreOpen] = useState(false);
  const moreBtnRef = useRef(null);
  const morePanelRef = useRef(null);
  const [morePos, setMorePos] = useState({ top: 0, left: 0 });

  // Emoji picker (portaled)
  const [pickerVisible, setPickerVisible] = useState(false);
  const emojiBtnRef = useRef(null);
  const emojiPanelRef = useRef(null);
  const [emojiPos, setEmojiPos] = useState({ top: 0, left: 0 });

  // ✅ Highlight dropdown (portaled)
  const [hlOpen, setHlOpen] = useState(false);
  const hlBtnRef = useRef(null);
  const hlPanelRef = useRef(null);
  const [hlPos, setHlPos] = useState({ top: 0, left: 0 });
  const [activeHighlightColor, setActiveHighlightColor] = useState('#D9D9D9');

  const lastSelectionRef = useRef(null);

  /* ---------- tags (firestore) ---------- */
  useEffect(() => {
    if (!currentUser) return;

    const unsub = onSnapshot(collection(fsDb, 'tags'), snap => {
      const map = new Map();

      snap.docs.forEach(d => {
        const raw = d.id || '';
        const key = raw.trim().toLowerCase();
        if (!key) return;
        const count = d.data().count || 0;

        if (!map.has(key)) map.set(key, { name: key, label: raw, count });
        else {
          const prev = map.get(key);
          map.set(key, { ...prev, count: Math.max(prev.count, count) });
        }
      });

      const list = Array.from(map.values()).sort((a, b) => b.count - a.count);
      setSuggestedTags(list);
    });

    return () => unsub();
  }, [currentUser]);

  /* =========================================================
     ✅ Non-sticky highlight (selection only)
     ========================================================= */
  const NonInclusiveHighlight = Highlight.extend({
    inclusive: false,
  }).configure({ multicolor: true });

  /* =========================================================
     ✅ Image with cover UI (NodeView)
     ========================================================= */
  const CoverImage = useMemo(() => {
    return Image.extend({
      addAttributes() {
        return {
          ...this.parent?.(),
          class: {
            default: 'article-img',
            parseHTML: el => el.getAttribute('class'),
            renderHTML: () => ({ class: 'article-img' }),
          },
          'data-size': {
            default: null,
            parseHTML: el => el.getAttribute('data-size'),
            renderHTML: attrs => (attrs['data-size'] ? { 'data-size': attrs['data-size'] } : {}),
          },
          'data-id': {
            default: null,
            parseHTML: el => el.getAttribute('data-id'),
            renderHTML: attrs => (attrs['data-id'] ? { 'data-id': attrs['data-id'] } : {}),
          },
          'data-cover': {
            default: null, // "1"
            parseHTML: el => el.getAttribute('data-cover'),
            renderHTML: attrs => (attrs['data-cover'] ? { 'data-cover': attrs['data-cover'] } : {}),
          },
        };
      },

      addNodeView() {
        return ({ node, editor, getPos }) => {
          const wrap = document.createElement('div');
          wrap.className = 'article-img-wrap';

          const img = document.createElement('img');
          img.className = 'article-img';
          img.setAttribute('src', node.attrs.src);
          if (node.attrs.alt) img.setAttribute('alt', node.attrs.alt);

          if (node.attrs['data-size']) img.setAttribute('data-size', node.attrs['data-size']);
          if (node.attrs['data-id']) img.setAttribute('data-id', node.attrs['data-id']);
          if (node.attrs['data-cover']) img.setAttribute('data-cover', node.attrs['data-cover']);

          const ui = document.createElement('div');
          ui.className = 'article-img-ui';

          const label = document.createElement('div');
          label.className = 'article-img-label';
          label.textContent = 'Set as the cover photo of the article';

          const btn = document.createElement('button');
          btn.type = 'button';
          btn.className = 'article-img-cover-btn';
          btn.textContent = 'Update this image as your cover photo';

          btn.addEventListener('mousedown', (e) => {
            e.preventDefault();
            e.stopPropagation();
          });

          btn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();

            const pos = typeof getPos === 'function' ? getPos() : null;
            if (pos == null) return;

            editor.commands.command(({ state, tr }) => {
              // clear all covers, set this one
              state.doc.descendants((n, p) => {
                if (n.type.name !== 'image') return;
                const next = (p === pos) ? '1' : null;
                if (n.attrs['data-cover'] !== next) {
                  tr.setNodeMarkup(p, undefined, { ...n.attrs, 'data-cover': next });
                }
              });
              return true;
            });

            // move cursor to typing position (so button click doesn’t “stick” on image)
            editor.chain().focus().createParagraphNear().run();
          });

          ui.appendChild(label);
          ui.appendChild(btn);

          wrap.appendChild(img);
          wrap.appendChild(ui);

          const setUIState = (n, selected) => {
            const isCover = n.attrs['data-cover'] === '1';

            // orange border when selected and not cover
            if (selected && !isCover) wrap.classList.add('is-selected');
            else wrap.classList.remove('is-selected');

            // label visible only if cover
            label.style.display = isCover ? 'block' : 'none';

            // button visible only when selected and not cover
            btn.style.display = (selected && !isCover) ? 'inline-flex' : 'none';
          };

          // initial state
          setUIState(node, false);

          return {
            dom: wrap,
            contentDOM: null,

            selectNode() {
              setUIState(node, true);
            },
            deselectNode() {
              setUIState(node, false);
            },
            update(updatedNode) {
              if (updatedNode.type.name !== 'image') return false;

              // update node reference + attrs
              node = updatedNode;

              img.setAttribute('src', node.attrs.src);
              if (node.attrs['data-size']) img.setAttribute('data-size', node.attrs['data-size']);
              else img.removeAttribute('data-size');

              if (node.attrs['data-id']) img.setAttribute('data-id', node.attrs['data-id']);
              else img.removeAttribute('data-id');

              if (node.attrs['data-cover']) img.setAttribute('data-cover', node.attrs['data-cover']);
              else img.removeAttribute('data-cover');

              // keep UI synced (selection status comes from PM calling select/deselect)
              const isSelected = wrap.classList.contains('ProseMirror-selectednode') || wrap.classList.contains('is-selected');
              setUIState(node, isSelected);

              return true;
            },
          };
        };
      },
    }).configure({ allowBase64: true });
  }, []);

  /* =========================================================
     ✅ Editor
     ========================================================= */
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
      }),
      Underline,
      TextStyle,
      Color,
      NonInclusiveHighlight,
      LinkExt.configure({ openOnClick: false, HTMLAttributes: { rel: 'noopener nofollow' } }),
      CoverImage,
      Youtube.configure({ inline: false, width: 640 }),
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      TaskList,
      TaskItem.configure({ nested: true }),
    ],
    content: '<p></p>',
     
     editorProps: {
    handleTextInput(view, from, to, text) {
      const { state } = view;
      const sel = state.selection;

      // ✅ If an image is selected, typing must NOT replace it
      if (sel?.node && sel.node.type.name === 'image') {
        const after = sel.from + sel.node.nodeSize;

        // Move cursor AFTER image
        const tr = state.tr.setSelection(
          TextSelection.create(state.doc, after)
        );

        view.dispatch(tr);

        // Insert typed text safely
        view.dispatch(view.state.tr.insertText(text));

        return true; // handled
      }

      return false;
    },

    handleKeyDown(view, event) {
      const { state } = view;
      const sel = state.selection;

      if (sel?.node && sel.node.type.name === 'image') {
        const isPrintable =
          event.key.length === 1 &&
          !event.ctrlKey &&
          !event.metaKey &&
          !event.altKey;

        // ✅ Typing should move cursor, not delete image
        if (isPrintable) {
          event.preventDefault();

          const after = sel.from + sel.node.nodeSize;
          view.dispatch(
            state.tr.setSelection(TextSelection.create(state.doc, after))
          );

          view.dispatch(view.state.tr.insertText(event.key));
          return true;
        }

        // ✅ Block Backspace/Delete (only toolbar delete allowed)
        if (event.key === 'Backspace' || event.key === 'Delete') {
          event.preventDefault();
          return true;
        }
      }

      return false;
    },
  },
   


    onCreate({ editor }) {
      const hasText = editor.state.doc.textContent.trim().length > 0;
      let hasAnyImage = false;
      editor.state.doc.descendants((node) => {
        if (node.type.name === 'image') { hasAnyImage = true; return false; }
        return true;
      });
      setIsEmpty(!hasText && !hasAnyImage);
    },
    onUpdate({ editor }) {
      const hasText = editor.state.doc.textContent.trim().length > 0;
      let hasAnyImage = false;
      editor.state.doc.descendants((node) => {
        if (node.type.name === 'image') { hasAnyImage = true; return false; }
        return true;
      });
      setIsEmpty(!hasText && !hasAnyImage);
    },
  });

  /* ---------- keep coverURL always in sync with doc ---------- */
  const syncCoverFromDoc = useCallback(() => {
    if (!editor) return;
    let found = null;
    editor.state.doc.descendants((node) => {
      if (node.type.name === 'image' && node.attrs['data-cover'] === '1') {
        found = node.attrs.src;
        return false;
      }
      return true;
    });
    setCoverURL(found);
  }, [editor]);

  useEffect(() => {
    if (!editor) return;
    syncCoverFromDoc();
    editor.on('transaction', syncCoverFromDoc);
    return () => editor.off('transaction', syncCoverFromDoc);
  }, [editor, syncCoverFromDoc]);

  /* ---------- focus/blur (placeholder) ---------- */
  useEffect(() => {
    if (!editor) return;
    const onFocus = () => setIsFocused(true);
    const onBlur = () => setIsFocused(false);
    editor.on('focus', onFocus);
    editor.on('blur', onBlur);
    return () => {
      editor.off('focus', onFocus);
      editor.off('blur', onBlur);
    };
  }, [editor]);

  /* ---------- tag helpers ---------- */
  const addTag = name => {
    const tag = String(name || '').trim().toLowerCase();
    if (tag && !tags.includes(tag)) setTags(prev => [...prev, tag]);
  };
  const removeTag = name => setTags(prev => prev.filter(t => t !== name));

  /* ---------- click-away + ESC for portaled panels ---------- */
  useEffect(() => {
    const onDocClick = (e) => {
      const inMoreBtn = moreBtnRef.current?.contains(e.target);
      const inMorePanel = morePanelRef.current?.contains(e.target);
      if (!inMoreBtn && !inMorePanel) setMoreOpen(false);

      const inEmojiBtn = emojiBtnRef.current?.contains(e.target);
      const inEmojiPanel = emojiPanelRef.current?.contains(e.target);
      if (!inEmojiBtn && !inEmojiPanel) setPickerVisible(false);

      const inHlBtn = hlBtnRef.current?.contains(e.target);
      const inHlPanel = hlPanelRef.current?.contains(e.target);
      if (!inHlBtn && !inHlPanel) setHlOpen(false);
    };

    const onEsc = (e) => {
      if (e.key === 'Escape') {
        setMoreOpen(false);
        setPickerVisible(false);
        setHlOpen(false);
      }
    };

    document.addEventListener('mousedown', onDocClick);
    document.addEventListener('keydown', onEsc);
    return () => {
      document.removeEventListener('mousedown', onDocClick);
      document.removeEventListener('keydown', onEsc);
    };
  }, []);

  /* ---------- portal positions ---------- */
  useEffect(() => {
    const updatePositions = () => {
      if (moreOpen && moreBtnRef.current) {
        const r = moreBtnRef.current.getBoundingClientRect();
        setMorePos({ top: r.bottom + 8 + window.scrollY, left: r.left + window.scrollX });
      }
      if (pickerVisible && emojiBtnRef.current) {
        const r = emojiBtnRef.current.getBoundingClientRect();
        setEmojiPos({ top: r.bottom + 8 + window.scrollY, left: r.left + window.scrollX - 8 });
      }
      if (hlOpen && hlBtnRef.current) {
        const r = hlBtnRef.current.getBoundingClientRect();
        setHlPos({ top: r.bottom + 8 + window.scrollY, left: r.left + window.scrollX - 6 });
      }
    };

    updatePositions();
    window.addEventListener('scroll', updatePositions, true);
    window.addEventListener('resize', updatePositions);
    return () => {
      window.removeEventListener('scroll', updatePositions, true);
      window.removeEventListener('resize', updatePositions);
    };
  }, [moreOpen, pickerVisible, hlOpen]);

  /* =========================================================
     ✅ Image upload:
     1) Insert image
     2) If it's the first image, auto-set as cover (data-cover="1")
     3) Immediately return cursor to typing (so image never disappears)
     ========================================================= */
  const handleImgUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file || !editor) return;

    const reader = new FileReader();
    reader.onload = () => {
      const src = reader.result;
      const id = `img_${Date.now()}_${Math.random().toString(16).slice(2)}`;

      // do we already have a cover?
      let hasCover = false;
      editor.state.doc.descendants((node) => {
        if (node.type.name === 'image' && node.attrs['data-cover'] === '1') {
          hasCover = true;
          return false;
        }
        return true;
      });

      const attrs = { src, 'data-id': id };
      if (!hasCover) attrs['data-cover'] = '1'; 

      editor.commands.command(({ state, tr, dispatch }) => {
      const sel = state.selection;

      // NodeSelection on an image
      if (sel?.node && sel.node.type?.name === 'image') {
        const after = sel.from + sel.node.nodeSize;
        tr.setSelection(TextSelection.create(tr.doc, after));
      }

      if (dispatch) dispatch(tr);
      return true;
    });
   
    if (editor.isActive('image')) {
    editor.chain().focus().createParagraphNear().run();
    }

      editor
        .chain()
        .focus()
        .setImage(attrs)
        .createParagraphNear() 
        .run();

      // if first image was cover, ensure all others are cleared (safety)
      if (!hasCover) {
        editor.commands.command(({ state, tr }) => {
          state.doc.descendants((node, pos) => {
            if (node.type.name !== 'image') return;
            const next = (node.attrs.src === src) ? '1' : null;
            if (node.attrs['data-cover'] !== next) {
              tr.setNodeMarkup(pos, undefined, { ...node.attrs, 'data-cover': next });
            }
          });
          return true;
        });
      }

      e.target.value = '';
    };

    reader.readAsDataURL(file);
  };

  /* ---------- replace selected image (kept) ---------- */
  const handleReplaceSelectedImage = (e) => {
    const file = e.target.files?.[0];
    if (!file || !editor) return;

    if (!editor.isActive('image')) {
      alert('Select an image first to replace it.');
      e.target.value = '';
      return;
    }

    const sel = editor.state.selection;
    const node = sel?.node;
    const wasCover = node?.attrs?.['data-cover'] === '1';

    const reader = new FileReader();
    reader.onload = () => {
      const newSrc = reader.result;
      editor.chain().focus().updateAttributes('image', { src: newSrc }).run();

      // if replaced image was cover, keep it cover
      if (wasCover) {
        editor.commands.command(({ state, tr }) => {
          state.doc.descendants((n, pos) => {
            if (n.type.name !== 'image') return;
            const next = (pos === sel.from) ? '1' : n.attrs['data-cover'];
            // best-effort: if selection changed, still preserve by src scan
            return true;
          });
          return true;
        });
      }

      // get cursor back to typing
      editor.chain().focus().createParagraphNear().run();
    };

    reader.readAsDataURL(file);
    e.target.value = '';
  };

  /* ---------- toolbar helpers ---------- */
  const rememberSelection = () => {
    if (!editor) return;
    const { from, to } = editor.state.selection;
    lastSelectionRef.current = { from, to };
  };

  const setBlockType = (e) => {
    const v = e.target.value;
    const sel = lastSelectionRef.current;

    let chain = editor?.chain().focus();
    if (!chain) return;
    if (sel) chain = chain.setTextSelection(sel);

    switch (v) {
      case 'p': chain.setParagraph().run(); break;
      case 'h1': chain.toggleHeading({ level: 1 }).run(); break;
      case 'h2': chain.toggleHeading({ level: 2 }).run(); break;
      case 'h3': chain.toggleHeading({ level: 3 }).run(); break;
      default: break;
    }

    lastSelectionRef.current = null;
  };

  const addLink = () => {
    const url = window.prompt('Enter URL (https://…)');
    if (!url) return;
    editor?.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  };
  const removeLink = () => editor?.chain().focus().unsetLink().run();
  const insertHR = () => editor?.chain().focus().setHorizontalRule().run();
  const insertYouTube = () => {
    const url = window.prompt('Paste a YouTube URL');
    if (!url) return;
    editor?.chain().focus().setYoutubeVideo({ src: url, width: 640, height: 360 }).run();
  };

  const handleFileAttach = async (e) => {
    const file = e.target.files?.[0];
    if (!file || !currentUser) return;
    try {
      const path = `files/${currentUser.uid}/${Date.now()}_${file.name}`;
      const ref = sRef(storage, path);
      await uploadBytes(ref, file);
      const url = await getDownloadURL(ref);
      editor?.chain().focus()
        .insertContent(`<a href="${url}" rel="noopener nofollow" target="_blank">${file.name}</a>`)
        .run();
    } finally {
      e.target.value = '';
    }
  };

  const clearFormatting = () => editor?.chain().focus().clearNodes().unsetAllMarks().run();

  /* ---------- emoji select ---------- */
  const handleEmojiSelect = (emoji) => {
    const char = emoji?.native || '';
    if (!char) return;
    editor?.chain().focus().insertContent(char).run();
    setPickerVisible(false);
  };

  /* =========================================================
     ✅ Highlight dropdown logic (selection only + no sticky)
     ========================================================= */
  const clearStoredHighlight = useCallback(() => {
    if (!editor) return;
    const { state, view } = editor;
    const markType = state.schema.marks.highlight;
    if (!markType) return;
    view.dispatch(state.tr.removeStoredMark(markType).setStoredMarks([]));
  }, [editor]);

  useEffect(() => {
    if (!editor) return;
    const fn = () => {
      if (editor.state.selection.empty) clearStoredHighlight();
    };
    editor.on('selectionUpdate', fn);
    return () => editor.off('selectionUpdate', fn);
  }, [editor, clearStoredHighlight]);

  const applyHighlightColor = useCallback((color) => {
    if (!editor) return;

    const { to, empty } = editor.state.selection;
    if (empty) return;

    editor.chain().focus().setHighlight({ color }).run();
    editor.chain().focus().setTextSelection(to).run();
    clearStoredHighlight();
    setHlOpen(false);
  }, [editor, clearStoredHighlight]);

  const removeHighlightFromSelection = useCallback(() => {
    if (!editor) return;

    const { to, empty } = editor.state.selection;
    if (empty) return;

    editor.chain().focus().unsetHighlight().run();
    editor.chain().focus().setTextSelection(to).run();
    clearStoredHighlight();
    setHlOpen(false);
  }, [editor, clearStoredHighlight]);

  // Track active highlight color for underline indicator
  useEffect(() => {
    if (!editor) return;

    const update = () => {
      const attrs = editor.getAttributes('highlight');
      const c = attrs?.color;
      if (editor.isActive('highlight') && c) setActiveHighlightColor(c);
      else setActiveHighlightColor('#D9D9D9');
    };

    update();
    editor.on('selectionUpdate', update);
    editor.on('transaction', update);
    return () => {
      editor.off('selectionUpdate', update);
      editor.off('transaction', update);
    };
  }, [editor]);

  /* =========================================================
     ✅ List dropdown logic (NO mismatched transactions)
     ========================================================= */
  const getActiveListType = () => {
    if (!editor) return 'none';
    if (editor.isActive('taskList')) return 'task';
    if (editor.isActive('bulletList')) return 'bullet';
    if (editor.isActive('orderedList')) return 'ordered';
    return 'none';
  };

  const [listValue, setListValue] = useState('none');

  useEffect(() => {
    if (!editor) return;
    const sync = () => setListValue(getActiveListType());
    sync();
    editor.on('selectionUpdate', sync);
    return () => editor.off('selectionUpdate', sync);
  }, [editor]);

  const setListType = (e) => {
    const v = e.target.value;
    if (!editor) return;

    editor
      .chain()
      .focus()
      .command(({ editor, commands }) => {
        // if image is selected, move cursor to text first
        if (editor.isActive('image')) {
          commands.createParagraphNear();
        }

        // always clear all list types first (safe)
        if (editor.isActive('taskList')) commands.toggleTaskList();
        if (editor.isActive('bulletList')) commands.toggleBulletList();
        if (editor.isActive('orderedList')) commands.toggleOrderedList();

        // then apply selected
        if (v === 'bullet') commands.toggleBulletList();
        if (v === 'ordered') commands.toggleOrderedList();
        if (v === 'task') commands.toggleTaskList();

        return true;
      })
      .run();

    setListValue(v);
  };

  /* =========================================================
     ✅ Align dropdown logic (works on current paragraph/heading)
     NOTE: “line inside same paragraph” is impossible without splitting.
     If user uses Shift+Enter hardBreak, we split the block first.
     ========================================================= */
  const getActiveAlign = () => {
    if (!editor) return 'left';
    if (editor.isActive({ textAlign: 'center' })) return 'center';
    if (editor.isActive({ textAlign: 'right' })) return 'right';
    return 'left';
  };

  const [alignValue, setAlignValue] = useState('left');

  useEffect(() => {
    if (!editor) return;
    const sync = () => setAlignValue(getActiveAlign());
    sync();
    editor.on('selectionUpdate', sync);
    return () => editor.off('selectionUpdate', sync);
  }, [editor]);

  const setAlign = (e) => {
    const v = e.target.value;
    if (!editor) return;

    editor
      .chain()
      .focus()
      .command(({ state, commands }) => {
        // if paragraph contains hardBreaks, split into real paragraphs so align affects only “current line”
        const { $from } = state.selection;
        const parent = $from.parent;
        if (parent?.type?.name === 'paragraph') {
          let hasHardBreak = false;
          parent.descendants((n) => {
            if (n.type.name === 'hardBreak') { hasHardBreak = true; return false; }
            return true;
          });
          if (hasHardBreak) {
            commands.splitBlock();
          }
        }
        return true;
      })
      .setTextAlign(v)
      .run();

    setAlignValue(v);
  };

  /* ---------- submit & draft ---------- */
  const handleSubmit = async () => {
    if (publishing) return;
    if (!editor) return;

    const body = editor.getHTML();
    const bodyText = body.replace(/<[^>]*>?/gm, '').trim();

    if (!title.trim() || !bodyText) {
      alert('Title and body are required');
      return;
    }

    setPublishing(true);

    try {
      const ts = Date.now();
      const payload = {
        title,
        body,
        tags,
        coverUrl: coverURL || '',
        authorId: currentUser.uid,
        createdAt: ts,
        updatedAt: ts,
      };

      let artId;
      if (isEdit && !isDraftMode) {
        await updateArticle(id, payload);
        artId = id;
      } else {
        const res = await createArticle(payload);
        artId = res.id;
        if (isDraftMode) await deleteDraft(currentUser.uid, id);
      }

      await Promise.all(
        tags.map(async t => {
          const refDoc = doc(fsDb, 'tags', t);
          await setDoc(refDoc, { count: increment(1), updatedAt: serverTimestamp() }, { merge: true });
        })
      );

      nav(`/article/${artId}`);
    } catch (e) {
      console.error(e);
      alert('Something went wrong, please try again.');
      setPublishing(false);
    }
  };

  const handleSaveDraft = async () => {
    if (!currentUser) { alert('Please sign in first.'); return; }
    if (!editor) return;

    try {
      const body = editor.getHTML();
      const ts = Date.now();
      const draftPayload = {
        userId: currentUser.uid,
        title: title || '(untitled)',
        body,
        tags,
        coverUrl: coverURL || '',
        status: 'draft',
        createdAt: ts,
        updatedAt: ts,
      };

      if (isEdit && isDraftMode) await updateDraft(currentUser.uid, id, draftPayload);
      else await createDraft(currentUser.uid, draftPayload);

      alert('Draft saved.');
    } catch (e) {
      console.error('Draft save error:', e);
      alert('Could not save draft. Please try again.');
    }
  };

  const handleDelete = async () => {
    if (!isEdit) return;
    const ok = window.confirm('Delete this article permanently?');
    if (!ok) return;

    try {
      if (isDraftMode) {
        await deleteDraft(currentUser.uid, id);
        alert('Draft deleted.');
        nav('/profile');
      } else {
        await rtdbRemove(rtdbRef(rtdb, `articles/${id}`));
        alert('Article deleted.');
        nav('/');
      }
    } catch {
      alert('Failed to delete. Try again.');
    }
  };

  const dateString = useMemo(() => {
    const now = new Date();
    const opts = { year: 'numeric', month: 'long', day: 'numeric' };
    return now.toLocaleDateString(undefined, opts);
  }, []);

  const setImageSize = (sizeKey) => {
    if (!editor?.isActive('image')) return;
    const key = sizeKey === 'sm' || sizeKey === 'lg' ? sizeKey : 'md';
    editor.chain().focus().updateAttributes('image', { 'data-size': key }).run();
  };

  const userName =
    userDoc?.fullName ||
    userDoc?.name ||
    currentUser?.displayName ||
    'User';

  const userRole =
    userDoc?.role ||
    userDoc?.jobTitle ||
    userDoc?.designation ||
    null;

  const userPhoto =
    userDoc?.avatarUrl ||
    currentUser?.photoURL ||
    null;

  const HIGHLIGHT_COLORS = [
    { key: 'red', label: 'Red', color: '#F7B2B0' },
    { key: 'yellow', label: 'Yellow', color: '#F8E08E' },
    { key: 'blue', label: 'Blue', color: '#AFCBFF' },
    { key: 'green', label: 'Green', color: '#B8E6C2' },
    { key: 'grey', label: 'Grey', color: '#D9D9D9' },
  ];

  /* ---------- load article/draft ---------- */
  useEffect(() => {
    if (!isEdit || !editor) return;

    const setFrom = (obj) => {
      setTitle(obj.title || '');
      setTags(obj.tags || []);
      setCoverURL(obj.coverUrl || null);
      editor.commands.setContent(obj.body || '<p></p>');
      // after setting content, cover will be synced via syncCoverFromDoc()
    };

    if (isDraftMode) {
      getDraftOnce(currentUser.uid, id).then(draft => {
        if (!draft) { nav('/profile'); return; }
        setFrom(draft);
      });
    } else {
      rtdbGet(rtdbRef(rtdb, `articles/${id}`)).then(snap => {
        if (!snap.exists()) { nav('/'); return; }
        setFrom(snap.val());
      });
    }
  }, [id, isEdit, isDraftMode, nav, editor, currentUser]);

  return (
    <div style={{ backgroundColor: '#F1F1E6' }}>
      <MDBContainer className="write-wrap py-4">
        <div className="write-topbar bounded mb-4">
          <Link to="/" className="topbar-link">
            <MDBIcon fas icon="arrow-left" className="me-2" /> back to home
          </Link>
          {isEdit && (
            <button type="button" className="topbar-delete-btn" onClick={handleDelete}>
              <MDBIcon fas icon="trash-alt" className="me-2" /> {isDraftMode ? 'delete draft' : 'delete article'}
            </button>
          )}
        </div>

        <div className="bounded">
          <MDBRow className="justify-content-center">
            <MDBCol md="10" lg="9">
              {/* ===================== META ===================== */}
              <div className="write-meta grid mt-2 write-meta--figma">
                <div className="title-col">
                  <div className="write-date">{dateString}</div>
                  <input
                    className="title-input"
                    placeholder="TITLE"
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                  />

                  <div className="tag-suggest tag-suggest--grid mt-3">
                    {suggestedTags.map(({ name, label }) => {
                      const active = tags.includes(name);
                      return (
                        <button
                          type="button"
                          key={name}
                          className={`chip ${active ? 'chip-filled' : 'chip-outline'}`}
                          onClick={() => (active ? removeTag(name) : addTag(name))}
                          title={`${active ? 'Remove' : 'Add'} #${name}`}
                          aria-pressed={active}
                        >
                          #{label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="meta-divider" aria-hidden />

                <div className="cover-col">
                  <div className="cover-circle" title="Your profile">
                    {userPhoto ? (
                      <img src={userPhoto} alt="Profile" />
                    ) : (
                      <div className="cover-empty">
                        <i className="far fa-user" />
                        <span>Profile</span>
                      </div>
                    )}
                  </div>

                  <div className="profile-meta">
                    <div style={{ fontWeight: 600, fontSize: 16 }}>{userName}</div>
                    <div style={{ opacity: 0.75, fontSize: 14, fontWeight: 400 }}>{userRole}</div>
                  </div>
                </div>
              </div>

              {/* ===== Editor ===== */}
              <div className="editor-shell mt-5">
                <div
                  className="editor-canvas transparent"
                  onClick={() => editor?.chain().focus().run()}
                  role="textbox"
                  aria-label="Article body editor"
                >
                  {!isFocused && isEmpty && (
                    <div className="editor-placeholder" aria-hidden="true">
                      Write your article here…
                    </div>
                  )}

                  <EditorContent editor={editor} />
                </div>

                {/* ===== Toolbar ===== */}
                <div className="editor-toolbar bottom shadow-soft">
                  <ToolbarButton title="Bold" icon="bold"
                    active={editor?.isActive('bold')}
                    onClick={() => editor?.chain().focus().toggleBold().run()} />

                  <ToolbarButton title="Italic" icon="italic"
                    active={editor?.isActive('italic')}
                    onClick={() => editor?.chain().focus().toggleItalic().run()} />

                  <ToolbarButton title="Underline" icon="underline"
                    active={editor?.isActive('underline')}
                    onClick={() => editor?.chain().focus().toggleUnderline().run()} />

                  <ToolbarButton title="Strikethrough" icon="strikethrough"
                    active={editor?.isActive('strike')}
                    onClick={() => editor?.chain().focus().toggleStrike().run()} />

                  <label className="tb-color" title="Text color">
                    <input
                      type="color"
                      onChange={e => editor?.chain().focus().setColor(e.target.value).run()}
                    />
                  </label>

                  {/* ✅ Highlight dropdown */}
                  <button
                    type="button"
                    ref={hlBtnRef}
                    className={`tb-btn tb-highlight${editor?.isActive('highlight') ? ' is-active' : ''}`}
                    title="Highlight"
                    onClick={() => setHlOpen(v => !v)}
                    aria-expanded={hlOpen}
                    aria-haspopup="menu"
                  >
                    <i className="fas fa-highlighter" />
                    <span className="tb-hl-underline" style={{ background: activeHighlightColor }} />
                    <i className="fas fa-caret-down tb-caret" />
                  </button>

                  <button
                    type="button"
                    ref={emojiBtnRef}
                    className="tb-btn"
                    title="Emoji"
                    onClick={() => setPickerVisible(v => !v)}
                    aria-expanded={pickerVisible}
                    aria-haspopup="dialog"
                  >
                    <i className="fas fa-smile" />
                  </button>

                  <span className="tb-sep" />

                  {/* Block type dropdown */}
                  <div className="tb-dd">
                    <select
                      className="tb-select tb-select--icon"
                      aria-label="Block type"
                      value={
                        editor?.isActive('heading', { level: 1 }) ? 'h1' :
                        editor?.isActive('heading', { level: 2 }) ? 'h2' :
                        editor?.isActive('heading', { level: 3 }) ? 'h3' : 'p'
                      }
                      onMouseDown={rememberSelection}
                      onChange={setBlockType}
                    >
                      <option value="p">¶</option>
                      <option value="h1">H1</option>
                      <option value="h2">H2</option>
                      <option value="h3">H3</option>
                    </select>
                    <i className="fas fa-caret-down tb-dd-caret" />
                  </div>

                  <span className="tb-sep" />

                  {/* ✅ Lists */}
                  <div className="tb-dd" title="Lists">
                    <select
                      className="tb-select tb-select--icon"
                      aria-label="Lists"
                      value={listValue}
                      onChange={setListType}
                    >
                      <option value="none">≡</option>
                      <option value="bullet">•</option>
                      <option value="ordered">1.</option>
                      {/* <option value="task">☑</option> */}
                    </select>
                    <i className="fas fa-caret-down tb-dd-caret" />
                  </div>

                  <span className="tb-sep" />

                  {/* ✅ Align */}
                  <div className="tb-dd" title="Align">
                    <select
                      className="tb-select tb-select--icon"
                      aria-label="Align"
                      value={alignValue}
                      onChange={setAlign}
                    >
                      <option value="left">L</option>
                      <option value="center">C</option>
                      <option value="right">R</option>
                    </select>
                    <i className="fas fa-caret-down tb-dd-caret" />
                  </div>

                  <span className="tb-sep" />

                  {/* Insert Image */}
                  <div className="tb-dd" title="InsertImage">
                    <button type="button" className="tb-btn" 
                      onClick={() => {
                          if (!editor) return;
                      
                          // ✅ If an image is selected, move cursor out of it BEFORE picking a file
                          if (editor.isActive('image')) {
                            editor.chain().focus().createParagraphNear().run();
                          } else {
                            editor.chain().focus().run();
                          }
                      
                          imgInputRef.current?.click();
                        }}                    >
                      <i className="fas fa-image" />
                    </button>
                  </div>

                  <span className="tb-sep" />

                  <button
                    type="button"
                    ref={moreBtnRef}
                    className="tb-btn tb-plus"
                    title="More"
                    onClick={() => setMoreOpen(o => !o)}
                    aria-expanded={moreOpen}
                    aria-haspopup="menu"
                  >
                    <i className="fas fa-plus" />
                  </button>
                </div>

                {/* Hidden inputs for uploads */}
                <input ref={imgInputRef} type="file" hidden accept="image/*" onChange={handleImgUpload} />
                <input ref={fileInputRef} type="file" hidden onChange={handleFileAttach} />

                {/* ✅ Highlight menu (PORTAL) */}
                {hlOpen && createPortal(
                  <div
                    ref={hlPanelRef}
                    className="tb-hl-panel"
                    style={{ position: 'absolute', top: hlPos.top, left: hlPos.left, zIndex: 9999 }}
                    role="menu"
                  >
                    {HIGHLIGHT_COLORS.map(c => (
                      <button
                        key={c.key}
                        className="tb-hl-item"
                        onClick={() => applyHighlightColor(c.color)}
                      >
                        <span className="tb-hl-swatch" style={{ background: c.color }} />
                        <span>{c.label}</span>
                      </button>
                    ))}

                    <div className="tb-divider" />

                    <button className="tb-hl-item tb-hl-remove" onClick={removeHighlightFromSelection}>
                      <i className="fas fa-eraser" />
                      <span>Remove highlight</span>
                    </button>

                    <div className="tb-hl-note">
                      Highlights apply only when text is selected.
                    </div>
                  </div>,
                  document.body
                )}

                {/* Emoji picker (PORTAL) */}
                {pickerVisible && createPortal(
                  <div
                    ref={emojiPanelRef}
                    className="emoji-all-pop"
                    style={{ position: 'absolute', top: emojiPos.top, left: emojiPos.left, zIndex: 9999 }}
                    role="dialog"
                    aria-modal="true"
                  >
                    <Picker
                      data={emojiData}
                      onEmojiSelect={handleEmojiSelect}
                      theme="light"
                      navPosition="bottom"
                      previewPosition="none"
                      searchPosition="top"
                      perLine={8}
                    />
                  </div>,
                  document.body
                )}

                {/* “+ More” panel (PORTAL) */}
                {moreOpen && createPortal(
                  <div
                    ref={morePanelRef}
                    className="tb-more-panel"
                    style={{ position: 'absolute', top: morePos.top, left: morePos.left, zIndex: 9999 }}
                    role="menu"
                  >
                    <button className="tb-item" onClick={addLink}>
                      <i className="fas fa-link" /><span>Insert link</span>
                    </button>
                    <button className="tb-item" onClick={removeLink}>
                      <i className="fas fa-unlink" /><span>Remove link</span>
                    </button>

                    <button className="tb-item" onClick={() => fileInputRef.current?.click()}>
                      <i className="fas fa-file" /><span>Attach file</span>
                    </button>

                    <button className="tb-item" onClick={insertYouTube}>
                      <i className="fas fa-video" /><span>Insert YouTube</span>
                    </button>
                    <button className="tb-item" onClick={insertHR}>
                      <i className="fas fa-minus" /><span>Horizontal rule</span>
                    </button>

                    <div className="tb-divider" />

                    <button className="tb-item" onClick={clearFormatting}>
                      <i className="fas fa-eraser" /><span>Clear formatting</span>
                    </button>
                    <button className="tb-item" onClick={() => editor?.chain().focus().undo().run()}>
                      <i className="fas fa-undo" /><span>Undo</span>
                    </button>
                    <button className="tb-item" onClick={() => editor?.chain().focus().redo().run()}>
                      <i className="fas fa-redo" /><span>Redo</span>
                    </button>
                  </div>,
                  document.body
                )}

                {/* image bubble tools */}
                {editor && (
                  <BubbleMenu
                    editor={editor}
                    shouldShow={({ editor }) => editor.isActive('image')}
                    tippyOptions={{ duration: 0 }}
                  >
                    <div className="bubble-tools">
                      <MDBBtn type="button" size="sm" color="light"
                        onClick={() => setImageSize('sm')} title="Small image">
                        S
                      </MDBBtn>
                      <MDBBtn type="button" size="sm" color="light"
                        onClick={() => setImageSize('md')} title="Medium image">
                        M
                      </MDBBtn>
                      <MDBBtn type="button" size="sm" color="light"
                        onClick={() => setImageSize('lg')} title="Large image">
                        L
                      </MDBBtn>

                      <MDBBtn type="button" size="sm" color="light"
                        onClick={() => document.getElementById('img-edit-upload').click()}
                        title="Replace image">
                        <MDBIcon fas icon="pencil-alt" />
                      </MDBBtn>

                      <MDBBtn
                        type="button"
                        size="sm"
                        color="light"
                        onClick={() => {
                          const sel = editor?.state?.selection;
                          const node = sel?.node;
                          const src = node?.type?.name === 'image' ? node.attrs?.src : null;
                          const wasCover = node?.attrs?.['data-cover'] === '1';

                          editor.chain().focus().deleteSelection().run();

                          // if deleted cover, clear coverURL (transaction sync will handle)
                          if (wasCover && src && src === coverURL) {
                            setCoverURL(null);
                          }

                          // back to typing
                          editor.chain().focus().createParagraphNear().run();
                        }}
                        title="Delete image"
                      >
                        <MDBIcon fas icon="trash" />
                      </MDBBtn>
                    </div>
                  </BubbleMenu>
                )}

                <input
                  id="img-edit-upload"
                  hidden
                  type="file"
                  accept="image/*"
                  onChange={handleReplaceSelectedImage}
                />
              </div>

              {/* ===== Actions ===== */}
              <div className="write-actions mt-5" aria-label="article actions">
                <button type="button" className="btn-preview pill-btn" onClick={() => setPreviewOpen(true)}>
                  Preview
                </button>
                <button type="button" className="btn-publish pill-btn" disabled={publishing} onClick={handleSubmit}>
                  {publishing ? (<><MDBSpinner size="sm" tag="span" className="me-2" role="status" />Publishing…</>) : 'PUBLISH'}
                </button>
                <div className="save-row">
                  <button type="button" className="save-draft-link" onClick={handleSaveDraft}>Save as Draft</button>
                </div>
              </div>
            </MDBCol>
          </MDBRow>
        </div>
      </MDBContainer>

      <PreviewOverlay
        open={previewOpen}
        onClose={() => setPreviewOpen(false)}
        onPublish={handleSubmit}
        title={title}
        tags={tags}
        coverUrl={coverURL}
        bodyHTML={editor?.getHTML?.() || ''}
      />
    </div>
  );
}

/* ---------- Preview overlay ---------- */
function PreviewOverlay({ open, onClose, onPublish, title, tags, coverUrl, bodyHTML }) {
  if (!open) return null;

  return (
    <div className="preview-overlay" role="dialog" aria-modal="true">
      <div className="preview-panel">
        <div className="preview-header">
          <div className="preview-cover">
            {coverUrl ? (
              <img src={coverUrl} alt="Cover" />
            ) : (
              <div className="preview-cover--empty">
                <i className="far fa-image" />
              </div>
            )}
          </div>

          <div className="preview-meta">
            <h1 className="preview-title">{title || 'Untitled'}</h1>

            {Array.isArray(tags) && tags.length > 0 && (
              <div className="preview-tags">
                {tags.map(t => (
                  <span key={t} className="chip chip-outline">#{t}</span>
                ))}
              </div>
            )}

            <div
              className="preview-body"
              dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(bodyHTML || '') }}
            />
          </div>
        </div>

        <div className="preview-actions">
          <button type="button" className="btn-preview pill-btn" onClick={onClose}>Back</button>
        </div>
      </div>
    </div>
  );
}
















