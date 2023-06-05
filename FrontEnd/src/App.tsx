import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import NavigationBar from "./components/shared/NavigationBar/index";
import BrandNewsPage from "./pages/BrandNewsPage";
import PhonesDataPage from "./pages/PhonesDataPage";
import BrandCreationPage from "./pages/BrandCreationPage";
import PhonePriceChartPage from "./pages/PhonePriceChartPage";
import PhoneUpdatePage from "./pages/PhoneUpdatePage/Index";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import PriceUpdatePage from "./pages/PriceUpdatePage/PriceUpdatePage";

function App() {
  return (
    <Router>
      <NavigationBar />
      <div className="container">
        <Routes>
          <Route path="/" element={<PhonesDataPage />} />
          <Route path="/news/:topic" element={<BrandNewsPage />} />
          <Route path="/create-brand" element={<BrandCreationPage />} />
          <Route path="/create-brand" element={<BrandCreationPage />} />
          <Route path="/prices/:model/:id" element={<PhonePriceChartPage />} />
          <Route path="/update-phone/:id" element={<PhoneUpdatePage />} />
          <Route
            path="/update-price/:model/:phoneId/:id"
            element={<PriceUpdatePage />}
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
