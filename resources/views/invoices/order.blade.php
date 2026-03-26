<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Invoice - {{ $order->reference_number }}</title>
    <style>
        body { font-family: 'Helvetica', 'Arial', sans-serif; color: #1a1a1a; margin: 0; padding: 20px; line-height: 1.5; }
        .header { border-bottom: 2px solid #2563eb; padding-bottom: 20px; margin-bottom: 30px; }
        .logo { height: 60px; margin-bottom: 15px; }
        .company-name { font-size: 24px; font-weight: 900; color: #2563eb; text-transform: uppercase; letter-spacing: -1px; }
        .invoice-title { font-size: 32px; font-weight: 900; text-align: right; color: #1a1a1a; margin: 0; text-transform: uppercase; }
        
        .grid { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
        .grid td { vertical-align: top; width: 50%; }
        
        .section-title { font-size: 10px; font-weight: 900; color: #6b7280; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 8px; }
        .info-box { background: #f8fafc; border-radius: 12px; padding: 15px; }
        .info-text { font-size: 14px; font-weight: 700; margin: 0; }
        .info-subtext { font-size: 12px; color: #6b7280; margin-top: 4px; }

        .table { width: 100%; border-collapse: collapse; margin-top: 20px; }
        .table th { background: #f8fafc; border-bottom: 2px solid #e2e8f0; padding: 12px; text-align: left; font-size: 10px; font-weight: 900; color: #6b7280; text-transform: uppercase; }
        .table td { padding: 15px 12px; border-bottom: 1px solid #f1f5f9; font-size: 13px; font-weight: 600; }
        
        .total-section { margin-top: 30px; border-top: 2px solid #1a1a1a; padding-top: 20px; }
        .total-row { display: flex; justify-content: flex-end; align-items: center; gap: 40px; text-align: right; }
        .total-label { font-size: 12px; font-weight: 900; color: #6b7280; text-transform: uppercase; }
        .total-amount { font-size: 24px; font-weight: 900; color: #2563eb; }

        .footer { margin-top: 50px; border-top: 1px solid #e2e8f0; padding-top: 20px; font-size: 10px; color: #94a3b8; text-align: center; font-weight: 700; text-transform: uppercase; }
        .badge { display: inline-block; padding: 4px 8px; border-radius: 6px; font-size: 10px; font-weight: 800; text-transform: uppercase; }
        .badge-paid { background: #dcfce7; color: #166534; }
        .badge-pending { background: #fef9c3; color: #854d0e; }
        
        .motor-image { width: 120px; border-radius: 12px; margin-bottom: 10px; }
    </style>
</head>
<body>
    <div class="header">
        <table style="width: 100%">
            <tr>
                <td>
                    <div class="company-name text-blue-600">SRB MOTOR</div>
                    <div style="font-size: 10px; color: #6b7280; font-weight: 700; margin-top: 5px;">
                        SOLUSI MOTOR TERBAIK & TERPERCAYA
                    </div>
                </td>
                <td style="text-align: right">
                    <h1 class="invoice-title">INVOICE</h1>
                    <div style="font-size: 14px; font-weight: 800; color: #6b7280;">
                        #{{ $order->reference_number }}
                    </div>
                </td>
            </tr>
        </table>
    </div>

    <table class="grid">
        <tr>
            <td>
                <div class="section-title">TAGIHAN KEPADA</div>
                <div class="info-box" style="margin-right: 15px;">
                    <p class="info-text">{{ strtoupper($order->name) }}</p>
                    <p class="info-subtext">{{ $order->phone }}</p>
                    <p class="info-subtext" style="font-size: 11px; margin-top: 8px; color: #475569;">
                        {{ $order->address }}
                    </p>
                </div>
            </td>
            <td>
                <div class="section-title">RINCIAN PESANAN</div>
                <div class="info-box" style="margin-left: 15px;">
                    <p class="info-text" style="color: #2563eb;">{{ strtoupper($order->motor->name) }}</p>
                    <p class="info-subtext">Warna: {{ $order->motor_color }}</p>
                    <p class="info-subtext">Tanggal: {{ $order->created_at->format('d M Y, H:i') }}</p>
                    <p class="info-subtext">Metode: {{ strtoupper($order->payment_method) }}</p>
                </div>
            </td>
        </tr>
    </table>

    <div class="section-title">STATUS PEMBAYARAN</div>
    <table class="table">
        <thead>
            <tr>
                <th>DESKRIPSI</th>
                <th>TANGGAL JATUH TEMPO</th>
                <th>STATUS</th>
                <th style="text-align: right">NOMINAL</th>
            </tr>
        </thead>
        <tbody>
            @foreach($order->installments->sortBy('installment_number') as $inst)
            <tr>
                <td>
                    {{ $inst->installment_number == 0 ? 'BOOKING FEE / DP' : 'CICILAN #' . $inst->installment_number }}
                </td>
                <td>{{ \Carbon\Carbon::parse($inst->due_date)->format('d M Y') }}</td>
                <td>
                    <span class="badge {{ $inst->status == 'paid' ? 'badge-paid' : 'badge-pending' }}">
                        {{ strtoupper($inst->status) }}
                    </span>
                </td>
                <td style="text-align: right">Rp {{ number_format($inst->amount, 0, ',', '.') }}</td>
            </tr>
            @endforeach
        </tbody>
    </table>

    <div class="total-section">
        <table style="width: 100%">
            <tr>
                <td style="width: 60%">
                    <div class="section-title">CATATAN</div>
                    <p style="font-size: 11px; color: #64748b; font-weight: 600; font-style: italic;">
                        Invoice ini diterbitkan secara otomatis oleh sistem SRB Motor. 
                        Simpan invoice ini sebagai bukti transaksi yang sah.
                    </p>
                </td>
                <td style="text-align: right">
                    <span class="total-label">TOTAL KEWAJIBAN</span><br>
                    <span class="total-amount">Rp {{ number_format($order->total_price, 0, ',', '.') }}</span>
                </td>
            </tr>
        </table>
    </div>

    <div class="footer">
        © {{ date('Y') }} SRB MOTOR - JL. RAYA SRB NO. 123, JAKARTA, INDONESIA<br>
        TELP: (021) 1234-5678 | EMAIL: INFO@SRBMOTOR.COM | WEBSITE: WWW.SRBMOTOR.COM
    </div>
</body>
</html>
