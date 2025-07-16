import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { Event } from "../models/Event";
import { EventService } from "../services/EventService";
import { Menu } from "../components/Menu";
import { Container } from "../components/Container";
import { URLS } from "../navigation/CONSTANTS";

const EVENTO_TYPE_LABELS: Record<string, string> = {
	birthday: "Cumpleaños",
	wedding: "Matrimonio",
	anniversary: "Aniversario",
	other: "Otro",
};

const EventoMioList = () => {
  const navigate = useNavigate();
  const [eventos, setEventos] = useState<Array<Event>>([]);

  useEffect(() => {
    cargarMisEventos();
  }, []);

  const cargarMisEventos = () => {
    EventService.listMine()
      .then(setEventos)
      .catch((error) => {
        console.error("Error al obtener la lista de eventos: ", error);
      });
  };

  const handleEliminar = async (id: number) => {
    if (!window.confirm("¿Seguro que deseas eliminar este evento?")) return;
    try {
      await EventService.delete(id);
      setEventos(eventos.filter(e => e.id !== id));
    } catch (err) {
      console.error("Error eliminando evento: ", err);
    }
  };

  return (
    <>
      <Menu />
      <Container>
        <h1 className="text-2xl font-bold mb-6 text-center">Mis Eventos</h1>
        <ul className="max-w-xl mx-auto">
          {eventos.map((evento) => (
            <li
              key={evento.id}
              className="bg-white rounded-md shadow-sm mb-4 px-5 py-3 transition duration-300 transform hover:scale-105 hover:shadow-lg flex justify-between items-center"
            >
              <div
                onClick={() => navigate(URLS.APP.DETAIL.replace(":id", evento.id.toString()))}
                className="cursor-pointer"
              >
                <div className="font-semibold">{evento.name}</div>
                <div className="text-sm text-gray-500">
                  {new Date(evento.datetime).toLocaleDateString()} &mdash; {EVENTO_TYPE_LABELS[evento.type] ?? evento.type}
                </div>
              </div>
              <button
                onClick={() => handleEliminar(evento.id)}
                className="ml-4 bg-red-600 hover:bg-red-700 text-white text-sm px-3 py-1 rounded shadow transition"
              >
                Eliminar
              </button>
            </li>
          ))}
        </ul>
      </Container>
    </>
  );
};

export default EventoMioList;
