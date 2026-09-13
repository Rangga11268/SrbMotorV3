<?php

namespace Tests\Feature\Admin;

use App\Models\Setting;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Cache;

class AdminSettingTest extends TestCase
{
    use RefreshDatabase;

    protected $admin;

    protected function setUp(): void
    {
        parent::setUp();
        $this->admin = User::factory()->create(['role' => 'admin']);
        Cache::flush();
    }

    /** @test */
    public function settings_index_page_is_accessible_to_admin()
    {
        Setting::factory()->create(['category' => 'general', 'key' => 'site_name', 'value' => 'SRB Motor']);

        $response = $this->actingAs($this->admin)->get(route('admin.settings.index'));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page->component('Admin/Settings/Index'));
    }

    /** @test */
    public function admin_can_view_setting_category_edit_page()
    {
        Setting::factory()->create(['category' => 'general', 'key' => 'site_name']);

        $response = $this->actingAs($this->admin)->get(route('admin.settings.edit', 'general'));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page->component('Admin/Settings/Edit'));
    }

    /** @test */
    public function admin_can_update_settings_in_category()
    {
        $setting = Setting::factory()->create([
            'category' => 'general',
            'key' => 'site_name',
            'value' => 'Old Name',
            'type' => 'string'
        ]);

        $response = $this->actingAs($this->admin)->put(route('admin.settings.update', 'general'), [
            'settings' => [
                [
                    'key' => 'site_name',
                    'value' => 'New Name',
                    'type' => 'string',
                    'description' => 'Site Name Description'
                ]
            ]
        ]);

        $response->assertRedirect(route('admin.settings.index'));
        $this->assertEquals('New Name', Setting::get('site_name'));
    }

    /** @test */
    public function admin_can_create_new_setting()
    {
        $response = $this->actingAs($this->admin)->post(route('admin.settings.store'), [
            'key' => 'new_setting_key',
            'value' => 'new_value',
            'type' => 'string',
            'category' => 'custom',
            'description' => 'Test Description',
        ]);

        $response->assertRedirect(route('admin.settings.edit', 'custom'));
        $this->assertDatabaseHas('settings', ['key' => 'new_setting_key', 'value' => 'new_value']);
    }

    /** @test */
    public function admin_can_upload_setting_asset()
    {
        Storage::fake('public');
        $file = UploadedFile::fake()->image('logo.png');

        $response = $this->actingAs($this->admin)->post(route('admin.settings.upload'), [
            'file' => $file,
            'field' => 'site_logo',
        ]);

        $response->assertStatus(200);
        $json = $response->json();
        $this->assertStringContainsString('site_logo', $json['path']);
        
        // Remove /storage/ prefix for checking existence
        $path = str_replace('/storage/', '', $json['path']);
        Storage::disk('public')->assertExists($path);
    }

    /** @test */
    public function admin_can_delete_setting()
    {
        $setting = Setting::factory()->create(['category' => 'general']);

        $response = $this->actingAs($this->admin)->delete(route('admin.settings.destroy', $setting->id));

        $response->assertRedirect(route('admin.settings.edit', 'general'));
        $this->assertDatabaseMissing('settings', ['id' => $setting->id]);
    }
}
