const express = require("express");
const userRouter = require("./routes/userRoute");
const noteRouter = require("./routes/noteRoutes");
const tagRouter = require("./routes/tagRoutes");
const mongoose = require("mongoose");
const app = express();
const dotenv = require("dotenv");
const cors = require("cors");
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

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    app.listen(5000, () => {
      console.log("Server started at port no.5000");
    });
  })
  .catch((error) => console.error(error));
