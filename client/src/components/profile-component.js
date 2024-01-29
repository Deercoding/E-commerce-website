import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const ProfileComponent = () => {
  console.log("Profile page");
  console.log(localStorage.getItem("Authorization"));
  let navigate = useNavigate();

  if (localStorage.getItem("Authorization") == null) {
    navigate("/sign");
  }

  async function GetwithToken(url) {
    return await fetch(url, {
      headers: {
        Authorization: localStorage.getItem("Authorization"),
        "Content-Type": "application/json",
      },
      method: "GET",
    }).then((response) => response.json());
  }

  let [profile, setProfile] = useState({
    data: { name: "", email: "", provider: "" },
  });
  useEffect(() => {
    let productsUrl = `${process.env.REACT_APP_SERVER_URL}user/profile`;
    let fetchProducts = GetwithToken(productsUrl);
    fetchProducts
      .then((result) => {
        setProfile(result);
        console.log(result);
      })
      .catch((err) => console.log(err));
  }, []);

  return (
    <div class="thankyou-wrap">
      <div>Name: {profile.data && profile.data.name}</div>
      <div>Email: {profile.data && profile.data.email}</div>
      <div>Provider: {profile.data && profile.data.provider}</div>
    </div>
  );
};

export default ProfileComponent;
