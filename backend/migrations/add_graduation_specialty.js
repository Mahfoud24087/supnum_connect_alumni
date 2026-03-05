/**
 * Migration: Add graduationYear and specialty columns to Users table
 * Run this once against your production database to fix the login error.
 */

const { sequelize } = require('../config/database');
const { QueryInterface, DataTypes } = require('sequelize');

async function migrate() {
    const qi = sequelize.getQueryInterface();

    try {
        console.log('🔄 Starting migration...');

        // Add graduationYear column
        await qi.addColumn('Users', 'graduationYear', {
            type: DataTypes.INTEGER,
            allowNull: true,
            defaultValue: null
        });
        console.log('✅ Added column: graduationYear');

        // Add specialty column
        await qi.addColumn('Users', 'specialty', {
            type: DataTypes.STRING,
            allowNull: true,
            defaultValue: ''
        });
        console.log('✅ Added column: specialty');

        console.log('🎉 Migration complete!');
    } catch (error) {
        if (error.message.includes('already exists')) {
            console.log('ℹ️  Column already exists, skipping...');
        } else {
            console.error('❌ Migration failed:', error.message);
            process.exit(1);
        }
    } finally {
        await sequelize.close();
    }
}

migrate();
