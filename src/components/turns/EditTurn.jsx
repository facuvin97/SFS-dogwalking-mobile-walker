import React, { useState, useEffect } from "react";
import {
  Text,
  ScrollView,
  View,
  StyleSheet,
  TouchableOpacity,
  Pressable,
  Alert,
  Platform,
} from "react-native";
import { useRouter } from "expo-router";
import { useUserLog } from "../../contexts/UserLogContext";
import { useTurns } from "../../contexts/TurnsContext";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from '@react-native-community/datetimepicker';

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
  const [horaInicio, setHoraInicio] = useState(new Date(`2000-01-01T${turn.hora_inicio}:00`));
  const [horaFin, setHoraFin] = useState(new Date(`2000-01-01T${turn.hora_fin}:00`));
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);
  const [tarifa, setTarifa] = useState(turn.tarifa);
  const [zona, setZona] = useState(turn.zona);
  const router = useRouter();
  const { userLog } = useUserLog();
  const { editTurn } = useTurns();
  const [error, setError] = useState("");

  useEffect(() => {
    const selectedDays = turn.dias.reduce((acc, day) => {
      acc[day] = true;
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

      turn.dias = selectedDays;
      turn.hora_inicio = horaInicio.toTimeString().slice(0, 5);
      turn.hora_fin = horaFin.toTimeString().slice(0, 5);
      turn.tarifa = tarifa;
      turn.zona = zona;

      if (!verify) {
        return;
      }

      const result = await editTurn(turn);

      if (result) {
        Alert.alert(
          "Turno editado",
          "El turno ha sido editado correctamente.",
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

    if (!tarifa || !zona) {
      verify = false;
      setError("Todos los campos son obligatorios");
    }

    if (horaInicio >= horaFin) {
      verify = false;
      setError("La hora de inicio no puede ser mayor que la de fin");
    }

    return verify;
  };

  const onChangeStartTime = (event, selectedDate) => {
    const currentDate = selectedDate || horaInicio;
    setShowStartPicker(Platform.OS === 'ios');
    setHoraInicio(currentDate);
  };

  const onChangeEndTime = (event, selectedDate) => {
    const currentDate = selectedDate || horaFin;
    setShowEndPicker(Platform.OS === 'ios');
    setHoraFin(currentDate);
  };

  if (!userLog) {
    return <Text>Cargando...</Text>;
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Editar turno</Text>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Hora de inicio</Text>
        <TouchableOpacity onPress={() => setShowStartPicker(true)} style={styles.input}>
          <Text>{horaInicio.toTimeString().slice(0, 5)}</Text>
        </TouchableOpacity>
        {showStartPicker && (
          <DateTimePicker
            testID="startTimePicker"
            value={horaInicio}
            mode="time"
            is24Hour={true}
            display="default"
            onChange={onChangeStartTime}
          />
        )}
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Hora de fin</Text>
        <TouchableOpacity onPress={() => setShowEndPicker(true)} style={styles.input}>
          <Text>{horaFin.toTimeString().slice(0, 5)}</Text>
        </TouchableOpacity>
        {showEndPicker && (
          <DateTimePicker
            testID="endTimePicker"
            value={horaFin}
            mode="time"
            is24Hour={true}
            display="default"
            onChange={onChangeEndTime}
          />
        )}
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
  // ... (keep the existing styles)
});

