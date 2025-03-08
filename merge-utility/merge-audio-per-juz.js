const fs = require('fs');
const { exec } = require('child_process');
const path = require('path');
const util = require('util');
const execPromise = util.promisify(exec);

// Baca file JSON
const juzData = require('../quran_juz.json');
const surahData = require('../quran_surah.json');

// Buat mapping untuk jumlah ayat per surat
const surahVerseCount = {};
surahData.surahs.forEach(surah => {
    surahVerseCount[parseInt(surah.number)] = surah.total_ayat;
});

// Konfigurasi path
const config = {
    // Folder input berisi file ogg
    audioInputDir: path.join(__dirname, '../ogg'),
    // Folder output untuk hasil merge
    audioOutputDir: path.join(__dirname, '../audio-per-juz'),
    // Format dan codec yang digunakan
    audioFormat: 'ogg',
    audioCodec: 'libopus'
};

// Pastikan folder output ada
if (!fs.existsSync(config.audioOutputDir)) {
    fs.mkdirSync(config.audioOutputDir, { recursive: true });
}

// Pastikan folder input ada
if (!fs.existsSync(config.audioInputDir)) {
    console.error(`❌ Error: Folder input "${config.audioInputDir}" tidak ditemukan!`);
    process.exit(1);
}

/**
 * Generate nama file audio berdasarkan nomor surat dan ayat
 * @param {string} surahNumber - Nomor surat dalam format 3 digit
 * @param {number} ayatNumber - Nomor ayat
 * @returns {string} Nama file audio
 */
function getAudioFileName(surahNumber, ayatNumber) {
    // Format: 001002.ogg (untuk Al-Baqarah ayat 2)
    return `${surahNumber}${ayatNumber.toString().padStart(3, '0')}.${config.audioFormat}`;
}

/**
 * Membuat file temporary berisi daftar file audio yang akan digabung
 * @param {Array} fileList - Daftar file audio yang akan digabung
 * @returns {string} Path ke file temporary
 */
async function createFileList(fileList) {
    const tempFile = path.join(config.audioOutputDir, `temp_${Date.now()}.txt`);
    // Gunakan path absolut untuk file list
    const content = fileList.map(file => `file '${file.replace(/\\/g, '/')}'`).join('\n');
    fs.writeFileSync(tempFile, content);
    return tempFile;
}

/**
 * Mendapatkan daftar file audio untuk satu juz
 * @param {Object} juzInfo - Informasi juz dari quran_juz.json
 * @returns {Array} Daftar file audio yang perlu digabung
 */
function getAudioFilesForJuz(juzInfo) {
    const files = [];
    const start = {
        surah: parseInt(juzInfo.start.surah),
        ayat: juzInfo.start.ayat
    };
    const end = {
        surah: parseInt(juzInfo.end.surah),
        ayat: juzInfo.end.ayat
    };

    console.log(`🔍 Mencari file audio untuk Juz ${juzInfo.number} (Surat ${start.surah}:${start.ayat} - ${end.surah}:${end.ayat})`);

    for (let surah = start.surah; surah <= end.surah; surah++) {
        const surahNumber = surah.toString().padStart(3, '0');
        const startAyat = surah === start.surah ? start.ayat : 1;
        const maxAyat = surahVerseCount[surah] || 286; // Fallback ke 286 jika tidak ditemukan
        const endAyat = surah === end.surah ? end.ayat : maxAyat;

        // Selalu gunakan file per ayat
        console.log(`🔍 Mencari ayat ${startAyat}-${endAyat} dari surat ${surahNumber}`);
        for (let ayat = startAyat; ayat <= endAyat; ayat++) {
            const fileName = getAudioFileName(surahNumber, ayat);
            const audioFile = path.join(config.audioInputDir, fileName);
            if (fs.existsSync(audioFile)) {
                files.push(audioFile);
            } else {
                console.warn(`⚠️ Warning: File tidak ditemukan: ${fileName}`);
            }
        }
    }

    console.log(`📝 Total file yang ditemukan: ${files.length}`);
    return files;
}

/**
 * Melakukan merge audio untuk satu juz
 * @param {Object} juzInfo - Informasi juz dari quran_juz.json
 */
async function mergeJuzAudio(juzInfo) {
    try {
        console.log(`\n🎵 Memulai proses merge Juz ${juzInfo.number}...`);
        
        // Dapatkan daftar file audio
        const audioFiles = getAudioFilesForJuz(juzInfo);
        if (audioFiles.length === 0) {
            throw new Error('Tidak ada file audio yang ditemukan');
        }

        // Buat file temporary berisi daftar file
        const fileList = await createFileList(audioFiles);
        
        // Nama file output
        const outputFile = path.join(config.audioOutputDir, `${juzInfo.number.toString().padStart(2, '0')}.${config.audioFormat}`);
        
        // Command untuk ffmpeg dengan codec OPUS (versi sederhana)
        const command = `ffmpeg -f concat -safe 0 -i "${fileList}" -c:a libopus "${outputFile}" -y`;
        
        console.log('⚙️ Menjalankan ffmpeg...');
        
        // Jalankan command
        await execPromise(command);
        
        // Hapus file temporary
        fs.unlinkSync(fileList);
        
        console.log(`✅ Juz ${juzInfo.number} berhasil di-merge: ${path.basename(outputFile)}`);
    } catch (error) {
        console.error(`❌ Error saat merge Juz ${juzInfo.number}:`, error.message);
    }
}

/**
 * Fungsi utama untuk memproses semua juz
 */
async function processAllJuz() {
    console.log('🎵 Memulai proses merge audio Al-Quran per juz...');
    console.log(`📂 Folder input: ${config.audioInputDir}`);
    console.log(`📂 Folder output: ${config.audioOutputDir}\n`);
    
    // Proses setiap juz secara berurutan
    for (const juz of juzData.juz) {
        await mergeJuzAudio(juz);
    }
    
    console.log('\n✨ Proses merge audio selesai!');
}

// Jalankan program
processAllJuz().catch(error => {
    console.error('Error:', error);
    process.exit(1);
}); 