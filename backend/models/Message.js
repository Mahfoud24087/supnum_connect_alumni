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
        allowNull: true
    },
    read: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    readAt: {
        type: DataTypes.DATE,
        allowNull: true
    },
    type: {
        type: DataTypes.STRING,
        defaultValue: 'text'
    },
    fileUrl: {
        type: DataTypes.STRING,
        allowNull: true
    },
    isEdited: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    isDeleted: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    replyToId: {
        type: DataTypes.UUID,
        allowNull: true,
        references: {
            model: 'Messages',
            key: 'id'
        }
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
