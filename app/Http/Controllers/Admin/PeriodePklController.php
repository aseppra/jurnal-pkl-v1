<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Setting;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PeriodePklController extends Controller
{
    public function index()
    {
        return Inertia::render('Admin/PeriodePkl', [
            'pklStart' => Setting::getValue('pkl_start'),
            'pklEnd' => Setting::getValue('pkl_end'),
        ]);
    }

    public function update(Request $request)
    {
        $request->validate([
            'pkl_start' => 'required|date',
            'pkl_end' => 'required|date|after:pkl_start',
        ]);

        Setting::setValue('pkl_start', $request->pkl_start);
        Setting::setValue('pkl_end', $request->pkl_end);

        return redirect()->back()->with('success', 'Periode PKL berhasil diperbarui.');
    }
}
