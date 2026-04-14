<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Pelawat extends Model
{
    use HasFactory;

    protected $primaryKey = 'fld_vis_id';
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'fld_vis_id',
        'fld_vis_noIC',
        'fld_vis_namaPenuh',
        'fld_vis_noTelefon',
        'fld_vis_noKenderaan',
        'fld_vis_urlGambarWajah',
        'fld_vis_statusSenaraiHitam',
    ];

    public function pasLawatans(): HasMany
    {
        return $this->hasMany(PasLawatan::class, 'fld_vis_id', 'fld_vis_id');
    }

    public static function generateVisId()
    {
        // Susun mengikut susunan ID (Primary Key) menurun untuk dapatkan yang terakhir dengan tepat
        $lastPelawat = self::orderBy('fld_vis_id', 'desc')->first();

        if (!$lastPelawat) {
            return 'VIS-001';
        }

        $lastNumber = (int) str_replace('VIS-', '', $lastPelawat->fld_vis_id);
        $newNumber = $lastNumber + 1;

        return 'VIS-' . str_pad($newNumber, 3, '0', STR_PAD_LEFT);
    }
}
