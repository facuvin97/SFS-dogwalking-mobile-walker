import React, { createContext, useContext, useEffect, useState } from "react";
import * as SecureStore from "expo-secure-store";
import { useRouter } from "expo-router"
// Crear el contexto
const UserLogContext = createContext();


// Proveedor del contexto
export const UserLogProvider = ({ children }) => {
  const [userLog, setUserLog] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const userLog = async () => {
      try {
        const storedUserLog = await SecureStore.getItemAsync("userLog");
        if (storedUserLog) {
          const parsedUserLog = JSON.parse(storedUserLog); // Deserializar el JSON
          setUserLog(parsedUserLog);
        }
      } catch (error) {
        console.error("Error al obtener el userLog:", error);
      }
    };

    userLog();
  }, []);

  // Función para iniciar sesión
  const login = (user) => {
    setUserLog(user);
  };

  // Función para cerrar sesión
  const logout = () => {
    setTimeout(() => {
      router.replace("/");
    }, 100);
    
    console.log("se desloguea");
    setUserLog(null);
  };

  return (
    <UserLogContext.Provider value={{ userLog, login, logout, setUserLog }}>
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
