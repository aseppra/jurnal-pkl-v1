import { Head, useForm, usePage } from '@inertiajs/react';
import { FormEventHandler, useState, useEffect } from 'react';
import Modal from '@/Components/Modal';

export default function Login({ status }: { status?: string }) {
    const [role, setRole] = useState<'siswa' | 'admin'>('siswa');
    const [showPassword, setShowPassword] = useState(false);
    const [showForgotModal, setShowForgotModal] = useState(false);
    const { props } = usePage();
    const flash = (props as any).flash;

    const { data, setData, post, processing, errors } = useForm({
        username: '',
        password: '',
        remember: false,
    });

    const forgotForm = useForm({
        nisn: '',
        name: '',
        email: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('login'));
    };

    return (
        <>
            <Head title="Login" />
            <div className="flex min-h-screen flex-col lg:flex-row">
                {/* Left Section: Visual/Brand */}
                <div className="hidden lg:flex lg:w-1/2 relative bg-primary items-center justify-center overflow-hidden p-12">
                    <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '40px 40px' }}></div>
                    <div className="relative z-10 max-w-lg text-white">
                        <div className="mb-8 flex items-center gap-3">
                            <div className="bg-white/20 p-3 rounded-xl backdrop-blur-sm">
                                <span className="material-symbols-outlined text-4xl">school</span>
                            </div>
                            <h1 className="text-3xl font-bold tracking-tight">Portal Jurnal PKL</h1>
                        </div>
                        <div className="space-y-6">
                            <h2 className="text-5xl font-extrabold leading-tight">Membangun Masa Depan Melalui Pengalaman.</h2>
                            <p className="text-xl text-blue-100/80 leading-relaxed">
                                Platform digital untuk memantau, mencatat, dan melaporkan kegiatan Praktek Kerja Lapangan siswa SMK dengan lebih mudah dan transparan.
                            </p>
                        </div>
                        <div className="mt-12 grid grid-cols-2 gap-6">
                            <div className="glass-effect p-6 rounded-2xl">
                                <span className="material-symbols-outlined text-blue-200 mb-2">fact_check</span>
                                <p className="text-sm font-semibold">Laporan Harian</p>
                                <p className="text-xs text-blue-100/60 mt-1">Catat aktivitas harianmu secara realtime.</p>
                            </div>
                            <div className="glass-effect p-6 rounded-2xl">
                                <span className="material-symbols-outlined text-blue-200 mb-2">monitoring</span>
                                <p className="text-sm font-semibold">Monitoring Pembimbing</p>
                                <p className="text-xs text-blue-100/60 mt-1">Evaluasi langsung dari guru pembimbing.</p>
                            </div>
                        </div>
                    </div>
                    <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl"></div>
                    <div className="absolute -top-24 -right-24 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl"></div>
                </div>

                {/* Right Section: Login Form */}
                <div className="flex-1 flex flex-col justify-center items-center p-6 sm:p-12 lg:p-24 bg-white">
                    <div className="w-full max-w-[420px]">
                        <div className="lg:hidden flex items-center gap-3 mb-10">
                            <span className="material-symbols-outlined text-primary text-4xl">school</span>
                            <h1 className="text-2xl font-bold text-slate-900">Portal PKL</h1>
                        </div>
                        <div className="mb-10">
                            <h3 className="text-3xl font-bold text-slate-900 mb-2">Selamat Datang</h3>
                            <p className="text-slate-500">Silakan masuk ke akun Anda untuk melanjutkan jurnal PKL.</p>
                        </div>

                        {status && <div className="mb-4 text-sm font-medium text-green-600">{status}</div>}
                        {flash?.success && (
                            <div className="mb-4 bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-3 rounded-xl text-sm font-medium flex gap-2">
                                <span className="material-symbols-outlined text-sm shrink-0">check_circle</span>
                                <p>{flash.success}</p>
                            </div>
                        )}

                        {/* Tab Switcher */}
                        <div className="flex bg-slate-100 p-1 rounded-xl mb-8">
                            <button
                                type="button"
                                onClick={() => setRole('siswa')}
                                className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-semibold rounded-lg transition-all ${role === 'siswa' ? 'bg-white shadow-sm text-primary' : 'text-slate-500 hover:text-slate-700'}`}
                            >
                                <span className="material-symbols-outlined text-sm">person</span>
                                Siswa
                            </button>
                            <button
                                type="button"
                                onClick={() => setRole('admin')}
                                className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-semibold rounded-lg transition-all ${role === 'admin' ? 'bg-white shadow-sm text-primary' : 'text-slate-500 hover:text-slate-700'}`}
                            >
                                <span className="material-symbols-outlined text-sm">admin_panel_settings</span>
                                Admin
                            </button>
                        </div>

                        <form onSubmit={submit} className="space-y-5">
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-1.5 ml-1">
                                    {role === 'siswa' ? 'NISN / Username' : 'Username'}
                                </label>
                                <div className="relative">
                                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-xl leading-none">
                                        {role === 'siswa' ? 'badge' : 'person'}
                                    </span>
                                    <input
                                        required
                                        value={data.username}
                                        onChange={(e) => setData('username', e.target.value)}
                                        className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all text-slate-900 placeholder:text-slate-400"
                                        placeholder={role === 'siswa' ? 'Masukkan NISN Anda' : 'Masukkan Username Admin'}
                                        type="text"
                                    />
                                </div>
                                {errors.username && <p className="text-red-500 text-sm mt-1">{errors.username}</p>}
                            </div>
                            <div>
                                <div className="flex justify-between mb-1.5 ml-1">
                                    <label className="text-sm font-semibold text-slate-700">Kata Sandi</label>
                                </div>
                                <div className="relative">
                                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-xl leading-none">lock</span>
                                    <input
                                        required
                                        value={data.password}
                                        onChange={(e) => setData('password', e.target.value)}
                                        className="w-full pl-12 pr-12 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all text-slate-900 placeholder:text-slate-400"
                                        placeholder="••••••••"
                                        type={showPassword ? 'text' : 'password'}
                                    />
                                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors">
                                        <span className="material-symbols-outlined text-xl leading-none">{showPassword ? 'visibility_off' : 'visibility'}</span>
                                    </button>
                                </div>
                                {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
                            </div>
                            <div className="flex items-center justify-between py-2">
                                <div className="flex items-center gap-2">
                                    <input
                                        className="w-4 h-4 rounded border-slate-300 text-primary focus:ring-primary"
                                        id="remember"
                                        type="checkbox"
                                        checked={data.remember}
                                        onChange={(e) => setData('remember', e.target.checked)}
                                    />
                                    <label className="text-sm text-slate-600" htmlFor="remember">Ingat saya</label>
                                </div>
                                <button type="button" onClick={() => setShowForgotModal(true)} className="text-sm font-bold text-primary hover:text-blue-800 transition-colors">
                                    Lupa Kata Sandi?
                                </button>
                            </div>
                            <button
                                disabled={processing}
                                className="w-full bg-primary hover:bg-blue-800 text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-900/20 transition-all flex items-center justify-center gap-2 group disabled:opacity-60"
                                type="submit"
                            >
                                {processing ? 'Memproses...' : 'Masuk ke Dashboard'}
                                {!processing && <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>}
                            </button>
                        </form>

                        <footer className="mt-12 text-center">
                            <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">© 2026 Portal Jurnal PKL v1.0</p>
                        </footer>
                    </div>
                </div>
            </div>

            {/* Forgot Password Modal */}
            <Modal show={showForgotModal} onClose={() => setShowForgotModal(false)} maxWidth="sm">
                <div className="p-6">
                    <div className="flex items-center justify-between mb-5">
                        <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                            <span className="material-symbols-outlined text-primary">lock_reset</span>
                            Lupa Kata Sandi
                        </h2>
                        <button onClick={() => setShowForgotModal(false)} className="text-slate-400 hover:text-slate-600 transition-colors">
                            <span className="material-symbols-outlined">close</span>
                        </button>
                    </div>

                    <p className="text-sm text-slate-600 mb-6">
                        Masukkan data diri Anda untuk meminta info login baru. Admin akan memverifikasi dan mengirimkan kata sandi baru ke email Anda.
                    </p>

                    <form onSubmit={(e) => {
                        e.preventDefault();
                        forgotForm.post(route('helpdesk.request'), {
                            onSuccess: () => {
                                setShowForgotModal(false);
                                forgotForm.reset();
                            }
                        });
                    }} className="space-y-4">
                        <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1 ml-1 uppercase tracking-wider">NISN</label>
                            <input
                                required
                                value={forgotForm.data.nisn}
                                onChange={e => forgotForm.setData('nisn', e.target.value)}
                                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all text-sm"
                                placeholder="Masukkan NISN Anda"
                            />
                            {forgotForm.errors.nisn && <p className="text-red-500 text-xs mt-1 ml-1">{forgotForm.errors.nisn}</p>}
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1 ml-1 uppercase tracking-wider">Nama Lengkap</label>
                            <input
                                required
                                value={forgotForm.data.name}
                                onChange={e => forgotForm.setData('name', e.target.value)}
                                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all text-sm"
                                placeholder="Nama Lengkap Anda"
                            />
                            {forgotForm.errors.name && <p className="text-red-500 text-xs mt-1 ml-1">{forgotForm.errors.name}</p>}
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1 ml-1 uppercase tracking-wider">Alamat Email / No. Whatsapp</label>
                            <input
                                required
                                type="text"
                                value={forgotForm.data.email}
                                onChange={e => forgotForm.setData('email', e.target.value)}
                                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all text-sm"
                                placeholder="nama@email.com atau 08123xxxx"
                            />
                            {forgotForm.errors.email && <p className="text-red-500 text-xs mt-1 ml-1">{forgotForm.errors.email}</p>}
                        </div>

                        <div className="flex gap-3 mt-8 pt-4 border-t border-slate-100">
                            <button
                                type="button"
                                onClick={() => setShowForgotModal(false)}
                                className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-bold text-slate-600 hover:bg-slate-50 transition-colors"
                            >
                                Batal
                            </button>
                            <button
                                type="submit"
                                disabled={forgotForm.processing}
                                className="flex-1 px-4 py-2.5 rounded-xl bg-primary text-white text-sm font-bold hover:bg-blue-800 transition-colors shadow-sm disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                {forgotForm.processing ? 'Mengirim...' : 'Kirim Permintaan'}
                            </button>
                        </div>
                    </form>
                </div>
            </Modal>
        </>
    );
}
