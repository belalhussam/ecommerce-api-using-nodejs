const express = require("express");
const morgan = require("morgan");
const dbConnetion = require("./config/db");
const ApiError = require("./utils/apiError");
const globalError = require("./middlewares/errorMiddleware");
const app = express();
const categoryRoute = require("./routes/categroyRoutes");
const subCategoryRoute = require("./routes/subCategoryRoutes");
const brandRoute = require("./routes/brandRoutes");
const productRoute = require("./routes/productRoutes");
const userRoute = require("./routes/userRoutes");
const authRoute = require("./routes/authRoutes");
const reviewRoute = require("./routes/reviewRoutes");
const wishlistRoute = require("./routes/whishlistRoutes");
const addresseRoute = require("./routes/addresseRoute");
require("dotenv").config({ path: "config.env" });
const path = require("path");
// Middlewares
app.use(express.json());
app.use(express.static(path.join(__dirname, "uploads")));
// Connect with db
dbConnetion();
// Mount Routes
app.use("/api/v1/category", categoryRoute);
app.use("/api/v1/subCategory", subCategoryRoute);
app.use("/api/v1/brand", brandRoute);
app.use("/api/v1/product", productRoute);
app.use("/api/v1/user", userRoute);
app.use("/api/v1/auth", authRoute);
app.use("/api/v1/review", reviewRoute);
app.use("/api/v1/wishlist", wishlistRoute);
app.use("/api/v1/address", addresseRoute);
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
