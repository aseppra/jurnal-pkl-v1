import AdminLayout from '@/Layouts/AdminLayout';
import { Head, useForm, usePage } from '@inertiajs/react';

interface Props {
    pklStart: string | null;
    pklEnd: string | null;
}

export default function PeriodePkl({ pklStart, pklEnd }: Props) {
    const { props } = usePage();
    const flash = (props as any).flash;

    const { data, setData, put, processing, errors } = useForm({
        pkl_start: pklStart || '',
        pkl_end: pklEnd || '',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        put(route('admin.periode-pkl.update'));
    };

    // Compute live progress for preview
    const computeProgress = () => {
        if (!data.pkl_start || !data.pkl_end) return 0;
        const start = new Date(data.pkl_start).getTime();
        const end = new Date(data.pkl_end).getTime();
        const now = Date.now();
        if (now <= start) return 0;
        if (now >= end) return 100;
        return Math.round(((now - start) / (end - start)) * 100);
    };

    const progress = computeProgress();
    const formatDate = (d: string) => d ? new Date(d).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) : '-';

    return (
        <AdminLayout title="Periode PKL" subtitle="Pengaturan Masa Praktik Kerja Lapangan">
            <Head title="Periode PKL" />

            {flash?.success && (
                <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-3 rounded-xl text-sm font-medium flex items-center gap-2">
                    <span className="material-symbols-outlined text-sm">check_circle</span>{flash.success}
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Form */}
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                    <div className="p-5 bg-slate-50 border-b border-slate-200">
                        <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider flex items-center gap-2">
                            <span className="material-symbols-outlined text-base text-primary">edit_calendar</span>
                            Atur Periode PKL
                        </h3>
                    </div>
                    <form onSubmit={submit} className="p-6 space-y-5">
                        <div>
                            <label htmlFor="pkl_start" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Tanggal Mulai</label>
                            <input
                                id="pkl_start"
                                type="date"
                                value={data.pkl_start}
                                onChange={e => setData('pkl_start', e.target.value)}
                                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary text-sm"
                            />
                            {errors.pkl_start && <p className="text-red-500 text-xs mt-1">{errors.pkl_start}</p>}
                        </div>
                        <div>
                            <label htmlFor="pkl_end" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Tanggal Selesai</label>
                            <input
                                id="pkl_end"
                                type="date"
                                value={data.pkl_end}
                                onChange={e => setData('pkl_end', e.target.value)}
                                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary text-sm"
                            />
                            {errors.pkl_end && <p className="text-red-500 text-xs mt-1">{errors.pkl_end}</p>}
                        </div>
                        <button
                            type="submit"
                            disabled={processing}
                            className="w-full py-2.5 bg-primary text-white rounded-lg text-sm font-bold shadow-md hover:bg-primary/90 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
                        >
                            <span className="material-symbols-outlined text-sm">save</span>
                            {processing ? 'Menyimpan...' : 'Simpan Periode'}
                        </button>
                    </form>
                </div>

                {/* Preview */}
                <div className="space-y-6">
                    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                        <div className="p-5 bg-slate-50 border-b border-slate-200">
                            <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider flex items-center gap-2">
                                <span className="material-symbols-outlined text-base text-primary">preview</span>
                                Preview Periode Aktif
                            </h3>
                        </div>
                        <div className="p-6 space-y-5">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-blue-50 rounded-xl p-4 text-center">
                                    <span className="material-symbols-outlined text-2xl text-blue-500 mb-1">play_circle</span>
                                    <p className="text-[10px] font-bold text-blue-400 uppercase tracking-wider">Mulai</p>
                                    <p className="text-sm font-bold text-blue-700 mt-1">{formatDate(data.pkl_start)}</p>
                                </div>
                                <div className="bg-emerald-50 rounded-xl p-4 text-center">
                                    <span className="material-symbols-outlined text-2xl text-emerald-500 mb-1">flag</span>
                                    <p className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">Selesai</p>
                                    <p className="text-sm font-bold text-emerald-700 mt-1">{formatDate(data.pkl_end)}</p>
                                </div>
                            </div>

                            <div>
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Progres Saat Ini</span>
                                    <span className="text-xl font-bold text-primary">{progress}%</span>
                                </div>
                                <div className="w-full h-4 bg-slate-100 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-gradient-to-r from-primary to-blue-400 rounded-full transition-all duration-700"
                                        style={{ width: `${progress}%` }}
                                    ></div>
                                </div>
                                <p className="text-[10px] text-slate-400 mt-2 text-center">
                                    {progress === 0 ? 'Masa PKL belum dimulai' : progress >= 100 ? 'Masa PKL telah selesai' : 'Masa PKL sedang berlangsung'}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
                        <span className="material-symbols-outlined text-amber-500 mt-0.5">info</span>
                        <div>
                            <p className="text-sm font-semibold text-amber-800">Catatan</p>
                            <p className="text-xs text-amber-700 mt-1">Perubahan periode akan langsung diterapkan ke progress bar pada dashboard semua siswa.</p>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
