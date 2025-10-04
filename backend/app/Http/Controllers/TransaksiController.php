<?php

namespace App\Http\Controllers;

use App\Models\Trx;
use App\Models\TrxDetail;
use Illuminate\Http\Request;

class TransaksiController extends Controller
{

    public function index()
    {
        return response()->json(TrxDetail::all());
    }

    public function storeCart(Request $request)
    {
        $trx = Trx::create([
            'user_id' => 1,
            'status' => 0,
            'notif_spv' => null
        ]);

        foreach ($request->cartItems as $item) {
            TrxDetail::create([
                'trx_id' => $trx->id,
                'product_id' => $item['product_id'],
                'quantity' => $item['quantity'],
                'spv' => $item['spv'] ?? null,
                'status' => $item['status'] ?? 0,
                'approved_at' => null
            ]);
        }


        // TrxDetail::create([
        //     'trx_id' => $trx->id,
        //     'product_id' => ['product_id'],
        //     'quantity' => ['quantity'],
        //     'spv' => ['spv'] ?? null,
        //     'status' => ['status'] ?? 0,
        //     'approved_at' => null
        // ]);


        return response()->json([
            'message' => 'transaksi berhasil',
            'trx_id' => $trx->id
        ]);
    }
}
