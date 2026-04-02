<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Models\Attendance;
use App\Models\Setting;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Carbon\Carbon;

class DashboardController extends Controller
{
    public function index()
    {
        $user = Auth::user();
        $siswa = $user->siswa()->with('dudi')->first();

        if (!$siswa) {
            return Inertia::render('Student/Dashboard', [
                'siswa' => null,
                'pklInfo' => null,
                'todayAttendance' => null,
                'weeklyAttendance' => [],
            ]);
        }

        $today = Carbon::today();
        $todayAttendance = $siswa->attendances()->where('date', $today)->first();

        // PKL progress from global settings
        $pklStartStr = Setting::getValue('pkl_start');
        $pklEndStr = Setting::getValue('pkl_end');
        $pklStart = $pklStartStr ? Carbon::parse($pklStartStr) : null;
        $pklEnd = $pklEndStr ? Carbon::parse($pklEndStr) : null;
        $totalDays = $pklStart && $pklEnd ? $pklStart->diffInDays($pklEnd) : 0;
        $elapsedDays = $pklStart ? max($pklStart->diffInDays($today, false), 0) : 0;
        $progress = $totalDays > 0 ? min(round(($elapsedDays / $totalDays) * 100), 100) : 0;

        // Weekly attendance (last 5 weekdays)
        $weeklyAttendance = $siswa->attendances()
            ->where('date', '>=', $today->copy()->subDays(7))
            ->orderBy('date', 'desc')
            ->get()
            ->map(fn($a) => [
                'day' => $a->date->locale('id')->translatedFormat('l'),
                'date' => $a->date->format('d M'),
                'status' => ucfirst($a->status),
                'time' => ($a->check_in ?? '--:--') . ' - ' . ($a->check_out ?? '--:--'),
                'color' => in_array($a->status, ['hadir', 'terlambat']) ? 'emerald' : 'amber',
            ]);

        return Inertia::render('Student/Dashboard', [
            'user' => $user,
            'siswa' => $siswa,
            'pklInfo' => [
                'company' => $siswa->dudi?->name ?? '-',
                'start' => $pklStart?->format('d M Y'),
                'end' => $pklEnd?->format('d M Y'),
                'progress' => $progress,
            ],
            'todayAttendance' => $todayAttendance,
            'weeklyAttendance' => $weeklyAttendance,
        ]);
    }

    public function checkIn(Request $request)
    {
        $user = Auth::user();
        $siswa = $user->siswa;
        $today = Carbon::today();

        $attendance = Attendance::firstOrCreate(
            ['siswa_id' => $siswa->id, 'date' => $today],
            [
                'check_in' => Carbon::now()->format('H:i'),
                'status' => Carbon::now()->hour >= 8 && Carbon::now()->minute > 15 ? 'terlambat' : 'hadir',
                'location' => $siswa->dudi?->name,
            ]
        );

        return redirect()->back()->with('success', 'Check-in berhasil pada ' . $attendance->check_in);
    }

    public function checkOut(Request $request)
    {
        $user = Auth::user();
        $siswa = $user->siswa;
        $today = Carbon::today();

        $attendance = Attendance::where('siswa_id', $siswa->id)->where('date', $today)->first();

        if ($attendance) {
            $attendance->update(['check_out' => Carbon::now()->format('H:i')]);
            return redirect()->back()->with('success', 'Check-out berhasil pada ' . $attendance->check_out);
        }

        return redirect()->back()->with('error', 'Anda belum melakukan check-in hari ini.');
    }

    public function izin(Request $request)
    {
        $request->validate([
            'reason' => 'required|in:Sakit,Kepentingan Keluarga,Lain-lain',
            'notes' => 'required|string|max:500',
            'proof' => 'required|file|mimes:jpeg,png,jpg,pdf|max:2048',
        ]);

        $user = Auth::user();
        $siswa = $user->siswa;

        if (!$siswa) {
            return redirect()->back()->with('error', 'Siswa tidak ditemukan.');
        }

        $today = Carbon::today();
        $attendance = $siswa->attendances()->where('date', $today)->first();

        if ($attendance && in_array($attendance->status, ['hadir', 'terlambat', 'izin'])) {
            return redirect()->back()->with('error', 'Anda sudah melakukan absensi hari ini.');
        }

        $proofFile = null;
        if ($request->hasFile('proof')) {
            $proofFile = $request->file('proof')->store('proofs', 'public');
        }

        $siswa->attendances()->updateOrCreate(
            ['date' => $today],
            [
                'status' => 'izin',
                'reason' => $request->reason,
                'notes' => $request->notes,
                'proof_file' => $proofFile,
                'check_in' => null,
                'check_out' => null,
            ]
        );

        return redirect()->back()->with('success', 'Berhasil mencatat izin absensi.');
    }
}
