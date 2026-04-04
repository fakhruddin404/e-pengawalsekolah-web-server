<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PasLawatan extends Model
{
    use HasFactory;

    protected $table = 'pas_lawatans';
    protected $primaryKey = 'fld_pas_idPas';
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'fld_pas_idPas',
        'fld_pgw_idPengawal',
        'fld_vis_id',
        'fld_pas_tujuan',
        'fld_pas_masaMasuk',
        'fld_pas_masaKeluar',
        'fld_pas_statusPas',
    ];
}
