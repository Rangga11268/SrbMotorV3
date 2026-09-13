<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
    <title>Laporan - {{ $report['title'] }}</title>
    
    <style>
        @page {
            margin: 0cm;
        }
        
        body {
            font-family: 'Helvetica', 'Arial', sans-serif;
            font-size: 10pt;
            color: #1e293b; /* Slate 800 */
            background-color: #ffffff;
            margin-top: 3.5cm; /* Space for fixed header */
            margin-bottom: 2cm; /* Space for fixed footer */
            margin-left: 1.5cm;
            margin-right: 1.5cm;
        }

        /* --- Color Variables (Simulated for CSS 2.1) --- */
        /* Primary: #0f172a (Slate 900) */
        /* Accent: #ea580c (Orange 600) or #2563eb (Blue 600) based on context */
        /* Surface: #f8fafc (Slate 50) */

        /* --- Header --- */
        header {
            position: fixed;
            top: 0cm;
            left: 0cm;
            right: 0cm;
            height: 3cm;
            background-color: #0f172a; /* Dark Slate background */
            color: white;
            padding: 0 1.5cm;
            vertical-align: middle;
            border-bottom: 4px solid #f59e0b; /* Amber/Gold Accent strip */
        }
        
        .header-table {
            width: 100%;
            height: 100%;
            border-collapse: collapse;
        }
        
        .header-logo-cell {
            vertical-align: middle;
            width: 80px;
        }
        
        .header-title-cell {
            vertical-align: middle;
            padding-left: 15px;
        }
        
        .header-meta-cell {
            vertical-align: middle;
            text-align: right;
        }

        .logo {
            height: 50px;
            width: auto;
        }
        
        .brand-name {
            font-size: 16pt;
            font-weight: 800;
            letter-spacing: 1px;
            text-transform: uppercase;
            display: block;
            margin-bottom: 2px;
        }
        
        .brand-sub {
            font-size: 8pt;
            color: #94a3b8; /* Slate 400 */
            letter-spacing: 0.5px;
            text-transform: uppercase;
        }

        .report-badge {
            display: inline-block;
            background-color: rgba(255,255,255,0.1);
            color: #f1f5f9;
            padding: 8px 16px;
            border-radius: 4px;
            font-size: 10pt;
            font-weight: bold;
            border: 1px solid rgba(255,255,255,0.2);
            text-transform: uppercase;
        }

        /* --- Footer --- */
        footer {
            position: fixed; 
            bottom: 0cm; 
            left: 0cm; 
            right: 0cm;
            height: 1.2cm;
            background-color: #f1f5f9;
            color: #64748b;
            line-height: 1.2cm;
            font-size: 8pt;
            padding: 0 1.5cm;
            border-top: 1px solid #cbd5e1;
        }

        .footer-table {
            width: 100%;
        }
        
        .page-number:after {
            content: counter(page);
        }

        /* --- Typography & Utilities --- */
        h1 {
            font-size: 18pt;
            font-weight: 800;
            color: #0f172a;
            margin: 0 0 5px 0;
            letter-spacing: -0.5px;
        }
        
        h2 {
            font-size: 10pt;
            font-weight: 500;
            color: #64748b;
            margin: 0 0 25px 0;
        }

        h3 {
            font-size: 11pt;
            font-weight: 700;
            color: #0f172a;
            margin: 25px 0 10px 0;
            padding-bottom: 8px;
            border-bottom: 2px solid #e2e8f0;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }

        .text-right { text-align: right; }
        .text-center { text-align: center; }
        .text-success { color: #16a34a; }
        .text-danger { color: #dc2626; }
        .text-warning { color: #d97706; }
        .font-bold { font-weight: bold; }
        
        /* --- Info Cards --- */
        .info-table {
            width: 100%;
            margin-bottom: 30px;
            border-collapse: separate;
            border-spacing: 12px;
            margin-left: -12px; /* Offset spacing */
            margin-right: -12px;
        }
        
        .info-card {
            background-color: #f8fafc;
            border: 1px solid #e2e8f0;
            padding: 15px;
            border-radius: 6px;
        }
        
        .info-label {
            font-size: 8pt;
            text-transform: uppercase;
            color: #64748b;
            font-weight: 600;
            letter-spacing: 0.5px;
            margin-bottom: 8px;
            display: block;
        }
        
        .info-value {
            font-size: 16pt;
            font-weight: 800;
            color: #0f172a;
            display: block;
        }
        
        .info-sub {
            font-size: 8pt;
            margin-top: 4px;
            color: #475569;
        }

        /* --- Meta Data Box --- */
        .meta-box {
            background-color: #eff6ff; /* Blue 50 */
            border: 1px solid #bfdbfe;
            color: #1e3a8a;
            padding: 12px 15px;
            border-radius: 6px;
            margin-bottom: 25px;
            font-size: 9pt;
        }
        
        .meta-box table { width: 100%; }
        .meta-box td { vertical-align: top; padding: 2px 0; }
        .meta-key { width: 120px; font-weight: bold; }

        /* --- Data Tables --- */
        table.data-table {
            width: 100%;
            border-collapse: collapse;
            font-size: 9pt;
            margin-top: 10px;
        }
        
        table.data-table th {
            background-color: #f1f5f9;
            color: #334155;
            font-weight: 700;
            text-transform: uppercase;
            font-size: 7.5pt;
            letter-spacing: 0.5px;
            padding: 10px 8px;
            border-bottom: 2px solid #cbd5e1;
            text-align: left;
        }
        
        table.data-table td {
            padding: 10px 8px;
            border-bottom: 1px solid #e2e8f0;
            vertical-align: top;
        }
        
        table.data-table tr:last-child td {
            border-bottom: none;
        }

        table.data-table tr.total-row td {
            background-color: #f8fafc;
            font-weight: bold;
            border-top: 2px solid #cbd5e1;
            border-bottom: none;
        }
        
        .badge {
            padding: 4px 8px;
            border-radius: 4px;
            color: white;
            font-size: 7pt;
            font-weight: bold;
            text-transform: uppercase;
            display: inline-block;
        }
    </style>
</head>
<body>
    <header>
        <table class="header-table">
            <tr>
                <td class="header-logo-cell">
                    {{-- Logo --}}
                    <img src="{{ public_path('assets/icon/logo.png') }}" class="logo" alt="SRB">
                </td>
                <td class="header-title-cell">
                    <span class="brand-name">SRB Motor</span>
                    <span class="brand-sub">Trusted Dealer & Service</span>
                </td>
                <td class="header-meta-cell">
                    <span class="report-badge">
                        {{  
                            $report['type'] === 'income' ? 'Laporan Pendapatan' : 
                            ($report['type'] === 'sales' ? 'Laporan Penjualan' : 
                            ($report['type'] === 'customer' ? 'Laporan Pelanggan' : 'Status Transaksi'))
                        }}
                    </span>
                </td>
            </tr>
        </table>
    </header>

    <footer>
        <table class="footer-table">
            <tr>
                <td style="text-align: left;">
                    SRB Motor &copy; {{ date('Y') }} &bull; Confidential Report
                </td>
                <td style="text-align: right;">
                    Halaman <span class="page-number"></span>
                </td>
            </tr>
        </table>
    </footer>

    <main>
        {{-- Title Section --}}
        <h1>Ringkasan Eksekutif</h1>
        <h2>Periode Laporan: {{ $report['start_date'] }} s/d {{ $report['end_date'] }}</h2>

        {{-- Meta Summary Box --}}
        <div class="meta-box">
            <table>
                <tr>
                    <td class="meta-key">Dibuat Pada:</td>
                    <td>{{ now()->translatedFormat('d F Y, H:i') }} WIB</td>
                </tr>
                <tr>
                    <td class="meta-key">Oleh:</td>
                    <td>Administrator</td>
                </tr>
                <tr>
                    <td class="meta-key">Total Records:</td>
                    <td>
                        @if($report['type'] === 'sales' || $report['type'] === 'status')
                            {{ $report['data']['total_transactions'] ?? 0 }} Data Transaksi
                        @elseif($report['type'] === 'customer')
                            {{ $report['data']['total_customers'] ?? 0 }} Data Pelanggan
                        @else
                           -
                        @endif
                    </td>
                </tr>
            </table>
        </div>

        {{-- Dynamic Summary Cards --}}
        @if($report['type'] === 'sales')
            <table class="info-table">
                <tr>
                    <td style="width: 33.33%">
                        <div class="info-card">
                            <span class="info-label">Total Revenue</span>
                            <span class="info-value text-success">
                                Rp {{ number_format($report['data']['total_revenue'] ?? 0, 0, ',', '.') }}
                            </span>
                        </div>
                    </td>
                    <td style="width: 33.33%">
                        <div class="info-card">
                            <span class="info-label">Total Transaksi</span>
                            <span class="info-value">
                                {{ $report['data']['total_transactions'] ?? 0 }}
                            </span>
                            <span class="info-sub">Unit Terjual</span>
                        </div>
                    </td>
                    <td style="width: 33.33%">
                        <div class="info-card">
                            <span class="info-label">Metode Pembayaran</span>
                            <span class="info-value" style="font-size: 11pt; line-height: 1.5;">
                                <span style="color: #16a34a">Cash: {{ $report['data']['cash_transactions'] ?? 0 }}</span><br>
                                <span style="color: #ea580c">Credit: {{ $report['data']['credit_transactions'] ?? 0 }}</span>
                            </span>
                        </div>
                    </td>
                </tr>
            </table>
            
            <h3>Detail Per Merek</h3>
            <table class="data-table">
                <thead>
                    <tr>
                        <th style="width: 50%">Merek Motor</th>
                        <th class="text-center">Unit Terjual</th>
                        <th class="text-right">Estimasi Pendapatan</th>
                    </tr>
                </thead>
                <tbody>
                    @forelse($report['data']['by_brand'] ?? [] as $brand => $stats)
                    <tr>
                        <td class="font-bold">{{ $brand }}</td>
                        <td class="text-center">{{ $stats['count'] }}</td>
                        <td class="text-right">Rp {{ number_format($stats['revenue'], 0, ',', '.') }}</td>
                    </tr>
                    @empty
                    <tr><td colspan="3" class="text-center" style="padding: 20px;">Tidak ada data penjualan untuk periode ini.</td></tr>
                    @endforelse
                </tbody>
            </table>

        @elseif($report['type'] === 'income')
            <table class="info-table">
                <tr>
                    <td style="width: 33.33%">
                        <div class="info-card">
                            <span class="info-label">Gross Income</span>
                            <span class="info-value text-success">
                                Rp {{ number_format($report['data']['total_income'] ?? 0, 0, ',', '.') }}
                            </span>
                        </div>
                    </td>
                    <td style="width: 33.33%">
                        <div class="info-card">
                            <span class="info-label">Pemasukan Tunai</span>
                            <span class="info-value" style="color: #16a34a;">
                                Rp {{ number_format($report['data']['cash_income'] ?? 0, 0, ',', '.') }}
                            </span>
                        </div>
                    </td>
                    <td style="width: 33.33%">
                        <div class="info-card">
                            <span class="info-label">Pemasukan Kredit</span>
                            <span class="info-value" style="color: #ea580c;">
                                Rp {{ number_format($report['data']['credit_income'] ?? 0, 0, ',', '.') }}
                            </span>
                        </div>
                    </td>
                </tr>
            </table>

            <h3>Breakdown Bulanan</h3>
            <table class="data-table">
                <thead>
                    <tr>
                        <th>Periode Bulan</th>
                        <th class="text-right">Tunai (IDR)</th>
                        <th class="text-right">Kredit (IDR)</th>
                        <th class="text-right">Total (IDR)</th>
                    </tr>
                </thead>
                <tbody>
                    @forelse($report['data']['by_month'] ?? [] as $month => $stats)
                    <tr>
                        <td class="font-bold">{{ \Carbon\Carbon::parse($month)->translatedFormat('F Y') }}</td>
                        <td class="text-right" style="color: #64748b">{{ number_format($stats['cash'] ?? 0, 0, ',', '.') }}</td>
                        <td class="text-right" style="color: #64748b">{{ number_format($stats['credit'] ?? 0, 0, ',', '.') }}</td>
                        <td class="text-right font-bold text-success">{{ number_format($stats['total'] ?? 0, 0, ',', '.') }}</td>
                    </tr>
                    @empty
                    <tr><td colspan="4" class="text-center">Tidak ada data pendapatan.</td></tr>
                    @endforelse
                </tbody>
            </table>

        @elseif($report['type'] === 'customer')
            <table class="info-table">
                <tr>
                    <td style="width: 50%">
                        <div class="info-card">
                            <span class="info-label">Total Basis Pelanggan</span>
                            <span class="info-value">{{ $report['data']['total_customers'] ?? 0 }}</span>
                            <span class="info-sub">Active Users</span>
                        </div>
                    </td>
                    <td style="width: 50%">
                        <div class="info-card">
                            <span class="info-label">Pelanggan Baru (Periode Ini)</span>
                            <span class="info-value text-success">+{{ $report['data']['new_customers'] ?? 0 }}</span>
                            <span class="info-sub">Sign ups</span>
                        </div>
                    </td>
                </tr>
            </table>

            <h3>Top 10 High Value Customers</h3>
            <table class="data-table">
                <thead>
                    <tr>
                        <th>Nama Pelanggan</th>
                        <th>Email Kontak</th>
                        <th class="text-center">Total Tx</th>
                        <th class="text-right">Total Belanja</th>
                    </tr>
                </thead>
                <tbody>
                    @forelse($report['data']['top_customers'] ?? [] as $customer)
                    <tr>
                        <td class="font-bold">{{ $customer['name'] }}</td>
                        <td style="color: #64748b">{{ $customer['email'] }}</td>
                        <td class="text-center">{{ $customer['transaction_count'] }}</td>
                        <td class="text-right font-bold">{{ number_format($customer['total_spent'], 0, ',', '.') }}</td>
                    </tr>
                    @empty
                    <tr><td colspan="4" class="text-center">Belum ada data pelanggan.</td></tr>
                    @endforelse
                </tbody>
            </table>

        @elseif($report['type'] === 'status')
            @php
                $statusColors = [
                    'pending' => '#f59e0b',       // Amber
                    'waiting_approval' => '#eab308', // Yellow
                    'paid' => '#10b981',          // Emerald
                    'approved' => '#3b82f6',      // Blue
                    'completed' => '#059669',     // Green
                    'cancelled' => '#94a3b8',     // Slate
                    'rejected' => '#ef4444',      // Red
                    'delivered' => '#8b5cf6',     // Violet
                ];
                
                $statusMap = [
                    'pending' => 'Menunggu Pembayaran',
                    'waiting_approval' => 'Verifikasi',
                    'paid' => 'Dibayar',
                    'approved' => 'Disetujui',
                    'completed' => 'Selesai',
                    'cancelled' => 'Batal',
                    'rejected' => 'Ditolak',
                    'delivered' => 'Terkirim',
                ];
            @endphp
            
            <table class="info-table">
                <tr>
                    <td>
                        <div class="info-card">
                            <span class="info-label">Total Volume Transaksi</span>
                            <span class="info-value">{{ $report['data']['total_transactions'] ?? 0 }}</span>
                        </div>
                    </td>
                </tr>
            </table>

            <h3>Distribusi Status Pesanan</h3>
            <table class="data-table">
                <thead>
                    <tr>
                        <th>Status</th>
                        <th class="text-center">Jumlah</th>
                        <th class="text-center">Persentase</th>
                        <th class="text-right">Valuasi</th>
                    </tr>
                </thead>
                <tbody>
                    @forelse($report['data']['by_status'] ?? [] as $status => $stats)
                    <tr>
                        <td>
                            <span class="badge" style="background-color: {{ $statusColors[$status] ?? '#64748b' }}">
                                {{ strtoupper($statusMap[$status] ?? $status) }}
                            </span>
                        </td>
                        <td class="text-center">{{ $stats['count'] }}</td>
                        <td class="text-center">{{ $stats['percentage'] }}%</td>
                        <td class="text-right font-bold">Rp {{ number_format($stats['revenue'], 0, ',', '.') }}</td>
                    </tr>
                    @empty
                    <tr><td colspan="4" class="text-center">Tidak ada data.</td></tr>
                    @endforelse
                </tbody>
                @if(($report['data']['total_transactions'] ?? 0) > 0)
                <tr class="total-row">
                    <td>TOTAL</td>
                    <td class="text-center">{{ $report['data']['total_transactions'] }}</td>
                    <td class="text-center">100%</td>
                    <td class="text-right">Rp {{ number_format(collect($report['data']['by_status'])->sum('revenue'), 0, ',', '.') }}</td>
                </tr>
                @endif
            </table>
        @endif
        
        <div style="margin-top: 50px; page-break-inside: avoid;">
            <table style="width: 100%; text-align: center;">
                <tr>
                    <td style="width: 60%"></td>
                    <td style="width: 40%">
                        <p style="margin-bottom: 60px;">Diketahui Oleh,</p>
                        <p style="font-weight: bold; text-decoration: underline;">Admin SRB Motor</p>
                    </td>
                </tr>
            </table>
        </div>
    </main>
</body>
</html>