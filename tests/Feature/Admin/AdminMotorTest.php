<?php

namespace Tests\Feature\Admin;

use App\Models\Motor;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class AdminMotorTest extends TestCase
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
    public function motor_index_page_is_accessible_to_admin()
    {
        $this->actingAs($this->admin)->get(route('admin.motors.index'))
            ->assertStatus(200);
    }

    /** @test */
    public function motor_can_be_created_by_admin()
    {
        Storage::fake('public');

        $response = $this->actingAs($this->admin)->post(route('admin.motors.store'), [
            'name' => 'Test Motor',
            'brand' => 'Yamaha',
            'model' => 'Sport',
            'price' => 25000000,
            'year' => 2024,
            'type' => 'Matic',
            'tersedia' => true,
            'min_dp_amount' => 2500000,
            'image' => UploadedFile::fake()->image('motor.jpg'),
            'description' => 'Test description',
            'colors' => ['Black', 'Red'],
        ]);

        $response->assertRedirect(route('admin.motors.index'));
        $this->assertDatabaseHas('motors', ['name' => 'Test Motor']);
        
        $motor = Motor::first();
        Storage::disk('public')->assertExists($motor->image_path);
    }

    /** @test */
    public function motor_can_be_updated_by_admin()
    {
        $motor = Motor::factory()->create(['name' => 'Old Name']);

        $response = $this->actingAs($this->admin)->put(route('admin.motors.update', $motor->id), [
            'name' => 'Updated Name',
            'brand' => 'Honda',
            'price' => 26000000,
            'tersedia' => false,
            'min_dp_amount' => 2600000,
        ]);

        $response->assertRedirect(route('admin.motors.index'));
        $this->assertDatabaseHas('motors', [
            'id' => $motor->id,
            'name' => 'Updated Name',
            'brand' => 'Honda',
        ]);
    }

    /** @test */
    public function motor_can_be_deleted_by_admin()
    {
        Storage::fake('public');
        $imagePath = 'motors/test.jpg';
        Storage::disk('public')->put($imagePath, 'test content');
        
        $motor = Motor::factory()->create(['image_path' => $imagePath]);

        $response = $this->actingAs($this->admin)->delete(route('admin.motors.destroy', $motor->id));

        $response->assertRedirect(route('admin.motors.index'));
        $this->assertDatabaseMissing('motors', ['id' => $motor->id]);
        Storage::disk('public')->assertMissing($imagePath);
    }
}
