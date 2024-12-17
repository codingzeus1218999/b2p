import {
  DefaultTypeProviderProps,
  defaultTypeContextInterface,
} from "@/interfaces";
import React, { createContext, useState } from "react";

const initialState: defaultTypeContextInterface = {
  dtypeId: "",
  setDtypeId: () => {},
};

export const DefaultTypeContext =
  createContext<defaultTypeContextInterface>(initialState);

export const DefaultTypeProvider: React.FC<DefaultTypeProviderProps> = ({
  children,
}) => {
  const [dtypeId, setDtypeId] = useState("");

  return (
    <DefaultTypeContext.Provider value={{ dtypeId, setDtypeId }}>
      {children}
    </DefaultTypeContext.Provider>
  );
};
