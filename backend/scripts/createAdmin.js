require("dotenv").config();

const bcrypt = require("bcrypt");
const readline = require("readline");
const pool = require("../src/config/db");

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function question(text) {
    return new Promise(resolve => {
        rl.question(text, resolve);
    });
}

async function createAdmin() {
    try {
        const username = await question("Username: ");
        const fullName = await question("Full Name: ");
        const password = await question("Password: ");

        if (!username || !fullName || !password) {
            console.log("All fields are required.");
            process.exit(1);
        }

        const passwordHash = await bcrypt.hash(password, 12);

        await pool.query(
            `
            INSERT INTO admin_users
            (
                username,
                password_hash,
                full_name,
                role
            )
            VALUES ($1, $2, $3, 'ADMIN')
            `,
            [
                username.trim(),
                passwordHash,
                fullName.trim()
            ]
        );

        console.log("Admin created successfully.");
    } catch (error) {
        console.error("Admin creation failed:", error.message);
    } finally {
        rl.close();
        await pool.end();
    }
}

createAdmin();
