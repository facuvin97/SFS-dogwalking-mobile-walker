import { useEffect, useState } from "react";
import { useTurns } from "../../contexts/TurnsContext";
import { FlatList, StyleSheet, Text, View } from "react-native";

export default function TodayTurns() {
  const { turns } = useTurns();
  const [todayTurns, setTodayTurns] = useState([]);

  useEffect(() => {
    if (!turns) {
      return;
    }
    // Array predefinido de los días en español sin tildes
    const days = [
      "domingo",
      "lunes",
      "martes",
      "miercoles",
      "jueves",
      "viernes",
      "sabado",
    ];

    // Obtén el día actual usando `getDay` (devuelve un índice del 0 al 6)
    const today = new Date().getDay();

    // El día de hoy según tu array predefinido
    const todayName = days[today];
    console.log("todayName", todayName);

    console.log("turns", turns);
    // Filtra los turnos que incluyen el día de hoy
    const filteredTurns = turns.filter((turn) => turn.dias.includes(todayName));

    // Ordena los turnos por hora_inicio
    filteredTurns.sort((a, b) => {
      const timeA = new Date(`1970-01-01T${a.hora_inicio}Z`);
      const timeB = new Date(`1970-01-01T${b.hora_inicio}Z`);
      return timeA - timeB;
    });

    // Actualiza el estado con los turnos filtrados y ordenados
    setTodayTurns(filteredTurns);
  }, [turns]);

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>
        Turnos de hoy (
        {new Date().toLocaleDateString("es-ES", { weekday: "long" })})
      </Text>
      {todayTurns.length === 0 ? (
        <Text style={styles.noTurnsMessage}>
          No hay turnos programados para hoy.
        </Text>
      ) : (
        <View style={styles.turnListContainer}>
          <FlatList
            data={todayTurns}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <View style={styles.turnItem}>
                <Text style={styles.label}>
                  <Text style={styles.labelTitle}>Zona:</Text> {item.zona}
                </Text>
                <Text style={styles.label}>
                  <Text style={styles.labelTitle}>Hora:</Text>{" "}
                  {item.hora_inicio} - {item.hora_fin}
                </Text>
                <Text style={styles.label}>
                  <Text style={styles.labelTitle}>Tarifa:</Text> ${item.tarifa}
                </Text>
                <Text style={styles.servicesLabel}>
                  <Text style={styles.labelTitle}>Servicios agendados: </Text>
                  {item.Services.length}
                </Text>
              </View>
            )}
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    width: "100%",
    alignItems: "center",
  },
  turnListContainer: {
    width: "100%",
    maxHeight: 300,
    overflow: "scroll",
    alignContent: "center",
  },
  heading: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  turnItem: {
    backgroundColor: "#ffffff",
    alignItems: "center",
    padding: 15,
    marginBottom: 10,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
  },
  labelTitle: {
    fontWeight: "bold",
  },
  noTurnsMessage: {
    fontSize: 16,
    fontStyle: "italic",
    color: "#888",
    marginTop: 20,
  },
  servicesLabel: {
    fontSize: 16,
    marginBottom: 5,
    textDecorationLine: "underline",
    fontWeight: "bold",
  },
});
