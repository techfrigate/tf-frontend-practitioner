import React, { useEffect, useRef, useState } from "react";
import { Loader2, Plus, Search } from "lucide-react";
import { rxApi } from "../../util/prescriptionApi";

const SOURCE_BADGE = {
  favourite: { label: "Your usual", className: "bg-violet-50 text-violet-700" },
  pharmacy: { label: "In stock", className: "bg-emerald-50 text-emerald-700" },
  hospital: { label: "Hospital test", className: "bg-sky-50 text-sky-700" },
  snomed: { label: "SNOMED CT", className: "bg-slate-100 text-slate-600" },
};

/**
 * Search box with SNOMED CT (and hospital) auto-suggestions. Enter picks the highlighted item;
 * if nothing matches, the typed text can be added as free text.
 */
const ConceptPicker = ({ type, locationId, placeholder, onPick, autoFocus, allowFreeText = true, renderMeta }) => {
  const [q, setQ] = useState("");
  const [items, setItems] = useState([]);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const [loading, setLoading] = useState(false);
  const boxRef = useRef(null);
  const reqId = useRef(0);

  useEffect(() => {
    if (!open) return;
    const id = ++reqId.current;
    setLoading(true);
    const t = setTimeout(() => {
      rxApi
        .suggest(type, q.trim(), locationId)
        .then((r) => id === reqId.current && (setItems(r), setActive(0)))
        .catch(() => id === reqId.current && setItems([]))
        .finally(() => id === reqId.current && setLoading(false));
    }, 180);
    return () => clearTimeout(t);
  }, [q, open, type, locationId]);

  useEffect(() => {
    const close = (e) => boxRef.current && !boxRef.current.contains(e.target) && setOpen(false);
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  const pick = (item) => {
    onPick(item);
    setQ("");
    setOpen(false);
  };
  const freeText = q.trim() && allowFreeText ? { source: "text", display: q.trim() } : null;
  const options = [...items, ...(freeText && !items.some((i) => i.display.toLowerCase() === q.trim().toLowerCase()) ? [freeText] : [])];

  const onKey = (e) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setOpen(true);
      setActive((a) => Math.min(a + 1, options.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((a) => Math.max(a - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (options[active]) pick(options[active]);
    } else if (e.key === "Escape") setOpen(false);
  };

  return (
    <div ref={boxRef} className="relative">
      <div className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <input
          value={q}
          autoFocus={autoFocus}
          onChange={(e) => {
            setQ(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={onKey}
          placeholder={placeholder}
          role="combobox"
          aria-expanded={open}
          aria-autocomplete="list"
          className="block w-full rounded-lg border border-slate-300 bg-white py-2 pl-9 pr-9 text-sm text-slate-900 placeholder:text-slate-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
        />
        {loading && <Loader2 className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-slate-400" />}
      </div>
      {open && options.length > 0 && (
        <ul role="listbox" className="absolute left-0 right-0 z-40 mt-1 max-h-80 overflow-auto rounded-xl border border-slate-200 bg-white py-1 shadow-xl">
          {options.map((o, i) => {
            const badge = SOURCE_BADGE[o.source];
            return (
              <li
                key={`${o.source}-${o.code || ""}-${o.display}-${i}`}
                role="option"
                aria-selected={i === active}
                onMouseDown={(e) => {
                  e.preventDefault();
                  pick(o);
                }}
                onMouseEnter={() => setActive(i)}
                className={`flex cursor-pointer items-start justify-between gap-3 px-3 py-2 text-sm ${i === active ? "bg-brand-50" : ""}`}
              >
                {o.source === "text" ? (
                  <span className="flex items-center gap-2 text-slate-700">
                    <Plus className="h-4 w-4 text-slate-400" /> Add “{o.display}” <span className="text-xs text-slate-400">(free text, not coded)</span>
                  </span>
                ) : (
                  <>
                    <span className="min-w-0">
                      <span className="block truncate font-medium text-slate-900">{o.display}</span>
                      <span className="block truncate text-xs text-slate-500">
                        {[o.matched && `matches “${o.matched}”`, o.genericName, renderMeta?.(o), o.code && `SCTID ${o.code}`].filter(Boolean).join(" · ")}
                      </span>
                    </span>
                    {badge && <span className={`shrink-0 rounded px-1.5 py-0.5 text-[10px] font-semibold ${badge.className}`}>{badge.label}</span>}
                  </>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default ConceptPicker;
