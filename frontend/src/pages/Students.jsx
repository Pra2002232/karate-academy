import { useEffect, useState } from "react";
import api from "../services/api";

function Students() {

    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const loadStudents = async () => {

        try {

            setLoading(true);
            setError("");

            const response = await api.get("/students");

            setStudents(response.data.students);

        } catch (error) {

            console.error(error);

            setError("Unable to load students");

        } finally {

            setLoading(false);

        }
    };


    useEffect(() => {

        loadStudents();

    }, []);


    if (loading) {
        return <div className="loading">Loading students...</div>;
    }


    if (error) {
        return <div className="coming-soon">
            <h2>{error}</h2>
            <button onClick={loadStudents}>
                Retry
            </button>
        </div>;
    }


    return (

        <div>

            <div className="page-header">

                <div>

                    <h1>Students</h1>

                    <p>
                        Manage Karate Academy students
                    </p>

                </div>

                <button>
                    + Add Student
                </button>

            </div>


            <div className="dashboard-card">

                <div className="card-header">

                    <h2>
                        Student List
                    </h2>

                    <span>
                        Total: {students.length}
                    </span>

                </div>


                <table>

                    <thead>

                        <tr>

                            <th>Code</th>
                            <th>Name</th>
                            <th>Parent</th>
                            <th>Mobile</th>
                            <th>Belt</th>
                            <th>Batch</th>
                            <th>Status</th>

                        </tr>

                    </thead>


                    <tbody>

                        {students.map((student) => (

                            <tr key={student.id}>

                                <td>
                                    {student.student_code}
                                </td>

                                <td>
                                    {student.name}
                                </td>

                                <td>
                                    {student.parent_name}
                                </td>

                                <td>
                                    {student.parent_mobile}
                                </td>

                                <td>
                                    {student.belt}
                                </td>

                                <td>
                                    {student.batch}
                                </td>

                                <td>

                                    <span className="status present">
                                        {student.status}
                                    </span>

                                </td>

                            </tr>

                        ))}

                    </tbody>

                </table>

            </div>

        </div>

    );
}

export default Students;
