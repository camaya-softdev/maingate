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

class ScanEvent implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $page;
    public $message;
    public $data;

    /**
     * Create a new event instance.
     *
     * @return void
     */
    public function __construct($page = '/', $message = '', $data = '')
    {
        $this->page = $page;
        $this->message = $message;
        $this->data = $data;
    }

    /**
     * Get the channels the event should broadcast on.
     *
     * @return \Illuminate\Broadcasting\Channel|array
     */
    public function broadcastOn()
    {
        $socketLogService = new SocketLogService();
        $socketLogService->write_log(Carbon::now() . "," . $this->page . ","  . json_encode($this->data) . "\r\n");
        return new Channel('scan');
    }
}
