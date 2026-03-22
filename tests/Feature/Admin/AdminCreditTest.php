<?php

namespace Tests\Feature\Admin;

use App\Models\CreditDetail;
use App\Models\LeasingProvider;
use App\Models\Transaction;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AdminCreditTest extends TestCase
{
    use RefreshDatabase;

    protected $admin;

    protected function setUp(): void
    {
        parent::setUp();
        $this->admin = User::factory()->create([
            'role' => 'admin',
            'email_verified_at' => now(),
        ]);
    }

    /** @test */
    public function credit_index_page_is_accessible_to_admin()
    {
        $this->actingAs($this->admin)->get(route('admin.credits.index'))
            ->assertStatus(200);
    }

    /** @test */
    public function admin_can_verify_documents()
    {
        $credit = CreditDetail::factory()->create(['status' => 'pengajuan_masuk']);

        $response = $this->actingAs($this->admin)->post(route('admin.credits.verify-documents', $credit->id), [
            'notes' => 'All documents are valid',
        ]);

        $response->assertRedirect(route('admin.credits.show', $credit->id));
        $this->assertDatabaseHas('credit_details', [
            'id' => $credit->id,
            'status' => 'verifikasi_dokumen',
            'verification_notes' => 'All documents are valid',
        ]);
    }

    /** @test */
    public function admin_can_send_to_leasing()
    {
        $leasing = LeasingProvider::create(['name' => 'Adira Finance', 'is_active' => true]);
        $credit = CreditDetail::factory()->create(['status' => 'verifikasi_dokumen']);

        $response = $this->actingAs($this->admin)->post(route('admin.credits.send-to-leasing', $credit->id), [
            'leasing_provider_id' => $leasing->id,
            'leasing_application_ref' => 'ADIRA-12345',
        ]);

        $response->assertRedirect(route('admin.credits.show', $credit->id));
        $this->assertDatabaseHas('credit_details', [
            'id' => $credit->id,
            'status' => 'dikirim_ke_leasing',
            'leasing_provider_id' => $leasing->id,
            'reference_number' => 'ADIRA-12345',
        ]);
    }

    /** @test */
    public function admin_can_schedule_survey()
    {
        $credit = CreditDetail::factory()->create(['status' => 'dikirim_ke_leasing']);

        $response = $this->actingAs($this->admin)->post(route('admin.credits.schedule-survey', $credit->id), [
            'survey_scheduled_date' => now()->addDays(2)->format('Y-m-d'),
            'survey_scheduled_time' => '10:00',
            'surveyor_name' => 'John Doe',
            'surveyor_phone' => '081234567890',
        ]);

        $response->assertRedirect(route('admin.credits.show', $credit->id));
        $this->assertDatabaseHas('credit_details', [
            'id' => $credit->id,
            'status' => 'survey_dijadwalkan',
        ]);
        $this->assertDatabaseHas('survey_schedules', [
            'credit_detail_id' => $credit->id,
            'surveyor_name' => 'John Doe',
        ]);
    }

    /** @test */
    public function admin_can_complete_survey()
    {
        $credit = CreditDetail::factory()->create(['status' => 'survey_dijadwalkan']);

        $response = $this->actingAs($this->admin)->post(route('admin.credits.complete-survey', $credit->id), [
            'survey_notes' => 'Survey completed successfully',
        ]);

        $response->assertRedirect(route('admin.credits.show', $credit->id));
        $this->assertDatabaseHas('credit_details', [
            'id' => $credit->id,
            'status' => 'menunggu_keputusan_leasing',
        ]);
    }

    /** @test */
    public function admin_can_approve_credit()
    {
        $credit = CreditDetail::factory()->create(['status' => 'menunggu_keputusan_leasing']);

        $response = $this->actingAs($this->admin)->post(route('admin.credits.approve', $credit->id), [
            'approved_amount' => 20000000,
            'interest_rate' => 5,
        ]);

        $response->assertRedirect(route('admin.credits.show', $credit->id));
        $this->assertDatabaseHas('credit_details', [
            'id' => $credit->id,
            'status' => 'disetujui',
        ]);
        // Also checks if installment number 0 (DP) is created
        $this->assertDatabaseHas('installments', [
            'transaction_id' => $credit->transaction_id,
            'installment_number' => 0,
            'amount' => $credit->dp_amount,
        ]);
    }

    /** @test */
    public function admin_can_record_dp_payment()
    {
        $credit = CreditDetail::factory()->create(['status' => 'disetujui']);

        $response = $this->actingAs($this->admin)->post(route('admin.credits.record-dp-payment', $credit->id), [
            'dp_payment_method' => 'Cash',
        ]);

        $response->assertRedirect(route('admin.credits.show', $credit->id));
        $this->assertDatabaseHas('credit_details', [
            'id' => $credit->id,
            'status' => 'dp_dibayar',
            'dp_payment_method' => 'Cash',
        ]);
        // Transaction status should also update
        $this->assertDatabaseHas('transactions', [
            'id' => $credit->transaction_id,
            'status' => 'pembayaran_dikonfirmasi',
        ]);
    }

    /** @test */
    public function admin_can_complete_credit()
    {
        $credit = CreditDetail::factory()->create(['status' => 'dp_dibayar']);

        $response = $this->actingAs($this->admin)->post(route('admin.credits.complete', $credit->id), [
            'notes' => 'Unit delivered',
        ]);

        $response->assertRedirect(route('admin.credits.show', $credit->id));
        $this->assertDatabaseHas('credit_details', [
            'id' => $credit->id,
            'status' => 'selesai',
            'is_completed' => true,
        ]);
        // Installments should be generated
        $this->assertDatabaseHas('installments', [
            'transaction_id' => $credit->transaction_id,
            'installment_number' => 1,
            'amount' => $credit->monthly_installment,
        ]);
    }
}
