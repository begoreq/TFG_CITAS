<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Cita extends Model
{
    use HasFactory;

    protected $fillable = ['paciente_id', 'profesional_id', 'fecha', 'hora', 'estado', 'notas', 'notas_medicas', 'no_asistio'];

    protected $casts = [
        'no_asistio' => 'boolean',
    ];

    public function paciente()
    {
        return $this->belongsTo(User::class, 'paciente_id');
    }

    public function profesional()
    {
        return $this->belongsTo(Profesional::class);
    }

    public function servicios()
    {
        return $this->belongsToMany(Servicio::class, 'cita_servicios');
    }
}
