import React, { createContext, useState } from "react";
import {
  PricesContextProps,
  ChildrenProps,
  PricesProps,
} from "../types/contextTypes";
import { fetchData } from "../utils/fetch";
import { getAllPricesById } from "../utils/URIs";

export const PricesContext = createContext<PricesContextProps>({
  phonePrices: [],
  updatePhonePrices: () => {},
});

export function PricesProvider({ children }: ChildrenProps) {
  const [phonePrices, setPhonePrices] = useState<PricesProps[]>([]);

  async function updatePhonePrices(id: string): Promise<void> {
    const data = await fetchData(getAllPricesById(id));
    setPhonePrices(data.prices);
  }

  const value: PricesContextProps = {
    phonePrices,
    updatePhonePrices,
  };

  return (
    <PricesContext.Provider value={value}>{children}</PricesContext.Provider>
  );
}
