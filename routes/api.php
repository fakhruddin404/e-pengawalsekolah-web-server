<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\Auth\EmailVerificationController;
use App\Http\Controllers\Api\Auth\LoginController;
use App\Http\Controllers\Api\Auth\LogoutController;
use App\Http\Controllers\Api\LocationPing\LocationPingController;
use App\Http\Controllers\Api\Pelawat\PelawatController;
use App\Http\Controllers\Api\PasLawatan\PasLawatanController;
use App\Http\Controllers\Api\Pengawal\PengawalMediaController;
use App\Http\Controllers\Api\Profile\ProfileController;
use App\Http\Controllers\Api\Rondaan\RondaanController;

Route::prefix('pengawal')->group(function () {
    Route::post('login', [LoginController::class, 'login']);

    Route::get('/email/verify/{id}/{hash}', [EmailVerificationController::class, 'verifyEmail'])
    ->middleware(['signed', 'throttle:6,1'])
    ->name('verification.verify');

    Route::middleware('auth:sanctum')->get('me', function (Request $request) {
        $user = $request->user();

        return response()->json([
            'user' => $user,
            'pengawal' => $user?->pengawal,
        ]);
    });

    Route::middleware('auth:sanctum')->get('me/photo', [PengawalMediaController::class, 'mePhoto']);

    Route::middleware('auth:sanctum')->post('email/verification-notification', [EmailVerificationController::class, 'sendEmailVerification']);

    Route::middleware('auth:sanctum')->post('logout', [LogoutController::class, 'logout']);

    Route::middleware('auth:sanctum')->post('update-profile', [ProfileController::class, 'updateProfile']);

    Route::middleware('auth:sanctum')->get('titik-semak', [RondaanController::class, 'getTitikSemak']);
    
    Route::middleware('auth:sanctum')->post('simpan-rondaan', [RondaanController::class, 'simpanRondaan']);

    Route::middleware('auth:sanctum')->post('sahkan-titik', [RondaanController::class, 'sahkanTitik']);

    Route::middleware('auth:sanctum')->get('pelawat-search', [PelawatController::class, 'search']);
    
    Route::middleware('auth:sanctum')->get('pelawat-aktif', [PelawatController::class, 'aktif']);

    Route::middleware('auth:sanctum')->post('pas-lawatan', [PasLawatanController::class, 'store']);

    Route::middleware('auth:sanctum')->post('keluar-pas-lawatan/{id}', [PasLawatanController::class, 'keluar']);
    
    Route::middleware('auth:sanctum')->post('location-ping', [LocationPingController::class, 'store']);

});

