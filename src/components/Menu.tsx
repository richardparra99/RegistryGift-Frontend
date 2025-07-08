import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BsChevronDown, BsList } from "react-icons/bs";
import { URLS } from "../navigation/CONSTANTS";
import { AuthService } from "../services/AuthService";

export const Menu = () => {
  const [showMenu, setShowMenu] = useState(false);
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

  return (
    <nav className="bg-black shadow-md">
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
                  className="absolute hidden bg-white shadow-md mt-2 rounded-md z-10 min-w-[160px]"
                >
                  <button
                    onClick={onLogoutClick}
                    className="block w-full text-start px-4 py-2 text-gray-800 hover:bg-gray-100"
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
