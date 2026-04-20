<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Invoice - #{{ $transaction->reference_number ?? $transaction->id }}</title>
    <style>
        body {
            font-family: 'Helvetica Neue', 'Helvetica', Helvetica, Arial, sans-serif;
            color: #333;
            margin: 0;
            padding: 0;
            font-size: 14px;
            line-height: 1.5;
        }
        .invoice-box {
            max-width: 800px;
            margin: auto;
            padding: 20px;
            box-sizing: border-box;
        }
        .header {
            width: 100%;
            border-bottom: 2px solid #2563eb;
            padding-bottom: 15px;
            margin-bottom: 20px;
        }
        .header table {
            width: 100%;
        }
        .header td {
            vertical-align: top;
        }
        .header .title {
            font-size: 28px;
            color: #2563eb;
            font-weight: bold;
            text-transform: uppercase;
            letter-spacing: 2px;
        }
        .header .subtitle {
            font-size: 14px;
            color: #666;
            margin-top: 5px;
        }
        .header .company-details {
            text-align: right;
            font-size: 13px;
            color: #555;
        }
        .header .company-details strong {
            font-size: 16px;
            color: #333;
        }
        .info-row {
            width: 100%;
            margin-bottom: 20px;
            border-spacing: 0;
        }
        .info-row td {
            width: 50%;
            vertical-align: top;
            padding: 10px;
            background-color: #f8fafc;
            border-radius: 6px;
            border: 1px solid #e2e8f0;
        }
        h3.section-title {
            color: #1e40af;
            font-size: 16px;
            margin-top: 0;
            margin-bottom: 10px;
            border-bottom: 1px solid #cbd5e1;
            padding-bottom: 5px;
            text-transform: uppercase;
        }
        table.data-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 25px;
        }
        table.data-table th, table.data-table td {
            padding: 10px;
            text-align: left;
            border-bottom: 1px solid #e2e8f0;
            font-size: 13px;
        }
        table.data-table th {
            width: 35%;
            font-weight: bold;
            color: #475569;
            background-color: #f1f5f9;
        }
        table.data-table td {
            color: #1e293b;
        }
        table.total-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
        }
        table.total-table td {
            padding: 10px;
            border-bottom: 1px solid #e2e8f0;
            font-size: 14px;
        }
        table.total-table tr.total td {
            background-color: #eff6ff;
            font-size: 16px;
            font-weight: bold;
            color: #1e40af;
            border-bottom: none;
            border-top: 2px solid #2563eb;
        }
        .footer-signatures {
            width: 100%;
            margin-top: 50px;
        }
        .footer-signatures td {
            width: 50%;
            text-align: center;
        }
        .footer-signatures .sig-box {
            display: inline-block;
            width: 200px;
        }
        .footer-signatures .sig-line {
            border-bottom: 1px solid #333;
            margin-top: 50px;
            margin-bottom: 5px;
        }
        .footer-text {
            text-align: center;
            color: #94a3b8;
            font-size: 12px;
            margin-top: 40px;
            border-top: 1px solid #e2e8f0;
            padding-top: 15px;
        }
    </style>
</head>
<body>
    <div class="invoice-box">
        <div class="header">
            <table>
                <tr>
                    <td style="width: 60%;">
                        @if(isset($logo_path))
                            <img src="{{ $logo_path }}" alt="SRB Motor Logo" style="max-height: 60px; margin-bottom: 10px;" onerror="this.style.display='none';">
                        @endif
                        <div class="title">INVOICE</div>
                        <div class="subtitle">#{{ $transaction->reference_number ?? ('TRX-' . str_pad($transaction->id, 5, '0', STR_PAD_LEFT)) }}</div>
                    </td>
                    <td class="company-details" style="width: 40%;">
                        <strong>SRB Motor</strong><br>
                        Jl. Contoh Alamat No. 123, Kota<br>
                        Telepon: (021) 123-4567<br>
                        Email: info@srbmotors.com
                    </td>
                </tr>
            </table>
        </div>

        <table class="info-row">
            <tr>
                <td style="border-right: 5px solid transparent /* spacer */;">
                    <h3 class="section-title">Informasi Pembeli</h3>
                    <strong>Nama:</strong> {{ $transaction->customer_name ?? $transaction->user->name }}<br>
                    <strong>No. Telp:</strong> {{ $transaction->customer_phone ?? ($transaction->user->phone_number ?? '-') }}<br>
                    <strong>Email:</strong> {{ $transaction->user->email }}<br>
                    <strong>Pekerjaan:</strong> {{ $transaction->customer_occupation ?? '-' }}
                </td>
                <td style="border-left: 5px solid transparent /* spacer */;">
                    <h3 class="section-title">Detail Transaksi</h3>
                    <strong>Tanggal:</strong> {{ $transaction->created_at->format('d F Y') }}<br>
                    <strong>Tipe Pembayaran:</strong> {{ $transaction->transaction_type === 'CASH' ? 'TUNAI' : 'KREDIT' }}<br>
                    <strong>Status:</strong> {{ strtoupper($transaction->status_text) }}
                </td>
            </tr>
        </table>

        <h3 class="section-title" style="margin-top: 30px;">Detail Unit Kendaraan</h3>
        <table class="data-table">
            <tr>
                <th>Merek & Nama Motor</th>
                <td><strong>{{ $transaction->motor->brand }}</strong> {{ $transaction->motor->name }}</td>
            </tr>
            <tr>
                <th>Model / Tipe</th>
                <td>{{ $transaction->motor->model ?? '-' }} / {{ $transaction->motor->type ?? '-' }}</td>
            </tr>
            <tr>
                <th>Tahun</th>
                <td>{{ $transaction->motor->year ?? '-' }}</td>
            </tr>
            <tr>
                <th>Warna Pilihan</th>
                <td>{{ $transaction->motor_color ?? '-' }}</td>
            </tr>
        </table>

        @if ($transaction->transaction_type === 'CREDIT' && $transaction->creditDetail)
            <h3 class="section-title">Informasi Kredit</h3>
            <table class="data-table">
                <tr>
                    <th>Uang Muka (DP)</th>
                    <td>Rp {{ number_format($transaction->creditDetail->down_payment ?? 0, 0, ',', '.') }}</td>
                </tr>
                <tr>
                    <th>Tenor Pinjaman</th>
                    <td>{{ $transaction->creditDetail->tenor }} bulan</td>
                </tr>
                <tr>
                    <th>Angsuran Bulanan</th>
                    <td>Rp {{ number_format($transaction->creditDetail->monthly_installment ?? 0, 0, ',', '.') }}</td>
                </tr>
                @if($transaction->creditDetail->approved_amount)
                <tr>
                    <th>Jumlah Disetujui (Leasing)</th>
                    <td>Rp {{ number_format($transaction->creditDetail->approved_amount, 0, ',', '.') }}</td>
                </tr>
                @endif
            </table>
        @endif

        <h3 class="section-title" style="margin-top: 30px;">Ringkasan Biaya</h3>
        <table class="total-table">
            <tr>
                <td style="width: 70%;">Harga Kendaraan (OTR)</td>
                <td style="width: 30%; text-align: right;">Rp {{ number_format($transaction->motor_price ?? $transaction->motor->price, 0, ',', '.') }}</td>
            </tr>
            @if ($transaction->booking_fee > 0)
                <tr>
                    <td>Booking Fee (Tanda Jadi)</td>
                    <td style="text-align: right;">Rp {{ number_format($transaction->booking_fee, 0, ',', '.') }}</td>
                </tr>
            @endif
            <tr class="total">
                <td style="text-align: right;">Total Nilai Transaksi:</td>
                <td style="text-align: right;">Rp {{ number_format($transaction->total_amount, 0, ',', '.') }}</td>
            </tr>
        </table>

        <table class="footer-signatures">
            <tr>
                <td>
                    <div class="sig-box">
                        <p>Mengetahui,</p>
                        <div class="sig-line"></div>
                        <p><strong>SRB Motor</strong><br>Authorized Dealer</p>
                    </div>
                </td>
                <td>
                    <div class="sig-box">
                        <p>Disetujui,</p>
                        <div class="sig-line"></div>
                        <p><strong>{{ $transaction->customer_name ?? $transaction->user->name }}</strong><br>Pelanggan</p>
                    </div>
                </td>
            </tr>
        </table>

        <div class="footer-text">
            Terima kasih telah mempercayakan pembelian kendaraan Anda di SRB Motor.<br>
            Dokumen ini dicetak secara sah oleh sistem pada {{ now()->format('d M Y, H:i') }}.
        </div>
    </div>
</body>
</html>
