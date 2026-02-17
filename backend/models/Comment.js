const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Comment = sequelize.define('Comment', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    content: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
            notEmpty: { msg: 'Comment cannot be empty' }
        }
    },
    reactions: {
        type: DataTypes.JSONB,
        defaultValue: []
    },
    parentId: {
        type: DataTypes.UUID,
        allowNull: true
    }
}, {
    timestamps: true
});

module.exports = Comment;
