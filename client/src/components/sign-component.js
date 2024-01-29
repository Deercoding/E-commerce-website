import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const SignComponent = ({}) => {
  console.log("Signin page");
  let navigate = useNavigate();

  function signin() {
    let provider = document.getElementById("provider").value;
    let email = document.getElementById("email").value;
    let password = document.getElementById("password").value;
    postData(`${process.env.REACT_APP_SERVER_URL}user/signin`, {
      provider: provider,
      email: email,
      password: password,
    })
      .then((response) => {
        if (response.data) {
          localStorage.setItem(
            "Authorization",
            "Bearer " + response.data.access_token
          );
          navigate("/profile");
        } else {
          sendData(response);
        }
      })
      .catch((err) => {
        console.log(err);
        console.log(typeof err);
        sendData(err);
      });
  }

  function signup() {
    let username = document.getElementById("signup-username").value;
    let email = document.getElementById("signup-email").value;
    let password = document.getElementById("signup-password").value;
    console.log(username, email, password);
    postData(`${process.env.REACT_APP_SERVER_URL}user/signup`, {
      name: username,
      email: email,
      password: password,
    })
      .then((response) => {
        if (response.data) {
          localStorage.setItem(
            "Authorization",
            "Bearer " + response.data.access_token
          );
          navigate("/profile");
        } else {
          sendData(response);
        }
      })
      .catch((err) => {
        console.log(err);
        sendData(err);
      });
  }

  function sendData(result) {
    document.getElementById("server").innerHTML = JSON.stringify(result);
  }

  async function postData(url, data) {
    return await fetch(url, {
      body: JSON.stringify(data),
      headers: {
        "content-type": "application/json",
      },
      method: "POST",
    }).then((response) => response.json());
  }

  return (
    <div class="sign-container-wrap">
      <div id="server"></div>
      <div class="sign-container">
        <div class="sign-form-container">
          <h1>Sign up</h1>
          <div class="mb-3">
            <label for="username" class="form-label">
              Username
            </label>
            <input
              type="text"
              class="form-control"
              id="signup-username"
            ></input>
          </div>

          <div class="mb-3">
            <label for="exampleInputEmail1" class="form-label">
              Email address
            </label>
            <input
              type="email"
              class="form-control"
              id="signup-email"
              aria-describedby="emailHelp"
            ></input>
          </div>

          <div class="mb-3">
            <label for="exampleInputPassword1" class="form-label">
              Password
            </label>
            <input
              type="password"
              class="form-control"
              id="signup-password"
            ></input>
          </div>

          <button
            type="submit"
            class="btn btn-primary"
            onClick={() => signup()}
          >
            Submit
          </button>
        </div>
        <br></br>

        <div class="sign-form-container">
          <h1>Sign in</h1>
          <div class="mb-3">
            <label for="provider" class="form-label">
              Provider
            </label>
            <input
              type="text"
              class="form-control"
              id="provider"
              value="native"
            ></input>
          </div>

          <div class="mb-3">
            <label for="exampleInputEmail1" class="form-label">
              Email address
            </label>
            <input
              type="email"
              class="form-control"
              id="email"
              aria-describedby="emailHelp"
            ></input>
          </div>

          <div class="mb-3">
            <label for="exampleInputPassword1" class="form-label">
              Password
            </label>
            <input type="password" class="form-control" id="password"></input>
          </div>

          <button
            type="submit"
            class="btn btn-primary"
            onClick={() => signin()}
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default SignComponent;
