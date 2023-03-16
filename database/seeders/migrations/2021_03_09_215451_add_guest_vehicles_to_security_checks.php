<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddGuestVehiclesToSecurityChecks extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('security_checks', function (Blueprint $table) {
            $table->json('guest_vehicles')->nullable()->after('action_taken');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('security_checks', function (Blueprint $table) {
            $table->dropColumn('guest_vehicles');
        });
    }
}
