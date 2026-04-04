<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PentadbirSekolah extends Model
{
    use HasFactory;

    /**
     * @var string
     */
    protected $table = 'pentadbir_sekolahs';

    /**
     * @var list<string>
     */
    protected $fillable = [
        'user_id',
        'fld_ps_id',
        'fld_ps_noTelefon',
        'fld_ps_noIC',
        'fld_ps_jabatan',
        'fld_ps_status',
        'fld_ps_urlGambarWajah',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}

