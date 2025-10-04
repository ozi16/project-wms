<?php

namespace App\Http\Controllers;

use App\Models\Trx;
use App\Models\TrxDetail;
use Illuminate\Http\Request;

class ApproveController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $res = TrxDetail::with('trx')->get();

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
        $trxDetail->spv = $request->user_id;
        $trxDetail->save();

        // update notif_spv di table trxes
        $trx = Trx::find($trxDetail->trx_id);
        if ($trx) {
            $trx->notif_spv = $request->user_id;
            $trx->save();
        }

        return response()->json([
            'message' => 'Approved successfully',
            'data' => $trxDetail
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
