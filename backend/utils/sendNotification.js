import Notification from "../models/Notification.js";
import { getIO } from "../config/socket.js";

// Saves a notification in the database AND pushes it instantly to the user
// if they're currently connected via Socket.IO
const sendNotification = async ({ recipient, message, type = "general", relatedId }) => {
  const notification = await Notification.create({
    recipient,
    message,
    type,
    relatedId,
  });

  try {
    const io = getIO();
    io.to(recipient.toString()).emit("newNotification", notification);
  } catch (error) {
    // Socket.IO might not be ready yet, or the user isn't connected — that's fine,
    // the notification is already saved and they'll see it next time they check
    console.log("Could not send real-time notification:", error.message);
  }

  return notification;
};

export default sendNotification;