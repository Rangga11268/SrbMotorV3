<?php

namespace Tests\Unit\Services;

use App\Models\CreditDetail;
use App\Models\LeasingProvider;
use App\Models\Transaction;
use App\Models\User;
use App\Services\CreditService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase as BaseTestCase;

class CreditServiceTest extends BaseTestCase
{
    use RefreshDatabase;

    protected CreditService $creditService;
    protected CreditDetail $credit;
    protected User $user;

    protected function setUp(): void
    {
        parent::setUp();

        $this->creditService = new CreditService();

        // Create test data
        $this->user = User::factory()->create();

        $transaction = Transaction::factory()->create([
            'user_id' => $this->user->id,
            'final_price' => 100000000,
        ]);

        $this->credit = CreditDetail::create([
            'transaction_id' => $transaction->id,
            'status' => 'pengajuan_masuk',
            'dp_amount' => 10000000,
            'tenor' => 24,
            'monthly_installment' => 4000000,
            'interest_rate' => 0.015,
            'reference_number' => 'REF-' . uniqid(),
        ]);
    }

    public function test_mark_application_received(): void
    {
        $result = $this->creditService->markApplicationReceived($this->credit);

        $this->assertTrue($result);
        $this->credit->refresh();
        $this->assertEquals('pengajuan_masuk', $this->credit->status);
    }

    public function test_verify_documents(): void
    {
        $notes = 'All documents verified successfully';
        $result = $this->creditService->verifyDocuments($this->credit, $notes);

        $this->assertTrue($result);
        $this->credit->refresh();
        $this->assertEquals('verifikasi_dokumen', $this->credit->status);
        $this->assertEquals($notes, $this->credit->verification_notes);
    }

    public function test_reject_document(): void
    {
        $reason = 'Missing required documents';
        $result = $this->creditService->rejectDocument($this->credit, $reason);

        $this->assertTrue($result);
        $this->credit->refresh();
        $this->assertEquals('ditolak', $this->credit->status);
        $this->assertEquals($reason, $this->credit->verification_notes);
    }

    public function test_send_to_leasing(): void
    {
        $this->credit->update(['status' => 'verifikasi_dokumen']);

        $leasingProvider = LeasingProvider::factory()->create();
        $appRef = 'LEASE-001-2024';

        $result = $this->creditService->sendToLeasing(
            $this->credit,
            $leasingProvider->id,
            $appRef
        );

        $this->assertTrue($result);
        $this->credit->refresh();
        $this->assertEquals('dikirim_ke_leasing', $this->credit->status);
        $this->assertEquals($leasingProvider->id, $this->credit->leasing_provider_id);
    }

    public function test_schedule_survey(): void
    {
        $date = '2024-03-20';
        $result = $this->creditService->scheduleSurvey($this->credit, $date);

        $this->assertTrue($result);
        $this->credit->refresh();
        $this->assertEquals('survey_dijadwalkan', $this->credit->status);
        $this->assertEquals($date, $this->credit->survey_scheduled_date->format('Y-m-d'));
    }

    public function test_complete_survey(): void
    {
        $notes = 'Customer seems reliable';
        $result = $this->creditService->completeSurvey($this->credit, $notes);

        $this->assertTrue($result);
        $this->credit->refresh();
        $this->assertEquals('menunggu_keputusan_leasing', $this->credit->status);
        $this->assertEquals($notes, $this->credit->survey_notes);
    }

    public function test_approve_credit(): void
    {
        $result = $this->creditService->approveCredit($this->credit);

        $this->assertTrue($result);
        $this->credit->refresh();
        $this->assertEquals('disetujui', $this->credit->status);
    }

    public function test_reject_credit(): void
    {
        $reason = 'Low income';
        $result = $this->creditService->rejectCredit($this->credit, $reason);

        $this->assertTrue($result);
        $this->credit->refresh();
        $this->assertEquals('ditolak', $this->credit->status);
        $this->assertEquals($reason, $this->credit->verification_notes);
    }

    public function test_record_dp_payment(): void
    {
        $method = 'bank_transfer';
        $result = $this->creditService->recordDPPayment($this->credit, $method);

        $this->assertTrue($result);
        $this->credit->refresh();
        $this->assertEquals('dp_dibayar', $this->credit->status);
        $this->assertEquals($method, $this->credit->dp_payment_method);
    }

    public function test_complete_credit(): void
    {
        $notes = 'Credit fully processed';
        $result = $this->creditService->completeCredit($this->credit, $notes);

        $this->assertTrue($result);
        $this->credit->refresh();
        $this->assertEquals('selesai', $this->credit->status);
        $this->assertEquals($notes, $this->credit->completion_notes);
        $this->assertTrue($this->credit->is_completed);
    }
}
