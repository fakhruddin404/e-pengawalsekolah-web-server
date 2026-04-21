<?php

use App\Http\Controllers\Api\LoginAuthApiController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::prefix('pengawal')->group(function () {
    Route::post('login', [LoginAuthApiController::class, 'login']);

    Route::middleware('auth:sanctum')->get('me', function (Request $request) {
        $user = $request->user();

        return response()->json([
            'user' => $user,
            'pengawal' => $user?->pengawal,
        ]);
    });

    Route::middleware('auth:sanctum')->get('me/photo', [LoginAuthApiController::class, 'mePhoto']);

    Route::middleware('auth:sanctum')->post('email/verification-notification', [LoginAuthApiController::class, 'sendEmailVerification']);

    Route::middleware('auth:sanctum')->post('update-profile', [LoginAuthApiController::class, 'updateProfile']);
});

