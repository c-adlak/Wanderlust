const express = require("express");
const app = express();
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const path = require("path");
const ExpressError = require("./utils/ExpressError.js");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const user = require("./models/user.js");

const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/reviews.js");
const userRouter = require("./routes/user.js");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "/public")));
app.engine("ejs", ejsMate);
const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
main()
  .then(() => {
    console.log("connected to db");
  })
  .catch(() => {
    console.log("error while connectiong to db");
  });
async function main() {
  await mongoose.connect(MONGO_URL);
}

const sessioOptions = {
  secret: "mysuperecret",
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
  },
};

app.use(session(sessioOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(user.authenticate()));

passport.serializeUser(user.serializeUser());
passport.deserializeUser(user.deserializeUser());

app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user;
  //console.log(success);
  next();
});

app.get("/", (req, res) => {
  res.send("Hey i am root");
});

// app.get("/demouser", async (req, res) => {
//   let fakeUser = new user({
//     email: "student@gmail.com",
//     username: "delta-student",
//   });

//   let registeredUser = await user.register(fakeUser, "helloworld");
//   res.send(registeredUser);
// });

// for listing Router---------------
app.use("/listings", listingRouter);
// for review Router-----------------
app.use("/listings/:id/reviews", reviewRouter);
//for user router
app.use("/", userRouter);

app.all("*", (req, res, next) => {
  next(new ExpressError(404, "Page not found!!"));
});
app.use((err, req, res, next) => {
  const { statusCode = 500, message = "Something went wrong" } = err;
  console.log(message);
  // console.log(message);
  res.status(statusCode).render("listings/error.ejs", { err });
  //res.status(statusCode).send(message);
});
app.listen(3001, () => {
  console.log("app is listning on port 3000");
});
