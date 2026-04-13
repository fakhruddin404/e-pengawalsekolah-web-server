<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class LaporanKejadian extends Model
{
    use HasFactory;

    protected $table = 'laporan_kejadians';
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

    protected $casts = [
        'fld_rpt_tarikhMasa' => 'datetime',
        'fld_rpt_latitud' => 'float',
        'fld_rpt_longitud' => 'float',
    ];

    public function getRouteKeyName(): string
    {
        return 'fld_rpt_idLaporan';
    }

    public function pengawal(): BelongsTo
    {
        return $this->belongsTo(Pengawal::class, 'fld_pgw_idPengawal', 'fld_pgw_id');
    }

    public static function generateRptId()
    {
        // Susun mengikut susunan ID (Primary Key) menurun untuk dapatkan yang terakhir dengan tepat
        $lastLaporanKejadian = self::orderBy('fld_rpt_idLaporan', 'desc')->first();

        if (!$lastLaporanKejadian) {
            return 'RPT-001';
        }

        $lastNumber = (int) str_replace('RPT-', '', $lastLaporanKejadian->fld_rpt_idLaporan);
        $newNumber = $lastNumber + 1;

        return 'RPT-' . str_pad($newNumber, 3, '0', STR_PAD_LEFT);
    }
}
