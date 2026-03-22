<?php

namespace Tests\Feature\Admin;

use App\Models\Category;
use App\Models\Post;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class NewsCrudTest extends TestCase
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
    public function only_admins_can_access_news_index()
    {
        $user = User::factory()->create(['role' => 'user']);

        $this->actingAs($user)->get(route('admin.news.index'))->assertStatus(403);
        $this->actingAs($this->admin)->get(route('admin.news.index'))->assertStatus(200);
    }

    /** @test */
    public function news_can_be_created_by_admin()
    {
        Storage::fake('public');
        $category = Category::factory()->create();

        $response = $this->actingAs($this->admin)->post(route('admin.news.store'), [
            'title' => 'Test News Title',
            'category_id' => $category->id,
            'content' => 'Test content for news article.',
            'status' => 'published',
            'featured_image' => UploadedFile::fake()->image('news.jpg'),
        ]);

        $response->assertRedirect(route('admin.news.index'));
        $this->assertDatabaseHas('posts', [
            'title' => 'Test News Title',
            'category_id' => $category->id,
        ]);

        $news = Post::where('title', 'Test News Title')->first();
        Storage::disk('public')->assertExists(str_replace('storage/', '', $news->getRawOriginal('featured_image')));
    }

    /** @test */
    public function news_can_be_updated_by_admin()
    {
        Storage::fake('public');
        $newsSet = Post::factory()->create(['featured_image' => 'storage/old.jpg']);
        $cat = Category::factory()->create();

        $response = $this->actingAs($this->admin)->put(route('admin.news.update', $newsSet->id), [
            'title' => 'Updated News Title',
            'category_id' => $cat->id,
            'content' => 'Updated content.',
            'status' => 'draft',
        ]);

        $response->assertRedirect(route('admin.news.index'));
        $this->assertDatabaseHas('posts', [
            'id' => $newsSet->id,
            'title' => 'Updated News Title',
            'status' => 'draft',
        ]);
    }

    /** @test */
    public function news_can_be_deleted_by_admin()
    {
        Storage::fake('public');
        $imagePath = 'news/delete-test.jpg';
        Storage::disk('public')->put($imagePath, 'test content');
        
        $newsDel = Post::factory()->create(['featured_image' => 'storage/' . $imagePath]);

        $response = $this->actingAs($this->admin)->delete(route('admin.news.destroy', $newsDel->id));

        $response->assertRedirect(route('admin.news.index'));
        $this->assertDatabaseMissing('posts', ['id' => $newsDel->id]);
        Storage::disk('public')->assertMissing($imagePath);
    }
}
