import axios from "axios";
import Cookies from "js-cookie";
import { toast } from "react-hot-toast";

const ACCOUNTS_URL = process.env.REACT_APP_ACCOUNTS_URL;
const authHeaders = () => ({ Authorization: `Bearer ${Cookies.get("Token")}`, tenantid: Cookies.get("TenantId") });

export const PHOTO_TYPES = ["image/jpeg", "image/png", "image/webp"];
export const PHOTO_MAX_MB = 5;

/** Returns an error message if the file can't be used as a profile photo. */
export const photoError = (file) => {
  if (!file) return "Choose a photo.";
  if (!PHOTO_TYPES.includes(file.type)) return "Choose a JPG, PNG or WebP image.";
  if (file.size > PHOTO_MAX_MB * 1024 * 1024) return `The photo must be ${PHOTO_MAX_MB} MB or smaller.`;
  return "";
};

/** Upload a patient's photo (staff only; stored under the hospital's patients/<id> folder). */
export const uploadPatientPhoto = async (patientId, file) => {
  const data = new FormData();
  data.append("file", file);
  try {
    const res = await axios.post(`${ACCOUNTS_URL}/profiles/${patientId}/avatar`, data, { headers: authHeaders() });
    if (res.data?.status === "error") throw new Error(res.data.error?.message);
    return res.data.data.imageUrl;
  } catch (error) {
    throw new Error(error.response?.data?.error?.message || error.message || "Photo upload failed");
  }
};

/** Generic file upload (returns the stored file's URL). */
export const getImageUrl = async (e) => {
  const originalFile = e.target.files[0];
  if (!originalFile) return;
  const sanitizedFile = new File([originalFile], originalFile.name.replace(/\s+/g, "_"), { type: originalFile.type });
  try {
    const data = new FormData();
    data.append("file", sanitizedFile);
    const response = await axios.post(`${ACCOUNTS_URL}/auth/upload-image`, data);
    return response.data.imageUrl;
  } catch (error) {
    toast.error(error.response?.data?.message || "An error occurred");
    throw error;
  }
};
