import { useContext, useState } from "react";
import dayjs, { Dayjs } from "dayjs";
import { useParams } from "react-router-dom";
import { MyParams } from "../../types/generalTypes";
import { createPrice } from "../../utils/URIs";
import { PricesContext } from "../../context/PhonePricesContext";
import axios from "axios";
import ErrorText from "../shared/ErrorText/index";
import { CompareContext } from "../../context/CompareContext";

export default function CreatePriceForm() {
  const { id } = useParams<keyof MyParams>() as MyParams;

  const { updatePhonePrices } = useContext(PricesContext);
  const { updateList } = useContext(CompareContext);

  const [newDate, setNewDate] = useState<Dayjs | string>(
    dayjs().format("YYYY-MM-DD")
  );
  const [price, setPrice] = useState<Number>();
  const [error, setError] = useState<string | boolean>(false);
  const [isFormVisible, setFormVisible] = useState(false);

  const selectDate = (newValue: Dayjs | null) => {
    if (newValue) {
      setNewDate(newValue.format("YYYY-MM-DD"));
    }
  };

  const handlePriceChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPrice(Number(event.target.value));
  };

  const clearStates = (): void => {
    setNewDate(dayjs());
    setPrice(0);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      await axios.post(createPrice(), {
        ModelID: Number(id),
        DateAdded: new Date(newDate.toString()).toISOString(),
        Price: Number(price),
      });

      updatePhonePrices(String(id));
      updateList(String(id));

      // Reset the form fields
      clearStates();
    } catch (err: any) {
      console.error("Error in POST request:", err);
      if (err.response?.status === 422) {
        setError(err.response.data.message);
      } else {
        setError("An unexpected error occurred. Please try again later.");
      }
    }
  };

  return (
    <>
      <div className="mb-3">
        <div className="card text-white bg-secondary mb-3">
          <div className="card-header d-flex justify-content-between align-items-center">
            <h3 className="mb-0">Add New Price</h3>
            <button
              className="btn btn-light"
              onClick={() => setFormVisible(!isFormVisible)}
            >
              {isFormVisible ? "Hide" : "Show"}
            </button>
          </div>
        </div>

        {isFormVisible && (
          <div>
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label htmlFor="date-mobile" className="form-label">
                  Date Mobile
                </label>
                <input
                  id="date-mobile"
                  type="date"
                  className="form-control"
                  required
                  value={
                    newDate
                      ? dayjs(newDate.toString()).format("YYYY-MM-DD")
                      : ""
                  }
                  onChange={(e) => selectDate(dayjs(e.target.value))}
                />
              </div>

              <div className="mb-3">
                <label htmlFor="price" className="form-label">
                  Price
                </label>
                <input
                  id="price"
                  name="price"
                  type="number"
                  className="form-control"
                  placeholder="Price"
                  onChange={handlePriceChange}
                />
              </div>

              <div className="text-center">
                <button type="submit" className="btn btn-primary">
                  Add New Price
                </button>
              </div>
            </form>
          </div>
        )}
      </div>

      {error && <ErrorText errorMessage={String(error)} />}
    </>
  );
}
