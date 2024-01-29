import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const HomeComponent = ({ category, search, logo, setproductId }) => {
  console.log("Home page");
  let [campaignStory, setCampaignStory] = useState(null);
  let [campaignPicture, setCampaignPicture] = useState(null);
  let [products, setProducts] = useState([1]);

  async function fetchData(url) {
    let result = await fetch(url);
    result = await result.json();
    return result;
  }

  let navigate = useNavigate();
  function productClick(productId) {
    setproductId(productId);
    navigate(`/product?id=${productId}`);
  }
  //<Link to={`/product?id=${product.id}`}></Link>

  useEffect(() => {
    let productsUrl;
    if (category) {
      productsUrl = `${process.env.REACT_APP_SERVER_URL}api/1.0/products/${category}?paging=0`;
    } else if (search) {
      productsUrl = `${process.env.REACT_APP_SERVER_URL}api/1.0/products/search?keyword=${search}`;
    } else if (logo) {
      productsUrl = `${process.env.REACT_APP_SERVER_URL}api/1.0/products/all?paging=0`;
    } else {
      productsUrl = `${process.env.REACT_APP_SERVER_URL}api/1.0/products/all?paging=0`;
    }

    let fetchCampaigns = fetchData(
      `${process.env.REACT_APP_SERVER_URL}api/1.0/marketing/campaigns`
    );

    let fetchProducts = fetchData(productsUrl);

    fetchCampaigns.then((result) => {
      setCampaignStory(result[0].story);
      setCampaignPicture(result[0].picture);
    });

    fetchProducts.then((result) => {
      //console.log(result.data);
      setProducts(result.data);
    });
  }, [search, category, logo]);

  return (
    <div class="home-body">
      {/* <div>
        <p>{category}</p>
        <p>{search}</p>
      </div> */}

      <div class="campaign-all">
        <img src={campaignPicture} class="campaign-image" />
        <div class="campaign-text-wrap">
          <p class="campaign-text">{campaignStory}</p>
        </div>
      </div>

      <div class="product-all">
        <div class="product-row12">
          <div class="row product-row1">
            {products &&
              products.slice(0, 3)?.map((product) => {
                return (
                  <div class="product" onClick={() => productClick(product.id)}>
                    <img src={product.main_image} class="product-image"></img>
                    <div class="product-info">
                      <div class="color">
                        {product.colors?.map((color) => {
                          return (
                            <div
                              class="box"
                              style={{
                                "background-color": "#" + color.code,
                              }}
                            ></div>
                          );
                        })}
                      </div>
                      <div class="product-info-text">{product.title}</div>
                      <div class="product-info-text">
                        {"TWD. " + product.price}
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
          <div class="row product-row2">
            {products &&
              products.slice(3, 6)?.map((product) => {
                return (
                  <div class="product" onClick={() => productClick(product.id)}>
                    <img src={product.main_image} class="product-image"></img>
                    <div class="product-info">
                      <div class="color">
                        {product.colors?.map((color) => {
                          return (
                            <div
                              class="box"
                              style={{
                                "background-color": "#" + color.code,
                              }}
                            ></div>
                          );
                        })}
                      </div>
                      <div class="product-info-text">{product.title}</div>
                      <div class="product-info-text">
                        {"TWD. " + product.price}
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeComponent;
