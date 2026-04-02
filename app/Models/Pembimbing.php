<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Pembimbing extends Model
{
    protected $fillable = ['user_id', 'nip', 'name', 'phone', 'department', 'dudi_id'];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function dudi(): BelongsTo
    {
        return $this->belongsTo(Dudi::class);
    }

    public function siswas(): HasMany
    {
        return $this->hasMany(Siswa::class);
    }
}
