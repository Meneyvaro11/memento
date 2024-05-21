import { useState, useEffect } from "react";
import {
  collection,
  query,
  where,
  onSnapshot,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { auth, db } from "./firebaseConfig";

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const currentUser = auth.currentUser;
    if (currentUser) {
      setUserId(currentUser.uid);
    }

    if (userId) {
      const q = query(
        collection(db, "notifications"),
        where("userId", "==", userId)
      );

      const unsubscribe = onSnapshot(q, (snapshot) => {
        const notificationsData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setNotifications(notificationsData);
      });

      return () => unsubscribe();
    }
  }, [userId]);

  const removeNotification = async (id) => {
    await deleteDoc(doc(db, "notifications", id));
    setNotifications(notifications.filter((notif) => notif.id !== id));
  };

  return (
    <div>
      <h2>Centro Notifiche</h2>
      {notifications.map((notification) => (
        <div key={notification.id}>
          {notification.message}
          <button onClick={() => removeNotification(notification.id)}>
            Rimuovi
          </button>
        </div>
      ))}
    </div>
  );
};

export default Notifications;
