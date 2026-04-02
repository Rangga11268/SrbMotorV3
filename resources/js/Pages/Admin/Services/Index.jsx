import React, { useState } from "react";
import AdminLayout from "@/Layouts/AdminLayout";
import { useForm, router } from "@inertiajs/react";
import {
    CCard,
    CCardBody,
    CCardHeader,
    CBadge,
    CButton,
    CModal,
    CModalHeader,
    CModalTitle,
    CModalBody,
    CModalFooter,
    CFormTextarea,
    CFormInput,
    CFormSelect,
    CTable,
    CTableHead,
    CTableRow,
    CTableHeaderCell,
    CTableBody,
    CTableDataCell
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
import { cilCheck, cilX, cilPen, cilSettings } from "@coreui/icons";

export default function ServicesIndex({ appointments }) {
    const [selectedService, setSelectedService] = useState(null);
    const [visible, setVisible] = useState(false);
    
    const { data, setData, put, processing, reset } = useForm({
        status: "",
        estimated_cost: "",
        admin_notes: ""
    });

    const openModal = (app) => {
        setSelectedService(app);
        setData({
            status: app.status,
            estimated_cost: app.estimated_cost || "",
            admin_notes: app.admin_notes || ""
        });
        setVisible(true);
    };

    const handleUpdate = () => {
        put(route('admin.services.update-status', selectedService.id), {
            onSuccess: () => {
                setVisible(false);
                reset();
            }
        });
    };

    const getBadge = (status) => {
        switch (status) {
            case 'pending': return 'warning';
            case 'confirmed': return 'info';
            case 'in_progress': return 'primary';
            case 'completed': return 'success';
            case 'cancelled': return 'danger';
            default: return 'secondary';
        }
    };

    return (
        <AdminLayout title="Manajemen Pemesanan Servis">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h2 className="mb-1 fw-bold text-dark" style={{ letterSpacing: "-0.5px" }}>Antrean Servis (Kalender)</h2>
                    <p className="text-secondary small mb-0">Kelola kuota harian dan pantau pengerjaan mekanik SSM.</p>
                </div>
            </div>

            <CCard className="border-0 shadow-sm rounded-4 overflow-hidden">
                <CCardBody className="p-0">
                    <div className="table-responsive">
                        <CTable align="middle" className="mb-0 border-top" hover>
                            <CTableHead color="light">
                                <CTableRow>
                                    <CTableHeaderCell className="text-uppercase text-secondary small fw-bold py-3 px-4">Tgl & Jam</CTableHeaderCell>
                                    <CTableHeaderCell className="text-uppercase text-secondary small fw-bold py-3">Pelanggan</CTableHeaderCell>
                                    <CTableHeaderCell className="text-uppercase text-secondary small fw-bold py-3">Kendaraan</CTableHeaderCell>
                                    <CTableHeaderCell className="text-uppercase text-secondary small fw-bold py-3">Catatan KM</CTableHeaderCell>
                                    <CTableHeaderCell className="text-uppercase text-secondary small fw-bold py-3 text-center">Status</CTableHeaderCell>
                                    <CTableHeaderCell className="text-uppercase text-secondary small fw-bold py-3 text-end px-4">Aksi</CTableHeaderCell>
                                </CTableRow>
                            </CTableHead>
                            <CTableBody>
                                {appointments.length === 0 ? (
                                    <CTableRow>
                                        <CTableDataCell colSpan="6" className="text-center p-5 text-secondary">
                                            Tidak ada antrean servis saat ini.
                                        </CTableDataCell>
                                    </CTableRow>
                                ) : appointments.map((app) => (
                                    <CTableRow key={app.id}>
                                        <CTableDataCell className="px-4">
                                            <div className="fw-bold text-dark">{new Date(app.service_date).toLocaleDateString("id-ID")}</div>
                                            <div className="small text-secondary">{app.service_time}</div>
                                        </CTableDataCell>
                                        <CTableDataCell>
                                            <div className="fw-bold">{app.customer_name}</div>
                                            <div className="small text-secondary">{app.customer_phone}</div>
                                        </CTableDataCell>
                                        <CTableDataCell>
                                            <div className="fw-semibold text-primary">{app.license_plate}</div>
                                            <div className="small text-secondary">{app.motor_brand} {app.motor_type}</div>
                                        </CTableDataCell>
                                        <CTableDataCell>
                                            <div className="fw-bold">{app.current_km.toLocaleString()} KM</div>
                                            <div className="small text-secondary">{app.service_type}</div>
                                        </CTableDataCell>
                                        <CTableDataCell className="text-center">
                                            <CBadge color={getBadge(app.status)} shape="rounded-pill" className="px-3 py-2 text-uppercase" style={{ fontSize: "0.7rem", letterSpacing: "1px" }}>
                                                {app.status.replace("_", " ")}
                                            </CBadge>
                                        </CTableDataCell>
                                        <CTableDataCell className="text-end px-4">
                                            <CButton color="dark" variant="outline" size="sm" onClick={() => openModal(app)}>
                                                <CIcon icon={cilSettings} className="me-1" /> Kelola
                                            </CButton>
                                        </CTableDataCell>
                                    </CTableRow>
                                ))}
                            </CTableBody>
                        </CTable>
                    </div>
                </CCardBody>
            </CCard>

            {/* Modal Manajemen Servis */}
            <CModal visible={visible} onClose={() => setVisible(false)} backdrop="static" alignment="center">
                <CModalHeader closeButton>
                    <CModalTitle>Tindak Lanjut Servis</CModalTitle>
                </CModalHeader>
                <CModalBody>
                    {selectedService && (
                        <div className="mb-4 p-3 bg-light rounded text-sm">
                            <div className="row mb-2">
                                <div className="col-4 fw-bold text-secondary">Pelanggan</div>
                                <div className="col-8">{selectedService.customer_name} ({selectedService.customer_phone})</div>
                            </div>
                            <div className="row mb-2">
                                <div className="col-4 fw-bold text-secondary">Keluhan</div>
                                <div className="col-8 fst-italic">"{selectedService.complaint_notes || '-'}"</div>
                            </div>
                        </div>
                    )}

                    <div className="mb-3">
                        <label className="form-label fw-bold small text-secondary text-uppercase">Ubah Status</label>
                        <CFormSelect value={data.status} onChange={e => setData('status', e.target.value)}>
                            <option value="pending">Menunggu Konfirmasi (Pending)</option>
                            <option value="confirmed">Disetujui / Terjadwal (Confirmed)</option>
                            <option value="in_progress">Sedang Dikerjakan (In Progress)</option>
                            <option value="completed">Selesai (Completed)</option>
                            <option value="cancelled">Dibatalkan (Cancelled / Ditolak)</option>
                        </CFormSelect>
                    </div>

                    <div className="mb-3">
                        <label className="form-label fw-bold small text-secondary text-uppercase">Estimasi Biaya Final (Opsional)</label>
                        <CFormInput 
                            type="number" 
                            placeholder="Misal: 150000" 
                            value={data.estimated_cost} 
                            onChange={e => setData('estimated_cost', e.target.value)}
                        />
                        <div className="form-text small">Diisi terutama saat status "Completed" untuk notifikasi kasir/pelanggan.</div>
                    </div>

                    <div className="mb-3">
                        <label className="form-label fw-bold small text-secondary text-uppercase">Catatan Admin / Resolusi Masalah (Opsional)</label>
                        <CFormTextarea 
                            rows={3} 
                            placeholder="Alasan penolakan / Catatan untuk mekanik / Kerusakan yang ditemukan" 
                            value={data.admin_notes} 
                            onChange={e => setData('admin_notes', e.target.value)}
                        />
                    </div>
                </CModalBody>
                <CModalFooter>
                    <CButton color="secondary" variant="ghost" onClick={() => setVisible(false)}>
                        Tutup
                    </CButton>
                    <CButton color="primary" onClick={handleUpdate} disabled={processing}>
                        {processing ? 'Menyimpan...' : 'Simpan Perubahan'}
                    </CButton>
                </CModalFooter>
            </CModal>
        </AdminLayout>
    );
}
