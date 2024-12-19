import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useUserLog } from "../../contexts/UserLogContext";
import { useEffect, useState } from "react";
import { getToken } from "../../utils/authStorage";
import globalConstants from "../../const/globalConstants";
import Ionicons from "@expo/vector-icons/Ionicons";

export default function EditProfile() {
  const { userLog } = useUserLog();
  const [newPassword, setNewPassword] = useState("");
  const [hideNewPassword, setHideNewPassword] = useState(true);
  const [password, setPassword] = useState("");
  const [hidePassword, setHidePassword] = useState(true);
  const [direccion, setDireccion] = useState(userLog.direccion);
  const [telefono, setTelefono] = useState(userLog.telefono);
  const [email, setEmail] = useState(userLog.email);

  const handleSubmit = async () => {
    try {
      var apiUrl;
      const token = await getToken();
      // fetch en caso de no tener nueva contraseña
      if (!newPassword) {
        apiUrl = `${globalConstants.URL_BASE}/users/${userLog.id}`;
        const response = await fetch(apiUrl, {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            direccion: direccion,
            telefono: telefono,
            email: email,
          }),
        });
        const data = await response.json();
        if (!data.ok) {
          throw new Error(`Error al modificar la información: ${data.message}`);
        }
      } else {
        apiUrl = `${globalConstants.URL_BASE}/users/password/${userLog.id}`;
        //fetch en caso de tener nueva contraseña
        const response = await fetch(apiUrl, {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            direccion: direccion,
            telefono: telefono,
            email: email,
            contraseña: password,
            newContraseña: newPassword,
          }),
        });
        const data = await response.json();
        if (!data.ok) {
          throw new Error(`Error al modificar la información: ${data.message}`);
        }
      }
    } catch (error) {
      console.error(error);
      alert(error.message);
    }
  };

  return (
    <>
      <Text style={styles.title}>Editar Informacion de Usuario</Text>

      <Text style={styles.subtitle}>{userLog.nombre_usuario}</Text>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Nueva Contraseña (opcional)</Text>
        <View style={styles.inputWithIcon}>
          <TextInput
            style={styles.input}
            value={newPassword}
            onChangeText={setNewPassword}
            placeholder="Ingrese su nueva contraseña"
            secureTextEntry={hideNewPassword}
          />
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => setHideNewPassword(!hideNewPassword)}
          >
            <Ionicons
              name={hideNewPassword ? "eye" : "eye-off"}
              size={24}
              color="gray"
            />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Contraseña Actual</Text>
        <View style={styles.inputWithIcon}>
          <TextInput
            style={[
              styles.input,
              !newPassword && { backgroundColor: "#e0e0e0" }, // Color de fondo para indicar que está deshabilitado
            ]}
            value={password}
            onChangeText={setPassword}
            secureTextEntry={hidePassword}
            editable={!!newPassword}
          />
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => setHidePassword(!hidePassword)}
          >
            <Ionicons
              name={hidePassword ? "eye" : "eye-off"}
              size={24}
              color="gray"
            />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Dirección</Text>
        <TextInput
          style={styles.input}
          value={direccion}
          onChangeText={setDireccion}
          placeholder="Ingrese su dirección"
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>E-Mail</Text>
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          placeholder="Ingrese su correo electrónico"
          keyboardType="email-address"
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Teléfono</Text>
        <TextInput
          style={styles.input}
          value={telefono}
          onChangeText={setTelefono}
          placeholder="Ingrese su número de teléfono"
          keyboardType="phone-pad"
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Fecha de Nacimiento</Text>
        <Text style={{ fontSize: 16 }}> {userLog.fecha_nacimiento}</Text>
      </View>

      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Modificar</Text>
      </TouchableOpacity>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  inputContainer: {
    marginBottom: 15,
    width: "95%",
  },
  label: {
    fontSize: 18,
    marginBottom: 5,
    color: "#333",
    fontWeight: "bold",
  },
  input: {
    flex: 1,
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
  inputWithIcon: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  iconButton: {
    padding: 10, // Espaciado interno para que el ícono tenga buen tamaño
    justifyContent: "center",
    alignItems: "center",
  },
});
