const fs = require('fs');
const { exec } = require('child_process');
const path = require('path');

// Function to get all available surah numbers from the ogg folder
function getAvailableSurahs() {
    const oggFolder = path.join(__dirname, '../ogg');
    const files = fs.readdirSync(oggFolder);
    const surahSet = new Set();
    
    files.forEach(file => {
        // Only process 6-digit named files (e.g., 114001.ogg)
        if (file.match(/^\d{6}\.ogg$/)) {
            // Extract surah number from filename (first 3 digits)
            const surahNum = file.substring(0, 3);
            surahSet.add(parseInt(surahNum));
        }
    });
    
    return Array.from(surahSet).sort((a, b) => a - b);
}

// Function to get all ayah files for a specific surah
function getAyahFiles(surahNumber) {
    const oggFolder = path.join(__dirname, '../ogg');
    const files = fs.readdirSync(oggFolder)
        .filter(file => {
            // Only include 6-digit files that start with the surah number
            return file.match(/^\d{6}\.ogg$/) && 
                   file.startsWith(surahNumber.toString().padStart(3, '0'));
        })
        .sort((a, b) => {
            // Extract the ayah number (last 3 digits)
            const numA = parseInt(a.substring(3, 6));
            const numB = parseInt(b.substring(3, 6));
            return numA - numB;
        });
    
    return files.map(file => path.join(oggFolder, file));
}

// Function to merge audio files using FFmpeg
function mergeSurah(surahNumber) {
    return new Promise((resolve, reject) => {
        const files = getAyahFiles(surahNumber);
        if (files.length === 0) {
            console.error(`No ayah files found for surah ${surahNumber}`);
            resolve();
            return;
        }

        // Create a text file containing the list of input files
        const listFile = `filelist_${surahNumber}.txt`;
        const fileList = files.map(file => `file '${file}'`).join('\n');
        fs.writeFileSync(listFile, fileList);

        // Output file name
        const outputDir = path.join(__dirname, '../audio-per-surah');
        const outputFile = path.join(outputDir, `${surahNumber.toString().padStart(3, '0')}.ogg`);

        // Create output directory if it doesn't exist
        if (!fs.existsSync(outputDir)) {
            fs.mkdirSync(outputDir, { recursive: true });
        }

        // FFmpeg command to concatenate files
        const command = `ffmpeg -f concat -safe 0 -i ${listFile} -c copy "${outputFile}"`;

        // Execute FFmpeg command
        exec(command, (error, stdout, stderr) => {
            // Clean up the temporary file list
            fs.unlinkSync(listFile);

            if (error) {
                console.error(`Error merging Surah ${surahNumber}: ${error.message}`);
                resolve();
                return;
            }
            console.log(`Successfully merged Surah ${surahNumber} to ${outputFile}`);
            resolve();
        });
    });
}

// Function to process all surahs sequentially
async function processAllSurahs() {
    const surahs = getAvailableSurahs();
    console.log(`Found ${surahs.length} surahs to process`);
    
    for (const surahNumber of surahs) {
        console.log(`Processing Surah ${surahNumber}...`);
        await mergeSurah(surahNumber);
    }
    
    console.log('Finished processing all surahs!');
}

// Execute the merge for all surahs
processAllSurahs(); 