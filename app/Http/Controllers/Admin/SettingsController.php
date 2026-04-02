<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ActivityLog;
use App\Models\Attendance;
use App\Models\Dudi;
use App\Models\HelpRequest;
use App\Models\Journal;
use App\Models\Notification;
use App\Models\Pembimbing;
use App\Models\Setting;
use App\Models\Siswa;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SettingsController extends Controller
{
    public function index()
    {
        return Inertia::render('Admin/Settings', [
            'counts' => [
                'siswa' => Siswa::count(),
                'dudi' => Dudi::count(),
                'pembimbing' => Pembimbing::count(),
                'journal' => Journal::count(),
                'attendance' => Attendance::count(),
                'helpRequest' => HelpRequest::count(),
            ],
        ]);
    }

    public function resetSiswa()
    {
        $count = Siswa::count();
        User::where('role', 'siswa')->delete();
        Siswa::query()->delete();
        Journal::query()->delete();
        Attendance::query()->delete();
        Notification::query()->delete();

        ActivityLog::log('Reset Data Siswa', "Menghapus {$count} data siswa beserta jurnal, absensi, dan notifikasi terkait.");

        return redirect()->back()->with('success', "Berhasil mereset {$count} data siswa beserta data terkait.");
    }

    public function resetDudi()
    {
        $count = Dudi::count();
        Siswa::query()->update(['dudi_id' => null]);
        Pembimbing::query()->update(['dudi_id' => null]);
        Dudi::query()->delete();

        ActivityLog::log('Reset Data DUDI', "Menghapus {$count} data DUDI.");

        return redirect()->back()->with('success', "Berhasil mereset {$count} data DUDI.");
    }

    public function resetPembimbing()
    {
        $count = Pembimbing::count();
        User::where('role', 'pembimbing')->delete();
        Pembimbing::query()->delete();

        ActivityLog::log('Reset Data Pembimbing', "Menghapus {$count} data pembimbing.");

        return redirect()->back()->with('success', "Berhasil mereset {$count} data pembimbing.");
    }

    public function resetPeriodePkl()
    {
        Setting::where('key', 'like', 'pkl_%')->delete();

        ActivityLog::log('Reset Periode PKL', 'Menghapus pengaturan periode PKL.');

        return redirect()->back()->with('success', 'Berhasil mereset pengaturan periode PKL.');
    }

    public function resetHelpdesk()
    {
        $count = HelpRequest::count();
        HelpRequest::query()->delete();

        ActivityLog::log('Reset Helpdesk', "Menghapus {$count} tiket helpdesk.");

        return redirect()->back()->with('success', "Berhasil mereset {$count} data helpdesk.");
    }

    public function resetAll()
    {
        $counts = [
            'siswa' => Siswa::count(),
            'dudi' => Dudi::count(),
            'pembimbing' => Pembimbing::count(),
        ];

        User::where('role', 'siswa')->delete();
        User::where('role', 'pembimbing')->delete();
        Siswa::query()->delete();
        Journal::query()->delete();
        Attendance::query()->delete();
        Notification::query()->delete();
        Dudi::query()->delete();
        Pembimbing::query()->delete();
        HelpRequest::query()->delete();
        Setting::where('key', 'like', 'pkl_%')->delete();

        ActivityLog::log('Reset Seluruh Data', "Menghapus semua data: {$counts['siswa']} siswa, {$counts['dudi']} DUDI, {$counts['pembimbing']} pembimbing, beserta seluruh data terkait.");

        return redirect()->back()->with('success', 'Berhasil mereset seluruh data sistem.');
    }
}
