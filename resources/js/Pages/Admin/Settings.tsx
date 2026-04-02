import AdminLayout from '@/Layouts/AdminLayout';
import Portal from '@/Components/Portal';
import { Head, router, usePage } from '@inertiajs/react';
import { useState } from 'react';

interface Props {
    counts: {
        siswa: number;
        dudi: number;
        pembimbing: number;
        journal: number;
        attendance: number;
        helpRequest: number;
    };
}

export default function Settings({ counts }: Props) {
    const { props } = usePage();
    const flash = (props as any).flash;
    const [confirmModal, setConfirmModal] = useState<{ action: string; label: string; route: string } | null>(null);
    const [processing, setProcessing] = useState(false);

    const resetItems = [
        { key: 'siswa', label: 'Data Siswa', icon: 'manage_accounts', color: 'blue', count: counts.siswa, route: 'admin.settings.reset-siswa', desc: 'Menghapus semua data siswa, akun login, jurnal, absensi, dan notifikasi.' },
        { key: 'dudi', label: 'Data DUDI', icon: 'business', color: 'purple', count: counts.dudi, route: 'admin.settings.reset-dudi', desc: 'Menghapus semua data DUDI dan melepas relasi siswa/pembimbing.' },
        { key: 'pembimbing', label: 'Data Pembimbing', icon: 'supervisor_account', color: 'amber', count: counts.pembimbing, route: 'admin.settings.reset-pembimbing', desc: 'Menghapus semua data pembimbing dan akun login-nya.' },
        { key: 'periode', label: 'Periode PKL', icon: 'date_range', color: 'teal', count: null, route: 'admin.settings.reset-periode', desc: 'Menghapus semua pengaturan tanggal periode PKL.' },
        { key: 'helpdesk', label: 'Helpdesk', icon: 'lock_reset', color: 'rose', count: counts.helpRequest, route: 'admin.settings.reset-helpdesk', desc: 'Menghapus semua tiket permintaan helpdesk.' },
    ];

    const colorMap: Record<string, string> = {
        blue: 'from-blue-500 to-blue-600',
        purple: 'from-purple-500 to-purple-600',
        amber: 'from-amber-500 to-amber-600',
        teal: 'from-teal-500 to-teal-600',
        rose: 'from-rose-500 to-rose-600',
    };

    const colorBgMap: Record<string, string> = {
        blue: 'bg-blue-50 text-blue-600',
        purple: 'bg-purple-50 text-purple-600',
        amber: 'bg-amber-50 text-amber-600',
        teal: 'bg-teal-50 text-teal-600',
        rose: 'bg-rose-50 text-rose-600',
    };

    const handleReset = () => {
        if (!confirmModal) return;
        setProcessing(true);
        router.post(route(confirmModal.route), {}, {
            onFinish: () => { setProcessing(false); setConfirmModal(null); },
        });
    };

    return (
        <AdminLayout title="Pengaturan" subtitle="Kelola dan reset data sistem">
            <Head title="Pengaturan" />

            {flash?.success && (
                <div className="mb-6 bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-3 rounded-xl text-sm font-medium flex items-center gap-2">
                    <span className="material-symbols-outlined text-sm">check_circle</span>
                    {flash.success}
                </div>
            )}

            <div className="bg-red-50 border border-red-200 rounded-2xl p-5 mb-6">
                <div className="flex items-start gap-3">
                    <span className="material-symbols-outlined text-red-500 mt-0.5">warning</span>
                    <div>
                        <h3 className="font-bold text-red-800 text-sm">Zona Berbahaya</h3>
                        <p className="text-red-700 text-xs mt-1">Tindakan di halaman ini bersifat permanen dan tidak dapat dibatalkan. Pastikan Anda sudah mem-backup data sebelum melakukan reset.</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 mb-8">
                {resetItems.map((item) => (
                    <div key={item.key} className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-shadow">
                        <div className={`h-1.5 bg-gradient-to-r ${colorMap[item.color]}`} />
                        <div className="p-5">
                            <div className="flex items-center gap-3 mb-3">
                                <div className={`size-10 rounded-xl flex items-center justify-center ${colorBgMap[item.color]}`}>
                                    <span className="material-symbols-outlined">{item.icon}</span>
                                </div>
                                <div>
                                    <h4 className="font-bold text-slate-900 text-sm">{item.label}</h4>
                                    {item.count !== null && <p className="text-xs text-slate-500">{item.count} data</p>}
                                </div>
                            </div>
                            <p className="text-xs text-slate-500 mb-4 leading-relaxed">{item.desc}</p>
                            <button
                                onClick={() => setConfirmModal({ action: item.key, label: item.label, route: item.route })}
                                disabled={item.count === 0}
                                className="w-full py-2 rounded-xl border border-red-200 text-red-600 text-xs font-bold hover:bg-red-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-1.5"
                            >
                                <span className="material-symbols-outlined text-sm">delete_sweep</span>
                                Reset {item.label}
                            </button>
                        </div>
                    </div>
                ))}

                {/* Reset All Card */}
                <div className="bg-white rounded-2xl shadow-sm border-2 border-red-300 overflow-hidden hover:shadow-md transition-shadow">
                    <div className="h-1.5 bg-gradient-to-r from-red-500 to-red-700" />
                    <div className="p-5">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="size-10 rounded-xl flex items-center justify-center bg-red-100 text-red-600">
                                <span className="material-symbols-outlined">restart_alt</span>
                            </div>
                            <div>
                                <h4 className="font-bold text-red-800 text-sm">Reset Semua Data</h4>
                                <p className="text-xs text-red-500">Menghapus seluruh data</p>
                            </div>
                        </div>
                        <p className="text-xs text-slate-500 mb-4 leading-relaxed">Menghapus SELURUH data siswa, DUDI, pembimbing, jurnal, absensi, notifikasi, periode PKL, dan helpdesk sekaligus.</p>
                        <button
                            onClick={() => setConfirmModal({ action: 'all', label: 'Semua Data', route: 'admin.settings.reset-all' })}
                            className="w-full py-2.5 rounded-xl bg-red-600 text-white text-xs font-bold hover:bg-red-700 transition-colors flex items-center justify-center gap-1.5 shadow-sm"
                        >
                            <span className="material-symbols-outlined text-sm">warning</span>
                            Reset Semua Data
                        </button>
                    </div>
                </div>
            </div>

            {/* Confirmation Modal */}
            {confirmModal && (
                <Portal><div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/40 backdrop-blur-sm" onClick={() => !processing && setConfirmModal(null)}>
                    <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full mx-4 overflow-hidden" onClick={e => e.stopPropagation()}>
                        <div className="p-6 text-center">
                            <div className="size-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
                                <span className="material-symbols-outlined text-red-600 text-3xl">delete_forever</span>
                            </div>
                            <h3 className="text-lg font-bold text-slate-900 mb-2">Reset {confirmModal.label}?</h3>
                            <p className="text-sm text-slate-600">Tindakan ini akan menghapus seluruh data secara permanen dan <strong>tidak dapat dibatalkan</strong>.</p>
                        </div>
                        <div className="flex border-t border-slate-100">
                            <button
                                onClick={() => setConfirmModal(null)}
                                disabled={processing}
                                className="flex-1 py-3.5 text-sm font-bold text-slate-600 hover:bg-slate-50 transition-colors"
                            >
                                Batal
                            </button>
                            <button
                                onClick={handleReset}
                                disabled={processing}
                                className="flex-1 py-3.5 text-sm font-bold text-red-600 hover:bg-red-50 transition-colors border-l border-slate-100 disabled:opacity-60"
                            >
                                {processing ? 'Menghapus...' : 'Ya, Reset'}
                            </button>
                        </div>
                    </div>
                </div></Portal>
            )}
        </AdminLayout>
    );
}
