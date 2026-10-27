<?php

namespace App\Models;

use Laravel\Sanctum\HasApiTokens;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Support\Facades\Crypt;

class User extends Authenticatable implements MustVerifyEmail
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasApiTokens, HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'role',
        'google_id',
        'profile_photo_path',
        'phone',
        'alamat',
        'nik',
        'occupation',
        'monthly_income',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    /**
     * Resilient encrypted NIK accessor/mutator (gracefully handles unencrypted legacy rows)
     */
    protected function nik(): Attribute
    {
        return Attribute::make(
            get: function ($value) {
                if (!$value) return null;
                try {
                    return Crypt::decryptString($value);
                } catch (\Throwable) {
                    return $value;
                }
            },
            set: function ($value) {
                if (!$value) return null;
                try {
                    Crypt::decryptString($value);
                    return $value;
                } catch (\Throwable) {
                    return Crypt::encryptString($value);
                }
            }
        );
    }

    /**
     * Check if the user has admin role (Owner inherits admin role)
     */
    public function isAdmin(): bool
    {
        return in_array($this->role, ['admin', 'owner', 'montir']);
    }

    /**
     * Check if the user is explicitly set as Owner (Super Admin)
     */
    public function isOwner(): bool
    {
        return $this->role === 'owner';
    }

    /**
     * Check if the user is a Montir (mechanic)
     */
    public function isMontir(): bool
    {
        return $this->role === 'montir';
    }

    /**
     * Check if the user has access to admin OR montir area
     */
    public function hasStaffAccess(): bool
    {
        return in_array($this->role, ['admin', 'owner', 'montir']);
    }
}
