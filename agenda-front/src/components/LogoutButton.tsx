import { useNavigate } from "react-router-dom";
import { useAuth } from "../store/auth";
import { logoutUser } from "../services/auth";
import { FiLogOut } from "react-icons/fi";

const LogoutButton = () => {
  const navigate = useNavigate();
  const { setAccessToken } = useAuth();

  const handleLogout = async () => {
    try {
      await logoutUser();
    } catch (err) {
      // Optionnel: afficher une notification d'erreur
    } finally {
      setAccessToken(null);
      navigate("/login");
    }
  };

  return (
    <button
      onClick={handleLogout}
      className="flex items-center px-4 py-2 rounded bg-red-100 hover:bg-red-200 text-red-700"
      title="Se déconnecter"
      type="button"
    >
      <FiLogOut className="mr-2" />
      Déconnexion
    </button>
  );
};

export default LogoutButton;
