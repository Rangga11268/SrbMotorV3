<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

class ProfileTest extends TestCase
{
    use RefreshDatabase;

    /**
     * Test password change validation errors.
     */
    public function test_password_change_validation_errors()
    {
        $user = User::factory()->create([
            'password' => Hash::make('password'),
        ]);

        $response = $this->actingAs($user)->put(route('profile.password.update'), [
            'current_password' => '',
            'password' => '',
            'password_confirmation' => '',
        ]);

        $response->assertSessionHasErrors(['current_password', 'password']);
        
        $response = $this->actingAs($user)->put(route('profile.password.update'), [
            'current_password' => 'password',
            'password' => 'short',
            'password_confirmation' => 'short',
        ]);
        
        $response->assertSessionHasErrors(['password']);
        
        $response = $this->actingAs($user)->put(route('profile.password.update'), [
            'current_password' => 'password',
            'password' => 'new-password',
            'password_confirmation' => 'different-password',
        ]);
        
        $response->assertSessionHasErrors(['password']);
    }

    /**
     * Test current password validation.
     */
    public function test_current_password_validation()
    {
        $user = User::factory()->create([
            'password' => Hash::make('password'),
        ]);

        $response = $this->actingAs($user)->put(route('profile.password.update'), [
            'current_password' => 'wrong-password',
            'password' => 'new-password',
            'password_confirmation' => 'new-password',
        ]);

        $response->assertSessionHasErrors(['current_password']);
    }

    /**
     * Test user can change password.
     */
    public function test_user_can_change_password()
    {
        $user = User::factory()->create([
            'password' => Hash::make('password'),
        ]);

        $response = $this->actingAs($user)->put(route('profile.password.update'), [
            'current_password' => 'password',
            'password' => 'new-password',
            'password_confirmation' => 'new-password',
        ]);

        $response->assertRedirect(route('profile.edit'));
        $response->assertSessionHas('success');
        
        $user->refresh();
        $this->assertTrue(Hash::check('new-password', $user->password));
    }
}
