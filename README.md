## Laravel
System is created using laravel framework. Read more about it (here)[https://laravel.com/docs/8.x]

## Webpack
Uses laravel mix. Read more about laravel-mix here: https://laravel.com/docs/8.x/mix

## NPM Packages Used
See package.json for the list of packages used

## Laravel Packages Used
See composer.json for the list of packages used

## Configuration
Configuration needed by the system to run properly
- APP_NAME=Laravel  
- APP_ENV=local #local, staging, production  
- APP_DEBUG=false  
- APP_URL=http://main-gate-local.test #without trailing slash  
- DB_CONNECTION=mysql  
- DB_HOST=127.0.0.1  
- DB_PORT=3306  
- DB_DATABASE=main-gate-local  
- DB_USERNAME=root  
- DB_PASSWORD=  
- BROADCAST_DRIVER=pusher  
- PUSHER_APP_ID=main-gate  
- PUSHER_APP_KEY=key  
- PUSHER_APP_SECRET=secret  
- PUSHER_APP_HOST=main-gate-local.test  
- SESSION_DOMAIN=.main-gate-local.test  
- CLOUD_SYNC_URL=http://auto-gate-local.test  #without trailing slash  
- CLOUD_SYNC_LOGIN_EMAIL=
- CLOUD_SYNC_LOGIN_PASSWORD=
- CLOUD_SYNC_PORTAL=
- CLOUD_SYNC_LOGIN_TYPE=
- CLOUD_SYNC_CRON_SCHEDULE=
- LOG_SCAN=true
- MANUAL_SECRET_TOKEN=
- MANUAL_KIOSK_ID=
- MANUAL_INTERFACE=
- MANUAL_MODE=
- DELAYED_MINS_TO_VALIDATE_NEW_TAP=

## Manually creating of user
open terminal and change to the root directory of the system (e.g cd path/to/root/directory)  
php artisan tinker  
User::create(['name'=>'Juan Dela Cruz','email'=>'admin@camayacoast.com','password'=>Hash::make('secret')])  

## Manually updating of user password
open terminal and change to the root directory of the system (e.g cd path/to/root/directory)  
php artisan tinker  
User::where('email', 'admin@camayacoast.com')->update(['password'=>Hash::make('secret')])  

## Checking user validity in tinker
php artisan tinker
Auth::attempt(['email' => 'admin@camayacoast.com', 'password' => 'secret'])

## HTTP request between 2 local apps in laragon
https://forum.laragon.org/topic/1468/why-you-should-use-nginx-instead-of-apache-for-laragon  
set your Env Variables in your Apache vhost config then comment .env variable  
e.g  
<VirtualHost *:80>  
SetEnv DB_DATABASE xyz  
\</VirtualHost>  

## Cache
System is configured to use database as cache driver for easier migration in the future. Some of the configuration of the system will use key-value storage (e.g store login token when connecting to NBE API)

## Scheduler - To run the scheduler locally
https://laravel.com/docs/8.x/scheduling#running-the-scheduler-locally
Add the following to laragon procfile
Auto Gate Cloud Sync: autorun "php artisan schedule:work" PWD=C:\laragon\www\auto-gate-local

## Websocket - To run websocket locally
https://beyondco.de/docs/laravel-websockets/getting-started/introduction
<!-- Add the following to laragon procfile
Main Gate Websocket: autorun "php artisan websockets:serve" PWD=C:\laragon\www\main-gate-local -->
As per testing in local, adding of laravel websocket in laragon procfile does not work. An alternative approach was to execute it manually. Added a code in scheduler (app/Console/Kernel) to manually run it

## Creation of main gate passes
1. In NBE go to Booking page. 
1. Click on + New Booking tab to create a new booking entry
1. Fill up required fields
1. Then click Book button to proceed. A 'View (Booking Reference) Tab' will be created about the entry
1. Make sure that we are on the 'View (Booking Reference) Tab' page that we have previously created
1. Scroll down the guest list and click the QR code of the user that we want to add a gate passes
1. Add a new gate passes to this user by clicking 'Add Access Pass' button. A modal window will show
1. On the Pass stub dropdown field, select Main Gate Passes fill up other required fields
1. Click the save button to add the main gate pass to this user

## New Installation of the system
1. Download Laragon
1. Optional requirements (if version of PHP is below 7.3):
    - Download version 7.4 or above version of PHP (PHP 7.4 Thread safe)
    - Follow instruction on how to install new version of php [here](https://forum.laragon.org/topic/166)
1. Clone this repository
1. Run: composer install
1. Run: npm install
1. Create new mysql database. Note of the database name
1. Copy .env.example file from root directory to .env then modify needed configuration (Run: cp .env.example .env then see Configuration section above for the list of configuration to modify)
1. Run: php artisan key:generate --ansi
1. Run: php artisan migrate (Note: laragon apache and mysql should be running)
1. Run: 
      - On production: npm run prod
      - On development: npm run dev/watch
1. Add laragon procfile: Auto Gate Cloud Sync: autorun "php artisan schedule:work" PWD=C:\path\to\root\directory\of\the\system (e.g C:\laragon\www\auto-gate-local)
1. Enable SSL (right click on laragon > hover Apache > hover SSL > click Enable )
1. Run: cd C:\laragon\etc\ssl\&&mv laragon.crt laragon-bak.crt&&mv laragon.key laragon-bak.key
1. Run: cd C:\laragon\etc\ssl\&&openssl req -new -x509 -days 36500 -nodes -newkey rsa:2048 -keyout laragon.key -out laragon.crt -extensions v3_req

## Updating System
1. Update the system: git pull origin \<branch>
1. Run: composer install
1. Run: php artisan migrate
1. Run: npm install
1. Run: php artisan cache:clear
1. Run: php artisan config:cache
1. Run: 
      - On production run: npm run prod  
      - On development run: npm run dev/watch

## Syncing not working
Run: php artisan cache:clear  
Run: php artisan config:cache  
** Sometime due to unexpected turn off of the system. To fix: delete column with key 'framework/schedule' in cache table

## Update configuration in .env file
Run: php artisan config:cache  

## Adding a new table in NBE (new booking engine) for syncing
1. Create a new migration file (database table) that we need to sync from NBE 
1. Migrate the new table (make sure table columns are the same with what is created in NBE)
1. Modify the file app\Services\CloudService.php (add the table to be sync in $filter_for_inserts_updates variable in fetch_table_data function)
      ``` php
      $filter_for_inserts_updates = [
            'bookings' => [
                'id' => Booking::max('id'),
                'updated_at' => Booking::max('updated_at'),
            ],
            'taps' => [
                'insert_data' => Tap::where('sync_id', 0)
                    ->get()
                    ->map(function ($item) {
                        return collect($item)->except(['sync_id'])->all();
                    }),
            ],
            // ....
            // add table to be sync here
      ];
      ```
1. Modify the file app\Services\CloudService.php (add the table to be sync in `DB::transaction(function () use ($response) {})` function in sync_table function)
      ``` php
      DB::transaction(function () use ($response) {
            $create_data = function ($key, $model) use ($response) {};
            $update_data = function ($key, $model) use ($response) {};

            $create_data('bookings', Booking::class);
            $update_data('taps', Tap::class);
            // ....
            // add table to be sync here
      })
      ```
1. Modify the file in NBE (app\Http\Controllers\AutoGate\GateSync.php) (add the table to be sync in `return response()->json()` __invoke function)
      ``` php
      return response()->json([
            'success' => true,
            'data' => [
                  'bookings' => $this->read(),
                  'booking_tags' => $this->read(),
                  // ....
                  // add table to be sync here
            ]
      ]);
      ```
1. Test to make sure it works
      - Modify the file app\Services\CloudService.php sync_table funciton (instead of saving it return the response of the function)
      ``` php
      public function sync_table()
      {
        $response = $this->fetch_table_data();
        return $response;
      }
      ```
      - Open tinker in terminal. Run: php artisan tinker
      - In tinker assign new Cloudservice to variable. Run: $cs = new \App\Services\CloudService();
      - View the response from NBE by running:  $cs->sync_table();
      - Revert changes in app\Services\CloudService.php once done

## Sending test code via curl
syntax
```
curl -d "enter data here" -X POST url
```
example
```
curl -d "secret_token=CAMAYA9999&kiosk_id=1&interface=main_gate&mode=access&timestamp=&code=\<code>" -X POST http://auto-gate-local.test/api/auto-gate/v1/gate-access
```

## Scan log
if enabled it will create a csv file with file name scan-log-\<date>.csv and socket file with file name socket-log-\<date>.log at storage/logs

## Simulating qr code scan in techsafe's application
1. Copy the code (qr code) (ctrl+c)
2. Focus window on techsafe's application
3. Paste the code in techsafe's application (ctrl+v)
4. Press enter
