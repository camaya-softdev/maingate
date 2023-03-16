<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class RemoveNotNullToSecurityChecks extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('security_checks', function (Blueprint $table) {
            $table->string('booking_reference_number')->nullable()->change();
            $table->string('reference_number')->nullable()->change();
            $table->string('status')->nullable()->change();
            $table->json('checklists')->nullable()->change();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        // Schema::table('security_checks', function (Blueprint $table) {
        //     $table->string('booking_reference_number')->nullable(false)->change();
        //     $table->string('reference_number')->nullable(false)->change();
        //     $table->string('status')->nullable(false)->change();
        //     $table->json('checklists')->nullable(false)->change();
        // });
    }
}
