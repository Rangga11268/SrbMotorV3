<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Laravel\Socialite\Facades\Socialite;

class GoogleAuthController extends Controller
{
    public function redirect()
    {
        return Socialite::driver('google')->stateless()->redirect();
    }

    public function callback()
    {
        try {
            $googleUser = Socialite::driver('google')->stateless()->user();

            $user = User::where('email', $googleUser->getEmail())->first();

            if ($user) {
                if (empty($user->google_id)) {
                    $user->update([
                        'google_id'           => $googleUser->getId(),
                        'profile_photo_path'  => $googleUser->getAvatar(),
                    ]);
                }
                Auth::login($user, true);
            } else {
                $user = User::create([
                    'name'                => $googleUser->getName(),
                    'email'               => $googleUser->getEmail(),
                    'google_id'           => $googleUser->getId(),
                    'profile_photo_path'  => $googleUser->getAvatar(),
                    'password'            => bcrypt(\Illuminate\Support\Str::random(24)),
                    'role'                => 'user',
                ]);
                Auth::login($user, true);
            }

            return redirect()->intended(route('motors.index'));
        } catch (\Exception $e) {
            // Log real error for debugging
            Log::error('Google OAuth failed', [
                'message' => $e->getMessage(),
                'file'    => $e->getFile(),
                'line'    => $e->getLine(),
            ]);

            $debugMsg = config('app.debug')
                ? 'Google OAuth Error: ' . $e->getMessage()
                : 'Gagal login dengan Google. Pastikan popup tidak diblokir lalu coba lagi.';

            return redirect()->route('login')->with('error', $debugMsg);
        }
    }
}
