import AdminLayout from '@/Layouts/AdminLayout';
import Portal from '@/Components/Portal';
import { Head, useForm, router, usePage } from '@inertiajs/react';
import { useState } from 'react';

interface KelasItem {
    id: number;
    name: string;
    description: string | null;
}

interface Props {
    kelasList: KelasItem[];
}

export default function KelasJurusan({ kelasList }: Props) {
    const { props } = usePage();
    const flash = (props as any).flash;

    const [isAdding, setIsAdding] = useState(false);
    const [deletingId, setDeletingId] = useState<number | null>(null);
    const [editingId, setEditingId] = useState<number | null>(null);

    const form = useForm({ name: '', description: '' });

    const handleAdd = () => {
        form.reset();
        setEditingId(null);
        setIsAdding(true);
    };

    const handleEdit = (k: KelasItem) => {
        form.setData({ name: k.name, description: k.description || '' });
        setEditingId(k.id);
        setIsAdding(false);
    };

    const showModal = isAdding || editingId !== null;

    const handleSave = () => {
        if (isAdding) {
            form.post(route('admin.kelas.store'), {
                onSuccess: () => { form.reset(); setIsAdding(false); },
            });
        } else if (editingId) {
            form.put(route('admin.kelas.update', editingId), {
                onSuccess: () => { form.reset(); setEditingId(null); },
            });
        }
    };

    const handleClose = () => {
        form.reset();
        setIsAdding(false);
        setEditingId(null);
    };

    const confirmDelete = () => {
        if (deletingId) {
            router.delete(route('admin.kelas.destroy', deletingId), { onSuccess: () => setDeletingId(null) });
        }
    };

    return (
        <AdminLayout title="Kelas & Jurusan" subtitle="Manajemen Data Kelas dan Jurusan Siswa">
            <Head title="Kelas & Jurusan" />

            {flash?.success && (
                <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-3 rounded-xl text-sm font-medium flex items-center gap-2">
                    <span className="material-symbols-outlined text-sm">check_circle</span>{flash.success}
                </div>
            )}

            <div className="flex items-center justify-between">
                <p className="text-sm text-slate-500">Total {kelasList.length} kelas terdaftar</p>
                <button onClick={handleAdd} className="flex items-center gap-2 rounded-lg bg-primary text-white px-4 py-2 text-sm font-semibold hover:bg-primary/90 transition-all shadow-md">
                    <span className="material-symbols-outlined text-sm">add</span>
                    Tambah Kelas
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {kelasList.map((k) => (
                    <div key={k.id} className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow group">
                        <div className="p-5">
                            <div className="flex items-start justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                                        <span className="material-symbols-outlined text-primary text-lg">school</span>
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-bold text-slate-900">{k.name}</h4>
                                        {k.description && <p className="text-xs text-slate-500 mt-0.5">{k.description}</p>}
                                    </div>
                                </div>
                                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button onClick={() => handleEdit(k)} className="p-1.5 text-slate-400 hover:text-primary hover:bg-primary/10 rounded-md transition-colors" title="Edit">
                                        <span className="material-symbols-outlined text-sm">edit</span>
                                    </button>
                                    <button onClick={() => setDeletingId(k.id)} className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors" title="Hapus">
                                        <span className="material-symbols-outlined text-sm">delete</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
                {kelasList.length === 0 && (
                    <div className="col-span-full bg-white rounded-xl border border-slate-200 p-8 text-center">
                        <span className="material-symbols-outlined text-5xl text-slate-200 mb-3">school</span>
                        <h4 className="font-bold text-slate-700 mb-1">Belum Ada Data Kelas</h4>
                        <p className="text-sm text-slate-500">Tambahkan kelas dan jurusan untuk memulai.</p>
                    </div>
                )}
            </div>

            {/* Add/Edit Modal */}
            {showModal && (
                <Portal><div className="fixed inset-0 z-[10000] flex items-center justify-center">
                    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={handleClose}></div>
                    <div className="relative z-10 bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-4">
                        <div className="px-6 py-5 border-b border-slate-200 flex justify-between items-center">
                            <h3 className="text-lg font-bold text-slate-800">{isAdding ? 'Tambah Kelas' : 'Edit Kelas'}</h3>
                            <button onClick={handleClose} className="text-slate-400 hover:text-slate-600 transition-colors" title="Tutup">
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>
                        <div className="p-6 space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Nama Kelas</label>
                                <input type="text" value={form.data.name} onChange={(e) => form.setData('name', e.target.value)} className="w-full px-3 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50" placeholder="Contoh: XI - TKJ 1" />
                                {form.errors.name && <p className="text-red-500 text-xs mt-1">{form.errors.name}</p>}
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Jurusan / Deskripsi</label>
                                <input type="text" value={form.data.description} onChange={(e) => form.setData('description', e.target.value)} className="w-full px-3 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50" placeholder="Contoh: Teknik Komputer & Jaringan" />
                                {form.errors.description && <p className="text-red-500 text-xs mt-1">{form.errors.description}</p>}
                            </div>
                        </div>
                        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 rounded-b-2xl flex justify-end gap-3">
                            <button onClick={handleClose} className="px-5 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-200 rounded-lg transition-colors">Batal</button>
                            <button onClick={handleSave} disabled={form.processing} className="px-5 py-2.5 text-sm font-semibold text-white bg-primary hover:bg-primary/90 rounded-lg transition-colors shadow-sm disabled:opacity-50">
                                {form.processing ? 'Menyimpan...' : 'Simpan'}
                            </button>
                        </div>
                    </div>
                </div></Portal>
            )}

            {/* Delete Modal */}
            {deletingId !== null && (
                <Portal><div className="fixed inset-0 z-[10000] flex items-center justify-center">
                    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={() => setDeletingId(null)}></div>
                    <div className="relative z-10 bg-white rounded-2xl shadow-2xl w-full max-w-sm mx-4">
                        <div className="p-6 text-center">
                            <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                <span className="material-symbols-outlined text-3xl">warning</span>
                            </div>
                            <h3 className="text-lg font-bold text-slate-800 mb-2">Hapus Kelas?</h3>
                            <p className="text-sm text-slate-500">Data kelas yang dihapus tidak dapat dikembalikan.</p>
                        </div>
                        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 rounded-b-2xl flex justify-end gap-3">
                            <button onClick={() => setDeletingId(null)} className="px-5 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-200 rounded-lg transition-colors">Batal</button>
                            <button onClick={confirmDelete} className="px-5 py-2.5 text-sm font-semibold text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors">Ya, Hapus</button>
                        </div>
                    </div>
                </div></Portal>
            )}
        </AdminLayout>
    );
}
