import React, { useState, useEffect } from "react";
import {
  Text,
  TextInput,
  ScrollView,
  View,
  StyleSheet,
  TouchableOpacity,
  Pressable,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { useUserLog } from "../../contexts/UserLogContext";
import { useTurns } from "../../contexts/TurnsContext";
import { Ionicons } from "@expo/vector-icons";

export function EditTurnForm({ turn }) {
  const [dias, setDias] = useState({
    lunes: false,
    martes: false,
    miercoles: false,
    jueves: false,
    viernes: false,
    sabado: false,
    domingo: false,
  });
  const [horaInicio, setHoraInicio] = useState(turn.hora_inicio);
  const [horaFin, setHoraFin] = useState(turn.hora_fin);
  const [tarifa, setTarifa] = useState(turn.tarifa);
  const [zona, setZona] = useState(turn.zona);
  const router = useRouter();
  const { userLog } = useUserLog();
  const { editTurn } = useTurns();
  const [error, setError] = useState("");

  // Establecer los días iniciales cuando el componente se monta
  useEffect(() => {
    const selectedDays = turn.dias.reduce((acc, day) => {
      acc[day] = true; // Marca los días correspondientes como true
      return acc;
    }, {});
    setDias((prevDias) => ({ ...prevDias, ...selectedDays }));
  }, [turn.dias]);

  const handleDayToggle = (day) => {
    setDias((prevDias) => ({
      ...prevDias,
      [day]: !prevDias[day],
    }));
  };

  const handleSubmit = async () => {
    try {
      const selectedDays = Object.keys(dias).filter((day) => dias[day]);

      const verify = verifyTurn();

      // actualizo los datos del turno
      turn.dias = selectedDays;
      turn.hora_inicio = horaInicio;
      turn.hora_fin = horaFin;
      turn.tarifa = tarifa;
      turn.zona = zona;

      if (!verify) {
        return;
      }

      const result = await editTurn(turn);

      if (result) {
        Alert.alert(
          "Turno editado", // Título
          "El turno ha sido editado correctamente.", // Mensaje
          [{ text: "Aceptar", onPress: () => router.back() }],
          { cancelable: false },
        );
      }
    } catch (error) {
      setError(error.message);
      console.error("Error al editar el turno:", error.message);
    }
  };

  const verifyTurn = () => {
    let verify = true;
    setError(null);
    if (
      !dias.lunes &&
      !dias.martes &&
      !dias.miercoles &&
      !dias.jueves &&
      !dias.viernes &&
      !dias.sabado &&
      !dias.domingo
    ) {
      verify = false;
      setError("Debe seleccionar al menos un día de la semana\n");
    }

    if (!horaInicio || !horaFin || !tarifa || !zona) {
      verify = false;
      setError("Todos los campos son obligatorios");
    }

    // convierto las horas a fechas para compararlas
    const fechainicio = new Date();
    const fechaFin = new Date();
    fechainicio.setHours(horaInicio.split(":")[0]);
    fechainicio.setMinutes(horaInicio.split(":")[1]);
    fechaFin.setHours(horaFin.split(":")[0]);
    fechaFin.setMinutes(horaFin.split(":")[1]);

    if (fechainicio >= fechaFin) {
      verify = false;
      setError("La hora de inicio no puede ser mayor que la de fin");
    }

    return verify;
  };

  if (!userLog) {
    return <Text>Cargando...</Text>;
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Editar turno</Text>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Hora de inicio</Text>
        <TextInput
          style={styles.input}
          value={horaInicio}
          onChangeText={setHoraInicio}
          placeholder="HH:MM"
          keyboardType="numbers-and-punctuation"
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Hora de fin</Text>
        <TextInput
          style={styles.input}
          value={horaFin}
          onChangeText={setHoraFin}
          placeholder="HH:MM"
          keyboardType="numbers-and-punctuation"
        />
      </View>

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

      <View style={styles.daysContainer}>
        <Text style={styles.label}>Días de la semana</Text>
        {Object.keys(dias).map((day) => (
          <Pressable
            key={day}
            style={styles.checkboxContainer}
            onPress={() => handleDayToggle(day)}
            accessibilityRole="checkbox"
            accessibilityState={{ checked: dias[day] }}
          >
            <View
              style={[styles.checkbox, dias[day] && styles.checkboxChecked]}
            >
              {dias[day] && (
                <Ionicons name="checkmark" size={18} color="white" />
              )}
            </View>
            <Text style={styles.checkboxLabel}>
              {day.charAt(0).toUpperCase() + day.slice(1)}
            </Text>
          </Pressable>
        ))}
      </View>

      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Editar</Text>
      </TouchableOpacity>
      {error && <Text style={styles.error}>{error}</Text>}
    </ScrollView>
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
  daysContainer: {
    marginBottom: 15,
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 5,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: "#007AFF",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  checkboxChecked: {
    backgroundColor: "#007AFF",
  },
  checkboxLabel: {
    fontSize: 16,
    color: "#333",
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
  error: {
    color: "red",
    fontSize: 16,
    marginTop: 10,
  },
});
