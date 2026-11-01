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
const get = (u) => unwrap(axios.get(`${ADMIN_URL}${u}`, { headers: headers() }));
const post = (u, b = {}) => unwrap(axios.post(`${ADMIN_URL}${u}`, b, { headers: headers() }));

export const paymentApi = {
  config: () => get("/payments/config"),
  consultationPrice: (practitionerId, visitType) => get(`/payments/consultation-price?practitionerId=${practitionerId}&visitType=${visitType}`),
  offline: (b) => post("/payments/offline", b),
  requests: (appointmentId) => get(`/payments/requests${appointmentId ? `?appointmentId=${appointmentId}` : ""}`),
  createRequest: (b) => post("/payments/requests", b),
  resend: (id) => post(`/payments/requests/${id}/resend`),
  cancelRequest: (id) => post(`/payments/requests/${id}/cancel`),
  payments: (appointmentId) => get(`/payments?appointmentId=${appointmentId}`),
  refund: (b) => post("/payments/refunds", b),
  earnings: () => get("/finance/my-earnings"),
};
export const rupees = (paise) => new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 2 }).format((paise || 0) / 100);
