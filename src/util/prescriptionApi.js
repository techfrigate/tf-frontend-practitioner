import axios from "axios";
import Cookies from "js-cookie";

const ADMIN_URL = process.env.REACT_APP_ADMIN_URL;
const headers = () => ({ Authorization: `Bearer ${Cookies.get("Token")}`, tenantid: Cookies.get("TenantId") });

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

const base = `${ADMIN_URL}/prescriptions`;

export const rxApi = {
  suggest: (type, q, locationId) => unwrap(axios.get(`${base}/suggest`, { params: { type, q, locationId }, headers: headers() })),
  context: (params) => unwrap(axios.get(`${base}/context`, { params, headers: headers() })),
  list: (params) => unwrap(axios.get(base, { params, headers: headers() })),
  get: (id) => unwrap(axios.get(`${base}/${id}`, { headers: headers() })),
  fhir: (id) => unwrap(axios.get(`${base}/${id}/fhir`, { headers: headers() })),
  create: (body) => unwrap(axios.post(base, body, { headers: headers() })),
  update: (id, body) => unwrap(axios.patch(`${base}/${id}`, body, { headers: headers() })),
  discard: (id) => unwrap(axios.delete(`${base}/${id}`, { headers: headers() })),
  finalize: (id, body) => unwrap(axios.post(`${base}/${id}/finalize`, body, { headers: headers() })),
  amend: (id, reason) => unwrap(axios.post(`${base}/${id}/amend`, { reason }, { headers: headers() })),
  cancel: (id, reason) => unwrap(axios.post(`${base}/${id}/cancel`, { reason }, { headers: headers() })),
};

// ---------------------------------------------------------------- prescribing vocabulary

export const FREQUENCIES = [
  { code: "OD", label: "OD", hint: "Once a day", perDay: 1 },
  { code: "BD", label: "BD", hint: "Twice a day", perDay: 2 },
  { code: "TDS", label: "TDS", hint: "Three times a day", perDay: 3 },
  { code: "QID", label: "QID", hint: "Four times a day", perDay: 4 },
  { code: "HS", label: "HS", hint: "At bedtime", perDay: 1 },
  { code: "SOS", label: "SOS", hint: "Only when needed", perDay: 0 },
  { code: "STAT", label: "STAT", hint: "Once, immediately", perDay: 1 },
];
export const PATTERNS = ["1-0-0", "0-0-1", "1-0-1", "1-1-1", "0-1-0", "1-1-0"];
export const FOOD = [
  { code: "after", label: "After food" },
  { code: "before", label: "Before food" },
  { code: "with", label: "With food" },
  { code: "empty", label: "Empty stomach" },
  { code: "bedtime", label: "Bedtime" },
];
export const DURATION_UNITS = [
  { code: "d", label: "days", days: 1 },
  { code: "wk", label: "weeks", days: 7 },
  { code: "mo", label: "months", days: 30 },
];
export const ROUTES = [
  { code: "26643006", display: "Oral route", short: "Oral" },
  { code: "47625008", display: "Intravenous route", short: "IV" },
  { code: "78421000", display: "Intramuscular route", short: "IM" },
  { code: "34206005", display: "Subcutaneous route", short: "SC" },
  { code: "37839007", display: "Sublingual route", short: "Sublingual" },
  { code: "6064005", display: "Topical route", short: "Topical" },
  { code: "447694001", display: "Respiratory tract route", short: "Inhalation" },
  { code: "46713006", display: "Nasal route", short: "Nasal" },
  { code: "54485002", display: "Ophthalmic route", short: "Eye" },
  { code: "10547007", display: "Otic route", short: "Ear" },
  { code: "37161004", display: "Rectal route", short: "Rectal" },
];
export const FORMS = ["Tablet", "Capsule", "Syrup", "Suspension", "Injection", "Inhaler", "Drops", "Cream", "Ointment", "Gel", "Sachet", "Spray"];
export const UNIT_FOR_FORM = {
  tablet: "tablet",
  capsule: "capsule",
  syrup: "mL",
  suspension: "mL",
  injection: "vial",
  inhaler: "puff",
  drops: "drop",
  cream: "application",
  ointment: "application",
  gel: "application",
  sachet: "sachet",
  spray: "spray",
};
export const COUNTABLE = ["tablet", "capsule", "sachet"];
export const ADVICE_SNIPPETS = [
  "Drink plenty of fluids.",
  "Take adequate rest.",
  "Avoid oily and spicy food.",
  "Steam inhalation twice daily.",
  "Warm saline gargles 3 times a day.",
  "Monitor temperature; return if fever persists beyond 3 days.",
  "Regular exercise and a low-salt diet.",
  "Check blood sugar before breakfast daily.",
  "Return immediately if symptoms worsen.",
];
export const FOLLOW_UPS = [
  { label: "3 days", days: 3 },
  { label: "1 week", days: 7 },
  { label: "2 weeks", days: 14 },
  { label: "1 month", days: 30 },
  { label: "3 months", days: 90 },
];

const freqHint = (code) => FREQUENCIES.find((f) => f.code === code)?.hint;

/** Human-readable dosing, e.g. "1 tablet · Twice a day · After food · 5 days". */
export const sigText = (m) => {
  const parts = [];
  if (m.doseValue) parts.push(`${m.doseValue} ${m.doseUnit || ""}`.trim());
  if (m.pattern) parts.push(`${m.pattern} (morning-noon-night)`);
  else if (m.frequency) parts.push(freqHint(m.frequency) || m.frequency);
  if (m.foodTiming) parts.push(FOOD.find((f) => f.code === m.foodTiming)?.label);
  if (m.durationValue) parts.push(`${m.durationValue} ${DURATION_UNITS.find((u) => u.code === (m.durationUnit || "d"))?.label}`);
  return parts.filter(Boolean).join(" · ");
};

/** Tablets/capsules needed for the course, if it can be worked out. */
export const autoQuantity = (m) => {
  if (!m.durationValue || !COUNTABLE.includes(String(m.form || "").toLowerCase())) return undefined;
  const days = m.durationValue * (DURATION_UNITS.find((u) => u.code === (m.durationUnit || "d"))?.days || 1);
  const perDay = m.pattern
    ? m.pattern.split("-").reduce((s, x) => s + (Number(x) || 0), 0)
    : (Number(m.doseValue) || 1) * (FREQUENCIES.find((f) => f.code === m.frequency)?.perDay || 0);
  return perDay > 0 ? Math.ceil(perDay * days) : undefined;
};

// Drug classes for allergy cross-checks (substance allergy -> medicines to warn about).
const ALLERGY_CLASSES = {
  penicillin: ["amoxicillin", "ampicillin", "cloxacillin", "penicillin", "piperacillin"],
  aspirin: ["aspirin", "ibuprofen", "diclofenac", "naproxen", "ketorolac"],
  ibuprofen: ["ibuprofen", "diclofenac", "naproxen", "aspirin", "ketorolac"],
  sulfonamide: ["sulfamethoxazole", "cotrimoxazole", "sulfasalazine"],
};
export const allergyConflict = (medName, allergies) => {
  const med = String(medName || "").toLowerCase();
  for (const a of allergies || []) {
    const sub = String(a.substance?.display || "").toLowerCase();
    if (!sub) continue;
    const family = Object.entries(ALLERGY_CLASSES).find(([k]) => sub.includes(k))?.[1] || [sub];
    if (family.some((d) => med.includes(d))) return a.substance.display;
  }
  return null;
};

export const ageOf = (dob) => {
  if (!dob) return null;
  const years = Math.floor((Date.now() - new Date(dob).getTime()) / (365.25 * 24 * 3600 * 1000));
  return Number.isFinite(years) ? years : null;
};
export const nameOf = (p) => [p?.firstName, p?.lastName].filter(Boolean).join(" ");
export const STATUS_BADGE = {
  draft: { label: "Draft", color: "amber" },
  final: { label: "Signed", color: "green" },
  amended: { label: "Superseded", color: "slate" },
  cancelled: { label: "Cancelled", color: "red" },
};
