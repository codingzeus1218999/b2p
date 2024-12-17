import { LOCALSTORAGES } from "@/constants";
import { UserProviderProps, accountInterface } from "@/interfaces";
import { getAccount } from "@/services/accountsApi";
import {
  getDataFromLocalStorageWithExpiry,
  saveDataInLocalStorage,
} from "@/utils/calcUtils";
import { createContext, useContext, useEffect, useState } from "react";

const initialState: any = {
  user: null,
  setUser: () => {},
};

export const UserContext = createContext<any>(initialState);

export const UserProvider = ({ children }: UserProviderProps) => {
  const [user, setUser] = useState<accountInterface | null>(() => {
    if (typeof window !== "undefined") {
      const storedUser = getDataFromLocalStorageWithExpiry(LOCALSTORAGES.USER);
      return storedUser;
    }
    return null;
  });

  const fetchUserInfo = async () => {
    try {
      const user = await getAccount();
      setUser(user);
      saveDataInLocalStorage(LOCALSTORAGES.USER, user);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (typeof window !== "undefined" && window.localStorage) {
      saveDataInLocalStorage(LOCALSTORAGES.USER, user);
    }
    if (
      typeof window !== "undefined" &&
      sessionStorage.getItem("access") &&
      !user
    ) {
      fetchUserInfo();
    }
  }, [user]);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
