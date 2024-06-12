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
import "./Notifiche.css";
import CloseIcon from "@mui/icons-material/Close";
import BottomNavigationBar from "./BottomNavigationBar";

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
    <div className="cointainer">
      <h2 style={{ marginBottom: "30px" }}>Centro Notifiche</h2>
      {notifications
        .sort((a, b) => b.timestamp.toDate() - a.timestamp.toDate())
        .map((notification) => (
          <div
            className="text"
            key={notification.id}
            style={{
              justifyContent: "space-between",
              wordWrap: "break-word",
            }}
          >
            <p>
              <span style={{ fontWeight: 400 }}>{notification.userName}</span>
            </p>
            <p style={{ flex: 1 }}>
              Ha aggiunto una nuova nota{" "}
              <span style={{ fontWeight: 400 }}>{notification.message}</span>
            </p>
            <p
              style={{ color: "#9c9c9c", fontWeight: 400, marginTop: "-10px" }}
            >
              {notification.timestamp.toDate().toLocaleString("it-IT", {
                dateStyle: "short",
                timeStyle: "short",
              })}
            </p>
            {/* <CloseIcon onClick={() => removeNotification(notification.id)} /> */}
          </div>
        ))}
      <BottomNavigationBar />
    </div>
  );
};

export default Notifications;
