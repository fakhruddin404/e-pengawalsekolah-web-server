<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class LaporanKejadian extends Model
{
    use HasFactory;

    protected $primaryKey = 'fld_rpt_idLaporan';
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'fld_rpt_idLaporan',
        'fld_pgw_idPengawal',
        'fld_rpt_kategori',
        'fld_rpt_keterangan',
        'fld_rpt_urlGambar',
        'fld_rpt_tarikhMasa',
        'fld_rpt_latitud',
        'fld_rpt_longitud',
        'fld_rpt_status',
    ];
}
