const PDFDocument = require('pdfkit');
const fs = require('fs');

const doc = new PDFDocument();
const outputPath = 'C:\\Users\\HP\\OneDrive\\Bureau\\SampleResume.pdf';

doc.pipe(fs.createWriteStream(outputPath));

doc.fontSize(25).text('Mahfoud Dev', 100, 80);
doc.fontSize(15).text('Software Engineer', 100, 110);

doc.moveDown();
doc.fontSize(18).text('Professional Summary');
doc.fontSize(12).text('Experienced software engineer with 5 years in full-stack development. Passionate about AI and cloud technologies.');

doc.moveDown();
doc.fontSize(18).text('Skills');
doc.fontSize(12).text('React, Node.js, Python, PostgreSQL, Google Cloud, Docker, Git');

doc.moveDown();
doc.fontSize(18).text('Experience');
doc.fontSize(12).text('Software Engineer at TechCorp (2020-Present)');
doc.text('- Lead developer for a real-time messaging platform using Socket.IO.');
doc.text('- Achieved 30% performance boost by optimizing database queries.');

doc.moveDown();
doc.text('Junior Dev at Startup Inc (2018-2020)');
doc.text('- Developed frontend components with React and Redux.');

doc.end();

console.log(`Valid Sample PDF generated at: ${outputPath}`);
