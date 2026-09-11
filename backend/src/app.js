require("dotenv").config();

const express = require("express");
const cors = require("cors");

const app = express();


// ========================================
// Middleware
// ========================================

app.use(cors());

app.use(express.json());


// ========================================
// Attendance Routes
// ========================================

const authRoutes = require("./routes/authRoutes");

const studentRoutes =
    require("./routes/studentRoutes");

const attendanceRoutes =
    require("./routes/attendanceRoutes");

app.use("/api/auth", authRoutes);

app.use(
    "/api/students",
    studentRoutes
);

app.use(
    "/api/attendance",
    attendanceRoutes
);


// ========================================
// Health Check
// ========================================

app.get("/api/health", (req, res) => {

    res.json({
        status: "UP",
        application: "Karate Academy API"
    });

});

// ========================================
// Start Server
// ========================================

const PORT = process.env.PORT || 5000;

app.listen(PORT, "0.0.0.0", () => {

    console.log(
        `Karate Academy API running on port ${PORT}`
    );

});
