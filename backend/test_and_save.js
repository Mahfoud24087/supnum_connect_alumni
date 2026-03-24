const { parseResume } = require('./services/aiService');
const fs = require('fs');

async function test() {
    const buffer = fs.readFileSync('C:\\Users\\HP\\OneDrive\\Bureau\\SampleResume.pdf');
    const result = await parseResume(buffer);
    fs.writeFileSync('test_result.json', JSON.stringify(result, null, 2));
}

test();
