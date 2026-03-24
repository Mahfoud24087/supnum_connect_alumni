const { parseResume } = require('./services/aiService');
const fs = require('fs');

async function finalTest() {
    const pdfPath = 'C:\\Users\\HP\\OneDrive\\Bureau\\SampleResume.pdf';
    console.log(`Final Test: Parsing valid generated PDF at ${pdfPath}...`);
    try {
        const buffer = fs.readFileSync(pdfPath);
        const result = await parseResume(buffer);
        console.log('Result:', JSON.stringify(result, null, 2));
    } catch (error) {
        console.error('Final test failed:', error);
    }
}

finalTest();
