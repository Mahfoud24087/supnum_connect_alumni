const pdf = require('pdf-parse');

async function test() {
    console.log('Testing with new pdf.PDFParse...');
    try {
        const buffer = Buffer.from('%PDF-1.4\n1 0 obj\n<<>>\nendobj\ntrailer\n<<Root 1 0 R>>\n%%EOF');
        const data = await new pdf.PDFParse(buffer);
        console.log('Success!', Object.keys(data));
        console.log('Text:', data.text);
    } catch (error) {
        console.error('Failed with new PDFParse:', error);
    }
}

test();
