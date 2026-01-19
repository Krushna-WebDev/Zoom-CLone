import React, { createContext, useContext, useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";
import { UserContext } from "./Context";

export const SocketContext = createContext<Socket | null>(null);

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  // todo :- got token from localstorage but need to use from usestate and store in state not in localstorage

  const { token } = useContext(UserContext)!;
  const [socket, setSocket] = React.useState<Socket | null>(null);

  useEffect(() => {
    if (!token) return;

    const newSocket = io("http://localhost:5000", {
      auth: { token },
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, [token]);
  console.log("token from f", token);
  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};
