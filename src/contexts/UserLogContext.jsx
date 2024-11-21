import React, { createContext, useContext, useState } from "react";

// Crear el contexto
const UserLogContext = createContext();

// Proveedor del contexto
export const UserLogProvider = ({ children }) => {
  const [userLog, setUserLog] = useState(null);

  // Función para iniciar sesión
  const login = (user) => {
    setUserLog(user);
  };

  // Función para cerrar sesión
  const logout = () => {
    setUserLog(null);
  };

  return (
    <UserLogContext.Provider value={{ userLog, login, logout }}>
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
