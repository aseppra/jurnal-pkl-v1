<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Kelas;
use Illuminate\Http\Request;

class KelasController extends Controller
{
    public function index()
    {
        $kelasList = Kelas::orderBy('name')->get();

        return \Inertia\Inertia::render('Admin/KelasJurusan', [
            'kelasList' => $kelasList,
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:50|unique:kelas,name',
            'description' => 'nullable|string|max:255',
        ]);

        Kelas::create($request->only('name', 'description'));

        return redirect()->back()->with('success', 'Kelas berhasil ditambahkan.');
    }

    public function update(Request $request, Kelas $kela)
    {
        $request->validate([
            'name' => 'required|string|max:50|unique:kelas,name,' . $kela->id,
            'description' => 'nullable|string|max:255',
        ]);

        $kela->update($request->only('name', 'description'));

        return redirect()->back()->with('success', 'Kelas berhasil diperbarui.');
    }

    public function destroy(Kelas $kela)
    {
        $kela->delete();

        return redirect()->back()->with('success', 'Kelas berhasil dihapus.');
    }
}
