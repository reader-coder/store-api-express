import dotenv from "dotenv";
dotenv.config();

import express from "express";
import "express-async-errors";
const app = express();

import connectDB from "./db/connectDB.mjs";
import productsRouter from "./routes/router.mjs";
import notFoundMiddleware from "./middlewares/notFound.mjs";
import errorMiddleware from "./middlewares/errorHandlerMiddleware.mjs";

//middleware
app.use(express.json());

app.get("/", (req, res) => {
  res.send('<h1>Store API</h1><a href="/api/v1/products">products route</a>');
});

app.use("/api/v1/products", productsRouter);

app.post("/api/v1/login", (req, res) => {
  const { email } = req.body;
  if (!email || email !== "admin@mail.com") {
    return res.status(403).json({
      msg: "forbidden",
    });
  }
  return res.status(200).json({
    msg: "You are authenticated",
  });
});

//products route

app.use(notFoundMiddleware);
app.use(errorMiddleware);

const port = process.env.PORT || 3000;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(port, () => {
      console.log(`Server is listening on ${port}`);
    });
  } catch (err) {
    console.log(err);
  }
};

start();
