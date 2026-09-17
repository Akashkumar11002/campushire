import { Server } from "socket.io";
import jwt from "jsonwebtoken";

let io;

// Sets up Socket.IO on top of the existing HTTP server, and authenticates
// each connecting socket using the same JWT used for regular API requests
export const initializeSocket = (httpServer) => {
  io = new Server(httpServer, {
    cors: {
      origin: "*", // tighten this to the real frontend URL once deployed
    },
  });

  io.use((socket, next) => {
    const token = socket.handshake.auth?.token;
    if (!token) {
      return next(new Error("Authentication token missing"));
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.userId = decoded.id;
      next();
    } catch (error) {
      next(new Error("Invalid or expired token"));
    }
  });

  io.on("connection", (socket) => {
    // Put this socket in a private "room" named after the user's id,
    // so we can later send a notification to exactly this user
    socket.join(socket.userId);
    console.log(`Socket connected for user: ${socket.userId}`);

    socket.on("disconnect", () => {
      console.log(`Socket disconnected for user: ${socket.userId}`);
    });
  });

  return io;
};

// Lets any controller access the same io instance to emit events
export const getIO = () => {
  if (!io) {
    throw new Error("Socket.IO not initialized yet");
  }
  return io;
};