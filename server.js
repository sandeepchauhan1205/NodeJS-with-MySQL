import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import DBconnection from "./db/dbConfig.js";

import verifyToken from "./middleware/authMiddleware.js";

import Userrouter from "./routes/userRoutes.js";

import MainRouter from "./routes/index.js";

// Set up Global Configuration access
dotenv.config();

const app = express();
const PORT = 5000 || process.env.PORT;

app.use(express.json());

// use Routing
app.use("/api", MainRouter);

// Create a User API
app.post("/api/create-user", async (req, res) => {
  const { username, email, password } = req.body;

  //   console.log("username", username);

  const hashPassword = await bcrypt.hash(password, 10);

  var sql = "Insert into users(username, email, password) Values ?";

  var values = [[username, email, hashPassword]];

  if (!username || !email || !password) {
    res.json({
      message: "Please Fill all fields!!!",
    });
  }

  DBconnection.query(sql, [values], function (err, result) {
    if (err) throw err;
    console.log("Number of records inserted: " + result.affectedRows);

    if (result.affectedRows > 0) {
      res.status(201).json({
        status: "success",
        message: "Record Inserted Successfully!",
      });
    } else {
      res.status(200).json({
        status: "error",
        message: "Something went wrong, Please check inputs",
      });
    }
  });
});

// Get all users
app.get("/api/users", (req, res) => {
  var sql = "select * from users";

  DBconnection.query(sql, function (err, result) {
    if (err) throw err;

    // console.log("Result", result);
    res.json(result);
  });
});

app.get("/createJWTToken", (req, res) => {
  let jwtSecretKey = process.env.JWT_SECRET_KEY;

  var token = jwt.sign({ userId: "sandeep" }, jwtSecretKey, {
    expiresIn: "10m",
  });
  res.status(200).json({ token });
});

// Protected Route
app.get("/protected", verifyToken, (req, res) => {
  res.status(200).json({
    message: "Protected route accessed",
  });
});

app.listen(PORT, () => {
  console.log(`Server running on PORT ${PORT}`);
});
