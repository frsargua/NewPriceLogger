import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { BrandsProvider } from "./context/BrandContext.tsx";
import { SortedPhonesDataProvider } from "./context/SortedPhonesDataContext.tsx";
import { PricesProvider } from "./context/PhonePricesContext.tsx";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <BrandsProvider>
      <PricesProvider>
        <SortedPhonesDataProvider>
          <App />
        </SortedPhonesDataProvider>
      </PricesProvider>
    </BrandsProvider>
  </React.StrictMode>
);
