<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Autogate;
use Carbon\Carbon;

class BackToDefaultTemplate extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'default:template';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Command description';

    /**
     * Create a new command instance.
     *
     * @return void
     */
    public function __construct()
    {
        parent::__construct();
    }

    /**
     * Execute the console command.
     *
     * @return int
     */
    public function handle()
    {
        $autogates = Autogate::where(function ($endDateQuery) {
            $endDateQuery->where('hoa_autogate_end', '<', Carbon::today()->toDateString());
        })->get();

        $autogateId = collect();

        foreach ($autogates as $autogate) {
            $autogateId->push($autogate->id);
        }
        $changeTemplate = Autogate::whereIn('id', $autogateId->toArray())->update([
            'template_id' => 16,
            // 'hoa_autogate_end' => Carbon::now()
        ]);

        return $changeTemplate;
    }
}
