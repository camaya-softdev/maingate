<?php

namespace App\Events;

use App\Services\SocketLogService;
use Carbon\Carbon;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

/**
 * Kiosk list of page
 * - /
 * - /welcome
 * - /invalid-code
 * - /valid-code
 * - /holding-area
 */

class LogoutEvent implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $logout;
    public $tokens;

    /**
     * Create a new event instance.
     *
     * @return void
     */
    public function __construct($tokens = [])
    {
        $this->logout = true;
        $this->tokens = $tokens;
    }

    /**
     * Get the channels the event should broadcast on.
     *
     * @return \Illuminate\Broadcasting\Channel|array
     */
    public function broadcastOn()
    {
        return new Channel('logout');
    }
}
