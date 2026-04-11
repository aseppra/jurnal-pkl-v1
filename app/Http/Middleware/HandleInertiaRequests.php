<?php

namespace App\Http\Middleware;

use App\Models\Notification;
use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that is loaded on the first page visit.
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determine the current asset version.
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        return [
            ...parent::share($request),
            'auth' => [
                'user' => $request->user(),
            ],
            'flash' => [
                'success' => fn() => $request->session()->get('success'),
                'error' => fn() => $request->session()->get('error'),
            ],
            'unreadNotificationCount' => fn() => $request->user()
                ? Notification::where('user_id', $request->user()->id)->where('is_read', false)->count()
                : 0,
            'latestUnreadNotification' => fn() => $request->user()
                ? Notification::where('user_id', $request->user()->id)->where('is_read', false)->latest()->first()
                : null,
            'helpdeskPendingCount' => fn() => $request->user() && $request->user()->role === 'admin'
                ? \App\Models\HelpRequest::where('status', 'pending')->count()
                : 0,
        ];
    }
}

