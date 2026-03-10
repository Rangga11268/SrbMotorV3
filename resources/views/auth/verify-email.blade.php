<!DOCTYPE html>
<html lang="id">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Verifikasi Email - SRB Motor</title>
    <script src="https://cdn.tailwindcss.com"></script>
</head>

<body class="bg-gradient-to-br from-blue-50 to-indigo-100 min-h-screen flex items-center justify-center p-4">
    <div class="w-full max-w-md">
        <div class="bg-white rounded-lg shadow-lg p-8 space-y-6">
            <!-- Icon -->
            <div class="flex justify-center">
                <div class="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                    <svg class="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                </div>
            </div>

            <!-- Content -->
            <div class="text-center space-y-2">
                <h1 class="text-2xl font-bold text-gray-900">Verifikasi Email Diperlukan</h1>
                <p class="text-gray-600">Kami telah mengirimkan link verifikasi ke email Anda. Silakan periksa email dan
                    klik link untuk melanjutkan.</p>
            </div>

            <!-- Status Message -->
            @if (session('status') == 'verification-link-sent')
                <div class="bg-green-50 border border-green-200 rounded-lg p-4">
                    <p class="text-green-800 text-sm">
                        ✓ Email verifikasi baru telah dikirim ke email Anda!
                    </p>
                </div>
            @endif

            <!-- Resend Form -->
            <form method="POST" action="{{ route('verification.send') }}" class="space-y-4">
                @csrf
                <button type="submit"
                    class="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-colors">
                    Kirim Ulang Email Verifikasi
                </button>
            </form>

            <!-- Logout Link -->
            <div class="flex items-center gap-2">
                <form method="POST" action="{{ route('logout') }}" class="flex-1">
                    @csrf
                    <button type="submit"
                        class="w-full text-gray-600 hover:text-gray-900 text-sm font-medium py-2 border border-gray-300 rounded-lg hover:border-gray-400 transition-colors">
                        Logout
                    </button>
                </form>
            </div>

            <!-- Help Text -->
            <div class="text-center text-sm text-gray-500 border-t pt-6">
                <p>Email tidak masuk? Periksa folder spam atau <a href="{{ route('verification.send') }}"
                        class="text-blue-600 hover:underline">klik di sini untuk mengirim ulang</a>.</p>
            </div>
        </div>
    </div>
</body>

</html>
