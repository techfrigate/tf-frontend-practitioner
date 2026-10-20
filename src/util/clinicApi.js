import axios from "axios";
import Cookies from "js-cookie";
import { format } from "date-fns";

const ACCOUNTS_URL = process.env.REACT_APP_ACCOUNTS_URL;
const ADMIN_URL = process.env.REACT_APP_ADMIN_URL;

const headers = () => ({
  Authorization: `Bearer ${Cookies.get("Token")}`,
  tenantid: Cookies.get("TenantId"),
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

// Slot and appointment times are stored as wall-clock values in UTC fields.
export const wallClock = (iso) => {
  const d = new Date(iso);
  return new Date(d.getTime() + d.getTimezoneOffset() * 60000);
};
// Inverse of wallClock: a local date/time the user picked -> the stored UTC-field string.
export const toStoredIso = (localDate) => new Date(localDate.getTime() - localDate.getTimezoneOffset() * 60000).toISOString();
export const dayKey = (d) => format(d, "yyyy-MM-dd");

export const clinicApi = {
  day: (date) => unwrap(axios.get(`${ACCOUNTS_URL}/hospital-overview/practitioner`, { params: { date }, headers: headers() })),
  range: (from, to) => unwrap(axios.get(`${ACCOUNTS_URL}/hospital-overview/practitioner/appointments`, { params: { from, to }, headers: headers() })),
  slots: () => unwrap(axios.get(`${ADMIN_URL}/slots`, { headers: headers() })),
  patients: () =>
    unwrap(axios.get(`${ACCOUNTS_URL}/profiles`, { headers: { ...headers(), usertype: "patient" } })).then((d) => d?.profiles || d || []),
  createAppointment: (body) => unwrap(axios.post(`${ADMIN_URL}/appointments`, { ...body, tenantId: Cookies.get("TenantId") }, { headers: headers() })),
  updateAppointment: (id, body) => unwrap(axios.patch(`${ADMIN_URL}/appointments/${id}`, body, { headers: headers() })),
};
