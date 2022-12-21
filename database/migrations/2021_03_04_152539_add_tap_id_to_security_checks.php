<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddTapIdToSecurityChecks extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('security_checks', function (Blueprint $table) {
            $table->foreignId('tap_id')
                ->nullable()
                ->constrained()
                ->onDelete('cascade')
                ->after('id');
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
            $table->dropForeign('security_checks_tap_id_foreign');
            $table->dropColumn('tap_id');
        });
    }
}
