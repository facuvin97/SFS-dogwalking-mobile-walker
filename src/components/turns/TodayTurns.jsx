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
import { useServices } from "../../contexts/ServicesContext";
import TodayTurnCard from "../cards/TodayTurnCard";

export default function TodayTurns() {
  const { turns } = useTurns();
  const [todayTurns, setTodayTurns] = useState([]);
  const { confirmedServices } = useServices();
  const shakeAnimation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!turns) {
      return;
    }
    const days = ["domingo", "lunes", "martes", "miercoles", "jueves", "viernes", "sabado"];
    const today = new Date().getDay();
    const todayName = days[today];

    // filtro los turnos que tengan el día actual
    const filteredTurns = turns.filter((turn) => turn.dias.includes(todayName));

    // ordeno los turnos por hora de inicio
    filteredTurns.sort((a, b) => {
      const timeA = new Date(`1970-01-01T${a.hora_inicio}Z`);
      const timeB = new Date(`1970-01-01T${b.hora_inicio}Z`);
      return timeA - timeB;
    });

    // obtengo la fecha actual en fomrato yyyy-MM-dd
    const formattedToday = new Date();
    // le resto 3 horas a formattedToday
    formattedToday.setHours(formattedToday.getHours() - 3);
    const finalToday = formattedToday.toISOString().split("T")[0];

    // filtro los turnos que tengan servicios aceptados y que sean para la fecha actual
    const turnsWithAcceptedServices = filteredTurns.map((turn) => ({
      ...turn,
      Services: turn.Services.filter((service) => service.aceptado && service.fecha.includes(finalToday)),
    }));

    setTodayTurns(turnsWithAcceptedServices);
  }, [turns]);

  useEffect(() => {
  }, [confirmedServices]);

  const shakeItem = () => {
    Animated.sequence([
      Animated.timing(shakeAnimation, { toValue: 10, duration: 100, useNativeDriver: true }),
      Animated.timing(shakeAnimation, { toValue: -10, duration: 100, useNativeDriver: true }),
      Animated.timing(shakeAnimation, { toValue: 10, duration: 100, useNativeDriver: true }),
      Animated.timing(shakeAnimation, { toValue: 0, duration: 100, useNativeDriver: true })
    ]).start();
  };

  const handlePress = (item) => {
    // obtengo la fecha actual en fomrato yyyy-MM-dd
    const formattedToday = new Date();
    // le resto 3 horas a formattedToday
    formattedToday.setHours(formattedToday.getHours() - 3);
    const finalToday = formattedToday.toISOString().split("T")[0];

    const serviciosAgendados = confirmedServices.filter((service) => service.TurnId === item.id && service.fecha === finalToday);
    if (serviciosAgendados.length > 0) {
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
        <TodayTurnCard item={item} />
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
    alignContent: "center",
    padding: 10,
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

