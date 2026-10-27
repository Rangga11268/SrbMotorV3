<?php

namespace App\Http\Controllers;

use App\Models\Motor;
use App\Models\Wishlist;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class WishlistController extends Controller
{
    /**
     * Get list of favorited motor IDs for the authenticated user.
     */
    public function index(Request $request): JsonResponse
    {
        $user = $request->user();
        if (!$user) {
            return response()->json([
                'success' => true,
                'wishlist' => [],
                'count' => 0,
            ]);
        }

        $wishlistIds = $user->wishlists()->pluck('motor_id')->map(fn($id) => (int)$id)->toArray();

        return response()->json([
            'success' => true,
            'wishlist' => $wishlistIds,
            'count' => count($wishlistIds),
        ]);
    }

    /**
     * Toggle add/remove motor from user's wishlist.
     */
    public function toggle(Request $request): JsonResponse
    {
        $request->validate([
            'motor_id' => 'required|exists:motors,id',
        ]);

        $user = $request->user();
        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'Silakan masuk terlebih dahulu untuk menyimpan motor favorit.',
            ], 401);
        }

        $motorId = (int)$request->motor_id;
        $existing = Wishlist::where('user_id', $user->id)
            ->where('motor_id', $motorId)
            ->first();

        if ($existing) {
            $existing->delete();
            $isWishlisted = false;
            $message = 'Motor dihapus dari favorit.';
        } else {
            Wishlist::create([
                'user_id' => $user->id,
                'motor_id' => $motorId,
            ]);
            $isWishlisted = true;
            $message = 'Motor ditambahkan ke favorit.';
        }

        $wishlistIds = $user->wishlists()->pluck('motor_id')->map(fn($id) => (int)$id)->toArray();

        return response()->json([
            'success' => true,
            'is_wishlisted' => $isWishlisted,
            'motor_id' => $motorId,
            'wishlist' => $wishlistIds,
            'count' => count($wishlistIds),
            'message' => $message,
        ]);
    }
}
