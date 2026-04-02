<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ActivityLog;
use Inertia\Inertia;

class LogAktivitasController extends Controller
{
    public function index()
    {
        $logs = ActivityLog::with('user')
            ->latest()
            ->paginate(10)
            ->through(function ($log) {
                return [
                    'id' => $log->id,
                    'user_name' => $log->user?->name ?? 'Sistem',
                    'user_role' => $log->user?->role ?? '-',
                    'action' => $log->action,
                    'description' => $log->description,
                    'created_at' => $log->created_at->timezone('Asia/Jakarta')->format('d M Y, H:i'),
                ];
            });

        return Inertia::render('Admin/LogAktivitas', [
            'logs' => $logs,
        ]);
    }
}
