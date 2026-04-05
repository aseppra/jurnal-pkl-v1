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
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;
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
            'admins' => User::where('role', 'admin')
                ->select('id', 'name', 'username', 'email', 'phone', 'is_active', 'created_at')
                ->orderBy('created_at', 'desc')
                ->get(),
        ]);
    }

    public function storeAdmin(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'username' => 'required|string|max:255|unique:users,username',
            'email' => 'nullable|email|max:255|unique:users,email',
            'phone' => 'nullable|string|max:20',
            'password' => 'required|string|min:6|confirmed',
        ]);

        $user = User::create([
            'name' => $validated['name'],
            'username' => $validated['username'],
            'email' => $validated['email'] ?? null,
            'phone' => $validated['phone'] ?? null,
            'password' => Hash::make($validated['password']),
            'role' => 'admin',
            'is_active' => true,
        ]);

        ActivityLog::log('Tambah Akun Admin', "Menambahkan akun admin baru: {$user->name} ({$user->username})");

        return redirect()->back()->with('success', "Berhasil menambahkan akun admin: {$user->name}");
    }

    public function updateAdmin(Request $request, User $user)
    {
        if ($user->role !== 'admin') {
            abort(403, 'User bukan admin.');
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'username' => ['required', 'string', 'max:255', Rule::unique('users', 'username')->ignore($user->id)],
            'email' => ['nullable', 'email', 'max:255', Rule::unique('users', 'email')->ignore($user->id)],
            'phone' => 'nullable|string|max:20',
            'password' => 'nullable|string|min:6|confirmed',
            'is_active' => 'boolean',
        ]);

        $user->name = $validated['name'];
        $user->username = $validated['username'];
        $user->email = $validated['email'] ?? null;
        $user->phone = $validated['phone'] ?? null;
        if (isset($validated['is_active'])) {
            $user->is_active = $validated['is_active'];
        }
        if (!empty($validated['password'])) {
            $user->password = Hash::make($validated['password']);
        }
        $user->save();

        ActivityLog::log('Update Akun Admin', "Memperbarui akun admin: {$user->name} ({$user->username})");

        return redirect()->back()->with('success', "Berhasil memperbarui akun admin: {$user->name}");
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
