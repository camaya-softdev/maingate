<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateDesigneesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('designees', function (Blueprint $table) {
            $table->id();
            $table->integer('user_id')->nullable();
            $table->string('hoa_member_designee_name');
            $table->string('hoa_member_designee_relation');
            $table->date('hoa_member_bday');
            $table->integer('hoa_member_designee_modifiedby');
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
        Schema::dropIfExists('designees');
    }
}
