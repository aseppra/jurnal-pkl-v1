import AdminLayout from '@/Layouts/AdminLayout';
import { Head, useForm } from '@inertiajs/react';
import React, { useRef, useState } from 'react';

export default function ImportData() {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { data, setData, post, processing, errors, reset } = useForm<{ file: File | null }>({
        file: null,
    });
    
    const [dragActive, setDragActive] = useState(false);

    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === 'dragenter' || e.type === 'dragover') {
            setDragActive(true);
        } else if (e.type === 'dragleave') {
            setDragActive(false);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFile(e.dataTransfer.files[0]);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        if (e.target.files && e.target.files[0]) {
            handleFile(e.target.files[0]);
        }
    };

    const handleFile = (file: File) => {
        const ext = file.name.split('.').pop()?.toLowerCase();
        if (ext === 'xlsx' || ext === 'xls') {
            setData('file', file);
        } else {
            alert('Format file tidak didukung. Harap gunakan file .xlsx atau .xls');
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!data.file) return;

        post(route('admin.import-data.store'), {
            onSuccess: () => reset('file'),
        });
    };

    return (
        <AdminLayout title="Import Data Master" subtitle="Upload data Siswa, DUDI, dan Pembimbing sekaligus">
            <Head title="Import Data" />

            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
                <div className="p-6 md:p-8 border-b border-slate-200 bg-slate-50/50">
                    <div className="flex flex-col md:flex-row gap-6 md:items-center justify-between">
                        <div>
                            <h3 className="text-lg font-bold text-slate-800 mb-1">Import Data dari Excel</h3>
                            <p className="text-sm text-slate-500 max-w-xl">
                                Gunakan fitur ini untuk memasukkan banyak data sekaligus. Download template terlebih dahulu, isi data sesuai format yang disediakan pada masing-masing sheet, lalu upload kembali file tersebut ke sini.
                            </p>
                        </div>
                        <a 
                            href={route('admin.import-data.template')}
                            className="inline-flex items-center justify-center gap-2 bg-emerald-50 text-emerald-600 hover:bg-emerald-100 px-5 py-3 rounded-xl font-semibold transition-colors shrink-0 border border-emerald-200"
                        >
                            <span className="material-symbols-outlined">download</span>
                            Download Template
                        </a>
                    </div>
                </div>

                <div className="p-6 md:p-8">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Drag and drop zone */}
                        <div 
                            className={`relative border-2 border-dashed rounded-2xl py-14 px-10 text-center transition-colors ${
                                dragActive ? 'border-primary bg-primary/5' : 
                                data.file ? 'border-emerald-500 bg-emerald-50/30' : 
                                'border-slate-300 hover:border-primary/50 bg-slate-50 hover:bg-slate-50/80 cursor-pointer'
                            }`}
                            onDragEnter={handleDrag}
                            onDragLeave={handleDrag}
                            onDragOver={handleDrag}
                            onDrop={handleDrop}
                            onClick={() => !data.file && fileInputRef.current?.click()}
                        >
                            <input 
                                ref={fileInputRef}
                                type="file" 
                                className="hidden" 
                                accept=".xlsx,.xls"
                                onChange={handleChange} 
                            />

                            {!data.file ? (
                                <div className="pointer-events-none mt-4">
                                    <div className="w-16 h-16 bg-white shadow-sm border border-slate-200 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
                                        <span className="material-symbols-outlined text-3xl">upload_file</span>
                                    </div>
                                    <h4 className="text-base font-bold text-slate-700 mb-1">Pilih atau seret file ke sini</h4>
                                    <p className="text-sm text-slate-500">Mendukung format .xlsx dan .xls (Maks. 5MB)</p>
                                </div>
                            ) : (
                                <div className="flex flex-col items-center">
                                    <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <span className="material-symbols-outlined text-3xl">task</span>
                                    </div>
                                    <h4 className="text-base font-bold text-slate-800 mb-1">{data.file.name}</h4>
                                    <p className="text-sm text-slate-500 mb-4">{(data.file.size / 1024 / 1024).toFixed(2)} MB</p>
                                    
                                    <button 
                                        type="button"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            reset('file');
                                        }}
                                        className="text-sm font-semibold text-red-500 hover:text-red-700 px-4 py-2 hover:bg-red-50 rounded-lg transition-colors border border-transparent hover:border-red-100"
                                    >
                                        Hapus File
                                    </button>
                                </div>
                            )}
                        </div>

                        {errors.file && (
                            <div className="p-4 bg-red-50 text-red-600 rounded-xl text-sm border border-red-100 flex items-start gap-2">
                                <span className="material-symbols-outlined text-red-500 text-[20px] shrink-0">error</span>
                                {errors.file}
                            </div>
                        )}

                        <div className="flex justify-end pt-4 border-t border-slate-200">
                            <button 
                                type="submit" 
                                disabled={!data.file || processing}
                                className="bg-primary hover:bg-primary/90 text-white px-8 py-3 rounded-xl font-bold flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
                            >
                                {processing ? (
                                    <>
                                        <span className="material-symbols-outlined animate-spin text-[20px]">progress_activity</span>
                                        Mengimport Data...
                                    </>
                                ) : (
                                    <>
                                        <span className="material-symbols-outlined text-[20px]">cloud_upload</span>
                                        Mulai Import
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
                
                {/* Guidelines */}
                <div className="bg-blue-50/50 p-6 md:p-8 border-t border-blue-100">
                    <h4 className="font-bold text-slate-800 mb-3 flex items-center gap-2">
                        <span className="material-symbols-outlined text-blue-500">info</span>
                        Petunjuk Import Data
                    </h4>
                    <ul className="text-sm text-slate-600 space-y-2 list-disc pl-5">
                        <li>Data yang diimport akan ditambahkan ke database.</li>
                        <li>Pastikan nama sheet tidak diubah (Siswa, DUDI, Pembimbing).</li>
                        <li>Sistem otomatis melewati data jika <b>NISN</b> (siswa), <b>Nama DUDI</b>, atau <b>NIP/NUPTK</b> (pembimbing) sudah ada.</li>
                        <li>Akun login untuk Pembimbing baru akan otomatis dibuat dengan password default <code className="bg-white px-1.5 py-0.5 rounded border border-slate-200 font-mono text-slate-800">12345678</code>.</li>
                        <li>Untuk data <b>Siswa</b>, info akun hanya diproses datanya saja. Silakan buat akun login (username/password) menggunakan tombol <b>Generate Semua Akun</b> di menu Data Siswa setelah import selesai.</li>
                    </ul>
                </div>
            </div>
        </AdminLayout>
    );
}
