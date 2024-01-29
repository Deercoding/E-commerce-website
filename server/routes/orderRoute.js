import express from "express";
import jwt from "jsonwebtoken";
import {
  checkOrderProduct,
  beginSQL,
  commitSQL,
  lockStock,
  addUnpaidOrder,
  updateTransaction,
  updateErrTransaction,
  updateStock,
  rollbackSQL,
  getConnection,
  releaseConnection,
} from "../model/orderDB.js";

const router = express.Router();

router.post("/checkout", async (req, res) => {
  if (!req.header("Authorization")) {
    return res.status(401).json("Client Error (No token) ");
  }
  try {
    const mytoken = req.header("Authorization").replace("Bearer ", "");
    jwt.verify(mytoken, process.env.JWT_SECRET);
  } catch (err) {
    console.log("Wrong token");
    return res.status(403).json("Client Error (Wrong token)");
  }

  let connection = await getConnection();
  try {
    //get product_varient information - Target: variant id and stock
    let requestOrder = req.body.data;
    let productColorSizes = requestOrder.order.list.map(
      (ele) => ele.id + ele.color.code + ele.size
    );

    let products = await checkOrderProduct(productColorSizes, connection);
    if (products.length == 0) {
      return res.status(400).json(`Not enough stock.`);
    }

    //check DB stock > order stock
    function compareProducts(a, b) {
      return (
        a.product_id - b.product_id || a.size - b.size || a.color - b.color
      );
    }
    function compareOrders(a, b) {
      return a.id - b.id || a.size - b.size || a.color - b.color;
    }
    products.sort(compareProducts);
    requestOrder.order.list.sort(compareOrders);

    let checkStock = [];

    for (let i = 0; i < products.length; i++) {
      requestOrder.order.list[i].variant_id = products[i].variant_id;
      if (products[i].stock < requestOrder.order.list[i].qty) {
        checkStock.push(requestOrder.order.list[i].name);
      }
    }
    if (checkStock.length > 0) {
      return res
        .status(400)
        .json(`Not enough stock for product: ${checkStock}.`);
    }

    //lock DB to update order_payment table and stock qty
    let variantsId = products.map((ele) => ele.variant_id);
    await beginSQL(connection); //begin
    await lockStock(variantsId, connection);

    //save unpaid record in DB
    let unpaidOrdernumber = await addUnpaidOrder(connection);

    //setup body for tappay
    let postBody = {
      prime: requestOrder.prime,
      partner_key:
        "partner_PHgswvYEk4QY6oy3n8X3CwiQCVQmv91ZcFoD5VrkGFXo8N7BFiLUxzeG",
      merchant_id: "AppWorksSchool_CTBC",
      details: requestOrder.order.list[0].name,
      amount: requestOrder.order.total,
      order_number: unpaidOrdernumber,
      cardholder: {
        phone_number: requestOrder.order.recipient.phone,
        name: requestOrder.order.recipient.name,
        email: requestOrder.order.recipient.email,
      },
      remember: false,
    };

    //post to tappay
    fetch("https://sandbox.tappaysdk.com/tpc/payment/pay-by-prime", {
      body: JSON.stringify(postBody),
      headers: {
        "content-type": "application/json",
        "x-api-key":
          "partner_PHgswvYEk4QY6oy3n8X3CwiQCVQmv91ZcFoD5VrkGFXo8N7BFiLUxzeG",
      },
      method: "POST",
    })
      .then((response) => response.json())
      .then(async (data) => {
        if (data.status == 0) {
          //3-4: Success save to order_payment table, decrease stock, commit
          await updateTransaction(
            "paid",
            data.status,
            data.msg,
            data.amount,
            data.acquirer,
            data.currency,
            data.rec_trade_id,
            data.bank_transaction_id,
            data.auth_code,
            unpaidOrdernumber,
            connection
          );

          //use loop - cannot use forEach for async function
          for (let i = 0; i < requestOrder.order.list.length; i++) {
            let order = requestOrder.order.list[i];
            await updateStock(order.qty, order.variant_id, connection);
          }

          await commitSQL(connection);
          await releaseConnection(connection);

          return res.status(200).json({
            data: {
              number: unpaidOrdernumber,
            },
          });
        } else {
          //3-5: Fail save to order_payment table, commit
          await updateErrTransaction(
            "error",
            data.status,
            data.msg,
            data.rec_trade_id,
            data.bank_result_code,
            data.back_result_msg,
            unpaidOrdernumber,
            connection
          );

          await commitSQL(connection); //unlock
          await releaseConnection(connection);
          return res.status(400).json(`Order Error: ${data.msg}`);
        }
      })
      .catch(async (error) => {
        await rollbackSQL(connection); //Server error - rollback
        await releaseConnection(connection);
        console.error(error);
        return res.status(500).json("Server Error.");
      });
  } catch (error) {
    await rollbackSQL(connection); //Server error - rollback
    await releaseConnection(connection);
    console.error(error);
    res.status(500).json("Server Error.");
  }
});

export default router;
