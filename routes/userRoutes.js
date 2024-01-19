import express from "express";

import verifyToken from "../middleware/authMiddleware.js";

import { signup, login, list } from "../controllers/AuthController.js";

const router = express.Router();

// User signup method
router.post("/signup", signup);

// Login method
router.post("/login", login);

// User List
router.get("/list", verifyToken, list);

// Middleware that is specific to this router
// router.use((req, res, next) => {
//   const { name, email } = req.body;
//   if (email === "sandeep@gmail.com") {
//     next();
//   } else {
//     res.json({
//       message: "Unauthorized User",
//     });
//   }

//   //   console.log("Req =>", req.body);
//   //   next();
// });

export default router;
