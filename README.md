# Quran Audio Merger & Compressor

Aplikasi CLI untuk menggabungkan dan mengkompresi file audio Al-Quran dalam format OGG OPUS.

## 🌟 Fitur / Features

- Menggabungkan ayat-ayat Al-Quran (Merge Quran verses)
- Mengkompresi file audio ke format OGG OPUS (Compress audio files to OGG OPUS)
- Mendukung 114 surat lengkap (Support all 114 surahs)
- Format CLI yang mudah digunakan (Easy-to-use CLI format)

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

### 2. File JSON / JSON Files

- `quran_surah.json`: Data informasi surat Al-Quran
  - Berisi 114 surat
  - Informasi: nomor, nama, arti, jumlah ayat

- `quran_juz.json`: Data pembagian juz Al-Quran
  - Berisi 30 juz
  - Informasi: nomor juz, surat dan ayat awal-akhir

### 3. File Konfigurasi / Configuration Files

- `package.json`: Konfigurasi proyek Node.js
  - Nama proyek: audio-merger
  - Versi: 1.0.0
  - Dependency utama: fluent-ffmpeg

- `package-lock.json`: Lock file untuk dependency
  - Memastikan versi package yang konsisten
  - Daftar lengkap semua dependency dan sub-dependency

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
├── ogg/                    # Folder sumber file audio
│   ├── 001001.ogg
│   ├── 001002.ogg
│   └── ...
├── compressed-audio/        # Folder output file terkompresi
│   ├── 001001.ogg
│   ├── 001002.ogg
│   └── ...
├── temp/                  # Folder sementara untuk proses
└── output/               # Folder output file gabungan
```

## 🎯 Cara Penggunaan / How to Use

### 1. Menggabungkan Ayat / Merging Verses

```bash
node merge-ayat-cli-based.js bacaan {nomorsurat} ayat {first}-{last}
```
Example:
```bash
node merge-ayat-cli-based.js bacaan 1 ayat 1-7
```
Output: `output/surah_001_ayat_1-7.ogg`

### 2. Mengkompresi File / Compressing Files

```bash
node compress.js "{direktori-file}"
```
Output akan disimpan di folder `compressed-audio`

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
  - `001.ogg` = Surah Al-Fatihah (001)
  - `01.ogg` = Juz 1 (01)

## ⚠️ Catatan Penting / Important Notes

1. Pastikan FFmpeg terinstall dengan dukungan codec OPUS
2. File audio sumber harus dalam format OGG
3. Penamaan file harus sesuai format (SSSDDD.ogg)
4. Bitrate default kompresi: 15kbps (bisa diubah di compress.js)
5. Sample rate: 48kHz (optimal untuk codec OPUS)

## 🤝 Kontribusi / Contributing

Silakan buat pull request untuk kontribusi.
Feel free to make pull requests for contributions.
