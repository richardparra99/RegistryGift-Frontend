import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import { Event } from "../models/Event";
import { EventService } from "../services/EventService";
import { GiftService } from "../services/GiftService";
import { CommentService } from "../services/CommentService";
import { Container } from "../components/Container";
import { Menu } from "../components/Menu";
import { URLS } from "../navigation/CONSTANTS";

const EVENTO_TYPE_LABELS: Record<string, string> = {
  birthday: "Cumpleaños",
  wedding: "Matrimonio",
  anniversary: "Aniversario",
  other: "Otro",
};

const EVENTO_COLOR_CLASSES: Record<string, string> = {
  red: "border-red-400 bg-red-50",
  blue: "border-blue-400 bg-blue-50",
  green: "border-green-400 bg-green-50",
  orange: "border-orange-400 bg-orange-50",
  purple: "border-purple-400 bg-purple-50",
  yellow: "border-yellow-400 bg-yellow-50",
  pink: "border-pink-400 bg-pink-50",
  gray: "border-gray-400 bg-gray-50",
  teal: "border-teal-400 bg-teal-50",
  brown: "border-amber-700 bg-amber-50",
};

const EventoDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [evento, setEvento] = useState<Event | null>(null);
  const [regalos, setRegalos] = useState<any[]>([]);
  const [comentarios, setComentarios] = useState<any[]>([]);
  const [nuevoComentario, setNuevoComentario] = useState("");
  const [user, setUser] = useState<any>(null);
  const [editComentarioId, setEditComentarioId] = useState<number | null>(null);
  const [editComentarioText, setEditComentarioText] = useState<string>("");
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      EventService.get(Number(id))
        .then(setEvento)
        .catch((err) => {
          console.error("Error al obtener el evento:", err);
        });

      GiftService.listByEvent(Number(id))
        .then(setRegalos)
        .catch((err) => {
          console.error("Error al obtener regalos:", err);
        });

      CommentService.listByEvent(Number(id))
        .then(setComentarios)
        .catch((err) => {
          console.error("Error al obtener comentarios:", err);
        });
    }

    setUser(JSON.parse(localStorage.getItem("user") || "null"));
  }, [id]);

  const isOwner = evento && user?.id === (typeof evento.owner === "object" ? evento.owner.id : evento.owner);

  const handleRegaloReservar = async (regalo_id: number) => {
    try {
      await GiftService.reserve(Number(regalo_id))
    } catch (err) {
      console.error("Error reservando regalo:", err);
    }
  }

  const handleRegaloEliminar = async (regalo_id: number, regalo_name: string) => {
    const confirmar = window.confirm(`¿Eliminar "${regalo_name}"?`);
    if (!confirmar) return;

    try {
      await GiftService.delete(regalo_id);
      setRegalos((prev) => prev.filter((r) => r.id !== regalo_id));
    } catch (err) {
      console.error("Error eliminando regalo:", err);
    }
  };

  const handleComentarioSubmit = async () => {
    if (!nuevoComentario.trim()) return;

    try {
      await CommentService.create({ text: nuevoComentario, event_id: evento.id });
      setComentarios(await CommentService.listByEvent(evento.id));
      setNuevoComentario("");
    } catch (err) {
      console.error("Error al enviar comentario:", err);
    }
  }

  const handleComentarioEliminar = async (comentario_id: number) => {
    const confirmar = window.confirm("¿Eliminar este comentario?");
    if (!confirmar) return;

    try {
      await CommentService.delete(comentario_id);
      setComentarios((prev) => prev.filter((c) => c.id !== comentario_id));
    } catch (err) {
      console.error("Error eliminando comentario:", err);
    }
  };

  const handleComentarioEditStart = (comentarioId: number, currentText: string) => {
    setEditComentarioId(comentarioId);
    setEditComentarioText(currentText);
  };

  const handleComentarioEditSubmit = async () => {
    if (!editComentarioText.trim() || !editComentarioId) return;

    try {
      await CommentService.update(editComentarioId, { text: editComentarioText });
      setComentarios(await CommentService.listByEvent(evento.id));
      setEditComentarioId(null);
      setEditComentarioText("");
    } catch (err) {
      console.error("Error actualizando comentario:", err);
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
      <Container
        className={`max-w-3xl mx-auto mt-10 p-6 rounded-xl shadow-md space-y-10 border-l-8 ${
          EVENTO_COLOR_CLASSES[evento.color] ?? "bg-white border-gray-300 text-gray-700"
        }`}
      >
        <div>
          <div className="flex items-center justify-between mb-4">
            <h1 style={{ color: evento.color }} className="text-3xl font-bold">{evento.name}</h1>
            {isOwner && (
              <button
                onClick={() => navigate(URLS.APP.EDIT.replace(":id", evento.id.toString()))}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded shadow"
              >
                Editar
              </button>
            )}
          </div>
          <div className="flex items-center space-x-2 mb-2">
            <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
              EVENTO_COLOR_CLASSES[evento.color] ?? "bg-gray-100 text-gray-700"
            }`}>
              {EVENTO_TYPE_LABELS[evento.type]}
            </span>
            <span className="text-sm text-gray-600">
              {new Date(evento.datetime).toLocaleDateString()}
            </span>
          </div>
          <p className="text-sm text-gray-700 mb-4">
            Creado por: {typeof evento.owner === "object" ? evento.owner.username : "Desconocido"}
          </p>
          <p className="text-gray-800">
            {evento.description || "Sin descripción"}
          </p>
        </div>

        {/* Regalos */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Regalos</h2>
            {isOwner && (
              <button
                onClick={() => navigate(URLS.APP.GIFT_CREATE.replace(":eventoId", evento.id.toString()))}
                className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded shadow text-sm"
              >
                + Agregar
              </button>
            )}
          </div>
          {regalos.length === 0 ? (
            <p className="text-gray-500">Aún no hay regalos registrados.</p>
          ) : (
            <ul className="space-y-2">
              {regalos.map((regalo) => (
                <li key={regalo.id} className="border p-3 rounded flex justify-between items-center">
                  <div>
                    <p className="font-semibold">{regalo.name}</p>
                    <p className="text-sm text-gray-600">{regalo.description}</p>
                    <p className="text-sm text-gray-600">Cantidad: {regalo.quantity}</p>
                    {regalo.reference_link && (
                      <p className="text-sm text-gray-600">
                        Enlace: <a href={regalo.reference_link} target="_blank" rel="noopener noreferrer" className="underline">{regalo.reference_link}</a>
                      </p>
                    )}
                    {regalo.priority && (
                      <p className="text-sm text-gray-600">Prioridad: {regalo.priority}</p>
                    )}
                  </div>
                  {isOwner && (
                    <div className="space-x-2">
                      <button
                        onClick={() => navigate(URLS.APP.GIFT_EDIT.replace(":eventId", evento.id.toString()).replace(":id", regalo.id.toString()))}
                        className="text-blue-600 hover:underline text-sm"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleRegaloEliminar(regalo.id, regalo.name)}
                        className="text-red-600 hover:underline text-sm"
                      >
                        Eliminar
                      </button>
                    </div>
                  )}
                  {!isOwner && !regalo.reserved && (
                    <button
                      onClick={() => handleRegaloReservar(regalo.id)}
                      className="text-blue-600 hover:underline text-sm"
                    >
                      Reservar
                    </button>
                  )}
                  {regalo.reserved && (
                    <div className="text-sm text-gray-600">
                      Reservado por: {regalo.reservadoPor ? regalo.reservadoPor.username : "anónimo"}
                    </div>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Comentarios */}
        <div>
          <h2 className="text-xl font-bold mb-4">Comentarios</h2>
          <div className="mt-4">
            <textarea
              value={nuevoComentario}
              onChange={(e) => setNuevoComentario(e.target.value)}
              className="w-full border px-3 py-2 rounded resize-none"
              rows={3}
              placeholder="Escribe un comentario..."
            />
            <button
              onClick={handleComentarioSubmit}
              className="mt-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded shadow"
            >
              Comentar
            </button>
          </div>
          {comentarios.length === 0 ? (
            <p className="text-gray-500">Sin comentarios aún.</p>
          ) : (
            <ul className="space-y-2 mb-4">
              {comentarios.map((comentario) => {
                const puedeModificar = user && (
                  comentario.poster?.id === user.id ||
                  (evento && user.id === (typeof evento.owner === "object" ? evento.owner.id : evento.owner))
                );

                const isEditing = editComentarioId === comentario.id;

                return (
                  <li key={comentario.id} className="border p-3 rounded">
                    {isEditing ? (
                      <>
                        <textarea
                          className="w-full border px-2 py-1 rounded text-sm"
                          value={editComentarioText}
                          onChange={(e) => setEditComentarioText(e.target.value)}
                          rows={2}
                        />
                        <div className="mt-2 flex justify-end gap-2">
                          <button
                            onClick={handleComentarioEditSubmit}
                            className="text-green-600 text-xs hover:underline"
                          >
                            Actualizar
                          </button>
                          <button
                            onClick={() => setEditComentarioId(null)}
                            className="text-gray-500 text-xs hover:underline"
                          >
                            Cancelar
                          </button>
                        </div>
                      </>
                    ) : (
                      <>
                        <p className="text-sm text-gray-800">{comentario.text}</p>
                        <div className="flex justify-between items-center mt-2">
                          <p className="text-xs text-gray-400">
                            {new Date(evento.datetime).toLocaleString()} | {comentario.poster?.username || "Anónimo"}
                          </p>
                          <div className="flex gap-2 text-xs">
                            {user?.id === comentario.poster?.id && (
                              <button
                                onClick={() => {
                                  setEditComentarioId(comentario.id);
                                  handleComentarioEditStart(comentario.id, comentario.text);
                                }}
                                className="text-blue-500 hover:underline"
                              >
                                Editar
                              </button>
                            )}
                            {puedeModificar && (
                              <button
                                onClick={() => handleComentarioEliminar(comentario.id)}
                                className="text-red-500 hover:underline"
                              >
                                Eliminar
                              </button>
                            )}
                          </div>
                        </div>
                      </>
                    )}
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </Container>
    </>
  );
};

export default EventoDetail;
