import React from "react";
import { UserProvider } from "./Context";
import { ModalProvider } from "./ModelContext";
import {SocketProvider} from "./SocketContext"

const AppProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <UserProvider>
        <SocketProvider>
          <ModalProvider>{children}</ModalProvider>
        </SocketProvider>
      </UserProvider>
    </>
  );
};

export default AppProvider;
