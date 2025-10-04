<?php

namespace App\Http\Controllers;

use App\Models\Trx;
use App\Models\TrxDetail;
use App\Models\User;
use Illuminate\Http\Request;

class TransaksiController extends Controller
{

    public function index()
    {
        return response()->json(TrxDetail::all());
    }

    public function storeCart(Request $request)
    {
        try {
            $request->validate([
                'cartItems' => 'required|array',
                'cartItems.*.product_id' => 'required|exists:products,id',
                'cartItems.*.quantity' => 'required|integer|min:1',
            ]);

            $user = User::firstOrCreate(
                ['email' => 'test@example.com'],
                [
                    'name' => 'Test',
                    'password' => bcrypt('password')
                ]
            );

            $trx = Trx::create([
                'user_id' => 1,
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

            return response()->json([
                'success' => true,
                'message' => 'Transaksi berhasil',
                'trx_id' => $trx->id
            ], 201);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Transaksi error',
                'errors' => $e->errors()
            ]);
        } catch (\Exception $e) {
            return response()->json([

                'success' => false,
                'message' => 'terjadi kesalahan : ' . $e->getMessage()

            ], 500);
        }



        // TrxDetail::create([
        //     'trx_id' => $trx->id,
        //     'product_id' => ['product_id'],
        //     'quantity' => ['quantity'],
        //     'spv' => ['spv'] ?? null,
        //     'status' => ['status'] ?? 0,
        //     'approved_at' => null
        // ]);



    }
}
