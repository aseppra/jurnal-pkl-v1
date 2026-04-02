<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Attendance extends Model
{
    protected $fillable = ['siswa_id', 'date', 'check_in', 'check_out', 'status', 'location', 'notes', 'reason', 'proof_file'];

    protected $casts = [
        'date' => 'date',
    ];

    public function siswa(): BelongsTo
    {
        return $this->belongsTo(Siswa::class);
    }
}
