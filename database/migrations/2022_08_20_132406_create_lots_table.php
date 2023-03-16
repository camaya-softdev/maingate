<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateLotsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('lots', function (Blueprint $table) {
            $table->id();
            $table->integer('subdivision_id');
            $table->foreignId('user_id');
            $table->integer('agent_id');
            $table->integer('hoa_subd_lot_block');
            $table->integer('hoa_subd_lot_num');
            $table->string('unique_lot')->nullable();
            $table->string('hoa_subd_lot_area')->nullable();
            $table->string('hoa_subd_lot_house_num')->nullable();
            $table->string('hoa_subd_lot_street_name')->nullable();
            $table->string('hoa_subd_lot_createdby');
            $table->integer('hoa_subd_lot_default');
            $table->softDeletes();
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
        Schema::dropIfExists('lots');
    }
}
