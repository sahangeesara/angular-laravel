<?php

use App\Http\Controllers\Api\ItemController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\CartController;
use App\Http\Controllers\ChangePasswordController;
use App\Http\Controllers\CheckoutController;
use App\Http\Controllers\ItemController2;
use App\Http\Controllers\PaymentController;
use App\Http\Controllers\ResetPasswordController;
use App\Http\Controllers\AjaxContactController;
use App\Http\Controllers\SystemController;
Route::group([

    'middleware' => 'api',

], function ($router) {

    Route::post('login', [AuthController::class,'login']);
    Route::post('signup', [AuthController::class,'signup']);
    Route::post('sendPasswordResetLink', [ResetPasswordController::class,'sendEmail']);
    Route::post('resetPassword', [ChangePasswordController::class,'process']);
    Route::post('save', [AjaxContactController::class, 'store']);
    Route::post('update', [AjaxContactController::class, 'edit']);
    Route::delete('delete', [AjaxContactController::class, 'delete']);
    Route::get('search', [AjaxContactController::class, 'search']);
    Route::delete('deleteItem', [AjaxContactController::class, 'delete']);

    Route::middleware('auth:api')->group(function () {
        Route::post('logout', [AuthController::class,'logout']);
        Route::post('refresh', [AuthController::class,'refresh']);
        Route::post('me', [AuthController::class,'me']);

        Route::get('cart', [CartController::class, 'index']);
        Route::post('cart/items', [CartController::class, 'store']);
        Route::patch('cart/items/{itemId}', [CartController::class, 'update']);
        Route::delete('cart/items/{itemId}', [CartController::class, 'destroy']);
        Route::delete('cart', [CartController::class, 'clear']);

        Route::post('checkout', [CheckoutController::class, 'store']);

        Route::get('payments/{paymentId}', [PaymentController::class, 'show']);
        Route::post('payments/{paymentId}/confirm', [PaymentController::class, 'confirm']);

        Route::middleware('system.customer')->group(function () {
            Route::post('saveItem', [ItemController2::class, 'store']);
        });
    });

    Route::middleware('auth:api')->get('system/me', [SystemController::class, 'getByUserEmail']);

//    Route::get('ajax-form', [AjaxContactController::class, 'index']);

});
Route::apiResources([
    'items' => ItemController::class,
]);
