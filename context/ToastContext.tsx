import { Toast } from "@/components/Units";
import { TOASTTYPES, ToastContextType } from "@/interfaces";
import React, { createContext, useCallback, useContext, useState } from "react";
import { v4 as uuidv4 } from "uuid";

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = (): ToastContextType => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [toasts, setToasts] = useState<
    { id: string; title: string; type: TOASTTYPES }[]
  >([]);

  const showToast = useCallback((title: string, type: TOASTTYPES = "info") => {
    const id = uuidv4();
    setToasts((prevToasts) => [...prevToasts, { id, title, type }]);
    setTimeout(() => {
      setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
    }, 7000);
  }, []);

  const hideToast = useCallback((id: string) => {
    setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <Toast toasts={toasts} onClose={hideToast} />
    </ToastContext.Provider>
  );
};
