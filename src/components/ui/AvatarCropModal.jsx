// src/components/ui/AvatarCropModal.jsx
// Safe crop‑modal that never calls URL.createObjectURL on invalid input.
// Uses react‑easy‑crop and returns a **data‑URL string** via onDone().

import React, { useState, useCallback, useEffect } from 'react';
import Cropper from 'react-easy-crop';
import {
  MDBModal, MDBModalDialog, MDBModalContent, MDBModalHeader,
  MDBModalBody, MDBRange, MDBBtn
} from 'mdb-react-ui-kit';

/** Convert the selected crop rectangle to a JPEG data‑URL string. */
async function cropToDataURL(src, crop) {
  const img = await new Promise((res) => {
    const i = new Image();
    i.src = src;
    i.onload = () => res(i);
  });
  const canvas = document.createElement('canvas');
  canvas.width = crop.width;
  canvas.height = crop.height;
  const ctx = canvas.getContext('2d');
  ctx.drawImage(
    img,
    crop.x, crop.y, crop.width, crop.height,
    0, 0, crop.width, crop.height
  );
  return canvas.toDataURL('image/jpeg', 0.9);
}

export default function AvatarCropModal({ file, open, onClose, onDone }) {
  const [crop, setCrop]   = useState({ x: 0, y: 0 });
  const [zoom, setZoom]   = useState(1);
  const [area, setArea]   = useState(null);
  const [imgSrc, setImg]  = useState('');

  /* Convert File → object‑URL once, and revoke on cleanup */
  useEffect(() => {
    if (!file) { setImg(''); return; }
    if (file instanceof Blob) {
      const url = URL.createObjectURL(file);
      setImg(url);
      return () => URL.revokeObjectURL(url);
    }
    // if a string (already a URL) just use it
    if (typeof file === 'string') setImg(file);
  }, [file]);

  const onComplete = useCallback((_a, pixels) => setArea(pixels), []);

  const handleSave = async () => {
    if (!area || !imgSrc) return;
    const dataURL = await cropToDataURL(imgSrc, area);
    onDone(dataURL);
    onClose();
  };

  return (
    <MDBModal open={open} setOpen={onClose} tabIndex="-1">
      <MDBModalDialog centered>
        <MDBModalContent>
          <MDBModalHeader className="fw-semibold">Adjust your avatar</MDBModalHeader>
          <MDBModalBody className="d-flex flex-column align-items-center">
            <div style={{ width: '100%', height: 300, position: 'relative' }}>
              {imgSrc && (
                <Cropper
                  image={imgSrc}
                  crop={crop}
                  zoom={zoom}
                  aspect={1}
                  onCropChange={setCrop}
                  onZoomChange={setZoom}
                  onCropComplete={onComplete}
                />
              )}
            </div>

            <MDBRange
              min="1" max="3" step="0.1" value={zoom}
              onChange={(e) => setZoom(Number(e.target.value))}
              className="w-100 mt-3"
            />

            <MDBBtn className="mt-3" onClick={handleSave}>Save</MDBBtn>
          </MDBModalBody>
        </MDBModalContent>
      </MDBModalDialog>
    </MDBModal>
  );
}
