import StudentLayout from '@/Layouts/StudentLayout';
import Portal from '@/Components/Portal';
import { Head, useForm, router, usePage } from '@inertiajs/react';
import { useState } from 'react';

interface Journal { id: number; date: string; title: string; description: string; status: string; statusText: string; image_path: string | null; }
interface Props { journals: Journal[]; filters: { filter?: string }; siswa?: { gender?: string } | null; }

export default function JurnalSaya({ journals, filters, siswa }: Props) {
    const [showForm, setShowForm] = useState(false);
    const [previewImage, setPreviewImage] = useState<string | null>(null);
    const { props } = usePage();
    const flash = (props as any).flash;

    const { data, setData, post, processing, reset, errors } = useForm({
        title: '',
        description: '',
        image: null as File | null,
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('student.journal.store'), {
            forceFormData: true,
            onSuccess: () => { reset(); setShowForm(false); },
        });
    };

    return (
        <StudentLayout title="Jurnal Saya" subtitle="Catatan Kegiatan Harian PKL" showBack studentGender={siswa?.gender}>
            <Head title="Jurnal Saya" />

            {flash?.success && (
                <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-3 rounded-xl text-sm font-medium flex items-center gap-2">
                    <span className="material-symbols-outlined text-sm">check_circle</span>{flash.success}
                </div>
            )}

            {/* Filter + Add Button */}
            <div className="flex items-center justify-between">
                <div className="flex gap-2">
                    {['all', 'pending', 'verified'].map(f => (
                        <button key={f} onClick={() => router.get(route('student.journal'), { filter: f === 'all' ? undefined : f }, { preserveState: true })} className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors ${(filters.filter || 'all') === f || (!filters.filter && f === 'all') ? 'bg-primary text-white' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}>
                            {f === 'all' ? 'Semua' : f === 'pending' ? 'Menunggu' : 'Terverifikasi'}
                        </button>
                    ))}
                </div>
                <button onClick={() => setShowForm(!showForm)} className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg text-sm font-bold shadow-md hover:bg-primary/90 transition-all">
                    <span className="material-symbols-outlined text-sm">{showForm ? 'close' : 'add'}</span>
                    {showForm ? 'Tutup' : 'Tulis Jurnal'}
                </button>
            </div>

            {/* Journal Form */}
            {showForm && (
                <form onSubmit={submit} className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-4">
                    <h4 className="font-bold text-slate-900">Jurnal Baru</h4>
                    <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Judul Kegiatan</label>
                        <input type="text" value={data.title} onChange={e => setData('title', e.target.value)} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50" placeholder="Contoh: Membuat desain halaman login" />
                        {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title}</p>}
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Deskripsi Kegiatan</label>
                        <textarea value={data.description} onChange={e => setData('description', e.target.value)} rows={4} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none" placeholder="Deskripsikan apa yang kamu kerjakan hari ini..." />
                        {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
                    </div>
                    <div>
                        <label htmlFor="image" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Foto Dokumentasi (opsional)</label>
                        <input id="image" title="Foto Dokumentasi Jurnal" type="file" accept="image/*" onChange={e => setData('image', e.target.files?.[0] || null)} className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20" />
                    </div>
                    <div className="flex justify-end">
                        <button type="submit" disabled={processing} className="px-6 py-2.5 bg-primary text-white rounded-lg text-sm font-bold shadow-md hover:bg-primary/90 disabled:opacity-50 flex items-center gap-2">
                            {processing ? 'Mengirim...' : 'Kirim Jurnal'}
                            {!processing && <span className="material-symbols-outlined text-sm">send</span>}
                        </button>
                    </div>
                </form>
            )}

            {/* Journal List */}
            <div className="space-y-3">
                {journals.length > 0 ? journals.map(j => (
                    <div key={j.id} className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between gap-3">
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                    <h4 className="text-sm font-bold text-slate-900 truncate">{j.title}</h4>
                                    <span className={`shrink-0 px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${j.status === 'verified' ? 'bg-emerald-100 text-emerald-700' : j.status === 'pending' ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'}`}>{j.statusText}</span>
                                </div>
                                <p className="text-[11px] text-slate-400 flex items-center gap-1">
                                    <span className="material-symbols-outlined text-[11px]">calendar_today</span>{j.date}
                                </p>
                                <p className="text-xs text-slate-500 mt-1.5 line-clamp-2 leading-relaxed">{j.description}</p>
                            </div>
                            {j.image_path && (
                                <button
                                    onClick={() => setPreviewImage(`/storage/${j.image_path}`)}
                                    className="shrink-0 inline-flex items-center gap-1.5 text-xs bg-indigo-50 hover:bg-indigo-100 text-indigo-700 px-3 py-2 rounded-lg font-bold transition-colors border border-indigo-200"
                                >
                                    <span className="material-symbols-outlined text-[16px]">photo_camera</span>
                                    Lihat Bukti
                                </button>
                            )}
                        </div>
                    </div>
                )) : (
                    <div className="bg-white rounded-xl border border-slate-200 p-8 text-center shadow-sm">
                        <span className="material-symbols-outlined text-5xl text-slate-200 mb-3">menu_book</span>
                        <h4 className="font-bold text-slate-700 mb-1">Belum Ada Jurnal</h4>
                        <p className="text-sm text-slate-500">Mulai catat kegiatan PKL hari ini!</p>
                    </div>
                )}
            </div>

            {/* Photo Preview Modal */}
            {previewImage && (
                <Portal><div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm" onClick={() => setPreviewImage(null)}>
                    <div className="relative max-w-lg w-full" onClick={e => e.stopPropagation()}>
                        <button
                            onClick={() => setPreviewImage(null)}
                            className="absolute -top-3 -right-3 z-10 size-8 bg-white rounded-full shadow-lg flex items-center justify-center text-slate-500 hover:text-red-500 transition-colors border border-slate-200"
                        >
                            <span className="material-symbols-outlined text-lg">close</span>
                        </button>
                        <img src={previewImage} alt="Dokumentasi" className="w-full rounded-2xl shadow-2xl border-4 border-white" />
                    </div>
                </div></Portal>
            )}
        </StudentLayout>
    );
}
