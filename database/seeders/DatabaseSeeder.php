<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Dudi;
use App\Models\Pembimbing;
use App\Models\Siswa;
use App\Models\Journal;
use App\Models\Attendance;
use App\Models\Notification;
use App\Models\HelpRequest;
use App\Models\Setting;
use App\Models\Kelas;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Carbon\Carbon;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // === DEFAULT KELAS ===
        Kelas::create(['name' => 'XI - TKJ', 'description' => 'Teknik Komputer & Jaringan']);
        Kelas::create(['name' => 'XI - TP', 'description' => 'Teknik Pemesinan']);
        Kelas::create(['name' => 'XI - TKR', 'description' => 'Teknik Kendaraan Ringan']);
        Kelas::create(['name' => 'XI - TKL', 'description' => 'Teknik Ketenagalistrikan']);
        Kelas::create(['name' => 'XI - TKP', 'description' => 'Teknik Konstruksi & Properti']);
        Kelas::create(['name' => 'XI - DPIB', 'description' => 'Desain Pemodelan & Informasi Bangunan']);
        Kelas::create(['name' => 'XII RPL 1', 'description' => 'Rekayasa Perangkat Lunak']);
        Kelas::create(['name' => 'XII RPL 2', 'description' => 'Rekayasa Perangkat Lunak']);
        Kelas::create(['name' => 'XII TKJ 2', 'description' => 'Teknik Komputer & Jaringan']);
        Kelas::create(['name' => 'XII MM 3', 'description' => 'Multimedia']);

        // === ADMIN USER ===
        $admin = User::create([
            'name' => 'Administrator',
            'username' => 'admin',
            'email' => 'admin@jurnal.com',
            'role' => 'admin',
            'password' => Hash::make('admin'),
        ]);

        // === DUDIS (Companies) ===
        $dudi1 = Dudi::create(['name' => 'PT. Teknologi Jaya Makmur', 'address' => 'Jl. Sudirman No. 123, Jakarta', 'contact' => '021-5551234']);
        $dudi2 = Dudi::create(['name' => 'CV. Kreatif Solusi Visual', 'address' => 'Jl. Merdeka Barat No. 45, Bandung', 'contact' => '022-7778899']);
        $dudi3 = Dudi::create(['name' => 'Dinas Komunikasi & Informatika', 'address' => 'Komp. Pemda Gedung B, Surabaya', 'contact' => '031-4445566']);

        // === PEMBIMBINGS (Teachers) ===
        $pembimbingUser1 = User::create(['name' => 'Budi Santoso, S.Pd.', 'username' => 'pembimbing1', 'email' => 'budi.spd@jurnalpkl.test', 'role' => 'pembimbing', 'password' => Hash::make('password')]);
        $pembimbing1 = Pembimbing::create(['user_id' => $pembimbingUser1->id, 'nip' => '198501012010011001', 'name' => 'Budi Santoso, S.Pd.', 'phone' => '081234567890', 'department' => 'Teknik Komputer & Jaringan']);

        $pembimbingUser2 = User::create(['name' => 'Siti Aminah, M.Kom.', 'username' => 'pembimbing2', 'email' => 'siti.mkom@jurnalpkl.test', 'role' => 'pembimbing', 'password' => Hash::make('password')]);
        $pembimbing2 = Pembimbing::create(['user_id' => $pembimbingUser2->id, 'nip' => '198805122015032005', 'name' => 'Siti Aminah, M.Kom.', 'phone' => '085678901234', 'department' => 'Rekayasa Perangkat Lunak']);

        $pembimbingUser3 = User::create(['name' => 'Andi Wijaya, S.T.', 'username' => 'pembimbing3', 'email' => 'andi.st@jurnalpkl.test', 'role' => 'pembimbing', 'password' => Hash::make('password')]);
        $pembimbing3 = Pembimbing::create(['user_id' => $pembimbingUser3->id, 'nip' => '199011202020121002', 'name' => 'Andi Wijaya, S.T.', 'phone' => '081398765432', 'department' => 'Multimedia']);

        // === SISWAS (Students) ===
        $students = [
            ['nisn' => '2021001', 'name' => 'Budi Santoso', 'class' => 'XII RPL 1', 'dudi_id' => $dudi1->id, 'pembimbing_id' => $pembimbing2->id],
            ['nisn' => '2021042', 'name' => 'Siti Aminah', 'class' => 'XII TKJ 2', 'dudi_id' => $dudi2->id, 'pembimbing_id' => $pembimbing1->id],
            ['nisn' => '2021088', 'name' => 'Andi Wijaya', 'class' => 'XII RPL 1', 'dudi_id' => $dudi3->id, 'pembimbing_id' => $pembimbing2->id],
            ['nisn' => '2021102', 'name' => 'Rina Putri', 'class' => 'XII MM 3', 'dudi_id' => $dudi1->id, 'pembimbing_id' => $pembimbing3->id],
            ['nisn' => '2021156', 'name' => 'Maulana Kurnia', 'class' => 'XII RPL 2', 'dudi_id' => $dudi2->id, 'pembimbing_id' => $pembimbing1->id],
        ];

        $pklStart = Carbon::create(2024, 1, 1);
        $pklEnd = Carbon::create(2024, 3, 31);

        foreach ($students as $studentData) {
            $password = \Illuminate\Support\Str::random(6);
            $user = User::create([
                'name' => $studentData['name'],
                'username' => $studentData['nisn'],
                'email' => strtolower(str_replace(' ', '.', $studentData['name'])) . '@student.sch.id',
                'role' => 'siswa',
                'password' => Hash::make($password),
            ]);

            $siswa = Siswa::create([
                'user_id' => $user->id,
                'password_plain' => $password,
                'nisn' => $studentData['nisn'],
                'name' => $studentData['name'],
                'class' => $studentData['class'],
                'dudi_id' => $studentData['dudi_id'],
                'pembimbing_id' => $studentData['pembimbing_id'],
                'pkl_start' => $pklStart,
                'pkl_end' => $pklEnd,
            ]);

            // Create journals for first student with demo data
            if ($studentData['nisn'] === '2021001') {
                $journals = [
                    ['date' => '2024-10-11', 'title' => 'Optimasi Database MySQL', 'description' => 'Melakukan indexing pada tabel transaksi untuk mempercepat query pencarian data bulanan.', 'status' => 'verified'],
                    ['date' => '2024-10-10', 'title' => 'Slicing UI Dashboard Admin', 'description' => 'Mengubah desain Figma menjadi kode HTML & CSS menggunakan framework Tailwind CSS.', 'status' => 'verified'],
                    ['date' => '2024-10-09', 'title' => 'Testing API Endpoint', 'description' => 'Melakukan unit testing pada modul autentikasi menggunakan Postman dan Jest.', 'status' => 'pending'],
                    ['date' => '2024-10-08', 'title' => 'Bug Fixing Auth Flow', 'description' => 'Memperbaiki masalah redirect setelah login pada browser Safari.', 'status' => 'verified'],
                    ['date' => '2024-10-07', 'title' => 'Daily Standup & Planning', 'description' => 'Mengikuti meeting harian untuk membahas progres sprint minggu ini.', 'status' => 'verified'],
                ];

                foreach ($journals as $journal) {
                    Journal::create([
                        'siswa_id' => $siswa->id,
                        'date' => $journal['date'],
                        'title' => $journal['title'],
                        'description' => $journal['description'],
                        'status' => $journal['status'],
                        'verified_by' => $journal['status'] === 'verified' ? $pembimbingUser2->id : null,
                        'verified_at' => $journal['status'] === 'verified' ? now() : null,
                    ]);
                }

                // Notifications for first student
                Notification::create(['user_id' => $user->id, 'title' => 'Jurnal Terverifikasi', 'message' => 'Jurnal harian Anda tanggal 10 Maret 2026 telah diverifikasi oleh pembimbing.', 'type' => 'success']);
                Notification::create(['user_id' => $user->id, 'title' => 'Pengingat Presensi', 'message' => 'Jangan lupa untuk melakukan check-out sebelum pukul 17:00 WIB.', 'type' => 'info']);
                Notification::create(['user_id' => $user->id, 'title' => 'Revisi Jurnal', 'message' => 'Jurnal tanggal 08 Maret perlu diperbaiki pada bagian deskripsi kegiatan.', 'type' => 'warning']);
                Notification::create(['user_id' => $user->id, 'title' => 'Pengumuman PKL', 'message' => 'Mohon segera mengumpulkan berkas laporan bulanan paling lambat akhir minggu ini.', 'type' => 'info']);
            }

            // Create attendance records for each student (last 5 weekdays)
            $today = Carbon::today();
            $checkIns = ['07:30', '07:45', '08:02', '08:00', '07:55'];
            $checkOuts = ['17:00', '17:05', null, '17:00', '16:50'];
            $weekdayCount = 0;
            $dayOffset = 0;

            while ($weekdayCount < 5) {
                $date = $today->copy()->subDays($dayOffset);
                $dayOffset++;

                if ($date->isWeekend()) continue;

                $status = 'hadir';
                if ($weekdayCount === 4) $status = 'izin';
                if ($studentData['nisn'] === '2021088' && $weekdayCount === 0) $status = 'terlambat';
                if ($studentData['nisn'] === '2021102' && $weekdayCount === 0) $status = 'alpha';
                if ($studentData['nisn'] === '2021156' && $weekdayCount === 0) $status = 'izin';

                Attendance::create([
                    'siswa_id' => $siswa->id,
                    'date' => $date->format('Y-m-d'),
                    'check_in' => $status !== 'izin' && $status !== 'alpha' ? ($checkIns[$weekdayCount] ?? '08:00') : null,
                    'check_out' => $status !== 'izin' && $status !== 'alpha' ? ($checkOuts[$weekdayCount] ?? null) : null,
                    'status' => $status,
                    'location' => $status !== 'izin' && $status !== 'alpha' ? $studentData['name'] . ' Location' : null,
                    'notes' => $status === 'izin' ? 'Sakit' : null,
                ]);

                $weekdayCount++;
            }
        }

        // === HELP REQUESTS ===
        HelpRequest::create(['name' => 'Budi Santoso', 'contact' => 'budi.santoso@student.sch.id', 'type' => 'email', 'status' => 'pending']);
        HelpRequest::create(['name' => 'Siti Aminah', 'contact' => '081234567890', 'type' => 'whatsapp', 'status' => 'pending']);
        HelpRequest::create(['name' => 'Andi Wijaya', 'contact' => 'andi.w@gmail.com', 'type' => 'email', 'status' => 'processed']);

        // === PKL PERIOD SETTINGS ===
        Setting::setValue('pkl_start', '2026-01-06');
        Setting::setValue('pkl_end', '2026-06-30');
    }
}
