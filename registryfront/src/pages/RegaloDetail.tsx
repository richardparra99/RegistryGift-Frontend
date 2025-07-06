import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { Regalo } from "../models/Regalo";
import { RegaloService } from "../services/RegaloService";
import { Menu } from "../components/Menu";
import { Container } from "../components/Container";

const regaloService = new RegaloService();

const RegaloDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [regalo, setRegalo] = useState<Regalo | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [userReserved, setUserReserved] = useState(false); // para saber si yo reservé

  // Simular usuario logueado, deberías obtenerlo del contexto o auth global
  const currentUserId = 1; 

  useEffect(() => {
    if (id) {
      regaloService.getRegalo(Number(id)).then((r) => {
        setRegalo(r);
        setUserReserved(r.reservado_por?.id === currentUserId);
      });
    }
  }, [id]);

  const handleReservar = async () => {
    if (!regalo) return;
    setLoading(true);
    setError("");
    try {
      if (userReserved) {
        // Cancelar reserva
        await regaloService.cancelarReserva(regalo.id);
        setUserReserved(false);
        setRegalo({ ...regalo, reservado: false, reservado_por: null });
      } else {
        // Reservar
        await regaloService.reservarRegalo(regalo.id);
        setUserReserved(true);
        setRegalo({ ...regalo, reservado: true, reservado_por: { id: currentUserId, username: "Tú" } });
      }
    } catch (err) {
      setError("Error al cambiar la reserva.");
    } finally {
      setLoading(false);
    }
  };

  if (!regalo) return <p className="text-center mt-10">Cargando...</p>;

  return (
    <>
      <Menu />
      <Container className="max-w-xl mx-auto mt-10 bg-white p-6 rounded shadow">
        <h2 className="text-2xl font-bold mb-4">{regalo.nombre}</h2>
        <p className="mb-2"><strong>Descripción:</strong> {regalo.descripcion || "Sin descripción"}</p>
        <p className="mb-2"><strong>Prioridad:</strong> {regalo.prioridad || "No especificada"}</p>
        <p className="mb-2"><strong>Cantidad Deseada:</strong> {regalo.cantidad_deseada}</p>
        <p className="mb-2"><strong>Reservado:</strong> {regalo.reservado ? "Sí" : "No"}</p>
        {regalo.url && (
          <p className="mb-2">
            <a href={regalo.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
              Ver producto
            </a>
          </p>
        )}
        <button
          onClick={handleReservar}
          disabled={loading}
          className={`mt-4 px-4 py-2 rounded text-white ${
            userReserved ? "bg-red-600 hover:bg-red-700" : "bg-green-600 hover:bg-green-700"
          }`}
        >
          {loading ? "Procesando..." : userReserved ? "Cancelar Reserva" : regalo.reservado ? "Reservado (No disponible)" : "Reservar"}
        </button>
        {error && <p className="text-red-600 mt-2">{error}</p>}
      </Container>
    </>
  );
};

export default RegaloDetail;
