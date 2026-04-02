import AdminLayout from '@/Layouts/AdminLayout';
import { Head, router } from '@inertiajs/react';

interface HelpRequestItem { id: number; name: string; contact: string; type: string; status: string; created_at: string; }
interface Props { requests: HelpRequestItem[]; }

export default function Helpdesk({ requests }: Props) {
    const handleProcess = (id: number) => {
        router.patch(route('admin.helpdesk.process', id));
    };

    return (
        <AdminLayout title="Helpdesk" subtitle="Manajemen Permintaan Lupa Kata Sandi">
            <Head title="Helpdesk" />
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
                        <tbody className="divide-y divide-slate-50">
                            {requests.map((req) => (
                                <tr key={req.id} className="hover:bg-slate-50/50 transition-colors">
                                    <td className="px-6 py-4"><div className="flex items-center gap-3"><div className="size-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 shrink-0"><span className="material-symbols-outlined text-lg">person</span></div>{(() => { const m = req.name.match(/^(.*?)\s*\(NISN:\s*([^)]+)\)$/); if (m) { return (<div className="flex flex-col"><span className="text-sm font-bold text-slate-700">{m[1]}</span><span className="text-[10px] text-slate-500 font-medium tracking-wide">NISN: {m[2]}</span></div>); } return <span className="text-sm font-bold text-slate-700">{req.name}</span>; })()}</div></td>
                                    <td className="px-6 py-4 text-sm font-medium text-slate-600">{req.contact}</td>
                                    <td className="px-6 py-4"><div className="flex items-center gap-1.5"><span className={`material-symbols-outlined text-lg ${req.type === 'whatsapp' ? 'text-emerald-500' : 'text-blue-500'}`}>{req.type === 'whatsapp' ? 'chat' : 'mail'}</span><span className="text-xs font-bold text-slate-500 capitalize">{req.type}</span></div></td>
                                    <td className="px-6 py-4 text-xs text-slate-400 font-medium">{new Date(req.created_at).toLocaleDateString('id-ID')}</td>
                                    <td className="px-6 py-4"><span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${req.status === 'pending' ? 'bg-amber-50 text-amber-600' : 'bg-emerald-50 text-emerald-600'}`}>{req.status}</span></td>
                                    <td className="px-6 py-4 text-right">
                                        {req.status === 'pending' ? (
                                            req.type === 'whatsapp' ? (
                                                <button onClick={() => handleProcess(req.id)} className="bg-emerald-500 text-white px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-widest hover:bg-emerald-600 transition-all shadow-md shadow-emerald-500/20 flex items-center gap-1.5 ml-auto">
                                                    <span className="material-symbols-outlined text-sm">send</span> Kirim via WA
                                                </button>
                                            ) : (
                                                <button onClick={() => handleProcess(req.id)} className="bg-primary text-white px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-widest hover:bg-blue-800 transition-all shadow-md shadow-blue-900/10 ml-auto">
                                                    Tandai Selesai
                                                </button>
                                            )
                                        ) : (
                                            <span className="text-xs font-bold text-slate-400 italic">Diproses</span>
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
