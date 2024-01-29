import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import cartImage from "../images/cart.png";
import memberImage from "../images/member.png";
import logoImage from "../images/logo.png";
import searchImage from "../images/search.png";

const NavComponent = ({ setCategory, setSearch, setlogo }) => {
  const [searchWord, setSearchWord] = useState(""); // State to manage the search input

  function handleInputChange(e) {
    setSearchWord(e.target.value);
  }

  let navigate = useNavigate();
  function categoryClick(category) {
    setCategory(category);
    navigate("/");
  }

  function searchClick() {
    setSearch(searchWord);
    setCategory(null);
    navigate("/");
  }
  function logoClick() {
    setlogo("logo");
    setSearch(null);
    setCategory(null);
    navigate("/");
  }

  function sign() {
    navigate("/sign");
  }

  return (
    <nav>
      <div class="nav">
        <div class="nav-content-all">
          <div class="nav-category-wrap">
            <img
              src={logoImage}
              class="nav-logo"
              onClick={() => logoClick()}
            ></img>
            <div onClick={() => categoryClick("women")} class="nav-category">
              女&nbsp;&nbsp;&nbsp;裝
            </div>
            <p class="nav-category">|</p>
            <div onClick={() => categoryClick("men")} class="nav-category">
              男&nbsp;&nbsp;&nbsp;裝
            </div>
            <p class="nav-category">|</p>
            <div
              onClick={() => categoryClick("accessories")}
              class="nav-category"
            >
              配&nbsp;&nbsp;&nbsp;件
            </div>
          </div>

          <div class="nav-search-wrap">
            <form class="search-form" role="search">
              <input type="search" onChange={handleInputChange} />
              <button type="button" onClick={searchClick} class="nav-button">
                <img
                  src={searchImage}
                  alt="buttonpng"
                  border="0"
                  class="nav-button-img"
                />
              </button>
            </form>
            <img src={cartImage} class="nav-icon"></img>
            <img
              src={memberImage}
              class="nav-icon"
              onClick={sign}
              style={{ cursor: "pointer" }}
            ></img>
          </div>
        </div>
        <div class="nav-block"></div>
      </div>
    </nav>
  );
};

export default NavComponent;
