const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const pool = require("../config/db");

const router = express.Router();

router.post("/login", async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({
                message: "Username and password are required"
            });
        }

        const result = await pool.query(
            `
            SELECT
                id,
                username,
                password_hash,
                full_name,
                role,
                is_active
            FROM admin_users
            WHERE username = $1
            `,
            [username.trim()]
        );

        if (result.rows.length === 0) {
            return res.status(401).json({
                message: "Invalid username or password"
            });
        }

        const admin = result.rows[0];

        if (!admin.is_active) {
            return res.status(403).json({
                message: "Admin account is disabled"
            });
        }

        const validPassword = await bcrypt.compare(
            password,
            admin.password_hash
        );

        if (!validPassword) {
            return res.status(401).json({
                message: "Invalid username or password"
            });
        }

        if (!process.env.JWT_SECRET) {
            return res.status(500).json({
                message: "JWT_SECRET is not configured"
            });
        }

        const token = jwt.sign(
            {
                id: admin.id,
                username: admin.username,
                role: admin.role
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "8h"
            }
        );

        res.json({
            message: "Login successful",
            token,
            admin: {
                id: admin.id,
                username: admin.username,
                full_name: admin.full_name,
                role: admin.role
            }
        });

    } catch (error) {
        console.error("Login Error:", error);

        res.status(500).json({
            message: "Internal server error"
        });
    }
});

module.exports = router;
