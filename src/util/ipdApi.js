import axios from "axios";
import Cookies from "js-cookie";

const ACCOUNTS_URL = process.env.REACT_APP_ACCOUNTS_URL;
const ADMIN_URL = process.env.REACT_APP_ADMIN_URL;

const headers = (extra = {}) => ({
  Authorization: `Bearer ${Cookies.get("Token")}`,
  tenantid: Cookies.get("TenantId"),
  ...extra,
});

const unwrap = async (request) => {
  try {
    const res = await request;
    if (res.data?.status === "error") throw new Error(res.data.error?.message || "Request failed");
    return res.data.data;
  } catch (error) {
    const body = error.response?.data;
    throw new Error(body?.error?.message || body?.message || error.message || "Request failed");
  }
};

const base = `${ADMIN_URL}/ipd`;

export const ipdApi = {
  bedBoard: (locationId) => unwrap(axios.get(`${base}/beds`, { params: { locationId }, headers: headers() })),
  setBedStatus: (body) => unwrap(axios.patch(`${base}/beds/status`, body, { headers: headers() })),
  admit: (body) => unwrap(axios.post(`${base}/admissions`, body, { headers: headers() })),
  list: (params) => unwrap(axios.get(`${base}/admissions`, { params, headers: headers() })),
  get: (id) => unwrap(axios.get(`${base}/admissions/${id}`, { headers: headers() })),
  catalog: (id) => unwrap(axios.get(`${base}/admissions/${id}/catalog`, { headers: headers() })),
  transfer: (id, body) => unwrap(axios.post(`${base}/admissions/${id}/transfer`, body, { headers: headers() })),
  addNote: (id, body) => unwrap(axios.post(`${base}/admissions/${id}/notes`, body, { headers: headers() })),
  addCharge: (id, body) => unwrap(axios.post(`${base}/admissions/${id}/charges`, body, { headers: headers() })),
  removeCharge: (id, chargeId) => unwrap(axios.delete(`${base}/admissions/${id}/charges/${chargeId}`, { headers: headers() })),
  addDeposit: (id, body) => unwrap(axios.post(`${base}/admissions/${id}/deposits`, body, { headers: headers() })),
  discharge: (id, body) => unwrap(axios.post(`${base}/admissions/${id}/discharge`, body, { headers: headers() })),

  // Supporting look-ups
  locations: () =>
    unwrap(axios.get(`${ADMIN_URL}/locations`, { headers: headers() })).then((d) => d?.locations || d?.data || d || []),
  doctorsAt: (locationId) =>
    unwrap(
      axios.get(`${ACCOUNTS_URL}/profiles/location-profile`, {
        headers: headers({ locationid: locationId, usertype: "practitioner" }),
      })
    ).then((d) => (Array.isArray(d) ? d : d?.data || [])),
  searchPatients: (search) =>
    unwrap(
      axios.get(`${ACCOUNTS_URL}/profiles`, {
        params: { search: search || undefined, page: 1, limit: 20, sortBy: "firstName", order: "asc" },
        headers: headers({ usertype: "patient" }),
      })
    ).then((d) => d?.profiles || d || []),
};

export const inr = (n) =>
  `₹${Number(n || 0).toLocaleString("en-IN", { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`;

export const fullName = (p) => [p?.firstName, p?.lastName].filter(Boolean).join(" ") || "Unknown";

export const ageSex = (p) => {
  const parts = [];
  if (p?.dob) {
    const years = Math.floor((Date.now() - new Date(p.dob).getTime()) / (365.25 * 24 * 3600 * 1000));
    if (Number.isFinite(years)) parts.push(`${years}y`);
  }
  if (p?.gender) parts.push(p.gender[0].toUpperCase());
  return parts.join(" · ");
};

export const ADMISSION_TYPES = [
  { value: "emergency", label: "Emergency" },
  { value: "elective", label: "Elective / planned" },
  { value: "daycare", label: "Day care" },
  { value: "maternity", label: "Maternity" },
  { value: "transfer", label: "Transfer-in" },
];

export const DISCHARGE_CONDITIONS = [
  { value: "recovered", label: "Recovered" },
  { value: "improved", label: "Improved" },
  { value: "referred", label: "Referred to another facility" },
  { value: "lama", label: "Left against medical advice (LAMA)" },
  { value: "expired", label: "Expired" },
];

export const PAYMENT_METHODS = [
  { value: "cash", label: "Cash" },
  { value: "card", label: "Card" },
  { value: "upi", label: "UPI" },
  { value: "insurance", label: "Insurance / TPA" },
  { value: "other", label: "Other" },
];
