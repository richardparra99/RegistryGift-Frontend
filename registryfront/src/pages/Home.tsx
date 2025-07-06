import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { Card } from "../components/Card";
import { Container } from "../components/Container";
import { Genero } from "../models/Genero";
import { GeneroService } from "../services/GeneroService";
import { URLS } from "../navigation/CONTANTS";
import { Menu } from "../components/Menu";
import { LibroService } from "../services/LibroService";
import { LibroResponse } from "../models/dto/LibroResponse";

const Home = () => {
    const navigate = useNavigate();

    const [generos, setGeneros] = useState<Array<Genero>>([]);
    const [top_10, setTop_10] = useState<Array<LibroResponse>>([]);

    useEffect(() => {
        getGenerosList();
        getTop10Libros();
    }, []);

    const getTop10Libros = () => {
        new LibroService().getTop10Libros()
            .then((response) => setTop_10(response))
            .catch((error) => console.error("Error al obtener los libros", error));
    };

    const getGenerosList = () => {
        new GeneroService().getGeneros()
            .then((response) => setGeneros(response))
            .catch((error) => console.error("Error al obtener la lista de géneros", error));
    };

    return (
        <>
            <Menu />
            <Container className="px-4 py-6">
                {/* Libros más populares */}
                <Card title="📚 Libros más populares" className="w-full mb-10">
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                        {top_10.map((libro) => (
                            <div
                                key={libro.id}
                                className="bg-white rounded-2xl shadow-md p-4 hover:shadow-xl transition cursor-pointer"
                                onClick={() => navigate(URLS.LIBROS.DETAIL_PATH(libro.id))}
                            >
                                <img
                                    src={libro.foto}
                                    alt={libro.titulo}
                                    className="w-full h-44 object-cover rounded-xl mb-3"
                                />
                                <h2 className="font-semibold text-lg capitalize text-gray-800">{libro.titulo}</h2>
                                <p className="text-gray-600 text-sm">{libro.autor}</p>
                            </div>
                        ))}
                        {top_10.length === 0 && (
                            <div className="col-span-full text-center py-10">
                                <p className="text-gray-500">No se encontraron libros populares. Por favor, inténtelo más tarde.</p>
                            </div>
                        )}
                    </div>
                </Card>

                {/* Lista de Géneros */}
                <Card title="🎭 Géneros literarios" className="w-full">
                    <p className="text-gray-700 mb-4">Seleccione un género para ver los libros disponibles:</p>
                    <div className="flex flex-wrap gap-4 justify-center">
                        {generos.map((genero) => (
                            <div
                                key={genero.id}
                                className="bg-gradient-to-br from-blue-100 to-blue-200 hover:from-blue-200 hover:to-blue-300 text-blue-900 font-medium shadow-sm rounded-full px-5 py-2 cursor-pointer transition duration-200"
                                onClick={() => navigate(URLS.GENEROS.DETAIL_PATH(genero.id))}
                            >
                                {genero.nombre}
                            </div>
                        ))}
                    </div>
                    {generos.length === 0 && (
                        <div className="text-center text-gray-500 mt-6">
                            No se encontraron géneros disponibles. Por favor, inténtelo más tarde.
                        </div>
                    )}
                </Card>
            </Container>
        </>
    );
};

export default Home;
