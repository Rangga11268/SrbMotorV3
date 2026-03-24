<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Google_Client;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

class GoogleAuthController extends Controller
{
    /**
     * Handle Google Login from Mobile App (ID Token Verification)
     */
    public function login(Request $request)
    {
        $request->validate([
            'id_token' => 'required|string',
        ]);

        try {
            // Initialize Google Client with the Web Client ID (from .env)
            $client = new Google_Client(['client_id' => config('services.google.client_id')]);
            
            // Verify the ID Token received from the mobile app
            $payload = $client->verifyIdToken($request->id_token);

            if (!$payload) {
                return response()->json([
                    'success' => false,
                    'message' => 'Invalid ID Token'
                ], 401);
            }

            // Extract user data from Google Payload
            $googleId = $payload['sub'];
            $email = $payload['email'];
            $name = $payload['name'];
            $avatar = $payload['picture'] ?? null;

            // Find existing user by email
            $user = User::where('email', $email)->first();

            if ($user) {
                // Link Google ID if not already linked
                if (empty($user->google_id)) {
                    $user->update([
                        'google_id' => $googleId,
                        'profile_photo_path' => $avatar,
                    ]);
                }
            } else {
                // Create new user if not found
                $user = User::create([
                    'name' => $name,
                    'email' => $email,
                    'google_id' => $googleId,
                    'profile_photo_path' => $avatar,
                    'password' => bcrypt(Str::random(24)),
                    'role' => 'user',
                ]);
            }

            // Generate Sanctum Token
            $token = $user->createToken('mobile-auth')->plainTextToken;

            return response()->json([
                'success' => true,
                'message' => 'Login successful',
                'user' => $user,
                'token' => $token,
            ]);

        } catch (\Exception $e) {
            Log::error('API Google Auth Error: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Internal Server Error',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
