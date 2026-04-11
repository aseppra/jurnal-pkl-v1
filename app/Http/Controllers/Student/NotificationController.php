<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Models\Notification;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class NotificationController extends Controller
{
    public function index()
    {
        $notifications = Notification::where('user_id', Auth::id())
            ->latest()
            ->get()
            ->map(fn($n) => [
                'id' => $n->id,
                'title' => $n->title,
                'message' => $n->message,
                'type' => $n->type,
                'isNew' => !$n->is_read,
                'time' => $n->created_at->diffForHumans(),
            ]);

        if (request()->wantsJson()) {
            return response()->json(['notifications' => $notifications]);
        }

        return Inertia::render('Student/Notifications', [
            'notifications' => $notifications,
            'siswa' => Auth::user()->siswa,
        ]);
    }

    public function markAsRead(Notification $notification)
    {
        $notification->update(['is_read' => true]);

        if (request()->wantsJson()) {
            return response()->json(['success' => true]);
        }

        return redirect()->back();
    }

    public function destroyRead()
    {
        $deleted = Notification::where('user_id', Auth::id())
            ->where('is_read', true)
            ->delete();

        if (request()->wantsJson()) {
            return response()->json(['success' => true, 'deleted' => $deleted]);
        }

        return redirect()->back()->with('success', "{$deleted} pesan berhasil dihapus.");
    }
}
