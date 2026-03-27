const { Sequelize } = require('sequelize');
require('dotenv').config();
// Allow self-signed certificates (fixes Error: self-signed certificate in certificate chain)
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

// Initialize Sequelize with PostgreSQL
// Support both DATABASE_URL (Render/Production) and individual env vars (Local Dev)
let sequelize;

const rawUrl = process.env.DATABASE_URL || process.env.DB_URL;

if (rawUrl) {
    let dbUrl = rawUrl.trim();
    // Normalize postgresql:// to postgres:// for Sequelize compatibility
    if (dbUrl.startsWith('postgresql://')) {
        dbUrl = dbUrl.replace('postgresql://', 'postgres://');
    }
    console.log('🔗 Using Database URL connection (normalized)');
    sequelize = new Sequelize(dbUrl, {
        dialect: 'postgres',
        logging: false,
        dialectOptions: {
            ssl: {
                require: true,
                rejectUnauthorized: false,
            }
        },
        pool: {
            max: 5,
            min: 0,
            acquire: 30000,
            idle: 10000
        }
    });
} else {
    // Use individual environment variables for local development
    console.log('🔗 Using individual DB environment variables');
    console.log('DB_HOST:', process.env.DB_HOST);
    console.log('DB_NAME:', process.env.DB_NAME);
    console.log('DB_USER:', process.env.DB_USER);
    console.log('DB_PASSWORD:', process.env.DB_PASSWORD ? '***SET***' : 'NOT SET');

    sequelize = new Sequelize(
        process.env.DB_NAME || 'supnum_connect',
        process.env.DB_USER || 'postgres',
        String(process.env.DB_PASSWORD || ''),
        {
            host: process.env.DB_HOST || 'localhost',
            port: parseInt(process.env.DB_PORT) || 5432,
            dialect: 'postgres',
            logging: process.env.NODE_ENV === 'development' ? console.log : false,
            dialectOptions: {
                connectTimeout: 60000
            },
            pool: {
                max: 5,
                min: 0,
                acquire: 30000,
                idle: 10000
            }
        }
    );
}

const connectDB = async () => {
    try {
        await sequelize.authenticate();
        console.log('✅ PostgreSQL Connected successfully');

        // Use alter: true in both dev and production to automatically add new columns
        // This is safe: alter only adds/modifies columns, never drops data
        await sequelize.sync({ alter: true });
        console.log('✅ Database synced (alter: true)');
        return true;
    } catch (error) {
        console.error('❌ DATABASE_CONNECTION_ERROR:', error.message);
        console.log('⚠️ Server starting without DB connection. Will retry on next request.');
        return false;
    }
};

module.exports = { sequelize, connectDB };
