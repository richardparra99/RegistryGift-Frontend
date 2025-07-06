import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import { Evento } from "../models/Evento";
import { EventoService } from "../services/EventoService";
import { Container } from "../components/Container";
import { Menu } from "../components/Menu";
import { URLS } from "../navigation/CONTANTS";

const eventoService = new EventoService();

const EventoDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [evento, setEvento] = useState<Evento | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      eventoService
        .getEvento(Number(id))
        .then(setEvento)
        .catch((err) => {
          console.error("Error al obtener el evento:", err);
        });
    }
  }, [id]);

  const handleAgregarRegalo = () => {
    if (evento?.id) {
      localStorage.setItem("evento_id", evento.id.toString());
      navigate(URLS.REGALOS.CREATE); // Ruta hacia el formulario de regalo
    }
  };

  const handleVerRegalos = () => {
    if (evento?.id) {
      navigate(URLS.REGALOS.LIST_FOR_EVENT(evento.id)); // Ruta hacia la lista de regalos por evento
    }
  };

  if (!evento) {
    return (
      <>
        <Menu />
        <Container>
          <p className="text-center text-gray-500 mt-10">Cargando evento...</p>
        </Container>
      </>
    );
  }

  return (
    <>
      <Menu />
      <Container className="max-w-3xl mx-auto mt-10">
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h1 className="text-3xl font-bold mb-4 text-center">{evento.nombre}</h1>
          <p className="text-gray-700 mb-2">
            <span className="font-semibold">Descripción:</span>{" "}
            {evento.descripcion || "Sin descripción"}
          </p>
          <p className="text-gray-700 mb-2">
            <span className="font-semibold">Fecha:</span>{" "}
            {new Date(evento.fecha).toLocaleDateString()}
          </p>
          <p className="text-gray-700 mb-4">
            <span className="font-semibold">Tipo:</span> {evento.tipo}
          </p>
          <p className="text-gray-500 text-sm text-right">Creado por: {evento.creado_por}</p>

          <div className="flex justify-center gap-4 mt-6">
            <button
              onClick={handleAgregarRegalo}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded shadow"
            >
              Agregar Regalo
            </button>

            <button
              onClick={handleVerRegalos}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded shadow"
            >
              Ver Lista de Regalos
            </button>
          </div>
        </div>
      </Container>
    </>
  );
};

export default EventoDetail;

