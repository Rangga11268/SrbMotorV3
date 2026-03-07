import React from "react";
import { CChart } from "@coreui/react-chartjs";

export function RevenueChart({ data }) {
    if (!data || data.length === 0) {
        return (
            <div className="d-flex align-items-center justify-content-center py-5 text-body-tertiary">
                Belum ada data revenue.
            </div>
        );
    }

    const labels = data.map((d) => d.month || d.label || "");
    const values = data.map((d) => d.total || d.revenue || d.amount || 0);

    return (
        <CChart
            type="bar"
            data={{
                labels,
                datasets: [
                    {
                        label: "Revenue (Rp)",
                        backgroundColor: "rgba(37, 99, 235, 0.2)",
                        borderColor: "rgba(37, 99, 235, 1)",
                        borderWidth: 2,
                        data: values,
                        borderRadius: 6,
                    },
                ],
            }}
            options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        callbacks: {
                            label: (ctx) =>
                                `Rp ${new Intl.NumberFormat("id-ID").format(ctx.raw)}`,
                        },
                    },
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: (v) =>
                                `Rp ${new Intl.NumberFormat("id-ID", { notation: "compact" }).format(v)}`,
                        },
                    },
                },
            }}
            style={{ height: 280 }}
        />
    );
}

export function StatusPieChart({ data }) {
    if (!data || data.length === 0) {
        return (
            <div className="d-flex align-items-center justify-content-center py-5 text-body-tertiary">
                Belum ada data status.
            </div>
        );
    }

    const labels = data.map((d) =>
        (d.status || d.label || "")
            .replace(/_/g, " ")
            .replace(/\b\w/g, (l) => l.toUpperCase()),
    );
    const values = data.map((d) => d.count || d.total || 0);

    const colors = [
        "#2563eb",
        "#16a34a",
        "#f59e0b",
        "#ef4444",
        "#8b5cf6",
        "#06b6d4",
        "#ec4899",
        "#64748b",
    ];

    return (
        <CChart
            type="doughnut"
            data={{
                labels,
                datasets: [
                    {
                        data: values,
                        backgroundColor: colors.slice(0, values.length),
                        borderWidth: 0,
                    },
                ],
            }}
            options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: "bottom",
                        labels: { padding: 16, usePointStyle: true },
                    },
                },
                cutout: "60%",
            }}
            style={{ height: 280 }}
        />
    );
}
