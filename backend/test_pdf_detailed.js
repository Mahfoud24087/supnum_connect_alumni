const pdf = require('pdf-parse');
const fs = require('fs');
const path = require('path');

async function test() {
    console.log('Type of pdf:', typeof pdf);
    console.log('Pdf object keys:', Object.keys(pdf));

    if (typeof pdf === 'function') {
        console.log('pdf is a function');
    } else if (pdf && typeof pdf.PDFParse === 'function') {
        console.log('pdf.PDFParse is a function');
    } else {
        console.log('No function available in pdf module');
    }
}

test();
