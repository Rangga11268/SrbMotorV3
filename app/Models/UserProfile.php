<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class UserProfile extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'alamat',
        'nik',
        'no_ktp',
        'no_hp_backup',
        'jenis_kelamin',
        'tanggal_lahir',
        'pekerjaan',
        'pendapatan_bulanan',
        'nama_ibu_kandung',
    ];

    /**
     * Get the user that owns the profile.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
