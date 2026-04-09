<?php

namespace App\Models;


use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use mysql_xdevapi\Schema;


class Item extends Model
{
    protected $connection = 'mysql_second';

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'id',
        'itemname',
        'itemprice',
        'image',
        'image_url',
        'itemcode',
    ];
    protected $appends = ['image_url'];

    protected function getImageUrlAttribute()
    {
        return $this->attributes['image_url'] = url(Storage::url($this->image));
    }

}
