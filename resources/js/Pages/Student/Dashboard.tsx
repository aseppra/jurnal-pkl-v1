import StudentLayout from '@/Layouts/StudentLayout';
import Portal from '@/Components/Portal';
import { Head, router, usePage, useForm } from '@inertiajs/react';
import { useState } from 'react';

interface Props {
    user: { name: string };
    siswa: { name: string; nisn: string; gender?: string; class: string; pkl_start: string; pkl_end: string; dudi?: { name: string } } | null;
    pklInfo: { company: string; start: string; end: string; progress: number } | null;
    todayAttendance: { check_in: string | null; check_out: string | null; status: string; reason?: string } | null;
    weeklyAttendance: Array<{ day: string; date: string; status: string; time: string; color: string }>;
}

export default function Dashboard({ user, siswa, pklInfo, todayAttendance, weeklyAttendance }: Props) {
    const { props } = usePage();
    const flash = (props as any).flash;
    const [showIzinModal, setShowIzinModal] = useState(false);
    const { data: izinData, setData: setIzinData, post: postIzin, processing: processingIzin, errors: izinErrors, reset: resetIzin } = useForm<{
        reason: string;
        notes: string;
        proof: File | null;
    }>({
        reason: 'Sakit',
        notes: '',
        proof: null
    });

    const handleCheckIn = () => router.post(route('student.checkin'));
    const handleCheckOut = () => router.post(route('student.checkout'));

    const handleIzinSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        postIzin(route('student.izin'), {
            forceFormData: true,
            onSuccess: () => {
                setShowIzinModal(false);
                resetIzin();
            }
        });
    };

    if (!siswa) {
        return (
            <StudentLayout title="Dashboard" subtitle="Selamat Datang" showNotificationBell studentGender={undefined}>
                <Head title="Dashboard" />
                <div className="bg-white rounded-xl border border-slate-200 p-8 text-center">
                    <span className="material-symbols-outlined text-6xl text-slate-300 mb-4">person_off</span>
                    <h3 className="font-bold text-slate-700 mb-2">Akun belum terhubung</h3>
                    <p className="text-sm text-slate-500">Hubungi admin untuk menghubungkan akun Anda dengan data siswa.</p>
                </div>
            </StudentLayout>
        );
    }

    return (
        <StudentLayout title="Dashboard" subtitle="Selamat Datang" showNotificationBell studentGender={siswa?.gender}>
            <Head title="Dashboard" />

            {flash?.success && (
                <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-3 rounded-xl text-sm font-medium flex items-center gap-2">
                    <span className="material-symbols-outlined text-sm">check_circle</span>{flash.success}
                </div>
            )}
            {flash?.error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm font-medium flex items-center gap-2">
                    <span className="material-symbols-outlined text-sm">error</span>{flash.error}
                </div>
            )}

            {/* Greeting */}
            <div className="bg-gradient-to-r from-primary to-blue-600 rounded-2xl p-6 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2"></div>
                <div className="relative z-10">
                    <p className="text-blue-200 text-sm font-medium">Selamat Datang Kembali,</p>
                    <h3 className="text-2xl font-bold mt-1">{user.name}</h3>
                    <p className="text-blue-100 text-sm mt-2">{siswa.class} • {pklInfo?.company}</p>
                </div>
            </div>

            {/* PKL Progress */}
            {pklInfo && (
                <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Progres Masa PKL</h4>
                            <p className="text-xs text-slate-500 mt-1">{pklInfo.start} – {pklInfo.end}</p>
                        </div>
                        <span className="text-2xl font-bold text-primary">{pklInfo.progress}%</span>
                    </div>
                    <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-primary to-blue-400 rounded-full transition-all duration-500" style={{ width: `${pklInfo.progress}%` }}></div>
                    </div>
                </div>
            )}

            {/* Attendance Actions */}
            {todayAttendance?.status === 'izin' ? (
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 text-center">
                    <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="material-symbols-outlined text-amber-500 text-3xl">medical_information</span>
                    </div>
                    <h3 className="font-bold text-amber-800 text-lg mb-1">Status: Sedang Izin</h3>
                    <p className="text-sm text-amber-700 max-w-sm mx-auto">Anda tidak masuk kerja hari ini dengan alasan: <strong>{todayAttendance.reason}</strong>.</p>
                </div>
            ) : (
                <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <button
                            onClick={handleCheckIn}
                            disabled={!!todayAttendance?.check_in}
                            className={`flex flex-col items-center gap-3 p-6 rounded-xl border-2 transition-all ${todayAttendance?.check_in ? 'border-emerald-200 bg-emerald-50 cursor-default' : 'border-dashed border-slate-300 bg-white hover:border-primary hover:bg-primary/5'}`}
                        >
                            <span className={`material-symbols-outlined text-3xl ${todayAttendance?.check_in ? 'text-emerald-500' : 'text-slate-400'}`}>
                                {todayAttendance?.check_in ? 'check_circle' : 'login'}
                            </span>
                            <div className="text-center">
                                <p className="text-sm font-bold text-slate-900">{todayAttendance?.check_in ? `Masuk ${todayAttendance.check_in}` : 'Check In'}</p>
                                <p className="text-[10px] text-slate-500 mt-1 uppercase">{todayAttendance?.check_in ? 'Tercatat' : 'Tap untuk masuk'}</p>
                            </div>
                        </button>
                        <button
                            onClick={handleCheckOut}
                            disabled={!todayAttendance?.check_in || !!todayAttendance?.check_out}
                            className={`flex flex-col items-center gap-3 p-6 rounded-xl border-2 transition-all ${todayAttendance?.check_out ? 'border-blue-200 bg-blue-50 cursor-default' : !todayAttendance?.check_in ? 'border-dashed border-slate-200 bg-slate-50 opacity-60 cursor-not-allowed' : 'border-dashed border-slate-300 bg-white hover:border-blue-500 hover:bg-blue-50'}`}
                        >
                            <span className={`material-symbols-outlined text-3xl ${todayAttendance?.check_out ? 'text-blue-500' : 'text-slate-400'}`}>
                                {todayAttendance?.check_out ? 'check_circle' : 'logout'}
                            </span>
                            <div className="text-center">
                                <p className="text-sm font-bold text-slate-900">{todayAttendance?.check_out ? `Keluar ${todayAttendance.check_out}` : 'Check Out'}</p>
                                <p className="text-[10px] text-slate-500 mt-1 uppercase">{todayAttendance?.check_out ? 'Tercatat' : 'Tap untuk keluar'}</p>
                            </div>
                        </button>
                    </div>
                    
                    {!todayAttendance?.check_in && (
                        <button
                            onClick={() => setShowIzinModal(true)}
                            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 font-semibold text-sm transition-colors shadow-sm"
                        >
                            <span className="material-symbols-outlined text-[18px]">edit_document</span>
                            Input Izin Tidak Masuk
                        </button>
                    )}
                </div>
            )}

            {/* Weekly Recap */}
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
                <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4">Rekap Mingguan</h4>
                {weeklyAttendance.length > 0 ? (
                    <div className="space-y-3">
                        {weeklyAttendance.map((a, i) => (
                            <div key={i} className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0">
                                <div>
                                    <p className="text-sm font-semibold text-slate-800">{a.day}</p>
                                    <p className="text-xs text-slate-400">{a.date}</p>
                                </div>
                                <div className="text-right">
                                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${a.color === 'emerald' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>{a.status}</span>
                                    <p className="text-[10px] text-slate-400 mt-1 font-mono">{a.time}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-sm text-slate-400 text-center py-4">Belum ada data presensi minggu ini.</p>
                )}
            </div>

            {/* Modal Input Izin */}
            {showIzinModal && (
                <Portal><div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={() => !processingIzin && setShowIzinModal(false)}>
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden" onClick={e => e.stopPropagation()}>
                        <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                            <h3 className="font-bold text-slate-800 flex items-center gap-2">
                                <span className="material-symbols-outlined text-primary">edit_document</span>
                                Form Izin Tidak Masuk
                            </h3>
                            <button onClick={() => !processingIzin && setShowIzinModal(false)} className="text-slate-400 hover:text-red-500 transition-colors">
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>
                        <div className="p-6">
                            <form onSubmit={handleIzinSubmit} className="space-y-4">
                                <div>
                                    <label htmlFor="reason" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Alasan Izin</label>
                                    <select
                                        id="reason"
                                        title="Pilih Alasan Izin"
                                        value={izinData.reason}
                                        onChange={e => setIzinData('reason', e.target.value)}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                                        required
                                    >
                                        <option value="Sakit">Sakit</option>
                                        <option value="Kepentingan Keluarga">Kepentingan Keluarga</option>
                                        <option value="Lain-lain">Lain-lain</option>
                                    </select>
                                    {izinErrors.reason && <p className="text-xs text-red-500 mt-1">{izinErrors.reason}</p>}
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Deskripsi Lengkap</label>
                                    <textarea
                                        value={izinData.notes}
                                        onChange={e => setIzinData('notes', e.target.value)}
                                        placeholder="Berikan alasan kenapa tidak masuk kerja hari ini..."
                                        rows={3}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all placeholder:text-slate-400"
                                        required
                                    />
                                    {izinErrors.notes && <p className="text-xs text-red-500 mt-1">{izinErrors.notes}</p>}
                                </div>
                                <div>
                                    <label htmlFor="proof" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Bukti Pendukung (Foto/Dokumen)</label>
                                    <div className="flex flex-col items-center justify-center border-2 border-dashed border-slate-300 rounded-xl p-4 bg-slate-50 hover:bg-slate-100 transition-colors relative cursor-pointer overflow-hidden">
                                        <input
                                            id="proof"
                                            title="Pilih file bukti pendukung"
                                            type="file"
                                            onChange={e => setIzinData('proof', e.target.files ? e.target.files[0] : null)}
                                            className="absolute inset-0 opacity-0 cursor-pointer"
                                            accept="image/*,.pdf"
                                            required
                                        />
                                        <span className="material-symbols-outlined text-slate-400 text-3xl mb-1">upload_file</span>
                                        <p className="text-xs text-slate-500 text-center font-medium max-w-[200px] truncate">
                                            {izinData.proof ? izinData.proof.name : 'Pilih file atau drop disini'}
                                        </p>
                                        <p className="text-[10px] text-slate-400 mt-1">Maks. 2MB (JPG, PNG, PDF)</p>
                                    </div>
                                    {izinErrors.proof && <p className="text-xs text-red-500 mt-1">{izinErrors.proof}</p>}
                                </div>
                                <div className="pt-4 flex gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setShowIzinModal(false)}
                                        className="flex-1 py-3 text-sm font-semibold text-slate-600 bg-slate-100 rounded-xl hover:bg-slate-200 transition-colors"
                                    >
                                        Batal
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={processingIzin}
                                        className="flex-1 py-3 text-sm font-semibold text-white bg-primary rounded-xl hover:bg-primary-hover transition-colors shadow-sm shadow-primary/30 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                    >
                                        {processingIzin && <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
                                        {processingIzin ? 'Memproses...' : 'Kirim Izin'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div></Portal>
            )}
        </StudentLayout>
    );
}
