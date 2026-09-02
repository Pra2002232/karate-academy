import {
    BrowserRouter,
    Routes,
    Route
} from "react-router-dom";

import Sidebar from "./components/Sidebar";

import Dashboard from "./pages/Dashboard";
import Students from "./pages/Students";
import Attendance from "./pages/Attendance";


function ComingSoon({ title }) {

    return (

        <div className="coming-soon">

            <h1>
                {title}
            </h1>

            <p>
                This module will be configured next.
            </p>

        </div>

    );

}


function App() {

    return (

        <BrowserRouter>

            <div className="app">

                <Sidebar />

                <main className="main-content">

                    <Routes>

                        <Route
                            path="/"
                            element={<Dashboard />}
                        />

                        <Route
                            path="/students"
                            element={<Students />}
                        />

                        <Route
                            path="/attendance"
                            element={<Attendance />}
                        />

                        <Route
                            path="/fees"
                            element={
                                <ComingSoon title="Fees Management" />
                            }
                        />

                        <Route
                            path="/belts"
                            element={
                                <ComingSoon title="Belt / Grade Management" />
                            }
                        />

                        <Route
                            path="/competitions"
                            element={
                                <ComingSoon title="Competitions" />
                            }
                        />

                        <Route
                            path="/results"
                            element={
                                <ComingSoon title="Competition Results" />
                            }
                        />

                        <Route
                            path="/reports"
                            element={
                                <ComingSoon title="Reports" />
                            }
                        />

                    </Routes>

                </main>

            </div>

        </BrowserRouter>

    );

}

export default App;
