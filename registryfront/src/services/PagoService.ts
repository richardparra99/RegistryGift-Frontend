import axios from "axios";

export class PagoService {
  async enviarComprobante(compraId: number, archivo: File) {
    const formData = new FormData();
    formData.append("compra", compraId.toString());
    formData.append("imagen_pago", archivo);

    const response = await axios.post(
      "http://localhost:3000/webproxy/pago/",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
      }
    );

    return response.data;
  }
}