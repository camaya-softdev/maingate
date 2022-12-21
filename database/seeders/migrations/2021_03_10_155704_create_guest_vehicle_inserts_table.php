<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateGuestVehicleInsertsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('guest_vehicle_inserts', function (Blueprint $table) {
            $table->id();

            $table->string('booking_reference_number');
            $table->string('model');
            $table->string('plate_number');

            // Used for flagging cloud sync
            $table->bigInteger('sync_id')->default(0);

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('guest_vehicle_inserts');
    }
}
