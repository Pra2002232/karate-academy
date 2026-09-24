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

const feesRoutes = require("./routes/feesRoutes");

const beltRoutes = require("./routes/beltRoutes");

const competitionRoutes = require("./routes/competitionRoutes");

app.use("/api/competitions", competitionRoutes);

app.use("/api/belts", beltRoutes);

app.use("/api/fees", feesRoutes);

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


// =====================================================
// RESULTS & WINNERS
// =====================================================

app.get("/api/competitions/results", async (req, res) => {

    try {

        const result = await pool.query(`
            SELECT
                cr.id,
                cr.competition_id,
                cr.student_id,
                cr.category,
                cr.event,
                cr.result,
                cr.medal,
                cr.position,
                cr.remarks,

                c.competition_name,
                c.competition_date,

                s.name AS student_name,
                s.student_code

            FROM competition_results cr

            JOIN competitions c
                ON c.id = cr.competition_id

            JOIN students s
                ON s.id = cr.student_id

            ORDER BY
                c.competition_date DESC,
                cr.position ASC NULLS LAST,
                cr.id DESC
        `);

        res.json({
            results: result.rows
        });

    } catch (error) {

        console.error(
            "Results fetch error:",
            error
        );

        res.status(500).json({
            error: "Failed to fetch competition results"
        });
    }
});


app.post("/api/competitions/results", async (req, res) => {

    try {

        const {
            competition_id,
            student_id,
            category,
            event,
            result,
            medal,
            position,
            remarks
        } = req.body;

        if (
            !competition_id ||
            !student_id ||
            !result
        ) {
            return res.status(400).json({
                error:
                    "competition_id, student_id and result are required"
            });
        }

        const inserted = await pool.query(
            `
            INSERT INTO competition_results
            (
                competition_id,
                student_id,
                category,
                event,
                result,
                medal,
                position,
                remarks
            )
            VALUES
            ($1,$2,$3,$4,$5,$6,$7,$8)
            RETURNING *
            `,
            [
                competition_id,
                student_id,
                category || null,
                event || null,
                result,
                medal || null,
                position || null,
                remarks || null
            ]
        );

        res.status(201).json({
            message: "Competition result added successfully",
            result: inserted.rows[0]
        });

    } catch (error) {

        console.error(
            "Result insert error:",
            error
        );

        res.status(500).json({
            error: "Failed to add competition result"
        });
    }
});
