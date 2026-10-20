import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import axios from "axios";
import Cookies from "js-cookie";
import toast from "react-hot-toast";
import { Camera, ImagePlus, Loader2, X } from "lucide-react";

// Shared by all four portals: uploads to POST /profiles/me/avatar, which stores the file
// (local disk or S3) under the signed-in user's own folder and updates their profile.
const ACCOUNTS_URL = process.env.REACT_APP_ACCOUNTS_URL;
const TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_MB = 5;

export const uploadProfilePhoto = async (file) => {
  const data = new FormData();
  data.append("file", file);
  try {
    const res = await axios.post(`${ACCOUNTS_URL}/profiles/me/avatar`, data, {
      headers: { Authorization: `Bearer ${Cookies.get("Token")}`, tenantid: Cookies.get("TenantId") },
    });
    if (res.data?.status === "error") throw new Error(res.data.error?.message);
    return res.data.data.imageUrl;
  } catch (error) {
    throw new Error(error.response?.data?.error?.message || error.response?.data?.message || error.message || "Upload failed");
  }
};

const ProfilePhotoModal = ({ isOpen, onClose, currentUrl, onUpdated }) => {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const inputRef = useRef(null);
  const overlayRef = useRef(null);

  // The modal is portalled to <body>, so the opener's "click outside to close" listeners (document
  // mousedown/touchstart) see every press in here as an outside click and would close (and unmount) the
  // modal. Stop only those events: click must keep bubbling because React's own handlers rely on it.
  useEffect(() => {
    const el = overlayRef.current;
    if (!isOpen || !el) return;
    const stop = (e) => e.stopPropagation();
    const events = ["mousedown", "touchstart"];
    events.forEach((t) => el.addEventListener(t, stop));
    return () => events.forEach((t) => el.removeEventListener(t, stop));
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) {
      setFile(null);
      setPreview("");
      setError("");
    }
  }, [isOpen]);

  useEffect(() => () => preview && URL.revokeObjectURL(preview), [preview]);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e) => e.key === "Escape" && !saving && onClose();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [isOpen, saving, onClose]);

  if (!isOpen) return null;

  const pick = (f) => {
    if (!f) return;
    if (!TYPES.includes(f.type)) return setError("Choose a JPG, PNG or WebP image.");
    if (f.size > MAX_MB * 1024 * 1024) return setError(`The image must be ${MAX_MB} MB or smaller.`);
    setError("");
    setFile(f);
    setPreview(URL.createObjectURL(f));
  };

  const save = async () => {
    if (!file) return setError("Choose a photo first.");
    setSaving(true);
    try {
      const url = await uploadProfilePhoto(file);
      onUpdated?.(url);
      toast.success("Profile photo updated");
      onClose();
    } catch (e) {
      setError(e.message);
      toast.error(e.message);
    } finally {
      setSaving(false);
    }
  };

  const shown = preview || currentUrl;
  // Portal to <body>: the topbar uses backdrop-blur, which would otherwise trap this fixed overlay inside the header.
  return createPortal(
    <div ref={overlayRef} className="fixed inset-0 z-[70] flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-labelledby="profile-photo-title">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-[1px]" onClick={() => !saving && onClose()} />
      <div className="relative w-full max-w-md rounded-2xl bg-white shadow-xl">
        <div className="flex items-start justify-between border-b border-slate-200 px-6 py-4">
          <div>
            <h3 id="profile-photo-title" className="text-base font-semibold text-slate-900">Profile photo</h3>
            <p className="mt-0.5 text-sm text-slate-500">JPG, PNG or WebP, up to {MAX_MB} MB.</p>
          </div>
          <button type="button" onClick={onClose} disabled={saving} className="rounded-md p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600" aria-label="Close">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="px-6 py-6">
          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              pick(e.dataTransfer.files?.[0]);
            }}
            className="flex flex-col items-center"
          >
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="group relative h-32 w-32 overflow-hidden rounded-full border-4 border-white bg-slate-100 shadow ring-1 ring-slate-200"
              aria-label="Choose photo"
            >
              {shown ? (
                <img src={shown} alt="" className="h-full w-full object-cover" />
              ) : (
                <span className="flex h-full w-full items-center justify-center text-slate-400">
                  <ImagePlus className="h-10 w-10" />
                </span>
              )}
              <span className="absolute inset-0 flex items-center justify-center bg-slate-900/40 text-white opacity-0 transition group-hover:opacity-100">
                <Camera className="h-7 w-7" />
              </span>
            </button>
            <input
              ref={inputRef}
              type="file"
              name="profilePhoto"
              accept={TYPES.join(",")}
              className="sr-only"
              onChange={(e) => {
                pick(e.target.files?.[0]);
                e.target.value = "";
              }}
            />
            <button type="button" onClick={() => inputRef.current?.click()} className="mt-4 text-sm font-semibold text-blue-700 hover:underline">
              {shown ? "Choose a different photo" : "Choose a photo"}
            </button>
            <p className="mt-1 text-xs text-slate-500">or drag and drop it onto the circle</p>
            {error && <p className="mt-3 text-center text-sm text-rose-600">{error}</p>}
          </div>
        </div>

        <div className="flex justify-end gap-2 border-t border-slate-200 px-6 py-4">
          <button type="button" onClick={onClose} disabled={saving} className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">
            Cancel
          </button>
          <button
            type="button"
            onClick={save}
            disabled={saving || !file}
            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-300"
          >
            {saving && <Loader2 className="h-4 w-4 animate-spin" />}
            {saving ? "Uploading…" : "Save photo"}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default ProfilePhotoModal;
