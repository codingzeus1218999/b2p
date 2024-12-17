import {
  DropdownOpenProviderProps,
  dropdownOpenContextInterface,
} from "@/interfaces";
import { createContext, useState } from "react";

const initialState: dropdownOpenContextInterface = {
  dropdownOpen: 0,
  setDropdownOpen: () => {},
  isSelf: false,
  setIsSelf: () => {},
};

export const DropdownOpenContext =
  createContext<dropdownOpenContextInterface>(initialState);

export const DropdownOpenProvider: React.FC<DropdownOpenProviderProps> = ({
  children,
}) => {
  const [dropdownOpen, setDropdownOpen] = useState(0);
  const [isSelf, setIsSelf] = useState(false);

  return (
    <DropdownOpenContext.Provider
      value={{ dropdownOpen, setDropdownOpen, isSelf, setIsSelf }}
    >
      {children}
    </DropdownOpenContext.Provider>
  );
};
