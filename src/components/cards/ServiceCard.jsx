import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { AntDesign } from "@expo/vector-icons";

const servicePrueba = {
  id: 2,
  direccionPickUp: "Direccion 123",
  fecha: "2024-01-01",
  nota: "Nota de servicio",
  cantidad_mascotas: 1,
  aceptado: true,
  comenzado: true,
  finalizado: true,
  calificado_x_cliente: false,
  calificado_x_paseador: true,
};

export function ServiceCard({ service }) {
  const handleAccept = () => {
    // Lógica para aceptar el servicio
    console.log("Servicio aceptado");
  };

  const handleCancel = () => {
    // Lógica para cancelar el servicio
    console.log("Servicio cancelado");
  };

  const handleDelete = () => {};

  const handleReview = () => {};

  return (
    <View style={styles.card}>
      <Text style={styles.title}>{service.direccionPickUp}</Text>
      <Text style={styles.subtitle}>{service.fecha}</Text>
      <Text style={styles.info}>{service.nota}</Text>
      {!service.calificado_x_paseador && (
        <View style={styles.buttonContainer}>
          {!service.aceptado && (
            <>
              <TouchableOpacity
                onPress={handleCancel}
                style={styles.iconButton}
              >
                <AntDesign name="close" size={24} color="#FF3B30" />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleAccept}
                style={styles.iconButton}
              >
                <AntDesign name="check" size={24} color="#34C759" />
              </TouchableOpacity>
            </>
          )}
          {service.aceptado && !service.comenzado && (
            <>
              <TouchableOpacity
                onPress={handleDelete}
                style={styles.iconButton}
              >
                <AntDesign name="delete" size={24} color="#FF3B30" />
              </TouchableOpacity>
            </>
          )}
          {service.finalizado && !service.calificado_x_paseador && (
            <>
              <TouchableOpacity
                onPress={handleReview}
                style={styles.iconButton}
              >
                <AntDesign name="form" size={24} color="#000" />
              </TouchableOpacity>
            </>
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 8,
    padding: 16,
    margin: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    maxWidth: 300,
    alignItems: "center",
    width: "100%",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#333",
  },
  subtitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 5,
    color: "#555",
  },
  info: {
    fontSize: 18,
    marginBottom: 4,
    color: "#666",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
    width: "100%",
    marginTop: 16,
  },
  iconButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: "#F2F2F7",
  },
});
