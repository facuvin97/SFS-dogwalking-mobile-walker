import React, { useState } from 'react';
import {
  Text,
  ScrollView,
  View,
  StyleSheet,
  TouchableOpacity,
  Pressable,
  Platform,
  TextInput,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useUserLog } from '../../contexts/UserLogContext';
import { useTurns } from '../../contexts/TurnsContext';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';

export function AddTurnForm() {
  const [dias, setDias] = useState({
    lunes: false,
    martes: false,
    miercoles: false,
    jueves: false,
    viernes: false,
    sabado: false,
    domingo: false,
  });
  const [horaInicio, setHoraInicio] = useState(new Date());
  const [horaFin, setHoraFin] = useState(new Date());
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);
  const [tarifa, setTarifa] = useState('');
  const [zona, setZona] = useState('');
  const router = useRouter();
  const { userLog } = useUserLog();
  const { addTurn } = useTurns();
  const [error, setError] = useState('');

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

      if (!verify) {
        return;
      }

      const turn = {
        dias: selectedDays,
        hora_inicio: horaInicio.toTimeString().slice(0, 5),
        hora_fin: horaFin.toTimeString().slice(0, 5),
        tarifa,
        zona,
        WalkerId: userLog.id,
      };

      const result = await addTurn(turn);

      if (result) {
        router.back();
      }
    } catch (error) {
      setError(error.message);
      console.error('Error al crear el turno:', error.message);
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
      setError('Debe seleccionar al menos un día de la semana\n');
    }

    if (!tarifa || !zona) {
      verify = false;
      setError('Todos los campos son obligatorios');
    }

    if (horaInicio >= horaFin) {
      verify = false;
      setError('La hora de inicio no puede ser mayor que la de fin');
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
      <Text style={styles.title}>Agregar turno</Text>

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
        <Text style={styles.buttonText}>Agregar</Text>
      </TouchableOpacity>
      {error && <Text style={styles.error}>{error}</Text>}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
    width: '100%',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  inputContainer: {
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
    borderRadius: 5,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  daysContainer: {
    marginBottom: 15,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#007AFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  checkboxChecked: {
    backgroundColor: '#007AFF',
  },
  checkboxLabel: {
    fontSize: 16,
    color: '#333',
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  error: {
    color: 'red',
    fontSize: 16,
    marginTop: 10,
  },
});
