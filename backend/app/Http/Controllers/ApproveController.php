<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\Trx;
use App\Models\TrxDetail;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ApproveController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        // $res = TrxDetail::with(['trx.user', 'product'])
        //     ->orderBy('created_at', 'desc')
        //     ->get();

        // return response()->json($res);

        $res = Trx::with(['productDetail.product', 'user'])
            ->whereHas('productDetail', function ($query) {
                $query->where('status', 0);
            })
            ->orWhereHas('productDetail', function ($query) {
                $query->where('status', 1);
            })
            ->where(function ($query) {
                $query->whereNull('notif_spv')
                    ->orWhere('notif_spv', 0);
            })
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json($res);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        // 
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $trxDetail = TrxDetail::findOrFail($id);

        $trxDetail->status = 1;
        $trxDetail->approved_at = now();
        $trxDetail->spv = $request->user_id ?? 1;
        $trxDetail->save();

        // update notif_spv di table trxes
        $trx = Trx::find($trxDetail->trx_id);
        if ($trx) {
            $trx->notif_spv = $request->user_id;
            $trx->save();
        }

        return response()->json([
            'success' => true,
            'message' => 'Approved successfully',
            'data' => $trxDetail
        ]);
    }

    //submit transaksi approve dan update stock
    public function submitApprove(Request $request)
    {
        try {
            DB::beginTransaction();

            $trxId = $request->trx_id;

            // mengambil semua product yang di approve di transaksi approve
            $trxDetails = TrxDetail::where('trx_id', $trxId)
                ->where('status', 1)
                ->get();

            if ($trxDetails->isEmpty()) {
                return response()->json([
                    'success' => false,
                    'message' => 'no approve items found'
                ], 400);
            }

            // check berapa banyak item yang di approve
            $pendingItems = TrxDetail::where('trx_id', $trxId)
                ->where('status', 0)
                ->count();

            if ($pendingItems > 0) {
                return response()->json([
                    'success' => false,
                    'message' => 'tolong approve semua item sebelum submit'
                ], 400);
            }

            // update stock setiap produknya
            foreach ($trxDetails as $detail) {
                $product = Product::findOrFail($detail->product_id);

                if ($product->stock < $detail->quantity) {
                    DB::rollBack();
                    return response()->json([
                        'success' => false,
                        'message' => 'stock tidak mencukupi untuk {$product->product_name}. Available: {$product->stock}, Requested: {$detail->quantity}'
                    ]);
                }

                $product->stock -= $detail->quantity;
                $product->save();
            }

            // update notif_spv setelah submit
            $trx = Trx::findOrFail($trxId);
            $trx->notif_spv = 1;
            $trx->save();

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Transaction submitted successfully. Stock has been updated.'
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Failed to submit transaction: ' . $e->getMessage()
            ]);
        }
    }

    /**
     * mengambil semua transaksi submit approve.
     */
    public function getOutProducts()
    {
        $outProducts = Trx::with(['productDetail.product', 'user'])
            ->where('notif_spv', 1)
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json($outProducts);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
