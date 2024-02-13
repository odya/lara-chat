<?php

use App\Broadcasting\DialogsChannel;
use Illuminate\Support\Facades\Broadcast;

/*
|--------------------------------------------------------------------------
| Broadcast Channels
|--------------------------------------------------------------------------
|
| Here you may register all of the event broadcasting channels that your
| application supports. The given channel authorization callbacks are
| used to check if an authenticated user can listen to the channel.
|
*/

Broadcast::channel('dialogs.{userId}', DialogsChannel::class);

Broadcast::channel('presence', function ($user) {
    return ['id' => $user->id];
});

