<?php

namespace App\Exports;

use Maatwebsite\Excel\Concerns\Exportable;
use Maatwebsite\Excel\Concerns\WithMultipleSheets;

class MasterDataExport implements WithMultipleSheets
{
    use Exportable;

    public function sheets(): array
    {
        return [
            new SiswaTemplateSheet(),
            new DudiTemplateSheet(),
            new PembimbingTemplateSheet(),
        ];
    }
}
