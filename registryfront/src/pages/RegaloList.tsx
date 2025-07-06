import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { Regalo } from "../models/Regalo";
import { RegaloService } from "../services/RegaloService";
import { Container } from "../components/Container";
import { Menu } from "../components/Menu";

const RegaloList = () => {
  const [regalos, setRegalos] = useState<Regalo[]>([]);
  const [loadingIds, setLoadingIds] = useState<number[]>([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Simular usuario logueado
  const currentUserId = 1;

  useEffect(() => {
    new RegaloService().getRegalos().then(setRegalos);
  }, []);

  const handleToggleReserva = async (regalo: Regalo) => {
    setError("");
    setLoadingIds((prev) => [...prev, regalo.id]);

    try {
      const service = new RegaloService();
      if (regalo.reservado && regalo.reservado_por?.id === currentUserId) {
        await service.cancelarReserva(regalo.id);
        setRegalos((prev) =>
          prev.map((r) => (r.id === regalo.id ? { ...r, reservado: false, reservado_por: null } : r))
        );
      } else if (!regalo.reservado) {
        await service.reservarRegalo(regalo.id);
        setRegalos((prev) =>
          prev.map((r) => (r.id === regalo.id ? { ...r, reservado: true, reservado_por: { id: currentUserId, username: "Tú" } } : r))
        );
      } else {
        setError("Este regalo ya está reservado por otro usuario.");
      }
    } catch {
      setError("Error al actualizar la reserva.");
    } finally {
      setLoadingIds((prev) => prev.filter((id) => id !== regalo.id));
    }
  };

  return (
    <>
      <Menu />
      <Container>
        <h1 className="text-2xl font-bold mb-6 text-center">Lista de Regalos</h1>
        {error && <p className="text-red-600 mb-4 text-center">{error}</p>}
        <ul className="max-w-2xl mx-auto space-y-4">
          {regalos.map((regalo) => {
            const isLoading = loadingIds.includes(regalo.id);
            const userReserved = regalo.reservado && regalo.reservado_por?.id === currentUserId;

            return (
              <li
                key={regalo.id}
                className="p-4 rounded shadow bg-white flex justify-between items-center cursor-pointer hover:bg-gray-100 transition"
              >
                <div onClick={() => navigate(`/regalos/${regalo.id}`)}>
                  <div className="font-semibold">{regalo.nombre}</div>
                  <div className="text-sm text-gray-600">Prioridad: {regalo.prioridad || "No definida"}</div>
                  <div className="text-sm text-gray-500">Estado: {regalo.reservado ? "Reservado" : "Disponible"}</div>
                </div>
                <button
                  onClick={() => handleToggleReserva(regalo)}
                  disabled={isLoading || (regalo.reservado && !userReserved)}
                  className={`px-3 py-1 rounded text-white ${
                    userReserved
                      ? "bg-red-600 hover:bg-red-700"
                      : "bg-green-600 hover:bg-green-700"
                  }`}
                >
                  {isLoading ? "Procesando..." : userReserved ? "Cancelar Reserva" : regalo.reservado ? "No disponible" : "Reservar"}
                </button>
              </li>
            );
          })}
        </ul>
      </Container>
    </>
  );
};

export default RegaloList;

