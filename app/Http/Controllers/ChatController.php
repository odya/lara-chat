<?php

namespace App\Http\Controllers;

use App\Events\DialogMessageSent;
use App\Models\Message;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;
use Inertia\Response;

class ChatController extends Controller
{
    public function index(?int $currentContactId = null)
    {
        $contacts = User::query()
            ->whereKeyNot(Auth::id())
            ->select(['id','name'])
            ->get();

        $messages = [];
        if($currentContactId !== null) {
            $messages = Message::query()
                ->with('senderUser')
                ->whereIn('sender_user_id', [Auth::id(), $currentContactId])
                ->whereIn('receiver_user_id', [Auth::id(), $currentContactId])
                ->orderBy('created_at')
                ->get();
            $currentContact = User::query()->whereKey($currentContactId)->first(['id','name']);
        }

        return Inertia::render('Chat', [
            'contacts' => $contacts,
            'currentContact' => $currentContact ?? null,
            'serverMessages' => $messages
        ]);
    }

    /**
     * @return \Illuminate\Http\JsonResponse
     */
    public function postMessage(Request $request, int $receiverId)
    {
        $request->validate([
            'message' => 'required|string',
        ]);

        try {
            $message = new Message([
                'sender_user_id' => Auth::id(),
                'receiver_user_id' => $receiverId,
                'message' => $request->message
            ]);
            $success = $message->save();
            event(new DialogMessageSent($message));

            return response()->json([
                'success' => $success,
            ]);
        } catch (\Throwable $e) {
            return response()->json([
                'errors' => [$e->getMessage()]
            ], 400);
        }
    }

}
