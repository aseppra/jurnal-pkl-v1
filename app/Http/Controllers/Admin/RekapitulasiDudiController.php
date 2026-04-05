<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Dudi;
use Illuminate\Http\Request;
use Inertia\Inertia;

class RekapitulasiDudiController extends Controller
{
    public function index(Request $request)
    {
        // Only get DUDI that has Siswa
        $query = Dudi::whereHas('siswas')->with(['siswas', 'pembimbings']);

        if ($search = $request->input('search')) {
            $query->where(function($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('address', 'like', "%{$search}%");
            });
        }

        if ($company = $request->input('company')) {
            $query->where('name', $company);
        }
        
        $paginator = $query->paginate(10)->withQueryString();

        $companies = Dudi::whereHas('siswas')->pluck('name');

        return Inertia::render('Admin/RekapitulasiDudi', [
            'dudis' => $paginator,
            'companies' => $companies,
            'filters' => $request->only('search', 'company'),
        ]);
    }

    public function exportPdf(Request $request)
    {
        $query = Dudi::whereHas('siswas')->with(['siswas' => function($q){
             $q->orderBy('name');
        }, 'pembimbings']);

        if ($search = $request->input('search')) {
             $query->where(function($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('address', 'like', "%{$search}%");
            });
        }

        if ($company = $request->input('company')) {
            $query->where('name', $company);
        }

        $dudis = $query->get();

        $startDate = \App\Models\Setting::getValue('pkl_start') ?? now()->startOfMonth()->toDateString();
        $endDate = \App\Models\Setting::getValue('pkl_end') ?? now()->endOfMonth()->toDateString();

        $pdf = \Barryvdh\DomPDF\Facade\Pdf::loadView('pdf.rekap-dudi', compact('dudis', 'startDate', 'endDate'));
        $pdf->setPaper('a4', 'portrait');

        $filename = 'Rekap_Penempatan_DUDI.pdf';

        if ($request->boolean('download')) {
            return $pdf->download($filename);
        }

        return $pdf->stream($filename);
    }
}
