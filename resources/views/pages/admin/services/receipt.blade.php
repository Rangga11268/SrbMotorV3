<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Struk Servis #{{ $service->queue_number }}</title>
    <style>
        @page { margin: 0; }
        body {
            font-family: 'Helvetica', 'Arial', sans-serif;
            color: #333;
            line-height: 1.4;
            margin: 0;
            padding: 40px;
            font-size: 12px;
        }
        .header {
            border-bottom: 2px solid #1a202c;
            padding-bottom: 20px;
            margin-bottom: 20px;
            display: flex;
            justify-content: space-between;
        }
        .company-info h1 {
            margin: 0;
            font-size: 24px;
            color: #1a202c;
            font-weight: 800;
            letter-spacing: -0.5px;
        }
        .company-info p {
            margin: 2px 0;
            color: #718096;
            font-size: 10px;
        }
        .receipt-label {
            text-align: right;
        }
        .receipt-label h2 {
            margin: 0;
            font-size: 18px;
            color: #2d3748;
            text-transform: uppercase;
            letter-spacing: 2px;
        }
        .info-grid {
            display: table;
            width: 100%;
            margin-bottom: 30px;
        }
        .info-col {
            display: table-cell;
            width: 50%;
            vertical-align: top;
        }
        .info-box {
            padding: 10px 0;
        }
        .info-box span {
            display: block;
            font-size: 10px;
            text-transform: uppercase;
            color: #a0aec0;
            font-weight: bold;
            margin-bottom: 2px;
        }
        .info-box p {
            margin: 0;
            font-weight: bold;
            font-size: 13px;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 30px;
        }
        th {
            background-color: #f7fafc;
            text-align: left;
            padding: 12px 15px;
            font-size: 10px;
            text-transform: uppercase;
            color: #4a5568;
            border-bottom: 1px solid #edf2f7;
        }
        td {
            padding: 12px 15px;
            border-bottom: 1px solid #edf2f7;
        }
        .text-right { text-align: right; }
        .footer {
            margin-top: 50px;
            border-top: 1px solid #edf2f7;
            padding-top: 20px;
            display: table;
            width: 100%;
        }
        .signature {
            display: table-cell;
            width: 33.33%;
            text-align: center;
        }
        .signature p {
            margin-top: 60px;
            border-top: 1px solid #333;
            display: inline-block;
            min-width: 120px;
            padding-top: 5px;
            font-weight: bold;
        }
        .total-box {
            background-color: #1a202c;
            color: white;
            padding: 15px;
            text-align: right;
            border-radius: 8px;
        }
        .total-box span {
            display: block;
            font-size: 10px;
            opacity: 0.8;
            margin-bottom: 5px;
        }
        .total-box h3 {
            margin: 0;
            font-size: 20px;
        }
    </style>
</head>
<body>
    <div class="header">
        <div class="company-info" style="float: left;">
            <h1>{{ $company['name'] }}</h1>
            <p>{{ $company['address'] }}</p>
            <p>Telp: {{ $company['phone'] }}</p>
        </div>
        <div class="receipt-label" style="float: right;">
            <h2>Tanda Terima Servis</h2>
            <p style="margin: 0; color: #718096;">No: #{{ $service->queue_number }}</p>
        </div>
        <div style="clear: both;"></div>
    </div>

    <div class="info-grid">
        <div class="info-col">
            <div class="info-box">
                <span>Pelanggan</span>
                <p>{{ $service->customer_name }}</p>
                <p style="font-size: 11px; font-weight: normal; color: #718096;">{{ $service->customer_phone }}</p>
            </div>
            <div class="info-box">
                <span>Kendaraan</span>
                <p>{{ $service->motor_model }} ({{ $service->plate_number }})</p>
            </div>
        </div>
        <div class="info-col">
            <div class="info-box">
                <span>Tanggal Servis</span>
                <p>{{ $service->service_date->format('d F Y') }}</p>
            </div>
            <div class="info-box">
                <span>Status Pembayaran</span>
                <p>{{ strtoupper($service->payment_status) }} ({{ $service->payment_method ?: 'Manual' }})</p>
            </div>
        </div>
    </div>

    <table>
        <thead>
            <tr>
                <th>Deskripsi Item / Jasa</th>
                <th class="text-right" width="80">Qty</th>
                <th class="text-right" width="120">Harga Satuan</th>
                <th class="text-right" width="150">Total</th>
            </tr>
        </thead>
        <tbody>
            @foreach($items as $item)
            <tr>
                <td>{{ $item['description'] }}</td>
                <td class="text-right">{{ $item['qty'] }}</td>
                <td class="text-right">Rp {{ number_format($item['price'], 0, ',', '.') }}</td>
                <td class="text-right">Rp {{ number_format($item['price'] * $item['qty'], 0, ',', '.') }}</td>
            </tr>
            @endforeach
        </tbody>
    </table>

    <div style="width: 100%; display: table;">
        <div style="display: table-cell; width: 60%; vertical-align: top; padding-right: 20px;">
            <div class="info-box" style="padding-top: 0;">
                <span>Catatan Mekanik</span>
                <p style="font-weight: normal; font-size: 11px; color: #4a5568;">
                    {{ is_array(json_decode($service->service_notes, true)) ? 'Detail item terlampir.' : ($service->service_notes ?: 'Tidak ada catatan.') }}
                </p>
            </div>
        </div>
        <div style="display: table-cell; width: 40%; vertical-align: top;">
            <div class="total-box">
                <span>TOTAL PEMBAYARAN</span>
                <h3>Rp {{ number_format($service->total_cost, 0, ',', '.') }}</h3>
            </div>
        </div>
    </div>

    <div class="footer">
        <div class="signature">
            <span>Customer</span>
            <p>{{ $service->customer_name }}</p>
        </div>
        <div class="signature">
            <span>Hormat Kami,</span>
            <p>Kasir / Admin</p>
        </div>
    </div>

    <div style="margin-top: 40px; text-align: center; color: #a0aec0; font-size: 9px;">
        Terima kasih telah mempercayakan servis kendaraan Anda kepada kami.<br>
        Simpan struk ini sebagai bukti garansi servis (jika ada).
    </div>
</body>
</html>
