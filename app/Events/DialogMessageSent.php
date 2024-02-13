<?php

namespace App\Events;

use App\Models\Message;
use Illuminate\Broadcasting\Broadcasters\UsePusherChannelConventions;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\EncryptedPrivateChannel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Auth;

class DialogMessageSent implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels, UsePusherChannelConventions;

    public Message $message;

    /**
     * Create a new event instance.
     */
    public function __construct(Message $message)
    {
        $this->message = $message;
    }

    /**
     * Get the channels the event should broadcast on.
     *
     * @return PrivateChannel[]
     */
    public function broadcastOn(): array
    {
        return [
            new EncryptedPrivateChannel('dialogs.' . $this->message->sender_user_id),
            new EncryptedPrivateChannel('dialogs.' . $this->message->receiver_user_id)
        ];
    }
}
