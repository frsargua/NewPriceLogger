import dayjs, { Dayjs } from "dayjs";

// Types mainly used for the brands useContext

export type BrandProps = {
  Brand: string;
};

export type BrandsProps = BrandProps;

export type BrandsContextProps = {
  brands: BrandProps[];
  fetchBrands: () => void;
  error: null | Error;
};

// Types mainly used for the comparison useContext
export type PricesComparisonProps = {
  model: number;
  id: number;
  date_added: Date;
  price: number;
  created_at: Date;
  updated_at: Date;
};
export type PricesXYProps = { x: number; y: number };

export type CompareStateProps = {
  model: string;
  prices: PricesXYProps[];
};

export type CompareContextProps = {
  arrayOfPhonePrices: CompareStateProps[];
  listOfIds: number[];
  fetchPrices: (modelId: string) => void;
  updateList: (modelId: string) => void;
  removeFromList: (modelId: string) => void;
};

// Types mainly used for the prices useContext

export type PricesProps = {
  model_id: number;
  id: number;
  date_added: Date;
  price: number;
  created_at: Date;
  updated_at: Date;
};

export type PricesContextProps = {
  phonePrices: PricesProps[];
  updatePhonePrices: (id: string) => void;
  error: null | Error;
};

// Types mainly used for the phones useContext
export type PhoneProps = {
  brand_name?: number;
  model?: string;
  price?: number;
  id?: number;
};

export type PhonesProps = {
  ID: number;
  BrandName: string;
  Model: string;
  ReleaseDate: Date;
  ReleasePrice: number;
};

export type PhonesCollectionContextProps = {
  phones: PhonesProps[];
  fetchPhones: () => void;
  filter: (brand: string, price: number | string) => void;
  sortBy: (propertyName: keyof TableData) => void;
  getSortDirection: (
    property: keyof TableData
  ) => React.ReactElement<any> | null;
};

export type ChildrenProps = {
  children?: React.ReactNode;
};

// For the URL parameters
export type TopicParams = {
  topic: string;
};

export type MyParams = {
  id?: string;
  topic?: string;
  phoneId?: string;
  model?: string;
};

// Sorting

export interface TableData {
  BrandName: string;
  ReleasePrice: string;
}

export interface SortingConfiguration {
  propertyName: keyof TableData;
  sortType: SortingType;
}

export enum SortingType {
  Ascending,
  Descending,
}

export type TableColumn = {
  label: string;
  property: keyof TableData;
};
