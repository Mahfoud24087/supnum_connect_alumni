const pdf = require('pdf-parse');

async function test() {
    console.log('Type of pdf:', typeof pdf);
    console.log('Pdf object keys:', Object.keys(pdf));

    try {
        // Create a minimal PDF buffer or just a dummy buffer to see if it even accepts it
        const buffer = Buffer.from('%PDF-1.4\n1 0 obj\n<<>>\nendobj\ntrailer\n<<Root 1 0 R>>\n%%EOF');
        
        let data;
        if (typeof pdf === 'function') {
            console.log('Calling pdf(buffer)...');
            data = await pdf(buffer);
        } else if (pdf && typeof pdf.PDFParse === 'function') {
            console.log('Calling pdf.PDFParse(buffer)...');
            data = await pdf.PDFParse(buffer);
        } else {
            console.log('No function available in pdf module');
            return;
        }
        
        console.log('Data returned keys:', Object.keys(data));
        console.log('Data text:', data.text);
    } catch (error) {
        console.error('Error during parsing:', error);
    }
}

test();
