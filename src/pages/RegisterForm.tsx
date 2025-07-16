import { SubmitHandler, useForm } from "react-hook-form";
import { Input } from "../components/Input";
import { FormField } from "../components/FormField";
import { Card } from "../components/Card";
import { Button } from "../components/Button";
import { useNavigate } from "react-router-dom";
import { URLS } from "../navigation/CONSTANTS";
import { AuthService } from "../services/AuthService";
import { Container } from "../components/Container";
import { useState } from "react";
import { Menu } from "../components/Menu";

type Inputs = {
  username: string;
  email: string;
  password: string;
};

export const RegisterForm = () => {
  const navigate = useNavigate();
  const [error, setError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>();

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    try {
      const result = await AuthService.register(data.username, data.email, data.password);
      if (result.error) {
        setError(result.error);
      } else {
        navigate(URLS.LOGIN);
      }
    } catch (err) {
      setError("Ocurrió un error al registrarse.");
      console.error("Register error:", err);
    }
  };

  return (
    <>
      <Menu />
      <Container>
        <Card title="Registro" className="mx-5 my-5">
          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            {error && (
              <div className="text-red-500 mb-2" role="alert" data-testid="register-error">
                {error}
              </div>
            )}

            {/* Campo Usuario */}
            <FormField>
              <label htmlFor="username">Usuario:</label>
              <Input
                type="text"
                id="username"
                className={errors.username ? "input-error" : ""}
                {...register("username", { required: true })}
              />
              {errors.username && (
                <span className="text-red-500 text-sm" role="alert">
                  Este campo es requerido
                </span>
              )}
            </FormField>

            {/* Campo Correo */}
            <FormField>
              <label htmlFor="email">Correo:</label>
              <Input
                type="email"
                id="email"
                className={errors.email ? "input-error" : ""}
                {...register("email", {
                  required: "Este campo es requerido",
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: "Formato de correo inválido",
                  },
                })}
              />
              {errors.email && (
                <span className="text-red-500 text-sm" role="alert">
                  {errors.email.message}
                </span>
              )}
            </FormField>

            {/* Campo Contraseña */}
            <FormField>
              <label htmlFor="password">Contraseña:</label>
              <Input
                type="password"
                id="password"
                className={errors.password ? "input-error" : ""}
                {...register("password", {
                  required: "Este campo es requerido",
                  minLength: {
                    value: 8,
                    message: "La contraseña debe tener al menos 8 caracteres",
                  },
                  validate: (value) =>
                    /[A-Z]/.test(value) || "La contraseña debe contener al menos una letra mayúscula",
                })}
              />
              {errors.password && (
                <span className="text-red-500 text-sm" role="alert">
                  {errors.password.message}
                </span>
              )}
            </FormField>

            <Button type="submit" title="Guardar" />
          </form>
        </Card>
      </Container>
    </>
  );
};
