import { useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { UserService } from "../services/UserService";
import { Container } from "../components/Container";
import { Card } from "../components/Card";
import { User } from "../models/User";
import { Menu } from "../components/Menu";

const UserList = () => {
  useAuth();

  const [users, setUsers] = useState<Array<User>>([]);

  useEffect(() => {
    getUserList();
  }, []);

  const getUserList = () => {
    new UserService()
      .getUsers()
      .then((response) => {
        setUsers(response);
      })
      .catch((error) => {
        console.error("Error al obtener la lista de usuarios", error);
      });
  };

  return (
    <>
      <Menu />
      <Container>
        <Card title="Lista de Usuarios">
          {users.length === 0 ? (
            <div className="my-5 mx-5 text-center">
              <h2 className="text-lg text-gray-600">No hay usuarios registrados</h2>
            </div>
          ) : (
            <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {users.map((user) => (
                <div
                  key={user.id}
                  className="bg-white p-5 rounded-xl shadow-md border hover:shadow-lg transition duration-300"
                >
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">Usuario #{user.id}</h3>
                  <p className="text-sm text-gray-600">
                    <strong>Email:</strong> {user.email}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    <strong>Rol:</strong>{" "}
                    {Array.isArray(user.groups)
                      ? user.groups.join(", ")
                      : user.groups || "N/A"}
                  </p>
                  <p className="text-sm text-yellow-600 mt-2 font-semibold">
                    <strong>Puntos:</strong> {user.puntos ?? 0}
                  </p>
                </div>
              ))}
            </div>
          )}
        </Card>
      </Container>
    </>
  );
};

export default UserList;
