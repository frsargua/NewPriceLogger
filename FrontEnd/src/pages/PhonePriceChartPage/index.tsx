import { useContext, useEffect } from "react";
import CreatePriceForm from "../../components/PhonePriceChartPage/CreatePriceForm";
import TableOfPrices from "../../components/PhonePriceChartPage/TableOfPrices";
import LineChart from "../../components/PhonePriceChartPage/LineChart";
import { PricesContext } from "../../context/PhonePricesContext";
import { MyParams } from "../../types/generalTypes";
import { useParams } from "react-router-dom";

export default function PhonePriceChartPage() {
  const { id, model } = useParams<keyof MyParams>() as MyParams;
  let { phonePrices, updatePhonePrices } = useContext(PricesContext);

  useEffect(() => {
    if (id) {
      updatePhonePrices(id);
    }

    return;
  }, []);

  return (
    <>
      <h1 className="text-center mb-4">{model} Prices</h1>

      <div className="mb-5" style={{ height: "200px" }}>
        <LineChart
          devaluationData={phonePrices.map((el, i, arr) => {
            return {
              x: new Date(el.DateAdded),
              y: Math.floor((el.Price / arr[0].Price) * 100),
            };
          })}
        />
      </div>

      <CreatePriceForm />
      <h3 className="mb-2">Table of Prices</h3>
      <TableOfPrices model={model ? model : "unknown"} />
    </>
  );
}
