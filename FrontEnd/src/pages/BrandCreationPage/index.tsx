import * as React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { BrandsContext } from "../../context/BrandContext";
import { createBrand } from "../../utils/URIs";
import axios from "axios";
import ErrorText from "../../components/shared/ErrorText";

export default function BrandCreationPage() {
  let [newBrand, setNewBrand] = useState("");
  let [error, setError] = useState<string | boolean>(false);
  let { fetchBrands } = React.useContext(BrandsContext);

  const navigate = useNavigate();

  const handleChange = (event: React.ChangeEvent<any>) => {
    setNewBrand(event.target.value);
  };

  async function handleSubmit(e: React.ChangeEvent<any>) {
    e.preventDefault();

    try {
      console.log(newBrand)
      await axios.post(createBrand(), { brand: newBrand.toLowerCase() });
      fetchBrands();
      setError(false);
      navigate(`/`, { replace: true });
    } catch (err) {
      if (err.response.status === 422) {
        setError(err.response.data.message);
      }
    }
  }
  return (
    <>
      <div className="container" style={{ maxWidth: "600px", height: "80vh" }}>
        <div
          className="d-flex flex-column justify-content-center align-items-center"
          style={{ height: "100%" }}
        >
          <h1 className="mb-5 fw-bold">Add a new brand</h1>
          <form
            className="d-flex flex-column"
            onSubmit={handleSubmit}
            data-testid="form"
          >
            <input
              className="form-control mb-3"
              id="newBrand"
              type="text"
              data-testid="add-brand-text-field"
              aria-label="brand-input"
              placeholder="New Brand"
              required
              minLength={3}
              maxLength={15}
              step="1"
              onChange={handleChange}
            />

            {error ? <ErrorText errorMessage={error} /> : ""}
            <button
              type="submit"
              className="btn btn-primary"
              aria-label="add-brand-btn"
            >
              Add
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
