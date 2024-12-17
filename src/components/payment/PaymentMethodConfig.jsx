import React, { use, useState } from "react";
import { Text, View, Switch, TouchableOpacity, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useUserLog } from "../../contexts/UserLogContext";
import globalConstants from "../../const/globalConstants";

export default function PaymentMethodConfig() {
  const { userLog } = useUserLog();
  const [isCashEnabled, setIsCashEnabled] = useState(userLog.efectivo);
  const [isMercadoPagoEnabled, setIsMercadoPagoEnabled] = useState(
    userLog.mercadopago,
  );
  const navigation = useNavigation();

  const toggleCash = () => setIsCashEnabled((prevState) => !prevState);
  const toggleMercadoPago = () =>
    setIsMercadoPagoEnabled((prevState) => !prevState);

  const handleNavigate = () => {
    navigation.navigate(
      `https://auth.mercadopago.com.uy/authorization?client_id=${globalConstants.MP_APP_ID}&response_type=code&platform_id=mp&state=${userLog.nombre_usuario}&redirect_uri=${globalConstants.MP_SUCCESS_URL}`,
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.switchContainer}>
        <Text style={styles.label}>Efectivo</Text>
        <Switch value={isCashEnabled} onValueChange={toggleCash} />
      </View>
      <View style={styles.switchContainer}>
        <Text style={styles.label}>Mercado Pago</Text>
        <Switch
          value={isMercadoPagoEnabled}
          onValueChange={toggleMercadoPago}
          disabled={!userLog.refresh_token}
        />
      </View>
      {!userLog.refresh_token && (
        <TouchableOpacity style={styles.button} onPress={handleNavigate}>
          <Text style={styles.buttonText}>Asociar cuenta de MercadoPago</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    justifyContent: "flex-start",
  },
  switchContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    color: "#333",
  },
  button: {
    backgroundColor: "#007BFF",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
