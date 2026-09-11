import { useNavigate } from "react-router-dom";

function LogoutButton() {
    const navigate = useNavigate();

    function handleLogout() {
        localStorage.removeItem("admin_token");
        localStorage.removeItem("admin_user");

        navigate("/login", { replace: true });
    }

    return (
        <button
            type="button"
            className="logout-button"
            onClick={handleLogout}
        >
            <span>↪</span>
            Logout
        </button>
    );
}

export default LogoutButton;
