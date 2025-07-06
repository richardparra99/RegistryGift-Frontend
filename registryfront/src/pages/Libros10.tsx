import React, { useEffect, useState } from "react";
import { Libro } from "../models/Libro";
import { Genero } from "../models/Genero";
import { LibroService } from "../services/LibroService";
import { GeneroService } from "../services/GeneroService";
import { CarritoService } from "../services/CarritoService";
import { PuntajeService, PuntajeResponse } from "../services/PuntajeService";
import { Menu } from "../components/Menu";
import { Container } from "../components/Container";

const TopLibros = () => {
  const [topLibros, setTopLibros] = useState<Libro[]>([]);
  const [generos, setGeneros] = useState<Genero[]>([]);
  const [librosPorGenero, setLibrosPorGenero] = useState<Libro[]>([]);
  const [generoSeleccionado, setGeneroSeleccionado] = useState<Genero | null>(null);
  const [usuarioPuntaje, setUsuarioPuntaje] = useState<PuntajeResponse | null>(null);
  const [puntosAnimados, setPuntosAnimados] = useState(0);
  const [porcentajeAnimado, setPorcentajeAnimado] = useState(0);
  const [loadingPuntos, setLoadingPuntos] = useState(true);
  const [ranking, setRanking] = useState<PuntajeResponse[]>([]);
  const [loadingRanking, setLoadingRanking] = useState(true);

  useEffect(() => {
    new LibroService().getTopLibros().then((data) => {
      const ordenados = data.sort((a, b) => b.ventas - a.ventas);
      setTopLibros(ordenados.slice(0, 10));
    });

    new GeneroService().getGeneros().then(setGeneros);

    new PuntajeService()
      .getMiPuntaje()
      .then((data) => setUsuarioPuntaje(data))
      .catch(console.error)
      .finally(() => setLoadingPuntos(false));

    new PuntajeService()
      .getRanking()
      .then(setRanking)
      .catch(console.error)
      .finally(() => setLoadingRanking(false));
  }, []);

  useEffect(() => {
    if (!usuarioPuntaje) return;

    // Animar puntos numéricos
    const puntos = usuarioPuntaje.puntos;
    let startPuntos = 0;
    const duration = 1500;
    const stepTime = 30;
    const steps = Math.ceil(duration / stepTime);
    const incrementPuntos = puntos / steps;

    const intervalPuntos = setInterval(() => {
      startPuntos += incrementPuntos;
      if (startPuntos >= puntos) {
        startPuntos = puntos;
        clearInterval(intervalPuntos);
      }
      setPuntosAnimados(Math.floor(startPuntos));
    }, stepTime);

    // Animar porcentaje de progreso
    // Calculamos porcentaje basado en min y max puntos que vienen en usuarioPuntaje
    const minPuntos = usuarioPuntaje.min_puntos ?? 0;
    const maxPuntos = usuarioPuntaje.max_puntos ?? 100;
    const rango = maxPuntos - minPuntos;
    const porcentajeObjetivo = rango > 0
      ? Math.floor(((puntos - minPuntos) / rango) * 100)
      : 0;

    let startPorcentaje = 0;
    const incrementPorcentaje = porcentajeObjetivo / steps;

    const intervalPorcentaje = setInterval(() => {
      startPorcentaje += incrementPorcentaje;
      if (startPorcentaje >= porcentajeObjetivo) {
        startPorcentaje = porcentajeObjetivo;
        clearInterval(intervalPorcentaje);
      }
      setPorcentajeAnimado(Math.floor(startPorcentaje));
    }, stepTime);

    return () => {
      clearInterval(intervalPuntos);
      clearInterval(intervalPorcentaje);
    };
  }, [usuarioPuntaje]);

  const handleAgregarAlCarrito = async (libroId: number) => {
    try {
      await new CarritoService().agregarItem(libroId);
      alert("Herramienta añadida al carrito.");
    } catch (error: any) {
      alert("No se pudo agregar al carrito.");
    }
  };

  const handleGeneroClick = (genero: Genero) => {
    setGeneroSeleccionado(genero);
    new LibroService().getLibrosByGenero(genero.id).then(setLibrosPorGenero);
  };

  const listaMostrar = generoSeleccionado ? librosPorGenero : topLibros;

  return (
    <>
      <Menu />
      <Container className="py-8 px-4">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-blue-800">
            🔥 TOP 10 HERRAMIENTAS MÁS VENDIDAS
          </h1>

          {loadingPuntos ? (
            <p className="text-sm text-blue-700 mt-2">Cargando puntos...</p>
          ) : usuarioPuntaje ? (
            <div className="mt-6 flex flex-col items-center justify-center gap-4">
              <div className="inline-block px-6 py-3 rounded-full bg-gradient-to-r from-green-400 to-blue-500 text-white font-extrabold text-4xl tracking-wide shadow-lg select-none">
                {puntosAnimados.toLocaleString()}{" "}
                <span className="text-lg font-medium">puntos</span>
              </div>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-sm text-gray-700 font-semibold">Categoría:</span>
                <span
                  className="inline-block px-4 py-1 rounded-full text-white font-medium text-sm shadow-md"
                  style={{ backgroundImage: "linear-gradient(to right, #6EE7B7, #3B82F6)" }}
                >
                  {usuarioPuntaje.categoria}
                </span>
              </div>

              {/* Barra de progreso animada */}
              <div className="w-64 bg-gray-300 rounded-full h-6 mt-4 shadow-inner overflow-hidden">
                <div
                  className="bg-green-500 h-6 rounded-full transition-all duration-300"
                  style={{ width: `${porcentajeAnimado}%` }}
                />
              </div>
              <div className="mt-2 text-green-700 font-semibold text-lg">
                Progreso: {porcentajeAnimado}%
              </div>
            </div>
          ) : (
            <p className="text-red-500 mt-2">No se pudo cargar tu puntaje.</p>
          )}
        </div>

        <div className="mb-10 text-center">
          <h2 className="text-2xl font-bold text-yellow-600 mb-6">🏆 Ranking de Usuarios</h2>
          {loadingRanking ? (
            <p className="text-sm text-gray-500">Cargando ranking...</p>
          ) : (
            <div className="max-w-md mx-auto bg-yellow-50 p-6 rounded-xl shadow-lg border border-yellow-300">
              {ranking.map((r, index) => {
                const podiumIcons = ["🥇", "🥈", "🥉"];
                const isTopThree = index < 3;
                const colors = [
                  "text-yellow-600 bg-yellow-100 font-extrabold",
                  "text-gray-600 bg-gray-100 font-semibold",
                  "text-yellow-800 bg-yellow-200 font-semibold",
                ];
                return (
                  <div
                    key={index}
                    className={`flex justify-between items-center py-3 px-4 mb-2 rounded-lg cursor-default transition hover:bg-yellow-200 ${
                      isTopThree ? colors[index] : "text-gray-700 bg-yellow-50"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-lg">{podiumIcons[index] || `#${index + 1}`}</span>
                      <span className="text-base">{r.usuario}</span>
                    </div>
                    <span className="text-lg font-semibold text-green-700">
                      {r.puntos.toLocaleString()} pts
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {generos.map((genero) => (
            <button
              key={genero.id}
              onClick={() => handleGeneroClick(genero)}
              className={`px-4 py-2 rounded-full border text-sm ${
                generoSeleccionado?.id === genero.id
                  ? "bg-blue-600 text-white"
                  : "bg-white text-blue-600 border-blue-600 hover:bg-blue-50"
              }`}
            >
              {genero.nombre}
            </button>
          ))}
        </div>

        {generoSeleccionado && (
          <div className="text-center mb-6">
            <button
              onClick={() => setGeneroSeleccionado(null)}
              className="text-sm underline text-blue-600 hover:text-blue-800"
            >
              Mostrar todas las herramientas
            </button>
          </div>
        )}

        <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 mb-16">
          {listaMostrar.map((libro, index) => (
            <LibroCard
              key={libro.id}
              libro={libro}
              onAgregar={handleAgregarAlCarrito}
              posicion={index + 1}
            />
          ))}
        </div>
      </Container>
    </>
  );
};

const LibroCard = ({
  libro,
  onAgregar,
  posicion,
}: {
  libro: Libro;
  onAgregar: (libroId: number) => void;
  posicion: number;
}) => {
  const medallas = ["🥇", "🥈", "🥉"];
  const mostrarMedalla = posicion <= 3;

  return (
    <div className="relative bg-white rounded-xl shadow hover:shadow-lg transition-shadow duration-200 border p-4 flex flex-col items-center text-center">
      <div
        className={`absolute top-3 left-3 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shadow-lg select-none ${
          mostrarMedalla ? "bg-yellow-400 text-white" : "bg-blue-600 text-white"
        }`}
      >
        {mostrarMedalla ? medallas[posicion - 1] : posicion}
      </div>

      {libro.foto && (
        <img
          src={libro.foto}
          alt={libro.titulo}
          className="w-32 h-44 object-cover rounded-md mb-3"
        />
      )}
      <h2 className="text-md font-semibold text-gray-800">{libro.titulo}</h2>
      <p className="text-gray-600 text-sm mb-1">{libro.autor}</p>
      <p className="text-sm text-blue-600 font-medium mb-2">Ventas: {libro.ventas}</p>

      <button
        onClick={() => onAgregar(libro.id)}
        className="mt-auto bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm transition-colors"
      >
        Añadir al carrito 🛒
      </button>
    </div>
  );
};

export default TopLibros;
