import * as React from "react";
import { useContext } from "react";
import { SortedPhonesDataContext } from "../../context/SortedPhonesDataContext";
import { PhonesCollectionContextProps } from "../../types/contextTypes";
import { BrandsContext } from "../../context/BrandContext";

export default function SearchFilters() {
  let { filter } = useContext(
    SortedPhonesDataContext
  ) as PhonesCollectionContextProps;
  let { brands } = useContext(BrandsContext);

  const [brand, setBrand] = React.useState<string>("clear");
  const [price, setPrice] = React.useState<string>("clear");

  const handleChangeSelect = (event: any) => {
    let { value: brandOption } = event.target;
    setBrand(brandOption as string);
    filter(brandOption, price);
  };

  const handleChangeInput = (event: React.ChangeEvent<any>) => {
    let { value: PriceInputted } = event.target;
    setPrice(PriceInputted);
    filter(brand, PriceInputted);
  };

  const handleChangeSelectPrice = (event: any) => {
    setPrice(event.target.value as string);
    let newPrice = parseInt(event.target.value);

    filter(brand, newPrice);
  };

  const clearStates = () => {
    setBrand("clear");
    setPrice("clear");
    filter("clear", "clear");
  };

  return (
    <div className="container">
      <h2 className="py-1">Filter</h2>
      <form noValidate className="d-flex align-items-end">
        <div className="me-3">
          <label htmlFor="brandSelect" className="form-label">
            Brand
          </label>
          <select
            id="brandSelect"
            className="form-select"
            value={brand}
            onChange={handleChangeSelect}
          >
            <option value="">All Brands</option>
            {brands.map((el) => (
              <option key={el.Brand} value={el.Brand}>
                {el.Brand}
              </option>
            ))}
          </select>
        </div>

        <div className="me-3">
          <label htmlFor="priceSelect" className="form-label">
            Price Range
          </label>
          <select
            id="priceSelect"
            className="form-select"
            value={price}
            onChange={handleChangeSelectPrice}
          >
            <option value="">All Prices</option>
            <option value={100}>{"< $100"}</option>
            <option value={200}>{"< $200"}</option>
            <option value={400}>{"< $400"}</option>
            <option value={1000}>{"< $1000"}</option>
          </select>
        </div>

        <div className="me-3">
          <label htmlFor="priceInput" className="form-label">
            Custom Price
          </label>
          <div className="input-group">
            <span className="input-group-text">$</span>
            <input
              id="priceInput"
              className="form-control"
              type="number"
              value={price}
              onChange={handleChangeInput}
              required
            />
          </div>
        </div>

        <button className="btn btn-primary" onClick={clearStates}>
          Clear
        </button>
      </form>
    </div>
  );
}
