import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

function verifyToken(req, res, next) {
  console.log("req", req);

  const token = req.header("Authorization");

  console.log("token", token);

  if (!token) return res.status(401).json({ error: "Access denied" });

  try {
    jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decoded) => {
      if (err) throw err;
      else {
        console.log("Decoded", decoded);
        next();
      }
    });
    // req.userId = decoded.email;
    // next();
  } catch (err) {
    res.status(401).json({ error: "Invalid Token" });
  }
}

export default verifyToken;
