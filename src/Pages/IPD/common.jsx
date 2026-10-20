import React, { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { BedDouble, Check } from "lucide-react";
import { Badge, Spinner, inputClass } from "../../Components/Common/ui";
import { inr, ipdApi } from "../../util/ipdApi";

const STORAGE_KEY = "ipd.locationId";

/** Locations this practitioner works at, plus the one currently picked (remembered per browser). */
export const useIpdLocations = (preferred) => {
  const profile = useSelector((s) => s.profile.profileData);
  const [all, setAll] = useState(null);
  const [locationId, setLocationIdState] = useState(() => {
    try {
      return preferred || localStorage.getItem(STORAGE_KEY) || "";
    } catch {
      return preferred || "";
    }
  });

  useEffect(() => {
    ipdApi.locations().then(setAll).catch(() => setAll([]));
  }, []);

  const locations = useMemo(() => {
    if (!all) return null;
    const mine = (profile?.locations || []).map(String);
    return all.filter((l) => l.status !== false && (!mine.length || mine.includes(String(l._id))));
  }, [all, profile]);

  useEffect(() => {
    if (!locations?.length) return;
    if (!locations.some((l) => String(l._id) === String(locationId))) setLocationIdState(String(locations[0]._id));
  }, [locations, locationId]);

  const setLocationId = (id) => {
    setLocationIdState(id);
    try {
      localStorage.setItem(STORAGE_KEY, id);
    } catch {
      /* storage unavailable: selection just isn't remembered */
    }
  };

  return { locations, locationId, setLocationId };
};

export const LocationSelect = ({ locations, value, onChange, className = "" }) => (
  <select value={value} onChange={(e) => onChange(e.target.value)} className={`${inputClass} w-auto min-w-[14rem] ${className}`} aria-label="Location">
    {(locations || []).map((l) => (
      <option key={l._id} value={l._id}>
        {l.displayName || l.name}
      </option>
    ))}
  </select>
);

export const AdmissionStatus = ({ status }) =>
  status === "admitted" ? <Badge color="green">Admitted</Badge> : <Badge color="slate">Discharged</Badge>;

export const WARD_TYPE_COLOR = { ICU: "red", NICU: "red", HDU: "amber", Private: "violet", "Semi-private": "blue" };

/**
 * Pick a free bed. Shows every ward of the location with its free beds; occupied/cleaning beds are
 * visible but disabled so staff can see why a ward is full.
 */
export const BedPicker = ({ locationId, value, onChange, excludeBedId }) => {
  const [board, setBoard] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!locationId) return;
    setBoard(null);
    ipdApi
      .bedBoard(locationId)
      .then(setBoard)
      .catch((e) => setError(e.message));
  }, [locationId]);

  const wards = useMemo(
    () => (board ? board.buildings.flatMap((b) => b.floors.flatMap((f) => f.wards.map((w) => ({ ...w, building: b, floor: f })))) : []),
    [board]
  );

  // A bed pre-chosen elsewhere (e.g. on the bed board) only carries ids: fill in its label and rate.
  useEffect(() => {
    if (!value?.bedId || value.dailyRate !== undefined || !wards.length) return;
    const w = wards.find((x) => String(x._id) === String(value.wardId));
    const bed = w?.beds.find((b) => String(b._id) === String(value.bedId));
    if (!bed) return;
    if (bed.status !== "available") onChange(null);
    else onChange({ ...value, label: `${w.name} · Bed ${bed.number}`, wardType: w.wardType, dailyRate: w.dailyRate });
  }, [wards, value, onChange]);

  if (error) return <p className="text-sm text-rose-600">{error}</p>;
  if (!board) return <Spinner className="py-8" />;
  if (!wards.length) {
    return (
      <p className="rounded-lg border border-dashed border-slate-300 p-4 text-sm text-slate-500">
        No wards are set up at this location yet. Ask the hospital admin to add buildings, wards and beds under Wards.
      </p>
    );
  }

  return (
    <div className="space-y-4">
      {wards.map((w) => {
        const free = w.beds.filter((b) => b.status === "available" && String(b._id) !== String(excludeBedId)).length;
        return (
          <div key={w._id} className="rounded-lg border border-slate-200">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 bg-slate-50 px-3 py-2">
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-slate-900">{w.name}</span>
                <Badge color={WARD_TYPE_COLOR[w.wardType] || "slate"}>{w.wardType}</Badge>
                <span className="text-xs text-slate-500">
                  {w.building.name} · Floor {w.floor.level}
                </span>
              </div>
              <div className="text-xs text-slate-600">
                <span className="font-medium text-slate-900">{inr(w.dailyRate)}</span>/day · {free} free
              </div>
            </div>
            <div className="grid grid-cols-4 gap-2 p-3 sm:grid-cols-6 lg:grid-cols-8">
              {w.beds.map((bed) => {
                const selectable = bed.status === "available" && String(bed._id) !== String(excludeBedId);
                const selected = value?.bedId === String(bed._id);
                return (
                  <button
                    key={bed._id}
                    type="button"
                    disabled={!selectable}
                    title={
                      selectable
                        ? `Bed ${bed.number}`
                        : bed.status === "occupied"
                        ? `Occupied${bed.admission ? ` – ${bed.admission.patient?.firstName || ""}` : ""}`
                        : bed.status === "cleaning"
                        ? "Being cleaned"
                        : String(bed._id) === String(excludeBedId)
                        ? "Current bed"
                        : "Under maintenance"
                    }
                    onClick={() =>
                      onChange({
                        buildingId: String(w.building._id),
                        floorId: String(w.floor._id),
                        wardId: String(w._id),
                        bedId: String(bed._id),
                        label: `${w.name} · Bed ${bed.number}`,
                        wardType: w.wardType,
                        dailyRate: w.dailyRate,
                      })
                    }
                    className={`relative flex h-14 flex-col items-center justify-center rounded-lg border text-xs font-medium transition ${
                      selected
                        ? "border-brand-500 bg-brand-500 text-white shadow"
                        : selectable
                        ? "border-emerald-200 bg-emerald-50 text-emerald-800 hover:border-emerald-400"
                        : "cursor-not-allowed border-slate-200 bg-slate-100 text-slate-400"
                    }`}
                  >
                    {selected ? <Check className="h-4 w-4" /> : <BedDouble className="h-4 w-4" />}
                    <span>{bed.number}</span>
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}
      <div className="flex flex-wrap gap-4 text-xs text-slate-500">
        <span className="flex items-center gap-1.5"><span className="h-3 w-3 rounded border border-emerald-300 bg-emerald-50" /> Free</span>
        <span className="flex items-center gap-1.5"><span className="h-3 w-3 rounded bg-brand-500" /> Selected</span>
        <span className="flex items-center gap-1.5"><span className="h-3 w-3 rounded bg-slate-200" /> Occupied / cleaning</span>
      </div>
    </div>
  );
};
