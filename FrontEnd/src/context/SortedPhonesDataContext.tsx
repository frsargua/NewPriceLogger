import {
  createContext,
  useCallback,
  useMemo,
  useEffect,
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
import { fetchData } from "../utils/fetch";
import { getAllPhones } from "../utils/URIs";
import Enumerable from "linq";

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
  const [error, setError] = useState<string | null>(null);

  const fetchPhones = async () => {
    try {
      const data = await fetchData(getAllPhones());
      setPhones(data.phones);
      setPhonesFilter(data.phones);
    } catch (err) {
      setError("Failed to fetch phones");
    }
  };

  useEffect(() => {
    fetchPhones();
  }, []);

  const filter = (brand: string, price: number | string) => {
    let filteredPhones = phonesFilter;
    if (brand !== "clear") {
      filteredPhones = filteredPhones.filter(
        (el) => el.BrandName.toLowerCase() === brand.toLowerCase()
      );
    }
    if (price !== "clear") {
      filteredPhones = filteredPhones.filter(
        (el) => el.ReleasePrice < Number(price)
      );
    }
    setPhones(filteredPhones);
  };

  const sortBy = useCallback((propertyName: keyof TableData) => {
    // Update the sort configuration state
    setSortConfig((prevConfig) => {
      // Check if there's already a configuration for the given property
      const existingConfigIndex = prevConfig.findIndex(
        (config) => config.propertyName === propertyName
      );

      if (existingConfigIndex > -1) {
        const currentSortType = prevConfig[existingConfigIndex].sortType;

        const updatedConfig = [...prevConfig];

        updatedConfig.splice(existingConfigIndex, 1);

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
    const sortPropertyConfig = sortConfig.find(
      (config) => config.propertyName === property
    );

    if (sortPropertyConfig) {
      if (sortPropertyConfig.sortType === SortingType.Descending) {
        return <i className="bi bi-arrow-down"></i>;
      } else {
        return <i className="bi bi-arrow-up"></i>;
      }
    }

    return null;
  };

  const sorted = useMemo(() => {
    // Start with all phones, ordering them with a constant so they remain in their original order
    let sortedPhones = Enumerable.from(phones).orderBy(() => 1);

    // Iterate over each configuration in the sort config array
    sortConfig.forEach((currentSortConfig) => {
      if (currentSortConfig.sortType === SortingType.Ascending) {
        sortedPhones = sortedPhones
          .thenBy((dataRow) =>
            dataRow[currentSortConfig.propertyName] === null ? -1 : 1
          )
          .thenBy((dataRow) => dataRow[currentSortConfig.propertyName]);
      } else {
        sortedPhones = sortedPhones
          .thenByDescending((dataRow) =>
            dataRow[currentSortConfig.propertyName] === null ? -1 : 1
          )
          .thenByDescending(
            (dataRow) => dataRow[currentSortConfig.propertyName]
          );
      }
    });

    return sortedPhones.toArray();
  }, [sortConfig]);

  useEffect(() => {
    if (sorted.length > 0) {
      setPhones(sorted);
    }
  }, [sorted]);

  const value: PhonesCollectionContextProps = {
    phones,
    fetchPhones,
    filter,
    sortBy,
    getSortDirection,
  };

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <SortedPhonesDataContext.Provider value={value}>
      {children}
    </SortedPhonesDataContext.Provider>
  );
}
