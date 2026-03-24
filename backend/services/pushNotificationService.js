const webpush = require('web-push');
const { PushSubscription } = require('../models');

// Configure VAPID keys
const publicVapidKey = process.env.PUBLIC_VAPID_KEY || 'BFxuRErTWPIHmpXClcwPaeNJFTRQGTsy3ZgdxetKAR9sFje-vLXovqiY3XIesCM6UmEqm2-X1ut6G7nNmqFJdbo';
const privateVapidKey = process.env.PRIVATE_VAPID_KEY || 'bMLjf2Na43iBHd77f7wCuMHLidwXhGyA1IHoz5JWs1M';

webpush.setVapidDetails(
    'mailto:support@supnumconnect.com',
    publicVapidKey,
    privateVapidKey
);

/**
 * Send a push notification to a specific user
 * @param {string} userId - The ID of the user to notify
 * @param {object} payload - The notification payload (title, body, icon, data)
 */
const sendPushNotification = async (userId, payload) => {
    try {
        const subscriptions = await PushSubscription.findAll({ where: { userId } });
        
        const pushPayload = JSON.stringify(payload);

        const promises = subscriptions.map(sub => {
            const pushSubscription = {
                endpoint: sub.endpoint,
                keys: {
                    p256dh: sub.p256dh,
                    auth: sub.auth
                }
            };
            
            return webpush.sendNotification(pushSubscription, pushPayload)
                .catch(err => {
                    if (err.statusCode === 404 || err.statusCode === 410) {
                        console.log(`Push subscription ${sub.id} is no longer valid. Deleting...`);
                        return sub.destroy();
                    }
                    console.error('Error sending push notification:', err);
                });
        });

        await Promise.all(promises);
    } catch (error) {
        console.error('Push Notification Service Error:', error);
    }
};

module.exports = {
    sendPushNotification,
    publicVapidKey
};
