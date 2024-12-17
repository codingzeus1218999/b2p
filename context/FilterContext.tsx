import { LOCALSTORAGES } from "@/constants";
import {
  FilterProviderProps,
  filterContextInterface,
  filterOptionInterface,
} from "@/interfaces";
import {
  getDataFromLocalStorageWithExpiry,
  saveDataInLocalStorage,
} from "@/utils/calcUtils";
import { createContext, useEffect, useState } from "react";

const initialState: filterContextInterface = {
  filterOption: {
    brands: [],
    categories: [],
    sizes: [],
    variants: [],
  },
  setFilterOption: () => {},
};

export const FilterContext =
  createContext<filterContextInterface>(initialState);

export const FilterProvider: React.FC<FilterProviderProps> = ({ children }) => {
  const getInitialFilterOption = (): filterOptionInterface => {
    if (typeof window !== "undefined" && window.localStorage) {
      const savedFilterOption = getDataFromLocalStorageWithExpiry(
        LOCALSTORAGES.FILTEROPTION
      );
      return savedFilterOption
        ? savedFilterOption
        : {
            brands: [],
            categories: [],
            sizes: [],
            variants: [],
          };
    }
    return {
      brands: [],
      categories: [],
      sizes: [],
      variants: [],
    };
  };

  const [filterOption, setFilterOption] = useState<filterOptionInterface>(
    getInitialFilterOption
  );

  useEffect(() => {
    if (typeof window !== "undefined" && window.localStorage) {
      saveDataInLocalStorage(LOCALSTORAGES.FILTEROPTION, filterOption);
    }
  }, [filterOption]);

  return (
    <FilterContext.Provider value={{ filterOption, setFilterOption }}>
      {children}
    </FilterContext.Provider>
  );
};
