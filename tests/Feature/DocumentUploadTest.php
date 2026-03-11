<?php

namespace Tests\Feature;

use App\Models\CreditDetail;
use App\Models\Motor;
use App\Models\Transaction;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class DocumentUploadTest extends TestCase
{
    use RefreshDatabase;

    /**
     * Test upload documents page can be rendered.
     */
    public function test_upload_documents_page_can_be_rendered()
    {
        $user = User::factory()->create();
        $motor = Motor::factory()->create();
        $transaction = Transaction::create([
            'user_id' => $user->id,
            'motor_id' => $motor->id,
            'transaction_type' => 'CREDIT',
            'status' => 'menunggu_persetujuan',
            'total_amount' => $motor->price,
            'payment_method' => 'transfer',
            'payment_status' => 'pending',
            'customer_name' => 'Test User',
            'customer_phone' => '081234567890',
            'customer_occupation' => 'Employee',
        ]);
        
        CreditDetail::create([
            'transaction_id' => $transaction->id,
            'dp_amount' => 1000000,
            'tenor' => 12,
            'monthly_installment' => 1000000,
            'status' => 'menunggu_persetujuan',
        ]);

        $response = $this->actingAs($user)->get(route('motors.upload-credit-documents', $transaction));

        $response->assertStatus(200);
        $response->assertViewIs('pages.motors.upload_credit_documents');
        $response->assertViewHas('transaction', $transaction);
    }

    /**
     * Test upload documents validation errors.
     */
    public function test_upload_documents_validation_errors()
    {
        $user = User::factory()->create();
        $motor = Motor::factory()->create();
        $transaction = Transaction::create([
            'user_id' => $user->id,
            'motor_id' => $motor->id,
            'transaction_type' => 'CREDIT',
            'status' => 'menunggu_persetujuan',
            'total_amount' => $motor->price,
            'payment_method' => 'transfer',
            'payment_status' => 'pending',
            'customer_name' => 'Test User',
            'customer_phone' => '081234567890',
            'customer_occupation' => 'Employee',
        ]);
        
        CreditDetail::create([
            'transaction_id' => $transaction->id,
            'dp_amount' => 1000000,
            'tenor' => 12,
            'monthly_installment' => 1000000,
            'status' => 'menunggu_persetujuan',
        ]);

        $response = $this->actingAs($user)->post(route('motors.upload-credit-documents', $transaction), [
            'documents' => [],
        ]);

        $response->assertSessionHasErrors(['documents.KTP', 'documents.KK', 'documents.SLIP_GAJI']);
    }

    /**
     * Test upload documents file validation.
     */
    public function test_upload_documents_file_validation()
    {
        Storage::fake('public');
        
        $user = User::factory()->create();
        $motor = Motor::factory()->create();
        $transaction = Transaction::create([
            'user_id' => $user->id,
            'motor_id' => $motor->id,
            'transaction_type' => 'CREDIT',
            'status' => 'menunggu_persetujuan',
            'total_amount' => $motor->price,
            'payment_method' => 'transfer',
            'payment_status' => 'pending',
            'customer_name' => 'Test User',
            'customer_phone' => '081234567890',
            'customer_occupation' => 'Employee',
        ]);
        
        CreditDetail::create([
            'transaction_id' => $transaction->id,
            'dp_amount' => 1000000,
            'tenor' => 12,
            'monthly_installment' => 1000000,
            'status' => 'menunggu_persetujuan',
        ]);

        $response = $this->actingAs($user)->post(route('motors.upload-credit-documents', $transaction), [
            'documents' => [
                'KTP' => [UploadedFile::fake()->create('not-an-image.txt', 100)],
                'KK' => [UploadedFile::fake()->create('large-image.jpg', 3000)], // > 2MB
                'SLIP_GAJI' => [UploadedFile::fake()->image('slip_gaji.jpg')],
            ],
        ]);

        $response->assertSessionHasErrors(['documents.KTP.0', 'documents.KK.0']);
    }

    /**
     * Test user can upload documents.
     */
    public function test_user_can_upload_documents()
    {
        Storage::fake('public');
        
        $user = User::factory()->create();
        $motor = Motor::factory()->create();
        $transaction = Transaction::create([
            'user_id' => $user->id,
            'motor_id' => $motor->id,
            'transaction_type' => 'CREDIT',
            'status' => 'menunggu_persetujuan',
            'total_amount' => $motor->price,
            'payment_method' => 'transfer',
            'payment_status' => 'pending',
            'customer_name' => 'Test User',
            'customer_phone' => '081234567890',
            'customer_occupation' => 'Employee',
        ]);
        
        $creditDetail = CreditDetail::create([
            'transaction_id' => $transaction->id,
            'dp_amount' => 1000000,
            'tenor' => 12,
            'monthly_installment' => 1000000,
            'status' => 'menunggu_persetujuan',
        ]);

        $response = $this->actingAs($user)->post(route('motors.upload-credit-documents', $transaction), [
            'documents' => [
                'KTP' => [UploadedFile::fake()->image('ktp.jpg')],
                'KK' => [UploadedFile::fake()->image('kk.jpg')],
                'SLIP_GAJI' => [UploadedFile::fake()->image('slip_gaji.jpg')],
            ],
        ]);

        $response->assertRedirect(route('motors.order.confirmation', $transaction));
        
        $this->assertDatabaseHas('documents', [
            'credit_detail_id' => $creditDetail->id,
            'document_type' => 'KTP',
        ]);
        
        $this->assertDatabaseHas('documents', [
            'credit_detail_id' => $creditDetail->id,
            'document_type' => 'KK',
        ]);
        
        $this->assertDatabaseHas('documents', [
            'credit_detail_id' => $creditDetail->id,
            'document_type' => 'SLIP_GAJI',
        ]);
    }
}
