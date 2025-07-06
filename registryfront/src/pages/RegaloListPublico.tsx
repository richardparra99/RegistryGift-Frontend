import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { Regalo } from "../models/Regalo";
import { RegaloService } from "../services/RegaloService";
import { Container } from "../components/Container";
import { Menu } from "../components/Menu";

const regaloService = new RegaloService();

const RegaloListPublico = () => {
  const { eventoId } = useParams<{ eventoId: string }>();
  const [regalos, setRegalos] = useState<Regalo[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    if (eventoId) {
      regaloService
        .getRegalosPorEvento(Number(eventoId))
        .then(setRegalos)
        .catch(() => setError("Error al cargar los regalos."));
    }
  }, [eventoId]);

  return (
    <>
      <Menu />
      <Container className="max-w-4xl mx-auto mt-10">
        <h1 className="text-2xl font-bold text-center mb-6">
          Lista Pública de Regalos del Evento #{eventoId}
        </h1>

        {error && <p className="text-red-500 text-center">{error}</p>}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {regalos.map((regalo) => (
            <div key={regalo.id} className="bg-white rounded-xl shadow-md p-4">
              <h2 className="text-xl font-semibold mb-2">{regalo.nombre}</h2>
              {regalo.descripcion && <p className="text-gray-700 mb-2">{regalo.descripcion}</p>}
              {regalo.url && (
                <a
                  href={regalo.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline text-sm block mb-2"
                >
                  Ver producto
                </a>
              )}
              <p className="text-sm">
                <strong>Reservado:</strong> {regalo.reservado ? "Sí" : "No"}
              </p>
              <p className="text-sm">
                <strong>Prioridad:</strong> {regalo.prioridad || "Normal"}
              </p>
              <p className="text-sm">
                <strong>Cantidad deseada:</strong> {regalo.cantidad_deseada}
              </p>
            </div>
          ))}
        </div>

        {regalos.length === 0 && !error && (
          <p className="text-center text-gray-500 mt-6">No hay regalos aún para este evento.</p>
        )}
      </Container>
    </>
  );
};

export default RegaloListPublico;
