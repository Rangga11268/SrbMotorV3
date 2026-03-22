<?php

namespace Tests\Feature\Admin;

use App\Models\LeasingProvider;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

class AdminLeasingTest extends TestCase
{
    use RefreshDatabase;

    protected $admin;

    protected function setUp(): void
    {
        parent::setUp();
        $this->admin = User::factory()->create(['role' => 'admin']);
    }

    /** @test */
    public function leasing_providers_index_page_is_accessible_to_admin()
    {
        LeasingProvider::factory()->count(3)->create();

        $response = $this->actingAs($this->admin)->get(route('admin.leasing-providers.index'));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page->component('Admin/LeasingProviders/Index'));
    }

    /** @test */
    public function admin_can_create_leasing_provider_with_logo()
    {
        Storage::fake('public');
        $logo = UploadedFile::fake()->image('leasing_logo.png');

        $response = $this->actingAs($this->admin)->post(route('admin.leasing-providers.store'), [
            'name' => 'Adira Finance',
            'logo' => $logo,
        ]);

        $response->assertRedirect(route('admin.leasing-providers.index'));
        $this->assertDatabaseHas('leasing_providers', ['name' => 'Adira Finance']);
        
        $provider = LeasingProvider::where('name', 'Adira Finance')->first();
        $this->assertNotNull($provider->logo_path);
        Storage::disk('public')->assertExists($provider->logo_path);
    }

    /** @test */
    public function admin_can_update_leasing_provider()
    {
        Storage::fake('public');
        $provider = LeasingProvider::factory()->create(['name' => 'Old Name']);
        $newLogo = UploadedFile::fake()->image('new_logo.png');

        $response = $this->actingAs($this->admin)->put(route('admin.leasing-providers.update', $provider->id), [
            'name' => 'New Name',
            'logo' => $newLogo,
        ]);

        $response->assertRedirect(route('admin.leasing-providers.index'));
        $this->assertDatabaseHas('leasing_providers', [
            'id' => $provider->id,
            'name' => 'New Name',
        ]);
        
        $provider->refresh();
        Storage::disk('public')->assertExists($provider->logo_path);
    }

    /** @test */
    public function admin_can_delete_leasing_provider()
    {
        Storage::fake('public');
        $logoPath = 'leasing-providers/test.png';
        Storage::disk('public')->put($logoPath, 'fake content');
        
        $provider = LeasingProvider::factory()->create(['logo_path' => $logoPath]);

        $response = $this->actingAs($this->admin)->delete(route('admin.leasing-providers.destroy', $provider->id));

        $response->assertRedirect(route('admin.leasing-providers.index'));
        $this->assertDatabaseMissing('leasing_providers', ['id' => $provider->id]);
        Storage::disk('public')->assertMissing($logoPath);
    }
}
