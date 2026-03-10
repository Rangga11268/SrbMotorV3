import React from "react";
import { Head, Link } from "@inertiajs/react";
import AdminLayout from "@/Layouts/AdminLayout";
import {
    CCard,
    CCardBody,
    CCardHeader,
    CCol,
    CRow,
    CBadge,
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
import { cilArrowLeft } from "@coreui/icons";

export default function NewsShow({ post }) {
    const formatDate = (date) => {
        return new Date(date).toLocaleDateString("id-ID", {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const getStatusBadge = (status) => {
        switch (status) {
            case "published":
                return <CBadge color="success">Dipublikasi</CBadge>;
            case "draft":
                return <CBadge color="warning">Draft</CBadge>;
            case "archived":
                return <CBadge color="secondary">Diarsip</CBadge>;
            default:
                return <CBadge color="info">{status}</CBadge>;
        }
    };

    return (
        <AdminLayout>
            <Head title={post.title} />
            <CRow>
                <CCol xs={12}>
                    <div className="mb-3">
                        <Link
                            href={route("admin.news.index")}
                            className="btn btn-sm btn-secondary"
                        >
                            <CIcon icon={cilArrowLeft} className="me-2" />
                            Kembali ke Daftar
                        </Link>
                    </div>

                    <CCard className="mb-4 shadow-sm">
                        <CCardHeader className="bg-white py-3">
                            <div className="d-flex justify-content-between align-items-start">
                                <div>
                                    <h3 className="mb-2">{post.title}</h3>
                                    <div className="d-flex gap-2 align-items-center">
                                        <small className="text-muted">
                                            Kategori:{" "}
                                            <strong>
                                                {post.category?.name}
                                            </strong>
                                        </small>
                                        <span className="text-muted">•</span>
                                        <small className="text-muted">
                                            Status: {getStatusBadge(post.status)}
                                        </small>
                                    </div>
                                </div>
                            </div>
                        </CCardHeader>

                        <CCardBody>
                            {/* Metadata */}
                            <div className="bg-light p-3 rounded-3 mb-4 border">
                                <div className="row">
                                    <div className="col-md-3">
                                        <small className="text-muted d-block">
                                            Diterbitkan
                                        </small>
                                        <strong className="small">
                                            {post.published_at
                                                ? formatDate(post.published_at)
                                                : "Belum diterbitkan"}
                                        </strong>
                                    </div>
                                    <div className="col-md-3">
                                        <small className="text-muted d-block">
                                            Views
                                        </small>
                                        <strong className="small">
                                            {post.views} kali
                                        </strong>
                                    </div>
                                    <div className="col-md-3">
                                        <small className="text-muted d-block">
                                            Slug
                                        </small>
                                        <code className="small">
                                            {post.slug}
                                        </code>
                                    </div>
                                    <div className="col-md-3">
                                        <small className="text-muted d-block">
                                            Dibuat
                                        </small>
                                        <strong className="small">
                                            {formatDate(post.created_at)}
                                        </strong>
                                    </div>
                                </div>
                            </div>

                            {/* Featured Image */}
                            {post.featured_image && (
                                <div className="mb-4">
                                    <h6 className="mb-2">Gambar Unggulan</h6>
                                    <img
                                        src={post.featured_image}
                                        alt={post.title}
                                        style={{
                                            maxWidth: "100%",
                                            maxHeight: "400px",
                                            objectFit: "cover",
                                            borderRadius: "8px",
                                        }}
                                    />
                                </div>
                            )}

                            {/* Excerpt */}
                            {post.excerpt && (
                                <div className="mb-4">
                                    <h6 className="mb-2">Ringkasan (Excerpt)</h6>
                                    <p className="text-muted border-start border-3 border-primary ps-3 py-2 mb-0">
                                        {post.excerpt}
                                    </p>
                                </div>
                            )}

                            {/* Content */}
                            <div className="mb-4">
                                <h6 className="mb-3">Konten Artikel</h6>
                                <div
                                    className="text-dark lh-lg"
                                    style={{
                                        lineHeight: "1.8",
                                        fontSize: "1rem",
                                    }}
                                    dangerouslySetInnerHTML={{
                                        __html: post.content,
                                    }}
                                />
                            </div>
                        </CCardBody>
                    </CCard>
                </CCol>
            </CRow>
        </AdminLayout>
    );
}
