const ffmpeg = require('fluent-ffmpeg');
const path = require('path');
const fs = require('fs');

/**
 * Compress audio file to OGG Opus format
 * @param {string} inputPath - Path to input audio file
 * @param {string} outputPath - Path for compressed output file
 * @param {number} bitrate - Target bitrate in kbps (default: 32)
 * @returns {Promise} - Promise that resolves when compression is complete
 */
function compressAudio(inputPath, outputPath = '', bitrate = 15) {
    return new Promise((resolve, reject) => {
        // If no output path specified, create one based on input file
        if (!outputPath) {
            const dir = path.dirname(inputPath);
            const filename = path.basename(inputPath, path.extname(inputPath));
            outputPath = path.join(dir, `${filename}_compressed.ogg`);
        }

        // Ensure output directory exists
        const outputDir = path.dirname(outputPath);
        if (!fs.existsSync(outputDir)) {
            fs.mkdirSync(outputDir, { recursive: true });
            console.log(`Created output directory: ${outputDir}`);
        }

        ffmpeg(inputPath)
            .toFormat('ogg')
            .audioCodec('libopus')
            .audioBitrate(bitrate)
            .audioChannels(2)
            .audioFrequency(48000) // Opus works best with 48kHz
            .outputOptions(['-map_metadata', '-1']) // Remove all metadata including title
            .on('end', () => {
                console.log('Compression completed successfully!');
                resolve(outputPath);
            })
            .on('error', (err) => {
                console.error('Error during compression:', err);
                reject(err);
            })
            .save(outputPath);
    });
}

// Example usage
async function main() {
    try {
        const inputFile = process.argv[2];
        if (!inputFile) {
            console.error('Please provide an input file path');
            process.exit(1);
        }

        // Create output path in a different folder
        const outputDir = 'compressed-audio';
        const filename = path.basename(inputFile, path.extname(inputFile));
        const outputPath = path.join(outputDir, `${filename}.ogg`);

        console.log('Starting audio compression...');
        const finalPath = await compressAudio(inputFile, outputPath);
        console.log(`File compressed successfully to: ${finalPath}`);
    } catch (error) {
        console.error('Compression failed:', error);
        process.exit(1);
    }
}

if (require.main === module) {
    main();
}

module.exports = { compressAudio };
