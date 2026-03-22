<?php

namespace Tests\Feature\Admin;

use App\Models\Installment;
use App\Models\Transaction;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

class AdminInstallmentTest extends TestCase
{
    use RefreshDatabase;

    protected $admin;

    protected function setUp(): void
    {
        parent::setUp();
        $this->admin = User::factory()->create(['role' => 'admin']);
    }

    /** @test */
    public function installment_index_page_is_accessible_to_admin()
    {
        $transaction = Transaction::factory()->create();
        Installment::factory()->create(['transaction_id' => $transaction->id]);

        $response = $this->actingAs($this->admin)->get(route('installments.index'));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page->component('Installments/Index'));
    }

    /** @test */
    public function admin_can_approve_installment_payment()
    {
        Storage::fake('public');
        $transaction = Transaction::factory()->create();
        $installment = Installment::factory()->create([
            'transaction_id' => $transaction->id,
            'status' => 'waiting_approval',
            'payment_proof' => 'payment_proofs/fake.jpg'
        ]);

        $response = $this->actingAs($this->admin)->post(route('admin.installments.approve', $installment->id));

        $response->assertRedirect();
        $this->assertDatabaseHas('installments', [
            'id' => $installment->id,
            'status' => 'paid',
        ]);
    }

    /** @test */
    public function admin_can_reject_installment_payment()
    {
        Storage::fake('public');
        $transaction = Transaction::factory()->create();
        $installment = Installment::factory()->create([
            'transaction_id' => $transaction->id,
            'status' => 'waiting_approval',
            'payment_proof' => 'payment_proofs/fake.jpg'
        ]);

        $response = $this->actingAs($this->admin)->post(route('admin.installments.reject', $installment->id));

        $response->assertRedirect();
        $this->assertDatabaseHas('installments', [
            'id' => $installment->id,
            'status' => 'pending',
        ]);
    }
}
