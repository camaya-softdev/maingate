<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddBookingGuestVehicleToSecurityChecks extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('security_checks', function (Blueprint $table) {
            $table->json('booking_guest_vehicles')->nullable()->after('notes');
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
            $table->dropColumn('booking_guest_vehicles');
        });
    }
}
