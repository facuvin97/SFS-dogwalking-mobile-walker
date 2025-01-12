import React, { useEffect, useState, useRef, useCallback } from "react";
import { useTurns } from "../../contexts/TurnsContext";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Animated,
  Vibration
} from "react-native";
import { router } from "expo-router";

export default function TodayTurns() {
  const { turns } = useTurns();
  const [todayTurns, setTodayTurns] = useState([]);
  const shakeAnimation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!turns) {
      return;
    }
    const days = ["domingo", "lunes", "martes", "miercoles", "jueves", "viernes", "sabado"];
    const today = new Date().getDay();
    const todayName = days[today];

    const filteredTurns = turns.filter((turn) => turn.dias.includes(todayName));
    filteredTurns.sort((a, b) => {
      const timeA = new Date(`1970-01-01T${a.hora_inicio}Z`);
      const timeB = new Date(`1970-01-01T${b.hora_inicio}Z`);
      return timeA - timeB;
    });

    const turnsWithAcceptedServices = filteredTurns.map((turn) => ({
      ...turn,
      Services: turn.Services.filter((service) => service.aceptado),
    }));

    console.log("turnsWithAcceptedServices", turnsWithAcceptedServices);
    setTodayTurns(turnsWithAcceptedServices);
  }, [turns]);

  const shakeItem = () => {
    Animated.sequence([
      Animated.timing(shakeAnimation, { toValue: 10, duration: 100, useNativeDriver: true }),
      Animated.timing(shakeAnimation, { toValue: -10, duration: 100, useNativeDriver: true }),
      Animated.timing(shakeAnimation, { toValue: 10, duration: 100, useNativeDriver: true }),
      Animated.timing(shakeAnimation, { toValue: 0, duration: 100, useNativeDriver: true })
    ]).start();
  };

  const handlePress = (item) => {
    if (item.Services && item.Services.length > 0) {
      router.push(`/current-turn-services/${item.id}`);
    } else {
      vibration({ item });
      shakeItem();
    }
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity onPress={() => handlePress(item)}>
      <Animated.View
        style={[
          styles.turnItem,
          {
            transform: [{ translateX: shakeAnimation }]
          }
        ]}
      >
        <Text style={styles.label}>
          <Text style={styles.labelTitle}>Zona:</Text> {item.zona}
        </Text>
        <Text style={styles.label}>
          <Text style={styles.labelTitle}>Hora:</Text> {item.hora_inicio} - {item.hora_fin}
        </Text>
        <Text style={styles.label}>
          <Text style={styles.labelTitle}>Tarifa:</Text> ${item.tarifa}
        </Text>
        <Text style={styles.servicesLabel}>
          <Text style={styles.labelTitle}>Servicios agendados: </Text>
          {item.Services ? item.Services.length : 0}
        </Text>
      </Animated.View>
    </TouchableOpacity>
  );
  const vibration = useCallback(({ item }) => {
    Vibration.vibrate(400);
  }, []);


  return (
    <View style={styles.container}>
      <Text style={styles.heading}>
        Turnos de hoy ({new Date().toLocaleDateString("es-ES", { weekday: "long" })})
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
            renderItem={renderItem}
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

