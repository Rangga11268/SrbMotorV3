<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;

use App\Notifications\BenefitNotesUpdated;

class UserController extends Controller
{

    public function index()
    {
        $query = User::query();

        if (request('search')) {
            $query->where('name', 'like', '%' . request('search') . '%')
                ->orWhere('email', 'like', '%' . request('search') . '%');
        }

        $users = $query->paginate(10);

        if (!request()->hasHeader('X-Inertia-Version') && request()->header('X-Requested-With') === 'XMLHttpRequest') {
            return response()->json([
                'users' => $users,
                'filters' => [
                    'search' => request('search'),
                    'current_user_id' => auth()->id(),
                ],
            ]);
        }

        return \Inertia\Inertia::render('Admin/Users/Index', [
            'users' => $users,
            'filters' => [
                'search' => request('search'),
                'current_user_id' => auth()->id(),
            ],
        ]);
    }


    public function update(Request $request, User $user)
    {
        $request->validate([
            'role' => 'required|in:admin,user',
            'benefit_notes' => 'nullable|string|max:1000',
        ]);

        $oldNotes = $user->benefit_notes;

        $user->update([
            'role' => $request->role,
            'benefit_notes' => $request->benefit_notes,
        ]);

        // Send notification if notes are new or changed
        if ($request->benefit_notes && $request->benefit_notes !== $oldNotes) {
            $user->notify(new BenefitNotesUpdated($request->benefit_notes));
        }

        return redirect()->route('admin.users.index')->with('success', 'Data pengguna berhasil diperbarui.');
    }


    public function toggleVerify(User $user)
    {
        if ($user->email_verified_at) {
            $user->email_verified_at = null;
        } else {
            $user->email_verified_at = now();
        }
        $user->save();

        return redirect()->route('admin.users.index')->with('success', 'Status verifikasi berhasil diubah.');
    }


    public function destroy(User $user)
    {

        if ($user->id === auth()->id()) {
            return redirect()->route('admin.users.index')->with('error', 'Anda tidak dapat menghapus akun Anda sendiri.');
        }

        $user->delete();

        return redirect()->route('admin.users.index')->with('success', 'Pengguna berhasil dihapus.');
    }
}
