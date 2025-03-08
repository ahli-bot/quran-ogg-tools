// This script is used for compressing the large files in the ogg folder

const fs = require('fs');
const path = require('path');
const { compressAudio } = require('../compress');

const SIZE_THRESHOLD = 16 * 1024 * 1024; // 16MB in bytes

/**
 * Check if file needs compression (size > 16MB)
 * @param {string} filePath - Path to the audio file
 * @returns {boolean} - True if file needs compression
 */
function needsCompression(filePath) {
    const stats = fs.statSync(filePath);
    return stats.size > SIZE_THRESHOLD;
}

/**
 * Process a single file or directory
 * @param {string} inputPath - Path to input file or directory
 * @param {string} outputDir - Directory for compressed files
 */
async function processPath(inputPath, outputDir) {
    const stats = fs.statSync(inputPath);

    if (stats.isDirectory()) {
        // Process all files in directory
        const files = fs.readdirSync(inputPath)
            .filter(file => file.match(/^\d{6}\.ogg$/))
            .sort((a, b) => {
                const numA = parseInt(a.substring(0, 6));
                const numB = parseInt(b.substring(0, 6));
                return numA - numB;
            });

        console.log(`Ditemukan ${files.length} file untuk diproses\n`);

        let processed = 0;
        let skipped = 0;
        let errors = 0;

        for (const file of files) {
            const fullPath = path.join(inputPath, file);
            try {
                if (!needsCompression(fullPath)) {
                    process.stdout.write(`Melewati ${file} - ukuran di bawah 16MB\n`);
                    skipped++;
                    continue;
                }

                process.stdout.write(`Mengkompresi ${file}... `);
                await processFile(fullPath, outputDir);
                process.stdout.write('Selesai!\n');
                processed++;
            } catch (err) {
                process.stdout.write('Gagal!\n');
                console.error(`Error pada file ${file}:`, err.message);
                errors++;
            }

            // Show progress
            const progress = ((processed + skipped + errors) / files.length * 100).toFixed(2);
            console.log(`Progress: ${progress}% (${processed + skipped + errors}/${files.length})`);
        }

        // Final report
        console.log('\nProses kompresi selesai!');
        console.log(`Total file: ${files.length}`);
        console.log(`Berhasil dikompresi: ${processed}`);
        console.log(`Dilewati (< 16MB): ${skipped}`);
        console.log(`Gagal: ${errors}`);
    } else {
        // Process single file
        await processFile(inputPath, outputDir);
    }
}

/**
 * Process a single file
 * @param {string} filePath - Path to the audio file
 * @param {string} outputDir - Directory for compressed files
 */
async function processFile(filePath, outputDir) {
    try {
        const filename = path.basename(filePath);
        const outputPath = path.join(outputDir, filename);
        const fileSize = (fs.statSync(filePath).size / 1024 / 1024).toFixed(2);

        await compressAudio(filePath, outputPath, 15); // 15kbps bitrate
        const newSize = (fs.statSync(outputPath).size / 1024 / 1024).toFixed(2);
        
        console.log(`Ukuran file: ${fileSize}MB -> ${newSize}MB`);
    } catch (error) {
        throw new Error(`Gagal memproses ${path.basename(filePath)}: ${error.message}`);
    }
}

async function main() {
    try {
        // Set default paths
        const inputPath = path.join(__dirname, '..', 'ogg');
        const outputDir = path.join(__dirname, '..', 'compressed-audio');

        // Check if ogg directory exists
        if (!fs.existsSync(inputPath)) {
            console.error('Error: Folder "ogg" tidak ditemukan!');
            process.exit(1);
        }

        // Create output directory if it doesn't exist
        if (!fs.existsSync(outputDir)) {
            fs.mkdirSync(outputDir, { recursive: true });
            console.log('Membuat folder output: compressed-audio');
        }

        console.log('Memulai proses kompresi...');
        console.log(`Input: ${inputPath}`);
        console.log(`Output: ${outputDir}\n`);

        await processPath(inputPath, outputDir);
    } catch (error) {
        console.error('\nTerjadi kesalahan:', error.message);
        process.exit(1);
    }
}

if (require.main === module) {
    main();
} 
