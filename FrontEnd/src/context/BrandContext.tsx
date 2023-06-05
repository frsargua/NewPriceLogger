import { createContext, useEffect, useState } from "react";
import { BrandsProps, BrandsContextProps } from "../types/contextTypes";
import { fetchData } from "../utils/fetch";
import { getBrands } from "../utils/URIs";

export const BrandsContext = createContext<BrandsContextProps>({
  brands: [],
  fetchBrands: () => {},
  error: null,
});

export function BrandsProvider({ children }: { children: React.ReactNode }) {
  const [brands, setBrands] = useState<BrandsProps[]>([]);
  const [error, setError] = useState<null | Error>(null);

  // Function to fetch the brands data asynchronously
  async function fetchBrands() {
    try {
      const data = await fetchData(getBrands());
      setBrands(data.brands);
    } catch (err: any) {
      setError(err);
    }
  }

  // useEffect hook to fetch brands data when the component mounts
  useEffect(() => {
    fetchBrands();
  }, []);

  const value: BrandsContextProps = {
    brands,
    fetchBrands,
    error,
  };

  return (
    <BrandsContext.Provider value={value}>{children}</BrandsContext.Provider>
  );
}
