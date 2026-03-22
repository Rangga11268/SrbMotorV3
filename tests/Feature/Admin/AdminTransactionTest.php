<?php

namespace Tests\Feature\Admin;

use App\Models\Motor;
use App\Models\Transaction;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Notification;
use Tests\TestCase;

class AdminTransactionTest extends TestCase
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
        
        // Mock notifications and external services
        Notification::fake();
        // Since WhatsAppService is likely a facade or static class, we can mock it if needed
        // but for now let's just ensure the code runs.
    }

    /** @test */
    public function transaction_index_page_is_accessible_to_admin()
    {
        $this->actingAs($this->admin)->get(route('admin.transactions.index'))
            ->assertStatus(200);
    }

    /** @test */
    public function admin_can_create_manual_cash_transaction()
    {
        $user = User::factory()->create();
        $motor = Motor::factory()->create(['tersedia' => true, 'price' => 25000000]);

        $response = $this->actingAs($this->admin)->post(route('admin.transactions.store'), [
            'user_id' => $user->id,
            'motor_id' => $motor->id,
            'name' => 'John Customer',
            'phone' => '08123456789',
            'email' => 'john@example.com',
            'booking_fee' => 1000000,
            'status' => 'pembayaran_dikonfirmasi',
            'motor_color' => 'Red',
            'delivery_method' => 'Dealer Pickup',
        ]);

        $transaction = Transaction::where('user_id', $user->id)->first();
        $response->assertRedirect(route('admin.transactions.show', $transaction));
        
        $this->assertDatabaseHas('transactions', [
            'id' => $transaction->id,
            'transaction_type' => 'CASH',
            'status' => 'pembayaran_dikonfirmasi',
            'final_price' => 25000000,
        ]);

        // Check if stock is locked
        $this->assertDatabaseHas('motors', [
            'id' => $motor->id,
            'tersedia' => false,
        ]);
    }

    /** @test */
    public function admin_can_update_transaction_status()
    {
        $transaction = Transaction::factory()->create([
            'status' => 'waiting_payment',
            'transaction_type' => 'CASH'
        ]);

        $response = $this->actingAs($this->admin)->post(route('admin.transactions.updateStatus', $transaction->id), [
            'status' => 'pembayaran_dikonfirmasi',
        ]);

        $response->assertStatus(302);
        $this->assertDatabaseHas('transactions', [
            'id' => $transaction->id,
            'status' => 'pembayaran_dikonfirmasi',
        ]);
    }

    /** @test */
    public function admin_can_update_transaction_details()
    {
        $this->withoutExceptionHandling();
        $transaction = Transaction::factory()->create(['transaction_type' => 'CASH']);
        $newMotor = Motor::factory()->create(['price' => 30000000]);

        $response = $this->actingAs($this->admin)->put(route('admin.transactions.update', $transaction->id), [
            'user_id' => $transaction->user_id,
            'motor_id' => $newMotor->id,
            'name' => 'Updated Name',
            'booking_fee' => 2000000,
            'status' => 'completed',
            'address' => 'New Address',
        ]);

        $response->assertRedirect(route('admin.transactions.show', $transaction->id));
        $this->assertDatabaseHas('transactions', [
            'id' => $transaction->id,
            'name' => 'Updated Name',
            'motor_id' => $newMotor->id,
            'status' => 'completed',
        ]);
    }

    /** @test */
    public function admin_can_delete_transaction()
    {
        $transaction = Transaction::factory()->create();

        $response = $this->actingAs($this->admin)->delete(route('admin.transactions.destroy', $transaction->id));

        $response->assertRedirect(route('admin.transactions.index'));
        $this->assertDatabaseMissing('transactions', ['id' => $transaction->id]);
    }
}
