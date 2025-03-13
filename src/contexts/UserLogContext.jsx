import React, { createContext, useContext, useEffect, useState } from "react";
import * as SecureStore from "expo-secure-store";
import globalConstants from "../const/globalConstants";
import { getToken } from "../utils/authStorage";

// Crear el contexto
const UserLogContext = createContext();

// Proveedor del contexto
export const UserLogProvider = ({ children }) => {
  const [userLog, setUserLog] = useState(null);

  useEffect(() => {
    const userLog = async () => {
      try {
        const storedUserLog = await SecureStore.getItemAsync("userLog");
        if (storedUserLog) {
          const parsedUserLog = JSON.parse(storedUserLog);
          setUserLog(parsedUserLog);
        }
      } catch (error) {
        console.error("Error al obtener el userLog:", error);
      }
    };

    userLog();
  }, []);

  // Función para iniciar sesión
  const login = async (user) => {
    try {
      await SecureStore.setItemAsync("userLog", JSON.stringify(user));
      setUserLog(user);
    } catch (error) {
      console.error("Error al iniciar sesión:", error);
    }
  };

  // Función para cerrar sesión
  const logout = async () => {
    try {
      await SecureStore.deleteItemAsync("userLog");
      setUserLog(null);
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  const refreshUserLog = async () => {
    try {
      const token = await getToken();
      const response = await fetch(`${globalConstants.URL_BASE}/walkers/update/${userLog.id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
      });
      
      const data = await response.json();
      setUserLog(data.body);
      await SecureStore.setItemAsync("userLog", JSON.stringify(data.body));
    } catch (error) {
      console.error("Error al actualizar el userLog:", error);
    }
  };
  
  return (
    <UserLogContext.Provider value={{ userLog, login, logout, setUserLog, refreshUserLog }}>
      {children}
    </UserLogContext.Provider>
  );
};

// Hook personalizado para usar el contexto
export const useUserLog = () => {
  const context = useContext(UserLogContext);

  if (!context) {
    throw new Error("useUserLog debe usarse dentro de un UserLogProvider");
  }

  return context;
};
