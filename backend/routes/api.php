<?php
// routes/api.php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\TrxController;
use App\Http\Controllers\ApproveController;
use App\Http\Controllers\TransaksiController;
use App\Http\Controllers\OutProductController;
use App\Http\Controllers\Api\ProductController;
use App\Http\Controllers\Api\TrxDetailController;

Route::apiResource('products', ProductController::class);
// Route::apiResource('trxes', TrxController::class);
// Route::apiResource('trx-details', TrxDetailController::class);

Route::post('/transaksi', [TransaksiController::class, 'storeCart']);

Route::get('/approve', [ApproveController::class, 'index']);
Route::post('/approve/{id}', [ApproveController::class, 'update']);
Route::post('/approve/submit', [ApproveController::class, 'submitApprove']);
Route::post('/approve/approve-all/{trx_id}', [ApproveController::class, 'submitApprove']);

Route::get('/out-products', [ApproveController::class, 'getOutProducts']);

// Out Product
Route::get('/out-products/final', [OutProductController::class]);
