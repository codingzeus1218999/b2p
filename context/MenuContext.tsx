import { MenuProviderProps, menuContextInterface } from "@/interfaces";
import React, { createContext, useState } from "react";

const initialState: menuContextInterface = {
  hide: false,
  setHide: () => {},
};

export const MenuContext = createContext<menuContextInterface>(initialState);

export const MenuProvider: React.FC<MenuProviderProps> = ({ children }) => {
  const [hide, setHide] = useState(false);

  return (
    <MenuContext.Provider value={{ hide, setHide }}>
      {children}
    </MenuContext.Provider>
  );
};
