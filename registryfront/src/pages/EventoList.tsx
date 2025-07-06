import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { Evento } from "../models/Evento";
import { EventoService } from "../services/EventoService";
import { Menu } from "../components/Menu";
import { Container } from "../components/Container";
import { URLS } from "../navigation/CONTANTS";

const EventoList = () => {
  const navigate = useNavigate();
  const [eventos, setEventos] = useState<Array<Evento>>([]);

  const getEventoList = () => {
    new EventoService()
      .getEventos()
      .then((response) => {
        setEventos(response);
      })
      .catch((error) => {
        console.error("Error al obtener los eventos: ", error);
      });
  };

  useEffect(() => {
    getEventoList();
  }, []);

  return (
    <>
      <Menu />
      <Container>
        <h1 className="text-2xl font-bold mb-6 text-center">Lista de Eventos</h1>
        <ul className="max-w-xl mx-auto">
          {eventos.map((evento) => (
            <li
              key={evento.id}
              onClick={() => navigate(URLS.EVENTOS.DETAIL_PATH(evento.id))}
              className="cursor-pointer bg-white rounded-md shadow-sm mb-4 px-5 py-3 hover:bg-gray-50 transition-colors"
            >
              <div className="font-semibold">{evento.nombre}</div>
              <div className="text-sm text-gray-500">
                {new Date(evento.fecha).toLocaleDateString()} &mdash; {evento.tipo}
              </div>
            </li>
          ))}
        </ul>
      </Container>
    </>
  );
};

export default EventoList;
