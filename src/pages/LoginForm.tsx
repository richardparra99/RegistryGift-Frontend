import { SubmitHandler, useForm } from "react-hook-form";
import { Input } from "../components/Input";
import { FormField } from "../components/FormField";
import { Card } from "../components/Card";
import { Button } from "../components/Button";
import { useNavigate } from "react-router-dom";
import { URLS } from "../navigation/CONSTANTS";
import { AuthService } from "../services/AuthService";
import { Container } from "../components/Container";
import { GuestMenu } from "../components/GuestMenu";

type Inputs = {
	username: string;
	password: string;
};

export const LoginForm = () => {
	const navigate = useNavigate();

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<Inputs>();

	const onSubmit: SubmitHandler<Inputs> = async (data) => {
		try {
			const response = await AuthService.login(data.username, data.password);
			localStorage.setItem("access_token", response.access);
			localStorage.setItem("refresh_token", response.refresh);
			localStorage.setItem("user", JSON.stringify(response.user));
			navigate(URLS.HOME);
		} catch (error) {
			alert("Nombre de usuario o contraseña incorrectos.");
			console.error("Login error:", error);
		}
	};

	return (
		<>
			<GuestMenu />
			<Container>
				<Card title="Iniciar sesión" className="mx-5 my-5">
					<form onSubmit={handleSubmit(onSubmit)}>
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
							<label htmlFor="password">Contraseña:</label>
							<Input
								type="password"
								id="password"
								{...register("password", { required: true })}
							/>
							{errors.password && <span>Este campo es requerido</span>}
						</FormField>
						<Button type="submit" title="Entrar" />
					</form>
				</Card>
			</Container>
		</>
	);
};
