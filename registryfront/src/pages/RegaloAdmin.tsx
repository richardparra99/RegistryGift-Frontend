import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { Regalo } from "../models/Regalo";
import { RegaloService } from "../services/RegaloService";
import { Menu } from "../components/Menu";
import { Container } from "../components/Container";

const RegaloAdmin = () => {
  const [regalos, setRegalos] = useState<Regalo[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    new RegaloService().getRegalos().then(setRegalos);
  }, []);

  const handleDelete = async (id: number) => {
    if (window.confirm("¿Eliminar este regalo?")) {
      await new RegaloService().deleteRegalo(id);
      setRegalos((prev) => prev.filter((r) => r.id !== id));
    }
  };

  return (
    <>
      <Menu />
      <Container>
        <h2 className="text-2xl font-bold text-center mb-6">Administrar Regalos</h2>
        <div className="grid gap-4 max-w-4xl mx-auto">
          {regalos.map((regalo) => (
            <div key={regalo.id} className="bg-white p-4 rounded shadow flex justify-between items-center">
              <div>
                <h3 className="font-semibold">{regalo.nombre}</h3>
                <p className="text-sm text-gray-600">Prioridad: {regalo.prioridad || "No definida"}</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => navigate(`/regalos/editar/${regalo.id}`)}
                  className="btn-edit"
                >
                  Editar
                </button>
                <button
                  onClick={() => handleDelete(regalo.id)}
                  className="btn-danger"
                >
                  Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </>
  );
};

export default RegaloAdmin;
