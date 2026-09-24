const express = require("express");
const router = express.Router();
const pool = require("../config/db");

/*
|--------------------------------------------------------------------------
| GET ALL COMPETITIONS
|--------------------------------------------------------------------------
*/
router.get("/", async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT
                c.id,
                c.competition_name,
                c.competition_date,
                c.location,
                c.organizer,
                c.description,
                c.created_at,
                COUNT(cp.id)::int AS registered_students
            FROM competitions c
            LEFT JOIN competition_participants cp
                ON c.id = cp.competition_id
                AND cp.registration_status != 'CANCELLED'
            GROUP BY c.id
            ORDER BY c.competition_date ASC
        `);

        res.json({
            competitions: result.rows
        });

    } catch (error) {
        console.error("Get competitions error:", error);
        res.status(500).json({
            message: "Failed to fetch competitions"
        });
    }
});


/*
|--------------------------------------------------------------------------
| GET COMPETITION DASHBOARD
|--------------------------------------------------------------------------
*/
router.get("/dashboard", async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT
                COUNT(*) FILTER (
                    WHERE competition_date >= CURRENT_DATE
                )::int AS upcoming_competitions,

                COUNT(*) FILTER (
                    WHERE competition_date < CURRENT_DATE
                )::int AS completed_competitions
            FROM competitions
        `);

        const registrations = await pool.query(`
            SELECT COUNT(*)::int AS total_registrations
            FROM competition_participants
            WHERE registration_status != 'CANCELLED'
        `);

        res.json({
            upcoming_competitions:
                result.rows[0].upcoming_competitions,

            completed_competitions:
                result.rows[0].completed_competitions,

            total_registrations:
                registrations.rows[0].total_registrations
        });

    } catch (error) {
        console.error("Competition dashboard error:", error);

        res.status(500).json({
            message: "Failed to load competition dashboard"
        });
    }
});

/*
|--------------------------------------------------------------------------
| GET ALL COMPETITION RESULTS
|--------------------------------------------------------------------------
*/
router.get("/results", async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT
                cr.id,
                cr.competition_id,
                c.competition_name,
                c.competition_date,
                c.location,
                cr.student_id,
                s.student_code,
                s.name,
                s.belt,
                cr.category,
                cr.event,
                cr.result,
                cr.medal,
                cr.position,
                cr.remarks
            FROM competition_results cr
            JOIN students s
                ON cr.student_id = s.id
            JOIN competitions c
                ON cr.competition_id = c.id
            ORDER BY
                c.competition_date DESC,
                cr.position NULLS LAST,
                s.name ASC
        `);

        res.json({
            results: result.rows
        });

    } catch (error) {
        console.error("Get all competition results error:", error);

        res.status(500).json({
            message: "Failed to fetch competition results"
        });
    }
});


/*
|--------------------------------------------------------------------------
| GET SINGLE COMPETITION
|--------------------------------------------------------------------------
*/
router.get("/:id", async (req, res) => {
    try {
        const { id } = req.params;

        const competition = await pool.query(`
            SELECT
                c.id,
                c.competition_name,
                c.competition_date,
                c.location,
                c.organizer,
                c.description,
                c.created_at
            FROM competitions c
            WHERE c.id = $1
        `, [id]);

        if (competition.rows.length === 0) {
            return res.status(404).json({
                message: "Competition not found"
            });
        }

        const participants = await pool.query(`
            SELECT
                cp.id,
                cp.student_id,
                s.student_code,
                s.name,
                s.belt,
                cp.category,
                cp.event,
                cp.registration_status,
                cp.fee_status,
                cp.registered_at,
                cp.remarks
            FROM competition_participants cp
            JOIN students s
                ON cp.student_id = s.id
            WHERE cp.competition_id = $1
            ORDER BY s.name ASC
        `, [id]);

        res.json({
            competition: competition.rows[0],
            participants: participants.rows
        });

    } catch (error) {
        console.error("Get competition error:", error);

        res.status(500).json({
            message: "Failed to fetch competition"
        });
    }
});


/*
|--------------------------------------------------------------------------
| CREATE COMPETITION
|--------------------------------------------------------------------------
*/
router.post("/", async (req, res) => {
    try {
        const {
            competition_name,
            competition_date,
            location,
            organizer,
            description
        } = req.body;

        if (!competition_name || !competition_date) {
            return res.status(400).json({
                message: "Competition name and date are required"
            });
        }

        const result = await pool.query(`
            INSERT INTO competitions (
                competition_name,
                competition_date,
                location,
                organizer,
                description
            )
            VALUES ($1, $2, $3, $4, $5)
            RETURNING *
        `, [
            competition_name,
            competition_date,
            location || null,
            organizer || null,
            description || null
        ]);

        res.status(201).json({
            message: "Competition created successfully",
            competition: result.rows[0]
        });

    } catch (error) {
        console.error("Create competition error:", error);

        res.status(500).json({
            message: "Failed to create competition"
        });
    }
});


/*
|--------------------------------------------------------------------------
| UPDATE COMPETITION
|--------------------------------------------------------------------------
*/
router.put("/:id", async (req, res) => {
    try {
        const { id } = req.params;

        const {
            competition_name,
            competition_date,
            location,
            organizer,
            description
        } = req.body;

        const result = await pool.query(`
            UPDATE competitions
            SET
                competition_name = $1,
                competition_date = $2,
                location = $3,
                organizer = $4,
                description = $5
            WHERE id = $6
            RETURNING *
        `, [
            competition_name,
            competition_date,
            location || null,
            organizer || null,
            description || null,
            id
        ]);

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: "Competition not found"
            });
        }

        res.json({
            message: "Competition updated successfully",
            competition: result.rows[0]
        });

    } catch (error) {
        console.error("Update competition error:", error);

        res.status(500).json({
            message: "Failed to update competition"
        });
    }
});


/*
|--------------------------------------------------------------------------
| DELETE COMPETITION
|--------------------------------------------------------------------------
*/
router.delete("/:id", async (req, res) => {
    try {
        const { id } = req.params;

        const result = await pool.query(`
            DELETE FROM competitions
            WHERE id = $1
            RETURNING id
        `, [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: "Competition not found"
            });
        }

        res.json({
            message: "Competition deleted successfully"
        });

    } catch (error) {
        console.error("Delete competition error:", error);

        res.status(500).json({
            message: "Failed to delete competition"
        });
    }
});


/*
|--------------------------------------------------------------------------
| REGISTER STUDENT
|--------------------------------------------------------------------------
*/
router.post("/:competitionId/register", async (req, res) => {
    try {
        const { competitionId } = req.params;

        const {
            student_id,
            category,
            event,
            remarks
        } = req.body;

        if (!student_id) {
            return res.status(400).json({
                message: "Student is required"
            });
        }

        const competition = await pool.query(`
            SELECT id
            FROM competitions
            WHERE id = $1
        `, [competitionId]);

        if (competition.rows.length === 0) {
            return res.status(404).json({
                message: "Competition not found"
            });
        }

        const student = await pool.query(`
            SELECT id, name
            FROM students
            WHERE id = $1
            AND status = 'ACTIVE'
        `, [student_id]);

        if (student.rows.length === 0) {
            return res.status(404).json({
                message: "Active student not found"
            });
        }

        const result = await pool.query(`
            INSERT INTO competition_participants (
                competition_id,
                student_id,
                category,
                event,
                registration_status,
                fee_status,
                remarks
            )
            VALUES ($1, $2, $3, $4, 'REGISTERED', 'PENDING', $5)
            RETURNING *
        `, [
            competitionId,
            student_id,
            category || null,
            event || null,
            remarks || null
        ]);

        res.status(201).json({
            message: "Student registered successfully",
            participant: result.rows[0]
        });

    } catch (error) {

        if (error.code === "23505") {
            return res.status(409).json({
                message:
                    "Student is already registered for this competition and event"
            });
        }

        console.error("Register student error:", error);

        res.status(500).json({
            message: "Failed to register student"
        });
    }
});


/*
|--------------------------------------------------------------------------
| UPDATE REGISTRATION
|--------------------------------------------------------------------------
*/
router.put("/registration/:id", async (req, res) => {
    try {
        const { id } = req.params;

        const {
            category,
            event,
            registration_status,
            fee_status,
            remarks
        } = req.body;

        const result = await pool.query(`
            UPDATE competition_participants
            SET
                category = $1,
                event = $2,
                registration_status = $3,
                fee_status = $4,
                remarks = $5
            WHERE id = $6
            RETURNING *
        `, [
            category || null,
            event || null,
            registration_status,
            fee_status,
            remarks || null,
            id
        ]);

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: "Registration not found"
            });
        }

        res.json({
            message: "Registration updated successfully",
            participant: result.rows[0]
        });

    } catch (error) {
        console.error("Update registration error:", error);

        res.status(500).json({
            message: "Failed to update registration"
        });
    }
});


/*
|--------------------------------------------------------------------------
| GET COMPETITION RESULTS
|--------------------------------------------------------------------------
*/
router.get("/:competitionId/results", async (req, res) => {
    try {
        const { competitionId } = req.params;

        const result = await pool.query(`
            SELECT
                cr.id,
                cr.student_id,
                s.student_code,
                s.name,
                cr.category,
                cr.event,
                cr.result,
                cr.medal,
                cr.position,
                cr.remarks
            FROM competition_results cr
            JOIN students s
                ON cr.student_id = s.id
            WHERE cr.competition_id = $1
            ORDER BY
                cr.position NULLS LAST,
                s.name ASC
        `, [competitionId]);

        res.json({
            results: result.rows
        });

    } catch (error) {
        console.error("Get competition results error:", error);

        res.status(500).json({
            message: "Failed to fetch competition results"
        });
    }
});


module.exports = router;
