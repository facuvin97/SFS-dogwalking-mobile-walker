import React, { useState } from "react";
import {
  Text,
  TextInput,
  ScrollView,
  View,
  StyleSheet,
  TouchableOpacity,
  Pressable,
  ActivityIndicator,
} from "react-native";
import { Link, useRouter } from "expo-router";
import { Screen } from "../Screen";
import { useUserLog } from "../../contexts/UserLogContext";
import { useTurns } from "../../contexts/TurnsContext";

export function AddTurnForm() {
  const [dias, setDias] = useState([]);
  const [horaInicio, setHoraInicio] = useState("");
  const [horaFin, setHoraFin] = useState("");
  const [tarifa, setTarifa] = useState("");
  const [zona, setZona] = useState("");
  const router = useRouter();
  const { userLog } = useUserLog();
  const { addTurn } = useTurns();

  const handleSubmit = async () => {
    try {
      // creo el turno en una constante
      const turn = {
        dias,
        hora_inicio: horaInicio,
        hora_fin: horaFin,
        tarifa,
        zona,
        WalkerId: userLog.id,
      };

      // uso la operacion add turn del contexto
      await addTurn(turn);

      router.back();
    } catch (error) {
      console.error("Error al crear el turno:", error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Agregar turno</Text>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Tarifa</Text>
        <TextInput
          style={styles.input}
          value={tarifa}
          onChangeText={setTarifa}
          placeholder="Ingrese la tarifa"
          inputMode="numeric"
          keyboardType="numeric"
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Zona</Text>
        <TextInput
          style={styles.input}
          value={zona}
          onChangeText={setZona}
          placeholder="Ingrese una zona"
        />
      </View>

      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Agregar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: "#f5f5f5",
    width: "100%",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  inputContainer: {
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    color: "#333",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 10,
    borderRadius: 5,
    fontSize: 16,
    backgroundColor: "#fff",
  },
  dateButton: {
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 10,
    borderRadius: 5,
    backgroundColor: "#fff",
  },
  button: {
    backgroundColor: "#007AFF",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 20,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});
