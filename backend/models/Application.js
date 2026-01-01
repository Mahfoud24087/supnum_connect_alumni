const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Application = sequelize.define('Application', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    status: {
        type: DataTypes.ENUM('pending', 'reviewed', 'accepted', 'rejected'),
        defaultValue: 'pending'
    },
    message: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    email: {
        type: DataTypes.STRING,
        allowNull: true
    },
    phone: {
        type: DataTypes.STRING,
        allowNull: true
    },
    cvUrl: {
        type: DataTypes.TEXT, // Changed to TEXT to support Base64 strings for now
        allowNull: true
    },
    submittedAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
    customAnswers: {
        type: DataTypes.JSON,
        defaultValue: {}
    }
}, {
    timestamps: true
});

module.exports = Application;
