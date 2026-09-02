const express = require("express");
const pool = require("../config/db");

const router = express.Router();


// ==================================================
// 1. MARK ATTENDANCE
// ==================================================

router.post("/", async (req, res) => {

    try {

        const {
            student_id,
            attendance_date,
            status,
            marked_by
        } = req.body;


        // ------------------------------
        // Validation
        // ------------------------------

        if (!student_id) {
            return res.status(400).json({
                message: "student_id is required"
            });
        }

        if (!attendance_date) {
            return res.status(400).json({
                message: "attendance_date is required"
            });
        }

        if (!status) {
            return res.status(400).json({
                message: "status is required"
            });
        }


        // ------------------------------
        // Validate attendance status
        // ------------------------------

        const allowedStatus = [
            "PRESENT",
            "ABSENT",
            "LATE"
        ];

        if (!allowedStatus.includes(status)) {

            return res.status(400).json({
                message:
                    "Invalid status. Use PRESENT, ABSENT or LATE"
            });

        }


        // ------------------------------
        // Check student
        // ------------------------------

        const studentResult = await pool.query(
            `
            SELECT
                id,
                student_code,
                name,
                parent_name,
                parent_mobile
            FROM students
            WHERE id = $1
            `,
            [student_id]
        );


        if (studentResult.rows.length === 0) {

            return res.status(404).json({
                message: "Student not found"
            });

        }


        // ------------------------------
        // Insert attendance
        // ------------------------------

        const result = await pool.query(
            `
            INSERT INTO attendance
            (
                student_id,
                attendance_date,
                status,
                marked_by
            )
            VALUES ($1, $2, $3, $4)
            RETURNING *
            `,
            [
                student_id,
                attendance_date,
                status,
                marked_by || null
            ]
        );


        // ------------------------------
        // Response
        // ------------------------------

        res.status(201).json({

            message: "Attendance marked successfully",

            student: studentResult.rows[0],

            attendance: result.rows[0]

        });

    }

    catch (error) {

        console.error("Attendance Error:", error);


        // Duplicate attendance
        if (error.code === "23505") {

            return res.status(409).json({

                message:
                    "Attendance already exists for this student on this date"

            });

        }


        res.status(500).json({

            message: "Internal server error",

            error: error.message

        });

    }

});


// ==================================================
// 2. GET ATTENDANCE FOR A DATE
// ==================================================

router.get("/date/:date", async (req, res) => {

    try {

        const { date } = req.params;


        const result = await pool.query(
            `
            SELECT

                a.id,

                s.id AS student_id,

                s.student_code,

                s.name AS student_name,

                s.parent_name,

                s.parent_mobile,

                s.belt,

                s.batch,

                a.attendance_date,

                a.status,

                a.marked_by,

                a.created_at

            FROM attendance a

            JOIN students s
                ON a.student_id = s.id

            WHERE a.attendance_date = $1

            ORDER BY s.name
            `,
            [date]
        );


        res.json({

            date: date,

            total_students: result.rows.length,

            attendance: result.rows

        });

    }

    catch (error) {

        console.error(error);

        res.status(500).json({

            message: "Internal server error"

        });

    }

});


// ==================================================
// 3. GET STUDENT ATTENDANCE HISTORY
// ==================================================

router.get("/student/:studentId", async (req, res) => {

    try {

        const { studentId } = req.params;


        const result = await pool.query(
            `
            SELECT

                a.id,

                s.student_code,

                s.name AS student_name,

                a.attendance_date,

                a.status,

                a.marked_by,

                a.created_at

            FROM attendance a

            JOIN students s
                ON a.student_id = s.id

            WHERE a.student_id = $1

            ORDER BY a.attendance_date DESC
            `,
            [studentId]
        );


        res.json({

            student_id: studentId,

            total_records: result.rows.length,

            attendance: result.rows

        });

    }

    catch (error) {

        console.error(error);

        res.status(500).json({

            message: "Internal server error"

        });

    }

});


// ==================================================
// 4. GET MONTHLY ATTENDANCE SUMMARY
// ==================================================

router.get("/summary/:studentId/:year/:month", async (req, res) => {

    try {

        const {
            studentId,
            year,
            month
        } = req.params;


        const result = await pool.query(
            `
            SELECT

                COUNT(*) AS total_days,

                COUNT(*) FILTER (
                    WHERE status = 'PRESENT'
                ) AS present_days,

                COUNT(*) FILTER (
                    WHERE status = 'ABSENT'
                ) AS absent_days,

                COUNT(*) FILTER (
                    WHERE status = 'LATE'
                ) AS late_days

            FROM attendance

            WHERE student_id = $1

            AND EXTRACT(YEAR FROM attendance_date) = $2

            AND EXTRACT(MONTH FROM attendance_date) = $3
            `,
            [
                studentId,
                year,
                month
            ]
        );


        res.json({

            student_id: studentId,

            year: year,

            month: month,

            summary: result.rows[0]

        });

    }

    catch (error) {

        console.error(error);

        res.status(500).json({

            message: "Internal server error"

        });

    }

});


module.exports = router;
