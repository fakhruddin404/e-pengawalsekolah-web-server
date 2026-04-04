<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Admin extends Model
{
    use HasFactory;

    /**
     * @var list<string>
     */
    protected $fillable = [
        'user_id',
        'fld_adm_id',
        'fld_adm_namaSekolah',
        'fld_adm_latitud',
        'fld_adm_longitud',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}

