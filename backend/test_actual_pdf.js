const { parseResume } = require('./services/aiService');
const fs = require('fs');

async function test() {
    const pdfPath = 'C:\\Users\\HP\\OneDrive\\Bureau\\24087(1).pdf';
    console.log(`Testing parseResume with actual PDF at ${pdfPath}...`);
    try {
        if (!fs.existsSync(pdfPath)) {
            console.error('File not found at:', pdfPath);
            return;
        }
        const buffer = fs.readFileSync(pdfPath);
        const result = await parseResume(buffer);
        console.log('Result:', result);
    } catch (error) {
        console.error('Test failed:', error);
    }
}

test();
