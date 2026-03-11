<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreTransactionRequest extends FormRequest
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
            'booking_fee' => 'nullable|numeric|min:0|lt:final_price',
            'final_price' => 'required|numeric|min:0',
            'payment_method' => 'nullable|string',
            'payment_status' => 'nullable|in:pending,confirmed,failed',
            'name' => 'nullable|string|max:255',
            'phone' => 'nullable|string|max:20',
            'occupation' => 'nullable|string|max:255',
        ];

        if ($this->transaction_type === 'CREDIT') {
            $rules = array_merge($rules, [
                'credit_detail.dp_amount' => 'required|numeric|min:0',
                'credit_detail.tenor' => 'required|integer|min:1',
                'credit_detail.monthly_installment' => 'required|numeric|min:0',
                'credit_detail.status' => 'required|in:menunggu_persetujuan,data_tidak_valid,dikirim_ke_surveyor,jadwal_survey,disetujui,ditolak',
                'credit_detail.approved_amount' => 'nullable|numeric|min:0',
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
        ];
    }
}
