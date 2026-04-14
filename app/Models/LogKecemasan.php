<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class LogKecemasan extends Model
{
    use HasFactory;

    protected $primaryKey = 'fld_sos_id';
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'fld_sos_id',
        'fld_pgw_idPengawal',
        'fld_sos_masa',
        'fld_sos_latitud',
        'fld_sos_longitud',
    ];

    public function pengawal(): BelongsTo
    {
        return $this->belongsTo(Pengawal::class, 'fld_pgw_idPengawal', 'fld_pgw_id');
    }

    public static function generateSosId()
    {
        $lastLogKecemasan = self::orderBy('fld_sos_id', 'desc')->first();

        if (!$lastLogKecemasan) {
            return 'SOS-001';
        }

        $lastNumber = (int) str_replace('SOS-', '', $lastLogKecemasan->fld_sos_id);
        $newNumber = $lastNumber + 1;

        return 'SOS-' . str_pad($newNumber, 3, '0', STR_PAD_LEFT);
    }
}
