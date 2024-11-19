import { ScrollView, Text } from "react-native";
import { Screen } from "../../src/components/Screen";
import { TurnCard } from "../../src/components/cards/TurnCard";

const turns = [
  {
    id: 1,
    zona: "Zona 1",
    tarifa: 10,
    dias: ["Lunes", "Miercoles", "Viernes"],
    hora_inicio: "10:00",
    hora_fin: "12:00",
  },
  {
    id: 2,
    zona: "Zona 2",
    tarifa: 20,
    dias: ["Lunes", "Viernes"],
    hora_inicio: "15:00",
    hora_fin: "18:00",
  },
  {
    id: 3,
    zona: "Zona 3",
    tarifa: 30,
    dias: ["Martes", "Miercoles", "Jueves"],
    hora_inicio: "09:00",
    hora_fin: "13:00",
  },
  {
    id: 4,
    zona: "Zona 4",
    tarifa: 40,
    dias: ["Lunes", "Miercoles", "Viernes"],
    hora_inicio: "10:00",
    hora_fin: "12:00",
  },
  {
    id: 5,
    zona: "Zona 5",
    tarifa: 50,
    dias: ["Lunes", "Miercoles", "Viernes"],
    hora_inicio: "10:00",
    hora_fin: "12:00",
  },
];

export default function TurnList() {
  return (
    <ScrollView>
      <Screen>
        {turns.map((turn) => (
          <TurnCard key={turn.id} turn={turn} />
        ))}
      </Screen>
    </ScrollView>
  );
}
