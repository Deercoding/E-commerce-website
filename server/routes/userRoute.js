import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import {
  signupValidation,
  signinNativeValidation,
} from "../utils/dbValidation.js";
import {
  checkFbId,
  checkUser,
  createFbUser,
  createUser,
  updateFbUser,
} from "../model/userDB.js";
import { redisClient } from "../model/redis.js";
import { createRole } from "../model/adminDB.js";
import cookieParser from "cookie-parser";

const router = express.Router();
router.use(cookieParser("signbyAdmin"));
router.use(express.urlencoded({ extended: true }));
router.use(express.json());
let SaltRounds = 12;

router.post("/signup", async (req, res) => {
  try {
    //check JSON
    let reqType = req[Object.getOwnPropertySymbols(req)[1]]["content-type"];
    if (reqType != "application/json") {
      return res
        .status(400)
        .json("Client Error: Only accept application/json.");
    }

    //check user input
    const { error } = signupValidation(req.body);
    if (error) {
      return res.status(400).json("Client Error:" + error.details[0].message);
    }

    //check email
    let { name, email, password } = req.body;
    let userExist = await checkUser(email);
    if (userExist.length != 0) {
      return res.status(403).json("Email Error: Email Already Exists.");
    }

    // create user
    let pepperPassword = password + process.env.BCRYPT_SECRET;
    let hashPassword = await bcrypt.hash(pepperPassword, SaltRounds);
    let createUserResult = await createUser(name, email, hashPassword);
    let userId = createUserResult[0].insertId;
    createRole(userId);

    //jwt token
    const mypayload = {
      userName: name,
      email: email,
      provider: "native",
      userId: userId,
    };
    const token = jwt.sign(mypayload, process.env.JWT_SECRET, {
      expiresIn: 3600,
    });

    let respond = {
      data: {
        access_token: token,
        access_expired: 3600,
        user: {
          id: userId,
          provider: "native",
          name: name,
          email: email,
          picture: "",
        },
      },
    };
    if (redisClient.isReady) {
      redisClient.del("profile");
      console.log("Redis deleted");
    }
    res.cookie("token", respond, { signed: true });
    return res.status(200).json(respond);
  } catch (error) {
    res.status(500).json("Server Error" );
    console.error(error);
  }
});

router.post("/signin", async (req, res) => {
  try {
    //check JSON
    let reqType = req[Object.getOwnPropertySymbols(req)[1]]["content-type"];

    if (reqType != "application/json") {
      return res
        .status(400)
        .json("Client Error: Only accept application/json.");
    }
    //check provider
    let { provider } = req.body;
    if (!provider) {
      return res.status(400).json("Client Error: Please specify provider.");
    }

    if (provider == "facebook") {
      console.log(req.body);
      console.log(req[Object.getOwnPropertySymbols(req)[1]]["content-type"]);

      let accessTOken = req.body.accessToken;
      let userID = req.body.userID;

      let response = await fetch(
        `https://graph.facebook.com/${userID}?fields=id,name,email,picture&access_token=${accessTOken}`
      );
      let access_result = await response.json();

      console.log(access_result);
      let name = access_result.name;
      let email = access_result.email;
      let picture = access_result.picture.data.url;
      let dbUserId;

      //check if email or fbid exist
      let fbExist = await checkFbId(userID);
      let emailExist = await checkUser(email);

      if ((fbExist.length == 0) & (emailExist.length > 0)) {
        console.log("a native login user");
        return res
          .status(403)
          .json(
            "Sign In Failed: Email already exist.Please sign in by your password."
          );
      }

      if ((fbExist.length == 0) & (emailExist.length == 0)) {
        console.log("a new fb user - create row");
        let createFbResult = await createFbUser(
          name,
          email,
          "",
          userID,
          picture
        );
        dbUserId = createFbResult[0].insertId;
        createRole(dbUserId);
      } else if ((fbExist.length > 0) & (emailExist.length > 0)) {
        console.log("an old fb user - update row");
        await updateFbUser(name, email, "", userID, picture);
        dbUserId = fbExist[0].id;
      }

      //create token
      const mypayload = {
        provider: provider,
        userName: name,
        email: email,
        userId: dbUserId,
      };
      const token = jwt.sign(mypayload, process.env.JWT_SECRET, {
        expiresIn: 3600,
      });

      let signinResult = {
        data: {
          access_token: token,
          access_expired: 3600,
          user: {
            id: userID,
            provider: provider,
            name: name,
            email: email,
            picture: picture,
          },
        },
      };
      console.log(signinResult);
      if (redisClient.isReady) {
        redisClient.del("profile");
        console.log("Redis deleted");
      }
      res.cookie("token", signinResult, { signed: true });
      return res.status(200).json(signinResult);
    } else if (provider == "native") {
      //Check form input
      const { error } = signinNativeValidation(req.body);
      if (error) {
        console.log(error);
        console.error(error);
        return res.status(400).json("Client Error:" + error.details[0].message);
      }

      //validate email
      let { email, password } = req.body;
      let userExist = await checkUser(email);
      if (userExist.length == 0) {
        return res
          .status(403)
          .json("Sign In Failed: Email or password incorrect.");
      }

      // validate password
      let pepperPassword = password + process.env.BCRYPT_SECRET;
      const matchPassword = await bcrypt.compare(
        pepperPassword,
        userExist[0].password
      );
      //create JWT token
      if (matchPassword) {
        const mypayload = {
          provider: provider,
          userName: userExist[0].name,
          email: userExist[0].email,
          userId: userExist[0].id,
        };
        const token = jwt.sign(mypayload, process.env.JWT_SECRET, {
          expiresIn: 3600,
        });

        let respond = {
          data: {
            access_token: token,
            access_expired: 3600,
            user: {
              id: userExist[0].id,
              provider: "native",
              name: userExist[0].name,
              email: userExist[0].email,
              picture: "",
            },
          },
        };
        console.log(respond);

        if (redisClient.isReady) {
          redisClient.del("profile");
          console.log("Redis deleted");
        }

        res.cookie("token", respond, { signed: true });
        return res.status(200).json(respond);
      } else {
        return res
          .status(403)
          .json("Sign In Failed: Email or password incorrect.");
      }
    }
  } catch (error) {
    res.status(500).json("Server Error:" + error.message);
    console.error(error.stack);
  }
});

router.get("/profile", async (req, res) => {
  console.log("success go to profile route");

  // verify user access
  if (!req.header("Authorization")) {
    return res.status(401).json("Client Error (No token) ");
  }
  let jwtResult;
  try {
    const mytoken = req.header("Authorization").replace("Bearer ", "");
    jwtResult = jwt.verify(mytoken, process.env.JWT_SECRET);
  } catch (err) {
    return res.status(403).json("Client Error (Wrong token)");
  }

  // check redis status
  if (redisClient.isReady) {
    console.log("Redis connection success");
    const redis_defualt_expriation = 3600;
    let redisProfile = await redisClient.get("profile");
    if (redisProfile != null) {
      console.log("Have Cache");
      return res.status(200).json(JSON.parse(redisProfile));
    } else {
      console.log("No Cache");
      try {
        let userInfo = await checkUser(jwtResult.email);

        let respond = {
          data: {
            provider: jwtResult.provider,
            name: userInfo[0].name,
            email: userInfo[0].email,
            picture: userInfo[0].picture,
          },
        };
        redisClient.setEx(
          "profile",
          redis_defualt_expriation,
          JSON.stringify(respond)
        );
        return res.status(200).json(respond);
      } catch (err) {
        return res.status(500).json("Server Error:" + err.message);
      }
    }
  } else {
    console.log("Redis connection fail");
    try {
      let userInfo = await checkUser(jwtResult.email);

      let respond = {
        data: {
          provider: jwtResult.provider,
          name: userInfo[0].name,
          email: userInfo[0].email,
          picture: userInfo[0].picture,
        },
      };

      await redisClient.connect();
      res.status(200).json(respond);
    } catch (err) {
      res.status(500).json("Server Error");
    }
  }
});

export default router;

router.get("/tplogin", (req, res) => {
  res.render("tplogin.ejs");
});

router.get("/signin", (req, res) => {
  res.render("nativeSignIn.ejs");
});
