import React from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from "recharts";

const formatCurrency = (value) => 
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);

const formatCompactNumber = (number) => {
  if (number < 1000) {
    return number;
  } else if (number >= 1000 && number < 1_000_000) {
    return (number / 1000).toFixed(1) + "K";
  } else if (number >= 1_000_000 && number < 1_000_000_000) {
    return (number / 1_000_000).toFixed(1) + "M";
  } else if (number >= 1_000_000_000 && number < 1_000_000_000_000) {
    return (number / 1_000_000_000).toFixed(1) + "B";
  } else if (number >= 1_000_000_000_000 && number < 1_000_000_000_000_000) {
    return (number / 1_000_000_000_000).toFixed(1) + "T";
  }
};

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border text-sm border-gray-200 shadow-xl rounded-xl p-4">
        <p className="font-bold text-gray-800 mb-1">{label}</p>
        <p className="text-blue-600 font-black text-lg">
          {formatCurrency(payload[0].value)}
        </p>
      </div>
    );
  }
  return null;
};

export function RevenueChart({ data }) {
  if (!data || data.length === 0) {
    return (
      <div className="flex h-full items-center justify-center text-gray-400 text-sm">
        Data tren pendapatan belum tersedia.
      </div>
    );
  }

  const chartData = data.map((d) => ({
    name: d.month || d.label || "",
    total: Number(d.total || d.revenue || d.amount || 0),
  }));

  return (
    <div style={{ width: "100%", height: "100%", minHeight: "320px" }}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={chartData}
          margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
        >
          <defs>
            <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
          <XAxis 
            dataKey="name" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: "#64748b", fontSize: 12, fontWeight: 500 }}
            dy={10}
          />
          <YAxis 
            axisLine={false} 
            tickLine={false}
            tickFormatter={(value) => `Rp ${formatCompactNumber(value)}`}
            tick={{ fill: "#64748b", fontSize: 12, fontWeight: 500 }}
            dx={-10}
          />
          <Tooltip content={<CustomTooltip />} />
          <Area
            type="monotone"
            dataKey="total"
            stroke="#2563eb"
            strokeWidth={3}
            fillOpacity={1}
            fill="url(#colorRevenue)"
            activeDot={{ r: 6, strokeWidth: 0, fill: "#2563eb" }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

export function StatusPieChart({ data }) {
  if (!data || data.length === 0) {
    return (
      <div className="flex h-full items-center justify-center text-gray-400 text-sm">
        Inventaris kosong.
      </div>
    );
  }

  const chartData = data.map((d) => ({
    name: (d.status || d.label || "").replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase()),
    value: Number(d.count || d.total || 0),
  }));

  // Metronic inspired colors
  const COLORS = [
    "#3b82f6", // blue-500
    "#10b981", // emerald-500
    "#f59e0b", // amber-500
    "#8b5cf6", // violet-500
    "#ec4899", // pink-500
    "#ef4444", // red-500
    "#06b6d4", // cyan-500
    "#64748b", // slate-500
  ];

  return (
    <div style={{ width: "100%", height: "100%", minHeight: "250px" }}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={85}
            paddingAngle={5}
            dataKey="value"
            stroke="none"
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip 
             contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)' }}
             itemStyle={{ fontWeight: 'bold' }}
          />
          <Legend 
            verticalAlign="bottom" 
            height={36} 
            iconType="circle"
            formatter={(value) => <span className="text-gray-600 font-medium text-xs">{value}</span>}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
