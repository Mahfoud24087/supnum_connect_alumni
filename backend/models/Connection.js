const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Connection = sequelize.define('Connection', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    requesterId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: 'Users',
            key: 'id'
        }
    },
    recipientId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: 'Users',
            key: 'id'
        }
    },
    status: {
        type: DataTypes.ENUM('pending', 'accepted', 'rejected'),
        defaultValue: 'pending'
    }
}, {
    timestamps: true
});

module.exports = Connection;
