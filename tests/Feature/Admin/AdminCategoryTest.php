<?php

namespace Tests\Feature\Admin;

use App\Models\Category;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AdminCategoryTest extends TestCase
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
    public function category_index_page_is_accessible_to_admin()
    {
        $this->actingAs($this->admin)->get(route('admin.categories.index'))
            ->assertStatus(200);
    }

    /** @test */
    public function category_can_be_created_by_admin()
    {
        $response = $this->actingAs($this->admin)->post(route('admin.categories.store'), [
            'name' => 'New Category',
            'description' => 'Test description',
            'is_active' => true,
            'order' => 1,
        ]);

        $response->assertRedirect(route('admin.categories.index'));
        $this->assertDatabaseHas('categories', ['name' => 'New Category']);
    }

    /** @test */
    public function category_can_be_updated_by_admin()
    {
        $category = Category::factory()->create(['name' => 'Old Name']);

        $response = $this->actingAs($this->admin)->put(route('admin.categories.update', $category->id), [
            'name' => 'Updated Name',
            'is_active' => false,
        ]);

        $response->assertRedirect(route('admin.categories.index'));
        $this->assertDatabaseHas('categories', [
            'id' => $category->id,
            'name' => 'Updated Name',
            'is_active' => false,
        ]);
    }

    /** @test */
    public function category_can_be_deleted_by_admin()
    {
        $category = Category::factory()->create();

        $response = $this->actingAs($this->admin)->delete(route('admin.categories.destroy', $category->id));

        $response->assertRedirect(route('admin.categories.index'));
        $this->assertDatabaseMissing('categories', ['id' => $category->id]);
    }
}
