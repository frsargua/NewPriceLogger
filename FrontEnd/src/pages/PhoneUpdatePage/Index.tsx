import * as React from "react";
import { useContext, useEffect, useState } from "react";
import { BrandsContext } from "../../context/BrandContext";
import { SortedPhonesDataContext } from "../../context/SortedPhonesDataContext";
import { useParams, useNavigate } from "react-router-dom";
import { MyParams, UpdatePhoneProps } from "../../types/generalTypes";
import axios from "axios";
import ErrorText from "../../components/shared/ErrorText";
import { fetchData } from "../../utils/fetch";
import { getPhoneById, updatePhoneById } from "../../utils/URIs";

export default function PhoneUpdatePage() {
  const navigate = useNavigate();
  const { id } = useParams<keyof MyParams>() as MyParams;
  const { brands } = useContext(BrandsContext);
  const { fetchPhones } = React.useContext(SortedPhonesDataContext);

  const [phoneFields, setPhoneFields] = useState<UpdatePhoneProps>({
    BrandName: "",
    Model: "",
    ReleasePrice: 0,
  });

  const [error, setError] = useState<string | boolean>(false);

  const handleChangeSelect = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const { value, name } = event.target;
    setPhoneFields((prev) => ({ ...prev, [name]: value }));
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value, name } = event.target;
    if (name == "ReleasePrice") {
      setPhoneFields((prev) => ({ ...prev, [name]: Number(value) }));
    } else {
      setPhoneFields((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      if (id) {
        const response = await axios.put(
          updatePhoneById(id),
          { ...phoneFields },
          { withCredentials: true }
        );
        console.log(response);

        fetchPhones();
        navigate(`/`, { replace: true });
      } else {
        throw new Error("id not provided");
      }
    } catch (err: any) {
      if (err.response?.status === 422) {
        setError(err.response.data.message);
      } else {
        setError(err.response.data);
      }
    }
  };

  const getSinglePhone = async (id: string) => {
    try {
      const response = await fetchData(getPhoneById(id));

      const { BrandName, Model, ReleasePrice } = response.phone;

      setPhoneFields({ BrandName, Model, ReleasePrice });
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    getSinglePhone(String(id));
  }, [id]);

  return (
    <div className="container-fluid">
      <div className="d-flex flex-column justify-content-center align-items-center">
        <h1 className="mb-5 fw-bold">Change Details</h1>
        <form
          onSubmit={handleSubmit}
          className="d-flex flex-column"
          style={{ width: "100%" }}
        >
          <label htmlFor="brand" className="form-label">
            Brand
          </label>
          <select
            id="brand"
            className="form-select"
            value={phoneFields.BrandName}
            name="BrandName"
            onChange={handleChangeSelect}
          >
            <option value="">Select Brand</option>
            {brands.map((el, i) => (
              <option key={i} value={el.Brand}>
                {el.Brand}
              </option>
            ))}
          </select>

          <label htmlFor="model" className="form-label">
            Model
          </label>
          <input
            className="form-control"
            id="model"
            name="Model"
            type="text"
            value={phoneFields.Model}
            onChange={handleChange}
          />

          <label htmlFor="release_price" className="form-label">
            Price
          </label>
          <input
            className="form-control"
            id="release_price"
            name="ReleasePrice"
            type="text"
            min={10}
            value={phoneFields.ReleasePrice}
            onChange={handleChange}
          />
          <button type="submit" className="btn btn-primary mt-3">
            Change
          </button>

          {error && <ErrorText errorMessage={error} />}
        </form>
      </div>
    </div>
  );
}
