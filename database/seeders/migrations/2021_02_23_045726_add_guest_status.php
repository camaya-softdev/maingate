<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

class AddGuestStatus extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        // modifiying enum column is not supported by laravel
        // docs: https://laravel.com/docs/8.x/migrations#updating-column-attributes
        DB::statement("ALTER TABLE guests MODIFY COLUMN status ENUM('arriving', 'on_premise', 'checked_in', 'no_show', 'booking_cancelled') NOT NULL DEFAULT 'arriving'");
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        // modifiying enum column is not supported by laravel
        // docs: https://laravel.com/docs/8.x/migrations#updating-column-attributes
        DB::statement("ALTER TABLE guests MODIFY COLUMN status ENUM('arriving', 'on_premise', 'checked_in', 'no_show', 'booking_cancelled') NOT NULL DEFAULT 'arriving'");
    }
}
