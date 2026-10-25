import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { addDays, differenceInYears, format, isToday, parseISO } from "date-fns";
import toast from "react-hot-toast";
import {
  Banknote,
  CalendarClock,
  CalendarPlus,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock,
  CreditCard,
  FileText,
  LogIn,
  MapPin,
  MonitorSmartphone,
  RefreshCw,
  Smartphone,
  Stethoscope,
  UserRound,
  Users,
} from "lucide-react";
import { Badge, Button, Card, EmptyState, Modal, Spinner } from "../../Components/Common/ui";
import { clinicApi, dayKey, wallClock } from "../../util/clinicApi";

const STAGES = {
  unconfirmed: { label: "Unconfirmed", color: "red", dot: "bg-rose-500" },
  scheduled: { label: "Waiting", color: "blue", dot: "bg-brand-500" },
  checkedIn: { label: "In consultation", color: "amber", dot: "bg-amber-400" },
  completed: { label: "Seen", color: "care", dot: "bg-care-500" },
};

const STATUS_TABS = [
  ["all", "All"],
  ["scheduled", "Waiting"],
  ["checkedIn", "In consultation"],
  ["completed", "Seen"],
  ["unconfirmed", "Unconfirmed"],
];

const PAYMENT_METHODS = [
  { key: "CASH", label: "Cash", icon: Banknote },
  { key: "CARD", label: "Card / POS", icon: CreditCard },
  { key: "UPI", label: "UPI", icon: Smartphone },
];

const inr = new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 });
const patientName = (p) => [p?.firstName, p?.lastName].filter(Boolean).join(" ") || "Unknown patient";
const patientMeta = (p) =>
  [p?.dob ? `${differenceInYears(new Date(), new Date(p.dob))}y` : null, p?.gender ? p.gender[0].toUpperCase() : null, p?.uhid]
    .filter(Boolean)
    .join(" · ");

const PatientAvatar = ({ patient, size = "h-10 w-10" }) =>
  patient?.imageUrl ? (
    <img src={patient.imageUrl} alt="" className={`${size} shrink-0 rounded-full object-cover`} />
  ) : (
    <span className={`${size} flex shrink-0 items-center justify-center rounded-full bg-violet-50 text-xs font-semibold text-violet-700`}>
      {`${patient?.firstName?.[0] || ""}${patient?.lastName?.[0] || ""}`.toUpperCase() || "?"}
    </span>
  );

const Appointments = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const date = searchParams.get("date") || dayKey(new Date());
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("all");
  const [visit, setVisit] = useState("all");
  const [busyId, setBusyId] = useState(null);
  const [paying, setPaying] = useState(null);
  const [method, setMethod] = useState("CASH");

  const load = useCallback(async () => {
    setLoading(true);
    try {
      setData(await clinicApi.day(date));
      setError(null);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [date]);

  useEffect(() => {
    load();
  }, [load]);

  const setDate = (d) => setSearchParams(d === dayKey(new Date()) ? {} : { date: d });
  const shiftDate = (n) => setDate(dayKey(addDays(parseISO(date), n)));

  const visible = useMemo(() => {
    if (!data) return [];
    return data.queue.filter(
      (a) => (status === "all" || a.stage === status) && (visit === "all" || (visit === "online" ? a.visitType === "Online" : a.visitType !== "Online"))
    );
  }, [data, status, visit]);

  const act = async (a, body, message) => {
    setBusyId(a._id);
    try {
      await clinicApi.updateAppointment(a._id, body);
      toast.success(message);
      await load();
    } catch (e) {
      toast.error(e.message);
    } finally {
      setBusyId(null);
    }
  };

  const collectPayment = async () => {
    const a = paying;
    await act(
      a,
      {
        paymentStatus: "completed",
        paymentMethod: "offline",
        transactionId: `COUNTER-${method}-${Date.now()}`,
        ...(a.stage === "unconfirmed" ? { bookingStatus: { booked: new Date() } } : {}),
      },
      `Payment recorded for ${patientName(a.patient)}`
    );
    setPaying(null);
  };

  const now = new Date();
  const c = data?.todayCounts;
  const shift = data?.shifts?.[0];
  const viewingToday = date === dayKey(now);
  const next = viewingToday ? data?.queue.find((a) => a.stage === "scheduled" && wallClock(a.endDateTime) >= now) : null;

  const actionsFor = (a) => {
    const busy = busyId === a._id;
    const online = a.visitType === "Online";
    const buttons = [];
    if (a.stage === "unconfirmed")
      buttons.push(
        <Button key="confirm" loading={busy} icon={CheckCircle2} onClick={() => act(a, { bookingStatus: { booked: new Date() } }, "Appointment confirmed")}>
          Confirm
        </Button>
      );
    // Check-in is only possible on the appointment day (the server enforces the same rule).
    if (a.stage === "scheduled" && viewingToday)
      buttons.push(
        <Button key="checkin" loading={busy} icon={LogIn} onClick={() => act(a, { bookingStatus: { checkIn: new Date() } }, `${patientName(a.patient)} checked in`)}>
          Check in
        </Button>
      );
    const rx = a.prescription;
    const writeRx = () => navigate(`/prescriptions/write?appointmentId=${a._id}`);
    if (a.stage === "checkedIn" && online)
      buttons.push(
        <Button key="call" icon={MonitorSmartphone} onClick={() => navigate("/worklist")}>
          Start video call
        </Button>,
        <Button key="rx" variant="secondary" icon={FileText} onClick={writeRx}>
          {rx?.status === "draft" ? "Continue prescription" : "Write prescription"}
        </Button>
      );
    if (a.stage === "checkedIn" && !online)
      buttons.push(
        <Button key="rx" icon={FileText} onClick={writeRx}>
          {rx?.status === "draft" ? "Continue prescription" : "Write prescription"}
        </Button>,
        <Button key="done" variant="secondary" loading={busy} icon={CheckCircle2} onClick={() => act(a, { bookingStatus: { checkOut: new Date() } }, "Consultation completed")}>
          Complete without prescription
        </Button>
      );
    if (a.stage === "completed")
      buttons.push(
        rx?.status === "final" ? (
          <Button key="rxv" variant="secondary" icon={FileText} onClick={() => navigate(`/prescriptions/${rx._id}`)}>
            View prescription
          </Button>
        ) : (
          <Button key="rxw" variant="secondary" icon={FileText} onClick={writeRx}>
            {rx?.status === "draft" ? "Continue prescription" : "Write prescription"}
          </Button>
        )
      );
    if (a.paymentStatus !== "completed")
      buttons.push(
        <Button key="pay" variant="secondary" icon={Banknote} onClick={() => setPaying(a)}>
          Collect payment
        </Button>
      );
    return buttons;
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="flex items-center rounded-lg border border-slate-200 bg-white shadow-sm">
            <button onClick={() => shiftDate(-1)} className="rounded-l-lg p-2 text-slate-600 hover:bg-slate-50" aria-label="Previous day">
              <ChevronLeft className="h-5 w-5" />
            </button>
            <input
              type="date"
              value={date}
              onChange={(e) => e.target.value && setDate(e.target.value)}
              className="border-x border-slate-200 px-3 py-1.5 text-sm font-medium text-slate-800 focus:outline-none"
              aria-label="Choose date"
            />
            <button onClick={() => shiftDate(1)} className="rounded-r-lg p-2 text-slate-600 hover:bg-slate-50" aria-label="Next day">
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
          {!viewingToday && (
            <Button variant="secondary" onClick={() => setDate(dayKey(new Date()))}>
              Today
            </Button>
          )}
          <h2 className="ml-1 text-lg font-semibold text-slate-900">
            {isToday(parseISO(date)) ? "Today" : format(parseISO(date), "EEEE")}
            <span className="ml-2 text-sm font-normal text-slate-500">{format(parseISO(date), "d MMMM yyyy")}</span>
          </h2>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" icon={RefreshCw} onClick={load} loading={loading} aria-label="Refresh" />
          <Button icon={CalendarPlus} onClick={() => navigate(`/appointments/new?date=${date}`)}>
            New appointment
          </Button>
        </div>
      </div>

      {error && !data ? (
        <Card>
          <EmptyState icon={RefreshCw} title="Couldn't load appointments" description={error} action={<Button onClick={load}>Try again</Button>} />
        </Card>
      ) : !data ? (
        <Spinner className="min-h-[50vh]" />
      ) : (
        <div className="grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,1fr),320px]">
          <Card>
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 px-4 py-3">
              <div className="flex flex-wrap gap-1">
                {STATUS_TABS.map(([key, label]) => {
                  const count = key === "all" ? c.total : c[key];
                  if (key === "unconfirmed" && !count) return null;
                  return (
                    <button
                      key={key}
                      onClick={() => setStatus(key)}
                      className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                        status === key ? "bg-brand-50 text-brand-700" : "text-slate-600 hover:bg-slate-100"
                      }`}
                    >
                      {label}
                      <span className={`rounded-full px-1.5 text-xs ${status === key ? "bg-brand-100" : "bg-slate-100 text-slate-500"}`}>{count}</span>
                    </button>
                  );
                })}
              </div>
              <div className="flex rounded-lg bg-slate-100 p-0.5 text-sm">
                {[
                  ["all", "All visits"],
                  ["inperson", "In-person"],
                  ["online", "Teleconsult"],
                ].map(([key, label]) => (
                  <button
                    key={key}
                    onClick={() => setVisit(key)}
                    className={`rounded-md px-3 py-1 font-medium ${visit === key ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {visible.length === 0 ? (
              <EmptyState
                icon={CalendarClock}
                title={c.total ? "Nothing matches these filters" : "No appointments on this day"}
                description={c.total ? "Try a different status or visit type." : "Appointments you or your patients book will appear here."}
                action={!c.total && <Button icon={CalendarPlus} onClick={() => navigate(`/appointments/new?date=${date}`)}>Book an appointment</Button>}
              />
            ) : (
              <ul className="divide-y divide-slate-100">
                {visible.map((a) => {
                  const stage = STAGES[a.stage];
                  const start = wallClock(a.startDateTime);
                  const end = wallClock(a.endDateTime);
                  const online = a.visitType === "Online";
                  const overdue = viewingToday && a.stage === "scheduled" && end < now;
                  return (
                    <li key={a._id} className={`flex flex-wrap items-center gap-4 px-4 py-3.5 ${a.stage === "checkedIn" ? "bg-amber-50/40" : ""}`}>
                      <div className="w-20 shrink-0">
                        <p className="text-sm font-semibold text-slate-900">{format(start, "h:mm a")}</p>
                        <p className="text-xs text-slate-400">to {format(end, "h:mm a")}</p>
                      </div>
                      <PatientAvatar patient={a.patient} />
                      <div className="min-w-[160px] flex-1">
                        <p className="truncate text-sm font-semibold text-slate-900">{patientName(a.patient)}</p>
                        <p className="truncate text-xs text-slate-500">{patientMeta(a.patient) || a.patient?.phone || "—"}</p>
                      </div>
                      <div className="flex flex-wrap items-center gap-1.5">
                        <Badge color={online ? "violet" : "blue"}>
                          {online ? <MonitorSmartphone className="mr-1 h-3 w-3" /> : <UserRound className="mr-1 h-3 w-3" />}
                          {online ? "Teleconsult" : "In-person"}
                        </Badge>
                        <Badge color={stage.color}>{stage.label}</Badge>
                        {overdue && <Badge color="amber">Running late</Badge>}
                        <Badge color={a.paymentStatus === "completed" ? "green" : "red"}>
                          {a.paymentStatus === "completed" ? "Paid" : `Unpaid${a.amount ? ` · ${inr.format(a.amount)}` : ""}`}
                        </Badge>
                      </div>
                      <div className="flex w-full flex-wrap justify-end gap-2 sm:w-auto">{actionsFor(a)}</div>
                    </li>
                  );
                })}
              </ul>
            )}
          </Card>

          <div className="space-y-4">
            <Card className="p-5">
              <h3 className="text-sm font-semibold text-slate-900">Shift</h3>
              {shift ? (
                <div className="mt-3 space-y-2 text-sm text-slate-600">
                  <p className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-slate-400" />
                    {format(wallClock(shift.startDate), "h:mm a")} – {format(wallClock(shift.endDate), "h:mm a")}
                    <span className="text-slate-400">· {shift.duration} min slots</span>
                  </p>
                  {shift.location && (
                    <p className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-slate-400" /> {shift.location}
                    </p>
                  )}
                </div>
              ) : (
                <p className="mt-2 text-sm text-slate-500">You're not on the roster this day.</p>
              )}
              <div className="mt-4 grid grid-cols-3 gap-2 text-center">
                {[
                  ["Booked", c.total, "text-slate-900"],
                  ["Waiting", c.scheduled, "text-brand-600"],
                  ["Seen", c.completed, "text-care-600"],
                ].map(([label, value, tone]) => (
                  <div key={label} className="rounded-lg bg-slate-50 py-2">
                    <p className={`text-lg font-semibold ${tone}`}>{value}</p>
                    <p className="text-[11px] text-slate-500">{label}</p>
                  </div>
                ))}
              </div>
            </Card>

            {viewingToday && (
              <Card className="p-5">
                <h3 className="mb-3 text-sm font-semibold text-slate-900">Up next</h3>
                {next ? (
                  <div className="flex items-center gap-3">
                    <PatientAvatar patient={next.patient} size="h-11 w-11" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-semibold text-slate-900">{patientName(next.patient)}</p>
                      <p className="text-xs text-slate-500">
                        {format(wallClock(next.startDateTime), "h:mm a")} · {next.visitType === "Online" ? "Teleconsult" : "In-person"}
                      </p>
                    </div>
                  </div>
                ) : (
                  <p className="flex items-center gap-2 text-sm text-slate-500">
                    <CheckCircle2 className="h-4 w-4 text-care-500" /> No one else is waiting.
                  </p>
                )}
              </Card>
            )}

            <Card className="p-5">
              <h3 className="mb-3 text-sm font-semibold text-slate-900">Your week</h3>
              <div className="grid grid-cols-3 gap-2 text-center">
                {[
                  ["Upcoming", data.totals.upcomingWeek, CalendarClock],
                  ["Consults done", data.totals.completed, Stethoscope],
                  ["Patients", data.totals.patients, Users],
                ].map(([label, value, Icon]) => (
                  <div key={label} className="rounded-lg bg-slate-50 px-2 py-3">
                    <Icon className="mx-auto h-4 w-4 text-slate-400" />
                    <p className="mt-1 text-lg font-semibold text-slate-900">{value}</p>
                    <p className="text-[11px] text-slate-500">{label}</p>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      )}

      <Modal
        open={!!paying}
        onClose={() => setPaying(null)}
        title="Collect payment"
        description={paying ? `${patientName(paying.patient)} · ${format(wallClock(paying.startDateTime), "d MMM, h:mm a")}` : ""}
        size="max-w-md"
        footer={
          <>
            <Button variant="secondary" onClick={() => setPaying(null)}>
              Cancel
            </Button>
            <Button loading={busyId === paying?._id} onClick={collectPayment}>
              Record {paying?.amount ? inr.format(paying.amount) : "payment"}
            </Button>
          </>
        }
      >
        <p className="mb-3 text-sm text-slate-600">How did the patient pay?</p>
        <div className="grid grid-cols-3 gap-2">
          {PAYMENT_METHODS.map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setMethod(key)}
              className={`flex flex-col items-center gap-1.5 rounded-lg border px-3 py-3 text-sm font-medium ${
                method === key ? "border-brand-500 bg-brand-50 text-brand-700 ring-2 ring-brand-500/20" : "border-slate-200 text-slate-600 hover:bg-slate-50"
              }`}
            >
              <Icon className="h-5 w-5" />
              {label}
            </button>
          ))}
        </div>
      </Modal>
    </div>
  );
};

export default Appointments;
