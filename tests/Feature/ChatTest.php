<?php

use App\Events\DialogMessageSent;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Auth;
use Inertia\Testing\AssertableInertia as Assert;
use PHPUnit\Framework\TestCase;

it('renders the chat view', function () {
    $user = User::factory()->create();

    $this
        ->actingAs($user)
        ->get(route('chat.index'))
        ->assertInertia(fn (Assert $page) => $page
            ->component('Chat')
            ->has('contacts')
            ->has('currentContact')
            ->has('serverMessages')
        );

});

it('renders the chat view with a specific contact', function () {
    $user = User::factory()->create();

    $this
        ->actingAs($user)
        ->get(route('chat.index', ['currentContactId' => 1]))
        ->assertInertia(fn (Assert $page) => $page
            ->component('Chat')
            ->has('contacts')
            ->has('currentContact')
            ->has('serverMessages')
        );
});

it('posts a message successfully', function () {
    $user = User::factory()->create();

    Event::fake();
    $contactId = User::factory()->create()->id;
    $response = $this
        ->actingAs($user)
        ->post(route('chat.post-message', ['receiverId' => $contactId]), [
        'message' => 'Test message',
    ]);

    $response->assertJson(['success' => true]);

    Event::assertDispatched(DialogMessageSent::class);
    $this->assertDatabaseHas('messages', [
        'sender_user_id' => $user->id,
        'receiver_user_id' => $contactId,
        'message' => 'Test message',
    ]);
});

