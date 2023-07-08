const express = require("express");
const userRouter = require("./routes/userRoute");
const noteRouter = require("./routes/noteRoutes");
const mongoose = require("mongoose");
const app = express();
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config();

app.use(express.json());

app.use(cors());

app.use((req, res, next) => {
  console.log("HTTP method - " + req.method + ", URL - " + req.url);
  next();
});
app.use("/user", userRouter);
app.use("/note", noteRouter);

app.get("/", (req, res) => res.send("Notes API from MyNote"));

mongoose
  .connect(
    `mongodb+srv://priyanshu_rana:Priyanshu%40Mongo@cluster0.iuhxu33.mongodb.net/notes_db?retryWrites=true`
  )
  .then(() => {
    app.listen(5000, () => {
      console.log("Server started at port no.5000");
    });
  })
  .catch((error) => console.error(error));
