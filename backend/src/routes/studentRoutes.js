const express = require("express");
const pool = require("../config/db");

const router = express.Router();


// ========================================
// GET ALL ACTIVE STUDENTS
// ========================================

router.get("/", async (req, res) => {

    try {

        const result = await pool.query(`
            SELECT
                id,
                student_code,
                name,
                date_of_birth,
                gender,
                parent_name,
                parent_mobile,
                address,
                joining_date,
                belt,
                batch,
                status,
                created_at
            FROM students
            ORDER BY name
        `);

        res.json({
            total_students: result.rows.length,
            students: result.rows
        });

    } catch (error) {

        console.error("Get Students Error:", error);

        res.status(500).json({
            message: "Internal server error"
        });

    }

});


// ========================================
// GET STUDENT BY ID
// ========================================

router.get("/:id", async (req, res) => {

    try {

        const { id } = req.params;

        const result = await pool.query(
            `
            SELECT
                id,
                student_code,
                name,
                date_of_birth,
                gender,
                parent_name,
                parent_mobile,
                address,
                joining_date,
                belt,
                batch,
                status,
                created_at
            FROM students
            WHERE id = $1
            `,
            [id]
        );

        if (result.rows.length === 0) {

            return res.status(404).json({
                message: "Student not found"
            });

        }

        res.json({
            student: result.rows[0]
        });

    } catch (error) {

        console.error("Get Student Error:", error);

        res.status(500).json({
            message: "Internal server error"
        });

    }

});


// ========================================
// CREATE STUDENT
// ========================================

router.post("/", async (req, res) => {

    try {

        const {
            student_code,
            name,
            date_of_birth,
            gender,
            parent_name,
            parent_mobile,
            address,
            joining_date,
            belt,
            batch
        } = req.body;


        // Validation

        if (!student_code) {

            return res.status(400).json({
                message: "student_code is required"
            });

        }

        if (!name) {

            return res.status(400).json({
                message: "name is required"
            });

        }

        if (!parent_name) {

            return res.status(400).json({
                message: "parent_name is required"
            });

        }

        if (!parent_mobile) {

            return res.status(400).json({
                message: "parent_mobile is required"
            });

        }


        // Insert student

        const result = await pool.query(
            `
            INSERT INTO students
            (
                student_code,
                name,
                date_of_birth,
                gender,
                parent_name,
                parent_mobile,
                address,
                joining_date,
                belt,
                batch
            )
            VALUES
            (
                $1, $2, $3, $4, $5,
                $6, $7, $8, $9, $10
            )
            RETURNING *
            `,
            [
                student_code,
                name,
                date_of_birth || null,
                gender || null,
                parent_name,
                parent_mobile,
                address || null,
                joining_date || null,
                belt || "WHITE",
                batch || null
            ]
        );


        res.status(201).json({

            message: "Student created successfully",

            student: result.rows[0]

        });

    } catch (error) {

        console.error("Create Student Error:", error);


        // Duplicate student code

        if (error.code === "23505") {

            return res.status(409).json({

                message:
                    "Student code already exists"

            });

        }


        res.status(500).json({

            message: "Internal server error",

            error: error.message

        });

    }

});


// ========================================
// UPDATE STUDENT
// ========================================

router.put("/:id", async (req, res) => {

    try {

        const { id } = req.params;

        const {
            name,
            date_of_birth,
            gender,
            parent_name,
            parent_mobile,
            address,
            belt,
            batch,
            status
        } = req.body;


        const result = await pool.query(
            `
            UPDATE students

            SET
                name = COALESCE($1, name),
                date_of_birth = COALESCE($2, date_of_birth),
                gender = COALESCE($3, gender),
                parent_name = COALESCE($4, parent_name),
                parent_mobile = COALESCE($5, parent_mobile),
                address = COALESCE($6, address),
                belt = COALESCE($7, belt),
                batch = COALESCE($8, batch),
                status = COALESCE($9, status)

            WHERE id = $10

            RETURNING *
            `,
            [
                name || null,
                date_of_birth || null,
                gender || null,
                parent_name || null,
                parent_mobile || null,
                address || null,
                belt || null,
                batch || null,
                status || null,
                id
            ]
        );


        if (result.rows.length === 0) {

            return res.status(404).json({
                message: "Student not found"
            });

        }


        res.json({

            message: "Student updated successfully",

            student: result.rows[0]

        });

    } catch (error) {

        console.error("Update Student Error:", error);

        res.status(500).json({

            message: "Internal server error",

            error: error.message

        });

    }

});


// ========================================
// DELETE STUDENT
// ========================================

router.delete("/:id", async (req, res) => {

    try {

        const { id } = req.params;


        const result = await pool.query(
            `
            DELETE FROM students
            WHERE id = $1
            RETURNING id, student_code, name
            `,
            [id]
        );


        if (result.rows.length === 0) {

            return res.status(404).json({
                message: "Student not found"
            });

        }


        res.json({

            message: "Student deleted successfully",

            student: result.rows[0]

        });

    } catch (error) {

        console.error("Delete Student Error:", error);

        res.status(500).json({

            message: "Internal server error"

        });

    }

});


module.exports = router;
