<?php

namespace App\Imports;

use App\Models\User;
use App\Models\Siswa;
use Illuminate\Support\Facades\Hash;
use Maatwebsite\Excel\Concerns\ToModel;
use Maatwebsite\Excel\Concerns\WithHeadingRow;
use Maatwebsite\Excel\Concerns\WithBatchInserts;
use Maatwebsite\Excel\Concerns\WithChunkReading;

class SiswaImport implements ToModel, WithHeadingRow, WithBatchInserts, WithChunkReading
{
    public function model(array $row)
    {
        if (empty($row['nama_lengkap']) || empty($row['nisn'])) {
            return null; // Skip empty rows
        }

        // Check if NISN already exists
        if (Siswa::where('nisn', $row['nisn'])->exists()) {
            return null;
        }

        return new Siswa([
            'user_id' => null,
            'name' => $row['nama_lengkap'],
            'nisn' => $row['nisn'],
            'gender' => strtoupper(trim($row['jenis_kelamin_lp'] ?? '')) === 'P' ? 'P' : 'L',
            'class' => $row['kelas'] ?? '',
            'email' => $row['email'] ?? null,
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
