<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class CustomerRegistrationTest extends TestCase
{
    use RefreshDatabase;

    public function test_signup_defaults_to_regular_customer(): void
    {
        $response = $this->postJson('/api/signup', [
            'name' => 'John Doe',
            'email' => 'regular@example.com',
            'password' => 'secret123',
            'password_confirmation' => 'secret123',
        ]);

        $response->assertStatus(200)->assertJsonStructure([
            'access_token',
            'token_type',
            'expires_in',
            'user',
        ]);

        $this->assertDatabaseHas('users', [
            'email' => 'regular@example.com',
            'is_customer' => 1,
            'customer_type' => 'regular',
        ]);
    }

    public function test_signup_can_register_system_customer(): void
    {
        $response = $this->postJson('/api/signup', [
            'name' => 'Jane Doe',
            'email' => 'system@example.com',
            'password' => 'secret123',
            'password_confirmation' => 'secret123',
            'is_customer' => true,
            'customer_type' => 'system',
        ]);

        $response->assertStatus(200)->assertJsonStructure([
            'access_token',
            'token_type',
            'expires_in',
            'user',
        ]);

        $this->assertDatabaseHas('users', [
            'email' => 'system@example.com',
            'is_customer' => 1,
            'customer_type' => 'system',
        ]);
    }

    public function test_signup_rejects_invalid_customer_type(): void
    {
        $response = $this->postJson('/api/signup', [
            'name' => 'Peter Doe',
            'email' => 'invalidtype@example.com',
            'password' => 'secret123',
            'password_confirmation' => 'secret123',
            'customer_type' => 'gold',
        ]);

        $response->assertStatus(422)->assertJsonValidationErrors(['customer_type']);
    }
}

