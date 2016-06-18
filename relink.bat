set ROOT=C:\Users\nguye\Documents\Programming\Working

del %ROOT%\ApplicationProjects\MedicareProvidersSearch\MedicareProvidersSearch\Scripts\Medicare.js
mklink %ROOT%\ApplicationProjects\MedicareProvidersSearch\MedicareProvidersSearch\Scripts\Medicare.js %ROOT%\NeoMedix\Trabectome\Scripts\Site\Medicare.js

del %ROOT%\ApplicationProjects\MedicareProvidersSearch\MedicareProvidersSearch\Controllers\MedicareController.cs
mklink %ROOT%\ApplicationProjects\MedicareProvidersSearch\MedicareProvidersSearch\Controllers\MedicareController.cs %ROOT%\NeoMedix\System.Controllers\MedicareController.cs

del %ROOT%\ApplicationProjects\MedicareProvidersSearch\MedicareProvidersSearch\Views\Medicare
mklink /D %ROOT%\ApplicationProjects\MedicareProvidersSearch\MedicareProvidersSearch\Views\Medicare %ROOT%\NeoMedix\Trabectome\Views\Medicare

pause