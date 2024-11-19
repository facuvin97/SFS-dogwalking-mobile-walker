import { Text, TouchableOpacity } from "react-native";
import { Screen } from "./Screen";
import { removeToken } from "../utils/authStorage";
import { TurnCard } from "./cards/TurnCard";
import { ServiceCard } from "./cards/ServiceCard";
import { Link } from "expo-router";

export function Main() {
  const handleLogout = async () => {
    await removeToken();
  };

  return (
    <Screen>
      <TouchableOpacity onPress={handleLogout}>
        <Text>Remove token</Text>
      </TouchableOpacity>
      <Link href="/serviceList">
        <Text>Servvices</Text>
      </Link>
    </Screen>
  );
}
