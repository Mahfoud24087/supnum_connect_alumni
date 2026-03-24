const { sequelize } = require('./config/database');
const { DataTypes } = require('sequelize');

async function fixSchema() {
    const queryInterface = sequelize.getQueryInterface();
    try {
        console.log('--- Database Fix: Adding Missing Columns ---');
        
        const columnsToAdd = [
            { name: 'website', type: DataTypes.STRING, defaultValue: '' },
            { name: 'industry', type: DataTypes.STRING, defaultValue: '' },
            { name: 'foundationYear', type: DataTypes.INTEGER, allowNull: true },
            { name: 'contactEmail', type: DataTypes.STRING, defaultValue: '' },
            { name: 'latitude', type: DataTypes.FLOAT, allowNull: true },
            { name: 'longitude', type: DataTypes.FLOAT, allowNull: true },
            { name: 'socialTwitter', type: DataTypes.STRING, defaultValue: '' },
            { name: 'socialYoutube', type: DataTypes.STRING, defaultValue: '' }
        ];

        for (const col of columnsToAdd) {
            try {
                await queryInterface.addColumn('Users', col.name, {
                    type: col.type,
                    allowNull: col.allowNull !== undefined ? col.allowNull : true,
                    defaultValue: col.defaultValue !== undefined ? col.defaultValue : null
                });
                console.log(`✅ Added column: ${col.name}`);
            } catch (err) {
                if (err.name === 'SequelizeDatabaseError' && err.message.includes('already exists')) {
                    console.log(`ℹ️ Column ${col.name} already exists, skipping.`);
                } else {
                    console.error(`❌ Error adding column ${col.name}:`, err.message);
                }
            }
        }

        console.log('--- Fix Completed ---');
        process.exit(0);
    } catch (error) {
        console.error('Fatal error during fix:', error);
        process.exit(1);
    }
}

fixSchema();
