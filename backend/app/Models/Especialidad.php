<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Especialidad extends Model
{
    use HasFactory;

    protected $table = 'especialidades';

    protected $fillable = ['nombre', 'icono', 'color'];

    public function profesionales()
    {
        return $this->hasMany(Profesional::class);
    }

    public function servicios()
    {
        return $this->hasMany(Servicio::class);
    }
}
