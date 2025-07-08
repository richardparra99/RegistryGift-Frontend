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

const EventoList = () => {
  const navigate = useNavigate();
  const [eventos, setEventos] = useState<Array<Event>>([]);

  useEffect(() => {
    EventService.list()
      .then(setEventos)
      .catch((error) => {
        console.error("Error al obtener la lista de eventos: ", error);
      });
  }, []);

  return (
    <>
      <Menu />
      <Container>
        <h1 className="text-2xl font-bold mb-6 text-center">Eventos Publicos</h1>
        <ul className="max-w-xl mx-auto">
          {eventos.map((evento) => (
            <li
              key={evento.id}
              onClick={() => navigate(URLS.APP.DETAIL.replace(":id", evento.id.toString()))}
              className="cursor-pointer bg-white rounded-md shadow-sm mb-4 px-5 py-3 hover:bg-gray-50 transition-colors"
            >
              <div className="font-semibold">{evento.name}</div>
              <div className="text-sm text-gray-500">
                {new Date(evento.datetime).toLocaleDateString()} &mdash; {EVENTO_TYPE_LABELS[evento.type] ?? evento.type}
              </div>
            </li>
          ))}
        </ul>
      </Container>
    </>
  );
};

export default EventoList;
