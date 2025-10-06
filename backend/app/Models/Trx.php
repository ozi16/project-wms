<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Trx extends Model
{

    protected $fillable = ['user_id', 'notif_spv', 'date'];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function products()
    {
        return $this->belongsToMany(Product::class, 'trx_details', 'trx_id', 'product_id')
            ->withPivot('status', 'quantity', 'approved_at', 'spv', 'spv_qty')
            ->withTimestamps();
    }

    public function productDetail()
    {
        return $this->hasMany(TrxDetail::class);
    }
}
