// This script is used to compress all ogg files in "ogg" folder

const { compressAudio } = require('../compress');
const path = require('path');
const fs = require('fs');

async function compressAllFiles() {
    try {
        // Path setup
        const oggDir = path.join(__dirname, '../ogg');
        const outputDir = path.join(__dirname, '../ogg-compressed');
        console.log(oggDir);
        console.log(outputDir);

        // Check if ogg directory exists
        if (!fs.existsSync(oggDir)) {
            console.error('Error: Folder "ogg" tidak ditemukan!');
            process.exit(1);
        }

        // Create output directory if it doesn't exist
        if (!fs.existsSync(outputDir)) {
            fs.mkdirSync(outputDir, { recursive: true });
            console.log('Membuat folder output: ogg-compressed');
        }

        // Get all .ogg files
        const files = fs.readdirSync(oggDir)
            .filter(file => file.match(/^\d{6}\.ogg$/))
            .sort((a, b) => {
                const numA = parseInt(a.substring(0, 6));
                const numB = parseInt(b.substring(0, 6));
                return numA - numB;
            });

        if (files.length === 0) {
            console.error('Error: Tidak ada file .ogg yang ditemukan di folder "ogg"');
            process.exit(1);
        }

        console.log(`Ditemukan ${files.length} file untuk dikompresi\n`);

        // Process files
        let processed = 0;
        let errors = 0;

        for (const file of files) {
            try {
                const inputPath = path.join(oggDir, file);
                const outputPath = path.join(outputDir, file);
                
                process.stdout.write(`Mengkompresi ${file}... `);
                await compressAudio(inputPath, outputPath, 32); // 32kbps bitrate
                process.stdout.write('Selesai!\n');
                processed++;
            } catch (err) {
                process.stdout.write('Gagal!\n');
                console.error(`Error pada file ${file}:`, err.message);
                errors++;
            }

            // Show progress
            const progress = ((processed + errors) / files.length * 100).toFixed(2);
            console.log(`Progress: ${progress}% (${processed + errors}/${files.length})`);
        }

        // Final report
        console.log('\nProses kompresi selesai!');
        console.log(`Total file: ${files.length}`);
        console.log(`Berhasil: ${processed}`);
        console.log(`Gagal: ${errors}`);
        console.log(`\nFile hasil kompresi tersimpan di: ${outputDir}`);

    } catch (error) {
        console.error('\nTerjadi kesalahan:', error.message);
        process.exit(1);
    }
}

// Run the compression
compressAllFiles(); 
