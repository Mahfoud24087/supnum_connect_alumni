const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Event = sequelize.define('Event', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: { msg: 'Title is required' }
        }
    },
    date: {
        type: DataTypes.DATE,
        allowNull: false
    },
    type: {
        type: DataTypes.ENUM('Event', 'Challenge', 'Contest'),
        defaultValue: 'Event'
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    image: {
        type: DataTypes.TEXT,
        defaultValue: ''
    },
    duration: {
        type: DataTypes.INTEGER,
        defaultValue: 7
    },
    stage: {
        type: DataTypes.STRING,
        defaultValue: 'All'
    },
    color: {
        type: DataTypes.STRING,
        defaultValue: 'bg-blue-600'
    },
    createdById: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: 'Users',
            key: 'id'
        }
    }
}, {
    timestamps: true
});

module.exports = Event;
