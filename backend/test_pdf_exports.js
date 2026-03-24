const pdf = require('pdf-parse');

console.log('Type of pdf:', typeof pdf);
console.log('Pdf object keys:', Object.keys(pdf));
if (pdf.default) {
    console.log('Type of pdf.default:', typeof pdf.default);
}
if (pdf.PDFParse) {
    console.log('Type of pdf.PDFParse:', typeof pdf.PDFParse);
}
