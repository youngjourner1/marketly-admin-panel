const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

const db = admin.firestore();

/**
 * Handle new user creation (Auth trigger)
 * Sets default custom claim 'buyer' and creates Firestore profile.
 */
exports.onUserCreated = functions.auth.user().onCreate(async (user) => {
    const { uid, email, displayName, photoURL } = user;
    
    // 1. Set Custom Claims (role: 'buyer')
    await admin.auth().setCustomUserClaims(uid, { role: 'buyer' });

    // 2. Create Firestore profile
    const userRef = db.collection('users').doc(uid);
    const doc = await userRef.get();
    
    if (!doc.exists) {
        await userRef.set({
            uid: uid,
            email: email || '',
            name: displayName || 'User',
            role: 'buyer',
            walletBalance: 0,
            status: 'active',
            isSellerRequestPending: false,
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
            photoURL: photoURL || ''
        });
    }
    
    console.log(`Initialized user ${uid} with role: buyer`);
    return null;
});

/**
 * Handle Seller Request Status Changes
 * When a request is approved or rejected, update user role and send a notification.
 */
exports.onSellerRequestUpdate = functions.firestore
    .document('seller_requests/{requestId}')
    .onUpdate(async (change, context) => {
        const newData = change.after.data();
        const oldData = change.before.data();

        // Only run if status changed
        if (newData.status === oldData.status) return null;

        const userId = newData.userId;
        const requestId = context.params.requestId;

        if (newData.status === 'approved') {
            try {
                // 1. Update Custom Claims to 'seller'
                await admin.auth().setCustomUserClaims(userId, { role: 'seller' });

                // 2. Update Firestore user role
                await db.collection('users').doc(userId).update({
                    role: 'seller',
                    isSellerRequestPending: false
                });

                // 3. Create seller store entry if it doesn't exist
                const sellerRef = db.collection('sellers').doc(userId);
                const sellerDoc = await sellerRef.get();
                
                if (!sellerDoc.exists()) {
                    await sellerRef.set({
                        userId: userId,
                        storeName: newData.businessName || newData.fullName + "'s Store",
                        storeLogo: '', 
                        description: 'Welcome to our store!',
                        verified: true,
                        createdAt: admin.firestore.FieldValue.serverTimestamp()
                    });
                }

                // 4. Send Notification
                await db.collection('notifications').add({
                    userId: userId,
                    title: 'Congratulations!',
                    message: 'Your seller application has been approved. You can now set up your store.',
                    type: 'seller_request_approved',
                    status: 'unread',
                    createdAt: admin.firestore.FieldValue.serverTimestamp(),
                    metadata: {
                        requestId: requestId
                    }
                });

                console.log(`Successfully promoted user ${userId} to seller (Auth & Firestore).`);
                return null;
            } catch (error) {
                console.error(`Error promoting user ${userId}:`, error);
                return null;
            }
        }

        if (newData.status === 'rejected') {
            try {
                // 1. Update user request pending status
                await db.collection('users').doc(userId).update({
                    isSellerRequestPending: false
                });

                // 2. Send Notification
                await db.collection('notifications').add({
                    userId: userId,
                    title: 'Seller Application Update',
                    message: `Your application to become a seller was rejected. Reason: ${newData.reviewNote || 'No reason provided.'}`,
                    type: 'seller_request_rejected',
                    status: 'unread',
                    reviewNote: newData.reviewNote || '',
                    createdAt: admin.firestore.FieldValue.serverTimestamp(),
                    metadata: {
                        requestId: requestId
                    }
                });

                console.log(`Rejected seller request for user ${userId}.`);
                return null;
            } catch (error) {
                console.error(`Error rejecting request for user ${userId}:`, error);
                return null;
            }
        }

        return null;
    });

/**
 * Cleanup function for deleted users
 */
exports.onUserDeleted = functions.auth.user().onDelete(async (user) => {
    const { uid } = user;
    const batch = db.batch();
    
    batch.delete(db.collection('users').doc(uid));
    batch.delete(db.collection('sellers').doc(uid));
    
    // Also cleanup notifications
    try {
        const notificationsSnapshot = await db.collection('notifications').where('userId', '==', uid).get();
        notificationsSnapshot.forEach(doc => {
            batch.delete(doc.ref);
        });
    } catch (error) {
        console.error('Error cleaning up notifications:', error);
    }
    
    return batch.commit();
});