import { BlurProviderProps, blurContextInterface } from "@/interfaces";
import { createContext, useState } from "react";

const initialState: blurContextInterface = {
  blur: false,
  setBlur: () => {},
};

export const BlurContext = createContext<blurContextInterface>(initialState);

export const BlurProvider: React.FC<BlurProviderProps> = ({ children }) => {
  const [blur, setBlur] = useState(false);

  return (
    <BlurContext.Provider value={{ blur, setBlur }}>
      {children}
    </BlurContext.Provider>
  );
};
