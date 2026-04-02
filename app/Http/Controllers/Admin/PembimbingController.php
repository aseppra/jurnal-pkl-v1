<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ActivityLog;
use App\Models\Pembimbing;
use App\Models\Dudi;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PembimbingController extends Controller
{
    public function index(Request $request)
    {
        $query = Pembimbing::with('dudi');

        if ($search = $request->input('search')) {
            $query->where(function($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('nip', 'like', "%{$search}%");
            });
        }

        $pembimbings = $query->latest()->paginate(10)->withQueryString();

        return Inertia::render('Admin/DataPembimbing', [
            'pembimbings' => $pembimbings,
            'dudiList' => Dudi::select('id', 'name')->orderBy('name')->get(),
            'filters' => $request->only('search'),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'nip' => 'required|string|unique:pembimbings,nip',
            'name' => 'required|string|max:255',
            'phone' => 'nullable|string|max:20',
            'department' => 'nullable|string|max:100',
            'dudi_id' => 'nullable|integer|exists:dudis,id',
        ]);

        $pembimbing = Pembimbing::create($validated);
        ActivityLog::log('Tambah Pembimbing', "Menambahkan pembimbing {$pembimbing->name} (NIP: {$pembimbing->nip}).");
        return redirect()->back()->with('success', 'Data pembimbing berhasil ditambahkan.');
    }

    public function update(Request $request, Pembimbing $pembimbing)
    {
        $validated = $request->validate([
            'nip' => 'required|string|unique:pembimbings,nip,' . $pembimbing->id,
            'name' => 'required|string|max:255',
            'phone' => 'nullable|string|max:20',
            'department' => 'nullable|string|max:100',
            'dudi_id' => 'nullable|integer|exists:dudis,id',
        ]);

        $pembimbing->update($validated);
        ActivityLog::log('Update Pembimbing', "Memperbarui data pembimbing {$pembimbing->name}.");
        return redirect()->back()->with('success', 'Data pembimbing berhasil diperbarui.');
    }

    public function destroy(Pembimbing $pembimbing)
    {
        ActivityLog::log('Hapus Pembimbing', "Menghapus pembimbing {$pembimbing->name}.");
        $pembimbing->delete();
        return redirect()->back()->with('success', 'Data pembimbing berhasil dihapus.');
    }

    public function bulkDestroy(Request $request)
    {
        $request->validate(['ids' => 'required|array', 'ids.*' => 'integer|exists:pembimbings,id']);
        ActivityLog::log('Hapus Masal Pembimbing', 'Menghapus ' . count($request->ids) . ' data pembimbing sekaligus.');
        Pembimbing::whereIn('id', $request->ids)->delete();
        return redirect()->back()->with('success', count($request->ids) . ' data pembimbing berhasil dihapus.');
    }
}
