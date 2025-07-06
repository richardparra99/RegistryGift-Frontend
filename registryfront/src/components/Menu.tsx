import { useState, useEffect } from "react";
import { Link } from "react-router";
import { BsChevronDown, BsList, BsCart4, BsTrash } from "react-icons/bs";
import { URLS } from "../navigation/CONTANTS";
import { useAuth } from "../hooks/useAuth";
import { CarritoService } from "../services/CarritoService";

export const Menu = () => {
  const [showMenu, setShowMenu] = useState(false);
  const [showCarrito, setShowCarrito] = useState(false);
  const [carritoItems, setCarritoItems] = useState<any[]>([]);
  const { email, isAdmin, doLogout } = useAuth();

  useEffect(() => {
    if (showCarrito) {
      loadCarrito();
    }
  }, [showCarrito]);

  const loadCarrito = async () => {
    try {
      const items = await new CarritoService().obtenerCarrito();
      setCarritoItems(items);
    } catch (error) {
      console.error("Error cargando carrito:", error);
    }
  };

  const toggleMenu = () => setShowMenu((prev) => !prev);
  const toggleCarrito = () => setShowCarrito((prev) => !prev);

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

  const onLogoutClick = () => {
    doLogout();
    window.location.href = URLS.HOME;
  };

  const eliminarDelCarrito = async (itemId: number) => {
    try {
      await new CarritoService().eliminarItem(itemId);
      await loadCarrito();
    } catch (error) {
      alert("No se pudo eliminar el ítem del carrito.");
    }
  };

  return (
    <nav className="bg-black shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to={URLS.HOME} className="text-xl font-bold text-white">
              Gyft Registry
            </Link>
          </div>

          <div className="flex items-center md:hidden space-x-4">
            {/* Botón carrito móvil */}
            <button
              onClick={toggleCarrito}
              className="text-white focus:outline-none relative"
              title="Ver carrito"
            >
              <BsCart4 size={24} />
              {carritoItems.length > 0 && (
                <span className="absolute top-0 right-0 bg-red-600 rounded-full text-xs px-1">
                  {carritoItems.length}
                </span>
              )}
            </button>

            {/* Botón menú hamburguesa */}
            <button onClick={toggleMenu} className="text-white focus:outline-none">
              <BsList />
            </button>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            <Link to={URLS.HOME} className="text-white hover:text-blue-600">
              Inicio
            </Link>

            {/* Submenú Genérico */}
            {[
              {
                id: "eventos",
                label: "Eventos",
                links: [
                  { to: URLS.EVENTOS.LIST, label: "Lista De Eventos" },
                  ...(isAdmin
                    ? [
                        { to: URLS.EVENTOS.LIST_EDIT, label: "Administrar Evento" },
                        { to: URLS.EVENTOS.CREATE, label: "Crear Evento" },
                      ]
                    : []),
                ],
              },
                   {
                id: "regalos",
                label: "Regalos",
                links: [
                  { to: URLS.REGALOS.LIST, label: "Lista De Regalos" },
                  ...(isAdmin
                    ? [
                        { to: URLS.REGALOS.LIST_EDIT, label: "Administrar Regalo" },
                        { to: URLS.REGALOS.CREATE, label: "Crear Regalo" },
                      ]
                    : []),
                ],
              },

            ].map(({ id, label, links }) => (
              <div key={id} className="relative group">
                <button
                  onClick={() => toggleSubMenu(id)}
                  className="text-white hover:text-blue-600 flex items-center"
                >
                  {label} <BsChevronDown size={10} className="inline ml-1" />
                </button>
                <div id={id} className="absolute hidden bg-white shadow-md mt-2 rounded-md z-10 min-w-[160px]">
                  {links.map((link) => (
                    <Link
                      key={link.to}
                      to={link.to}
                      className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
            {/*
  email && isAdmin && (
    <Link to={URLS.USUARIOS.LIST} className="text-white hover:text-blue-600">
      Lista De Usuarios
    </Link>
  )
*/}
            {!email && (
              <Link to={URLS.LOGIN} className="text-white hover:text-blue-600">
                Iniciar sesión
              </Link>
            )}

            {email && (
              <div className="relative group">
                <button
                  onClick={() => toggleSubMenu("authMenu")}
                  className="text-white hover:text-blue-600 flex items-center"
                >
                  {email} <BsChevronDown size={10} className="inline ml-1" />
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

      {/* Menú móvil */}
      <div className={`md:hidden px-4 pb-4 ${!showMenu ? "hidden" : ""}`}>
        <Link to={URLS.HOME} className="block text-white py-2">
          Inicio
        </Link>
        <Link to={URLS.GENEROS.LIST} className="block text-white py-2">
          Lista de géneros
        </Link>
        {isAdmin && (
          <>
            <Link to={URLS.GENEROS.LIST_EDIT} className="block text-white py-2">
              Administrar géneros
            </Link>
            <Link to={URLS.GENEROS.CREATE} className="block text-white py-2">
              Crear género
            </Link>
          </>
        )}
        <Link to={URLS.LIBROS.LIST} className="block text-white py-2">
          Lista de libros
        </Link>
        {isAdmin && (
          <>
            <Link to={URLS.LIBROS.LIST_EDIT} className="block text-white py-2">
              Administrar libros
            </Link>
            <Link to={URLS.LIBROS.CREATE} className="block text-white py-2">
              Crear libro
            </Link>
          </>
        )}
        {email && !isAdmin && (
          <Link to={URLS.MIS_COMPRAS} className="block text-white py-2">
            Mis compras
          </Link>
        )}
        {!email && (
          <Link to={URLS.LOGIN} className="block text-white py-2">
            Iniciar sesión
          </Link>
        )}
        {email && (
          <button onClick={onLogoutClick} className="block text-white py-2">
            Cerrar sesión
          </button>
        )}
      </div>

      {/* Panel carrito móvil */}
      {showCarrito && (
        <div className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-40 flex justify-center items-start pt-20">
          <div className="bg-white w-80 max-h-[70vh] overflow-y-auto rounded-md p-4 relative">
            <button
              onClick={toggleCarrito}
              className="absolute top-2 right-2 text-gray-600 hover:text-gray-900 font-bold"
              title="Cerrar carrito"
            >
              ×
            </button>
            <h3 className="text-lg font-semibold mb-3 text-center">Carrito</h3>
            {carritoItems.length === 0 ? (
              <p className="text-center text-gray-700">El carrito está vacío.</p>
            ) : (
              <ul className="divide-y divide-gray-200">
                {carritoItems.map((item, idx) => (
                  <li key={idx} className="flex items-center p-2">
                    {item.libro_foto && (
                      <img
                        src={item.libro_foto}
                        alt={item.libro_titulo}
                        className="w-12 h-14 object-cover rounded mr-3"
                      />
                    )}
                    <div className="flex-1 text-sm">
                      <p className="font-medium">{item.libro_titulo}</p>
                      <p className="text-gray-500">{item.libro_autor}</p>
                      <p className="text-blue-700 font-semibold">{item.libro_precio} Bs.</p>
                    </div>
                    <button
                      onClick={() => eliminarDelCarrito(item.id)}
                      className="text-red-600 hover:text-red-800 p-1"
                      title="Eliminar"
                    >
                      <BsTrash size={18} />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Menu;
