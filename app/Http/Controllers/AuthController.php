<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use App\Models\User;

class AuthController extends Controller
{


    public function showLoginForm()
    {
        return \Inertia\Inertia::render('Auth/Login');
    }


    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ], [
            'email.required' => 'Email wajib diisi.',
            'email.email' => 'Format email tidak valid.',
            'password.required' => 'Kata sandi wajib diisi.',
        ]);

        if (Auth::attempt($request->only('email', 'password'), $request->filled('remember'))) {
            $request->session()->regenerate();


            if (Auth::user()->isAdmin()) {
                return \Inertia\Inertia::location(route('admin.dashboard'));
            }

            $intended = redirect()->intended('/')->getTargetUrl();
            if (str_contains($intended, '/admin')) {
                return \Inertia\Inertia::location($intended);
            }
            return redirect()->to($intended);
        }


        $user = User::where('email', $request->email)->first();

        if (!$user) {
            return back()->withErrors([
                'email' => 'Email tidak ditemukan. Silakan periksa kembali email Anda atau buat akun baru.',
            ])->withInput();
        }


        return back()->withErrors([
            'password' => 'Kata sandi yang Anda masukkan salah. Silakan coba lagi.',
        ])->withInput();
    }


    public function logout(Request $request)
    {
        Auth::logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect('/');
    }


    public function showRegistrationForm()
    {
        return \Inertia\Inertia::render('Auth/Register');
    }


    public function register(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8|confirmed',
        ], [
            'name.required' => 'Nama wajib diisi.',
            'name.string' => 'Nama harus berupa teks.',
            'name.max' => 'Nama tidak boleh lebih dari 255 karakter.',
            'email.required' => 'Email wajib diisi.',
            'email.string' => 'Email harus berupa teks yang valid.',
            'email.email' => 'Format email tidak valid.',
            'email.max' => 'Email tidak boleh lebih dari 255 karakter.',
            'email.unique' => 'Email sudah terdaftar. Gunakan email lain.',
            'password.required' => 'Kata sandi wajib diisi.',
            'password.string' => 'Kata sandi harus berupa teks.',
            'password.min' => 'Kata sandi minimal harus 8 karakter.',
            'password.confirmed' => 'Konfirmasi kata sandi tidak cocok.',
        ]);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'role' => 'user', // Default role
        ]);

        $user->profile()->create();

        Auth::login($user);

        // Send email verification notification
        $user->sendEmailVerificationNotification();

        return redirect()->route('verification.notice')->with('status', 'Silakan verifikasi email Anda untuk melanjutkan.');
    }
}
