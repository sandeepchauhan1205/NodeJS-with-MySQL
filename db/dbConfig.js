import mysql from "mysql";

var DBconnection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "node_apis",
});

DBconnection.connect(function (err) {
  if (err) {
    console.log("Err: ", err);
    return;
  }
  console.log("connnected as id " + DBconnection.threadId);
});

export default DBconnection;
