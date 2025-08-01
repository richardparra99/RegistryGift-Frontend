import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BsChevronDown, BsList, BsMoon, BsSun } from "react-icons/bs";
import { URLS } from "../navigation/CONSTANTS";
import { AuthService } from "../services/AuthService";

export const Menu = () => {
  const [showMenu, setShowMenu] = useState(false);
  const [theme, setTheme] = useState("light");
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

  const changeTheme = (theme: string) => {
    document.body.className = theme === "dark" ? "theme-dark dark" : "theme-light";
    localStorage.setItem("theme", theme);
    setTheme(theme);
  };

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "light";
    document.body.className = savedTheme === "dark" ? "theme-dark dark" : "theme-light";
    setTheme(savedTheme);
  }, []);

  const navbarClass = theme === "dark" ? "bg-black" : "bg-white";
  const textColor = theme === "dark" ? "text-white" : "text-black";
  const hoverColor = theme === "dark" ? "hover:text-blue-400" : "hover:text-blue-600";

  return (
    <nav className={`${navbarClass} shadow-md`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to={URLS.HOME} className={`text-xl font-bold ${textColor}`}>
              Gift Registry
            </Link>
          </div>

          <div className="flex items-center md:hidden">
            <button onClick={toggleMenu} className={`${textColor} focus:outline-none`}>
              <BsList />
            </button>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            <Link to={URLS.APP.LIST} className={`${textColor} ${hoverColor}`}>
              Eventos
            </Link>
            {token && (
              <>
                <Link to={URLS.APP.LIST_MY} className={`${textColor} ${hoverColor}`}>
                  Mis Eventos
                </Link>
                <Link to={URLS.APP.CREATE} className={`${textColor} ${hoverColor}`}>
                  Crear Evento
                </Link>
              </>
            )}

            {/* BOTÓN DE CAMBIO DE TEMA */}
            <button
              onClick={() => changeTheme(theme === "dark" ? "light" : "dark")}
              className={`p-2 rounded-full border ${textColor} ${hoverColor} dark:border-gray-500 border-gray-300`}
              title={`Cambiar a modo ${theme === "dark" ? "claro" : "oscuro"}`}
            >
              {theme === "dark" ? <BsSun size={18} /> : <BsMoon size={18} />}
            </button>

            {!token ? (
              <>
                <Link to={URLS.LOGIN} className={`${textColor} ${hoverColor}`}>
                  Iniciar sesión
                </Link>
                <Link to={URLS.REGISTER} className={`${textColor} ${hoverColor}`}>
                  Registrarse
                </Link>
              </>
            ) : (
              <div className="relative group">
                <button
                  onClick={() => toggleSubMenu("authMenu")}
                  className={`${textColor} ${hoverColor} flex items-center`}
                >
                  {user?.username || "Usuario"}{" "}
                  <BsChevronDown size={10} className="inline ml-1" />
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

      {/* MENÚ PARA MÓVIL */}
      <div className={`md:hidden px-4 pb-4 ${!showMenu ? "hidden" : ""}`}>
        <Link to={URLS.APP.LIST} className={`block ${textColor} py-2`}>
          Eventos
        </Link>
        {token && (
          <>
            <Link to={URLS.APP.LIST_MY} className={`block ${textColor} py-2`}>
              Mis Eventos
            </Link>
            <Link to={URLS.APP.CREATE} className={`block ${textColor} py-2`}>
              Crear Evento
            </Link>
          </>
        )}

        {/* BOTÓN DE CAMBIO DE TEMA (móvil) */}
        <button
          onClick={() => changeTheme(theme === "dark" ? "light" : "dark")}
          className={`mt-2 p-2 rounded-full border ${textColor} ${hoverColor} dark:border-gray-500 border-gray-300`}
          title={`Cambiar a modo ${theme === "dark" ? "claro" : "oscuro"}`}
        >
          {theme === "dark" ? <BsSun size={18} /> : <BsMoon size={18} />}
        </button>

        {!token ? (
          <>
            <Link to={URLS.LOGIN} className={`block ${textColor} py-2`}>
              Iniciar sesión
            </Link>
            <Link to={URLS.REGISTER} className={`block ${textColor} py-2`}>
              Registrarse
            </Link>
          </>
        ) : (
          <button onClick={onLogoutClick} className={`block ${textColor} py-2`}>
            Cerrar sesión
          </button>
        )}
      </div>
    </nav>
  );
};

export default Menu;

