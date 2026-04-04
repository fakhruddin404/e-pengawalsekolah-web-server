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
        'fld_sr_masaMula',
        'fld_sr_masaTamat',
        'fld_sr_urlGPX',
        'fld_sr_jumlahTitikSemak',
    ];
}
