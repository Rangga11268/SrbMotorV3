import React, { useState } from "react";
import { useForm, Link, router } from "@inertiajs/react";
import MetronicAdminLayout from "@/Layouts/MetronicAdminLayout";
import Swal from "sweetalert2";
import {
    ArrowLeft, CheckCircle, XCircle, Eye, Clock, FileText,
    Send, Calendar, Banknote, CreditCard, Bike, User, Phone,
    AlertTriangle, Trash2, Check, X, RotateCcw,
    MessageCircle, FileCheck, ClipboardList, ReceiptText
} from "lucide-react";

/* ─── Status Config ─────────────────────────────────────────── */
const STATUS_MAP = {
    pengajuan_masuk:            { label: "Pengajuan Masuk",        cls: "bg-sky-100 text-sky-700 border-sky-200" },
    menunggu_persetujuan:       { label: "Menunggu Persetujuan",   cls: "bg-amber-100 text-amber-700 border-amber-200" },
    verifikasi_dokumen:         { label: "Verifikasi Dokumen",     cls: "bg-amber-100 text-amber-700 border-amber-200" },
    dikirim_ke_leasing:         { label: "Dikirim ke Leasing",     cls: "bg-blue-100 text-blue-700 border-blue-200" },
    survey_dijadwalkan:         { label: "Survey Dijadwalkan",     cls: "bg-purple-100 text-purple-700 border-purple-200" },
    survey_berjalan:            { label: "Survey Berjalan",        cls: "bg-purple-100 text-purple-700 border-purple-200" },
    menunggu_keputusan_leasing: { label: "Menunggu Keputusan",     cls: "bg-indigo-100 text-indigo-700 border-indigo-200" },
    disetujui:                  { label: "Disetujui",              cls: "bg-emerald-100 text-emerald-700 border-emerald-200" },
    ditolak:                    { label: "Ditolak",                cls: "bg-red-100 text-red-600 border-red-200" },
    dp_dibayar:                 { label: "DP Dibayar",             cls: "bg-emerald-100 text-emerald-700 border-emerald-200" },
    selesai:                    { label: "Selesai",                cls: "bg-emerald-100 text-emerald-700 border-emerald-200" },
    dibatalkan:                 { label: "Dibatalkan",             cls: "bg-gray-100 text-gray-500 border-gray-200" },
};

const STEPPER = [
    { key: "pengajuan_masuk",            label: "Pengajuan",  icon: FileText },
    { key: "verifikasi_dokumen",         label: "Verifikasi", icon: FileCheck },
    { key: "dikirim_ke_leasing",         label: "Ke Leasing", icon: Send },
    { key: "survey_dijadwalkan",         label: "Survey",     icon: Calendar },
    { key: "menunggu_keputusan_leasing", label: "Keputusan",  icon: ClipboardList },
    { key: "disetujui",                  label: "Disetujui",  icon: Check },
    { key: "dp_dibayar",                 label: "DP Dibayar", icon: Banknote },
    { key: "selesai",                    label: "Selesai",    icon: CheckCircle },
];
const STATUS_ORDER = STEPPER.map(s => s.key);

const StatusBadge = ({ status }) => {
    const s = STATUS_MAP[status] || { label: status, cls: "bg-gray-100 text-gray-600 border-gray-200" };
    return <span className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${s.cls}`}>{s.label}</span>;
};

/* ─── Modal ─────────────────────────────────────────────────── */
function Modal({ open, onClose, title, children, footer }) {
    if (!open) return null;
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md z-10 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                    <h3 className="font-black text-gray-800 text-base">{title}</h3>
                    <button onClick={onClose} className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"><X size={16} /></button>
                </div>
                <div className="p-6">{children}</div>
                {footer && <div className="px-6 pb-6 flex justify-end gap-3">{footer}</div>}
            </div>
        </div>
    );
}

const Btn = ({ onClick, variant = "primary", disabled, type = "button", children }) => {
    const cls = {
        primary: "bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/20",
        success: "bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-500/20",
        danger:  "bg-red-500 hover:bg-red-600 text-white",
        cancel:  "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50",
    }[variant];
    return (
        <button type={type} onClick={onClick} disabled={disabled} className={`px-5 py-2.5 rounded-xl text-sm font-black transition-colors disabled:opacity-50 flex items-center gap-2 ${cls}`}>
            {disabled && <div className="w-4 h-4 border-2 border-current/30 border-t-current rounded-full animate-spin" />}
            {children}
        </button>
    );
};

const Label = ({ children }) => <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">{children}</label>;
const iCls = "w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg p-2.5 focus:ring-blue-500 focus:border-blue-500";

/* ─── Main ───────────────────────────────────────────────────── */
export default function Show({ credit, availableTransitions, timeline, leasingProviders }) {
    const [activeModal, setActiveModal] = useState(null);
    const [activeTab,   setActiveTab]   = useState("info");

    const fmt = (n) => `Rp ${new Intl.NumberFormat("id-ID").format(n || 0)}`;

    // Shorthand aliases
    const trx          = credit.transaction;
    const motor        = trx?.motor;
    const installments = trx?.installments || [];
    // Latest survey from relation (surveySchedules loaded by controller)
    const latestSurvey = credit.surveySchedules?.length
        ? credit.surveySchedules[credit.surveySchedules.length - 1]
        : null;

    const currentStepIdx = STATUS_ORDER.indexOf(credit.status);
    const isDone     = credit.status === "selesai";
    const isRejected = credit.status === "ditolak" || credit.status === "dibatalkan";

    /* ── Swal action helpers ── */
    const handleCancel = () =>
        Swal.fire({ title: "Batalkan Pengajuan?", text: "Status akan berubah permanen.", icon: "warning", showCancelButton: true, confirmButtonText: "Ya, Batalkan", cancelButtonText: "Tutup", confirmButtonColor: "#6b7280" })
            .then(r => r.isConfirmed && router.post(route("admin.credits.cancel", credit.id)));

    const handleDelete = () =>
        Swal.fire({ title: "Hapus Pengajuan?", text: "Data akan dihapus permanen.", icon: "warning", showCancelButton: true, confirmButtonText: "Hapus", cancelButtonText: "Batal", confirmButtonColor: "#ef4444" })
            .then(r => r.isConfirmed && router.delete(route("admin.credits.destroy", credit.id), { onSuccess: () => router.visit(route("admin.credits.index")) }));

    const handleRepossess = () =>
        Swal.fire({ title: "Tarik Motor?", input: "textarea", inputPlaceholder: "Alasan penarikan...", icon: "warning", showCancelButton: true, confirmButtonText: "Ya, Tarik", confirmButtonColor: "#ef4444",
            preConfirm: r => r || Swal.showValidationMessage("Wajib diisi") })
            .then(r => r.isConfirmed && router.post(route("admin.credits.repossess", credit.id), { reason: r.value }));

    const handleApproveInstallment = (id) =>
        Swal.fire({ title: "Setujui Cicilan?", icon: "question", showCancelButton: true, confirmButtonText: "Ya, Setujui", confirmButtonColor: "#059669" })
            .then(r => r.isConfirmed && router.post(route("admin.installments.approve", id)));

    const handleRejectInstallment = (id) =>
        Swal.fire({ title: "Tolak Bukti Transfer?", input: "textarea", inputPlaceholder: "Alasan...", icon: "warning", showCancelButton: true, confirmButtonText: "Tolak", confirmButtonColor: "#ef4444" })
            .then(r => r.isConfirmed && router.post(route("admin.installments.reject", id), { rejection_reason: r.value }));

    const handleApproveDoc = (docId) =>
        Swal.fire({ title: "Setujui Dokumen?", icon: "question", showCancelButton: true, confirmButtonText: "Setujui", confirmButtonColor: "#059669" })
            .then(r => r.isConfirmed && router.post(route("admin.documents.approve", docId), {}, { onSuccess: () => window.location.reload() }));

    const handleViewProof = (path) =>
        Swal.fire({ title: "Bukti Transfer", imageUrl: `/storage/${path}`, imageAlt: "Bukti", showConfirmButton: true, confirmButtonText: "Tutup", width: "80%" });

    /* ── Sub-modal components (with own useForm) ── */
    function VerifyModal() {
        const f = useForm({ internal_notes: "" });
        return (
            <Modal open={activeModal === "verify"} onClose={() => setActiveModal(null)} title="Verifikasi Dokumen"
                footer={<><Btn variant="cancel" onClick={() => setActiveModal(null)}>Batal</Btn><Btn variant="primary" disabled={f.processing} onClick={() => f.post(route("admin.credits.verify-documents", credit.id), { onFinish: () => setActiveModal(null) })}>Lanjutkan</Btn></>}>
                <Label>Catatan Internal</Label>
                <textarea rows={3} value={f.data.internal_notes} onChange={e => f.setData("internal_notes", e.target.value)} placeholder="Catatan verifikasi..." className={`${iCls} resize-none`} />
            </Modal>
        );
    }

    function RejectModal() {
        const f = useForm({ rejection_reason: "" });
        return (
            <Modal open={activeModal === "reject"} onClose={() => setActiveModal(null)} title="Tolak Pengajuan"
                footer={<><Btn variant="cancel" onClick={() => setActiveModal(null)}>Batal</Btn><Btn variant="danger" disabled={f.processing} onClick={() => f.post(route("admin.credits.reject", credit.id), { onFinish: () => setActiveModal(null) })}>Tolak</Btn></>}>
                <Label>Alasan Penolakan <span className="text-red-500">*</span></Label>
                <textarea rows={3} required value={f.data.rejection_reason} onChange={e => f.setData("rejection_reason", e.target.value)} placeholder="Jelaskan alasan..." className={`${iCls} resize-none`} />
            </Modal>
        );
    }

    function SendLeasingModal() {
        const f = useForm({ leasing_provider: credit.leasing_provider || "", leasing_application_ref: credit.reference_number || "" });
        return (
            <Modal open={activeModal === "sendLeasing"} onClose={() => setActiveModal(null)} title="Kirim ke Leasing"
                footer={<><Btn variant="cancel" onClick={() => setActiveModal(null)}>Batal</Btn><Btn variant="primary" disabled={f.processing} onClick={() => f.post(route("admin.credits.send-to-leasing", credit.id), { onFinish: () => setActiveModal(null) })}>Kirim</Btn></>}>
                <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-700">Pengajuan akan dikirim ke pihak leasing eksternal untuk proses lanjutan.</div>
                <div className="mb-4"><Label>Pilih Penyedia Leasing *</Label>
                    <select required value={f.data.leasing_provider} onChange={e => f.setData("leasing_provider", e.target.value)} className={iCls}>
                        <option value="">-- Pilih Leasing --</option>
                        {leasingProviders?.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                    </select>
                </div>
                <div><Label>Nomor Referensi (Opsional)</Label>
                    <input type="text" value={f.data.leasing_application_ref} onChange={e => f.setData("leasing_application_ref", e.target.value)} placeholder="Nomor referensi aplikasi" className={iCls} />
                </div>
            </Modal>
        );
    }

    function ScheduleSurveyModal() {
        const f = useForm({ survey_scheduled_date: "", survey_scheduled_time: "", surveyor_name: "", surveyor_phone: "" });
        return (
            <Modal open={activeModal === "survey"} onClose={() => setActiveModal(null)} title="Jadwalkan Survey"
                footer={<><Btn variant="cancel" onClick={() => setActiveModal(null)}>Batal</Btn><Btn variant="primary" disabled={f.processing} onClick={() => f.post(route("admin.credits.schedule-survey", credit.id), { onFinish: () => setActiveModal(null) })}>Jadwalkan</Btn></>}>
                <div className="grid grid-cols-2 gap-4 mb-4">
                    <div><Label>Tanggal *</Label><input required type="date" value={f.data.survey_scheduled_date} onChange={e => f.setData("survey_scheduled_date", e.target.value)} className={iCls} /></div>
                    <div><Label>Jam *</Label><input required type="time" value={f.data.survey_scheduled_time} onChange={e => f.setData("survey_scheduled_time", e.target.value)} className={iCls} /></div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div><Label>Nama Surveyor *</Label><input required type="text" value={f.data.surveyor_name} onChange={e => f.setData("surveyor_name", e.target.value)} className={iCls} /></div>
                    <div><Label>No. HP Surveyor *</Label><input required type="text" value={f.data.surveyor_phone} onChange={e => f.setData("surveyor_phone", e.target.value)} className={iCls} /></div>
                </div>
            </Modal>
        );
    }

    function CompleteSurveyModal() {
        const f = useForm({ survey_notes: "" });
        return (
            <Modal open={activeModal === "completeSurvey"} onClose={() => setActiveModal(null)} title="Selesaikan Survey"
                footer={<><Btn variant="cancel" onClick={() => setActiveModal(null)}>Batal</Btn><Btn variant="primary" disabled={f.processing} onClick={() => f.post(route("admin.credits.complete-survey", credit.id), { onFinish: () => setActiveModal(null) })}>Selesai</Btn></>}>
                <Label>Catatan Hasil Survey</Label>
                <textarea rows={4} value={f.data.survey_notes} onChange={e => f.setData("survey_notes", e.target.value)} placeholder="Hasil dan catatan survey..." className={`${iCls} resize-none`} />
            </Modal>
        );
    }

    function ApproveCreditModal() {
        const f = useForm({
            approved_amount: trx?.credit_amount || (motor?.price && credit.dp_amount ? motor.price - credit.dp_amount : "") || "",
            interest_rate: "2.5"
        });
        return (
            <Modal open={activeModal === "approve"} onClose={() => setActiveModal(null)} title="Setujui Kredit"
                footer={<><Btn variant="cancel" onClick={() => setActiveModal(null)}>Batal</Btn><Btn variant="success" disabled={f.processing} onClick={() => f.post(route("admin.credits.approve", credit.id), { onFinish: () => setActiveModal(null) })}>Setujui</Btn></>}>
                <div className="mb-4"><Label>Jumlah Persetujuan *</Label><input required type="number" step="0.01" min="0" value={f.data.approved_amount} onChange={e => f.setData("approved_amount", e.target.value)} className={iCls} /></div>
                <div><Label>Suku Bunga (%) *</Label><input required type="number" step="0.01" min="0" max="100" value={f.data.interest_rate} onChange={e => f.setData("interest_rate", e.target.value)} className={iCls} /></div>
            </Modal>
        );
    }

    function RecordDPModal() {
        const f = useForm({ dp_payment_method: "bank_transfer" });
        return (
            <Modal open={activeModal === "recordDP"} onClose={() => setActiveModal(null)} title="Catat Pembayaran DP"
                footer={<><Btn variant="cancel" onClick={() => setActiveModal(null)}>Batal</Btn><Btn variant="success" disabled={f.processing} onClick={() => f.post(route("admin.credits.record-dp-payment", credit.id), { onFinish: () => setActiveModal(null) })}>Catat</Btn></>}>
                <Label>Metode Pembayaran</Label>
                <select value={f.data.dp_payment_method} onChange={e => f.setData("dp_payment_method", e.target.value)} className={iCls}>
                    <option value="bank_transfer">Transfer Bank</option>
                    <option value="cash">Tunai</option>
                    <option value="check">Cek</option>
                    <option value="other">Lainnya</option>
                </select>
                {credit.dp_amount && (
                    <div className="mt-4 p-3 bg-emerald-50 border border-emerald-200 rounded-lg">
                        <p className="text-xs text-emerald-700 font-bold">Jumlah DP yang harus dibayar:</p>
                        <p className="text-lg font-black text-emerald-700 mt-0.5">{fmt(credit.dp_amount)}</p>
                    </div>
                )}
            </Modal>
        );
    }

    function CompleteCreditModal() {
        const f = useForm({ internal_notes: "" });
        return (
            <Modal open={activeModal === "completeCredit"} onClose={() => setActiveModal(null)} title="Selesaikan Proses Kredit"
                footer={<><Btn variant="cancel" onClick={() => setActiveModal(null)}>Batal</Btn><Btn variant="success" disabled={f.processing} onClick={() => f.post(route("admin.credits.complete", credit.id), { onFinish: () => setActiveModal(null) })}>Selesaikan</Btn></>}>
                <div className="mb-4 p-3 bg-sky-50 border border-sky-200 rounded-lg text-sm text-sky-700">Menyelesaikan proses kredit berarti pelanggan dapat mulai mengambil motor dan cicilan akan berjalan.</div>
                <Label>Catatan Internal (Opsional)</Label>
                <textarea rows={4} value={f.data.internal_notes} onChange={e => f.setData("internal_notes", e.target.value)} placeholder="Catat informasi penting..." className={`${iCls} resize-none`} />
            </Modal>
        );
    }

    function RejectDocModal({ docId }) {
        const f = useForm({ rejection_reason: "" });
        return (
            <Modal open={activeModal === `rejectDoc-${docId}`} onClose={() => setActiveModal(null)} title="Tolak Dokumen"
                footer={<><Btn variant="cancel" onClick={() => setActiveModal(null)}>Batal</Btn><Btn variant="danger" disabled={f.processing} onClick={() => f.post(route("admin.documents.reject", docId), { onFinish: () => setActiveModal(null), onSuccess: () => window.location.reload() })}>Tolak</Btn></>}>
                <Label>Alasan Penolakan *</Label>
                <textarea rows={3} required value={f.data.rejection_reason} onChange={e => f.setData("rejection_reason", e.target.value)} placeholder="Jelaskan alasan..." className={`${iCls} resize-none`} />
            </Modal>
        );
    }

    /* ── Action buttons — availableTransitions is a PHP assoc array: { "target_status": "Label" } ── */
    // Map target status → modal + display config
    const STATUS_TO_ACTION = {
        verifikasi_dokumen:         { label: "Verifikasi Dokumen", icon: FileCheck,   cls: "bg-indigo-600 hover:bg-indigo-700 text-white hover:text-white shadow-indigo-100", modal: "verify" },
        dikirim_ke_leasing:         { label: "Kirim ke Leasing",   icon: Send,         cls: "bg-indigo-600 hover:bg-indigo-700 text-white hover:text-white shadow-indigo-100", modal: "sendLeasing" },
        survey_dijadwalkan:         { label: "Jadwalkan Survey",   icon: Calendar,     cls: "bg-purple-600 hover:bg-purple-700 text-white hover:text-white shadow-purple-100", modal: "survey" },
        menunggu_keputusan_leasing: { label: "Selesai Survey",     icon: Check,        cls: "bg-blue-600 hover:bg-blue-700 text-white hover:text-white shadow-blue-100",     modal: "completeSurvey" },
        disetujui:                  { label: "Setujui Kredit",     icon: CheckCircle,  cls: "bg-emerald-600 hover:bg-emerald-700 text-white hover:text-white shadow-emerald-100", modal: "approve" },
        dp_dibayar:                 { label: "Catat Bayar DP",     icon: Banknote,     cls: "bg-emerald-600 hover:bg-emerald-700 text-white hover:text-white shadow-emerald-100", modal: "recordDP" },
        selesai:                    { label: "Selesaikan",         icon: Check,        cls: "bg-emerald-600 hover:bg-emerald-700 text-white hover:text-white shadow-emerald-100", modal: "completeCredit" },
        ditolak:                    { label: "Tolak",              icon: XCircle,      cls: "bg-red-500 hover:bg-red-600 text-white hover:text-white shadow-red-100",        modal: "reject" },
    };

    return (
        <MetronicAdminLayout title={`Kredit #${credit.id}`}>
            {/* ── Modals ── */}
            <VerifyModal />
            <RejectModal />
            <SendLeasingModal />
            <ScheduleSurveyModal />
            <CompleteSurveyModal />
            <ApproveCreditModal />
            <RecordDPModal />
            <CompleteCreditModal />
            {credit.documents?.map(doc => <RejectDocModal key={doc.id} docId={doc.id} />)}

            {/* ── Header ── */}
            <div className="mb-6 flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                    <Link href={route("admin.credits.index")} className="p-2 border border-gray-200 bg-white text-gray-500 hover:bg-gray-50 rounded-lg transition-colors shadow-sm shrink-0">
                        <ArrowLeft size={18} />
                    </Link>
                    <div>
                        <h2 className="text-xl font-black text-gray-800">Kredit <span className="text-indigo-600 font-mono">#{credit.id}</span> — {motor?.name || "Unit Motor"}</h2>
                        <div className="flex items-center gap-2 mt-1 flex-wrap">
                            <StatusBadge status={credit.status} />
                            <span className="text-xs text-gray-400">{new Date(credit.created_at).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}</span>
                        </div>
                    </div>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                    {Object.entries(availableTransitions || {}).map(([targetStatus]) => {
                        const cfg = STATUS_TO_ACTION[targetStatus];
                        if (!cfg) return null;
                        const Icon = cfg.icon;
                        return (
                            <button key={targetStatus} onClick={() => setActiveModal(cfg.modal)} className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black transition-colors ${cfg.cls}`}>
                                <Icon size={14} /> {cfg.label}
                            </button>
                        );
                    })}
                    {!isDone && !isRejected && (
                        <button onClick={handleCancel} className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-500 hover:bg-gray-50 rounded-xl text-xs font-black transition-colors">
                            <RotateCcw size={13} /> Batalkan
                        </button>
                    )}
                </div>
            </div>

            {/* ── Approval Stepper ── */}
            {!isRejected && (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5 mb-6 overflow-x-auto">
                    <div className="flex items-center min-w-max">
                        {STEPPER.map((step, i) => {
                            const stepIdx = STATUS_ORDER.indexOf(step.key);
                            const done    = currentStepIdx > stepIdx || isDone;
                            const current = currentStepIdx === stepIdx && !isDone;
                            const Icon    = step.icon;
                            return (
                                <React.Fragment key={step.key}>
                                    <div className="flex flex-col items-center gap-1.5 min-w-[64px]">
                                        <div className={`w-9 h-9 rounded-full flex items-center justify-center border-2 transition-all ${
                                            done    ? "bg-emerald-500 border-emerald-500 text-white" :
                                            current ? "bg-indigo-600 border-indigo-600 text-white ring-4 ring-indigo-100" :
                                                      "bg-white border-gray-200 text-gray-300"}`}>
                                            {done ? <Check size={16} /> : <Icon size={14} />}
                                        </div>
                                        <span className={`text-[9px] font-black uppercase tracking-widest text-center leading-tight ${done ? "text-emerald-600" : current ? "text-indigo-600" : "text-gray-300"}`}>
                                            {step.label}
                                        </span>
                                    </div>
                                    {i < STEPPER.length - 1 && (
                                        <div className={`flex-1 h-0.5 mx-1 rounded-full ${(currentStepIdx > i || isDone) ? "bg-emerald-400" : "bg-gray-200"}`} style={{ minWidth: 24 }} />
                                    )}
                                </React.Fragment>
                            );
                        })}
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
                {/* ── Kiri 8 cols ── */}
                <div className="xl:col-span-8 space-y-6">
                    {/* Tab Nav */}
                    <div className="flex gap-1 bg-gray-100 p-1 rounded-xl w-fit">
                        {[
                            { key: "info",    label: "Info Pemohon",                         icon: User },
                            { key: "dokumen", label: `Dokumen (${credit.documents?.length || 0})`, icon: FileText },
                            { key: "cicilan", label: `Cicilan (${installments.length})`,     icon: CreditCard },
                        ].map(tab => {
                            const Icon = tab.icon;
                            return (
                                <button key={tab.key} onClick={() => setActiveTab(tab.key)}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-black transition-all ${activeTab === tab.key ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}>
                                    <Icon size={13} /> {tab.label}
                                </button>
                            );
                        })}
                    </div>

                    {/* Tab: Info Pemohon */}
                    {activeTab === "info" && (
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                            <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
                                <h3 className="font-bold text-gray-800 text-sm flex items-center gap-2"><User size={15} className="text-indigo-500" /> Informasi Pemohon & Kredit</h3>
                            </div>
                            <div className="p-6">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8">
                                    {/* Data pemohon */}
                                    {[
                                        { label: "Nama Pemohon",      value: trx?.name || trx?.user?.name },
                                        { label: "NIK",               value: trx?.nik },
                                        { label: "Email",             value: trx?.email || trx?.user?.email },
                                        { label: "Pekerjaan",         value: trx?.customer_occupation || trx?.user?.occupation },
                                        { label: "Warna Motor",       value: trx?.motor_color },
                                        { label: "Alamat",            value: trx?.address, full: true },
                                    ].map(({ label, value, full }) => (
                                        <div key={label} className={`py-3 border-b border-gray-100 ${full ? "sm:col-span-2" : ""}`}>
                                            <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">{label}</div>
                                            <div className="text-sm font-bold text-gray-800">{value || <span className="text-gray-300 italic text-xs font-normal">—</span>}</div>
                                        </div>
                                    ))}

                                    {/* WhatsApp row khusus */}
                                    <div className="py-3 border-b border-gray-100">
                                        <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">WhatsApp</div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm font-bold text-gray-800">{trx?.phone || trx?.user?.phone || "—"}</span>
                                            {(trx?.phone || trx?.user?.phone) && (
                                                <a href={`https://wa.me/${(trx.phone || trx.user.phone).replace(/\D/g, "")}`} target="_blank"
                                                    className="inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-500 text-white rounded-full text-[10px] font-black">
                                                    <MessageCircle size={9} /> WA
                                                </a>
                                            )}
                                        </div>
                                    </div>

                                    {/* Data kredit */}
                                    {[
                                        { label: "Unit Motor",         value: motor?.name },
                                        { label: "Harga Motor",        value: motor?.price ? fmt(motor.price) : null },
                                        { label: "Penyedia Leasing",   value: credit.leasing_provider },
                                        { label: "No. Referensi",      value: credit.reference_number },
                                        { label: "Uang Muka (DP)",     value: credit.dp_amount ? fmt(credit.dp_amount) : null },
                                        { label: "Tenor",              value: credit.tenor ? `${credit.tenor} Bulan` : null },
                                        { label: "Suku Bunga",         value: credit.interest_rate ? `${credit.interest_rate}%` : null },
                                        { label: "Cicilan / Bulan",    value: credit.monthly_installment ? fmt(credit.monthly_installment) : null },
                                        { label: "Total Bunga",        value: credit.total_interest ? fmt(credit.total_interest) : null },
                                        { label: "Metode DP",          value: credit.dp_payment_method?.replace(/_/g, " ") },
                                        { label: "DP Dibayar Tanggal", value: credit.dp_paid_at ? new Date(credit.dp_paid_at).toLocaleDateString("id-ID") : null },
                                        { label: "Diverifikasi",       value: credit.verified_at ? new Date(credit.verified_at).toLocaleString("id-ID") : null },
                                        { label: "Selesai",            value: credit.completed_at ? new Date(credit.completed_at).toLocaleString("id-ID") : null },
                                    ].map(({ label, value }) => value ? (
                                        <div key={label} className="py-3 border-b border-gray-100">
                                            <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">{label}</div>
                                            <div className="text-sm font-bold text-gray-800">{value}</div>
                                        </div>
                                    ) : null)}

                                    {/* Catatan verifikasi */}
                                    {credit.verification_notes && (
                                        <div className="py-3 border-b border-gray-100 sm:col-span-2">
                                            <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">Catatan Verifikasi</div>
                                            <div className="text-sm font-bold text-gray-800 italic">"{credit.verification_notes}"</div>
                                        </div>
                                    )}
                                </div>

                                {/* Survey Info dari relasi surveySchedules */}
                                {latestSurvey && (
                                    <div className="mt-4 p-4 bg-purple-50 rounded-xl border border-purple-200">
                                        <div className="text-xs font-black text-purple-700 uppercase tracking-widest mb-3 flex items-center gap-1.5">
                                            <Calendar size={13} /> Info Survey
                                            <span className={`ml-auto text-[10px] px-2 py-0.5 rounded-full border font-black ${latestSurvey.status === "completed" ? "bg-emerald-100 text-emerald-700 border-emerald-200" : "bg-purple-100 text-purple-700 border-purple-200"}`}>
                                                {latestSurvey.status}
                                            </span>
                                        </div>
                                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                                            <div><span className="text-gray-500">Tanggal</span><p className="font-bold text-gray-800">{latestSurvey.scheduled_date ? new Date(latestSurvey.scheduled_date).toLocaleDateString("id-ID") : "—"}</p></div>
                                            <div><span className="text-gray-500">Jam</span><p className="font-bold text-gray-800">{latestSurvey.scheduled_time || "—"}</p></div>
                                            <div><span className="text-gray-500">Surveyor</span><p className="font-bold text-gray-800">{latestSurvey.surveyor_name || "—"}</p></div>
                                            <div><span className="text-gray-500">HP Surveyor</span><p className="font-bold text-gray-800">{latestSurvey.surveyor_phone || "—"}</p></div>
                                        </div>
                                        {latestSurvey.notes && <p className="mt-2 text-xs text-gray-600 italic">"{latestSurvey.notes}"</p>}
                                        {latestSurvey.location && <p className="mt-1 text-xs text-gray-500">📍 {latestSurvey.location}</p>}
                                    </div>
                                )}

                                {/* Alasan penolakan */}
                                {credit.rejection_reason && (
                                    <div className="mt-4 p-4 bg-red-50 rounded-xl border border-red-200">
                                        <div className="text-xs font-black text-red-600 uppercase tracking-widest mb-1 flex items-center gap-1.5"><XCircle size={13} /> Alasan Penolakan</div>
                                        <p className="text-sm text-red-700">{credit.rejection_reason}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Tab: Dokumen */}
                    {activeTab === "dokumen" && (
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                            <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
                                <h3 className="font-bold text-gray-800 text-sm flex items-center gap-2"><FileText size={15} className="text-indigo-500" /> Dokumen Pengajuan</h3>
                            </div>
                            <div className="p-6">
                                {credit.documents && credit.documents.length > 0 ? (
                                    <div className="space-y-3">
                                        {credit.documents.map(doc => {
                                            // Field dari DB: approval_status (bukan status)
                                            const approvalStatus = doc.approval_status || "pending";
                                            const isImg = /\.(jpg|jpeg|png|gif|webp)$/i.test(doc.file_path || "");
                                            const statusCls = {
                                                approved: "bg-emerald-100 text-emerald-700 border-emerald-200",
                                                rejected: "bg-red-100 text-red-600 border-red-200",
                                                pending:  "bg-amber-100 text-amber-700 border-amber-200",
                                            }[approvalStatus] || "bg-gray-100 text-gray-600 border-gray-200";

                                            return (
                                                <div key={doc.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl border border-gray-200">
                                                    <div className="w-14 h-14 rounded-lg bg-white border border-gray-200 overflow-hidden shrink-0 flex items-center justify-center">
                                                        {isImg && doc.file_path
                                                            ? <img src={`/storage/${doc.file_path}`} alt={doc.document_type} className="w-full h-full object-cover" />
                                                            : <FileText size={22} className="text-gray-300" />}
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <div className="font-bold text-gray-800 text-sm capitalize">{doc.document_type?.replace(/_/g, " ")}</div>
                                                        {doc.original_name && <div className="text-xs text-gray-400 truncate mt-0.5">{doc.original_name}</div>}
                                                        <div className="flex items-center gap-2 mt-1 flex-wrap">
                                                            <span className={`text-[10px] font-black px-2 py-0.5 rounded-full border ${statusCls}`}>{approvalStatus}</span>
                                                            {doc.reviewed_at && <span className="text-[10px] text-gray-400">Direview: {new Date(doc.reviewed_at).toLocaleDateString("id-ID")}</span>}
                                                            {doc.rejection_reason && <span className="text-xs text-red-500 truncate">• {doc.rejection_reason}</span>}
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-2 shrink-0">
                                                        {doc.file_path && (
                                                            <a href={`/storage/${doc.file_path}`} target="_blank" className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Lihat File"><Eye size={15} /></a>
                                                        )}
                                                        {approvalStatus !== "approved" && (
                                                            <button onClick={() => handleApproveDoc(doc.id)} className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors" title="Setujui"><Check size={15} /></button>
                                                        )}
                                                        {approvalStatus !== "rejected" && (
                                                            <button onClick={() => setActiveModal(`rejectDoc-${doc.id}`)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors" title="Tolak"><X size={15} /></button>
                                                        )}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                ) : (
                                    <div className="text-center py-10"><FileText size={36} className="mx-auto mb-3 text-gray-300" /><p className="text-gray-400 font-bold text-sm">Belum ada dokumen diunggah.</p></div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Tab: Cicilan — dari transaction.installments */}
                    {activeTab === "cicilan" && (
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                            <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
                                <h3 className="font-bold text-gray-800 text-sm flex items-center gap-2"><CreditCard size={15} className="text-indigo-500" /> Jadwal & Riwayat Cicilan</h3>
                            </div>
                            <div className="overflow-x-auto">
                                {installments.length > 0 ? (
                                    <table className="w-full text-sm text-left whitespace-nowrap">
                                        <thead><tr className="border-b border-gray-100 text-[10px] font-bold uppercase tracking-widest text-gray-400 bg-gray-50/50">
                                            <th className="px-5 py-3">Cicilan ke-</th>
                                            <th className="px-5 py-3">Jatuh Tempo</th>
                                            <th className="px-5 py-3">Nominal</th>
                                            <th className="px-5 py-3">Status</th>
                                            <th className="px-5 py-3">Dibayar</th>
                                            <th className="px-5 py-3">Bukti</th>
                                            <th className="px-5 py-3 text-center">Aksi</th>
                                        </tr></thead>
                                        <tbody className="divide-y divide-gray-100">
                                            {installments.map((inst) => {
                                                const stMap = {
                                                    paid:    "bg-emerald-100 text-emerald-700 border-emerald-200",
                                                    pending: "bg-amber-100 text-amber-700 border-amber-200",
                                                    overdue: "bg-red-100 text-red-600 border-red-200",
                                                    rejected:"bg-red-100 text-red-600 border-red-200",
                                                };
                                                return (
                                                    <tr key={inst.id} className="hover:bg-gray-50/50">
                                                        <td className="px-5 py-3 font-bold text-gray-800">#{inst.installment_number ?? inst.id}</td>
                                                        <td className="px-5 py-3 text-gray-600">{inst.due_date ? new Date(inst.due_date).toLocaleDateString("id-ID") : "—"}</td>
                                                        <td className="px-5 py-3 font-black text-gray-900">{fmt(inst.amount)}</td>
                                                        <td className="px-5 py-3"><span className={`text-[10px] font-black px-2.5 py-1 rounded-full border ${stMap[inst.status] || "bg-gray-100 text-gray-600 border-gray-200"}`}>{inst.status}</span></td>
                                                        <td className="px-5 py-3 text-xs text-gray-400">{inst.paid_at ? new Date(inst.paid_at).toLocaleDateString("id-ID") : "—"}</td>
                                                        <td className="px-5 py-3">
                                                            {inst.payment_proof
                                                                ? <button onClick={() => handleViewProof(inst.payment_proof)} className="text-blue-600 hover:text-blue-800 text-xs font-bold flex items-center gap-1"><Eye size={12} /> Lihat</button>
                                                                : <span className="text-gray-300 text-xs">—</span>}
                                                        </td>
                                                        <td className="px-5 py-3 text-center">
                                                            {inst.status !== "paid" && inst.payment_proof && (
                                                                <div className="flex items-center justify-center gap-1">
                                                                    <button onClick={() => handleApproveInstallment(inst.id)} className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-lg" title="Setujui"><Check size={14} /></button>
                                                                    <button onClick={() => handleRejectInstallment(inst.id)} className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg" title="Tolak"><X size={14} /></button>
                                                                </div>
                                                            )}
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                ) : (
                                    <div className="text-center py-10"><CreditCard size={36} className="mx-auto mb-3 text-gray-300" /><p className="text-gray-400 font-bold text-sm">Belum ada data cicilan.</p></div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Timeline */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
                            <h3 className="font-bold text-gray-800 text-sm flex items-center gap-2"><Clock size={15} className="text-indigo-500" /> Riwayat Aktivitas</h3>
                        </div>
                        <div className="p-6">
                            {timeline && timeline.length > 0 ? (
                                <div className="space-y-0">
                                    {timeline.map((log, i) => {
                                        const sKey = log.status;
                                        const s = STATUS_MAP[sKey] || { cls: "bg-gray-100 border-gray-200 text-gray-600" };
                                        return (
                                            <div key={i} className="flex gap-4">
                                                <div className="flex flex-col items-center">
                                                    <div className={`w-3 h-3 rounded-full border-2 shrink-0 mt-1 ${log.is_completed ? "bg-emerald-500 border-emerald-500" : "bg-gray-300 border-gray-300"}`} />
                                                    {i < timeline.length - 1 && <div className="w-0.5 flex-1 bg-gray-200 my-1" />}
                                                </div>
                                                <div className="pb-5">
                                                    <span className={`text-[10px] font-black px-2 py-0.5 rounded border ${s.cls}`}>
                                                        {STATUS_MAP[sKey]?.label || sKey}
                                                    </span>
                                                    {log.date && (
                                                        <div className="text-[10px] text-gray-400 mt-0.5">
                                                            {new Date(log.date).toLocaleString("id-ID")}
                                                        </div>
                                                    )}
                                                    {log.notes && (
                                                        <div className="text-xs text-gray-500 mt-0.5 italic">"{log.notes}"</div>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            ) : (
                                <p className="text-gray-400 text-sm text-center py-4">Belum ada riwayat aktivitas.</p>
                            )}
                        </div>
                    </div>
                </div>

                {/* ── Sidebar 4 cols ── */}
                <div className="xl:col-span-4 space-y-4">
                    {/* Ringkasan Kredit */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                        <div className="px-5 py-4 border-b border-gray-100 bg-gray-50/50">
                            <h3 className="font-bold text-gray-800 text-sm">Ringkasan Kredit</h3>
                        </div>
                        <div className="p-5 space-y-0 divide-y divide-gray-100 text-sm">
                            <div className="flex items-center justify-between py-2.5">
                                <span className="text-xs text-gray-500 font-bold">No. Kredit</span>
                                <span className="text-xs font-black text-indigo-600 font-mono">#{credit.id}</span>
                            </div>
                            <div className="flex items-center justify-between py-2.5">
                                <span className="text-xs text-gray-500 font-bold">Status</span>
                                <StatusBadge status={credit.status} />
                            </div>
                            {motor?.price && (
                                <div className="flex items-center justify-between py-2.5">
                                    <span className="text-xs text-gray-500 font-bold">Harga Motor</span>
                                    <span className="text-xs font-bold text-gray-800">{fmt(motor.price)}</span>
                                </div>
                            )}
                            {credit.dp_amount > 0 && (
                                <div className="flex items-center justify-between py-2.5">
                                    <span className="text-xs text-gray-500 font-bold">Uang Muka (DP)</span>
                                    <span className="text-xs font-bold text-gray-800">{fmt(credit.dp_amount)}</span>
                                </div>
                            )}
                            {credit.tenor && (
                                <div className="flex items-center justify-between py-2.5">
                                    <span className="text-xs text-gray-500 font-bold">Tenor</span>
                                    <span className="text-xs font-bold text-gray-800">{credit.tenor} Bulan</span>
                                </div>
                            )}
                            {credit.interest_rate && (
                                <div className="flex items-center justify-between py-2.5">
                                    <span className="text-xs text-gray-500 font-bold">Suku Bunga</span>
                                    <span className="text-xs font-bold text-gray-800">{credit.interest_rate}%</span>
                                </div>
                            )}
                            {credit.monthly_installment && (
                                <div className="flex items-center justify-between py-2.5">
                                    <span className="text-xs text-gray-500 font-bold">Cicilan / Bulan</span>
                                    <span className="text-sm font-black text-indigo-700">{fmt(credit.monthly_installment)}</span>
                                </div>
                            )}
                            {credit.total_interest && (
                                <div className="flex items-center justify-between py-2.5">
                                    <span className="text-xs text-gray-500 font-bold">Total Bunga</span>
                                    <span className="text-xs font-bold text-gray-800">{fmt(credit.total_interest)}</span>
                                </div>
                            )}
                            {credit.leasing_provider && (
                                <div className="flex items-center justify-between py-2.5">
                                    <span className="text-xs text-gray-500 font-bold">Leasing</span>
                                    <span className="text-xs font-bold text-gray-800 text-right max-w-[120px]">{credit.leasing_provider}</span>
                                </div>
                            )}
                            {credit.reference_number && (
                                <div className="flex items-center justify-between py-2.5">
                                    <span className="text-xs text-gray-500 font-bold">No. Referensi</span>
                                    <span className="text-xs font-black text-gray-700 font-mono">{credit.reference_number}</span>
                                </div>
                            )}
                            {credit.dp_payment_method && (
                                <div className="flex items-center justify-between py-2.5">
                                    <span className="text-xs text-gray-500 font-bold">Metode DP</span>
                                    <span className="text-xs font-bold text-gray-800 capitalize">{credit.dp_payment_method.replace(/_/g, " ")}</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Unit Motor */}
                    {motor && (
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                            <div className="px-5 py-4 border-b border-gray-100 bg-gray-50/50">
                                <h3 className="font-bold text-gray-800 text-sm flex items-center gap-2"><Bike size={14} /> Unit Motor</h3>
                            </div>
                            <div className="p-4">
                                {motor.image_path && (
                                    <div className="aspect-[4/3] rounded-xl overflow-hidden bg-gray-100 border border-gray-200 mb-3">
                                        <img src={`/storage/${motor.image_path}`} alt={motor.name} className="w-full h-full object-cover" />
                                    </div>
                                )}
                                <p className="font-black text-gray-800 text-sm">{motor.name}</p>
                                <p className="text-xs text-gray-500 mt-0.5">{motor.brand} · {motor.type} · {motor.year}</p>
                                {motor.price && <p className="font-black text-indigo-600 mt-2">{fmt(motor.price)}</p>}
                            </div>
                        </div>
                    )}

                    {/* Danger Zone */}
                    <div className="bg-white rounded-2xl shadow-sm border border-red-200 overflow-hidden">
                        <div className="px-5 py-4 border-b border-red-100 bg-red-50/50">
                            <h3 className="font-bold text-red-700 text-sm flex items-center gap-2"><AlertTriangle size={14} /> Zona Bahaya</h3>
                        </div>
                        <div className="p-4 space-y-2">
                            {credit.status === "selesai" && (
                                <button onClick={handleRepossess} className="w-full py-2.5 border border-orange-300 bg-orange-50 hover:bg-orange-100 text-orange-700 rounded-lg text-xs font-black transition-colors">
                                    Tarik Motor (Repossess)
                                </button>
                            )}
                            <button onClick={handleDelete} className="w-full py-2.5 border-2 border-red-300 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg text-xs font-black transition-colors flex items-center justify-center gap-2">
                                <Trash2 size={13} /> Hapus Pengajuan Ini
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </MetronicAdminLayout>
    );
}
