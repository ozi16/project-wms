<?php
// routes/api.php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\TrxController;
use App\Http\Controllers\ApproveController;
use App\Http\Controllers\TransaksiController;
use App\Http\Controllers\Api\ProductController;
use App\Http\Controllers\Api\TrxDetailController;

Route::apiResource('products', ProductController::class);
// Route::apiResource('trxes', TrxController::class);
// Route::apiResource('trx-details', TrxDetailController::class);

Route::post('/transaksi', [TransaksiController::class, 'storeCart']);

Route::get('/approve', [ApproveController::class, 'index']);
Route::post('/approve/{id}', [ApproveController::class, 'update']);

Route::get('/out-products', [ApproveController::class, 'index']);
