import { useContext, useEffect, useState } from "react";
import CreatePriceForm from "../../components/PhonePriceChartPage/CreatePriceForm";
import TableOfPrices from "../../components/PhonePriceChartPage/TableOfPrices";
import LineChart from "../../components/PhonePriceChartPage/LineChart";
import { PricesContext } from "../../context/PhonePricesContext";
import { MyParams } from "../../types/generalTypes";
import { useParams } from "react-router-dom";
import axios from "axios";
import { getImage } from "../../utils/URIs";

export default function PhonePriceChartPage() {
  const { id, model } = useParams<keyof MyParams>() as MyParams;
  let { phonePrices, updatePhonePrices } = useContext(PricesContext);
  let [imageUrl, setImageUrl ] = useState('');

  useEffect(() => {
    if (id) {
      updatePhonePrices(id);
    }
    if(model){

      makePostRequest()
    }
    return;
  }, []);

  async function makePostRequest() {
  try {
    const response = await axios.post(getImage(), {conten:model});
  
    setImageUrl(response.data.url);
  } catch (error:any) {
    console.error('Error making POST request:', error.message);
    throw error;
  }
}

  return (
    <>
      <h1 className="text-center mb-4">{model} Prices</h1>

 <div className="mb-5 d-flex flex-wrap">
  <div className="col-lg-9 mb-3">
    <LineChart
      devaluationData={phonePrices.map((el, i, arr) => {
        return {
          x: new Date(el.DateAdded),
          y: Math.floor((el.Price / arr[0].Price) * 100),
        };
      })}
    />
  </div>
  <div className="col-lg-3">
    <img
      src={imageUrl ? imageUrl : ""}
      className="img-fluid"
      alt="Phone"
    />
  </div>
</div>

      <CreatePriceForm />
      <h3 className="mb-2">Table of Prices</h3>
      <TableOfPrices model={model ? model : "unknown"} />
    </>
  );
}
