<?php

namespace App\Exports;

use Maatwebsite\Excel\Concerns\WithTitle;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithEvents;
use Maatwebsite\Excel\Events\AfterSheet;

class PembimbingTemplateSheet implements WithTitle, WithHeadings, WithEvents
{
    public function title(): string
    {
        return 'Data Pembimbing';
    }

    public function headings(): array
    {
        return [
            'Nama Lengkap',
            'NIP/NUPTK',
            'Jurusan/Bidang',
            'No. Telepon',
            'Tempat PKL'
        ];
    }

    public function registerEvents(): array
    {
        return [
            AfterSheet::class => function(AfterSheet $event) {
                $event->sheet->getDelegate()->getColumnDimension('A')->setWidth(30);
                $event->sheet->getDelegate()->getColumnDimension('B')->setWidth(25);
                $event->sheet->getDelegate()->getColumnDimension('C')->setWidth(25);
                $event->sheet->getDelegate()->getColumnDimension('D')->setWidth(20);
                $event->sheet->getDelegate()->getColumnDimension('E')->setWidth(35);
                
                $event->sheet->getDelegate()->getStyle('A1:E1')->getFont()->setBold(true);
            },
        ];
    }
}
