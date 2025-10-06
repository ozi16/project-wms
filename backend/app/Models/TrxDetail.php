<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TrxDetail extends Model
{
    protected $fillable = ['product_id', 'trx_id', 'quantity', 'spv', 'status', 'approved_at', 'spv_qty'];

    public function trx()
    {
        return $this->belongsTo(Trx::class);
    }


    public function product()
    {
        return $this->belongsTo(Product::class, 'product_id');
    }
}
