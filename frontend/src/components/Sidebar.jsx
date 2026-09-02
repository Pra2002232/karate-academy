import { NavLink } from "react-router-dom";

function Sidebar() {
    return (
        <aside className="sidebar">

            <div className="logo">

                <div className="logo-icon">
                    🥋
                </div>

                <div>
                    <h2>Karate Academy</h2>
                    <span>Management System</span>
                </div>

            </div>

            <nav>

                <NavLink to="/">
                    🏠 Dashboard
                </NavLink>

                <NavLink to="/students">
                    👥 Students
                </NavLink>

                <NavLink to="/attendance">
                    📋 Attendance
                </NavLink>

                <NavLink to="/fees">
                    💰 Fees
                </NavLink>

                <NavLink to="/belts">
                    🥋 Belt / Grade
                </NavLink>

                <NavLink to="/competitions">
                    🏆 Competitions
                </NavLink>

                <NavLink to="/results">
                    🏅 Results
                </NavLink>

                <NavLink to="/reports">
                    📊 Reports
                </NavLink>

            </nav>

            <div className="sidebar-footer">
                <span>Karate Academy</span>
                <small>v1.0</small>
            </div>

        </aside>
    );
}

export default Sidebar;
