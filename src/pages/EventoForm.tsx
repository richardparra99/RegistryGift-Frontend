import { useEffect, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { useNavigate, useParams } from "react-router";
import { EventService } from "../services/EventService";
import { URLS } from "../navigation/CONSTANTS";
import { Container } from "../components/Container";
import { Menu } from "../components/Menu";

type FormValues = {
  name: string;
  description: string;
  datetime: string;
  type: string;
  color: string;
  isPrivate: boolean;
};

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
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormValues>();

  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = Boolean(id);

  useEffect(() => {
    if (isEditMode && id) {
      EventService.get(parseInt(id))
        .then((evento) => {
          setValue("name", evento.name);
          setValue("description", evento.description || "");
          setValue("datetime", evento.datetime.slice(0, 10));
          setValue("type", EVENTO_TYPE_LABELS[evento.type] ? evento.type : "");
          setValue("color", EVENTO_COLOR_LABELS[evento.color] ? evento.color : "");
          setValue("isPrivate", Boolean(evento.private));
        })
        .catch(() => setError("No se pudo cargar el evento."));
    }
  }, [id, isEditMode, setValue]);

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    try {
      const payload = {
        name: data.name,
        description: data.description,
        datetime: data.datetime,
        type: data.type,
        color: data.color,
        private: data.isPrivate,
      };

      let res;
      if (isEditMode && id) {
        await EventService.update(parseInt(id), payload);
        navigate(URLS.APP.DETAIL.replace(":id", id));
      } else {
        res = await EventService.create(payload);
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
          {error && <p className="text-red-500 mb-4">{error}</p>}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
            <div>
              <label className="block font-semibold mb-1" htmlFor="name">Nombre</label>
              <input
                id="name"
                type="text"
                {...register("name", { required: true })}
                className={`w-full px-4 py-2 border rounded-lg shadow transition transform hover:scale-105 hover:shadow-md focus:outline-none focus:ring-2 ${
                  errors.name ? "border-red-500 focus:ring-red-400" : "focus:ring-blue-400"
                }`}
              />
              {errors.name && <p className="text-red-500 text-sm mt-1">Este campo es requerido</p>}
            </div>

            <div>
              <label className="block font-semibold mb-1" htmlFor="description">Descripción</label>
              <textarea
                id="description"
                {...register("description")}
                rows={3}
                className="w-full px-4 py-2 border rounded-lg shadow transition transform hover:scale-105 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>

            <div>
              <label className="block font-semibold mb-1" htmlFor="datetime">Fecha</label>
              <input
                id="datetime"
                type="date"
                {...register("datetime", { required: true })}
                className={`w-full px-4 py-2 border rounded-lg shadow transition transform hover:scale-105 hover:shadow-md focus:outline-none focus:ring-2 ${
                  errors.datetime ? "border-red-500 focus:ring-red-400" : "focus:ring-blue-400"
                }`}
              />
              {errors.datetime && <p className="text-red-500 text-sm mt-1">Este campo es requerido</p>}
            </div>

            <div>
              <label className="block font-semibold mb-1" htmlFor="type">Tipo de Evento</label>
              <select
                id="type"
                {...register("type", { required: true })}
                className={`w-full px-4 py-2 border rounded-lg shadow transition transform hover:scale-105 hover:shadow-md focus:outline-none focus:ring-2 ${
                  errors.type ? "border-red-500 focus:ring-red-400" : "focus:ring-blue-400"
                }`}
              >
                <option value="">Seleccionar tipo</option>
                {Object.entries(EVENTO_TYPE_LABELS).map(([key, label]) => (
                  <option key={key} value={key}>
                    {label}
                  </option>
                ))}
              </select>
              {errors.type && <p className="text-red-500 text-sm mt-1">Este campo es requerido</p>}
            </div>

            <div>
              <label className="block font-semibold mb-1" htmlFor="color">Color del Evento</label>
              <select
                id="color"
                {...register("color", { required: true })}
                className={`w-full px-4 py-2 border rounded-lg shadow transition transform hover:scale-105 hover:shadow-md focus:outline-none focus:ring-2 ${
                  errors.color ? "border-red-500 focus:ring-red-400" : "focus:ring-blue-400"
                }`}
              >
                <option value="">Seleccionar color</option>
                {Object.entries(EVENTO_COLOR_LABELS).map(([key, label]) => (
                  <option key={key} value={key}>
                    {label}
                  </option>
                ))}
              </select>
              {errors.color && <p className="text-red-500 text-sm mt-1">Este campo es requerido</p>}
            </div>

            <div className="flex items-center space-x-2">
              <input
                id="isPrivate"
                type="checkbox"
                {...register("isPrivate")}
                className="rounded focus:ring-2 focus:ring-blue-400 transition transform hover:scale-105"
              />
              <label htmlFor="isPrivate" className="font-semibold">Evento privado</label>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg shadow transition transform hover:scale-105"
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

