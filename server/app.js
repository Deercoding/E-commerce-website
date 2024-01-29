import express from "express";
import path from "path";
import url from "url";
import authRoute from "./routes/userRoute.js";
import adminRoute from "./routes/adminRoute.js";
import orderRoute from "./routes/orderRoute.js";
import apiRouter from "./routes/apiRoute.js";
import { processQueue } from "./queue/queue.js";

const filename = url.fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);
setInterval(processQueue, 10000);

const app = express();
app.set("views", "./views");
app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/api", apiRouter);
app.use("/admin", adminRoute);
app.use("/user", authRoute);
app.use("/order", orderRoute);

app.use(express.static(path.join(dirname, "public")));
app.get("/*", (req, res) => {
  res.sendFile(path.resolve(dirname, "public", "index.html"));
});

app.listen(8080, () => {
  console.log("Server is running on prt 8080");
});
