const PDFDocument = require('pdfkit');
const fs = require('fs');

async function generate() {
    return new Promise((resolve) => {
        const doc = new PDFDocument();
        const outputPath = 'C:\\Users\\HP\\OneDrive\\Bureau\\SampleResume.pdf';
        const stream = fs.createWriteStream(outputPath);
        
        doc.pipe(stream);

        doc.fontSize(25).text('John Doe', 100, 80);
        doc.fontSize(15).text('Test Resume', 100, 110);
        doc.moveDown();
        doc.fontSize(12).text('Skills: React, Node, SQL');
        doc.end();

        stream.on('finish', () => {
            console.log('PDF write finished.');
            resolve();
        });
    });
}

generate();
