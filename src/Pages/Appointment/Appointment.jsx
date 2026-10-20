import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { differenceInYears, format, isToday, isTomorrow } from "date-fns";
import toast from "react-hot-toast";
import {
  Banknote,
  CalendarCheck,
  CalendarPlus,
  Check,
  CheckCircle2,
  Clock,
  CreditCard,
  MapPin,
  MonitorSmartphone,
  Search,
  Smartphone,
  Stethoscope,
  UserPlus,
  UserRound,
  Wallet,
  X,
} from "lucide-react";
import { Badge, Button, Card, EmptyState, Spinner, inputClass } from "../../Components/Common/ui";
import { clinicApi, dayKey, wallClock } from "../../util/clinicApi";

const inr = new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 });
const GST = 18;
const fullName = (p) => [p?.firstName, p?.lastName].filter(Boolean).join(" ");
const dayLabel = (d) => (isToday(d) ? "Today" : isTomorrow(d) ? "Tomorrow" : format(d, "EEE"));

const PAYMENT = [
  { key: "CASH", label: "Cash", icon: Banknote },
  { key: "CARD", label: "Card / POS", icon: CreditCard },
  { key: "UPI", label: "UPI", icon: Smartphone },
];

const Step = ({ n, title, done, children, right }) => (
  <Card className="p-5">
    <div className="mb-4 flex items-center justify-between gap-3">
      <div className="flex items-center gap-3">
        <span
          className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-semibold ${
            done ? "bg-care-500 text-white" : "bg-slate-100 text-slate-600"
          }`}
        >
          {done ? <Check className="h-4 w-4" /> : n}
        </span>
        <h3 className="text-sm font-semibold text-slate-900">{title}</h3>
      </div>
      {right}
    </div>
    {children}
  </Card>
);

const Appointment = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const preferredDate = searchParams.get("date");
  const { profileData } = useSelector((state) => state.profile);

  const [doctors, setDoctors] = useState(null);
  const [patients, setPatients] = useState(null);
  const [loadError, setLoadError] = useState(null);
  const [query, setQuery] = useState("");
  const [patient, setPatient] = useState(null);
  const [doctorKey, setDoctorKey] = useState("");
  const [visitType, setVisitType] = useState("Offline");
  const [date, setDate] = useState("");
  const [slot, setSlot] = useState(null);
  const [payNow, setPayNow] = useState(false);
  const [method, setMethod] = useState("CASH");
  const [saving, setSaving] = useState(false);
  const [booked, setBooked] = useState(null);

  const load = useCallback(async () => {
    try {
      const [s, p] = await Promise.all([clinicApi.slots(), clinicApi.patients()]);
      setDoctors((s || []).filter((d) => d.practitionerData && d.locationData));
      setPatients((p || []).filter((x) => x.tenants?.some((t) => t.userType === "patient" && t.status)));
      setLoadError(null);
    } catch (e) {
      setLoadError(e.message);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const keyOf = (d) => `${d.practitionerData._id}:${d.locationData._id}`;

  // Default to the signed-in doctor when they have a roster.
  useEffect(() => {
    if (!doctors || doctorKey) return;
    const mine = doctors.find((d) => d.practitionerData._id === profileData?._id) || doctors[0];
    if (mine) setDoctorKey(keyOf(mine));
  }, [doctors, profileData, doctorKey]);

  const doctor = doctors?.find((d) => keyOf(d) === doctorKey);
  const fee = Number(visitType === "Online" ? doctor?.practitionerData?.work?.online : doctor?.practitionerData?.work?.inPerson) || 0;
  const gst = Math.round((fee * GST) / 100);
  const total = fee + gst;

  const supports = (type) => doctor?.slots?.some((s) => s.visitType === "Both" || s.visitType === type);

  // Bookable days for this doctor + visit type, with their free slots.
  const days = useMemo(() => {
    if (!doctor) return [];
    const now = new Date();
    const today = dayKey(now);
    const byDay = {};
    doctor.slots
      .filter((s) => s.visitType === "Both" || s.visitType === visitType)
      .forEach((s) => {
        (s.slotsDetail || []).forEach((d) => {
          const start = wallClock(d.startDateTime);
          const key = dayKey(start);
          if (key < today) return;
          byDay[key] = byDay[key] || { key, date: start, slots: [] };
          byDay[key].slots.push({
            ...d,
            rosterSlotId: s._id,
            duration: s.duration,
            start,
            end: wallClock(d.endDateTime),
            available: d.status !== "booked" && start > now,
          });
        });
      });
    return Object.values(byDay)
      .map((d) => ({ ...d, slots: d.slots.sort((a, b) => a.start - b.start), free: d.slots.filter((x) => x.available).length }))
      .sort((a, b) => a.key.localeCompare(b.key));
  }, [doctor, visitType]);

  // Keep visit type, date and slot valid whenever the inputs above them change.
  useEffect(() => {
    if (doctor && !supports(visitType)) setVisitType(supports("Offline") ? "Offline" : "Online");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [doctorKey]);

  useEffect(() => {
    if (days.some((d) => d.key === date && d.free)) return;
    const preferred = days.find((d) => d.key === preferredDate && d.free);
    setDate((preferred || days.find((d) => d.free) || days[0])?.key || "");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [days]);

  useEffect(() => setSlot(null), [doctorKey, visitType, date]);

  const matches = useMemo(() => {
    if (!patients) return [];
    const q = query.trim().toLowerCase();
    if (!q) return patients.slice(0, 6);
    return patients
      .filter((p) => [fullName(p), p.email, p.phoneNumber?.value, p.uhid].filter(Boolean).join(" ").toLowerCase().includes(q))
      .slice(0, 8);
  }, [patients, query]);

  const selectedDay = days.find((d) => d.key === date);
  const groups = useMemo(() => {
    const g = { Morning: [], Afternoon: [], Evening: [] };
    (selectedDay?.slots || []).forEach((s) => {
      const h = s.start.getHours();
      g[h < 12 ? "Morning" : h < 17 ? "Afternoon" : "Evening"].push(s);
    });
    return Object.entries(g).filter(([, list]) => list.length);
  }, [selectedDay]);

  const missing = [!patient && "a patient", !doctor && "a doctor", !slot && "a time slot", !fee && "a consultation fee for this doctor"].filter(Boolean);

  const confirm = async () => {
    if (missing.length) return;
    setSaving(true);
    const now = new Date();
    try {
      const appointment = await clinicApi.createAppointment({
        slotId: slot.rosterSlotId,
        patientId: patient._id,
        locationId: doctor.locationData._id,
        practitionerId: doctor.practitionerData._id,
        channelName: `${patient._id}${doctor.practitionerData._id}${slot.rosterSlotId}`,
        amountDetails: { amount: fee, gst: GST, discount: 0, netAmount: total },
        paymentMethod: "offline",
        paymentStatus: payNow ? "completed" : "pending",
        ...(payNow ? { transactionId: `COUNTER-${method}-${now.getTime()}` } : {}),
        bookingStatus: { pending: now, booked: now },
        startDateTime: slot.startDateTime,
        endDateTime: slot.endDateTime,
        visitType,
        duration: slot.duration,
      });
      setBooked({ appointment, patient, doctor, slot, visitType, total, payNow, method });
      load();
    } catch (e) {
      toast.error(e.message);
      if (/no longer available/i.test(e.message)) {
        setSlot(null);
        load();
      }
    } finally {
      setSaving(false);
    }
  };

  const reset = () => {
    setBooked(null);
    setPatient(null);
    setQuery("");
    setSlot(null);
    setPayNow(false);
  };

  if (booked) {
    const d = booked.slot.start;
    return (
      <div className="mx-auto max-w-xl py-10">
        <Card className="p-8 text-center">
          <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-care-50 text-care-600">
            <CheckCircle2 className="h-8 w-8" />
          </span>
          <h2 className="mt-4 text-xl font-semibold text-slate-900">Appointment booked</h2>
          <p className="mt-1 text-sm text-slate-500">
            {fullName(booked.patient)} with Dr. {fullName(booked.doctor.practitionerData)}
          </p>
          <div className="mt-6 grid grid-cols-2 gap-3 rounded-xl bg-slate-50 p-4 text-left text-sm">
            <div>
              <p className="text-xs text-slate-500">When</p>
              <p className="font-medium text-slate-900">
                {format(d, "EEE, d MMM")} · {format(d, "h:mm a")}
              </p>
            </div>
            <div>
              <p className="text-xs text-slate-500">Visit</p>
              <p className="font-medium text-slate-900">{booked.visitType === "Online" ? "Teleconsult" : "In-person"}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500">Location</p>
              <p className="font-medium text-slate-900">{booked.doctor.locationData.displayName || booked.doctor.locationData.name}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500">Payment</p>
              <p className="font-medium text-slate-900">
                {booked.payNow ? `${inr.format(booked.total)} paid (${PAYMENT.find((p) => p.key === booked.method)?.label})` : `${inr.format(booked.total)} due at counter`}
              </p>
            </div>
          </div>
          <div className="mt-6 flex flex-col justify-center gap-2 sm:flex-row">
            <Button icon={CalendarCheck} onClick={() => navigate(`/appointments?date=${dayKey(d)}`)}>
              View {isToday(d) ? "today's" : `${format(d, "d MMM")}`} appointments
            </Button>
            <Button variant="secondary" icon={CalendarPlus} onClick={reset}>
              Book another
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  if (loadError) {
    return (
      <Card>
        <EmptyState icon={X} title="Couldn't load doctors and patients" description={loadError} action={<Button onClick={load}>Try again</Button>} />
      </Card>
    );
  }
  if (!doctors || !patients) return <Spinner className="min-h-[50vh]" />;

  return (
    <div className="grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,1fr),340px]">
      <div className="space-y-4">
        <Step
          n={1}
          title="Patient"
          done={!!patient}
          right={
            <Button variant="ghost" icon={UserPlus} onClick={() => navigate("/new-patient")}>
              Register new
            </Button>
          }
        >
          {patient ? (
            <div className="flex items-center gap-3 rounded-lg border border-brand-200 bg-brand-50/50 p-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-violet-50 text-sm font-semibold text-violet-700">
                {`${patient.firstName?.[0] || ""}${patient.lastName?.[0] || ""}`.toUpperCase()}
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate font-semibold text-slate-900">{fullName(patient)}</p>
                <p className="truncate text-xs text-slate-500">
                  {[
                    patient.dob ? `${differenceInYears(new Date(), new Date(patient.dob))}y` : null,
                    patient.gender,
                    patient.uhid,
                    patient.phoneNumber?.value,
                  ]
                    .filter(Boolean)
                    .join(" · ")}
                </p>
              </div>
              <Button variant="ghost" onClick={() => setPatient(null)}>
                Change
              </Button>
            </div>
          ) : (
            <div>
              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  autoFocus
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search by name, phone, email or UHID"
                  className={`${inputClass} pl-9`}
                />
              </div>
              {matches.length === 0 ? (
                <p className="mt-3 text-sm text-slate-500">
                  No active patient matches "{query}".{" "}
                  <button onClick={() => navigate("/new-patient")} className="font-medium text-brand-600 hover:text-brand-700">
                    Register them
                  </button>
                </p>
              ) : (
                <ul className="mt-3 divide-y divide-slate-100 rounded-lg border border-slate-200">
                  {matches.map((p) => (
                    <li key={p._id}>
                      <button onClick={() => setPatient(p)} className="flex w-full items-center gap-3 px-3 py-2.5 text-left hover:bg-slate-50">
                        <UserRound className="h-4 w-4 text-slate-400" />
                        <span className="flex-1 truncate text-sm font-medium text-slate-800">{fullName(p)}</span>
                        <span className="truncate text-xs text-slate-500">{[p.uhid, p.phoneNumber?.value].filter(Boolean).join(" · ")}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </Step>

        <Step n={2} title="Doctor & visit type" done={!!doctor}>
          {doctors.length === 0 ? (
            <p className="text-sm text-slate-500">No doctors have a roster yet. Ask your hospital admin to plan the doctor roster.</p>
          ) : (
            <div className="space-y-4">
              <select value={doctorKey} onChange={(e) => setDoctorKey(e.target.value)} className={inputClass} aria-label="Doctor">
                {doctors.map((d) => (
                  <option key={keyOf(d)} value={keyOf(d)}>
                    Dr. {fullName(d.practitionerData)}
                    {d.practitionerData._id === profileData?._id ? " (you)" : ""} — {d.practitionerData.work?.speciality || "General"} ·{" "}
                    {d.locationData.displayName || d.locationData.name}
                  </option>
                ))}
              </select>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {[
                  ["Offline", "In-person visit", "At the clinic", UserRound, doctor?.practitionerData?.work?.inPerson],
                  ["Online", "Teleconsult", "Video call", MonitorSmartphone, doctor?.practitionerData?.work?.online],
                ].map(([type, label, sub, Icon, price]) => {
                  const enabled = supports(type);
                  const active = visitType === type;
                  return (
                    <button
                      key={type}
                      disabled={!enabled}
                      onClick={() => setVisitType(type)}
                      className={`flex items-center gap-3 rounded-lg border p-3 text-left transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${
                        active ? "border-brand-500 bg-brand-50 ring-2 ring-brand-500/20" : "border-slate-200 hover:bg-slate-50"
                      }`}
                    >
                      <span className={`flex h-9 w-9 items-center justify-center rounded-lg ${active ? "bg-brand-500 text-white" : "bg-slate-100 text-slate-500"}`}>
                        <Icon className="h-5 w-5" />
                      </span>
                      <span className="flex-1">
                        <span className="block text-sm font-semibold text-slate-900">{label}</span>
                        <span className="block text-xs text-slate-500">{enabled ? sub : "Not offered in this roster"}</span>
                      </span>
                      <span className="text-sm font-semibold text-slate-900">{price ? inr.format(price) : "—"}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </Step>

        <Step n={3} title="Date & time" done={!!slot} right={selectedDay && <span className="text-xs text-slate-500">{selectedDay.free} slots free</span>}>
          {days.length === 0 ? (
            <p className="text-sm text-slate-500">No upcoming roster slots for this doctor and visit type.</p>
          ) : (
            <div className="space-y-4">
              <div className="flex gap-2 overflow-x-auto pb-1">
                {days.map((d) => (
                  <button
                    key={d.key}
                    disabled={!d.free}
                    onClick={() => setDate(d.key)}
                    className={`min-w-[84px] shrink-0 rounded-lg border px-3 py-2 text-center transition-colors disabled:cursor-not-allowed disabled:opacity-40 ${
                      date === d.key ? "border-brand-500 bg-brand-500 text-white" : "border-slate-200 bg-white hover:border-brand-300"
                    }`}
                  >
                    <span className={`block text-xs ${date === d.key ? "text-brand-100" : "text-slate-500"}`}>{dayLabel(d.date)}</span>
                    <span className="block text-sm font-semibold">{format(d.date, "d MMM")}</span>
                    <span className={`block text-[11px] ${date === d.key ? "text-brand-100" : d.free ? "text-care-600" : "text-slate-400"}`}>
                      {d.free ? `${d.free} free` : "Full"}
                    </span>
                  </button>
                ))}
              </div>
              {groups.map(([label, list]) => (
                <div key={label}>
                  <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">{label}</p>
                  <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 lg:grid-cols-6">
                    {list.map((s) => {
                      const active = slot?._id === s._id;
                      return (
                        <button
                          key={s._id}
                          disabled={!s.available}
                          onClick={() => setSlot(s)}
                          title={s.available ? "" : s.status === "booked" ? "Already booked" : "Time has passed"}
                          className={`rounded-lg border px-2 py-2 text-sm font-medium transition-colors ${
                            active
                              ? "border-brand-500 bg-brand-500 text-white shadow-sm"
                              : s.available
                              ? "border-slate-200 bg-white text-slate-700 hover:border-brand-400 hover:text-brand-700"
                              : "cursor-not-allowed border-slate-100 bg-slate-50 text-slate-300 line-through"
                          }`}
                        >
                          {format(s.start, "h:mm a")}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </Step>

        <Step n={4} title="Payment" done={!!slot}>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {[
              [false, "Pay at counter", "Collect when the patient arrives", Wallet],
              [true, "Collect now", "Record payment while booking", Banknote],
            ].map(([value, label, sub, Icon]) => (
              <button
                key={label}
                onClick={() => setPayNow(value)}
                className={`flex items-center gap-3 rounded-lg border p-3 text-left ${
                  payNow === value ? "border-brand-500 bg-brand-50 ring-2 ring-brand-500/20" : "border-slate-200 hover:bg-slate-50"
                }`}
              >
                <Icon className={`h-5 w-5 ${payNow === value ? "text-brand-600" : "text-slate-400"}`} />
                <span>
                  <span className="block text-sm font-semibold text-slate-900">{label}</span>
                  <span className="block text-xs text-slate-500">{sub}</span>
                </span>
              </button>
            ))}
          </div>
          {payNow && (
            <div className="mt-3 flex flex-wrap gap-2">
              {PAYMENT.map(({ key, label, icon: Icon }) => (
                <button
                  key={key}
                  onClick={() => setMethod(key)}
                  className={`inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium ${
                    method === key ? "border-brand-500 bg-brand-50 text-brand-700" : "border-slate-200 text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  <Icon className="h-4 w-4" /> {label}
                </button>
              ))}
            </div>
          )}
        </Step>
      </div>

      <div className="xl:sticky xl:top-0 xl:self-start">
        <Card className="overflow-hidden">
          <div className="bg-navy-900 px-5 py-4 text-white">
            <p className="text-xs uppercase tracking-wide text-slate-300">Booking summary</p>
            <p className="mt-1 text-lg font-semibold">{slot ? `${format(slot.start, "EEE, d MMM")} · ${format(slot.start, "h:mm a")}` : "Pick a time"}</p>
          </div>
          <dl className="space-y-3 px-5 py-4 text-sm">
            <div className="flex gap-3">
              <UserRound className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />
              <div className="min-w-0">
                <dt className="text-xs text-slate-500">Patient</dt>
                <dd className="truncate font-medium text-slate-900">{patient ? fullName(patient) : "—"}</dd>
              </div>
            </div>
            <div className="flex gap-3">
              <Stethoscope className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />
              <div className="min-w-0">
                <dt className="text-xs text-slate-500">Doctor</dt>
                <dd className="truncate font-medium text-slate-900">{doctor ? `Dr. ${fullName(doctor.practitionerData)}` : "—"}</dd>
              </div>
            </div>
            <div className="flex gap-3">
              {visitType === "Online" ? <MonitorSmartphone className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" /> : <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />}
              <div className="min-w-0">
                <dt className="text-xs text-slate-500">{visitType === "Online" ? "Teleconsult" : "In-person at"}</dt>
                <dd className="truncate font-medium text-slate-900">
                  {visitType === "Online" ? "Patient joins from the patient app" : doctor?.locationData?.displayName || doctor?.locationData?.name || "—"}
                </dd>
              </div>
            </div>
            <div className="flex gap-3">
              <Clock className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />
              <div>
                <dt className="text-xs text-slate-500">Duration</dt>
                <dd className="font-medium text-slate-900">{slot ? `${slot.duration} minutes` : "—"}</dd>
              </div>
            </div>
          </dl>
          <div className="space-y-1.5 border-t border-slate-200 px-5 py-4 text-sm">
            <div className="flex justify-between text-slate-600">
              <span>Consultation fee</span>
              <span>{inr.format(fee)}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>GST ({GST}%)</span>
              <span>{inr.format(gst)}</span>
            </div>
            <div className="flex justify-between pt-1 text-base font-semibold text-slate-900">
              <span>Total</span>
              <span>{inr.format(total)}</span>
            </div>
            <div className="pt-1">
              <Badge color={payNow ? "green" : "amber"}>{payNow ? `Paying now · ${PAYMENT.find((p) => p.key === method).label}` : "Due at counter"}</Badge>
            </div>
          </div>
          <div className="border-t border-slate-200 px-5 py-4">
            <Button className="w-full" icon={CalendarCheck} loading={saving} disabled={!!missing.length} onClick={confirm}>
              Confirm booking
            </Button>
            {missing.length > 0 && <p className="mt-2 text-center text-xs text-slate-500">Choose {missing.join(", ")} to continue.</p>}
            <button onClick={() => navigate(-1)} className="mt-2 w-full text-center text-sm text-slate-500 hover:text-slate-700">
              Cancel
            </button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Appointment;
