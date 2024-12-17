import {
  AuthModalProviderProps,
  authModalContextInterface,
} from "@/interfaces";
import { createContext, useState } from "react";

const initialState: authModalContextInterface = {
  isOpenAuthModal: false,
  defaultTab: "login",
  setIsOpenAuthModal: () => {},
  setDefaultTab: () => {},
  lastProduct: "",
  setLastProduct: () => {},
  callbackFunc: null,
  setCallbackFunc: () => {},
};

export const AuthModalContext =
  createContext<authModalContextInterface>(initialState);

export const AuthModalProvider: React.FC<AuthModalProviderProps> = ({
  children,
}) => {
  const [isOpenAuthModal, setIsOpenAuthModal] = useState(false);
  const [defaultTab, setDefaultTab] = useState<"login" | "register">("login");
  const [lastProduct, setLastProduct] = useState<string>("");
  const [callbackFunc, setCallbackFunc] = useState<Function | null>(null);

  return (
    <AuthModalContext.Provider
      value={{
        isOpenAuthModal,
        setIsOpenAuthModal,
        defaultTab,
        setDefaultTab,
        lastProduct,
        setLastProduct,
        callbackFunc,
        setCallbackFunc,
      }}
    >
      {children}
    </AuthModalContext.Provider>
  );
};
