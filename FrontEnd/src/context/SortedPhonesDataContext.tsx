import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  PhonesProps,
  ChildrenProps,
  PhonesCollectionContextProps,
  SortingConfiguration,
  SortingType,
  TableData,
} from "../types/contextTypes";
import Enumerable from "linq";
import { fetchData } from "../utils/fetch";
import { getAllPhones } from "../utils/URIs";

export const SortedPhonesDataContext =
  createContext<PhonesCollectionContextProps>({
    phones: [],
    fetchPhones: () => {},
    sortBy: () => {},
    filter: () => {},
    getSortDirection: () => null,
  });

export function SortedPhonesDataProvider({ children }: ChildrenProps) {
  const [phones, setPhones] = useState<PhonesProps[]>([]);
  const [phonesFilter, setPhonesFilter] = useState<PhonesProps[]>([]);
  const [sortConfig, setSortConfig] = useState<SortingConfiguration[]>([]);

  const fetchPhones = async () => {
    const data = await fetchData(getAllPhones());
    setPhones(data.phones);
    setPhonesFilter(data.phones);
  };

  useEffect(() => {
    fetchPhones();
  }, []);

  const filter = (brand: string, price: number | string) => {
    let filteredPhones = phonesFilter;
    if (brand !== "clear") {
      filteredPhones = filteredPhones.filter(
        (el) => el.brand_name.toLowerCase() === brand.toLowerCase()
      );
    }
    if (price !== "clear") {
      filteredPhones = filteredPhones.filter(
        (el) => el.release_price < Number(price)
      );
    }
    setPhones(filteredPhones);
  };

  const sortBy = useCallback((propertyName: keyof TableData) => {
    setSortConfig((prevConfig) => {
      const configIndex = prevConfig.findIndex(
        (config) => config.propertyName === propertyName
      );
      if (configIndex > -1) {
        const currentSortType = prevConfig[configIndex].sortType;
        const updatedConfig = [...prevConfig];
        updatedConfig.splice(configIndex, 1);
        if (currentSortType === SortingType.Descending) {
          updatedConfig.push({ propertyName, sortType: SortingType.Ascending });
        }
        return updatedConfig;
      } else {
        return [
          ...prevConfig,
          { propertyName, sortType: SortingType.Descending },
        ];
      }
    });
  }, []);

  const getSortDirection = (property: keyof TableData) => {
    const config = sortConfig.find(
      (sortConfig) => sortConfig.propertyName === property
    );
    if (config) {
      return config.sortType === SortingType.Descending ? (
        <i className="bi bi-arrow-down"></i>
      ) : (
        <i className="bi bi-arrow-up"></i>
      );
    }
    return null;
  };

  const sortedRows = useMemo(() => {
    let sorted = Enumerable.from(phones).orderBy(() => 1);
    sortConfig.forEach((sortConfig) => {
      if (sortConfig.sortType === SortingType.Ascending) {
        sorted = sorted
          .thenBy((dataRow) =>
            dataRow[sortConfig.propertyName] === null ? -1 : 1
          )
          .thenBy((dataRow) => dataRow[sortConfig.propertyName]);
      } else {
        sorted = sorted
          .thenByDescending((dataRow) =>
            dataRow[sortConfig.propertyName] === null ? -1 : 1
          )
          .thenByDescending((dataRow) => dataRow[sortConfig.propertyName]);
      }
    });
    return sorted.toArray();
  }, [phones, sortConfig]);

  // useEffect(() => {
  //   if (sortedRows.length > 0) {
  //     setPhones(sortedRows);
  //   }
  // }, [sortedRows]);

  const value: PhonesCollectionContextProps = {
    phones,
    fetchPhones,
    filter,
    sortBy,
    getSortDirection,
  };

  return (
    <SortedPhonesDataContext.Provider value={value}>
      {children}
    </SortedPhonesDataContext.Provider>
  );
}
