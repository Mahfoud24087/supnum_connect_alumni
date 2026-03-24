const pdf = require('pdf-parse');
const fs = require('fs');
const path = require('path');

async function createAndTest() {
    try {
        console.log('Testing with a real valid PDF...');
        // Need a real PDF buffer.
        // I'll create a very simple one manually.
        const buffer = Buffer.from('%PDF-1.4\n1 0 obj\n<<>>\nendobj\ntrailer\n<<Root 1 0 R>>\n%%EOF');
        // Actually that dummy might still be "invalid structure" for some parsers.
        
        const data = await pdf(buffer);
        console.log('Parsed successfully!');
    } catch (error) {
        console.error('Error:', error.message);
    }
}

createAndTest();
