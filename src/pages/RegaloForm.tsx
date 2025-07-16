import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { GiftService } from "../services/GiftService";
import { URLS } from "../navigation/CONSTANTS";
import { Container } from "../components/Container";
import { Menu } from "../components/Menu";

const PRIORITY_LABELS: Record<string, string> = {
  high: "Alto",
  medium: "Medio",
  low: "Bajo",
};

const RegaloForm = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [referenceLink, setReferenceLink] = useState("");
  const [priority, setPriority] = useState<"high" | "medium" | "low" | "">("");
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const { eventoId, id } = useParams<{ eventoId: string; id?: string }>();
  const isEditMode = Boolean(id);

  useEffect(() => {
    if (isEditMode && id) {
      GiftService.get(parseInt(id))
        .then((regalo) => {
          setName(regalo.name);
          setDescription(regalo.description);
          setQuantity(regalo.quantity);
          setReferenceLink(regalo.reference_link || "");
          setPriority(regalo.priority || "");
        })
        .catch(() => setError("No se pudo cargar el regalo."));
    }
  }, [id, isEditMode]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validación simple
    if (!name.trim() || !description.trim() || quantity <= 0) {
      setError("Los campos obligatorios deben ser completados correctamente.");
      return;
    }

    try {
      const payload = {
        name,
        description,
        quantity,
        reference_link: referenceLink || null,
        priority: priority || null,
      };

      let res;

      if (isEditMode && id) {
        res = await GiftService.update(parseInt(id), payload);
      } else {
        res = await GiftService.create({ ...payload, event_id: Number(eventoId) });
      }

      navigate(URLS.APP.DETAIL.replace(":id", res.event.id.toString()));
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
            {isEditMode ? "Editar Regalo" : "Crear Regalo"}
          </h2>
          <form onSubmit={handleSubmit} noValidate>
            <div className="mb-4">
              <label htmlFor="name" className="block font-semibold mb-1">
                Nombre
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 border rounded"
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="description" className="block font-semibold mb-1">
                Descripción
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3 py-2 border rounded"
                rows={3}
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="quantity" className="block font-semibold mb-1">
                Cantidad
              </label>
              <input
                id="quantity"
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                className="w-full px-3 py-2 border rounded"
                required
                min={1}
              />
            </div>
            <div className="mb-4">
              <label htmlFor="referenceLink" className="block font-semibold mb-1">
                Enlace de Referencia (opcional)
              </label>
              <input
                id="referenceLink"
                type="url"
                value={referenceLink}
                onChange={(e) => setReferenceLink(e.target.value)}
                className="w-full px-3 py-2 border rounded"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="priority" className="block font-semibold mb-1">
                Prioridad (opcional)
              </label>
              <select
                id="priority"
                value={priority}
                onChange={(e) => setPriority(e.target.value as any)}
                className="w-full px-3 py-2 border rounded"
              >
                <option value="">Ninguna</option>
                {Object.entries(PRIORITY_LABELS).map(([key, label]) => (
                  <option key={key} value={key}>
                    {label}
                  </option>
                ))}
              </select>
            </div>
            {error && <p className="text-red-500 mb-4">{error}</p>}
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 w-full"
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
