import AdminLayout from '@/Layouts/AdminLayout';
import { Head, useForm, usePage } from '@inertiajs/react';

interface Props {
    pklStart: string | null;
    pklEnd: string | null;
}

const MONTH_NAMES = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
const DAY_NAMES = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];

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

    const formatDate = (d: string) =>
        d ? new Date(d + 'T00:00:00').toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) : '-';

    const computeStats = () => {
        if (!data.pkl_start || !data.pkl_end) return { totalDays: 0, elapsedDays: 0, remainingDays: 0, progress: 0 };
        const start = new Date(data.pkl_start + 'T00:00:00');
        const end = new Date(data.pkl_end + 'T00:00:00');
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const totalDays = Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
        const elapsedRaw = Math.round((today.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
        const elapsedDays = today > end ? totalDays : today < start ? 0 : elapsedRaw;
        const remainingDays = Math.max(0, totalDays - elapsedDays);
        const progress = totalDays > 0 ? Math.min(Math.round((elapsedDays / totalDays) * 100), 100) : 0;

        return { totalDays, elapsedDays, remainingDays, progress };
    };

    const getMiniCalendar = () => {
        if (!data.pkl_start || !data.pkl_end) return [];
        const startDate = new Date(data.pkl_start + 'T00:00:00');
        const endDate = new Date(data.pkl_end + 'T00:00:00');

        type CalDay = { day: number; inRange: boolean; isStart: boolean; isEnd: boolean; isToday: boolean } | null;
        const months: { year: number; month: number; days: CalDay[] }[] = [];
        let current = new Date(startDate.getFullYear(), startDate.getMonth(), 1);
        const endMonth = new Date(endDate.getFullYear(), endDate.getMonth(), 1);
        const todayStr = new Date().toDateString();

        while (current <= endMonth) {
            const year = current.getFullYear();
            const month = current.getMonth();
            const daysInMonth = new Date(year, month + 1, 0).getDate();
            const firstDay = new Date(year, month, 1).getDay();

            const days: CalDay[] = [];
            for (let i = 0; i < firstDay; i++) days.push(null);
            for (let d = 1; d <= daysInMonth; d++) {
                const date = new Date(year, month, d);
                days.push({
                    day: d,
                    inRange: date >= startDate && date <= endDate,
                    isStart: date.getTime() === startDate.getTime(),
                    isEnd: date.getTime() === endDate.getTime(),
                    isToday: date.toDateString() === todayStr,
                });
            }

            months.push({ year, month, days });
            current = new Date(year, month + 1, 1);
        }

        return months;
    };

    const stats = computeStats();
    const calendarMonths = getMiniCalendar();
    const hasDates = !!(data.pkl_start && data.pkl_end);

    return (
        <AdminLayout title="Periode PKL" subtitle="Pengaturan Masa Praktik Kerja Lapangan">
            <Head title="Periode PKL" />

            {flash?.success && (
                <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-3 rounded-xl text-sm font-medium flex items-center gap-2">
                    <span className="material-symbols-outlined text-sm">check_circle</span>{flash.success}
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
                {/* Left: Form */}
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
                        <div className="flex items-start gap-2 p-3 bg-amber-50 border border-amber-100 rounded-lg">
                            <span className="material-symbols-outlined text-amber-500 text-base mt-0.5 shrink-0">info</span>
                            <p className="text-xs text-amber-700 leading-relaxed">
                                Perubahan periode akan langsung diterapkan ke <strong>progress bar</strong> pada dashboard semua siswa dan halaman pembimbing.
                            </p>
                        </div>
                    </form>
                </div>

                {/* Right: Preview + Calendar */}
                <div className="space-y-5">
                    {/* Preview Card */}
                    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                        <div className="p-5 bg-slate-50 border-b border-slate-200">
                            <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider flex items-center gap-2">
                                <span className="material-symbols-outlined text-base text-primary">preview</span>
                                Preview Periode Aktif
                            </h3>
                        </div>
                        <div className="p-6 space-y-5">
                            {/* Start / End */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-blue-50 rounded-xl p-4 text-center border border-blue-100">
                                    <span className="material-symbols-outlined text-2xl text-blue-500 block mb-1">play_circle</span>
                                    <p className="text-[10px] font-bold text-blue-400 uppercase tracking-wider">Mulai</p>
                                    <p className="text-sm font-bold text-blue-700 mt-1">{formatDate(data.pkl_start)}</p>
                                </div>
                                <div className="bg-emerald-50 rounded-xl p-4 text-center border border-emerald-100">
                                    <span className="material-symbols-outlined text-2xl text-emerald-500 block mb-1">flag</span>
                                    <p className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">Selesai</p>
                                    <p className="text-sm font-bold text-emerald-700 mt-1">{formatDate(data.pkl_end)}</p>
                                </div>
                            </div>

                            {/* Stat Cards */}
                            {hasDates && (
                                <div className="grid grid-cols-3 gap-3">
                                    <div className="bg-slate-50 rounded-xl p-3 text-center border border-slate-200">
                                        <span className="material-symbols-outlined text-slate-400 text-xl block mb-1">calendar_month</span>
                                        <p className="text-2xl font-black text-slate-700">{stats.totalDays}</p>
                                        <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">Total Hari</p>
                                    </div>
                                    <div className="bg-primary/5 rounded-xl p-3 text-center border border-primary/20">
                                        <span className="material-symbols-outlined text-primary text-xl block mb-1">timer</span>
                                        <p className="text-2xl font-black text-primary">{stats.elapsedDays}</p>
                                        <p className="text-[9px] text-primary/60 font-bold uppercase tracking-wider mt-0.5">Terlewati</p>
                                    </div>
                                    <div className="bg-amber-50 rounded-xl p-3 text-center border border-amber-200">
                                        <span className="material-symbols-outlined text-amber-500 text-xl block mb-1">hourglass_bottom</span>
                                        <p className="text-2xl font-black text-amber-600">{stats.remainingDays}</p>
                                        <p className="text-[9px] text-amber-400 font-bold uppercase tracking-wider mt-0.5">Tersisa</p>
                                    </div>
                                </div>
                            )}

                            {/* Progress */}
                            <div>
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Progres Saat Ini</span>
                                    <span className="text-xl font-bold text-primary">{stats.progress}%</span>
                                </div>
                                <div className="w-full h-4 bg-slate-100 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-gradient-to-r from-primary to-blue-400 rounded-full transition-all duration-700"
                                        style={{ width: `${stats.progress}%` }}
                                    ></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Full-width Calendar */}
            {calendarMonths.length > 0 && (
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                    <div className="p-5 bg-slate-50 border-b border-slate-200">
                        <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider flex items-center gap-2">
                            <span className="material-symbols-outlined text-base text-primary">date_range</span>
                            Kalender Periode PKL
                        </h3>
                    </div>
                    <div className="p-6">
                        <div className="grid gap-6" style={{ gridTemplateColumns: `repeat(${calendarMonths.length}, 1fr)` }}>
                            {calendarMonths.map(({ year, month, days }) => (
                                <div key={`${year}-${month}`}>
                                    <p className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-3 text-center">
                                        {MONTH_NAMES[month]} {year}
                                    </p>
                                    <div className="grid grid-cols-7 gap-1">
                                        {DAY_NAMES.map(d => (
                                            <div key={d} className="text-center text-[10px] font-bold text-slate-400 uppercase pb-1">{d}</div>
                                        ))}
                                        {days.map((day, idx) => (
                                            <div
                                                key={idx}
                                                className={`aspect-square flex items-center justify-center text-xs font-medium rounded-lg
                                                    ${!day ? '' :
                                                    day.isStart ? 'bg-emerald-500 text-white font-bold shadow-sm' :
                                                    day.isEnd ? 'bg-red-500 text-white font-bold shadow-sm' :
                                                    day.isToday && day.inRange ? 'bg-primary text-white font-bold ring-2 ring-primary/30' :
                                                    day.isToday ? 'ring-2 ring-primary/40 text-primary font-bold' :
                                                    day.inRange ? 'bg-primary/15 text-primary font-semibold' :
                                                    'text-slate-300'}`}
                                            >
                                                {day?.day}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    {/* Legend */}
                    <div className="px-6 pb-5 flex items-center gap-5 border-t border-slate-100 pt-4">
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded bg-emerald-500"></div>
                            <span className="text-xs text-slate-500 font-medium">Mulai PKL</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded bg-primary/20"></div>
                            <span className="text-xs text-slate-500 font-medium">Masa PKL</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded bg-primary"></div>
                            <span className="text-xs text-slate-500 font-medium">Hari Ini</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded bg-red-500"></div>
                            <span className="text-xs text-slate-500 font-medium">Selesai PKL</span>
                        </div>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}
