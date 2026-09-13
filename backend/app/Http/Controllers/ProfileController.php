<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use App\Services\ImageService;
use Illuminate\Validation\Rules\Password;

class ProfileController extends Controller
{


    public function show()
    {
        $user = Auth::user();
        
        // Fetch dashboard summary data
        $latestTransaction = \App\Models\Transaction::where('user_id', $user->id)
            ->latest()
            ->first();

        $nextInstallment = \App\Models\Installment::whereHas('transaction', function($query) use ($user) {
                $query->where('user_id', $user->id);
            })
            ->where('status', 'pending')
            ->orderBy('due_date', 'asc')
            ->first();

        $upcomingService = \App\Models\ServiceAppointment::where('user_id', $user->id)
            ->where('status', '!=', 'cancelled')
            ->where('service_date', '>=', now()->toDateString())
            ->orderBy('service_date', 'asc')
            ->orderBy('service_time', 'asc')
            ->first();

        return \Inertia\Inertia::render('Profile/Show', [
            'user' => $user,
            'dashboard' => [
                'latest_transaction' => $latestTransaction,
                'next_installment' => $nextInstallment,
                'upcoming_service' => $upcomingService,
            ]
        ]);
    }


    public function edit()
    {
        $user = Auth::user();
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
            'profile_photo' => 'nullable|image|mimes:jpg,jpeg,png,webp|max:2048',
        ], [
            'name.required' => 'Nama wajib diisi.',
            'name.max' => 'Nama tidak boleh lebih dari 255 karakter.',
            'email.required' => 'Email wajib diisi.',
            'email.email' => 'Format email tidak valid.',
            'email.unique' => 'Email sudah digunakan oleh pengguna lain.',
        ]);

        $data = [
            'name' => $request->name,
            'email' => $request->email,
            'phone' => $request->phone,
            'nik' => $request->nik,
            'alamat' => $request->alamat,
            'occupation' => $request->pekerjaan,
            'no_hp_backup' => $request->no_hp_backup ?? $user->no_hp_backup,
            'jenis_kelamin' => $request->jenis_kelamin ?? $user->jenis_kelamin,
            'tanggal_lahir' => $request->tanggal_lahir ?? $user->tanggal_lahir,
            'monthly_income' => $request->pendapatan_bulanan ?? $user->monthly_income,
            'nama_ibu_kandung' => $request->nama_ibu_kandung ?? $user->nama_ibu_kandung,
        ];
        
        if ($request->hasFile('profile_photo')) {
            // Delete old photo if it exists and is a local file
            if ($user->profile_photo_path && !str_starts_with($user->profile_photo_path, 'http')) {
                Storage::disk('public')->delete($user->profile_photo_path);
            }
            
            $path = ImageService::uploadAndConvert($request->file('profile_photo'), 'profile-photos');
            $data['profile_photo_path'] = $path;
        }

        $user->update($data);

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
