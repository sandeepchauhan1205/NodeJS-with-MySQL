import bcrypt from "bcrypt";
import DBconnection from "../db/dbConfig.js";
import jwt from "jsonwebtoken";

// Create a user (Signup)
const signup = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    var userExistQuery = "select email from users where email = ?";

    const hashPassword = await bcrypt.hash(password, 10);

    DBconnection.query(userExistQuery, [email], function (err, result) {
      if (err) {
        console.log("Err", err);
        return res.status(500).send("Error Occured");
      } else {
        console.log("REs", result);
        if (result.length) {
          return res.status(200).json({
            message: "Email already Exist",
          });
        } else {
          var insertQuery =
            "insert into users(username, email, password) Values ?";
          var values = [[username, email, hashPassword]];

          DBconnection.query(insertQuery, [values], (err, result) => {
            if (err) {
              return res.status(500).json({
                message: `Error Occured ${err.message}`,
              });
            }

            if (result.affectedRows > 0) {
              const JWTtoken = jwt.sign(
                { username, email },
                process.env.JWT_SECRET_KEY
              );

              res.status(201).json({
                user: { username, email },
                token: JWTtoken,
                message: "User Registered Successfully",
              });
            } else {
              return res.status(500).json({
                message: "Something went wrong, please check inputs",
              });
            }
          });
        }
      }
    });
  } catch (error) {
    console.log("Err", error);
    res.status(500).json({
      message: "Something went wrong, please try again.",
    });
  }
};

// User Login
const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res.status(200).json({
        message: "Please Fill All Fields",
      });
    } else {
      var checkUserExist = "select * from users where email = ?";

      DBconnection.query(checkUserExist, [email], (err, result) => {
        if (err) throw err;
        else {
          console.log("res", result);
          if (result.length) {
            // user exist
            console.log("password", result[0].password);

            bcrypt.compare(password, result[0].password, (err, result) => {
              if (err) throw err;
              else {
                if (result) {
                  // Email and Password Match

                  var jwtToken = jwt.sign(
                    {
                      email: "email",
                    },
                    process.env.JWT_SECRET_KEY
                  );

                  return res.status(200).json({
                    message: "Correct Details",
                    email: email,
                    token: jwtToken,
                  });
                } else {
                  // Password doesn't match
                  return res.status(200).json({
                    message: "Invalid Login Details",
                  });
                }
              }
            });
          } else {
            return res.status(404).json({
              message: "Please Enter valid Email ID",
            });
          }
        }
      });
    }

    // return res.status(200).json({
    //   message: "All Correct",
    // });
  } catch (err) {
    console.log("Err", err);
  }
};

// user List
const list = async (req, res) => {
  res.send("Hey user list");
};

export { signup, login, list };
