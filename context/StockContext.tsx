import { LOCALSTORAGES } from "@/constants";
import {
  StockProviderProps,
  productStocksInterface,
  stockContextInterface,
} from "@/interfaces";
import { getDataFromLocalStorageWithExpiry } from "@/utils/calcUtils";
import { createContext, useEffect, useState } from "react";

const initialState: stockContextInterface = {
  stock: {
    id: "",
    "delivery-type": [],
    external_id: "",
    unique_external_id: "",
    type_size_id: "",
    size: "",
    size_id: "",
    store_id: "",
    weight: 0,
    price: 0,
    delivery: "",
    in_filter: false,
    delivered_at: "",
    type_size: "",
  },
  setStock: () => {},
};

export const StockContext = createContext<stockContextInterface>(initialState);

export const StockProvider: React.FC<StockProviderProps> = ({ children }) => {
  const [stock, setStock] = useState<productStocksInterface>(
    initialState.stock
  );

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedStock = getDataFromLocalStorageWithExpiry(
        LOCALSTORAGES.STOCKDATA
      );
      if (savedStock) {
        setStock(JSON.parse(savedStock) as productStocksInterface);
      }
    }
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem(LOCALSTORAGES.STOCKDATA, JSON.stringify(stock));
    }
  }, [stock]);

  return (
    <StockContext.Provider value={{ stock, setStock }}>
      {children}
    </StockContext.Provider>
  );
};
