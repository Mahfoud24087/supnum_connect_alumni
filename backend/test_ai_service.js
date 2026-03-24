const { parseResume } = require('./services/aiService');
const fs = require('fs');

async function test() {
    try {
        console.log('Testing parseResume with a dummy buffer...');
        // Create a dummy PDF buffer
        const buffer = Buffer.from('%PDF-1.4\n1 0 obj\n<<>>\nendobj\ntrailer\n<<Root 1 0 R>>\n%%EOF');
        const result = await parseResume(buffer);
        console.log('Result:', result);
    } catch (error) {
        console.error('Test failed:', error);
    }
}

test();
