<?php

namespace App\Exports;

use Maatwebsite\Excel\Concerns\WithTitle;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithEvents;
use Maatwebsite\Excel\Events\AfterSheet;

class SiswaTemplateSheet implements WithTitle, WithHeadings, WithEvents
{
    public function title(): string
    {
        return 'Data Siswa';
    }

    public function headings(): array
    {
        return [
            'Nama Lengkap',
            'NISN',
            'Jenis Kelamin (L/P)',
            'Kelas',
            'Email'
        ];
    }

    public function registerEvents(): array
    {
        return [
            AfterSheet::class => function(AfterSheet $event) {
                // Auto-fit columns
                $event->sheet->getDelegate()->getColumnDimension('A')->setWidth(30);
                $event->sheet->getDelegate()->getColumnDimension('B')->setWidth(20);
                $event->sheet->getDelegate()->getColumnDimension('C')->setWidth(20);
                $event->sheet->getDelegate()->getColumnDimension('D')->setWidth(15);
                $event->sheet->getDelegate()->getColumnDimension('E')->setWidth(30);
                
                // Bold headers
                $event->sheet->getDelegate()->getStyle('A1:E1')->getFont()->setBold(true);
            },
        ];
    }
}
