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
import { GuestMenu } from "../components/GuestMenu";

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
			<GuestMenu />
			<Container>
				<Card title="Registro" className="mx-5 my-5">
					<form onSubmit={handleSubmit(onSubmit)}>
						{error && <div className="text-red-500 mb-2">{error}</div>}
						<FormField>
							<label htmlFor="username">Usuario:</label>
							<Input
								type="text"
								id="username"
								{...register("username", { required: true })}
							/>
							{errors.username && <span>Este campo es requerido</span>}
						</FormField>

						<FormField>
							<label htmlFor="email">Correo:</label>
							<Input
								type="email"
								id="email"
								{...register("email", { required: true })}
							/>
							{errors.email && <span>Este campo es requerido</span>}
						</FormField>

						<FormField>
							<label htmlFor="password">Contraseña:</label>
							<Input
								type="password"
								id="password"
								{...register("password", { required: true })}
							/>
							{errors.password && <span>Este campo es requerido</span>}
						</FormField>

						<Button type="submit" title="Guardar" />
					</form>
				</Card>
			</Container>
		</>
	);
};
