#!/usr/bin/env node
// HOW TO RUN:
// type in cmd: node merge-ayat-cli-based.js bacaan {nomorsurat} ayat {first}-{last}
// example: node merge-ayat-cli-based.js bacaan 1 ayat 1-7

const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');
const util = require('util');
const execPromise = util.promisify(exec);

// Load surah data
const surahData = JSON.parse(fs.readFileSync('./quran_surah.json', 'utf8')).surahs;

// Parse command line arguments
const args = process.argv.slice(2).join(' ');
const match = args.match(/bacaan (\d{1,3}) ayat (\d{1,3})-(\d{1,3})/i);

if (!match) {
    console.error('\nFormat yang benar: bacaan [nomor_surat] ayat [awal]-[akhir]');
    console.error('Contoh: bacaan 1 ayat 1-7\n');
    process.exit(1);
}

const [_, surahNumber, startAyah, endAyah] = match;
const surahIndex = surahData.findIndex(s => parseInt(s.number) === parseInt(surahNumber));

if (surahIndex === -1) {
    console.error('\nNomor surat tidak valid. Masukkan nomor 1-114\n');
    process.exit(1);
}

const surah = surahData[surahIndex];
const surahNum = surah.number.padStart(3, '0');

if (parseInt(startAyah) < 1 || parseInt(endAyah) > surah.total_ayat) {
    console.error(`\nNomor ayat harus antara 1 dan ${surah.total_ayat} untuk surat ${surah.name}\n`);
    process.exit(1);
}

async function mergeAudio() {
    try {
        console.log(`\nMemproses Surat ${surah.name} (${surah.meaning}) ayat ${startAyah}-${endAyah}...`);
        
        // Create temp directory if it doesn't exist
        const tempDir = path.join(__dirname, 'temp');
        if (!fs.existsSync(tempDir)) {
            fs.mkdirSync(tempDir);
        }

        // Create list of files to merge
        const fileList = [];
        const oggDir = path.join(__dirname, 'ogg');
        
        // Check if ogg directory exists
        if (!fs.existsSync(oggDir)) {
            throw new Error('Folder "ogg" tidak ditemukan. Pastikan folder "ogg" berisi file audio Quran');
        }
        
        for (let i = parseInt(startAyah); i <= parseInt(endAyah); i++) {
            const ayahNum = i.toString().padStart(3, '0');
            const fileName = `${surahNum}${ayahNum}.ogg`;
            const filePath = path.join(oggDir, fileName);
            
            if (!fs.existsSync(filePath)) {
                throw new Error(`File tidak ditemukan: ${fileName}`);
            }
            
            fileList.push(filePath);
        }

        // Create concat file
        const concatFile = path.join(tempDir, 'concat.txt');
        const fileContent = fileList.map(f => `file '${f}'`).join('\n');
        fs.writeFileSync(concatFile, fileContent);

        // Create output directory if it doesn't exist
        const outputDir = path.join(__dirname, 'output');
        if (!fs.existsSync(outputDir)) {
            fs.mkdirSync(outputDir);
        }

        // Merge audio files using ffmpeg with OPUS codec
        const outputFile = path.join(outputDir, `surah_${surahNum}_ayat_${startAyah}-${endAyah}.ogg`);
        await execPromise(`ffmpeg -f concat -safe 0 -i "${concatFile}" -c:a libopus -b:a 48k "${outputFile}"`);

        console.log(`\nAlhamdulillah! File audio telah digabungkan:`);
        console.log(`${outputFile}\n`);

        // Cleanup temp files
        fs.unlinkSync(concatFile);

    } catch (error) {
        console.error('\nTerjadi kesalahan:', error.message);
        console.error('Pastikan:');
        console.error('1. FFmpeg terinstall di sistem dengan dukungan codec OPUS');
        console.error('2. Folder "ogg" berisi file audio Quran');
        console.error('3. Format nama file audio: SSSDDD.ogg (S=nomor surat, D=nomor ayat)\n');
    }
}

mergeAudio(); 