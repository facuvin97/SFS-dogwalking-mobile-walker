import { useEffect, useState } from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View,
  FlatList,
} from "react-native";
import globalConstants from "../../const/globalConstants";
import { getToken } from "../../utils/authStorage";
import StarRating from "./StarRating";

export default function WalkerProfile({ walkerId }) {
  const [walker, setWalker] = useState(null);
  const [uriImage, setUriImage] = useState(null);
  const [urlPhotos, setUrlPhotos] = useState([]);

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

      console.log("urlImages:", urlPhotos);
      console.log("data:", data.body.User.foto);
      setWalker(data.body);
      setUriImage(urlImage);
    };
    const cargarImagenes = async () => {
      const urlImages = walker.fotos.map((foto) => {
        return "http://192.168.1.3:3001/images/" + foto.url;
      });
      setUrlPhotos(urlImages);
    };

    fetchWalker();
    cargarImagenes();
  }, [walkerId]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image source={{ uri: uriImage }} style={styles.profilePicture} />
        <View style={styles.userInfo}>
          <Text style={styles.username}>{walker?.User.nombre_usuario}</Text>
          <StarRating rating={walker?.User.calificacion} />
        </View>
      </View>
      <Text style={styles.galleryTitle}>Fotos del Perfil</Text>
      <View style={styles.gallery}>
        <ScrollView horizontal>
          {urlPhotos.map((photo, index) => (
            <Image key={index} source={{ uri: photo }} style={styles.image} />
          ))}
        </ScrollView>
      </View>
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
  galleryTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  gallery: {
    height: 300,
    marginBottom: 20,
  },
  image: {
    width: 200,
    height: 200,
    marginRight: 10,
  },
});
