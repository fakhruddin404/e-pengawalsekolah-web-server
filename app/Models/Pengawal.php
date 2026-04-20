<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Pengawal extends Model
{
    use HasFactory;

    /**
     * @var string
     */
    protected $table = 'pengawals';

    protected $primaryKey = 'fld_pgw_id';

    public $incrementing = false;

    protected $keyType = 'string';

    /**
     * @var list<string>
     */
    protected $fillable = [
        'user_id',
        'fld_pgw_id',
        'fld_pgw_noTelefon',
        'fld_pgw_noIC',
        'fld_pgw_status',
        'fld_pgw_statusSemasa',
        'fld_pgw_urlGambarWajah',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Nama paparan pengawal.
     *
     * Keutamaan:
     * - `User->name` (jika ada)
     * - `fld_pgw_id` (contoh: PGW-001)
     * - fallback: 'Pengawal'
     */
    public function displayName(): string
    {
        $name = (string) ($this->user?->name ?? '');
        $name = trim($name);
        if ($name !== '') {
            return $name;
        }

        $pgwId = (string) ($this->fld_pgw_id ?? '');
        $pgwId = trim($pgwId);
        if ($pgwId !== '') {
            return $pgwId;
        }

        return 'Pengawal';
    }

    public function laporanKejadians(): HasMany
    {
        return $this->hasMany(LaporanKejadian::class, 'fld_pgw_idPengawal', 'fld_pgw_id');
    }

    public function SesiRondaans(): HasMany
    {
        return $this->hasMany(SesiRondaan::class, 'fld_pgw_idPengawal', 'fld_pgw_id');
    }

    public static function generatePgwId()
    {
        // Susun mengikut susunan ID (Primary Key) menurun untuk dapatkan yang terakhir dengan tepat
        $lastPengawal = self::orderBy('fld_pgw_id', 'desc')->first();

        if (! $lastPengawal) {
            return 'PGW-001';
        }

        $lastNumber = (int) str_replace('PGW-', '', $lastPengawal->fld_pgw_id);
        $newNumber = $lastNumber + 1;

        return 'PGW-'.str_pad($newNumber, 3, '0', STR_PAD_LEFT);
    }
}
