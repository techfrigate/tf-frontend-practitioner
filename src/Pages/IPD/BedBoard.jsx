import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { differenceInCalendarDays } from "date-fns";
import { BedDouble, ClipboardList, RefreshCw, Search, Sparkles, UserPlus, Wrench } from "lucide-react";
import { Badge, Button, Card, EmptyState, PageHeader, Spinner, inputClass } from "../../Components/Common/ui";
import { ageSex, fullName, inr, ipdApi } from "../../util/ipdApi";
import { LocationSelect, WARD_TYPE_COLOR, useIpdLocations } from "./common";

const FILTERS = [
  { key: "all", label: "All beds" },
  { key: "available", label: "Free" },
  { key: "occupied", label: "Occupied" },
  { key: "cleaning", label: "Cleaning" },
  { key: "maintenance", label: "Maintenance" },
];

const Stat = ({ label, value, tone = "text-slate-900", hint }) => (
  <Card className="p-4">
    <p className="text-xs font-medium uppercase tracking-wide text-slate-500">{label}</p>
    <p className={`mt-1 text-2xl font-semibold ${tone}`}>{value}</p>
    {hint && <p className="mt-0.5 text-xs text-slate-500">{hint}</p>}
  </Card>
);

const BedTile = ({ bed, onAdmit, onOpen, onStatus, busy }) => {
  if (bed.status === "occupied") {
    const a = bed.admission;
    const days = Math.max(1, differenceInCalendarDays(new Date(), new Date(a.admittedAt)) + 1);
    return (
      <button
        type="button"
        onClick={() => onOpen(a._id)}
        className="flex min-h-[7.5rem] flex-col rounded-xl border border-brand-200 bg-brand-50/60 p-3 text-left transition hover:border-brand-400 hover:shadow-sm"
      >
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-brand-700">Bed {bed.number}</span>
          <span className="text-[11px] text-slate-500">Day {days}</span>
        </div>
        <p className="mt-1.5 truncate text-sm font-semibold text-slate-900">{fullName(a.patient)}</p>
        <p className="text-xs text-slate-500">{ageSex(a.patient)}</p>
        <p className="mt-auto truncate pt-1 text-[11px] text-slate-600">{a.reason}</p>
        <p className="truncate text-[11px] text-slate-500">Dr. {fullName(a.doctor)}</p>
      </button>
    );
  }
  if (bed.status === "cleaning" || bed.status === "maintenance") {
    const cleaning = bed.status === "cleaning";
    return (
      <div className={`flex min-h-[7.5rem] flex-col rounded-xl border p-3 ${cleaning ? "border-amber-200 bg-amber-50" : "border-slate-200 bg-slate-100"}`}>
        <span className={`text-xs font-semibold ${cleaning ? "text-amber-700" : "text-slate-600"}`}>Bed {bed.number}</span>
        <p className={`mt-2 flex items-center gap-1 text-sm font-medium ${cleaning ? "text-amber-800" : "text-slate-600"}`}>
          {cleaning ? <Sparkles className="h-4 w-4" /> : <Wrench className="h-4 w-4" />}
          {cleaning ? "Being cleaned" : "Maintenance"}
        </p>
        <button
          type="button"
          disabled={busy}
          onClick={() => onStatus(bed, "available")}
          className="mt-auto rounded-md border border-slate-300 bg-white px-2 py-1 text-xs font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50"
        >
          {cleaning ? "Mark ready" : "Back in service"}
        </button>
      </div>
    );
  }
  return (
    <div className="group flex min-h-[7.5rem] flex-col rounded-xl border border-emerald-200 bg-emerald-50/60 p-3">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-emerald-700">Bed {bed.number}</span>
        <button
          type="button"
          title="Mark under maintenance"
          disabled={busy}
          onClick={() => onStatus(bed, "maintenance")}
          className="rounded p-0.5 text-slate-400 opacity-0 transition hover:bg-white hover:text-slate-600 group-hover:opacity-100"
        >
          <Wrench className="h-3.5 w-3.5" />
        </button>
      </div>
      <p className="mt-2 flex items-center gap-1 text-sm font-medium text-emerald-800">
        <BedDouble className="h-4 w-4" /> Free
      </p>
      <button
        type="button"
        onClick={() => onAdmit(bed)}
        className="mt-auto rounded-md bg-emerald-600 px-2 py-1 text-xs font-medium text-white hover:bg-emerald-700"
      >
        Admit here
      </button>
    </div>
  );
};

const BedBoard = () => {
  const navigate = useNavigate();
  const { locations, locationId, setLocationId } = useIpdLocations();
  const [board, setBoard] = useState(null);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [busyBed, setBusyBed] = useState(null);

  const load = useCallback(() => {
    if (!locationId) return;
    ipdApi
      .bedBoard(locationId)
      .then(setBoard)
      .catch((e) => toast.error(e.message));
  }, [locationId]);

  useEffect(() => {
    setBoard(null);
    load();
  }, [load]);

  const wards = useMemo(() => {
    if (!board) return [];
    const q = search.trim().toLowerCase();
    return board.buildings.flatMap((b) =>
      b.floors.flatMap((f) =>
        f.wards.map((w) => ({
          ...w,
          building: b,
          floor: f,
          shown: w.beds.filter((bed) => {
            if (filter !== "all" && bed.status !== filter) return false;
            if (!q) return true;
            const a = bed.admission;
            return (
              String(bed.number) === q ||
              (a && [fullName(a.patient), a.admissionNumber, a.patient?.phoneNumber?.value].some((v) => String(v || "").toLowerCase().includes(q)))
            );
          }),
        }))
      )
    );
  }, [board, filter, search]);

  const admitAt = (w, bed) =>
    navigate(
      `/ipd/admit?location=${locationId}&building=${w.building._id}&floor=${w.floor._id}&ward=${w._id}&bed=${bed._id}`
    );

  const changeStatus = async (w, bed, status) => {
    setBusyBed(bed._id);
    try {
      await ipdApi.setBedStatus({ locationId, buildingId: w.building._id, floorId: w.floor._id, wardId: w._id, bedId: bed._id, status });
      toast.success(status === "available" ? `Bed ${bed.number} is ready for the next patient` : `Bed ${bed.number} marked ${status}`);
      load();
    } catch (e) {
      toast.error(e.message);
    } finally {
      setBusyBed(null);
    }
  };

  const c = board?.counts;
  return (
    <div className="space-y-5">
      <PageHeader
        title="Inpatient bed board"
        description="Live view of every ward. Click a free bed to admit, or an occupied bed to open the patient's admission."
        actions={
          <div className="flex flex-wrap items-center gap-2">
            {locations?.length > 1 && <LocationSelect locations={locations} value={locationId} onChange={setLocationId} />}
            <Button variant="secondary" icon={RefreshCw} onClick={load}>Refresh</Button>
            <Button variant="secondary" icon={ClipboardList} onClick={() => navigate("/ipd/admissions")}>Admissions</Button>
            <Button icon={UserPlus} onClick={() => navigate(`/ipd/admit?location=${locationId}`)}>Admit patient</Button>
          </div>
        }
      />

      {locations && !locations.length ? (
        <Card>
          <EmptyState icon={BedDouble} title="No locations assigned" description="Ask your hospital admin to assign you to a location under Staff & doctors → Availability." />
        </Card>
      ) : !board ? (
        <Spinner />
      ) : (
        <>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-5">
            <Stat label="Total beds" value={c.total} />
            <Stat label="Occupied" value={c.occupied} tone="text-brand-600" />
            <Stat label="Free" value={c.available} tone="text-emerald-600" />
            <Stat label="Cleaning / maint." value={c.cleaning + c.maintenance} tone="text-amber-600" />
            <Stat label="Occupancy" value={`${c.occupancy}%`} hint={`${c.occupied} of ${c.total} beds`} />
          </div>

          <Card className="p-3">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div className="flex flex-wrap gap-1.5">
                {FILTERS.map((f) => (
                  <button
                    key={f.key}
                    type="button"
                    onClick={() => setFilter(f.key)}
                    className={`rounded-full px-3 py-1 text-xs font-medium transition ${
                      filter === f.key ? "bg-brand-500 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
              <div className="relative md:w-72">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Find patient, IPD no. or bed" className={`${inputClass} pl-9`} />
              </div>
            </div>
          </Card>

          {!wards.length ? (
            <Card>
              <EmptyState icon={BedDouble} title="No wards yet" description="The hospital admin can add buildings, floors, wards and beds from the admin portal (Wards). Set a daily bed charge on each ward so IPD bills are correct." />
            </Card>
          ) : (
            wards.map((w) => {
              const free = w.beds.filter((b) => b.status === "available").length;
              return (
                <Card key={w._id} className="overflow-hidden">
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 px-4 py-3">
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="text-sm font-semibold text-slate-900">{w.name}</h2>
                      <Badge color={WARD_TYPE_COLOR[w.wardType] || "slate"}>{w.wardType}</Badge>
                      <span className="text-xs text-slate-500">{w.building.name} · Floor {w.floor.level}</span>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-slate-600">
                      <span>
                        <span className="font-semibold text-slate-900">{free}</span> of {w.beds.length} free
                      </span>
                      <span className="rounded bg-slate-100 px-2 py-0.5">
                        {w.dailyRate ? `${inr(w.dailyRate)} / day` : "Bed charge not set"}
                      </span>
                    </div>
                  </div>
                  {w.shown.length ? (
                    <div className="grid grid-cols-2 gap-3 p-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
                      {w.shown.map((bed) => (
                        <BedTile
                          key={bed._id}
                          bed={bed}
                          busy={busyBed === bed._id}
                          onAdmit={(b) => admitAt(w, b)}
                          onOpen={(id) => navigate(`/ipd/admissions/${id}`)}
                          onStatus={(b, s) => changeStatus(w, b, s)}
                        />
                      ))}
                    </div>
                  ) : (
                    <p className="px-4 py-5 text-sm text-slate-500">No beds match this filter.</p>
                  )}
                </Card>
              );
            })
          )}
        </>
      )}
    </div>
  );
};

export default BedBoard;
