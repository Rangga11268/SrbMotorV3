<!DOCTYPE html>
<html>
<head>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            border: 1px solid #eee;
            border-radius: 5px;
        }
        .header {
            background-color: #f8f9fa;
            padding: 10px 20px;
            border-bottom: 1px solid #eee;
            text-align: center;
        }
        .content {
            padding: 20px;
        }
        .footer {
            margin-top: 20px;
            padding-top: 20px;
            border-top: 1px solid #eee;
            font-size: 0.9em;
            color: #777;
            text-align: center;
        }
        .status-badge {
            display: inline-block;
            padding: 5px 10px;
            border-radius: 4px;
            font-weight: bold;
            color: white;
            background-color: #007bff;
        }
        .status-disetujui { background-color: #28a745; }
        .status-ditolak { background-color: #dc3545; }
        .status-menunggu { background-color: #ffc107; color: #333; }
        .button {
            display: inline-block;
            padding: 10px 20px;
            background-color: #007bff;
            color: white;
            text-decoration: none;
            border-radius: 5px;
            margin-top: 15px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h2>Update Status Pengajuan Kredit</h2>
        </div>
        <div class="content">
            <p>Halo <strong>{{ $transaction->customer_name }}</strong>,</p>
            
            <p>Terima kasih telah melakukan pengajuan kredit motor di SRB Motor.</p>
            
            <p>Kami ingin menginformasikan bahwa status pengajuan kredit Anda untuk motor <strong>{{ $transaction->motor->name }}</strong> telah diperbarui menjadi:</p>
            
            <p style="text-align: center;">
                @php
                    $statusClass = match($status) {
                        'disetujui' => 'status-disetujui',
                        'ditolak' => 'status-ditolak',
                        default => 'status-menunggu'
                    };
                    $statusText = match($status) {
                        'disetujui' => 'DISETUJUI',
                        'ditolak' => 'DITOLAK',
                        'dikirim_ke_surveyor' => 'DIKIRIM KE SURVEYOR',
                        'jadwal_survey' => 'JADWAL SURVEY',
                        'data_tidak_valid' => 'DATA TIDAK VALID',
                        default => strtoupper(str_replace('_', ' ', $status))
                    };
                @endphp
                <span class="status-badge {{ $statusClass }}">
                    {{ $statusText }}
                </span>
            </p>

            @if($note)
            <div style="background-color: #fff3cd; padding: 10px; border-radius: 4px; margin: 15px 0;">
                <strong>Catatan dari Admin:</strong><br>
                {{ $note }}
            </div>
            @endif

            <p>Silakan login ke akun Anda untuk melihat detail lebih lanjut.</p>
            
            <center>
                <a href="{{ route('motors.order.confirmation', $transaction->id) }}" class="button">Lihat Detail Transaksi</a>
            </center>
        </div>
        <div class="footer">
            <p>&copy; {{ date('Y') }} SRB Motor. All rights reserved.</p>
        </div>
    </div>
</body>
</html>
