import AdminLayout from '@/Layouts/AdminLayout';
import { Head, useForm } from '@inertiajs/react';

interface Props {
    wablas_domain: string;
    wablas_token: string;
    flash?: { success?: string; error?: string };
}

export default function Whatsapp({ wablas_domain, wablas_token, flash }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        wablas_domain: wablas_domain || '',
        wablas_token: wablas_token || '',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('admin.whatsapp.update'));
    };

    return (
        <AdminLayout title="Whatsapp API" subtitle="Konfigurasi integrasi API Wablas">
            <Head title="Whatsapp API" />
            
            <div className="w-full">
                {flash?.success && (
                    <div className="mb-6 bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-3 rounded-xl text-sm font-medium flex items-center gap-2">
                        <span className="material-symbols-outlined text-sm">check_circle</span>
                        {flash.success}
                    </div>
                )}

                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="p-6 border-b border-slate-100 bg-slate-50/50">
                        <div className="flex items-center gap-3">
                            <div className="size-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
                                <span className="material-symbols-outlined">forum</span>
                            </div>
                            <div className="flex-1">
                                <div className="flex items-center justify-between">
                                    <h3 className="font-bold text-slate-900">Pengaturan Wablas API</h3>
                                    {wablas_domain && wablas_token ? (
                                        <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-700 text-[10px] font-black uppercase tracking-widest flex items-center gap-1">
                                            <span className="size-1.5 rounded-full bg-emerald-500 shadow-sm mr-0.5 animate-pulse"></span>
                                            Terhubung
                                        </span>
                                    ) : (
                                        <span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-500 text-[10px] font-black uppercase tracking-widest flex items-center gap-1">
                                            <span className="size-1.5 rounded-full bg-slate-400 shadow-sm mr-0.5"></span>
                                            Tidak Terhubung
                                        </span>
                                    )}
                                </div>
                                <p className="text-sm text-slate-500 mt-0.5">Hubungkan sistem dengan WhatsApp menggunakan Wablas untuk pengiriman pesan otomatis.</p>
                            </div>
                        </div>
                    </div>
                    
                    <form onSubmit={submit} className="p-6 space-y-6">
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-1.5 ml-1">URL Domain Wablas</label>
                            <div className="relative">
                                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">link</span>
                                <input
                                    type="url"
                                    value={data.wablas_domain}
                                    onChange={e => setData('wablas_domain', e.target.value)}
                                    className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all text-sm"
                                    placeholder="Contoh: https://solo.wablas.com"
                                />
                            </div>
                            {errors.wablas_domain && <p className="text-red-500 text-xs mt-1 ml-1">{errors.wablas_domain}</p>}
                            <p className="text-xs text-slate-500 mt-1.5 ml-1">Masukkan base URL server Wablas Anda (tanpa / di akhir). Kosongkan jika belum menggunakan fitur ini.</p>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-1.5 ml-1">Token API Wablas</label>
                            <div className="relative">
                                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">key</span>
                                <input
                                    type="text"
                                    value={data.wablas_token}
                                    onChange={e => setData('wablas_token', e.target.value)}
                                    className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all text-sm font-mono"
                                    placeholder="Masukkan Token rahasia API Wablas"
                                />
                            </div>
                            {errors.wablas_token && <p className="text-red-500 text-xs mt-1 ml-1">{errors.wablas_token}</p>}
                        </div>

                        <div className="pt-4 border-t border-slate-100 flex justify-end">
                            <button
                                disabled={processing}
                                type="submit"
                                className="bg-primary text-white px-6 py-2.5 rounded-xl font-bold hover:bg-blue-800 transition-colors shadow-sm disabled:opacity-70 flex items-center gap-2"
                            >
                                <span className="material-symbols-outlined text-sm">save</span>
                                {processing ? 'Menyimpan...' : 'Simpan Pengaturan'}
                            </button>
                        </div>
                    </form>
                </div>
                
                <div className="mt-6 bg-blue-50 border border-blue-100 rounded-2xl p-6">
                    <h4 className="font-bold text-blue-900 flex items-center gap-2 mb-2">
                        <span className="material-symbols-outlined text-blue-600">info</span>
                        Informasi Penggunaan
                    </h4>
                    <ul className="list-disc list-inside text-sm text-blue-800 space-y-1.5 ml-1 opacity-90">
                        <li>Pastikan layanan Wablas Anda dalam keadaan aktif.</li>
                        <li>Token API dapat ditemukan pada menu API Registration di dashboard Wablas.</li>
                        <li>Sistem otomatis menggunakan API ini untuk membalas permintaan reset sandi Helpdesk.</li>
                    </ul>
                </div>
            </div>
        </AdminLayout>
    );
}
