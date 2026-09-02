import { useEffect, useState } from "react";
import api from "../services/api";

function Dashboard() {

    const [students, setStudents] = useState(0);
    const [attendance, setAttendance] = useState([]);
    const [loading, setLoading] = useState(true);

    const today =
        new Date().toISOString().split("T")[0];


    const loadDashboard = async () => {

        try {

            const studentResponse =
                await api.get("/students");

            const attendanceResponse =
                await api.get(`/attendance/date/${today}`);

            setStudents(
                studentResponse.data.total_students
            );

            setAttendance(
                attendanceResponse.data.attendance
            );

        } catch (error) {

            console.error(
                "Dashboard error:",
                error
            );

        } finally {

            setLoading(false);

        }

    };


    useEffect(() => {

        loadDashboard();

    }, []);


    const present =
        attendance.filter(
            item => item.status === "PRESENT"
        ).length;


    const absent =
        attendance.filter(
            item => item.status === "ABSENT"
        ).length;


    const late =
        attendance.filter(
            item => item.status === "LATE"
        ).length;


    if (loading) {

        return (
            <div className="loading">
                Loading Dashboard...
            </div>
        );

    }


    return (

        <div>

            <div className="page-header">

                <div>

                    <h1>
                        Dashboard
                    </h1>

                    <p>
                        Karate Academy Management System
                    </p>

                </div>

                <div className="today">

                    {today}

                </div>

            </div>


            {/* Statistics */}

            <div className="stats-grid">

                <div className="stat-card">

                    <div className="stat-title">
                        Total Students
                    </div>

                    <div className="stat-number">
                        {students}
                    </div>

                </div>


                <div className="stat-card">

                    <div className="stat-title">
                        Present Today
                    </div>

                    <div className="stat-number">
                        {present}
                    </div>

                </div>


                <div className="stat-card">

                    <div className="stat-title">
                        Absent Today
                    </div>

                    <div className="stat-number">
                        {absent}
                    </div>

                </div>


                <div className="stat-card">

                    <div className="stat-title">
                        Late Today
                    </div>

                    <div className="stat-number">
                        {late}
                    </div>

                </div>

            </div>


            {/* Attendance */}

            <div className="dashboard-card">

                <div className="card-header">

                    <h2>
                        Today's Attendance
                    </h2>

                    <span>
                        {today}
                    </span>

                </div>


                <table>

                    <thead>

                        <tr>

                            <th>
                                Student
                            </th>

                            <th>
                                Belt
                            </th>

                            <th>
                                Batch
                            </th>

                            <th>
                                Status
                            </th>

                        </tr>

                    </thead>


                    <tbody>

                        {attendance.length === 0 ? (

                            <tr>

                                <td
                                    colSpan="4"
                                    className="empty"
                                >
                                    No attendance marked today
                                </td>

                            </tr>

                        ) : (

                            attendance.map(item => (

                                <tr key={item.id}>

                                    <td>
                                        {item.student_name}
                                    </td>

                                    <td>
                                        {item.belt}
                                    </td>

                                    <td>
                                        {item.batch}
                                    </td>

                                    <td>

                                        <span
                                            className={
                                                `status ${item.status.toLowerCase()}`
                                            }
                                        >
                                            {item.status}
                                        </span>

                                    </td>

                                </tr>

                            ))

                        )}

                    </tbody>

                </table>

            </div>

        </div>

    );

}

export default Dashboard;
