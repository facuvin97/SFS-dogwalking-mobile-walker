import { ScrollView } from "react-native";
import { Screen } from "../../src/components/Screen";
import ServiceListComponent from "../../src/components/services/ServiceList";

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
    calificado_x_paseador: true,
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

export default function ServiceList() {
  return (
    <ScrollView>
      <Screen>
        <ServiceListComponent services={services} />
      </Screen>
    </ScrollView>
  );
}
