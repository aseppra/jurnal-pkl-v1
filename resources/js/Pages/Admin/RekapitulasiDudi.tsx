import AdminLayout from '@/Layouts/AdminLayout';
import { Head, router } from '@inertiajs/react';
import { useState, useRef, useEffect } from 'react';

interface Siswa { id: number; name: string; nisn: string; class: string; }
interface Pembimbing { id: number; name: string; phone: string; }
interface Dudi { id: number; name: string; address: string; siswas: Siswa[]; pembimbings: Pembimbing[]; }
interface PaginatedDudis { data: Dudi[]; links: { url: string | null; label: string; active: boolean }[]; from: number; to: number; total: number; last_page: number; }
interface Props { dudis: PaginatedDudis; companies: string[]; filters: { search?: string; company?: string }; }

export default function RekapitulasiDudi({ dudis, companies, filters }: Props) {
    const [search, setSearch] = useState(filters.search || '');
    const [showFilter, setShowFilter] = useState(false);
    const filterRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const h = (e: MouseEvent) => { if (filterRef.current && !filterRef.current.contains(e.target as Node)) setShowFilter(false); };
        document.addEventListener('mousedown', h);
        return () => document.removeEventListener('mousedown', h);
    }, []);

    const applyFilter = (key: string, val: string) => {
        const f = { ...filters, [key]: val || undefined };
        router.get(route('admin.rekapitulasi-dudi'), f, { preserveState: true, replace: true });
    };

    const handleSearch = (v: string) => { setSearch(v); applyFilter('search', v); };
    const activeFilterCount = [filters.company].filter(Boolean).length;

    const handleExportPdf = () => {
        const params = new URLSearchParams();
        if (filters.search) params.append('search', filters.search);
        if (filters.company) params.append('company', filters.company);
        window.open(`${route('admin.rekapitulasi-dudi.export')}?${params.toString()}`, '_blank');
    };

    return (
        <AdminLayout title="Rekapitulasi DUDI" subtitle="Data Penempatan Siswa Berdasarkan DUDI / Tempat PKL">
            <Head title="Rekapitulasi DUDI" />

            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 flex justify-between items-center bg-slate-50/50 mb-6">
                <div>
                    <h3 className="text-sm font-bold text-slate-800 tracking-wide">Cetak Bukti Penempatan / Rekap</h3>
                    <p className="text-xs text-slate-500 mt-1">Gunakan filter tabel terlebih dahulu jika ingin men-cetak rentang tertentu.</p>
                </div>
                <button
                    onClick={handleExportPdf}
                    className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-5 py-2.5 rounded-lg text-sm font-bold transition-colors shadow-sm"
                >
                    <span className="material-symbols-outlined text-[18px]">picture_as_pdf</span>
                    Export ke PDF
                </button>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
                <div className="p-4 border-b border-slate-200 flex items-center gap-3 bg-slate-50/50">
                    <div className="relative" ref={filterRef}>
                        <button
                            onClick={() => setShowFilter(!showFilter)}
                            className={`relative flex items-center justify-center size-10 rounded-lg border transition-colors ${activeFilterCount > 0 ? 'bg-primary/10 border-primary text-primary' : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'}`}
                            title="Filter"
                        >
                            <span className="material-symbols-outlined text-xl">filter_list</span>
                            {activeFilterCount > 0 && (
                                <span className="absolute -top-1.5 -right-1.5 size-5 bg-primary text-white rounded-full text-[10px] font-bold flex items-center justify-center">{activeFilterCount}</span>
                            )}
                        </button>
                        {showFilter && (
                            <div className="absolute left-0 top-full mt-2 w-64 bg-white rounded-xl shadow-xl border border-slate-200 z-30 overflow-hidden">
                                <div className="p-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                                    <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">Filter Data</span>
                                    {activeFilterCount > 0 && (
                                        <button onClick={() => { router.get(route('admin.rekapitulasi-dudi'), { search: filters.search || undefined }, { preserveState: true, replace: true }); setShowFilter(false); }} className="text-[10px] font-bold text-red-500 hover:text-red-700 uppercase">Reset</button>
                                    )}
                                </div>
                                <div className="p-3 space-y-3">
                                    <div>
                                        <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Perusahaan</label>
                                        <select
                                            value={filters.company || ''}
                                            onChange={(e) => applyFilter('company', e.target.value)}
                                            title="Filter Perusahaan"
                                            className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs outline-none focus:ring-1 focus:ring-primary"
                                        >
                                            <option value="">Semua Perusahaan</option>
                                            {companies.map(c => <option key={c} value={c}>{c}</option>)}
                                        </select>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                    {/* Search Input */}
                    <div className="relative flex-1 max-w-sm">
                        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xl">search</span>
                        <input
                            value={search}
                            onChange={(e) => handleSearch(e.target.value)}
                            className="w-full h-10 pl-10 pr-4 bg-white border border-slate-200 rounded-lg text-xs outline-none focus:ring-1 focus:ring-primary"
                            placeholder="Cari nama perusahaan..."
                        />
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead><tr className="bg-slate-50 text-slate-600 text-[10px] font-bold uppercase tracking-wider">
                            <th className="px-6 py-4 w-10">No</th>
                            <th className="px-6 py-4 w-1/3">DUDI / Tempat PKL</th>
                            <th className="px-6 py-4 w-1/3">Siswa Ditempatkan</th>
                            <th className="px-6 py-4">Pembimbing</th>
                        </tr></thead>
                        <tbody className="divide-y divide-slate-100 border-t border-slate-200">
                            {dudis.data.map((d, index) => (
                                <tr key={d.id} className="hover:bg-slate-50/50 transition-colors align-top">
                                    <td className="px-6 py-4 text-xs text-slate-600">{dudis.from + index}</td>
                                    <td className="px-6 py-4">
                                        <div className="text-xs font-bold text-slate-800 mb-1">{d.name}</div>
                                        <div className="text-[11px] text-slate-500 leading-relaxed max-w-xs">{d.address || '-'}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="bg-slate-50 p-2.5 rounded border border-slate-100 h-full">
                                            {d.siswas.length > 0 ? (
                                                <ul className="list-disc pl-4 space-y-1">
                                                    {d.siswas.map(s => (
                                                        <li key={s.id} className="text-xs">
                                                            <span className="font-semibold text-slate-700">{s.name}</span>
                                                            <span className="text-slate-400 ml-1">({s.class})</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            ) : (
                                                <span className="text-xs italic text-slate-400">Belum ada siswa</span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="h-full">
                                            {d.pembimbings.length > 0 ? (
                                                <ul className="space-y-1.5">
                                                    {d.pembimbings.map(p => (
                                                        <li key={p.id} className="flex flex-col text-xs">
                                                            <span className="font-semibold text-slate-800">{p.name}</span>
                                                            <span className="text-slate-500">{p.phone}</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            ) : (
                                                <span className="text-xs italic text-slate-400">Belum ditentukan</span>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {dudis.data.length === 0 && <tr><td colSpan={4} className="px-6 py-10 text-center text-slate-500 text-xs">Tidak ada data yang sesuai.</td></tr>}
                        </tbody>
                    </table>
                </div>
                {dudis.last_page > 1 && (
                    <div className="p-4 border-t border-slate-200 flex items-center justify-between bg-slate-50/50">
                        <span className="text-xs text-slate-500">Menampilkan {dudis.from} - {dudis.to} dari {dudis.total}</span>
                        <div className="flex gap-1">
                            {dudis.links.map((link, i) => (
                                <button key={i} title={`Halaman ${link.label.replace(/&[^;]+;/g, '').trim()}`} disabled={!link.url} onClick={() => link.url && router.get(link.url)} className={`px-3 py-1 rounded text-xs ${link.active ? 'bg-primary text-white' : 'text-slate-600 hover:bg-slate-200'} disabled:opacity-50`} dangerouslySetInnerHTML={{ __html: link.label }} />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}
