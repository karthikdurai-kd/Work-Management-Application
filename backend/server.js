const express = require("express");
const app = express();
const path = require("path");
require("dotenv").config();
const connectMongoDB = require("./config/dbConnection");
const globalErrorHandler = require("./middlewares/globalErrorHandler");
const userRoutes = require("./routes/userRoutes");
const projectRoutes = require("./routes/projectRoutes");
const taskRoutes = require("./routes/taskRoutes");
const notificationRoutes = require("./routes/notificationRoutes");

// Connection to MongoDB Database
connectMongoDB();

// Middlewares
app.use(express.json()); // For accepting "req.body" data sent from front-end
app.use(express.urlencoded({ extended: false })); // For accept form data from front-end

// Routes
// 1. User Routes
app.use("/api/users", userRoutes);
// 2. Project Routes
app.use("/api/projects", projectRoutes);
// 3. Task Routes
app.use("/api/tasks", taskRoutes);
// 4. Notification Routes
app.use("/api/notifications", notificationRoutes);

// Deployment Configuration
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "/client/build")));
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "client", "build", "index.html"));
  });
}

// Error Handling - Using globalErrorHandler.js file
app.use(globalErrorHandler);

// Start Server
const port = process.env.PORT || 5001;
app.listen(port, () => {
  console.log(`Server is listening at Port ${port}`);
});
