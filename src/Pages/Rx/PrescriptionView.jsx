import React, { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";
import { format } from "date-fns";
import { Ban, ChevronLeft, Code2, FilePen, Pencil, Printer } from "lucide-react";
import { useSelector } from "react-redux";
import { Badge, Button, Card, EmptyState, Modal, Spinner } from "../../Components/Common/ui";
import RxDocument from "../../Components/Rx/RxDocument";
import { STATUS_BADGE, rxApi } from "../../util/prescriptionApi";

const PrescriptionView = () => {
  const { id } = useParams();
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const me = useSelector((s) => s.profile.profileData);
  const [rx, setRx] = useState(null);
  const [error, setError] = useState("");
  const [dialog, setDialog] = useState(null); // amend | cancel | fhir
  const [reason, setReason] = useState("");
  const [busy, setBusy] = useState(false);
  const [fhir, setFhir] = useState(null);

  const load = useCallback(() => {
    rxApi.get(id).then(setRx).catch((e) => setError(e.message));
  }, [id]);
  useEffect(load, [load]);

  useEffect(() => {
    if (rx && params.get("print") === "1") setTimeout(() => window.print(), 400);
  }, [rx, params]);

  if (error) return <Card><EmptyState title="Prescription not found" description={error} action={<Button variant="secondary" onClick={() => navigate("/prescriptions")}>All prescriptions</Button>} /></Card>;
  if (!rx) return <Spinner />;

  const mine = me && String(rx.practitionerId) === String(me._id);
  const badge = STATUS_BADGE[rx.status] || STATUS_BADGE.final;
  const writeUrl = rx.appointmentId ? `/prescriptions/write?appointmentId=${rx.appointmentId}` : `/prescriptions/write?admissionId=${rx.admissionId}&kind=${rx.kind === "discharge" ? "discharge" : "inpatient-order"}`;

  const submit = async () => {
    if (!reason.trim()) return toast.error("Please give a reason.");
    setBusy(true);
    try {
      if (dialog === "amend") {
        const draft = await rxApi.amend(rx._id, reason.trim());
        toast.success("Amendment started – make your changes and sign again");
        navigate(`${writeUrl}&draft=${draft._id}`);
      } else {
        setRx(await rxApi.cancel(rx._id, reason.trim()));
        toast.success("Prescription cancelled. The patient will see it as cancelled.");
      }
      setDialog(null);
      setReason("");
    } catch (e) {
      toast.error(e.message);
    } finally {
      setBusy(false);
    }
  };

  const openFhir = async () => {
    setDialog("fhir");
    if (!fhir) {
      try {
        setFhir(await rxApi.fhir(rx._id));
      } catch (e) {
        setFhir({ error: e.message });
      }
    }
  };

  return (
    <div className="mx-auto max-w-4xl space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3 print:hidden">
        <button type="button" onClick={() => navigate(-1)} className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-slate-800">
          <ChevronLeft className="h-4 w-4" /> Back
        </button>
        <div className="flex flex-wrap gap-2">
          {rx.status === "draft" && mine && <Button icon={Pencil} onClick={() => navigate(writeUrl)}>Continue writing</Button>}
          {rx.status !== "draft" && <Button variant="secondary" icon={Printer} onClick={() => window.print()}>Print</Button>}
          {rx.status !== "draft" && <Button variant="secondary" icon={Code2} onClick={openFhir}>FHIR document</Button>}
          {rx.status === "final" && mine && <Button variant="secondary" icon={FilePen} onClick={() => setDialog("amend")}>Amend</Button>}
          {rx.status === "final" && mine && <Button variant="danger" icon={Ban} onClick={() => setDialog("cancel")}>Cancel</Button>}
        </div>
      </div>

      <Card className="flex flex-wrap items-center justify-between gap-3 px-5 py-3 print:hidden">
        <div className="flex flex-wrap items-center gap-2 text-sm">
          <Badge color={badge.color}>{badge.label}</Badge>
          <Badge color={rx.careSetting === "IPD" ? "violet" : "blue"}>{rx.careSetting}{rx.kind === "discharge" ? " · Discharge" : rx.kind === "inpatient-order" ? " · Inpatient order" : ""}</Badge>
          <span className="text-slate-600">{rx.sharedWithPatient ? "Visible to the patient" : "Not shared yet"}</span>
          {rx.fhir?.prescriptionBundleId || rx.fhir?.consultBundleId ? <span className="text-slate-400">· FHIR stored ({rx.fhir.store})</span> : null}
        </div>
        {rx.versions?.length > 1 && (
          <div className="flex flex-wrap items-center gap-1.5 text-xs text-slate-500">
            Versions:
            {rx.versions.map((v) => (
              <button
                key={v._id}
                type="button"
                onClick={() => navigate(`/prescriptions/${v._id}`)}
                title={v.amendReason || v.cancelReason || ""}
                className={`rounded px-1.5 py-0.5 ${v._id === rx._id ? "bg-brand-500 text-white" : "bg-slate-100 text-slate-700 hover:bg-slate-200"}`}
              >
                v{v.version} {STATUS_BADGE[v.status]?.label}
              </button>
            ))}
          </div>
        )}
      </Card>
      {rx.amendReason && <p className="rounded-lg bg-amber-50 px-4 py-2 text-sm text-amber-800 print:hidden">Amended (version {rx.version}): {rx.amendReason}</p>}

      <RxDocument rx={rx} />

      <Modal
        open={dialog === "amend" || dialog === "cancel"}
        onClose={() => setDialog(null)}
        title={dialog === "amend" ? "Amend prescription" : "Cancel prescription"}
        description={
          dialog === "amend"
            ? "A new version is created for you to edit. The current version stays valid until you sign the new one."
            : "The prescription is marked as cancelled (entered in error) everywhere, including the patient's app."
        }
        footer={
          <>
            <Button variant="secondary" onClick={() => setDialog(null)}>Back</Button>
            <Button variant={dialog === "cancel" ? "danger" : "primary"} loading={busy} onClick={submit}>{dialog === "amend" ? "Start amendment" : "Cancel prescription"}</Button>
          </>
        }
      >
        <label className="block text-sm font-medium text-slate-700">
          Reason
          <textarea rows={3} value={reason} onChange={(e) => setReason(e.target.value)} placeholder={dialog === "amend" ? "e.g. Dose of paracetamol corrected" : "e.g. Written for the wrong patient"} className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none" />
        </label>
      </Modal>

      <Modal open={dialog === "fhir"} onClose={() => setDialog(null)} size="max-w-4xl" title="HL7 FHIR R4 documents" description="ABDM (NRCeS) document bundles stored for this prescription – used for health-record exchange.">
        {!fhir ? (
          <Spinner className="py-8" />
        ) : fhir.error ? (
          <p className="text-sm text-rose-600">{fhir.error}</p>
        ) : (
          <div className="space-y-4">
            {Object.entries(fhir).map(([key, bundle]) => (
              <div key={key}>
                <div className="mb-1 flex items-center justify-between">
                  <p className="text-sm font-semibold text-slate-900">
                    {bundle?.entry?.[0]?.resource?.type?.coding?.[0]?.display || key} · {bundle?.entry?.length} resources
                  </p>
                  <Button
                    variant="ghost"
                    onClick={() => {
                      const url = URL.createObjectURL(new Blob([JSON.stringify(bundle, null, 2)], { type: "application/fhir+json" }));
                      const a = document.createElement("a");
                      a.href = url;
                      a.download = `${rx.prescriptionNumber}-${key}.json`;
                      a.click();
                      URL.revokeObjectURL(url);
                    }}
                  >
                    Download JSON
                  </Button>
                </div>
                <pre className="max-h-72 overflow-auto rounded-lg bg-slate-900 p-3 text-[11px] leading-relaxed text-slate-100">{JSON.stringify(bundle, null, 2)}</pre>
              </div>
            ))}
            <p className="text-xs text-slate-500">Generated {rx.fhir?.storedAt ? format(new Date(rx.fhir.storedAt), "d MMM yyyy, h:mm a") : ""}.</p>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default PrescriptionView;
