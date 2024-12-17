import { ScrollProviderProps, scrollContextInterface } from "@/interfaces";
import React, { createContext, useState } from "react";

const initialState: scrollContextInterface = {
  scroll: true,
  setScroll: () => {},
};

export const ScrollContext =
  createContext<scrollContextInterface>(initialState);

export const ScrollProvider: React.FC<ScrollProviderProps> = ({ children }) => {
  const [scroll, setScroll] = useState(true);

  return (
    <ScrollContext.Provider value={{ scroll, setScroll }}>
      {children}
    </ScrollContext.Provider>
  );
};
