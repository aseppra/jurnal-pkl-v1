<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Exports\MasterDataExport;
use App\Imports\MasterDataImport;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Maatwebsite\Excel\Facades\Excel;

class ImportDataController extends Controller
{
    public function index()
    {
        return Inertia::render('Admin/ImportData');
    }

    public function store(Request $request)
    {
        $request->validate([
            'file' => 'required|file|mimes:xlsx,xls|max:5120', // Max 5MB
        ]);

        try {
            Excel::import(new MasterDataImport, $request->file('file'));
            return redirect()->back()->with('success', 'Data master berhasil diimport! Seluruh data Siswa, DUDI, dan Pembimbing telah tersimpan.');
        } catch (\Maatwebsite\Excel\Validators\ValidationException $e) {
            $failures = $e->failures();
            $errorMsgs = [];
            foreach ($failures as $failure) {
                // $failure->row() is the row number
                // $failure->errors() is the array of validation messages
                $errorMsgs[] = "Baris " . $failure->row() . ": " . implode(', ', $failure->errors());
            }
            // Limit to 5 shown errors so it doesn't overflow session too much
            $displayErrors = array_slice($errorMsgs, 0, 5);
            $msg = "Gagal mengimport data. Terdapat kesalahan validasi:\n" . implode("\n", $displayErrors);
            if (count($errorMsgs) > 5) {
                $msg .= "\n...dan " . (count($errorMsgs) - 5) . " baris lainnya yang salah.";
            }

            return redirect()->back()->with('error', $msg);
        } catch (\Exception $e) {
            return redirect()->back()->with('error', 'Gagal mengimport data. Pastikan format file sesuai dengan template.');
        }
    }

    public function template()
    {
        return Excel::download(new MasterDataExport, 'template_import_jurnal_pkl.xlsx');
    }
}
