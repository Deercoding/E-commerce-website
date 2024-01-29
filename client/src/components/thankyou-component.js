import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const ThankComponent = (orderNumber) => {
  console.log("Thank page");
  console.log(orderNumber);
  console.log(orderNumber.orderNumber);

  return (
    <div class="thankyou-wrap">
      <p>
        Thank you for puschasing. Your order number is:{" "}
        {orderNumber.orderNumber}
      </p>
    </div>
  );
};

export default ThankComponent;
