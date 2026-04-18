import React, { useState, useEffect } from "react";
import { Link, router } from "@inertiajs/react";
import MetronicAdminLayout from "@/Layouts/MetronicAdminLayout";
import axios from "axios";
import Modal from "@/Components/Modal";
import { toast } from "react-hot-toast";
import {
    Search,
    Trash2,
    Shield,
    User,
    RotateCcw,
    Users,
    CheckCircle,
    XCircle,
    MoreVertical,
    Loader2
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

export default function Index({ users: initialUsers, filters }) {
    const [localUsers, setLocalUsers] = useState(initialUsers);
    const [search, setSearch] = useState(filters.search || "");
    const [isFirstRender, setIsFirstRender] = useState(true);
    const [loading, setLoading] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(null); // id of user whose dropdown is open

    const fetchUsers = async (currentFilters) => {
        setLoading(true);
        try {
            const response = await axios.get(route("admin.users.index"), {
                params: currentFilters,
                headers: { "X-Requested-With": "XMLHttpRequest" },
            });
            if (response.data.users) {
                setLocalUsers(response.data.users);
            }
        } catch (error) {
            console.error("Error fetching users:", error);
        } finally {
            setLoading(false);
        }
    };

    const [modalConfig, setModalConfig] = useState({
        isOpen: false,
        type: "danger", // danger, warning, info
        title: "",
        message: "",
        confirmText: "Konfirmasi",
        onConfirm: () => {},
    });
    const [processing, setProcessing] = useState(false);

    useEffect(() => {
        if (isFirstRender) {
            setIsFirstRender(false);
            return;
        }

        const params = {};
        if (search) params.search = search;

        const delayDebounceFn = setTimeout(() => {
            const url = new URL(window.location.href);
            url.search = new URLSearchParams(params).toString();
            window.history.replaceState({}, "", url);
            fetchUsers(params);
        }, 500);

        return () => clearTimeout(delayDebounceFn);
    }, [search]);

    const confirmDelete = (user) => {
        setDropdownOpen(null);
        if (user.id === filters.current_user_id) {
            toast.error("Anda tidak dapat menghapus akun sendiri");
            return;
        }
        setModalConfig({
            isOpen: true,
            type: "danger",
            title: "Hapus Pengguna",
            message: `Apakah Anda yakin ingin menghapus akun "${user.name}"? Tindakan ini tidak dapat dibatalkan.`,
            confirmText: "Hapus",
            onConfirm: () => handleDelete(user.id),
        });
    };

    const handleDelete = (id) => {
        setProcessing(true);
        router.delete(route("admin.users.destroy", id), {
            onSuccess: () => {
                setModalConfig((prev) => ({ ...prev, isOpen: false }));
                setProcessing(false);
                toast.success("Pengguna berhasil dihapus");
            },
            onError: () => {
                setProcessing(false);
                toast.error("Gagal menghapus pengguna");
            },
        });
    };

    const confirmRoleChange = (user, newRole) => {
        setDropdownOpen(null);
        const isPromoting = newRole === "admin";
        setModalConfig({
            isOpen: true,
            type: isPromoting ? "info" : "warning",
            title: isPromoting ? "Promosikan ke Admin" : "Turunkan ke User",
            message: isPromoting
                ? `Berikan akses Administrator kepada "${user.name}"?`
                : `Cabut hak akses Administrator dari "${user.name}"?`,
            confirmText: isPromoting ? "Promosikan" : "Turunkan",
            onConfirm: () => handleRoleChange(user.id, newRole),
        });
    };

    const handleRoleChange = (id, newRole) => {
        setProcessing(true);
        router.put(
            route("admin.users.update", id),
            { role: newRole },
            {
                onSuccess: () => {
                    setModalConfig((prev) => ({ ...prev, isOpen: false }));
                    setProcessing(false);
                    toast.success(`Role berhasil diubah ke ${newRole}`);
                },
                onError: () => {
                    setProcessing(false);
                    toast.error("Gagal mengubah role");
                },
            },
        );
    };

    const handleToggleVerify = (user) => {
        setDropdownOpen(null);
        setProcessing(true);
        router.post(
            route("admin.users.toggle-verify", user.id),
            {},
            {
                preserveScroll: true,
                onSuccess: () => {
                    setProcessing(false);
                    toast.success(`Status verifikasi ${user.name} berhasil diubah`);
                },
                onError: () => {
                    setProcessing(false);
                    toast.error("Gagal mengubah status verifikasi");
                },
            }
        );
    };

    const getInitials = (name) => {
        return name ? name.split(" ").slice(0, 2).map((n) => n[0]).join("").toUpperCase() : "??";
    };

    const getAvatarColorClass = (name) => {
        const colors = [
            "bg-blue-100 text-blue-600",
            "bg-emerald-100 text-emerald-600",
            "bg-purple-100 text-purple-600",
            "bg-amber-100 text-amber-600",
            "bg-rose-100 text-rose-600",
            "bg-cyan-100 text-cyan-600",
        ];
        return colors[name.charCodeAt(0) % colors.length];
    };

    return (
        <MetronicAdminLayout title="Manajemen Pengguna">
            <Modal
                isOpen={modalConfig.isOpen}
                onClose={() => setModalConfig((prev) => ({ ...prev, isOpen: false }))}
                title={modalConfig.title}
                message={modalConfig.message}
                confirmText={modalConfig.confirmText}
                onConfirm={modalConfig.onConfirm}
                type={modalConfig.type}
                processing={processing}
            />

            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                    <h2 className="text-xl font-bold text-gray-800">Daftar Pengguna</h2>
                    <p className="text-sm text-gray-500 mt-1">Kelola akun pengguna, hak akses, dan status verifikasi</p>
                </div>
                <div className="flex items-center gap-2 bg-white border border-gray-200 shadow-sm rounded-lg px-4 py-2">
                    <Users size={18} className="text-blue-500" />
                    <span className="text-sm text-gray-500 font-medium">Total Akun:</span>
                    <span className="font-bold text-gray-800">{localUsers.total}</span>
                </div>
            </div>

            {/* Table Card */}
            <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden flex flex-col">
                
                {/* Search & Toolbar */}
                <div className="p-4 border-b border-gray-100 bg-gray-50/50 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="relative w-full sm:max-w-md">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Search size={16} className="text-gray-400" />
                        </div>
                        <input
                            type="text"
                            placeholder="Cari nama pengguna atau email..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5 transition-colors shadow-sm"
                        />
                    </div>
                    {search && (
                        <button
                            onClick={() => setSearch("")}
                            className="w-full sm:w-auto px-4 py-2.5 bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition-colors shadow-sm"
                        >
                            <RotateCcw size={16} /> Reset
                        </button>
                    )}
                </div>

                {/* Table wrapper relative for overlay */}
                <div className="relative overflow-x-auto min-h-[300px]">
                    {loading && (
                        <div className="absolute inset-0 z-10 bg-white/60 backdrop-blur-sm flex items-center justify-center">
                            <div className="flex flex-col items-center gap-2 bg-white px-6 py-4 rounded-xl shadow-lg border border-gray-100">
                                <Loader2 size={24} className="text-blue-500 animate-spin" />
                                <span className="text-sm font-medium text-gray-600">Memuat data...</span>
                            </div>
                        </div>
                    )}

                    <table className="w-full text-left border-collapse whitespace-nowrap">
                        <thead>
                            <tr className="bg-white border-b border-gray-100 text-xs font-bold uppercase tracking-widest text-gray-500">
                                <th className="px-6 py-4">Pengguna</th>
                                <th className="px-6 py-4 hidden md:table-cell">Email</th>
                                <th className="px-6 py-4">Role Akses</th>
                                <th className="px-6 py-4 hidden sm:table-cell">Status</th>
                                <th className="px-6 py-4 hidden lg:table-cell">Terdaftar</th>
                                <th className="px-6 py-4 text-center">Tindakan</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 text-sm">
                            {localUsers.data.length > 0 ? (
                                localUsers.data.map((user) => (
                                    <tr key={user.id} className="hover:bg-gray-50 transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-4">
                                                <div className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold shrink-0 overflow-hidden ${getAvatarColorClass(user.name)}`}>
                                                    {user.profile_photo_path || user.profile_photo_url ? (
                                                        <img
                                                            src={user.profile_photo_path ? (user.profile_photo_path.startsWith('http') ? user.profile_photo_path : `/storage/${user.profile_photo_path}`) : user.profile_photo_url}
                                                            alt={user.name}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    ) : (
                                                        getInitials(user.name)
                                                    )}
                                                </div>
                                                <div>
                                                    <div className="font-bold text-gray-800">{user.name}</div>
                                                    <div className="text-xs text-gray-500 font-medium md:hidden">{user.email}</div>
                                                    <div className="text-[10px] text-gray-400 mt-0.5 hidden md:block uppercase tracking-wider font-semibold">
                                                        ID: #{user.id.toString().padStart(6, "0")}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-gray-600 hidden md:table-cell font-medium">
                                            {user.email}
                                        </td>
                                        <td className="px-6 py-4">
                                            {user.role === "admin" ? (
                                                <span className="inline-flex items-center px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-widest bg-blue-50 text-blue-700 border border-blue-200">
                                                    Administrator
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-widest bg-gray-100 text-gray-600 border border-gray-200">
                                                    Pengguna
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 hidden sm:table-cell">
                                            {user.email_verified_at ? (
                                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-green-50 text-green-700">
                                                    <CheckCircle size={12} className="text-green-500" /> Terverifikasi
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-50 text-amber-700">
                                                    <XCircle size={12} className="text-amber-500" /> Belum
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-gray-500 font-medium text-xs hidden lg:table-cell">
                                            {new Date(user.created_at).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            
                                            {/* Desktop Action Buttons */}
                                            <div className="hidden md:flex justify-center gap-2 opacity-60 group-hover:opacity-100 transition-opacity">
                                                {user.role === "admin" ? (
                                                    <button onClick={() => confirmRoleChange(user, "user")} className="p-1.5 text-amber-600 hover:bg-amber-50 rounded-lg transition-colors border border-transparent hover:border-amber-200" title="Turunkan Akses">
                                                        <User size={16} />
                                                    </button>
                                                ) : (
                                                    <button onClick={() => confirmRoleChange(user, "admin")} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors border border-transparent hover:border-blue-200" title="Jadikan Admin">
                                                        <Shield size={16} />
                                                    </button>
                                                )}
                                                <button onClick={() => handleToggleVerify(user)} className={`p-1.5 rounded-lg transition-colors border border-transparent ${user.email_verified_at ? 'text-rose-600 hover:bg-rose-50 hover:border-rose-200' : 'text-green-600 hover:bg-green-50 hover:border-green-200'}`} title={user.email_verified_at ? "Batalkan Verifikasi" : "Verifikasi Manual"}>
                                                    {user.email_verified_at ? <XCircle size={16} /> : <CheckCircle size={16} />}
                                                </button>
                                                <button onClick={() => confirmDelete(user)} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors border border-transparent hover:border-red-200" title="Hapus Pengguna">
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>

                                            {/* Mobile Dropdown Menu */}
                                            <div className="relative md:hidden inline-block text-left">
                                                <button onClick={() => setDropdownOpen(dropdownOpen === user.id ? null : user.id)} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 border border-gray-200 rounded-lg focus:outline-none">
                                                    <MoreVertical size={16} />
                                                </button>
                                                <AnimatePresence>
                                                    {dropdownOpen === user.id && (
                                                        <>
                                                            <div className="fixed inset-0 z-30" onClick={() => setDropdownOpen(null)}></div>
                                                            <motion.div 
                                                                initial={{ opacity: 0, scale: 0.95 }}
                                                                animate={{ opacity: 1, scale: 1 }}
                                                                exit={{ opacity: 0, scale: 0.95 }}
                                                                className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 z-40 origin-top-right py-1"
                                                            >
                                                                <button onClick={() => confirmRoleChange(user, user.role === 'admin' ? 'user' : 'admin')} className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2">
                                                                    {user.role === 'admin' ? <User size={14} className="text-amber-500" /> : <Shield size={14} className="text-blue-500" />} 
                                                                    {user.role === 'admin' ? "Turunkan Akses" : "Jadikan Admin"}
                                                                </button>
                                                                <button onClick={() => handleToggleVerify(user)} className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2">
                                                                    {user.email_verified_at ? <XCircle size={14} className="text-rose-500" /> : <CheckCircle size={14} className="text-green-500" />} 
                                                                    {user.email_verified_at ? "Batal Verifikasi" : "Verifikasi Manual"}
                                                                </button>
                                                                <div className="h-px bg-gray-100 my-1"></div>
                                                                <button onClick={() => confirmDelete(user)} className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2">
                                                                    <Trash2 size={14} /> Hapus Pengguna
                                                                </button>
                                                            </motion.div>
                                                        </>
                                                    )}
                                                </AnimatePresence>
                                            </div>

                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center text-gray-400 bg-gray-50/30">
                                        <div className="flex flex-col items-center justify-center gap-2">
                                            <Users size={32} className="text-gray-300" />
                                            <span>Tidak ada data pengguna ditemukan.</span>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {localUsers.links.length > 3 && (
                    <div className="p-4 border-t border-gray-100 bg-gray-50/30 flex justify-center sm:justify-start">
                        <nav className="flex items-center gap-1">
                            {localUsers.links.map((link, index) => {
                                if (!link.url && !link.label) return null;
                                return (
                                    link.url ? (
                                        <Link 
                                            key={index} 
                                            href={link.url}
                                            className={`min-w-[32px] h-8 flex items-center justify-center px-2 rounded-lg text-sm font-medium transition-colors border ${link.active ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50 hover:text-blue-600'}`}
                                            dangerouslySetInnerHTML={{ __html: link.label }}
                                        />
                                    ) : (
                                        <span 
                                            key={index} 
                                            className="min-w-[32px] h-8 flex items-center justify-center px-2 rounded-lg text-sm font-medium bg-gray-50 text-gray-400 border border-gray-100 cursor-not-allowed"
                                            dangerouslySetInnerHTML={{ __html: link.label }}
                                        />
                                    )
                                );
                            })}
                        </nav>
                    </div>
                )}
            </div>
        </MetronicAdminLayout>
    );
}
