//1 -requier express
const express = require("express");

//2 - create instance
const app =express();

//4 - require dotenv
require("dotenv").config();

//5 - connectN
const connectN = require("./config/connectN");
connectN();

//routing
//middleware global
app.use(express.json());

app.use((req, res, next) => {
  console.log(" Request received:", req.method, req.originalUrl);
  next();
});

//api routing
const productRoutes = require("./routes/product"); 
app.use("/api/product", productRoutes);

const userRoutes = require("./routes/user");
app.use("/api/user", userRoutes);


//3 - create port 
const port= 5000

//4 - create server 
app.listen(port, (err) =>
err ? console.log(err) : console.log(`Server running on port ${port}..`)


)