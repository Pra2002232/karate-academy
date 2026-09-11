import { BrowserRouter, Routes, Route } from "react-router-dom";

import Sidebar from "./components/Sidebar";
import Dashboard from "./pages/Dashboard";
import Students from "./pages/Students";
import Attendance from "./pages/Attendance";
import Login from "./pages/Login";
import ProtectedRoute from "./components/ProtectedRoute";


function ModulePage({ title, subtitle, icon }) {
    return (
        <div className="module-page">

            <div className="module-icon">
                {icon}
            </div>

            <h1>{title}</h1>

            <p>{subtitle}</p>

            <div className="module-coming">
                <span>
                    Module in development
                </span>
            </div>

        </div>
    );
}


/*
 * Main Academy Layout
 *
 * Sidebar is displayed only for the
 * actual academy management pages.
 */
function AcademyLayout() {
    return (
        <div className="app-shell">

            <Sidebar />

            <main className="main-content">

                <Routes>

                    {/* Dashboard */}

                    <Route
                        path="/"
                        element={<Dashboard />}
                    />


                    {/* Students */}

                    <Route
                        path="/students"
                        element={<Students />}
                    />


                    {/* Attendance */}

                    <Route
                        path="/attendance"
                        element={<Attendance />}
                    />


                    {/* Fees */}

                    <Route
                        path="/fees"
                        element={
                            <ModulePage
                                title="Fees Management"
                                subtitle="Manage student fees, payments and pending dues."
                                icon="💰"
                            />
                        }
                    />


                    {/* Belt / Grade */}

                    <Route
                        path="/belts"
                        element={
                            <ModulePage
                                title="Belt & Grade Management"
                                subtitle="Manage karate belt promotions, grades and examinations."
                                icon="🥋"
                            />
                        }
                    />


                    {/* Competitions */}

                    <Route
                        path="/competitions"
                        element={
                            <ModulePage
                                title="Competitions"
                                subtitle="Manage karate competitions, events and participation."
                                icon="🏆"
                            />
                        }
                    />


                    {/* Results */}

                    <Route
                        path="/results"
                        element={
                            <ModulePage
                                title="Results & Winners"
                                subtitle="Manage competition results, rankings and winners."
                                icon="🥇"
                            />
                        }
                    />


                    {/* Reports */}

                    <Route
                        path="/reports"
                        element={
                            <ModulePage
                                title="Reports"
                                subtitle="View academy attendance, fees and student reports."
                                icon="📊"
                            />
                        }
                    />

                </Routes>

            </main>

        </div>
    );
}


function App() {

    return (
        <BrowserRouter>

            <Routes>

                {/* =================================
                    LOGIN PAGE
                    NO SIDEBAR
                ================================== */}

                <Route
                    path="/login"
                    element={<Login />}
                />


                {/* =================================
                    ACADEMY APPLICATION
                    SIDEBAR INCLUDED
                ================================== */}

                <Route
                    path="*"
                    element={<AcademyLayout />}
                />

            </Routes>

        </BrowserRouter>
    );
}


export default App;
