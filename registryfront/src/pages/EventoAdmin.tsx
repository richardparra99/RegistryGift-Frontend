import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { Evento } from "../models/Evento";
import { EventoService } from "../services/EventoService";
import { Container } from "../components/Container";
import { Menu } from "../components/Menu";

const eventoService = new EventoService();

const EventoAdmin = () => {
  const [eventos, setEventos] = useState<Evento[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    eventoService.getMisEventos().then(setEventos);
  }, []);

  const handleEdit = (id: number) => {
    navigate(`/eventos/editar/${id}`);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar este evento?")) {
      await eventoService.deleteEvento(id);
      setEventos((prev) => prev.filter((e) => e.id !== id));
    }
  };

  return (
    <>
      <Menu />
      <Container>
        <div className="max-w-4xl mx-auto mt-10 p-4 bg-white shadow rounded">
          <h2 className="text-2xl font-bold mb-6 text-center">Administrar Eventos</h2>
          {eventos.length === 0 ? (
            <p className="text-center text-gray-600">No tienes eventos creados.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {eventos.map((evento) => (
                <div
                  key={evento.id}
                  className="border rounded-lg p-4 shadow hover:shadow-lg transition-shadow duration-300"
                >
                  <h3 className="text-xl font-semibold mb-2">{evento.nombre}</h3>
                  <p className="text-gray-600 mb-1">
                    Fecha: {new Date(evento.fecha).toLocaleDateString()}
                  </p>
                  <p className="text-gray-600 mb-4">Tipo: {evento.tipo}</p>
                  <div className="flex justify-end space-x-4">
                    <button
                      onClick={() => handleEdit(evento.id)}
                      className="text-white bg-blue-600 px-3 py-1 rounded hover:bg-blue-700 transition"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDelete(evento.id)}
                      className="text-white bg-red-600 px-3 py-1 rounded hover:bg-red-700 transition"
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </Container>
    </>
  );
};

export default EventoAdmin;
