<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AuthApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_login_valid_returns_user_envelope(): void
    {
        $user = User::factory()->create(['password' => bcrypt('secret123')]);

        $response = $this->withHeader('Origin', 'http://localhost')
            ->postJson('/api/login', [
                'email' => $user->email,
                'password' => 'secret123',
            ]);

        $response->assertOk()
            ->assertJsonStructure(['code', 'data' => ['id', 'name', 'email'], 'msg', 'success'])
            ->assertJsonPath('success', true)
            ->assertJsonPath('data.email', $user->email)
            ->assertJsonMissingPath('data.token');
    }

    public function test_login_invalid_returns_422_envelope(): void
    {
        User::factory()->create(['email' => 'user@example.com', 'password' => bcrypt('correct')]);

        $response = $this->postJson('/api/login', [
            'email' => 'user@example.com',
            'password' => 'wrong',
        ]);

        $response->assertStatus(422)
            ->assertJsonPath('success', false)
            ->assertJsonPath('code', 422);
    }

    public function test_user_endpoint_returns_401_when_guest(): void
    {
        $response = $this->getJson('/api/user');

        $response->assertUnauthorized()
            ->assertJsonPath('success', false)
            ->assertJsonPath('code', 401);
    }

    public function test_user_endpoint_returns_user_when_authenticated(): void
    {
        $user = User::factory()->create();
        $this->actingAs($user);

        $response = $this->getJson('/api/user');

        $response->assertOk()
            ->assertJsonPath('success', true)
            ->assertJsonPath('data.email', $user->email)
            ->assertJsonMissingPath('data.password');
    }

    public function test_logout_returns_success_envelope(): void
    {
        $user = User::factory()->create();
        $this->actingAs($user);

        $response = $this->withHeader('Origin', 'http://localhost')
            ->postJson('/api/logout');

        $response->assertOk()
            ->assertJsonPath('success', true)
            ->assertJsonPath('msg', 'Logged out');
    }
}
