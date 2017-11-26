var express = require("express"); // web app framework
var path = require("path"); //joins directory paths
var favicon = require("serve-favicon");
var logger = require("morgan"); //Way to log incoming traffic
var cookieParser = require("cookie-parser");
var bodyParser = require("body-parser");
var expressHbs = require("express-handlebars");

var mongoose = require("mongoose"); //object modeling for MongoDB database
var session = require("express-session");
var passport = require("passport");
var flash = require("connect-flash"); //allows for passing session flashdata messages
var validator = require("express-validator");
var MongoStore = require("connect-mongo")(session);

var index = require("./routes/index");
var user = require("./routes/user");

var app = express();

//connect to database "shopping". It will create it if not exist
mongoose.connect("localhost:27017/shopping");
require("./config/passport");

// view engine setup
app.engine(".hbs", expressHbs({ defaultLayout: "layout", extname: ".hbs" }));
app.set("view engine", ".hbs");

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false })); //Were gonna receive respond in both json and urlencoded format
app.use(validator()); //validates email and password

app.use(cookieParser());

//Enable sessions
// resave: true <- this session will be saved on the server on each request even
// if there's no change
// saveUnitialized: true <- session will be stored on the server even though it might
// have not been initiliazed
app.use(
  session({
    secret: "mysupersecret",
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({
      mongooseConnection: mongoose.connection
    }),
    cookie: {
      maxAge: 180 * 60 * 1000 //how long session should leave //3 hours
    }
  })
);
app.use(flash()); //needs session to be initialized first
app.use(passport.initialize());
app.use(passport.session()); //needs session to be initialized first // persistent login sessions
app.use(express.static(path.join(__dirname, "public"))); //Able to open static files in public folder

// makes the login status and session available in all my views
app.use((req, res, next) => {
  res.locals.login = req.isAuthenticated();
  res.locals.session = req.session;
  next();
});

app.use("/user", user);
app.use("/", index); //routes in index.js

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error("Not Found");
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
