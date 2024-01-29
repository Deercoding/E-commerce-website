import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const ProductComponent = ({
  productId,
  setproductId,
  setOneColor,
  setOneVariant,
  setOneQty,
  setOnePrice,
  setOneProductName,
  setOneProductId,
}) => {
  console.log("Product page");
  let [oneProduct, setoneProduct] = useState([]);

  async function fetchData(url) {
    let result = await fetch(url);
    result = await result.json();
    return result;
  }
  console.log("ProductRoute productID:" + productId);
  //${productId.productId}

  let navigate = useNavigate();
  function checkoutClick(event) {
    setOnePrice(oneProduct.price);
    setOneProductName(oneProduct.title);
    setOneProductId(oneProduct.id);
    navigate("/checkout");
  }

  function clickColor(colorCode, event) {
    setOneColor(colorCode);
    event.target.classList.toggle("click-change");
  }

  function clickVariant(variantSize, event) {
    console.log(variantSize);
    setOneVariant(variantSize);

    event.target.classList.toggle("click-change");
  }

  function changeQty(event) {
    setOneQty(event.target.value);
    console.log(event.target.value);
  }

  const params = {};
  window.location.search
    .substring(1)
    .split("&")
    .forEach((pair) => {
      let [key, value] = pair.split("=");
      params[key] = value;
    });

  useEffect(() => {
    if (params.id) {
      setproductId(params.id);
    }
    console.log(params.id);
    console.log(productId);
    let productsUrl = `${process.env.REACT_APP_SERVER_URL}api/1.0/products/details?id=${productId}`;
    let fetchProducts = fetchData(productsUrl);
    fetchProducts.then((result) => {
      setoneProduct(result);
    });
  }, [productId, params.id]);
  console.log(oneProduct);
  //{oneProduct.title}

  return (
    <div class="one-product-container">
      {/* <div>{oneProduct.id}</div> */}
      <div class="one-product-wrap">
        <div class="product-upper">
          <div class="product-upper-image">
            <img src={oneProduct.main_image} class="one-product-image"></img>
          </div>
          <div class="product-upper-info">
            <div style={{ "font-size": "32px" }}>{oneProduct.title}</div>
            <div style={{ "font-size": "20px", color: "#BABABA" }}>
              {oneProduct.id}
            </div>
            <br />
            <div style={{ "font-size": "30px" }}>TWD.{oneProduct.price}</div>
            <hr hr style={{ width: "360px" }} />
            <br />
            <div class="detail-split">
              <div class="detail-split-1">顏色 | </div>
              <div>
                <div class="detail-split-2">
                  {oneProduct &&
                    oneProduct.colors?.map((color) => {
                      return (
                        <div
                          class="one-box"
                          onClick={(event) => clickColor(color.code, event)}
                          style={{
                            "background-color": "#" + color.code,
                          }}
                        ></div>
                      );
                    })}
                </div>
              </div>
            </div>
            <div class="detail-split">
              <div class="detail-split-1">尺寸 | </div>
              <div class="detail-split-2">
                {oneProduct &&
                  oneProduct.variants?.map((variant) => {
                    return (
                      <div class="one-size">
                        <div
                          class="one-size-text"
                          onClick={(event) => clickVariant(variant.size, event)}
                        >
                          {variant.size}
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
            <div class="detail-split">
              <div class="detail-split-1">數量 | </div>
              <div class="detail-split-2">
                <div>
                  <input
                    class="buy-qty"
                    type="number"
                    min="0"
                    onChange={(event) => {
                      changeQty(event);
                    }}
                  ></input>
                </div>
              </div>
            </div>
            <br />
            <div
              class="one-add-to-cart"
              onClick={(event) => checkoutClick(event)}
            >
              加入購物車
            </div>
            <br />
            <div class="one-detial-text">
              <div>{oneProduct.note}</div>
              <br />
              <div>{oneProduct.texture}</div>
              <br />
              <div>{oneProduct.wash}</div>
              <br />
              <div>{oneProduct.place}</div>
            </div>
          </div>
        </div>

        <div class="product-lower">
          <div class="product-story">
            <div class="story-bar-wrap">
              <div class="story-bar">更多產品資訊</div>
              <hr class="story-bar-line" />
            </div>

            <div class="one-product-story">{oneProduct.story}</div>
          </div>
          {oneProduct &&
            oneProduct.Images?.slice(0, 2).map((otherImage) => {
              return (
                <div class="one-product-picture-wrap">
                  <img src={otherImage} class="one-product-picture"></img>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
};

export default ProductComponent;
