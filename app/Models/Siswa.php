<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Siswa extends Model
{
    protected $fillable = ['user_id', 'nisn', 'name', 'gender', 'email', 'class', 'dudi_id', 'pembimbing_id', 'pkl_start', 'pkl_end', 'password_plain'];

    protected $casts = [
        'pkl_start' => 'date',
        'pkl_end' => 'date',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function dudi(): BelongsTo
    {
        return $this->belongsTo(Dudi::class);
    }

    public function pembimbing(): BelongsTo
    {
        return $this->belongsTo(Pembimbing::class);
    }

    public function journals(): HasMany
    {
        return $this->hasMany(Journal::class);
    }

    public function attendances(): HasMany
    {
        return $this->hasMany(Attendance::class);
    }
}
