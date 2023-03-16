<!DOCTYPE html>
<html>

<head>
  <title>Camaya Coast - Main Gate</title>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />

  <!-- <meta http-equiv="Content-Security-Policy" content="upgrade-insecure-requests"> -->
  <meta name="csrf-token" content="{{ csrf_token() }}">
  <link rel="icon" href="{{asset("/images/camaya-logo.png")}}" />
  <link href="{{ mix('css/app.css') }}" rel="stylesheet" />
  <link href="{{ mix('css/custom-tailwind.css') }}" rel="stylesheet" />
</head>

<body>
  <div id="app"></div>

  <script src="{{ asset('js/app.js') }}"></script>

</body>

</html>