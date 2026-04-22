import React, { useState, useEffect } from "react";
import { MapPin, Phone, Check, Wrench } from "lucide-react";

export default function BranchSelector({
    motorId,
    selectedBranch,
    onBranchSelect,
    className = "",
    showOnlyWithStock = true,
    showServiceOnly = false,
}) {
    const [branches, setBranches] = useState([]);
    const [loading, setLoading] = useState(true);
    const [findingNearest, setFindingNearest] = useState(false);
    const [error, setError] = useState(null);
    const [stockInfo, setStockInfo] = useState({});

    useEffect(() => {
        fetchData();
    }, [motorId]);

    const fetchData = async () => {
        try {
            setLoading(true);
            const url = motorId 
                ? `/api/branches?motor_id=${motorId}` 
                : "/api/branches";

            const response = await fetch(url);
            const data = await response.json();

            if (data.success) {
                const branchList = data.branches || data.data || [];
                setBranches(branchList);
                
                // If stock info was returned in the unified response, store it
                if (data.stock) {
                    setStockInfo(data.stock);
                }
            }
        } catch (err) {
            console.error("Error fetching data:", err);
            setError("Gagal mengambil data cabang");
        } finally {
            setLoading(false);
        }
    };

    const findNearestBranch = () => {
        if (!navigator.geolocation) {
            setError("Browser Anda tidak mendukung GPS");
            return;
        }

        setFindingNearest(true);
        setError(null);

        navigator.geolocation.getCurrentPosition(
            async (position) => {
                try {
                    const { latitude, longitude } = position.coords;

                    const url = motorId
                        ? `/api/motors/${motorId}/available-branches?latitude=${latitude}&longitude=${longitude}&limit=10`
                        : `/api/branches/with-distance?latitude=${latitude}&longitude=${longitude}`;

                    const response = await fetch(url);
                    const data = await response.json();

                    if (data.success) {
                        let branchList = data.branches || data.data || [];

                        if (showServiceOnly) {
                            branchList = branchList.filter(
                                (b) => b.can_service,
                            );
                        }

                        setBranches(branchList);

                        if (branchList.length > 0) {
                            const nearest = branchList[0];
                            onBranchSelect(nearest.code);
                        }
                    }
                } catch (err) {
                    console.error("Error finding nearest:", err);
                    setError("Gagal menemukan cabang terdekat");
                } finally {
                    setFindingNearest(false);
                }
            },
            (err) => {
                setFindingNearest(false);
                setError(
                    "Tidak dapat mengakses lokasi Anda. Pastikan GPS aktif.",
                );
                console.error("Geolocation error:", err);
            },
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 0,
            },
        );
    };

    if (loading) {
        return (
            <div className={`py-12 ${className} flex flex-col items-center justify-center animate-pulse`}>
                <div className="relative">
                    <div className="w-12 h-12 border-4 border-gray-800 rounded-none"></div>
                    <div className="absolute inset-0 w-12 h-12 border-4 border-[#1c69d4] border-t-transparent animate-spin rounded-none"></div>
                </div>
                <p className="mt-6 text-[10px] font-black text-[#1c69d4] uppercase tracking-[0.3em] animate-bounce">
                    SINCRONIZING DATA...
                </p>
            </div>
        );
    }

    // Show all branches, but sort by stock availability
    const filteredBranches = branches
        .filter((branch) => {
            if (showOnlyWithStock && motorId) {
                const info = stockInfo[branch.code];
                // Hide if we have stock info and available is false
                if (info && info.available === false) {
                    return false;
                }
            }
            return true;
        })
        .sort((a, b) => {
        if (!motorId) return 0;
        const aHasStock = stockInfo[a.code]?.available !== false;
        const bHasStock = stockInfo[b.code]?.available !== false;
        if (aHasStock && !bHasStock) return -1;
        if (!aHasStock && bHasStock) return 1;
        return 0;
    });

    return (
        <div className={className}>
            {/* Find Nearest Button */}
            <button
                type="button"
                onClick={findNearestBranch}
                disabled={findingNearest}
                className="w-full bg-white text-black font-bold text-[11px] uppercase tracking-[0.15em] py-3 px-4 rounded-none hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mb-4"
            >
                <MapPin size={14} />
                {findingNearest ? "MENCARI LOKASI..." : "CARI CABANG TERDEKAT"}
            </button>

            {/* Error Message */}
            {error && (
                <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-none">
                    <p className="text-[10px] font-bold text-red-800 uppercase tracking-widest">
                        {error}
                    </p>
                </div>
            )}

            {/* Branch List */}
            <div className="space-y-3 max-h-96 overflow-y-auto">
                {filteredBranches.length === 0 ? (
                    <div className="text-center py-12 bg-gray-50 rounded-none border border-gray-200">
                        <MapPin
                            size={32}
                            className="text-gray-400 mx-auto mb-3"
                        />
                        <p className="text-[11px] font-bold text-gray-600 uppercase tracking-widest">
                            BELUM ADA CABANG TERDAFTAR
                        </p>
                    </div>
                ) : (
                    filteredBranches.map((branch) => (
                        <BranchCard
                            key={branch.code}
                            branch={branch}
                            isSelected={selectedBranch === branch.code}
                            onSelect={() => onBranchSelect(branch.code)}
                            stockInfo={stockInfo[branch.code]}
                            motorId={motorId}
                        />
                    ))
                )}
            </div>
        </div>
    );
}

function BranchCard({ branch, isSelected, onSelect, stockInfo, motorId }) {
    const hasStock = stockInfo?.available !== false;
    const stockCount = stockInfo?.stock_count;

    return (
        <button
            type="button"
            onClick={onSelect}
            className={`w-full text-left p-4 border-2 rounded-none transition-all ${
                isSelected
                    ? "border-black bg-black text-white"
                    : "border-gray-200 hover:border-gray-400 bg-white"
            }`}
        >
            {/* Branch Name & Badges */}
            <div className="flex items-start justify-between gap-2 mb-3">
                <div className="flex-1">
                    <h4
                        className={`text-sm font-black uppercase tracking-tight mb-1 ${
                            isSelected ? "text-white" : "text-black"
                        }`}
                    >
                        {branch.name}
                    </h4>

                    <div className="flex flex-wrap gap-1 mt-2">
                        {branch.can_service && (
                            <span
                                className={`inline-flex items-center gap-1 text-[9px] font-bold uppercase tracking-widest px-2 py-1 rounded-none ${
                                    isSelected
                                        ? "bg-white text-black"
                                        : "bg-green-100 text-green-800"
                                }`}
                            >
                                <Wrench size={10} />
                                SERVIS
                            </span>
                        )}
                        {branch.distance !== undefined && (
                            <span
                                className={`inline-flex items-center gap-1 text-[9px] font-bold uppercase tracking-widest px-2 py-1 rounded-none ${
                                    isSelected
                                        ? "bg-white text-black"
                                        : "bg-blue-100 text-blue-800"
                                }`}
                            >
                                <MapPin size={10} />
                                {branch.distance.toFixed(1)} KM
                            </span>
                        )}
                    </div>
                </div>

                {/* Selection Indicator */}
                <div
                    className={`flex-shrink-0 w-5 h-5 border-2 rounded-none flex items-center justify-center ${
                        isSelected ? "border-white bg-white" : "border-gray-300"
                    }`}
                >
                    {isSelected && <Check size={14} className="text-black" />}
                </div>
            </div>

            {/* Address */}
            <div
                className={`flex items-start gap-2 mb-2 text-[10px] font-bold uppercase tracking-widest ${
                    isSelected ? "text-gray-300" : "text-gray-600"
                }`}
            >
                <MapPin size={12} className="flex-shrink-0 mt-0.5" />
                <span className="line-clamp-2">{branch.address}</span>
            </div>

            {/* Phone */}
            {branch.phone && (
                <div
                    className={`flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest ${
                        isSelected ? "text-gray-300" : "text-gray-600"
                    }`}
                >
                    <Phone size={12} className="flex-shrink-0" />
                    <span>{branch.phone}</span>
                </div>
            )}

            {/* Stock Info */}
            {motorId && (
                <div className="mt-3 pt-3 border-t border-gray-300">
                    {stockInfo && stockInfo.available !== false ? (
                        <div
                            className={`flex items-center gap-2 text-[9px] font-black uppercase tracking-widest ${
                                isSelected ? "text-green-300" : "text-green-700"
                            }`}
                        >
                            <Check size={12} />
                            STOCK TERSEDIA{" "}
                            {stockCount > 0 && `(${stockCount} UNIT)`}
                        </div>
                    ) : stockInfo ? (
                        <div
                            className={`flex items-center gap-2 text-[9px] font-black uppercase tracking-widest ${
                                isSelected ? "text-gray-400" : "text-gray-500"
                            }`}
                        >
                            <span className="w-3 h-3 flex items-center justify-center text-[10px]">
                                ⚠
                            </span>
                            PERLU CEK KETERSEDIAAN
                        </div>
                    ) : (
                        <div
                            className={`flex items-center gap-2 text-[9px] font-black uppercase tracking-widest ${
                                isSelected ? "text-gray-400" : "text-gray-500"
                            }`}
                        >
                            <span className="w-3 h-3 flex items-center justify-center text-[10px]">
                                ⓘ
                            </span>
                            CEK KETERSEDIAAN SAAT PEMESANAN
                        </div>
                    )}
                </div>
            )}
        </button>
    );
}
