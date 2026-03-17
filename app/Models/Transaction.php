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
        'name',
        'nik',
        'phone',
        'email',
        'address',
        'delivery_method',
        'delivery_date',
        'motor_color',
        'occupation',
        'monthly_income',
        'employment_duration',
        'reference_number',
        'transaction_type',
        'status',
        'motor_price',
        'booking_fee',
        'total_price',
        'discount_amount',
        'final_price',
        'payment_method',
        'payment_date',
        'payment_proof',
        'cancelled_at',
        'cancellation_reason',
        'notes',
    ];

    /**
     * The attributes that should be appends to the model's array form.
     *
     * @var array
     */
    protected $appends = [
        'customer_name',
        'customer_phone',
        'customer_occupation',
        'customer_address',
        'status_text',
        'unified_status',
        'total_amount'
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'motor_price' => 'decimal:2',
        'booking_fee' => 'decimal:2',
        'total_price' => 'decimal:2',
        'discount_amount' => 'decimal:2',
        'final_price' => 'decimal:2',
        'monthly_income' => 'decimal:2',
        'payment_date' => 'datetime',
        'delivery_date' => 'date',
        'cancelled_at' => 'datetime',
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
     * Get the logs for the transaction.
     */
    public function logs(): HasMany
    {
        return $this->hasMany(TransactionLog::class);
    }

    /**
     * Accessor to get the human-readable status text
     */
    public function getStatusTextAttribute()
    {
        $statusMap = [
            'new_order' => 'Pesanan Masuk',
            'waiting_payment' => 'Menunggu Pembayaran',
            'pembayaran_dikonfirmasi' => 'Pembayaran Dikonfirmasi',
            'unit_preparation' => 'Motor Disiapkan',
            'ready_for_delivery' => 'Motor Siap Dikirim/Ambil',
            'dalam_pengiriman' => 'Dalam Pengiriman',
            'completed' => 'Pesanan Selesai',
            'cancelled' => 'Dibatalkan',
            'menunggu_persetujuan' => 'Verifikasi Berkas',
            'data_tidak_valid' => 'Perbaiki Dokumen',
            'dikirim_ke_surveyor' => 'Proses Surveyor',
            'jadwal_survey' => 'Jadwal Survey',
            'disetujui' => 'Kredit Disetujui',
            'ditolak' => 'Kredit Ditolak',
            'waiting_credit_approval' => 'Menunggu Persetujuan Kredit',
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
            'pengajuan_masuk' => 'Pengajuan Masuk',
            'menunggu_persetujuan' => 'Menunggu Persetujuan',
            'data_tidak_valid' => 'Data Tidak Valid',
            'dikirim_ke_surveyor' => 'Dikirim ke Surveyor',
            'jadwal_survey' => 'Jadwal Survey',
            'disetujui' => 'Disetujui',
            'ditolak' => 'Ditolak',
        ];

        return $creditMap[$this->creditDetail->status] ?? $this->creditDetail->status;
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

        // 2. For credit transactions, the status is usually more relevant in the early stages
        if ($this->transaction_type === 'CREDIT' && $this->creditDetail) {
            $creditStatus = $this->creditDetail->status;

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
            'new_order' => 'Pesanan Masuk',
            'waiting_payment' => 'Menunggu Pembayaran',
            'pembayaran_dikonfirmasi' => 'Pembayaran Dikonfirmasi',
            'unit_preparation' => 'Motor Disiapkan',
            'ready_for_delivery' => 'Motor Siap Dikirim/Ambil',
            'dalam_pengiriman' => 'Dalam Pengiriman',
            'waiting_credit_approval' => 'Menunggu Persetujuan Kredit',
        ];

        return $statusMap[$this->status] ?? $this->status;
    }

    /**
     * Backward compatibility accessors for old frontend field names
     */
    public function getCustomerNameAttribute()
    {
        return $this->name ?? $this->user->name ?? '';
    }

    public function getCustomerPhoneAttribute()
    {
        return $this->phone ?? $this->user->phone ?? '';
    }

    public function getCustomerOccupationAttribute()
    {
        return $this->occupation ?? '';
    }

    public function getCustomerAddressAttribute()
    {
        return $this->address ?? '';
    }

    /**
     * Accessor for total_amount (calculated from installments or final_price)
     */
    public function getTotalAmountAttribute()
    {
        if ($this->status === 'cancelled') {
            return 0.0;
        }
        // For CASH, it's the final price minus paid installments
        // For CREDIT, it depends on what we want to show (usually remaining balance)
        // Given the UI shows it as "Sisa Kewajiban", we calculate unpaid installments
        return (float) $this->installments()->where('status', '!=', 'paid')->sum(\Illuminate\Support\Facades\DB::raw('amount + penalty_amount'));
    }
}
