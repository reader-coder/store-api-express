import dotenv from "dotenv";
dotenv.config();
import connectDB from "./db/connectDB.mjs";
import product from "./models/product.mjs";
import products from "./products.json" assert { type: "json" };

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    await product.deleteMany();
    await product.create(products);
    console.log("success");
    process.exit(0);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

start();
