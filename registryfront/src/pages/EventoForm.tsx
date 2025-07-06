import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import { EventoService } from "../services/EventoService";
import { URLS } from "../navigation/CONTANTS";
import { Container } from "../components/Container";
import { Menu } from "../components/Menu";

const eventoService = new EventoService();

const tipoOpciones = [
  { value: "CUMPLEAÑOS", label: "Cumpleaños" },
  { value: "BODA", label: "Boda" },
  { value: "BABY_SHOWER", label: "Baby Shower" },
  { value: "NAVIDAD", label: "Navidad" },
  { value: "OTRO", label: "Otro" },
];

const EventoForm = () => {
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [fecha, setFecha] = useState("");
  const [tipo, setTipo] = useState("CUMPLEAÑOS");
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = Boolean(id);

  useEffect(() => {
    if (isEditMode && id) {
      eventoService.getEvento(parseInt(id)).then((evento) => {
        setNombre(evento.nombre);
        setDescripcion(evento.descripcion || "");
        setFecha(evento.fecha);
        setTipo(evento.tipo);
      });
    }
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!nombre.trim() || !fecha || !tipo) {
      setError("Todos los campos obligatorios deben ser completados.");
      return;
    }

    try {
      const data = { nombre, descripcion, fecha, tipo };

      if (isEditMode && id) {
        await eventoService.updateEvento(parseInt(id), data);
      } else {
        await eventoService.createEvento(data);
      }

      navigate(URLS.EVENTOS.LIST_EDIT);
    } catch (err) {
      console.error(err);
      setError("Ocurrió un error al guardar el evento.");
    }
  };

  return (
    <>
      <Menu />
      <Container>
        <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded shadow-md">
          <h2 className="text-xl font-bold mb-4">
            {isEditMode ? "Editar Evento" : "Crear Nuevo Evento"}
          </h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block font-semibold mb-1">Nombre</label>
              <input
                type="text"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                className="w-full px-3 py-2 border rounded"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block font-semibold mb-1">Descripción</label>
              <textarea
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
                className="w-full px-3 py-2 border rounded"
                rows={3}
              />
            </div>
            <div className="mb-4">
              <label className="block font-semibold mb-1">Fecha</label>
              <input
                type="date"
                value={fecha}
                onChange={(e) => setFecha(e.target.value)}
                className="w-full px-3 py-2 border rounded"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block font-semibold mb-1">Tipo de Evento</label>
              <select
                value={tipo}
                onChange={(e) => setTipo(e.target.value)}
                className="w-full px-3 py-2 border rounded"
                required
              >
                {tipoOpciones.map((opcion) => (
                  <option key={opcion.value} value={opcion.value}>
                    {opcion.label}
                  </option>
                ))}
              </select>
            </div>
            {error && <p className="text-red-500 mb-4">{error}</p>}
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              {isEditMode ? "Guardar Cambios" : "Crear"}
            </button>
          </form>
        </div>
      </Container>
    </>
  );
};

export default EventoForm;
