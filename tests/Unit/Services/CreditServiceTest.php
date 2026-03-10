<?php

namespace Tests\Unit\Services;

use App\Models\CreditDetail;
use App\Models\LeasingProvider;
use App\Models\Transaction;
use App\Models\User;
use App\Services\CreditService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use PHPUnit\Framework\TestCase;
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
            'customer_id' => $this->user->id,
            'credit_amount' => 100000000,
        ]);

        $this->credit = CreditDetail::create([
            'transaction_id' => $transaction->id,
            'credit_status' => 'pengajuan_masuk',
            'down_payment' => 10000000,
            'tenor' => 24,
            'monthly_installment' => 4000000,
            'interest_rate' => 0.015,
        ]);
    }

    /**
     * Test marking application as received
     */
    public function test_mark_application_received(): void
    {
        $result = $this->creditService->markApplicationReceived($this->credit);

        $this->assertTrue($result);
        $this->credit->refresh();
        $this->assertEquals('pengajuan_masuk', $this->credit->credit_status);
    }

    /**
     * Test document verification
     */
    public function test_verify_documents(): void
    {
        $notes = 'All documents verified successfully';
        $result = $this->creditService->verifyDocuments($this->credit, $notes);

        $this->assertTrue($result);
        $this->credit->refresh();
        $this->assertEquals('verifikasi_dokumen', $this->credit->credit_status);
        $this->assertEquals($notes, $this->credit->internal_notes);
    }

    /**
     * Test rejecting document
     */
    public function test_reject_document(): void
    {
        $reason = 'Missing required documents';
        $result = $this->creditService->rejectDocument($this->credit, $reason);

        $this->assertTrue($result);
        $this->credit->refresh();
        $this->assertEquals('ditolak', $this->credit->credit_status);
        $this->assertEquals($reason, $this->credit->rejection_reason);
    }

    /**
     * Test sending to leasing company
     */
    public function test_send_to_leasing(): void
    {
        $this->credit->update(['credit_status' => 'verifikasi_dokumen']);

        $leasingProvider = LeasingProvider::factory()->create();
        $appRef = 'LEASE-001-2024';

        $result = $this->creditService->sendToLeasing(
            $this->credit,
            $leasingProvider->id,
            $appRef
        );

        $this->assertTrue($result);
        $this->credit->refresh();
        $this->assertEquals('dikirim_ke_leasing', $this->credit->credit_status);
        $this->assertEquals($leasingProvider->id, $this->credit->leasing_provider_id);
        $this->assertEquals($appRef, $this->credit->leasing_application_ref);
    }

    /**
     * Test scheduling survey
     */
    public function test_schedule_survey(): void
    {
        $this->credit->update(['credit_status' => 'dikirim_ke_leasing']);

        $scheduledDate = '2024-12-20';
        $scheduledTime = '10:00';
        $surveyorName = 'John Surveyor';
        $surveyorPhone = '081234567890';

        $result = $this->creditService->scheduleSurvey(
            $this->credit,
            $scheduledDate,
            $scheduledTime,
            $surveyorName,
            $surveyorPhone
        );

        $this->assertTrue($result);
        $this->credit->refresh();
        $this->assertEquals('survey_dijadwalkan', $this->credit->credit_status);
        $this->assertEquals($scheduledDate, $this->credit->survey_scheduled_date->format('Y-m-d'));
        $this->assertEquals($scheduledTime, $this->credit->survey_scheduled_time);
        $this->assertEquals($surveyorName, $this->credit->surveyor_name);
        $this->assertEquals($surveyorPhone, $this->credit->surveyor_phone);
    }

    /**
     * Test starting survey
     */
    public function test_start_survey(): void
    {
        $this->credit->update(['credit_status' => 'survey_dijadwalkan']);

        $result = $this->creditService->startSurvey($this->credit);

        $this->assertTrue($result);
        $this->credit->refresh();
        $this->assertEquals('survey_berjalan', $this->credit->credit_status);
    }

    /**
     * Test completing survey
     */
    public function test_complete_survey(): void
    {
        $this->credit->update(['credit_status' => 'survey_berjalan']);

        $surveyNotes = 'Survey completed without issues. Condition of collateral is good.';

        $result = $this->creditService->completeSurvey($this->credit, $surveyNotes);

        $this->assertTrue($result);
        $this->credit->refresh();
        $this->assertEquals('menunggu_keputusan_leasing', $this->credit->credit_status);
        $this->assertEquals($surveyNotes, $this->credit->survey_notes);
        $this->assertNotNull($this->credit->survey_completed_at);
    }

    /**
     * Test approving credit
     */
    public function test_approve_credit(): void
    {
        $this->credit->update(['credit_status' => 'menunggu_keputusan_leasing']);

        $approvedAmount = 95000000;
        $interestRate = 0.015;

        $result = $this->creditService->approveCredit(
            $this->credit,
            $approvedAmount,
            $interestRate
        );

        $this->assertTrue($result);
        $this->credit->refresh();
        $this->assertEquals('disetujui', $this->credit->credit_status);
        $this->assertEquals($approvedAmount, $this->credit->approved_amount);
        $this->assertEquals($interestRate, $this->credit->interest_rate);
        $this->assertNotNull($this->credit->leasing_decision_date);
    }

    /**
     * Test rejecting credit
     */
    public function test_reject_credit(): void
    {
        $this->credit->update(['credit_status' => 'menunggu_keputusan_leasing']);

        $reason = 'Insufficient income';

        $result = $this->creditService->rejectCredit($this->credit, $reason);

        $this->assertTrue($result);
        $this->credit->refresh();
        $this->assertEquals('ditolak', $this->credit->credit_status);
        $this->assertEquals($reason, $this->credit->rejection_reason);
        $this->assertNotNull($this->credit->leasing_decision_date);
    }

    /**
     * Test recording DP payment
     */
    public function test_record_dp_payment(): void
    {
        $this->credit->update(['credit_status' => 'disetujui']);

        $paymentMethod = 'bank_transfer';

        $result = $this->creditService->recordDPPayment(
            $this->credit,
            $paymentMethod,
            $this->user
        );

        $this->assertTrue($result);
        $this->credit->refresh();
        $this->assertEquals('dp_dibayar', $this->credit->credit_status);
        $this->assertEquals($paymentMethod, $this->credit->dp_payment_method);
        $this->assertEquals($this->user->id, $this->credit->dp_confirmed_by);
        $this->assertNotNull($this->credit->dp_paid_date);
    }

    /**
     * Test completing credit
     */
    public function test_complete_credit(): void
    {
        $this->credit->update(['credit_status' => 'dp_dibayar']);

        $notes = 'Credit process completed successfully';

        $result = $this->creditService->completeCredit($this->credit, $notes);

        $this->assertTrue($result);
        $this->credit->refresh();
        $this->assertEquals('selesai', $this->credit->credit_status);
        $this->assertEquals($notes, $this->credit->internal_notes);
    }

    /**
     * Test getting available transitions
     */
    public function test_get_available_transitions(): void
    {
        $transitions = $this->creditService->getAvailableTransitions($this->credit);

        $this->assertIsArray($transitions);
        $this->assertArrayHasKey('verifikasi_dokumen', $transitions);
        $this->assertArrayHasKey('ditolak', $transitions);
    }

    /**
     * Test getting status info
     */
    public function test_get_status_info(): void
    {
        $info = $this->creditService->getStatusInfo('disetujui');

        $this->assertIsArray($info);
        $this->assertArrayHasKey('label', $info);
        $this->assertArrayHasKey('badge', $info);
        $this->assertArrayHasKey('icon', $info);
        $this->assertEquals('Approved', $info['label']);
        $this->assertEquals('success', $info['badge']);
    }

    /**
     * Test getting timeline
     */
    public function test_get_timeline(): void
    {
        // Set up timeline data
        $this->credit->update([
            'credit_status' => 'disetujui',
            'survey_scheduled_date' => now()->addDays(5),
            'survey_completed_at' => now()->addDays(7),
            'leasing_decision_date' => now()->addDays(9),
        ]);

        $timeline = $this->creditService->getTimeline($this->credit);

        $this->assertIsArray($timeline);
        $this->assertGreaterThan(0, count($timeline));

        // Verify timeline structure
        foreach ($timeline as $item) {
            $this->assertArrayHasKey('date', $item);
            $this->assertArrayHasKey('status', $item);
            $this->assertArrayHasKey('label', $item);
            $this->assertArrayHasKey('notes', $item);
        }
    }

    /**
     * Test full credit flow
     */
    public function test_full_credit_flow(): void
    {
        // step 1: Application received (initial state)
        $this->assertEquals('pengajuan_masuk', $this->credit->credit_status);

        // Step 2: Verify documents
        $this->creditService->verifyDocuments($this->credit, 'Documents verified');
        $this->credit->refresh();
        $this->assertEquals('verifikasi_dokumen', $this->credit->credit_status);

        // Step 3: Send to leasing
        $leasing = LeasingProvider::factory()->create();
        $this->creditService->sendToLeasing($this->credit, $leasing->id, 'REF-001');
        $this->credit->refresh();
        $this->assertEquals('dikirim_ke_leasing', $this->credit->credit_status);

        // Step 4: Schedule survey
        $this->creditService->scheduleSurvey(
            $this->credit,
            now()->addDays(5)->format('Y-m-d'),
            '10:00',
            'Surveyor Name',
            '081234567890'
        );
        $this->credit->refresh();
        $this->assertEquals('survey_dijadwalkan', $this->credit->credit_status);

        // Step 5: Start survey
        $this->creditService->startSurvey($this->credit);
        $this->credit->refresh();
        $this->assertEquals('survey_berjalan', $this->credit->credit_status);

        // Step 6: Complete survey
        $this->creditService->completeSurvey($this->credit, 'Survey notes');
        $this->credit->refresh();
        $this->assertEquals('menunggu_keputusan_leasing', $this->credit->credit_status);

        // Step 7: Approve credit
        $this->creditService->approveCredit($this->credit, 95000000, 0.015);
        $this->credit->refresh();
        $this->assertEquals('disetujui', $this->credit->credit_status);

        // Step 8: Record DP payment
        $this->creditService->recordDPPayment($this->credit, 'bank_transfer', $this->user);
        $this->credit->refresh();
        $this->assertEquals('dp_dibayar', $this->credit->credit_status);

        // Step 9: Complete credit
        $this->creditService->completeCredit($this->credit, 'Process complete');
        $this->credit->refresh();
        $this->assertEquals('selesai', $this->credit->credit_status);
    }
}
