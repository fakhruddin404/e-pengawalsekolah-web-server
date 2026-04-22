<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

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

    protected $casts = [
        'fld_pas_masaMasuk' => 'datetime',
        'fld_pas_masaKeluar' => 'datetime',
    ];

    public function pengawal(): BelongsTo
    {
        return $this->belongsTo(Pengawal::class, 'fld_pgw_idPengawal', 'fld_pgw_id');
    }
    
    public function pelawat(): BelongsTo
    {
        return $this->belongsTo(Pelawat::class, 'fld_vis_id', 'fld_vis_id');
    }

    public static function generatePasId()
    {
        // Susun mengikut susunan ID (Primary Key) menurun untuk dapatkan yang terakhir dengan tepat
        $lastPasLawatan = self::orderBy('fld_pas_idPas', 'desc')->first();

        if (!$lastPasLawatan) {
            return 'PAS-001';
        }

        $lastNumber = (int) str_replace('PAS-', '', $lastPasLawatan->fld_pas_idPas);
        $newNumber = $lastNumber + 1;

        return 'PAS-' . str_pad($newNumber, 3, '0', STR_PAD_LEFT);
    }
}
