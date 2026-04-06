<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CitaServicio extends Model
{
    protected $table = 'cita_servicios';

    protected $fillable = ['cita_id', 'servicio_id'];
}
