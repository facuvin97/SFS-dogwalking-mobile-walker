import React, { createContext, useContext, useState } from "react";
import globalConstants from "../const/globalConstants";
import { useUserLog } from "./UserLogContext";
import { getToken } from "../utils/authStorage";

// Crear el contexto
const ServicesContext = createContext();

// Proveedor del contexto
export const ServicesProvider = ({ children }) => {
  const [servicesHistory, setServicesHistory] = useState(null);
  const [servicesRequest, setServiceRequest] = useState(null);
  const [confirmedServices, setConfirmedServices] = useState(null);
  const { userLog } = useUserLog();

  // Funcion para hacer un fetch y cargar los servicios futuros
  const fetchNextServices = async () => {
    try {
      const apiUrl = `${globalConstants.URL_BASE}/services/walker/future/${userLog.id}`;
      const token = await getToken();

      const response = await fetch(apiUrl, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      const services = data.body;

      // filtro los servicios que tengan el campo aceptado en true
      const confirmedServices = services.filter(
        (service) => service.aceptado === true,
      );

      // filtro los servicios que tengan el campo aceptado en false
      const serviceRequests = services.filter(
        (service) => service.aceptado === false,
      );

      console.log("serviceRequests:", serviceRequests);
      console.log("Servicios confirmados:", confirmedServices);

      setConfirmedServices(confirmedServices);
      setServiceRequest(serviceRequests);
    } catch (error) {
      console.error("Error al obtener los servicios:", error);
    }
  };

  // Funcion para hacer un fetch y cargar los servicios futuros
  const fetchFinishedServices = async () => {
    try {
      const apiUrl = `${globalConstants.URL_BASE}/services/walker/finished/${userLog.id}`;
      const token = await getToken();

      const response = await fetch(apiUrl, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      const services = data.body;

      console.log("Servicios completados:", services);

      setServicesHistory(services);
    } catch (error) {
      console.error("Error al obtener los servicios finalizados:", error);
    }
  };

  // funcion para rechazar una solicitud de servicio
  const rejectService = async (id) => {
    try {
      const token = await getToken();
      const apiUrl = `${globalConstants.URL_BASE}/services/${id}`;
      const response = await fetch(apiUrl, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Error al eliminar el servicio: ${response.status}`);
      }

      // elimino manualmente el servicio del estado
      const newServices = servicesRequest.filter(
        (service) => service.id !== id,
      );
      setServiceRequest(newServices);
    } catch (error) {
      console.error("Error al eliminar el servicio:", error);
    }
  };

  // funcion para eliminar un servicio confirmado
  const cancelService = async (id) => {
    try {
      const apiUrl = `${globalConstants.URL_BASE}/services/${id}`;
      const token = await getToken();

      const response = await fetch(apiUrl, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Error al eliminar el servicio: ${response.status}`);
      }

      // elimino manualmente el servicio del estado
      const newServices = confirmedServices.filter(
        (service) => service.id !== id,
      );
      setConfirmedServices(newServices);
    } catch (error) {
      console.error("Error al eliminar el servicio:", error);
    }
  };

  // funcion para pasar un servicio de la lista de request a la lista de confirmed
  const acceptService = async (id) => {
    try {
      // cambio el campo aceptado a true en la api
      const apiUrl = `${globalConstants.URL_BASE}/services/${id}`;
      const token = await getToken();

      const response = await fetch(apiUrl, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          aceptado: true,
        }),
      });

      if (!response.ok) {
        throw new Error(`Error al aceptar el servicio: ${response.status}`);
      }

      // me traigo el servicio a una constante
      const service = servicesRequest.find((s) => s.id === id);

      // actualizo el estado del servicio
      service.aceptado = true;

      //saco el servicio de la lista de request
      const newServices = servicesRequest.filter(
        (service) => service.id !== id,
      );
      setServiceRequest(newServices);

      // agrego el servicio a la lista de confirmed
      setConfirmedServices([...confirmedServices, service]);
    } catch (error) {
      console.error("Error al eliminar el servicio:", error);
    }
  };

  // funcion para pasar marcar un servicio como comenzado
  const startService = async (id) => {
    try {
      // cambio el campo comenzado a true en la api
      const apiUrl = `${globalConstants.URL_BASE}/services/started/${id}`;
      const token = await getToken();

      const response = await fetch(apiUrl, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          comenzado: true,
        }),
      });

      if (!response.ok) {
        throw new Error(`Error al comenzar el servicio: ${response.status}`);
      }

      // Ahora actualizas el campo 'comenzado' de la lista de services
      setConfirmedServices((prevServices) =>
        prevServices.map((service) =>
          service.id === id ? { ...service, comenzado: true } : service,
        ),
      );
    } catch (error) {
      console.error("Error al comenzar el servicio:", error);
    }
  };

  // funcion para pasar un servicio de la lista de confirmed a la lista de finalizados
  const finishService = async (id) => {
    try {
      const token = await getToken();
      // cambio el campo finalizado a true en la api
      const apiUrl = `${globalConstants.URL_BASE}/services/finished/${id}`;
      const response = await fetch(apiUrl, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          finished: true,
        }),
      });

      if (!response.ok) {
        throw new Error(`Error al finalizar el servicio: ${response.status}`);
      }

      // me traigo el servicio a una constante
      const service = confirmedServices.find((s) => s.id === id);

      // actualizo el estado del servicio
      service.finalizado = true;

      //saco el servicio de la lista de confirmed
      const newServices = confirmedServices.filter(
        (service) => service.id !== id,
      );
      setConfirmedServices(newServices);

      // agrego el servicio a la lista de finalizados
      setServicesHistory([...servicesHistory, service]);
    } catch (error) {
      console.error("Error al eliminar el servicio:", error);
    }
  };

  return (
    <ServicesContext.Provider
      value={{
        servicesHistory,
        confirmedServices,
        servicesRequest,
        fetchNextServices,
        fetchFinishedServices,
        acceptService,
        rejectService,
        cancelService,
        startService,
        finishService,
      }}
    >
      {children}
    </ServicesContext.Provider>
  );
};

// Hook personalizado para usar el contexto
export const useServices = () => {
  const context = useContext(ServicesContext);

  if (!context) {
    throw new Error("useServices debe usarse dentro de un ServicesProvider");
  }

  return context;
};
