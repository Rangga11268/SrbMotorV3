<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Pembayaran Berhasil | SRB Motor</title>
    <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;600;700&display=swap" rel="stylesheet">
    <style>
        body {
            font-family: 'Outfit', sans-serif;
            background-color: #f8fafc;
            display: flex;
            align-items: center;
            justify-content: center;
            height: 100vh;
            margin: 0;
            padding: 20px;
            color: #1e293b;
        }
        .card {
            background: white;
            padding: 40px;
            border-radius: 24px;
            box-shadow: 0 10px 25px rgba(0,0,0,0.05);
            text-align: center;
            max-width: 400px;
            width: 100%;
        }
        .icon-container {
            width: 80px;
            height: 80px;
            background-color: #f0fdf4;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0 auto 24px;
        }
        .icon {
            color: #22c55e;
            font-size: 40px;
        }
        h1 {
            font-size: 24px;
            margin: 0 0 12px;
            font-weight: 700;
        }
        p {
            color: #64748b;
            line-height: 1.6;
            margin: 0 0 32px;
        }
        .btn {
            display: inline-block;
            background-color: #2563eb;
            color: white;
            padding: 16px 32px;
            border-radius: 14px;
            text-decoration: none;
            font-weight: 600;
            transition: transform 0.2s, background-color 0.2s;
            width: 100%;
            box-sizing: border-box;
        }
        .btn:active {
            transform: scale(0.98);
            background-color: #1d4ed8;
        }
        .timer {
            margin-top: 20px;
            font-size: 13px;
            color: #94a3b8;
        }
    </style>
</head>
<body>
    <div class="card">
        <div class="icon-container">
            <span class="icon">✓</span>
        </div>
        <h1>Pembayaran Selesai</h1>
        <p>Terima kasih! Pembayaran Anda telah kami terima. Anda akan dialihkan kembali ke aplikasi dalam beberapa detik.</p>
        
        <a href="srbmotor://payment-success" class="btn">KEMBALI KE APLIKASI</a>
        
        <div class="timer">
            Membuka aplikasi otomatis dalam <span id="countdown">3</span> detik...
        </div>
        
        <div style="margin-top: 30px; font-size: 11px; color: #cbd5e1; border-top: 1px solid #f1f5f9; pt: 15px;">
            ID Pesanan: {{ $order_id ?? '-' }}
        </div>
    </div>

    <script>
        // Auto-redirect to app scheme
        setTimeout(function() {
            window.location.href = "srbmotor://payment-success";
        }, 1000);

        // Countdown timer
        var seconds = 3;
        var countdownElt = document.getElementById('countdown');
        var interval = setInterval(function() {
            seconds--;
            countdownElt.textContent = seconds;
            if (seconds <= 0) {
                clearInterval(interval);
                // Final attempt
                window.location.href = "srbmotor://payment-success";
            }
        }, 1000);
    </script>
</body>
</html>
