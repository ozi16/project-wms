<?php

namespace App\Http\Controllers\Api;

use App\Models\TrxDetail;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;

class TrxDetailController extends Controller
{
    /**
     * Display a listing of the resource.
     */

    public function index()
    {
        return TrxDetail::with(['product', 'trx'])->get();
    }

    public function approve(Request $request, $id)
    {
        $trxDetail = TrxDetail::findOrFail($id);
        $trxDetail->status = 'approved';
        $trxDetail->spv = Auth::id();
        $trxDetail->approved_at = now();
        $trxDetail->save();

        return response()->json([
            'message' => 'Product approved by SPV',
            'data' => $trxDetail
        ]);
    }

    public function reject(Request $request, $id)
    {
        $trxDetail = TrxDetail::findOrFail($id);
        $trxDetail->status = 'rejected';
        $trxDetail->spv = Auth::id();
        $trxDetail->approved_at = now();
        $trxDetail->save();

        return response()->json([
            'message' => 'Product rejected by SPV',
            'data' => $trxDetail
        ]);
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
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
