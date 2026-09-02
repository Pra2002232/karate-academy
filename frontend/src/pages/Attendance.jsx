import { useEffect, useState } from "react";
import api from "../services/api";

function Attendance() {

    const [students, setStudents] = useState([]);

    const [attendance, setAttendance] =
        useState({});

    const [date, setDate] =
        useState(
            new Date().toISOString().split("T")[0]
        );

    const [message, setMessage] = useState("");

    const [loading, setLoading] = useState(true);


    // Load students

    const loadStudents = async () => {

        try {

            setLoading(true);

            const response =
                await api.get("/students");

            setStudents(
                response.data.students
            );

        } catch (error) {

            console.error(error);

            setMessage(
                "Unable to load students"
            );

        } finally {

            setLoading(false);

        }
    };


    useEffect(() => {

        loadStudents();

    }, []);


    // Change attendance

    const changeAttendance =
        (studentId, status) => {

            setAttendance(
                previous => ({
                    ...previous,
                    [studentId]: status
                })
            );

        };


    // Save attendance

    const saveAttendance = async () => {

        try {

            setMessage("");

            let saved = 0;

            for (const student of students) {

                const status =
                    attendance[student.id];

                if (!status) {
                    continue;
                }

                await api.post(
                    "/attendance",
                    {
                        student_id: student.id,
                        attendance_date: date,
                        status: status
                    }
                );

                saved++;

            }

            setMessage(
                `${saved} attendance records saved successfully`
            );

        } catch (error) {

            console.error(error);

            setMessage(
                error.response?.data?.message ||
                "Unable to save attendance"
            );

        }
    };


    if (loading) {

        return (
            <div className="loading">
                Loading attendance...
            </div>
        );

    }


    return (

        <div>

            <div className="page-header">

                <div>

                    <h1>Attendance</h1>

                    <p>
                        Daily student attendance
                    </p>

                </div>

                <div className="today">

                    <label>
                        Date:&nbsp;
                    </label>

                    <input
                        type="date"
                        value={date}
                        onChange={(e) =>
                            setDate(e.target.value)
                        }
                    />

                </div>

            </div>


            <div className="dashboard-card">

                <div className="card-header">

                    <h2>
                        Mark Attendance
                    </h2>

                    <span>
                        Students: {students.length}
                    </span>

                </div>


                <table>

                    <thead>

                        <tr>

                            <th>Student</th>
                            <th>Belt</th>
                            <th>Batch</th>
                            <th>Attendance</th>

                        </tr>

                    </thead>


                    <tbody>

                        {students.map((student) => (

                            <tr key={student.id}>

                                <td>
                                    {student.name}
                                </td>

                                <td>
                                    {student.belt}
                                </td>

                                <td>
                                    {student.batch}
                                </td>

                                <td>

                                    <select
                                        value={
                                            attendance[
                                                student.id
                                            ] || ""
                                        }
                                        onChange={(e) =>
                                            changeAttendance(
                                                student.id,
                                                e.target.value
                                            )
                                        }
                                    >

                                        <option value="">
                                            Select
                                        </option>

                                        <option value="PRESENT">
                                            PRESENT
                                        </option>

                                        <option value="ABSENT">
                                            ABSENT
                                        </option>

                                        <option value="LATE">
                                            LATE
                                        </option>

                                    </select>

                                </td>

                            </tr>

                        ))}

                    </tbody>

                </table>


                <div style={{
                    padding: "20px"
                }}>

                    <button
                        onClick={saveAttendance}
                    >
                        Save Attendance
                    </button>

                    {message && (
                        <p>{message}</p>
                    )}

                </div>

            </div>

        </div>

    );
}

export default Attendance;
