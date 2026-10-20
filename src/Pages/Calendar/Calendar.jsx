import React, { useCallback, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import Cookies from "js-cookie";
import { addDays, format } from "date-fns";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import listPlugin from "@fullcalendar/list";
import toast from "react-hot-toast";
import { CalendarCheck, CalendarPlus, Clock, MapPin, MonitorSmartphone, UserRound } from "lucide-react";
import { Badge, Button, Modal } from "../../Components/Common/ui";
import { clinicApi, dayKey, wallClock } from "../../util/clinicApi";
import "./Calendar.css";

const ADMIN_URL = process.env.REACT_APP_ADMIN_URL;

const STAGES = {
  unconfirmed: { label: "Unconfirmed", color: "red", bg: "#fff1f2", border: "#f43f5e", text: "#9f1239" },
  scheduled: { label: "Waiting", color: "blue", bg: "#eef5fe", border: "#1769d1", text: "#114691" },
  checkedIn: { label: "In consultation", color: "amber", bg: "#fffbeb", border: "#f59e0b", text: "#92400e" },
  completed: { label: "Seen", color: "care", bg: "#ecfdf8", border: "#0fa98a", text: "#0b5f50" },
};

const patientName = (p) => [p?.firstName, p?.lastName].filter(Boolean).join(" ") || "Patient";

const Calendar = () => {
  const navigate = useNavigate();
  const { profileData } = useSelector((state) => state.profile);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState(null);
  const lastRange = useRef("");

  const loadRange = useCallback(
    async ({ start, end }) => {
      const from = dayKey(start);
      const to = dayKey(addDays(end, -1));
      const key = `${from}:${to}:${profileData?._id}`;
      if (key === lastRange.current) return;
      lastRange.current = key;
      setLoading(true);
      try {
        const [appointments, rosters] = await Promise.all([
          clinicApi.range(from, to),
          profileData?._id
            ? axios
                .get(`${ADMIN_URL}/rosters/practitioner-roster/${profileData._id}`, {
                  headers: { Authorization: `Bearer ${Cookies.get("Token")}`, tenantid: Cookies.get("TenantId") },
                })
                .then((r) => r.data?.data || [])
                .catch(() => [])
            : [],
        ]);
        setEvents([
          ...rosters.map((r) => ({
            id: `roster-${r._id}`,
            start: wallClock(r.startDate),
            end: wallClock(r.endDate),
            display: "background",
            classNames: ["roster-shift"],
          })),
          ...appointments.map((a) => {
            const stage = STAGES[a.stage] || STAGES.scheduled;
            return {
              id: a._id,
              title: patientName(a.patient),
              start: wallClock(a.startDateTime),
              end: wallClock(a.endDateTime),
              backgroundColor: stage.bg,
              borderColor: stage.border,
              textColor: stage.text,
              extendedProps: { appointment: a },
            };
          }),
        ]);
      } catch (e) {
        lastRange.current = "";
        toast.error(e.message);
      } finally {
        setLoading(false);
      }
    },
    [profileData?._id]
  );

  const a = selected;
  const stage = a && (STAGES[a.stage] || STAGES.scheduled);

  return (
    <div className="calendar-page p-4 sm:p-5">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600">
          {Object.values(STAGES).map((s) => (
            <span key={s.label} className="inline-flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-sm border" style={{ background: s.bg, borderColor: s.border }} />
              {s.label}
            </span>
          ))}
          <span className="inline-flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-sm bg-brand-100" />
            Your shift
          </span>
          {loading && <span className="text-slate-400">Loading…</span>}
        </div>
        <Button icon={CalendarPlus} onClick={() => navigate("/appointments/new")}>
          New appointment
        </Button>
      </div>

      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin]}
        initialView="timeGridWeek"
        headerToolbar={{ left: "prev,next today", center: "title", right: "dayGridMonth,timeGridWeek,timeGridDay,listWeek" }}
        buttonText={{ today: "Today", month: "Month", week: "Week", day: "Day", list: "List" }}
        height="auto"
        slotMinTime="07:00:00"
        slotMaxTime="21:00:00"
        slotDuration="00:15:00"
        slotLabelInterval="01:00"
        allDaySlot={false}
        nowIndicator
        dayMaxEvents={4}
        events={events}
        datesSet={loadRange}
        eventClick={({ event }) => event.extendedProps.appointment && setSelected(event.extendedProps.appointment)}
        dateClick={({ date }) => navigate(`/appointments?date=${dayKey(date)}`)}
        eventContent={({ event, timeText, view }) =>
          event.display === "background" ? null : (
            <div className="fc-appt">
              {view.type === "dayGridMonth" && <span className="fc-appt-dot" style={{ background: event.borderColor }} />}
              <span className="fc-appt-time">{timeText}</span>
              <span className="fc-appt-title">{event.title}</span>
              {event.extendedProps.appointment?.visitType === "Online" && <MonitorSmartphone className="fc-appt-icon" />}
            </div>
          )
        }
        noEventsContent="No appointments in this period"
      />

      <Modal
        open={!!a}
        onClose={() => setSelected(null)}
        title={a ? patientName(a.patient) : ""}
        description={a ? [a.patient?.uhid, a.patient?.phone].filter(Boolean).join(" · ") : ""}
        size="max-w-md"
        footer={
          <>
            <Button variant="secondary" onClick={() => setSelected(null)}>
              Close
            </Button>
            <Button icon={CalendarCheck} onClick={() => navigate(`/appointments?date=${dayKey(wallClock(a.startDateTime))}`)}>
              Manage in Appointments
            </Button>
          </>
        }
      >
        {a && (
          <div className="space-y-3 text-sm">
            <div className="flex flex-wrap gap-1.5">
              <Badge color={stage.color}>{stage.label}</Badge>
              <Badge color={a.visitType === "Online" ? "violet" : "blue"}>{a.visitType === "Online" ? "Teleconsult" : "In-person"}</Badge>
              <Badge color={a.paymentStatus === "completed" ? "green" : "red"}>{a.paymentStatus === "completed" ? "Paid" : "Unpaid"}</Badge>
            </div>
            <p className="flex items-center gap-2 text-slate-700">
              <Clock className="h-4 w-4 text-slate-400" />
              {format(wallClock(a.startDateTime), "EEEE, d MMM yyyy · h:mm a")} – {format(wallClock(a.endDateTime), "h:mm a")}
            </p>
            {a.location && (
              <p className="flex items-center gap-2 text-slate-700">
                <MapPin className="h-4 w-4 text-slate-400" /> {a.location}
              </p>
            )}
            <p className="flex items-center gap-2 text-slate-700">
              <UserRound className="h-4 w-4 text-slate-400" />
              {[a.patient?.gender, a.patient?.dob ? `born ${format(new Date(a.patient.dob), "d MMM yyyy")}` : null].filter(Boolean).join(" · ") || "—"}
            </p>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Calendar;
