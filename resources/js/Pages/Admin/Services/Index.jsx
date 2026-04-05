import React, { useState } from "react";
import AdminLayout from "@/Layouts/AdminLayout";
import { useForm, router } from "@inertiajs/react";
import Swal from "sweetalert2";
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
        admin_notes: "",
        service_notes: ""
    });

    const openModal = (app) => {
        setSelectedService(app);
        setData({
            status: app.status,
            admin_notes: app.admin_notes || "",
            service_notes: app.service_notes || ""
        });
        setVisible(true);
    };

    const handleUpdate = () => {
        put(route('admin.services.update-status', selectedService.id), {
            onSuccess: () => {
                setVisible(false);
                reset();
                Swal.fire({
                    title: 'Berhasil!',
                    text: 'Status reservasi servis telah diperbarui.',
                    icon: 'success',
                    timer: 2000,
                    showConfirmButton: false,
                    borderRadius: '0px'
                });
            },
            onError: () => {
                Swal.fire({
                    title: 'Gagal!',
                    text: 'Terjadi kesalahan saat memperbarui status.',
                    icon: 'error',
                    confirmButtonColor: '#1c69d4',
                    borderRadius: '0px'
                });
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
                                    <CTableHeaderCell className="text-uppercase text-secondary small fw-bold py-3">Unit Motor</CTableHeaderCell>
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
                                            <div className="fw-bold text-dark">{app.customer_name}</div>
                                            <div className="small text-secondary">{app.customer_phone}</div>
                                            <div className="small text-primary fw-bold mt-1 uppercase tracking-tight" style={{ fontSize: '0.75rem' }}>{app.branch}</div>
                                        </CTableDataCell>
                                        <CTableDataCell>
                                            <div className="fw-bold text-dark uppercase tracking-tighter" style={{ letterSpacing: '-0.2px' }}>{app.motor_model}</div>
                                            <div className="small text-secondary uppercase font-bold" style={{ fontSize: '10px' }}>{app.service_type}</div>
                                        </CTableDataCell>
                                        <CTableDataCell className="text-center">
                                            <CBadge color={getBadge(app.status)} shape="rounded-pill" className="px-3 py-2 text-uppercase" style={{ fontSize: "0.7rem", letterSpacing: "1px" }}>
                                                {app.status.replace("_", " ")}
                                            </CBadge>
                                        </CTableDataCell>
                                        <CTableDataCell className="text-end px-4">
                                            <CButton color="dark" variant="outline" size="sm" className="rounded-pill px-3" onClick={() => openModal(app)}>
                                                <CIcon icon={cilSettings} className="me-1" /> KELOLA
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
                                <div className="col-8">{selectedService.customer_name} ({selectedService.customer_phone}) - <span className="text-primary">{selectedService.branch}</span></div>
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
                        <label className="form-label fw-bold small text-secondary text-uppercase tracking-wider">Catatan Layanan / Benefit (Tampil ke User)</label>
                        <CFormTextarea 
                            rows={2} 
                            placeholder="Contoh: Gratis Ganti Oli / Diskon Jasa 20% / Silakan bawa STNK" 
                            value={data.service_notes} 
                            onChange={e => setData('service_notes', e.target.value)}
                        />
                    </div>

                    <div className="mb-3">
                        <label className="form-label fw-bold small text-secondary text-uppercase tracking-wider">Pesan Admin / Resolusi Masalah (Internal/Log)</label>
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
