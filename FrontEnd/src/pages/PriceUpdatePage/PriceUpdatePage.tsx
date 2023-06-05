import * as React from "react";
import dayjs, { Dayjs } from "dayjs";
import { getAllPriceById, updatePriceById } from "../../utils/URIs";
import { MyParams } from "../../types/generalTypes";
import { useParams } from "react-router-dom";
import { fetchData } from "../../utils/fetch";
import { PricesContext } from "../../context/PhonePricesContext";
import { ChangeEvent, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import ErrorText from "../../components/shared/ErrorText/index";

export default function PriceUpdatePage() {
  const navigate = useNavigate();
  const { id, model, phoneId } = useParams<keyof MyParams>() as MyParams;
  let { updatePhonePrices } = useContext(PricesContext);
  const [newDate, setNewDate] = React.useState<Dayjs | string>(
    dayjs().format()
  );
  const [price, setPrice] = React.useState<number>(100);
  let [error, setError] = React.useState<string | boolean>(false);

  const selectDate = (selectedDate: dayjs.Dayjs) => {
    setNewDate(selectedDate);
  };

  function handlePriceChange(event: ChangeEvent<HTMLInputElement>) {
    setPrice(Number(event.target.value));
  }

  async function getSinglePrice(id: string) {
    try {
      const data = await fetchData(getAllPriceById(id));
      console.log(data);
      const { Price, DateAdded } = data.prices;
      setPrice(Price);
      setNewDate(DateAdded);
    } catch (err) {
      console.log(err);
    }
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();

    try {
      await axios.put(updatePriceById(String(id), String(model)), {
        DateAdded: new Date(newDate).toISOString(),
        Price: price,
      });

      updatePhonePrices(String(id));
      setError(false);
      navigate(`/prices/${model}/${phoneId}`, { replace: true });
    } catch (err: any) {
      if (err.response.status === 422) {
        setError(err.response.data.message);
      }
    }
  }

  React.useEffect(() => {
    getSinglePrice(String(id));
    return () => {};
  }, []);

  return (
    <>
      <div className="container-fluid">
        <div className="d-flex flex-column justify-content-center align-items-center">
          <h1 className="mb-5 fw-bold text-nowrap">Change Prices</h1>
          <form
            onSubmit={handleSubmit}
            className="d-flex flex-column"
            style={{ width: "100%" }}
          >
            <label htmlFor="price" className="form-label">
              Price
            </label>
            <input
              className="form-control"
              id="price"
              name="price"
              type="number"
              value={price}
              onChange={handlePriceChange}
            />
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
            {error ? <ErrorText errorMessage={error} /> : ""}
            <button type="submit" className="btn btn-primary  mt-3">
              Change
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
