<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;

class AuthTest extends TestCase
{
    use RefreshDatabase;

    /**
     * Test login page can be rendered.
     */
    public function test_login_page_can_be_rendered()
    {
        $response = $this->get('/login');

        $response->assertStatus(200);
    }

    /**
     * Test user cannot login with invalid credentials.
     */
    public function test_user_cannot_login_with_invalid_credentials()
    {
        $user = User::factory()->create([
            'password' => bcrypt('password'),
        ]);

        $response = $this->from('/login')->post('/login', [
            'email' => $user->email,
            'password' => 'wrong-password',
        ]);

        $response->assertRedirect('/login');
        $response->assertSessionHasErrors('password');
        $this->assertGuest();
    }

    /**
     * Test user cannot login with non-existent email.
     */
    public function test_user_cannot_login_with_non_existent_email()
    {
        $response = $this->from('/login')->post('/login', [
            'email' => 'nonexistent@example.com',
            'password' => 'password',
        ]);

        $response->assertRedirect('/login');
        $response->assertSessionHasErrors('email');
        $this->assertGuest();
    }

    /**
     * Test login validation errors.
     */
    public function test_login_validation_errors()
    {
        $response = $this->from('/login')->post('/login', [
            'email' => '',
            'password' => '',
        ]);

        $response->assertRedirect('/login');
        $response->assertSessionHasErrors(['email', 'password']);
        
        $response = $this->from('/login')->post('/login', [
            'email' => 'not-an-email',
            'password' => 'password',
        ]);
        
        $response->assertRedirect('/login');
        $response->assertSessionHasErrors('email');
    }

    /**
     * Test user can login with correct credentials.
     */
    public function test_user_can_login_with_correct_credentials()
    {
        $user = User::factory()->create([
            'password' => bcrypt('password'),
        ]);

        $response = $this->post('/login', [
            'email' => $user->email,
            'password' => 'password',
        ]);

        $response->assertRedirect('/');
        $this->assertAuthenticatedAs($user);
    }

    /**
     * Test admin login redirects to dashboard.
     */
    public function test_admin_login_redirects_to_dashboard()
    {
        $admin = User::factory()->create([
            'password' => bcrypt('password'),
            'role' => 'admin',
        ]);

        $response = $this->post('/login', [
            'email' => $admin->email,
            'password' => 'password',
        ]);

        $response->assertRedirect(route('admin.dashboard'));
        $this->assertAuthenticatedAs($admin);
    }
    /**
     * Test register page can be rendered.
     */
    public function test_register_page_can_be_rendered()
    {
        $response = $this->get('/register');

        $response->assertStatus(200);
    }

    /**
     * Test register validation errors.
     */
    public function test_register_validation_errors()
    {
        $response = $this->from('/register')->post('/register', [
            'name' => '',
            'email' => '',
            'password' => '',
            'password_confirmation' => '',
        ]);

        $response->assertRedirect('/register');
        $response->assertSessionHasErrors(['name', 'email', 'password']);
        
        $response = $this->from('/register')->post('/register', [
            'name' => 'Test User',
            'email' => 'not-an-email',
            'password' => 'short',
            'password_confirmation' => 'short',
        ]);
        
        $response->assertRedirect('/register');
        $response->assertSessionHasErrors(['email', 'password']);
        
        $response = $this->from('/register')->post('/register', [
            'name' => 'Test User',
            'email' => 'test@example.com',
            'password' => 'password',
            'password_confirmation' => 'different-password',
        ]);
        
        $response->assertRedirect('/register');
        $response->assertSessionHasErrors('password');
    }

    /**
     * Test user cannot register with existing email.
     */
    public function test_user_cannot_register_with_existing_email()
    {
        $user = User::factory()->create([
            'email' => 'existing@example.com',
        ]);

        $response = $this->from('/register')->post('/register', [
            'name' => 'New User',
            'email' => 'existing@example.com',
            'password' => 'password',
            'password_confirmation' => 'password',
        ]);

        $response->assertRedirect('/register');
        $response->assertSessionHasErrors('email');
    }

    /**
     * Test user can register successfully.
     */
    public function test_user_can_register_successfully()
    {
        $response = $this->post('/register', [
            'name' => 'New User',
            'email' => 'new@example.com',
            'password' => 'password',
            'password_confirmation' => 'password',
        ]);

        $response->assertRedirect('/email/verify');
        $this->assertAuthenticated();
        $this->assertDatabaseHas('users', [
            'email' => 'new@example.com',
        ]);
    }
}
