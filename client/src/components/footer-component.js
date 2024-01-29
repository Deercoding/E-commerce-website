import React from "react";
import { Link } from "react-router-dom";
import lineImage from "../images/line.png";
import twitterImage from "../images/twitter.png";
import facebookImage from "../images/facebook.png";

const FootComponent = () => {
  return (
    <div>
      <footer class="foot">
        <div class="foot-link">
          <p class="foot-link-text">關於STYLISH</p>
          <p class="foot-link-text">|</p>
          <p class="foot-link-text">服務條款</p>
          <p class="foot-link-text">|</p>
          <p class="foot-link-text">隱私政策</p>
          <p class="foot-link-text">|</p>
          <p class="foot-link-text">聯絡我們</p>
          <p class="foot-link-text">|</p>
          <p class="foot-link-text">FAQ</p>
        </div>
        <div class="foot-social">
          <img src={lineImage} class="logo-social"></img>
          <img src={twitterImage} class="logo-social"></img>
          <img src={facebookImage} class="logo-social"></img>
          <p class="font-rights">© 2018. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default FootComponent;
