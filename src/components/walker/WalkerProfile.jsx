import { useEffect, useState } from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View,
  FlatList,
  Pressable,
  Modal,
  TouchableOpacity,
} from "react-native";
import globalConstants from "../../const/globalConstants";
import { getToken } from "../../utils/authStorage";
import StarRating from "./StarRating";
import Efectivo from "../../assets/efectivo.png";
import MercadoPago from "../../assets/mercadopago.png";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import { AntDesign } from "@expo/vector-icons";

export default function WalkerProfile({ walkerId }) {
  const [walker, setWalker] = useState(null);
  const [uriImage, setUriImage] = useState(null);
  const [urlPhotos, setUrlPhotos] = useState([]);
  const [modalVisible, setModalVisible] = useState(false); // Controla el modal
  const router = useRouter();

  useEffect(() => {
    const fetchWalker = async () => {
      const apiUrl = `${globalConstants.URL_BASE}/walkers/${walkerId}`;
      const token = await getToken();
      const response = await fetch(apiUrl, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      const urlImage = "http://192.168.1.3:3001/images/" + data.body.User.foto;

      console.log("data:", data.body.User.foto);
      setWalker(data.body);
      setUriImage(urlImage);
    };

    if (!walker) {
      fetchWalker();
    }
  }, [walker, walkerId]);

  useEffect(() => {
    const cargarImagenes = async () => {
      const urlImages = walker.fotos.map((foto) => {
        return "http://192.168.1.3:3001/images/" + foto.url;
      });
      setUrlPhotos(urlImages);
      console.log("urlImages:", urlPhotos);
    };

    if (walker) {
      cargarImagenes();
    }
  }, [walker]);

  const handleSelectPhoto = async () => {
    console.log("handleSelectPhoto");
    // Paso 1: Solicitar permisos
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permissionResult.granted) {
      alert("Se necesita permiso para acceder a las fotos.");
      return;
    }

    // Paso 2: Abrir la galería
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true, // Permitir recortar la imagen
      quality: 1,
    });

    if (!result.canceled) {
      const localUri = result.assets[0].uri;

      // Paso 3: Crear FormData y subir la foto
      const formData = new FormData();
      formData.append("imagenPerfil", {
        uri: localUri,
        name: "profile.jpg", // Nombre del archivo
        type: "image/jpeg", // Tipo MIME
      });

      try {
        const token = await getToken();
        const username = walker?.User.nombre_usuario;

        const response = await fetch(
          `${globalConstants.URL_BASE}/image/single/${username}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${token}`, // Si tu API requiere autenticación
            },
            body: formData,
          },
        );

        const data = await response.json();
        if (data.ok) {
          alert("Imagen de perfil actualizada exitosamente");
          setUriImage(localUri); // Actualiza la imagen de perfil localmente
        } else {
          alert("Error al actualizar la imagen: " + data.message);
        }
      } catch (error) {
        console.error("Error al subir la imagen:", error);
        alert("Error al subir la imagen. Por favor, inténtalo de nuevo.");
      }
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => setModalVisible(true)}>
          <Image source={{ uri: uriImage }} style={styles.profilePicture} />
        </Pressable>
        <View style={styles.userInfo}>
          <Text style={styles.username}>{walker?.User.nombre_usuario}</Text>
          <StarRating rating={walker?.User.calificacion} />
        </View>
      </View>
      <View style={styles.userInfo}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Text style={styles.title}>Métodos de pago</Text>
          <TouchableOpacity onPress={() => router.push("/payment-config")}>
            <AntDesign name="edit" size={24} />
          </TouchableOpacity>
        </View>

        <View style={styles.payMethodsContainer}>
          {walker?.efectivo && <Image source={Efectivo} style={styles.icon} />}
          {walker?.mercadopago && (
            <Image source={MercadoPago} style={styles.icon} />
          )}
        </View>
      </View>

      <Text style={styles.title}>Fotos del Perfil</Text>
      <View style={styles.gallery}>
        <ScrollView horizontal>
          {urlPhotos.map((photo, index) => (
            <Image key={index} source={{ uri: photo }} style={styles.image} />
          ))}
        </ScrollView>
      </View>

      {/* Modal */}
      <Modal
        transparent={true}
        visible={modalVisible}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Cambiar foto de perfil</Text>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={handleSelectPhoto}
            >
              <Text style={styles.modalButtonText}>Seleccionar nueva foto</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.modalButton, { backgroundColor: "#ddd" }]}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.modalButtonText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f5f5f5",
    width: "100%",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  profilePicture: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginRight: 20,
  },
  userInfo: {
    flex: 1,
  },
  username: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 5,
  },
  payMethodsContainer: {
    flexDirection: "row",
    marginBottom: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    marginRight: 10,
  },
  gallery: {
    height: 300,
    marginBottom: 20,
  },
  image: {
    width: 200,
    height: 200,
    marginRight: 10,
    objectFit: "contain",
  },
  icon: {
    width: 70,
    height: 70,
    marginRight: 30,
    objectFit: "contain",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 20,
  },
  modalButton: {
    backgroundColor: "#2196F3",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  modalButtonText: {
    color: "white",
    textAlign: "center",
    fontWeight: "bold",
  },
});
