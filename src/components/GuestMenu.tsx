import { Link } from "react-router";
import { URLS } from "../navigation/CONSTANTS";

export const GuestMenu = () => {
    return (
        <div className="justify-end p-4 flex">
            <div className="flex items-center space-x-4">
                <Link
                    to={URLS.LOGIN}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded shadow transition"
                >
                    Iniciar Sesión
                </Link>
                <Link
                    to={URLS.REGISTER}
                    className="bg-black hover:bg-gray-800 text-white font-semibold py-2 px-4 rounded shadow transition"
                >
                    Registrarse
                </Link>
            </div>
        </div>
    );
};
