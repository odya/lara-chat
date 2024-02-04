<?php

namespace Database\Seeders;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use App\Models\Message;
use App\Models\User;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $user1 = User::factory()->create([
            'name' => 'User 1',
            'email' => 'user1@mail.com',
            'password' => '11111111'
        ]);
        $user2 = User::factory()->create([
            'name' => 'User 2',
            'email' => 'user2@mail.com',
            'password' => '22222222'
        ]);
        User::factory(5)->create();

        Message::factory(5)
            ->create([
                'sender_user_id' => $user1->id,
                'receiver_user_id' => $user2->id,
            ]);
        Message::factory(5)
            ->create([
                'sender_user_id' => $user2->id,
                'receiver_user_id' => $user1->id,
            ]);
    }
}
