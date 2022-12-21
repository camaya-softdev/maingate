<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateBillingsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('billings', function (Blueprint $table) {
            $table->id();
            $table->foreignId('lot_id')->nullable();
            $table->string('hoa_billing_statement_number');
            $table->decimal('hoa_billing_total_cost');
            $table->decimal('hoa_billing_amount_paid');
            $table->decimal('hoa_billing_past_due');
            $table->decimal('hoa_billing_total_balance');
            $table->decimal('hoa_billing_pending_balances');
            $table->date('hoa_billing_due_dates');
            $table->date('hoa_billing_generated_date');
            $table->date('hoa_billing_date_paid')->nullable();
            $table->string('hoa_billing_status');
            $table->integer('hoa_billing_created_by');
            $table->string('hoa_billing_period');
            $table->string('mode_of_payment')->nullable();
            $table->string('transaction_status')->nullable();
            $table->string('payment_status')->nullable();
            $table->text('transaction_id')->nullable();
            $table->text('checkout_id')->nullable();
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
        Schema::dropIfExists('billings');
    }
}
