const express = require("express");
const userRouter = require("./routes/userRoute");
const noteRouter = require("./routes/noteRoutes");
const tagRouter = require("./routes/tagRoutes");
const mongoose = require("mongoose");
const app = express();
const dotenv = require("dotenv");
const cors = require("cors");
const cron = require("node-cron");
const axios = require("axios");
const fileRouter = require("./routes/fileRouters");

dotenv.config();

app.use(express.json());

app.use(cors());

app.use((req, res, next) => {
  console.log("HTTP method - " + req.method + ", URL - " + req.url);
  next();
});
app.use("/user", userRouter);
app.use("/note", noteRouter);
app.use("/tag", tagRouter);
app.use("/file", fileRouter);

app.get("/server", (req, res) => {
  res.send("Server is active!");
});

// Self-pinging job runs in every 14min btw 7AM-12AM (Active hrs)
cron.schedule("*/14 7-23 * * *", async () => {
  try {
    await axios.get(`${process.env.SERVER_URL}/server`);
    console.log("Server is active!");
  } catch (error) {
    console.log(
      "Server pinging mechanism is facing some issue:",
      error.message
    );
  }
});

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    app.listen(5000, () => {
      console.log("Server started at port no.5000");
    });
  })
  .catch((error) => console.error(error));
