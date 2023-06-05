import { useContext, useState } from "react";
import { BrandsContext } from "../../context/BrandContext";
import dayjs, { Dayjs } from "dayjs";
import { SortedPhonesDataContext } from "../../context/SortedPhonesDataContext";
import axios from "axios";
import { createPhone, createPrice } from "../../utils/URIs";
import { NewPhoneProps } from "../../types/generalTypes";
import ErrorText from "../shared/ErrorText";

export default function CreatePhoneForm() {
  const { brands } = useContext(BrandsContext);
  const { fetchPhones } = useContext(SortedPhonesDataContext);
  const emptyPhoneObject = {
    BrandName: "",
    ReleaseDate: dayjs().format("YYYY-MM-DD"),
    Model: "",
    ReleasePrice: null,
  };

  const [newPhone, setNewPhone] = useState<NewPhoneProps>({
    ...emptyPhoneObject,
  });
  const [isFormVisible, setFormVisible] = useState(false);
  const [error, setError] = useState<string | boolean>(false);

  const clearStates = (): void => {
    setNewPhone({ ...emptyPhoneObject });
  };

  const handleChangeSelect = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const { value, name } = event.target;
    setNewPhone((prev) => ({ ...prev, [name]: value }));
  };

  const selectDate = (newValue: Dayjs | null) => {
    const convertedDate = new Date(newValue).toISOString();
    if (newValue != null) {
      setNewPhone((prev) => ({
        ...prev,
        ReleaseDate: convertedDate,
      }));
    }
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value, name } = event.target;
    setNewPhone((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      newPhone.ReleasePrice = parseInt(newPhone.ReleasePrice);
      const response = await axios.post(createPhone(), { ...newPhone });
      const { id, ReleaseDate, release_price } = response.data;
      fetchPhones();
      clearStates();
      await axios.post(createPrice(), {
        model_id: id,
        date_added: ReleaseDate,
        price: release_price,
      });

      setError(false);
    } catch (err) {
      if (err.response?.status === 422) {
        setError(err.response.data.message);
      }
    }
  };

  return (
    <div className="create-phone-form container  py-4  ">
      <div className="card text-white bg-dark mb-3">
        <div className="card-header d-flex justify-content-between align-items-center">
          <h2 className="mb-0">Add Phone</h2>
          <button
            className="btn btn-light"
            onClick={() => setFormVisible(!isFormVisible)}
          >
            {isFormVisible ? "Hide form" : "Show form"}
          </button>
        </div>
      </div>

      {isFormVisible && (
        <form onSubmit={handleSubmit} className="row g-3 align-items-center">
          <div className="col-md-3">
            <label htmlFor="brandSelect" className="form-label">
              Brand
            </label>
            <select
              id="brandSelect"
              className="form-select"
              value={newPhone.BrandName}
              name="BrandName"
              required
              onChange={handleChangeSelect}
            >
              <option value="">Select Brand</option>
              {brands?.map((el) => (
                <option key={el.Brand} value={el.Brand}>
                  {el.Brand}
                </option>
              ))}
            </select>
          </div>

          <div className="col-md-3">
            <label htmlFor="model" className="form-label">
              Model
            </label>
            <input
              className="form-control"
              id="model"
              name="Model"
              type="text"
              value={newPhone.Model}
              onChange={handleChange}
              required
            />
          </div>

          <div className="col-md-3">
            <label htmlFor="release_price" className="form-label">
              Price
            </label>
            <input
              className="form-control"
              id="release_price"
              name="ReleasePrice"
              type="number"
              value={newPhone.ReleasePrice ?? 0}
              onChange={handleChange}
              required
            />
          </div>

          <div className="col-md-3">
            <label htmlFor="release_date" className="form-label">
              Release Date
            </label>
            <input
              type="date"
              className="form-control"
              name="ReleaseDate"
              id="release_date"
              required
              value={
                newPhone.ReleaseDate
                  ? dayjs(newPhone.ReleaseDate).format("YYYY-MM-DD")
                  : ""
              }
              onChange={(e) => selectDate(e.target.value)}
            />
          </div>

          <div className="col-12 text-center mt-3">
            <button type="submit" className="btn btn-primary btn-lg">
              Add
            </button>
          </div>
        </form>
      )}

      {error && <ErrorText errorMessage={error} />}
    </div>
  );
}
