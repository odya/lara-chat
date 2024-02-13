<?php

namespace App\Broadcasting;

use App\Models\User;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\EncryptedPrivateChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Support\Facades\Auth;

class DialogsChannel
{

    /**
     * Authenticate the user's access to the channel.
     */
    public function join(User $user, int $userId): array|bool
    {
        return Auth::check() && $userId == Auth::id();
    }
}
