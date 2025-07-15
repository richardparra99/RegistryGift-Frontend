import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BsChevronDown, BsList } from "react-icons/bs";
import { URLS } from "../navigation/CONSTANTS";
import { AuthService } from "../services/AuthService";

export const Menu = () => {
  const [showMenu, setShowMenu] = useState(false);
  const [theme, setTheme] = useState("default"); // 👈 agregado
  const navigate = useNavigate();

  const token = localStorage.getItem("access_token");
  const user = token ? JSON.parse(localStorage.getItem("user") || "{}") : null;

  const toggleMenu = () => setShowMenu((prev) => !prev);

  const onLogoutClick = () => {
    AuthService.logout();
    navigate(URLS.HOME);
  };

  const toggleSubMenu = (id: string) => {
    const subMenu = document.getElementById(id);
    const shownSubMenus = document.getElementsByClassName("submenu-shown");

    Array.from(shownSubMenus).forEach((element) => {
      const el = element as HTMLElement;
      if (el.id !== id) {
        el.classList.add("hidden");
        el.classList.remove("submenu-shown");
      }
    });

    if (subMenu) {
      subMenu.classList.toggle("hidden");
      subMenu.classList.toggle("submenu-shown");
    }
  };

  // Tema
  const changeTheme = (theme: string) => {
    localStorage.setItem("theme", theme);
    document.body.className = `theme-${theme}`;
    setTheme(theme);
  };

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "default";
    document.body.className = `theme-${savedTheme}`;
    setTheme(savedTheme);
  }, []);

  // Clase dinámica del navbar
  const navbarClass = theme === "blue"
    ? "bg-[#192734]"
    : theme === "dark"
    ? "bg-[#0a0a0a]"
    : "bg-black";

  return (
    <nav className={`${navbarClass} shadow-md`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to={URLS.HOME} className="text-xl font-bold text-white">
              Gift Registry
            </Link>
          </div>

          <div className="flex items-center md:hidden">
            <button onClick={toggleMenu} className="text-white focus:outline-none">
              <BsList />
            </button>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            <Link to={URLS.APP.LIST} className="text-white hover:text-blue-600">
              Eventos
            </Link>
            {token && (
              <>
                <Link to={URLS.APP.LIST_MY} className="text-white hover:text-blue-600">
                  Mis Eventos
                </Link>
                <Link to={URLS.APP.CREATE} className="text-white hover:text-blue-600">
                  Crear Evento
                </Link>
              </>
            )}
            {/* TEMA */}
            <div className="relative group">
              <button
                onClick={() => toggleSubMenu("themeMenu")}
                className="text-white hover:text-blue-600 flex items-center"
              >
                Tema <BsChevronDown size={10} className="inline ml-1" />
              </button>
              <div
                id="themeMenu"
                className="absolute hidden bg-white shadow-md mt-2 rounded-md z-10 min-w-[150px]"
              >
                <button
                  onClick={() => changeTheme("blue")}
                  className="block w-full text-left hover:bg-gray-100 py-2 px-4"
                >
                  Azul Oscuro
                </button>
                <button
                  onClick={() => changeTheme("dark")}
                  className="block w-full text-left hover:bg-gray-100 py-2 px-4"
                >
                  Negro Opaco
                </button>
                <button
                  onClick={() => changeTheme("default")}
                  className="block w-full text-left hover:bg-gray-100 py-2 px-4"
                >
                  Normal
                </button>
              </div>
            </div>

            {!token ? (
              <>
                <Link to={URLS.LOGIN} className="text-white hover:text-blue-600">
                  Iniciar sesión
                </Link>
                <Link to={URLS.REGISTER} className="text-white hover:text-blue-600">
                  Registrarse
                </Link>
              </>
            ) : (
              <div className="relative group">
                <button
                  onClick={() => toggleSubMenu("authMenu")}
                  className="text-white hover:text-blue-600 flex items-center"
                >
                  {user?.username || "Usuario"} <BsChevronDown size={10} className="inline ml-1" />
                </button>
                <div
                  id="authMenu"
                  className="absolute hidden bg-white shadow-md mt-2 rounded-md z-10 min-w-[119px]"
                >
                  <button
                    onClick={onLogoutClick}
                    className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-3 rounded shadow transition"
                  >
                    Cerrar sesión
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className={`md:hidden px-4 pb-4 ${!showMenu ? "hidden" : ""}`}>
        <Link to={URLS.APP.LIST} className="block text-white py-2">
          Eventos
        </Link>
        {token && (
          <>
            <Link to={URLS.APP.LIST_MY} className="block text-white py-2">
              Mis Eventos
            </Link>
            <Link to={URLS.APP.CREATE} className="block text-white py-2">
              Crear Evento
            </Link>
          </>
        )}
        {!token ? (
          <>
            <Link to={URLS.LOGIN} className="block text-white py-2">
              Iniciar sesión
            </Link>
            <Link to={URLS.REGISTER} className="block text-white py-2">
              Registrarse
            </Link>
          </>
        ) : (
          <button onClick={onLogoutClick} className="block text-white py-2">
            Cerrar sesión
          </button>
        )}
      </div>
    </nav>
  );
};

export default Menu;
