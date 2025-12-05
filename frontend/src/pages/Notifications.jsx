import { useEffect, useState } from "react";
import axios from "../api/axios";

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    axios.get("/notifications")
      .then(res => setNotifications(res.data))
      .catch(err => console.log(err));
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Notifications</h1>

      {notifications.length === 0 ? (
        <p>No notifications yet.</p>
      ) : (
        notifications.map(n => (
          <div key={n._id} className="border p-3 mb-2 rounded shadow">
            <h2 className="font-semibold">{n.title}</h2>
            <p>{n.body}</p>
          </div>
        ))
      )}
    </div>
  );
}
