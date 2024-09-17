const express = require("express");
const app = express();
const router = express.Router();
const session = require("express-session");
app.use(session({ secret: "mysupersecretstring" }));
app.get("/test", (req, res) => {
  res.send("test sucessfull");
});

app.listen(3000, () => {
  console.log("port is woring on 3000");
});
