import { useEffect, useMemo, useState } from "react";
import api from "../services/api";
import "./Results.css";

function Results() {
    const [results, setResults] = useState([]);
    const [competitions, setCompetitions] = useState([]);
    const [students, setStudents] = useState([]);

    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [saving, setSaving] = useState(false);

    const [competitionFilter, setCompetitionFilter] = useState("");
    const [studentFilter, setStudentFilter] = useState("");
    const [medalFilter, setMedalFilter] = useState("");
    const [yearFilter, setYearFilter] = useState("");

    const [form, setForm] = useState({
        competition_id: "",
        student_id: "",
        category: "",
        event: "",
        result: "",
        medal: "",
        position: "",
        remarks: ""
    });

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            setLoading(true);

            const [resultsRes, competitionsRes, studentsRes] =
                await Promise.all([
                    api.get("/competitions/results"),
                    api.get("/competitions"),
                    api.get("/students")
                ]);

            setResults(
                resultsRes.data?.results ||
                resultsRes.data ||
                []
            );

            setCompetitions(
                competitionsRes.data?.competitions ||
                competitionsRes.data ||
                []
            );

            setStudents(
                studentsRes.data?.students ||
                studentsRes.data ||
                []
            );

        } catch (error) {
            console.error("Failed to load results:", error);
            alert("Unable to load results.");
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };

    const addResult = async (e) => {
        e.preventDefault();

        if (
            !form.competition_id ||
            !form.student_id ||
            !form.result
        ) {
            alert("Competition, student and result are required.");
            return;
        }

        try {
            setSaving(true);

            await api.post("/competitions/results", {
                competition_id: Number(form.competition_id),
                student_id: Number(form.student_id),
                category: form.category,
                event: form.event,
                result: form.result,
                medal: form.medal,
                position: form.position
                    ? Number(form.position)
                    : null,
                remarks: form.remarks
            });

            alert("Result added successfully.");

            setForm({
                competition_id: "",
                student_id: "",
                category: "",
                event: "",
                result: "",
                medal: "",
                position: "",
                remarks: ""
            });

            setShowForm(false);

            await loadData();

        } catch (error) {
            console.error("Failed to add result:", error);

            alert(
                error.response?.data?.error ||
                "Failed to add result."
            );
        } finally {
            setSaving(false);
        }
    };

    const filteredResults = useMemo(() => {
        return results.filter((item) => {

            const competitionMatch =
                !competitionFilter ||
                String(item.competition_id) ===
                    String(competitionFilter);

            const studentMatch =
                !studentFilter ||
                String(item.student_id) ===
                    String(studentFilter);

            const medalMatch =
                !medalFilter ||
                String(item.medal || "").toUpperCase() ===
                    medalFilter;

            const competitionDate =
                item.competition_date ||
                item.date ||
                "";

            const yearMatch =
                !yearFilter ||
                String(competitionDate).startsWith(yearFilter);

            return (
                competitionMatch &&
                studentMatch &&
                medalMatch &&
                yearMatch
            );
        });
    }, [
        results,
        competitionFilter,
        studentFilter,
        medalFilter,
        yearFilter
    ]);

    const totalCompetitions = new Set(
        results.map((r) => r.competition_id)
    ).size;

    const totalStudents = new Set(
        results.map((r) => r.student_id)
    ).size;

    const medalResults = results.filter((r) =>
        ["GOLD", "SILVER", "BRONZE"].includes(
            String(r.medal || "").toUpperCase()
        )
    );

    const goldCount = results.filter(
        (r) =>
            String(r.medal || "").toUpperCase() === "GOLD"
    ).length;

    const winners = results
        .filter((r) =>
            ["GOLD", "SILVER", "BRONZE"].includes(
                String(r.medal || "").toUpperCase()
            )
        )
        .slice(0, 3);

    const medalIcon = (medal) => {
        switch (String(medal || "").toUpperCase()) {
            case "GOLD":
                return "🥇";
            case "SILVER":
                return "🥈";
            case "BRONZE":
                return "🥉";
            default:
                return "🏅";
        }
    };

    const medalClass = (medal) => {
        switch (String(medal || "").toUpperCase()) {
            case "GOLD":
                return "gold";
            case "SILVER":
                return "silver";
            case "BRONZE":
                return "bronze";
            default:
                return "participation";
        }
    };

    return (
        <div className="results-page">

            {/* HEADER */}
            <div className="results-header">

                <div className="results-title">

                    <div className="results-icon">
                        🏆
                    </div>

                    <div>
                        <h1>Results & Winners</h1>

                        <p>
                            Record competition achievements
                            and celebrate academy winners.
                        </p>
                    </div>

                </div>

                <button
                    className="results-add-btn"
                    onClick={() => setShowForm(!showForm)}
                >
                    {showForm ? "Close" : "+ Add Result"}
                </button>

            </div>

            {/* SUMMARY */}
            <div className="results-summary">

                <div className="result-stat">
                    <span>Competitions</span>
                    <strong>{totalCompetitions}</strong>
                    <small>Total competitions with results</small>
                </div>

                <div className="result-stat">
                    <span>Students</span>
                    <strong>{totalStudents}</strong>
                    <small>Students participated</small>
                </div>

                <div className="result-stat">
                    <span>Medals Won</span>
                    <strong>{medalResults.length}</strong>
                    <small>Gold, silver & bronze</small>
                </div>

                <div className="result-stat gold-stat">
                    <span>Gold Medals</span>
                    <strong>{goldCount}</strong>
                    <small>1st place achievements</small>
                </div>

            </div>

            {/* ADD RESULT */}
            {showForm && (
                <form
                    className="result-form"
                    onSubmit={addResult}
                >

                    <div className="form-title">
                        <div>
                            <h2>Add Competition Result</h2>
                            <p>Record a student's achievement.</p>
                        </div>
                    </div>

                    <div className="form-grid">

                        <div className="form-group">
                            <label>Competition *</label>

                            <select
                                name="competition_id"
                                value={form.competition_id}
                                onChange={handleChange}
                            >
                                <option value="">
                                    Select competition
                                </option>

                                {competitions.map((competition) => (
                                    <option
                                        key={competition.id}
                                        value={competition.id}
                                    >
                                        {competition.competition_name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="form-group">
                            <label>Student *</label>

                            <select
                                name="student_id"
                                value={form.student_id}
                                onChange={handleChange}
                            >
                                <option value="">
                                    Select student
                                </option>

                                {students.map((student) => (
                                    <option
                                        key={student.id}
                                        value={student.id}
                                    >
                                        {student.name}
                                        {student.student_code
                                            ? ` (${student.student_code})`
                                            : ""}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="form-group">
                            <label>Category</label>

                            <input
                                name="category"
                                value={form.category}
                                onChange={handleChange}
                                placeholder="Senior / Junior"
                            />
                        </div>

                        <div className="form-group">
                            <label>Event</label>

                            <input
                                name="event"
                                value={form.event}
                                onChange={handleChange}
                                placeholder="Kata / Kumite"
                            />
                        </div>

                        <div className="form-group">
                            <label>Result *</label>

                            <select
                                name="result"
                                value={form.result}
                                onChange={handleChange}
                            >
                                <option value="">
                                    Select result
                                </option>
                                <option value="WINNER">
                                    Winner
                                </option>
                                <option value="FINALIST">
                                    Finalist
                                </option>
                                <option value="PARTICIPATED">
                                    Participated
                                </option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label>Medal</label>

                            <select
                                name="medal"
                                value={form.medal}
                                onChange={handleChange}
                            >
                                <option value="">
                                    No medal
                                </option>
                                <option value="GOLD">
                                    🥇 Gold
                                </option>
                                <option value="SILVER">
                                    🥈 Silver
                                </option>
                                <option value="BRONZE">
                                    🥉 Bronze
                                </option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label>Position</label>

                            <input
                                type="number"
                                min="1"
                                name="position"
                                value={form.position}
                                onChange={handleChange}
                                placeholder="1"
                            />
                        </div>

                        <div className="form-group">
                            <label>Remarks</label>

                            <input
                                name="remarks"
                                value={form.remarks}
                                onChange={handleChange}
                                placeholder="Optional remarks"
                            />
                        </div>

                    </div>

                    <div className="form-actions">

                        <button
                            type="button"
                            className="cancel-btn"
                            onClick={() => setShowForm(false)}
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            className="save-btn"
                            disabled={saving}
                        >
                            {saving
                                ? "Saving..."
                                : "Save Result"}
                        </button>

                    </div>

                </form>
            )}

            {/* WINNERS */}
            {winners.length > 0 && (
                <section className="winners-section">

                    <div className="section-heading">
                        <div>
                            <h2>🏆 Winners Spotlight</h2>
                            <p>
                                Recent academy achievements
                            </p>
                        </div>
                    </div>

                    <div className="winner-grid">

                        {winners.map((winner) => (
                            <div
                                className={`winner-card ${medalClass(
                                    winner.medal
                                )}`}
                                key={winner.id}
                            >

                                <div className="winner-medal">
                                    {medalIcon(winner.medal)}
                                </div>

                                <div>
                                    <h3>
                                        {winner.student_name ||
                                            winner.name ||
                                            "Student"}
                                    </h3>

                                    <p>
                                        {winner.competition_name ||
                                            "Competition"}
                                    </p>

                                    <span>
                                        {winner.event ||
                                            winner.category ||
                                            "Achievement"}
                                    </span>
                                </div>

                            </div>
                        ))}

                    </div>

                </section>
            )}

            {/* FILTERS */}
            <section className="results-card">

                <div className="results-card-header">

                    <div>
                        <h2>Competition Results</h2>
                        <p>
                            View all recorded achievements
                        </p>
                    </div>

                    <div className="result-count">
                        {filteredResults.length} Results
                    </div>

                </div>

                <div className="filters">

                    <select
                        value={competitionFilter}
                        onChange={(e) =>
                            setCompetitionFilter(e.target.value)
                        }
                    >
                        <option value="">
                            All Competitions
                        </option>

                        {competitions.map((competition) => (
                            <option
                                key={competition.id}
                                value={competition.id}
                            >
                                {competition.competition_name}
                            </option>
                        ))}
                    </select>

                    <select
                        value={studentFilter}
                        onChange={(e) =>
                            setStudentFilter(e.target.value)
                        }
                    >
                        <option value="">
                            All Students
                        </option>

                        {students.map((student) => (
                            <option
                                key={student.id}
                                value={student.id}
                            >
                                {student.name}
                            </option>
                        ))}
                    </select>

                    <select
                        value={medalFilter}
                        onChange={(e) =>
                            setMedalFilter(e.target.value)
                        }
                    >
                        <option value="">
                            All Medals
                        </option>
                        <option value="GOLD">🥇 Gold</option>
                        <option value="SILVER">🥈 Silver</option>
                        <option value="BRONZE">🥉 Bronze</option>
                    </select>

                    <select
                        value={yearFilter}
                        onChange={(e) =>
                            setYearFilter(e.target.value)
                        }
                    >
                        <option value="">
                            All Years
                        </option>
                        <option value="2026">2026</option>
                        <option value="2025">2025</option>
                        <option value="2024">2024</option>
                    </select>

                </div>

                {loading ? (
                    <div className="empty-results">
                        Loading results...
                    </div>
                ) : filteredResults.length === 0 ? (
                    <div className="empty-results">

                        <div>🏆</div>

                        <h3>No results yet</h3>

                        <p>
                            Add a competition result to
                            start building the academy
                            achievement history.
                        </p>

                    </div>
                ) : (
                    <div className="table-wrapper">

                        <table>

                            <thead>
                                <tr>
                                    <th>Competition</th>
                                    <th>Student</th>
                                    <th>Category</th>
                                    <th>Event</th>
                                    <th>Result</th>
                                    <th>Position</th>
                                    <th>Medal</th>
                                </tr>
                            </thead>

                            <tbody>

                                {filteredResults.map((item) => (
                                    <tr key={item.id}>

                                        <td>
                                            <strong>
                                                {item.competition_name ||
                                                    "—"}
                                            </strong>

                                            {item.competition_date && (
                                                <small>
                                                    {item.competition_date}
                                                </small>
                                            )}
                                        </td>

                                        <td>
                                            <strong>
                                                {item.student_name ||
                                                    item.name ||
                                                    "—"}
                                            </strong>

                                            {item.student_code && (
                                                <small>
                                                    {item.student_code}
                                                </small>
                                            )}
                                        </td>

                                        <td>
                                            {item.category || "—"}
                                        </td>

                                        <td>
                                            {item.event || "—"}
                                        </td>

                                        <td>
                                            {item.result || "—"}
                                        </td>

                                        <td>
                                            {item.position
                                                ? `${item.position}${item.position === 1 ? "st" : item.position === 2 ? "nd" : item.position === 3 ? "rd" : "th"}`
                                                : "—"}
                                        </td>

                                        <td>
                                            {item.medal ? (
                                                <span
                                                    className={`medal-badge ${medalClass(
                                                        item.medal
                                                    )}`}
                                                >
                                                    {medalIcon(
                                                        item.medal
                                                    )}{" "}
                                                    {item.medal}
                                                </span>
                                            ) : (
                                                <span className="no-medal">
                                                    —
                                                </span>
                                            )}
                                        </td>

                                    </tr>
                                ))}

                            </tbody>

                        </table>

                    </div>
                )}

            </section>

        </div>
    );
}

export default Results;
