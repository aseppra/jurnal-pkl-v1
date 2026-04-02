<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Siswa;
use App\Models\Dudi;
use Illuminate\Http\Request;
use Inertia\Inertia;

class RekapitulasiController extends Controller
{
    public function index(Request $request)
    {
        $query = Siswa::with(['dudi', 'journals', 'attendances']);

        if ($search = $request->input('search')) {
            $query->where(function($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")->orWhere('nisn', 'like', "%{$search}%");
            });
        }
        if ($class = $request->input('class')) $query->where('class', $class);
        if ($company = $request->input('company')) $query->whereHas('dudi', fn($q) => $q->where('name', $company));

        $paginator = $query->paginate(10)->withQueryString();

        $paginator->getCollection()->transform(function ($s) {
            $totalDays = max($s->attendances->count(), 1);
            $hadirDays = $s->attendances->whereIn('status', ['hadir', 'terlambat'])->count();
            
            // Check if filled today - use filter since 'date' is cast to Carbon
            $todayStr = today()->toDateString();
            $hasJournalToday = $s->journals->filter(fn($j) => $j->date->toDateString() === $todayStr)->count() > 0;

            return [
                'id' => $s->id,
                'name' => $s->name,
                'nisn' => $s->nisn,
                'class' => $s->class,
                'company' => $s->dudi?->name ?? '-',
                'attendance' => $hadirDays . '/' . $totalDays,
                'progress' => $totalDays > 0 ? round(($hadirDays / $totalDays) * 100) : 0,
                'status' => $hasJournalToday ? 'Sudah Mengisi' : 'Belum Mengisi',
                'statusColor' => $hasJournalToday ? 'emerald' : 'rose',
            ];
        });

        $totalSiswa = Siswa::count();
        $totalDudi = Dudi::count();

        $classes = Siswa::distinct()->pluck('class');
        $companies = Dudi::pluck('name');

        return Inertia::render('Admin/Rekapitulasi', [
            'students' => $paginator,
            'stats' => [
                'totalSiswa' => $totalSiswa,
                'totalDudi' => $totalDudi,
            ],
            'classes' => $classes,
            'companies' => $companies,
            'filters' => $request->only('search', 'class', 'company'),
        ]);
    }

    public function show(Siswa $siswa, Request $request)
    {
        $siswa->load('dudi', 'pembimbing');

        // Determine date range
        $startDate = $request->input('start_date');
        $endDate = $request->input('end_date');

        if (!$startDate || !$endDate) {
            // Default to Global Settings PKL Period or current month
            $start = \App\Models\Setting::getValue('pkl_start');
            $end = \App\Models\Setting::getValue('pkl_end');

            if ($start && $end) {
                // Determine if we should show the whole period or default to the last 30 days if period is long
                // To keep it simple, we use the current month by default or the whole period.
                // Let's default to the whole period.
                $startDate = $start;
                $endDate = $end;
            } else {
                $startDate = now()->startOfMonth()->toDateString();
                $endDate = now()->endOfMonth()->toDateString();
            }
        }

        $attendances = $siswa->attendances()
            ->whereBetween('date', [$startDate, $endDate])
            ->orderBy('date', 'desc')
            ->get();

        $journals = $siswa->journals()
            ->whereBetween('date', [$startDate, $endDate])
            ->orderBy('date', 'desc')
            ->get();

        return Inertia::render('Admin/RekapitulasiDetail', [
            'siswa' => $siswa,
            'attendances' => $attendances,
            'journals' => $journals,
            'filters' => [
                'start_date' => $startDate,
                'end_date' => $endDate,
            ]
        ]);
    }
}
