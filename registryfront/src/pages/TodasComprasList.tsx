import { useEffect, useState } from "react";
import { CompraService, Compra } from "../services/CompraService";
import { Menu } from "../components/Menu";

const compraService = new CompraService();

const TodasComprasList = () => {
  const [compras, setCompras] = useState<Compra[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCompras = async () => {
      try {
        setLoading(true);
        const data = await compraService.getAllCompras(); // ✅ Método correcto
        setCompras(data);
      } catch (error) {
        setError("Error al obtener todas las compras.");
      } finally {
        setLoading(false);
      }
    };

    fetchCompras();
  }, []);

  return (
    <>
      <Menu />
      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-2xl font-bold text-blue-800 mb-6 text-center">
          📦 Todas las Compras
        </h1>

        {loading && <p className="text-center">Cargando...</p>}
        {error && <p className="text-center text-red-500">{error}</p>}

        {!loading && !error && compras.length === 0 && (
          <p className="text-center text-gray-600">No hay compras registradas.</p>
        )}

        {!loading && !error && compras.length > 0 && (
          <div className="grid gap-6">
            {compras.map((compra) => (
              <div
                key={compra.id}
                className="bg-white rounded-xl shadow-md p-4 flex flex-col md:flex-row md:items-start gap-4 border"
              >
                <img
                  src={
                    compra.imagen_pago
                      ? `http://localhost:8000${compra.imagen_pago}`
                      : "/placeholder.png"
                  }
                  alt={`Comprobante #${compra.id}`}
                  className="w-full md:w-40 h-auto rounded-md border object-cover"
                  loading="lazy"
                />

                <div className="flex-1">
                  <h2 className="text-lg font-semibold text-gray-800 mb-2">
                    🛍️ Libros comprados:
                  </h2>

                  <ul className="list-disc pl-4 text-sm text-gray-700 max-h-32 overflow-y-auto pr-2">
                    {compra.libros.map((libro) => (
                      <li key={libro.id}>
                        {libro.titulo} -{" "}
                        <span className="font-medium">{libro.precio} Bs.</span>
                      </li>
                    ))}
                  </ul>

                  <div className="mt-4 flex flex-col sm:flex-row sm:justify-between text-sm">
                    <p className="text-blue-700 font-semibold">
                      💰 Total: {compra.total} Bs.
                    </p>
                    <p className="text-gray-500 mt-1 sm:mt-0">
                      📅 Fecha:{" "}
                      {new Date(compra.fecha).toLocaleDateString("es-ES", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default TodasComprasList;
