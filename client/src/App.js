import React, { useEffect, useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import HomeComponent from "./components/home-component.js";
import NavComponent from "./components/nav-component.js";
import "./styles/style.css";
import FootComponent from "./components/footer-component.js";
import ProductComponent from "./components/product-component.js";
import SignComponent from "./components/sign-component.js";
import CheckoutComponent from "./components/checkout-component.js";
import ProfileComponent from "./components/profile-component.js";
import ThankComponent from "./components/thankyou-component.js";

function App() {
  console.log("App page");
  let [category, setCategory] = useState(null);
  let [search, setSearch] = useState("");
  let [logo, setlogo] = useState("");
  let [orderNumber, setOrderNumber] = useState(null);
  let [productId, setproductId] = useState(null);
  let [oneColor, setOneColor] = useState(null);
  let [oneVariant, setOneVariant] = useState(null);
  let [oneQty, setOneQty] = useState(null);
  let [onePrice, setOnePrice] = useState(null);
  let [oneProductName, setOneProductName] = useState(null);
  let [oneProductId, setOneProductId] = useState(null);

  return (
    <div>
      <NavComponent
        setCategory={setCategory}
        setSearch={setSearch}
        setlogo={setlogo}
      />
      <div className="App">
        <Routes>
          <Route
            path="/product"
            element={
              <ProductComponent
                productId={productId}
                setproductId={setproductId}
                setOneColor={setOneColor}
                setOneVariant={setOneVariant}
                setOneQty={setOneQty}
                setOnePrice={setOnePrice}
                setOneProductName={setOneProductName}
                setOneProductId={setOneProductId}
              />
            }
          />
          <Route path="/sign" element={<SignComponent />} />
          <Route
            path="/checkout"
            element={
              <CheckoutComponent
                setOrderNumber={setOrderNumber}
                oneColor={oneColor}
                oneVariant={oneVariant}
                oneQty={oneQty}
                onePrice={onePrice}
                oneProductName={oneProductName}
                oneProductId={oneProductId}
              />
            }
          />
          <Route path="/profile" element={<ProfileComponent />} />
          <Route
            path="/thankyou"
            element={<ThankComponent orderNumber={orderNumber} />}
          />
          <Route
            path="/"
            exact
            element={
              <HomeComponent
                category={category}
                search={search}
                logo={logo}
                setproductId={setproductId}
              />
            }
          />
        </Routes>
      </div>
      <FootComponent />
    </div>
  );
}

export default App;
