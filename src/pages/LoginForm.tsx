import { SubmitHandler, useForm } from "react-hook-form";
import { Input } from "../components/Input";
import { FormField } from "../components/FormField";
import { Card } from "../components/Card";
import { Button } from "../components/Button";
import { useNavigate } from "react-router-dom";
import { URLS } from "../navigation/CONSTANTS";
import { AuthService } from "../services/AuthService";
import { Container } from "../components/Container";
import { Menu } from "../components/Menu";
import { useState } from "react";

type Inputs = {
	username: string;
	password: string;
};

export const LoginForm = () => {
	const navigate = useNavigate();
	const [loginError, setLoginError] = useState<string | null>(null);

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<Inputs>();

	const onSubmit: SubmitHandler<Inputs> = async (data) => {
		setLoginError(null);
		try {
			const response = await AuthService.login(data.username, data.password);
			localStorage.setItem("access_token", response.access);
			localStorage.setItem("refresh_token", response.refresh);
			localStorage.setItem("user", JSON.stringify(response.user));
			navigate(URLS.HOME);
		} catch (error: any) {
			console.log("Login error catched:", error);
			if (error?.response?.status === 401) {
				setLoginError("Nombre de usuario o contraseña incorrectos.");
			} else {
				setLoginError("Ha ocurrido un error inesperado. Intenta más tarde.");
			}
		}
	};

	return (
		<>
			<Menu />
			<Container>
				<Card title="Iniciar sesión" className="mx-5 my-5">
					<form onSubmit={handleSubmit(onSubmit)} noValidate>
						<FormField>
							<label htmlFor="username">Usuario:</label>
							<Input
								type="text"
								id="username"
								className={errors.username ? "input-error" : ""}
								{...register("username", {
									required: "Este campo es requerido",
									minLength: {
										value: 3,
										message: "El usuario debe tener al menos 3 caracteres",
									},
									maxLength: {
										value: 30,
										message: "Máximo 30 caracteres",
									},
								})}
							/>
							{errors.username && (
								<span className="error-text" role="alert">
									{errors.username.message}
								</span>
							)}
						</FormField>

						<FormField>
							<label htmlFor="password">Contraseña:</label>
							<Input
								type="password"
								id="password"
								className={errors.password ? "input-error" : ""}
								{...register("password", {
									required: "Este campo es requerido",
									minLength: {
										value: 3,
										message: "La contraseña debe tener al menos 6 caracteres",
									},
								})}
							/>
							{errors.password && (
								<span className="error-text" role="alert">
									{errors.password.message}
								</span>
							)}
						</FormField>

						{loginError && (
							<p
								className="error-text text-red-600"
								role="alert"
								data-testid="login-error"
							>
								{loginError}
							</p>
						)}

						<Button type="submit" title="Entrar" />
					</form>
				</Card>
			</Container>
		</>
	);
};
