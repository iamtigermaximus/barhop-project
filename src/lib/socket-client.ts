// lib/socket-client.ts
import { io } from "socket.io-client";

const socket = io({
  path: "/api/socket/io",
  transports: ["polling", "websocket"],
});

// Your existing event handlers will work
socket.on("connect", () => {
  console.log("Connected to server");
  socket.emit("join_user_room", "user-123");
});

socket.on("new_notification", (notification) => {
  console.log("New notification:", notification);
});
