# Quran Audio Merger & Compressor

Aplikasi CLI untuk menggabungkan dan mengkompresi file audio Al-Quran dalam format OGG OPUS.

## 🌟 Fitur / Features

- Menggabungkan ayat-ayat Al-Quran (Merge Quran verses)
- Mengkompresi file audio ke format OGG OPUS (Compress audio files to OGG OPUS)
- Mendukung 114 surat lengkap (Support all 114 surahs)
- Format CLI yang mudah digunakan (Easy-to-use CLI format)
- Utilitas kompresi batch untuk file besar (Batch compression utility for large files)
- Utilitas penggabungan per surah dan per juz (Merge utility for surah and juz)
- Penggabungan otomatis semua surah (Automatic merging of all surahs)

## 📋 Persyaratan / Requirements

- Node.js (versi 18 atau lebih tinggi / version 18 or higher)
- FFmpeg dengan dukungan codec OPUS / FFmpeg with OPUS codec support
- NPM atau Yarn / NPM or Yarn

## 🛠️ Instalasi / Installation

1. Clone repository ini / Clone this repository
2. Install dependencies:
```bash
npm install
```

## 📁 Struktur File / File Structure

### 1. File JavaScript / JavaScript Files

- `merge-ayat-cli-based.js`: Script utama untuk menggabungkan ayat-ayat Al-Quran
  - Format perintah: `node merge-ayat-cli-based.js bacaan [nomor_surat] ayat [awal]-[akhir]`
  - Contoh: `node merge-ayat-cli-based.js bacaan 1 ayat 1-7`

- `compress.js`: Modul untuk mengkompresi file audio ke format OGG OPUS
  - Menggunakan library fluent-ffmpeg
  - Mendukung konfigurasi bitrate (default: 15kbps)
  - Mengoptimalkan kualitas audio dengan sample rate 48kHz

### 2. Utilitas Kompresi / Compression Utilities

Folder `compress-utility/` berisi tools tambahan untuk kompresi:
- `compress-all.js`: Script untuk mengkompresi semua file dalam satu folder
- `compress-large-files`: Utilitas khusus untuk mengkompresi file berukuran besar

### 3. Utilitas Penggabungan / Merge Utilities

Folder `merge-utility/` berisi tools untuk penggabungan file audio:
- `mergeSurah.js`: Script untuk menggabungkan semua ayat dalam satu surah
- `merge-audio-per-juz.js`: Script untuk menggabungkan ayat-ayat dalam satu juz
- `merge-audio-per-surah.js`: Script untuk menggabungkan ayat-ayat semua surah secara otomatis

### 4. File JSON / JSON Files

- `quran_surah.json`: Data informasi surat Al-Quran
  - Berisi 114 surat
  - Informasi: nomor, nama, arti, jumlah ayat

- `quran_juz.json`: Data pembagian juz Al-Quran
  - Berisi 30 juz
  - Informasi: nomor juz, surat dan ayat awal-akhir

### 5. File Konfigurasi / Configuration Files

- `package.json`: Konfigurasi proyek Node.js
  - Nama proyek: audio-merger
  - Versi: 1.0.0
  - Dependency utama: fluent-ffmpeg

- `package-lock.json`: Lock file untuk dependency
  - Memastikan versi package yang konsisten
  - Daftar lengkap semua dependency dan sub-dependency

- `.gitignore`: Konfigurasi file/folder yang diabaikan Git
  - Mengabaikan folder audio (ogg, compressed-audio, audio-per-surah, audio-per-juz)
  - Mengabaikan dependencies (node_modules)
  - Mengabaikan file temporary dan sistem

## 📂 Struktur Folder / Folder Structure

```
project_folder/
├── merge-ayat-cli-based.js
├── compress.js
├── package.json
├── package-lock.json
├── quran_surah.json
├── quran_juz.json
├── README.md
├── .gitignore
├── compress-utility/
│   ├── compress-all.js
│   └── compress-large-files
├── merge-utility/
│   ├── merge-audio-per-juz.js
│   └── merge-audio-per-surah.js
├── ogg/                    # Folder sumber file audio
│   ├── 001001.ogg
│   ├── 001002.ogg
│   └── ...
├── compressed-audio/       # Folder output file terkompresi
│   ├── 001001.ogg
│   ├── 001002.ogg
│   └── ...
├── audio-per-surah/       # Folder output file per surah
│   ├── surah_001.ogg
│   ├── surah_002.ogg
│   └── ...
├── audio-per-juz/         # Folder output file per juz
│   ├── juz_01.ogg
│   ├── juz_02.ogg
│   └── ...
├── temp/                  # Folder sementara untuk proses
└── output/               # Folder output file gabungan
```

## 🎯 Cara Penggunaan / How to Use

### 1. Menggabungkan Ayat / Merging Verses

#### Penggabungan Ayat Tertentu / Merge Specific Verses
```bash
node merge-ayat-cli-based.js bacaan {nomorsurat} ayat {first}-{last}
```
Example:
```bash
node merge-ayat-cli-based.js bacaan 1 ayat 1-7
```

#### Penggabungan Semua Surah / Merge All Surahs (Dari seluruh file di folder ogg)
```bash
node merge-utility/merge-audio-per-surah.js
```
Output akan disimpan di folder `audio-per-surah` dengan format `001.ogg`, `002.ogg`, dst.

#### Penggabungan Per Juz / Merge By Juz (Dari seluruh file di folder ogg)
```bash
node merge-utility/merge-audio-per-juz.js
```
Example:
```bash
node merge-utility/merge-audio-per-juz.js
```

Output akan disimpan di folder sesuai dengan jenis penggabungan yang dilakukan:
- File per ayat custom: folder `output`
- File per surah: folder `audio-per-surah`
- File per juz: folder `audio-per-juz`

### 2. Mengkompresi File / Compressing Files

#### Kompresi File Tunggal / Single File Compression
```bash
node compress.js "{direktori-file}"
```
Example:
```bash
node compress.js "ogg\01.ogg"
```

#### Kompresi Batch / Batch Compression
```bash
node compress-utility/compress-all.js "{direktori-sumber}" "{direktori-output}"
```

Output akan disimpan di folder `compressed-audio` atau direktori output yang ditentukan

## 📝 Format Penamaan File / File Naming Format

- Format Untuk File per Juz: `JJ.ogg`
  - JJ: Nomor juz (2 digit)
- Format Untuk File per Surah: `SSS.ogg`
  - SSS: Nomor surah (3 digit)
- Format Untuk File per Ayat: `SSSDDD.ogg`
  - SSS: Nomor surat (3 digit)
  - DDD: Nomor ayat (3 digit)
- Contoh:
  - `001001.ogg` = Surat Al-Fatihah (001) Ayat 1 (001)
  - `001.ogg` = Surah Al-Fatihah lengkap (001)
  - `01.ogg` = Juz 1 (01)

## ⚠️ Catatan Penting / Important Notes

1. Pastikan FFmpeg terinstall dengan dukungan codec OPUS
2. File audio sumber harus dalam format OGG
3. Penamaan file harus sesuai format (SSSDDD.ogg)
4. Bitrate default kompresi: 15kbps (bisa diubah di compress.js)
5. Sample rate: 48kHz (optimal untuk codec OPUS)
6. Untuk file berukuran besar, gunakan utilitas di folder compress-utility
7. Untuk menggabungkan satu surah lengkap atau satu juz, gunakan utilitas di folder merge-utility
8. Hasil penggabungan akan tersimpan di folder yang sesuai (output, audio-per-surah, audio-per-juz)
9. Folder audio dan dependencies tidak akan masuk ke dalam Git repository

## 🤝 Kontribusi / Contributing

Silakan buat pull request untuk kontribusi.
Feel free to make pull requests for contributions.
