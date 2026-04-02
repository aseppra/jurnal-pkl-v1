<?php

namespace App\Exports;

use Maatwebsite\Excel\Concerns\WithTitle;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithEvents;
use Maatwebsite\Excel\Events\AfterSheet;

class DudiTemplateSheet implements WithTitle, WithHeadings, WithEvents
{
    public function title(): string
    {
        return 'Data DUDI';
    }

    public function headings(): array
    {
        return [
            'Nama Perusahaan',
            'Alamat',
            'Kontak'
        ];
    }

    public function registerEvents(): array
    {
        return [
            AfterSheet::class => function(AfterSheet $event) {
                $event->sheet->getDelegate()->getColumnDimension('A')->setWidth(35);
                $event->sheet->getDelegate()->getColumnDimension('B')->setWidth(50);
                $event->sheet->getDelegate()->getColumnDimension('C')->setWidth(20);
                
                $event->sheet->getDelegate()->getStyle('A1:C1')->getFont()->setBold(true);
            },
        ];
    }
}
