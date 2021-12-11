import { useContext } from "react";
import { AuthConstext } from "../contexts/AuthContext";

export function useAuth() {
    const value = useContext(AuthConstext)

    return value;
}