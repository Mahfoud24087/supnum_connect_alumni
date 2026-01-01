const User = require('./User');
const Event = require('./Event');
const Company = require('./Company');
const Internship = require('./Internship');
const Message = require('./Message');
const Connection = require('./Connection');
const Application = require('./Application');
const Notification = require('./Notification');
const { sequelize } = require('../config/database');

// Define associations
Event.belongsTo(User, { as: 'createdBy', foreignKey: 'createdById' });
User.hasMany(Event, { foreignKey: 'createdById' });

Internship.belongsTo(User, { as: 'createdBy', foreignKey: 'createdById' });
User.hasMany(Internship, { foreignKey: 'createdById' });

Message.belongsTo(User, { as: 'sender', foreignKey: 'senderId' });
Message.belongsTo(User, { as: 'recipient', foreignKey: 'recipientId' });
User.hasMany(Message, { as: 'sentMessages', foreignKey: 'senderId' });
User.hasMany(Message, { as: 'receivedMessages', foreignKey: 'recipientId' });

// Connection associations
User.hasMany(Connection, { as: 'sentRequests', foreignKey: 'requesterId' });
User.hasMany(Connection, { as: 'receivedRequests', foreignKey: 'recipientId' });
Connection.belongsTo(User, { as: 'requester', foreignKey: 'requesterId' });
Connection.belongsTo(User, { as: 'recipient', foreignKey: 'recipientId' });

// Application associations
Application.belongsTo(User, { as: 'user', foreignKey: 'userId' });
Application.belongsTo(Internship, { as: 'internship', foreignKey: 'internshipId' });
User.hasMany(Application, { foreignKey: 'userId' });
Internship.hasMany(Application, { foreignKey: 'internshipId' });

// Notification associations
Notification.belongsTo(User, { as: 'user', foreignKey: 'userId' });
User.hasMany(Notification, { foreignKey: 'userId' });

module.exports = {
    User,
    Event,
    Company,
    Internship,
    Message,
    Connection,
    Application,
    Notification,
    sequelize
};
