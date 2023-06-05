import * as React from "react";
import { useContext } from "react";
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
  let { updatePhonePrices } = useContext(PricesContext);
  let { updateList } = useContext(CompareContext);

  const [newDate, setNewDate] = React.useState<Dayjs | string>(
    dayjs().format("YYYY-MM-DD")
  );
  const [price, setPrice] = React.useState<Number>();
  let [error, setError] = React.useState<string | boolean>(false);

  const selectDate = (newValue: Dayjs | null) => {
    if (newValue != null) {
      setNewDate(newValue.format("YYYY-MM-DD"));
    }
  };
  function handlePriceChange(event: React.ChangeEvent<any>) {
    setPrice(event.target.value as Number);
  }

  const clearStates = (): void => {
    setNewDate(dayjs());
    setPrice(0);
  };

  async function handleSubmit(event: React.ChangeEvent<any>) {
    event.preventDefault();

    try {
      await axios.post(createPrice(), {
        ModelID: parseInt(id),
        DateAdded: new Date(newDate).toISOString(),
        Price: parseInt(price),
      });

      updatePhonePrices(String(id));
      updateList(String(id));
      clearStates();
    } catch (err) {
      console.error("Error in POST request:", err);
      if (err.response.status === 422) {
        setError(err.response.data.message);
      }
    }
  }

  return (
    <>
      <h3>Add New Price</h3>
      <form onSubmit={handleSubmit} className="mb-4">
        <div>
          <label className="form-label">Date mobile</label>
          <input
            type="date"
            className="form-control"
            required
            value={newDate ? dayjs(newDate).format("YYYY-MM-DD") : ""}
            onChange={(e) => selectDate(dayjs(e.target.value))}
          />
        </div>

        <input
          className="form-control"
          id="price"
          name="price"
          type="number"
          placeholder="Price"
          onChange={handlePriceChange}
        />

        <button type="submit" className="btn btn-primary">
          Add
        </button>
      </form>

      {error ? <ErrorText errorMessage={error} /> : ""}
    </>
  );
}
