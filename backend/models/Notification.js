const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Notification = sequelize.define('Notification', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    message: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    type: {
        type: DataTypes.ENUM(
            'application_new', 
            'application_update', 
            'friend_request', 
            'connection_accepted',
            'new_message', 
            'event_reminder', 
            'skill_endorsement',
            'post_like',
            'post_comment',
            'system',
            'system_alert'
        ),
        defaultValue: 'system'
    },
    isRead: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    link: {
        type: DataTypes.STRING,
        allowNull: true
    }
}, {
    timestamps: true
});

module.exports = Notification;
