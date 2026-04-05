<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Rekapitulasi Penempatan DUDI PKL</title>
    <style>
        @page {
            size: A4 portrait;
            margin: 0.3mm 0.3mm 0.4mm 0.3mm;
        }
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: 'Times New Roman', Times, serif;
            font-size: 9pt;
            color: #1a1a1a;
            padding: 5mm;
        }

        /* === KOP / HEADER === */
        .kop {
            text-align: center;
            border-bottom: 2px solid #222;
            padding-bottom: 5px;
            margin-bottom: 10px;
        }
        .kop h1 {
            font-size: 14pt;
            font-weight: bold;
            letter-spacing: 1.5px;
            text-transform: uppercase;
            margin-bottom: 3px;
        }
        .kop p {
            font-size: 10pt;
            color: #333;
        }

        /* === IDENTITAS & PERIODE === */
        .periode-info {
            margin-bottom: 15px;
            font-size: 9pt;
            font-weight: bold;
            text-align: center;
        }

        /* === TABEL DATA === */
        .data-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 15px;
        }
        .data-table th {
            background-color: #f0f0f0;
            color: #000;
            font-size: 9pt;
            font-weight: bold;
            text-align: left;
            padding: 6px 4px;
            border: 1px solid #000;
        }
        .data-table th.center { text-align: center; }
        .data-table td {
            font-size: 9pt;
            padding: 5px 4px;
            border: 1px solid #000;
            vertical-align: top;
        }
        
        /* col widths */
        .col-no { width: 30px; text-align: center; }
        .col-dudi { width: 150px; }
        .col-siswa { width: 200px; }
        .col-pembimbing { width: auto; }

        .list-items {
            list-style-type: none;
            padding: 0;
            margin: 0;
        }
        .list-items li {
            margin-bottom: 4px;
            padding-bottom: 4px;
            border-bottom: 1px dashed #ccc;
        }
        .list-items li:last-child {
            margin-bottom: 0;
            padding-bottom: 0;
            border-bottom: none;
        }
        
        .dudi-title {
            font-weight: bold;
            font-size: 10pt;
            margin-bottom: 2px;
        }

        /* === FOOTER === */
        .footer {
            margin-top: 20px;
        }
        .footer table {
            width: 100%;
            border-collapse: collapse;
        }
        .footer td {
            vertical-align: top;
            font-size: 9pt;
        }
        .ttd {
            text-align: center;
            padding-top: 10px;
        }
        .ttd .line {
            margin-top: 50px;
            border-bottom: 1px solid #000;
            width: 150px;
            display: inline-block;
        }
    </style>
</head>
<body>
    <div class="kop">
        <h1>Rekapitulasi Penempatan DUDI</h1>
        <p>Praktik Kerja Lapangan (PKL)</p>
    </div>

    <div class="periode-info">
        Periode Cetak: {{ \Carbon\Carbon::parse($startDate)->translatedFormat('d F Y') }} — {{ \Carbon\Carbon::parse($endDate)->translatedFormat('d F Y') }}
    </div>

    <table class="data-table">
        <thead>
            <tr>
                <th class="col-no center">No</th>
                <th class="col-dudi">Nama DUDI / Alamat</th>
                <th class="col-siswa">Siswa Ditempatkan</th>
                <th class="col-pembimbing">Pembimbing PKL</th>
            </tr>
        </thead>
        <tbody>
            @forelse($dudis as $i => $dudi)
            <tr>
                <td class="col-no center">{{ $i + 1 }}</td>
                <td class="col-dudi">
                    <div class="dudi-title">{{ $dudi->name }}</div>
                    <div style="font-size: 8pt; color: #444;">{{ $dudi->address ?: '-' }}</div>
                </td>
                <td class="col-siswa">
                    @if($dudi->siswas->count() > 0)
                    <ul class="list-items">
                        @foreach($dudi->siswas as $siswa)
                        <li>
                            <strong>{{ $siswa->name }}</strong><br>
                            <span style="font-size: 8pt; color:#666;">Kelas: {{ $siswa->class }} | NISN: {{ $siswa->nisn }}</span>
                        </li>
                        @endforeach
                    </ul>
                    @else
                    <span style="font-style: italic; color: #777;">Belum ada siswa</span>
                    @endif
                </td>
                <td class="col-pembimbing">
                    @if($dudi->pembimbings->count() > 0)
                    <ul class="list-items">
                        @foreach($dudi->pembimbings as $pembimbing)
                        <li>
                            <strong>{{ $pembimbing->name }}</strong><br>
                            <span style="font-size: 8pt; color:#666;">NIP: {{ $pembimbing->nip ?: '-' }} | Telp: {{ $pembimbing->phone ?: '-' }}</span>
                        </li>
                        @endforeach
                    </ul>
                    @else
                    <span style="font-style: italic; color: #777;">Belum ditentukan</span>
                    @endif
                </td>
            </tr>
            @empty
            <tr>
                <td colspan="4" style="text-align:center; padding:15px; color:#555;">Tidak ada data DUDI yang terdaftar atau memiliki siswa PKL.</td>
            </tr>
            @endforelse
        </tbody>
    </table>

    <div class="footer">
        <table>
            <tr>
                <td style="width:60%;">
                    <i style="font-size:8pt; color:#555;">Dokumen digenerate oleh sistem pada {{ now()->translatedFormat('d F Y, H:i') }} WIB</i>
                </td>
                <td style="width:40%;">
                    <div class="ttd">
                        <div>Mengetahui,</div>
                        <div style="font-size:8pt; color:#333;">Admin / Koordinator PKL</div>
                        <div class="line"></div>
                    </div>
                </td>
            </tr>
        </table>
    </div>
</body>
</html>
