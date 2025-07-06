import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import { RegaloService } from "../services/RegaloService";
import { URLS } from "../navigation/CONTANTS";
import { Container } from "../components/Container";
import { Menu } from "../components/Menu";

const prioridadOpciones = [
  { value: "ALTA", label: "Alta" },
  { value: "MEDIA", label: "Media" },
  { value: "BAJA", label: "Baja" },
];

const regaloService = new RegaloService();

const RegaloForm = () => {
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [url, setUrl] = useState("");
  const [cantidadDeseada, setCantidadDeseada] = useState(1);
  const [prioridad, setPrioridad] = useState<"ALTA" | "MEDIA" | "BAJA">("MEDIA");
  const [eventoId, setEventoId] = useState<number | null>(null);
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = Boolean(id);

  useEffect(() => {
    const storedEventoId = localStorage.getItem("evento_id");
    if (storedEventoId) setEventoId(Number(storedEventoId));

    if (isEditMode && id) {
      regaloService.getRegalo(Number(id)).then((regalo) => {
        setNombre(regalo.nombre);
        setDescripcion(regalo.descripcion || "");
        setUrl(regalo.url || "");
        setCantidadDeseada(regalo.cantidad_deseada);
        setPrioridad(regalo.prioridad as "ALTA" | "MEDIA" | "BAJA");
        setEventoId(typeof regalo.evento === "number" ? regalo.evento : regalo.evento.id);
      });
    }
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!nombre.trim() || !eventoId) {
      setError("Nombre y evento son obligatorios.");
      return;
    }

    try {
      const data = {
        nombre,
        descripcion,
        url,
        cantidad_deseada: cantidadDeseada,
        prioridad,
        evento: eventoId,
      };

      if (isEditMode && id) {
        await regaloService.updateRegalo(Number(id), data);
      } else {
        await regaloService.createRegalo(data);
      }

      navigate(URLS.REGALOS.LIST_EDIT);
    } catch (err) {
      console.error(err);
      setError("Ocurrió un error al guardar el regalo.");
    }
  };

  return (
    <>
      <Menu />
      <Container>
        <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded shadow-md">
          <h2 className="text-xl font-bold mb-4">
            {isEditMode ? "Editar Regalo" : "Crear Nuevo Regalo"}
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
              <label className="block font-semibold mb-1">Enlace (opcional)</label>
              <input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="w-full px-3 py-2 border rounded"
              />
            </div>
            <div className="mb-4">
              <label className="block font-semibold mb-1">Cantidad Deseada</label>
              <input
                type="number"
                min={1}
                value={cantidadDeseada}
                onChange={(e) => setCantidadDeseada(Number(e.target.value))}
                className="w-full px-3 py-2 border rounded"
              />
            </div>
            <div className="mb-4">
              <label className="block font-semibold mb-1">Prioridad</label>
              <select
                value={prioridad}
                onChange={(e) => setPrioridad(e.target.value as "ALTA" | "MEDIA" | "BAJA")}
                className="w-full px-3 py-2 border rounded"
              >
                {prioridadOpciones.map((opcion) => (
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

export default RegaloForm;
