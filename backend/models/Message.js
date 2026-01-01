const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Message = sequelize.define('Message', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    conversationId: {
        type: DataTypes.STRING,
        allowNull: false,
        index: true
    },
    senderId: {
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
    content: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
            notEmpty: { msg: 'Message content is required' }
        }
    },
    read: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    readAt: {
        type: DataTypes.DATE,
        allowNull: true
    }
}, {
    timestamps: true,
    indexes: [
        {
            fields: ['conversationId', 'createdAt']
        },
        {
            fields: ['senderId', 'recipientId']
        }
    ]
});

module.exports = Message;
