import { useAuth } from "./useAuth"


export const useIsAdmin = () => {
    const {groups} = useAuth();
    return groups?.includes("Administrador")? true : false;
}
