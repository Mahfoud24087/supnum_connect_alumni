const pdf = require('pdf-parse');
const fs = require('fs');
const pdfPath = 'C:\\Users\\HP\\OneDrive\\Bureau\\24087(1).pdf';

async function test() {
    try {
        const buffer = fs.readFileSync(pdfPath);
        const data = await new pdf.PDFParse(buffer);
        console.log('Keys of data:', Object.keys(data));
        if (data.text) console.log('Text length:', data.text.length); else console.log('NO text found');
        console.log('Sample text:', data.text ? data.text.slice(0, 100) : 'N/A');
    } catch (error) {
        console.error('Error:', error);
    }
}

test();
