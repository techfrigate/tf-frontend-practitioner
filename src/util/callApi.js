import axios from "axios";
import Cookies from "js-cookie";

const ADMIN_URL = process.env.REACT_APP_ADMIN_URL;
const PATIENT_URL = process.env.REACT_APP_PATIENT_URL;
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

export const callApi = {
  details: (appointmentId) => unwrap(axios.get(`${ADMIN_URL}/calls/appointment/${appointmentId}`, { headers: headers() })),
  tokens: (appointmentId, ids) => unwrap(axios.post(`${ADMIN_URL}/calls/appointment/${appointmentId}/tokens`, ids, { headers: headers() })),
  createLink: (appointmentId, label) => unwrap(axios.post(`${ADMIN_URL}/calls/appointment/${appointmentId}/invites`, { type: "link", label }, { headers: headers() })),
  addPerson: (appointmentId, profileId) => unwrap(axios.post(`${ADMIN_URL}/calls/appointment/${appointmentId}/invites`, { type: "user", profileId }, { headers: headers() })),
  approve: (id) => unwrap(axios.post(`${ADMIN_URL}/calls/invites/${id}/approve`, {}, { headers: headers() })),
  reject: (id) => unwrap(axios.post(`${ADMIN_URL}/calls/invites/${id}/reject`, {}, { headers: headers() })),
  endLive: (appointmentId) => unwrap(axios.delete(`${ADMIN_URL}/calls/appointment/${appointmentId}/live`, { headers: headers() })),
  revoke: (id) => unwrap(axios.delete(`${ADMIN_URL}/calls/invites/${id}`, { headers: headers() })),
  people: (q) => unwrap(axios.get(`${ADMIN_URL}/calls/people`, { params: { q }, headers: headers() })),
  myInvites: () => unwrap(axios.get(`${ADMIN_URL}/calls/my-invites`, { headers: headers() })),
};

// Guest links open the public join page of the patient app.
export const inviteUrl = (token) => `${PATIENT_URL || window.location.origin}/join/${token}`;
