import React, { createContext, useContext, useState } from "react";
import globalConstants from "../const/globalConstants";
import { useUserLog } from "./UserLogContext";
import { getToken } from "../utils/authStorage";

// Crear el contexto
const TurnsContext = createContext();

// Proveedor del contexto
export const TurnsProvider = ({ children }) => {
  const [turns, setTurns] = useState(null);
  const { userLog } = useUserLog();

  // Funcion para hacer un fetch y cargar los turnos
  const fetchTurns = async () => {
    try {
      const apiUrl = `${globalConstants.URL_BASE}/turns/walker/${userLog.id}`;
      const token = await getToken();
      const response = await fetch(apiUrl, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      console.log("Datos obtenidos:", data);
      setTurns(data.body);
    } catch (error) {
      console.error("Error al obtener los turnos:", error);
    }
  };

  const addTurn = async (turn) => {
    try {
      const apiUrl = `${globalConstants.URL_BASE}/turns`;
      const token = await getToken();

      // creo el turn en la api
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(turn),
      });

      if (!response.ok) {
        throw new Error(`Error al crear turno: ${response.status}`);
      }

      const data = await response.json();

      // agrego el turno creado al estado
      setTurns([...turns, data.data]);
    } catch (error) {
      console.error("Error al crear turno:", error);
    }
  };

  // funcion para eliminar un turno
  const deleteTurn = async (id) => {
    try {
      const apiUrl = `${globalConstants.URL_BASE}/turns/${id}`;
      const token = await getToken();
      const response = await fetch(apiUrl, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Error al eliminar el turno: ${response.status}`);
      }

      // elimino manualmente el turno del estado
      const newTurns = turns.filter((turn) => turn.id !== id);
      setTurns(newTurns);
    } catch (error) {
      console.error("Error al eliminar el turno:", error);
    }
  };

  return (
    <TurnsContext.Provider
      value={{ turns, setTurns, fetchTurns, deleteTurn, addTurn }}
    >
      {children}
    </TurnsContext.Provider>
  );
};

// Hook personalizado para usar el contexto
export const useTurns = () => {
  const context = useContext(TurnsContext);

  if (!context) {
    throw new Error("useTurns debe usarse dentro de un TurnsProvider");
  }

  return context;
};
