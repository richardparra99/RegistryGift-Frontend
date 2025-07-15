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

const EVENTO_COLOR_CLASSES: Record<string, string> = {
  red: "border-red-400 hover:bg-red-50",
  blue: "border-blue-400 hover:bg-blue-50",
  green: "border-green-400 hover:bg-green-50",
  orange: "border-orange-400 hover:bg-orange-50",
  purple: "border-purple-400 hover:bg-purple-50",
  yellow: "border-yellow-400 hover:bg-yellow-50",
  pink: "border-pink-400 hover:bg-pink-50",
  gray: "border-gray-400 hover:bg-gray-50",
  teal: "border-teal-400 hover:bg-teal-50",
  brown: "border-amber-700 hover:bg-amber-50",
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
              className={`cursor-pointer bg-white rounded-md shadow-sm mb-4 px-5 py-3 border-l-8 transition ${
                EVENTO_COLOR_CLASSES[evento.color] ?? "border-gray-300 hover:bg-gray-50"
              }`}
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
