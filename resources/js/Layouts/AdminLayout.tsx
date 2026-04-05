import { Link, usePage, router } from '@inertiajs/react';
import { PropsWithChildren, useState, useEffect } from 'react';
import Portal from '@/Components/Portal';
import axios from 'axios';

interface NotificationItem {
    id: number;
    title: string;
    message: string;
    type: string;
    isNew: boolean;
    time: string;
}

function NavbarDate() {
    const [dateStr] = useState(() => {
        const now = new Date();
        return now.toLocaleDateString('id-ID', {
            timeZone: 'Asia/Jakarta',
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    });
    return <p className="text-sm font-medium text-slate-600 hidden md:block">{dateStr}</p>;
}

interface SidebarItemProps {
    icon: string;
    label: string;
    href?: string;
    active?: boolean;
    onClick?: () => void;
    variant?: 'default' | 'danger';
    badge?: number;
}

function SidebarItem({ icon, label, href, active, onClick, variant = 'default', badge }: SidebarItemProps) {
    if (variant === 'danger') {
        return (
            <button
                onClick={onClick}
                className="flex w-full items-center gap-3 px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
                <span className="material-symbols-outlined text-lg">{icon}</span>
                <span className="text-sm font-medium">{label}</span>
            </button>
        );
    }
    const content = (
        <>
            <span className={`material-symbols-outlined text-lg ${active ? 'text-white' : 'text-slate-400'}`}>{icon}</span>
            <span className="flex-1 text-sm font-medium">{label}</span>
            {badge !== undefined && badge > 0 && (
                <span className="bg-red-500 text-white min-w-[20px] h-[20px] flex items-center justify-center rounded-full text-[10px] font-bold px-1.5 shadow-sm">
                    {badge > 99 ? '99+' : badge}
                </span>
            )}
        </>
    );

    if (href) {
        return (
            <Link
                href={href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer transition-colors ${
                    active ? 'bg-primary text-white font-medium' : 'text-slate-600 hover:bg-slate-100'
                }`}
            >
                {content}
            </Link>
        );
    }

    return (
        <div
            onClick={onClick}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer transition-colors ${
                active ? 'bg-primary text-white font-medium' : 'text-slate-600 hover:bg-slate-100'
            }`}
        >
            {content}
        </div>
    );
}

function SidebarSection({ label, icon, children, defaultOpen = false }: { label: string; icon: string; children: React.ReactNode; defaultOpen?: boolean }) {
    const [open, setOpen] = useState(defaultOpen);
    return (
        <div className="mt-1">
            <button
                onClick={() => setOpen(!open)}
                className="flex w-full items-center justify-between px-3 py-2 rounded-lg text-slate-500 hover:bg-slate-50 transition-colors group"
                title={`Toggle ${label}`}
            >
                <div className="flex items-center gap-2.5">
                    <span className="material-symbols-outlined text-lg text-slate-400 group-hover:text-slate-500">{icon}</span>
                    <span className="text-[11px] font-bold uppercase tracking-widest">{label}</span>
                </div>
                <span className={`material-symbols-outlined text-base text-slate-400 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}>expand_more</span>
            </button>
            <div className={`overflow-hidden transition-all duration-200 ${open ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
                <div className="pl-2 space-y-0.5 pb-1">
                    {children}
                </div>
            </div>
        </div>
    );
}

export default function AdminLayout({ children, title, subtitle }: PropsWithChildren<{ title: string; subtitle?: string }>) {
    const { url, props } = usePage();
    const user = (props as any).auth?.user;
    const unreadNotificationCount = (props as any).unreadNotificationCount || 0;
    const helpdeskPendingCount = (props as any).helpdeskPendingCount || 0;
    const [mobileOpen, setMobileOpen] = useState(false);

    const [isNotificationOpen, setIsNotificationOpen] = useState(false);
    const [notifications, setNotifications] = useState<NotificationItem[]>([]);
    const [isLoadingNotifications, setIsLoadingNotifications] = useState(false);

    const fetchNotifications = async () => {
        setIsLoadingNotifications(true);
        try {
            const res = await axios.get(route('admin.helpdesk.notifications'), { headers: { Accept: 'application/json' } });
            setNotifications(res.data.notifications || []);
        } catch (error) {
            console.error("Failed to fetch notifications", error);
        } finally {
            setIsLoadingNotifications(false);
        }
    };

    useEffect(() => {
        if (isNotificationOpen) {
            fetchNotifications();
        }
    }, [isNotificationOpen]);

    const handleLogout = () => {
        router.post(route('logout'));
    };

    const isMasterDataActive = url.startsWith('/admin/kelas-jurusan') || url.startsWith('/admin/data-') || url.startsWith('/admin/periode-pkl') || url.startsWith('/admin/import-data');
    const isRekapActive = url.startsWith('/admin/monitoring') || url.startsWith('/admin/rekapitulasi') || url.startsWith('/admin/rekapitulasi-dudi');
    const isUtilityActive = url.startsWith('/admin/helpdesk') || url.startsWith('/admin/whatsapp') || url.startsWith('/admin/log-aktivitas') || url.startsWith('/admin/settings');

    const navItems = (
        <>
            <SidebarItem icon="dashboard" label="Overview" href={route('admin.dashboard')} active={url === '/admin'} />
            <SidebarSection label="Master Data" icon="database" defaultOpen={isMasterDataActive}>
                <SidebarItem icon="school" label="Kelas & Jurusan" href={route('admin.kelas-jurusan')} active={url.startsWith('/admin/kelas-jurusan')} />
                <SidebarItem icon="manage_accounts" label="Data Siswa" href={route('admin.siswa.index')} active={url.startsWith('/admin/data-siswa')} />
                <SidebarItem icon="business" label="Data DUDI" href={route('admin.dudi.index')} active={url.startsWith('/admin/data-dudi')} />
                <SidebarItem icon="supervisor_account" label="Data Pembimbing" href={route('admin.pembimbing.index')} active={url.startsWith('/admin/data-pembimbing')} />
                <SidebarItem icon="date_range" label="Periode PKL" href={route('admin.periode-pkl')} active={url.startsWith('/admin/periode-pkl')} />
                <SidebarItem icon="cloud_upload" label="Import Data" href={route('admin.import-data')} active={url.startsWith('/admin/import-data')} />
            </SidebarSection>
            <SidebarSection label="Rekapitulasi" icon="assessment" defaultOpen={isRekapActive}>
                <SidebarItem icon="group" label="Monitoring Siswa" href={route('admin.monitoring')} active={url.startsWith('/admin/monitoring')} />
                <SidebarItem icon="description" label="Rekapitulasi Jurnal" href={route('admin.rekapitulasi')} active={url === '/admin/rekapitulasi'} />
                <SidebarItem icon="apartment" label="Rekapitulasi DUDI" href={route('admin.rekapitulasi-dudi')} active={url.startsWith('/admin/rekapitulasi-dudi')} />
            </SidebarSection>
            <SidebarSection label="Utility" icon="build" defaultOpen={isUtilityActive}>
                <SidebarItem icon="lock_reset" label="Helpdesk" href={route('admin.helpdesk')} active={url.startsWith('/admin/helpdesk')} badge={helpdeskPendingCount} />
                <SidebarItem icon="forum" label="Whatsapp API" href={route('admin.whatsapp')} active={url.startsWith('/admin/whatsapp')} />
                <SidebarItem icon="history" label="Log Aktivitas" href={route('admin.log-aktivitas')} active={url.startsWith('/admin/log-aktivitas')} />
                <SidebarItem icon="settings" label="Pengaturan" href={route('admin.settings')} active={url.startsWith('/admin/settings')} />
            </SidebarSection>
        </>
    );

    return (
        <div className="flex min-h-screen bg-background-light">
            {/* Desktop Sidebar */}
            <aside className="hidden md:flex w-64 border-r border-slate-200 bg-white flex-col sticky top-0 h-screen shrink-0">
                <div className="p-6">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center text-white">
                            <span className="material-symbols-outlined">school</span>
                        </div>
                        <div className="flex flex-col">
                            <h1 className="text-sm font-bold text-slate-900 leading-tight uppercase tracking-wider">Admin PKL</h1>
                            <p className="text-xs text-slate-500">SMK Dashboard</p>
                        </div>
                    </div>
                </div>
                <nav className="flex-1 px-4 space-y-1 overflow-y-auto">{navItems}</nav>
                <div className="p-4 border-t border-slate-200">
                    <div className="flex items-center gap-3 px-3 py-2 rounded-lg bg-slate-50 mb-4">
                        <div className="w-8 h-8 rounded-full bg-slate-200 overflow-hidden">
                            <img alt="Profile" src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.name || 'Admin'}`} />
                        </div>
                        <div className="flex flex-col">
                            <p className="text-xs font-semibold">{user?.name || 'Admin'}</p>
                            <p className="text-[10px] text-slate-500 uppercase">{user?.role || 'admin'}</p>
                        </div>
                    </div>
                    <SidebarItem icon="logout" label="Logout" onClick={handleLogout} variant="danger" />
                </div>
            </aside>

            {/* Mobile menu overlay */}
            {mobileOpen && (
                <div className="fixed inset-0 z-50 md:hidden">
                    <div className="fixed inset-0 bg-slate-900/50" onClick={() => setMobileOpen(false)} />
                    <aside className="fixed left-0 top-0 bottom-0 w-64 bg-white flex flex-col z-50 shadow-xl">
                        <div className="p-4 flex justify-between items-center border-b border-slate-200">
                            <span className="font-bold text-primary">Menu</span>
                            <button onClick={() => setMobileOpen(false)}>
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>
                        <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">{navItems}</nav>
                        <div className="p-4 border-t border-slate-200">
                            <SidebarItem icon="logout" label="Logout" onClick={handleLogout} variant="danger" />
                        </div>
                    </aside>
                </div>
            )}

            {/* Main Content */}
            <main className="flex-1 flex flex-col min-h-0">
                <header className="bg-white border-b border-slate-200 px-4 md:px-8 py-4 flex items-center justify-between shrink-0">
                    <div className="flex items-center gap-3">
                        <button className="md:hidden" onClick={() => setMobileOpen(true)}>
                            <span className="material-symbols-outlined">menu</span>
                        </button>
                        <div>
                            <h2 className="text-base font-bold text-slate-900">{title}</h2>
                            {subtitle && <p className="text-[11px] text-slate-500 font-medium">{subtitle}</p>}
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <NavbarDate />
                        <button onClick={() => setIsNotificationOpen(true)} className="size-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:text-primary transition-colors relative">
                            <span className="material-symbols-outlined">notifications</span>
                            {helpdeskPendingCount > 0 ? (
                                <span className="absolute -top-0.5 -right-0.5 min-w-[20px] h-[20px] flex items-center justify-center bg-red-500 text-white text-[10px] font-bold rounded-full px-1 border-2 border-white shadow-sm">
                                    {helpdeskPendingCount > 99 ? '99+' : helpdeskPendingCount}
                                </span>
                            ) : null}
                        </button>
                    </div>
                </header>
                <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-8 max-w-[1600px] mx-auto w-full">
                    {children}
                </div>
            </main>

            <Portal>
                <div className={`fixed inset-0 z-[99999] transition-opacity duration-300 ${isNotificationOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
                    <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={() => setIsNotificationOpen(false)} />
                    <div className={`absolute top-0 right-0 h-full w-full max-w-sm bg-slate-50 shadow-2xl transition-transform duration-300 flex flex-col ${isNotificationOpen ? 'translate-x-0' : 'translate-x-full'}`}>
                        <div className="flex items-center justify-between px-6 py-4 bg-white border-b border-slate-200 shrink-0">
                            <div>
                                <h2 className="text-lg font-bold text-slate-800">Notifikasi Helpdesk</h2>
                                <p className="text-[10px] text-slate-500 font-medium uppercase tracking-wider">Permintaan Reset Password</p>
                            </div>
                            <button onClick={() => setIsNotificationOpen(false)} className="size-8 flex items-center justify-center rounded-full hover:bg-slate-100 text-slate-500 transition-colors">
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>
                        <div className="flex-1 overflow-y-auto p-4 space-y-3">
                            {isLoadingNotifications ? (
                                <div className="text-center py-10">
                                    <div className="size-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
                                    <p className="text-sm text-slate-500">Memuat notifikasi...</p>
                                </div>
                            ) : notifications.length > 0 ? (
                                notifications.map(n => (
                                    <div key={n.id} className="bg-white rounded-xl border border-amber-200 bg-amber-50/30 p-4 shadow-sm transition-all cursor-pointer hover:bg-amber-50" onClick={() => { setIsNotificationOpen(false); router.get(route('admin.helpdesk')); }}>
                                        <div className="flex items-start gap-3">
                                            <div className="size-10 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center shrink-0">
                                                <span className="material-symbols-outlined text-[20px]">warning</span>
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-start justify-between gap-2">
                                                    <h4 className="text-sm font-bold text-slate-900">{n.title}</h4>
                                                    <span className="size-2 bg-amber-500 rounded-full shrink-0 mt-1.5"></span>
                                                </div>
                                                <p className="text-sm text-slate-600 mt-1 leading-relaxed">{n.message}</p>
                                                <div className="text-[10px] text-slate-400 font-medium uppercase tracking-wider mt-3">{n.time}</div>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="bg-white rounded-xl border border-slate-200 p-8 text-center shadow-sm my-4">
                                    <span className="material-symbols-outlined text-5xl text-slate-200 mb-3 block">notifications_off</span>
                                    <h4 className="font-bold text-slate-700 mb-1">Tidak Ada Permintaan</h4>
                                    <p className="text-sm text-slate-500">Semua permintaan bantuan sudah ditangani.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </Portal>
        </div>
    );
}
