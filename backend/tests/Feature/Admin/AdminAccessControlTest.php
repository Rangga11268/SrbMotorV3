<?php

namespace Tests\Feature\Admin;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AdminAccessControlTest extends TestCase
{
    use RefreshDatabase;

    /** @test */
    public function guests_are_redirected_to_login_from_admin_dashboard()
    {
        $response = $this->get(route('admin.dashboard'));
        $response->assertRedirect(route('login'));
    }

    /** @test */
    public function non_admin_users_are_forbidden_from_admin_dashboard()
    {
        $user = User::factory()->create(['role' => 'user']);

        $response = $this->actingAs($user)->get(route('admin.dashboard'));

        // Depending on middleware implementation, it might be 403 or redirect
        // Most common is 403 (Forbidden) or redirect back with error
        $response->assertStatus(403);
    }

    /** @test */
    public function guests_are_redirected_from_news_management()
    {
        $response = $this->get(route('admin.news.index'));
        $response->assertRedirect(route('login'));
    }

    /** @test */
    public function non_admin_users_are_forbidden_from_news_management()
    {
        $user = User::factory()->create(['role' => 'user']);
        $response = $this->actingAs($user)->get(route('admin.news.index'));
        $response->assertStatus(403);
    }

    /** @test */
    public function guests_are_redirected_from_motor_management()
    {
        $response = $this->get(route('admin.motors.index'));
        $response->assertRedirect(route('login'));
    }

    /** @test */
    public function non_admin_users_are_forbidden_from_motor_management()
    {
        $user = User::factory()->create(['role' => 'user']);
        $response = $this->actingAs($user)->get(route('admin.motors.index'));
        $response->assertStatus(403);
    }
}
