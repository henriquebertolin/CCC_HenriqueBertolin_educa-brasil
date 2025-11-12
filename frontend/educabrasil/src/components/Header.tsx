import { useNavigate } from "react-router-dom";
import { setAuthToken } from "../services/api";
import type { User } from "../types/user";
import { User as UserIcon, LogOut } from "lucide-react"; 

type HeaderProps = {
  user: User;
};

export default function Header({ user }: HeaderProps) {
  const navigate = useNavigate();

  function handleLogout() {
    setAuthToken(null);
    localStorage.removeItem("user");
    navigate("/login");
  }

  function handleProfile() {
    navigate("/profile");
  }

  return (
    <header className="app-header">
      <div className="header-left" onClick={() => navigate("/home")}>
        <h1 className="header-title">EducaBrasil</h1>
      </div>

      <div className="header-right">
        <div className="user-info" onClick={handleProfile} title="Meu perfil">
          <UserIcon size={22} />
          <span>{user.nome}</span>
        </div>
        <button className="logout-button" onClick={handleLogout}>
          <LogOut size={18} style={{ marginRight: 6 }} />
          Sair
        </button>
      </div>
    </header>
  );
}
