import React from "react";
import { Head, Link, useForm } from "@inertiajs/react";
import AdminLayout from "@/Layouts/AdminLayout";
import {
    CCard,
    CCardBody,
    CCardHeader,
    CCol,
    CRow,
    CForm,
    CFormLabel,
    CFormInput,
    CFormSelect,
    CButton,
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
import { cilArrowLeft, cilSave } from "@coreui/icons";

export default function Edit({ scheme, motors, providers }) {
    const { data, setData, put, processing, errors } = useForm({
        motor_id: scheme.motor_id || "",
        provider_id: scheme.provider_id || "",
        tenor: scheme.tenor || "",
        dp_amount: scheme.dp_amount || "",
        monthly_installment: scheme.monthly_installment || "",
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        put(route("admin.financing-schemes.update", scheme.id));
    };

    return (
        <AdminLayout>
            <Head title="Edit Skema Cicilan" />
            <CRow>
                <CCol md={8}>
                    <CCard className="mb-4 shadow-sm">
                        <CCardHeader className="bg-white py-3">
                            <div className="d-flex justify-content-between align-items-center">
                                <h5 className="mb-0">Edit Skema Cicilan</h5>
                                <Link
                                    href={route(
                                        "admin.financing-schemes.index",
                                    )}
                                >
                                    <CButton
                                        color="secondary"
                                        variant="outline"
                                        size="sm"
                                    >
                                        <CIcon
                                            icon={cilArrowLeft}
                                            className="me-2"
                                        />
                                        Kembali
                                    </CButton>
                                </Link>
                            </div>
                        </CCardHeader>
                        <CCardBody className="p-4">
                            <CForm onSubmit={handleSubmit}>
                                <div className="mb-4">
                                    <CFormLabel className="font-weight-bold">
                                        Pilih Motor
                                    </CFormLabel>
                                    <CFormSelect
                                        value={data.motor_id}
                                        onChange={(e) =>
                                            setData("motor_id", e.target.value)
                                        }
                                        invalid={!!errors.motor_id}
                                    >
                                        <option value="">
                                            -- Pilih Motor --
                                        </option>
                                        {motors.map((motor) => (
                                            <option
                                                key={motor.id}
                                                value={motor.id}
                                            >
                                                {motor.name}
                                            </option>
                                        ))}
                                    </CFormSelect>
                                    {errors.motor_id && (
                                        <div className="text-danger small mt-1">
                                            {errors.motor_id}
                                        </div>
                                    )}
                                </div>

                                <div className="mb-4">
                                    <CFormLabel className="font-weight-bold">
                                        Leasing Provider
                                    </CFormLabel>
                                    <CFormSelect
                                        value={data.provider_id}
                                        onChange={(e) =>
                                            setData(
                                                "provider_id",
                                                e.target.value,
                                            )
                                        }
                                        invalid={!!errors.provider_id}
                                    >
                                        <option value="">
                                            -- Pilih Provider --
                                        </option>
                                        {providers.map((provider) => (
                                            <option
                                                key={provider.id}
                                                value={provider.id}
                                            >
                                                {provider.name}
                                            </option>
                                        ))}
                                    </CFormSelect>
                                    {errors.provider_id && (
                                        <div className="text-danger small mt-1">
                                            {errors.provider_id}
                                        </div>
                                    )}
                                </div>

                                <CRow className="mb-4">
                                    <CCol md={4}>
                                        <CFormLabel className="font-weight-bold">
                                            Tenor (Bulan)
                                        </CFormLabel>
                                        <CFormInput
                                            type="number"
                                            value={data.tenor}
                                            onChange={(e) =>
                                                setData("tenor", e.target.value)
                                            }
                                            placeholder="11, 23, 35, dll"
                                            invalid={!!errors.tenor}
                                        />
                                        {errors.tenor && (
                                            <div className="text-danger small mt-1">
                                                {errors.tenor}
                                            </div>
                                        )}
                                    </CCol>
                                    <CCol md={4}>
                                        <CFormLabel className="font-weight-bold">
                                            Uang Muka (DP)
                                        </CFormLabel>
                                        <CFormInput
                                            type="number"
                                            value={data.dp_amount}
                                            onChange={(e) =>
                                                setData(
                                                    "dp_amount",
                                                    e.target.value,
                                                )
                                            }
                                            placeholder="5000000"
                                            invalid={!!errors.dp_amount}
                                        />
                                        {errors.dp_amount && (
                                            <div className="text-danger small mt-1">
                                                {errors.dp_amount}
                                            </div>
                                        )}
                                    </CCol>
                                    <CCol md={4}>
                                        <CFormLabel className="font-weight-bold">
                                            Cicilan / Bulan
                                        </CFormLabel>
                                        <CFormInput
                                            type="number"
                                            value={data.monthly_installment}
                                            onChange={(e) =>
                                                setData(
                                                    "monthly_installment",
                                                    e.target.value,
                                                )
                                            }
                                            placeholder="1200000"
                                            invalid={
                                                !!errors.monthly_installment
                                            }
                                        />
                                        {errors.monthly_installment && (
                                            <div className="text-danger small mt-1">
                                                {errors.monthly_installment}
                                            </div>
                                        )}
                                    </CCol>
                                </CRow>

                                <div className="d-grid mt-4">
                                    <CButton
                                        color="primary"
                                        type="submit"
                                        disabled={processing}
                                        size="lg"
                                    >
                                        <CIcon
                                            icon={cilSave}
                                            className="me-2"
                                        />
                                        Perbarui Skema
                                    </CButton>
                                </div>
                            </CForm>
                        </CCardBody>
                    </CCard>
                </CCol>
            </CRow>
        </AdminLayout>
    );
}
