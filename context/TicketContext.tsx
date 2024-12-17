import { TicketProviderProps, ticketContextInterface } from "@/interfaces";
import { createContext, useState } from "react";

const initialState: ticketContextInterface = {
  newTicketCount: 0,
  setNewTicketCount: () => {},
};

export const TicketContext =
  createContext<ticketContextInterface>(initialState);

export const TicketProvider: React.FC<TicketProviderProps> = ({ children }) => {
  const [newTicketCount, setNewTicketCount] = useState(0);

  return (
    <TicketContext.Provider value={{ newTicketCount, setNewTicketCount }}>
      {children}
    </TicketContext.Provider>
  );
};
