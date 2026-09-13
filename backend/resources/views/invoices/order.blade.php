<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Invoice - {{ $order->reference_number }}</title>
    <style>
        @page { size: A4; margin: 0; }
        * { box-sizing: border-box; -webkit-print-color-adjust: exact; }
        body {
            font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
            font-size: 14px; line-height: 1.4; color: #1e293b; margin: 0; padding: 0; background: #fff;
            width: 100%;
        }
        .page-container { 
            padding: 24px 20px; 
            position: relative; 
            width: 100%;
            max-width: 800px;
            margin: 0 auto;
        }
        .top-bar { width: 100%; height: 8px; background-color: #1e3a8a; position: absolute; top: 0; left: 0; }
        .header { margin-bottom: 30px; width: 100%; }
        .logo-section { width: 55%; float: left; }
        .logo-text { font-size: 24px; font-weight: 800; color: #1e3a8a; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 4px; }
        .company-address { font-size: 10px; color: #64748b; line-height: 1.3; }
        .invoice-details { width: 45%; float: right; text-align: right; }
        .invoice-title { font-size: 26px; font-weight: 200; color: #cbd5e0; text-transform: uppercase; margin: 0 0 8px 0; line-height: 1; }
        .invoice-meta-table { width: 100%; }
        .meta-label { font-size: 10px; color: #64748b; font-weight: bold; text-transform: uppercase; padding-right: 8px; text-align: right; }
        .meta-value { font-size: 12px; font-weight: bold; color: #1e293b; text-align: right; }
        .clearfix::after { content: ""; clear: both; display: table; }
        .info-section { margin-bottom: 25px; border-top: 1px solid #e2e8f0; padding-top: 15px; }
        .info-col { width: 48%; float: left; }
        .section-title { font-size: 9px; font-weight: bold; text-transform: uppercase; color: #94a3b8; letter-spacing: 1.2px; margin-bottom: 6px; display: block; }
        .client-name { font-size: 15px; font-weight: bold; margin-bottom: 3px; color: #1e3a8a; }
        .client-address { font-size: 11px; color: #475569; }
        .table-container { margin-bottom: 25px; overflow-x: auto; }
        .custom-table { width: 100%; border-collapse: collapse; min-width: 100%; }
        .custom-table th {
            background-color: #f8fafc; color: #1e3a8a; font-size: 9px; font-weight: bold; text-transform: uppercase;
            padding: 8px 10px; text-align: left; border-top: 2px solid #1e3a8a; border-bottom: 1px solid #e2e8f0;
        }
        .custom-table td { padding: 10px; border-bottom: 1px solid #e2e8f0; vertical-align: top; color: #334155; font-size: 11px; }
        .total-container { width: 100%; margin-bottom: 30px; }
        .total-box { width: 60%; float: right; background-color: #1e3a8a; color: white; padding: 15px; border-radius: 10px; }
        .total-row { display: table; width: 100%; margin-bottom: 4px; }
        .total-label { display: table-cell; font-size: 10px; text-transform: uppercase; opacity: 0.9; }
        .total-value { display: table-cell; text-align: right; font-size: 18px; font-weight: bold; }
        .badge { display: inline-block; padding: 2px 5px; border-radius: 4px; font-size: 8px; font-weight: bold; text-transform: uppercase; }
        .badge-paid { background: #dcfce7; color: #166534; }
        .badge-pending { background: #fef9c3; color: #854d0e; }
        .footer { margin-top: 40px; border-top: 1px solid #e2e8f0; padding-top: 15px; }
        .footer-note { font-size: 10px; color: #64748b; font-style: italic; }
        .signature-area { width: 150px; float: right; text-align: center; margin-top: -30px; }
        .signature-line { border-bottom: 1px solid #cbd5e0; margin: 30px 0 6px 0; }
        .signature-text { font-size: 10px; font-weight: bold; color: #1e3a8a; }
    </style>
</head>
<body>
    <div class="top-bar"></div>
    <div class="page-container">
        <div class="header clearfix">
            <div class="logo-section">
                <div class="logo-text">SRB MOTOR</div>
                <div class="company-address">
                    Jl. Raya Motor No. 123, Jakarta, Indonesia<br>
                    www.srbmotor.com | support@srbmotor.com
                </div>
            </div>
            <div class="invoice-details">
                <h1 class="invoice-title">INVOICE</h1>
                <table class="invoice-meta-table">
                    <tr>
                        <td class="meta-label">ID Pesanan</td>
                        <td class="meta-value">#{{ $order->id }}</td>
                    </tr>
                    <tr>
                        <td class="meta-label">Tanggal</td>
                        <td class="meta-value">{{ $order->created_at->format('d/m/Y') }}</td>
                    </tr>
                    <tr>
                        <td class="meta-label">No. Ref</td>
                        <td class="meta-value" style="font-size: 10px;">{{ $order->reference_number }}</td>
                    </tr>
                </table>
            </div>
        </div>

        <div class="info-section clearfix">
            <div class="info-col">
                <span class="section-title">Pelanggan</span>
                <div class="client-name">{{ strtoupper($order->name) }}</div>
                <div class="client-address">
                    {{ $order->phone }}<br>
                    {{ $order->address }}
                </div>
            </div>
            <div class="info-col" style="float: right; text-align: right;">
                <span class="section-title">Unit Kendaraan</span>
                <div class="client-name" style="font-size: 13px;">{{ $order->motor->name }}</div>
                <div class="client-address">
                    Warna: {{ $order->motor_color }}<br>
                    Metode: {{ strtoupper($order->payment_method) }}
                </div>
            </div>
        </div>

        <div class="table-container">
            <table class="custom-table">
                <thead>
                    <tr>
                        <th width="45%">Deskripsi Tagihan</th>
                        <th width="20%">Jatuh Tempo</th>
                        <th width="15%">Status</th>
                        <th width="20%" style="text-align: right;">Jumlah</th>
                    </tr>
                </thead>
                <tbody>
                    @foreach($order->installments->sortBy('installment_number') as $inst)
                    <tr>
                        <td>
                            <strong>{{ $inst->installment_number == 0 ? 'DP / Booking' : 'Cicilan ' . $inst->installment_number }}</strong>
                        </td>
                        <td>{{ \Carbon\Carbon::parse($inst->due_date)->format('d/m/y') }}</td>
                        <td>
                            <span class="badge {{ $inst->status == 'paid' ? 'badge-paid' : 'badge-pending' }}">
                                {{ strtoupper($inst->status) }}
                            </span>
                        </td>
                        <td style="text-align: right; font-weight: bold;">
                            Rp {{ number_format($inst->amount, 0, ',', '.') }}
                        </td>
                    </tr>
                    @endforeach
                </tbody>
            </table>
        </div>

        <div class="total-container clearfix">
            <div class="total-box">
                <div class="total-row">
                    <span class="total-label">Total Kewajiban</span>
                    <span class="total-value">Rp {{ number_format($order->total_price, 0, ',', '.') }}</span>
                </div>
            </div>
        </div>

        <div class="footer clearfix">
            <div class="signature-area">
                <div class="signature-line"></div>
                <div class="signature-text">SRB Motor Finance</div>
            </div>
            <div style="float: left; width: 60%;">
                <p class="footer-note">
                    <strong>Catatan:</strong><br>
                    Dokumen ini diterbitkan otomatis oleh sistem SRB Motor sebagai bukti pemesanan yang sah.
                </p>
            </div>
            <div style="clear: both; text-align: center; font-size: 8px; color: #94a3b8; margin-top: 25px;">
                &copy; {{ date('Y') }} SRB Motor Platform • Generated {{ now()->format('d/m/Y H:i') }}
            </div>
        </div>
    </div>
</body>
</html>
