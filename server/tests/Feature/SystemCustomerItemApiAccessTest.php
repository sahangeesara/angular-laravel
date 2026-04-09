<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class SystemCustomerItemApiAccessTest extends TestCase
{
    use RefreshDatabase;

    public function test_guest_cannot_add_item(): void
    {
        $response = $this->postJson('/api/saveItem', []);

        $response->assertStatus(401);
    }

    public function test_regular_customer_cannot_add_item(): void
    {
        $user = User::factory()->create([
            'is_customer' => true,
            'customer_type' => 'regular',
        ]);

        $response = $this->actingAs($user, 'api')->postJson('/api/saveItem', []);

        $response->assertStatus(403)
            ->assertJson(['message' => 'Only system customers can access this resource.']);
    }
}

