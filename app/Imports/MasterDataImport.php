<?php

namespace App\Imports;

use Maatwebsite\Excel\Concerns\WithMultipleSheets;
use Maatwebsite\Excel\Concerns\SkipsUnknownSheets;

class MasterDataImport implements WithMultipleSheets, SkipsUnknownSheets
{
    public function sheets(): array
    {
        return [
            'Data Siswa' => new SiswaImport(),
            'Data DUDI' => new DudiImport(),
            'Data Pembimbing' => new PembimbingImport(),
        ];
    }

    public function onUnknownSheet($sheetName)
    {
        // Skip unknown sheets silently
    }
}
