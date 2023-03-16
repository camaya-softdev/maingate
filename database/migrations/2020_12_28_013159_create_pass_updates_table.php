<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreatePassUpdatesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('pass_updates', function (Blueprint $table) {
            $table->bigInteger('id');

            $table->unsignedInteger('count')->nullable(); // (consumable, reusable)
            $table->enum('status', ['created', 'consumed', 'used', 'voided'])->nullable(); // (created, consumed, voided)

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
        Schema::dropIfExists('pass_updates');
    }
}
