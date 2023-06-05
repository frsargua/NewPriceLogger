import { createContext, useEffect, useState } from "react";
import { BrandsProps, BrandsContextProps } from "../types/contextTypes";
import { fetchData } from "../utils/fetch";
import { getBrands } from "../utils/URIs";

export const BrandsContext = createContext<BrandsContextProps>({
  brands: [],
  fetchBrands: () => {},
});

// type BrandsProviderProps = {
//   children: React.ReactNode;
// };

export function BrandsProvider({ children }: { children: React.ReactNode }) {
  const [brands, setBrands] = useState<BrandsProps[]>([]);

  // Function to fetch the brands data asynchronously
  async function fetchBrands() {
    const data = await fetchData(getBrands());
    setBrands(data.brands);
  }

  // useEffect hook to fetch brands data when the component mounts
  useEffect(() => {
    fetchBrands();
  }, []);

  const value: BrandsContextProps = {
    brands,
    fetchBrands,
  };

  return (
    <BrandsContext.Provider value={value}>{children}</BrandsContext.Provider>
  );
}
