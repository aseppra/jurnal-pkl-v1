<?php

namespace App\Imports;

use App\Models\Pembimbing;
use App\Models\Dudi;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Maatwebsite\Excel\Concerns\ToModel;
use Maatwebsite\Excel\Concerns\WithHeadingRow;
use Maatwebsite\Excel\Concerns\WithBatchInserts;
use Maatwebsite\Excel\Concerns\WithChunkReading;

class PembimbingImport implements ToModel, WithHeadingRow, WithBatchInserts, WithChunkReading
{
    public function model(array $row)
    {
        if (empty($row['nama_lengkap']) || empty($row['nipnuptk'])) {
            return null; // Skip empty rows
        }

        // Avoid duplicate NIP
        if (Pembimbing::where('nip', $row['nipnuptk'])->exists()) {
            return null;
        }

        // Resolve DUDI if provided
        $dudiId = null;
        if (!empty($row['tempat_pkl'])) {
            $dudi = Dudi::where('name', $row['tempat_pkl'])->first();
            if ($dudi) {
                $dudiId = $dudi->id;
            }
        }

        // Create User account corresponding to this Pembimbing
        $user = User::create([
            'name' => $row['nama_lengkap'],
            'username' => $row['nipnuptk'],
            'password' => Hash::make('12345678'),
            'role' => 'pembimbing',
        ]);

        return new Pembimbing([
            'user_id' => $user->id,
            'name' => $row['nama_lengkap'],
            'nip' => $row['nipnuptk'],
            'department' => $row['jurusanbidang'] ?? null,
            'phone' => $row['no_telepon'] ?? null,
            'dudi_id' => $dudiId,
        ]);
    }

    public function batchSize(): int
    {
        return 100;
    }

    public function chunkSize(): int
    {
        return 100;
    }
}
