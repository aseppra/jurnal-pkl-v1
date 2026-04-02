<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ActivityLog;
use App\Models\HelpRequest;
use Illuminate\Http\Request;
use Inertia\Inertia;

class HelpdeskController extends Controller
{
    public function index()
    {
        $requests = HelpRequest::latest()->get();

        return Inertia::render('Admin/Helpdesk', [
            'requests' => $requests,
        ]);
    }

    public function notifications()
    {
        $requests = HelpRequest::where('status', 'pending')
            ->latest()
            ->get()
            ->map(function ($req) {
                return [
                    'id' => $req->id,
                    'title' => 'Permintaan Reset Password',
                    'message' => "Ada permintaan dari {$req->name} via {$req->type}.",
                    'type' => 'warning',
                    'isNew' => true,
                    'time' => $req->created_at->diffForHumans(),
                ];
            });

        return response()->json(['notifications' => $requests]);
    }

    public function process(HelpRequest $helpRequest)
    {
        if ($helpRequest->type === 'whatsapp') {
            preg_match('/\(NISN:\s*([^)]+)\)/', $helpRequest->name, $matches);
            $nisn = $matches[1] ?? null;

            if ($nisn) {
                $siswa = \App\Models\Siswa::with('user')->where('nisn', $nisn)->first();

                if ($siswa && $siswa->user && $siswa->password_plain) {
                    $domain = \App\Models\Setting::getValue('wablas_domain');
                    $token = \App\Models\Setting::getValue('wablas_token');

                    if ($domain && $token) {
                        $phone = $helpRequest->contact;
                        if (str_starts_with($phone, '0')) {
                            $phone = '62' . substr($phone, 1);
                        }

                        $message = "Halo *{$siswa->name}*,\n\nBerikut adalah informasi login Anda untuk Portal Jurnal PKL:\n\nUsername: *{$siswa->user->username}*\nPassword: *{$siswa->password_plain}*\n\nHarap simpan informasi ini baik-baik.\n\n_Pesan otomatis dikirim oleh Sistem_";

                        try {
                            $response = \Illuminate\Support\Facades\Http::withHeaders([
                                'Authorization' => $token,
                            ])->post("{$domain}/api/send-message", [
                                'phone' => $phone,
                                'message' => $message,
                            ]);

                            if (!$response->successful()) {
                                return redirect()->back()->with('error', 'Gagal mengirim pesan WhatsApp. Pastikan token dan domain Wablas valid.');
                            }
                        } catch (\Exception $e) {
                            return redirect()->back()->with('error', 'Terjadi kesalahan sistem saat mencoba menghubungi API Wablas.');
                        }
                    } else {
                        return redirect()->back()->with('error', 'Pengaturan Wablas API belum dikonfigurasi. Silakan atur di menu Whatsapp API terlebih dahulu.');
                    }
                } else {
                    return redirect()->back()->with('error', 'Akun siswa tidak ditemukan atau Info Login belum di-generate.');
                }
            } else {
                return redirect()->back()->with('error', 'Gagal memverifikasi NISN dari permintaan ini.');
            }
        }

        $helpRequest->update(['status' => 'processed']);
        ActivityLog::log('Proses Helpdesk', "Memproses tiket helpdesk dari {$helpRequest->name}.");
        return redirect()->back()->with('success', 'Permintaan berhasil diproses.');
    }
}
