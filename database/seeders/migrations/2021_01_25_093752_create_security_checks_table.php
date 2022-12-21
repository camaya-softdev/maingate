<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateSecurityChecksTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('security_checks', function (Blueprint $table) {
            $table->id();
            $table->string('reference_number');
            $table->string('status');
            $table->json('checklists');
            $table->json('additional_vehicles')->nullable();
            $table->json('additional_guests')->nullable();
            $table->json('action_taken')->nullable();
            $table->text('notes')->nullable();
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
        Schema::dropIfExists('security_checks');
    }
}
