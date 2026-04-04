<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class LokasiTitikSemak extends Model
{
    use HasFactory;

    protected $primaryKey = 'fld_loc_id';
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'fld_loc_id',
        'fld_loc_nama',
        'fld_loc_latitud',
        'fld_loc_longitud',
        'fld_loc_kodQR',
        'fld_loc_status',
    ];

    protected $casts = [
        'fld_loc_latitud' => 'float',
        'fld_loc_longitud' => 'float',
        'fld_loc_status' => 'boolean',
    ];

    public static function generateLTSId()
    {
        // Susun mengikut susunan ID (Primary Key) menurun untuk dapatkan yang terakhir dengan tepat
        $lastTitikSemak = self::orderBy('fld_loc_id', 'desc')->first();

        if (!$lastTitikSemak) {
            return 'LTS-001';
        }

        $lastNumber = (int) str_replace('LTS-', '', $lastTitikSemak->fld_loc_id);
        $newNumber = $lastNumber + 1;

        return 'LTS-' . str_pad($newNumber, 3, '0', STR_PAD_LEFT);
    }
}
