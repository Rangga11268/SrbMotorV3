<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Transaction extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'user_id',
        'motor_id',
        'transaction_type',
        'status',
        'notes',
        'booking_fee',
        'total_amount',
        'payment_method',
        'payment_status',
        'customer_name',
        'customer_phone',
        'customer_occupation',
        'customer_address',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'booking_fee' => 'decimal:2',
        'total_amount' => 'decimal:2',
    ];

    /**
     * Get the user that owns the transaction.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the motor associated with the transaction.
     */
    public function motor(): BelongsTo
    {
        return $this->belongsTo(Motor::class);
    }

    /**
     * Get the credit details for the transaction (if it's a credit transaction).
     */
    public function creditDetail(): HasOne
    {
        return $this->hasOne(CreditDetail::class);
    }

    /**
     * Get the installments for the transaction.
     */
    public function installments(): HasMany
    {
        return $this->hasMany(Installment::class);
    }

    /**
     * Accessor to get the human-readable status text
     */
    public function getStatusTextAttribute()
    {
        $statusMap = [
            'new_order' => 'Pesanan Baru',
            'waiting_payment' => 'Menunggu Pembayaran',
            'payment_confirmed' => 'Pembayaran Berhasil',
            'unit_preparation' => 'Persiapan Unit',
            'ready_for_delivery' => 'Siap Dikirim',
            'completed' => 'Selesai',
            'cancelled' => 'Dibatalkan',
            'menunggu_persetujuan' => 'Verifikasi Berkas',
            'data_tidak_valid' => 'Perbaiki Dokumen',
            'dikirim_ke_surveyor' => 'Proses Surveyor',
            'jadwal_survey' => 'Jadwal Survey',
            'disetujui' => 'Kredit Disetujui',
            'ditolak' => 'Kredit Ditolak',
        ];

        return $statusMap[$this->status] ?? $this->status;
    }

    /**
     * Accessor to get the human-readable credit status text
     */
    public function getCreditStatusTextAttribute()
    {
        if (!$this->creditDetail) {
            return '';
        }

        $creditMap = [
            'menunggu_persetujuan' => 'Menunggu Persetujuan',
            'data_tidak_valid' => 'Data Tidak Valid',
            'dikirim_ke_surveyor' => 'Dikirim ke Surveyor',
            'jadwal_survey' => 'Jadwal Survey',
            'disetujui' => 'Disetujui',
            'ditolak' => 'Ditolak',
        ];

        return $creditMap[$this->creditDetail->credit_status] ?? $this->creditDetail->credit_status;
    }

    /**
     * Get a unified status for display to the user.
     * Combines transaction status and credit status into a single human-readable string.
     */
    public function getUnifiedStatusAttribute(): string
    {
        // 1. If cancelled or completed, show that immediately
        if ($this->status === 'cancelled') return 'Dibatalkan';
        if ($this->status === 'completed') return 'Selesai';

        // 2. For credit transactions, the credit_status is usually more relevant in the early stages
        if ($this->transaction_type === 'CREDIT' && $this->creditDetail) {
            $creditStatus = $this->creditDetail->credit_status;

            // If it's still in the "order" stage but credit is already processed
            if ($this->status === 'new_order' || $this->status === 'menunggu_persetujuan' || $this->status === 'waiting_payment') {
                $creditMap = [
                    'menunggu_persetujuan' => 'Verifikasi Berkas',
                    'data_tidak_valid' => 'Perbaiki Dokumen',
                    'dikirim_ke_surveyor' => 'Proses Surveyor',
                    'jadwal_survey' => 'Jadwal Survey',
                    'disetujui' => 'Kredit Disetujui',
                    'ditolak' => 'Kredit Ditolak',
                ];
                return $creditMap[$creditStatus] ?? 'Proses Verifikasi';
            }
        }

        // 3. Fallback to standard transaction statuses
        $statusMap = [
            'new_order' => 'Pesanan Baru',
            'waiting_payment' => 'Menunggu Pembayaran',
            'payment_confirmed' => 'Pembayaran Berhasil',
            'unit_preparation' => 'Persiapan Unit',
            'ready_for_delivery' => 'Siap Dikirim',
        ];

        return $statusMap[$this->status] ?? $this->status;
    }
}