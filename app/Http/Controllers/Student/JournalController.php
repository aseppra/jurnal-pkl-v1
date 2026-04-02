<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Models\Journal;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class JournalController extends Controller
{
    public function index(Request $request)
    {
        $siswa = Auth::user()->siswa;

        $query = $siswa->journals()->latest('date');

        if ($filter = $request->input('filter')) {
            if ($filter === 'verified') $query->where('status', 'verified');
            if ($filter === 'pending') $query->where('status', 'pending');
        }

        $journals = $query->get()->map(fn($j) => [
            'id' => $j->id,
            'date' => $j->date->format('d M Y'),
            'title' => $j->title,
            'description' => $j->description,
            'status' => $j->status,
            'statusText' => match($j->status) {
                'verified' => 'Terverifikasi',
                'pending' => 'Menunggu Review',
                'revision' => 'Perlu Revisi',
            },
            'image_path' => $j->image_path,
        ]);

        return Inertia::render('Student/JurnalSaya', [
            'journals' => $journals,
            'filters' => $request->only('filter'),
            'siswa' => $siswa,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'image' => 'nullable|image|max:2048',
        ]);

        $siswa = Auth::user()->siswa;

        $imagePath = null;
        if ($request->hasFile('image')) {
            $imagePath = $request->file('image')->store('journals', 'public');
        }

        Journal::create([
            'siswa_id' => $siswa->id,
            'date' => now()->toDateString(),
            'title' => $validated['title'],
            'description' => $validated['description'],
            'image_path' => $imagePath,
            'status' => 'verified',
        ]);

        return redirect()->back()->with('success', 'Jurnal berhasil dikirim.');
    }
}
