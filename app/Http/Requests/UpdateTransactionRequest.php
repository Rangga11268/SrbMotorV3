<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateTransactionRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $rules = [
            'user_id' => 'required|exists:users,id',
            'motor_id' => 'required|exists:motors,id',
            'transaction_type' => 'required|in:CASH,CREDIT',
            'status' => 'required',
            'notes' => 'nullable|string',
            'booking_fee' => 'nullable|numeric|min:0|lt:total_amount',
            'total_amount' => 'required|numeric|min:0',
            'payment_method' => 'nullable|string',
            'payment_status' => 'nullable|in:pending,confirmed,failed',
            'customer_name' => 'nullable|string|max:255',
            'customer_phone' => 'nullable|string|regex:/^[\+]?[0-9\s\-\(\)]+$/|max:20',
            'customer_occupation' => 'nullable|string|max:255',
            'customer_address' => 'nullable|string|max:1000',
        ];

        if ($this->transaction_type === 'CREDIT') {
             $rules = array_merge($rules, [
                'credit_detail.down_payment' => 'required|numeric|min:0|lt:total_amount',
                'credit_detail.tenor' => 'required|integer|min:1',
                'credit_detail.monthly_installment' => 'required|numeric|min:0',
                'credit_detail.credit_status' => 'required|in:menunggu_persetujuan,data_tidak_valid,dikirim_ke_surveyor,jadwal_survey,disetujui,ditolak',
                'credit_detail.approved_amount' => 'nullable|numeric|min:0|lte:total_amount',
            ]);
        }

        return $rules;
    }

    /**
     * Get custom messages for validator errors.
     *
     * @return array
     */
    public function messages(): array
    {
        return [
            'booking_fee.lt' => 'Booking fee harus lebih kecil dari total harga.',
            'credit_detail.down_payment.lt' => 'Uang muka harus lebih kecil dari total harga motor.',
            'credit_detail.approved_amount.lte' => 'Jumlah disetujui tidak boleh lebih besar dari total harga motor.',
        ];
    }
}
