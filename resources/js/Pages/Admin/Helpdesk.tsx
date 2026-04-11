import AdminLayout from '@/Layouts/AdminLayout';
import { Head, router, usePage } from '@inertiajs/react';
import { useState } from 'react';

interface HelpRequestItem { id: number; name: string; contact: string; type: string; status: string; created_at: string; }
interface Props { requests: HelpRequestItem[]; }

export default function Helpdesk({ requests }: Props) {
    const { props } = usePage();
    const flash = (props as any).flash;
    const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);

    const handleProcess = (id: number) => {
        router.patch(route('admin.helpdesk.process', id));
    };

    const handleDelete = (id: number) => {
        router.delete(route('admin.helpdesk.destroy', id), {
            onSuccess: () => setConfirmDeleteId(null),
        });
    };

    return (
        <AdminLayout title="Helpdesk" subtitle="Manajemen Permintaan Lupa Kata Sandi">
            <Head title="Helpdesk" />

            {/* Flash Messages */}
            {flash?.success && (
                <div className="mb-4 flex items-center gap-2 bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm font-medium px-4 py-3 rounded-xl">
                    <span className="material-symbols-outlined text-sm">check_circle</span>{flash.success}
                </div>
            )}
            {flash?.error && (
                <div className="mb-4 flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 text-sm font-medium px-4 py-3 rounded-xl">
                    <span className="material-symbols-outlined text-sm">error</span>{flash.error}
                </div>
            )}

            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                    <h3 className="font-bold text-slate-900 flex items-center gap-2">
                        <span className="material-symbols-outlined text-primary">lock_reset</span>
                        Permintaan Reset Password
                    </h3>
                    <span className="px-3 py-1 bg-amber-100 text-amber-700 text-[10px] font-black uppercase tracking-widest rounded-full">
                        {requests.filter(r => r.status === 'pending').length} Pending
                    </span>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead><tr className="bg-slate-50 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">
                            <th className="px-6 py-4">Nama Pengguna</th><th className="px-6 py-4">Kontak</th><th className="px-6 py-4">Metode</th><th className="px-6 py-4">Waktu</th><th className="px-6 py-4">Status</th><th className="px-6 py-4 text-right">Aksi</th>
                        </tr></thead>
                        <tbody className="divide-y divide-slate-100">
                            {requests.map((req) => (
                                <tr key={req.id} className={`transition-colors ${confirmDeleteId === req.id ? 'bg-red-50/60' : 'hover:bg-slate-50/50'}`}>
                                    <td className="px-6 py-4"><div className="flex items-center gap-3"><div className="size-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 shrink-0"><span className="material-symbols-outlined text-lg">person</span></div>{(() => { const m = req.name.match(/^(.*?)\s*\(NISN:\s*([^)]+)\)$/); if (m) { return (<div className="flex flex-col"><span className="text-xs font-bold text-slate-700">{m[1]}</span><span className="text-[10px] text-slate-500 font-medium tracking-wide">NISN: {m[2]}</span></div>); } return <span className="text-xs font-bold text-slate-700">{req.name}</span>; })()}</div></td>
                                    <td className="px-6 py-4 text-xs font-medium text-slate-600">{req.contact}</td>
                                    <td className="px-6 py-4"><div className="flex items-center gap-1.5"><span className={`material-symbols-outlined text-lg ${req.type === 'whatsapp' ? 'text-emerald-500' : 'text-blue-500'}`}>{req.type === 'whatsapp' ? 'chat' : 'mail'}</span><span className="text-xs font-bold text-slate-500 capitalize">{req.type}</span></div></td>
                                    <td className="px-6 py-4 text-xs text-slate-400 font-medium">{new Date(req.created_at).toLocaleDateString('id-ID')}</td>
                                    <td className="px-6 py-4"><span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${req.status === 'pending' ? 'bg-amber-50 text-amber-600' : 'bg-emerald-50 text-emerald-600'}`}>{req.status}</span></td>
                                    <td className="px-6 py-4">
                                        {confirmDeleteId === req.id ? (
                                            /* Inline Confirmation State */
                                            <div className="flex items-center justify-end gap-2">
                                                <span className="text-xs text-red-600 font-semibold mr-1">Hapus permanen?</span>
                                                <button
                                                    onClick={() => handleDelete(req.id)}
                                                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1 shadow-sm shadow-red-500/20"
                                                >
                                                    <span className="material-symbols-outlined text-sm">check</span> Ya, Hapus
                                                </button>
                                                <button
                                                    onClick={() => setConfirmDeleteId(null)}
                                                    className="bg-slate-100 hover:bg-slate-200 text-slate-600 px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all"
                                                >
                                                    Batal
                                                </button>
                                            </div>
                                        ) : (
                                            /* Normal State */
                                            <div className="flex items-center justify-end gap-2">
                                                {req.status === 'pending' ? (
                                                    req.type === 'whatsapp' ? (
                                                        <button onClick={() => handleProcess(req.id)} className="bg-emerald-500 text-white px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-widest hover:bg-emerald-600 transition-all shadow-md shadow-emerald-500/20 flex items-center gap-1.5">
                                                            <span className="material-symbols-outlined text-sm">send</span> Kirim via WA
                                                        </button>
                                                    ) : (
                                                        <button onClick={() => handleProcess(req.id)} className="bg-primary text-white px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-widest hover:bg-blue-800 transition-all shadow-md shadow-blue-900/10">
                                                            Tandai Selesai
                                                        </button>
                                                    )
                                                ) : (
                                                    <span className="text-xs font-bold text-slate-400 italic">Diproses</span>
                                                )}
                                                {/* Delete Button — always visible */}
                                                <button
                                                    onClick={() => setConfirmDeleteId(req.id)}
                                                    title="Hapus Permintaan"
                                                    className="size-8 flex items-center justify-center rounded-lg bg-red-50 hover:bg-red-100 text-red-500 hover:text-red-600 transition-all border border-red-100"
                                                >
                                                    <span className="material-symbols-outlined text-[18px]">delete</span>
                                                </button>
                                            </div>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {requests.length === 0 && (
                    <div className="p-12 text-center">
                        <span className="material-symbols-outlined text-6xl text-slate-200 mb-4">check_circle</span>
                        <p className="text-slate-500 font-medium">Tidak ada permintaan bantuan saat ini.</p>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}

