const { sequelize } = require('./config/database');
const { QueryTypes } = require('sequelize');

async function checkSchema() {
    try {
        console.log('--- Database Schema Check ---');
        const columns = await sequelize.query(
            "SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'Users'",
            { type: QueryTypes.SELECT }
        );
        
        const fs = require('fs');
        const targetColumns = ['latitude', 'longitude', 'website', 'industry', 'foundationYear', 'contactEmail', 'socialTwitter', 'socialYoutube'];
        let output = '--- Targeted Column Check ---\n';
        targetColumns.forEach(target => {
            const found = columns.find(col => col.column_name === target);
            output += `${target}: ${found ? 'EXISTS' : 'MISSING'}\n`;
        })
        
        fs.writeFileSync('schema_results.txt', output);
        console.log('Results written to schem;a_results.txt');
        
        process.exit(0);
    } catch (error) {
        console.error('Error checking schema:', error);
        process.exit(1);
    }
}

checkSchema();
