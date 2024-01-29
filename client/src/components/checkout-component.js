import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

const CheckoutComponent = ({
  setOrderNumber,
  oneColor,
  oneVariant,
  oneQty,
  onePrice,
  oneProductName,
  oneProductId,
}) => {
  console.log("Checkout page");
  console.log(oneColor, oneVariant, oneQty);

  let navigate = useNavigate();

  let formRef = useRef();
  let nameRef = useRef();
  let emailRef = useRef();
  let phoneRef = useRef();

  useEffect(() => {
    console.log(localStorage.getItem("Authorization"));

    if (localStorage.getItem("Authorization") == null) {
      navigate("/sign");
    }
    console.log(window);
    window.TPDirect.setupSDK(
      12348,
      "app_pa1pQcKoY22IlnSXq5m5WP5jFKzoRG58VEXpT7wU62ud7mMbDOGzCYIlzzLF",
      "sandbox"
    );
    window.TPDirect.card.setup({
      fields: {
        number: {
          element: ".form-control.card-number",
          placeholder: "**** **** **** ****",
        },
        expirationDate: {
          element: ".form-control.expiration-date",
          placeholder: "MM / YY",
        },
        ccv: {
          element: ".form-control.ccv",
          placeholder: "後三碼",
        },
      },
      isMaskCreditCardNumber: true,
      maskCreditCardNumberRange: {
        beginIndex: 6,
        endIndex: 11,
      },
    });

    // function submit() {
    formRef.current.addEventListener("submit", function (event) {
      event.preventDefault();
      console.log(formRef);
      const tappayStatus = window.TPDirect.card.getTappayFieldsStatus();
      console.log(tappayStatus);

      // Check TPDirect.card.getTappayFieldsStatus().canGetPrime before TPDirect.card.getPrime
      if (tappayStatus.canGetPrime === false) {
        document.getElementById("server").innerHTML =
          "Card information incorrect.";
        return;
      }

      // Get prime
      window.TPDirect.card.getPrime(function (result) {
        if (result.status !== 0) {
          console.log("get prime error " + result.msg);
          return;
        }
        console.log("Success! Prime: " + result.card.prime);
        console.log(nameRef.current.value);

        let order = {
          prime: result.card.prime,
          order: {
            shipping: "delivery",
            payment: "credit_card",
            total: onePrice,
            recipient: {
              name: nameRef.current.value,
              phone: phoneRef.current.value,
              email: emailRef.current.value,
            },
            list: [
              {
                id: oneProductId,
                name: oneProductName,
                price: onePrice,
                color: {
                  code: oneColor,
                },
                size: oneVariant,
                qty: oneQty,
              },
            ],
          },
        };
        console.log(order);

        checkout(order);
      });
    });
  }, [formRef]);

  //function
  //token setup
  function checkout(data) {
    postData(`${process.env.REACT_APP_SERVER_URL}order/checkout`, {
      data,
    })
      .then((result) => {
        console.log(result);
        if (result.data) {
          console.log(result.data.number);
          setOrderNumber(result.data.number);
          navigate("/thankyou");
        } else {
          sendData(result);
        }
      })
      .catch((result) => console.log(result));

    function sendData(result) {
      document.getElementById("server").innerHTML = JSON.stringify(result);
    }
  }

  async function postData(url, data) {
    return await fetch(url, {
      body: JSON.stringify(data),
      headers: {
        Authorization: localStorage.getItem("Authorization"),
        "Content-Type": "application/json",
      },
      method: "POST",
    }).then((response) => response.json());
  }

  return (
    <div class="checkout-wrap">
      <div id="server"></div>
      <div class="input-card">
        <div class="card-form">
          <h3>購買商品 : </h3>
          <div>ProductId: {oneProductId}</div>
          <div> Product: {oneProductName}</div>
          <div> Price: {onePrice}</div>
          <div class="detail-split-2">
            <div>Color: </div>
            <div
              class="one-box"
              style={{
                "background-color": "#" + oneColor,
              }}
            ></div>
          </div>
          <div> Variant: {oneVariant}</div>
          <div> Quantity: {oneQty}</div>
        </div>
      </div>
      <br></br>
      <div class="input-card">
        <form class="card-form" ref={formRef}>
          <h3>訂購資料</h3>
          <div class="form-group">
            <label class="control-label  ">收件人姓名</label>
            <input class="form-control" ref={nameRef} required></input>
          </div>
          <div class="form-group">
            <label class="control-label ">Email</label>
            <input class="form-control" ref={emailRef} required></input>
          </div>
          <div class="form-group">
            <label class="control-label ">電話</label>
            <input class="form-control" ref={phoneRef} required></input>
          </div>
          <br></br>
          <br></br>
          <h3>付款資料</h3>
          <div class="form-group card-number-group">
            <label for="card-number" class="control-label">
              <span id="cardtype"></span>信用卡號碼
            </label>
            <div class="form-control card-number" required></div>
          </div>
          <div class="form-group expiration-date-group">
            <label for="expiration-date" class="control-label">
              有效期限
            </label>
            <div
              class="form-control expiration-date"
              id="tappay-expiration-date"
              required
            ></div>
          </div>
          <div class="form-group ccv-group">
            <label for="ccv" class="control-label">
              安全碼
            </label>
            <div class="form-control ccv" required></div>
          </div>

          <button type="submit" class="btn btn-default">
            Pay
          </button>
        </form>
      </div>
    </div>
  );
};

export default CheckoutComponent;
