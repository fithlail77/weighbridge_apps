<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\WeighingController;

Route::post('/timbangan/update', [WeighingController::class, 'updateLiveWeight']);

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');
