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
  error: null,
});

export function PricesProvider({ children }: ChildrenProps) {
  const [phonePrices, setPhonePrices] = useState<PricesProps[]>([]);
  const [error, setError] = useState<null | Error>(null);

  async function fetchPrices(id: string): Promise<PricesProps[]> {
    try {
      const data = await fetchData(getAllPricesById(id));
      return data.prices;
    } catch (err: any) {
      setError(err);
      return [];
    }
  }

  async function updatePhonePrices(id: string): Promise<void> {
    const prices = await fetchPrices(id);
    setPhonePrices(prices);
  }

  const value: PricesContextProps = {
    phonePrices,
    updatePhonePrices,
    error,
  };

  return (
    <PricesContext.Provider value={value}>{children}</PricesContext.Provider>
  );
}
