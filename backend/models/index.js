const User = require('./User');
const Event = require('./Event');
const Company = require('./Company');
const Internship = require('./Internship');
const Message = require('./Message');
const Connection = require('./Connection');
const Application = require('./Application');
const Notification = require('./Notification');
const Post = require('./Post');
const Comment = require('./Comment');
const SkillEndorsement = require('./SkillEndorsement');
const PushSubscription = require('./PushSubscription');
const SupportMessage = require('./SupportMessage');
const { sequelize } = require('../config/database');

// Define associations
SupportMessage.belongsTo(User, { as: 'user', foreignKey: 'userId' });
User.hasMany(SupportMessage, { foreignKey: 'userId', onDelete: 'SET NULL' });
Event.belongsTo(User, { as: 'createdBy', foreignKey: 'createdById' });
User.hasMany(Event, { foreignKey: 'createdById', onDelete: 'CASCADE' });

Internship.belongsTo(User, { as: 'createdBy', foreignKey: 'createdById' });
User.hasMany(Internship, { foreignKey: 'createdById', onDelete: 'CASCADE' });

Message.belongsTo(User, { as: 'sender', foreignKey: 'senderId' });
Message.belongsTo(User, { as: 'recipient', foreignKey: 'recipientId' });
User.hasMany(Message, { as: 'sentMessages', foreignKey: 'senderId', onDelete: 'CASCADE' });
User.hasMany(Message, { as: 'receivedMessages', foreignKey: 'recipientId', onDelete: 'CASCADE' });
Message.belongsTo(Message, { as: 'replyTo', foreignKey: 'replyToId' });

// Connection associations
User.hasMany(Connection, { as: 'sentRequests', foreignKey: 'requesterId', onDelete: 'CASCADE' });
User.hasMany(Connection, { as: 'receivedRequests', foreignKey: 'recipientId', onDelete: 'CASCADE' });
Connection.belongsTo(User, { as: 'requester', foreignKey: 'requesterId' });
Connection.belongsTo(User, { as: 'recipient', foreignKey: 'recipientId' });

// Application associations
Application.belongsTo(User, { as: 'user', foreignKey: 'userId' });
Application.belongsTo(Internship, { as: 'internship', foreignKey: 'internshipId' });
User.hasMany(Application, { foreignKey: 'userId', onDelete: 'CASCADE' });
Internship.hasMany(Application, { foreignKey: 'internshipId', onDelete: 'CASCADE' });

// Notification associations
Notification.belongsTo(User, { as: 'user', foreignKey: 'userId' });
User.hasMany(Notification, { foreignKey: 'userId', onDelete: 'CASCADE' });

// Post associations
Post.belongsTo(User, { as: 'author', foreignKey: 'userId' });
User.hasMany(Post, { foreignKey: 'userId', onDelete: 'CASCADE' });
Post.belongsTo(Post, { as: 'sharedPost', foreignKey: 'sharedPostId' });
Post.hasMany(Comment, { as: 'comments', foreignKey: 'postId', onDelete: 'CASCADE' });
Comment.belongsTo(Post, { foreignKey: 'postId' });
Comment.belongsTo(User, { as: 'author', foreignKey: 'userId' });
User.hasMany(Comment, { foreignKey: 'userId', onDelete: 'CASCADE' });
Comment.hasMany(Comment, { as: 'replies', foreignKey: 'parentId', onDelete: 'CASCADE' });
Comment.belongsTo(Comment, { as: 'parent', foreignKey: 'parentId' });

// SkillEndorsement associations
SkillEndorsement.belongsTo(User, { as: 'endorser', foreignKey: 'endorserId' });
SkillEndorsement.belongsTo(User, { as: 'user', foreignKey: 'userId' });
User.hasMany(SkillEndorsement, { as: 'endorsementsReceived', foreignKey: 'userId', onDelete: 'CASCADE' });
User.hasMany(SkillEndorsement, { as: 'endorsementsGiven', foreignKey: 'endorserId', onDelete: 'CASCADE' });

// Push Subscription associations
PushSubscription.belongsTo(User, { foreignKey: 'userId' });
User.hasMany(PushSubscription, { foreignKey: 'userId', onDelete: 'CASCADE' });

module.exports = {
    User,
    Event,
    Company,
    Internship,
    Message,
    Connection,
    Application,
    Notification,
    Post,
    Comment,
    SkillEndorsement,
    PushSubscription,
    SupportMessage,
    sequelize
};
