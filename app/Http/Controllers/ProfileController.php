<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rules\Password;

class ProfileController extends Controller
{


    public function show()
    {
        $user = Auth::user()->load('profile');
        return \Inertia\Inertia::render('Profile/Show', compact('user'));
    }


    public function edit()
    {
        $user = Auth::user()->load('profile');
        return \Inertia\Inertia::render('Profile/Edit', compact('user'));
    }


    public function update(Request $request)
    {
        $user = Auth::user();

        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email,' . $user->id,
            'nik' => 'nullable|string|max:20',
            'phone' => 'nullable|string|max:20',
            'alamat' => 'nullable|string|max:500',
            'pekerjaan' => 'nullable|string|max:255',
        ], [
            'name.required' => 'Nama wajib diisi.',
            'name.max' => 'Nama tidak boleh lebih dari 255 karakter.',
            'email.required' => 'Email wajib diisi.',
            'email.email' => 'Format email tidak valid.',
            'email.unique' => 'Email sudah digunakan oleh pengguna lain.',
        ]);

        $user->update([
            'name' => $request->name,
            'email' => $request->email,
            'phone' => $request->phone,
        ]);

        $user->profile()->updateOrCreate(
            ['user_id' => $user->id],
            [
                'nik' => $request->nik,
                'alamat' => $request->alamat,
                'pekerjaan' => $request->pekerjaan,
                'no_ktp' => $request->no_ktp ?? $user->profile?->no_ktp,
                'no_hp_backup' => $request->no_hp_backup ?? $user->profile?->no_hp_backup,
                'jenis_kelamin' => $request->jenis_kelamin ?? $user->profile?->jenis_kelamin,
                'tanggal_lahir' => $request->tanggal_lahir ?? $user->profile?->tanggal_lahir,
                'pendapatan_bulanan' => $request->pendapatan_bulanan ?? $user->profile?->pendapatan_bulanan,
                'nama_ibu_kandung' => $request->nama_ibu_kandung ?? $user->profile?->nama_ibu_kandung,
            ]
        );

        return redirect()->route('profile.edit')->with('success', 'Profil berhasil diperbarui.');
    }


    public function updatePassword(Request $request)
    {
        $user = Auth::user();

        $request->validate([
            'current_password' => 'required',
            'password' => ['required', 'confirmed', Password::min(8)],
        ], [
            'current_password.required' => 'Password saat ini wajib diisi.',
            'password.required' => 'Password baru wajib diisi.',
            'password.confirmed' => 'Konfirmasi password tidak cocok.',
            'password.min' => 'Password minimal harus 8 karakter.',
        ]);


        if (!Hash::check($request->current_password, $user->password)) {
            return back()->withErrors([
                'current_password' => 'Password saat ini tidak sesuai.'
            ]);
        }


        $user->password = Hash::make($request->password);
        $user->save();

        return redirect()->route('profile.edit')->with('success', 'Password berhasil diperbarui.');
    }
}
