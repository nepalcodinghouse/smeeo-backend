const mongoose = require("mongoose");
const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");

const authRoutes = require("./routes/auth");

dotenv.config();
const app = express();

// Allowed URLs
const allowedOrigins = [
  "http://localhost:5173",   // your frontend dev URL
  "https://smeeo.vercel.app" // production frontend URL
];

// CORS middleware with allowed origins
app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like Postman)
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) === -1) {
        const msg = `The CORS policy for this site does not allow access from the specified Origin: ${origin}`;
        return callback(new Error(msg), false);
      }
      return callback(null, true);
    },
    credentials: true, // allow cookies if needed
  })
);

app.use(express.json());
app.use("/api/auth", authRoutes);

// Connect to MongoDB (v7+)
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log(err));

// Start server
app.listen(process.env.PORT, () => console.log(`Server running on port ${process.env.PORT}`));
