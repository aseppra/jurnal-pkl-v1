<?php

namespace App\Models;

use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Database\Eloquent\Relations\HasOne;

class User extends Authenticatable
{
    /** @use HasFactory<UserFactory> */
    use HasFactory, Notifiable;

    protected $fillable = [
        'name', 'username', 'email', 'password', 'role', 'phone', 'avatar', 'is_active',
    ];

    protected $hidden = [
        'password', 'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'is_active' => 'boolean',
        ];
    }

    public function isAdmin(): bool
    {
        return $this->role === 'admin';
    }

    public function isSiswa(): bool
    {
        return $this->role === 'siswa';
    }

    public function isPembimbing(): bool
    {
        return $this->role === 'pembimbing';
    }

    public function siswa(): HasOne
    {
        return $this->hasOne(Siswa::class);
    }

    public function pembimbing(): HasOne
    {
        return $this->hasOne(Pembimbing::class);
    }
}
