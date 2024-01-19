import express from "express";

const router = express.Router();

// import User Routing
import Userrouter from "./userRoutes.js";

router.use("/user", Userrouter);

export default router;
