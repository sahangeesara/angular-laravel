<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use mysql_xdevapi\Schema;

class System extends Model
{

    protected $connection = 'mysql_second';
    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'id',
        'firstname',
        'lastname',
        'number',
        'address',
        'nic',
        'image',
        'image_url',
        'email',
    ];

    protected $appends = ['image_url'];

    protected function getImageUrlAttribute()
    {
        return $this->attributes['image_url'] = url(Storage::url($this->image));
    }

    /**
     * Get a system user by email.
     */
    public static function findByEmail($email)
    {
        return self::whereRaw('LOWER(email) = ?', [strtolower(trim($email))])->first();
    }
}

