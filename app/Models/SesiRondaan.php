<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SesiRondaan extends Model
{
    use HasFactory;

    protected $table = 'sesi_rondaans';
    protected $primaryKey = 'fld_sr_idSesi';
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'fld_sr_idSesi',
        'fld_pgw_idPengawal',
        'fld_sr_tempoh',
        'fld_sr_pathRoute',
        'fld_sr_peratusTitikSemak',
    ];

    protected $casts = [
        'fld_sr_pathRoute' => 'array',
        'fld_sr_peratusTitikSemak' => 'integer',
    ];

    public function pengawal()
    {
        return $this->belongsTo(Pengawal::class, 'fld_pgw_idPengawal', 'fld_pgw_id');
    }

    public static function generateSrId()
    {
        // Susun mengikut susunan ID (Primary Key) menurun untuk dapatkan yang terakhir dengan tepat
        $lastSesiRondaan = self::orderBy('fld_sr_idSesi', 'desc')->first();

        if (!$lastSesiRondaan) {
            return 'SR-001';
        }

        $lastNumber = (int) str_replace('SR-', '', $lastSesiRondaan->fld_sr_idSesi);
        $newNumber = $lastNumber + 1;

        return 'SR-' . str_pad($newNumber, 3, '0', STR_PAD_LEFT);
    }
}
