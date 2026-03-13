import React, { useState, useEffect } from "react";
import { Link, router, useForm } from "@inertiajs/react";
import AdminLayout from "@/Layouts/AdminLayout";
import axios from "axios";
import Swal from "sweetalert2";
import toast from "react-hot-toast";
import {
    CCard,
    CCardBody,
    CCardHeader,
    CCol,
    CRow,
    CTable,
    CTableHead,
    CTableBody,
    CTableRow,
    CTableHeaderCell,
    CTableDataCell,
    CBadge,
    CButton,
    CFormInput,
    CFormSelect,
    CInputGroup,
    CInputGroupText,
    CPagination,
    CPaginationItem,
    CSpinner,
    CModal,
    CModalHeader,
    CModalTitle,
    CModalBody,
    CModalFooter,
    CFormLabel,
    CFormTextarea,
    CFormFeedback,
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
import {
    cilSearch,
    cilPlus,
    cilPencil,
    cilTrash,
    cilReload,
    cilBike,
} from "@coreui/icons";

export default function Index({ units: initialUnits, motors, filters }) {
    const [localUnits, setLocalUnits] = useState(initialUnits);
    const [search, setSearch] = useState(filters.search || "");
    const [status, setStatus] = useState(filters.status || "");
    const [motorId, setMotorId] = useState(filters.motor_id || "");
    const [loading, setLoading] = useState(false);
    const [isFirstRender, setIsFirstRender] = useState(true);

    // Modal state
    const [modalVisible, setModalVisible] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [editingUnit, setEditingUnit] = useState(null);

    const { data, setData, post, put, processing, errors, reset, clearErrors } = useForm({
        motor_id: "",
        frame_number: "",
        engine_number: "",
        color: "",
        status: "available",
        arrival_date: "",
        notes: "",
    });
    
    // Batch form
    const batchForm = useForm({
        motor_id: "",
        quantity: 1,
        color: "",
        status: "available",
        arrival_date: new Date().toISOString().split('T')[0],
        notes: "",
    });

    const [batchModalVisible, setBatchModalVisible] = useState(false);

    const fetchUnits = async (currentFilters) => {
        setLoading(true);
        try {
            const response = await axios.get(route("admin.motor-units.index"), {
                params: currentFilters,
                headers: { "X-Requested-With": "XMLHttpRequest" },
            });
            if (response.data && response.data.props && response.data.props.units) {
                setLocalUnits(response.data.props.units);
            } else if (response.data && response.data.data) {
                // Handle direct pagination object if controller is updated to return JSON
                setLocalUnits(response.data);
            }
        } catch (error) {
            console.error("Error fetching units:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (isFirstRender) {
            setIsFirstRender(false);
            return;
        }

        const params = {};
        if (search) params.search = search;
        if (status) params.status = status;
        if (motorId) params.motor_id = motorId;

        const delayDebounceFn = setTimeout(() => {
            const url = new URL(window.location.href);
            url.search = new URLSearchParams(params).toString();
            window.history.replaceState({}, "", url);
            fetchUnits(params);
        }, 500);

        return () => clearTimeout(delayDebounceFn);
    }, [search, status, motorId]);

    const resetFilters = () => {
        setSearch("");
        setStatus("");
        setMotorId("");
    };

    const handleOpenModal = (unit = null) => {
        clearErrors();
        if (unit) {
            setIsEdit(true);
            setEditingUnit(unit);
            setData({
                motor_id: unit.motor_id,
                frame_number: unit.frame_number,
                engine_number: unit.engine_number,
                color: unit.color || "",
                status: unit.status,
                arrival_date: unit.arrival_date || "",
                notes: unit.notes || "",
            });
        } else {
            setIsEdit(false);
            setEditingUnit(null);
            reset();
        }
        setModalVisible(true);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (isEdit) {
            put(route("admin.motor-units.update", editingUnit.id), {
                onSuccess: () => {
                    setModalVisible(false);
                    toast.success("Unit berhasil diperbarui");
                    fetchUnits({ search, status, motor_id: motorId });
                },
            });
        } else {
            post(route("admin.motor-units.store"), {
                onSuccess: () => {
                    setModalVisible(false);
                    toast.success("Unit berhasil ditambahkan");
                    fetchUnits({ search, status, motor_id: motorId });
                },
            });
        }
    };

    const handleBatchSubmit = (e) => {
        e.preventDefault();
        batchForm.post(route("admin.motor-units.batch-store"), {
            onSuccess: () => {
                setBatchModalVisible(false);
                toast.success("Batch unit berhasil ditambahkan");
                batchForm.reset();
                fetchUnits({ search, status, motor_id: motorId });
            },
        });
    };

    const confirmDelete = (unit) => {
        Swal.fire({
            title: "Hapus Unit?",
            text: `Unit dengan Frame #${unit.frame_number} akan dihapus.`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#dc2626",
            confirmButtonText: "Ya, Hapus",
        }).then((result) => {
            if (result.isConfirmed) {
                router.delete(route("admin.motor-units.destroy", unit.id), {
                    onSuccess: () => {
                        toast.success("Unit berhasil dihapus");
                        fetchUnits({ search, status, motor_id: motorId });
                    },
                    onError: (err) => {
                        toast.error(err.message || "Gagal menghapus unit");
                    }
                });
            }
        });
    };

    const getStatusBadge = (status) => {
        switch (status) {
            case "available": return <CBadge color="success">Tersedia</CBadge>;
            case "booked": return <CBadge color="warning">Dipesan</CBadge>;
            case "sold": return <CBadge color="info">Terjual</CBadge>;
            case "maintenance": return <CBadge color="danger">Perawatan</CBadge>;
            default: return <CBadge color="secondary">{status}</CBadge>;
        }
    };

    return (
        <AdminLayout title="Manajemen Unit (Stok)">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h2 className="h4 fw-bold mb-1">Daftar Unit Motor</h2>
                    <p className="text-body-secondary mb-0 small text-uppercase">Opsi B: Unique Unit Tracking</p>
                </div>
                <div className="d-flex gap-2">
                    <CButton color="info" variant="outline" onClick={() => setBatchModalVisible(true)}>
                        <CIcon icon={cilPlus} className="me-2" />
                        Tambah Stok (Batch)
                    </CButton>
                    <CButton color="primary" onClick={() => handleOpenModal()}>
                        <CIcon icon={cilPlus} className="me-2" />
                        Tambah Unit
                    </CButton>
                </div>
            </div>

            {/* Filter Card */}
            <CCard className="mb-4">
                <CCardBody>
                    <CRow className="g-3 align-items-end">
                        <CCol md={4}>
                            <CInputGroup>
                                <CInputGroupText><CIcon icon={cilSearch} /></CInputGroupText>
                                <CFormInput 
                                    placeholder="Cari Frame / Engine..." 
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                />
                            </CInputGroup>
                        </CCol>
                        <CCol md={3}>
                            <CFormSelect value={motorId} onChange={(e) => setMotorId(e.target.value)}>
                                <option value="">Semua Model</option>
                                {motors.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
                            </CFormSelect>
                        </CCol>
                        <CCol md={3}>
                            <CFormSelect value={status} onChange={(e) => setStatus(e.target.value)}>
                                <option value="">Semua Status</option>
                                <option value="available">Tersedia</option>
                                <option value="booked">Dipesan</option>
                                <option value="sold">Terjual</option>
                                <option value="maintenance">Perawatan</option>
                            </CFormSelect>
                        </CCol>
                        <CCol md={2}>
                            {(search || status || motorId) && (
                                <CButton color="light" onClick={resetFilters} className="w-100">
                                    <CIcon icon={cilReload} className="me-2" /> Reset
                                </CButton>
                            )}
                        </CCol>
                    </CRow>
                </CCardBody>
            </CCard>

            <CCard className="position-relative">
                {loading && (
                    <div className="position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center bg-white bg-opacity-75" style={{ zIndex: 10 }}>
                        <CSpinner color="primary" />
                    </div>
                )}
                <CCardBody className="p-0">
                    <CTable hover responsive className="mb-0">
                        <CTableHead className="bg-light">
                            <CTableRow>
                                <CTableHeaderCell>Model Motor</CTableHeaderCell>
                                <CTableHeaderCell>No. Rangka (Frame)</CTableHeaderCell>
                                <CTableHeaderCell>No. Mesin (Engine)</CTableHeaderCell>
                                <CTableHeaderCell>Warna</CTableHeaderCell>
                                <CTableHeaderCell>Status</CTableHeaderCell>
                                <CTableHeaderCell className="text-end">Aksi</CTableHeaderCell>
                            </CTableRow>
                        </CTableHead>
                        <CTableBody>
                            {localUnits && localUnits.data && localUnits.data.length > 0 ? (
                                localUnits.data.map(unit => (
                                    <CTableRow key={unit.id} className="align-middle">
                                        <CTableDataCell>
                                            <div className="fw-semibold">{unit.motor?.name}</div>
                                            <div className="small text-body-secondary">{unit.motor?.brand}</div>
                                        </CTableDataCell>
                                        <CTableDataCell><code>{unit.frame_number}</code></CTableDataCell>
                                        <CTableDataCell><code>{unit.engine_number}</code></CTableDataCell>
                                        <CTableDataCell>{unit.color || "-"}</CTableDataCell>
                                        <CTableDataCell>{getStatusBadge(unit.status)}</CTableDataCell>
                                        <CTableDataCell className="text-end">
                                            <div className="d-flex gap-1 justify-content-end">
                                                <CButton size="sm" color="warning" variant="outline" onClick={() => handleOpenModal(unit)}>
                                                    <CIcon icon={cilPencil} />
                                                </CButton>
                                                <CButton size="sm" color="danger" variant="outline" onClick={() => confirmDelete(unit)}>
                                                    <CIcon icon={cilTrash} />
                                                </CButton>
                                            </div>
                                        </CTableDataCell>
                                    </CTableRow>
                                ))
                            ) : (
                                <CTableRow>
                                    <CTableDataCell colSpan={6} className="text-center py-4">Tidak ada data unit.</CTableDataCell>
                                </CTableRow>
                            )}
                        </CTableBody>
                    </CTable>
                </CCardBody>
                {localUnits.links && localUnits.links.length > 3 && (
                    <div className="card-footer d-flex justify-content-center">
                        <CPagination>
                            {localUnits.links.map((link, i) => (
                                <CPaginationItem key={i} active={link.active} disabled={!link.url} onClick={() => link.url && fetchUnits(new URL(link.url).searchParams)}>
                                    <span dangerouslySetInnerHTML={{ __html: link.label }} />
                                </CPaginationItem>
                            ))}
                        </CPagination>
                    </div>
                )}
            </CCard>

            {/* Add/Edit Modal */}
            <CModal visible={modalVisible} onClose={() => setModalVisible(false)} size="lg">
                <CModalHeader>
                    <CModalTitle>{isEdit ? "Edit Unit Motor" : "Tambah Unit Motor Baru"}</CModalTitle>
                </CModalHeader>
                <form onSubmit={handleSubmit}>
                    <CModalBody>
                        <CRow className="g-3">
                            <CCol md={12}>
                                <CFormLabel>Model Motor</CFormLabel>
                                <CFormSelect 
                                    value={data.motor_id} 
                                    onChange={e => setData("motor_id", e.target.value)}
                                    invalid={!!errors.motor_id}
                                >
                                    <option value="">Pilih Model Motor</option>
                                    {motors.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
                                </CFormSelect>
                                <CFormFeedback invalid>{errors.motor_id}</CFormFeedback>
                            </CCol>
                            <CCol md={6}>
                                <CFormLabel>Nomor Rangka (Frame Number)</CFormLabel>
                                <CFormInput 
                                    value={data.frame_number} 
                                    onChange={e => setData("frame_number", e.target.value.toUpperCase())}
                                    invalid={!!errors.frame_number}
                                    placeholder="Contoh: MH1JM123456"
                                />
                                <CFormFeedback invalid>{errors.frame_number}</CFormFeedback>
                            </CCol>
                            <CCol md={6}>
                                <CFormLabel>Nomor Mesin (Engine Number)</CFormLabel>
                                <CFormInput 
                                    value={data.engine_number} 
                                    onChange={e => setData("engine_number", e.target.value.toUpperCase())}
                                    invalid={!!errors.engine_number}
                                    placeholder="Contoh: JM11E-123456"
                                />
                                <CFormFeedback invalid>{errors.engine_number}</CFormFeedback>
                            </CCol>
                            <CCol md={6}>
                                <CFormLabel>Warna</CFormLabel>
                                <CFormInput 
                                    value={data.color} 
                                    onChange={e => setData("color", e.target.value)}
                                    invalid={!!errors.color}
                                    placeholder="Contoh: Merah Glossy"
                                />
                                <CFormFeedback invalid>{errors.color}</CFormFeedback>
                            </CCol>
                            <CCol md={6}>
                                <CFormLabel>Status Unit</CFormLabel>
                                <CFormSelect 
                                    value={data.status} 
                                    onChange={e => setData("status", e.target.value)}
                                    invalid={!!errors.status}
                                >
                                    <option value="available">Tersedia</option>
                                    <option value="booked">Dipesan</option>
                                    <option value="sold">Terjual</option>
                                    <option value="maintenance">Perawatan</option>
                                </CFormSelect>
                                <CFormFeedback invalid>{errors.status}</CFormFeedback>
                            </CCol>
                            <CCol md={6}>
                                <CFormLabel>Tanggal Kedatangan</CFormLabel>
                                <CFormInput 
                                    type="date"
                                    value={data.arrival_date} 
                                    onChange={e => setData("arrival_date", e.target.value)}
                                    invalid={!!errors.arrival_date}
                                />
                                <CFormFeedback invalid>{errors.arrival_date}</CFormFeedback>
                            </CCol>
                            <CCol md={12}>
                                <CFormLabel>Catatan Tambahan</CFormLabel>
                                <CFormTextarea 
                                    rows={3}
                                    value={data.notes} 
                                    onChange={e => setData("notes", e.target.value)}
                                    invalid={!!errors.notes}
                                />
                                <CFormFeedback invalid>{errors.notes}</CFormFeedback>
                            </CCol>
                        </CRow>
                    </CModalBody>
                    <CModalFooter>
                        <CButton color="secondary" onClick={() => setModalVisible(false)} disabled={processing}>Batal</CButton>
                        <CButton color="primary" type="submit" disabled={processing}>
                            {processing ? "Menyimpan..." : (isEdit ? "Simpan Perubahan" : "Tambah Unit")}
                        </CButton>
                    </CModalFooter>
                </form>
            </CModal>

            {/* Batch Add Modal */}
            <CModal visible={batchModalVisible} onClose={() => setBatchModalVisible(false)} size="lg">
                <CModalHeader>
                    <CModalTitle>Tambah Stok Sekaligus (Batch)</CModalTitle>
                </CModalHeader>
                <form onSubmit={handleBatchSubmit}>
                    <CModalBody>
                        <CRow className="g-3">
                            <CCol md={8}>
                                <CFormLabel>Model Motor</CFormLabel>
                                <CFormSelect 
                                    value={batchForm.data.motor_id} 
                                    onChange={e => batchForm.setData("motor_id", e.target.value)}
                                    invalid={!!batchForm.errors.motor_id}
                                >
                                    <option value="">Pilih Model Motor</option>
                                    {motors.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
                                </CFormSelect>
                                <CFormFeedback invalid>{batchForm.errors.motor_id}</CFormFeedback>
                            </CCol>
                            <CCol md={4}>
                                <CFormLabel>Jumlah Unit (Pcs)</CFormLabel>
                                <CFormInput
                                    type="number"
                                    min="1"
                                    max="100"
                                    value={batchForm.data.quantity} 
                                    onChange={e => batchForm.setData("quantity", e.target.value)}
                                    invalid={!!batchForm.errors.quantity}
                                />
                                <CFormFeedback invalid>{batchForm.errors.quantity}</CFormFeedback>
                                <div className="small text-muted mt-1">Sistem akan generate Frame/Engine otomatis.</div>
                            </CCol>
                            <CCol md={6}>
                                <CFormLabel>Warna</CFormLabel>
                                <CFormInput 
                                    value={batchForm.data.color} 
                                    onChange={e => batchForm.setData("color", e.target.value)}
                                    invalid={!!batchForm.errors.color}
                                    placeholder="Contoh: Merah Glossy"
                                />
                                <CFormFeedback invalid>{batchForm.errors.color}</CFormFeedback>
                            </CCol>
                            <CCol md={6}>
                                <CFormLabel>Status Awal</CFormLabel>
                                <CFormSelect 
                                    value={batchForm.data.status} 
                                    onChange={e => batchForm.setData("status", e.target.value)}
                                    invalid={!!batchForm.errors.status}
                                >
                                    <option value="available">Tersedia</option>
                                    <option value="maintenance">Perawatan</option>
                                </CFormSelect>
                                <CFormFeedback invalid>{batchForm.errors.status}</CFormFeedback>
                            </CCol>
                            <CCol md={6}>
                                <CFormLabel>Tanggal Kedatangan</CFormLabel>
                                <CFormInput 
                                    type="date"
                                    value={batchForm.data.arrival_date} 
                                    onChange={e => batchForm.setData("arrival_date", e.target.value)}
                                    invalid={!!batchForm.errors.arrival_date}
                                />
                                <CFormFeedback invalid>{batchForm.errors.arrival_date}</CFormFeedback>
                            </CCol>
                            <CCol md={12}>
                                <CFormLabel>Catatan (Opsional)</CFormLabel>
                                <CFormTextarea 
                                    rows={2}
                                    value={batchForm.data.notes} 
                                    onChange={e => batchForm.setData("notes", e.target.value)}
                                    placeholder="Catatan untuk batch unit ini..."
                                />
                            </CCol>
                        </CRow>
                        <div className="mt-3">
                            <div className="alert alert-info border-0 shadow-sm d-flex align-items-center gap-3">
                                <div>
                                    <CIcon icon={cilBike} size="xl" className="text-info" />
                                </div>
                                <div className="small">
                                    <strong>Info:</strong> Fitur ini mempercepat penginputan stok. Kamu tetap bisa mengedit Nomor Rangka/Mesin asli nanti melalui daftar unit.
                                </div>
                            </div>
                        </div>
                    </CModalBody>
                    <CModalFooter>
                        <CButton color="secondary" onClick={() => setBatchModalVisible(false)} disabled={batchForm.processing}>Batal</CButton>
                        <CButton color="info" type="submit" disabled={batchForm.processing} className="text-white">
                            {batchForm.processing ? "Sedang Memproses..." : "Tambah Batch Unit Sekarang"}
                        </CButton>
                    </CModalFooter>
                </form>
            </CModal>
        </AdminLayout>
    );
}
