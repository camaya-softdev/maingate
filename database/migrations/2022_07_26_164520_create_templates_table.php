<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateTemplatesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('templates', function (Blueprint $table) {
            $table->id();
            $table->string('hoa_autogate_template_name')->nullable();
            $table->longText('hoa_autogate_template_picture')->nullable();
            $table->string('hoa_autogate_template_footer')->nullable();
            $table->longText('hoa_autogate_template_second_page')->nullable();
            $table->longText('hoa_autogate_template_footer_second_page')->nullable();
            $table->string('hoa_autogate_template_third_page')->nullable();
            $table->string('hoa_autogate_template_footer_third_page')->nullable();
            $table->bigInteger('background_image_id')->nullable();
            $table->integer('hoa_autogate_template_modifiedby');
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
        Schema::dropIfExists('templates');
    }
}
