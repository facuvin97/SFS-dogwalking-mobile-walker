import { ScrollView, Text } from "react-native";
import { Screen } from "../Screen";
import { ServiceCard } from "../cards/ServiceCard";

const services = [
  {
    id: 1,
    direccionPickUp: "Direccion 123",
    fecha: "2024-01-01",
    nota: "Nota de servicio",
    cantidad_mascotas: 1,
    aceptado: false,
    comenzado: false,
    finalizado: false,
    calificado_x_cliente: false,
    calificado_x_paseador: false,
  },
  {
    id: 2,
    direccionPickUp: "Direccion 123",
    fecha: "2024-01-01",
    nota: "Nota de servicio",
    cantidad_mascotas: 1,
    aceptado: false,
    comenzado: false,
    finalizado: false,
    calificado_x_cliente: false,
    calificado_x_paseador: false,
  },
  {
    id: 3,
    direccionPickUp: "Direccion 123",
    fecha: "2024-01-01",
    nota: "Nota de servicio",
    cantidad_mascotas: 1,
    aceptado: false,
    comenzado: false,
    finalizado: false,
    calificado_x_cliente: false,
    calificado_x_paseador: false,
  },
  {
    id: 4,
    direccionPickUp: "Direccion 123",
    fecha: "2024-01-01",
    nota: "Nota de servicio",
    cantidad_mascotas: 1,
    aceptado: true,
    comenzado: false,
    finalizado: false,
    calificado_x_cliente: false,
    calificado_x_paseador: false,
  },
  {
    id: 5,
    direccionPickUp: "Direccion 123",
    fecha: "2024-01-01",
    nota: "Nota de servicio",
    cantidad_mascotas: 1,
    aceptado: true,
    comenzado: true,
    finalizado: true,
    calificado_x_cliente: false,
    calificado_x_paseador: true,
  },
];

export default function ServiceListComponent() {
  return (
    <>
      {services.map((service) => (
        <ServiceCard key={service.id} service={service} />
      ))}
    </>
  );
}
