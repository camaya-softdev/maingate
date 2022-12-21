<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class UsersTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('users')->insert([
            // [
            //     'name'=>'Administrator',
            //     'email'=>'admin@camayacoast.com',
            //     'password'=>bcrypt('secret'),
            // ],
            [
                'name' => 'Kiosk',
                'email' => 'kiosk@camayacoast.com',
                'password' => bcrypt('Camaya123'),
            ],
            [
                'name' => 'Concierge User 1',
                'email' => 'concierge1@camayacoast.com',
                'password' => bcrypt('weph9u92'),
            ],
            [
                'name' => 'Concierge User 2',
                'email' => 'concierge2@camayacoast.com',
                'password' => bcrypt('91vdve5o'),
            ],
            [
                'name' => 'Concierge User 3',
                'email' => 'concierge3@camayacoast.com',
                'password' => bcrypt('ljexlemi'),
            ],
        ]);
    }
}
