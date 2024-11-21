import { Text, TouchableOpacity } from "react-native";
import { Screen } from "./Screen";
import { removeToken } from "../utils/authStorage";
import { TurnCard } from "./cards/TurnCard";
import { ServiceCard } from "./cards/ServiceCard";
import { Link } from "expo-router";
import { useServices } from "../contexts/ServicesContext";
import { useTurns } from "../contexts/TurnsContext";

export function Main() {
  const { fetchNextServices, fetchFinishedServices } = useServices();
  const { fetchTurns } = useTurns();

  const handleLogout = async () => {
    await removeToken();
  };

  //ejecutar contexto de servicios
  const handleEject = async () => {
    fetchTurns();
  };

  return (
    <Screen>
      <TouchableOpacity onPress={handleLogout}>
        <Text>Remove token</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={handleEject}>
        <Text>Ejecutar servicios</Text>
      </TouchableOpacity>
      <Link href="/serviceList">
        <Text>Servvices</Text>
      </Link>
    </Screen>
  );
}
