<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Laravel\Socialite\Facades\Socialite;

class GoogleAuthController extends Controller
{
    /**
     * Redirect user to Google OAuth endpoint
     */
    public function redirect()
    {
        return Socialite::driver('google')->redirect();
    }

    /**
     * Handle Google OAuth callback
     */
    public function callback()
    {
        try {
            $googleUser = Socialite::driver('google')->user();

            // Find existing user by email
            $user = User::where('email', $googleUser->getEmail())->first();

            if ($user) {
                // Existing user - update google_id and photo if missing, then login
                if (empty($user->google_id)) {
                    $user->update([
                        'google_id' => $googleUser->getId(),
                        'profile_photo_path' => $googleUser->getAvatar(),
                    ]);
                }
                Auth::login($user);
            } else {
                // New user - create account
                // Use str_random or Str::random wrapper in Laravel
                $newUser = User::create([
                    'name' => $googleUser->getName(),
                    'email' => $googleUser->getEmail(),
                    'google_id' => $googleUser->getId(),
                    'profile_photo_path' => $googleUser->getAvatar(),
                    'password' => bcrypt(\Illuminate\Support\Str::random(16)), // Random password
                    'email_verified_at' => now(), // Auto-verify Google accounts
                    'role' => 'user', 
                ]);

                Auth::login($newUser);
            }

            return redirect()->intended('/profile'); // Redirecting to profile page instead of dashboard for regular user
            
        } catch (\Exception $e) {
            return redirect('/login')
                ->with('error', 'Gagal login dengan Google. Silakan coba lagi.');
        }
    }
}
