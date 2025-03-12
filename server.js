const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const compression = require("compression");
const { rateLimit } = require("express-rate-limit");
const hpp = require("hpp");
const dbConnetion = require("./config/db");
const ApiError = require("./utils/apiError");
const globalError = require("./middlewares/errorMiddleware");
const app = express();
const mountRoutes = require("./routes/index");
require("dotenv").config({ path: "config.env" });
const path = require("path");
// Middlewares
app.use(express.json({ limit: "20kb" }));
app.use(express.static(path.join(__dirname, "uploads")));
app.use(cors());
app.options("*", cors());
app.use(compression());
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
  message: "too many accounts from this IP ,please try again after an hour",
});

// Apply the rate limiting middleware to all requests.
app.use("/api", limiter);
app.use(hpp());
// Connect with db
dbConnetion();
// Mount Routes
mountRoutes(app);
app.all("*", (req, res, next) => {
  next(new ApiError(`Can't find this route: ${req.originalUrl}`, 400));
});

if (process.env.NODEENV == "development") {
  app.use(morgan("dev"));
  console.log(`mode :${process.env.NODE_ENV}`);
}

// Global error handling middleware for express
app.use(globalError);

const port = process.env.PORT || 8000;
const server = app.listen(port, () => {
  console.log("server is hosting");
});
// Handle rejection outside express
process.on("unhandledRejection", (err) => {
  console.error(`UnhandledRejection Errors: ${err.name} | ${err.message}`);
  server.close(() => {
    console.error(`Shutting down....`);
    process.exit(1);
  });
});
