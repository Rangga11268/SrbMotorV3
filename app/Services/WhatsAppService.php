<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class WhatsAppService
{
    /**
     * Send WhatsApp message via Fonnte API
     * 
     * @param string $target Phone number (without + or 62 prefix handling needed usually, but Fonnte handles 08xxx)
     * @param string $message Message content
     * @return mixed
     */
    public static function sendMessage($target, $message)
    {
        $token = config('services.fonnte.token'); // We will add this to config later

        if (!$token) {
            Log::warning('WhatsApp Notification skipped: FONNTE_TOKEN is missing in .env');
            return false;
        }

        try {
            $response = Http::timeout(5)->withHeaders([
                'Authorization' => $token,
            ])->post('https://api.fonnte.com/send', [
                'target' => $target,
                'message' => $message,
            ]);

            return $response->json();
        } catch (\Exception $e) {
            Log::error('WhatsApp Error: ' . $e->getMessage());
            return false;
        }
    }
}
