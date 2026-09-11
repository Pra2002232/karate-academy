import api from "../services/api";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
    const navigate = useNavigate();

    const [showPassword, setShowPassword] =
        useState(false);

    const [form, setForm] = useState({
        username: "",
        password: "",
        remember: true
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    function handleChange(event) {
        const {
            name,
            value,
            type,
            checked
        } = event.target;

        setForm((previous) => ({
            ...previous,
            [name]:
                type === "checkbox"
                    ? checked
                    : value
        }));
    }
async function handleSubmit(e) {
    e.preventDefault();

    if (!form.username.trim() || !form.password) {
        setError("Please enter username and password.");
        return;
    }

    try {
        setLoading(true);
        setError("");

        const response = await api.post("/auth/login", {
            username: form.username,
            password: form.password
        });

        const { token, admin } = response.data;

        localStorage.setItem("admin_token", token);
        localStorage.setItem(
            "admin_user",
            JSON.stringify(admin)
        );

        navigate("/", { replace: true });

    } catch (error) {
        setError(
            error.response?.data?.message ||
            "Login failed. Please try again."
        );
    } finally {
        setLoading(false);
    }
}

    return (
        <div className="uskai-login-page">

            {/* =========================
                LEFT KARATE HERO SECTION
            ========================== */}

            <section className="uskai-hero">

                <div className="uskai-hero-overlay"></div>

                <div className="uskai-hero-content">

                    <div className="uskai-brand-row">

                        <div className="uskai-emblem">
                            🥋
                        </div>

                        <div>

                            <h1>
                                UNITED SHOTOKAN
                            </h1>

                            <h2>
                                KARATE ASSOCIATION INDIA
                            </h2>

                            <p>
                                DISCIPLINE
                                &nbsp;|&nbsp;
                                RESPECT
                                &nbsp;|&nbsp;
                                SELF IMPROVEMENT
                            </p>

                        </div>

                    </div>


                    <div className="uskai-motto">

                        <strong>
                            Stronger
                            <br />
                            Mind.
                            <br />
                            Stronger
                            <br />
                            <em>Tomorrow.</em>
                        </strong>

                    </div>


                    <div className="uskai-values">

                        <span>
                            <b>01</b>
                            Respect
                        </span>

                        <span>
                            <b>02</b>
                            Effort
                        </span>

                        <span>
                            <b>03</b>
                            Patience
                        </span>

                        <span>
                            <b>04</b>
                            Self Improvement
                        </span>

                    </div>


                    <div className="uskai-bottom-values">

                        <div>
                            <b>◉</b>

                            <span>
                                Build
                                <br />
                                Better People
                            </span>
                        </div>

                        <div>
                            <b>🏆</b>

                            <span>
                                Create
                                <br />
                                Champions
                            </span>
                        </div>

                        <div>
                            <b>♥</b>

                            <span>
                                Healthy
                                <br />
                                Communities
                            </span>
                        </div>

                        <div>
                            <b>⬟</b>

                            <span>
                                Stronger
                                <br />
                                Nation
                            </span>
                        </div>

                    </div>

                </div>

            </section>


            {/* =========================
                RIGHT LOGIN SECTION
            ========================== */}

            <section className="uskai-login-panel">

                <div className="uskai-login-card">

                    {/* BRAND */}

                    <div className="uskai-card-brand">

                        <div className="uskai-card-logo">
                            🥋
                        </div>

                        <h2>
                            UNITED SHOTOKAN
                            <br />
                            KARATE ASSOCIATION INDIA
                        </h2>

                        <span>
                            MANAGEMENT SYSTEM
                        </span>

                    </div>


                    {/* LOGIN HEADING */}

                    <div className="uskai-login-heading">

                        <div className="uskai-kicker">
                            ADMIN LOGIN
                        </div>

                        <h3>
                            Welcome Back
                        </h3>

                        <p>
                            Sign in to manage your academy,
                            <br />
                            students and training activities.
                        </p>

                    </div>


                    {/* LOGIN FORM */}

                    <form
                        onSubmit={handleSubmit}
                        className="uskai-form"
                    >

                        {/* USERNAME */}

                        <label>

                            <span>
                                Username
                            </span>

                            <div className="uskai-input">

                                <b>
                                    ♙
                                </b>

                                <input
                                    type="text"
                                    name="username"
                                    value={
                                        form.username
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    placeholder="Username"
                                    autoComplete="username"
                                />

                            </div>

                        </label>


                        {/* PASSWORD */}

                        <label>

                            <span>
                                Password
                            </span>

                            <div className="uskai-input">

                                <b>
                                    🔒
                                </b>

                                <input
                                    type={
                                        showPassword
                                            ? "text"
                                            : "password"
                                    }
                                    name="password"
                                    value={
                                        form.password
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    placeholder="Password"
                                    autoComplete="current-password"
                                />

                                <button
                                    type="button"
                                    className="uskai-eye"
                                    onClick={() =>
                                        setShowPassword(
                                            (value) =>
                                                !value
                                        )
                                    }
                                >
                                    {showPassword
                                        ? "Hide"
                                        : "Show"}
                                </button>

                            </div>

                        </label>


                        {/* OPTIONS */}

                        <div className="uskai-options">

                            <label className="uskai-remember">

                                <input
                                    type="checkbox"
                                    name="remember"
                                    checked={
                                        form.remember
                                    }
                                    onChange={
                                        handleChange
                                    }
                                />

                                <span>
                                    Remember me
                                </span>

                            </label>


                            <button
                                type="button"
                                className="uskai-forgot"
                                onClick={() =>
                                    alert(
                                        "Please contact the academy administrator."
                                    )
                                }
                            >
                                Forgot password?
                            </button>

                        </div>


                        {/* SIGN IN */}

			{error && (
    <div className="uskai-login-error">
        {error}
    </div>
)}

<button
    className="uskai-signin"
    type="submit"
    disabled={loading}
>
    {loading ? "Signing In..." : "Sign In"}
    {!loading && <span>→</span>}
</button>
                    </form>


                    {/* SECURITY */}

                    <div className="uskai-secure">

                        🛡

                        <span>
                            Secure Admin Access
                        </span>

                    </div>


                    {/* FOOTER */}

                    <div className="uskai-card-footer">

                        <b>
                            TRADITION
                            &nbsp;|&nbsp;
                            CHARACTER
                            &nbsp;|&nbsp;
                            EXCELLENCE
                        </b>

                        <span>
                            © 2026 United Shotokan
                            Karate Association India
                        </span>

                    </div>

                </div>

            </section>

        </div>
    );
}


export default Login;
