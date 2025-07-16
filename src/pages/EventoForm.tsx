import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import { EventService } from "../services/EventService";
import { URLS } from "../navigation/CONSTANTS";
import { Container } from "../components/Container";
import { Menu } from "../components/Menu";

const EVENTO_TYPE_LABELS: Record<string, string> = {
  birthday: "Cumpleaños",
  wedding: "Matrimonio",
  anniversary: "Aniversario",
  other: "Otro",
};

const EVENTO_COLOR_LABELS: Record<string, string> = {
  red: "Rojo",
  blue: "Azul",
  green: "Verde",
  orange: "Naranja",
  purple: "Morado",
  yellow: "Amarillo",
  pink: "Rosa",
  gray: "Gris",
  teal: "Turquesa",
  brown: "Marrón",
};

const EventoForm = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [datetime, setDatetime] = useState("");
  const [type, setType] = useState<"" | "birthday" | "wedding" | "anniversary" | "other">("");
  const [color, setColor] = useState<"" | "red" | "blue" | "green" | "orange" | "purple" | "yellow" | "pink" | "gray" | "teal" | "brown">("");
  const [isPrivate, setIsPrivate] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = Boolean(id);

  useEffect(() => {
    if (isEditMode && id) {
      EventService.get(parseInt(id))
        .then((evento) => {
          setName(evento.name);
          setDescription(evento.description || "");
          setDatetime(evento.datetime.slice(0, 10));
          setType(EVENTO_TYPE_LABELS[evento.type] ? evento.type : "");
          setColor(EVENTO_COLOR_LABELS[evento.color] ? evento.color : "");
          setIsPrivate(Boolean(evento.private));
        })
        .catch(() => setError("No se pudo cargar el evento."));
    }
  }, [id, isEditMode]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim() || !datetime || !type || !color) {
      setError("Todos los campos obligatorios deben ser completados.");
      return;
    }

    try {
      const data = {
        name,
        description,
        datetime,
        type,
        color,
        private: isPrivate,
      };

      let res;

      if (isEditMode && id) {
        await EventService.update(parseInt(id), data);
        navigate(URLS.APP.DETAIL.replace(":id", id));
      } else {
        res = await EventService.create(data);
        navigate(URLS.APP.DETAIL.replace(":id", res.id.toString()));
      }
    } catch (err) {
      console.error(err);
      setError("Ocurrió un error al guardar el evento.");
    }
  };

  return (
    <>
      <Menu />
      <Container>
        <div className="max-w-md mx-auto mt-10 p-8 bg-white rounded-2xl shadow-lg">
          <h2 className="text-2xl font-bold mb-6 text-center">
            {isEditMode ? "Editar Evento" : "Crear Nuevo Evento"}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block font-semibold mb-1">Nombre</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg shadow transition transform 
                hover:scale-105 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
              />
            </div>
            <div>
              <label className="block font-semibold mb-1">Descripción</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg shadow transition transform 
                hover:scale-105 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                rows={3}
              />
            </div>
            <div>
              <label className="block font-semibold mb-1">Fecha</label>
              <input
                type="date"
                value={datetime}
                onChange={(e) => setDatetime(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg shadow transition transform 
                hover:scale-105 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
              />
            </div>
            <div>
              <label className="block font-semibold mb-1">Tipo de Evento</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as any)}
                className="w-full px-4 py-2 border rounded-lg shadow transition transform 
                hover:scale-105 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
              >
                <option value="">Seleccionar tipo</option>
                {Object.entries(EVENTO_TYPE_LABELS).map(([key, label]) => (
                  <option key={key} value={key}>
                    {label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block font-semibold mb-1">Color de Evento</label>
              <select
                value={color}
                onChange={(e) => setColor(e.target.value as any)}
                className="w-full px-4 py-2 border rounded-lg shadow transition transform 
                hover:scale-105 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
              >
                <option value="">Seleccionar color</option>
                {Object.entries(EVENTO_COLOR_LABELS).map(([key, label]) => (
                  <option key={key} value={key}>
                    {label}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-center space-x-2">
              <input
                id="private"
                type="checkbox"
                checked={isPrivate}
                onChange={(e) => setIsPrivate(e.target.checked)}
                className="rounded focus:ring-2 focus:ring-blue-400 transition transform hover:scale-105"
              />
              <label htmlFor="private" className="font-semibold">
                Evento privado
              </label>
            </div>
            {error && <p className="text-red-500">{error}</p>}
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg shadow transition 
              transform hover:scale-105"
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
