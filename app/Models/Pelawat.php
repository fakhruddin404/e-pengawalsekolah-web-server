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
}
