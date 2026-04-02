<?php

namespace App\Http\Controllers;

use App\Models\HelpRequest;
use Illuminate\Http\Request;

class HelpdeskController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'nisn' => 'required|string|max:50',
            'name' => 'required|string|max:255',
            'email' => 'required|string|max:255',
        ]);

        $type = str_contains($request->email, '@') ? 'email' : 'whatsapp';

        HelpRequest::create([
            'name' => $request->name . ' (NISN: ' . $request->nisn . ')',
            'contact' => $request->email,
            'type' => $type,
            'status' => 'pending',
        ]);

        return redirect()->back()->with('success', 'Permintaan reset password berhasil dikirim. Admin akan segera memproses informasi login Anda.');
    }
}
