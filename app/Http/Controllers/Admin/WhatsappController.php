<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Setting;
use Illuminate\Http\Request;
use Inertia\Inertia;

class WhatsappController extends Controller
{
    public function index()
    {
        return Inertia::render('Admin/Whatsapp', [
            'wablas_domain' => Setting::getValue('wablas_domain', ''),
            'wablas_token' => Setting::getValue('wablas_token', ''),
        ]);
    }

    public function update(Request $request)
    {
        $request->validate([
            'wablas_domain' => 'nullable|url|max:255',
            'wablas_token' => 'nullable|string|max:500',
        ]);

        Setting::setValue('wablas_domain', rtrim($request->wablas_domain, '/'));
        Setting::setValue('wablas_token', $request->wablas_token);

        return redirect()->back()->with('success', 'Pengaturan Whatsapp API (Wablas) berhasil disimpan.');
    }
}
