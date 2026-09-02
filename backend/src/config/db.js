const { Pool } = require("pg");

const pool = new Pool({
    host: process.env.DB_HOST || "localhost",
    port: process.env.DB_PORT || 5432,
    database: process.env.DB_NAME || "karate_academy",
    user: process.env.DB_USER || "cricketuser",
    password: process.env.DB_PASSWORD || "karate@123"
});

pool.on("connect", () => {
    console.log("Connected to PostgreSQL");
});

pool.on("error", (err) => {
    console.error("PostgreSQL error:", err);
});

module.exports = pool;
