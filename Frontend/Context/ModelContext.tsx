import { createContext, useState } from "react";

interface ModalInterface {
  loginModel: boolean;
  setLoginModel: React.Dispatch<React.SetStateAction<boolean>>;
  JoinMeetingModal: boolean;
  setJoinMeetingModal: React.Dispatch<React.SetStateAction<boolean>>;
  RequireLoginModal: boolean;
  setRequireLoginModal: React.Dispatch<React.SetStateAction<boolean>>;
}

export const ModalContext = createContext<ModalInterface | null>(null);

export const ModalProvider = ({ children }: { children: React.ReactNode }) => {
  const [loginModel, setLoginModel] = useState(false);
  const [JoinMeetingModal, setJoinMeetingModal] = useState<boolean>(false);
  const [RequireLoginModal, setRequireLoginModal] = useState<boolean>(false);

  return (
    <ModalContext.Provider
      value={{
        loginModel,
        setLoginModel,
        JoinMeetingModal,
        setJoinMeetingModal,
        RequireLoginModal,
        setRequireLoginModal,
      }}
    >
      {children}
    </ModalContext.Provider>
  );
};
