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
}
