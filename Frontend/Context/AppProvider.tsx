import React from "react";
import { UserProvider } from "./Context";
import { ModalProvider } from "./ModelContext";

const AppProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <UserProvider>
        <ModalProvider>{children}</ModalProvider>
      </UserProvider>
    </>
  );
};

export default AppProvider;
