<!DOCTYPE html>
<html lang="id">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Invoice - {{ $transaction->id }}</title>
    @if(isset($isPdf) && $isPdf)
        <style>
            {{ file_get_contents(resource_path('css/admin.css')) }}
        </style>
    @else
        @vite(['resources/css/admin.css'])
    @endif
</head>

<body class="invoice-page-body">
    <div class="invoice-box">
        <div class="watermark">
            <div class="content">
                <div class="company-info">
                    <table>
                        <tr class="top">
                            <td class="title">
                                <img src="{{ isset($logo_path) ? $logo_path : asset('images/icon/logo trans.png') }}" 
                                     style="width: 80px; height: auto;" 
                                     onerror="this.onerror=null; this.src='{{ asset('images/icon/logo trans.png') }}';" />
                            </td>

                            <td>
                                <h1 class="invoice-title">INVOICE</h1>
                                <h2 class="invoice-subtitle">SRB Motor</h2>
                            </td>
                        </tr>
                    </table>

                    <table style="margin-bottom: 6px;">
                        <tr class="information">
                            <td style="width: 50%; padding: 1px;">
                                <strong>SRB Motor</strong><br>
                                Jl. Contoh Alamat No. 123, Kota<br>
                                Telepon: (021) 123-4567<br>
                                Email: info@srbmotors.com
                            </td>

                            <td style="width: 50%; padding: 1px;">
                                <strong>Invoice #</strong> {{ $transaction->id }}<br>
                                <strong>Tanggal:</strong> {{ $transaction->created_at->format('d M Y') }}<br>
                                <strong>Transaksi:</strong>
                                {{ $transaction->transaction_type === 'CASH' ? 'Tunai' : 'Kredit' }}<br>
                                <strong>Status:</strong> {{ $transaction->status_text }}
                            </td>
                        </tr>
                    </table>
                </div>

                <div class="section-title">Informasi Transaksi</div>
                <div class="invoice-details">
                    <div class="customer-info">
                        <h3>Informasi Pelanggan</h3>
                        <table class="info-table" style="width: 100%;">
                            <tr class="item">
                                <th style="width: 30%; padding: 4px;">Nama:</th>
                                <td style="width: 70%; padding: 4px;">{{ $transaction->customer_name ?? $transaction->user->name }}</td>
                            </tr>
                            <tr class="item">
                                <th style="width: 30%; padding: 4px;">Telepon:</th>
                                <td style="width: 70%; padding: 4px;">{{ $transaction->customer_phone ?? ($transaction->user->phone_number ?? '-') }}
                                </td>
                            </tr>
                            <tr class="item">
                                <th style="width: 30%; padding: 4px;">Email:</th>
                                <td style="width: 70%; padding: 4px;">{{ $transaction->user->email }}</td>
                            </tr>
                            <tr class="item">
                                <th style="width: 30%; padding: 4px;">Pekerjaan:</th>
                                <td style="width: 70%; padding: 4px;">{{ $transaction->customer_occupation ?? '-' }}</td>
                            </tr>
                        </table>
                    </div>
                    
                    <div class="transaction-info" style="margin-top: 10px;">
                        <h3>Detail Motor</h3>
                        <table class="info-table" style="width: 100%;">
                            <tr class="item">
                                <th style="width: 30%; padding: 4px;">Nama Motor:</th>
                                <td style="width: 70%; padding: 4px;">{{ $transaction->motor->name }}</td>
                            </tr>
                            <tr class="item">
                                <th style="width: 30%; padding: 4px;">Merek:</th>
                                <td style="width: 70%; padding: 4px;">{{ $transaction->motor->brand }}</td>
                            </tr>
                            <tr class="item">
                                <th style="width: 30%; padding: 4px;">Model:</th>
                                <td style="width: 70%; padding: 4px;">{{ $transaction->motor->model ?? '-' }}</td>
                            </tr>
                            <tr class="item">
                                <th style="width: 30%; padding: 4px;">Tahun:</th>
                                <td style="width: 70%; padding: 4px;">{{ $transaction->motor->year ?? '-' }}</td>
                            </tr>
                            <tr class="item">
                                <th style="width: 30%; padding: 4px;">Tipe:</th>
                                <td style="width: 70%; padding: 4px;">{{ $transaction->motor->type ?? '-' }}</td>
                            </tr>
                        </table>
                    </div>
                </div>

                <div class="section-title">Spesifikasi Motor</div>
                <table class="info-table" style="margin-bottom: 6px;">
                    <tr class="heading">
                        <td style="width: 50%;">Spesifikasi</td>
                        <td style="width: 50%;">Nilai</td>
                    </tr>
                    @if ($transaction->motor->specifications->count() > 0)
                        @php
                            $specs = $transaction->motor->specifications->take(6); // Limit to first 6 specs
                            $remainingSpecs = $transaction->motor->specifications->skip(6);
                        @endphp
                        @foreach ($specs as $spec)
                            <tr class="item" style="padding: 1px;">
                                <td>{{ $spec->spec_key }}</td>
                                <td>{{ $spec->spec_value }}</td>
                            </tr>
                        @endforeach
                        @if ($remainingSpecs->count() > 0)
                            <tr class="item" style="padding: 1px;">
                                <td>Lainnya:</td>
                                <td>{{ $remainingSpecs->count() }} spesifikasi tambahan</td>
                            </tr>
                        @endif
                    @else
                        <tr class="item" style="padding: 1px;">
                            <td colspan="2">Tidak ada spesifikasi</td>
                        </tr>
                    @endif
                </table>

                @if ($transaction->transaction_type === 'CREDIT' && $transaction->creditDetail)
                    <div class="section-title">Detail Kredit</div>
                    <table class="info-table" style="margin-bottom: 6px;">
                        <tr class="heading">
                            <td style="width: 50%;">Detail</td>
                            <td style="width: 50%;">Nilai</td>
                        </tr>
                        <tr class="item" style="padding: 1px;">
                            <td>Uang Muka (DP):</td>
                            <td>Rp {{ number_format($transaction->creditDetail->down_payment, 2, ',', '.') }}</td>
                        </tr>
                        <tr class="item" style="padding: 1px;">
                            <td>Tenor:</td>
                            <td>{{ $transaction->creditDetail->tenor }} bulan</td>
                        </tr>
                        <tr class="item" style="padding: 1px;">
                            <td>Angsuran Bulanan:</td>
                            <td>Rp {{ number_format($transaction->creditDetail->monthly_installment, 2, ',', '.') }}
                            </td>
                        </tr>
                        <tr class="item" style="padding: 1px;">
                            <td>Jumlah Disetujui:</td>
                            <td>Rp {{ number_format($transaction->creditDetail->approved_amount ?? 0, 2, ',', '.') }}
                            </td>
                        </tr>
                        <tr class="item" style="padding: 1px;">
                            <td>Status Kredit:</td>
                            <td>{{ $transaction->creditDetail->credit_status_text }}</td>
                        </tr>
                    </table>
                @endif

                <div class="section-title">Ringkasan Pembayaran</div>
                <table class="info-table" style="margin-bottom: 8px;">
                    <tr class="heading">
                        <td style="width: 50%;">Deskripsi</td>
                        <td style="width: 50%;">Jumlah</td>
                    </tr>
                    <tr class="item" style="padding: 1px;">
                        <td>Harga Motor:</td>
                        <td>Rp {{ number_format($transaction->motor->price, 2, ',', '.') }}</td>
                    </tr>
                    @if ($transaction->booking_fee)
                        <tr class="item" style="padding: 1px;">
                            <td>Booking Fee:</td>
                            <td>Rp {{ number_format($transaction->booking_fee, 2, ',', '.') }}</td>
                        </tr>
                    @endif
                    <tr class="total">
                        <td>Total:</td>
                        <td>Rp {{ number_format($transaction->total_amount, 2, ',', '.') }}</td>
                    </tr>
                </table>

                <div class="signature-section">
                    <table style="width: 100%; margin-top: 15px;">
                        <tr>
                            <td style="text-align: center; width: 50%;">
                                <p style="margin: 0 0 5px 0;">Mengetahui,</p>
                                <p style="margin: 0 0 10px 0;">SRB Motor</p>
                                <div class="signature-line" style="margin: 0 auto; width: 80%;"></div>
                                <p style="margin: 5px 0 0 0;">(________________)</p>
                            </td>
                            <td style="text-align: center; width: 50%;">
                                <p style="margin: 0 0 5px 0;">Disetujui,</p>
                                <p style="margin: 0 0 10px 0;">Pelanggan</p>
                                <div class="signature-line" style="margin: 0 auto; width: 80%;"></div>
                                <p style="margin: 5px 0 0 0;">
                                    ({{ $transaction->customer_name ?? $transaction->user->name }})</p>
                            </td>
                        </tr>
                    </table>
                </div>

                <div class="footer">
                    <p>Terima kasih telah mempercayai SRB Motor</p>
                    <p>Invoice ini dicetak pada {{ now()->format('d M Y H:i') }}</p>
                </div>
            </div>
        </div>
    </div>
</body>

</html>
